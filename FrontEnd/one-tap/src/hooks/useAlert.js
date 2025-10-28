import { useCallback, useState } from 'react';

export const useAlert = () => {
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const showAlert = useCallback((message, severity = 'info') => {
    setAlert({ open: true, message, severity });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, open: false }));
  }, []);

  const showError = useCallback(
    (message) => {
      showAlert(message, 'error');
    },
    [showAlert],
  );

  const showSuccess = useCallback(
    (message) => {
      showAlert(message, 'success');
    },
    [showAlert],
  );

  return {
    alert,
    showAlert,
    hideAlert,
    showError,
    showSuccess,
  };
};
