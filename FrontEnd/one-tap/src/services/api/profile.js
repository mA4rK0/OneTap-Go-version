import network from '@/utils/network';

const profile = {
  async createProfile(profileData) {
    return network.post('/api/v1/profiles', profileData);
  },

  async updateProfile(publicId, profileData) {
    return network.put(`/api/v1/profiles/${publicId}`, profileData);
  },

  async getProfile(publicId) {
    return network.get(`/api/v1/profiles/${publicId}`);
  },
};

export default profile;
