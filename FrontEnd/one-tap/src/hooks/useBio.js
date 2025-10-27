import { useState } from 'react';

import bio from '@/services/api/bio';

export const useBio = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBio = async (profilePublicId, bioData) => {
    try {
      setLoading(true);
      const response = await bio.createBio(profilePublicId, bioData);
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create bio';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const updateBio = async (publicId, bioData) => {
    try {
      setLoading(true);
      const response = await bio.updateBio(publicId, bioData);
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update bio';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const getBio = async (publicId) => {
    try {
      setLoading(true);
      const response = await bio.getBio(publicId);
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to get bio';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createBio,
    updateBio,
    getBio,
  };
};
