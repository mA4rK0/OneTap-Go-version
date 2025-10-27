import network from '@/utils/network';

const socialLinks = {
  async createSocialLinks(profilePublicId, data) {
    return network.post(
      `/api/v1/profiles/${profilePublicId}/social-links`,
      data,
    );
  },

  async getSocialLinks(profilePublicId, position = '') {
    const url = `/api/v1/profiles/${profilePublicId}/social-links${position ? `?position=${position}` : ''}`;
    return network.get(url);
  },

  async updateSocialLinks(profilePublicId, data) {
    return network.put(
      `/api/v1/profiles/${profilePublicId}/social-links`,
      data,
    );
  },

  async deleteSocialLinks(profilePublicId, position = '') {
    const url = `/api/v1/profiles/${profilePublicId}/social-links${position ? `?position=${position}` : ''}`;
    return network.delete(url);
  },
};

export default socialLinks;
