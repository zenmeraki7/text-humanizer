// styles.js - Responsive styles for the PlagiarismRemover component

const drawerWidth = 280;
const collapsedDrawerWidth = 64;

// Responsive breakpoints
const breakpoints = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1200px'
};

// Detect screen size
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
  marginBottom: '24px',
  '@media (min-width: 769px)': {
    marginBottom: '32px',
  }
};

export const titleStyles = {
  fontSize: 'clamp(2rem, 5vw, 3rem)', // Responsive font size
  fontWeight: 'bold',
  color: '#fff',
  marginBottom: '12px',
  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  lineHeight: '1.2',
  '@media (min-width: 769px)': {
    marginBottom: '16px',
  }
};

export const chipStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  backgroundColor: '#8b5cf6',
  color: '#fff',
  padding: 'clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px)', // Responsive padding
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out',
  fontSize: 'clamp(12px, 2.5vw, 14px)', // Responsive font size
  textAlign: 'center',
  '@media (max-width: 768px)': {
    flexWrap: 'wrap',
    justifyContent: 'center',
  }
};

export const cardStyles = {
  maxWidth: '100%',
  width: '100%',
  margin: '0 auto',
  background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.5) 0%, rgba(22, 33, 62, 0.3) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  borderRadius: 'clamp(12px, 2vw, 16px)',
  padding: 'clamp(12px, 3vw, 24px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  '@media (min-width: 769px)': {
    maxWidth: '1024px',
  }
};

export const textareaStyles = {
  width: '100%',
  height: 'clamp(200px, 30vh, 256px)', // Responsive height
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  borderRadius: '8px',
  padding: 'clamp(12px, 2.5vw, 16px)',
  color: '#fff',
  fontSize: 'clamp(14px, 2.5vw, 16px)',
  fontFamily: 'inherit',
  resize: 'none',
  outline: 'none',
  marginBottom: 'clamp(16px, 3vw, 24px)',
  transition: 'border-color 0.2s ease-in-out',
  boxSizing: 'border-box',
};

export const actionButtonStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'clamp(8px, 2vw, 12px)',
  padding: 'clamp(12px, 2.5vw, 16px) clamp(16px, 3vw, 24px)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  backgroundColor: 'transparent',
  color: '#a1a1aa',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: 'clamp(14px, 2.5vw, 16px)',
  fontWeight: 500,
  transition: 'all 0.2s ease-in-out',
  width: '100%',
  minHeight: '48px', // Better touch target on mobile
  textAlign: 'center',
};

export const actionButtonHoverStyles = {
  borderColor: '#8b5cf6',
  color: '#fff',
  backgroundColor: 'rgba(139, 92, 246, 0.1)',
};

export const getPrimaryButtonStyles = (isProcessing) => ({
  padding: 'clamp(10px, 2vw, 12px) clamp(24px, 4vw, 32px)',
  background: isProcessing 
    ? 'linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%)' 
    : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  border: 'none',
  color: '#fff',
  borderRadius: '8px',
  cursor: isProcessing ? 'not-allowed' : 'pointer',
  fontSize: 'clamp(14px, 2.5vw, 16px)',
  fontWeight: 600,
  transition: 'all 0.2s ease-in-out',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  opacity: isProcessing ? 0.8 : 1,
  minHeight: '48px',
  width: '100%',
  '@media (min-width: 769px)': {
    width: 'auto',
  }
});

export const primaryButtonHoverStyles = {
  background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
  transform: 'translateY(-2px)',
  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
};

export const selectStyles = {
  position: 'relative',
  minWidth: 'clamp(120px, 20vw, 128px)',
  width: '100%',
  '@media (min-width: 769px)': {
    width: 'auto',
  }
};

export const selectButtonStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 2.5vw, 16px)',
  backgroundColor: '#374151',
  border: '1px solid rgba(139, 92, 246, 0.3)',
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
  border: '1px solid rgba(139, 92, 246, 0.3)',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  zIndex: 1000,
  marginTop: '4px',
};

export const tipsContainerStyles = {
  marginTop: 'clamp(16px, 3vw, 24px)',
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(124, 58, 237, 0.03) 100%)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
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
  borderBottom: showTips ? '1px solid rgba(139, 92, 246, 0.2)' : 'none',
  flexWrap: 'wrap',
  gap: '12px',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    textAlign: 'center',
  }
});

export const getTipsContentStyles = (showTips) => ({
  maxHeight: showTips ? '800px' : '0', // Increased for mobile content
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  padding: showTips ? 'clamp(16px, 3vw, 20px)' : '0 clamp(16px, 3vw, 20px)',
});

export const tipItemStyles = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 'clamp(12px, 2.5vw, 16px)',
  padding: 'clamp(12px, 2.5vw, 16px)',
  background: 'rgba(139, 92, 246, 0.03)',
  border: '1px solid rgba(139, 92, 246, 0.1)',
  borderRadius: '8px',
  marginBottom: '12px',
  transition: 'all 0.2s ease-in-out',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
  }
};

export const resultCardStyles = {
  marginTop: 'clamp(16px, 3vw, 24px)',
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  borderRadius: 'clamp(8px, 2vw, 12px)',
  padding: 'clamp(16px, 3vw, 24px)',
  animation: 'slideInUp 0.5s ease-out',
};

export const comparisonStyles = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 'clamp(16px, 3vw, 20px)',
  marginTop: 'clamp(16px, 3vw, 20px)',
  '@media (min-width: 769px)': {
    gridTemplateColumns: '1fr 1fr',
  }
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

export const getErrorStyles = (error) => ({
  marginTop: '16px',
  padding: 'clamp(10px, 2vw, 12px) clamp(12px, 2.5vw, 16px)',
  background: error.startsWith('✅') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
  border: error.startsWith('✅') ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
  borderRadius: '8px',
  color: error.startsWith('✅') ? '#34d399' : '#fca5a5',
  fontSize: 'clamp(12px, 2vw, 14px)',
  wordBreak: 'break-word',
});

export const fileInfoStyles = {
  marginTop: '16px',
  padding: 'clamp(10px, 2vw, 12px) clamp(12px, 2.5vw, 16px)',
  background: 'rgba(139, 92, 246, 0.1)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  borderRadius: '8px',
  color: '#a78bfa',
  fontSize: 'clamp(12px, 2vw, 14px)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
  wordBreak: 'break-word',
};

export const copyButtonStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 2.5vw, 16px)',
  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  border: 'none',
  borderRadius: '6px',
  color: '#fff',
  cursor: 'pointer',
  fontSize: 'clamp(12px, 2vw, 14px)',
  fontWeight: '500',
  transition: 'all 0.2s ease-in-out',
  minHeight: '40px',
  whiteSpace: 'nowrap',
};

export const statsContainerStyles = {
  marginTop: 'clamp(16px, 3vw, 20px)', 
  padding: 'clamp(12px, 2.5vw, 16px)', 
  background: 'rgba(139, 92, 246, 0.1)', 
  borderRadius: '8px',
  border: '1px solid rgba(139, 92, 246, 0.2)'
};

export const additionalStatsStyles = {
  marginTop: '16px', 
  padding: 'clamp(10px, 2vw, 12px)', 
  background: 'rgba(0, 0, 0, 0.2)', 
  borderRadius: '6px',
  fontSize: 'clamp(11px, 2vw, 12px)',
  color: '#94a3b8',
  wordBreak: 'break-word',
};

export const tipsFooterStyles = {
  marginTop: 'clamp(16px, 3vw, 20px)',
  padding: 'clamp(12px, 2.5vw, 16px)',
  background: 'rgba(139, 92, 246, 0.05)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  borderRadius: '8px',
  textAlign: 'center'
};

// Enhanced CSS string for style tag with responsive features
export const cssStyles = `
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

  /* Mobile-optimized interactions */
  @media (max-width: 768px) {
    .tip-item:hover,
    .tip-item:focus {
      background: rgba(139, 92, 246, 0.08) !important;
      border-color: rgba(139, 92, 246, 0.3) !important;
      transform: none; /* Disable transform on mobile to prevent layout issues */
      animation: none; /* Disable complex animations on mobile */
    }

    .tips-header:hover,
    .tips-header:focus {
      background: rgba(139, 92, 246, 0.05);
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

    /* Mobile-specific grid layouts */
    .action-buttons-grid {
      display: grid !important;
      grid-template-columns: 1fr !important;
      gap: 12px !important;
    }

    .bottom-controls {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 16px !important;
    }

    .mode-selector {
      order: 1;
    }

    .primary-button {
      order: 2;
    }

    /* Stats grid responsive */
    .stats-grid {
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)) !important;
      gap: 12px !important;
    }

    .additional-stats-grid {
      grid-template-columns: 1fr !important;
      gap: 8px !important;
      text-align: center;
    }
  }

  /* Tablet optimizations */
  @media (min-width: 769px) and (max-width: 1024px) {
    .tip-item:hover {
      background: rgba(139, 92, 246, 0.08) !important;
      border-color: rgba(139, 92, 246, 0.3) !important;
      transform: translateY(-1px);
      animation: tipGlow 2s ease-in-out infinite;
    }

    .comparison-grid {
      gap: 16px;
    }
  }

  /* Desktop optimizations */
  @media (min-width: 1025px) {
    .tip-item:hover {
      background: rgba(139, 92, 246, 0.08) !important;
      border-color: rgba(139, 92, 246, 0.3) !important;
      transform: translateY(-2px);
      animation: tipGlow 2s ease-in-out infinite;
    }

    .tips-header:hover {
      background: rgba(139, 92, 246, 0.05);
    }
  }

  /* Common responsive classes */
  .icon-emoji {
    font-size: clamp(16px, 3vw, 20px);
    padding: clamp(6px, 1.5vw, 8px);
    background: rgba(139, 92, 246, 0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: clamp(32px, 6vw, 36px);
    height: clamp(32px, 6vw, 36px);
    flex-shrink: 0;
  }

  .comparison-text {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 8px;
    padding: clamp(12px, 2.5vw, 16px);
    color: #e2e8f0;
    line-height: 1.6;
    font-size: clamp(12px, 2.5vw, 14px);
    max-height: clamp(200px, 40vh, 300px);
    overflow-y: auto;
    word-break: break-word;
    hyphens: auto;
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

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .tip-item,
    .comparison-text,
    textarea {
      border-width: 2px;
    }
  }

  /* Focus styles for accessibility */
  button:focus-visible,
  textarea:focus-visible,
  .tips-header:focus-visible {
    outline: 2px solid #8b5cf6;
    outline-offset: 2px;
  }
`;