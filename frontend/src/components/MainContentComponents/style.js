// styles.js - Centralized styles for the MainContent component

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
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  lineHeight: '1.2',
};

export const chipStyles = {
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

export const cardStyles = {
  maxWidth: '1024px',
  margin: '0 auto',
  background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.5) 0%, rgba(22, 33, 62, 0.3) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(99, 102, 241, 0.2)',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
};

export const textareaStyles = {
  width: '100%',
  height: '256px',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(99, 102, 241, 0.3)',
  borderRadius: '8px',
  padding: '16px',
  color: '#fff',
  fontSize: '16px',
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
  gap: '12px',
  padding: '16px 24px',
  border: '1px solid rgba(99, 102, 241, 0.3)',
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
  borderColor: '#6366f1',
  color: '#fff',
  backgroundColor: 'rgba(99, 102, 241, 0.1)',
};

export const primaryButtonStyles = {
  padding: '12px 32px',
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  border: 'none',
  color: '#fff',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 600,
  transition: 'all 0.2s ease-in-out',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

export const primaryButtonHoverStyles = {
  background: 'linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)',
  transform: 'translateY(-2px)',
  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
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
  border: '1px solid rgba(99, 102, 241, 0.3)',
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
  border: '1px solid rgba(99, 102, 241, 0.3)',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  zIndex: 1000,
};

export const tipsContainerStyles = {
  marginTop: '24px',
  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.03) 100%)',
  border: '1px solid rgba(99, 102, 241, 0.2)',
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
  borderBottom: showTips ? '1px solid rgba(99, 102, 241, 0.2)' : 'none',
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
  padding: '8px 16px',
  border: '1px solid rgba(99, 102, 241, 0.3)',
  backgroundColor: 'transparent',
  color: '#a1a1aa',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  transition: 'all 0.2s ease-in-out',
};

export const outputButtonHoverStyles = {
  borderColor: '#6366f1',
  color: '#fff',
  backgroundColor: 'rgba(99, 102, 241, 0.1)',
};

export const spinnerStyles = {
  width: '16px',
  height: '16px',
  border: '2px solid transparent',
  borderTop: '2px solid #a1a1aa',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

// CSS string for style tag
export const cssStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    .main-content {
      margin-left: 0 !important;
      padding: 16px !important;
    }
    
    .title {
      font-size: 2rem !important;
    }
    
    .action-buttons {
      grid-template-columns: 1fr !important;
    }
    
    .bottom-controls {
      flex-direction: column !important;
      align-items: stretch !important;
    }
    
    .textarea {
      height: 200px !important;
    }
    
    .card {
      padding: 16px !important;
    }
  }
  
  @media (max-width: 480px) {
    .title {
      font-size: 1.5rem !important;
    }
    
    .chip {
      padding: 6px 12px !important;
      font-size: 14px !important;
    }
    
    .action-button {
      padding: 12px 16px !important;
      font-size: 14px !important;
    }
    
    .primary-button {
      padding: 12px 24px !important;
      font-size: 14px !important;
    }
    
    .select-button {
      padding: 6px 12px !important;
      font-size: 14px !important;
    }
  }

  .tip-item:hover {
    background: rgba(99, 102, 241, 0.08) !important;
    border-color: rgba(99, 102, 241, 0.3) !important;
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.1);
  }

  .tips-header:hover {
    background: rgba(99, 102, 241, 0.05);
  }

  .icon-emoji {
    font-size: 20px;
    padding: 8px;
    background: rgba(99, 102, 241, 0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    height: 36px;
  }
`;