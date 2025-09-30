// PlagiarismRemover.jsx - Responsive main component
import React, { useState, useEffect } from 'react';
import { CheckIcon, ChevronDownIcon, CompareIcon, CopyIcon, DocumentIcon, MagicWandIcon, UploadIcon, PasteIcon, LightBulbIcon } from './Icons';

// Import responsive styles
import {
  getMainContentStyles,
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
} from '../components/PlagiarismComponents/style';

// Import utilities (unchanged)
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
import Navigation from '../pages/Layout/Navigation';

const PlagiarismRemover = ({ sidebarOpen }) => {
  // Screen size detection hook
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: typeof window !== 'undefined' ? window.innerWidth : 1024
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width <= 768,
        isTablet: width > 768 && width <= 1024,
        isDesktop: width > 1024,
        width
      });
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // State management (unchanged)
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

  // Event handlers (unchanged)
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
      setError('Failed to process text. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyResult = async () => {
    const success = await copyToClipboard(processedText);
    if (success) {
      // Use a more mobile-friendly notification
      if (screenSize.isMobile) {
        setError('✅ Text copied to clipboard!');
        setTimeout(() => setError(''), 2000);
      } else {
        alert('Text copied to clipboard!');
      }
    } else {
      setError('Failed to copy text to clipboard.');
    }
  };

  // Get responsive styles based on screen size
  const mainContentStyles = getMainContentStyles(sidebarOpen);
  const primaryButtonStyles = getPrimaryButtonStyles(isProcessing);
  const errorStyles = getErrorStyles(error);
  const tipsHeaderStyles = getTipsHeaderStyles(showTips);
  const tipsContentStyles = getTipsContentStyles(showTips);

  // Responsive action buttons configuration
  const actionButtons = [
    { 
      icon: UploadIcon, 
      text: isUploading ? 'Uploading...' : 'Upload File', 
      id: 'upload', 
      action: handleFileUpload,
      disabled: isUploading
    },
    { icon: DocumentIcon, text: 'Try A Sample', id: 'sample', action: handleSampleText },
    { icon: PasteIcon, text: 'Paste Text', id: 'paste', action: handlePasteText }
  ];

  return (
    <div style={mainContentStyles}>
      <style>{cssStyles}</style>
<Navigation/>
      {/* Responsive Header */}
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

      {/* Responsive Main Content Card */}
      <div style={cardStyles}>
        {/* Enhanced Responsive Tips Section */}
        <div style={tipsContainerStyles}>
          <div 
            className="tips-header"
            style={tipsHeaderStyles}
            onClick={() => setShowTips(!showTips)}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              flexWrap: screenSize.isMobile ? 'wrap' : 'nowrap',
              justifyContent: screenSize.isMobile ? 'center' : 'flex-start'
            }}>
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
              <div style={{ textAlign: screenSize.isMobile ? 'center' : 'left' }}>
                <h3 style={{
                  color: '#f8fafc',
                  fontSize: screenSize.isMobile ? '15px' : '16px',
                  fontWeight: '600',
                  margin: 0,
                  marginBottom: '2px'
                }}>
                  Plagiarism Removal Tips
                </h3>
                <p style={{
                  color: '#94a3b8',
                  fontSize: screenSize.isMobile ? '13px' : '14px',
                  margin: 0
                }}>
                  {showTips ? 'Click to hide paraphrasing tips' : 'Click to view effective paraphrasing tips'}
                </p>
              </div>
            </div>
            
            <div style={{
              color: '#94a3b8',
              transition: 'transform 0.3s ease-in-out',
              transform: showTips ? 'rotate(180deg)' : 'rotate(0deg)',
              flexShrink: 0
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
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{
                      color: '#f8fafc',
                      fontSize: screenSize.isMobile ? '14px' : '15px',
                      fontWeight: '600',
                      margin: 0,
                      marginBottom: '6px'
                    }}>
                      {tip.title}
                    </h4>
                    <p style={{
                      color: '#94a3b8',
                      fontSize: screenSize.isMobile ? '13px' : '14px',
                      margin: 0,
                      lineHeight: '1.5',
                      wordBreak: 'break-word'
                    }}>
                      {tip.description}
                    </p>
                  </div>
                  <div style={{
                    color: '#8b5cf6',
                    opacity: 0.7,
                    flexShrink: 0
                  }}>
                    <CheckIcon />
                  </div>
                </div>
              ))}
            </div>

            <div style={tipsFooterStyles}>
              <p style={{
                color: '#8b5cf6',
                fontSize: screenSize.isMobile ? '13px' : '14px',
                fontWeight: '500',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                <CheckIcon />
                <span style={{ textAlign: 'center' }}>
                  Always review the paraphrased content to ensure accuracy and proper citation
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Responsive Text Input Area */}
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
            <span style={{ flex: 1, minWidth: 0 }}>
              <strong>{uploadedFile.name}</strong> ({(uploadedFile.size / 1024).toFixed(1)} KB) - 
              Text extracted locally in your browser 🔒
            </span>
          </div>
        )}

        {/* Responsive Action Buttons */}
        <div 
          className="action-buttons-grid"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: screenSize.isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px', 
            marginBottom: 'clamp(16px, 3vw, 24px)' 
          }}
        >
          {actionButtons.map((item) => (
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

        {/* Responsive Bottom Controls */}
<div 
  className="bottom-controls"
  style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: screenSize.isMobile ? 'stretch' : 'center', 
    flexDirection: screenSize.isMobile ? 'column' : 'row',
    flexWrap: 'wrap', 
    gap: '16px' 
  }}
>
  <div 
  className="tone-hint"
  style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '10px',
    justifyContent: screenSize.isMobile ? 'center' : 'flex-start',
    width: screenSize.isMobile ? '100%' : 'auto',
    background: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '8px',
    padding: '8px 12px',
    color: '#a5b4fc',
    fontSize: 'clamp(13px, 2.5vw, 14px)',
    fontWeight: 500
  }}
>
  <LightBulbIcon />
  <span>Use <strong>Tone option</strong> for mode change</span>
</div>


  <button
    className="primary-button"
    style={{
      ...primaryButtonStyles,
      ...(isPrimaryHovered && !isProcessing ? primaryButtonHoverStyles : {}),
      width: screenSize.isMobile ? '100%' : 'auto', // Full width on mobile, auto on desktop
      maxWidth: screenSize.isMobile ? 'none' : '200px', // Limit max width on desktop
      flexShrink: 0 // Prevent button from shrinking
    }}
    onMouseEnter={() => !isProcessing && setIsPrimaryHovered(true)}
    onMouseLeave={() => setIsPrimaryHovered(false)}
    onClick={handleProcessText}
    disabled={isProcessing}
  >
    {isProcessing ? (
      <>
        <div style={spinnerStyles} />
        <span>Processing...</span>
      </>
    ) : (
      <>
        <MagicWandIcon />
        <span>Remove Plagiarism</span>
      </>
    )}
  </button>
</div>

        {/* Responsive Results Section */}
        {showComparison && processedText && (
          <div style={resultCardStyles}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: screenSize.isMobile ? 'flex-start' : 'center',
              flexDirection: screenSize.isMobile ? 'column' : 'row',
              gap: '16px',
              marginBottom: 'clamp(16px, 3vw, 20px)' 
            }}>
              <h3 style={{ 
                color: '#8b5cf6', 
                fontSize: 'clamp(18px, 3vw, 20px)', 
                fontWeight: '600', 
                margin: 0, 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                textAlign: screenSize.isMobile ? 'center' : 'left'
              }}>
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
            
            <div 
              className="comparison-grid"
              style={comparisonStyles}
            >
              <div>
                <h4 style={{ 
                  color: '#ef4444', 
                  fontSize: 'clamp(14px, 2.5vw, 16px)', 
                  marginBottom: '12px', 
                  fontWeight: '600' 
                }}>
                  Original Text
                </h4>
                <div className="comparison-text">
                  {inputText}
                </div>
              </div>
              
              <div>
                <h4 style={{ 
                  color: '#10b981', 
                  fontSize: 'clamp(14px, 2.5vw, 16px)', 
                  marginBottom: '12px', 
                  fontWeight: '600' 
                }}>
                  Plagiarism-Free Text
                </h4>
                <div className="comparison-text">
                  {processedText}
                </div>
              </div>
            </div>
            
            <div style={statsContainerStyles}>
              <div 
                className="stats-grid"
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                  gap: 'clamp(12px, 2.5vw, 16px)', 
                  textAlign: 'center' 
                }}
              >
                <div>
                  <div style={{ 
                    fontSize: 'clamp(20px, 4vw, 24px)', 
                    fontWeight: 'bold', 
                    color: '#10b981' 
                  }}>
                    {getUniquenessScore(apiResult, inputText)}%
                  </div>
                  <div style={{ 
                    fontSize: 'clamp(12px, 2vw, 14px)', 
                    color: '#94a3b8' 
                  }}>
                    Uniqueness
                  </div>
                </div>
                <div>
                  <div style={{ 
                    fontSize: 'clamp(20px, 4vw, 24px)', 
                    fontWeight: 'bold', 
                    color: '#8b5cf6' 
                  }}>
                    {apiResult?.new_word_count || inputText.trim().split(' ').length}
                  </div>
                  <div style={{ 
                    fontSize: 'clamp(12px, 2vw, 14px)', 
                    color: '#94a3b8' 
                  }}>
                    Words Processed
                  </div>
                </div>
               
              </div>
              
             
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlagiarismRemover;