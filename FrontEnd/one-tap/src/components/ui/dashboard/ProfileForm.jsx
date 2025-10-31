import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useDebounce } from '@/hooks/useDebounce';
import { useProfile } from '@/hooks/useProfile';
import { CATEGORIES } from '@/utils/constants';
import { profileFormSchema } from '@/utils/validators';

const ProfileForm = () => {
  const { profile, loading, createProfile, updateProfile, checkUsername } =
    useProfile();
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(profileFormSchema),
  });

  const username = watch('username');
  const debouncedUsername = useDebounce(username, 500);

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (debouncedUsername && debouncedUsername.length >= 3) {
        setCheckingUsername(true);
        const result = await checkUsername(debouncedUsername);
        setUsernameAvailable(result.available);
        setCheckingUsername(false);
      }
    };

    checkUsernameAvailability();
  }, [debouncedUsername, checkUsername]);

  useEffect(() => {
    if (profile) {
      reset({
        username: profile.username || '',
        category: profile.category || '',
        avatar: profile.avatar || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data) => {
    setSubmitError('');
    setSuccessMessage('');

    try {
      let result;
      if (profile) {
        result = await updateProfile(profile.public_id, data);
      } else {
        result = await createProfile(data);
      }

      if (result.success) {
        setSuccessMessage(
          profile
            ? 'Profile updated successfully!'
            : 'Profile created successfully!',
        );
      } else {
        setSubmitError(result.error);
      }
    } catch (err) {
      console.error(err);
      setSubmitError('An unexpected error occurred');
    }
  };

  if (loading && !profile) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={200}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Profile Settings
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            <Grid>
              <TextField
                fullWidth
                required
                id="username"
                label="Username"
                {...register('username')}
                error={!!errors.username || usernameAvailable === false}
                helperText={
                  errors.username?.message ||
                  (checkingUsername
                    ? 'Checking availability...'
                    : usernameAvailable === false
                      ? 'Username is not available'
                      : usernameAvailable === true
                        ? 'Username is available'
                        : '')
                }
                inputProps={{
                  endAdornment: checkingUsername ? (
                    <CircularProgress size={20} />
                  ) : null,
                }}
              />
            </Grid>

            <Grid>
              <TextField
                fullWidth
                required
                select
                id="category"
                label="Category"
                {...register('category')}
                error={!!errors.category}
                helperText={errors.category?.message}
              >
                {CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid>
              <TextField
                fullWidth
                id="avatar"
                label="Avatar URL"
                {...register('avatar')}
                error={!!errors.avatar}
                helperText={
                  errors.avatar?.message ||
                  'Enter a URL for your profile picture'
                }
              />
            </Grid>
          </Grid>

          {submitError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {submitError}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {successMessage}
            </Alert>
          )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={!isDirty || loading || usernameAvailable === false}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : profile ? (
                'Update Profile'
              ) : (
                'Create Profile'
              )}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
