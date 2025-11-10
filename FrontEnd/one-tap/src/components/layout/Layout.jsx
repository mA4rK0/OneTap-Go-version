import Container from '@mui/material/Container';

import Footer from './Footer.jsx';
import Header from './Header.jsx';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <Container sx={{ my: 4 }} maxWidth="md">
        {children}
      </Container>
      <Footer />
    </>
  );
}
