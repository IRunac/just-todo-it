import axios from 'axios';
import Cookies from 'js-cookie';

export const getUser = async userId => {
  const token = Cookies.get('jwtToken');
  await axios.get(`/api/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } }).then(response => {
    return response.data;
  });
};

export const login = async (username, password) => {
  const response = await axios.post('/api/auth/login', { username, password });
  return response.data.user;
};

export const register = async (username, password) => {
  const token = Cookies.get('jwtToken');
  await axios.post('/api/auth/register',
    { username, password },
    { headers: { Authorization: `Bearer ${token}` } })
  .then(response => {
    return response.data;
  });
};
