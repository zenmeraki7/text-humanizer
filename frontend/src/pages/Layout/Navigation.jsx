import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useScrollTrigger,
  Slide,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

// Import the LogoutConfirmationModal from Sidebar (you'll need to extract it to a separate file)
// For now, I'll include it here directly
const AlertTriangleIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Simulate logout process
    setTimeout(() => {
      setIsLoggingOut(false);
      onConfirm();
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        animation: 'fadeIn 0.3s ease-out',
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes warning-glow {
          0%, 100% {
            color: #f59e0b;
            filter: drop-shadow(0 0 20px rgba(245, 158, 11, 0.3));
          }
          50% {
            color: #fbbf24;
            filter: drop-shadow(0 0 30px rgba(245, 158, 11, 0.6));
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

        .modal-card {
          animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .warning-icon {
          animation: warning-glow 2s ease-in-out infinite;
        }

        .logout-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          animation: spinner 1s linear infinite;
        }
      `}</style>

      <div
        className="modal-card"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
          backdropFilter: 'blur(24px)',
          border: '2px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '24px',
          padding: '40px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.8),
            0 0 0 1px rgba(148, 163, 184, 0.05),
            0 0 60px rgba(99, 102, 241, 0.2)
          `,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated background gradient */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 30% 40%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
            `,
            animation: 'pulse 4s ease-in-out infinite',
            zIndex: -1,
          }}
        />

        {/* Warning Icon */}
        <div style={{ marginBottom: '24px' }}>
          <div className="warning-icon">
            <AlertTriangleIcon />
          </div>
        </div>

        {/* Title */}
        <h2
          style={{
            color: '#f8fafc',
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '12px',
            letterSpacing: '-0.02em',
          }}
        >
          Confirm Logout
        </h2>

        {/* Message */}
        <p
          style={{
            color: '#94a3b8',
            fontSize: '16px',
            lineHeight: '1.6',
            marginBottom: '32px',
            fontWeight: '400',
          }}
        >
          Are you sure you want to logout? You'll need to sign in again to access your account.
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
          }}
        >
          {/* Cancel Button */}
          <button
            onClick={onClose}
            disabled={isLoggingOut}
            style={{
              padding: '14px 28px',
              background: 'rgba(148, 163, 184, 0.1)',
              border: '2px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '12px',
              color: '#cbd5e1',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoggingOut ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: isLoggingOut ? 0.5 : 1,
              backdropFilter: 'blur(10px)',
              minWidth: '120px',
            }}
            onMouseEnter={(e) => {
              if (!isLoggingOut) {
                e.target.style.background = 'rgba(148, 163, 184, 0.2)';
                e.target.style.borderColor = 'rgba(148, 163, 184, 0.5)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(148, 163, 184, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoggingOut) {
                e.target.style.background = 'rgba(148, 163, 184, 0.1)';
                e.target.style.borderColor = 'rgba(148, 163, 184, 0.3)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            Cancel
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            style={{
              padding: '14px 28px',
              background: isLoggingOut 
                ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' 
                : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: '2px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoggingOut ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: isLoggingOut ? 0.8 : 1,
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              minWidth: '120px',
            }}
            onMouseEnter={(e) => {
              if (!isLoggingOut) {
                e.target.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoggingOut) {
                e.target.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 14px rgba(239, 68, 68, 0.3)';
              }
            }}
          >
            {isLoggingOut && <div className="logout-spinner" />}
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>

        {/* Subtle help text */}
        <p
          style={{
            color: '#64748b',
            fontSize: '14px',
            marginTop: '20px',
            fontWeight: '400',
          }}
        >
          Your session will be safely terminated
        </p>
      </div>
    </div>
  );
};

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (item) => {
    if (item === 'Logout') {
      setShowLogoutModal(true);
      if (mobileOpen) {
        setMobileOpen(false);
      }
      return;
    }

    const routes = {
      'Home': '/',
      'Humanizer': '/humanize',
      'Detector': '/detector',
      'Plagiarism': '/plagiarism',
      'Pricing': '/pricing',
      'Settings': '/settings',
      'Tone': '/tone',
    };
    
    if (routes[item]) {
      navigate(routes[item]);
    }
    
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const navItems = ['Home', 'Humanizer', 'Detector', 'Plagiarism', 'Pricing', 'Settings', 'Tone', 'Logout'];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogoutConfirm = () => {
    // Add your logout logic here (clear tokens, localStorage, etc.)
    console.log('User logged out');
    navigate('/login'); // or wherever you want to redirect after logout
  };

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            background: scrolled 
              ? 'rgba(15, 15, 35, 0.95)' 
              : 'rgba(15, 15, 35, 0.8)',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                  width: 40,
                  height: 40,
                  fontWeight: 'bold',
                }}
              >
                C
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #FFFFFF, #A78BFA)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Conversify
              </Typography>
            </Box>

            {!isMobile ? (
              <Box sx={{ display: 'flex', gap: 3 }}>
                {navItems.map((item) => (
                  <Button
                    key={item}
                    color="inherit"
                    onClick={() => handleNavigation(item)}
                    sx={{
                      position: 'relative',
                      cursor: 'pointer',
                      color: item === 'Logout' ? '#ef4444' : 'inherit',
                      '&:hover': {
                        color: item === 'Logout' ? '#dc2626' : '#A78BFA',
                        transform: 'translateY(-1px)',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        width: 0,
                        height: 2,
                        background: item === 'Logout' 
                          ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                          : 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                        transition: 'all 0.3s ease',
                        transform: 'translateX(-50%)',
                      },
                      '&:hover::after': {
                        width: '100%',
                      },
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </Box>
            ) : (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            background: 'rgba(15, 15, 35, 0.95)',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <IconButton onClick={handleDrawerToggle} sx={{ mb: 2 }}>
            <CloseIcon />
          </IconButton>
          <List>
            {navItems.map((item) => (
              <ListItem 
                button 
                key={item}
                onClick={() => handleNavigation(item)}
                sx={{
                  '&:hover': {
                    backgroundColor: item === 'Logout' 
                      ? 'rgba(239, 68, 68, 0.1)' 
                      : 'rgba(139, 92, 246, 0.1)',
                  },
                  '& .MuiListItemText-primary': {
                    color: item === 'Logout' ? '#ef4444' : '#fff',
                    fontWeight: 500,
                  },
                }}
              >
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}