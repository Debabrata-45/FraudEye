import client from './client';

export const login = async (email, password) => {
  const res = await client.post('/api/auth/login', { email, password });
  return res.data.data;
};

export const getMe = async () => {
  const res = await client.get('/api/auth/me');
  return res.data;
};