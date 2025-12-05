import React, { useState, useEffect } from 'react';
import { FileText, Upload, Copy, Download, RefreshCw, Brain, Settings, BookOpen } from 'lucide-react';
import { 
  actionButtonsStyles,
  fileUploadStyles, 
  getIconButtonStyles, 
  getOutputTextareaStyles, 
  getProcessButtonStyles, 
  getSecondaryButtonStyles, 
  getTextareaStyles, 
  inputHeaderStyles, 
  inputOutputGridStyles, 
  inputSectionStyles, 
  outputActionsStyles, 
  outputHeaderStyles, 
  outputSectionStyles, 
  outputStatsStyles, 
  sectionLabelStyles, 
  spinnerStyles, 
  statItemStyles, 
  statLabelStyles, 
  statsStyles, 
  statValueStyles,
  modeSelectionStyles,
  sectionHeaderStyles,
  modeGridStyles,
  getModeButtonStyles,
  modeHeaderStyles,
  modeNameStyles,
  modeDescStyles,
  featuresStyles,
  featureTagStyles
} from './styles';
import { processFile } from '../MainContentComponents/utils';

export default function Summary() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isOutputFocused, setIsOutputFocused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedMode, setSelectedMode] = useState('abstractive');
  const [selectedLength, setSelectedLength] = useState('medium');
  const [error, setError] = useState('');

  // API Configuration
// Dynamic API URL based on environment
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? "http://127.0.0.1:8000"  // Local development
  : "https://test-69jq.onrender.com";  // Production
  pothu avadhi alle
  // Available modes and lengths from Python backend
  const [availableModes, setAvailableModes] = useState([]);
  const [availableLengths, setAvailableLengths] = useState([]);

  // Default modes if API is unavailable
  const defaultModes = [
    { 
      name: 'abstractive', 
      description: 'Rewrites key information clearly', 
      icon: '✨',
      features: ['Rewritten content', 'Clear language', 'Professional']
    },

    { 
      name: 'bullet_points', 
      description: 'Organizes into scannable bullets', 
      icon: '📋',
      features: ['Bullet format', 'Easy scanning', 'Organized']
    },
     { 
      name: 'paragraph', 
      description: 'Creates flowing paragraph summary', 
      icon: '📄',
      features: ['Paragraph form', 'Flowing text', 'Narrative']
    },
    { 
      name: 'executive', 
      description: 'Business-focused for decision makers', 
      icon: '💼',
      features: ['Business focused', 'Decision making', 'Professional']
    },
    { 
      name: 'academic', 
      description: 'Scholarly with formal language', 
      icon: '🎓',
      features: ['Academic style', 'Formal tone', 'Scholarly']
    },
    { 
      name: 'social', 
      description: 'Engaging content for social media', 
      icon: '📱',
      features: ['Social media', 'Engaging', 'Shareable']
    },
    { 
      name: 'technical', 
      description: 'Preserves technical specifications', 
      icon: '⚙️',
      features: ['Technical details', 'Precision', 'Specifications']
    },  
  ];

  const defaultLengths = [
  
    { 
      name: 'short', 
      description: 'Short and to the point', 
      icon: '📝',
      features: ['3-5 sentences', 'Key points', 'Quick read']
    },
    { 
      name: 'medium', 
      description: 'Balanced length with good detail', 
      icon: '📄',
      features: ['1-2 paragraphs', 'Good detail', 'Balanced']
    },
    { 
      name: 'long', 
      description: 'Comprehensive summary with full context', 
      icon: '📚',
      features: ['Multiple paragraphs', 'Full context', 'Detailed']
    },
  
  ];

  // Load available options from API on component mount
  useEffect(() => {
    const loadSummaryOptions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/summary-options`);
        if (response.ok) {
          const data = await response.json();
          
          // Map API modes to our format
          const modesWithMetadata = data.available_modes.map(mode => {
            const defaultMode = defaultModes.find(m => m.name === mode) || {
              name: mode,
              description: `${mode.charAt(0).toUpperCase() + mode.slice(1)} summarization`,
              icon: '📝',
              features: ['AI-powered', 'Professional', 'Quality']
            };
            return defaultMode;
          });
          
          const lengthsWithMetadata = data.available_lengths.map(length => {
            const defaultLength = defaultLengths.find(l => l.name === length) || {
              name: length,
              description: `${length.charAt(0).toUpperCase() + length.slice(1)} length summary`,
              icon: '📄',
              features: ['Professional', 'Optimized', 'Quality']
            };
            return defaultLength;
          });
          
          setAvailableModes(modesWithMetadata);
          setAvailableLengths(lengthsWithMetadata);
        } else {
          // Fallback to default options
          setAvailableModes(defaultModes);
          setAvailableLengths(defaultLengths);
        }
      } catch (error) {
        console.error('Failed to load summary options:', error);
        setAvailableModes(defaultModes);
        setAvailableLengths(defaultLengths);
      }
    };

    loadSummaryOptions();
  }, []);

  // Stats calculation
  const inputWordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const inputCharCount = inputText.length;
  const outputWordCount = outputText.trim() ? outputText.trim().split(/\s+/).length : 0;
  const outputCharCount = outputText.length;

  const handleProcess = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to summarize');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          summary_type: selectedMode,      
          summary_length: selectedLength
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      

      setOutputText(data.summary);
      
    } catch (error) {
      console.error('Summarization failed:', error);
      setError(`Summarization failed: ${error.message}`);
      
      // Fallback processing
      const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 10);
      const fallbackCount = selectedLength === 'ultra_short' ? 1 : selectedLength === 'short' ? 2 : 3;
      const fallbackSummary = sentences.slice(0, fallbackCount).join('. ').trim() + '.';
      
      setOutputText(`${fallbackSummary}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Note:** API unavailable - using fallback processing.
**Mode:** ${selectedMode} (${selectedLength})
**Status:** Offline processing - limited functionality`);
      
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      setError('Failed to copy to clipboard');
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([outputText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `summary-${selectedMode}-${selectedLength}-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError('');
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const { text } = await processFile(file);
      setInputText(text);
      setError('');
    } catch (error) {
      setError(`File upload failed: ${error.message}`);
      console.error("File upload failed:", error);
    }
  };

  return (
    <>
      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '12px 16px',
          margin: '0 0 20px 0',
          color: '#dc2626',
          fontSize: '14px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Summary Mode Selection */}
      <div style={modeSelectionStyles}>
        <label style={sectionHeaderStyles}>
          <Settings size={18} style={{ marginRight: '8px' }} />
          Summary Mode
        </label>
        <div style={modeGridStyles}>
          {availableModes.map((mode) => (
            <button
              key={mode.name}
              onClick={() => setSelectedMode(mode.name)}
              style={getModeButtonStyles(selectedMode === mode.name)}
            >
              <div style={modeHeaderStyles}>
                <span style={{ fontSize: '20px', marginRight: '12px' }}>{mode.icon}</span>
                <div style={modeNameStyles}>{mode.name.toUpperCase()}</div>
              </div>
              <div style={modeDescStyles}>{mode.description}</div>
              <div style={featuresStyles}>
                {mode.features.map((feature, index) => (
                  <span key={index} style={featureTagStyles}>
                    {feature}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Summary Length Selection */}
      <div style={modeSelectionStyles}>
        <label style={sectionHeaderStyles}>
          <BookOpen size={18} style={{ marginRight: '8px' }} />
          Summary Length
        </label>
        <div style={modeGridStyles}>
          {availableLengths.map((length) => (
            <button
              key={length.name}
              onClick={() => setSelectedLength(length.name)}
              style={getModeButtonStyles(selectedLength === length.name)}
            >
              <div style={modeHeaderStyles}>
                <span style={{ fontSize: '20px', marginRight: '12px' }}>{length.icon}</span>
                <div style={modeNameStyles}>{length.name.toUpperCase().replace('_', ' ')}</div>
              </div>
              <div style={modeDescStyles}>{length.description}</div>
              <div style={featuresStyles}>
                {length.features.map((feature, index) => (
                  <span key={index} style={featureTagStyles}>
                    {feature}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Input/Output Grid */}
      <div style={inputOutputGridStyles}>
        {/* Input Section */}
        <div style={inputSectionStyles}>
          <div style={inputHeaderStyles}>
            <label style={sectionLabelStyles}>
              <FileText size={18} style={{ marginRight: '8px' }} />
              Input Content
            </label>
            <label style={fileUploadStyles}>
              <Upload size={16} />
              Upload 
              <input
                type="file"
                accept=".txt,.pdf,.docx,.rtf"                 
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            style={getTextareaStyles(isInputFocused)}
            placeholder='Paste your content here for AI-powered summarization...'
          />

          <div style={statsStyles}>
            <div style={statItemStyles}>
              <div style={statValueStyles}>{inputWordCount}</div>
              <div style={statLabelStyles}>Words</div>
            </div>
            <div style={statItemStyles}>
              <div style={statValueStyles}>{inputCharCount}</div>
              <div style={statLabelStyles}>Characters</div>
            </div>
            <div style={statItemStyles}>
              <div style={statValueStyles}>{inputText.split('\n').length}</div>
              <div style={statLabelStyles}>Lines</div>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div style={outputSectionStyles}>
          <div style={outputHeaderStyles}>
            <label style={sectionLabelStyles}>
              <Brain size={18} style={{ marginRight: '8px' }} />
              AI Generated Summary
            </label>
            <div style={outputActionsStyles}>
              <button
                onClick={handleCopy}
                disabled={!outputText}
                style={getIconButtonStyles(!outputText)}
                title="Copy to clipboard"
              >
                <Copy size={16} />
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                disabled={!outputText}
                style={getIconButtonStyles(!outputText)}
                title="Download as file"
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>

          <textarea
            value={outputText}
            onChange={(e) => setOutputText(e.target.value)}
            onFocus={() => setIsOutputFocused(true)}
            onBlur={() => setIsOutputFocused(false)}
            style={getOutputTextareaStyles(isOutputFocused)}
            placeholder={`Your ${selectedMode} ${selectedLength.replace('_', ' ')} summary will appear here...`}
          />

          <div style={outputStatsStyles}>
            <div style={statItemStyles}>
              <div style={statValueStyles}>{outputWordCount}</div>
              <div style={statLabelStyles}>Words</div>
            </div>
            <div style={statItemStyles}>
              <div style={statValueStyles}>{outputCharCount}</div>
              <div style={statLabelStyles}>Characters</div>
            </div>
            <div style={statItemStyles}>
              <div style={statValueStyles}>
                {inputWordCount > 0 ? Math.round((outputWordCount / inputWordCount) * 100) : 0}%
              </div>
              <div style={statLabelStyles}>Ratio</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={actionButtonsStyles}>
        <button
          onClick={handleClear}
          disabled={!inputText && !outputText}
          style={getSecondaryButtonStyles(!inputText && !outputText)}
        >
          <RefreshCw size={18} />
          Clear All
        </button>
        
        <button
          onClick={handleProcess}
          disabled={!inputText.trim() || isProcessing}
          style={getProcessButtonStyles(!inputText.trim() || isProcessing)}
        >
          {isProcessing ? (
            <>
              <div style={spinnerStyles}></div>
              Processing with AI...
            </>
          ) : (
            <>
              <Brain size={18} />
              Generate AI Summary
            </>
          )}
        </button>
      </div>
    </>
  );
}
