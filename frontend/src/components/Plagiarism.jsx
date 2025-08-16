// PlagiarismRemover.jsx - Main component file
import React, { useState } from 'react';
import { CheckIcon, ChevronDownIcon, CompareIcon, CopyIcon, DocumentIcon, MagicWandIcon, UploadIcon, PasteIcon } from './Icons';

// Import styles
import {
  getMainContentStyle,
  headerStyles,
  titleStyles,
  chipStyles,
  cardStyles,
  textareaStyles,
  actionButtonStyles,
  actionButtonHoverStyles,
  getPrimaryButtonStyles,
  primaryButtonHoverStyles,
  selectStyles,
  selectButtonStyles,
  dropdownStyles,
  tipsContainerStyles,
  getTipsHeaderStyles,
  getTipsContentStyles,
  tipItemStyles,
  resultCardStyles,
  comparisonStyles,
  spinnerStyles,
  getErrorStyles,
  fileInfoStyles,
  copyButtonStyles,
  statsContainerStyles,
  additionalStatsStyles,
  tipsFooterStyles,
  cssStyles
} from './PlagiarismComponents/style';

// Import utilities
import {
  MODES,
  SAMPLE_TEXT,
  tips,
  processFile,
  removePlagiarism,
  copyToClipboard,
  pasteFromClipboard,
  getUniquenessScore
} from './PlagiarismComponents/utils';

const PlagiarismRemover = ({ sidebarOpen }) => {
  // State management
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState('Academic');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isPrimaryHovered, setIsPrimaryHovered] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [processedText, setProcessedText] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiResult, setApiResult] = useState(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Event handlers
  const handleSampleText = () => {
    setInputText(SAMPLE_TEXT);
  };

  const handlePasteText = async () => {
    try {
      const text = await pasteFromClipboard();
      if (text) {
        setInputText(text);
      }
    } catch (err) {
      setError('Failed to read clipboard contents. Please paste manually.');
    }
  };

  const handleFileUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt,.docx,.pdf,.rtf';
    fileInput.style.display = 'none';
    
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setIsUploading(true);
      setError('');
      setUploadedFile(file);

      try {
        const result = await processFile(file);
        setInputText(result.text);
        
        const successMsg = `✅ Successfully extracted ${result.wordCount} words from ${result.fileName}`;
        setError(successMsg);
        setTimeout(() => setError(''), 4000);

      } catch (err) {
        console.error('File processing error:', err);
        setError(`Failed to process file: ${err.message}`);
      } finally {
        setIsUploading(false);
        document.body.removeChild(fileInput);
      }
    };

    document.body.appendChild(fileInput);
    fileInput.click();
  };

  const handleProcessText = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to process.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setShowComparison(false);

    try {
      const result = await removePlagiarism(inputText, mode);
      setProcessedText(result.rewritten_text);
      setApiResult(result);
      setShowComparison(true);

    } catch (err) {
      console.error('API Error:', err);
      setError(`Failed to process text: ${err.message}. Please ensure the backend server is running on http://localhost:8000`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyResult = async () => {
    const success = await copyToClipboard(processedText);
    if (success) {
      alert('Text copied to clipboard!');
    } else {
      setError('Failed to copy text to clipboard.');
    }
  };

  // Get dynamic styles
  const mainContentStyles = getMainContentStyle(sidebarOpen);
  const primaryButtonStyles = getPrimaryButtonStyles(isProcessing);
  const errorStyles = getErrorStyles(error);
  const tipsHeaderStyles = getTipsHeaderStyles(showTips);
  const tipsContentStyles = getTipsContentStyles(showTips);

  return (
    <div style={mainContentStyles}>
      <style>{cssStyles}</style>

      {/* Header */}
      <div style={headerStyles}>
        <h1 style={titleStyles}>
          Remove Plagiarism Instantly
        </h1>
        
        <div 
          style={chipStyles}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          ✨ Advanced AI Paraphrasing + Local File Processing 🔒
        </div>
      </div>

      {/* Main Content Card */}
      <div style={cardStyles}>
        {/* Text Input Area */}
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste the text you want to remove plagiarism from here, or upload a file (.txt, .docx, .pdf, .rtf) - processed locally in your browser..."
          style={textareaStyles}
          onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)'}
        />

        {/* Error Display */}
        {error && (
          <div style={errorStyles}>
            {error}
          </div>
        )}

        {/* File Info Display */}
        {uploadedFile && !error.startsWith('Failed') && (
          <div style={fileInfoStyles}>
            <DocumentIcon />
            <span>
              <strong>{uploadedFile.name}</strong> ({(uploadedFile.size / 1024).toFixed(1)} KB) - 
              Text extracted locally in your browser 🔒
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { 
              icon: UploadIcon, 
              text: isUploading ? 'Uploading...' : 'Upload File', 
              id: 'upload', 
              action: handleFileUpload,
              disabled: isUploading
            },
            { icon: DocumentIcon, text: 'Try A Sample', id: 'sample', action: handleSampleText },
            { icon: PasteIcon, text: 'Paste Text', id: 'paste', action: handlePasteText }
          ].map((item) => (
            <button
              key={item.id}
              onClick={item.disabled ? undefined : item.action}
              style={{
                ...actionButtonStyles,
                ...(hoveredButton === item.id && !item.disabled ? actionButtonHoverStyles : {}),
                opacity: item.disabled ? 0.6 : 1,
                cursor: item.disabled ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={() => !item.disabled && setHoveredButton(item.id)}
              onMouseLeave={() => setHoveredButton(null)}
              disabled={item.disabled}
            >
              {item.id === 'upload' && isUploading ? (
                <div style={spinnerStyles} />
              ) : (
                <item.icon />
              )}
              {item.text}
            </button>
          ))}
        </div>

        {/* Bottom Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#a1a1aa', fontSize: '16px' }}>Mode:</span>
            
            <div style={selectStyles}>
              <button
                onClick={() => setShowModeDropdown(!showModeDropdown)}
                style={{
                  ...selectButtonStyles,
                  borderColor: showModeDropdown ? '#8b5cf6' : 'rgba(139, 92, 246, 0.3)',
                }}
              >
                {mode}
                <ChevronDownIcon />
              </button>
              
              {showModeDropdown && (
                <div style={dropdownStyles}>
                  {MODES.map((modeOption) => (
                    <button
                      key={modeOption}
                      onClick={() => {
                        setMode(modeOption);
                        setShowModeDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '16px',
                        borderRadius: modeOption === MODES[0] ? '8px 8px 0 0' : modeOption === MODES[MODES.length - 1] ? '0 0 8px 8px' : '0',
                        transition: 'background-color 0.2s ease-in-out',
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(139, 92, 246, 0.2)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      {modeOption}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            style={{
              ...primaryButtonStyles,
              ...(isPrimaryHovered && !isProcessing ? primaryButtonHoverStyles : {}),
            }}
            onMouseEnter={() => !isProcessing && setIsPrimaryHovered(true)}
            onMouseLeave={() => setIsPrimaryHovered(false)}
            onClick={handleProcessText}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div style={spinnerStyles} />
                Processing...
              </>
            ) : (
              <>
                <MagicWandIcon />
                Remove Plagiarism
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        {showComparison && processedText && (
          <div style={resultCardStyles}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#8b5cf6', fontSize: '20px', fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CompareIcon />
                Before & After Comparison
              </h3>
              
              <button
                onClick={handleCopyResult}
                style={copyButtonStyles}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <CopyIcon/>
                Copy Result
              </button>
            </div>
            
            <div style={comparisonStyles}>
              <div>
                <h4 style={{ color: '#ef4444', fontSize: '16px', marginBottom: '12px', fontWeight: '600' }}>
                  Original Text
                </h4>
                <div className="comparison-text">
                  {inputText}
                </div>
              </div>
              
              <div>
                <h4 style={{ color: '#10b981', fontSize: '16px', marginBottom: '12px', fontWeight: '600' }}>
                  Plagiarism-Free Text
                </h4>
                <div className="comparison-text">
                  {processedText}
                </div>
              </div>
            </div>
            
            <div style={statsContainerStyles}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                    {getUniquenessScore(apiResult, inputText)}%
                  </div>
                  <div style={{ fontSize: '14px', color: '#94a3b8' }}>Uniqueness</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
                    {apiResult?.new_word_count || inputText.trim().split(' ').length}
                  </div>
                  <div style={{ fontSize: '14px', color: '#94a3b8' }}>Words Processed</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                    {mode}
                  </div>
                  <div style={{ fontSize: '14px', color: '#94a3b8' }}>Mode Used</div>
                </div>
              </div>
              
              {/* Additional API Stats */}
              {apiResult && (
                <div style={additionalStatsStyles}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
                    {apiResult.improvement !== undefined && (
                      <div>Plagiarism Reduction: <span style={{ color: '#10b981' }}>-{apiResult.improvement.toFixed(1)}%</span></div>
                    )}
                    {apiResult.ai_improvement !== undefined && (
                      <div>AI Score Reduction: <span style={{ color: '#10b981' }}>-{apiResult.ai_improvement.toFixed(1)}%</span></div>
                    )}
                    {apiResult.length_change !== undefined && (
                      <div>Length Change: <span style={{ color: apiResult.length_change > 0 ? '#8b5cf6' : '#f59e0b' }}>
                        {apiResult.length_change > 0 ? '+' : ''}{apiResult.length_change.toFixed(1)}%
                      </span></div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Tips Section */}
        <div style={tipsContainerStyles}>
          <div 
            className="tips-header"
            style={tipsHeaderStyles}
            onClick={() => setShowTips(!showTips)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                borderRadius: '8px',
                color: '#fff'
              }}>
                <CompareIcon />
              </div>
              <div>
                <h3 style={{
                  color: '#f8fafc',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: 0,
                  marginBottom: '2px'
                }}>
                  Plagiarism Removal Tips
                </h3>
                <p style={{
                  color: '#94a3b8',
                  fontSize: '14px',
                  margin: 0
                }}>
                  {showTips ? 'Click to hide paraphrasing tips' : 'Click to view effective paraphrasing tips'}
                </p>
              </div>
            </div>
            
            <div style={{
              color: '#94a3b8',
              transition: 'transform 0.3s ease-in-out',
              transform: showTips ? 'rotate(180deg)' : 'rotate(0deg)'
            }}>
              <ChevronDownIcon />
            </div>
          </div>

          <div style={tipsContentStyles}>
            <div style={{ display: 'grid', gap: '12px' }}>
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="tip-item"
                  style={tipItemStyles}
                >
                  <div className="icon-emoji">
                    {tip.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      color: '#f8fafc',
                      fontSize: '15px',
                      fontWeight: '600',
                      margin: 0,
                      marginBottom: '6px'
                    }}>
                      {tip.title}
                    </h4>
                    <p style={{
                      color: '#94a3b8',
                      fontSize: '14px',
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      {tip.description}
                    </p>
                  </div>
                  <div style={{
                    color: '#8b5cf6',
                    opacity: 0.7
                  }}>
                    <CheckIcon />
                  </div>
                </div>
              ))}
            </div>

            <div style={tipsFooterStyles}>
              <p style={{
                color: '#8b5cf6',
                fontSize: '14px',
                fontWeight: '500',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <CheckIcon />
                Always review the paraphrased content to ensure accuracy and proper citation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlagiarismRemover;