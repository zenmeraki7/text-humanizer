import React, { useState } from 'react';
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

export default function Mode() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isOutputFocused, setIsOutputFocused] = useState(false);
  const [selectedMode, setSelectedMode] = useState('Standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const modes = [
    { 
      name: 'Standard', 
      description: 'Balanced processing for general content with natural flow', 
      icon: '⚖️',
      features: ['Natural language patterns', 'Reduced AI signatures', 'Maintained context']
    },
    { 
      name: 'Fluency', 
      description: 'Corporate and business communication style', 
      icon: '💼',
      features: ['Formal tone', 'Business terminology', 'Professional structure']
    },
    { 
      name: 'Academic', 
      description: 'Scholarly and research writing standards', 
      icon: '🎓',
      features: ['Academic vocabulary', 'Research formatting', 'Citation ready']
    },
    { 
      name: 'Creative', 
      description: 'Artistic and expressive content enhancement', 
      icon: '🎨',
      features: ['Creative expressions', 'Varied sentence structure', 'Engaging tone']
    },
    { 
      name: 'Simple', 
      description: 'Clear and easy-to-understand language for all readers', 
      icon: '📝',
      features: ['Plain vocabulary', 'Short sentences', 'Beginner-friendly tone']
    },
    { 
      name: 'Formal', 
      description: 'Polished and respectful communication style', 
      icon: '🏛️',
      features: ['Sophisticated vocabulary', 'Polite phrasing', 'Structured flow']
    },
    { 
      name: 'Expand', 
      description: 'Elaborates on ideas with more detail and explanation', 
      icon: '🔎',
      features: ['Detailed sentences', 'Added context', 'Extended explanations']
    },
    { 
      name: 'Shorten', 
      description: 'Condenses content to be brief and to the point', 
      icon: '✂️',
      features: ['Concise wording', 'Key points only', 'Minimal fluff']
    },
  ];

  // Stats
  const inputWordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const inputCharCount = inputText.length;
  const outputWordCount = outputText.trim() ? outputText.trim().split(/\s+/).length : 0;
  const outputCharCount = outputText.length;

  const handleProcess = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const processedText = `[${selectedMode} Mode Processing Complete]\n\n${inputText}\n\nThis content has been processed through our ${selectedMode.toLowerCase()} mode to enhance readability, reduce AI detection patterns, and ensure originality. The text maintains its core meaning while improving natural language flow and authenticity markers.`;
      
      setOutputText(processedText);
      setIsProcessing(false);
    }, 2500);
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
      {/* Mode Selection */}
      <div style={modeSelectionStyles}>
        <label style={sectionHeaderStyles}>
          <Wand2 size={18} style={{ marginRight: '8px' }} />
          Processing Mode
        </label>
        <div style={modeGridStyles}>
          {modes.map((mode) => (
            <button
              key={mode.name}
              onClick={() => setSelectedMode(mode.name)}
              style={getModeButtonStyles(selectedMode === mode.name)}
            >
              <div style={modeHeaderStyles}>
                <span style={modeSelectionStyles}>{mode.icon}</span>
                <div style={modeNameStyles}>{mode.name}</div>
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
            placeholder={`Paste your content here for ${selectedMode.toLowerCase()} mode processing (humanization & plagiarism check)...`}
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
            placeholder={`Your ${selectedMode.toLowerCase()} processed content will appear here...`}
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
              Process ({selectedMode})
            </>
          )}
        </button>
      </div>
    </>
  );
}