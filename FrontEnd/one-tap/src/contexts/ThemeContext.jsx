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
  const [mode, setMode] = useState(
    localStorage.getItem('themeMode') || 'light',
  );
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
    const baseTheme = createTheme({
      palette: {
        mode,
        primary: {
          main: customTheme?.primaryColor || '#1976d2',
        },
        background: {
          default:
            customTheme?.backgroundColor ||
            (mode === 'light' ? '#ffffff' : '#121212'),
          paper: mode === 'light' ? '#f5f5f5' : '#1e1e1e',
        },
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      shape: {
        borderRadius: customTheme?.borderRadius || 2,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: customTheme?.buttonBorderRadius || 8,
            },
          },
        },
      },
    });

    if (customTheme) {
      return createTheme({
        ...baseTheme,
        palette: {
          ...baseTheme.palette,
          primary: {
            main: customTheme.primaryColor,
          },
          background: {
            default: customTheme.backgroundColor,
            paper: customTheme.cardColor || baseTheme.palette.background.paper,
          },
          text: {
            primary: customTheme.textColor,
          },
        },
      });
    }

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
