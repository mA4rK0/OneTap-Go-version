import TextField from '@mui/material/TextField';
export default function ColorPicker({ label, value, onChange }) {
  return (
    <TextField
      type="color"
      label={label}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}
