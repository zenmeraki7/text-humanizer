// styles.js - Centralized styles for the PlagiarismRemover component

const drawerWidth = 280;
const collapsedDrawerWidth = 64;

export const getMainContentStyle = (sidebarOpen) => ({
  marginLeft: sidebarOpen ? drawerWidth : collapsedDrawerWidth,
  transition: 'margin-left 0.3s ease-in-out',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
  padding: '24px',
  margin: 0,
  marginTop: 0,
});

export const headerStyles = {
  textAlign: 'center',
  marginBottom: '32px',
};

export const titleStyles = {
  fontSize: '3rem',
  fontWeight: 'bold',
  color: '#fff',
  marginBottom: '16px',
  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  lineHeight: '1.2',
};

export const chipStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: '#8b5cf6',
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
  background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.5) 0%, rgba(22, 33, 62, 0.3) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  borderRadius: '16px',
  padding: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
};

export const textareaStyles = {
  width: '100%',
  height: '256px',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  borderRadius: '8px',
  padding: '16px',
  color: '#fff',
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
  gap: '12px',
  padding: '16px 24px',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  backgroundColor: 'transparent',
  color: '#a1a1aa',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 500,
  transition: 'all 0.2s ease-in-out',
  width: '100%',
};

export const actionButtonHoverStyles = {
  borderColor: '#8b5cf6',
  color: '#fff',
  backgroundColor: 'rgba(139, 92, 246, 0.1)',
};

export const getPrimaryButtonStyles = (isProcessing) => ({
  padding: '12px 32px',
  background: isProcessing 
    ? 'linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%)' 
    : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  border: 'none',
  color: '#fff',
  borderRadius: '8px',
  cursor: isProcessing ? 'not-allowed' : 'pointer',
  fontSize: '16px',
  fontWeight: 600,
  transition: 'all 0.2s ease-in-out',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  opacity: isProcessing ? 0.8 : 1,
});

export const primaryButtonHoverStyles = {
  background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
  transform: 'translateY(-2px)',
  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
};

export const selectStyles = {
  position: 'relative',
  minWidth: '128px',
};

export const selectButtonStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  backgroundColor: '#374151',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  color: '#fff',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'border-color 0.2s ease-in-out',
};

export const dropdownStyles = {
  position: 'absolute',
  top: '48px',
  left: 0,
  right: 0,
  backgroundColor: '#374151',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  zIndex: 1000,
};

export const tipsContainerStyles = {
  marginTop: '24px',
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(124, 58, 237, 0.03) 100%)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  borderRadius: '12px',
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
};

export const getTipsHeaderStyles = (showTips) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  borderBottom: showTips ? '1px solid rgba(139, 92, 246, 0.2)' : 'none',
});

export const getTipsContentStyles = (showTips) => ({
  maxHeight: showTips ? '500px' : '0',
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  padding: showTips ? '20px' : '0 20px',
});

export const tipItemStyles = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
  padding: '16px',
  background: 'rgba(139, 92, 246, 0.03)',
  border: '1px solid rgba(139, 92, 246, 0.1)',
  borderRadius: '8px',
  marginBottom: '12px',
  transition: 'all 0.2s ease-in-out',
};

export const resultCardStyles = {
  marginTop: '24px',
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
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
  color: error.startsWith('✅') ? '#34d399' : '#fca5a5',
  fontSize: '14px',
});

export const fileInfoStyles = {
  marginTop: '16px',
  padding: '12px 16px',
  background: 'rgba(139, 92, 246, 0.1)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  borderRadius: '8px',
  color: '#a78bfa',
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
  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
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
  background: 'rgba(139, 92, 246, 0.1)', 
  borderRadius: '8px',
  border: '1px solid rgba(139, 92, 246, 0.2)'
};

export const additionalStatsStyles = {
  marginTop: '16px', 
  padding: '12px', 
  background: 'rgba(0, 0, 0, 0.2)', 
  borderRadius: '6px',
  fontSize: '12px',
  color: '#94a3b8'
};

export const tipsFooterStyles = {
  marginTop: '20px',
  padding: '16px',
  background: 'rgba(139, 92, 246, 0.05)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  borderRadius: '8px',
  textAlign: 'center'
};

// CSS string for style tag
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

  .tip-item:hover {
    background: rgba(139, 92, 246, 0.08) !important;
    border-color: rgba(139, 92, 246, 0.3) !important;
    transform: translateY(-2px);
    animation: tipGlow 2s ease-in-out infinite;
  }

  .tips-header:hover {
    background: rgba(139, 92, 246, 0.05);
  }

  .icon-emoji {
    font-size: 20px;
    padding: 8px;
    background: rgba(139, 92, 246, 0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    height: 36px;
  }

  .comparison-text {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 8px;
    padding: 16px;
    color: #e2e8f0;
    line-height: 1.6;
    font-size: 14px;
    max-height: 300px;
    overflow-y: auto;
  }
`;