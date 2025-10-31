import { ContentCopy, Share } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Snackbar,
  Typography,
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

import { useAuth } from '@/hooks/useAuth';

const LinkPreview = () => {
  const { profile } = useAuth();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  if (!profile) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" color="text.secondary">
            Create your profile to get your shareable link
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const profileUrl = `${window.location.origin}/${profile.username}`;
  const qrCodeUrl = `${window.location.origin}/${profile.username}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setSnackbarMessage('Profile link copied to clipboard!');
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
      setSnackbarMessage('Failed to copy link');
      setSnackbarOpen(true);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out ${profile.username}'s links`,
          text: `Visit ${profile.username}'s profile`,
          url: profileUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Share Your Profile
        </Typography>

        <Grid container spacing={3} alignItems="center">
          <Grid>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Your Profile URL:
              </Typography>
              <Box
                sx={{
                  p: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  backgroundColor: 'background.default',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  wordBreak: 'break-all',
                }}
              >
                {profileUrl}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<ContentCopy />}
                onClick={handleCopyLink}
                size="small"
              >
                Copy Link
              </Button>

              <Button
                variant="outlined"
                startIcon={<Share />}
                onClick={handleShare}
                size="small"
              >
                Share
              </Button>
            </Box>

            <Alert severity="info" sx={{ mt: 2 }}>
              Share this link on social media, in your bio, or anywhere you want
              people to find all your links!
            </Alert>
          </Grid>

          <Grid>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                QR Code
              </Typography>
              <Box
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  display: 'inline-block',
                  backgroundColor: 'white',
                }}
              >
                <QRCodeSVG value={qrCodeUrl} size={128} level="M" />
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: 'block' }}
              >
                Scan to visit your profile
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: 'success.light',
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: 'success.contrastText' }}>
            <strong>Pro Tip:</strong> Add your profile link to your social media
            bios, email signatures, and business cards to drive traffic to all
            your content from one place!
          </Typography>
        </Box>
      </CardContent>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Card>
  );
};

export default LinkPreview;
