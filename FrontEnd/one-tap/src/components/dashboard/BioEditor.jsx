import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import { useProfileCtx } from '../../contexts/ProfileContext.jsx';
import * as api from '../../services/profile';
import { wordCount } from '../../utils/validators';

export default function BioEditor() {
  const { profile, bio, setBio } = useProfileCtx();
  const [text, setText] = useState(bio?.description || '');
  const [active, setActive] = useState(!!bio?.active);

  const save = async () => {
    if (!profile?.public_id) return;
    const payload = { description: text, active };
    const fn = bio?.public_id ? api.updateBio : api.createBio;
    const { data } = await fn(profile.public_id, payload);
    setBio(data.data);
  };

  const wc = wordCount(text);
  const over = wc > 35;

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle2">Bio ({wc}/35 kata)</Typography>
      <TextField
        multiline
        minRows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        error={over}
        helperText={over ? 'Maks 35 kata' : ''}
      />
      <Stack direction="row" alignItems="center" spacing={1}>
        <Switch
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />{' '}
        <Typography>Show Bio</Typography>
      </Stack>
      <Button variant="contained" onClick={save} disabled={over}>
        Save Bio
      </Button>
    </Stack>
  );
}
