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
    <div style={{ display: "flex" }}>
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
        marginLeft: sidebarOpen ? '220px' : '60px', // Add proper spacing
      }}>
        <Outlet context={{ sidebarOpen }} />
      </main>
    </div>
  );
};

export default MainLayout;