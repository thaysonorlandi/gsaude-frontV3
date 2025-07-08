import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import AccessDenied from './AccessDenied';

// Componente para proteger rotas baseado em permissões
export default function ProtectedRoute({ children, requiredPermission }) {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(requiredPermission)) {
    return <AccessDenied />;
  }
  
  return children;
}
