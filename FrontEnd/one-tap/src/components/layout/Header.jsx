import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link, useLocation } from 'react-router';

import { useThemeMode } from '../../contexts/ThemeContext.jsx';
import ThemeToggle from '../ui/ThemeToggle.jsx';

export default function Header() {
  const { toggleColorMode } = useThemeMode();
  const { pathname } = useLocation();
  return (
    <AppBar position="sticky">
      <Toolbar
        sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}
      >
        <Typography variant="h6">OneTap</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <ThemeToggle onClick={toggleColorMode} />
          {pathname !== '/login' && (
            <Button component={Link} to="/login" color="inherit">
              Login
            </Button>
          )}
          {pathname !== '/signup' && (
            <Button component={Link} to="/signup" color="inherit">
              Sign Up
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
