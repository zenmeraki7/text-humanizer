import React, { useState, useEffect, useRef } from 'react';
import { ChevronRightIcon, DataIcon, HelpIcon, LanguageIcon, NotificationIcon, PaletteIcon, SaveIcon, SecurityIcon, UserIcon } from '../components/Icons';
import './Settings.css';
import { useOutletContext } from 'react-router-dom';
import { HeadphoneOff } from 'lucide-react';
// Main Settings Page Component
function SettingsPage ()  {
  const { sidebarOpen } = useOutletContext();
  const [activeSection, setActiveSection] = useState('profile');
  const [settings, setSettings] = useState({
    // Profile Settings
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '',
    
    // Security Settings
    twoFactorEnabled: false,
    loginNotifications: true,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    
    // Appearance Settings
    theme: 'dark',
    language: 'en',
    
    // Data Settings
    autoSave: true,
    dataRetention: '30',
  });

  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Constants
  const drawerWidth = 220;
  const collapsedDrawerWidth = 60;

  useEffect(() => {
    // Initialize floating particles
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }
    setParticles(newParticles);

    // Animate particles
   const animateParticles = () => {
  setParticles(prevParticles => 
    prevParticles.map(particle => {
      // Calculate new positions
      let newX = particle.x + particle.vx;
      let newY = particle.y + particle.vy;
      
      // Handle boundary wrapping
      if (newX > window.innerWidth) newX = 0;
      if (newX < 0) newX = window.innerWidth;
      if (newY > window.innerHeight) newY = 0;
      if (newY < 0) newY = window.innerHeight;
      
      return {
        ...particle,
        x: newX,
        y: newY,
      };
    })
  );
};

    const interval = setInterval(animateParticles, 100);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth - 0.5) * 20,
      y: (e.clientY / window.innerHeight - 0.5) * 20
    });
  };

  const settingSections = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'security', label: 'Security', icon: SecurityIcon },
    { id: 'notifications', label: 'Notifications', icon: NotificationIcon },
    { id: 'appearance', label: 'Appearance', icon: PaletteIcon },
    { id: 'language', label: 'Language & Region', icon: LanguageIcon },
    { id: 'data', label: 'Data & Privacy', icon: DataIcon },
    { id: 'help', label: 'Help & Support', icon: HelpIcon },
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderSettingContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="setting-card">
              <h3 className="setting-title">Profile Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => handleSettingChange('name', e.target.value)}
                    className="form-input"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleSettingChange('email', e.target.value)}
                    className="form-input"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="setting-card">
              <h3 className="setting-title">Security Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="toggle-setting">
                  <div>
                    <h4 style={{ color: '#f8fafc', fontSize: '16px', margin: 0 }}>Two-Factor Authentication</h4>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>Add an extra layer of security to your account</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.twoFactorEnabled}
                      onChange={(e) => handleSettingChange('twoFactorEnabled', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="toggle-setting">
                  <div>
                    <h4 style={{ color: '#f8fafc', fontSize: '16px', margin: 0 }}>Login Notifications</h4>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>Get notified when someone signs into your account</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.loginNotifications}
                      onChange={(e) => handleSettingChange('loginNotifications', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="setting-card">
              <h3 className="setting-title">Notification Preferences</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="toggle-setting">
                  <div>
                    <h4 style={{ color: '#f8fafc', fontSize: '16px', margin: 0 }}>Email Notifications</h4>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>Receive updates and alerts via email</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="toggle-setting">
                  <div>
                    <h4 style={{ color: '#f8fafc', fontSize: '16px', margin: 0 }}>Push Notifications</h4>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>Get instant notifications in your browser</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="toggle-setting">
                  <div>
                    <h4 style={{ color: '#f8fafc', fontSize: '16px', margin: 0 }}>Weekly Reports</h4>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>Receive weekly usage summaries</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.weeklyReports}
                      onChange={(e) => handleSettingChange('weeklyReports', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="setting-card">
              <h3 className="setting-title">Appearance Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Theme</label>
                  <select
                    value={settings.theme}
                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                    className="form-select"
                  >
                    <option value="dark">Dark Mode</option>
                    <option value="light">Light Mode</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'language':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="setting-card">
              <h3 className="setting-title">Language & Region</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    className="form-select"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="setting-card">
              <h3 className="setting-title">Data & Privacy</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="toggle-setting">
                  <div>
                    <h4 style={{ color: '#f8fafc', fontSize: '16px', margin: 0 }}>Auto-Save</h4>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>Automatically save your work</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.autoSave}
                      onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="form-group">
                  <label className="form-label">Data Retention Period</label>
                  <select
                    value={settings.dataRetention}
                    onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
                    className="form-select"
                  >
                    <option value="7">7 Days</option>
                    <option value="30">30 Days</option>
                    <option value="90">90 Days</option>
                    <option value="365">1 Year</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'help':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="setting-card">
              <h3 className="setting-title">Help & Support</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="help-item">
                  <h4 style={{ color: '#f8fafc', fontSize: '16px', margin: 0 }}>Documentation</h4>
                  <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 8px 0' }}>Browse our comprehensive guides and tutorials</p>
                  <button className="help-button">View Docs</button>
                </div>
                <div className="help-item">
                  <h4 style={{ color: '#f8fafc', fontSize: '16px', margin: 0 }}>Contact Support</h4>
                  <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 8px 0' }}>Get in touch with our support team</p>
                  <button className="help-button">Contact Us</button>
                </div>
                <div className="help-item">
                  <h4 style={{ color: '#f8fafc', fontSize: '16px', margin: 0 }}>Community</h4>
                  <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 8px 0' }}>Join our community forum for discussions</p>
                  <button className="help-button">Join Community</button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a setting category</div>;
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        marginLeft: sidebarOpen ? `${drawerWidth}px` : `${collapsedDrawerWidth}px`,
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 20% 50%, rgba(5, 6, 87, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.08) 0%, transparent 50%),
          linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)
        `,
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >


      {/* Floating Particles */}
      {particles.map((particle, index) => (
        <div
          key={index}
          className="floating-particle"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDelay: `${index * 0.2}s`,
          }}
        />
      ))}

      {/* Header */}
      <div style={{
        marginBottom: '40px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1.2',
          textShadow: '0 0 40px rgba(99, 102, 241, 0.3)',
          transform: `rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`,
          transition: 'transform 0.3s ease-out',
        }}>
          Settings
        </h1>
        <p style={{
          color: '#94a3b8',
          fontSize: '18px',
          fontWeight: 400,
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6',
        }}>
          Customize your experience and manage your preferences
        </p>
      </div>

      {/* Main Content */}
      <div className="settings-container" style={{
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10,
      }}>
        <div className="settings-layout" style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'flex-start',
        }}>
          {/* Settings Navigation Sidebar */}
          <div style={{ minWidth: '320px' }}>
            <div className="sidebar-menu">
              <h3 style={{
                color: '#f8fafc',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '2px solid rgba(99, 102, 241, 0.2)',
              }}>
                Categories
              </h3>
              
              {settingSections.map((section) => (
                <div
                  key={section.id}
                  className={`menu-item ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    background: activeSection === section.id 
                      ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                      : 'rgba(99, 102, 241, 0.1)',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                  }}>
                    <section.icon />
                  </div>
                  <span style={{ flex: 1, fontSize: '16px' }}>{section.label}</span>
                  <ChevronRightIcon />
                </div>
              ))}
            </div>
          </div>

          {/* Settings Content */}
          <div style={{ flex: 1, minHeight: '500px' }}>
            {renderSettingContent()}

            {/* Save Button */}
            <div style={{
              marginTop: '40px',
              display: 'flex',
              justifyContent: 'center',
            }}>
              <button 
                className="save-button"
                onClick={() => {
                  // Save settings logic here
                  alert('Settings saved successfully!');
                }}
              >
                <SaveIcon />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
