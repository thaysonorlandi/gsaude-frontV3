// api.js - Configuração central para requisições à API
import axios from 'axios';

// Define a URL base da API baseada nas variáveis de ambiente
const getApiBaseUrl = () => {
  // Primeiro verifica se há uma URL salva no localStorage (configuração manual)
  const savedUrl = localStorage.getItem('apiUrl');
  if (savedUrl) {
    return savedUrl;
  }
  
  // Depois tenta usar a variável de ambiente
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback para localhost em desenvolvimento
  if (import.meta.env.DEV) {
    return 'http://localhost:8000/api/v1';
  }
  
  // Para produção, se não houver variável definida, usa um placeholder
  // que deve ser substituído pela URL real do ngrok
  return 'https://your-ngrok-url.ngrok.io/api/v1';
};

// Cria uma instância do axios com a URL base da API
const api = axios.create({
  baseURL: getApiBaseUrl(),
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