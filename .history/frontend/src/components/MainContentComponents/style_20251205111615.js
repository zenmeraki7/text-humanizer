// MainContentStyles.js - Responsive styles for MainContent component

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
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    padding: screenSize.isMobile ? '16px' : screenSize.isTablet ? '20px' : '24px',
    margin: 0,
    marginTop: 0,
  };
};

export const headerStyles = {
  textAlign: 'center',
  marginBottom: 'clamp(20px, 4vw, 32px)',
};

export const titleStyles = {
  fontSize: 'clamp(2rem, 5vw, 3rem)',
  fontWeight: 'bold',
  color: '#fff',
  marginBottom: 'clamp(12px, 2vw, 16px)',
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  lineHeight: '1.2',
};

export const chipStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'clamp(6px, 1.5vw, 8px)',
  backgroundColor: '#f97316',
  color: '#fff',
  padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out',
  fontSize: 'clamp(12px, 2.5vw, 14px)',
  textAlign: 'center',
  flexWrap: 'wrap',
  justifyContent: 'center',
};

export const cardStyles = {
  maxWidth: '100%',
  width: '100%',
    maxWidth: '900px',
  margin: '0 auto',
  background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.5) 0%, rgba(22, 33, 62, 0.3) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(99, 102, 241, 0.2)',
  borderRadius: 'clamp(12px, 2vw, 16px)',
  padding: 'clamp(16px, 3vw, 24px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  '@media (min-width: 1025px)': {
    maxWidth: '1024px',
  }
};

export const textareaStyles = {
  width: '100%',
  height: 'clamp(200px, 25vh, 256px)',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(99, 102, 241, 0.3)',
  borderRadius: '8px',
  padding: 'clamp(12px, 2.5vw, 16px)',
  color: '#fff',
  fontSize: 'clamp(14px, 2.5vw, 16px)',
  fontFamily: 'inherit',
  resize: 'none',
  outline: 'none',
  transition: 'border-color 0.2s ease-in-out',
  boxSizing: 'border-box',
};

export const actionButtonStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'clamp(8px, 2vw, 12px)',
  padding: 'clamp(12px, 2.5vw, 16px) clamp(16px, 3vw, 24px)',
  border: '1px solid rgba(99, 102, 241, 0.3)',
  backgroundColor: 'transparent',
  color: '#a1a1aa',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: 'clamp(14px, 2.5vw, 16px)',
  fontWeight: 500,
  transition: 'all 0.2s ease-in-out',
  width: '100%',
  minHeight: '48px',
  textAlign: 'center',
};

export const actionButtonHoverStyles = {
  borderColor: '#6366f1',
  color: '#fff',
  backgroundColor: 'rgba(99, 102, 241, 0.1)',
};

export const primaryButtonStyles = {
  padding: 'clamp(10px, 2vw, 12px) clamp(24px, 4vw, 32px)',
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  border: 'none',
  color: '#fff',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: 'clamp(14px, 2.5vw, 16px)',
  fontWeight: 600,
  transition: 'all 0.2s ease-in-out',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  minHeight: '48px',
  width: '100%',
  whiteSpace: 'nowrap',
};

export const primaryButtonHoverStyles = {
  background: 'linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)',
  transform: 'translateY(-2px)',
  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
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
  padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 2.5vw, 16px)',
  backgroundColor: '#374151',
  border: '1px solid rgba(99, 102, 241, 0.3)',
  color: '#fff',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: 'clamp(14px, 2.5vw, 16px)',
  transition: 'border-color 0.2s ease-in-out',
  width: '100%',
  minHeight: '44px',
};

export const dropdownStyles = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  backgroundColor: '#374151',
  border: '1px solid rgba(99, 102, 241, 0.3)',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  zIndex: 1000,
  marginTop: '4px',
};

export const tipsContainerStyles = {
  marginTop: 'clamp(16px, 3vw, 24px)',
  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.03) 100%)',
  border: '1px solid rgba(99, 102, 241, 0.2)',
  borderRadius: 'clamp(8px, 2vw, 12px)',
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  marginBottom: 'clamp(16px, 3vw, 24px)',
};

export const getTipsHeaderStyles = (showTips) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 'clamp(12px, 2.5vw, 16px) clamp(16px, 3vw, 20px)',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  borderBottom: showTips ? '1px solid rgba(99, 102, 241, 0.2)' : 'none',
  flexWrap: 'wrap',
  gap: '12px',
});

export const getTipsContentStyles = (showTips) => {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;
  
  return {
    maxHeight: showTips ? (isMobile ? 'none' : '500px') : '0',
    height: showTips ? 'auto' : '0',
    overflow: showTips ? (isMobile ? 'visible' : 'auto') : 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    padding: showTips ? 'clamp(16px, 3vw, 20px)' : '0 clamp(16px, 3vw, 20px)',
    // Add scrolling for very long content on mobile if needed
    ...(isMobile && showTips && {
      maxHeight: 'calc(100vh - 300px)', // Fallback max height
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch'
    })
  };
};

export const tipItemStyles = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 'clamp(12px, 2.5vw, 16px)',
  padding: 'clamp(12px, 2.5vw, 16px)',
  background: 'rgba(99, 102, 241, 0.03)',
  border: '1px solid rgba(99, 102, 241, 0.1)',
  borderRadius: '8px',
  marginBottom: '12px',
  transition: 'all 0.2s ease-in-out',
};

export const outputButtonStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 2.5vw, 16px)',
  border: '1px solid rgba(99, 102, 241, 0.3)',
  backgroundColor: 'transparent',
  color: '#a1a1aa',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: 'clamp(12px, 2vw, 14px)',
  fontWeight: 500,
  transition: 'all 0.2s ease-in-out',
  minHeight: '40px',
  whiteSpace: 'nowrap',
};

export const outputButtonHoverStyles = {
  borderColor: '#6366f1',
  color: '#fff',
  backgroundColor: 'rgba(99, 102, 241, 0.1)',
};

export const spinnerStyles = {
  width: '20px',
  height: '20px',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  borderTop: '2px solid #ffffff',
  borderRadius: '50%',
  animation: 'spinner 1s linear infinite',
  flexShrink: 0,
};

// Enhanced CSS with responsive features
export const cssStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes spinner {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Mobile Responsive Styles */
  @media (max-width: 768px) {
    .main-content {
      margin-left: 0 !important;
      padding: 16px !important;
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
      padding: 16px !important;
      border-radius: 12px !important;
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

    /* Better touch targets */
    button, 
    .tips-header,
    .tip-item {
      min-height: 44px;
    }

    /* Prevent horizontal scrolling */
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

  /* Hover effects - only on non-touch devices */
  @media (hover: hover) {
    .tip-item:hover {
      background: rgba(99, 102, 241, 0.08) !important;
      border-color: rgba(99, 102, 241, 0.3) !important;
      transform: translateY(-2px);
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.1);
    }

    .tips-header:hover {
      background: rgba(99, 102, 241, 0.05);
    }
  }

  /* Mobile-specific hover effects */
  @media (max-width: 768px) {
    .tip-item:hover,
    .tip-item:focus {
      background: rgba(99, 102, 241, 0.08) !important;
      border-color: rgba(99, 102, 241, 0.3) !important;
      transform: none; /* Disable transform on mobile */
    }
  }

  .icon-emoji {
    font-size: clamp(16px, 3vw, 20px);
    padding: clamp(6px, 1.5vw, 8px);
    background: rgba(99, 102, 241, 0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: clamp(32px, 6vw, 36px);
    height: clamp(32px, 6vw, 36px);
    flex-shrink: 0;
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
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .tip-item,
    textarea,
    button {
      border-width: 2px;
    }
  }

  /* Focus indicators */
  button:focus-visible,
  textarea:focus-visible,
  .tips-header:focus-visible {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
  }

  /* Text selection improvements */
  ::selection {
    background-color: rgba(99, 102, 241, 0.3);
    color: #fff;
  }
`;