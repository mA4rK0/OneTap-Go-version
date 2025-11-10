import DarkModeIcon from '@mui/icons-material/DarkMode';
import IconButton from '@mui/material/IconButton';
export default function ThemeToggle({ onClick }) {
  return (
    <IconButton color="inherit" onClick={onClick} aria-label="toggle theme">
      <DarkModeIcon />
    </IconButton>
  );
}
