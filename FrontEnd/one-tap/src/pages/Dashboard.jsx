import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import BioEditor from '../components/dashboard/BioEditor.jsx';
import CustomLinksManager from '../components/dashboard/CustomLinksManager.jsx';
import ProfileForm from '../components/dashboard/ProfileForm.jsx';
import SocialLinksManager from '../components/dashboard/SocialLinksManager.jsx';
import ThemeCustomizer from '../components/dashboard/ThemeCustomizer.jsx';

export default function Dashboard() {
  return (
    <Stack spacing={4}>
      <Typography variant="h4">Dashboard</Typography>
      <ProfileForm />
      <ThemeCustomizer />
      <BioEditor />
      <SocialLinksManager />
      <CustomLinksManager />
    </Stack>
  );
}
