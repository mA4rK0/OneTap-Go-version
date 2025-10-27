import { useState } from 'react';

import { useAuth } from './useAuth';

import profile from '@/services/api/profile';

export const useProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { updateProfile: updateAuthProfile } = useAuth();

  const createProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await profile.createProfile(profileData);
      setProfileData(response.data);
      updateAuthProfile(response.data);
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to create profile';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (publicId, profileData) => {
    try {
      setLoading(true);
      const response = await profile.updateProfile(publicId, profileData);
      setProfileData(response.data);
      updateAuthProfile(response.data);
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to update profile';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async (publicId) => {
    try {
      setLoading(true);
      const response = await profile.getProfile(publicId);
      setProfileData(response.data);
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to get profile';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    profileData,
    loading,
    error,
    createProfile,
    updateProfile,
    getProfile,
  };
};
