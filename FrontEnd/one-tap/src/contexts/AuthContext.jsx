import { createContext, useEffect, useState } from 'react';

import auth from '@/services/api/auth';
import profile from '@/services/api/profile';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('access_token'));

  const fetchUserFromToken = async () => {
    const tokenData = auth.decodeToken();
    if (tokenData && tokenData.pub_id) {
      try {
        const userData = await auth.getUser();
        setUser(userData.data);

        try {
          const getProfileData = await profile.getProfile(tokenData.pub_id);
          setProfileData(getProfileData.data);
        } catch (error) {
          console.log('No profile found for user:', error);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('access_token');

      if (storedToken) {
        if (auth.isTokenExpired()) {
          console.log('Token expired, logging out...');
          logout();
          setLoading(false);
          return;
        }

        try {
          await fetchUserFromToken();
        } catch (error) {
          console.error('Failed to initialize auth:', error);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await auth.login({ email, password });
      const { access_token, user: userData } = response.data;

      localStorage.setItem('access_token', access_token);
      setToken(access_token);
      setUser(userData);

      await fetchUserFromToken();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await auth.signup(userData);
      const { access_token, user: newUser } = response.data;

      localStorage.setItem('access_token', access_token);
      setToken(access_token);
      setUser(newUser);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Signup failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
    setProfileData(null);
  };

  const updateUser = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  const updateProfile = (updatedProfile) => {
    setProfileData((prev) => ({ ...prev, ...updatedProfile }));
  };

  const refreshUser = async () => {
    if (token && !auth.isTokenExpired()) {
      await fetchUserFromToken();
    }
  };

  const value = {
    user,
    profileData,
    token,
    login,
    signup,
    logout,
    updateUser,
    updateProfile,
    refreshUser,
    loading,
    isAuthenticated: !!token && !auth.isTokenExpired(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
