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

  const response = await fetch('http://localhost:8000/analyze', {
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