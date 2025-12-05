// MainContent.jsx - Responsive main component
import React, { useState, useEffect } from 'react';
import { CheckIcon, ChevronDownIcon, CopyIcon, DocumentIcon, DownloadIcon, ExpandIcon, LightBulbIcon, PasteIcon, UploadIcon } from './Icons';

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
  primaryButtonStyles,
  primaryButtonHoverStyles,
  selectStyles,
  selectButtonStyles,a
  dropdownStyles,
  tipsContainerStyles,
  getTipsHeaderStyles,
  getTipsContentStyles,
  tipItemStyles,
  outputButtonStyles,
  outputButtonHoverStyles,
  spinnerStyles,
  cssStyles
} from '../components/MainContentComponents/style';

// Import utilities (unchanged)
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

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // State management (unchanged)
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

  // Event handlers (unchanged)
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
      
      // Mobile-friendly notification
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
    <div style={mainContentStyles}>
      <style>{cssStyles}</style>

      {/* Responsive Header */}
      <div className="header" style={headerStyles}>
        <h1 className="title" style={titleStyles}>
          Convert AI Text to Authentic Content
        </h1>
        
        <div 
          className="chip"
          style={chipStyles}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          🎁 Advanced Text Humanization + Local File Processing 🔒
        </div>
      </div>

      {/* Responsive Main Content Card */}
      <div className="card" style={cardStyles}>
        {/* Error Message */}
        {error && (
          <div style={{
            background: error.startsWith('✅') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: error.startsWith('✅') ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            color: error.startsWith('✅') ? '#34d399' : '#fca5a5',
            padding: 'clamp(10px, 2vw, 12px)',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: 'clamp(12px, 2vw, 14px)',
            wordBreak: 'break-word'
          }}>
            {error}
          </div>
        )}

        {/* File Info Display */}
        {uploadedFile && !error?.startsWith('Failed') && (
          <div style={{
            marginBottom: '16px',
            padding: 'clamp(10px, 2vw, 12px) clamp(12px, 2.5vw, 16px)',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '8px',
            color: '#a78bfa',
            fontSize: 'clamp(12px, 2vw, 14px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            wordBreak: 'break-word'
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
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                borderRadius: '8px',
                color: '#fff'
              }}>
                <LightBulbIcon />
              </div>
              <div style={{ textAlign: screenSize.isMobile ? 'center' : 'left' }}>
                <h3 style={{
                  color: '#f8fafc',
                  fontSize: screenSize.isMobile ? '15px' : '16px',
                  fontWeight: '600',
                  margin: 0,
                  marginBottom: '2px'
                }}>
                  Pro Tips for Best Results
                </h3>
                <p style={{
                  color: '#94a3b8',
                  fontSize: screenSize.isMobile ? '13px' : '14px',
                  margin: 0
                }}>
                  {showTips ? 'Click to hide tips' : 'Click to view optimization tips'}
                </p>
              </div>
            </div>
            
            <div style={{
              color: '#94a3b8',
              transition: 'transform 0.3s ease-in-out',
              transform: showTips ? 'rotate(180deg)' : 'rotate(0deg)',
              flexShrink: 0
            }}>
              <ChevronDownIcon/>
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
                    color: '#10b981',
                    opacity: 0.7,
                    flexShrink: 0
                  }}>
                    <CheckIcon />
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 'clamp(16px, 3vw, 20px)',
              padding: 'clamp(12px, 2.5vw, 16px)',
              background: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{
                color: '#10b981',
                fontSize: 'clamp(13px, 2vw, 14px)',
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
                  Advanced text humanization with local file processing and complete privacy
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Responsive Input and Output Grid */}
        <div 
          className="input-output-grid"
          style={{
            display: 'grid',
gridTemplateColumns: '1fr',            gap: 'clamp(16px, 3vw, 24px)',
            marginBottom: 'clamp(16px, 3vw, 24px)'
          }}
        >
          {/* Input Section */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <h3 style={{ 
                color: '#f8fafc', 
                fontSize: 'clamp(16px, 3vw, 18px)', 
                fontWeight: '600', 
                margin: 0
              }}>
                Original Text
              </h3>
              <div style={{ 
                display: 'flex', 
                gap: 'clamp(6px, 1.5vw, 8px)', 
                color: '#94a3b8', 
                fontSize: 'clamp(12px, 2vw, 14px)',
                flexWrap: 'wrap'
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
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)'}
            />
          </div>

          {/* Output Section - Responsive positioning */}
          {outputText && (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <h3 style={{ 
                  color: '#f8fafc', 
                  fontSize: 'clamp(16px, 3vw, 18px)', 
                  fontWeight: '600', 
                  margin: 0 
                }}>
                  Humanized Text
                </h3>
              </div>
              <textarea
                style={textareaStyles}
                value={outputText}
                onChange={(e) => setOutputText(e.target.value)}
                placeholder="Your humanized text will appear here..."
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)'}
              />
              {/* Copy and Download buttons below the output box */}
              <div 
                className="output-buttons"
                style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  marginTop: '12px',
                  justifyContent: screenSize.isMobile ? 'center' : 'flex-end',
                  flexWrap: 'wrap'
                }}
              >
                <button
                  onClick={handleCopy}
                  style={{
                    ...outputButtonStyles,
                    ...(copySuccess ? { color: '#10b981', borderColor: '#10b981' } : {})
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

        {/* Responsive Action Buttons */}
        <div 
          className="action-buttons" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: screenSize.isMobile 
              ? '1fr' 
              : screenSize.isTablet 
                ? 'repeat(2, 1fr)' 
                : 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: screenSize.isMobile ? '12px' : '16px', 
            marginBottom: 'clamp(16px, 3vw, 24px)' 
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

        {/* Responsive Bottom Controls */}
        <div 
          className="bottom-controls" 
          style={{ 
            display: 'flex', 
            justifyContent: screenSize.isMobile ? 'center' : 'space-between', 
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