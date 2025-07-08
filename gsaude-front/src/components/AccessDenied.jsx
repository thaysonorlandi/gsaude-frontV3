import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';

export default function AccessDenied() {
  const navigate = useNavigate();
  const { isPaciente } = usePermissions();

  const handleGoBack = () => {
    if (isPaciente()) {
      navigate('/home/agendados');
    } else {
      navigate('/home');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: 3
      }}
    >
      <Typography variant="h4" color="error" gutterBottom>
        Acesso Negado
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Você não tem permissão para acessar esta página.
      </Typography>
      <Button 
        variant="contained" 
        onClick={handleGoBack}
        sx={{ mt: 2 }}
      >
        Voltar ao Início
      </Button>
    </Box>
  );
}
