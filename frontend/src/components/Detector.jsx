// import React, { useState, useEffect } from 'react';
// import './Detector.css';

// const Detector = () => {
//   const [text, setText] = useState('');
//   const [results, setResults] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showResults, setShowResults] = useState(false);
//   const [animateScore, setAnimateScore] = useState(false);

//   const analyzeText = async () => {
//     if (!text.trim()) {
//       setError('Please enter some text to analyze');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setResults(null);
//     setShowResults(false);
//     setAnimateScore(false);

//     try {
//       const response = await fetch('http://localhost:8000/analyze', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//         body: JSON.stringify({ text: text.trim() })
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Analysis failed: ${errorText}`);
//       }

//       const data = await response.json();
      
//       if (!data || typeof data.ai_score === 'undefined') {
//         throw new Error('Invalid response from server');
//       }

//       setResults(data);
//       setShowResults(true);
      
//       // Animate score after a short delay
//       setTimeout(() => setAnimateScore(true), 500);

//     } catch (err) {
//       setError(err.message || 'Analysis failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getClassification = (score) => {
//     if (score >= 80) return 'HIGHLY LIKELY AI-GENERATED';
//     if (score >= 60) return 'LIKELY AI-GENERATED';
//     if (score >= 40) return 'POSSIBLY AI-GENERATED';
//     if (score >= 20) return 'LIKELY HUMAN-WRITTEN';
//     return 'HIGHLY LIKELY HUMAN-WRITTEN';
//   };

//   const getScoreColor = (score) => {
//     if (score >= 80) return '#ef4444';
//     if (score >= 60) return '#f97316';
//     if (score >= 40) return '#eab308';
//     if (score >= 20) return '#22c55e';
//     return '#10b981';
//   };

//   const getConfidenceColor = (score) => {
//     if (score >= 80) return '#fef2f2';
//     if (score >= 60) return '#fff7ed';
//     if (score >= 40) return '#fefce8';
//     if (score >= 20) return '#f0fdf4';
//     return '#ecfdf5';
//   };

//   const getScoreIcon = (score) => {
//     if (score >= 80) return '🤖';
//     if (score >= 60) return '⚠️';
//     if (score >= 40) return '🔍';
//     if (score >= 20) return '✅';
//     return '👤';
//   };

//   return (
//     <div className="detector-wrapper">
//       <div className="detector-container">
//         {/* Header */}
//         <div className="detector-header">
//           <div className="header-icon">🔍</div>
//           <h1 className="header-title">AI Content Detector</h1>
//           <p className="header-subtitle">Analyze text to detect AI-generated content with advanced pattern recognition</p>
//         </div>

//         {/* Input Section */}
//         <div className="input-section">
//           <div className="input-header">
//             <h2>📝 Text Analysis</h2>
//             <div className="input-stats">
//               <span className="stat-item">
//                 <span className="stat-label">Characters:</span>
//                 <span className="stat-value">{text.length}</span>
//               </span>
//               <span className="stat-item">
//                 <span className="stat-label">Words:</span>
//                 <span className="stat-value">{text.trim() ? text.trim().split(/\s+/).length : 0}</span>
//               </span>
//             </div>
//           </div>
          
//           <textarea
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             placeholder="Paste your text here for AI detection analysis...

// ✨ Pro tip: Try different types of content to see how our advanced AI detection works!"
//             className="text-input"
//             rows={8}
//           />
          
//           <div className="input-actions">
//             <button 
//               onClick={analyzeText}
//               disabled={loading || !text.trim()}
//               className={`analyze-btn ${loading ? 'loading' : ''}`}
//             >
//               {loading ? (
//                 <>
//                   <div className="loading-spinner"></div>
//                   Analyzing...
//                 </>
//               ) : (
//                 <>
//                   <span className="btn-icon">🔬</span>
//                   Analyze Text
//                 </>
//               )}
//             </button>
            
//             <button 
//               onClick={() => setText('')}
//               className="clear-btn"
//               disabled={!text.trim()}
//             >
//               <span className="btn-icon">🗑️</span>
//               Clear
//             </button>
//           </div>
//         </div>

//         {/* Error Display */}
//         {error && (
//           <div className="error-section">
//             <div className="error-icon">⚠️</div>
//             <div className="error-content">
//               <h3>Analysis Error</h3>
//               <p>{error}</p>
//             </div>
//           </div>
//         )}

//         {/* Results Display */}
//         {showResults && results && (
//           <div className="results-modal">
//             <div className="results-content">
//               <div className="results-header">
//                 <h2>
//                   <span className="results-icon">{getScoreIcon(results.ai_score)}</span>
//                   AI Detection Results
//                 </h2>
//                 <button 
//                   className="close-btn"
//                   onClick={() => setShowResults(false)}
//                 >
//                   ✕
//                 </button>
//               </div>

//               {/* Main Score Display */}
//               <div className="score-section">
//                 <div className="score-container">
//                   <div 
//                     className={`score-circle ${animateScore ? 'animate' : ''}`}
//                     style={{ 
//                       '--score': results.ai_score,
//                       '--color': getScoreColor(results.ai_score)
//                     }}
//                   >
//                     <div className="score-percentage">
//                       {results.ai_score?.toFixed(1) || 0}%
//                     </div>
//                     <div className="score-label">AI Score</div>
//                   </div>
//                 </div>

//                 <div className="classification-section">
//                   <div 
//                     className="classification-badge"
//                     style={{ 
//                       backgroundColor: getConfidenceColor(results.ai_score),
//                       color: getScoreColor(results.ai_score),
//                       border: `2px solid ${getScoreColor(results.ai_score)}20`
//                     }}
//                   >
//                     <span className="classification-icon">{getScoreIcon(results.ai_score)}</span>
//                     <span className="classification-text">{getClassification(results.ai_score)}</span>
//                   </div>
//                   <div className="confidence-text">
//                     Confidence: <span style={{ color: getScoreColor(results.ai_score) }}>
//                       {results.confidence || 'High'}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Pattern Analysis */}
//               {results.patterns && Object.keys(results.patterns).length > 0 && (
//                 <div className="patterns-section">
//                   <h3>📊 Detected Patterns ({Object.keys(results.patterns).length} categories)</h3>
//                   <div className="patterns-grid">
//                     {Object.entries(results.patterns).map(([category, data], index) => (
//                       <div 
//                         key={category} 
//                         className="pattern-card"
//                         style={{ animationDelay: `${index * 0.1}s` }}
//                       >
//                         <div className="pattern-header">
//                           <h4>{category.replace(/_/g, ' ').toUpperCase()}</h4>
//                           <div className="pattern-score">
//                             Score: <span style={{ color: getScoreColor(data.score || 0) }}>
//                               {data.score || 0}
//                             </span>
//                           </div>
//                         </div>
                        
//                         {data.indicators && data.indicators.length > 0 && (
//                           <div className="pattern-indicators">
//                             <div className="indicators-header">
//                               Found {data.indicators.length} indicators:
//                             </div>
//                             <div className="indicators-list">
//                               {data.indicators.slice(0, 3).map((indicator, idx) => (
//                                 <div key={idx} className="indicator-item">
//                                   <span className="indicator-bullet">•</span>
//                                   <span className="indicator-text">"{indicator}"</span>
//                                 </div>
//                               ))}
//                               {data.indicators.length > 3 && (
//                                 <div className="indicator-more">
//                                   +{data.indicators.length - 3} more...
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Technical Analysis */}
//               {results.technical_details && (
//                 <div className="technical-section">
//                   <h3>🔍 Technical Analysis</h3>
//                   <div className="tech-grid">
//                     <div className="tech-card">
//                       <div className="tech-icon">📊</div>
//                       <div className="tech-info">
//                         <div className="tech-value">{results.technical_details.total_patterns || 0}</div>
//                         <div className="tech-label">Total Patterns</div>
//                       </div>
//                     </div>
                    
//                     <div className="tech-card">
//                       <div className="tech-icon">📝</div>
//                       <div className="tech-info">
//                         <div className="tech-value">{results.technical_details.word_count || 0}</div>
//                         <div className="tech-label">Words Analyzed</div>
//                       </div>
//                     </div>
                    
//                     <div className="tech-card">
//                       <div className="tech-icon">📈</div>
//                       <div className="tech-info">
//                         <div className="tech-value">
//                           {results.technical_details.pattern_density?.toFixed(1) || 0}%
//                         </div>
//                         <div className="tech-label">Pattern Density</div>
//                       </div>
//                     </div>
                    
//                     <div className="tech-card">
//                       <div className="tech-icon">🎯</div>
//                       <div className="tech-info">
//                         <div className="tech-value">{Object.keys(results.patterns || {}).length}</div>
//                         <div className="tech-label">Categories</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="results-actions">
//                 <button 
//                   className="action-btn primary"
//                   onClick={() => setShowResults(false)}
//                 >
//                   <span className="btn-icon">✨</span>
//                   Analyze Another Text
//                 </button>
                
//                 <button 
//                   className="action-btn secondary"
//                   onClick={() => {
//                     navigator.clipboard.writeText(JSON.stringify(results, null, 2));
//                   }}
//                 >
//                   <span className="btn-icon">📋</span>
//                   Copy Results
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Quick Test Samples */}
//         <div className="samples-section">
//           <h3>🧪 Quick Test Samples</h3>
//           <p>Try these pre-made samples to see how our AI detection works:</p>
          
//           <div className="samples-grid">
//             <button 
//               onClick={() => setText("In today's fast-paced world, it is important to note that leveraging cutting-edge AI technologies will ultimately transform business paradigms. With that being said, organizations must optimize their synergy to achieve unprecedented results.")}
//               className="sample-btn high-ai"
//             >
//               <div className="sample-icon">🤖</div>
//               <div className="sample-info">
//                 <div className="sample-title">High AI Text</div>
//                 <div className="sample-subtitle">Expected: ~100% AI</div>
//               </div>
//             </button>
            
//             <button 
//               onClick={() => setText("The weather was nice today. However, it is important to note that climate change is a significant challenge. We should consider various solutions for this pressing issue.")}
//               className="sample-btn medium-ai"
//             >
//               <div className="sample-icon">🟡</div>
//               <div className="sample-info">
//                 <div className="sample-title">Medium AI Text</div>
//                 <div className="sample-subtitle">Expected: ~50% AI</div>
//               </div>
//             </button>
            
//             <button 
//               onClick={() => setText("Grabbed coffee this morning and the barista had this amazing purple hair. She convinced me to try their lavender latte instead of my usual black coffee. Honestly wasn't terrible - might go back tomorrow if I'm not running late again.")}
//               className="sample-btn human-text"
//             >
//               <div className="sample-icon">👤</div>
//               <div className="sample-info">
//                 <div className="sample-title">Human Text</div>
//                 <div className="sample-subtitle">Expected: ~10% AI</div>
//               </div>
//             </button>
            
//             <button 
//               onClick={() => setText("But here's the truth no one wants to say out loud: that's the catch with social media algorithms. Here's what nobody mentions - until something does break. Usually it's you who pays the price.")}
//               className="sample-btn dramatic-ai"
//             >
//               <div className="sample-icon">🎭</div>
//               <div className="sample-info">
//                 <div className="sample-title">Dramatic AI</div>
//                 <div className="sample-subtitle">Expected: ~95% AI</div>
//               </div>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Detector;



//final 
import React, { useState, useEffect } from 'react';
import './Detector.css';

const Detector = () => {
  const [text, setText] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animateScore, setAnimateScore] = useState(false);

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

  return (
    <div className="detector-wrapper">
      <div className="detector-container">
        {/* Header */}
        <div className="detector-header">
          <div className="header-icon">🔍</div>
          <h1 className="header-title">AI Content Detector</h1>
          <p className="header-subtitle">Analyze text to detect AI-generated content with advanced pattern recognition</p>
        </div>

        {/* Input Section */}
        <div className="input-section">
          <div className="input-header">
            <h2>📝 Text Analysis</h2>
            <div className="input-stats">
              <span className="stat-item">
                <span className="stat-label">Characters:</span>
                <span className="stat-value">{text.length}</span>
              </span>
              <span className="stat-item">
                <span className="stat-label">Words:</span>
                <span className="stat-value">{text.trim() ? text.trim().split(/\s+/).length : 0}</span>
              </span>
            </div>
          </div>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here for AI detection analysis...

✨ Pro tip: Try different types of content to see how our advanced AI detection works!"
            className="text-input"
            rows={8}
          />
          
          <div className="input-actions">
            <button 
              onClick={analyzeText}
              disabled={loading || !text.trim()}
              className={`analyze-btn ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <span className="btn-icon">🔬</span>
                  Analyze Text
                </>
              )}
            </button>
            
            <button 
              onClick={() => setText('')}
              className="clear-btn"
              disabled={!text.trim()}
            >
              <span className="btn-icon">🗑️</span>
              Clear
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-section">
            <div className="error-icon">⚠️</div>
            <div className="error-content">
              <h3>Analysis Error</h3>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Results Display - INLINE (Same Page) */}
        {results && (
          <div className="results-section-inline">
            <div className="results-header-inline">
              <h2>
                <span className="results-icon">{getScoreIcon(results.ai_score)}</span>
                AI Detection Results
              </h2>
            </div>

            {/* Main Score Display */}
            <div className="score-section-inline">
              <div className="score-container">
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

              <div className="classification-section">
                <div 
                  className="classification-badge"
                  style={{ 
                    backgroundColor: getConfidenceColor(results.ai_score),
                    color: getScoreColor(results.ai_score),
                    border: `2px solid ${getScoreColor(results.ai_score)}20`
                  }}
                >
                  <span className="classification-icon">{getScoreIcon(results.ai_score)}</span>
                  <span className="classification-text">{getClassification(results.ai_score)}</span>
                </div>
                <div className="confidence-text">
                  Confidence: <span style={{ color: getScoreColor(results.ai_score) }}>
                    {results.confidence || 'High'}
                  </span>
                </div>
              </div>
            </div>

            {/* Pattern Analysis */}
            {results.patterns && Object.keys(results.patterns).length > 0 && (
              <div className="patterns-section-inline">
                <h3>📊 Detected Patterns ({Object.keys(results.patterns).length} categories)</h3>
                <div className="patterns-grid">
                  {Object.entries(results.patterns).map(([category, data], index) => (
                    <div 
                      key={category} 
                      className="pattern-card"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="pattern-header">
                        <h4>{category.replace(/_/g, ' ').toUpperCase()}</h4>
                        <div className="pattern-score">
                          Score: <span style={{ color: getScoreColor(data.score || 0) }}>
                            {data.score || 0}
                          </span>
                        </div>
                      </div>
                      
                      {data.indicators && data.indicators.length > 0 && (
                        <div className="pattern-indicators">
                          <div className="indicators-header">
                            Found {data.indicators.length} indicators:
                          </div>
                          <div className="indicators-list">
                            {data.indicators.slice(0, 3).map((indicator, idx) => (
                              <div key={idx} className="indicator-item">
                                <span className="indicator-bullet">•</span>
                                <span className="indicator-text">"{indicator}"</span>
                              </div>
                            ))}
                            {data.indicators.length > 3 && (
                              <div className="indicator-more">
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
              <div className="technical-section-inline">
                <h3>🔍 Technical Analysis</h3>
                <div className="tech-grid">
                  <div className="tech-card">
                    <div className="tech-icon">📊</div>
                    <div className="tech-info">
                      <div className="tech-value">{results.technical_details.total_patterns || 0}</div>
                      <div className="tech-label">Total Patterns</div>
                    </div>
                  </div>
                  
                  <div className="tech-card">
                    <div className="tech-icon">📝</div>
                    <div className="tech-info">
                      <div className="tech-value">{results.technical_details.word_count || 0}</div>
                      <div className="tech-label">Words Analyzed</div>
                    </div>
                  </div>
                  
                  <div className="tech-card">
                    <div className="tech-icon">📈</div>
                    <div className="tech-info">
                      <div className="tech-value">
                        {results.technical_details.pattern_density?.toFixed(1) || 0}%
                      </div>
                      <div className="tech-label">Pattern Density</div>
                    </div>
                  </div>
                  
                  <div className="tech-card">
                    <div className="tech-icon">🎯</div>
                    <div className="tech-info">
                      <div className="tech-value">{Object.keys(results.patterns || {}).length}</div>
                      <div className="tech-label">Categories</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="results-actions-inline">
              <button 
                className="action-btn primary"
                onClick={() => {
                  setText('');
                  setResults(null);
                  setError(null);
                }}
              >
                <span className="btn-icon">✨</span>
                Analyze New Text
              </button>
              
              <button 
                className="action-btn secondary"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(results, null, 2));
                }}
              >
                <span className="btn-icon">📋</span>
                Copy Results
              </button>
            </div>
          </div>
        )}

        {/* Quick Test Samples */}
        <div className="samples-section">
          <h3>🧪 Quick Test Samples</h3>
          <p>Try these pre-made samples to see how our AI detection works:</p>
          
          <div className="samples-grid">
            <button 
              onClick={() => setText("In today's fast-paced world, it is important to note that leveraging cutting-edge AI technologies will ultimately transform business paradigms. With that being said, organizations must optimize their synergy to achieve unprecedented results.")}
              className="sample-btn high-ai"
            >
              <div className="sample-icon">🤖</div>
              <div className="sample-info">
                <div className="sample-title">High AI Text</div>
                <div className="sample-subtitle">Expected: ~100% AI</div>
              </div>
            </button>
            
            <button 
              onClick={() => setText("The weather was nice today. However, it is important to note that climate change is a significant challenge. We should consider various solutions for this pressing issue.")}
              className="sample-btn medium-ai"
            >
              <div className="sample-icon">🟡</div>
              <div className="sample-info">
                <div className="sample-title">Medium AI Text</div>
                <div className="sample-subtitle">Expected: ~50% AI</div>
              </div>
            </button>
            
            <button 
              onClick={() => setText("Grabbed coffee this morning and the barista had this amazing purple hair. She convinced me to try their lavender latte instead of my usual black coffee. Honestly wasn't terrible - might go back tomorrow if I'm not running late again.")}
              className="sample-btn human-text"
            >
              <div className="sample-icon">👤</div>
              <div className="sample-info">
                <div className="sample-title">Human Text</div>
                <div className="sample-subtitle">Expected: ~10% AI</div>
              </div>
            </button>
            
            <button 
              onClick={() => setText("But here's the truth no one wants to say out loud: that's the catch with social media algorithms. Here's what nobody mentions - until something does break. Usually it's you who pays the price.")}
              className="sample-btn dramatic-ai"
            >
              <div className="sample-icon">🎭</div>
              <div className="sample-info">
                <div className="sample-title">Dramatic AI</div>
                <div className="sample-subtitle">Expected: ~95% AI</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detector;