// styles.js - Fully responsive style definitions for the Detector component with light theme
export const getDetectorStyles = (sidebarOpen, showTips) => {
  const drawerWidth = 280;
  const collapsedDrawerWidth = 64;

  return {
    mainContentStyles: {
      marginLeft: sidebarOpen ? drawerWidth : collapsedDrawerWidth,
      transition: 'margin-left 0.3s ease-in-out',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffffff 0%, #e8f4f8 50%, #d4e9f2 100%)',
      padding: '24px',
      margin: 0,
      marginTop: '35px',
      '@media (max-width: 768px)': {
        marginLeft: '0',
        padding: '16px',
         marginTop: '25px'
      },
      '@media (max-width: 480px)': {
        padding: '12px',
         marginTop: '20px'
      },
    },

    headerStyles: {
      textAlign: 'center',
      marginBottom: '32px',
      '@media (max-width: 768px)': {
        marginBottom: '24px',
      },
      '@media (max-width: 480px)': {
        marginBottom: '16px',
      },
    },

    titleStyles: {
      fontSize: 'clamp(1.75rem, 5vw, 3rem)',
      fontWeight: 'bold',
      color: '#023859',
      marginBottom: '16px',
      background: 'linear-gradient(135deg, #023859 0%, #034a73 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      lineHeight: '1.2',
      '@media (max-width: 480px)': {
        marginBottom: '12px',
      },
    },

    chipStyles: {
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
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      '@media (max-width: 480px)': {
        padding: '6px 12px',
        gap: '6px',
      },
    },

    cardStyles: {
      maxWidth: '1024px',
      margin: '0 auto',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(232, 244, 248, 0.9) 100%)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(2, 56, 89, 0.2)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 8px 32px rgba(2, 56, 89, 0.15)',
      '@media (max-width: 768px)': {
        borderRadius: '12px',
        padding: '20px',
      },
      '@media (max-width: 480px)': {
        borderRadius: '8px',
        padding: '16px',
        margin: '0 8px',
      },
    },

    textareaStyles: {
      width: '100%',
      height: '256px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      border: '1px solid rgba(2, 56, 89, 0.3)',
      borderRadius: '8px',
      padding: '16px',
      color: '#023859',
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      fontFamily: 'inherit',
      resize: 'none',
      outline: 'none',
      transition: 'border-color 0.2s ease-in-out',
      boxSizing: 'border-box',
      '@media (max-width: 768px)': {
        height: '200px',
        padding: '12px',
      },
      '@media (max-width: 480px)': {
        height: '150px',
        padding: '10px',
        borderRadius: '6px',
      },
    },

    actionButtonStyles: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      padding: '16px 24px',
      border: '1px solid rgba(2, 56, 89, 0.3)',
      backgroundColor: 'transparent',
      color: '#023859',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      fontWeight: 500,
      transition: 'all 0.2s ease-in-out',
      width: '100%',
      minHeight: '48px',
      '@media (max-width: 768px)': {
        padding: '14px 20px',
        gap: '10px',
      },
      '@media (max-width: 480px)': {
        padding: '12px 16px',
        gap: '8px',
        borderRadius: '6px',
        minHeight: '44px',
      },
    },

    actionButtonHoverStyles: {
      borderColor: '#023859',
      color: '#ffffff',
      backgroundColor: 'rgba(2, 56, 89, 0.9)',
    },

    primaryButtonStyles: {
      padding: '12px 32px',
      background: 'linear-gradient(135deg, #023859 0%, #034a73 100%)',
      border: 'none',
      color: '#fff',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      fontWeight: 600,
      transition: 'all 0.2s ease-in-out',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      minHeight: '48px',
      '@media (max-width: 768px)': {
        padding: '14px 28px',
        gap: '6px',
      },
      '@media (max-width: 480px)': {
        padding: '12px 24px',
        borderRadius: '6px',
        minHeight: '44px',
      },
    },

    primaryButtonHoverStyles: {
      background: 'linear-gradient(135deg, #012744 0%, #02385a 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(2, 56, 89, 0.4)',
      '@media (max-width: 480px)': {
        transform: 'translateY(-1px)',
        boxShadow: '0 2px 8px rgba(2, 56, 89, 0.4)',
      },
    },

    outputButtonStyles: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      border: '1px solid rgba(2, 56, 89, 0.3)',
      backgroundColor: 'transparent',
      color: '#023859',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
      fontWeight: 500,
      transition: 'all 0.2s ease-in-out',
      minHeight: '36px',
      '@media (max-width: 480px)': {
        padding: '6px 12px',
        gap: '6px',
        borderRadius: '6px',
        minHeight: '32px',
      },
    },

    outputButtonHoverStyles: {
      borderColor: '#023859',
      color: '#ffffff',
      backgroundColor: 'rgba(2, 56, 89, 0.9)',
    },

    tipsContainerStyles: {
      marginTop: '24px',
      background: 'linear-gradient(135deg, rgba(2, 56, 89, 0.05) 0%, rgba(3, 74, 115, 0.03) 100%)',
      border: '1px solid rgba(2, 56, 89, 0.2)',
      borderRadius: '12px',
      overflow: 'hidden',
      transition: 'all 0.3s ease-in-out',
      marginBottom: '24px',
      '@media (max-width: 768px)': {
        marginTop: '20px',
        marginBottom: '20px',
        borderRadius: '10px',
      },
      '@media (max-width: 480px)': {
        marginTop: '16px',
        marginBottom: '16px',
        borderRadius: '8px',
      },
    },

    tipsHeaderStyles: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      borderBottom: showTips ? '1px solid rgba(2, 56, 89, 0.2)' : 'none',
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      '@media (max-width: 768px)': {
        padding: '14px 16px',
      },
      '@media (max-width: 480px)': {
        padding: '12px 14px',
      },
    },

    tipsContentStyles: {
      maxHeight: showTips ? '600px' : '0',
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      padding: showTips ? '20px' : '0 20px',
      '@media (max-width: 768px)': {
        padding: showTips ? '16px' : '0 16px',
      },
      '@media (max-width: 480px)': {
        padding: showTips ? '14px' : '0 14px',
      },
    },

    errorStyles: {
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      color: '#ef4444',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '16px',
      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
      '@media (max-width: 480px)': {
        padding: '10px',
        borderRadius: '6px',
        marginBottom: '12px',
      },
    },

    resultsDisplayStyles: {
      background: 'rgba(255, 255, 255, 0.5)',
      border: '1px solid rgba(2, 56, 89, 0.3)',
      borderRadius: '8px',
      padding: '16px',
      height: '256px',
      overflow: 'auto',
      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
      '@media (max-width: 768px)': {
        height: '200px',
        padding: '12px',
      },
      '@media (max-width: 480px)': {
        height: '150px',
        padding: '10px',
        borderRadius: '6px',
      },
    },

    // Container for action buttons grid
    actionButtonsContainerStyles: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginTop: '16px',
      marginBottom: '16px',
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr',
        gap: '12px',
        marginTop: '12px',
        marginBottom: '12px',
      },
      '@media (max-width: 480px)': {
        gap: '10px',
      },
    },

    // Score circle responsive styles
    scoreCircleStyles: {
      width: 'clamp(80px, 15vw, 120px)',
      height: 'clamp(80px, 15vw, 120px)',
      border: '8px solid rgba(2, 56, 89, 0.2)',
      borderRadius: '50%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      background: 'rgba(255, 255, 255, 0.5)',
      transition: 'all 0.5s ease-in-out',
      '@media (max-width: 480px)': {
        borderWidth: '6px',
      },
    },

    scorePercentageStyles: {
      fontSize: 'clamp(1rem, 3vw, 1.5rem)',
      fontWeight: 'bold',
      color: '#023859',
    },

    scoreLabelStyles: {
      fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)',
      color: '#456578',
      marginTop: '4px',
    },
  };
};

export const CSS_STYLES = `
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden; /* Prevent horizontal scrolling */
}
  /* Enhanced responsive styles */
 .main-content {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  /* Remove any max-width constraints */
  max-width: none !important;
}
    
    .title {
      font-size: clamp(2rem, 6vw, 2.5rem) !important;
    }
    
    .action-buttons {
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px !important;
    }
    @media (maxWidth: 768px) {
  .action-buttons {
    grid-template-columns: 1fr 1fr 1fr; /* Keep 3 columns on tablet */
    gap: 12px;
  }
}

@media (maxWidth: 480px) {
  .action-buttons {
    grid-template-columns: 1fr; /* Stack vertically only on very small screens */
    gap: 10px;
  }
}
    .textarea {
      height: 200px !important;
      padding: 12px !important;
    }
    
    .card {
      padding: 20px !important;
      border-radius: 12px !important;
    }

    .tips-container {
      border-radius: 10px !important;
    }

    .pattern-card {
      padding: 12px !important;
    }
  }
  
  @media (max-width: 480px) {
    .main-content {
      padding: 12px !important;
    }

    .title {
      font-size: clamp(1.5rem, 8vw, 2rem) !important;
    }
    
    .chip {
      padding: 6px 12px !important;
      font-size: 14px !important;
      gap: 6px !important;
    }

    .card {
      padding: 16px !important;
      border-radius: 8px !important;
      margin: 0 8px !important;
    }

    .textarea {
      height: 150px !important;
      padding: 10px !important;
      border-radius: 6px !important;
    }

    .tips-container {
      border-radius: 8px !important;
    }

    .tips-header {
      padding: 12px 14px !important;
    }

    .tips-content {
      padding: 14px !important;
    }

    .results-display {
      height: 150px !important;
      padding: 10px !important;
      border-radius: 6px !important;
    }

    .pattern-card {
      padding: 10px !important;
    }

    .score-circle {
      border-width: 6px !important;
    }
  }

  @media (max-width: 320px) {
    .main-content {
      padding: 8px !important;
    }

    .card {
      padding: 12px !important;
      margin: 0 4px !important;
    }

    .textarea {
      height: 120px !important;
      padding: 8px !important;
    }

    .results-display {
      height: 120px !important;
      padding: 8px !important;
    }
  }

  /* Responsive utility classes */
  @media (hover: hover) {
    .tip-item:hover {
      background: rgba(2, 56, 89, 0.1) !important;
      border-color: rgba(2, 56, 89, 0.3) !important;
      transform: translateY(-2px);
      box-shadow: 0 0 20px rgba(2, 56, 89, 0.1);
    }

    .tips-header:hover {
      background: rgba(2, 56, 89, 0.05);
    }
  }

  /* Touch-friendly improvements */
  @media (hover: none) {
    .tip-item:active {
      background: rgba(2, 56, 89, 0.1) !important;
      border-color: rgba(2, 56, 89, 0.3) !important;
    }

    .tips-header:active {
      background: rgba(2, 56, 89, 0.05);
    }
  }

  .icon-emoji {
    font-size: clamp(16px, 3vw, 20px);
    padding: clamp(6px, 1.5vw, 8px);
    background: rgba(2, 56, 89, 0.1);
    border-radius: clamp(6px, 1.5vw, 8px);
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: clamp(28px, 6vw, 36px);
    height: clamp(28px, 6vw, 36px);
  }

  .score-circle {
    width: clamp(80px, 15vw, 120px);
    height: clamp(80px, 15vw, 120px);
    border-radius: 50%;
    border: clamp(6px, 1.5vw, 8px) solid rgba(2, 56, 89, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    background: rgba(255, 255, 255, 0.5);
    transition: all 0.5s ease-in-out;
  }

  .score-circle.animate {
    border-color: var(--color);
    box-shadow: 0 0 20px var(--color);
  }

  .score-percentage {
    font-size: clamp(1rem, 3vw, 1.5rem);
    font-weight: bold;
    color: #023859;
  }

  .score-label {
    font-size: clamp(0.625rem, 1.5vw, 0.75rem);
    color: #456578;
    margin-top: 4px;
  }

  .pattern-card {
    background: rgba(2, 56, 89, 0.05);
    border: 1px solid rgba(2, 56, 89, 0.2);
    border-radius: clamp(6px, 1.5vw, 8px);
    padding: clamp(12px, 3vw, 16px);
    animation: slideInUp 0.5s ease-out forwards;
  }

  /* Grid system for responsive layouts */
  .responsive-grid {
    display: grid;
    gap: clamp(12px, 3vw, 24px);
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  @media (max-width: 640px) {
    .responsive-grid {
      grid-template-columns: 1fr;
    }
  }

  /* Flexible typography */
  .responsive-text {
    font-size: clamp(0.875rem, 2.5vw, 1rem);
    line-height: 1.6;
  }

  .responsive-heading {
    font-size: clamp(1.25rem, 4vw, 1.875rem);
    line-height: 1.3;
  }

  /* Enhanced animations with reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(clamp(10px, 3vw, 20px));
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

  /* Scrollbar styling for webkit browsers */
  .results-display::-webkit-scrollbar {
    width: 8px;
  }

  .results-display::-webkit-scrollbar-track {
    background: rgba(2, 56, 89, 0.1);
    border-radius: 4px;
  }

  .results-display::-webkit-scrollbar-thumb {
    background: rgba(2, 56, 89, 0.3);
    border-radius: 4px;
  }

  .results-display::-webkit-scrollbar-thumb:hover {
    background: rgba(2, 56, 89, 0.5);
  }

  /* Focus styles for accessibility */
  button:focus,
  textarea:focus {
    outline: 2px solid rgba(2, 56, 89, 0.6);
    outline-offset: 2px;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .card {
      border: 2px solid rgba(2, 56, 89, 0.8) !important;
    }
    
    .tip-item {
      border: 1px solid rgba(2, 56, 89, 0.6) !important;
    }
  }
  
  /* Text selection improvements */
  ::selection {
    background-color: rgba(2, 56, 89, 0.3);
    color: #023859;
  }
`;