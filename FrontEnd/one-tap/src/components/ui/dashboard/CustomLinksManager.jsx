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
  Edit as EditIcon,
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
  ListItemSecondaryAction,
  ListItemText,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/hooks/useAuth';
import { useCustomLinks } from '@/hooks/useCustomLinks';
import { customLinkSchema } from '@/utils/validators';

const SortableCustomLink = ({ link, onDelete, onToggle, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: link.public_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
              {link.url}
            </Typography>
            {link.tag_line && (
              <Chip
                label={link.tag_line}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
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
        secondary={`Order: ${link.order}`}
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="edit"
          onClick={() => onEdit(link)}
          sx={{ mr: 1 }}
        >
          <EditIcon />
        </IconButton>
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
          onClick={() => onDelete(link.public_id)}
          sx={{ ml: 1 }}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const CustomLinksManager = () => {
  const { profile } = useAuth();
  const { loading, createCustomLinks, getCustomLinks, updateCustomLinks } =
    useCustomLinks();
  const [customLinks, setCustomLinks] = useState([]);
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

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
    setValue,
  } = useForm({
    resolver: yupResolver(customLinkSchema),
    defaultValues: {
      url: '',
      tagline: '',
      active: true,
    },
  });

  useEffect(() => {
    if (profile?.public_id) {
      loadCustomLinks();
    }
  }, [profile]);

  const loadCustomLinks = async () => {
    if (profile?.public_id) {
      const result = await getCustomLinks(profile.public_id);
      if (result.success) {
        setCustomLinks(result.data.links || []);
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
      let result;

      if (editingLink) {
        const updatedLinks = customLinks.map((link) =>
          link.public_id === editingLink.public_id
            ? {
                ...link,
                url: data.url,
                tag_line: data.tagline,
                active: data.active,
              }
            : link,
        );

        const requestData = {
          links: updatedLinks.map((link, index) => ({
            url: link.url,
            tag_line: link.tag_line,
            active: link.active,
            order: index,
          })),
        };

        result = await updateCustomLinks(profile.public_id, requestData);
        setEditingLink(null);
      } else {
        const newLink = {
          url: data.url,
          tag_line: data.tagline,
          active: data.active,
          order: customLinks.length,
        };

        const requestData = {
          links: [newLink],
        };

        result = await createCustomLinks(profile.public_id, requestData);
      }

      if (result.success) {
        setSuccessMessage(
          editingLink
            ? 'Custom link updated successfully!'
            : 'Custom link added successfully!',
        );
        reset();
        loadCustomLinks();
      } else {
        setSubmitError(result.error);
      }
    } catch (err) {
      console.error(err);
      setSubmitError('Failed to save custom link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (publicId) => {
    if (!profile?.public_id) return;

    setIsSubmitting(true);
    try {
      const updatedLinks = customLinks
        .filter((link) => link.public_id !== publicId)
        .map((link, index) => ({
          url: link.url,
          tag_line: link.tag_line,
          active: link.active,
          order: index,
        }));

      const requestData = {
        links: updatedLinks,
      };

      const result = await updateCustomLinks(profile.public_id, requestData);
      if (result.success) {
        setSuccessMessage('Custom link deleted successfully!');
        loadCustomLinks();
      } else {
        setSubmitError(result.error);
      }
    } catch (err) {
      console.error(err);
      setSubmitError('Failed to delete custom link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (publicId) => {
    if (!profile?.public_id) return;

    setIsSubmitting(true);
    try {
      const updatedLinks = customLinks
        .map((link) =>
          link.public_id === publicId
            ? { ...link, active: !link.active }
            : link,
        )
        .map((link, index) => ({
          url: link.url,
          tag_line: link.tag_line,
          active: link.active,
          order: index,
        }));

      const requestData = {
        links: updatedLinks,
      };

      const result = await updateCustomLinks(profile.public_id, requestData);
      if (result.success) {
        setSuccessMessage('Custom link updated successfully!');
        loadCustomLinks();
      } else {
        setSubmitError(result.error);
      }
    } catch (err) {
      console.error(err);
      setSubmitError('Failed to update custom link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (link) => {
    setEditingLink(link);
    setValue('url', link.url);
    setValue('tagline', link.tag_line || '');
    setValue('active', link.active);
  };

  const handleCancelEdit = () => {
    setEditingLink(null);
    reset();
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = customLinks.findIndex(
        (item) => item.public_id === active.id,
      );
      const newIndex = customLinks.findIndex(
        (item) => item.public_id === over.id,
      );

      if (oldIndex !== newIndex) {
        const newOrder = arrayMove(customLinks, oldIndex, newIndex);

        const updateData = {
          links: newOrder.map((link, index) => ({
            url: link.url,
            tag_line: link.tag_line,
            active: link.active,
            order: index,
          })),
        };

        try {
          await updateCustomLinks(profile.public_id, updateData);
          loadCustomLinks();
        } catch (err) {
          console.error(err);
          setSubmitError('Failed to reorder links');
        }
      }
    }
  };

  const activeLinks = customLinks.filter((link) => link.active);
  const inactiveLinks = customLinks.filter((link) => !link.active);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Custom Links Manager
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mb: 4 }}
        >
          <Grid container spacing={2}>
            <Grid>
              <TextField
                fullWidth
                required
                id="url"
                label="URL"
                placeholder="https://example.com"
                {...register('url')}
                error={!!errors.url}
                helperText={errors.url?.message}
              />
            </Grid>

            <Grid>
              <TextField
                fullWidth
                id="tagline"
                label="Tagline"
                placeholder="Brief description of this link"
                {...register('tagline')}
                error={!!errors.tagline}
                helperText={
                  errors.tagline?.message || 'Optional short description'
                }
              />
            </Grid>

            <Grid>
              <FormControlLabel
                control={<Switch defaultChecked {...register('active')} />}
                label="Active"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<AddIcon />}
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? (
                <CircularProgress size={24} />
              ) : editingLink ? (
                'Update Link'
              ) : (
                'Add Custom Link'
              )}
            </Button>

            {editingLink && (
              <Button
                variant="outlined"
                onClick={handleCancelEdit}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </Box>
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

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Active Links ({activeLinks.length})
          </Typography>

          {activeLinks.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ py: 2, textAlign: 'center' }}
            >
              No active custom links yet.
            </Typography>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={activeLinks.map((item) => item.public_id)}
                strategy={verticalListSortingStrategy}
              >
                <List>
                  {activeLinks.map((link) => (
                    <SortableCustomLink
                      key={link.public_id}
                      link={link}
                      onDelete={handleDelete}
                      onToggle={handleToggle}
                      onEdit={handleEdit}
                    />
                  ))}
                </List>
              </SortableContext>
            </DndContext>
          )}
        </Box>

        {inactiveLinks.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Inactive Links ({inactiveLinks.length})
            </Typography>
            <List>
              {inactiveLinks.map((link) => (
                <SortableCustomLink
                  key={link.public_id}
                  link={link}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                />
              ))}
            </List>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomLinksManager;
