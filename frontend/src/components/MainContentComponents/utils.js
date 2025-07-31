// utils.js - Utility functions for file processing and other operations

// File reading functions
export const readTextFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read text file'));
    reader.readAsText(file, 'UTF-8');
  });
};

export const readPDFFile = async (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Load PDF.js from CDN
      if (!window.pdfjsLib) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        document.head.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
        
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
      }

      resolve(fullText.trim());
    } catch (error) {
      reject(new Error('Failed to read PDF file. Please ensure it contains selectable text.'));
    }
  });
};

export const readDocxFile = async (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Load mammoth.js from CDN
      if (!window.mammoth) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.2/mammoth.browser.min.js';
        document.head.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      const arrayBuffer = await file.arrayBuffer();
      const result = await window.mammoth.extractRawText({ arrayBuffer });
      
      if (result.value) {
        resolve(result.value);
      } else {
        throw new Error('No text found in document');
      }
    } catch (error) {
      reject(new Error('Failed to read Word document. Please ensure it\'s a valid .docx file.'));
    }
  });
};

export const readRTFFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const rtfContent = e.target.result;
        // Basic RTF text extraction
        let text = rtfContent;
        
        // Remove RTF control words and formatting
        text = text.replace(/\\([a-z]{1,32})(-?\d{1,10})?[ ]?/g, '');
        text = text.replace(/[{}]/g, '');
        text = text.replace(/\\\\/g, '\\');
        text = text.replace(/\\;/g, ';');
        
        // Clean up extra whitespace
        text = text.replace(/\s+/g, ' ').trim();
        
        // Remove remaining RTF artifacts
        text = text.replace(/^rtf\d+/i, '');
        
        if (text.length > 10) {
          resolve(text);
        } else {
          reject(new Error('No readable text found in RTF file'));
        }
      } catch (error) {
        reject(new Error('Failed to parse RTF file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read RTF file'));
    reader.readAsText(file, 'UTF-8');
  });
};

// File validation utilities
export const validateFileSize = (file, maxSizeMB = 10) => {
  const maxSize = maxSizeMB * 1024 * 1024;
  return file.size <= maxSize;
};

export const validateFileType = (file, allowedTypes = ['.txt', '.docx', '.pdf', '.rtf']) => {
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  return allowedTypes.includes(fileExtension);
};

export const getFileExtension = (filename) => {
  return '.' + filename.split('.').pop().toLowerCase();
};

// Text processing utilities
export const truncateText = (text, maxLength = 50000) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '\n\n[Text truncated to ' + maxLength.toLocaleString() + ' characters]';
  }
  return text;
};

export const getWordCount = (text) => {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
};

export const getCharacterCount = (text) => {
  return text.length;
};

// File processing main function
export const processFile = async (file) => {
  // Validate file size
  if (!validateFileSize(file)) {
    throw new Error('File too large. Maximum size is 10MB.');
  }

  // Validate file type
  if (!validateFileType(file)) {
    throw new Error('Unsupported file type. Please upload .txt, .docx, .pdf, or .rtf files.');
  }

  const fileExtension = getFileExtension(file.name);
  let extractedText = '';

  // Process based on file type
  if (fileExtension === '.txt') {
    extractedText = await readTextFile(file);
  } else if (fileExtension === '.pdf') {
    extractedText = await readPDFFile(file);
  } else if (fileExtension === '.docx') {
    extractedText = await readDocxFile(file);
  } else if (fileExtension === '.rtf') {
    extractedText = await readRTFFile(file);
  }

  if (!extractedText.trim()) {
    throw new Error('No readable text found in the file');
  }

  // Truncate if too long
  extractedText = truncateText(extractedText);

  return {
    text: extractedText,
    wordCount: getWordCount(extractedText),
    characterCount: getCharacterCount(extractedText),
    fileName: file.name,
    fileSize: file.size
  };
};

// API utilities
export const API_BASE_URL = "http://localhost:8000";

export const humanizeText = async (text) => {
  const response = await fetch(`${API_BASE_URL}/humanize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

// Clipboard utilities
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text:', err);
    return false;
  }
};

export const pasteFromClipboard = async () => {
  try {
    return await navigator.clipboard.readText();
  } catch (err) {
    console.log('Failed to read clipboard contents: ', err);
    return '';
  }
};

// Download utilities
export const downloadText = (text, filename = 'humanized.txt') => {
  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

// Tips data
export const tips = [
  {
    title: "Write Clear Text",
    description: "Use simple, straightforward language for the best humanization results",
    icon: "✍️"
  },
  {
    title: "Choose the Right Mode",
    description: "Enhanced for formal content, Creative for marketing, Standard for general use",
    icon: "⚙️"
  },
  {
    title: "Review Output",
    description: "Always check the humanized text to ensure it maintains your intended meaning",
    icon: "👀"
  },
  {
    title: "Optimal Length",
    description: "Works best with 50-2000 words. Longer texts may need to be split",
    icon: "📏"
  },
  {
    title: "File Upload Privacy",
    description: "Files are processed locally in your browser - no data is sent to external servers for text extraction",
    icon: "🔒"
  },
  {
    title: "Context Matters",
    description: "Provide context in your text for more accurate humanization",
    icon: "🎯"
  }
];

// Sample text
export const SAMPLE_TEXT = "AI-generated content has become increasingly sophisticated in recent years, with models capable of producing high-quality text across various domains. However, there remains a need to ensure that such content maintains a natural, human-like quality that resonates with readers and passes detection systems.";

// Mode options
export const MODES = ['Enhanced', 'Standard', 'Creative'];