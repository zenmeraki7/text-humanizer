import React, { useState } from 'react';
import MainContent from '../components/Maincontent';
import { MenuIcon } from '../components/Icons';

function  HomePage  ()  {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start collapsed

  return (
    <div style={{ display: 'flex', minHeight: '100vh', margin: 0, padding: 0,backgroundColor: '#0a0a0a' }}>
      {/* Sidebar */}


      {/* Main Content */}
      <div style={{ flex: 1 }}>
        <MainContent  />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: window.innerWidth < 768 ? 'block' : 'none',
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default HomePage;