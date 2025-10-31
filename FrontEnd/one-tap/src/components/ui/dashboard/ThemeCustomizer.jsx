import { Save } from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { THEME_PRESETS } from '@/utils/constants';

const ColorPicker = ({ label, value, onChange }) => (
  <Box>
    <Typography variant="body2" gutterBottom>
      {label}
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: 60,
          height: 40,
          border: '1px solid #ccc',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      />
      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

const ThemeCustomizer = () => {
  const { profile, updateProfile } = useProfile();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [theme, setTheme] = useState({
    theme_name: 'Default',
    bg_colour: '#ffffff',
    username_colour: '#000000',
    btn_round: 8,
    btn_bg_colour: '#1976d2',
    btn_text_colour: '#ffffff',
    btn_outline_colour: '#1976d2',
    icon_colour: '#000000',
  });

  useEffect(() => {
    if (profile) {
      setTheme({
        theme_name: profile.theme_name || 'Default',
        bg_colour: profile.bg_colour || '#ffffff',
        username_colour: profile.username_colour || '#000000',
        btn_round: parseInt(profile.btn_round) || 8,
        btn_bg_colour: profile.btn_bg_colour || '#1976d2',
        btn_text_colour: profile.btn_text_colour || '#ffffff',
        btn_outline_colour: profile.btn_outline_colour || '#1976d2',
        icon_colour: profile.icon_colour || '#000000',
      });
    }
  }, [profile]);

  const handlePresetChange = (presetName) => {
    const preset = THEME_PRESETS.find((p) => p.name === presetName);
    if (preset) {
      setTheme({
        ...theme,
        theme_name: preset.name,
        bg_colour: preset.backgroundColor,
        username_colour: preset.textColor,
        btn_bg_colour: preset.primaryColor,
        btn_round: preset.buttonBorderRadius,
      });
    }
  };

  const handleSave = async () => {
    if (!profile?.public_id) {
      setError('Please create a profile first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const themeData = {
        ...theme,
        btn_round: theme.btn_round.toString(),
      };

      const result = await updateProfile(profile.public_id, themeData);
      if (result.success) {
        setSuccessMessage('Theme updated successfully!');
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update theme');
    } finally {
      setLoading(false);
    }
  };

  const previewStyles = {
    backgroundColor: theme.bg_colour,
    color: theme.username_colour,
    borderRadius: theme.btn_round,
  };

  const buttonStyles = {
    backgroundColor: theme.btn_bg_colour,
    color: theme.btn_text_colour,
    borderRadius: theme.btn_round,
    border: `2px solid ${theme.btn_outline_colour}`,
  };

  const outlineButtonStyles = {
    color: theme.btn_bg_colour,
    border: `2px solid ${theme.btn_outline_colour}`,
    borderRadius: theme.btn_round,
    backgroundColor: 'transparent',
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Theme Settings
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Theme Preset</InputLabel>
              <Select
                value={theme.theme_name}
                label="Theme Preset"
                onChange={(e) => handlePresetChange(e.target.value)}
              >
                {THEME_PRESETS.map((preset) => (
                  <MenuItem key={preset.name} value={preset.name}>
                    {preset.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <ColorPicker
                  label="Background Color"
                  value={theme.bg_colour}
                  onChange={(color) => setTheme({ ...theme, bg_colour: color })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ColorPicker
                  label="Username Color"
                  value={theme.username_colour}
                  onChange={(color) =>
                    setTheme({ ...theme, username_colour: color })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ColorPicker
                  label="Button Background"
                  value={theme.btn_bg_colour}
                  onChange={(color) =>
                    setTheme({ ...theme, btn_bg_colour: color })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ColorPicker
                  label="Button Text"
                  value={theme.btn_text_colour}
                  onChange={(color) =>
                    setTheme({ ...theme, btn_text_colour: color })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ColorPicker
                  label="Button Outline"
                  value={theme.btn_outline_colour}
                  onChange={(color) =>
                    setTheme({ ...theme, btn_outline_colour: color })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ColorPicker
                  label="Icon Color"
                  value={theme.icon_colour}
                  onChange={(color) =>
                    setTheme({ ...theme, icon_colour: color })
                  }
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography gutterBottom>
                Button Border Radius: {theme.btn_round}px
              </Typography>
              <Slider
                value={theme.btn_round}
                onChange={(e, newValue) =>
                  setTheme({ ...theme, btn_round: newValue })
                }
                min={0}
                max={20}
                step={1}
                valueLabelDisplay="auto"
              />
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {successMessage && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {successMessage}
              </Alert>
            )}

            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <Save />}
              onClick={handleSave}
              disabled={loading}
              sx={{ mt: 2 }}
              fullWidth
            >
              {loading ? 'Saving...' : 'Save Theme'}
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Live Preview
            </Typography>

            <Paper
              sx={{
                p: 3,
                ...previewStyles,
                minHeight: 400,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  border: `3px solid ${theme.btn_bg_colour}`,
                }}
                src={profile?.avatar}
              >
                {user?.name?.charAt(0)}
              </Avatar>

              <Typography
                variant="h4"
                sx={{
                  color: theme.username_colour,
                  fontWeight: 'bold',
                }}
              >
                {profile?.username || 'yourusername'}
              </Typography>

              {profile?.category && (
                <Chip
                  label={profile.category}
                  sx={{
                    backgroundColor: theme.btn_bg_colour,
                    color: theme.btn_text_colour,
                  }}
                />
              )}

              <Box sx={{ width: '100%', mt: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.username_colour,
                    opacity: 0.8,
                    textAlign: 'center',
                    mb: 2,
                  }}
                >
                  This is how your profile will look to visitors
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button variant="contained" sx={buttonStyles} fullWidth>
                    Follow on Instagram
                  </Button>

                  <Button variant="outlined" sx={outlineButtonStyles} fullWidth>
                    Visit My Website
                  </Button>

                  <Button variant="contained" sx={buttonStyles} fullWidth>
                    Subscribe on YouTube
                  </Button>
                </Box>
              </Box>
            </Paper>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Preview includes:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Profile background color
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Username and text colors
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Button styles and colors
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Border radius effects
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ThemeCustomizer;
