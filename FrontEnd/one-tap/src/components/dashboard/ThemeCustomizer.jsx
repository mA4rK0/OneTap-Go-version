import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';

import { useProfileCtx } from '../../contexts/ProfileContext.jsx';
import * as api from '../../services/profile';
import ColorPicker from '../ui/ColorPicker.jsx';

export default function ThemeCustomizer() {
  const { profile, setProfile } = useProfileCtx();
  const [local, setLocal] = useState(profile || {});
  useEffect(() => setLocal(profile || {}), [profile]);

  const set = (k, v) => setLocal((s) => ({ ...s, [k]: v }));
  const save = async () => {
    if (!profile?.public_id) return;
    const { data } = await api.updateProfile(profile.public_id, local);
    setProfile(data.data);
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Theme Name"
        value={local.theme_name || ''}
        onChange={(e) => set('theme_name', e.target.value)}
      />
      <ColorPicker
        label="Background"
        value={local.bg_colour || '#ffffff'}
        onChange={(v) => set('bg_colour', v)}
      />
      <ColorPicker
        label="Username"
        value={local.username_colour || '#000000'}
        onChange={(v) => set('username_colour', v)}
      />
      <ColorPicker
        label="Button BG"
        value={local.btn_bg_colour || '#1976d2'}
        onChange={(v) => set('btn_bg_colour', v)}
      />
      <ColorPicker
        label="Button Text"
        value={local.btn_text_colour || '#ffffff'}
        onChange={(v) => set('btn_text_colour', v)}
      />
      <ColorPicker
        label="Button Outline"
        value={local.btn_outline_colour || '#1976d2'}
        onChange={(v) => set('btn_outline_colour', v)}
      />
      <ColorPicker
        label="Icon"
        value={local.icon_colour || '#000000'}
        onChange={(v) => set('icon_colour', v)}
      />
      <Button variant="contained" onClick={save}>
        Save Theme
      </Button>
    </Stack>
  );
}
