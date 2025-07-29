import React, { useState, useEffect } from 'react';
import { Lock, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
function ResetPasswordPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push('at least 8 characters');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('one number');
    }
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        newErrors.password = `Password must contain ${passwordErrors.join(', ')}`;
      }
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      console.log('Password reset successfully');
    }, 2000);
  };

  const containerStyles = {
    minHeight: '100vh',
    minWidth: '100vw',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile ? '16px' : '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    margin: 0,
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'auto',
  };

  const cardStyles = {
    background: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(148, 163, 184, 0.1)',
    borderRadius: isMobile ? '16px' : '20px',
    padding: isMobile ? '24px' : '48px',
    width: '100%',
    maxWidth: isMobile ? '100%' : '460px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(148, 163, 184, 0.05)',
    margin: isMobile ? '0' : 'auto',
  };

  const backButtonStyles = {
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    color: '#64748b',
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginBottom: isMobile ? '28px' : '32px',
    padding: isMobile ? '10px 0' : '8px 0',
    transition: 'color 0.2s ease',
    minHeight: isMobile ? '44px' : 'auto',
  };

  const headerStyles = {
    textAlign: 'center',
    marginBottom: isMobile ? '32px' : '40px'
  };

  const titleStyles = {
    color: '#f8fafc',
    fontSize: isMobile ? '24px' : '28px',
    fontWeight: '700',
    marginBottom: '8px',
    letterSpacing: '-0.02em'
  };

  const subtitleStyles = {
    color: '#94a3b8',
    fontSize: isMobile ? '14px' : '15px',
    fontWeight: '400',
    lineHeight: '1.5',
    padding: isMobile ? '0 8px' : '0'
  };

  const formGroupStyles = {
    marginBottom: isMobile ? '20px' : '24px'
  };

  const labelStyles = {
    display: 'block',
    color: '#f1f5f9',
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: '500',
    marginBottom: '8px',
    letterSpacing: '0.01em'
  };

  const inputContainerStyles = {
    position: 'relative'
  };

  const inputStyles = (hasError) => ({
    width: '100%',
    padding: isMobile ? '12px 48px 12px 40px' : '14px 50px 14px 44px',
    background: 'rgba(30, 41, 59, 0.6)',
    border: `1px solid ${hasError ? '#ef4444' : 'rgba(148, 163, 184, 0.2)'}`,
    borderRadius: isMobile ? '10px' : '12px',
    color: '#f8fafc',
    fontSize: isMobile ? '16px' : '15px', // 16px prevents zoom on iOS
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxSizing: 'border-box'
  });

  const iconStyles = {
    position: 'absolute',
    left: isMobile ? '12px' : '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748b',
    width: isMobile ? '16px' : '18px',
    height: isMobile ? '16px' : '18px'
  };

  const toggleButtonStyles = {
    position: 'absolute',
    right: isMobile ? '12px' : '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    padding: '4px',
    transition: 'color 0.2s ease',
    minWidth: isMobile ? '32px' : '24px',
    minHeight: isMobile ? '32px' : '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const errorStyles = {
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: '6px',
    color: '#ef4444',
    fontSize: isMobile ? '12px' : '13px',
    fontWeight: '400',
    lineHeight: '1.4'
  };

  const passwordRequirementsStyles = {
    marginTop: '12px',
    padding: isMobile ? '10px' : '12px',
    background: 'rgba(30, 41, 59, 0.3)',
    borderRadius: '8px',
    border: '1px solid rgba(148, 163, 184, 0.1)'
  };

  const requirementsTitleStyles = {
    color: '#94a3b8',
    fontSize: isMobile ? '12px' : '13px',
    fontWeight: '500',
    marginBottom: '8px'
  };

  const requirementItemStyles = (isValid) => ({
    display: 'flex',
    alignItems: 'center',
    color: isValid ? '#10b981' : '#64748b',
    fontSize: isMobile ? '11px' : '12px',
    marginBottom: '4px'
  });

  const buttonStyles = {
    width: '100%',
    padding: isMobile ? '14px' : '16px',
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    border: 'none',
    borderRadius: isMobile ? '10px' : '12px',
    color: '#ffffff',
    fontSize: isMobile ? '16px' : '15px',
    fontWeight: '600',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: isLoading ? 0.7 : 1,
    marginTop: '8px',
    marginBottom: isMobile ? '24px' : '28px',
    letterSpacing: '0.01em',
    boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.3)',
    minHeight: isMobile ? '48px' : 'auto'
  };

  const successContainerStyles = {
    textAlign: 'center',
    padding: isMobile ? '16px 0' : '20px 0'
  };

  const successIconStyles = {
    width: isMobile ? '56px' : '64px',
    height: isMobile ? '56px' : '64px',
    color: '#10b981',
    margin: isMobile ? '0 auto 20px' : '0 auto 24px'
  };

  const successTitleStyles = {
    color: '#f8fafc',
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: '600',
    marginBottom: '12px'
  };

  const successMessageStyles = {
    color: '#94a3b8',
    fontSize: isMobile ? '14px' : '15px',
    lineHeight: '1.6',
    marginBottom: isMobile ? '28px' : '32px',
    padding: isMobile ? '0 8px' : '0'
  };

  const linkButtonStyles = {
    background: 'none',
    border: 'none',
    color: '#3b82f6',
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'underline',
    transition: 'color 0.2s ease',
    minHeight: isMobile ? '44px' : 'auto',
    padding: isMobile ? '8px 4px' : '0'
  };

  const helpTextStyles = {
    color: '#64748b',
    fontSize: isMobile ? '13px' : '14px',
    textAlign: 'center',
    lineHeight: '1.5',
    marginTop: isMobile ? '20px' : '24px',
    padding: isMobile ? '0 8px' : '0'
  };

  // Password validation checks
  const passwordValidation = {
    length: formData.password.length >= 8,
    lowercase: /(?=.*[a-z])/.test(formData.password),
    uppercase: /(?=.*[A-Z])/.test(formData.password),
    number: /(?=.*\d)/.test(formData.password)
  };

  if (isSuccess) {
    return (
      <div style={containerStyles}>
        <style>{`
          @media (max-width: 480px) {
            .reset-password-container {
              padding: 12px !important;
            }
            
            .reset-password-card {
              padding: 20px !important;
              border-radius: 12px !important;
            }
          }

          @media (orientation: landscape) and (max-height: 600px) {
            .reset-password-container {
              align-items: flex-start !important;
              padding-top: 20px !important;
              padding-bottom: 20px !important;
            }
          }

          /* iOS Safari specific styles */
          @supports (-webkit-appearance: none) {
            input[type="password"] {
              -webkit-appearance: none;
              border-radius: ${isMobile ? '10px' : '12px'};
            }
          }

          /* Prevent zoom on iOS */
          @media screen and (-webkit-min-device-pixel-ratio: 0) {
            select,
            textarea,
            input[type="text"],
            input[type="password"],
            input[type="datetime"],
            input[type="datetime-local"],
            input[type="date"],
            input[type="month"],
            input[type="time"],
            input[type="week"],
            input[type="number"],
            input[type="email"],
            input[type="url"],
            input[type="search"],
            input[type="tel"],
            input[type="color"] {
              font-size: 16px;
            }
          }
        `}</style>

        <div 
          className="reset-password-card"
          style={cardStyles}
        >
          <div style={successContainerStyles}>
            <CheckCircle style={successIconStyles} />
            <h1 style={successTitleStyles}>Password Reset Successfully!</h1>
            <p style={successMessageStyles}>
              Your password has been reset successfully.{isMobile ? ' ' : <br />}
              You can now sign in with your new password.
            </p>
            
            <button
              onClick={() => navigate('/login')}
              style={buttonStyles}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 8px 25px 0 rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 14px 0 rgba(59, 130, 246, 0.3)';
              }}
            >
              Continue to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="reset-password-container"
      style={containerStyles}
    >
      <style>{`
        @media (max-width: 480px) {
          .reset-password-container {
            padding: 12px !important;
          }
          
          .reset-password-card {
            padding: 20px !important;
            border-radius: 12px !important;
          }
        }

        @media (orientation: landscape) and (max-height: 600px) {
          .reset-password-container {
            align-items: flex-start !important;
            padding-top: 20px !important;
            padding-bottom: 20px !important;
          }
        }

        /* iOS Safari specific styles */
        @supports (-webkit-appearance: none) {
          input[type="password"] {
            -webkit-appearance: none;
            border-radius: ${isMobile ? '10px' : '12px'};
          }
        }

        /* Prevent zoom on iOS */
        @media screen and (-webkit-min-device-pixel-ratio: 0) {
          select,
          textarea,
          input[type="text"],
          input[type="password"],
          input[type="datetime"],
          input[type="datetime-local"],
          input[type="date"],
          input[type="month"],
          input[type="time"],
          input[type="week"],
          input[type="number"],
          input[type="email"],
          input[type="url"],
          input[type="search"],
          input[type="tel"],
          input[type="color"] {
            font-size: 16px;
          }
        }
      `}</style>

      <div 
        className="reset-password-card"
        style={cardStyles}
      >
        <button
          onClick={() => navigate('/login')}
          style={backButtonStyles}
          onMouseEnter={(e) => e.target.style.color = '#94a3b8'}
          onMouseLeave={(e) => e.target.style.color = '#64748b'}
        >
          <ArrowLeft style={{ 
            width: isMobile ? '18px' : '16px', 
            height: isMobile ? '18px' : '16px', 
            marginRight: '8px',
            flexShrink: 0
          }} />
          Back to Login
        </button>

        <div style={headerStyles}>
          <h1 style={titleStyles}>Reset Your Password</h1>
          <p style={subtitleStyles}>
            Create a new password for your account. Make sure it's strong and secure.
          </p>
        </div>

        <div>
          <div style={formGroupStyles}>
            <label style={labelStyles}>New Password</label>
            <div style={inputContainerStyles}>
              <Lock style={iconStyles} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                style={inputStyles(errors.password)}
                placeholder="Enter your new password"
                autoComplete="new-password"
                onFocus={(e) => {
                  if (!errors.password) {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.password ? '#ef4444' : 'rgba(148, 163, 184, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(e);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={toggleButtonStyles}
                onMouseEnter={(e) => e.target.style.color = '#94a3b8'}
                onMouseLeave={(e) => e.target.style.color = '#64748b'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={isMobile ? 20 : 18} /> : <Eye size={isMobile ? 20 : 18} />}
              </button>
            </div>
            {errors.password && (
              <div style={errorStyles}>
                <AlertCircle style={{ 
                  width: '14px', 
                  height: '14px', 
                  marginRight: '6px', 
                  marginTop: '1px', 
                  flexShrink: 0 
                }} />
                {errors.password}
              </div>
            )}
            
            {formData.password && (
              <div style={passwordRequirementsStyles}>
                <div style={requirementsTitleStyles}>Password Requirements:</div>
                <div style={requirementItemStyles(passwordValidation.length)}>
                  <span style={{ marginRight: '8px', flexShrink: 0 }}>
                    {passwordValidation.length ? '✓' : '○'}
                  </span>
                  At least 8 characters
                </div>
                <div style={requirementItemStyles(passwordValidation.lowercase)}>
                  <span style={{ marginRight: '8px', flexShrink: 0 }}>
                    {passwordValidation.lowercase ? '✓' : '○'}
                  </span>
                  One lowercase letter
                </div>
                <div style={requirementItemStyles(passwordValidation.uppercase)}>
                  <span style={{ marginRight: '8px', flexShrink: 0 }}>
                    {passwordValidation.uppercase ? '✓' : '○'}
                  </span>
                  One uppercase letter
                </div>
                <div style={requirementItemStyles(passwordValidation.number)}>
                  <span style={{ marginRight: '8px', flexShrink: 0 }}>
                    {passwordValidation.number ? '✓' : '○'}
                  </span>
                  One number
                </div>
              </div>
            )}
          </div>

          <div style={formGroupStyles}>
            <label style={labelStyles}>Confirm New Password</label>
            <div style={inputContainerStyles}>
              <Lock style={iconStyles} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                style={inputStyles(errors.confirmPassword)}
                placeholder="Confirm your new password"
                autoComplete="new-password"
                onFocus={(e) => {
                  if (!errors.confirmPassword) {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.confirmPassword ? '#ef4444' : 'rgba(148, 163, 184, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(e);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={toggleButtonStyles}
                onMouseEnter={(e) => e.target.style.color = '#94a3b8'}
                onMouseLeave={(e) => e.target.style.color = '#64748b'}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={isMobile ? 20 : 18} /> : <Eye size={isMobile ? 20 : 18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div style={errorStyles}>
                <AlertCircle style={{ 
                  width: '14px', 
                  height: '14px', 
                  marginRight: '6px', 
                  marginTop: '1px', 
                  flexShrink: 0 
                }} />
                {errors.confirmPassword}
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={buttonStyles}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 8px 25px 0 rgba(59, 130, 246, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 14px 0 rgba(59, 130, 246, 0.3)';
              }
            }}
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </div>

        <p style={helpTextStyles}>
          Remember your password?{' '}
          <button
            onClick={() => navigate('/login')}
            style={linkButtonStyles}
            onMouseEnter={(e) => e.target.style.color = '#60a5fa'}
            onMouseLeave={(e) => e.target.style.color = '#3b82f6'}
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
}

export default ResetPasswordPage;