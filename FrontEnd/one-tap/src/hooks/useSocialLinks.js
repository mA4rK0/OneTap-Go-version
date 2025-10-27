import { useState } from 'react';

import socialLinks from '@/services/api/socialLinks';

export const useSocialLinks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createSocialLinks = async (profilePublicId, data) => {
    try {
      setLoading(true);
      const response = await socialLinks.createSocialLinks(
        profilePublicId,
        data,
      );
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to create social links';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const getSocialLinks = async (profilePublicId, position = '') => {
    try {
      setLoading(true);
      const response = await socialLinks.getSocialLinks(
        profilePublicId,
        position,
      );
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to get social links';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const updateSocialLinks = async (profilePublicId, data) => {
    try {
      setLoading(true);
      const response = await socialLinks.updateSocialLinks(
        profilePublicId,
        data,
      );
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to update social links';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const deleteSocialLinks = async (profilePublicId, position = '') => {
    try {
      setLoading(true);
      const response = await socialLinks.deleteSocialLinks(
        profilePublicId,
        position,
      );
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to delete social links';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createSocialLinks,
    getSocialLinks,
    updateSocialLinks,
    deleteSocialLinks,
  };
};
