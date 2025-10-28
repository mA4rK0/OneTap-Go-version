import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, Link, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/ui/FormFields';
import { LoadingButton } from '@/components/ui/LoadingButton';
import { useAuth } from '@/hooks/useAuth';
import { loginFormSchema } from '@/utils/validators';

const Login = () => {
  const { login } = useAuth();
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginFormSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');

    const result = await login(data.email, data.password);
    if (!result.success) {
      setSubmitError(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormInput
        register={register}
        errors={errors}
        name="email"
        label="Email Address"
        type="email"
        autoComplete="email"
        required
      />

      <FormInput
        register={register}
        errors={errors}
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        required
        sx={{ mt: 2 }}
      />

      {submitError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {submitError}
        </Alert>
      )}

      <LoadingButton
        type="submit"
        loading={isSubmitting}
        variant="contained"
        fullWidth
        sx={{ mt: 3, mb: 2 }}
        size="large"
      >
        Sign In
      </LoadingButton>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Don&apos;t have an account?&nbsp;
          <Link href="/signup" variant="body2">
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
