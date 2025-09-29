import React, { useState,useEffect } from 'react';
import { FileText, Upload, Copy, Download, RefreshCw, Wand2 } from 'lucide-react';
import { 
  actionButtonsStyles, 
  cardStyles, 
  featuresStyles, 
  featureTagStyles, 
  fileUploadStyles, 
  getIconButtonStyles, 
  getModeButtonStyles, 
  getOutputTextareaStyles, 
  getProcessButtonStyles, 
  getSecondaryButtonStyles, 
  getTextareaStyles, 
  inputHeaderStyles, 
  inputOutputGridStyles, 
  inputSectionStyles, 
  modeDescStyles, 
  modeGridStyles, 
  modeHeaderStyles, 
  modeNameStyles, 
  modeSelectionStyles, 
  outputActionsStyles, 
  outputHeaderStyles, 
  outputSectionStyles, 
  outputStatsStyles, 
  sectionHeaderStyles, 
  sectionLabelStyles, 
  spinnerStyles, 
  statItemStyles, 
  statLabelStyles, 
  statsStyles, 
  statValueStyles 
} from './styles';
import { processFile } from '../MainContentComponents/utils';

// Dynamic API URL based on environment
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? "http://localhost:8000"  // Local development
  : "https://test-finam.onrender.com";  // Production

export default function Mode() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isOutputFocused, setIsOutputFocused] = useState(false);
  const [selectedMode, setSelectedMode] = useState('Standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [availableModes, setAvailableModes] = useState([]);
  const [error, setError] = useState('');
  
  const defaultModes = [
    { 
      name: 'standard', 
      displayName: 'Standard',
      description: 'Balanced processing for general content with natural flow', 
      icon: '⚖️',
      features: ['Natural language patterns', 'Reduced AI signatures', 'Maintained context']
    },
    { 
      name: 'fluency', 
      displayName: 'Fluency',
      description: 'Enhanced readability and smooth flow', 
      icon: '💼',
      features: ['Improved readability', 'Better flow', 'Clear structure']
    },
    { 
      name: 'academic', 
      displayName: 'Academic',
      description: 'Scholarly and research writing standards', 
      icon: '🎓',
      features: ['Academic vocabulary', 'Research formatting', 'Citation ready']
    },
    { 
      name: 'creative', 
      displayName: 'Creative',
      description: 'Artistic and expressive content enhancement', 
      icon: '🎨',
      features: ['Creative expressions', 'Varied sentence structure', 'Engaging tone']
    },
    { 
      name: 'simple', 
      displayName: 'Simple',
      description: 'Clear and easy-to-understand language for all readers', 
      icon: '📝',
      features: ['Plain vocabulary', 'Short sentences', 'Beginner-friendly tone']
    },
    { 
      name: 'formal', 
      displayName: 'Formal',
      description: 'Polished and respectful communication style', 
      icon: '🏛️',
      features: ['Sophisticated vocabulary', 'Polite phrasing', 'Structured flow']
    },
    { 
      name: 'expand', 
      displayName: 'Expand',
      description: 'Elaborates on ideas with more detail and explanation', 
      icon: '🔎',
      features: ['Detailed sentences', 'Added context', 'Extended explanations']
    },
    { 
      name: 'shorten', 
      displayName: 'Shorten',
      description: 'Condenses content to be brief and to the point', 
      icon: '✂️',
      features: ['Concise wording', 'Key points only', 'Minimal fluff']
    },
    { 
      name: 'humanize', 
      displayName: 'Humanize',
      description: 'Makes text sound more natural and human-like', 
      icon: '👤',
      features: ['Natural tone', 'Human-like patterns', 'Reduced AI signatures']
    },
  ];

  useEffect(() => {
    const loadToneModes = async () => {
      try {
        console.log('Fetching tone modes from:', `${API_BASE_URL}/tone-modes`);
        const response = await fetch(`${API_BASE_URL}/tone-modes`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Backend response:', data);
          
          // Map backend modes to frontend format
          const backendModes = data.available_modes || [];
          if (backendModes.length > 0) {
            const mappedModes = backendModes.map(mode => {
              const defaultMode = defaultModes.find(d => d.name.toLowerCase() === mode.toLowerCase());
              return defaultMode || {
                name: mode.toLowerCase(),
                displayName: mode.charAt(0).toUpperCase() + mode.slice(1),
                description: `${mode} tone processing`,
                icon: '🔧',
                features: ['Tone adjustment', 'Style enhancement', 'Content optimization']
              };
            });
            setAvailableModes(mappedModes);
            console.log('Loaded modes from backend:', mappedModes.length);
          } else {
            setAvailableModes(defaultModes);
            console.log('Using default modes');
          }
        } else {
          console.error('Backend response not ok:', response.status);
          setAvailableModes(defaultModes);
        }
      } catch (err) {
        console.warn('Failed to load tone modes from backend, using defaults:', err);
        setError(`Failed to connect to backend: ${err.message}`);
        setAvailableModes(defaultModes);
      }
    };

    loadToneModes();
  }, []);
  
  // Stats
  const inputWordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const inputCharCount = inputText.length;
  const outputWordCount = outputText.trim() ? outputText.trim().split(/\s+/).length : 0;
  const outputCharCount = outputText.length;
 
  const handleProcess = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    setError('');
    
    try {
      console.log('Processing with mode:', selectedMode);
      const response = await fetch(`${API_BASE_URL}/change-tone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          tone_mode: selectedMode.toLowerCase(), // Ensure lowercase
          pattern_info: ''
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Backend response:', data);
        setOutputText(data.changed_text || data.text || 'Processing completed but no output received.');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }
    } catch (err) {
      console.error('Processing failed:', err);
      setError(`Failed to process text: ${err.message}`);
      
      // Fallback processing
      const fallbackText = `[${selectedMode.toUpperCase()} Mode - Offline Processing]\n\n${inputText}\n\nNote: Backend unavailable. This is a basic transformation. The text has been processed locally with minimal changes for demonstration purposes.`;
      setOutputText(fallbackText);
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
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([outputText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `tones-${selectedMode.toLowerCase()}-result.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const { text } = await processFile(file);
      setInputText(text);
    } catch (error) {
      alert(error.message);
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
          padding: '12px',
          marginBottom: '20px',
          color: '#991b1b',
          fontSize: '14px'
        }}>
          {error}
          <div style={{ fontSize: '12px', marginTop: '4px', color: '#666' }}>
            API URL: {API_BASE_URL}
          </div>
        </div>
      )}
      
      {/* Mode Selection */}
      <div style={modeSelectionStyles}>
        <label style={sectionHeaderStyles}>
          <Wand2 size={18} style={{ marginRight: '8px' }} />
          Processing Mode ({availableModes.length} available)
        </label>
        <div style={modeGridStyles}>
          {availableModes.map((mode) => (
            <button
              key={mode.name}
              onClick={() => setSelectedMode(mode.name)}
              style={getModeButtonStyles(selectedMode === mode.name)}
            >
              <div style={modeHeaderStyles}>
                <span style={{ fontSize: '20px' }}>{mode.icon}</span>
                <div style={modeNameStyles}>{mode.displayName}</div>
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
            placeholder={`Paste your content here for ${selectedMode.toLowerCase()} mode processing...`}
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
              <Wand2 size={18} style={{ marginRight: '8px' }} />
              Processed Content
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
            placeholder={`Your ${availableModes.find(m => m.name === selectedMode)?.displayName || selectedMode} processed content will appear here...`}
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
              Processing...
            </>
          ) : (
            <>
              <Wand2 size={18} />
              Process ({availableModes.find(m => m.name === selectedMode)?.displayName || selectedMode})
            </>
          )}
        </button>
      </div>
    </>
  );
}
