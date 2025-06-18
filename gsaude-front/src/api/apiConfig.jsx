import axios from 'axios';

export const apiConfig = {
  baseURL: 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
  },
};

const apiClient = axios.create(apiConfig);

export default apiClient;
