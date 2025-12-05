// MainContent.jsx - Enhanced with glowing halos and lighter background
import React, { useState, useEffect } from 'react';
import { CheckIcon, ChevronDownIcon, CopyIcon, DocumentIcon, DownloadIcon, ExpandIcon, LightBulbIcon, PasteIcon, UploadIcon } from './Icons';

// Import responsive styles with glowing effects
import {
  getMainContentStyles,
  headerStyles,
  titleStyles,
  chipStyles,
  cardStyles,
  textareaStyles,
  actionButtonStyles,
  actionButtonHoverStyles,
  primaryButtonStyles,
  primaryButtonHoverStyles,
  selectStyles,
  selectButtonStyles,
  dropdownStyles,
  tipsContainerStyles,
  getTipsHeaderStyles,
  getTipsContentStyles,
  tipItemStyles,
  outputButtonStyles,
  outputButtonHoverStyles,
  spinnerStyles,
  cssStyles
} from '../';

// Import utilities
import {
  processFile,
  humanizeText,
  copyToClipboard,
  pasteFromClipboard,
  downloadText,
  tips,
  SAMPLE_TEXT,
  MODES,
  getWordCount,
  getCharacterCount
} from './MainContentComponents/utils';

const MainContent = () => {
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

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // State management
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState('Enhanced');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isPrimaryHovered, setIsPrimaryHovered] = useState(false);
  const [showTips, setShowTips] = useState(false);
  
  // Backend integration state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // File upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Event handlers
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

  const handleHumanize = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const data = await humanizeText(inputText);
      setOutputText(data.humanized_text);
      console.log('Humanization result:', data);
    } catch (err) {
      console.error('Error calling API:', err);
      setError('Failed to humanize text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(outputText);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      
      if (screenSize.isMobile) {
        setError('✅ Text copied to clipboard!');
        setTimeout(() => setError(''), 2000);
      }
    }
  };

  const handleDownload = () => {
    downloadText(outputText);
  };

  const handleSampleText = () => {
    setInputText(SAMPLE_TEXT);
  };

  const handlePasteText = async () => {
    const text = await pasteFromClipboard();
    if (text) {
      setInputText(text);
    }
  };

  const renderAnalysisResults = () => {
    return null;
  };

  // Get responsive styles
  const mainContentStyles = getMainContentStyles();
  const tipsHeaderStyles = getTipsHeaderStyles(showTips);
  const tipsContentStyles = getTipsContentStyles(showTips);

  // Responsive action buttons
  const actionButtons = [
    { 
      icon: UploadIcon, 
      text: isUploading ? 'Uploading...' : 'Upload File', 
      id: 'upload', 
      action: handleFileUpload,
      disabled: isUploading
    },
    { 
      icon: DocumentIcon, 
      text: 'Try A Sample', 
      id: 'sample', 
      action: handleSampleText 
    },
    { 
      icon: PasteIcon, 
      text: 'Paste Text', 
      id: 'paste', 
      action: handlePasteText 
    }
  ];

  return (
    <div className="main-content" style={mainContentStyles}>
      <style>{cssStyles}</style>

      {/* Enhanced Header with Glow */}
      <div className="header" style={headerStyles}>
        <h1 className="title" style={titleStyles}>
          Convert AI Text to Authentic Content
        </h1>
        
        <div 
          className="chip"
          style={chipStyles}
        >
          🎁 Advanced Text Humanization + Local File Processing 🔒
        </div>
      </div>

      {/* Main Card with Glowing Border */}
      <div className="card" style={cardStyles}>
        {/* Error/Success Message with Glow */}
        {error && (
          <div style={{
            background: error.startsWith('✅') 
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)' 
              : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%)',
            border: error.startsWith('✅') 
              ? '2px solid rgba(16, 185, 129, 0.4)' 
              : '2px solid rgba(239, 68, 68, 0.4)',
            color: error.startsWith('✅') ? '#6ee7b7' : '#fca5a5',
            padding: 'clamp(12px, 2.5vw, 14px)',
            borderRadius: '10px',
            marginBottom: '18px',
            fontSize: 'clamp(13px, 2.2vw, 15px)',
            wordBreak: 'break-word',
            boxShadow: error.startsWith('✅')
              ? '0 0 20px rgba(16, 185, 129, 0.3)'
              : '0 0 20px rgba(239, 68, 68, 0.3)',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        {/* File Info Display with Glow */}
        {uploadedFile && !error?.startsWith('Failed') && (
          <div style={{
            marginBottom: '18px',
            padding: 'clamp(12px, 2.5vw, 14px) clamp(14px, 3vw, 18px)',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
            border: '2px solid rgba(167, 139, 250, 0.4)',
            borderRadius: '10px',
            color: '#c4b5fd',
            fontSize: 'clamp(13px, 2.2vw, 15px)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            wordBreak: 'break-word',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)',
            fontWeight: '500'
          }}>
            <DocumentIcon />
            <span style={{ flex: 1, minWidth: 0 }}>
              <strong>{uploadedFile.name}</strong> ({(uploadedFile.size / 1024).toFixed(1)} KB) - 
              Text extracted locally in your browser 🔒
            </span>
          </div>
        )}

        {/* Analysis Results */}
        {renderAnalysisResults()}

        {/* Enhanced Tips Section with Glow */}
        <div style={tipsContainerStyles}>
          <div 
            className="tips-header"
            style={tipsHeaderStyles}
            onClick={() => setShowTips(!showTips)}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '14px',
              flexWrap: screenSize.isMobile ? 'wrap' : 'nowrap',
              justifyContent: screenSize.isMobile ? 'center' : 'flex-start'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
                borderRadius: '10px',
                color: '#fff',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
              }}>
                <LightBulbIcon />
              </div>
              <div style={{ textAlign: screenSize.isMobile ? 'center' : 'left' }}>
                <h3 style={{
                  color: '#e0e7ff',
                  fontSize: screenSize.isMobile ? '16px' : '17px',
                  fontWeight: '600',
                  margin: 0,
                  marginBottom: '3px'
                }}>
                  Pro Tips for Best Results
                </h3>
                <p style={{
                  color: '#a5b4fc',
                  fontSize: screenSize.isMobile ? '14px' : '15px',
                  margin: 0
                }}>
                  {showTips ? 'Click to hide tips' : 'Click to view optimization tips'}
                </p>
              </div>
            </div>
            
            <div style={{
              color: '#a5b4fc',
              transition: 'transform 0.3s ease-in-out',
              transform: showTips ? 'rotate(180deg)' : 'rotate(0deg)',
              flexShrink: 0
            }}>
              <ChevronDownIcon/>
            </div>
          </div>

          <div style={tipsContentStyles}>
            <div style={{ display: 'grid', gap: '14px' }}>
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
                      color: '#e0e7ff',
                      fontSize: screenSize.isMobile ? '15px' : '16px',
                      fontWeight: '600',
                      margin: 0,
                      marginBottom: '7px'
                    }}>
                      {tip.title}
                    </h4>
                    <p style={{
                      color: '#a5b4fc',
                      fontSize: screenSize.isMobile ? '14px' : '15px',
                      margin: 0,
                      lineHeight: '1.6',
                      wordBreak: 'break-word'
                    }}>
                      {tip.description}
                    </p>
                  </div>
                  <div style={{
                    color: '#6ee7b7',
                    opacity: 0.8,
                    flexShrink: 0,
                    filter: 'drop-shadow(0 0 5px rgba(110, 231, 183, 0.5))'
                  }}>
                    <CheckIcon />
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 'clamp(18px, 3.5vw, 24px)',
              padding: 'clamp(14px, 3vw, 18px)',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
              border: '2px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '10px',
              textAlign: 'center',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.15)'
            }}>
              <p style={{
                color: '#6ee7b7',
                fontSize: 'clamp(14px, 2.2vw, 15px)',
                fontWeight: '500',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                flexWrap: 'wrap'
              }}>
                <CheckIcon />
                <span style={{ textAlign: 'center' }}>
                  Advanced text humanization with local file processing and complete privacy
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Input and Output Grid */}
        <div 
          className="input-output-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'clamp(18px, 3.5vw, 26px)',
            marginBottom: 'clamp(18px, 3.5vw, 26px)'
          }}
        >
          {/* Input Section */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <h3 style={{ 
                color: '#e0e7ff', 
                fontSize: 'clamp(17px, 3.2vw, 19px)', 
                fontWeight: '600', 
                margin: 0,
                textShadow: '0 0 10px rgba(224, 231, 255, 0.3)'
              }}>
                Original Text
              </h3>
              <div style={{ 
                display: 'flex', 
                gap: 'clamp(8px, 2vw, 10px)', 
                color: '#a5b4fc', 
                fontSize: 'clamp(13px, 2.2vw, 15px)',
                flexWrap: 'wrap',
                fontWeight: '500'
              }}>
                <span>Characters: {getCharacterCount(inputText)}</span>
                <span>Words: {getWordCount(inputText)}</span>
              </div>
            </div>
            <textarea
              className="textarea"
              style={textareaStyles}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter the text you want to humanize here, or upload a file (.txt, .docx, .pdf, .rtf) - processed locally in your browser..."
              onFocus={(e) => {
                e.target.style.borderColor = '#a78bfa';
                e.target.style.boxShadow = '0 0 20px rgba(167, 139, 250, 0.4), inset 0 0 20px rgba(99, 102, 241, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(167, 139, 250, 0.3)';
                e.target.style.boxShadow = 'inset 0 0 20px rgba(99, 102, 241, 0.1)';
              }}
            />
          </div>

          {/* Output Section */}
          {outputText && (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <h3 style={{ 
                  color: '#e0e7ff', 
                  fontSize: 'clamp(17px, 3.2vw, 19px)', 
                  fontWeight: '600', 
                  margin: 0,
                  textShadow: '0 0 10px rgba(224, 231, 255, 0.3)'
                }}>
                  Humanized Text
                </h3>
              </div>
              <textarea
                className="textarea"
                style={textareaStyles}
                value={outputText}
                onChange={(e) => setOutputText(e.target.value)}
                placeholder="Your humanized text will appear here..."
                onFocus={(e) => {
                  e.target.style.borderColor = '#a78bfa';
                  e.target.style.boxShadow = '0 0 20px rgba(167, 139, 250, 0.4), inset 0 0 20px rgba(99, 102, 241, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(167, 139, 250, 0.3)';
                  e.target.style.boxShadow = 'inset 0 0 20px rgba(99, 102, 241, 0.1)';
                }}
              />
              {/* Copy and Download buttons */}
              <div 
                className="output-buttons"
                style={{ 
                  display: 'flex', 
                  gap: '10px', 
                  marginTop: '14px',
                  justifyContent: screenSize.isMobile ? 'center' : 'flex-end',
                  flexWrap: 'wrap'
                }}
              >
                <button
                  onClick={handleCopy}
                  style={{
                    ...outputButtonStyles,
                    ...(copySuccess ? { 
                      color: '#6ee7b7', 
                      borderColor: '#10b981',
                      boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
                    } : {})
                  }}
                  onMouseEnter={(e) => {
                    if (!copySuccess) {
                      Object.assign(e.target.style, outputButtonHoverStyles);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!copySuccess) {
                      Object.assign(e.target.style, outputButtonStyles);
                    }
                  }}
                >
                  <CopyIcon/>
                  {copySuccess ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  style={outputButtonStyles}
                  onMouseEnter={(e) => Object.assign(e.target.style, outputButtonHoverStyles)}
                  onMouseLeave={(e) => Object.assign(e.target.style, outputButtonStyles)}
                >
                  <DownloadIcon />
                  Download
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons with Glow */}
        <div 
          className="action-buttons" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: screenSize.isMobile 
              ? '1fr' 
              : screenSize.isTablet 
                ? 'repeat(2, 1fr)' 
                : 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: screenSize.isMobile ? '14px' : '18px', 
            marginBottom: 'clamp(18px, 3.5vw, 26px)' 
          }}
        >
          {actionButtons.map((item) => (
            <button
              key={item.id}
              className="action-button"
              onClick={item.disabled ? undefined : item.action}
              disabled={item.disabled}
              style={{
                ...actionButtonStyles,
                ...(hoveredButton === item.id && !item.disabled ? actionButtonHoverStyles : {}),
                opacity: item.disabled ? 0.6 : 1,
                cursor: item.disabled ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={() => !item.disabled && setHoveredButton(item.id)}
              onMouseLeave={() => setHoveredButton(null)}
            >
              {item.id === 'upload' && isUploading ? (
                <div style={spinnerStyles}></div>
              ) : (
                <item.icon />
              )}
              {item.text}
            </button>
          ))}
        </div>

        {/* Bottom Controls */}
        <div 
          className="bottom-controls" 
          style={{ 
            display: 'flex', 
            justifyContent: screenSize.isMobile ? 'center' : 'space-between', 
            alignItems: screenSize.isMobile ? 'stretch' : 'center', 
            flexDirection: screenSize.isMobile ? 'column' : 'row',
            flexWrap: 'wrap', 
            gap: '18px' 
          }}
        >
          <div 
            className="tone-hint"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              justifyContent: screenSize.isMobile ? 'center' : 'flex-start',
              width: screenSize.isMobile ? '100%' : 'auto',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
              border: '2px solid rgba(167, 139, 250, 0.4)',
              borderRadius: '10px',
              padding: '10px 14px',
              color: '#c4b5fd',
              fontSize: 'clamp(14px, 2.5vw, 15px)',
              fontWeight: 500,
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)'
            }}
          >
            <LightBulbIcon />
            <span>Use <strong>Tone option</strong> for mode change</span>
          </div>

          <button
            className="primary-button"
            disabled={loading || !inputText.trim()}
            style={{
              ...primaryButtonStyles,
              ...(isPrimaryHovered && !loading && inputText.trim() ? primaryButtonHoverStyles : {}),
              opacity: (loading || !inputText.trim()) ? 0.6 : 1,
              cursor: (loading || !inputText.trim()) ? 'not-allowed' : 'pointer',
              width: screenSize.isMobile ? '100%' : 'auto'
            }}
            onMouseEnter={() => !loading && inputText.trim() && setIsPrimaryHovered(true)}
            onMouseLeave={() => setIsPrimaryHovered(false)}
            onClick={handleHumanize}
          >
            {loading ? (
              <>
                <div style={spinnerStyles}></div>
                <span>Humanizing...</span>
              </>
            ) : (
              'Humanize'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainContent;