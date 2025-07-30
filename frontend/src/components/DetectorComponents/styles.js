// styles.js - All style definitions for the Detector component
export const getDetectorStyles = (sidebarOpen, showTips) => {
  const drawerWidth = 280;
  const collapsedDrawerWidth = 64;

  return {
    mainContentStyles: {
      marginLeft: sidebarOpen ? drawerWidth : collapsedDrawerWidth,
      transition: 'margin-left 0.3s ease-in-out',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '24px',
      margin: 0,
      marginTop: 0,
    },

    headerStyles: {
      textAlign: 'center',
      marginBottom: '32px',
    },

    titleStyles: {
      fontSize: '3rem',
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: '16px',
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      lineHeight: '1.2',
    },

    chipStyles: {
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
    },

    cardStyles: {
      maxWidth: '1024px',
      margin: '0 auto',
      background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.5) 0%, rgba(22, 33, 62, 0.3) 100%)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    },

    textareaStyles: {
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
    },

    actionButtonStyles: {
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
    },

    actionButtonHoverStyles: {
      borderColor: '#6366f1',
      color: '#fff',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
    },

    primaryButtonStyles: {
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
    },

    primaryButtonHoverStyles: {
      background: 'linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
    },

    outputButtonStyles: {
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
    },

    outputButtonHoverStyles: {
      borderColor: '#6366f1',
      color: '#fff',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
    },

    tipsContainerStyles: {
      marginTop: '24px',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.03) 100%)',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      borderRadius: '12px',
      overflow: 'hidden',
      transition: 'all 0.3s ease-in-out',
      marginBottom: '24px',
    },

    tipsHeaderStyles: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      borderBottom: showTips ? '1px solid rgba(99, 102, 241, 0.2)' : 'none',
    },

    tipsContentStyles: {
      maxHeight: showTips ? '600px' : '0',
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      padding: showTips ? '20px' : '0 20px',
    },

    errorStyles: {
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      color: '#fca5a5',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '16px',
      fontSize: '14px'
    },

    resultsDisplayStyles: {
      background: 'rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      borderRadius: '8px',
      padding: '16px',
      height: '256px',
      overflow: 'auto'
    },
  };
};

export const CSS_STYLES = `
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

  .score-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 8px solid #374151;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    background: rgba(0, 0, 0, 0.3);
    transition: all 0.5s ease-in-out;
  }

  .score-circle.animate {
    border-color: var(--color);
    box-shadow: 0 0 20px var(--color);
  }

  .score-percentage {
    font-size: 24px;
    font-weight: bold;
    color: #fff;
  }

  .score-label {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 4px;
  }

  .pattern-card {
    background: rgba(99, 102, 241, 0.05);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 8px;
    padding: 16px;
    animation: slideInUp 0.5s ease-out forwards;
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;