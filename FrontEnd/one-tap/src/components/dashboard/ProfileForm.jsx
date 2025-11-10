import { yupResolver } from '@hookform/resolvers/yup';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useProfileCtx } from '../../contexts/ProfileContext.jsx';
import * as api from '../../services/profile';
import { CATEGORIES } from '../../utils/constants';
import ImageUploader from '../ui/ImageUploader.jsx';

const schema = yup.object({
  username: yup.string().min(3).required(),
  category: yup.string().required(),
});

export default function ProfileForm() {
  const { profile, setProfile } = useProfileCtx();
  const [error, setError] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: profile || { username: '', category: 'Other' },
  });

  const onSubmit = async (values) => {
    try {
      if (profile?.public_id) {
        const { data } = await api.updateProfile(profile.public_id, {
          ...profile,
          ...values,
          avatar: avatar?.preview || profile.avatar,
        });
        setProfile(data.data);
      } else {
        const { data } = await api.createProfile({
          ...values,
          avatar: avatar?.preview || '',
        });
        setProfile(data.data);
      }
    } catch (err) {
      setError('Gagal menyimpan profil');
      return err;
    }
  };

  useEffect(() => {
    if (profile) {
      setValue('username', profile.username || '');
      setValue('category', profile.category || 'Other');
    }
  }, [profile]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Username"
          {...register('username')}
          error={!!errors.username}
          helperText={errors.username?.message}
        />
        <TextField
          label="Category"
          select
          {...register('category')}
          error={!!errors.category}
          helperText={errors.category?.message}
        >
          {CATEGORIES.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
        <ImageUploader value={avatar} onChange={setAvatar} />
        <Button type="submit" variant="contained">
          {profile?.public_id ? 'Update' : 'Create'} Profile
        </Button>
      </Stack>
    </form>
  );
}
