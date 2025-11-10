import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import { useProfileCtx } from '../../contexts/ProfileContext.jsx';
import * as api from '../../services/profile';

const PLATFORMS = [
  'instagram',
  'youtube',
  'tiktok',
  'x',
  'facebook',
  'linkedin',
  'github',
];

export default function SocialLinksManager() {
  const { profile } = useProfileCtx();
  const [position, setPosition] = useState('top');
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    icon: 'instagram',
    url: '',
    active: true,
    order: 1,
  });

  const load = async () => {
    if (!profile?.public_id) return;
    const { data } = await api.getSocialLinks(profile.public_id, position);
    setItems(data.data.social_links || []);
  };
  useEffect(() => {
    load();
  }, [profile?.public_id, position]);

  const add = () => {
    setItems((prev) => [...prev, { ...newItem, order: prev.length + 1 }]);
    setNewItem({ icon: 'instagram', url: '', active: true, order: 1 });
  };
  const save = async () => {
    if (!profile?.public_id) return;
    await api.updateSocialLinks(profile.public_id, {
      position,
      social_links: items.map((i, idx) => ({ ...i, order: idx + 1 })),
    });
    await load();
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <TextField
          label="Position"
          select
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        >
          <MenuItem value="top">Top</MenuItem>
          <MenuItem value="bottom">Bottom</MenuItem>
        </TextField>
      </Stack>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Add Link
        </Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Platform"
            select
            value={newItem.icon}
            onChange={(e) =>
              setNewItem((s) => ({ ...s, icon: e.target.value }))
            }
          >
            {PLATFORMS.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="URL"
            fullWidth
            value={newItem.url}
            onChange={(e) => setNewItem((s) => ({ ...s, url: e.target.value }))}
          />
          <Button onClick={add} variant="outlined">
            Add
          </Button>
          <Button onClick={save} variant="contained">
            Save
          </Button>
        </Stack>
      </Paper>

      <Stack spacing={1}>
        {items.map((item, idx) => (
          <Paper
            key={idx}
            sx={{
              p: 1.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography>
              {item.icon} — {item.url}
            </Typography>
            <Button
              size="small"
              onClick={() => setItems(items.filter((_, i) => i !== idx))}
            >
              Delete
            </Button>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}
