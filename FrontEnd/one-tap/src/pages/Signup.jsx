import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import SignupForm from '../components/auth/SignupForm.jsx';

export default function Signup() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Sign Up</Typography>
      <SignupForm />
    </Stack>
  );
}
