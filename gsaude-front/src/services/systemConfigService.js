import api from './api';

export const getSystemConfigs = async () => {
  try {
    const response = await api.get('/system-configs');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar configurações do sistema:', error);
    throw error;
  }
};

export const getSystemConfig = async (key) => {
  try {
    const response = await api.get(`/system-configs/${key}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar configuração ${key}:`, error);
    throw error;
  }
};

export const updateSystemConfig = async (key, value, type = 'string', description = null) => {
  try {
    const response = await api.put(`/system-configs/${key}`, {
      value,
      type,
      description
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar configuração ${key}:`, error);
    throw error;
  }
};
