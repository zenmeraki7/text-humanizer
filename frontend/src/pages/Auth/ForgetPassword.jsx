import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
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

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      console.log('Password reset requested for:', email);
    }, 2000);
  };

  const handleTryAgain = () => {
    setIsSuccess(false);
    setEmail('');
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
    marginBottom: isMobile ? '28px' : '32px'
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

  const iconStyles = {
    position: 'absolute',
    left: isMobile ? '12px' : '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748b',
    width: isMobile ? '16px' : '18px',
    height: isMobile ? '16px' : '18px'
  };

  const errorStyles = {
    display: 'flex',
    alignItems: 'center',
    marginTop: '6px',
    color: '#ef4444',
    fontSize: isMobile ? '12px' : '13px',
    fontWeight: '400'
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

  const emailHighlightStyles = {
    color: '#3b82f6',
    fontWeight: '500',
    wordBreak: 'break-word'
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

  if (isSuccess) {
    return (
      <div style={containerStyles}>
        <style>{`
          @media (max-width: 480px) {
            .forgot-password-container {
              padding: 12px !important;
            }
            
            .forgot-password-card {
              padding: 20px !important;
              border-radius: 12px !important;
            }
          }

          @media (orientation: landscape) and (max-height: 600px) {
            .forgot-password-container {
              align-items: flex-start !important;
              padding-top: 20px !important;
              padding-bottom: 20px !important;
            }
          }

          /* iOS Safari specific styles */
          @supports (-webkit-appearance: none) {
            input[type="email"] {
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
          className="forgot-password-card"
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

          <div style={successContainerStyles}>
            <CheckCircle style={successIconStyles} />
            <h1 style={successTitleStyles}>Check Your Email</h1>
            <p style={successMessageStyles}>
              We've sent a password reset link to{isMobile ? ' ' : <br />}
              <span style={emailHighlightStyles}>{email}</span>
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
              Back to Login
            </button>

            <p style={helpTextStyles}>
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={handleTryAgain}
                style={linkButtonStyles}
                onMouseEnter={(e) => e.target.style.color = '#60a5fa'}
                onMouseLeave={(e) => e.target.style.color = '#3b82f6'}
              >
                try again
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="forgot-password-container"
      style={containerStyles}
    >
      <style>{`
        @media (max-width: 480px) {
          .forgot-password-container {
            padding: 12px !important;
          }
          
          .forgot-password-card {
            padding: 20px !important;
            border-radius: 12px !important;
          }
        }

        @media (orientation: landscape) and (max-height: 600px) {
          .forgot-password-container {
            align-items: flex-start !important;
            padding-top: 20px !important;
            padding-bottom: 20px !important;
          }
        }

        /* iOS Safari specific styles */
        @supports (-webkit-appearance: none) {
          input[type="email"] {
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
        className="forgot-password-card"
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
          <h1 style={titleStyles}>Forgot Password?</h1>
          <p style={subtitleStyles}>
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <div>
          <div style={formGroupStyles}>
            <label style={labelStyles}>Email Address</label>
            <div style={inputContainerStyles}>
              <Mail style={iconStyles} />
              <input
                type="email"
                value={email}
                onChange={handleInputChange}
                style={inputStyles(error)}
                placeholder="Enter your email address"
                autoComplete="email"
                onFocus={(e) => {
                  if (!error) {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = error ? '#ef4444' : 'rgba(148, 163, 184, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(e);
                  }
                }}
              />
            </div>
            {error && (
              <div style={errorStyles}>
                <AlertCircle style={{ 
                  width: '14px', 
                  height: '14px', 
                  marginRight: '6px',
                  flexShrink: 0
                }} />
                {error}
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
            {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
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

export default ForgotPasswordPage;