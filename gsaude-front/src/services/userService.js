// userService.js - Serviço para gerenciamento de usuários
import api from './api';

// Função para buscar todos os usuários
export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
};

// Função para buscar um usuário específico
export const getUser = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
};

// Função para criar um novo usuário
export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};

// Função para atualizar um usuário
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
};

// Função para excluir um usuário
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    throw error;
  }
};

// Função para buscar usuários ativos
export const getActiveUsers = async () => {
  try {
    const response = await api.get('/users/active');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários ativos:', error);
    throw error;
  }
};
