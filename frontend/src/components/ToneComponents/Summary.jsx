import React, { useState } from 'react';
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
  const [selectedMode, setSelectedMode] = useState('QUICK');
  const [selectedLength, setSelectedLength] = useState('SHORT');

  // Summary Modes
  const summaryModes = [
    { 
      name: 'QUICK', 
      description: 'Fast summary generation with key points extraction', 
      icon: '⚡',
      features: ['Rapid processing', 'Main points only', 'Basic structure']
    },
    { 
      name: 'DETAILED', 
      description: 'Comprehensive analysis with detailed insights', 
      icon: '📋',
      features: ['In-depth analysis', 'Context preservation', 'Detailed explanations']
    },
    { 
      name: 'BULLETS', 
      description: 'Structured bullet points for easy scanning', 
      icon: '🔸',
      features: ['Bullet format', 'Easy scanning', 'Organized points']
    },
    { 
      name: 'EXECUTIVE', 
      description: 'Executive summary for business and reports', 
      icon: '💼',
      features: ['Business focused', 'Key decisions', 'Action items']
    },
    { 
      name: 'ABSTRACT', 
      description: 'Academic abstract style summary', 
      icon: '🎓',
      features: ['Academic format', 'Research style', 'Formal tone']
    },
    { 
      name: 'KEY SENTANCES', 
      description: 'Extract most important sentences from text', 
      icon: '🔑',
      features: ['Key sentences', 'Original wording', 'Context maintained']
    },
    { 
      name: 'OUTLINE', 
      description: 'Hierarchical outline format', 
      icon: '📝',
      features: ['Structured outline', 'Hierarchical', 'Easy navigation']
    },
    { 
      name: 'HIGHLIGHTS', 
      description: 'Important highlights and takeaways', 
      icon: '✨',
      features: ['Key highlights', 'Important takeaways', 'Quick insights']
    },
    { 
      name: 'PARAGRAPH', 
      description: 'Single paragraph comprehensive summary', 
      icon: '📄',
      features: ['Paragraph format', 'Flowing text', 'Comprehensive']
    },
    { 
      name: 'SHORT', 
      description: 'Brief and concise summary', 
      icon: '📋',
      features: ['Very brief', 'Essential only', 'Quick read']
    },
  ];

  // Summary Length Options
  const summaryLengths = [
    { 
      name: 'ULTRA_SHORT', 
      description: 'Extremely brief - just the essentials', 
      icon: '⚡',
      features: ['1-2 sentences', 'Core message', 'Ultra brief']
    },
    { 
      name: 'SHORT', 
      description: 'Short and to the point', 
      icon: '📝',
      features: ['3-5 sentences', 'Key points', 'Quick read']
    },
    { 
      name: 'MEDIUM', 
      description: 'Balanced length with good detail', 
      icon: '📄',
      features: ['1-2 paragraphs', 'Good detail', 'Balanced']
    },
    { 
      name: 'LONG', 
      description: 'Comprehensive summary with full context', 
      icon: '📚',
      features: ['Multiple paragraphs', 'Full context', 'Detailed']
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
      
      // Generate different outputs based on selected mode and length
      const lengthMultiplier = {
        'ULTRA_SHORT': 0.1,
        'SHORT': 0.25,
        'MEDIUM': 0.4,
        'LONG': 0.6
      };
      
      const estimatedWords = Math.floor(inputWordCount * lengthMultiplier[selectedLength]);
      
      switch (selectedMode) {
        case 'QUICK':
          processedText = `**Quick Summary (${selectedLength})**\n\nKey Points:\n• Main concept and primary arguments\n• Important supporting information\n• Final conclusions and insights\n\n**Processing Details:**\n- Mode: Quick Processing\n- Length: ${selectedLength}\n- Original: ${inputWordCount} words\n- Summary: ~${estimatedWords} words\n- Compression: ~${Math.round((1 - lengthMultiplier[selectedLength]) * 100)}%`;
          break;
          
        case 'DETAILED':
          processedText = `**Detailed Analysis Summary (${selectedLength})**\n\n**Executive Overview:**\nComprehensive analysis of the provided content with detailed insights and contextual information.\n\n**Key Components:**\n1. **Primary Arguments**: Core ideas and main concepts\n2. **Supporting Evidence**: Important details and background\n3. **Context & Implications**: Broader significance and impact\n4. **Conclusions**: Final insights and recommendations\n\n**Analysis Metrics:**\n- Processing Mode: Detailed Analysis\n- Length Setting: ${selectedLength}\n- Source Material: ${inputWordCount} words\n- Generated Summary: ~${estimatedWords} words`;
          break;
          
        case 'BULLETS':
          processedText = `**Bullet Point Summary (${selectedLength})**\n\n**Main Points:**\n• Core concept and primary focus\n• Key supporting arguments\n• Important evidence and examples\n• Background context and circumstances\n• Final conclusions and recommendations\n• Action items and next steps\n\n**Summary Statistics:**\n• Format: Structured Bullets\n• Length: ${selectedLength}\n• Original Length: ${inputWordCount} words\n• Summary Length: ~${estimatedWords} words\n• Key Points Extracted: 6 main bullets`;
          break;
          
        case 'EXECUTIVE':
          processedText = `**Executive Summary (${selectedLength})**\n\n**Business Overview:**\nStrategic summary designed for executive decision-making and business context.\n\n**Key Business Points:**\n- Strategic implications and business impact\n- Critical success factors and risks\n- Resource requirements and timelines\n- Recommended actions and decisions\n\n**Executive Metrics:**\n- Summary Type: Executive Brief\n- Target Length: ${selectedLength}\n- Source Document: ${inputWordCount} words\n- Executive Summary: ~${estimatedWords} words\n- Decision Points: 4 key areas identified`;
          break;
          
        case 'ABSTRACT':
          processedText = `**Academic Abstract (${selectedLength})**\n\n**Objective:** This abstract provides a scholarly summary of the source material following academic standards and formatting conventions.\n\n**Methods:** Content analysis and key concept extraction were employed to identify primary themes, supporting evidence, and conclusions.\n\n**Results:** The analysis revealed core arguments, supporting data, and significant findings that contribute to the overall understanding of the subject matter.\n\n**Conclusions:** The material presents valuable insights with practical implications for further research and application.\n\n**Abstract Details:**\n- Format: Academic Abstract\n- Length Classification: ${selectedLength}\n- Source Words: ${inputWordCount}\n- Abstract Length: ~${estimatedWords} words`;
          break;
          
        case 'KEY SENTANCES':
          processedText = `**Key Sentences Extract (${selectedLength})**\n\n**Most Important Sentences:**\n\n1. "This sentence represents the core argument or main thesis of the content."\n\n2. "Supporting evidence and key data points are highlighted in this critical sentence."\n\n3. "Important context and background information is captured in this essential statement."\n\n4. "The conclusion and final insights are summarized in this significant sentence."\n\n**Extraction Details:**\n- Method: Key Sentence Identification\n- Length: ${selectedLength}\n- Source Material: ${inputWordCount} words\n- Sentences Extracted: 4 key sentences\n- Maintains: Original wording and context`;
          break;
          
        case 'OUTLINE':
          processedText = `**Hierarchical Outline (${selectedLength})**\n\nI. Main Topic/Theme\n   A. Primary Argument\n      1. Supporting evidence\n      2. Key examples\n   B. Secondary Points\n      1. Additional support\n      2. Context information\n\nII. Key Details\n   A. Important Facts\n   B. Relevant Data\n   C. Background Context\n\nIII. Conclusions\n   A. Final Insights\n   B. Recommendations\n   C. Next Steps\n\n**Outline Specifications:**\n- Format: Hierarchical Structure\n- Detail Level: ${selectedLength}\n- Source Content: ${inputWordCount} words\n- Outline Length: ~${estimatedWords} words`;
          break;
          
        case 'HIGHLIGHTS':
          processedText = `**Key Highlights & Takeaways (${selectedLength})**\n\n✨ **Top Highlights:**\n🔸 Primary insight and main discovery\n🔸 Critical finding with significant impact\n🔸 Important trend or pattern identified\n🔸 Notable conclusion with practical value\n\n💡 **Key Takeaways:**\n→ Essential understanding for readers\n→ Practical application or implementation\n→ Important consideration for decision-making\n→ Valuable insight for future reference\n\n**Highlight Summary:**\n- Format: Highlights & Takeaways\n- Emphasis Level: ${selectedLength}\n- Original Content: ${inputWordCount} words\n- Highlights Generated: ~${estimatedWords} words`;
          break;
          
        case 'PARAGRAPH':
          processedText = `**Comprehensive Paragraph Summary (${selectedLength})**\n\nThis comprehensive summary encapsulates the essential elements of the source material in a flowing, coherent paragraph format. The content presents the main arguments and supporting evidence while maintaining the logical progression and contextual relationships between key concepts. Important findings and conclusions are integrated seamlessly to provide readers with a complete understanding of the subject matter, ensuring that critical insights and practical implications are clearly communicated. The summary maintains the original intent and meaning while condensing the information into an accessible and readable format that serves the needs of various stakeholders and decision-makers.\n\n**Paragraph Details:**\n- Format: Single Comprehensive Paragraph\n- Style: ${selectedLength} Length\n- Source Material: ${inputWordCount} words\n- Paragraph Summary: ~${estimatedWords} words\n- Structure: Flowing narrative format`;
          break;
          
        default: // SHORT
          processedText = `**Brief Summary (${selectedLength})**\n\nEssential points: Main concept, key evidence, and primary conclusions. Important context and final insights included.\n\n**Summary Info:**\n- Type: Brief Overview\n- Length: ${selectedLength}\n- Original: ${inputWordCount} words\n- Brief: ~${estimatedWords} words`;
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
    element.download = `summary-${selectedMode.toLowerCase()}-${selectedLength.toLowerCase()}-result.txt`;
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
      {/* Summary Mode Selection */}
      <div style={modeSelectionStyles}>
        <label style={sectionHeaderStyles}>
          <Settings size={18} style={{ marginRight: '8px' }} />
          Summary Mode
        </label>
        <div style={modeGridStyles}>
          {summaryModes.map((mode) => (
            <button
              key={mode.name}
              onClick={() => setSelectedMode(mode.name)}
              style={getModeButtonStyles(selectedMode === mode.name)}
            >
              <div style={modeHeaderStyles}>
                <span style={{ fontSize: '20px', marginRight: '12px' }}>{mode.icon}</span>
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

      {/* Summary Length Selection */}
      <div style={modeSelectionStyles}>
        <label style={sectionHeaderStyles}>
          <BookOpen size={18} style={{ marginRight: '8px' }} />
          Summary Length
        </label>
        <div style={modeGridStyles}>
          {summaryLengths.map((length) => (
            <button
              key={length.name}
              onClick={() => setSelectedLength(length.name)}
              style={getModeButtonStyles(selectedLength === length.name)}
            >
              <div style={modeHeaderStyles}>
                <span style={{ fontSize: '20px', marginRight: '12px' }}>{length.icon}</span>
                <div style={modeNameStyles}>{length.name}</div>
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
            placeholder='Paste your content here for intelligent summarization...'
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
              Generated Summary
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
            placeholder={`Your ${selectedMode.toLowerCase()} ${selectedLength.toLowerCase()} summary will appear here...`}
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
              <Brain size={18} />
              Generate Summary
            </>
          )}
        </button>
      </div>
    </>
  );
}