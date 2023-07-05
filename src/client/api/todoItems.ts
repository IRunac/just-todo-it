import api from './axios';

export const deleteTodoItem = async id => {
  const response = await api.delete(`/todoItems/${id}`);
  return response;
};

export const createTodoItem = async data => {
  const response = await api.post('/todoItems/', data);
  return response.data;
};
