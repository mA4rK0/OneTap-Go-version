import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Box component="footer" sx={{ py: 4, textAlign: 'center', opacity: 0.7 }}>
      <Typography variant="body2">
        © {new Date().getFullYear()} OneTap
      </Typography>
    </Box>
  );
}
