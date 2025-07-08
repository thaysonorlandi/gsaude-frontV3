// authService.js - Serviço para autenticação
import api from './api';

// Função para realizar login
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Função para registrar um novo usuário
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Função para realizar logout
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Função para verificar se o usuário está autenticado
export const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  return user !== null;
};

// Função para obter o tipo de usuário atual
export const getUserType = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    return userData.tipo;
  }
  return null;
};