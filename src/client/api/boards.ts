import api from './axios';

export const deleteBoard = async id => {
  const response = await api.delete(`/boards/${id}`);
  return response;
};

export const createBoard = async data => {
  const response = await api.post('/boards/', data);
  return response.data;
};
