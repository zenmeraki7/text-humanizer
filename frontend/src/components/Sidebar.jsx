import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Icon components
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const HistoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12,6 12,12 16,14"></polyline>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const UpgradeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16,17 21,12 16,7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const AlertTriangleIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

// Stunning Logout Confirmation Modal
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

// Constants
const drawerWidth = 220;
const collapsedDrawerWidth = 60;

// Sidebar Component
const Sidebar = ({ open, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const isCollapsed = !open;

const getActiveItem = () => {
    switch (location.pathname) {
      case '/': return 'home';
      case '/pricing': return 'pricing';
      case '/settings': return 'settings';
      case '/detector': return 'detector';
      case '/plagiarism': return 'plagiarism';
      default: return 'home';
    }
  };

  const activeItem = getActiveItem();

  const handleItemClick = (itemId) => {
    if (itemId === 'logout') {
      setShowLogoutModal(true);
      return;
    }

    // Navigation logic
    if (itemId === 'settings') {
      navigate('/settings');
    } else if (itemId === 'home') {
      navigate('/');
    } else if (itemId === 'detector') {
      navigate('/detector');
    } else if (itemId === 'plagiarism') {
      navigate('/plagiarism');
    }
  else if (itemId === 'pricing') {
    navigate('/pricing');
  }
  };


 

  const menuItems = [
    { id: 'home', icon: MenuIcon, label: 'AI Humanizer' },
    { id: 'detector', icon: HistoryIcon, label: 'AI Detector' },
    { id: 'plagiarism', icon: PlusIcon, label: 'Plagiarism Remover' },
  ];

  const bottomItems = [
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
    { id: 'logout', icon: LogoutIcon, label: 'Logout' },
  ];

  const sidebarStyles = {
    position: 'fixed',
    left: 0,
    top: 0,
    width: isCollapsed ? collapsedDrawerWidth : drawerWidth,
    height: '100vh',
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    borderRight: '1px solid rgba(99, 102, 241, 0.2)',
    transition: 'width 0.3s ease-in-out',
    zIndex: 1200,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

   const headerStyles = {
    padding: isCollapsed ? '12px 8px' : '12px 16px', // Reduced padding
    borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: isCollapsed ? 'center' : 'space-between',
    minHeight: '56px', // Reduced from 60 to 56
  };

  const logoStyles = {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#ffffff',
    opacity: isCollapsed ? 0 : 1,
    transition: 'opacity 0.3s ease-in-out',
    whiteSpace: 'nowrap',
  };

  const collapseButtonStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '32px',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    border: 'none',
    borderRadius: '6px',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    flexShrink: 0,
  };

  const topSectionStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '12px 0',
    flex: 1,
  };

  const menuItemStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: isCollapsed ? '0' : '10px',
    padding: isCollapsed ? '10px' : '10px 16px',
    margin: isCollapsed ? '0 6px' : '0 12px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    color: '#a1a1aa',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    justifyContent: isCollapsed ? 'center' : 'flex-start',
    minHeight: '38px',
    fontSize: '13px',
    fontWeight: '500',
    position: 'relative',
  };

  const activeMenuItemStyles = {
    ...menuItemStyles,
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
  };

  const iconContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    flexShrink: 0,
  };

  const menuLabelStyles = {
    opacity: isCollapsed ? 0 : 1,
    transition: 'opacity 0.3s ease-in-out',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    width: isCollapsed ? '0' : 'auto',
  };

  const bottomSectionStyles = {
    padding: '16px 0 24px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    borderTop: '1px solid rgba(99, 102, 241, 0.2)',
  };

  const upgradeButtonStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: isCollapsed ? 'center' : 'flex-start',
    gap: isCollapsed ? '0' : '12px',
    padding: isCollapsed ? '14px' : '12px 20px',
    margin: isCollapsed ? '0 8px 16px 8px' : '0 16px 16px 16px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease-in-out',
    minHeight: '44px',
  };

  return (
    <>
      <div style={sidebarStyles}>
        {/* Header */}
        <div style={headerStyles}>
          {!isCollapsed && <div style={logoStyles}>Conversify</div>}
          <button
            style={collapseButtonStyles}
            onClick={onToggle}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
            }}
          >
            <MenuIcon />
          </button>
        </div>

        {/* Main Menu Items */}
        <div style={topSectionStyles}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              style={activeItem === item.id ? activeMenuItemStyles : menuItemStyles}
              onClick={() => handleItemClick(item.id)}
              onMouseEnter={(e) => {
                if (activeItem !== item.id) {
                  e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
                  e.target.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (activeItem !== item.id) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#a1a1aa';
                }
              }}
            >
              <div style={iconContainerStyles}>
                <item.icon />
              </div>
              <span style={menuLabelStyles}>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Bottom Section */}
        <div style={bottomSectionStyles}>
          {/* Upgrade Button */}
          <button
            style={upgradeButtonStyles}
            onClick={() => handleItemClick('pricing')}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <div style={iconContainerStyles}>
              <UpgradeIcon />
            </div>
            <span style={menuLabelStyles}>Upgrade Now</span>
          </button>

          {/* Settings Items */}
          {bottomItems.map((item) => (
            <button
              key={item.id}
              style={menuItemStyles}
              onClick={() => handleItemClick(item.id)}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
                e.target.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#a1a1aa';
              }}
            >
              <div style={iconContainerStyles}>
                <item.icon />
              </div>
              <span style={menuLabelStyles}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={()=>navigate('/login')}
      />
    </>
  );
};

export default Sidebar;