import React, { useState, useEffect } from "react";

const customTheme = {
  colors: {
    darkNavy: '#021024',
    navy: '#052659',
    mediumBlue: '#5483B3',
    lightBlue: '#7DA0CA',
    paleBlue: '#C1E8FF',
  }
};

export default function Landing() {
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: "✨",
      title: "Neural Writing Enhancement",
      description: "Transform robotic AI text into captivating, human-like content that truly connects with your audience",
      gradient: `linear-gradient(135deg, ${customTheme.colors.navy}, ${customTheme.colors.mediumBlue})`,
    },
    {
      icon: "🛡️",
      title: "AI-Powered Detection",
      description: "Advanced neural networks identify plagiarism and AI-generated content with unprecedented accuracy",
      gradient: `linear-gradient(135deg, ${customTheme.colors.mediumBlue}, ${customTheme.colors.lightBlue})`,
    },
    {
      icon: "⚡",
      title: "Instant Processing",
      description: "Lightning-fast transformation powered by cutting-edge algorithms processing thousands of words instantly",
      gradient: `linear-gradient(135deg, ${customTheme.colors.lightBlue}, ${customTheme.colors.paleBlue})`,
    },
    {
      icon: "🎯",
      title: "99.9% Precision",
      description: "Industry-leading accuracy backed by machine learning models trained on billions of text samples",
      gradient: `linear-gradient(135deg, ${customTheme.colors.navy}, ${customTheme.colors.lightBlue})`,
    },
    {
      icon: "📱",
      title: "Universal Compatibility",
      description: "Seamless experience across all devices with responsive design and progressive web capabilities",
      gradient: `linear-gradient(135deg, ${customTheme.colors.mediumBlue}, ${customTheme.colors.paleBlue})`,
    },
    {
      icon: "🔐",
      title: "Zero-Knowledge Privacy",
      description: "End-to-end encryption ensures your content remains completely private with no data retention",
      gradient: `linear-gradient(135deg, ${customTheme.colors.darkNavy}, ${customTheme.colors.navy})`,
    },
  ];

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${customTheme.colors.darkNavy} 0%, ${customTheme.colors.navy} 50%, ${customTheme.colors.mediumBlue} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
      }}
    >
      {/* Animated Background Elements */}
      <div
        style={{
          position: 'fixed',
          top: '-200px',
          right: '-200px',
          width: '400px',
          height: '400px',
          background: `radial-gradient(circle, ${customTheme.colors.mediumBlue}50 0%, transparent 70%)`,
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '-150px',
          left: '-150px',
          width: '300px',
          height: '300px',
          background: `radial-gradient(circle, ${customTheme.colors.lightBlue}50 0%, transparent 70%)`,
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Navigation */}
      <nav 
        style={{
          background: `${customTheme.colors.darkNavy}cc`,
          backdropFilter: 'blur(10px)',
          padding: '1rem 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          borderBottom: `1px solid ${customTheme.colors.navy}`,
        }}
      >
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <h2 style={{ 
            color: customTheme.colors.paleBlue, 
            fontWeight: 700, 
            margin: 0,
            fontSize: '1.5rem',
          }}>
            Conversify
          </h2>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="#" style={{ color: customTheme.colors.paleBlue, textDecoration: 'none', fontWeight: 500 }}>Home</a>
            <a href="#" style={{ color: customTheme.colors.lightBlue, textDecoration: 'none', fontWeight: 500 }}>Features</a>
            <a href="#" style={{ color: customTheme.colors.lightBlue, textDecoration: 'none', fontWeight: 500 }}>About</a>
            <button
              style={{
                background: `linear-gradient(135deg, ${customTheme.colors.navy}, ${customTheme.colors.mediumBlue})`,
                color: customTheme.colors.paleBlue,
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '50px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem', animation: 'fadeIn 1s ease' }}>
          <h1 
            style={{
              fontSize: '4rem',
              fontWeight: 800,
              marginBottom: '1.5rem',
              lineHeight: 1.2,
              background: `linear-gradient(135deg, ${customTheme.colors.paleBlue} 0%, ${customTheme.colors.lightBlue} 50%, ${customTheme.colors.mediumBlue} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Transform AI to
            <br />
            Human Perfection
          </h1>
          
          <p
            style={{
              fontSize: '1.5rem',
              color: customTheme.colors.lightBlue,
              marginBottom: '3rem',
              maxWidth: '600px',
              margin: '0 auto 3rem',
              lineHeight: 1.6,
            }}
          >
            Revolutionary AI humanization and detection platform powered by advanced neural networks
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <button
              style={{
                background: `linear-gradient(135deg, ${customTheme.colors.navy}, ${customTheme.colors.mediumBlue})`,
                color: customTheme.colors.paleBlue,
                border: 'none',
                padding: '1rem 2.5rem',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 10px 30px ${customTheme.colors.navy}80`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Start Humanizing
            </button>
            
            <button
              style={{
                background: `linear-gradient(135deg, ${customTheme.colors.mediumBlue}, ${customTheme.colors.lightBlue})`,
                color: customTheme.colors.darkNavy,
                border: 'none',
                padding: '1rem 2.5rem',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 10px 30px ${customTheme.colors.mediumBlue}80`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Try Detection Free
            </button>

            <button
              style={{
                background: `linear-gradient(135deg, ${customTheme.colors.lightBlue}, ${customTheme.colors.paleBlue})`,
                color: customTheme.colors.darkNavy,
                border: 'none',
                padding: '1rem 2.5rem',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 10px 30px ${customTheme.colors.lightBlue}80`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Instant Plagiarism Scan
            </button>
          </div>

          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: '99.9% Accuracy', color: customTheme.colors.mediumBlue },
              { label: '1M+ Words Processed', color: customTheme.colors.lightBlue },
              { label: 'Enterprise Security', color: customTheme.colors.paleBlue },
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  background: `${customTheme.colors.navy}40`,
                  color: stat.color,
                  border: `1px solid ${stat.color}`,
                  padding: '0.5rem 1.5rem',
                  borderRadius: '50px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: stat.color,
                    animation: 'pulse 2s infinite',
                  }}
                />
                {stat.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              background: `linear-gradient(135deg, ${customTheme.colors.paleBlue}, ${customTheme.colors.lightBlue})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Powered by Advanced AI
          </h2>
          <p style={{ fontSize: '1.2rem', color: customTheme.colors.lightBlue, maxWidth: '600px', margin: '0 auto' }}>
            Experience the future of content transformation with our cutting-edge technology stack
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {features.map((feature, index) => (
            <div
              key={feature.title}
              style={{
                background: activeFeature === index 
                  ? `${customTheme.colors.mediumBlue}30` 
                  : `${customTheme.colors.navy}40`,
                backdropFilter: 'blur(10px)',
                border: activeFeature === index 
                  ? `1px solid ${customTheme.colors.lightBlue}80` 
                  : `1px solid ${customTheme.colors.navy}80`,
                borderRadius: '1rem',
                padding: '2rem',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: `fadeIn ${1 + index * 0.2}s ease`,
              }}
              onMouseEnter={() => setActiveFeature(index)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = `0 20px 40px ${customTheme.colors.mediumBlue}40`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: feature.gradient,
                  transform: activeFeature === index ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.5s ease',
                }}
              />
              
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '0.5rem',
                  background: feature.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  marginBottom: '1.5rem',
                  transition: 'transform 0.3s ease',
                  transform: activeFeature === index ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {feature.icon}
              </div>
              
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: customTheme.colors.paleBlue }}>
                {feature.title}
              </h3>
              
              <p style={{ fontSize: '1rem', color: customTheme.colors.lightBlue, lineHeight: 1.6, margin: 0 }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '5rem 2rem' }}>
        <div
          style={{
            background: `${customTheme.colors.mediumBlue}30`,
            border: `1px solid ${customTheme.colors.lightBlue}50`,
            borderRadius: '1.5rem',
            padding: '4rem 3rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            animation: 'fadeIn 1.5s ease',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, ${customTheme.colors.navy}30, ${customTheme.colors.mediumBlue}30)`,
              zIndex: 0,
            }}
          />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                marginBottom: '1.5rem',
                background: `linear-gradient(135deg, ${customTheme.colors.paleBlue}, ${customTheme.colors.lightBlue})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Ready to Transform Your Content?
            </h2>
            
            <p style={{ fontSize: '1.2rem', color: customTheme.colors.lightBlue, marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
              Join thousands of content creators who trust Conversify for professional-grade text transformation
            </p>
            
            <button
              style={{
                background: `linear-gradient(135deg, ${customTheme.colors.navy}, ${customTheme.colors.mediumBlue})`,
                color: customTheme.colors.paleBlue,
                border: 'none',
                padding: '1.25rem 3rem',
                borderRadius: '50px',
                fontSize: '1.2rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = `0 15px 35px ${customTheme.colors.navy}80`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Get Started Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}