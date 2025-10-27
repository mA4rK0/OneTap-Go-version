import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { createBrowserRouter, RouterProvider } from 'react-router';

import sidebarLoader from './components/layouts/SidebarLayout/SidebarLayout.loader';

const theme = createTheme({
  typography: {
    fontFamily: ['Roboto', 'sans-serif'].join(','),
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    // loader: sidebarLoader,
    // element: <Dashboard />,
  },
  {
    path: '/dashboard',
    loader: sidebarLoader,
    element: <Dashboard />,
  },
]);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
