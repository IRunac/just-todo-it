import api from './axios';

export const getCurrentUser = async () => {
  let response;
  try {
    response = await api.get('/users/me');
  } catch (error) {
    console.log(error);
    return null;
  }
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/users/');
  return response.data;
};

export const getUserBoards = async id => {
  const response = await api.get(`/users/${id}/boards`);
  return response.data;
};

export const getUserCategories = async id => {
  const response = await api.get(`/users/${id}/categories`);
  return response.data;
};

export const getUserTodoItems = async id => {
  const response = await api.get(`/users/${id}/todoItems`);
  return response.data;
};

export const deleteUser = async id => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const createUser = async data => {
  const response = await api.post('/users/', data);
  return response.data;
};
