// DetectorComponents.jsx - Responsive UI components for the Detector
import React from 'react';
// Correct import path: go up one level to components folder, then access Icons.jsx
import { CopyIcon, LightBulbIcon, CheckIcon, ChevronDownIcon, DocumentIcon } from '../Icons';
import { getScoreColor, getConfidenceColor, getScoreIcon, getClassification } from './utils';

// Header Component
export const DetectorHeader = () => {
  const headerStyles = {
    textAlign: 'center',
    marginBottom: 'clamp(20px, 4vw, 32px)',
    padding: '0 16px',
  };

  const titleStyles = {
    fontSize: 'clamp(1.8rem, 5vw, 3rem)',
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
    gap: 'clamp(4px, 1vw, 8px)',
    backgroundColor: '#f97316',
    color: '#fff',
    padding: 'clamp(6px 12px, 2vw, 8px 16px)',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out',
    fontSize: 'clamp(12px, 2.5vw, 14px)',
    maxWidth: '100%',
    textAlign: 'center',
    wordBreak: 'break-word',
  };

  return (
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
        🔍 Advanced AI Pattern Detection + Local File Processing 🔒
      </div>
    </div>
  );
};

// Error Message Component
export const ErrorMessage = ({ error }) => {
  if (!error) return null;

  const isSuccess = error.startsWith('✅');

  return (
    <div style={{
      background: isSuccess ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
      border: isSuccess ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
      color: isSuccess ? '#34d399' : '#fca5a5',
      padding: 'clamp(8px, 2vw, 12px)',
      borderRadius: '8px',
      marginBottom: '16px',
      fontSize: 'clamp(12px, 2.5vw, 14px)',
      wordBreak: 'break-word',
    }}>
      {error}
    </div>
  );
};

// File Info Display Component
export const FileInfoDisplay = ({ uploadedFile, error }) => {
  if (!uploadedFile || error?.startsWith('Failed')) return null;

  return (
    <div style={{
      marginBottom: '16px',
      padding: 'clamp(8px 12px, 2vw, 12px 16px)',
      background: 'rgba(99, 102, 241, 0.1)',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      borderRadius: '8px',
      color: '#a78bfa',
      fontSize: 'clamp(12px, 2.5vw, 14px)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap',
    }}>
      <DocumentIcon />
      <span style={{ wordBreak: 'break-word', flex: '1', minWidth: '200px' }}>
        <strong>{uploadedFile.name}</strong> ({(uploadedFile.size / 1024).toFixed(1)} KB) - 
        Text extracted locally in your browser 🔒
      </span>
    </div>
  );
};

// Score Circle Component
export const ScoreCircle = ({ results, animateScore }) => {
  const circleSize = window.innerWidth < 480 ? 100 : window.innerWidth < 768 ? 110 : 120;
  
  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <div 
          className={`score-circle ${animateScore ? 'animate' : ''}`}
          style={{ 
            '--score': results.ai_score,
            '--color': getScoreColor(results.ai_score),
            width: `${circleSize}px`,
            height: `${circleSize}px`,
            border: `${window.innerWidth < 480 ? 6 : 8}px solid #374151`,
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            background: 'rgba(0, 0, 0, 0.3)',
            transition: 'all 0.5s ease-in-out',
          }}
        >
          <div className="score-percentage" style={{
            fontSize: `clamp(18px, 4vw, 24px)`,
            fontWeight: 'bold',
            color: '#fff'
          }}>
            {results.ai_score?.toFixed(1) || 0}%
          </div>
          <div className="score-label" style={{
            fontSize: 'clamp(10px, 2vw, 12px)',
            color: '#94a3b8',
            marginTop: '4px'
          }}>
            AI Score
          </div>
        </div>
      </div>

      <div 
        style={{ 
          backgroundColor: getConfidenceColor(results.ai_score),
          color: getScoreColor(results.ai_score),
          border: `2px solid ${getScoreColor(results.ai_score)}20`,
          padding: 'clamp(6px 12px, 2vw, 8px 16px)',
          borderRadius: '8px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: 'clamp(12px, 2.5vw, 14px)',
          fontWeight: 'bold',
          maxWidth: '90%',
          wordBreak: 'break-word'
        }}
      >
        <span>{getScoreIcon(results.ai_score)}</span>
        <span>{getClassification(results.ai_score)}</span>
      </div>

      <div style={{ 
        marginTop: '8px', 
        color: '#94a3b8', 
        fontSize: 'clamp(12px, 2.5vw, 14px)'
      }}>
        Confidence: <span style={{ color: getScoreColor(results.ai_score) }}>
          {results.confidence || 'High'}
        </span>
      </div>
    </div>
  );
};

// Compact Pattern Analysis Component
export const CompactPatternAnalysis = ({ results }) => {
  if (!results.patterns || Object.keys(results.patterns).length === 0) return null;

  return (
    <div>
      <h4 style={{ 
        color: '#f8fafc', 
        fontSize: 'clamp(12px, 2.5vw, 14px)', 
        marginBottom: '8px',
        wordBreak: 'break-word'
      }}>
        📊 Detected Patterns ({Object.keys(results.patterns).length} categories)
      </h4>
      <div style={{ 
        display: 'grid', 
        gap: '8px', 
        fontSize: 'clamp(10px, 2vw, 12px)',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
      }}>
        {Object.entries(results.patterns).slice(0, 3).map(([category, data]) => (
          <div key={category} style={{
            background: 'rgba(99, 102, 241, 0.05)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '4px',
            padding: 'clamp(6px, 2vw, 8px)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
              <span style={{ 
                color: '#f8fafc', 
                fontWeight: 'bold',
                fontSize: 'clamp(10px, 2vw, 12px)',
                wordBreak: 'break-word',
                flex: '1',
                minWidth: '120px'
              }}>
                {category.replace(/_/g, ' ').toUpperCase()}
              </span>
              <span style={{ 
                color: getScoreColor(data.score || 0),
                fontSize: 'clamp(10px, 2vw, 12px)',
                whiteSpace: 'nowrap'
              }}>
                {data.score || 0}
              </span>
            </div>
            {data.indicators && data.indicators.length > 0 && (
              <div style={{ 
                color: '#94a3b8', 
                marginTop: '4px',
                fontSize: 'clamp(9px, 1.8vw, 11px)'
              }}>
                {data.indicators.length} indicators found
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Copy Button Component
export const CopyButton = ({ onCopy, copySuccess, styles }) => {
  return (
    <div style={{ 
      display: 'flex', 
      gap: '8px', 
      marginTop: '12px',
      justifyContent: 'flex-end',
      flexWrap: 'wrap'
    }}>
      <button
        onClick={onCopy}
        style={{
          ...styles.outputButtonStyles,
          ...(copySuccess ? { color: '#10b981', borderColor: '#10b981' } : {}),
          fontSize: 'clamp(12px, 2.5vw, 14px)',
          padding: 'clamp(6px 12px, 2vw, 8px 16px)',
          minWidth: 'fit-content'
        }}
        onMouseEnter={(e) => {
          if (!copySuccess) {
            Object.assign(e.target.style, styles.outputButtonHoverStyles);
          }
        }}
        onMouseLeave={(e) => {
          if (!copySuccess) {
            Object.assign(e.target.style, styles.outputButtonStyles);
          }
        }}
      >
        <CopyIcon />
        {copySuccess ? 'Copied!' : 'Copy Results'}
      </button>
    </div>
  );
};

// Full Pattern Analysis Component
export const FullPatternAnalysis = ({ results }) => {
  if (!results.patterns || Object.keys(results.patterns).length === 0) return null;

  return (
    <div style={{ marginBottom: '20px' }}>
      <h4 style={{ 
        color: '#f8fafc', 
        fontSize: 'clamp(14px, 3vw, 16px)', 
        marginBottom: '12px',
        wordBreak: 'break-word'
      }}>
        Detected Patterns ({Object.keys(results.patterns).length} categories)
      </h4>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: 'clamp(8px, 2vw, 12px)'
      }}>
        {Object.entries(results.patterns).map(([category, data], index) => (
          <div 
            key={category} 
            className="pattern-card"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              background: 'rgba(99, 102, 241, 0.05)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '8px',
              padding: 'clamp(12px, 3vw, 16px)',
              animation: 'slideInUp 0.5s ease-out forwards'
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: '8px',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <h5 style={{ 
                color: '#f8fafc', 
                fontSize: 'clamp(12px, 2.5vw, 14px)', 
                fontWeight: 'bold', 
                margin: 0,
                wordBreak: 'break-word',
                flex: '1',
                minWidth: '120px'
              }}>
                {category.replace(/_/g, ' ').toUpperCase()}
              </h5>
              <div style={{ 
                color: getScoreColor(data.score || 0), 
                fontWeight: 'bold',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                whiteSpace: 'nowrap'
              }}>
                Score: {data.score || 0}
              </div>
            </div>
            
            {data.indicators && data.indicators.length > 0 && (
              <div>
                <div style={{ 
                  color: '#94a3b8', 
                  fontSize: 'clamp(10px, 2vw, 12px)', 
                  marginBottom: '6px' 
                }}>
                  Found {data.indicators.length} indicators:
                </div>
                <div style={{ maxHeight: '80px', overflow: 'auto' }}>
                  {data.indicators.slice(0, 3).map((indicator, idx) => (
                    <div key={idx} style={{ 
                      display: 'flex', 
                      gap: '6px', 
                      marginBottom: '4px', 
                      fontSize: 'clamp(10px, 2vw, 12px)',
                      alignItems: 'flex-start'
                    }}>
                      <span style={{ color: '#6366f1', minWidth: '8px' }}>•</span>
                      <span style={{ 
                        color: '#94a3b8', 
                        wordBreak: 'break-word',
                        lineHeight: '1.4'
                      }}>"{indicator}"</span>
                    </div>
                  ))}
                  {data.indicators.length > 3 && (
                    <div style={{ 
                      color: '#6366f1', 
                      fontSize: 'clamp(10px, 2vw, 12px)', 
                      fontStyle: 'italic' 
                    }}>
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
  );
};

// Technical Analysis Component
export const TechnicalAnalysis = ({ results }) => {
  if (!results.technical_details) return null;

  return (
    <div style={{ marginBottom: '20px' }}>
      <h4 style={{ 
        color: '#f8fafc', 
        fontSize: 'clamp(14px, 3vw, 16px)', 
        marginBottom: '12px',
        wordBreak: 'break-word'
      }}>
        🔍 Technical Analysis
      </h4>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
        gap: 'clamp(8px, 2vw, 12px)'
      }}>
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
            padding: 'clamp(8px, 2vw, 12px)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 'clamp(16px, 4vw, 20px)', marginBottom: '4px' }}>{item.icon}</div>
            <div style={{ 
              color: '#f8fafc', 
              fontSize: 'clamp(14px, 3vw, 18px)', 
              fontWeight: 'bold', 
              marginBottom: '2px',
              wordBreak: 'break-word'
            }}>
              {item.value}
            </div>
            <div style={{ 
              color: '#94a3b8', 
              fontSize: 'clamp(10px, 2vw, 12px)',
              wordBreak: 'break-word',
              lineHeight: '1.2'
            }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Quick Test Samples Component
export const QuickTestSamples = ({ samples, onSampleClick }) => {
  return (
    <div style={{
      marginTop: '24px',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.03) 100%)',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      borderRadius: '12px',
      padding: 'clamp(16px, 4vw, 20px)'
    }}>
      <h3 style={{ 
        color: '#f8fafc', 
        fontSize: 'clamp(16px, 3.5vw, 18px)', 
        fontWeight: '600', 
        marginBottom: '8px',
        wordBreak: 'break-word'
      }}>
        🧪 Quick Test Samples
      </h3>
      <p style={{ 
        color: '#94a3b8', 
        fontSize: 'clamp(12px, 2.5vw, 14px)', 
        marginBottom: '16px',
        lineHeight: '1.5'
      }}>
        Try these pre-made samples to see how our AI detection works:
      </p>
      
      <div className='quick-samples-grid' style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'clamp(8px, 2vw, 12px)'
      }}>
        {samples.map((sample, index) => (
          <button 
            key={index}
            onClick={() => onSampleClick(sample.text)}
            style={{
              background: sample.bgColor,
              border: `1px solid ${sample.borderColor}`,
              borderRadius: '8px',
              padding: 'clamp(10px, 2vw, 12px)',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              textAlign: 'left',
              width: '100%'
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: 'clamp(16px, 4vw, 20px)' }}>{sample.icon}</div>
              <div style={{ flex: '1', minWidth: '150px' }}>
                <div style={{ 
                  color: '#f8fafc', 
                  fontSize: 'clamp(12px, 2.5vw, 14px)', 
                  fontWeight: 'bold',
                  wordBreak: 'break-word',
                  lineHeight: '1.2'
                }}>
                  {sample.title}
                </div>
                <div style={{ 
                  color: '#94a3b8', 
                  fontSize: 'clamp(10px, 2vw, 12px)',
                  wordBreak: 'break-word',
                  lineHeight: '1.2'
                }}>
                  {sample.subtitle}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Tips Section Component
export const TipsSection = ({ tips, showTips, onToggleTips, styles }) => {
  return (
    <div style={{
      ...styles.tipsContainerStyles,
      marginTop: '24px',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.03) 100%)',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      borderRadius: '12px',
      overflow: 'hidden',
      transition: 'all 0.3s ease-in-out',
      marginBottom: '24px',
    }}>
      <div 
        className="tips-header"
        style={{
          ...styles.tipsHeaderStyles,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'clamp(12px 16px, 3vw, 16px 20px)',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          borderBottom: showTips ? '1px solid rgba(99, 102, 241, 0.2)' : 'none',
        }}
        onClick={onToggleTips}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 12px)', flex: '1' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'clamp(28px, 6vw, 32px)',
            height: 'clamp(28px, 6vw, 32px)',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            borderRadius: '8px',
            color: '#fff',
            fontSize: 'clamp(12px, 3vw, 16px)'
          }}>
            <LightBulbIcon />
          </div>
          <div style={{ flex: '1', minWidth: '0' }}>
            <h3 style={{
              color: '#f8fafc',
              fontSize: 'clamp(14px, 3vw, 16px)',
              fontWeight: '600',
              margin: 0,
              marginBottom: '2px',
              wordBreak: 'break-word'
            }}>
              Pro Tips for Accurate Detection
            </h3>
            <p style={{
              color: '#94a3b8',
              fontSize: 'clamp(12px, 2.5vw, 14px)',
              margin: 0,
              wordBreak: 'break-word'
            }}>
              {showTips ? 'Click to hide tips' : 'Click to view detection tips'}
            </p>
          </div>
        </div>
        
        <div style={{
          color: '#94a3b8',
          transition: 'transform 0.3s ease-in-out',
          transform: showTips ? 'rotate(180deg)' : 'rotate(0deg)',
          fontSize: 'clamp(16px, 4vw, 20px)',
          marginLeft: '8px'
        }}>
          <ChevronDownIcon />
        </div>
      </div>

      <div style={{
        ...styles.tipsContentStyles,
        maxHeight: showTips ? '600px' : '0',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: showTips ? 'clamp(16px, 4vw, 20px)' : '0 clamp(16px, 4vw, 20px)',
      }}>
        <div style={{ display: 'grid', gap: 'clamp(8px, 2vw, 12px)' }}>
          {tips.map((tip, index) => (
            <div
              key={index}
              className="tip-item"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'clamp(12px, 3vw, 16px)',
                padding: 'clamp(12px, 3vw, 16px)',
                background: 'rgba(99, 102, 241, 0.03)',
                border: '1px solid rgba(99, 102, 241, 0.1)',
                borderRadius: '8px',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <div className="icon-emoji" style={{
                fontSize: 'clamp(16px, 4vw, 20px)',
                padding: 'clamp(6px, 1.5vw, 8px)',
                background: 'rgba(99, 102, 241, 0.1)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 'clamp(32px, 7vw, 36px)',
                height: 'clamp(32px, 7vw, 36px)',
                flexShrink: 0
              }}>
                {tip.icon}
              </div>
              <div style={{ flex: 1, minWidth: '0' }}>
                <h4 style={{
                  color: '#f8fafc',
                  fontSize: 'clamp(13px, 2.8vw, 15px)',
                  fontWeight: '600',
                  margin: 0,
                  marginBottom: '6px',
                  wordBreak: 'break-word',
                  lineHeight: '1.3'
                }}>
                  {tip.title}
                </h4>
                <p style={{
                  color: '#94a3b8',
                  fontSize: 'clamp(12px, 2.5vw, 14px)',
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
                fontSize: 'clamp(14px, 3vw, 16px)',
                flexShrink: 0
              }}>
                <CheckIcon />
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '20px',
          padding: 'clamp(12px, 3vw, 16px)',
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#10b981',
            fontSize: 'clamp(12px, 2.5vw, 14px)',
            fontWeight: '500',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            lineHeight: '1.4'
          }}>
            <CheckIcon />
            <span>Advanced pattern detection with 95%+ accuracy + secure local file processing</span>
          </p>
        </div>
      </div>
    </div>
  );
};