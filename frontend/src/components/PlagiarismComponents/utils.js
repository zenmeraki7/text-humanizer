// utils.js - Utility functions for PlagiarismRemover component

// Constants
export const MODES = ['Academic', 'Creative', 'Professional', 'Casual'];

export const SAMPLE_TEXT = "Climate change represents one of the most significant challenges facing humanity in the 21st century. Rising global temperatures, caused primarily by greenhouse gas emissions from human activities, are leading to widespread environmental, economic, and social consequences. Scientists have documented increasing frequency of extreme weather events, melting ice caps, rising sea levels, and shifts in precipitation patterns. These changes threaten ecosystems, agricultural productivity, and human settlements worldwide.";

export const API_BASE_URL = "http://localhost:8000";

// Tips data
export const tips = [
  {
    title: "Original Context Preservation",
    description: "Our tool maintains the core meaning while restructuring sentences and replacing synonyms",
    icon: "🎯"
  },
  {
    title: "Choose Appropriate Mode",
    description: "Academic for research papers, Creative for articles, Professional for business content",
    icon: "⚙️"
  },
  {
    title: "Multiple Iterations",
    description: "Run the tool multiple times for better results, especially for heavily flagged content",
    icon: "🔄"
  },
  {
    title: "Manual Review Required",
    description: "Always review and edit the output to ensure accuracy and natural flow",
    icon: "👁️"
  },
  {
    title: "File Upload Privacy",
    description: "Files are processed locally in your browser - no data is sent to external servers for extraction",
    icon: "🔒"
  },
  {
    title: "Citation Best Practices",
    description: "Remember to properly cite sources even after paraphrasing to maintain academic integrity",
    icon: "📚"
  }
];

// Mode mapping function
export const getModeMapping = (frontendMode) => {
  const mapping = {
    'Academic': 'conservative',
    'Creative': 'aggressive', 
    'Professional': 'balanced',
    'Casual': 'aggressive'
  };
  return mapping[frontendMode] || 'balanced';
};

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
  return text.trim().split(/\s+/).length;
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
    fileName: file.name,
    fileSize: file.size
  };
};

// API functions
export const removePlagiarism = async (text, mode) => {
  const backendMode = getModeMapping(mode);
  
  const response = await fetch(`${API_BASE_URL}/remove-plagiarism`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      rewrite_mode: backendMode,
      reference_text: ""
    }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.error) {
    throw new Error(result.error);
  }

  return result;
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

// Uniqueness score calculation
export const getUniquenessScore = (apiResult, inputText) => {
  if (!apiResult) return 95;
  
  // Calculate uniqueness based on API improvements
  const plagiarismImprovement = apiResult.improvement || 0;
  const aiImprovement = apiResult.ai_improvement || 0;
  
  // Base score + improvements, capped at 99%
  const uniqueness = Math.min(99, 75 + (plagiarismImprovement * 0.3) + (aiImprovement * 0.2));
  return Math.round(uniqueness);
};