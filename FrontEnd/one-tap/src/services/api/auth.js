import network from '@/utils/network';

const auth = {
  async login(payload) {
    return network.post('/v1/auth/login', payload);
  },
  async signup(payload) {
    return network.post('/v1/auth/register', payload);
  },
  async getUser() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No token found');
    }

    try {
      const payload = this.decodeToken(token);
      return network.get(`/api/v1/users/${payload.pub_id}`);
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  },

  decodeToken(token = null) {
    const tokenToDecode = token || localStorage.getItem('access_token');
    if (!tokenToDecode) return null;

    try {
      const payload = JSON.parse(atob(tokenToDecode.split('.')[1]));
      return {
        user_id: payload.user_id,
        pub_id: payload.pub_id,
        email: payload.email,
        exp: payload.exp,
      };
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  },

  isTokenExpired() {
    const payload = this.decodeToken();
    if (!payload || !payload.exp) return true;
    return Date.now() >= payload.exp * 1000;
  },
};

export default auth;
