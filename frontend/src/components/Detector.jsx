// Detector.jsx - Main Detector Component (Refactored with Fixed Imports)
import React, { useState } from 'react';

// Import all the split components and utilities
// import { 
//   UploadIcon, 
//   DocumentIcon, 
//   PasteIcon, 
//   AnalyzeIcon 
// } from '../Icons';

import { getDetectorStyles, CSS_STYLES } from './DetectorComponents/styles';

import { 
  analyzeText, 
  handlePasteText, 
  handleCopyResults, 
  SAMPLE_TEXTS, 
  TIPS_DATA 
} from './DetectorComponents/utils';

import {
  DetectorHeader,
  ErrorMessage,
  ScoreCircle,
  CompactPatternAnalysis,
  CopyButton,
  FullPatternAnalysis,
  TechnicalAnalysis,
  QuickTestSamples,
  TipsSection
} from './DetectorComponents/DetectorComponent';
import { AnalyzeIcon, DocumentIcon, PasteIcon, UploadIcon } from './Icons';

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

  // Get styles
  const styles = getDetectorStyles(sidebarOpen, showTips);

  // Handle text analysis
  const handleAnalyzeText = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    setAnimateScore(false);

    try {
      const data = await analyzeText(text);
      setResults(data);
      
      // Animate score after a short delay
      setTimeout(() => setAnimateScore(true), 300);
    } catch (err) {
      setError(err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle sample text selection
  const handleSampleText = (sampleText) => {
    setText(sampleText);
  };

  // Handle paste text
  const handlePaste = async () => {
    try {
      const clipboardText = await handlePasteText();
      setText(clipboardText);
    } catch (err) {
      console.log('Failed to paste text:', err);
    }
  };

  // Handle copy results
  const handleCopy = async () => {
    try {
      await handleCopyResults(results);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy results:', err);
    }
  };

  // Handle tips toggle
  const handleToggleTips = () => {
    setShowTips(!showTips);
  };

  // Clear results and start new analysis
  const handleNewAnalysis = () => {
    setText('');
    setResults(null);
    setError(null);
  };

  return (
    <div style={styles.mainContentStyles}>
      <style>{CSS_STYLES}</style>

      {/* Header */}
      <DetectorHeader />

      {/* Main Content Card */}
      <div className="card" style={styles.cardStyles}>
        {/* Error Message */}
        <ErrorMessage error={error} />

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
              style={styles.textareaStyles}
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
              <div style={styles.resultsDisplayStyles}>
                <ScoreCircle results={results} animateScore={animateScore} />
                <CompactPatternAnalysis results={results} />
              </div>
              
              {/* Copy button below the results box */}
              <CopyButton 
                onCopy={handleCopy} 
                copySuccess={copySuccess} 
                styles={styles} 
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { icon: UploadIcon, text: 'Upload File', id: 'upload', action: () => {} },
            { icon: DocumentIcon, text: 'Try Sample Text', id: 'sample', action: () => handleSampleText(SAMPLE_TEXTS[0].text) },
            { icon: PasteIcon, text: 'Paste Text', id: 'paste', action: handlePaste }
          ].map((item) => (
            <button
              key={item.id}
              className="action-button"
              onClick={item.action}
              style={{
                ...styles.actionButtonStyles,
                ...(hoveredButton === item.id ? styles.actionButtonHoverStyles : {}),
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
              ...styles.primaryButtonStyles,
              ...(isPrimaryHovered && !loading && text.trim() ? styles.primaryButtonHoverStyles : {}),
              opacity: (loading || !text.trim()) ? 0.6 : 1,
              cursor: (loading || !text.trim()) ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={() => !loading && text.trim() && setIsPrimaryHovered(true)}
            onMouseLeave={() => setIsPrimaryHovered(false)}
            onClick={handleAnalyzeText}
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

            <FullPatternAnalysis results={results} />
            <TechnicalAnalysis results={results} />

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={handleNewAnalysis}
                style={{
                  ...styles.primaryButtonStyles,
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
                  ...styles.primaryButtonStyles,
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
        <QuickTestSamples 
          samples={SAMPLE_TEXTS} 
          onSampleClick={setText} 
        />

        {/* Enhanced Tips Section */}
        <TipsSection 
          tips={TIPS_DATA}
          showTips={showTips}
          onToggleTips={handleToggleTips}
          styles={styles}
        />
      </div>
    </div>
  );
};

export default Detector;