import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeNewsletter: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: hasMinLength && hasUpperCase && hasLowerCase && hasNumbers,
      requirements: {
        minLength: hasMinLength,
        upperCase: hasUpperCase,
        lowerCase: hasLowerCase,
        numbers: hasNumbers,
        specialChar: hasSpecialChar
      }
    };
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordValidation.isValid) {
      newErrors.password = 'Password does not meet requirements';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false);
      console.log('Signup attempted with:', formData);
      // In a real app, handle success/error here
    }, 2500);
  };

  const passwordValidation = validatePassword(formData.password);

  const containerStyles = {
    minHeight: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: isMobile ? '16px' : '20px',
    paddingBottom: isMobile ? '16px' : '20px',
    paddingLeft: isMobile ? '16px' : '20px',
    paddingRight: isMobile ? '16px' : '20px',
    boxSizing: 'border-box',
    overflowY: 'auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif'
  };

  const cardStyles = {
    background: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(148, 163, 184, 0.1)',
    borderRadius: isMobile ? '16px' : '20px',
    padding: isMobile ? '24px' : '48px',
    width: '100%',
    maxWidth: isMobile ? '100%' : '500px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(148, 163, 184, 0.05)',
    margin: '0 auto'
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
    letterSpacing: '-0.02em',
    marginTop: '0'
  };

  const subtitleStyles = {
    color: '#94a3b8',
    fontSize: isMobile ? '14px' : '15px',
    fontWeight: '400',
    lineHeight: '1.5',
    padding: isMobile ? '0 8px' : '0'
  };

  const formRowStyles = {
    display: 'flex',
    gap: isMobile ? '12px' : '16px',
    marginBottom: isMobile ? '20px' : '24px',
    flexDirection: isMobile ? 'column' : 'row'
  };

  const formGroupStyles = {
    marginBottom: isMobile ? '20px' : '24px',
    flex: 1
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
    padding: isMobile ? '12px 14px 12px 40px' : '14px 16px 14px 44px',
    background: 'rgba(30, 41, 59, 0.6)',
    border: `1px solid ${hasError ? '#ef4444' : 'rgba(148, 163, 184, 0.2)'}`,
    borderRadius: isMobile ? '10px' : '12px',
    color: '#f8fafc',
    fontSize: isMobile ? '16px' : '15px', // 16px prevents zoom on iOS
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxSizing: 'border-box'
  });

  const nameInputStyles = (hasError) => ({
    width: '100%',
    padding: isMobile ? '12px 14px' : '14px 16px',
    background: 'rgba(30, 41, 59, 0.6)',
    border: `1px solid ${hasError ? '#ef4444' : 'rgba(148, 163, 184, 0.2)'}`,
    borderRadius: isMobile ? '10px' : '12px',
    color: '#f8fafc',
    fontSize: isMobile ? '16px' : '15px',
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

  const passwordToggleStyles = {
    position: 'absolute',
    right: isMobile ? '12px' : '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '6px',
    transition: 'color 0.2s ease',
    minWidth: isMobile ? '32px' : '24px',
    minHeight: isMobile ? '32px' : '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const errorStyles = {
    display: 'flex',
    alignItems: 'center',
    marginTop: '6px',
    color: '#ef4444',
    fontSize: isMobile ? '12px' : '13px',
    fontWeight: '400'
  };

  const passwordRequirementsStyles = {
    marginTop: '12px',
    padding: isMobile ? '12px' : '16px',
    background: 'rgba(30, 41, 59, 0.4)',
    borderRadius: '8px',
    fontSize: isMobile ? '12px' : '13px'
  };

  const requirementStyles = (met) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '6px',
    color: met ? '#10b981' : '#64748b'
  });

  const checkboxContainerStyles = {
    marginBottom: isMobile ? '20px' : '24px'
  };

  const checkboxLabelStyles = {
    display: 'flex',
    alignItems: 'flex-start',
    color: '#cbd5e1',
    fontSize: isMobile ? '13px' : '14px',
    cursor: 'pointer',
    fontWeight: '400',
    lineHeight: '1.5',
    marginBottom: '12px'
  };

  const checkboxStyles = {
    marginRight: '10px',
    marginTop: '2px',
    accentColor: '#3b82f6',
    width: isMobile ? '18px' : '16px',
    height: isMobile ? '18px' : '16px',
    flexShrink: 0
  };

  const linkStyles = {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '500'
  };

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
    marginBottom: isMobile ? '24px' : '28px',
    letterSpacing: '0.01em',
    boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.3)',
    minHeight: isMobile ? '48px' : 'auto'
  };

  const dividerStyles = {
    display: 'flex',
    alignItems: 'center',
    margin: isMobile ? '24px 0' : '28px 0',
    color: '#64748b',
    fontSize: isMobile ? '12px' : '13px',
    fontWeight: '400'
  };

  const dividerLineStyles = {
    flex: 1,
    height: '1px',
    background: 'rgba(148, 163, 184, 0.15)'
  };

  const dividerTextStyles = {
    margin: isMobile ? '0 16px' : '0 20px',
    whiteSpace: 'nowrap'
  };

  const socialButtonStyles = {
    width: '100%',
    padding: isMobile ? '12px' : '14px',
    background: 'rgba(30, 41, 59, 0.6)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: isMobile ? '10px' : '12px',
    color: '#f1f5f9',
    fontSize: isMobile ? '15px' : '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: isMobile ? '48px' : 'auto'
  };

  const loginLinkStyles = {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: isMobile ? '13px' : '14px',
    marginTop: isMobile ? '28px' : '32px',
    fontWeight: '400',
    lineHeight: '1.5'
  };

  return (
    <div style={containerStyles}>
      <style>{`
        @media (max-width: 480px) {
          .signup-container {
            padding: 12px !important;
          }
          
          .signup-card {
            padding: 20px !important;
            border-radius: 12px !important;
          }
        }

        @media (orientation: landscape) and (max-height: 600px) {
          .signup-container {
            align-items: flex-start !important;
            padding-top: 20px !important;
            padding-bottom: 20px !important;
          }
        }

        /* iOS Safari specific styles */
        @supports (-webkit-appearance: none) {
          input[type="email"],
          input[type="password"],
          input[type="text"] {
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
        className="signup-card"
        style={cardStyles}
      >
        <div style={headerStyles}>
          <h1 style={titleStyles}>Create Account</h1>
          <p style={subtitleStyles}>Join us today and get started with your free account</p>
        </div>

        <div>
          <div style={formRowStyles}>
            <div style={formGroupStyles}>
              <div style={labelStyles}>First Name</div>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                style={nameInputStyles(errors.firstName)}
                placeholder="Enter first name"
                autoComplete="given-name"
                onFocus={(e) => {
                  if (!errors.firstName) {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.firstName ? '#ef4444' : 'rgba(148, 163, 184, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.firstName && (
                <div style={errorStyles}>
                  <AlertCircle style={{ width: '14px', height: '14px', marginRight: '6px', flexShrink: 0 }} />
                  {errors.firstName}
                </div>
              )}
            </div>

            <div style={formGroupStyles}>
              <div style={labelStyles}>Last Name</div>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                style={nameInputStyles(errors.lastName)}
                placeholder="Enter last name"
                autoComplete="family-name"
                onFocus={(e) => {
                  if (!errors.lastName) {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.lastName ? '#ef4444' : 'rgba(148, 163, 184, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.lastName && (
                <div style={errorStyles}>
                  <AlertCircle style={{ width: '14px', height: '14px', marginRight: '6px', flexShrink: 0 }} />
                  {errors.lastName}
                </div>
              )}
            </div>
          </div>

          <div style={formGroupStyles}>
            <div style={labelStyles}>Email Address</div>
            <div style={inputContainerStyles}>
              <Mail style={iconStyles} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={inputStyles(errors.email)}
                placeholder="Enter your email address"
                autoComplete="email"
                onFocus={(e) => {
                  if (!errors.email) {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.email ? '#ef4444' : 'rgba(148, 163, 184, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            {errors.email && (
              <div style={errorStyles}>
                <AlertCircle style={{ width: '14px', height: '14px', marginRight: '6px', flexShrink: 0 }} />
                {errors.email}
              </div>
            )}
          </div>

          <div style={formGroupStyles}>
            <div style={labelStyles}>Password</div>
            <div style={inputContainerStyles}>
              <Lock style={iconStyles} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                style={{ 
                  ...inputStyles(errors.password), 
                  paddingRight: isMobile ? '48px' : '50px' 
                }}
                placeholder="Create a secure password"
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
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={passwordToggleStyles}
                onMouseEnter={(e) => e.target.style.color = '#94a3b8'}
                onMouseLeave={(e) => e.target.style.color = '#64748b'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={isMobile ? 20 : 18} /> : <Eye size={isMobile ? 20 : 18} />}
              </button>
            </div>
            {formData.password && (
              <div style={passwordRequirementsStyles}>
                <div style={{ color: '#cbd5e1', marginBottom: '8px', fontWeight: '500' }}>Password Requirements:</div>
                <div style={requirementStyles(passwordValidation.requirements.minLength)}>
                  <Check size={isMobile ? 16 : 14} style={{ marginRight: '6px', flexShrink: 0 }} />
                  At least 8 characters
                </div>
                <div style={requirementStyles(passwordValidation.requirements.upperCase)}>
                  <Check size={isMobile ? 16 : 14} style={{ marginRight: '6px', flexShrink: 0 }} />
                  One uppercase letter
                </div>
                <div style={requirementStyles(passwordValidation.requirements.lowerCase)}>
                  <Check size={isMobile ? 16 : 14} style={{ marginRight: '6px', flexShrink: 0 }} />
                  One lowercase letter
                </div>
                <div style={requirementStyles(passwordValidation.requirements.numbers)}>
                  <Check size={isMobile ? 16 : 14} style={{ marginRight: '6px', flexShrink: 0 }} />
                  One number
                </div>
              </div>
            )}
            {errors.password && (
              <div style={errorStyles}>
                <AlertCircle style={{ width: '14px', height: '14px', marginRight: '6px', flexShrink: 0 }} />
                {errors.password}
              </div>
            )}
          </div>

          <div style={formGroupStyles}>
            <div style={labelStyles}>Confirm Password</div>
            <div style={inputContainerStyles}>
              <Lock style={iconStyles} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                style={{ 
                  ...inputStyles(errors.confirmPassword), 
                  paddingRight: isMobile ? '48px' : '50px' 
                }}
                placeholder="Confirm your password"
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
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={passwordToggleStyles}
                onMouseEnter={(e) => e.target.style.color = '#94a3b8'}
                onMouseLeave={(e) => e.target.style.color = '#64748b'}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={isMobile ? 20 : 18} /> : <Eye size={isMobile ? 20 : 18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div style={errorStyles}>
                <AlertCircle style={{ width: '14px', height: '14px', marginRight: '6px', flexShrink: 0 }} />
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
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>

        <div style={dividerStyles}>
          <div style={dividerLineStyles}></div>
          <span style={dividerTextStyles}>Or sign up with</span>
          <div style={dividerLineStyles}></div>
        </div>

        <button
          style={socialButtonStyles}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(30, 41, 59, 0.8)';
            e.target.style.borderColor = 'rgba(148, 163, 184, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(30, 41, 59, 0.6)';
            e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
          }}
          onClick={() => console.log('Google signup clicked')}
        >
          <svg 
            style={{ 
              marginRight: isMobile ? '10px' : '12px', 
              width: isMobile ? '20px' : '18px', 
              height: isMobile ? '20px' : '18px',
              flexShrink: 0
            }} 
            viewBox="0 0 24 24"
          >
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div style={loginLinkStyles}>
          Already have an account?{' '}
          <span 
            style={{ ...linkStyles, cursor: 'pointer' }}
            onMouseEnter={(e) => e.target.style.color = '#60a5fa'}
            onMouseLeave={(e) => e.target.style.color = '#3b82f6'}
            onClick={() => navigate('/login')}
          >
            Sign in here
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;