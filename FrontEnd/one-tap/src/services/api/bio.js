import network from '@/utils/network';

const bio = {
  async createBio(profilePublicId, bioData) {
    return network.post(`/api/v1/profiles/${profilePublicId}/bio`, bioData);
  },

  async updateBio(publicId, bioData) {
    return network.put(`/api/v1/profiles/${publicId}/bio`, bioData);
  },

  async getBio(publicId) {
    return network.get(`/api/v1/profiles/${publicId}/bio`);
  },
};

export default bio;
