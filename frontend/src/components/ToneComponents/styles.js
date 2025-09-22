export const containerStyles = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
  padding: '24px',
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
  borderRadius: '20px',
  padding: '32px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  marginTop: '70px'
};

export const headerStyles = {
  textAlign: 'center',
  marginBottom: '32px'
};

export const titleStyles = {
  fontSize: 'clamp(2.2rem, 5vw, 3rem)',
  fontWeight: '700',
  color: '#fff',
  marginBottom: '16px',
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
  gap: '8px',
  backgroundColor: 'rgba(139, 92, 246, 0.9)',
  color: '#fff',
  padding: '12px 24px',
  borderRadius: '14px',
  fontWeight: '600',
  fontSize: '14px',
  marginTop: '16px',
  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
};

export const tabsContainerStyles = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
  marginBottom: '32px',
  background: 'rgba(0, 0, 0, 0.2)',
  borderRadius: '16px',
  padding: '12px'
};

export const getTabStyles = (isActive) => ({
  padding: '20px',
  border: 'none',
  backgroundColor: isActive ? 'rgba(139, 92, 246, 0.9)' : 'transparent',
  background: isActive 
    ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' 
    : 'rgba(139, 92, 246, 0.1)',
  color: isActive ? '#fff' : '#a1a1aa',
  borderRadius: '12px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: isActive ? '600' : '500',
  transition: 'all 0.3s ease-in-out',
  outline: 'none',
  fontFamily: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '16px',
  textAlign: 'left',
  transform: isActive ? 'translateY(-2px)' : 'none',
  boxShadow: isActive ? '0 8px 24px rgba(139, 92, 246, 0.3)' : 'none'
});

export const tabIexport  = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)'
};

export const tabContentStyles = {
  flex: 1
};

export const tabNameStyles = {
  fontSize: '18px',
  fontWeight: '600',
  marginBottom: '4px'
};

export const tabDescStyles = {
  fontSize: '13px',
  opacity: 0.9,
  lineHeight: '1.4'
};

export const modeSelectionStyles = {
  marginBottom: '32px'
};

export const sectionHeaderStyles = {
  display: 'flex',
  alignItems: 'center',
  color: '#f1f5f9',
  fontSize: '18px',
  fontWeight: '600',
  marginBottom: '16px'
};

export const modeGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '16px'
};

export const getModeButtonStyles = (isActive) => ({
  padding: '20px',
  border: `2px solid ${isActive ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)'}`,
  backgroundColor: isActive ? 'rgba(139, 92, 246, 0.15)' : 'rgba(0, 0, 0, 0.2)',
  borderRadius: '16px',
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
  marginBottom: '12px'
};

export const modeIexport  = {
  fontSize: '20px',
  marginRight: '12px'
};

export const modeNameStyles = {
  color: '#fff',
  fontWeight: '600',
  fontSize: '18px'
};

export const modeDescStyles = {
  color: '#a1a1aa',
  fontSize: '14px',
  lineHeight: '1.5',
  marginBottom: '12px'
};

export const featuresStyles = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px'
};

export const featureTagStyles = {
  backgroundColor: 'rgba(139, 92, 246, 0.2)',
  color: '#c4b5fd',
  padding: '4px 8px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: '500'
};

export const inputOutputGridStyles = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '24px',
  marginBottom: '32px'
};

export const inputSectionStyles = {
  display: 'flex',
  flexDirection: 'column'
};

export const outputSectionStyles = {
  display: 'flex',
  flexDirection: 'column'
};

export const inputHeaderStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px'
};

export const outputHeaderStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px'
};

export const sectionLabelStyles = {
  display: 'flex',
  alignItems: 'center',
  color: '#f1f5f9',
  fontSize: '18px',
  fontWeight: '600'
};

export const fileUploadStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#8b5cf6',
  fontSize: '14px',
  cursor: 'pointer',
  padding: '8px 12px',
  borderRadius: '8px',
  transition: 'all 0.2s ease-in-out',
  backgroundColor: 'rgba(139, 92, 246, 0.1)',
  border: '1px solid rgba(139, 92, 246, 0.3)'
};

export const outputActionsStyles = {
  display: 'flex',
  gap: '8px'
};

export const getIconButtonStyles = (disabled) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '10px 14px',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  backgroundColor: disabled ? 'rgba(139, 92, 246, 0.05)' : 'rgba(139, 92, 246, 0.1)',
  color: disabled ? '#64748b' : '#8b5cf6',
  borderRadius: '8px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontSize: '13px',
  fontWeight: '500',
  transition: 'all 0.2s ease-in-out',
  outline: 'none',
  opacity: disabled ? 0.5 : 1
});

export const getTextareaStyles = (isFocused) => ({
  width: '100%',
  height: '320px',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  border: `2px solid ${isFocused ? '#8b5cf6' : 'rgba(139, 92, 246, 0.3)'}`,
  borderRadius: '16px',
  padding: '20px',
  color: '#fff',
  fontSize: '15px',
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
  marginTop: '12px',
  padding: '12px 16px',
  background: 'rgba(139, 92, 246, 0.1)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  borderRadius: '12px'
};

export const outputStatsStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '12px',
  padding: '12px 16px',
  background: 'rgba(16, 185, 129, 0.1)',
  border: '1px solid rgba(16, 185, 129, 0.2)',
  borderRadius: '12px'
};

export const statItemStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px'
};

export const statValueStyles = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#8b5cf6'
};

export const statLabelStyles = {
  fontSize: '12px',
  color: '#94a3b8',
  fontWeight: '500'
};

export const actionButtonsStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '16px'
};

export const getSecondaryButtonStyles = (disabled) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '14px 24px',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  backgroundColor: disabled ? 'rgba(139, 92, 246, 0.05)' : 'rgba(139, 92, 246, 0.1)',
  color: disabled ? '#64748b' : '#8b5cf6',
  borderRadius: '12px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  transition: 'all 0.2s ease-in-out',
  outline: 'none',
  opacity: disabled ? 0.5 : 1
});

export const getProcessButtonStyles = (disabled) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  padding: '16px 32px',
  border: 'none',
  backgroundColor: disabled ? 'rgba(139, 92, 246, 0.3)' : '#8b5cf6',
  background: disabled 
    ? 'rgba(139, 92, 246, 0.3)' 
    : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  color: '#fff',
  borderRadius: '12px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontSize: '16px',
  fontWeight: '600',
  transition: 'all 0.3s ease-in-out',
  outline: 'none',
  fontFamily: 'inherit',
  opacity: disabled ? 0.6 : 1,
  transform: disabled ? 'none' : 'translateY(-1px)',
  boxShadow: disabled ? 'none' : '0 8px 24px rgba(139, 92, 246, 0.3)'
});

export const spinnerStyles = {
  width: '20px',
  height: '20px',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  borderTop: '2px solid #fff',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};
export const tabIconStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)'
};