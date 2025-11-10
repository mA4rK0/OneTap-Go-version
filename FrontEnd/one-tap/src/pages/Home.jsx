import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router';

export default function Home() {
  return (
    <Stack spacing={2} alignItems="center">
      <Typography variant="h3" textAlign="center">
        Build your link-in-bio
      </Typography>
      <Typography textAlign="center">
        Create a beautiful public profile with your links.
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button component={Link} to="/login" variant="contained">
          Login
        </Button>
        <Button component={Link} to="/signup" variant="outlined">
          Sign Up
        </Button>
      </Stack>
    </Stack>
  );
}
