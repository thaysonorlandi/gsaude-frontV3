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
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonIcon from '@mui/icons-material/Person';
import BiotechIcon from '@mui/icons-material/Biotech';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LinkIcon from '@mui/icons-material/Link';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
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
    especialidade_id: '',
    ativo: true
  });
  const [editingMedico, setEditingMedico] = useState(null);
  const [showMedicoDialog, setShowMedicoDialog] = useState(false);

  // Estados para horários
  const [selectedMedicoForHorario, setSelectedMedicoForHorario] = useState(null);
  const [showHorarioDialog, setShowHorarioDialog] = useState(false);
  const [horarioForm, setHorarioForm] = useState({
    dia_semana: '',
    hora_inicio: '',
    hora_fim: '',
    intervalo_minutos: 30,
    ativo: true
  });

  // Estados para especialidades
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadeForm, setEspecialidadeForm] = useState({
    nome: '',
    descricao: '',
    ativo: true
  });
  const [editingEspecialidade, setEditingEspecialidade] = useState(null);
  const [showEspecialidadeDialog, setShowEspecialidadeDialog] = useState(false);

  // Estados para procedimentos
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

  // Estados para vinculação de médicos a procedimentos
  const [selectedProcedimentoForVinculo, setSelectedProcedimentoForVinculo] = useState(null);
  const [showVinculoDialog, setShowVinculoDialog] = useState(false);
  const [vinculoForm, setVinculoForm] = useState({
    medico_id: ''
  });

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
      console.error('Erro ao carregar médicos:', error);
      setSnackbar({
        open: true,
        message: "Erro ao carregar médicos: " + (error.response?.data?.message || error.message),
        severity: "error"
      });
    }
  };

  const loadEspecialidades = async () => {
    try {
      const response = await api.get('/especialidades');
      setEspecialidades(response.data);
    } catch (error) {
      console.error('Erro ao carregar especialidades:', error);
      setSnackbar({
        open: true,
        message: "Erro ao carregar especialidades: " + (error.response?.data?.message || error.message),
        severity: "error"
      });
    }
  };

  const loadProcedimentos = async () => {
    try {
      const response = await api.get('/procedimentos');
      setProcedimentos(response.data);
    } catch (error) {
      console.error('Erro ao carregar procedimentos:', error);
      setSnackbar({
        open: true,
        message: "Erro ao carregar procedimentos: " + (error.response?.data?.message || error.message),
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
      especialidade_id: medico.especialidades?.[0]?.id || '',
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
      especialidade_id: '',
      ativo: true
    });
    setEditingMedico(null);
  };

  // CRUD Horários
  const handleOpenHorarioDialog = (medico) => {
    setSelectedMedicoForHorario(medico);
    setShowHorarioDialog(true);
  };

  const handleHorarioSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/medicos/${selectedMedicoForHorario.id}/horarios`, horarioForm);
      setSnackbar({
        open: true,
        message: "Horário adicionado com sucesso!",
        severity: "success"
      });
      setShowHorarioDialog(false);
      resetHorarioForm();
      loadMedicos();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Erro ao adicionar horário",
        severity: "error"
      });
    }
  };

  const handleDeleteHorario = async (medicoId, horarioId) => {
    if (window.confirm('Tem certeza que deseja excluir este horário?')) {
      try {
        await api.delete(`/medicos/${medicoId}/horarios/${horarioId}`);
        setSnackbar({
          open: true,
          message: "Horário removido com sucesso!",
          severity: "success"
        });
        loadMedicos();
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Erro ao remover horário",
          severity: "error"
        });
      }
    }
  };

  const resetHorarioForm = () => {
    setHorarioForm({
      dia_semana: '',
      hora_inicio: '',
      hora_fim: '',
      intervalo_minutos: 30,
      ativo: true
    });
  };

  const getDiaSemanaTexto = (dia) => {
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return dias[dia] || 'N/A';
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

  // CRUD Procedimentos
  const handleProcedimentoSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProcedimento) {
        await api.put(`/procedimentos/${editingProcedimento.id}`, procedimentoForm);
        setSnackbar({
          open: true,
          message: "Procedimento atualizado com sucesso!",
          severity: "success"
        });
      } else {
        await api.post('/procedimentos', procedimentoForm);
        setSnackbar({
          open: true,
          message: "Procedimento cadastrado com sucesso!",
          severity: "success"
        });
      }
      
      setShowProcedimentoDialog(false);
      resetProcedimentoForm();
      loadProcedimentos();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Erro ao salvar procedimento",
        severity: "error"
      });
    }
  };

  const handleEditProcedimento = (procedimento) => {
    setProcedimentoForm({
      nome: procedimento.nome,
      descricao: procedimento.descricao || '',
      valor: procedimento.valor?.toString() || '',
      tempo_estimado: procedimento.tempo_estimado?.toString() || '',
      ativo: procedimento.ativo
    });
    setEditingProcedimento(procedimento);
    setShowProcedimentoDialog(true);
  };

  const handleDeleteProcedimento = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este procedimento?')) {
      try {
        await api.delete(`/procedimentos/${id}`);
        setSnackbar({
          open: true,
          message: "Procedimento excluído com sucesso!",
          severity: "success"
        });
        loadProcedimentos();
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Erro ao excluir procedimento",
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

  // Vinculação de médicos a procedimentos
  const handleOpenVinculoDialog = (procedimento) => {
    setSelectedProcedimentoForVinculo(procedimento);
    setShowVinculoDialog(true);
    setVinculoForm({ medico_id: '' });
  };

  const handleVinculoSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/procedimentos/${selectedProcedimentoForVinculo.id}/medicos`, vinculoForm);
      setSnackbar({
        open: true,
        message: "Médico vinculado com sucesso!",
        severity: "success"
      });
      setShowVinculoDialog(false);
      setVinculoForm({ medico_id: '' });
      loadProcedimentos();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Erro ao vincular médico",
        severity: "error"
      });
    }
  };

  const handleDesvincularMedico = async (procedimentoId, medicoId) => {
    if (window.confirm('Tem certeza que deseja desvincular este médico do procedimento?')) {
      try {
        await api.delete(`/procedimentos/${procedimentoId}/medicos/${medicoId}`);
        setSnackbar({
          open: true,
          message: "Médico desvinculado com sucesso!",
          severity: "success"
        });
        loadProcedimentos();
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Erro ao desvincular médico",
          severity: "error"
        });
      }
    }
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
            <Tab label="Procedimentos" icon={<BiotechIcon />} iconPosition="start" />
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
                    <TableCell>Especialidade</TableCell>
                    <TableCell>Telefone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {medicos.map((medico) => (
                    <React.Fragment key={medico.id}>
                      <TableRow>
                        <TableCell>{medico.nome}</TableCell>
                        <TableCell>{medico.crm}</TableCell>
                        <TableCell>
                          {medico.especialidades?.[0]?.nome || '-'}
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
                            color="secondary" 
                            size="small"
                            onClick={() => handleOpenHorarioDialog(medico)}
                          >
                            <ScheduleIcon fontSize="small" />
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
                      {medico.horarios && medico.horarios.length > 0 && (
                        <TableRow>
                          <TableCell colSpan={7}>
                            <Accordion>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="body2">
                                  Horários de Atendimento ({medico.horarios.length})
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Grid container spacing={1}>
                                  {medico.horarios.map((horario) => (
                                    <Grid item xs={12} sm={6} md={4} key={horario.id}>
                                      <Paper variant="outlined" sx={{ p: 1 }}>
                                        <Typography variant="caption">
                                          <strong>{getDiaSemanaTexto(horario.dia_semana)}</strong><br />
                                          {horario.hora_inicio} às {horario.hora_fim}<br />
                                          Intervalo: {horario.intervalo_minutos}min
                                        </Typography>
                                        <Box sx={{ mt: 1 }}>
                                          <IconButton 
                                            size="small" 
                                            color="error"
                                            onClick={() => handleDeleteHorario(medico.id, horario.id)}
                                          >
                                            <DeleteIcon fontSize="small" />
                                          </IconButton>
                                        </Box>
                                      </Paper>
                                    </Grid>
                                  ))}
                                </Grid>
                              </AccordionDetails>
                            </Accordion>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Tab Procedimentos */}
        {tabValue === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <TextField
                variant="outlined"
                placeholder="Buscar procedimentos..."
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
                Novo Procedimento
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
                  {procedimentos.map((procedimento) => (
                    <React.Fragment key={procedimento.id}>
                      <TableRow>
                        <TableCell>{procedimento.nome}</TableCell>
                        <TableCell>{procedimento.descricao || '-'}</TableCell>
                        <TableCell>
                          {procedimento.valor ? Number(procedimento.valor).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }) : '-'}
                        </TableCell>
                        <TableCell>{procedimento.tempo_estimado || '-'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={procedimento.ativo ? "Ativo" : "Inativo"} 
                            color={procedimento.ativo ? "success" : "default"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton 
                            color="primary" 
                            size="small"
                            onClick={() => handleEditProcedimento(procedimento)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            color="secondary" 
                            size="small"
                            onClick={() => handleOpenVinculoDialog(procedimento)}
                            title="Vincular Médicos"
                          >
                            <LinkIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            size="small"
                            onClick={() => handleDeleteProcedimento(procedimento.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      {procedimento.medicos && procedimento.medicos.length > 0 && (
                        <TableRow>
                          <TableCell colSpan={6}>
                            <Accordion>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="body2">
                                  Médicos Vinculados ({procedimento.medicos.length})
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <List dense>
                                  {procedimento.medicos.map((medico) => (
                                    <ListItem key={medico.id} divider>
                                      <ListItemText
                                        primary={medico.nome}
                                        secondary={`CRM: ${medico.crm}`}
                                      />
                                      <ListItemSecondaryAction>
                                        <IconButton 
                                          edge="end" 
                                          color="error" 
                                          size="small"
                                          onClick={() => handleDesvincularMedico(procedimento.id, medico.id)}
                                          title="Desvincular médico"
                                        >
                                          <RemoveCircleOutlineIcon fontSize="small" />
                                        </IconButton>
                                      </ListItemSecondaryAction>
                                    </ListItem>
                                  ))}
                                </List>
                              </AccordionDetails>
                            </Accordion>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
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

      {/* Diálogo para Adicionar/Editar Médico */}
      <Dialog open={showMedicoDialog} onClose={() => setShowMedicoDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingMedico ? 'Editar Médico' : 'Novo Médico'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="nome"
                label="Nome"
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
                label="Email"
                type="email"
                value={medicoForm.email}
                onChange={(e) => setMedicoForm({...medicoForm, email: e.target.value})}
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="dense" required>
                <InputLabel>Especialidade</InputLabel>
                <Select
                  name="especialidade_id"
                  value={medicoForm.especialidade_id}
                  label="Especialidade"
                  onChange={(e) => setMedicoForm({...medicoForm, especialidade_id: e.target.value})}
                  sx={{ minWidth: 200 }}
                >
                  {especialidades.map((especialidade) => (
                    <MenuItem key={especialidade.id} value={especialidade.id}>
                      {especialidade.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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

      {/* Diálogo para Adicionar Horário */}
      <Dialog open={showHorarioDialog} onClose={() => setShowHorarioDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Adicionar Horário - {selectedMedicoForHorario?.nome}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth margin="dense" required>
                <InputLabel>Dia da Semana</InputLabel>
                <Select
                  name="dia_semana"
                  value={horarioForm.dia_semana}
                  label="Dia da Semana"
                  onChange={(e) => setHorarioForm({...horarioForm, dia_semana: e.target.value})}
                  sx={{ minWidth: 200 }}
                >
                  <MenuItem value={0}>Domingo</MenuItem>
                  <MenuItem value={1}>Segunda-feira</MenuItem>
                  <MenuItem value={2}>Terça-feira</MenuItem>
                  <MenuItem value={3}>Quarta-feira</MenuItem>
                  <MenuItem value={4}>Quinta-feira</MenuItem>
                  <MenuItem value={5}>Sexta-feira</MenuItem>
                  <MenuItem value={6}>Sábado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="hora_inicio"
                label="Hora Início"
                type="time"
                value={horarioForm.hora_inicio}
                onChange={(e) => setHorarioForm({...horarioForm, hora_inicio: e.target.value})}
                fullWidth
                required
                margin="dense"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="hora_fim"
                label="Hora Fim"
                type="time"
                value={horarioForm.hora_fim}
                onChange={(e) => setHorarioForm({...horarioForm, hora_fim: e.target.value})}
                fullWidth
                required
                margin="dense"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="dense" required>
                <InputLabel>Intervalo entre Consultas</InputLabel>
                <Select
                  name="intervalo_minutos"
                  value={horarioForm.intervalo_minutos}
                  label="Intervalo entre Consultas"
                  onChange={(e) => setHorarioForm({...horarioForm, intervalo_minutos: e.target.value})}
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value={15}>15 minutos</MenuItem>
                  <MenuItem value={30}>30 minutos</MenuItem>
                  <MenuItem value={45}>45 minutos</MenuItem>
                  <MenuItem value={60}>60 minutos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={horarioForm.ativo}
                    onChange={(e) => setHorarioForm({...horarioForm, ativo: e.target.checked})}
                    color="primary"
                  />
                }
                label="Horário ativo"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHorarioDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleHorarioSubmit}>Adicionar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para Adicionar/Editar Procedimento */}
      <Dialog open={showProcedimentoDialog} onClose={() => setShowProcedimentoDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProcedimento ? 'Editar Procedimento' : 'Novo Procedimento'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="nome"
                label="Nome do Procedimento"
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
                rows={3}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="valor"
                label="Valor (R$)"
                type="number"
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
                label="Tempo Estimado (minutos)"
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
                label="Procedimento ativo"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowProcedimentoDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleProcedimentoSubmit}>Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para Adicionar/Editar Especialidade */}
      <Dialog open={showEspecialidadeDialog} onClose={() => setShowEspecialidadeDialog(false)} maxWidth="md" fullWidth>
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
                rows={3}
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

      {/* Diálogo para Vincular Médico ao Procedimento */}
      <Dialog open={showVinculoDialog} onClose={() => setShowVinculoDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Vincular Médico - {selectedProcedimentoForVinculo?.nome}
        </DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth margin="dense" required>
            <InputLabel>Selecionar Médico</InputLabel>
            <Select
              name="medico_id"
              value={vinculoForm.medico_id}
              label="Selecionar Médico"
              onChange={(e) => setVinculoForm({...vinculoForm, medico_id: e.target.value})}
            >
              {medicos
                .filter(medico => 
                  !selectedProcedimentoForVinculo?.medicos?.some(m => m.id === medico.id)
                )
                .map((medico) => (
                  <MenuItem key={medico.id} value={medico.id}>
                    {medico.nome} - CRM: {medico.crm}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowVinculoDialog(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleVinculoSubmit}
            disabled={!vinculoForm.medico_id}
          >
            Vincular
          </Button>
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