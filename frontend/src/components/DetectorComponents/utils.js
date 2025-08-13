// utils.js - Utility functions for the Detector component

// Helper functions for score interpretation
export const getClassification = (score) => {
  if (score >= 80) return 'HIGHLY LIKELY AI-GENERATED';
  if (score >= 60) return 'LIKELY AI-GENERATED';
  if (score >= 40) return 'POSSIBLY AI-GENERATED';
  if (score >= 20) return 'LIKELY HUMAN-WRITTEN';
  return 'HIGHLY LIKELY HUMAN-WRITTEN';
};

export const getScoreColor = (score) => {
  if (score >= 80) return '#ef4444';
  if (score >= 60) return '#f97316';
  if (score >= 40) return '#eab308';
  if (score >= 20) return '#22c55e';
  return '#10b981';
};

export const getConfidenceColor = (score) => {
  if (score >= 80) return '#fef2f2';
  if (score >= 60) return '#fff7ed';
  if (score >= 40) return '#fefce8';
  if (score >= 20) return '#f0fdf4';
  return '#ecfdf5';
};

export const getScoreIcon = (score) => {
  if (score >= 80) return '🤖';
  if (score >= 60) return '⚠️';
  if (score >= 40) return '🔍';
  if (score >= 20) return '✅';
  return '👤';
};

// API functions
export const analyzeText = async (text) => {
  if (!text.trim()) {
    throw new Error('Please enter some text to analyze');
  }

  const response = await fetch('https://text-humanizer-g2y3.onrender.com/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ text: text.trim() })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Analysis failed: ${errorText}`);
  }

  const data = await response.json();
  
  if (!data || typeof data.ai_score === 'undefined') {
    throw new Error('Invalid response from server');
  }

  return data;
};

// File Upload Functions
export const handleFileUpload = async (onTextExtracted, onError, onUploadStateChange) => {
  // Create a hidden file input
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.txt,.docx,.pdf,.rtf';
  fileInput.style.display = 'none';
  
  fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (10MB limit for frontend processing)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      onError('File too large. Maximum size is 10MB.');
      return;
    }

    // Validate file type
    const allowedTypes = ['.txt', '.docx', '.pdf', '.rtf'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      onError('Unsupported file type. Please upload .txt, .docx, .pdf, or .rtf files.');
      return;
    }

    onUploadStateChange(true, file);
    onError(null);

    try {
      let extractedText = '';
      
      if (fileExtension === '.txt') {
        extractedText = await readTextFile(file);
      } else if (fileExtension === '.pdf') {
        extractedText = await readPDFFile(file);
      } else if (fileExtension === '.docx') {
        extractedText = await readDocxFile(file);
      } else if (fileExtension === '.rtf') {
        extractedText = await readRTFFile(file);
      }

      if (extractedText.trim()) {
        // Limit text length
        if (extractedText.length > 50000) {
          extractedText = extractedText.substring(0, 50000) + '\n\n[Text truncated to 50,000 characters]';
        }
        
        onTextExtracted(extractedText);
        const wordCount = extractedText.trim().split(/\s+/).length;
        const successMsg = `✅ Successfully extracted ${wordCount} words from ${file.name}`;
        onError(successMsg);
        setTimeout(() => onError(null), 4000);
      } else {
        throw new Error('No readable text found in the file');
      }

    } catch (err) {
      console.error('File processing error:', err);
      onError(`Failed to process file: ${err.message}`);
    } finally {
      onUploadStateChange(false, null);
      // Clean up
      document.body.removeChild(fileInput);
    }
  };

  // Trigger file selection
  document.body.appendChild(fileInput);
  fileInput.click();
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

// Sample text data
export const SAMPLE_TEXTS = [
  {
    icon: '🤖',
    title: 'High AI Text',
    subtitle: 'Expected: ~90% AI',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    text: "In today's fast-paced world, it is important to note that leveraging cutting-edge AI technologies will ultimately transform business paradigms. With that being said, organizations must optimize their synergy to achieve unprecedented results."
  },
  {
    icon: '🟡',
    title: 'Medium AI Text',
    subtitle: 'Expected: ~50% AI',
    bgColor: 'rgba(234, 179, 8, 0.1)',
    borderColor: 'rgba(234, 179, 8, 0.3)',
    text: "The weather was nice today. However, it is important to note that climate change is a significant challenge. We should consider various solutions for this pressing issue."
  },
  {
    icon: '👤',
    title: 'Human Text',
    subtitle: 'Expected: ~10% AI',
    bgColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
    text: "Grabbed coffee this morning and the barista had this amazing purple hair. She convinced me to try their lavender latte instead of my usual black coffee. Honestly wasn't terrible - might go back tomorrow if I'm not running late again."
  },
  {
    icon: '🎭',
    title: 'Dramatic AI',
    subtitle: 'Expected: ~95% AI',
    bgColor: 'rgba(168, 85, 247, 0.1)',
    borderColor: 'rgba(168, 85, 247, 0.3)',
    text: "But here's the truth no one wants to say out loud: that's the catch with social media algorithms. Here's what nobody mentions - until something does break. Usually it's you who pays the price."
  }
];

// Tips data
export const TIPS_DATA = [
  {
    title: "Use Varied Content",
    description: "Try different types of text - formal, casual, technical, or creative to see detection patterns",
    icon: "📝"
  },
  {
    title: "Check Length Requirements",
    description: "Works best with 20-2000 words. Very short texts may not provide reliable results",
    icon: "📏"
  },
  {
    title: "Understand the Scores",
    description: "Higher scores indicate more AI-like patterns. Use multiple samples for better assessment",
    icon: "📊"
  },
  {
    title: "Review Pattern Details",
    description: "Check the detected patterns section to understand what triggers AI detection",
    icon: "🔍"
  },
  {
    title: "File Upload Privacy",
    description: "Files are processed locally in your browser - no data is sent to external servers for text extraction",
    icon: "🔒"
  },
  {
    title: "Consider Context",
    description: "Some formal or technical writing naturally appears more AI-like even when human-written",
    icon: "🎯"
  }
];

// Clipboard functions
export const handlePasteText = async () => {
  try {
    const clipboardText = await navigator.clipboard.readText();
    return clipboardText;
  } catch (err) {
    console.log('Failed to read clipboard contents: ', err);
    throw err;
  }
};

export const handleCopyResults = async (results) => {
  try {
    await navigator.clipboard.writeText(JSON.stringify(results, null, 2));
    return true;
  } catch (err) {
    console.error('Failed to copy text:', err);
    throw err;
  }
};
