// import React, { useState } from 'react';

// // Icon components
// const UploadIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
//   </svg>
// );

// const DocumentIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"/>
//   </svg>
// );

// const PasteIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M19,20H5V4H7V7H17V4H19M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M19,2H14.82C14.4,0.84 13.3,0 12,0C10.7,0 9.6,0.84 9.18,2H5A2,2 0 0,0 3,4V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V4A2,2 0 0,0 19,2Z"/>
//   </svg>
// );

// const AIIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M22,14A2,2 0 0,1 20,16H4A2,2 0 0,1 2,14V10A2,2 0 0,1 4,8H20A2,2 0 0,1 22,10V14M4,14H8V10H4V14M10,14H14V10H10V14M16,14H20V10H16V14Z"/>
//   </svg>
// );

// const ExpandIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
//   </svg>
// );

// const LightBulbIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z"/>
//   </svg>
// );

// const CheckIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
//   </svg>
// );

// const ChevronDownIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
//   </svg>
// );

// const ChevronUpIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"/>
//   </svg>
// );

// const drawerWidth = 280;
// const collapsedDrawerWidth = 64;

// const MainContent = ({ sidebarOpen = false }) => {
//   const [inputText, setInputText] = useState('');
//   const [mode, setMode] = useState('Enhanced');
//   const [showModeDropdown, setShowModeDropdown] = useState(false);
//   const [hoveredButton, setHoveredButton] = useState(null);
//   const [isPrimaryHovered, setIsPrimaryHovered] = useState(false);
//   const [showTips, setShowTips] = useState(false);

//   const modes = ['Enhanced', 'Standard', 'Creative'];

//   const tips = [
//     {
//       title: "Write Clear Text",
//       description: "Use simple, straightforward language for the best humanization results",
//       icon: "✍️"
//     },
//     {
//       title: "Choose the Right Mode",
//       description: "Enhanced for formal content, Creative for marketing, Standard for general use",
//       icon: "⚙️"
//     },
//     {
//       title: "Review Output",
//       description: "Always check the humanized text to ensure it maintains your intended meaning",
//       icon: "👀"
//     },
//     {
//       title: "Optimal Length",
//       description: "Works best with 50-2000 words. Longer texts may need to be split",
//       icon: "📏"
//     },
//     {
//       title: "Context Matters",
//       description: "Provide context in your text for more accurate humanization",
//       icon: "🎯"
//     }
//   ];

//   const mainContentStyles = {
//     marginLeft: sidebarOpen ? drawerWidth : collapsedDrawerWidth,
//     transition: 'margin-left 0.3s ease-in-out',
//     minHeight: '100vh',
//     background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
//     padding: '24px',
//     margin: 0,
//     marginTop: 0,
//   };

//   const headerStyles = {
//     textAlign: 'center',
//     marginBottom: '32px',
//   };

//   const titleStyles = {
//     fontSize: '3rem',
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: '16px',
//     background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
//     backgroundClip: 'text',
//     WebkitBackgroundClip: 'text',
//     WebkitTextFillColor: 'transparent',
//     lineHeight: '1.2',
//   };

//   const chipStyles = {
//     display: 'inline-flex',
//     alignItems: 'center',
//     gap: '8px',
//     backgroundColor: '#f97316',
//     color: '#fff',
//     padding: '8px 16px',
//     borderRadius: '8px',
//     fontWeight: 'bold',
//     cursor: 'pointer',
//     transition: 'transform 0.2s ease-in-out',
//   };

//   const cardStyles = {
//     maxWidth: '1024px',
//     margin: '0 auto',
//     background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.5) 0%, rgba(22, 33, 62, 0.3) 100%)',
//     backdropFilter: 'blur(10px)',
//     border: '1px solid rgba(99, 102, 241, 0.2)',
//     borderRadius: '16px',
//     padding: '24px',
//     boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
//   };

//   const textareaStyles = {
//     width: '100%',
//     height: '256px',
//     backgroundColor: 'rgba(0, 0, 0, 0.3)',
//     border: '1px solid rgba(99, 102, 241, 0.3)',
//     borderRadius: '8px',
//     padding: '16px',
//     color: '#fff',
//     fontSize: '16px',
//     fontFamily: 'inherit',
//     resize: 'none',
//     outline: 'none',
//     marginBottom: '24px',
//     transition: 'border-color 0.2s ease-in-out',
//     boxSizing: 'border-box',
//   };

//   const actionButtonStyles = {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: '12px',
//     padding: '16px 24px',
//     border: '1px solid rgba(99, 102, 241, 0.3)',
//     backgroundColor: 'transparent',
//     color: '#a1a1aa',
//     borderRadius: '8px',
//     cursor: 'pointer',
//     fontSize: '16px',
//     fontWeight: 500,
//     transition: 'all 0.2s ease-in-out',
//     width: '100%',
//   };

//   const actionButtonHoverStyles = {
//     borderColor: '#6366f1',
//     color: '#fff',
//     backgroundColor: 'rgba(99, 102, 241, 0.1)',
//   };

//   const primaryButtonStyles = {
//     padding: '12px 32px',
//     background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
//     border: 'none',
//     color: '#fff',
//     borderRadius: '8px',
//     cursor: 'pointer',
//     fontSize: '16px',
//     fontWeight: 600,
//     transition: 'all 0.2s ease-in-out',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//   };

//   const primaryButtonHoverStyles = {
//     background: 'linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)',
//     transform: 'translateY(-2px)',
//     boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
//   };

//   const selectStyles = {
//     position: 'relative',
//     minWidth: '128px',
//   };

//   const selectButtonStyles = {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     padding: '8px 16px',
//     backgroundColor: '#374151',
//     border: '1px solid rgba(99, 102, 241, 0.3)',
//     color: '#fff',
//     borderRadius: '8px',
//     cursor: 'pointer',
//     fontSize: '16px',
//     transition: 'border-color 0.2s ease-in-out',
//   };

//   const dropdownStyles = {
//     position: 'absolute',
//     top: '48px',
//     left: 0,
//     right: 0,
//     backgroundColor: '#374151',
//     border: '1px solid rgba(99, 102, 241, 0.3)',
//     borderRadius: '8px',
//     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
//     zIndex: 1000,
//   };

//   const tipsContainerStyles = {
//     marginTop: '24px',
//     background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.03) 100%)',
//     border: '1px solid rgba(99, 102, 241, 0.2)',
//     borderRadius: '12px',
//     overflow: 'hidden',
//     transition: 'all 0.3s ease-in-out',
//   };

//   const tipsHeaderStyles = {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: '16px 20px',
//     cursor: 'pointer',
//     transition: 'all 0.2s ease-in-out',
//     borderBottom: showTips ? '1px solid rgba(99, 102, 241, 0.2)' : 'none',
//   };

//   const tipsContentStyles = {
//     maxHeight: showTips ? '500px' : '0',
//     overflow: 'hidden',
//     transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
//     padding: showTips ? '20px' : '0 20px',
//   };

//   const tipItemStyles = {
//     display: 'flex',
//     alignItems: 'flex-start',
//     gap: '16px',
//     padding: '16px',
//     background: 'rgba(99, 102, 241, 0.03)',
//     border: '1px solid rgba(99, 102, 241, 0.1)',
//     borderRadius: '8px',
//     marginBottom: '12px',
//     transition: 'all 0.2s ease-in-out',
//   };

//   const handleSampleText = () => {
//     setInputText("AI-generated content has become increasingly sophisticated in recent years, with models capable of producing high-quality text across various domains. However, there remains a need to ensure that such content maintains a natural, human-like quality that resonates with readers and passes detection systems.");
//   };

//   const handlePasteText = async () => {
//     try {
//       const text = await navigator.clipboard.readText();
//       setInputText(text);
//     } catch (err) {
//       console.log('Failed to read clipboard contents: ', err);
//     }
//   };

//   return (
//     <div style={mainContentStyles}>
//       <style>{`
//         @media (max-width: 768px) {
//           .main-content {
//             margin-left: 0 !important;
//             padding: 16px !important;
//           }
          
//           .title {
//             font-size: 2rem !important;
//           }
          
//           .action-buttons {
//             grid-template-columns: 1fr !important;
//           }
          
//           .bottom-controls {
//             flex-direction: column !important;
//             align-items: stretch !important;
//           }
          
//           .textarea {
//             height: 200px !important;
//           }
          
//           .card {
//             padding: 16px !important;
//           }
//         }
        
//         @media (max-width: 480px) {
//           .title {
//             font-size: 1.5rem !important;
//           }
          
//           .chip {
//             padding: 6px 12px !important;
//             font-size: 14px !important;
//           }
          
//           .action-button {
//             padding: 12px 16px !important;
//             font-size: 14px !important;
//           }
          
//           .primary-button {
//             padding: 12px 24px !important;
//             font-size: 14px !important;
//           }
          
//           .select-button {
//             padding: 6px 12px !important;
//             font-size: 14px !important;
//           }
//         }

//         .tip-item:hover {
//           background: rgba(99, 102, 241, 0.08) !important;
//           border-color: rgba(99, 102, 241, 0.3) !important;
//           transform: translateY(-2px);
//           box-shadow: 0 0 20px rgba(99, 102, 241, 0.1);
//         }

//         .tips-header:hover {
//           background: rgba(99, 102, 241, 0.05);
//         }

//         .icon-emoji {
//           font-size: 20px;
//           padding: 8px;
//           background: rgba(99, 102, 241, 0.1);
//           border-radius: 8px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           min-width: 36px;
//           height: 36px;
//         }
//       `}</style>

//       {/* Header */}
//       <div className="header" style={headerStyles}>
//         <h1 className="title" style={titleStyles}>
//           Convert AI Text to Authentic Content
//         </h1>
        
//         <div 
//           className="chip"
//           style={chipStyles}
//           onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
//           onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
//         >
//           🎁 Earn free words worth $6 →
//         </div>
//       </div>

//       {/* Main Content Card */}
//       <div className="card" style={cardStyles}>
//         {/* Text Input Area */}
//         <textarea
//           className="textarea"
//           style={textareaStyles}
//           value={inputText}
//           onChange={(e) => setInputText(e.target.value)}
//           placeholder="Enter the text you want to humanize here"
//           onFocus={(e) => e.target.style.borderColor = '#6366f1'}
//           onBlur={(e) => e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)'}
//         />

//         {/* Action Buttons */}
//         <div className="action-buttons" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
//           {[
//             { icon: UploadIcon, text: 'Upload File', id: 'upload', action: () => {} },
//             { icon: DocumentIcon, text: 'Try A Sample', id: 'sample', action: handleSampleText },
//             { icon: PasteIcon, text: 'Paste Text', id: 'paste', action: handlePasteText }
//           ].map((item) => (
//             <button
//               key={item.id}
//               className="action-button"
//               onClick={item.action}
//               style={{
//                 ...actionButtonStyles,
//                 ...(hoveredButton === item.id ? actionButtonHoverStyles : {}),
//               }}
//               onMouseEnter={() => setHoveredButton(item.id)}
//               onMouseLeave={() => setHoveredButton(null)}
//             >
//               <item.icon />
//               {item.text}
//             </button>
//           ))}
//         </div>

//         {/* Bottom Controls */}
//         <div className="bottom-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//             <span style={{ color: '#a1a1aa', fontSize: '16px' }}>Mode:</span>
            
//             <div style={selectStyles}>
//               <button
//                 className="select-button"
//                 onClick={() => setShowModeDropdown(!showModeDropdown)}
//                 style={{
//                   ...selectButtonStyles,
//                   borderColor: showModeDropdown ? '#6366f1' : 'rgba(99, 102, 241, 0.3)',
//                 }}
//               >
//                 {mode}
//                 <ExpandIcon />
//               </button>
              
//               {showModeDropdown && (
//                 <div style={dropdownStyles}>
//                   {modes.map((modeOption) => (
//                     <button
//                       key={modeOption}
//                       onClick={() => {
//                         setMode(modeOption);
//                         setShowModeDropdown(false);
//                       }}
//                       style={{
//                         width: '100%',
//                         padding: '12px 16px',
//                         backgroundColor: 'transparent',
//                         border: 'none',
//                         color: '#fff',
//                         cursor: 'pointer',
//                         textAlign: 'left',
//                         fontSize: '16px',
//                         borderRadius: modeOption === modes[0] ? '8px 8px 0 0' : modeOption === modes[modes.length - 1] ? '0 0 8px 8px' : '0',
//                         transition: 'background-color 0.2s ease-in-out',
//                       }}
//                       onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.2)'}
//                       onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
//                     >
//                       {modeOption}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           <button
//             className="primary-button"
//             style={{
//               ...primaryButtonStyles,
//               ...(isPrimaryHovered ? primaryButtonHoverStyles : {}),
//             }}
//             onMouseEnter={() => setIsPrimaryHovered(true)}
//             onMouseLeave={() => setIsPrimaryHovered(false)}
//             onClick={() => {
//               if (inputText.trim()) {
//                 alert(`Humanizing text in ${mode} mode: "${inputText.substring(0, 50)}..."`);
//               }
//             }}
//           >
//             Humanize
//           </button>
//         </div>

//         {/* Enhanced Tips Section */}
//         <div style={tipsContainerStyles}>
//           <div 
//             className="tips-header"
//             style={tipsHeaderStyles}
//             onClick={() => setShowTips(!showTips)}
//           >
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//               <div style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: '32px',
//                 height: '32px',
//                 background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
//                 borderRadius: '8px',
//                 color: '#fff'
//               }}>
//                 <LightBulbIcon />
//               </div>
//               <div>
//                 <h3 style={{
//                   color: '#f8fafc',
//                   fontSize: '16px',
//                   fontWeight: '600',
//                   margin: 0,
//                   marginBottom: '2px'
//                 }}>
//                   Pro Tips for Best Results
//                 </h3>
//                 <p style={{
//                   color: '#94a3b8',
//                   fontSize: '14px',
//                   margin: 0
//                 }}>
//                   {showTips ? 'Click to hide tips' : 'Click to view optimization tips'}
//                 </p>
//               </div>
//             </div>
            
//             <div style={{
//               color: '#94a3b8',
//               transition: 'transform 0.3s ease-in-out',
//               transform: showTips ? 'rotate(180deg)' : 'rotate(0deg)'
//             }}>
//               <ChevronDownIcon />
//             </div>
//           </div>

//           <div style={tipsContentStyles}>
//             <div style={{ display: 'grid', gap: '12px' }}>
//               {tips.map((tip, index) => (
//                 <div
//                   key={index}
//                   className="tip-item"
//                   style={tipItemStyles}
//                 >
//                   <div className="icon-emoji">
//                     {tip.icon}
//                   </div>
//                   <div style={{ flex: 1 }}>
//                     <h4 style={{
//                       color: '#f8fafc',
//                       fontSize: '15px',
//                       fontWeight: '600',
//                       margin: 0,
//                       marginBottom: '6px'
//                     }}>
//                       {tip.title}
//                     </h4>
//                     <p style={{
//                       color: '#94a3b8',
//                       fontSize: '14px',
//                       margin: 0,
//                       lineHeight: '1.5'
//                     }}>
//                       {tip.description}
//                     </p>
//                   </div>
//                   <div style={{
//                     color: '#10b981',
//                     opacity: 0.7
//                   }}>
//                     <CheckIcon />
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div style={{
//               marginTop: '20px',
//               padding: '16px',
//               background: 'rgba(16, 185, 129, 0.05)',
//               border: '1px solid rgba(16, 185, 129, 0.2)',
//               borderRadius: '8px',
//               textAlign: 'center'
//             }}>
//               <p style={{
//                 color: '#10b981',
//                 fontSize: '14px',
//                 fontWeight: '500',
//                 margin: 0,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 gap: '8px'
//               }}>
//                 <CheckIcon />
//                 Following these tips can improve your results by up to 40%
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainContent;



import React, { useState } from "react";
import "./MainContent.css";

// Icon components
const UploadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
  </svg>
);

const DocumentIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" />
  </svg>
);

const PasteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19,20H5V4H7V7H17V4H19M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M19,2H14.82C14.4,0.84 13.3,0 12,0C10.7,0 9.6,0.84 9.18,2H5A2,2 0 0,0 3,4V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V4A2,2 0 0,0 19,2Z" />
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
  </svg>
);

const SparklesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.5 2L7.5 7.5L2 9.5L7.5 11.5L9.5 17L11.5 11.5L17 9.5L11.5 7.5L9.5 2ZM19 12L17.75 15.25L14.5 16.5L17.75 17.75L19 21L20.25 17.75L23.5 16.5L20.25 15.25L19 12Z" />
  </svg>
);

const MagicWandIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.5,5.6L5,7L6.4,4.5L5,2L7.5,3.4L10,2L8.6,4.5L10,7L7.5,5.6M19.5,15.4L22,14L20.6,16.5L22,19L19.5,17.6L17,19L18.4,16.5L17,14L19.5,15.4M22,2L20.6,4.5L22,7L19.5,5.6L17,7L18.4,4.5L17,2L19.5,3.4L22,2M13.34,12.78L15.78,10.34L13.66,8.22L11.22,10.66L13.34,12.78M14.37,7.29L16.71,9.63C17.1,10 17.1,10.65 16.71,11.04L5.04,22.71C4.65,23.1 4,23.1 3.63,22.71L1.29,20.37C0.9,20 0.9,19.35 1.29,18.96L12.96,7.29C13.35,6.9 14,6.9 14.37,7.29Z" />
  </svg>
);

const AnalyzeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 8.12,16.5 8.91,15.77L10.32,17.18C9.89,17.96 9.16,18.68 8.28,19.25C7.86,18.83 7.46,18.57 7.07,18.28M16.93,18.28C16.54,18.57 16.14,18.83 15.72,19.25C14.84,18.68 14.11,17.96 13.68,17.18L15.09,15.77C15.88,16.5 16.5,17.38 16.93,18.28M12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M7.07,5.72C7.46,5.43 7.86,5.17 8.28,4.75C9.16,5.32 9.89,6.04 10.32,6.82L8.91,8.23C8.12,7.5 7.5,6.62 7.07,5.72M16.93,5.72C16.5,6.62 15.88,7.5 15.09,8.23L13.68,6.82C14.11,6.04 14.84,5.32 15.72,4.75C16.14,5.17 16.54,5.43 16.93,5.72Z" />
  </svg>
);

export default function MainContent() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState("");
  const [analysisData, setAnalysisData] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  // API base URL - your backend is running on localhost:8000
  const API_BASE_URL = "http://localhost:8000";

  const analyzeText = async () => {
    if (!inputText.trim()) return;
    
    setAnalyzing(true);
    setError("");
    
    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnalysisData(data);
      console.log('Analysis result:', data);
    } catch (err) {
      console.error('Error analyzing text:', err);
      setError('Failed to analyze text. Please check if the backend is running.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTransform = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${API_BASE_URL}/humanize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOutputText(data.humanized_text);
      console.log('Humanization result:', data);
    } catch (err) {
      console.error('Error calling API:', err);
      setError('Failed to humanize text. Please check if the backend is running on http://localhost:8000');
      // No fallback - we want to know if the API isn't working
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([outputText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "humanized.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const renderAnalysisResults = () => {
    if (!analysisData) return null;

    const getScoreColor = (score) => {
      if (score >= 70) return '#ef4444'; // red
      if (score >= 50) return '#f97316'; // orange
      if (score >= 30) return '#eab308'; // yellow
      return '#22c55e'; // green
    };

    return (
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '16px',
        margin: '16px 0',
        fontSize: '14px'
      }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>Analysis Results</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: `conic-gradient(${getScoreColor(analysisData.ai_score)} ${analysisData.ai_score * 3.6}deg, #e2e8f0 0deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: getScoreColor(analysisData.ai_score)
            }}>
              {Math.round(analysisData.ai_score)}%
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 'bold', color: '#1e293b' }}>{analysisData.classification}</div>
            <div style={{ color: '#64748b' }}>Confidence: {analysisData.confidence}</div>
          </div>
        </div>
        
        {analysisData.patterns && Object.keys(analysisData.patterns).length > 0 && (
          <div>
            <strong>Detected Patterns:</strong>
            <div style={{ marginTop: '8px' }}>
              {Object.entries(analysisData.patterns).map(([category, data]) => (
                <div key={category} style={{ marginBottom: '4px' }}>
                  <span style={{ color: '#7c3aed', fontWeight: '500' }}>{category}:</span> {data.indicators?.join(', ') || 'Found'}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="main-wrapper">
      <header className="main-header">
        <MagicWandIcon />
        <h1>
          AI to Human <span>Text Transformer</span>
        </h1>
        <p>Transform robotic AI content into engaging human writing</p>
        <div className="badge">
          <SparklesIcon /> Premium Quality • Instant Results
        </div>
      </header>

      {error && (
        <div className="error-message" style={{
          background: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '12px',
          borderRadius: '8px',
          margin: '16px 0',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      <div className="content-grid">
        {/* Input */}
        <div className="content-panel">
          <h3>Original Text</h3>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your AI-generated text here..."
          />
          <div className="panel-actions">
            <button 
              className="action-btn secondary" 
              onClick={analyzeText} 
              disabled={analyzing || !inputText.trim()}
              style={{ marginRight: '8px' }}
            >
              <AnalyzeIcon />
              {analyzing ? "Analyzing..." : "Analyze"}
            </button>
            <button 
              className="action-btn" 
              onClick={handleTransform} 
              disabled={loading || !inputText.trim()}
            >
              {loading ? "Transforming..." : "Humanize"}
            </button>
          </div>
          
          {renderAnalysisResults()}
        </div>

        {/* Output */}
        <div className="content-panel">
          <h3>Humanized Text</h3>
          <textarea
            value={outputText}
            onChange={(e) => setOutputText(e.target.value)}
            placeholder="Your humanized text will appear here..."
          />
          {outputText && (
            <div className="panel-actions">
              <button className="action-btn secondary" onClick={handleCopy}>
                <CopyIcon /> {copySuccess ? "Copied!" : "Copy"}
              </button>
              <button className="action-btn secondary" onClick={handleDownload}>
                <DownloadIcon /> Download
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}