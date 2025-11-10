import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import { useProfileCtx } from '../../contexts/ProfileContext.jsx';
import * as api from '../../services/profile';

export default function CustomLinksManager() {
  const { profile } = useProfileCtx();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    url: '',
    tag_line: '',
    active: true,
    order: 1,
  });

  const load = async () => {
    if (!profile?.public_id) return;
    const { data } = await api.getCustomLinks(profile.public_id);
    setItems(data.data.links || []);
  };
  useEffect(() => {
    load();
  }, [profile?.public_id]);

  const add = () => {
    setItems((prev) => [...prev, { ...newItem, order: prev.length + 1 }]);
    setNewItem({ url: '', tag_line: '', active: true, order: 1 });
  };
  const save = async () => {
    if (!profile?.public_id) return;
    await api.updateCustomLinks(profile.public_id, {
      links: items.map((i, idx) => ({ ...i, order: idx + 1 })),
    });
    await load();
  };

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Add Custom Link
        </Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            label="URL"
            fullWidth
            value={newItem.url}
            onChange={(e) => setNewItem((s) => ({ ...s, url: e.target.value }))}
          />
          <TextField
            label="Tagline"
            fullWidth
            value={newItem.tag_line}
            onChange={(e) =>
              setNewItem((s) => ({ ...s, tag_line: e.target.value }))
            }
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
              {item.tag_line} — {item.url}
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
