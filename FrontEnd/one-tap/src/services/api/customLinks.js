import network from '@/utils/network';

const customLinks = {
  async createCustomLinks(profilePublicId, data) {
    return network.post(
      `/api/v1/profiles/${profilePublicId}/custom-links`,
      data,
    );
  },

  async getCustomLinks(profilePublicId) {
    return network.get(`/api/v1/profiles/${profilePublicId}/custom-links`);
  },

  async updateCustomLinks(profilePublicId, data) {
    return network.put(
      `/api/v1/profiles/${profilePublicId}/custom-links`,
      data,
    );
  },

  async deleteCustomLinks(profilePublicId) {
    return network.delete(`/api/v1/profiles/${profilePublicId}/custom-links`);
  },
};

export default customLinks;
