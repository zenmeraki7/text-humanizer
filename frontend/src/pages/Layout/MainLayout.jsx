import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const newScreenSize = {
        isMobile: width <= 768,
        isTablet: width > 768 && width <= 1024,
        isDesktop: width > 1024
      };
      setScreenSize(newScreenSize);
      
      // Set initial sidebar state: closed on mobile/tablet, open on desktop
      setSidebarOpen(newScreenSize.isDesktop);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
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
        padding: screenSize.isMobile ? '16px' : '20px',
        marginLeft: screenSize.isDesktop 
          ? (sidebarOpen ? '220px' : '60px') 
          : '0', // No margin on mobile/tablet since sidebar slides over
      }}>
        <Outlet context={{ sidebarOpen, screenSize }} />
      </main>
    </div>
  );
};