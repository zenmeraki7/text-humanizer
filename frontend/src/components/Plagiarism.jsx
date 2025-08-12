import React, { useState } from 'react';

// Icon components
const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
  </svg>
);

const DocumentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"/>
  </svg>
);

const PasteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19,20H5V4H7V7H17V4H19M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M19,2H14.82C14.4,0.84 13.3,0 12,0C10.7,0 9.6,0.84 9.18,2H5A2,2 0 0,0 3,4V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V4A2,2 0 0,0 19,2Z"/>
  </svg>
);

const MagicWandIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.5,5.6L5,7L6.4,4.5L5,2L7.5,3.4L10,2L8.6,4.5L10,7L7.5,5.6M19.5,15.4L22,14L20.6,16.5L22,19L19.5,17.6L17,19L18.4,16.5L17,14L19.5,15.4M22,2L20.6,4.5L22,7L19.5,5.6L17,7L18.4,4.5L17,2L19.5,3.4L22,2M13.34,12.78L15.78,10.34L13.66,8.22L11.22,10.66L13.34,12.78M14.37,7.29L16.71,9.63C17.1,10 17.1,10.65 16.71,11.04L5.04,22.71C4.65,23.1 4,23.1 3.63,22.71L1.29,20.37C0.9,20 0.9,19.35 1.29,18.96L12.96,7.29C13.35,6.9 14,6.9 14.37,7.29Z"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/>
  </svg>
);

const CompareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19,3H14.82C14.4,0.84 13.3,0 12,0C10.7,0 9.6,0.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M7,7H17V9H7V7M7,11H17V13H7V11M7,15H17V17H7V15Z"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
  </svg>
);

const drawerWidth = 280;
const collapsedDrawerWidth = 64;

const PlagiarismRemover = ({ sidebarOpen }) => {
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState('Academic');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isPrimaryHovered, setIsPrimaryHovered] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [processedText, setProcessedText] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const modes = ['Academic', 'Creative', 'Professional', 'Casual'];

  const tips = [
    {
      title: "Original Context Preservation",
      description: "Our tool maintains the core meaning while restructuring sentences and replacing synonyms",
      icon: "🎯"
    },
    {
      title: "Choose Appropriate Mode",
      description: "Academic for research papers, Creative for articles, Professional for business content",
      icon: "⚙️"
    },
    {
      title: "Multiple Iterations",
      description: "Run the tool multiple times for better results, especially for heavily flagged content",
      icon: "🔄"
    },
    {
      title: "Manual Review Required",
      description: "Always review and edit the output to ensure accuracy and natural flow",
      icon: "👁️"
    },
    {
      title: "Citation Best Practices",
      description: "Remember to properly cite sources even after paraphrasing to maintain academic integrity",
      icon: "📚"
    }
  ];

  const mainContentStyles = {
    marginLeft: sidebarOpen ? drawerWidth : collapsedDrawerWidth,
    transition: 'margin-left 0.3s ease-in-out',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    padding: '24px',
    margin: 0,
    marginTop: 0,
  };

  const headerStyles = {
    textAlign: 'center',
    marginBottom: '32px',
  };

  const titleStyles = {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '16px',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: '1.2',
  };

  const chipStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#8b5cf6',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out',
  };

  const cardStyles = {
    maxWidth: '1024px',
    margin: '0 auto',
    background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.5) 0%, rgba(22, 33, 62, 0.3) 100%)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  };

  const textareaStyles = {
    width: '100%',
    height: '256px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '8px',
    padding: '16px',
    color: '#fff',
    fontSize: '16px',
    fontFamily: 'inherit',
    resize: 'none',
    outline: 'none',
    marginBottom: '24px',
    transition: 'border-color 0.2s ease-in-out',
    boxSizing: 'border-box',
  };

  const actionButtonStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '16px 24px',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    backgroundColor: 'transparent',
    color: '#a1a1aa',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 500,
    transition: 'all 0.2s ease-in-out',
    width: '100%',
  };

  const actionButtonHoverStyles = {
    borderColor: '#8b5cf6',
    color: '#fff',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  };

  const primaryButtonStyles = {
    padding: '12px 32px',
    background: isProcessing 
      ? 'linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%)' 
      : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    border: 'none',
    color: '#fff',
    borderRadius: '8px',
    cursor: isProcessing ? 'not-allowed' : 'pointer',
    fontSize: '16px',
    fontWeight: 600,
    transition: 'all 0.2s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    opacity: isProcessing ? 0.8 : 1,
  };

  const primaryButtonHoverStyles = {
    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
  };

  const selectStyles = {
    position: 'relative',
    minWidth: '128px',
  };

  const selectButtonStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#374151',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    color: '#fff',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'border-color 0.2s ease-in-out',
  };

  const dropdownStyles = {
    position: 'absolute',
    top: '48px',
    left: 0,
    right: 0,
    backgroundColor: '#374151',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
  };

  const tipsContainerStyles = {
    marginTop: '24px',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(124, 58, 237, 0.03) 100%)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'all 0.3s ease-in-out',
  };

  const tipsHeaderStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    borderBottom: showTips ? '1px solid rgba(139, 92, 246, 0.2)' : 'none',
  };

  const tipsContentStyles = {
    maxHeight: showTips ? '500px' : '0',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    padding: showTips ? '20px' : '0 20px',
  };

  const tipItemStyles = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '16px',
    background: 'rgba(139, 92, 246, 0.03)',
    border: '1px solid rgba(139, 92, 246, 0.1)',
    borderRadius: '8px',
    marginBottom: '12px',
    transition: 'all 0.2s ease-in-out',
  };

  const resultCardStyles = {
    marginTop: '24px',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '12px',
    padding: '24px',
    animation: 'slideInUp 0.5s ease-out',
  };

  const comparisonStyles = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginTop: '20px',
  };

  const spinnerStyles = {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    animation: 'spinner 1s linear infinite',
  };

  const handleSampleText = () => {
    setInputText("Climate change represents one of the most significant challenges facing humanity in the 21st century. Rising global temperatures, caused primarily by greenhouse gas emissions from human activities, are leading to widespread environmental, economic, and social consequences. Scientists have documented increasing frequency of extreme weather events, melting ice caps, rising sea levels, and shifts in precipitation patterns. These changes threaten ecosystems, agricultural productivity, and human settlements worldwide.");
  };

  const handlePasteText = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (err) {
      console.log('Failed to read clipboard contents: ', err);
    }
  };

  const handleProcessText = () => {
    if (inputText.trim()) {
      setIsProcessing(true);
      
      // Simulate processing
      setTimeout(() => {
        // Simple text transformation for demo
        const sentences = inputText.split('. ');
        const processedSentences = sentences.map(sentence => {
          return sentence
            .replace(/represents/g, 'constitutes')
            .replace(/significant/g, 'substantial')
            .replace(/challenges/g, 'difficulties')
            .replace(/humanity/g, 'mankind')
            .replace(/primarily/g, 'mainly')
            .replace(/widespread/g, 'extensive')
            .replace(/documented/g, 'recorded')
            .replace(/increasing/g, 'growing')
            .replace(/threaten/g, 'endanger');
        });
        
        setProcessedText(processedSentences.join('. '));
        setShowComparison(true);
        setIsProcessing(false);
      }, 3000);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(processedText);
      alert('Text copied to clipboard!');
    } catch (err) {
      console.log('Failed to copy text: ', err);
    }
  };

  return (
    <div style={mainContentStyles}>
      <style>{`
        @keyframes tipGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(139, 92, 246, 0.2);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spinner {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .tip-item:hover {
          background: rgba(139, 92, 246, 0.08) !important;
          border-color: rgba(139, 92, 246, 0.3) !important;
          transform: translateY(-2px);
          animation: tipGlow 2s ease-in-out infinite;
        }

        .tips-header:hover {
          background: rgba(139, 92, 246, 0.05);
        }

        .icon-emoji {
          font-size: 20px;
          padding: 8px;
          background: rgba(139, 92, 246, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 36px;
          height: 36px;
        }

        .comparison-text {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 8px;
          padding: 16px;
          color: #e2e8f0;
          line-height: 1.6;
          font-size: 14px;
          max-height: 300px;
          overflow-y: auto;
        }
      `}</style>

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
          ✨ Advanced Paraphrasing Technology →
        </div>
      </div>

      {/* Main Content Card */}
      <div style={cardStyles}>
        {/* Text Input Area */}
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste the text you want to remove plagiarism from here..."
          style={textareaStyles}
          onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)'}
        />

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { icon: UploadIcon, text: 'Upload File', id: 'upload', action: () => {} },
            { icon: DocumentIcon, text: 'Try A Sample', id: 'sample', action: handleSampleText },
            { icon: PasteIcon, text: 'Paste Text', id: 'paste', action: handlePasteText }
          ].map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              style={{
                ...actionButtonStyles,
                ...(hoveredButton === item.id ? actionButtonHoverStyles : {}),
              }}
              onMouseEnter={() => setHoveredButton(item.id)}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <item.icon />
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
                  {modes.map((modeOption) => (
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
                        borderRadius: modeOption === modes[0] ? '8px 8px 0 0' : modeOption === modes[modes.length - 1] ? '0 0 8px 8px' : '0',
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
                onClick={copyToClipboard}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <CopyIcon />
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
            
            <div style={{ 
              marginTop: '20px', 
              padding: '16px', 
              background: 'rgba(139, 92, 246, 0.1)', 
              borderRadius: '8px',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>95%</div>
                  <div style={{ fontSize: '14px', color: '#94a3b8' }}>Uniqueness</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
                    {inputText.trim().split(' ').length}
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

            <div style={{
              marginTop: '20px',
              padding: '16px',
              background: 'rgba(139, 92, 246, 0.05)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
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