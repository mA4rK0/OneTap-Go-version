import api from './api';

export const createProfile = (payload) => api.post('/api/v1/profiles', payload);
export const getProfile = (id) => api.get(`/api/v1/profiles/${id}`);
export const updateProfile = (id, payload) =>
  api.put(`/api/v1/profiles/${id}`, payload);

export const getSocialLinks = (profileId, position = '') =>
  api.get(
    `/api/v1/profiles/${profileId}/social-links${position ? `?position=${position}` : ''}`,
  );
export const createSocialLinks = (profileId, payload) =>
  api.post(`/api/v1/profiles/${profileId}/social-links`, payload);
export const updateSocialLinks = (profileId, payload) =>
  api.put(`/api/v1/profiles/${profileId}/social-links`, payload);
export const deleteSocialLinks = (profileId, position = '') =>
  api.delete(
    `/api/v1/profiles/${profileId}/social-links${position ? `?position=${position}` : ''}`,
  );

export const getCustomLinks = (profileId) =>
  api.get(`/api/v1/profiles/${profileId}/custom-links`);
export const createCustomLinks = (profileId, payload) =>
  api.post(`/api/v1/profiles/${profileId}/custom-links`, payload);
export const updateCustomLinks = (profileId, payload) =>
  api.put(`/api/v1/profiles/${profileId}/custom-links`, payload);
export const deleteCustomLinks = (profileId) =>
  api.delete(`/api/v1/profiles/${profileId}/custom-links`);

export const getBio = (profileId) =>
  api.get(`/api/v1/profiles/${profileId}/bio`);
export const createBio = (profileId, payload) =>
  api.post(`/api/v1/profiles/${profileId}/bio`, payload);
export const updateBio = (profileId, payload) =>
  api.put(`/api/v1/profiles/${profileId}/bio`, payload);
