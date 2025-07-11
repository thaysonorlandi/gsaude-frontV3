import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Typography, 
  Alert,
  Box
} from '@mui/material';
import api from '../services/api';

const ApiConfigDialog = ({ open, onClose }) => {
  const [apiUrl, setApiUrl] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  useEffect(() => {
    if (open) {
      // Carrega a URL atual da API
      const currentUrl = localStorage.getItem('apiUrl') || import.meta.env.VITE_API_URL || '';
      setApiUrl(currentUrl);
    }
  }, [open]);

  const validateApiUrl = async () => {
    if (!apiUrl.trim()) {
      setValidationResult({ success: false, message: 'Por favor, insira uma URL válida' });
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      // Testa a conectividade com a API
      const response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        setValidationResult({ 
          success: true, 
          message: 'Conexão com a API estabelecida com sucesso!' 
        });
      } else {
        setValidationResult({ 
          success: false, 
          message: `Erro na conexão: ${response.status} ${response.statusText}` 
        });
      }
    } catch (error) {
      setValidationResult({ 
        success: false, 
        message: `Erro de conexão: ${error.message}` 
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = () => {
    if (validationResult?.success) {
      // Salva a URL no localStorage
      localStorage.setItem('apiUrl', apiUrl);
      
      // Atualiza a configuração da instância do axios
      api.defaults.baseURL = apiUrl;
      
      onClose();
    } else {
      setValidationResult({ 
        success: false, 
        message: 'Por favor, valide a URL da API antes de salvar' 
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Configurar URL da API</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Configure a URL da API do ngrok para conectar com o backend.
            Exemplo: https://abc123.ngrok.io/api/v1
          </Typography>
        </Box>
        
        <TextField
          autoFocus
          margin="dense"
          label="URL da API"
          fullWidth
          variant="outlined"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          placeholder="https://abc123.ngrok.io/api/v1"
          sx={{ mb: 2 }}
        />

        <Button
          onClick={validateApiUrl}
          variant="outlined"
          disabled={isValidating || !apiUrl.trim()}
          sx={{ mb: 2 }}
        >
          {isValidating ? 'Validando...' : 'Testar Conexão'}
        </Button>

        {validationResult && (
          <Alert 
            severity={validationResult.success ? 'success' : 'error'}
            sx={{ mb: 2 }}
          >
            {validationResult.message}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={!validationResult?.success}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApiConfigDialog;
