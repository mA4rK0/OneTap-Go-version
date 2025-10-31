import { Container } from '@mui/material';
import { useState } from 'react';

import BioEditor from '@/components/ui/dashboard/BioEditor';
import CustomLinksManager from '@/components/ui/dashboard/CustomLinksManager';
import DashboardLayout from '@/components/ui/dashboard/DashboardLayout';
import LinkPreview from '@/components/ui/dashboard/LinkPreview';
import ProfileForm from '@/components/ui/dashboard/ProfileForm';
import SocialLinksManager from '@/components/ui/dashboard/SocialLinksManager';
import ThemeCustomizer from '@/components/ui/dashboard/ThemeCustomizer';
import { useAuth } from '@/hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileForm />;
      case 'social-links':
        return <SocialLinksManager />;
      case 'custom-links':
        return <CustomLinksManager />;
      case 'bio':
        return <BioEditor />;
      case 'theme':
        return <ThemeCustomizer />;
      case 'share':
        return <LinkPreview />;
      default:
        return <ProfileForm />;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      <Container maxWidth="lg" sx={{ py: 2 }}>
        {renderSection()}
      </Container>
    </DashboardLayout>
  );
};

export default Dashboard;
