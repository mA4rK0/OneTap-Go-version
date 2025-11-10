import { createContext, useContext, useMemo, useState } from 'react';

export const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [socialLinks, setSocialLinks] = useState({ top: [], bottom: [] });
  const [customLinks, setCustomLinks] = useState([]);
  const [bio, setBio] = useState(null);

  const value = useMemo(
    () => ({
      profile,
      setProfile,
      socialLinks,
      setSocialLinks,
      customLinks,
      setCustomLinks,
      bio,
      setBio,
    }),
    [profile, socialLinks, customLinks, bio],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export const useProfileCtx = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx)
    throw new Error('useProfileCtx must be used within ProfileProvider');
  return ctx;
};
