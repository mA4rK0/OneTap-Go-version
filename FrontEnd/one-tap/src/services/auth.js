import api from './api';

export const login = (payload) => api.post('/v1/auth/login', payload);
export const signup = (payload) => api.post('/v1/auth/register', payload);
