import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Will be updated based on screen size

  // Detect mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Set initial sidebar state based on screen size
      // Mobile: collapsed (false), Desktop: expanded (true)
      setSidebarOpen(!mobile);
    };

    // Check on component mount
    checkIsMobile();
    
    // Listen for window resize
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <>
      {/* Global CSS Reset */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden;
        }
        
        html {
          margin: 0;
          padding: 0;
        }
      `}</style>
      
      <div style={{ 
        display: "flex",
        margin: 0,
        padding: 0,
        minHeight: '100vh',
        overflow: 'hidden'
      }}>
        <Sidebar 
          open={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
        
        <main style={{
          flexGrow: 1,
          transition: 'all 0.3s',
          background: '#111827',
          minHeight: '100vh',
          padding: '20px',
          marginLeft: sidebarOpen ? '220px' : '60px',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}>
          <Outlet context={{ sidebarOpen }} />
        </main>
      </div>
    </>
  );
};

export default MainLayout;