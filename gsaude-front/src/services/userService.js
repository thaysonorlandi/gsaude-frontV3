// userService.js - Serviço para gerenciamento de usuários
import api from './api';

// Função para buscar todos os usuários
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// Função para buscar um usuário específico
export const getUser = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// Função para criar um novo usuário
export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

// Função para atualizar um usuário
export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

// Função para excluir um usuário
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// Função para buscar usuários ativos
export const getActiveUsers = async () => {
  const response = await api.get('/users/active');
  return response.data;
};
