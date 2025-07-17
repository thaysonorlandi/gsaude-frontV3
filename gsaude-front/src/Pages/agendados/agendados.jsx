import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  DialogContentText,
  Tabs,
  Tab,
  FormControlLabel,
  Switch,
  Divider,
  InputAdornment,
  CircularProgress,
  Alert,
  Snackbar
} from "@mui/material";
import dayjs from "dayjs";
import "./agendados.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MoneyIcon from "@mui/icons-material/Money";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SendIcon from "@mui/icons-material/Send";
import api from "../../services/api";

function getStatusClass(status) {
  if (status === "Realizado") return "status-realizada";
  if (status === "Aguardando") return "status-aguardando";
  if (status === "Cancelado") return "status-cancelada";
  return "";
}

export default function VerificarAgendamentos() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [especialidadeFiltro, setEspecialidadeFiltro] = useState("");
  const [exameFiltro, setExameFiltro] = useState("");
  const [medicoFiltro, setMedicoFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState(""); 
  const [tabValue, setTabValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Dados vindos da API
  const [especialidades, setEspecialidades] = useState([]);
  const [procedimentos, setProcedimentos] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);

  // Estado para controle do Dialog e agendamento selecionado
  const [openDialog, setOpenDialog] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [form, setForm] = useState({});
  const [detalhesFinanceiros, setDetalhesFinanceiros] = useState({});

  // Carrega os dados da API
  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      try {
        // Carregar todos os dados necessários da API
        const [especialidadesRes, procedimentosRes, medicosRes, agendamentosRes] = await Promise.all([
          api.get('/especialidades'),
          api.get('/procedimentos'),
          api.get('/medicos'),
          api.get('/agendados') // Mudança aqui: usar /agendados que retorna os dados financeiros
        ]);
        
        // A API retorna { success: true, data: [...] }, então precisamos acessar .data.data
        const agendamentosData = agendamentosRes.data?.data || agendamentosRes.data;
        
        setEspecialidades(especialidadesRes.data);
        setProcedimentos(procedimentosRes.data);
        setMedicos(medicosRes.data);
        setAgendamentos(agendamentosData);
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Falha ao carregar dados da API.");
        
        // Define dados vazios em caso de erro
        setEspecialidades([]);
        setProcedimentos([]);
        setMedicos([]);
        setAgendamentos([]);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Filtrar e ordenar agendamentos por data decrescente
  const agendamentosFiltrados = agendamentos
    .filter((item) => {
      if (tipoFiltro && item.tipo !== tipoFiltro) return false;
      if (especialidadeFiltro && item.tipo === "Consulta" && item.especialidade !== especialidadeFiltro) return false;
      if (exameFiltro && item.tipo === "Exame" && item.exame !== exameFiltro) return false;
      if (medicoFiltro && item.medico_nome !== medicoFiltro) return false;
      if (statusFiltro && item.status !== statusFiltro) return false;
      return true;
    })
    .sort((a, b) => {
      // Ordena por data decrescente (mais recente primeiro)
      if (a.data < b.data) return 1;
      if (a.data > b.data) return -1;
      // Se datas iguais, ordena por hora decrescente
      if (a.hora < b.hora) return 1;
      if (a.hora > b.hora) return -1;
      return 0;
    });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Abrir Dialog com os detalhes do agendamento
  const handleOpenDialog = (item) => {
    
    setAgendamentoSelecionado(item);
    setForm({
      ...item,
      data: item.data,
      hora: item.hora,
      status: item.status,
      telefone: item.telefone || item.telefone_paciente || ''
    });
    
    // Inicializa detalhes financeiros do item ou com valores padrão
    // Se não há horário de início definido, usa a hora original do agendamento
    const horaFormatada = item.hora ? dayjs(item.hora, "HH:mm").format("HH:mm") : "";
    const detalhesFinanceirosInicial = item.detalhes_financeiros || {
      valor_consulta: "",
      valor_pago_funcionario: "",
      horario_inicio: horaFormatada,
      duracao_minutos: "",
      observacao: "",
      enviado_financeiro: false
    };
    
    setDetalhesFinanceiros(detalhesFinanceirosInicial);
    
    setOpenDialog(true);
  };

  // Fechar Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAgendamentoSelecionado(null);
    setForm({});
    setDetalhesFinanceiros({});
  };

  // Função para aplicar máscara de telefone
  const formatPhoneNumber = (value) => {
    // Remove todos os caracteres não numéricos
    const cleanValue = value.replace(/\D/g, '');
    
    // Aplica a máscara (XX) XXXXX-XXXX
    if (cleanValue.length <= 2) {
      return `(${cleanValue}`;
    } else if (cleanValue.length <= 7) {
      return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2)}`;
    } else {
      return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2, 7)}-${cleanValue.slice(7, 11)}`;
    }
  };

  // Alterar campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Aplicar máscara se for campo telefone
    if (name === 'telefone') {
      const maskedValue = formatPhoneNumber(value);
      setForm((prev) => ({
        ...prev,
        [name]: maskedValue,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Alterar campos financeiros
  const handleFinanceiroChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Validação especial para duração em minutos
    if (name === 'duracao_minutos') {
      const numeroValue = parseInt(value);
      if (numeroValue < 0 || (value !== '' && isNaN(numeroValue))) {
        return; // Não permite valores negativos ou não numéricos
      }
    }
    
    // Validação especial para horário de início
    if (name === 'horario_inicio') {
      // Garante que o horário está no formato HH:mm
      if (value && value.includes('T')) {
        // Se vier um timestamp, extrai apenas a parte da hora
        const timeOnly = dayjs(value).format("HH:mm");
        setDetalhesFinanceiros((prev) => ({
          ...prev,
          [name]: timeOnly,
        }));
        return;
      }
    }
    
    setDetalhesFinanceiros((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Salvar alterações
  const handleSalvar = async () => {
    try {
      setLoading(true);
      
      // Preparar dados para atualização - apenas campos necessários
      const dadosBasicos = {
        data_agendamento: form.data,
        status: form.status,
        telefone_paciente: form.telefone || agendamentoSelecionado.telefone_paciente || agendamentoSelecionado.telefone,
        observacoes: form.observacoes || agendamentoSelecionado.observacoes
      };
      
      // Tenta salvar na API usando a nova rota
      try {
        await api.put(`/agendados/${agendamentoSelecionado.id}`, dadosBasicos);
        showSnackbar("Agendamento atualizado com sucesso!");
      } catch (apiError) {
        console.error("Erro ao atualizar na API:", apiError);
        showSnackbar("Erro ao atualizar na API: " + (apiError.message || 'Erro desconhecido'), "error");
        return; // Para de executar se houver erro na API
      }
      
      // Atualiza o estado local para refletir as mudanças imediatamente
      setAgendamentos((prev) =>
        prev.map((item) =>
          item.id === agendamentoSelecionado.id
            ? { ...item, 
                data: form.data, 
                status: form.status,
                telefone: form.telefone || item.telefone,
                data_agendamento: form.data,
                telefone_paciente: form.telefone || item.telefone_paciente,
                detalhes_financeiros: detalhesFinanceiros 
              }
            : item
        )
      );
      
      handleCloseDialog();
    } catch (err) {
      console.error("Erro ao salvar alterações:", err);
      showSnackbar("Erro ao salvar alterações.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Estado para pop-up de confirmação
  const [openConfirm, setOpenConfirm] = useState(false);

  // Confirma o cancelamento
  const handleConfirmarCancelamento = async () => {
    try {
      setLoading(true);
      
      // Preparar dados para cancelamento
      const dadosBasicos = {
        status: "Cancelado",
        observacoes: "Agendamento cancelado pelo usuário"
      };
      
      // Tenta atualizar na API usando a nova rota
      try {
        await api.put(`/agendados/${agendamentoSelecionado.id}`, dadosBasicos);
        showSnackbar("Agendamento cancelado com sucesso.", "success");
      } catch (apiError) {
        console.error("Erro ao cancelar na API:", apiError);
        showSnackbar("Erro ao cancelar agendamento: " + (apiError.message || 'Erro desconhecido'), "error");
        return; // Para de executar se houver erro na API
      }
      
      // Atualiza o estado local
      setAgendamentos((prev) =>
        prev.map((item) =>
          item.id === agendamentoSelecionado.id
            ? { ...item, status: "Cancelado" }
            : item
        )
      );
      
      setOpenConfirm(false);
      handleCloseDialog();
    } catch (err) {
      console.error("Erro ao cancelar agendamento:", err);
      showSnackbar("Erro ao cancelar agendamento.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Enviar para o financeiro
  const handleEnviarFinanceiro = async () => {
    try {
      setLoading(true);
      
      // Verifica se os campos obrigatórios estão preenchidos
      if (!detalhesFinanceiros.valor_consulta || !detalhesFinanceiros.horario_inicio || !detalhesFinanceiros.duracao_minutos) {
        showSnackbar("Preencha os campos obrigatórios: valor, horário e duração.", "error");
        setLoading(false);
        return;
      }
      
      // Prepara os dados no formato esperado pela API
      const dadosFinanceiros = {
        valor_consulta: detalhesFinanceiros.valor_consulta,
        valor_pago_medico: detalhesFinanceiros.valor_pago_funcionario,
        duracao_consulta: detalhesFinanceiros.duracao_minutos,
        horario_inicio_real: detalhesFinanceiros.horario_inicio,
        observacoes_financeiras: detalhesFinanceiros.observacao,
        status: 'Realizado' // Marca como realizado quando envia para financeiro
      };
      
      // Primeiro salva os dados financeiros
      try {
        await api.put(`/agendados/${agendamentoSelecionado.id}/status-financeiro`, dadosFinanceiros);
      } catch (apiError) {
        console.error("Erro ao salvar dados financeiros:", apiError);
        showSnackbar("Erro ao salvar dados financeiros: " + (apiError.response?.data?.message || 'Erro desconhecido'), "error");
        setLoading(false);
        return;
      }
      
      // Depois tenta enviar para o financeiro
      try {
        await api.post(`/agendados/${agendamentoSelecionado.id}/enviar-financeiro`);
        showSnackbar("Enviado para o financeiro com sucesso!");
      } catch (apiError) {
        console.error("Erro ao enviar para financeiro na API:", apiError);
        showSnackbar("Dados salvos, mas erro ao enviar para financeiro: " + (apiError.response?.data?.message || 'Erro desconhecido'), "warning");
      }
      
      // Atualiza o estado local
      setAgendamentos((prev) =>
        prev.map((item) =>
          item.id === agendamentoSelecionado.id
            ? { 
                ...item, 
                status: 'Realizado',
                detalhes_financeiros: {
                  ...detalhesFinanceiros,
                  enviado_financeiro: true
                }
              }
            : item
        )
      );
      
      setDetalhesFinanceiros({
        ...detalhesFinanceiros,
        enviado_financeiro: true
      });
      
      setForm({
        ...form,
        status: 'Realizado'
      });
      
    } catch (err) {
      console.error("Erro ao enviar para financeiro:", err);
      showSnackbar("Erro ao enviar para o financeiro.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Marcar como realizada
  const handleMarcarRealizada = async () => {
    try {
      setLoading(true);
      
      // Preparar dados para marcar como realizada
      const dadosBasicos = {
        status: "Realizado"
      };
      
      // Tenta atualizar na API usando a nova rota
      try {
        await api.put(`/agendados/${agendamentoSelecionado.id}`, dadosBasicos);
        showSnackbar("Status atualizado para Realizado!", "success");
      } catch (apiError) {
        console.error("Erro ao atualizar status na API:", apiError);
        showSnackbar("Erro ao atualizar status: " + (apiError.message || 'Erro desconhecido'), "error");
        return; // Para de executar se houver erro na API
      }
      
      // Atualiza o estado local
      setAgendamentos((prev) =>
        prev.map((item) =>
          item.id === agendamentoSelecionado.id
            ? { ...item, status: "Realizado" }
            : item
        )
      );
      
      setForm({
        ...form,
        status: "Realizado"
      });
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      showSnackbar("Erro ao atualizar status.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Cancela o pop-up de confirmação
  const handleFecharConfirm = () => {
    setOpenConfirm(false);
  };

  return (
    <Box className="agenda-container">
      {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Paper className="agenda-paper">
        <Typography variant="h5" className="agenda-titulo">
          <CalendarMonthIcon className="agenda-icon"/>
          Consultas e Exames Agendados
        </Typography>
        
        <Grid container spacing={2} className="agenda-filtros">
          <Grid xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="tipo-label">Tipo</InputLabel>
              <Select
                labelId="tipo-label"
                value={tipoFiltro}
                label="Tipo"
                onChange={(e) => setTipoFiltro(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Consulta">Consulta</MenuItem>
                <MenuItem value="Exame">Exame</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Se for Consulta, mostra Especialidade, Médico e Status */}
          {tipoFiltro === "Consulta" && (
            <>
              <Grid xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="esp-label">Especialidade</InputLabel>
                  <Select
                    labelId="esp-label"
                    value={especialidadeFiltro}
                    label="Especialidade"
                    onChange={(e) => setEspecialidadeFiltro(e.target.value)}
                  >
                    <MenuItem value="">Todas</MenuItem>
                    {especialidades.map((esp, index) => (
                      <MenuItem key={index} value={typeof esp === 'string' ? esp : esp.nome}>
                        {typeof esp === 'string' ? esp : esp.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="medico-label">Médico</InputLabel>
                  <Select
                    labelId="medico-label"
                    value={medicoFiltro}
                    label="Médico"
                    onChange={(e) => setMedicoFiltro(e.target.value)}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {medicos.map((m, index) => (
                      <MenuItem key={index} value={m.nome}>
                        {m.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    value={statusFiltro}
                    label="Status"
                    onChange={(e) => setStatusFiltro(e.target.value)}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="Realizado">Realizado</MenuItem>
                    <MenuItem value="Aguardando">Aguardando</MenuItem>
                    <MenuItem value="Cancelado">Cancelado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}

          {/* Se for Exame, mostra Tipo de Exame, Médico e Status */}
          {tipoFiltro === "Exame" && (
            <>
              <Grid xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="exame-label">Tipo de Exame</InputLabel>
                  <Select
                    labelId="exame-label"
                    value={exameFiltro}
                    label="Tipo de Exame"
                    onChange={(e) => setExameFiltro(e.target.value)}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {procedimentos.map((ex, index) => (
                      <MenuItem key={index} value={typeof ex === 'string' ? ex : ex.nome}>
                        {typeof ex === 'string' ? ex : ex.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="medico-label">Médico</InputLabel>
                  <Select
                    labelId="medico-label"
                    value={medicoFiltro}
                    label="Médico"
                    onChange={(e) => setMedicoFiltro(e.target.value)}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {medicos.map((m, index) => (
                      <MenuItem key={index} value={m.nome}>
                        {m.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    value={statusFiltro}
                    label="Status"
                    onChange={(e) => setStatusFiltro(e.target.value)}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="Realizado">Realizado</MenuItem>
                    <MenuItem value="Aguardando">Aguardando</MenuItem>
                    <MenuItem value="Cancelado">Cancelado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}

          {/* Se nenhum tipo selecionado, mostra todos os filtros exceto especialidade e tipo de exame */}
          {!tipoFiltro && (
            <>
              <Grid xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="medico-label">Médico</InputLabel>
                  <Select
                    labelId="medico-label"
                    value={medicoFiltro}
                    label="Médico"
                    onChange={(e) => setMedicoFiltro(e.target.value)}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {medicos.map((m, index) => (
                      <MenuItem key={index} value={m.nome}>
                        {m.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    value={statusFiltro}
                    label="Status"
                    onChange={(e) => setStatusFiltro(e.target.value)}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="Realizado">Realizado</MenuItem>
                    <MenuItem value="Aguardando">Aguardando</MenuItem>
                    <MenuItem value="Cancelado">Cancelado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}
        </Grid>
        
        {loading && !agendamentos.length ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="h6" className="agenda-titulo-dia" style={{marginTop: 24}}>
              Agendamentos
            </Typography>
            <List>
              {agendamentosFiltrados.length === 0 ? (
                <Typography color="text.secondary" className="agenda-nenhum">
                  Nenhum agendamento encontrado.
                </Typography>
              ) : (
                agendamentosFiltrados.map((item) => (
                  <ListItem
                    key={item.id}
                    component="button"
                    onClick={() => handleOpenDialog(item)}
                    secondaryAction={
                      <span className={getStatusClass(item.status)}>
                        {item.status}
                      </span>
                    }
                  >
                    <ListItemIcon>
                      <span className={item.tipo === "Exame" ? "dot-exame" : "dot-consulta"} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        item.tipo === "Consulta"
                          ? `Consulta de ${item.especialidade}`
                          : `Exame: ${item.exame}`
                      }
                      secondary={
                        <span>
                          <b>Paciente:</b> {item.paciente_nome} &nbsp;|&nbsp;
                          <b>Médico:</b> {item.medico_nome} &nbsp;|&nbsp;
                          <b>Data:</b> {dayjs(item.data).format("DD/MM/YYYY")} &nbsp;|&nbsp;
                          <b>Hora:</b> {item.hora}
                        </span>
                      }
                    />
                  </ListItem>
                )))}
            </List>
            <Box className="agenda-legenda" sx={{marginTop: 2}}>
              <span className="dot-consulta" /> Consulta &nbsp;&nbsp;
              <span className="dot-exame" /> Exame &nbsp;&nbsp;
              <span className="status-aguardando">Aguardando</span> &nbsp;&nbsp;
              <span className="status-realizada">Realizado</span> &nbsp;&nbsp;
              <span className="status-cancelada">Cancelado</span>
            </Box>
          </>
        )}
      </Paper>

      {/* Dialog para detalhes do agendamento */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          {agendamentoSelecionado?.tipo === "Consulta"
            ? "Detalhes da Consulta"
            : "Detalhes do Exame"}
        </DialogTitle>
        <DialogContent dividers>
          {agendamentoSelecionado && (
            <Box>
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab label="Informações Gerais" />
                <Tab label="Detalhes Financeiros" />
              </Tabs>
              
              {/* Tab de Informações Gerais */}
              {tabValue === 0 && (
                <Grid container spacing={2}>
                  <Grid xs={12} md={6}>
                    <TextField
                      label="Paciente"
                      value={agendamentoSelecionado.paciente_nome || ''}
                      fullWidth
                      margin="dense"
                      InputProps={{ readOnly: true }}
                      size="small"
                      disabled
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      label="Telefone"
                      name="telefone"
                      value={form.telefone || agendamentoSelecionado.telefone || ''}
                      onChange={handleChange}
                      fullWidth
                      margin="dense"
                      size="small"
                      placeholder="(XX) XXXXX-XXXX"
                      inputProps={{
                        maxLength: 15 // Limita o tamanho máximo do campo
                      }}
                      disabled
                    />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <TextField
                      label="Convênio"
                      value={agendamentoSelecionado.convenio || ''}
                      fullWidth
                      margin="dense"
                      InputProps={{ readOnly: true }}
                      size="small"
                      disabled
                    />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <TextField
                      label="Médico"
                      value={agendamentoSelecionado.medico_nome || ''}
                      fullWidth
                      margin="dense"
                      InputProps={{ readOnly: true }}
                      size="small"
                      disabled
                    />
                  </Grid>
                  {agendamentoSelecionado.tipo === "Consulta" && (
                    <Grid xs={12} md={6}>
                      <TextField
                        label="Especialidade"
                        value={agendamentoSelecionado.especialidade || ''}
                        fullWidth
                        margin="dense"
                        InputProps={{ readOnly: true }}
                        size="small" 
                        disabled
                      />
                    </Grid>
                  )}
                  {agendamentoSelecionado.tipo === "Exame" && (
                    <Grid xs={12} md={6}>
                      <TextField
                        label="Tipo de Exame"
                        value={agendamentoSelecionado.exame || ''}
                        fullWidth
                        margin="dense"
                        InputProps={{ readOnly: true }}
                        size="small"
                        disabled
                      />
                    </Grid>
                  )}
                  <Grid xs={12} md={4}>
                    <FormControl fullWidth margin="dense" size="small" sx={{ minWidth: 224 }}>
                      <InputLabel id="status-label">Status</InputLabel>
                      <Select
                        labelId="status-label"
                        name="status"
                        value={form.status || 'Aguardando'}
                        label="Status"
                        onChange={handleChange}
                        disabled={form.status === "Cancelado" || form.status === "Realizado"}
                        sx={{ minWidth: 140 }}
                      >
                        <MenuItem value="Aguardando">Aguardando</MenuItem>
                        <MenuItem value="Realizado">Realizado</MenuItem>
                        <MenuItem value="Cancelado">Cancelado</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} md={4}>
                    <TextField
                      label="Data"
                      name="data"
                      type="string"
                      value={dayjs(form.data).format("DD/MM/YYYY")}
                      onChange={handleChange}
                      fullWidth
                      sx={{ maxWidth: 135 }}
                      margin="dense"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      disabled
                    />
                  </Grid>
                  <Grid xs={12} md={4}>
                    <TextField
                      label="Hora"
                      name="hora"
                      type="string"
                      value={form.hora}
                      fullWidth
                      sx={{ maxWidth: 95 }}
                      margin="dense"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ readOnly: true }}
                      disabled
                    />
                  </Grid>
                </Grid>
              )}
              
              {/* Tab de Detalhes Financeiros */}
              {tabValue === 1 && (
                <Grid container spacing={3}>
                  <Grid xs={12}>
                    <Divider sx={{ mb: 2 }} />
                  </Grid>
                  
                  {/* Linha 1: Horários */}
                  <Grid xs={12}>
                      <Grid container spacing={3} sx={{ alignItems: 'flex-start'}}>
                        <Grid xs={12} md={4}>
                          <TextField
                            label="Horário de Início"
                            name="horario_inicio"
                            type="time"
                            value={detalhesFinanceiros.horario_inicio || ''}
                            onChange={handleFinanceiroChange}
                            fullWidth
                            margin="dense"
                            size="small"
                            sx={{ minWidth: 200 }}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                              startAdornment: <InputAdornment position="start"><AccessTimeIcon /></InputAdornment>,
                            }}
                            disabled={detalhesFinanceiros.enviado_financeiro}
                          />
                        </Grid>
                        
                        <Grid xs={12} md={4}>
                          <TextField
                            label="Duração (minutos)"
                            name="duracao_minutos"
                            type="number"
                            value={detalhesFinanceiros.duracao_minutos || ''}
                            onChange={handleFinanceiroChange}
                            fullWidth
                            margin="dense"
                            size="small"
                            sx={{ minWidth: 200 }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">min</InputAdornment>,
                              inputProps: { min: 1, max: 480 } // Mínimo 1 minuto, máximo 8 horas
                            }}
                            disabled={detalhesFinanceiros.enviado_financeiro}
                          />
                        </Grid>

                        <Grid xs={12} md={4}>
                          <TextField
                            label="Horário Final"
                            type="text"
                            value={
                              detalhesFinanceiros.horario_inicio && detalhesFinanceiros.duracao_minutos 
                              ? (() => {
                                  const [horas, minutos] = detalhesFinanceiros.horario_inicio.split(':');
                                  const inicioMinutos = parseInt(horas) * 60 + parseInt(minutos);
                                  const finalMinutos = inicioMinutos + parseInt(detalhesFinanceiros.duracao_minutos || 0);
                                  const horasFinal = Math.floor(finalMinutos / 60);
                                  const minutosFinal = finalMinutos % 60;
                                  return `${horasFinal.toString().padStart(2, '0')}:${minutosFinal.toString().padStart(2, '0')}`;
                                })()
                              : ''
                            }
                            fullWidth
                            margin="dense"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ 
                              readOnly: true,
                              startAdornment: <InputAdornment position="start"><AccessTimeIcon /></InputAdornment>,
                            }}
                            disabled={detalhesFinanceiros.enviado_financeiro}
                          />
                        </Grid>
                      </Grid>
                  </Grid>
                  
                  {/* Linha 2: Valores */}
                  <Grid xs={12}>
                      <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
                        <Grid xs={12} md={6}>
                          <TextField
                            className="currency-field"
                            label="Valor da Consulta/Exame"
                            name="valor_consulta"
                            value={detalhesFinanceiros.valor_consulta ? `${Number(detalhesFinanceiros.valor_consulta).toFixed(2).replace('.', ',')}` : ''}
                            onChange={(e) => {
                              // Remove qualquer caractere não numérico e converte para formato de número
                              const valorLimpo = e.target.value.replace(/[^\d]/g, '');
                              // Converte para decimal (divide por 100 para considerar centavos)
                              const valorDecimal = (valorLimpo / 100).toString();
                              
                              handleFinanceiroChange({
                                target: {
                                  name: 'valor_consulta',
                                  value: valorDecimal
                                }
                              });
                            }}
                            fullWidth
                            margin="dense"
                            size="small"
                            InputProps={{
                              inputMode: 'numeric',
                              startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                            }}
                            disabled={detalhesFinanceiros.enviado_financeiro}
                          />
                        </Grid>
                        
                        <Grid xs={12} md={6}>
                          <TextField
                            className="currency-field"
                            label="Valor Pago ao Médico"
                            name="valor_pago_funcionario"
                            value={detalhesFinanceiros.valor_pago_funcionario ? `${Number(detalhesFinanceiros.valor_pago_funcionario).toFixed(2).replace('.', ',')}` : ''}
                            onChange={(e) => {
                              // Remove qualquer caractere não numérico e converte para formato de número
                              const valorLimpo = e.target.value.replace(/[^\d]/g, '');
                              // Converte para decimal (divide por 100 para considerar centavos)
                              const valorDecimal = (valorLimpo / 100).toString();
                              
                              handleFinanceiroChange({
                                target: {
                                  name: 'valor_pago_funcionario',
                                  value: valorDecimal
                                }
                              });
                            }}
                            fullWidth
                            margin="dense"
                            size="small"
                            InputProps={{
                              inputMode: 'numeric',
                              startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                            }}
                            disabled={detalhesFinanceiros.enviado_financeiro}
                          />
                        </Grid>
                      </Grid>
                  </Grid>
                  
                  {/* Linha 3: Observações */}
                  <Grid xs={12}>
                    <TextField
                      label="Observações"
                      name="observacao"
                      multiline
                      rows={3}
                      value={detalhesFinanceiros.observacao || ''}
                      onChange={handleFinanceiroChange}
                      margin="dense"
                      size="small"
                      sx={{ width: '66.66%', minWidth: 400 }}
                      disabled={detalhesFinanceiros.enviado_financeiro}
                    />
                  </Grid>
                  
                  <Grid xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          name="enviado_financeiro"
                          checked={Boolean(detalhesFinanceiros.enviado_financeiro)}
                          onChange={handleFinanceiroChange}
                          disabled={true} // Sempre desativado - controlado pelo botão "Enviar para Financeiro"
                        />
                      }
                      label="Enviado para Financeiro"
                                          />
                  </Grid>
                  
                  <Grid xs={12} sx={{ mt: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SendIcon />}
                      onClick={handleEnviarFinanceiro}
                      disabled={detalhesFinanceiros.enviado_financeiro || form.status === "Cancelado"}
                    >
                      Enviar para Financeiro
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Fechar</Button>
          {form.status !== "Realizado" && form.status !== "Cancelado" && (
            <Button 
              variant="outlined" 
              color="success" 
              onClick={handleMarcarRealizada}
            >
              Marcar como Realizado
            </Button>
          )}
          <Button 
            variant="contained" 
            onClick={handleSalvar}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pop-up de confirmação para cancelamento */}
      <Dialog open={openConfirm} onClose={handleFecharConfirm}>
        <DialogTitle>Cancelar Agendamento</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharConfirm}>Não</Button>
          <Button 
            color="error" 
            onClick={handleConfirmarCancelamento} 
            autoFocus
            disabled={loading}
          >
            {loading ? "Cancelando..." : "Sim, cancelar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificações */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}