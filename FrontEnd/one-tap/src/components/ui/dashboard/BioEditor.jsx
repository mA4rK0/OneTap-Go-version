import { yupResolver } from '@hookform/resolvers/yup';
import { Save as SaveIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControlLabel,
  Grid,
  Paper,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/hooks/useAuth';
import { useBio } from '@/hooks/useBio';
import { bioSchema } from '@/utils/validators';

const BioEditor = () => {
  const { profile } = useAuth();
  const { loading, createBio, updateBio, getBio } = useBio();
  const [bio, setBio] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(bioSchema),
    defaultValues: {
      description: '',
      active: true,
    },
  });

  const description = watch('description', '');
  const wordCount = description
    ? description
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length
    : 0;
  const isOverLimit = wordCount > 35;

  useEffect(() => {
    if (profile?.public_id) {
      loadBio();
    }
  }, [profile]);

  const loadBio = async () => {
    if (profile?.public_id) {
      const result = await getBio(profile.public_id);
      if (result.success) {
        setBio(result.data);
        reset({
          description: result.data.description || '',
          active: result.data.active !== undefined ? result.data.active : true,
        });
      }
    }
  };

  const onSubmit = async (data) => {
    if (!profile?.public_id) {
      setSubmitError('Please create a profile first');
      return;
    }

    if (isOverLimit) {
      setSubmitError('Bio must be 35 words or less');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSuccessMessage('');

    try {
      let result;
      if (bio) {
        result = await updateBio(profile.public_id, data);
      } else {
        result = await createBio(profile.public_id, data);
      }

      if (result.success) {
        setSuccessMessage(
          bio ? 'Bio updated successfully!' : 'Bio created successfully!',
        );
        setBio(result.data);
      } else {
        setSubmitError(result.error);
      }
    } catch (err) {
      console.error(err);
      setSubmitError('Failed to save bio');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Bio Editor
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                fullWidth
                multiline
                rows={4}
                id="description"
                label="Bio Description"
                placeholder="Tell people about yourself in 35 words or less..."
                {...register('description')}
                error={!!errors.description || isOverLimit}
                helperText={
                  errors.description?.message ||
                  `${wordCount}/35 words ${isOverLimit ? ' - Too many words!' : ''}`
                }
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={<Switch defaultChecked {...register('active')} />}
                label="Show bio on your profile"
                sx={{ mb: 2 }}
              />

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

              <Button
                type="submit"
                variant="contained"
                startIcon={
                  isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />
                }
                disabled={
                  isSubmitting || loading || (!isDirty && bio) || isOverLimit
                }
                sx={{ mt: 2 }}
              >
                {isSubmitting ? 'Saving...' : bio ? 'Update Bio' : 'Create Bio'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Bio Preview
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                minHeight: 120,
                backgroundColor: 'background.default',
              }}
            >
              {description ? (
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {description}
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontStyle="italic"
                >
                  Your bio will appear here...
                </Typography>
              )}

              {!watch('active') && (
                <Typography
                  variant="caption"
                  color="warning.main"
                  sx={{ mt: 1, display: 'block' }}
                >
                  ⚠️ Bio is currently hidden from your public profile
                </Typography>
              )}
            </Paper>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Tips:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                • Keep it concise (max 35 words)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Describe who you are and what you do
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Include your interests or mission
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Make it personal and engaging
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default BioEditor;
