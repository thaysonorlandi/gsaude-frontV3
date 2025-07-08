// api.js - Configuração central para requisições à API
import axios from 'axios';

// Cria uma instância do axios com a URL base da API
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // Ajuste para a URL correta do seu backend
  timeout: 10000, // Timeout de 10 segundos para requisições
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para incluir o token de autenticação em cada requisição
api.interceptors.request.use(
  config => {
    // Recupera o usuário do localStorage
    const user = localStorage.getItem('user');
    
    if (user) {
      const userData = JSON.parse(user);
      if (userData.token) {
        // Adiciona o token no cabeçalho de autorização
        config.headers['Authorization'] = `Bearer ${userData.token}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros nas respostas
api.interceptors.response.use(
  response => response,
  error => {
    // Se receber erro 401 (não autorizado), o token pode ter expirado
    if (error.response && error.response.status === 401) {
      // Limpa o localStorage e redireciona para login
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;