import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Container,
  Box,
  Card,
  CardContent,
  Chip,
  Fade,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navigation from "./Layout/Navigation"; // Import the Navigation component
import { Link } from "react-router-dom";

const darkTheme = createTheme({
   palette: {
    mode: 'dark',
    primary: {
      main: '#7D8F88',
      light: '#93AAB5',
      dark: '#2B4242',
    },
    secondary: {
      main: '#C3C3C3',
      light: '#E3E3E3',
      dark: '#6B8784',
    },
    background: {
      default: '#2B4242',
      paper: 'rgba(125, 143, 136, 0.15)',
    },
    text: {
      primary: '#E3E3E3',
      secondary: 'rgba(195, 195, 195, 0.8)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3.5rem',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #A78BFA 50%, #EC4899 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            boxShadow: '0 20px 40px rgba(139, 92, 246, 0.2)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1.1rem',
          padding: '12px 32px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
          },
        },
      },
    },
  },
});

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
      gradient: "linear-gradient(135deg, #8B5CF6, #EC4899)",
    },
    {
      icon: "🛡️",
      title: "AI-Powered Detection",
      description: "Advanced neural networks identify plagiarism and AI-generated content with unprecedented accuracy",
      gradient: "linear-gradient(135deg, #06B6D4, #3B82F6)",
    },
    {
      icon: "⚡",
      title: "Instant Processing",
      description: "Lightning-fast transformation powered by cutting-edge algorithms processing thousands of words instantly",
      gradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
    },
    {
      icon: "🎯",
      title: "99.9% Precision",
      description: "Industry-leading accuracy backed by machine learning models trained on billions of text samples",
      gradient: "linear-gradient(135deg, #10B981, #059669)",
    },
    {
      icon: "📱",
      title: "Universal Compatibility",
      description: "Seamless experience across all devices with responsive design and progressive web capabilities",
      gradient: "linear-gradient(135deg, #8B5CF6, #6366F1)",
    },
    {
      icon: "🔐",
      title: "Zero-Knowledge Privacy",
      description: "End-to-end encryption ensures your content remains completely private with no data retention",
      gradient: "linear-gradient(135deg, #EF4444, #EC4899)",
    },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0F0F23 0%, #1E1B4B 50%, #312E81 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background Elements */}
        <Box
          sx={{
            position: 'fixed',
            top: -200,
            right: -200,
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-20px)' },
            },
          }}
        />
        <Box
          sx={{
            position: 'fixed',
            bottom: -150,
            left: -150,
            width: 300,
            height: 300,
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse',
          }}
        />

        {/* Navigation Component */}
        <Navigation />

        {/* Hero Section */}
        <Container maxWidth="lg" sx={{ pt: 15, pb: 10 }}>
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h1" sx={{ mb: 3, lineHeight: 1.2 }}>
                Transform AI to
                <br />
                Human Perfection
              </Typography>
              
              <Typography
                variant="h5"
                sx={{
                  mb: 6,
                  color: 'text.secondary',
                  maxWidth: 600,
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                Revolutionary AI humanization and detection platform powered by advanced neural networks
              </Typography>

              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', mb: 6 }}>
               <Link to="/humanize" >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #7C3AED, #DB2777)',
                      boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)',
                    },
                  }}
                >
                  Start Humanizing
                </Button>
               </Link>
                <Link to="/detector" >
                
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #6366F1, #3B82F6)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                      boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)',
                    },
                  }}
                >
                  Try Detection Free
                </Button>
                </Link>

              <Link to ="/plagiarism" >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #9333EA, #C026D3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #C026D3, #9333EA)',
                      boxShadow: '0 10px 30px rgba(147, 51, 234, 0.4)',
                    },
                  }}
                >
                  Instant Plagiarism Scan
                </Button>
              </Link>
              </Box>

              <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                  { label: '99.9% Accuracy', color: '#10B981' },
                  { label: '1M+ Words Processed', color: '#3B82F6' },
                  { label: 'Enterprise Security', color: '#8B5CF6' },
                ].map((stat, index) => (
                  <Chip
                    key={index}
                    label={stat.label}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: stat.color,
                      border: `1px solid ${stat.color}`,
                      '& .MuiChip-label': { fontWeight: 600 },
                    }}
                    icon={
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: stat.color,
                          animation: 'pulse 2s infinite',
                          '@keyframes pulse': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0.5 },
                          },
                        }}
                      />
                    }
                  />
                ))}
              </Box>
            </Box>
          </Fade>
        </Container>

        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: 10 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                mb: 3,
                background: 'linear-gradient(135deg, #FFFFFF, #A78BFA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Powered by Advanced AI
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Experience the future of content transformation with our cutting-edge technology stack
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Row 1 */}
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {[features[0], features[1]].map((feature, index) => (
                <Box key={feature.title} sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
                  <Fade in timeout={1000 + index * 200}>
                    <Card
                      sx={{
                        height: '100%',
                        p: 3,
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        background: activeFeature === index 
                          ? 'rgba(139, 92, 246, 0.15)' 
                          : 'rgba(255, 255, 255, 0.05)',
                        border: activeFeature === index 
                          ? '1px solid rgba(139, 92, 246, 0.5)' 
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 4,
                          background: feature.gradient,
                          transform: activeFeature === index ? 'scaleX(1)' : 'scaleX(0)',
                          transformOrigin: 'left',
                          transition: 'transform 0.5s ease',
                        },
                      }}
                      onMouseEnter={() => setActiveFeature(index)}
                    >
                      <CardContent sx={{ p: 0 }}>
                        <Box
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: 2,
                            background: feature.gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            mb: 3,
                            transition: 'transform 0.3s ease',
                            transform: activeFeature === index ? 'scale(1.1)' : 'scale(1)',
                          }}
                        >
                          {feature.icon}
                        </Box>
                        
                        <Typography variant="h4" sx={{ mb: 2, color: 'text.primary' }}>
                          {feature.title}
                        </Typography>
                        
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Fade>
                </Box>
              ))}
            </Box>

            {/* Row 2 */}
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {[features[2], features[3]].map((feature, index) => {
                const globalIndex = index + 2;
                return (
                  <Box key={feature.title} sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
                    <Fade in timeout={1000 + globalIndex * 200}>
                      <Card
                        sx={{
                          height: '100%',
                          p: 3,
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden',
                          background: activeFeature === globalIndex 
                            ? 'rgba(139, 92, 246, 0.15)' 
                            : 'rgba(255, 255, 255, 0.05)',
                          border: activeFeature === globalIndex 
                            ? '1px solid rgba(139, 92, 246, 0.5)' 
                            : '1px solid rgba(255, 255, 255, 0.1)',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            background: feature.gradient,
                            transform: activeFeature === globalIndex ? 'scaleX(1)' : 'scaleX(0)',
                            transformOrigin: 'left',
                            transition: 'transform 0.5s ease',
                          },
                        }}
                        onMouseEnter={() => setActiveFeature(globalIndex)}
                      >
                        <CardContent sx={{ p: 0 }}>
                          <Box
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: 2,
                              background: feature.gradient,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.5rem',
                              mb: 3,
                              transition: 'transform 0.3s ease',
                              transform: activeFeature === globalIndex ? 'scale(1.1)' : 'scale(1)',
                            }}
                          >
                            {feature.icon}
                          </Box>
                          
                          <Typography variant="h4" sx={{ mb: 2, color: 'text.primary' }}>
                            {feature.title}
                          </Typography>
                          
                          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {feature.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Box>
                );
              })}
            </Box>

            {/* Row 3 */}
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {[features[4], features[5]].map((feature, index) => {
                const globalIndex = index + 4;
                return (
                  <Box key={feature.title} sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
                    <Fade in timeout={1000 + globalIndex * 200}>
                      <Card
                        sx={{
                          height: '100%',
                          p: 3,
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden',
                          background: activeFeature === globalIndex 
                            ? 'rgba(139, 92, 246, 0.15)' 
                            : 'rgba(255, 255, 255, 0.05)',
                          border: activeFeature === globalIndex 
                            ? '1px solid rgba(139, 92, 246, 0.5)' 
                            : '1px solid rgba(255, 255, 255, 0.1)',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            background: feature.gradient,
                            transform: activeFeature === globalIndex ? 'scaleX(1)' : 'scaleX(0)',
                            transformOrigin: 'left',
                            transition: 'transform 0.5s ease',
                          },
                        }}
                        onMouseEnter={() => setActiveFeature(globalIndex)}
                      >
                        <CardContent sx={{ p: 0 }}>
                          <Box
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: 2,
                              background: feature.gradient,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.5rem',
                              mb: 3,
                              transition: 'transform 0.3s ease',
                              transform: activeFeature === globalIndex ? 'scale(1.1)' : 'scale(1)',
                            }}
                          >
                            {feature.icon}
                          </Box>
                          
                          <Typography variant="h4" sx={{ mb: 2, color: 'text.primary' }}>
                            {feature.title}
                          </Typography>
                          
                          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {feature.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Container>

        {/* CTA Section */}
        <Container maxWidth="md" sx={{ py: 10 }}>
          <Fade in timeout={1500}>
            <Card
              sx={{
                p: 6,
                textAlign: 'center',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))',
                  zIndex: 0,
                },
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography
                  variant="h2"
                  sx={{
                    mb: 3,
                    background: 'linear-gradient(135deg, #FFFFFF, #A78BFA)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Ready to Transform Your Content?
                </Typography>
                
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                  Join thousands of content creators who trust Conversify for professional-grade text transformation
                </Typography>
                
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: 6,
                    py: 2,
                    fontSize: '1.2rem',
                    background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #7C3AED, #DB2777)',
                      boxShadow: '0 15px 35px rgba(139, 92, 246, 0.4)',
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  Get Started Free
                </Button>
              </Box>
            </Card>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
}