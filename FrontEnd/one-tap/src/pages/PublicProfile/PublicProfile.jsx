import {
  Facebook,
  GitHub,
  Instagram,
  Language,
  LinkedIn,
  OpenInNew,
  Twitter,
  YouTube,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import bio from '@/services/api/bio';

import { customLinkSchema } from '@/utils/validators';
import { profileFormSchema } from '@/utils/validators';
import { socialLinkSchema } from '@/utils/validators';

const platformIcons = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: YouTube,
  facebook: Facebook,
  linkedin: LinkedIn,
  github: GitHub,
  website: Language,
};

const PublicProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [socialLinks, setSocialLinks] = useState({ top: [], bottom: [] });
  const [customLinks, setCustomLinks] = useState([]);
  const [getBio, setGetBio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        setError('');

        // Find profile by username
        // Note: This assumes you have an endpoint to get profile by username
        // You might need to adjust this based on your actual API
        const profileResponse =
          await profileFormSchema.getProfileByUsername(username);
        if (!profileResponse.success) {
          setError('Profile not found');
          return;
        }

        const profileData = profileResponse.data;
        setProfile(profileData);

        const socialResponse = await socialLinkSchema.getSocialLinks(
          profileData.public_id,
        );
        if (socialResponse.success) {
          const links = socialResponse.data.social_links || [];
          setSocialLinks({
            top: links.filter((link) => link.position === 'top' && link.active),
            bottom: links.filter(
              (link) => link.position === 'bottom' && link.active,
            ),
          });
        }

        const customResponse = await customLinkSchema.getCustomLinks(
          profileData.public_id,
        );
        if (customResponse.success) {
          setCustomLinks(
            customResponse.data.links?.filter((link) => link.active) || [],
          );
        }

        const bioResponse = await bio.getBio(profileData.public_id);
        if (bioResponse.success && bioResponse.data.active) {
          setGetBio(bioResponse.data);
        }
      } catch (err) {
        setError('Failed to load profile');
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      loadProfileData();
    }
  }, [username]);

  const getPlatformIcon = (platform) => {
    const IconComponent = platformIcons[platform] || Language;
    return <IconComponent />;
  };

  const handleLinkClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ textAlign: 'center' }}>
          {error || 'Profile not found'}
        </Alert>
      </Container>
    );
  }

  const themeStyles = {
    backgroundColor: profile.bg_colour || '#ffffff',
    color: profile.username_colour || '#000000',
  };

  const buttonStyles = {
    backgroundColor: profile.btn_bg_colour || '#1976d2',
    color: profile.btn_text_colour || '#ffffff',
    borderRadius: `${parseInt(profile.btn_round) || 8}px`,
    border: `2px solid ${profile.btn_outline_colour || profile.btn_bg_colour || '#1976d2'}`,
    '&:hover': {
      backgroundColor: profile.btn_bg_colour || '#1976d2',
      opacity: 0.9,
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        ...themeStyles,
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            textAlign: 'center',
            mb: 4,
          }}
        >
          <Avatar
            src={profile.avatar}
            alt={profile.username}
            sx={{
              width: 120,
              height: 120,
              mx: 'auto',
              mb: 3,
              border: `4px solid ${profile.btn_bg_colour || '#1976d2'}`,
            }}
          />

          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: themeStyles.color,
            }}
          >
            {profile.username}
          </Typography>

          {profile.category && (
            <Chip
              label={profile.category}
              sx={{
                backgroundColor: profile.btn_bg_colour || '#1976d2',
                color: profile.btn_text_colour || '#ffffff',
                mb: 2,
              }}
            />
          )}

          {getBio && (
            <Typography
              variant="body1"
              sx={{
                mt: 2,
                color: themeStyles.color,
                opacity: 0.8,
                lineHeight: 1.6,
              }}
            >
              {getBio.description}
            </Typography>
          )}
        </Box>

        {socialLinks.top.length > 0 && (
          <Box sx={{ mb: 3 }}>
            {socialLinks.top.map((link) => {
              const IconComponent = getPlatformIcon(link.icon);
              return (
                <Button
                  key={link.public_id}
                  fullWidth
                  variant="contained"
                  startIcon={IconComponent}
                  endIcon={<OpenInNew />}
                  onClick={() => handleLinkClick(link.url)}
                  sx={{
                    ...buttonStyles,
                    mb: 1,
                  }}
                >
                  {link.icon.charAt(0).toUpperCase() + link.icon.slice(1)}
                </Button>
              );
            })}
          </Box>
        )}

        {customLinks.length > 0 && (
          <Box sx={{ mb: 3 }}>
            {customLinks.map((link) => (
              <Paper
                key={link.public_id}
                elevation={1}
                sx={{
                  p: 2,
                  mb: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                  },
                }}
                onClick={() => handleLinkClick(link.url)}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {getDomainFromUrl(link.url)}
                    </Typography>
                    {link.tag_line && (
                      <Typography variant="body2" color="text.secondary">
                        {link.tag_line}
                      </Typography>
                    )}
                  </Box>
                  <OpenInNew fontSize="small" />
                </Box>
              </Paper>
            ))}
          </Box>
        )}

        {socialLinks.bottom.length > 0 && (
          <Box>
            {socialLinks.bottom.map((link) => {
              const IconComponent = getPlatformIcon(link.icon);
              return (
                <Button
                  key={link.public_id}
                  fullWidth
                  variant="outlined"
                  startIcon={IconComponent}
                  endIcon={<OpenInNew />}
                  onClick={() => handleLinkClick(link.url)}
                  sx={{
                    ...buttonStyles,
                    backgroundColor: 'transparent',
                    color: buttonStyles.backgroundColor,
                    mb: 1,
                  }}
                >
                  {link.icon.charAt(0).toUpperCase() + link.icon.slice(1)}
                </Button>
              );
            })}
          </Box>
        )}
      </Container>
    </Box>
  );
};

const getDomainFromUrl = (url) => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch (err) {
    console.error(err);
    return url;
  }
};

export default PublicProfile;
