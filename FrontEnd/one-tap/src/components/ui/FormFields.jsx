import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material';

export const FormInput = ({
  register,
  errors,
  name,
  label,
  type = 'text',
  ...props
}) => (
  <TextField
    fullWidth
    type={type}
    label={label}
    {...register(name)}
    error={!!errors[name]}
    helperText={errors[name]?.message}
    {...props}
  />
);

export const FormSelect = ({
  register,
  errors,
  name,
  label,
  options,
  ...props
}) => (
  <FormControl fullWidth error={!!errors[name]}>
    <InputLabel>{label}</InputLabel>
    <Select label={label} {...register(name)} {...props}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
    {errors[name] && <FormHelperText>{errors[name]?.message}</FormHelperText>}
  </FormControl>
);

export const FormSwitch = ({ register, name, label, ...props }) => (
  <FormControlLabel
    control={<Switch {...register(name)} {...props} />}
    label={label}
  />
);
