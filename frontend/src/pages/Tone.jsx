import React, { useState } from 'react';
import { FileText, Upload, Zap, Copy, Download, RefreshCw, Wand2, Brain } from 'lucide-react';
import { actionButtonsStyles, cardStyles, chipStyles, containerStyles, featuresStyles, featureTagStyles, fileUploadStyles, getIconButtonStyles, getModeButtonStyles, getOutputTextareaStyles, getProcessButtonStyles, getSecondaryButtonStyles, getTabStyles, getTextareaStyles, headerStyles, inputHeaderStyles, inputOutputGridStyles, inputSectionStyles, modeDescStyles, modeGridStyles, modeHeaderStyles, modeNameStyles, modeSelectionStyles, outputActionsStyles, outputHeaderStyles, outputSectionStyles, outputStatsStyles, sectionHeaderStyles, sectionLabelStyles, spinnerStyles, statItemStyles, statLabelStyles, statsStyles, statValueStyles, tabContentStyles, tabDescStyles, tabIconStyles, tabNameStyles, tabsContainerStyles, titleStyles } from '../components/ToneComponents/styles';
import Navigation from './Layout/Navigation';
import { processFile } from '../components/MainContentComponents/utils';
export default function AdvancedTools() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isOutputFocused, setIsOutputFocused] = useState(false);
  const [activeTab, setActiveTab] = useState('Modes');
  const [selectedMode, setSelectedMode] = useState('Standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const tabs = ['Modes', 'Summarize'];
  
  const modes = [
    { 
      name: 'Standard', 
      description: 'Balanced processing for general content with natural flow', 
      icon: '⚖️',
      features: ['Natural language patterns', 'Reduced AI signatures', 'Maintained context']
    },
    { 
      name: 'Professional', 
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
      let processedText = '';
      
      if (activeTab === 'Modes') {
        // Simulate humanized/plagiarism-checked content
        processedText = `[${selectedMode} Mode Processing Complete]\n\n${inputText}\n\nThis content has been processed through our ${selectedMode.toLowerCase()} mode to enhance readability, reduce AI detection patterns, and ensure originality. The text maintains its core meaning while improving natural language flow and authenticity markers.`;
      } else if (activeTab === 'Summarize') {
        // Simulate summarized content
        const keyPoints = [
          '**Main Concept**: Core ideas and primary arguments',
          '**Key Details**: Important supporting information and evidence',
          '**Context**: Background and relevant circumstances',
          '**Conclusions**: Final insights and recommendations',
          '**Action Items**: Next steps and implementation points'
        ];
        
        processedText = `**Summary Overview**\n\nExtracted from ${inputWordCount} words of original content:\n\n${keyPoints.join('\n\n')}\n\n**Summary Statistics**:\n- Original length: ${inputWordCount} words\n- Condensed to: ~${Math.floor(inputWordCount * 0.25)} words\n- Compression ratio: ~75% reduction\n- Key concepts preserved: 5 main points\n\nThis summary captures the essential information while significantly reducing length for quick comprehension.`;
      }
      
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
    element.download = `${activeTab.toLowerCase()}-${selectedMode.toLowerCase()}-result.txt`;
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
    alert(error.message); // or show a styled error
    console.error("File upload failed:", error);
  }
};

  const getTabIcon = (tab) => {
    switch (tab) {
      case 'Modes': return <Wand2 size={20} />;
      case 'Summarize': return <Brain size={20} />;
      default: return <Zap size={20} />;
    }
  };

  const getTabDescription = (tab) => {
    switch (tab) {
      case 'Modes': return 'Humanize content & check plagiarism with different processing modes';
      case 'Summarize': return 'Generate concise summaries with key insights extraction';
      default: return 'Advanced AI text processing';
    }
  };

  return (
    <div style={containerStyles}>
      <Navigation/>
      <div style={cardStyles}>
        {/* Header */}
        <div style={headerStyles}>
          <h1 style={titleStyles}>Advanced Tools</h1>
          <div style={chipStyles}>
            ✨ Humanize • Plagiarism Check • Smart Summarize 🎯
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={tabsContainerStyles}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setOutputText('');
              }}
              style={getTabStyles(activeTab === tab)}
            >
              <div style={tabIconStyles}>
                {getTabIcon(tab)}
              </div>
              <div style={tabContentStyles}>
                <div style={tabNameStyles}>{tab}</div>
                <div style={tabDescStyles}>
                  {getTabDescription(tab)}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Mode Selection - Only show for Modes tab */}
        {activeTab === 'Modes' && (
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
        )}

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
              placeholder={activeTab === 'Modes' 
                ? `Paste your content here for ${selectedMode.toLowerCase()} mode processing (humanization & plagiarism check)...`
                : 'Paste your content here for intelligent summarization...'
              }
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
                {activeTab === 'Modes' ? (
                  <>
                    <Wand2 size={18} style={{ marginRight: '8px' }} />
                    Processed Content
                  </>
                ) : (
                  <>
                    <Brain size={18} style={{ marginRight: '8px' }} />
                    Generated Summary
                  </>
                )}
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
              placeholder={activeTab === 'Modes'
                ? `Your ${selectedMode.toLowerCase()} processed content will appear here...`
                : 'Your intelligent summary will appear here...'
              }
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
                {getTabIcon(activeTab)}
                {activeTab === 'Modes' ? `Process (${selectedMode})` : 'Generate Summary'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}



// Add CSS animation for spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    .input-output-grid {
      grid-template-columns: 1fr !important;
    }
  }
`;
document.head.appendChild(style);