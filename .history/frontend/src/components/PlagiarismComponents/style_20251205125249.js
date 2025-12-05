// styles.js - Centralized styles for the PlagiarismRemover component with light theme

const drawerWidth = 280;
const collapsedDrawerWidth = 64;

export const getMainContentStyles = (sidebarOpen) => ({
  marginLeft: sidebarOpen ? drawerWidth : collapsedDrawerWidth,
  transition: 'margin-left 0.3s ease-in-out',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #ffffff 0%, #e8f4f8 50%, #d4e9f2 100%)',
  padding: '24px',
  margin: 0,
  marginTop: '30px',
});

export const headerStyles = {
  textAlign: 'center',
  marginBottom: 'clamp(20px, 4vw, 32px)',
  padding: '0 16px',
};

export const titleStyles = {
  fontSize: 'clamp(1.8rem, 5vw, 3rem)',
  fontWeight: 'bold',
  color: '#023859',
  marginBottom: '16px',
  background: 'linear-gradient(135deg, #023859 0%, #034a73 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  lineHeight: '1.2',
};

export const chipStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: '#023859',
  color: '#fff',
  padding: '8px 16px',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out',
};

export const cardStyles = {
  maxWidth: '1024px',
  margin: '0 auto',
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(232, 244, 248, 0.9) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(2, 56, 89, 0.2)',
  borderRadius: '16px',
  padding: '16px',
  boxShadow: '0 8px 32px rgba(2, 56, 89, 0.15)',
};

export const textareaStyles = {
  width: '100%',
  height: '256px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  border: '1px solid rgba(2, 56, 89, 0.3)',
  borderRadius: '8px',
  padding: '16px',
  color: '#023859',
  fontSize: '16px',
  fontFamily: 'inherit',
  resize: 'none',
  outline: 'none',
  marginBottom: '24px',
  transition: 'border-color 0.2s ease-in-out',
  boxSizing: 'border-box',
};

export const actionButtonStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'clamp(8px, 2vw, 12px)',
  padding: 'clamp(12px 16px, 3vw, 16px 24px)',
  border: '1px solid rgba(2, 56, 89, 0.3)',
  backgroundColor: 'transparent',
  color: '#023859',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: 'clamp(14px, 2.5vw, 16px)',
  fontWeight: 500,
  transition: 'all 0.2s ease-in-out',
  width: '100%',
  minHeight: '44px',
};

export const actionButtonHoverStyles = {
  borderColor: '#023859',
  color: '#ffffff',
  backgroundColor: 'rgba(2, 56, 89, 0.9)',
};

export const getPrimaryButtonStyles = (isProcessing) => ({
  padding: 'clamp(10px 24px, 3vw, 12px 32px)',
  background: isProcessing 
    ? 'linear-gradient(135deg, #012744 0%, #02385a 100%)' 
    : 'linear-gradient(135deg, #023859 0%, #034a73 100%)',
  border: 'none',
  color: '#fff',
  borderRadius: '8px',
  cursor: isProcessing ? 'not-allowed' : 'pointer',
  fontSize: 'clamp(14px, 2.5vw, 16px)',
  fontWeight: 600,
  transition: 'all 0.2s ease-in-out',
  display: 'flex',
  alignItems: 'center',
  gap: 'clamp(6px, 1.5vw, 8px)',
  opacity: isProcessing ? 0.8 : 1,
  minHeight: '44px',
  width: '100%',
});

export const primaryButtonHoverStyles = {
  background: 'linear-gradient(135deg, #012744 0%, #02385a 100%)',
  transform: 'translateY(-2px)',
  boxShadow: '0 4px 12px rgba(2, 56, 89, 0.4)',
};

export const selectStyles = {
  position: 'relative',
  minWidth: '128px',
};

export const selectButtonStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 'clamp(6px, 1.5vw, 8px)',
  padding: 'clamp(8px 12px, 2vw, 8px 16px)',
  backgroundColor: '#ffffff',
  border: '1px solid rgba(2, 56, 89, 0.3)',
  color: '#023859',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: 'clamp(14px, 2.5vw, 16px)',
  transition: 'border-color 0.2s ease-in-out',
  minHeight: '44px',
  width: '100%',
};

export const dropdownStyles = {
  position: 'absolute',
  top: '48px',
  left: 0,
  right: 0,
  backgroundColor: '#ffffff',
  border: '1px solid rgba(2, 56, 89, 0.3)',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(2, 56, 89, 0.2)',
  zIndex: 1000,
};

export const tipsContainerStyles = {
  marginTop: '24px',
  background: 'linear-gradient(135deg, rgba(2, 56, 89, 0.05) 0%, rgba(3, 74, 115, 0.03) 100%)',
  border: '1px solid rgba(2, 56, 89, 0.2)',
  borderRadius: '12px',
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  marginBottom: '24px',
};

export const tipsIconBoxStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  background: 'linear-gradient(135deg, #023859 0%, #034a73 100%)',
  borderRadius: '8px',
  color: '#fff'
};

export const tipTitleStyles = {
  color: '#023859',
  fontSize: '15px',
  fontWeight: '600',
  margin: 0,
  marginBottom: '6px'
};

export const tipDescriptionStyles = {
  color: '#456578',
  fontSize: '14px',
  margin: 0,
  lineHeight: '1.5',
  wordBreak: 'break-word'
};

export const getTipsHeaderStyles = (showTips) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  borderBottom: showTips ? '1px solid rgba(2, 56, 89, 0.2)' : 'none',
});

export const getTipsContentStyles = (showTips) => {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;
  
  return {
    maxHeight: showTips ? (isMobile ? 'none' : '500px') : '0',
    height: showTips ? 'auto' : '0',
    overflow: showTips ? (isMobile ? 'visible' : 'auto') : 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    padding: showTips ? '20px' : '0 20px',
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
  gap: '16px',
  padding: '16px',
  background: 'rgba(2, 56, 89, 0.03)',
  border: '1px solid rgba(2, 56, 89, 0.1)',
  borderRadius: '8px',
  marginBottom: '12px',
  transition: 'all 0.2s ease-in-out',
};

export const resultCardStyles = {
  marginTop: '24px',
  background: 'linear-gradient(135deg, rgba(2, 56, 89, 0.05) 0%, rgba(3, 74, 115, 0.03) 100%)',
  border: '1px solid rgba(2, 56, 89, 0.3)',
  borderRadius: '12px',
  padding: '24px',
  animation: 'slideInUp 0.5s ease-out',
};

export const comparisonStyles = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  marginTop: '20px',
};

export const spinnerStyles = {
  width: '20px',
  height: '20px',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  borderTop: '2px solid #ffffff',
  borderRadius: '50%',
  animation: 'spinner 1s linear infinite',
};

export const getErrorStyles = (error) => ({
  marginTop: '16px',
  padding: '12px 16px',
  background: error.startsWith('✅') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
  border: error.startsWith('✅') ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
  borderRadius: '8px',
  color: error.startsWith('✅') ? '#10b981' : '#ef4444',
  fontSize: '14px',
});

export const fileInfoStyles = {
  marginTop: '16px',
  padding: '12px 16px',
  background: 'rgba(2, 56, 89, 0.1)',
  border: '1px solid rgba(2, 56, 89, 0.3)',
  borderRadius: '8px',
  color: '#023859',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

export const copyButtonStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  background: 'linear-gradient(135deg, #023859 0%, #034a73 100%)',
  border: 'none',
  borderRadius: '6px',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'all 0.2s ease-in-out',
};

export const statsContainerStyles = {
  marginTop: '20px', 
  padding: '16px', 
  background: 'rgba(2, 56, 89, 0.1)', 
  borderRadius: '8px',
  border: '1px solid rgba(2, 56, 89, 0.2)'
};

export const additionalStatsStyles = {
  marginTop: '16px', 
  padding: '12px', 
  background: 'rgba(2, 56, 89, 0.05)', 
  borderRadius: '6px',
  fontSize: '12px',
  color: '#456578'
};

export const tipsFooterStyles = {
  marginTop: '20px',
  padding: '16px',
  background: 'rgba(2, 56, 89, 0.05)',
  border: '1px solid rgba(2, 56, 89, 0.2)',
  borderRadius: '8px',
  textAlign: 'center'
};

// CSS string for style tag
export const cssStyles = `
  @keyframes tipGlow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(2, 56, 89, 0.1);
    }
    50% {
      box-shadow: 0 0 30px rgba(2, 56, 89, 0.2);
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

  .tip-item:hover {
    background: rgba(2, 56, 89, 0.08) !important;
    border-color: rgba(2, 56, 89, 0.3) !important;
    transform: translateY(-2px);
    animation: tipGlow 2s ease-in-out infinite;
  }

  .tips-header:hover {
    background: rgba(2, 56, 89, 0.05);
  }

  .icon-emoji {
    font-size: 20px;
    padding: 8px;
    background: rgba(2, 56, 89, 0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    height: 36px;
  }

  .comparison-text {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(2, 56, 89, 0.2);
    border-radius: 8px;
    padding: 16px;
    color: #023859;
    line-height: 1.6;
    font-size: 14px;
    max-height: 300px;
    overflow-y: auto;
  }
`;