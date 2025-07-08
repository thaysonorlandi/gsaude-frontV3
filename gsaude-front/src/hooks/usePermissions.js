import { useUser } from '../contexts/contexts';

// Definições de permissões por tipo de usuário
const USER_PERMISSIONS = {
  admin: {
    pages: ['agendamento', 'agendados', 'financeiro', 'cadastros', 'configuracoes'],
    canAccessAll: true
  },
  recepcao: {
    pages: ['agendamento', 'agendados', 'financeiro'],
    canAccessAll: false
  },
  paciente: {
    pages: ['agendados'],
    canAccessAll: false
  }
};

// Hook para verificar permissões
export function usePermissions() {
  const { usuario } = useUser();

  const hasPermission = (page) => {
    if (!usuario || !usuario.tipo) return false;
    
    const userPermissions = USER_PERMISSIONS[usuario.tipo];
    if (!userPermissions) return false;
    
    return userPermissions.canAccessAll || userPermissions.pages.includes(page);
  };

  const getAccessiblePages = () => {
    if (!usuario || !usuario.tipo) return [];
    
    const userPermissions = USER_PERMISSIONS[usuario.tipo];
    if (!userPermissions) return [];
    
    return userPermissions.pages;
  };

  const isAdmin = () => {
    return usuario && usuario.tipo === 'admin';
  };

  const isRecepcao = () => {
    return usuario && usuario.tipo === 'recepcao';
  };

  const isPaciente = () => {
    return usuario && usuario.tipo === 'paciente';
  };

  return {
    hasPermission,
    getAccessiblePages,
    isAdmin,
    isRecepcao,
    isPaciente,
    userType: usuario?.tipo || null
  };
}
