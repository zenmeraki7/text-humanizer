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
const [showScoreCard, setShowScoreCard] = useState(false);

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
 {showScoreCard && (
  <div style={{
    ...resultCardStyles,
    marginTop: '24px',
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.03) 100%)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
  }}>
    {/* Header */}
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px',
      marginBottom: 'clamp(20px, 4vw, 24px)',
      justifyContent: screenSize.isMobile ? 'center' : 'flex-start'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'clamp(32px, 7vw, 36px)',
        height: 'clamp(32px, 7vw, 36px)',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        borderRadius: '8px',
        color: '#fff',
        fontSize: 'clamp(16px, 4vw, 20px)'
      }}>
        ✓
      </div>
      <h3 style={{ 
        color: '#10b981', 
        fontSize: 'clamp(18px, 4vw, 20px)', 
        fontWeight: '600', 
        margin: 0
      }}>
        Content Analysis Score
      </h3>
    </div>

    {/* Score Circle */}
    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <div 
          style={{ 
            width: screenSize.isMobile ? '100px' : '120px',
            height: screenSize.isMobile ? '100px' : '120px',
            border: `${screenSize.isMobile ? '6px' : '8px'} solid rgba(16, 185, 129, 0.2)`,
            borderTop: `${screenSize.isMobile ? '6px' : '8px'} solid #10b981`,
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(16, 185, 129, 0.05)',
            transition: 'all 0.5s ease-in-out',
            animation: 'rotateCircle 2s ease-in-out',
          }}
        >
          <div style={{
            fontSize: screenSize.isMobile ? '24px' : '28px',
            fontWeight: 'bold',
            color: '#10b981',
            lineHeight: 1
          }}>
            {apiResult
              ? getUniquenessScore(apiResult, inputText)
              : inputText.trim()
              ? 100
              : 0}%
          </div>
          <div style={{
            fontSize: screenSize.isMobile ? '11px' : '12px',
            color: '#94a3b8',
            marginTop: '4px',
            fontWeight: '500'
          }}>
            Uniqueness
          </div>
        </div>
      </div>

      {/* Classification Badge */}
      <div 
        style={{ 
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          color: '#10b981',
          border: '2px solid rgba(16, 185, 129, 0.3)',
          padding: 'clamp(6px 12px, 2vw, 8px 16px)',
          borderRadius: '8px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: 'clamp(13px, 2.8vw, 14px)',
          fontWeight: 'bold',
          maxWidth: '90%'
        }}
      >
        <span>✓</span>
        <span>
          {(apiResult ? getUniquenessScore(apiResult, inputText) : inputText.trim() ? 100 : 0) >= 80
            ? 'Highly Original Content'
            : (apiResult ? getUniquenessScore(apiResult, inputText) : 0) >= 60
            ? 'Good Uniqueness Level'
            : 'Needs Improvement'}
        </span>
      </div>
    </div>

    {/* Stats Grid */}
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: screenSize.isMobile ? '1fr' : 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: 'clamp(12px, 3vw, 16px)',
      marginBottom: '16px'
    }}>
      
    </div>

    {/* Footer Note */}
    <div style={{
      marginTop: '16px',
      padding: 'clamp(10px, 2.5vw, 12px)',
      background: 'rgba(16, 185, 129, 0.05)',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <p style={{
        color: '#10b981',
        fontSize: 'clamp(12px, 2.5vw, 13px)',
        fontWeight: '500',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        <CheckIcon />
        <span>AI-powered paraphrasing with contextual understanding</span>
      </p>
    </div>

    <style>{`
      @keyframes rotateCircle {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
)}


      </div>
    </div>
  );
};

export default PlagiarismRemover;