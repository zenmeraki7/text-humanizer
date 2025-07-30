import React, { useState, useEffect } from 'react';

// Icon components (same as MainContent)
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

const AnalyzeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 8.12,16.5 8.91,15.77L10.32,17.18C9.89,17.96 9.16,18.68 8.28,19.25C7.86,18.83 7.46,18.57 7.07,18.28M16.93,18.28C16.54,18.57 16.14,18.83 15.72,19.25C14.84,18.68 14.11,17.96 13.68,17.18L15.09,15.77C15.88,16.5 16.5,17.38 16.93,18.28M12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M7.07,5.72C7.46,5.43 7.86,5.17 8.28,4.75C9.16,5.32 9.89,6.04 10.32,6.82L8.91,8.23C8.12,7.5 7.5,6.62 7.07,5.72M16.93,5.72C16.5,6.62 15.88,7.5 15.09,8.23L13.68,6.82C14.11,6.04 14.84,5.32 15.72,4.75C16.14,5.17 16.54,5.43 16.93,5.72Z"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"/>
  </svg>
);

const LightBulbIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z"/>
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

const Detector = ({ sidebarOpen = false }) => {
  const [text, setText] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animateScore, setAnimateScore] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isPrimaryHovered, setIsPrimaryHovered] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const drawerWidth = 280;
  const collapsedDrawerWidth = 64;

  // All original analyze logic remains unchanged
  const analyzeText = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setAnimateScore(false);

    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ text: text.trim() })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Analysis failed: ${errorText}`);
      }

      const data = await response.json();
      
      if (!data || typeof data.ai_score === 'undefined') {
        throw new Error('Invalid response from server');
      }

      setResults(data);
      
      // Animate score after a short delay
      setTimeout(() => setAnimateScore(true), 300);

    } catch (err) {
      setError(err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  // All original helper functions remain unchanged
  const getClassification = (score) => {
    if (score >= 80) return 'HIGHLY LIKELY AI-GENERATED';
    if (score >= 60) return 'LIKELY AI-GENERATED';
    if (score >= 40) return 'POSSIBLY AI-GENERATED';
    if (score >= 20) return 'LIKELY HUMAN-WRITTEN';
    return 'HIGHLY LIKELY HUMAN-WRITTEN';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#ef4444';
    if (score >= 60) return '#f97316';
    if (score >= 40) return '#eab308';
    if (score >= 20) return '#22c55e';
    return '#10b981';
  };

  const getConfidenceColor = (score) => {
    if (score >= 80) return '#fef2f2';
    if (score >= 60) return '#fff7ed';
    if (score >= 40) return '#fefce8';
    if (score >= 20) return '#f0fdf4';
    return '#ecfdf5';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return '🤖';
    if (score >= 60) return '⚠️';
    if (score >= 40) return '🔍';
    if (score >= 20) return '✅';
    return '👤';
  };

  // New styling to match MainContent
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
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: '1.2',
  };

  const chipStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#f97316',
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
    border: '1px solid rgba(99, 102, 241, 0.2)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  };

  const textareaStyles = {
    width: '100%',
    height: '256px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '8px',
    padding: '16px',
    color: '#fff',
    fontSize: '16px',
    fontFamily: 'inherit',
    resize: 'none',
    outline: 'none',
    transition: 'border-color 0.2s ease-in-out',
    boxSizing: 'border-box',
  };

  const actionButtonStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '16px 24px',
    border: '1px solid rgba(99, 102, 241, 0.3)',
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
    borderColor: '#6366f1',
    color: '#fff',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  };

  const primaryButtonStyles = {
    padding: '12px 32px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    border: 'none',
    color: '#fff',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 600,
    transition: 'all 0.2s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const primaryButtonHoverStyles = {
    background: 'linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
  };

  const outputButtonStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    backgroundColor: 'transparent',
    color: '#a1a1aa',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s ease-in-out',
  };

  const outputButtonHoverStyles = {
    borderColor: '#6366f1',
    color: '#fff',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  };

  const tipsContainerStyles = {
    marginTop: '24px',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.03) 100%)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'all 0.3s ease-in-out',
    marginBottom: '24px',
  };

  const tipsHeaderStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    borderBottom: showTips ? '1px solid rgba(99, 102, 241, 0.2)' : 'none',
  };

  const tipsContentStyles = {
    maxHeight: showTips ? '600px' : '0',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    padding: showTips ? '20px' : '0 20px',
  };

  // Sample texts
  const handleSampleText = (sampleText) => {
    setText(sampleText);
  };

  const handlePasteText = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (err) {
      console.log('Failed to read clipboard contents: ', err);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(results, null, 2));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const tips = [
    {
      title: "Use Varied Content",
      description: "Try different types of text - formal, casual, technical, or creative to see detection patterns",
      icon: "📝"
    },
    {
      title: "Check Length Requirements",
      description: "Works best with 20-2000 words. Very short texts may not provide reliable results",
      icon: "📏"
    },
    {
      title: "Understand the Scores",
      description: "Higher scores indicate more AI-like patterns. Use multiple samples for better assessment",
      icon: "📊"
    },
    {
      title: "Review Pattern Details",
      description: "Check the detected patterns section to understand what triggers AI detection",
      icon: "🔍"
    },
    {
      title: "Consider Context",
      description: "Some formal or technical writing naturally appears more AI-like even when human-written",
      icon: "🎯"
    }
  ];

  return (
    <div style={mainContentStyles}>
      <style>{`
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0 !important;
            padding: 16px !important;
          }
          
          .title {
            font-size: 2rem !important;
          }
          
          .action-buttons {
            grid-template-columns: 1fr !important;
          }
          
          .textarea {
            height: 200px !important;
          }
          
          .card {
            padding: 16px !important;
          }
        }
        
        @media (max-width: 480px) {
          .title {
            font-size: 1.5rem !important;
          }
          
          .chip {
            padding: 6px 12px !important;
            font-size: 14px !important;
          }
        }

        .tip-item:hover {
          background: rgba(99, 102, 241, 0.08) !important;
          border-color: rgba(99, 102, 241, 0.3) !important;
          transform: translateY(-2px);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.1);
        }

        .tips-header:hover {
          background: rgba(99, 102, 241, 0.05);
        }

        .icon-emoji {
          font-size: 20px;
          padding: 8px;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 36px;
          height: 36px;
        }

        .score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 8px solid #374151;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          background: rgba(0, 0, 0, 0.3);
          transition: all 0.5s ease-in-out;
        }

        .score-circle.animate {
          border-color: var(--color);
          box-shadow: 0 0 20px var(--color);
        }

        .score-percentage {
          font-size: 24px;
          font-weight: bold;
          color: #fff;
        }

        .score-label {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 4px;
        }

        .pattern-card {
          background: rgba(99, 102, 241, 0.05);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 8px;
          padding: 16px;
          animation: slideInUp 0.5s ease-out forwards;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Header */}
      <div className="header" style={headerStyles}>
        <h1 className="title" style={titleStyles}>
          AI Content Detection & Analysis
        </h1>
        
        <div 
          className="chip"
          style={chipStyles}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          🔍 Advanced AI Pattern Detection →
        </div>
      </div>

      {/* Main Content Card */}
      <div className="card" style={cardStyles}>
        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Input and Results Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: results ? '1fr 1fr' : '1fr',
          gap: '24px',
          marginBottom: '24px'
        }}>
          {/* Input Section */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <h3 style={{ 
                color: '#f8fafc', 
                fontSize: '18px', 
                fontWeight: '600', 
                margin: 0 
              }}>
                Text to Analyze
              </h3>
              <div style={{ display: 'flex', gap: '8px', color: '#94a3b8', fontSize: '14px' }}>
                <span>Characters: {text.length}</span>
                <span>Words: {text.trim() ? text.trim().split(/\s+/).length : 0}</span>
              </div>
            </div>
            <textarea
              className="textarea"
              style={textareaStyles}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your text here for AI detection analysis...

✨ Pro tip: Try different types of content to see how our advanced AI detection works!"
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)'}
            />
          </div>

          {/* Results Section - Only show when there are results */}
          {results && (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <h3 style={{ 
                  color: '#f8fafc', 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  margin: 0 
                }}>
                  Detection Results
                </h3>
              </div>

              {/* Results Display */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '8px',
                padding: '16px',
                height: '256px',
                overflow: 'auto'
              }}>
                {/* Main Score Display */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                    <div 
                      className={`score-circle ${animateScore ? 'animate' : ''}`}
                      style={{ 
                        '--score': results.ai_score,
                        '--color': getScoreColor(results.ai_score)
                      }}
                    >
                      <div className="score-percentage">
                        {results.ai_score?.toFixed(1) || 0}%
                      </div>
                      <div className="score-label">AI Score</div>
                    </div>
                  </div>

                  <div 
                    style={{ 
                      backgroundColor: getConfidenceColor(results.ai_score),
                      color: getScoreColor(results.ai_score),
                      border: `2px solid ${getScoreColor(results.ai_score)}20`,
                      padding: '8px 16px',
                      borderRadius: '8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    <span>{getScoreIcon(results.ai_score)}</span>
                    <span>{getClassification(results.ai_score)}</span>
                  </div>

                  <div style={{ 
                    marginTop: '8px', 
                    color: '#94a3b8', 
                    fontSize: '14px' 
                  }}>
                    Confidence: <span style={{ color: getScoreColor(results.ai_score) }}>
                      {results.confidence || 'High'}
                    </span>
                  </div>
                </div>

                {/* Pattern Analysis - Compact */}
                {results.patterns && Object.keys(results.patterns).length > 0 && (
                  <div>
                    <h4 style={{ color: '#f8fafc', fontSize: '14px', marginBottom: '8px' }}>
                      📊 Detected Patterns ({Object.keys(results.patterns).length} categories)
                    </h4>
                    <div style={{ display: 'grid', gap: '8px', fontSize: '12px' }}>
                      {Object.entries(results.patterns).slice(0, 3).map(([category, data]) => (
                        <div key={category} style={{
                          background: 'rgba(99, 102, 241, 0.05)',
                          border: '1px solid rgba(99, 102, 241, 0.2)',
                          borderRadius: '4px',
                          padding: '8px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>
                              {category.replace(/_/g, ' ').toUpperCase()}
                            </span>
                            <span style={{ color: getScoreColor(data.score || 0) }}>
                              {data.score || 0}
                            </span>
                          </div>
                          {data.indicators && data.indicators.length > 0 && (
                            <div style={{ color: '#94a3b8', marginTop: '4px' }}>
                              {data.indicators.length} indicators found
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Copy button below the results box */}
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                marginTop: '12px',
                justifyContent: 'flex-end'
              }}>
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
                  <CopyIcon />
                  {copySuccess ? 'Copied!' : 'Copy Results'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { icon: UploadIcon, text: 'Upload File', id: 'upload', action: () => {} },
            { icon: DocumentIcon, text: 'Try Sample Text', id: 'sample', action: () => handleSampleText("In today's fast-paced world, it is important to note that leveraging cutting-edge AI technologies will ultimately transform business paradigms. With that being said, organizations must optimize their synergy to achieve unprecedented results.") },
            { icon: PasteIcon, text: 'Paste Text', id: 'paste', action: handlePasteText }
          ].map((item) => (
            <button
              key={item.id}
              className="action-button"
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
            <span style={{ color: '#a1a1aa', fontSize: '16px' }}>Advanced Detection Mode</span>
          </div>

          <button
            disabled={loading || !text.trim()}
            style={{
              ...primaryButtonStyles,
              ...(isPrimaryHovered && !loading && text.trim() ? primaryButtonHoverStyles : {}),
              opacity: (loading || !text.trim()) ? 0.6 : 1,
              cursor: (loading || !text.trim()) ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={() => !loading && text.trim() && setIsPrimaryHovered(true)}
            onMouseLeave={() => setIsPrimaryHovered(false)}
            onClick={analyzeText}
          >
            {loading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: '2px solid #fff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Analyzing...
              </>
            ) : (
              <>
                <AnalyzeIcon />
                Analyze Text
              </>
            )}
          </button>
        </div>

        {/* Expanded Results Section - Shows below when results exist */}
        {results && (
          <div style={{
            marginTop: '24px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.03) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 style={{ color: '#f8fafc', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              📊 Detailed Analysis Results
            </h3>

            {/* Pattern Analysis - Full */}
            {results.patterns && Object.keys(results.patterns).length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#f8fafc', fontSize: '16px', marginBottom: '12px' }}>
                  Detected Patterns ({Object.keys(results.patterns).length} categories)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
                  {Object.entries(results.patterns).map(([category, data], index) => (
                    <div 
                      key={category} 
                      className="pattern-card"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h5 style={{ color: '#f8fafc', fontSize: '14px', fontWeight: 'bold', margin: 0 }}>
                          {category.replace(/_/g, ' ').toUpperCase()}
                        </h5>
                        <div style={{ color: getScoreColor(data.score || 0), fontWeight: 'bold' }}>
                          Score: {data.score || 0}
                        </div>
                      </div>
                      
                      {data.indicators && data.indicators.length > 0 && (
                        <div>
                          <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>
                            Found {data.indicators.length} indicators:
                          </div>
                          <div style={{ maxHeight: '80px', overflow: 'auto' }}>
                            {data.indicators.slice(0, 3).map((indicator, idx) => (
                              <div key={idx} style={{ display: 'flex', gap: '6px', marginBottom: '4px', fontSize: '12px' }}>
                                <span style={{ color: '#6366f1' }}>•</span>
                                <span style={{ color: '#94a3b8' }}>"{indicator}"</span>
                              </div>
                            ))}
                            {data.indicators.length > 3 && (
                              <div style={{ color: '#6366f1', fontSize: '12px', fontStyle: 'italic' }}>
                                +{data.indicators.length - 3} more...
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Analysis */}
            {results.technical_details && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#f8fafc', fontSize: '16px', marginBottom: '12px' }}>
                  🔍 Technical Analysis
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                  {[
                    { icon: '📊', value: results.technical_details.total_patterns || 0, label: 'Total Patterns' },
                    { icon: '📝', value: results.technical_details.word_count || 0, label: 'Words Analyzed' },
                    { icon: '📈', value: `${results.technical_details.pattern_density?.toFixed(1) || 0}%`, label: 'Pattern Density' },
                    { icon: '🎯', value: Object.keys(results.patterns || {}).length, label: 'Categories' }
                  ].map((item, index) => (
                    <div key={index} style={{
                      background: 'rgba(99, 102, 241, 0.05)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      borderRadius: '8px',
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '20px', marginBottom: '4px' }}>{item.icon}</div>
                      <div style={{ color: '#f8fafc', fontSize: '18px', fontWeight: 'bold', marginBottom: '2px' }}>
                        {item.value}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => {
                  setText('');
                  setResults(null);
                  setError(null);
                }}
                style={{
                  ...primaryButtonStyles,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                ✨ Analyze New Text
              </button>
              
              <button 
                onClick={handleCopy}
                style={{
                  ...primaryButtonStyles,
                  background: 'transparent',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  color: '#a1a1aa'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.color = '#fff';
                  e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                  e.target.style.color = '#a1a1aa';
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                📋 Copy Results
              </button>
            </div>
          </div>
        )}

        {/* Quick Test Samples */}
        <div style={{
          marginTop: '24px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.03) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{ color: '#f8fafc', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            🧪 Quick Test Samples
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>
            Try these pre-made samples to see how our AI detection works:
          </p>
          
          <div className='quick-samples-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',gridTemplateRows: 'repeat(2, 1fr)', gap: '12px' }}>
            {[
              {
                icon: '🤖',
                title: 'High AI Text',
                subtitle: 'Expected: ~90% AI',
                bgColor: 'rgba(239, 68, 68, 0.1)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                text: "In today's fast-paced world, it is important to note that leveraging cutting-edge AI technologies will ultimately transform business paradigms. With that being said, organizations must optimize their synergy to achieve unprecedented results."
              },
              {
                icon: '🟡',
                title: 'Medium AI Text',
                subtitle: 'Expected: ~50% AI',
                bgColor: 'rgba(234, 179, 8, 0.1)',
                borderColor: 'rgba(234, 179, 8, 0.3)',
                text: "The weather was nice today. However, it is important to note that climate change is a significant challenge. We should consider various solutions for this pressing issue."
              },
              {
                icon: '👤',
                title: 'Human Text',
                subtitle: 'Expected: ~10% AI',
                bgColor: 'rgba(34, 197, 94, 0.1)',
                borderColor: 'rgba(34, 197, 94, 0.3)',
                text: "Grabbed coffee this morning and the barista had this amazing purple hair. She convinced me to try their lavender latte instead of my usual black coffee. Honestly wasn't terrible - might go back tomorrow if I'm not running late again."
              },
              {
                icon: '🎭',
                title: 'Dramatic AI',
                subtitle: 'Expected: ~95% AI',
                bgColor: 'rgba(168, 85, 247, 0.1)',
                borderColor: 'rgba(168, 85, 247, 0.3)',
                text: "But here's the truth no one wants to say out loud: that's the catch with social media algorithms. Here's what nobody mentions - until something does break. Usually it's you who pays the price."
              }
            ].map((sample, index) => (
              <button 
                key={index}
                onClick={() => setText(sample.text)}
                style={{
                  background: sample.bgColor,
                  border: `1px solid ${sample.borderColor}`,
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = `0 4px 12px ${sample.borderColor}`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ fontSize: '20px' }}>{sample.icon}</div>
                  <div>
                    <div style={{ color: '#f8fafc', fontSize: '14px', fontWeight: 'bold' }}>
                      {sample.title}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                      {sample.subtitle}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

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
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                borderRadius: '8px',
                color: '#fff'
              }}>
                <LightBulbIcon />
              </div>
              <div>
                <h3 style={{
                  color: '#f8fafc',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: 0,
                  marginBottom: '2px'
                }}>
                  Pro Tips for Accurate Detection
                </h3>
                <p style={{
                  color: '#94a3b8',
                  fontSize: '14px',
                  margin: 0
                }}>
                  {showTips ? 'Click to hide tips' : 'Click to view detection tips'}
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
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    padding: '16px',
                    background: 'rgba(99, 102, 241, 0.03)',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease-in-out',
                  }}
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
                    color: '#10b981',
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
              background: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{
                color: '#10b981',
                fontSize: '14px',
                fontWeight: '500',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <CheckIcon />
                Advanced pattern detection with 95%+ accuracy
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Detector;