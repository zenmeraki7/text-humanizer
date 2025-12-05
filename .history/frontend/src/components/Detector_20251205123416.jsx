// Detector.jsx - Fully Responsive Main Detector Component with Light Theme
import React, { useState, useEffect } from 'react';

import { getDetectorStyles, CSS_STYLES } from '../components/DetectorComponents/styles';

import { 
  analyzeText, 
  handlePasteText, 
  handleCopyResults, 
  handleFileUpload,
  SAMPLE_TEXTS, 
  TIPS_DATA 
} from '../components/DetectorComponents/utils';

import {
  DetectorHeader,
  ErrorMessage,
  ScoreCircle,
  CompactPatternAnalysis,
  CopyButton,
  FullPatternAnalysis,
  TechnicalAnalysis,
  QuickTestSamples,
  TipsSection,
  FileInfoDisplay
} from '../components/DetectorComponents/DetectorComponent';
import { AnalyzeIcon, DocumentIcon, PasteIcon, UploadIcon } from './Icons';
import Navigation from '../pages/Layout/Navigation';

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Responsive breakpoint detection
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

  // Handle file upload
  const handleUpload = () => {
    handleFileUpload(
      // onTextExtracted
      (extractedText) => {
        setText(extractedText);
      },
      // onError
      (errorMessage) => {
        setError(errorMessage);
      },
      // onUploadStateChange
      (uploading, file) => {
        setIsUploading(uploading);
        setUploadedFile(file);
      }
    );
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
    setUploadedFile(null);
  };

  // Responsive grid configuration
  const getGridConfig = () => {
    if (isMobile) {
      return {
        inputResultsGrid: {
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginBottom: '20px'
        },
        actionButtonsGrid: {
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '12px',
          marginBottom: '20px'
        },
        bottomControlsStyle: {
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'stretch'
        }
      };
    } else if (isTablet) {
      return {
        inputResultsGrid: {
          display: 'grid',
          gridTemplateColumns: results ? '1fr 1fr' : '1fr',
          gap: '20px',
          marginBottom: '20px'
        },
        actionButtonsGrid: {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '14px',
          marginBottom: '20px'
        },
        bottomControlsStyle: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }
      };
    } else {
      return {
        inputResultsGrid: {
          display: 'grid',
          gridTemplateColumns: results ? '1fr 1fr' : '1fr',
          gap: '24px',
          marginBottom: '24px'
        },
        actionButtonsGrid: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        },
        bottomControlsStyle: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }
      };
    }
  };

  const gridConfig = getGridConfig();

  // Action buttons configuration
  const actionButtons = [
    { 
      icon: UploadIcon, 
      text: isUploading ? 'Uploading...' : (isMobile ? 'Upload' : 'Upload File'),
      id: 'upload', 
      action: handleUpload,
      disabled: isUploading
    },
    { 
      icon: DocumentIcon, 
      text: isMobile ? 'Sample' : 'Try Sample Text',
      id: 'sample', 
      action: () => handleSampleText(SAMPLE_TEXTS[0].text) 
    },
    { 
      icon: PasteIcon, 
      text: isMobile ? 'Paste' : 'Paste Text',
      id: 'paste', 
      action: handlePaste 
    }
  ];

  return (
    <div style={styles.mainContentStyles} className="main-content">
      <style>{CSS_STYLES}</style>
<Navigation/>

      {/* Header */}
      <DetectorHeader />

      {/* Main Content Card */}
      <div className="card" style={styles.cardStyles}>
        {/* Error Message */}
        <ErrorMessage error={error} />

        {/* File Info Display */}
        <FileInfoDisplay uploadedFile={uploadedFile} error={error} />

        {/* Enhanced Tips Section - Show at top on mobile */}
          <TipsSection 
            tips={TIPS_DATA}
            showTips={showTips}
            onToggleTips={handleToggleTips}
            styles={styles}
          />
        

        {/* Input and Results Grid */}
        <div style={gridConfig.inputResultsGrid}>
          {/* Input Section */}
          <div style={{ order: isMobile && results ? 2 : 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              flexWrap: isMobile ? 'wrap' : 'nowrap',
              gap: isMobile ? '8px' : '0'
            }}>
              <h3 style={{ 
                color: '#023859', 
                fontSize: isMobile ? '16px' : '18px', 
                fontWeight: '600', 
                margin: 0,
                flex: '1 1 auto'
              }}>
                Text to Analyze
              </h3>
              <div style={{ 
                display: 'flex', 
                gap: isMobile ? '12px' : '8px', 
                color: '#456578', 
                fontSize: isMobile ? '12px' : '14px',
                flexWrap: 'wrap',
                justifyContent: isMobile ? 'flex-end' : 'flex-start'
              }}>
                <span>Characters: {text.length}</span>
                <span>Words: {text.trim() ? text.trim().split(/\s+/).length : 0}</span>
              </div>
            </div>
            <textarea
              className="textarea"
              style={styles.textareaStyles}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={isMobile 
                ? "Paste text here or upload a file (.txt, .docx, .pdf, .rtf)..." 
                : "Paste your text here for AI detection analysis, or upload a file (.txt, .docx, .pdf, .rtf) - processed locally in your browser...\n\n✨ Pro tip: Try different types of content to see how our advanced AI detection works!"
              }
              onFocus={(e) => e.target.style.borderColor = '#023859'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(2, 56, 89, 0.3)'}
            />
          </div>

          {/* Results Section - Only show when there are results */}
          {results && (
            <div style={{ order: isMobile && results ? 1 : 2 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <h3 style={{ 
                  color: '#023859', 
                  fontSize: isMobile ? '16px' : '18px', 
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
        <div className="action-buttons" style={gridConfig.actionButtonsGrid}>
          {actionButtons.map((item) => (
            <button
              key={item.id}
              className="action-button"
              onClick={item.disabled ? undefined : item.action}
              style={{
                ...styles.actionButtonStyles,
                ...(hoveredButton === item.id && !item.disabled ? styles.actionButtonHoverStyles : {}),
                opacity: item.disabled ? 0.6 : 1,
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                minHeight: isMobile ? '44px' : '48px'
              }}
              onMouseEnter={() => !item.disabled && setHoveredButton(item.id)}
              onMouseLeave={() => setHoveredButton(null)}
              disabled={item.disabled}
            >
              {item.id === 'upload' && isUploading ? (
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(2, 56, 89, 0.3)',
                  borderTop: '2px solid #023859',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              ) : (
                <item.icon />
              )}
              {item.text}
            </button>
          ))}
        </div>

        {/* Bottom Controls */}
        <div style={gridConfig.bottomControlsStyle}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            order: isMobile ? 2 : 1,
            width: isMobile ? '100%' : 'auto',
            justifyContent: isMobile ? 'center' : 'flex-start'
          }}>
            <span style={{ 
              color: '#456578', 
              fontSize: isMobile ? '14px' : '16px',
              textAlign: isMobile ? 'center' : 'left'
            }}>
              {isMobile ? 'Advanced Mode' : 'Advanced Detection Mode'}
            </span>
          </div>

          <button
            disabled={loading || !text.trim()}
            style={{
              ...styles.primaryButtonStyles,
              ...(isPrimaryHovered && !loading && text.trim() ? styles.primaryButtonHoverStyles : {}),
              opacity: (loading || !text.trim()) ? 0.6 : 1,
              cursor: (loading || !text.trim()) ? 'not-allowed' : 'pointer',
              order: isMobile ? 1 : 2,
              width: isMobile ? '100%' : 'auto',
              minHeight: isMobile ? '44px' : '48px'
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
                {isMobile ? 'Analyzing...' : 'Analyzing...'}
              </>
            ) : (
              <>
                <AnalyzeIcon />
                {isMobile ? 'Analyze' : 'Analyze Text'}
              </>
            )}
          </button>
        </div>

        {/* Expanded Results Section - Shows below when results exist */}
        {results && (
          <div style={{
            marginTop: isMobile ? '20px' : '24px',
            background: 'linear-gradient(135deg, rgba(2, 56, 89, 0.05) 0%, rgba(3, 74, 115, 0.03) 100%)',
            border: '1px solid rgba(2, 56, 89, 0.2)',
            borderRadius: isMobile ? '8px' : '12px',
            padding: isMobile ? '16px' : '20px'
          }}>
            <h3 style={{ 
              color: '#023859', 
              fontSize: isMobile ? '16px' : '18px', 
              fontWeight: '600', 
              marginBottom: '16px' 
            }}>
              {isMobile ? '📊 Analysis Results' : '📊 Detailed Analysis Results'}
            </h3>

            <FullPatternAnalysis results={results} />
            <TechnicalAnalysis results={results} />

            {/* Quick Actions */}
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              gap: '12px', 
              justifyContent: 'center',
              marginTop: '16px'
            }}>
              <button 
                onClick={handleNewAnalysis}
                style={{
                  ...styles.primaryButtonStyles,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  width: isMobile ? '100%' : 'auto',
                  minHeight: isMobile ? '44px' : '48px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
                  e.target.style.transform = isMobile ? 'none' : 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {isMobile ? '✨ New Analysis' : '✨ Analyze New Text'}
              </button>
              
              <button 
                onClick={handleCopy}
                style={{
                  ...styles.primaryButtonStyles,
                  background: 'transparent',
                  border: '1px solid rgba(2, 56, 89, 0.3)',
                  color: '#023859',
                  width: isMobile ? '100%' : 'auto',
                  minHeight: isMobile ? '44px' : '48px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#023859';
                  e.target.style.color = '#fff';
                  e.target.style.backgroundColor = 'rgba(2, 56, 89, 0.9)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'rgba(2, 56, 89, 0.3)';
                  e.target.style.color = '#023859';
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                {isMobile ? '📋 Copy' : '📋 Copy Results'}
              </button>
            </div>
          </div>
        )}

        {/* Quick Test Samples */}
        <QuickTestSamples 
          samples={SAMPLE_TEXTS} 
          onSampleClick={setText} 
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

export default Detector;