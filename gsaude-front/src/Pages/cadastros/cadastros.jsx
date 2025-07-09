import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  Chip,
  Divider,
  InputAdornment,
  Checkbox,
  FormGroup
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonIcon from '@mui/icons-material/Person';
import BiotechIcon from '@mui/icons-material/Biotech';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import api from '../../services/api';
import './cadastros.css';

export default function Cadastros() {
  // Estado para controle das abas
  const [tabValue, setTabValue] = useState(0);
  
  // Estados para médicos
  const [medicos, setMedicos] = useState([]);
  const [medicoForm, setMedicoForm] = useState({
    nome: '',
    crm: '',
    telefone: '',
    email: '',
    especialidades: [],
    procedimentos: [],
    ativo: true
  });
  const [editingMedico, setEditingMedico] = useState(null);
  const [showMedicoDialog, setShowMedicoDialog] = useState(false);

  // Estados para especialidades
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadeForm, setEspecialidadeForm] = useState({
    nome: '',
    descricao: '',
    ativo: true
  });
  const [editingEspecialidade, setEditingEspecialidade] = useState(null);
  const [showEspecialidadeDialog, setShowEspecialidadeDialog] = useState(false);

  // Estados para exames
  const [procedimentos, setProcedimentos] = useState([]);
  const [procedimentoForm, setProcedimentoForm] = useState({
    nome: '',
    descricao: '',
    valor: '',
    tempo_estimado: '',
    ativo: true
  });
  const [editingProcedimento, setEditingProcedimento] = useState(null);
  const [showProcedimentoDialog, setShowProcedimentoDialog] = useState(false);

  // Estado para notificações
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Carregar dados iniciais
  useEffect(() => {
    loadMedicos();
    loadEspecialidades();
    loadProcedimentos();
  }, []);

  // Funções para carregar dados
  const loadMedicos = async () => {
    try {
      const response = await api.get('/medicos');
      setMedicos(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao carregar médicos",
        severity: "error"
      });
    }
  };

  const loadEspecialidades = async () => {
    try {
      const response = await api.get('/especialidades');
      setEspecialidades(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao carregar especialidades",
        severity: "error"
      });
    }
  };

  const loadProcedimentos = async () => {
    try {
      const response = await api.get('/procedimentos');
      setProcedimentos(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erro ao carregar exames",
        severity: "error"
      });
    }
  };

  // CRUD Médicos
  const handleMedicoSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMedico) {
        await api.put(`/medicos/${editingMedico.id}`, medicoForm);
        setSnackbar({
          open: true,
          message: "Médico atualizado com sucesso!",
          severity: "success"
        });
      } else {
        await api.post('/medicos', medicoForm);
        setSnackbar({
          open: true,
          message: "Médico cadastrado com sucesso!",
          severity: "success"
        });
      }
      
      setShowMedicoDialog(false);
      resetMedicoForm();
      loadMedicos();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Erro ao salvar médico",
        severity: "error"
      });
    }
  };

  const handleEditMedico = (medico) => {
    setMedicoForm({
      nome: medico.nome,
      crm: medico.crm,
      telefone: medico.telefone || '',
      email: medico.email || '',
      especialidades: medico.especialidades?.map(e => e.id) || [],
      procedimentos: medico.procedimentos?.map(t => t.id) || [],
      ativo: medico.ativo
    });
    setEditingMedico(medico);
    setShowMedicoDialog(true);
  };

  const handleDeleteMedico = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este médico?')) {
      try {
        await api.delete(`/medicos/${id}`);
        setSnackbar({
          open: true,
          message: "Médico excluído com sucesso!",
          severity: "success"
        });
        loadMedicos();
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Erro ao excluir médico",
          severity: "error"
        });
      }
    }
  };

  const resetMedicoForm = () => {
    setMedicoForm({
      nome: '',
      crm: '',
      telefone: '',
      email: '',
      especialidades: [],
      procedimentos: [],
      ativo: true
    });
    setEditingMedico(null);
  };

  // CRUD Especialidades
  const handleEspecialidadeSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEspecialidade) {
        await api.put(`/especialidades/${editingEspecialidade.id}`, especialidadeForm);
        setSnackbar({
          open: true,
          message: "Especialidade atualizada com sucesso!",
          severity: "success"
        });
      } else {
        await api.post('/especialidades', especialidadeForm);
        setSnackbar({
          open: true,
          message: "Especialidade cadastrada com sucesso!",
          severity: "success"
        });
      }
      
      setShowEspecialidadeDialog(false);
      resetEspecialidadeForm();
      loadEspecialidades();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Erro ao salvar especialidade",
        severity: "error"
      });
    }
  };

  const handleEditEspecialidade = (especialidade) => {
    setEspecialidadeForm({
      nome: especialidade.nome,
      descricao: especialidade.descricao || '',
      ativo: especialidade.ativo
    });
    setEditingEspecialidade(especialidade);
    setShowEspecialidadeDialog(true);
  };

  const handleDeleteEspecialidade = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta especialidade?')) {
      try {
        await api.delete(`/especialidades/${id}`);
        setSnackbar({
          open: true,
          message: "Especialidade excluída com sucesso!",
          severity: "success"
        });
        loadEspecialidades();
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Erro ao excluir especialidade",
          severity: "error"
        });
      }
    }
  };

  const resetEspecialidadeForm = () => {
    setEspecialidadeForm({
      nome: '',
      descricao: '',
      ativo: true
    });
    setEditingEspecialidade(null);
  };

  // CRUD Exames
  const handleProcedimentoSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        ...procedimentoForm,
        valor: procedimentoForm.valor ? parseFloat(procedimentoForm.valor) : null,
        tempo_estimado: procedimentoForm.tempo_estimado ? parseInt(procedimentoForm.tempo_estimado) : null
      };

      if (editingProcedimento) {
        await api.put(`/procedimentos/${editingProcedimento.id}`, formData);
        setSnackbar({
          open: true,
          message: "Exame atualizado com sucesso!",
          severity: "success"
        });
      } else {
        await api.post('/procedimentos', formData);
        setSnackbar({
          open: true,
          message: "Exame cadastrado com sucesso!",
          severity: "success"
        });
      }
      
      setShowProcedimentoDialog(false);
      resetProcedimentoForm();
      loadProcedimentos();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Erro ao salvar exame",
        severity: "error"
      });
    }
  };

  const handleEditProcedimento = (exame) => {
    setProcedimentoForm({
      nome: exame.nome,
      descricao: exame.descricao || '',
      valor: exame.valor?.toString() || '',
      tempo_estimado: exame.tempo_estimado?.toString() || '',
      ativo: exame.ativo
    });
    setEditingProcedimento(exame);
    setShowProcedimentoDialog(true);
  };

  const handleDeleteProcedimento = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este exame?')) {
      try {
        await api.delete(`/procedimentos/${id}`);
        setSnackbar({
          open: true,
          message: "Exame excluído com sucesso!",
          severity: "success"
        });
        loadProcedimentos();
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Erro ao excluir exame",
          severity: "error"
        });
      }
    }
  };

  const resetProcedimentoForm = () => {
    setProcedimentoForm({
      nome: '',
      descricao: '',
      valor: '',
      tempo_estimado: '',
      ativo: true
    });
    setEditingProcedimento(null);
  };

  // Mudança de aba
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box className="cadastros-container">
      <Paper className="cadastros-paper">
        <Typography variant="h5" className="cadastros-titulo">
          <EventAvailableIcon className="cadastros-icon" />
          Cadastros
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Médicos" icon={<PersonIcon />} iconPosition="start" />
            <Tab label="Exames" icon={<BiotechIcon />} iconPosition="start" />
            <Tab label="Especialidades" icon={<AccessTimeIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Tab Médicos */}
        {tabValue === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <TextField
                variant="outlined"
                placeholder="Buscar médicos..."
                size="small"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                sx={{ width: '50%' }}
              />
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => {
                  resetMedicoForm();
                  setShowMedicoDialog(true);
                }}
              >
                Novo Médico
              </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>CRM</TableCell>
                    <TableCell>Especialidades</TableCell>
                    <TableCell>Telefone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {medicos.map((medico) => (
                    <TableRow key={medico.id}>
                      <TableCell>{medico.nome}</TableCell>
                      <TableCell>{medico.crm}</TableCell>
                      <TableCell>
                        {medico.especialidades?.map(e => e.nome).join(', ') || '-'}
                      </TableCell>
                      <TableCell>{medico.telefone || '-'}</TableCell>
                      <TableCell>{medico.email || '-'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={medico.ativo ? "Ativo" : "Inativo"} 
                          color={medico.ativo ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          color="primary" 
                          size="small"
                          onClick={() => handleEditMedico(medico)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          size="small"
                          onClick={() => handleDeleteMedico(medico.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Tab Exames */}
        {tabValue === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <TextField
                variant="outlined"
                placeholder="Buscar exames..."
                size="small"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                sx={{ width: '50%' }}
              />
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => {
                  resetProcedimentoForm();
                  setShowProcedimentoDialog(true);
                }}
              >
                Novo Exame
              </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Valor (R$)</TableCell>
                    <TableCell>Duração (min)</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {procedimentos.map((exame) => (
                    <TableRow key={exame.id}>
                      <TableCell>{exame.nome}</TableCell>
                      <TableCell>{exame.descricao || '-'}</TableCell>
                      <TableCell>
                        {exame.valor ? Number(exame.valor).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }) : '-'}
                      </TableCell>
                      <TableCell>{exame.tempo_estimado || '-'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={exame.ativo ? "Ativo" : "Inativo"} 
                          color={exame.ativo ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          color="primary" 
                          size="small"
                          onClick={() => handleEditProcedimento(exame)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          size="small"
                          onClick={() => handleDeleteProcedimento(exame.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Tab Especialidades */}
        {tabValue === 2 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <TextField
                variant="outlined"
                placeholder="Buscar especialidades..."
                size="small"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                sx={{ width: '50%' }}
              />
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => {
                  resetEspecialidadeForm();
                  setShowEspecialidadeDialog(true);
                }}
              >
                Nova Especialidade
              </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {especialidades.map((especialidade) => (
                    <TableRow key={especialidade.id}>
                      <TableCell>{especialidade.nome}</TableCell>
                      <TableCell>{especialidade.descricao || '-'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={especialidade.ativo ? "Ativo" : "Inativo"} 
                          color={especialidade.ativo ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          color="primary" 
                          size="small"
                          onClick={() => handleEditEspecialidade(especialidade)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          size="small"
                          onClick={() => handleDeleteEspecialidade(especialidade.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Paper>

      {/* Diálogo para Cadastro/Edição de Médico */}
      <Dialog open={showMedicoDialog} onClose={() => setShowMedicoDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingMedico ? 'Editar Médico' : 'Novo Médico'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="nome"
                label="Nome do Médico"
                value={medicoForm.nome}
                onChange={(e) => setMedicoForm({...medicoForm, nome: e.target.value})}
                fullWidth
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="crm"
                label="CRM"
                value={medicoForm.crm}
                onChange={(e) => setMedicoForm({...medicoForm, crm: e.target.value})}
                fullWidth
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="telefone"
                label="Telefone"
                value={medicoForm.telefone}
                onChange={(e) => setMedicoForm({...medicoForm, telefone: e.target.value})}
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="E-mail"
                type="email"
                value={medicoForm.email}
                onChange={(e) => setMedicoForm({...medicoForm, email: e.target.value})}
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                Especialidades
              </Typography>
              <FormGroup row>
                {especialidades.map((especialidade) => (
                  <FormControlLabel
                    key={especialidade.id}
                    control={
                      <Checkbox
                        checked={medicoForm.especialidades.includes(especialidade.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setMedicoForm({
                              ...medicoForm,
                              especialidades: [...medicoForm.especialidades, especialidade.id]
                            });
                          } else {
                            setMedicoForm({
                              ...medicoForm,
                              especialidades: medicoForm.especialidades.filter(id => id !== especialidade.id)
                            });
                          }
                        }}
                      />
                    }
                    label={especialidade.nome}
                  />
                ))}
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                Tipos de Exame
              </Typography>
              <FormGroup row>
                {procedimentos.map((exame) => (
                  <FormControlLabel
                    key={exame.id}
                    control={
                      <Checkbox
                        checked={medicoForm.procedimentos.includes(exame.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setMedicoForm({
                              ...medicoForm,
                              procedimentos: [...medicoForm.procedimentos, exame.id]
                            });
                          } else {
                            setMedicoForm({
                              ...medicoForm,
                              procedimentos: medicoForm.procedimentos.filter(id => id !== exame.id)
                            });
                          }
                        }}
                      />
                    }
                    label={exame.nome}
                  />
                ))}
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={medicoForm.ativo}
                    onChange={(e) => setMedicoForm({...medicoForm, ativo: e.target.checked})}
                    color="primary"
                  />
                }
                label="Médico ativo"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMedicoDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleMedicoSubmit}>Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para Cadastro/Edição de Exame */}
      <Dialog open={showProcedimentoDialog} onClose={() => setShowProcedimentoDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProcedimento ? 'Editar Exame' : 'Novo Exame'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="nome"
                label="Nome do Exame"
                value={procedimentoForm.nome}
                onChange={(e) => setProcedimentoForm({...procedimentoForm, nome: e.target.value})}
                fullWidth
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="descricao"
                label="Descrição"
                value={procedimentoForm.descricao}
                onChange={(e) => setProcedimentoForm({...procedimentoForm, descricao: e.target.value})}
                fullWidth
                multiline
                rows={2}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="valor"
                label="Valor (R$)"
                type="number"
                step="0.01"
                value={procedimentoForm.valor}
                onChange={(e) => setProcedimentoForm({...procedimentoForm, valor: e.target.value})}
                fullWidth
                margin="dense"
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="tempo_estimado"
                label="Tempo Estimado (min)"
                type="number"
                value={procedimentoForm.tempo_estimado}
                onChange={(e) => setProcedimentoForm({...procedimentoForm, tempo_estimado: e.target.value})}
                fullWidth
                margin="dense"
                InputProps={{
                  endAdornment: <InputAdornment position="end">min</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={procedimentoForm.ativo}
                    onChange={(e) => setProcedimentoForm({...procedimentoForm, ativo: e.target.checked})}
                    color="primary"
                  />
                }
                label="Exame ativo"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowProcedimentoDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleProcedimentoSubmit}>Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para Cadastro/Edição de Especialidade */}
      <Dialog open={showEspecialidadeDialog} onClose={() => setShowEspecialidadeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingEspecialidade ? 'Editar Especialidade' : 'Nova Especialidade'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="nome"
                label="Nome da Especialidade"
                value={especialidadeForm.nome}
                onChange={(e) => setEspecialidadeForm({...especialidadeForm, nome: e.target.value})}
                fullWidth
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="descricao"
                label="Descrição"
                value={especialidadeForm.descricao}
                onChange={(e) => setEspecialidadeForm({...especialidadeForm, descricao: e.target.value})}
                fullWidth
                multiline
                rows={2}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={especialidadeForm.ativo}
                    onChange={(e) => setEspecialidadeForm({...especialidadeForm, ativo: e.target.checked})}
                    color="primary"
                  />
                }
                label="Especialidade ativa"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEspecialidadeDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleEspecialidadeSubmit}>Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificações */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}