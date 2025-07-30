// DetectorComponents.jsx - Reusable UI components for the Detector
import React from 'react';
// Correct import path: go up one level to components folder, then access Icons.jsx
import { CopyIcon, LightBulbIcon, CheckIcon, ChevronDownIcon } from '../Icons';
import { getScoreColor, getConfidenceColor, getScoreIcon, getClassification } from './utils';

// Header Component
export const DetectorHeader = () => {
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
        🔍 Advanced AI Pattern Detection →
      </div>
    </div>
  );
};

// Error Message Component
export const ErrorMessage = ({ error }) => {
  if (!error) return null;

  return (
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
  );
};

// Score Circle Component
export const ScoreCircle = ({ results, animateScore }) => {
  return (
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
  );
};

// Compact Pattern Analysis Component
export const CompactPatternAnalysis = ({ results }) => {
  if (!results.patterns || Object.keys(results.patterns).length === 0) return null;

  return (
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
  );
};

// Copy Button Component
export const CopyButton = ({ onCopy, copySuccess, styles }) => {
  return (
    <div style={{ 
      display: 'flex', 
      gap: '8px', 
      marginTop: '12px',
      justifyContent: 'flex-end'
    }}>
      <button
        onClick={onCopy}
        style={{
          ...styles.outputButtonStyles,
          ...(copySuccess ? { color: '#10b981', borderColor: '#10b981' } : {})
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
  );
};

// Technical Analysis Component
export const TechnicalAnalysis = ({ results }) => {
  if (!results.technical_details) return null;

  return (
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
      padding: '20px'
    }}>
      <h3 style={{ color: '#f8fafc', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
        🧪 Quick Test Samples
      </h3>
      <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>
        Try these pre-made samples to see how our AI detection works:
      </p>
      
      <div className='quick-samples-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',gridTemplateRows: 'repeat(2, 1fr)', gap: '12px' }}>
        {samples.map((sample, index) => (
          <button 
            key={index}
            onClick={() => onSampleClick(sample.text)}
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
  );
};

// Tips Section Component
export const TipsSection = ({ tips, showTips, onToggleTips, styles }) => {
  return (
    <div style={styles.tipsContainerStyles}>
      <div 
        className="tips-header"
        style={styles.tipsHeaderStyles}
        onClick={onToggleTips}
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

      <div style={styles.tipsContentStyles}>
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
  );
};