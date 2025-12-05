// Styles for ToneComponents using CSS-in-JS approach
export const containerStyles = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
  padding: 'clamp(12px, 3vw, 24px)',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  fontFamily: 'system-ui, -apple-system, sans-serif'
};

export const cardStyles = {
  maxWidth: '1200px',
  width: '100%',
  background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.5) 0%, rgba(22, 33, 62, 0.3) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  borderRadius: 'clamp(12px, 2vw, 20px)',
  padding: 'clamp(16px, 4vw, 32px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  marginTop: 'clamp(25px, 10vw, 75px)'
};

export const headerStyles = {
  textAlign: 'center',
  marginBottom: 'clamp(20px, 4vw, 32px)',
  marginTop: 'clamp(16px, 4vw, 20px)'
};

export const titleStyles = {
  fontSize: 'clamp(1.8rem, 6vw, 3rem)',
  fontWeight: '700',
  color: '#fff',
  marginBottom: 'clamp(12px, 2vw, 16px)',
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  lineHeight: '1.2',
  margin: 0
};

export const chipStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'clamp(4px, 1vw, 8px)',
  backgroundColor: 'rgba(139, 92, 246, 0.9)',
  color: '#fff',
  padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 24px)',
  borderRadius: 'clamp(10px, 2vw, 14px)',
  fontWeight: '600',
  fontSize: 'clamp(12px, 2.5vw, 14px)',
  marginTop: 'clamp(12px, 2vw, 16px)',
  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
  textAlign: 'center'
};

export const tabsContainerStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: 'clamp(12px, 2vw, 16px)',
  marginBottom: 'clamp(20px, 4vw, 32px)',
  background: 'rgba(0, 0, 0, 0.2)',
  borderRadius: 'clamp(12px, 2vw, 16px)',
  padding: 'clamp(8px, 1.5vw, 12px)'
};

export const getTabStyles = (isActive) => ({
  padding: 'clamp(16px, 3vw, 20px)',
  border: 'none',
  backgroundColor: isActive ? 'rgba(139, 92, 246, 0.9)' : 'transparent',
  background: isActive 
    ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' 
    : 'rgba(139, 92, 246, 0.1)',
  color: isActive ? '#fff' : '#a1a1aa',
  borderRadius: 'clamp(8px, 1.5vw, 12px)',
  cursor: 'pointer',
  fontSize: 'clamp(12px, 2.5vw, 14px)',
  fontWeight: isActive ? '600' : '500',
  transition: 'all 0.3s ease-in-out',
  outline: 'none',
  fontFamily: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: 'clamp(8px, 2vw, 16px)',
  textAlign: 'left',
  transform: isActive ? 'translateY(-2px)' : 'none',
  boxShadow: isActive ? '0 8px 24px rgba(139, 92, 246, 0.3)' : 'none'
});

export const tabIconStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'clamp(32px, 6vw, 40px)',
  height: 'clamp(32px, 6vw, 40px)',
  borderRadius: 'clamp(6px, 1.5vw, 10px)',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  flexShrink: 0
};

export const tabContentStyles = {
  flex: 1,
  minWidth: 0 // Allows text to wrap properly
};

export const tabNameStyles = {
  fontSize: 'clamp(16px, 3vw, 18px)',
  fontWeight: '600',
  marginBottom: '4px'
};

export const tabDescStyles = {
  fontSize: 'clamp(11px, 2vw, 13px)',
  opacity: 0.9,
  lineHeight: '1.4'
};

export const modeSelectionStyles = {
  marginBottom: 'clamp(20px, 4vw, 32px)'
};

export const sectionHeaderStyles = {
  display: 'flex',
  alignItems: 'center',
  color: '#f1f5f9',
  fontSize: 'clamp(16px, 3vw, 18px)',
  fontWeight: '600',
  marginBottom: 'clamp(12px, 2vw, 16px)'
};

export const modeGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
  gap: 'clamp(12px, 2vw, 16px)'
};

export const getModeButtonStyles = (isActive) => ({
  padding: 'clamp(16px, 3vw, 20px)',
  border: `2px solid ${isActive ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)'}`,
  backgroundColor: isActive ? 'rgba(139, 92, 246, 0.15)' : 'rgba(0, 0, 0, 0.2)',
  borderRadius: 'clamp(12px, 2vw, 16px)',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  textAlign: 'left',
  outline: 'none',
  transform: isActive ? 'translateY(-2px)' : 'none',
  boxShadow: isActive ? '0 8px 24px rgba(139, 92, 246, 0.2)' : 'none'
});

export const modeHeaderStyles = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: 'clamp(8px, 2vw, 12px)',
  gap: 'clamp(8px, 2vw, 12px)'
};

export const modeIconStyles = {
  fontSize: 'clamp(16px, 3vw, 20px)',
  flexShrink: 0
};

export const modeNameStyles = {
  color: '#fff',
  fontWeight: '600',
  fontSize: 'clamp(16px, 3vw, 18px)'
};

export const modeDescStyles = {
  color: '#a1a1aa',
  fontSize: 'clamp(12px, 2.5vw, 14px)',
  lineHeight: '1.5',
  marginBottom: 'clamp(8px, 2vw, 12px)'
};

export const featuresStyles = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'clamp(4px, 1vw, 6px)'
};

export const featureTagStyles = {
  backgroundColor: 'rgba(139, 92, 246, 0.2)',
  color: '#c4b5fd',
  padding: 'clamp(3px, 0.5vw, 4px) clamp(6px, 1vw, 8px)',
  borderRadius: 'clamp(4px, 1vw, 6px)',
  fontSize: 'clamp(10px, 2vw, 11px)',
  fontWeight: '500'
};

export const inputOutputGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(400px, 100%), 1fr))',
  gap: 'clamp(16px, 3vw, 24px)',
  marginBottom: 'clamp(20px, 4vw, 32px)'
};

export const inputSectionStyles = {
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0
};

export const outputSectionStyles = {
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0
};

export const inputHeaderStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 'clamp(8px, 2vw, 12px)',
  flexWrap: 'wrap',
  gap: 'clamp(8px, 2vw, 12px)'
};

export const outputHeaderStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 'clamp(8px, 2vw, 12px)',
  flexWrap: 'wrap',
  gap: 'clamp(8px, 2vw, 12px)'
};

export const sectionLabelStyles = {
  display: 'flex',
  alignItems: 'center',
  color: '#f1f5f9',
  fontSize: 'clamp(16px, 3vw, 18px)',
  fontWeight: '600'
};

export const fileUploadStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 'clamp(6px, 1.5vw, 8px)',
  color: '#8b5cf6',
  fontSize: 'clamp(12px, 2.5vw, 14px)',
  cursor: 'pointer',
  padding: 'clamp(6px, 1.5vw, 8px) clamp(8px, 2vw, 12px)',
  borderRadius: 'clamp(6px, 1vw, 8px)',
  transition: 'all 0.2s ease-in-out',
  backgroundColor: 'rgba(139, 92, 246, 0.1)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  whiteSpace: 'nowrap'
};

export const outputActionsStyles = {
  display: 'flex',
  gap: 'clamp(6px, 1.5vw, 8px)',
  flexWrap: 'wrap'
};

export const getIconButtonStyles = (disabled) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 'clamp(4px, 1vw, 6px)',
  padding: 'clamp(8px, 1.5vw, 10px) clamp(10px, 2vw, 14px)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  backgroundColor: disabled ? 'rgba(139, 92, 246, 0.05)' : 'rgba(139, 92, 246, 0.1)',
  color: disabled ? '#64748b' : '#8b5cf6',
  borderRadius: 'clamp(6px, 1vw, 8px)',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontSize: 'clamp(11px, 2vw, 13px)',
  fontWeight: '500',
  transition: 'all 0.2s ease-in-out',
  outline: 'none',
  opacity: disabled ? 0.5 : 1,
  whiteSpace: 'nowrap'
});

export const getTextareaStyles = (isFocused) => ({
  width: '100%',
  height: 'clamp(200px, 40vh, 320px)',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  border: `2px solid ${isFocused ? '#8b5cf6' : 'rgba(139, 92, 246, 0.3)'}`,
  borderRadius: 'clamp(12px, 2vw, 16px)',
  padding: 'clamp(12px, 3vw, 20px)',
  color: '#fff',
  fontSize: 'clamp(14px, 2.5vw, 15px)',
  fontFamily: 'inherit',
  resize: 'vertical',
  outline: 'none',
  transition: 'all 0.3s ease-in-out',
  boxSizing: 'border-box',
  lineHeight: '1.6',
  boxShadow: isFocused ? '0 0 0 4px rgba(139, 92, 246, 0.1)' : 'none'
});

export const getOutputTextareaStyles = (isFocused) => ({
  ...getTextareaStyles(isFocused),
  backgroundColor: 'rgba(16, 185, 129, 0.05)',
  border: `2px solid ${isFocused ? '#10b981' : 'rgba(16, 185, 129, 0.3)'}`,
  boxShadow: isFocused ? '0 0 0 4px rgba(16, 185, 129, 0.1)' : 'none'
});

export const statsStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 'clamp(8px, 2vw, 12px)',
  padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
  background: 'rgba(139, 92, 246, 0.1)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  borderRadius: 'clamp(8px, 2vw, 12px)',
  flexWrap: 'wrap',
  gap: 'clamp(8px, 2vw, 12px)'
};

export const outputStatsStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 'clamp(8px, 2vw, 12px)',
  padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
  background: 'rgba(16, 185, 129, 0.1)',
  border: '1px solid rgba(16, 185, 129, 0.2)',
  borderRadius: 'clamp(8px, 2vw, 12px)',
  flexWrap: 'wrap',
  gap: 'clamp(8px, 2vw, 12px)'
};

export const statItemStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'clamp(2px, 0.5vw, 4px)',
  minWidth: 'clamp(60px, 12vw, 80px)'
};

export const statValueStyles = {
  fontSize: 'clamp(16px, 3vw, 18px)',
  fontWeight: '700',
  color: '#8b5cf6'
};

export const statLabelStyles = {
  fontSize: 'clamp(10px, 2vw, 12px)',
  color: '#94a3b8',
  fontWeight: '500'
};

export const actionButtonsStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 'clamp(12px, 3vw, 16px)',
  flexWrap: 'wrap'
};

export const getSecondaryButtonStyles = (disabled) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 'clamp(6px, 1.5vw, 8px)',
  padding: 'clamp(12px, 2.5vw, 14px) clamp(16px, 3vw, 24px)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  backgroundColor: disabled ? 'rgba(139, 92, 246, 0.05)' : 'rgba(139, 92, 246, 0.1)',
  color: disabled ? '#64748b' : '#8b5cf6',
  borderRadius: 'clamp(8px, 2vw, 12px)',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontSize: 'clamp(12px, 2.5vw, 14px)',
  fontWeight: '600',
  transition: 'all 0.2s ease-in-out',
  outline: 'none',
  opacity: disabled ? 0.5 : 1,
  whiteSpace: 'nowrap'
});

export const getProcessButtonStyles = (disabled) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'clamp(8px, 2vw, 10px)',
  padding: 'clamp(12px, 3vw, 16px) clamp(20px, 4vw, 32px)',
  border: 'none',
  backgroundColor: disabled ? 'rgba(139, 92, 246, 0.3)' : '#8b5cf6',
  background: disabled 
    ? 'rgba(139, 92, 246, 0.3)' 
    : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  color: '#fff',
  borderRadius: 'clamp(8px, 2vw, 12px)',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontSize: 'clamp(14px, 2.8vw, 16px)',
  fontWeight: '600',
  transition: 'all 0.3s ease-in-out',
  outline: 'none',
  fontFamily: 'inherit',
  opacity: disabled ? 0.6 : 1,
  transform: disabled ? 'none' : 'translateY(-1px)',
  boxShadow: disabled ? 'none' : '0 8px 24px rgba(139, 92, 246, 0.3)',
  whiteSpace: 'nowrap'
});

export const spinnerStyles = {
  width: 'clamp(16px, 3vw, 20px)',
  height: 'clamp(16px, 3vw, 20px)',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  borderTop: '2px solid #fff',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  flexShrink: 0
};

// Media queries for additional responsive adjustments
export const mediaQueries = `
  @media (max-width: 768px) {
    .input-output-grid {
      grid-template-columns: 1fr !important;
    }
    
    .tabs-container {
      grid-template-columns: 1fr !important;
    }
    
    .action-buttons {
      flex-direction: column !important;
      align-items: stretch !important;
    }
    
    .mode-grid {
      grid-template-columns: 1fr !important;
    }
  }
  
  @media (max-width: 480px) {
    .output-actions {
      flex-direction: column !important;
      width: 100% !important;
    }
    
    .input-header, .output-header {
      flex-direction: column !important;
      align-items: flex-start !important;
    }
    
    .stats {
      justify-content: space-around !important;
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;