import api from './api';

export const getSystemConfigs = async () => {
  const response = await api.get('/system-configs');
  return response.data;
};

export const getSystemConfig = async (key) => {
  const response = await api.get(`/system-configs/${key}`);
  return response.data;
};

export const updateSystemConfig = async (key, value, type = 'string', description = null) => {
  const response = await api.put(`/system-configs/${key}`, {
    value,
    type,
    description
  });
  return response.data;
};
