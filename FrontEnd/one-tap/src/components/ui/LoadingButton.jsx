import { Button, CircularProgress } from '@mui/material';

export const LoadingButton = ({ loading, children, ...props }) => (
  <Button
    {...props}
    disabled={loading || props.disabled}
    startIcon={loading ? <CircularProgress size={20} /> : props.startIcon}
  >
    {loading ? 'Loading...' : children}
  </Button>
);
