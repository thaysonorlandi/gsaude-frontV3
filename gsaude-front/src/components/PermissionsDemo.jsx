import React from 'react';
import { Box, Typography, Alert, Divider } from '@mui/material';
import { usePermissions } from '../hooks/usePermissions';
import { useUser } from '../contexts/contexts';

export default function PermissionsDemo() {
  const { hasPermission, getAccessiblePages, userType } = usePermissions();
  const { usuario } = useUser();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Sistema de Permissões
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Sistema configurado com 3 tipos de usuário: Admin, Recepção e Paciente
      </Alert>

      {usuario && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Usuário Atual:</Typography>
          <Typography>Nome: {usuario.nome}</Typography>
          <Typography>Tipo: {userType}</Typography>
        </Box>
      )}

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6" gutterBottom>
        Permissões por Tipo de Usuário:
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" color="primary">
          🔹 Admin:
        </Typography>
        <Typography variant="body2">
          • Acesso total (Agendamento, Agendados, Financeiro, Cadastros, Configurações)
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" color="secondary">
          🔹 Recepção:
        </Typography>
        <Typography variant="body2">
          • Agendamento, Agendados, Financeiro
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" color="warning.main">
          🔹 Paciente:
        </Typography>
        <Typography variant="body2">
          • Apenas Agendados
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6" gutterBottom>
        Para testar o sistema, faça login com:
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        • "admin" - para acesso de administrador
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        • "recepcao" - para acesso de recepção
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        • "paciente" - para acesso de paciente
      </Typography>

      {usuario && (
        <>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="h6" gutterBottom>
            Suas Páginas Acessíveis:
          </Typography>
          {getAccessiblePages().map((page) => (
            <Typography key={page} variant="body2">
              • {page}
            </Typography>
          ))}
        </>
      )}
    </Box>
  );
}
