import {
  AccountCircle,
  Brightness4,
  Brightness7,
  Dashboard,
  Logout,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useTheme as useAppTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { mode, toggleColorMode } = useAppTheme();
  const location = useLocation();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: theme.palette.background.default,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        <Typography
          variant="h4"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #7b61ff, #00f0ff)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          OneTap
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={toggleColorMode}
            aria-label="toggle theme"
            sx={{
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(123, 97, 255, 0.1)'
                    : 'rgba(123, 97, 255, 0.05)',
              },
            }}
          >
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {isAuthenticated ? (
            <>
              <Button
                component={Link}
                to="/dashboard"
                variant={isActive('/dashboard') ? 'contained' : 'outlined'}
                startIcon={<Dashboard />}
                sx={{
                  color: isActive('/dashboard')
                    ? theme.palette.mode === 'dark'
                      ? '#000'
                      : '#fff'
                    : theme.palette.text.primary,
                }}
              >
                Dashboard
              </Button>

              <IconButton
                onClick={handleMenu}
                aria-label="account menu"
                sx={{
                  color: theme.palette.text.primary,
                  '&:hover': {
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(123, 97, 255, 0.1)'
                        : 'rgba(123, 97, 255, 0.05)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    background: 'linear-gradient(135deg, #7b61ff, #00f0ff)',
                    color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                    fontWeight: 'bold',
                  }}
                  src={user?.avatar}
                  alt={user?.name}
                >
                  {user?.name?.charAt(0)?.toUpperCase()}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                  '& .MuiPaper-root': {
                    minWidth: 160,
                  },
                }}
              >
                <MenuItem
                  onClick={handleClose}
                  sx={{ color: theme.palette.text.primary }}
                >
                  <AccountCircle sx={{ mr: 2 }} />
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{ color: theme.palette.text.primary }}
                >
                  <Logout sx={{ mr: 2 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                component={Link}
                to="/login"
                variant={isActive('/login') ? 'contained' : 'outlined'}
                sx={{
                  color: isActive('/login')
                    ? theme.palette.mode === 'dark'
                      ? '#000'
                      : '#fff'
                    : theme.palette.text.primary,
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant={isActive('/signup') ? 'contained' : 'outlined'}
                sx={{
                  color: isActive('/signup')
                    ? theme.palette.mode === 'dark'
                      ? '#000'
                      : '#fff'
                    : theme.palette.text.primary,
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
