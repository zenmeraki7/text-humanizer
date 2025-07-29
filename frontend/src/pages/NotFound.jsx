import React, { useEffect, useRef, useState } from 'react';

function NotFoundPage() {
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  // Responsive breakpoints
  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles with responsive count
    const initParticles = () => {
      const particleCount = isMobile ? 75 : isTablet ? 100 : 150;
      const particleArray = [];
      for (let i = 0; i < particleCount; i++) {
        particleArray.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 1000,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          vz: Math.random() * 2 + 1,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          color: `hsl(${Math.random() * 60 + 240}, 70%, 70%)`
        });
      }
      setParticles(particleArray);
    };
    initParticles();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create star field effect
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          // Move particles
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.z -= particle.vz;
          
          // Reset particles that have moved too far
          if (particle.z <= 0) {
            particle.z = 1000;
            particle.x = Math.random() * canvas.width;
            particle.y = Math.random() * canvas.height;
          }
          
          // 3D projection
          const scale = 400 / particle.z;
          const x2d = (particle.x - canvas.width / 2) * scale + canvas.width / 2;
          const y2d = (particle.y - canvas.height / 2) * scale + canvas.height / 2;
          
          // Draw particle
          ctx.beginPath();
          ctx.arc(x2d, y2d, particle.size * scale, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.globalAlpha = particle.opacity * (1 - particle.z / 1000);
          ctx.fill();
          
          // Draw trail (reduced on mobile for performance)
          if (!isMobile || Math.random() > 0.7) {
            ctx.beginPath();
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = particle.size * scale * 0.5;
            ctx.moveTo(x2d, y2d);
            ctx.lineTo(x2d + particle.vx * scale * 10, y2d + particle.vy * scale * 10);
            ctx.stroke();
          }
          
          return particle;
        })
      );
      
      requestAnimationFrame(animate);
    };
    animate();

    // Mouse movement effect (disabled on mobile for performance)
    const handleMouseMove = (e) => {
      if (!isMobile) {
        setMousePosition({
          x: (e.clientX / window.innerWidth - 0.5) * 2,
          y: (e.clientY / window.innerHeight - 0.5) * 2
        });
      }
    };
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile, isTablet, windowSize]);

  const handleHomeClick = () => {
    // Add ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1000);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div style={{
      margin: 0,
      boxSizing: 'border-box',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'radial-gradient(ellipse at center, #0f0f23 0%, #1a0b2e 30%, #16213e 70%, #0f3460 100%)',
      color: 'white',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      position: 'relative',
      padding: isMobile ? '20px' : isTablet ? '30px' : '40px'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Orbitron', monospace;
          overflow: hidden;
        }

        .canvas-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        .holographic-container {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: ${isMobile ? '20px' : isTablet ? '30px' : '40px'};
          background: rgba(0, 20, 40, 0.1);
          backdrop-filter: blur(20px);
          border-radius: ${isMobile ? '20px' : '30px'};
          border: 2px solid rgba(64, 224, 208, 0.3);
          box-shadow: 
            0 0 50px rgba(64, 224, 208, 0.2),
            inset 0 0 50px rgba(64, 224, 208, 0.05);
          animation: hologram-pulse 4s ease-in-out infinite;
          transform-style: preserve-3d;
          perspective: 1000px;
          max-width: ${isMobile ? '350px' : isTablet ? '500px' : '800px'};
          width: 100%;
          margin: 0 auto;
        }

        @keyframes hologram-pulse {
          0%, 100% {
            box-shadow: 
              0 0 50px rgba(64, 224, 208, 0.2),
              inset 0 0 50px rgba(64, 224, 208, 0.05);
            transform: rotateX(0deg) rotateY(0deg);
          }
          25% {
            box-shadow: 
              0 0 80px rgba(64, 224, 208, 0.4),
              inset 0 0 80px rgba(64, 224, 208, 0.1);
            transform: rotateX(${isMobile ? '1deg' : '2deg'}) rotateY(${isMobile ? '0.5deg' : '1deg'});
          }
          50% {
            box-shadow: 
              0 0 100px rgba(64, 224, 208, 0.6),
              inset 0 0 100px rgba(64, 224, 208, 0.15);
            transform: rotateX(0deg) rotateY(${isMobile ? '-0.5deg' : '-1deg'});
          }
          75% {
            box-shadow: 
              0 0 80px rgba(64, 224, 208, 0.4),
              inset 0 0 80px rgba(64, 224, 208, 0.1);
            transform: rotateX(${isMobile ? '-1deg' : '-2deg'}) rotateY(0deg);
          }
        }

        .error-code {
          font-size: ${isMobile ? '4rem' : isTablet ? '6rem' : '8rem'};
          font-weight: 900;
          font-family: 'Orbitron', monospace;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #dda0dd);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: rainbow-flow 3s ease-in-out infinite, ${isMobile ? 'none' : 'glitch-effect 5s infinite'};
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
          margin-bottom: ${isMobile ? '1rem' : '2rem'};
          position: relative;
          display: inline-block;
          line-height: 1;
        }

        .error-code::before {
          content: '404';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: ${isMobile ? 'none' : 'glitch-1 2s infinite'};
          z-index: -1;
        }

        .error-code::after {
          content: '404';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #45b7d1, #96ceb4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: ${isMobile ? 'none' : 'glitch-2 3s infinite'};
          z-index: -2;
        }

        @keyframes rainbow-flow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes glitch-effect {
          0%, 90%, 100% {
            transform: translate(0);
          }
          10% {
            transform: translate(-2px, 2px);
          }
          20% {
            transform: translate(2px, -2px);
          }
          30% {
            transform: translate(-2px, -2px);
          }
          40% {
            transform: translate(2px, 2px);
          }
          50% {
            transform: translate(-2px, 2px);
          }
          60% {
            transform: translate(2px, -2px);
          }
        }

        @keyframes glitch-1 {
          0%, 90%, 100% {
            transform: translate(0);
            opacity: 0;
          }
          10% {
            transform: translate(-3px, 3px);
            opacity: 0.7;
          }
          20% {
            transform: translate(3px, -3px);
            opacity: 0.5;
          }
        }

        @keyframes glitch-2 {
          0%, 90%, 100% {
            transform: translate(0);
            opacity: 0;
          }
          15% {
            transform: translate(2px, -2px);
            opacity: 0.3;
          }
          25% {
            transform: translate(-2px, 2px);
            opacity: 0.6;
          }
        }

        .title {
          font-size: ${isMobile ? '1.8rem' : isTablet ? '2.8rem' : '4rem'};
          font-weight: 700;
          margin-bottom: ${isMobile ? '1rem' : '2rem'};
          background: linear-gradient(45deg, #64ffda, #1de9b6, #00bcd4, #3f51b5);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: neon-glow 3s ease-in-out infinite, ${isMobile ? 'none' : 'title-float 6s ease-in-out infinite'};
          text-shadow: 0 0 20px rgba(100, 255, 218, 0.5);
          position: relative;
          font-family: 'Orbitron', monospace;
          line-height: 1.2;
        }

        @keyframes neon-glow {
          0%, 100% {
            background-position: 0% 50%;
            text-shadow: 
              0 0 20px rgba(100, 255, 218, 0.5),
              0 0 40px rgba(100, 255, 218, 0.3);
          }
          50% {
            background-position: 100% 50%;
            text-shadow: 
              0 0 30px rgba(100, 255, 218, 0.8),
              0 0 60px rgba(100, 255, 218, 0.5);
          }
        }

        @keyframes title-float {
          0%, 100% {
            transform: translateY(0px) rotateX(0deg);
          }
          33% {
            transform: translateY(-10px) rotateX(5deg);
          }
          66% {
            transform: translateY(5px) rotateX(-3deg);
          }
        }

        .description {
          font-size: ${isMobile ? '1rem' : isTablet ? '1.2rem' : '1.4rem'};
          color: #b3e5fc;
          margin-bottom: ${isMobile ? '2rem' : '3rem'};
          max-width: ${isMobile ? '100%' : '600px'};
          line-height: 1.8;
          text-shadow: 0 0 10px rgba9, 229, 252, 0.3);
          animation: text-shimmer 4s ease-in-out infinite;
          padding: ${isMobile ? '0 10px' : '0'};
        }

        @keyframes text-shimmer {
          0%, 100% {
            opacity: 0.8;
            transform: translateY(0px);
          }
          50% {
            opacity: 1;
            transform: translateY(-2px);
          }
        }

        .highlight {
          color: #64ffda;
          font-weight: 700;
          text-shadow: 0 0 15px rgba(100, 255, 218, 0.6);
          animation: highlight-pulse 2s ease-in-out infinite;
        }

        @keyframes highlight-pulse {
          0%, 100% {
            text-shadow: 0 0 15px rgba(100, 255, 218, 0.6);
          }
          50% {
            text-shadow: 0 0 25px rgba(100, 255, 218, 0.9);
          }
        }

        .buttons {
          display: flex;
          gap: ${isMobile ? '1rem' : '2rem'};
          justify-content: center;
          flex-direction: ${isMobile ? 'column' : 'row'};
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: ${isMobile ? '2rem' : '3rem'};
        }

        .btn {
          padding: ${isMobile ? '14px 28px' : isTablet ? '16px 32px' : '18px 36px'};
          border: none;
          border-radius: 50px;
          font-size: ${isMobile ? '16px' : '18px'};
          font-weight: 700;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: ${isMobile ? '8px' : '12px'};
          position: relative;
          overflow: hidden;
          font-family: 'Orbitron', monospace;
          text-transform: uppercase;
          letter-spacing: 1px;
          width: ${isMobile ? '280px' : 'auto'};
          min-width: ${isMobile ? '280px' : '200px'};
          text-align: center;
        }

        .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }

        .btn:hover::before {
          left: 100%;
        }

        .btn-primary {
          background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 
            0 8px 32px rgba(102, 126, 234, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .btn-primary:hover {
          transform: translateY(${isMobile ? '-4px' : '-8px'}) scale(${isMobile ? '1.02' : '1.05'});
          box-shadow: 
            0 ${isMobile ? '12px' : '16px'} ${isMobile ? '30px' : '40px'} rgba(102, 126, 234, 0.6),
            0 0 0 1px rgba(255, 255, 255, 0.3);
          background: linear-gradient(45deg, #7c3aed 0%, #a855f7 100%);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: #64ffda;
          border: 2px solid rgba(100, 255, 218, 0.3);
          backdrop-filter: blur(10px);
          box-shadow: 
            0 8px 32px rgba(100, 255, 218, 0.1),
            inset 0 0 20px rgba(100, 255, 218, 0.05);
        }

        .btn-secondary:hover {
          background: rgba(100, 255, 218, 0.1);
          transform: translateY(${isMobile ? '-4px' : '-8px'}) scale(${isMobile ? '1.02' : '1.05'});
          border-color: rgba(100, 255, 218, 0.6);
          box-shadow: 
            0 ${isMobile ? '12px' : '16px'} ${isMobile ? '30px' : '40px'} rgba(100, 255, 218, 0.3),
            inset 0 0 30px rgba(100, 255, 218, 0.1);
        }

        .support {
          color: #81c784;
          font-size: ${isMobile ? '0.9rem' : '1.1rem'};
          text-shadow: 0 0 10px rgba(129, 199, 132, 0.3);
          text-align: center;
          padding: ${isMobile ? '0 20px' : '0'};
        }

        .support-link {
          color: #64ffda;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.3s ease;
          position: relative;
          cursor: pointer;
        }

        .support-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #64ffda, #1de9b6);
          transition: width 0.3s ease;
        }

        .support-link:hover::after {
          width: 100%;
        }

        .support-link:hover {
          text-shadow: 0 0 20px rgba(100, 255, 218, 0.8);
        }

        .floating-elements {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 5;
        }

        .floating-shape {
          position: absolute;
          opacity: ${isMobile ? '0.05' : '0.1'};
          animation: float-around ${isMobile ? '30s' : '20s'} linear infinite;
        }

        .floating-shape:nth-child(1) {
          top: 20%;
          left: 10%;
          width: ${isMobile ? '40px' : '60px'};
          height: ${isMobile ? '40px' : '60px'};
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          border-radius: 50%;
          animation-delay: 0s;
        }

        .floating-shape:nth-child(2) {
          top: 70%;
          right: 20%;
          width: ${isMobile ? '30px' : '40px'};
          height: ${isMobile ? '30px' : '40px'};
          background: linear-gradient(45deg, #45b7d1, #96ceb4);
          border-radius: 10px;
          animation-delay: -5s;
        }

        .floating-shape:nth-child(3) {
          bottom: 30%;
          left: 15%;
          width: ${isMobile ? '35px' : '50px'};
          height: ${isMobile ? '35px' : '50px'};
          background: linear-gradient(45deg, #ffeaa7, #dda0dd);
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          animation-delay: -10s;
        }

        @keyframes float-around {
          0% {
            transform: translateX(0) translateY(0) rotate(0deg);
          }
          25% {
            transform: translateX(${isMobile ? '50px' : '100px'}) translateY(${isMobile ? '-25px' : '-50px'}) rotate(90deg);
          }
          50% {
            transform: translateX(${isMobile ? '100px' : '200px'}) translateY(${isMobile ? '25px' : '50px'}) rotate(180deg);
          }
          75% {
            transform: translateX(${isMobile ? '50px' : '100px'}) translateY(${isMobile ? '50px' : '100px'}) rotate(270deg);
          }
          100% {
            transform: translateX(0) translateY(0) rotate(360deg);
          }
        }

        .ripple-effect {
          position: fixed;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(100, 255, 218, 0.3) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          animation: ripple 1s ease-out forwards;
          pointer-events: none;
          z-index: 1000;
        }

        @keyframes ripple {
          0% {
            width: 0;
            height: 0;
            opacity: 1;
          }
          100% {
            width: ${isMobile ? '600px' : '1000px'};
            height: ${isMobile ? '600px' : '1000px'};
            opacity: 0;
          }
        }

        .cyber-grid {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(64, 224, 208, ${isMobile ? '0.02' : '0.03'}) 1px, transparent 1px),
            linear-gradient(90deg, rgba(64, 224, 208, ${isMobile ? '0.02' : '0.03'}) 1px, transparent 1px);
          background-size: ${isMobile ? '30px 30px' : '50px 50px'};
          z-index: 2;
          animation: grid-move ${isMobile ? '30s' : '20s'} linear infinite;
        }

        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(${isMobile ? '30px, 30px' : '50px, 50px'});
          }
        }

        /* Touch-friendly adjustments for mobile */
        @media (max-width: 480px) {
          .title {
            font-size: 1.5rem;
          }
          
          .error-code {
            font-size: 3.5rem;
            margin-bottom: 0.8rem;
          }
          
          .description {
            font-size: 0.9rem;
            padding: 0 15px;
            margin-bottom: 1.5rem;
          }
          
          .btn {
            width: 260px;
            min-width: 260px;
            padding: 12px 24px;
            font-size: 15px;
          }
          
          .holographic-container {
            padding: 15px;
            max-width: 320px;
            margin: 10px;
          }

          .support {
            font-size: 0.8rem;
            padding: 0 15px;
          }
        }

        /* Tablet optimizations */
        @media (min-width: 768px) and (max-width: 1023px) {
          .buttons {
            flex-direction: row;
            gap: 1.5rem;
          }
          
          .btn {
            width: auto;
            min-width: 180px;
          }
        }

        /* Performance optimizations for mobile */
        @media (max-width: 767px) {
          .error-code::before,
          .error-code::after {
            display: none;
          }
          
          .floating-shape {
            animation-duration: 40s;
          }
          
          .holographic-container {
            animation-duration: 6s;
          }
        }
      `}</style>

      {/* Animated background canvas */}
      <div className="canvas-container">
        <canvas ref={canvasRef} />
      </div>

      {/* Cyber grid overlay */}
      <div className="cyber-grid" />

      {/* Floating geometric shapes */}
      <div className="floating-elements">
        <div className="floating-shape" />
        <div className="floating-shape" />
        <div className="floating-shape" />
      </div>

      {/* Main holographic container */}
      <div 
        className="holographic-container"
        style={{
          transform: isMobile ? 'none' : `rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`
        }}
      >
        <div className="error-code">404</div>
        <h1 className="title">Lost in the Digital Cosmos</h1>
        <p className="description">
          You've ventured into uncharted digital territory. <span className="highlight">Fear not, space traveler</span> - our quantum navigation system will guide you back to familiar space-time coordinates.
        </p>
        
        <div className="buttons">
          <a href="/" className="btn btn-primary" onClick={handleHomeClick}>
            🚀 Warp to Home
          </a>
          <a href="#" className="btn btn-secondary" onClick={(e) => { e.preventDefault(); handleGoBack(); }}>
            ⬅️ Reverse Trajectory
          </a>
        </div>
        
        <div className="support">
          Mission Control: 
          <span
            className="support-link"
            onClick={() => window.location.href = "mailto:zenmerakihelp@gmail.com?subject=Support Request&body=Hello, I need assistance with..."}
          >
            Contact Ground Control
          </span>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;