import { useState } from 'react';

import customLinks from '@/services/api/customLinks';

export const useCustomLinks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCustomLinks = async (profilePublicId, data) => {
    try {
      setLoading(true);
      const response = await customLinks.createCustomLinks(
        profilePublicId,
        data,
      );
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to create custom links';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const getCustomLinks = async (profilePublicId) => {
    try {
      setLoading(true);
      const response = await customLinks.getCustomLinks(profilePublicId);
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to get custom links';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const updateCustomLinks = async (profilePublicId, data) => {
    try {
      setLoading(true);
      const response = await customLinks.updateCustomLinks(
        profilePublicId,
        data,
      );
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to update custom links';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomLinks = async (profilePublicId) => {
    try {
      setLoading(true);
      const response = await customLinks.deleteCustomLinks(profilePublicId);
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to delete custom links';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createCustomLinks,
    getCustomLinks,
    updateCustomLinks,
    deleteCustomLinks,
  };
};
