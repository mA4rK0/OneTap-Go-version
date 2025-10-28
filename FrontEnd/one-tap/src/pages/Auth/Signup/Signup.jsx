import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, Link, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/ui/FormFields';
import { LoadingButton } from '@/components/ui/LoadingButton';
import { useAuth } from '@/hooks/useAuth';
import { signupFormSchema } from '@/utils/validators';

const Signup = () => {
  const { signup } = useAuth();
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupFormSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');

    const result = await signup(data);
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
        name="name"
        label="Full Name"
        autoComplete="name"
        required
      />

      <FormInput
        register={register}
        errors={errors}
        name="email"
        label="Email Address"
        type="email"
        autoComplete="email"
        required
        sx={{ mt: 2 }}
      />

      <FormInput
        register={register}
        errors={errors}
        name="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        required
        sx={{ mt: 2 }}
      />

      <FormInput
        register={register}
        errors={errors}
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        autoComplete="new-password"
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
        Sign Up
      </LoadingButton>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link href="/login" variant="body2">
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Signup;
