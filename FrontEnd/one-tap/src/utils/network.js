import axios from 'axios';

import session from './session';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const network = axios.create({
  baseURL: API_BASE_URL,
});

network.interceptors.request.use(
  (config) => {
    const token = session.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

network.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Token not valid, the session will be cleared');
      session.clearSession();
    }

    console.log('network error: ', error);

    // window.location.href = '/login';

    return Promise.reject(error);
  },
);

export default network;
