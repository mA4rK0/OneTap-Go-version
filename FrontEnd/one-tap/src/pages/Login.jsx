import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import LoginForm from '../components/auth/LoginForm.jsx';

export default function Login() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Login</Typography>
      <LoginForm />
    </Stack>
  );
}
