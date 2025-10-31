import {
  Box,
  Container,
  Divider,
  Link,
  Typography,
  useTheme,
} from '@mui/material';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.background.paper,
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.secondary,
      }}
    >
      <Container maxWidth="lg">
        <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} OneTap. All rights reserved.
          </Typography>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              href="#"
              variant="body2"
              underline="hover"
              sx={{
                color: 'inherit',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              variant="body2"
              underline="hover"
              sx={{
                color: 'inherit',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              variant="body2"
              underline="hover"
              sx={{
                color: 'inherit',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              Contact
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
