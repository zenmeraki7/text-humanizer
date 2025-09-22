
import React, { useEffect, useRef } from 'react';

// Reusable Particle Background Component
export default function ParticleBackground ({ 
  particleCount = null, // null = auto-calculate based on screen size
  particleColor = 'rgba(59, 130, 246, 0.6)', // Default blue
  particleSize = { min: 1, max: 4 }, // Size range
  particleSpeed = { min: 0.5, max: 2 }, // Speed range
  connectionDistance = 100, // Distance for particle connections
  connectionOpacity = 0.1, // Opacity of connection lines
  showConnections = true, // Whether to show connection lines
  backgroundColor = 'transparent', // Canvas background
  zIndex = 0 // Z-index for layering
})  {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
      // Particle class
    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
        this.opacity = Math.random() * 0.8 + 0.2;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.size = Math.random() * (particleSize.max - particleSize.min) + particleSize.min;
        this.speedY = Math.random() * (particleSpeed.max - particleSpeed.min) + particleSpeed.min;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.8 + 0.2;
        
        // Parse color and add opacity
        const baseColor = particleColor.includes('rgba') 
          ? particleColor 
          : particleColor.replace('rgb', 'rgba').replace(')', `, ${this.opacity})`);
        this.color = baseColor;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Reset particle when it goes off screen
        if (this.y > canvas.height + 10) {
          this.reset();
        }
        if (this.x > canvas.width + 10 || this.x < -10) {
          this.x = Math.random() * canvas.width;
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
     // Create particles
    const createParticles = () => {
      const count = particleCount || Math.floor((canvas.width * canvas.height) / 15000);
      particlesRef.current = [];
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(new Particle());
      }
    };

    createParticles();
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Recreate particles on resize
      createParticles();
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

  

   

    // Animation loop
    const animate = () => {
      // Clear canvas with background color
      if (backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      
      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });

      // Draw connecting lines between nearby particles
      if (showConnections) {
        for (let i = 0; i < particlesRef.current.length; i++) {
          for (let j = i + 1; j < particlesRef.current.length; j++) {
            const particle1 = particlesRef.current[i];
            const particle2 = particlesRef.current[j];
            const distance = Math.sqrt(
              Math.pow(particle1.x - particle2.x, 2) + 
              Math.pow(particle1.y - particle2.y, 2)
            );

            if (distance < connectionDistance) {
              ctx.save();
              ctx.globalAlpha = (connectionDistance - distance) / connectionDistance * connectionOpacity;
              ctx.strokeStyle = particleColor;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particle1.x, particle1.y);
              ctx.lineTo(particle2.x, particle2.y);
              ctx.stroke();
              ctx.restore();
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particleCount, particleColor, particleSize, particleSpeed, connectionDistance, connectionOpacity, showConnections, backgroundColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: zIndex,
        pointerEvents: 'none'
      }}
    />
  );
};