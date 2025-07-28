import { useUser } from '../contexts/contexts';

export function usePermissions() {
  const { usuario } = useUser();

  // Verifica se o usuário tem permissão para acessar uma determinada página ou recurso
  function hasPermission(page) {
    if (!usuario || !usuario.tipo) return false;
    
    // Define as permissões de acordo com o tipo de usuário
    const USER_PERMISSIONS = {
      admin: {
        pages: ['agendamento', 'agendados', 'financeiro', 'cadastros', 'relatorios', 'configuracoes'],
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
    
    const userPermissions = USER_PERMISSIONS[usuario.tipo];
    if (!userPermissions) return false;
    
    return userPermissions.canAccessAll || userPermissions.pages.includes(page);
  }
  
  // Verifica se o usuário é do tipo paciente
  function isPaciente() {
    return usuario && usuario.tipo === 'paciente';
  }
  
  // Verifica se o usuário é do tipo admin
  function isAdmin() {
    return usuario && usuario.tipo === 'admin';
  }
  
  // Verifica se o usuário é do tipo recepção
  function isRecepcao() {
    return usuario && usuario.tipo === 'recepcao';
  }

  return { hasPermission, isPaciente, isAdmin, isRecepcao };
}