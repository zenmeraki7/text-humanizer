// MainContentStyles.js - Enhanced with glowing halos and lighter background

const drawerWidth = 280;
const collapsedDrawerWidth = 64;

// Responsive breakpoints
const breakpoints = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1200px'
};

// Screen size detection
const getScreenSize = () => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
  return {
    isMobile: width <= 768,
    isTablet: width > 768 && width <= 1024,
    isDesktop: width > 1024,
    width
  };
};

export const getMainContentStyles = (sidebarOpen) => {
  const screenSize = getScreenSize();
  
  return {
    marginLeft: screenSize.isMobile ? '0' : (sidebarOpen ? drawerWidth : collapsedDrawerWidth),
    transition: 'margin-left 0.3s ease-in-out',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #3730a3 50%, #4c1d95 75%, #581c87 100%)',
    padding: screenSize.isMobile ? '16px' : screenSize.isTablet ? '20px' : '24px',
    margin: 0,
    marginTop: 0,
    position: 'relative',
    overflow: 'hidden',
  };
};

export const headerStyles = {
  textAlign: 'center',
  marginBottom: 'clamp(20px, 4vw, 32px)',
  position: 'relative',
};

export const titleStyles = {
  fontSize: 'clamp(2rem, 5vw, 3rem)',
  fontWeight: 'bold',
  color: '#fff',
  marginBottom: 'clamp(12px, 2vw, 16px)',
  background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #e879f9 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  lineHeight: '1.2',
  filter: 'drop-shadow(0 0 20px rgba(129, 140, 248, 0.4))',
  margin-top: 0,
};

export const chipStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'clamp(6px, 1.5vw, 8px)',
  background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
  color: '#fff',
  padding: 'clamp(8px, 2vw, 10px) clamp(14px, 3.5vw, 18px)',
  borderRadius: '12px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  fontSize: 'clamp(12px, 2.5vw, 14px)',
  textAlign: 'center',
  flexWrap: 'wrap',
  justifyContent: 'center',
  boxShadow: '0 0 30px rgba(245, 158, 11, 0.5), 0 0 60px rgba(249, 115, 22, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
};

export const cardStyles = {
  maxWidth: '100%',
  width: '100%',
  maxWidth: '900px',
  margin: '0 auto',
  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(168, 85, 247, 0.15) 100%)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(167, 139, 250, 0.3)',
  borderRadius: 'clamp(16px, 2.5vw, 20px)',
  padding: 'clamp(20px, 3.5vw, 28px)',
  boxShadow: `
    0 0 40px rgba(99, 102, 241, 0.2),
    0 0 80px rgba(139, 92, 246, 0.15),
    inset 0 0 60px rgba(167, 139, 250, 0.05)
  `,
  position: 'relative',
  '@media (min-width: 1025px)': {
    maxWidth: '1024px',
  }
};

export const textareaStyles = {
  width: '100%',
  height: 'clamp(200px, 25vh, 256px)',
  backgroundColor: 'rgba(30, 27, 75, 0.4)',
  border: '2px solid rgba(167, 139, 250, 0.3)',
  borderRadius: '12px',
  padding: 'clamp(14px, 3vw, 18px)',
  color: '#e0e7ff',
  fontSize: 'clamp(14px, 2.5vw, 16px)',
  fontFamily: 'inherit',
  resize: 'none',
  outline: 'none',
  transition: 'all 0.3s ease-in-out',
  boxSizing: 'border-box',
  boxShadow: 'inset 0 0 20px rgba(99, 102, 241, 0.1)',
};

export const actionButtonStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'clamp(8px, 2vw, 12px)',
  padding: 'clamp(12px, 2.5vw, 16px) clamp(16px, 3vw, 24px)',
  border: '2px solid rgba(167, 139, 250, 0.4)',
  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
  color: '#c4b5fd',
  borderRadius: '12px',
  cursor: 'pointer',
  fontSize: 'clamp(14px, 2.5vw, 16px)',
  fontWeight: 500,
  transition: 'all 0.3s ease-in-out',
  width: '100%',
  minHeight: '48px',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
};

export const actionButtonHoverStyles = {
  borderColor: '#a78bfa',
  color: '#fff',
  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.2) 100%)',
  boxShadow: '0 0 20px rgba(167, 139, 250, 0.4), inset 0 0 20px rgba(99, 102, 241, 0.1)',
  transform: 'translateY(-2px)',
};

export const primaryButtonStyles = {
  padding: 'clamp(12px, 2.5vw, 14px) clamp(28px, 5vw, 36px)',
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
  border: '2px solid rgba(167, 139, 250, 0.5)',
  color: '#fff',
  borderRadius: '12px',
  cursor: 'pointer',
  fontSize: 'clamp(15px, 2.8vw, 17px)',
  fontWeight: 600,
  transition: 'all 0.3s ease-in-out',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  minHeight: '52px',
  width: '100%',
  whiteSpace: 'nowrap',
  boxShadow: '0 0 30px rgba(99, 102, 241, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)',
  position: 'relative',
  overflow: 'hidden',
};

export const primaryButtonHoverStyles = {
  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)',
  transform: 'translateY(-3px)',
  boxShadow: '0 0 40px rgba(99, 102, 241, 0.7), 0 0 80px rgba(139, 92, 246, 0.5)',
  borderColor: '#c4b5fd',
};

export const selectStyles = {
  position: 'relative',
  minWidth: 'clamp(120px, 20vw, 128px)',
  width: '100%',
};

export const selectButtonStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  padding: 'clamp(8px, 2vw, 10px) clamp(14px, 3vw, 18px)',
  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%)',
  border: '2px solid rgba(167, 139, 250, 0.4)',
  color: '#e0e7ff',
  borderRadius: '10px',
  cursor: 'pointer',
  fontSize: 'clamp(14px, 2.5vw, 16px)',
  transition: 'all 0.3s ease-in-out',
  width: '100%',
  minHeight: '44px',
  boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)',
};

export const dropdownStyles = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  background: 'linear-gradient(135deg, rgba(49, 46, 129, 0.95) 0%, rgba(55, 48, 163, 0.95) 100%)',
  backdropFilter: 'blur(10px)',
  border: '2px solid rgba(167, 139, 250, 0.4)',
  borderRadius: '10px',
  boxShadow: '0 0 30px rgba(99, 102, 241, 0.3), 0 8px 16px rgba(0, 0, 0, 0.3)',
  zIndex: 1000,
  marginTop: '6px',
};

export const tipsContainerStyles = {
  marginTop: 'clamp(16px, 3vw, 24px)',
  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
  border: '2px solid rgba(167, 139, 250, 0.3)',
  borderRadius: 'clamp(12px, 2.5vw, 16px)',
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  marginBottom: 'clamp(16px, 3vw, 24px)',
  boxShadow: '0 0 30px rgba(99, 102, 241, 0.2), inset 0 0 30px rgba(139, 92, 246, 0.05)',
};

export const getTipsHeaderStyles = (showTips) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 'clamp(14px, 3vw, 18px) clamp(18px, 3.5vw, 22px)',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  borderBottom: showTips ? '2px solid rgba(167, 139, 250, 0.3)' : 'none',
  flexWrap: 'wrap',
  gap: '12px',
  background: showTips ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
});

export const getTipsContentStyles = (showTips) => {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;
  
  return {
    maxHeight: showTips ? (isMobile ? 'none' : '500px') : '0',
    height: showTips ? 'auto' : '0',
    overflow: showTips ? (isMobile ? 'visible' : 'auto') : 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    padding: showTips ? 'clamp(18px, 3.5vw, 24px)' : '0 clamp(18px, 3.5vw, 24px)',
    ...(isMobile && showTips && {
      maxHeight: 'calc(100vh - 300px)',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch'
    })
  };
};

export const tipItemStyles = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 'clamp(12px, 2.5vw, 16px)',
  padding: 'clamp(14px, 3vw, 18px)',
  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
  border: '2px solid rgba(167, 139, 250, 0.2)',
  borderRadius: '12px',
  marginBottom: '14px',
  transition: 'all 0.3s ease-in-out',
  boxShadow: '0 0 15px rgba(99, 102, 241, 0.1)',
};

export const outputButtonStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: 'clamp(8px, 2vw, 10px) clamp(14px, 3vw, 18px)',
  border: '2px solid rgba(167, 139, 250, 0.4)',
  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
  color: '#c4b5fd',
  borderRadius: '10px',
  cursor: 'pointer',
  fontSize: 'clamp(13px, 2.2vw, 15px)',
  fontWeight: 500,
  transition: 'all 0.3s ease-in-out',
  minHeight: '44px',
  whiteSpace: 'nowrap',
  boxShadow: '0 0 10px rgba(99, 102, 241, 0.15)',
};

export const outputButtonHoverStyles = {
  borderColor: '#a78bfa',
  color: '#fff',
  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.2) 100%)',
  boxShadow: '0 0 25px rgba(167, 139, 250, 0.4)',
  transform: 'translateY(-2px)',
};

export const spinnerStyles = {
  width: '20px',
  height: '20px',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  borderTop: '2px solid #ffffff',
  borderRadius: '50%',
  animation: 'spinner 1s linear infinite',
  flexShrink: 0,
  boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
};

// Enhanced CSS with glowing effects
export const cssStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes spinner {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes glow-pulse {
    0%, 100% {
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.3),
                  0 0 40px rgba(139, 92, 246, 0.2);
    }
    50% {
      box-shadow: 0 0 30px rgba(99, 102, 241, 0.5),
                  0 0 60px rgba(139, 92, 246, 0.4);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  /* Glowing background orbs */
  .main-content::before,
  .main-content::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.3;
    pointer-events: none;
    z-index: 0;
    animation: float 8s ease-in-out infinite;
  }

  .main-content::before {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, #6366f1 0%, transparent 70%);
    top: -200px;
    left: -200px;
  }

  .main-content::after {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, #a855f7 0%, transparent 70%);
    bottom: -250px;
    right: -250px;
    animation-delay: -4s;
  }

  .card {
    position: relative;
    z-index: 1;
  }

  /* Textarea glow on focus */
  .textarea:focus {
    border-color: #a78bfa !important;
    box-shadow: 0 0 20px rgba(167, 139, 250, 0.4),
                inset 0 0 20px rgba(99, 102, 241, 0.1) !important;
  }

  /* Mobile Responsive Styles */
  @media (max-width: 768px) {
    .main-content {
      margin-left: 0 !important;
      padding: 16px !important;
    }
    
    .main-content::before,
    .main-content::after {
      width: 250px;
      height: 250px;
      filter: blur(60px);
    }

    .input-output-grid {
      display: grid !important;
      grid-template-columns: 1fr !important;
      gap: 20px !important;
    }

    .action-buttons {
      grid-template-columns: 1fr !important;
      gap: 12px !important;
    }
    
    .bottom-controls {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 16px !important;
    }

    .mode-selector {
      justify-content: center !important;
      width: 100% !important;
    }

    .primary-button {
      width: 100% !important;
    }
    
    .textarea {
      height: 180px !important;
    }
    
    .card {
      padding: 18px !important;
      border-radius: 14px !important;
    }

    .tips-header {
      flex-direction: column !important;
      text-align: center !important;
      gap: 12px !important;
    }

    .tip-item {
      flex-direction: column !important;
      text-align: center !important;
      align-items: center !important;
    }

    .output-buttons {
      justify-content: center !important;
      flex-wrap: wrap !important;
    }

    button, 
    .tips-header,
    .tip-item {
      min-height: 44px;
    }

    * {
      max-width: 100%;
      box-sizing: border-box;
    }
  }

  /* Tablet Responsive Styles */
  @media (min-width: 769px) and (max-width: 1024px) {
    .input-output-grid {
      gap: 20px !important;
    }

    .action-buttons {
      grid-template-columns: repeat(2, 1fr) !important;
    }

    .bottom-controls {
      flex-wrap: wrap !important;
      gap: 16px !important;
    }

    .mode-selector {
      flex: 1 !important;
      min-width: 200px !important;
    }
  }

  /* Desktop Styles */
  @media (min-width: 1025px) {
    .input-output-grid {
      grid-template-columns: 1fr 1fr !important;
      gap: 24px !important;
    }

    .action-buttons {
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)) !important;
    }

    .bottom-controls {
      flex-direction: row !important;
      justify-content: space-between !important;
    }

    .primary-button {
      width: auto !important;
    }
  }

  /* Hover effects with glow */
  @media (hover: hover) {
    .tip-item:hover {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%) !important;
      border-color: rgba(167, 139, 250, 0.5) !important;
      transform: translateY(-2px);
      box-shadow: 0 0 25px rgba(99, 102, 241, 0.3), 0 0 50px rgba(139, 92, 246, 0.2);
    }

    .tips-header:hover {
      background: rgba(99, 102, 241, 0.1);
    }

    .chip:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 0 40px rgba(245, 158, 11, 0.6), 0 0 80px rgba(249, 115, 22, 0.4);
    }
  }

  /* Mobile-specific hover effects */
  @media (max-width: 768px) {
    .tip-item:hover,
    .tip-item:focus {
      background: rgba(99, 102, 241, 0.15) !important;
      border-color: rgba(167, 139, 250, 0.4) !important;
      transform: none;
    }
  }

  .icon-emoji {
    font-size: clamp(16px, 3vw, 20px);
    padding: clamp(8px, 2vw, 10px);
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%);
    border: 1px solid rgba(167, 139, 250, 0.3);
    borderRadius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: clamp(36px, 7vw, 40px);
    height: clamp(36px, 7vw, 40px);
    flex-shrink: 0;
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.2);
  }

  /* Pulsing glow effect for primary button */
  .primary-button {
    animation: glow-pulse 3s ease-in-out infinite;
  }

  /* Accessibility improvements */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }

    .main-content::before,
    .main-content::after {
      animation: none !important;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .tip-item,
    textarea,
    button {
      border-width: 3px;
    }
  }

  /* Focus indicators with glow */
  button:focus-visible,
  textarea:focus-visible,
  .tips-header:focus-visible {
    outline: 3px solid #a78bfa;
    outline-offset: 3px;
    box-shadow: 0 0 20px rgba(167, 139, 250, 0.5);
  }

  /* Text selection with glow */
  ::selection {
    background-color: rgba(167, 139, 250, 0.4);
    color: #fff;
    text-shadow: 0 0 10px rgba(167, 139, 250, 0.5);
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(30, 27, 75, 0.3);
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.7);
  }
`;