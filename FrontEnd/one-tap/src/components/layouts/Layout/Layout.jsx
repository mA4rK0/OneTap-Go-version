import { Box } from '@mui/material';

import Footer from '../Footer';
import Header from '../Header';

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
