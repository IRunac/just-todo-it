import api from './axios';

export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data.user;
};

export const register = async (username, password) => {
  await api.post('/auth/register', { username, password }).then(response => {
    return response.data;
  });
};
