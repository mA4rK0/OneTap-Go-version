import {
  Link as LinkIcon,
  Palette,
  RocketLaunch,
  Share,
  Smartphone,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';

const FeatureCard = ({ icon, title, description, index }) => {
  const theme = useTheme();

  return (
    <Card
      className="fade-in"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background:
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(123, 97, 255, 0.3)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
        },
        transition: 'all 0.3s ease',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #7b61ff, #00f0ff)',
        }}
      />
      <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            justifyContent: 'center',
            '& .MuiSvgIcon-root': {
              fontSize: 48,
              background: 'linear-gradient(135deg, #7b61ff, #00f0ff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            },
          }}
        >
          {icon}
        </Box>
        <Typography
          gutterBottom
          variant="h5"
          component="h3"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 2,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ lineHeight: 1.6 }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const StatItem = ({ value, label }) => {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          background: 'linear-gradient(135deg, #7b61ff, #00f0ff)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1,
        }}
      >
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
};

const Home = () => {
  const { isAuthenticated } = useAuth();
  const theme = useTheme();

  const features = [
    {
      icon: <LinkIcon />,
      title: 'Multiple Links',
      description:
        'Share all your important links in one beautiful, customizable page.',
    },
    {
      icon: <Palette />,
      title: 'Custom Themes',
      description: 'Choose from beautiful themes that matches your brand.',
    },
    {
      icon: <Share />,
      title: 'Easy Sharing',
      description:
        'Share your unique link everywhere - social media, emails, business cards, and more.',
    },
    {
      icon: <Smartphone />,
      title: 'Mobile Friendly',
      description:
        'Perfectly optimized for all devices. Your links will look great on any screen size.',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '50M+', label: 'Links Created' },
    { value: '99.9%', label: 'Uptime' },
    { value: '200+', label: 'Countries' },
  ];

  const backgroundGradient =
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)'
      : 'linear-gradient(135deg, #f8faff 0%, #e8ecff 50%, #f8faff 100%)';

  return (
    <Box
      sx={{
        background: backgroundGradient,
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            theme.palette.mode === 'dark'
              ? `
              radial-gradient(circle at 20% 80%, rgba(123, 97, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(0, 240, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(123, 97, 255, 0.05) 0%, transparent 50%)
            `
              : `
              radial-gradient(circle at 20% 80%, rgba(123, 97, 255, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(0, 102, 255, 0.05) 0%, transparent 50%)
            `,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        <Box
          sx={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            py: 8,
          }}
        >
          <Box sx={{ width: '100%' }}>
            <Typography
              component="h1"
              variant="h2"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.2,
              }}
            >
              Your Links,
              <Box
                component="span"
                sx={{
                  display: 'block',
                  background: 'linear-gradient(135deg, #7b61ff, #00f0ff)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                One Tap Away
              </Box>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mb: 6,
                color: 'text.secondary',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Create a beautiful landing page for all your important links.
              Perfect for social media, content creators, and professionals.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 3,
                justifyContent: 'center',
                flexWrap: 'wrap',
                mb: 8,
              }}
            >
              {isAuthenticated ? (
                <Button
                  component={Link}
                  to="/dashboard"
                  variant="contained"
                  size="large"
                  startIcon={<RocketLaunch />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                  }}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/signup"
                    variant="contained"
                    size="large"
                    startIcon={<RocketLaunch />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                    }}
                  >
                    Get Started Free
                  </Button>
                  <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                    }}
                  >
                    Sign In
                  </Button>
                </>
              )}
            </Box>

            <Box sx={{ mt: 8 }}>
              <Grid
                container
                spacing={4}
                justifyContent="center"
                alignItems="center"
              >
                {stats.map((stat, index) => (
                  <Grid
                    item
                    key={index}
                    xs={6}
                    sm={3}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <StatItem {...stat} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>

        <Box sx={{ py: 12 }}>
          <Typography
            component="h2"
            variant="h3"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 2,
              color: 'text.primary',
            }}
          >
            Why Choose OneTap?
          </Typography>

          <Typography
            variant="h6"
            align="center"
            sx={{
              mb: 8,
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Everything you need to share your links in one beautiful page
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {features.map((feature, index) => (
              <Grid
                item
                key={index}
                xs={12}
                md={6}
                lg={4}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Box sx={{ width: '100%', maxWidth: 400 }}>
                  <FeatureCard {...feature} index={index} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box
          sx={{
            background: `linear-gradient(135deg, ${alpha('#7b61ff', 0.1)}, ${alpha('#00f0ff', 0.1)})`,
            borderRadius: 4,
            py: 8,
            px: 4,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            mb: 8,
            border: `1px solid ${theme.palette.divider}`,
            maxWidth: 800,
            mx: 'auto',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #7b61ff, #00f0ff)',
            }}
          />

          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              position: 'relative',
              zIndex: 1,
              color: 'text.primary',
              mb: 2,
            }}
          >
            Ready to Get Started?
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 4,
              color: 'text.secondary',
              position: 'relative',
              zIndex: 1,
            }}
          >
            Join thousands of users who are sharing their links with OneTap
          </Typography>

          <Button
            component={Link}
            to={isAuthenticated ? '/dashboard' : '/signup'}
            variant="contained"
            size="large"
            sx={{
              position: 'relative',
              zIndex: 1,
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
            }}
          >
            {isAuthenticated ? 'Manage Your Links' : 'Create Your Page Now'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
