import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from '@mui/material/styles';
import { createContext, useContext, useMemo, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'dark');
  const [customTheme, setCustomTheme] = useState(() => {
    const saved = localStorage.getItem('customTheme');
    return saved ? JSON.parse(saved) : null;
  });

  const toggleColorMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const updateCustomTheme = (themeConfig) => {
    setCustomTheme(themeConfig);
    localStorage.setItem('customTheme', JSON.stringify(themeConfig));
  };

  const theme = useMemo(() => {
    const darkColors = {
      background: '#0a0a0a',
      surface: '#111111',
      card: '#1a1a1a',
      primary: '#7b61ff',
      accent: '#00f0ff',
      text: '#ffffff',
      textSecondary: 'rgba(255,255,255,0.7)',
      border: 'rgba(255,255,255,0.1)',
    };

    const lightColors = {
      background: '#f8faff',
      surface: '#ffffff',
      card: '#f0f2ff',
      primary: '#7b61ff',
      accent: '#0066ff',
      text: '#1a1a1a',
      textSecondary: 'rgba(26,26,26,0.7)',
      border: 'rgba(0,0,0,0.1)',
    };

    const colors = mode === 'light' ? lightColors : darkColors;

    const baseTheme = createTheme({
      palette: {
        mode,
        primary: {
          main: customTheme?.primaryColor || colors.primary,
          light: customTheme?.primaryLight || '#9d8aff',
          dark: customTheme?.primaryDark || '#5a4acc',
        },
        secondary: {
          main: colors.accent,
        },
        background: {
          default: customTheme?.backgroundColor || colors.background,
          paper: customTheme?.cardColor || colors.card,
        },
        text: {
          primary: customTheme?.textColor || colors.text,
          secondary: colors.textSecondary,
        },
        divider: colors.border,
      },
      typography: {
        fontFamily:
          '"Space Grotesk", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          fontWeight: 700,
          letterSpacing: '-0.02em',
        },
        h2: {
          fontWeight: 700,
          letterSpacing: '-0.02em',
        },
        h3: {
          fontWeight: 600,
          letterSpacing: '-0.01em',
        },
        h4: {
          fontWeight: 600,
        },
        button: {
          fontWeight: 600,
          textTransform: 'none',
        },
      },
      shape: {
        borderRadius: customTheme?.borderRadius || 16,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: customTheme?.buttonBorderRadius || 12,
              fontWeight: 600,
              padding: '12px 24px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'left 0.5s',
              },
              '&:hover::before': {
                left: '100%',
              },
            },
            contained: {
              background: `linear-gradient(135deg, ${customTheme?.primaryColor || colors.primary}, ${colors.accent})`,
              color: mode === 'dark' ? '#000' : '#fff',
              boxShadow: '0 8px 32px rgba(123, 97, 255, 0.3)',
              '&:hover': {
                boxShadow: '0 12px 40px rgba(123, 97, 255, 0.4)',
                transform: 'translateY(-2px)',
              },
            },
            outlined: {
              borderWidth: '2px',
              borderColor: colors.border,
              color: colors.text,
              backdropFilter: 'blur(10px)',
              background:
                mode === 'dark'
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(255,255,255,0.8)',
              '&:hover': {
                borderColor: colors.primary,
                backgroundColor:
                  mode === 'dark'
                    ? 'rgba(123, 97, 255, 0.1)'
                    : 'rgba(123, 97, 255, 0.05)',
              },
            },
            text: {
              color: colors.text,
              '&:hover': {
                backgroundColor:
                  mode === 'dark'
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.05)',
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              backdropFilter: 'blur(20px)',
              background:
                mode === 'dark'
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(255,255,255,0.8)',
              border: `1px solid ${colors.border}`,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
              },
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backdropFilter: 'blur(20px)',
              background:
                mode === 'dark'
                  ? 'rgba(10,10,10,0.8)'
                  : 'rgba(248,250,255,0.8)',
              borderBottom: `1px solid ${colors.border}`,
              color: colors.text,
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backdropFilter: 'blur(20px)',
              background:
                mode === 'dark'
                  ? 'rgba(255,255,255,0.02)'
                  : 'rgba(255,255,255,0.8)',
            },
          },
        },
        MuiMenu: {
          styleOverrides: {
            paper: {
              backdropFilter: 'blur(20px)',
              background:
                mode === 'dark'
                  ? 'rgba(26,26,26,0.9)'
                  : 'rgba(255,255,255,0.9)',
              border: `1px solid ${colors.border}`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            },
          },
        },
        MuiDivider: {
          styleOverrides: {
            root: {
              borderColor: colors.border,
            },
          },
        },
        MuiLink: {
          styleOverrides: {
            root: {
              color: colors.textSecondary,
              '&:hover': {
                color: colors.primary,
              },
            },
          },
        },
      },
    });

    return baseTheme;
  }, [mode, customTheme]);

  const value = {
    mode,
    customTheme,
    toggleColorMode,
    updateCustomTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
    </ThemeContext.Provider>
  );
};
