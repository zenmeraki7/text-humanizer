import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useScrollTrigger,
  Slide,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (item) => {
    const routes = {
      'Home': '/',
      'Humanizer': '/humanize',
      'Detector': '/detector',
      'Plagiarism': '/plagiarism',
      'Pricing': '/pricing',
      'Settings': '/settings',
      'Tone': '/tone'
    };
    
    if (routes[item]) {
      navigate(routes[item]);
    }
    
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const navItems = ['Home', 'Humanizer', 'Detector', 'Plagiarism', 'Pricing', 'Settings', 'Tone'];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            background: scrolled 
              ? 'rgba(15, 15, 35, 0.95)' 
              : 'rgba(15, 15, 35, 0.8)',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                  width: 40,
                  height: 40,
                  fontWeight: 'bold',
                }}
              >
                C
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #FFFFFF, #A78BFA)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Conversify
              </Typography>
            </Box>

            {!isMobile ? (
              <Box sx={{ display: 'flex', gap: 3 }}>
                {navItems.map((item) => (
                  <Button
                    key={item}
                    color="inherit"
                    onClick={() => handleNavigation(item)}
                    sx={{
                      position: 'relative',
                      cursor: 'pointer',
                      '&:hover': {
                        color: '#A78BFA',
                        transform: 'translateY(-1px)',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        width: 0,
                        height: 2,
                        background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                        transition: 'all 0.3s ease',
                        transform: 'translateX(-50%)',
                      },
                      '&:hover::after': {
                        width: '100%',
                      },
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </Box>
            ) : (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            background: 'rgba(15, 15, 35, 0.95)',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <IconButton onClick={handleDrawerToggle} sx={{ mb: 2 }}>
            <CloseIcon />
          </IconButton>
          <List>
            {navItems.map((item) => (
              <ListItem 
  button 
  key={item}
  onClick={() => handleNavigation(item)}
  sx={{
    '&:hover': {
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
    },
    '& .MuiListItemText-primary': {
      color: '#fff',
      fontWeight: 500,
    },
  }}
>
  <ListItemText primary={item} />
</ListItem>

            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}