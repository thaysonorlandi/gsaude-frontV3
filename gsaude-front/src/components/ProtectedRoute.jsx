import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/contexts';
import { usePermissions } from '../hooks/usePermissions';

// Componente para proteger rotas baseado no usuário e suas permissões
export default function ProtectedRoute({ children, requiredPage = null }) {
  const location = useLocation();
  const { usuario } = useUser();
  const { hasPermission, isPaciente } = usePermissions();
  
  // Se não estiver autenticado, redireciona para o login
  if (!usuario) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  // Se for paciente e tentar acessar uma página que não é agendados, redireciona
  if (isPaciente() && requiredPage !== 'agendados') {
    return <Navigate to="/home/agendados" replace />;
  }
  
  // Se a página requerer permissão específica e o usuário não tiver, redireciona
  if (requiredPage && !hasPermission(requiredPage)) {
    // Redireciona para uma página adequada ao tipo de usuário
    if (isPaciente()) {
      return <Navigate to="/home/agendados" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }
  
  // Se passar por todas as verificações, renderiza o componente filho
  return children;
}
