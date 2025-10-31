import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragHandle as DragHandleIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/hooks/useAuth';
import { useSocialLinks } from '@/hooks/useSocialLinks';
import { SOCIAL_LINK_POSITIONS, SOCIAL_PLATFORMS } from '@/utils/constants';
import { socialLinkSchema } from '@/utils/validators';

const SortableSocialLink = ({ link, onDelete, onToggle }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: link.public_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const platform = SOCIAL_PLATFORMS.find((p) => p.id === link.icon) || {
    name: link.icon,
  };

  return (
    <ListItem ref={setNodeRef} style={style} {...attributes}>
      <DragHandleIcon
        {...listeners}
        sx={{ mr: 2, cursor: 'grab', color: 'action.active' }}
      />
      <ListItemText
        primary={
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body1" fontWeight="medium">
              {platform.name}
            </Typography>
            <Chip
              label={link.position}
              size="small"
              color={link.position === 'top' ? 'primary' : 'secondary'}
            />
            {!link.active && (
              <Chip
                label="Inactive"
                size="small"
                variant="outlined"
                color="default"
              />
            )}
          </Box>
        }
        secondary={link.url}
      />
      <ListItem>
        <FormControlLabel
          control={
            <Switch
              checked={link.active}
              onChange={() => onToggle(link.public_id)}
              color="primary"
            />
          }
          label=""
        />
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => onDelete(link.public_id, link.position)}
          sx={{ ml: 1 }}
        >
          <DeleteIcon />
        </IconButton>
      </ListItem>
    </ListItem>
  );
};

const SocialLinksManager = () => {
  const { profile } = useAuth();
  const {
    loading,
    createSocialLinks,
    getSocialLinks,
    updateSocialLinks,
    deleteSocialLinks,
  } = useSocialLinks();
  const [socialLinks, setSocialLinks] = useState([]);
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(socialLinkSchema),
    defaultValues: {
      platform: '',
      url: '',
      position: 'top',
      active: true,
    },
  });

  const position = watch('position');

  useEffect(() => {
    if (profile?.public_id) {
      loadSocialLinks();
    }
  }, [profile]);

  const loadSocialLinks = async () => {
    if (profile?.public_id) {
      const result = await getSocialLinks(profile.public_id);
      if (result.success) {
        setSocialLinks(result.data.social_links || []);
      }
    }
  };

  const onSubmit = async (data) => {
    if (!profile?.public_id) {
      setSubmitError('Please create a profile first');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSuccessMessage('');

    try {
      const newLink = {
        icon: data.platform,
        url: data.url,
        active: data.active,
        order: socialLinks.filter((link) => link.position === data.position)
          .length,
      };

      const requestData = {
        position: data.position,
        social_links: [newLink],
      };

      const result = await createSocialLinks(profile.public_id, requestData);
      if (result.success) {
        setSuccessMessage('Social link added successfully!');
        reset();
        loadSocialLinks();
      } else {
        setSubmitError(result.error);
      }
    } catch (err) {
      console.error(err);
      setSubmitError('Failed to add social link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (publicId, position) => {
    if (!profile?.public_id) return;

    setIsSubmitting(true);
    try {
      const currentPositionLinks = socialLinks.filter(
        (link) => link.position === position && link.public_id !== publicId,
      );

      if (currentPositionLinks.length === 0) {
        const result = await deleteSocialLinks(profile.public_id, position);
        if (result.success) {
          setSuccessMessage('Social links deleted successfully!');
          loadSocialLinks();
        } else {
          setSubmitError(result.error);
        }
      } else {
        const updateData = {
          position: position,
          social_links: currentPositionLinks.map((link, index) => ({
            icon: link.icon,
            url: link.url,
            active: link.active,
            order: index,
          })),
        };

        const result = await updateSocialLinks(profile.public_id, updateData);
        if (result.success) {
          setSuccessMessage('Social link deleted successfully!');
          loadSocialLinks();
        } else {
          setSubmitError(result.error);
        }
      }
    } catch (err) {
      console.error(err);
      setSubmitError('Failed to delete social link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (publicId) => {
    if (!profile?.public_id) return;

    setIsSubmitting(true);
    try {
      const linkToUpdate = socialLinks.find(
        (link) => link.public_id === publicId,
      );
      if (!linkToUpdate) return;

      const updatedLinks = socialLinks.map((link) =>
        link.public_id === publicId ? { ...link, active: !link.active } : link,
      );

      const positions = [...new Set(updatedLinks.map((link) => link.position))];

      for (const pos of positions) {
        const positionLinks = updatedLinks
          .filter((link) => link.position === pos)
          .map((link, index) => ({
            icon: link.icon,
            url: link.url,
            active: link.active,
            order: index,
          }));

        const updateData = {
          position: pos,
          social_links: positionLinks,
        };

        await updateSocialLinks(profile.public_id, updateData);
      }

      setSuccessMessage('Social link updated successfully!');
      loadSocialLinks();
    } catch (err) {
      console.error(err);
      setSubmitError('Failed to update social link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const activeLink = socialLinks.find(
        (link) => link.public_id === active.id,
      );
      if (!activeLink) return;

      const positionLinks = socialLinks.filter(
        (link) => link.position === activeLink.position,
      );
      const oldIndex = positionLinks.findIndex(
        (item) => item.public_id === active.id,
      );
      const newIndex = positionLinks.findIndex(
        (item) => item.public_id === over.id,
      );

      if (oldIndex !== newIndex) {
        const newOrder = arrayMove(positionLinks, oldIndex, newIndex);

        const updateData = {
          position: activeLink.position,
          social_links: newOrder.map((link, index) => ({
            icon: link.icon,
            url: link.url,
            active: link.active,
            order: index,
          })),
        };

        try {
          await updateSocialLinks(profile.public_id, updateData);
          loadSocialLinks();
        } catch (err) {
          console.error(err);
          setSubmitError('Failed to reorder links');
        }
      }
    }
  };

  const filteredLinks = socialLinks.filter(
    (link) => link.position === position,
  );

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Social Links Manager
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mb: 4 }}
        >
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                required
                id="platform"
                label="Platform"
                {...register('platform')}
                error={!!errors.platform}
                helperText={errors.platform?.message}
              >
                {SOCIAL_PLATFORMS.map((platform) => (
                  <MenuItem key={platform.id} value={platform.id}>
                    {platform.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                id="url"
                label="URL"
                placeholder="https://example.com/username"
                {...register('url')}
                error={!!errors.url}
                helperText={errors.url?.message}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                required
                id="position"
                label="Position"
                {...register('position')}
                error={!!errors.position}
                helperText={errors.position?.message}
              >
                {SOCIAL_LINK_POSITIONS.map((position) => (
                  <MenuItem key={position.value} value={position.value}>
                    {position.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControlLabel
                control={<Switch defaultChecked {...register('active')} />}
                label="Active"
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
            disabled={isSubmitting || loading}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Add Social Link'}
          </Button>
        </Box>

        {submitError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {submitError}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Your Social Links (
          {SOCIAL_LINK_POSITIONS.find((p) => p.value === position)?.label})
        </Typography>

        {filteredLinks.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ py: 2, textAlign: 'center' }}
          >
            No social links added for this position yet.
          </Typography>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredLinks.map((item) => item.public_id)}
              strategy={verticalListSortingStrategy}
            >
              <List>
                {filteredLinks.map((link) => (
                  <SortableSocialLink
                    key={link.public_id}
                    link={link}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                  />
                ))}
              </List>
            </SortableContext>
          </DndContext>
        )}

        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {SOCIAL_LINK_POSITIONS.map((pos) => {
            const count = socialLinks.filter(
              (link) => link.position === pos.value,
            ).length;
            return (
              <Chip
                key={pos.value}
                label={`${pos.label} (${count})`}
                variant={position === pos.value ? 'filled' : 'outlined'}
                onClick={() => reset({ ...watch(), position: pos.value })}
                color={position === pos.value ? 'primary' : 'default'}
              />
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SocialLinksManager;
