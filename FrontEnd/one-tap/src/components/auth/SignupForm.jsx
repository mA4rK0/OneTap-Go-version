import { yupResolver } from '@hookform/resolvers/yup';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import * as yup from 'yup';

import { useAuth } from '../../contexts/AuthContext.jsx';

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  confirm: yup.string().oneOf([yup.ref('password')], 'Passwords must match'),
});

export default function SignupForm() {
  const { signup, login, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async ({ name, email, password }) => {
    try {
      await signup({ name, email, password });
      await login(email, password);
      navigate('/dashboard');
    } catch (e) {
      setError('Signup gagal. Coba lagi.');
      return e;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Name"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="Email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="Password"
          type="password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <TextField
          label="Confirm Password"
          type="password"
          {...register('confirm')}
          error={!!errors.confirm}
          helperText={errors.confirm?.message}
        />
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Loading...' : 'Sign Up'}
        </Button>
      </Stack>
    </form>
  );
}
