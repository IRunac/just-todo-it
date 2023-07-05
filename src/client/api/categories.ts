import api from './axios';

export const deleteCategory = async id => {
  const response = await api.delete(`/categories/${id}`);
  return response;
};

export const createCategory = async data => {
  const response = await api.post('/categories/', data);
  return response.data;
};
