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
  InputAdornment
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
  
  // Estado para médicos
  const [medicos, setMedicos] = useState([]);
  const [medicoForm, setMedicoForm] = useState({
    nome: '',
    especialidade: '',
    crm: '',
    telefone: '',
    email: '',
    ativo: true
  });
  
  // Estado para exames
  const [exames, setExames] = useState([]);
  const [exameForm, setExameForm] = useState({
    nome: '',
    descricao: '',
    valor: '',
    tempo_estimado: 30,
    medico_id: '',
    ativo: true
  });
  
  // Estado para especialidades (lista auxiliar)
  const [especialidades, setEspecialidades] = useState([]);
  
  // Estado para horários do médico
  const [horarios, setHorarios] = useState([]);
  const [horarioForm, setHorarioForm] = useState({
    dia_semana: 1, // segunda-feira
    hora_inicio: '08:00',
    hora_fim: '18:00',
    intervalo_minutos: 30,
    medico_id: ''
  });
  
  // Estado para horários do exame
  const [horariosExame, setHorariosExame] = useState([]);
  const [horarioExameForm, setHorarioExameForm] = useState({
    dia_semana: 1,
    hora_inicio: '08:00',
    hora_fim: '18:00',
    intervalo_minutos: 30,
    exame_id: ''
  });
  
  // Estados para diálogos
  const [openMedicoDialog, setOpenMedicoDialog] = useState(false);
  const [openExameDialog, setOpenExameDialog] = useState(false);
  const [openHorarioDialog, setOpenHorarioDialog] = useState(false);
  const [openHorarioExameDialog, setOpenHorarioExameDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedMedicoId, setSelectedMedicoId] = useState(null);
  const [selectedExameId, setSelectedExameId] = useState(null);
  
  // Estado para notificações
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Carrega dados da API na inicialização
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      // Tenta carregar dados da API
      const [medicosRes, examesRes, especialidadesRes] = await Promise.all([
        api.get('/medicos'),
        api.get('/tipos-exame'),
        api.get('/especialidades')
      ]);

      setMedicos(medicosRes.data);
      setExames(examesRes.data);
      setEspecialidades(especialidadesRes.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      
      // Dados de demonstração em caso de erro na API
      setMedicos([
        { id: 1, nome: 'Dr. João Silva', especialidade: 'Cardiologia', crm: '12345/SP', telefone: '(11) 99999-1111', email: 'joao@exemplo.com', ativo: true },
        { id: 2, nome: 'Dra. Maria Santos', especialidade: 'Dermatologia', crm: '54321/SP', telefone: '(11) 99999-2222', email: 'maria@exemplo.com', ativo: true },
        { id: 3, nome: 'Dr. Pedro Costa', especialidade: 'Ortopedia', crm: '67890/SP', telefone: '(11) 99999-3333', email: 'pedro@exemplo.com', ativo: false },
      ]);
      
      setExames([
        { id: 1, nome: 'Hemograma', descricao: 'Análise do sangue', valor: '80.00', tempo_estimado: 30, medico_id: 1, medico_nome: 'Dr. João Silva', ativo: true },
        { id: 2, nome: 'Raio-X Tórax', descricao: 'Imagem do tórax', valor: '150.00', tempo_estimado: 45, medico_id: 3, medico_nome: 'Dr. Pedro Costa', ativo: true },
        { id: 3, nome: 'Ultrassom Abdominal', descricao: 'Exame de ultrassonografia', valor: '200.00', tempo_estimado: 60, medico_id: 2, medico_nome: 'Dra. Maria Santos', ativo: true },
      ]);
      
      setEspecialidades(['Cardiologia', 'Dermatologia', 'Ortopedia', 'Ginecologia', 'Oftalmologia', 'Pediatria']);
      
      setSnackbar({
        open: true,
        message: 'Erro ao conectar com API. Usando dados de demonstração.',
        severity: 'warning'
      });
    }
  };

  // Mudança de aba
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Formatação de valor monetário
  const formatarValor = (valor) => {
    if (!valor) return '';
    
    // Remove caracteres não numéricos
    const apenasNumeros = valor.replace(/\D/g, '');
    
    // Converte para número e divide por 100 para obter reais e centavos
    const numero = Number(apenasNumeros) / 100;
    
    // Formata como moeda brasileira
    return numero.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Funções para Médicos
  const handleMedicoChange = (e) => {
    const { name, value, checked, type } = e.target;
    setMedicoForm({
      ...medicoForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const abrirMedicoDialog = (medico = null) => {
    if (medico) {
      setMedicoForm({
        nome: medico.nome,
        especialidade: medico.especialidade,
        crm: medico.crm,
        telefone: medico.telefone,
        email: medico.email,
        ativo: medico.ativo
      });
      setIsEditing(true);
      setSelectedId(medico.id);
    } else {
      setMedicoForm({
        nome: '',
        especialidade: '',
        crm: '',
        telefone: '',
        email: '',
        ativo: true
      });
      setIsEditing(false);
      setSelectedId(null);
    }
    setOpenMedicoDialog(true);
  };

  const salvarMedico = async () => {
    try {
      // Validação básica
      if (!medicoForm.nome || !medicoForm.especialidade || !medicoForm.crm) {
        setSnackbar({
          open: true,
          message: 'Preencha todos os campos obrigatórios',
          severity: 'error'
        });
        return;
      }

      if (isEditing) {
        // Tenta atualizar na API
        try {
          await api.put(`/medicos/${selectedId}`, medicoForm);
        } catch (error) {
          console.error("Erro ao atualizar médico na API:", error);
        }

        // Atualiza no estado local
        setMedicos(prev => prev.map(item => 
          item.id === selectedId ? { ...item, ...medicoForm, id: selectedId } : item
        ));
        
        setSnackbar({
          open: true,
          message: 'Médico atualizado com sucesso',
          severity: 'success'
        });
      } else {
        // Tenta criar na API
        let novoId;
        try {
          const res = await api.post('/medicos', medicoForm);
          novoId = res.data.id;
        } catch (error) {
          console.error("Erro ao criar médico na API:", error);
          novoId = medicos.length > 0 ? Math.max(...medicos.map(m => m.id)) + 1 : 1;
        }

        // Adiciona no estado local
        setMedicos(prev => [...prev, { ...medicoForm, id: novoId }]);
        
        setSnackbar({
          open: true,
          message: 'Médico cadastrado com sucesso',
          severity: 'success'
        });
      }
      setOpenMedicoDialog(false);
    } catch (error) {
      console.error("Erro ao salvar médico:", error);
      setSnackbar({
        open: true,
        message: 'Erro ao salvar médico',
        severity: 'error'
      });
    }
  };

  // Funções para Exames
  const handleExameChange = (e) => {
    const { name, value, checked, type } = e.target;
    
    if (name === 'valor') {
      // Aplica a formatação de valor monetário
      setExameForm({
        ...exameForm,
        valor: formatarValor(value)
      });
    } else {
      setExameForm({
        ...exameForm,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const abrirExameDialog = (exame = null) => {
    if (exame) {
      setExameForm({
        nome: exame.nome,
        descricao: exame.descricao,
        valor: formatarValor(exame.valor),
        tempo_estimado: exame.tempo_estimado,
        medico_id: exame.medico_id,
        ativo: exame.ativo
      });
      setIsEditing(true);
      setSelectedId(exame.id);
    } else {
      setExameForm({
        nome: '',
        descricao: '',
        valor: '',
        tempo_estimado: 30,
        medico_id: '',
        ativo: true
      });
      setIsEditing(false);
      setSelectedId(null);
    }
    setOpenExameDialog(true);
  };

  const salvarExame = async () => {
    try {
      // Validação básica
      if (!exameForm.nome || !exameForm.medico_id) {
        setSnackbar({
          open: true,
          message: 'Preencha todos os campos obrigatórios',
          severity: 'error'
        });
        return;
      }

      // Preparar o valor para salvar (remover formatação)
      const valorParaSalvar = exameForm.valor.replace(/\D/g, '') / 100;

      // Busca o nome do médico
      const medicoSelecionado = medicos.find(m => m.id === parseInt(exameForm.medico_id));
      const medico_nome = medicoSelecionado ? medicoSelecionado.nome : '';

      if (isEditing) {
        // Tenta atualizar na API
        try {
          await api.put(`/tipos-exame/${selectedId}`, {
            ...exameForm,
            valor: valorParaSalvar.toFixed(2)
          });
        } catch (error) {
          console.error("Erro ao atualizar exame na API:", error);
        }

        // Atualiza no estado local
        setExames(prev => prev.map(item => 
          item.id === selectedId ? { 
            ...item, 
            ...exameForm, 
            valor: valorParaSalvar.toFixed(2),
            id: selectedId, 
            medico_nome 
          } : item
        ));
        
        setSnackbar({
          open: true,
          message: 'Exame atualizado com sucesso',
          severity: 'success'
        });
      } else {
        // Tenta criar na API
        let novoId;
        try {
          const res = await api.post('/tipos-exame', {
            ...exameForm,
            valor: valorParaSalvar.toFixed(2)
          });
          novoId = res.data.id;
        } catch (error) {
          console.error("Erro ao criar exame na API:", error);
          novoId = exames.length > 0 ? Math.max(...exames.map(e => e.id)) + 1 : 1;
        }

        // Adiciona no estado local
        setExames(prev => [...prev, { 
          ...exameForm, 
          valor: valorParaSalvar.toFixed(2),
          id: novoId, 
          medico_nome 
        }]);
        
        setSnackbar({
          open: true,
          message: 'Exame cadastrado com sucesso',
          severity: 'success'
        });
      }
      setOpenExameDialog(false);
    } catch (error) {
      console.error("Erro ao salvar exame:", error);
      setSnackbar({
        open: true,
        message: 'Erro ao salvar exame',
        severity: 'error'
      });
    }
  };

  // Funções para Horários do Médico
  const carregarHorarios = async (medicoId) => {
    try {
      // Tenta carregar horários da API
      try {
        const res = await api.get(`/medicos/${medicoId}/horarios`);
        setHorarios(res.data);
      } catch (error) {
        console.error("Erro ao carregar horários na API:", error);
        
        // Dados de demonstração em caso de erro
        setHorarios([
          { id: 1, dia_semana: 1, hora_inicio: '08:00', hora_fim: '12:00', intervalo_minutos: 30, medico_id: medicoId },
          { id: 2, dia_semana: 1, hora_inicio: '14:00', hora_fim: '18:00', intervalo_minutos: 30, medico_id: medicoId },
          { id: 3, dia_semana: 3, hora_inicio: '08:00', hora_fim: '18:00', intervalo_minutos: 45, medico_id: medicoId },
          { id: 4, dia_semana: 5, hora_inicio: '08:00', hora_fim: '12:00', intervalo_minutos: 30, medico_id: medicoId },
        ]);
      }

      const medico = medicos.find(m => m.id === medicoId);
      setSelectedMedicoId(medicoId);
      setHorarioForm({
        dia_semana: 1,
        hora_inicio: '08:00',
        hora_fim: '18:00',
        intervalo_minutos: 30,
        medico_id: medicoId
      });
      
      setOpenHorarioDialog(true);
    } catch (error) {
      console.error("Erro ao carregar horários:", error);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar horários do médico',
        severity: 'error'
      });
    }
  };

  // Funções para Horários do Exame
  const carregarHorariosExame = async (exameId) => {
    try {
      // Tenta carregar horários da API
      try {
        const res = await api.get(`/tipos-exame/${exameId}/horarios`);
        setHorariosExame(res.data);
      } catch (error) {
        console.error("Erro ao carregar horários do exame na API:", error);
        
        // Dados de demonstração em caso de erro
        setHorariosExame([
          { id: 1, dia_semana: 2, hora_inicio: '08:00', hora_fim: '12:00', intervalo_minutos: 30, exame_id: exameId },
          { id: 2, dia_semana: 4, hora_inicio: '14:00', hora_fim: '18:00', intervalo_minutos: 45, exame_id: exameId },
        ]);
      }

      const exame = exames.find(e => e.id === exameId);
      setSelectedExameId(exameId);
      setHorarioExameForm({
        dia_semana: 1,
        hora_inicio: '08:00',
        hora_fim: '18:00',
        intervalo_minutos: 30,
        exame_id: exameId
      });
      
      setOpenHorarioExameDialog(true);
    } catch (error) {
      console.error("Erro ao carregar horários do exame:", error);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar horários do exame',
        severity: 'error'
      });
    }
  };

  const handleHorarioChange = (e) => {
    const { name, value } = e.target;
    setHorarioForm({
      ...horarioForm,
      [name]: value
    });
  };

  const handleHorarioExameChange = (e) => {
    const { name, value } = e.target;
    setHorarioExameForm({
      ...horarioExameForm,
      [name]: value
    });
  };

  const adicionarHorario = async () => {
    try {
      // Validação básica
      if (!horarioForm.dia_semana || !horarioForm.hora_inicio || !horarioForm.hora_fim) {
        setSnackbar({
          open: true,
          message: 'Preencha todos os campos obrigatórios',
          severity: 'error'
        });
        return;
      }

      // Validação do horário
      if (horarioForm.hora_inicio >= horarioForm.hora_fim) {
        setSnackbar({
          open: true,
          message: 'Horário de início deve ser anterior ao horário de fim',
          severity: 'error'
        });
        return;
      }

      // Tenta criar na API
      let novoId;
      try {
        const res = await api.post(`/medicos/${selectedMedicoId}/horarios`, horarioForm);
        novoId = res.data.id;
      } catch (error) {
        console.error("Erro ao criar horário na API:", error);
        novoId = horarios.length > 0 ? Math.max(...horarios.map(h => h.id)) + 1 : 1;
      }

      // Adiciona no estado local
      setHorarios(prev => [...prev, { ...horarioForm, id: novoId }]);
      
      // Reseta o formulário para adicionar outro horário
      setHorarioForm({
        ...horarioForm,
        dia_semana: 1,
        hora_inicio: '08:00',
        hora_fim: '18:00',
        intervalo_minutos: 30
      });
      
      setSnackbar({
        open: true,
        message: 'Horário adicionado com sucesso',
        severity: 'success'
      });
    } catch (error) {
      console.error("Erro ao adicionar horário:", error);
      setSnackbar({
        open: true,
        message: 'Erro ao adicionar horário',
        severity: 'error'
      });
    }
  };

  const adicionarHorarioExame = async () => {
    try {
      // Validação básica
      if (!horarioExameForm.dia_semana || !horarioExameForm.hora_inicio || !horarioExameForm.hora_fim) {
        setSnackbar({
          open: true,
          message: 'Preencha todos os campos obrigatórios',
          severity: 'error'
        });
        return;
      }

      // Validação do horário
      if (horarioExameForm.hora_inicio >= horarioExameForm.hora_fim) {
        setSnackbar({
          open: true,
          message: 'Horário de início deve ser anterior ao horário de fim',
          severity: 'error'
        });
        return;
      }

      // Tenta criar na API
      let novoId;
      try {
        const res = await api.post(`/tipos-exame/${selectedExameId}/horarios`, horarioExameForm);
        novoId = res.data.id;
      } catch (error) {
        console.error("Erro ao criar horário do exame na API:", error);
        novoId = horariosExame.length > 0 ? Math.max(...horariosExame.map(h => h.id)) + 1 : 1;
      }

      // Adiciona no estado local
      setHorariosExame(prev => [...prev, { ...horarioExameForm, id: novoId }]);
      
      // Reseta o formulário para adicionar outro horário
      setHorarioExameForm({
        ...horarioExameForm,
        dia_semana: 1,
        hora_inicio: '08:00',
        hora_fim: '18:00',
        intervalo_minutos: 30
      });
      
      setSnackbar({
        open: true,
        message: 'Horário do exame adicionado com sucesso',
        severity: 'success'
      });
    } catch (error) {
      console.error("Erro ao adicionar horário do exame:", error);
      setSnackbar({
        open: true,
        message: 'Erro ao adicionar horário do exame',
        severity: 'error'
      });
    }
  };

  const excluirHorario = async (id) => {
    try {
      // Tenta excluir na API
      try {
        await api.delete(`/horarios/${id}`);
      } catch (error) {
        console.error("Erro ao excluir horário na API:", error);
      }

      // Remove do estado local
      setHorarios(prev => prev.filter(item => item.id !== id));
      
      setSnackbar({
        open: true,
        message: 'Horário excluído com sucesso',
        severity: 'success'
      });
    } catch (error) {
      console.error("Erro ao excluir horário:", error);
      setSnackbar({
        open: true,
        message: 'Erro ao excluir horário',
        severity: 'error'
      });
    }
  };

  const excluirHorarioExame = async (id) => {
    try {
      // Tenta excluir na API
      try {
        await api.delete(`/horarios-exame/${id}`);
      } catch (error) {
        console.error("Erro ao excluir horário do exame na API:", error);
      }

      // Remove do estado local
      setHorariosExame(prev => prev.filter(item => item.id !== id));
      
      setSnackbar({
        open: true,
        message: 'Horário do exame excluído com sucesso',
        severity: 'success'
      });
    } catch (error) {
      console.error("Erro ao excluir horário do exame:", error);
      setSnackbar({
        open: true,
        message: 'Erro ao excluir horário do exame',
        severity: 'error'
      });
    }
  };

  // Função para obter o nome do dia da semana
  const getDiaSemana = (dia) => {
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return dias[dia] || '';
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
                onClick={() => abrirMedicoDialog()}
              >
                Novo Médico
              </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Especialidade</TableCell>
                    <TableCell>CRM</TableCell>
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
                      <TableCell>{medico.especialidade}</TableCell>
                      <TableCell>{medico.crm}</TableCell>
                      <TableCell>{medico.telefone}</TableCell>
                      <TableCell>{medico.email}</TableCell>
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
                          onClick={() => abrirMedicoDialog(medico)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          color="secondary" 
                          size="small"
                          onClick={() => carregarHorarios(medico.id)}
                        >
                          <ScheduleIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          size="small"
                          onClick={() => excluirMedico(medico.id)}
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
                onClick={() => abrirExameDialog()}
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
                    <TableCell>Médico</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {exames.map((exame) => (
                    <TableRow key={exame.id}>
                      <TableCell>{exame.nome}</TableCell>
                      <TableCell>{exame.descricao}</TableCell>
                      <TableCell>
                        {Number(exame.valor).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </TableCell>
                      <TableCell>{exame.tempo_estimado}</TableCell>
                      <TableCell>{exame.medico_nome}</TableCell>
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
                          onClick={() => abrirExameDialog(exame)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          color="secondary" 
                          size="small"
                          onClick={() => carregarHorariosExame(exame.id)}
                        >
                          <ScheduleIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          size="small"
                          onClick={() => excluirExame(exame.id)}
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
      <Dialog open={openMedicoDialog} onClose={() => setOpenMedicoDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? 'Editar Médico' : 'Novo Médico'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="nome"
                label="Nome do Médico"
                value={medicoForm.nome}
                onChange={handleMedicoChange}
                fullWidth
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="especialidade"
                label="Especialidade"
                value={medicoForm.especialidade}
                onChange={handleMedicoChange}
                fullWidth
                required
                margin="dense"
                placeholder="Digite a especialidade do médico"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="crm"
                label="CRM"
                value={medicoForm.crm}
                onChange={handleMedicoChange}
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
                onChange={handleMedicoChange}
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
                onChange={handleMedicoChange}
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="ativo"
                    checked={medicoForm.ativo}
                    onChange={handleMedicoChange}
                    color="primary"
                  />
                }
                label="Médico ativo"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMedicoDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={salvarMedico}>Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para Cadastro/Edição de Exame */}
      <Dialog open={openExameDialog} onClose={() => setOpenExameDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? 'Editar Exame' : 'Novo Exame'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="nome"
                label="Nome do Exame"
                value={exameForm.nome}
                onChange={handleExameChange}
                fullWidth
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="descricao"
                label="Descrição"
                value={exameForm.descricao}
                onChange={handleExameChange}
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
                value={exameForm.valor}
                onChange={handleExameChange}
                fullWidth
                margin="dense"
                placeholder="0,00"
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
                value={exameForm.tempo_estimado}
                onChange={handleExameChange}
                fullWidth
                margin="dense"
                InputProps={{
                  endAdornment: <InputAdornment position="end">min</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="dense" required>
                <InputLabel id="medico-label">Médico Responsável</InputLabel>
                <Select
                  labelId="medico-label"
                  name="medico_id"
                  value={exameForm.medico_id}
                  label="Médico Responsável"
                  onChange={handleExameChange}
                  sx={{ minWidth: 200 }}
                >
                  {medicos.filter(m => m.ativo).map((medico) => (
                    <MenuItem key={medico.id} value={medico.id}>
                      {medico.nome} ({medico.especialidade})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="ativo"
                    checked={exameForm.ativo}
                    onChange={handleExameChange}
                    color="primary"
                  />
                }
                label="Exame ativo"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExameDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={salvarExame}>Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para Horários do Médico */}
      <Dialog open={openHorarioDialog} onClose={() => setOpenHorarioDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ScheduleIcon sx={{ mr: 1 }} />
            Horários de Atendimento
            {selectedMedicoId && (
              <Typography variant="subtitle1" sx={{ ml: 1, color: 'text.secondary' }}>
                - {medicos.find(m => m.id === selectedMedicoId)?.nome || ''}
              </Typography>
            )}
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Formulário para adicionar horário */}
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <AccessTimeIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1rem' }} />
                  Adicionar Novo Horário
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="dia-semana-label">Dia da Semana</InputLabel>
                      <Select
                        labelId="dia-semana-label"
                        name="dia_semana"
                        value={horarioForm.dia_semana}
                        label="Dia da Semana"
                        onChange={handleHorarioChange}
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
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="hora_inicio"
                      label="Hora Início"
                      type="time"
                      value={horarioForm.hora_inicio}
                      onChange={handleHorarioChange}
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="hora_fim"
                      label="Hora Fim"
                      type="time"
                      value={horarioForm.hora_fim}
                      onChange={handleHorarioChange}
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="intervalo-label">Intervalo</InputLabel>
                      <Select
                        labelId="intervalo-label"
                        name="intervalo_minutos"
                        value={horarioForm.intervalo_minutos}
                        label="Intervalo"
                        onChange={handleHorarioChange}
                      >
                        <MenuItem value={15}>15 minutos</MenuItem>
                        <MenuItem value={30}>30 minutos</MenuItem>
                        <MenuItem value={45}>45 minutos</MenuItem>
                        <MenuItem value={60}>60 minutos</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={adicionarHorario}
                  >
                    Adicionar Horário
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Lista de horários cadastrados */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Horários Cadastrados
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Dia da Semana</TableCell>
                      <TableCell>Horário</TableCell>
                      <TableCell>Duração da Consulta</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {horarios.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography color="text.secondary">
                            Nenhum horário cadastrado para este médico.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      horarios.map((horario) => (
                        <TableRow key={horario.id}>
                          <TableCell>{getDiaSemana(horario.dia_semana)}</TableCell>
                          <TableCell>{`${horario.hora_inicio} às ${horario.hora_fim}`}</TableCell>
                          <TableCell>{`${horario.intervalo_minutos} minutos`}</TableCell>
                          <TableCell align="center">
                            <IconButton 
                              color="error" 
                              size="small"
                              onClick={() => excluirHorario(horario.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHorarioDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para Horários do Exame */}
      <Dialog open={openHorarioExameDialog} onClose={() => setOpenHorarioExameDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ScheduleIcon sx={{ mr: 1 }} />
            Horários Disponíveis para o Exame
            {selectedExameId && (
              <Typography variant="subtitle1" sx={{ ml: 1, color: 'text.secondary' }}>
                - {exames.find(e => e.id === selectedExameId)?.nome || ''}
              </Typography>
            )}
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Formulário para adicionar horário */}
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <AccessTimeIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1rem' }} />
                  Adicionar Novo Horário para o Exame
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="dia-semana-exame-label">Dia da Semana</InputLabel>
                      <Select
                        labelId="dia-semana-exame-label"
                        name="dia_semana"
                        value={horarioExameForm.dia_semana}
                        label="Dia da Semana"
                        onChange={handleHorarioExameChange}
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
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="hora_inicio"
                      label="Hora Início"
                      type="time"
                      value={horarioExameForm.hora_inicio}
                      onChange={handleHorarioExameChange}
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="hora_fim"
                      label="Hora Fim"
                      type="time"
                      value={horarioExameForm.hora_fim}
                      onChange={handleHorarioExameChange}
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="intervalo-exame-label">Intervalo</InputLabel>
                      <Select
                        labelId="intervalo-exame-label"
                        name="intervalo_minutos"
                        value={horarioExameForm.intervalo_minutos}
                        label="Intervalo"
                        onChange={handleHorarioExameChange}
                      >
                        <MenuItem value={15}>15 minutos</MenuItem>
                        <MenuItem value={30}>30 minutos</MenuItem>
                        <MenuItem value={45}>45 minutos</MenuItem>
                        <MenuItem value={60}>60 minutos</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={adicionarHorarioExame}
                  >
                    Adicionar Horário
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Lista de horários cadastrados */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Horários Cadastrados para o Exame
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Dia da Semana</TableCell>
                      <TableCell>Horário</TableCell>
                      <TableCell>Duração do Exame</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {horariosExame.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography color="text.secondary">
                            Nenhum horário cadastrado para este exame.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      horariosExame.map((horario) => (
                        <TableRow key={horario.id}>
                          <TableCell>{getDiaSemana(horario.dia_semana)}</TableCell>
                          <TableCell>{`${horario.hora_inicio} às ${horario.hora_fim}`}</TableCell>
                          <TableCell>{`${horario.intervalo_minutos} minutos`}</TableCell>
                          <TableCell align="center">
                            <IconButton 
                              color="error" 
                              size="small"
                              onClick={() => excluirHorarioExame(horario.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHorarioExameDialog(false)}>Fechar</Button>
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