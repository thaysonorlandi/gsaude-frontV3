import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

// Componente para renderizar conteúdo baseado em permissões
export function PermissionGuard({ permission, children, fallback = null }) {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(permission)) {
    return fallback;
  }
  
  return children;
}

// Componente para renderizar conteúdo baseado no tipo de usuário
export function UserTypeGuard({ allowedTypes, children, fallback = null }) {
  const { userType } = usePermissions();
  
  if (!allowedTypes.includes(userType)) {
    return fallback;
  }
  
  return children;
}
