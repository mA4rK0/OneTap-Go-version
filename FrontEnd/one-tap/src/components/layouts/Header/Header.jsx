import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  AccountCircle,
  Logout,
  Dashboard,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useTheme as useAppTheme } from '@/contexts/ThemeContext';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { mode, toggleColorMode } = useAppTheme();
  const location = useLocation();

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
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
          }}
        >
          OneTap
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={toggleColorMode}
            color="inherit"
            aria-label="toggle theme"
          >
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {isAuthenticated ? (
            <>
              <Button
                component={Link}
                to="/dashboard"
                color="inherit"
                variant={isActive('/dashboard') ? 'outlined' : 'text'}
                startIcon={<Dashboard />}
              >
                Dashboard
              </Button>

              <IconButton
                onClick={handleMenu}
                color="inherit"
                aria-label="account menu"
              >
                <Avatar
                  sx={{ width: 32, height: 32 }}
                  src={user?.avatar}
                  alt={user?.name}
                >
                  {user?.name?.charAt(0)}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                  elevation: 3,
                  mt: 1.5,
                  minWidth: 160,
                }}
              >
                <MenuItem onClick={handleClose}>
                  <AccountCircle sx={{ mr: 2 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
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
                color="inherit"
                variant={isActive('/login') ? 'outlined' : 'text'}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                color="inherit"
                variant={isActive('/signup') ? 'contained' : 'outlined'}
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
