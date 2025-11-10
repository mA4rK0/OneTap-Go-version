import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function PublicProfile({
  profile,
  linksTop = [],
  linksBottom = [],
  customLinks = [],
  bio,
}) {
  return (
    <Stack spacing={2} alignItems="center">
      {profile?.avatar && (
        <img
          src={profile.avatar}
          alt="avatar"
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            objectFit: 'cover',
          }}
        />
      )}
      <Typography
        variant="h5"
        sx={{ color: profile?.username_colour || 'inherit' }}
      >
        @{profile?.username}
      </Typography>
      {bio?.active && (
        <Typography variant="body2">{bio?.description}</Typography>
      )}
      <Stack spacing={1} sx={{ width: '100%', maxWidth: 420 }}>
        {[...linksTop, ...customLinks, ...linksBottom].map((l, idx) => (
          <Paper
            key={idx}
            sx={{ p: 1.5, textAlign: 'center', cursor: 'pointer' }}
            onClick={() => window.open(l.url, '_blank')}
          >
            {l.tag_line || l.icon}
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}
