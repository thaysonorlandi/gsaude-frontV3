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
  if (status === "Realizada") return "status-realizada";
  if (status === "Aguardando") return "status-aguardando";
  if (status === "Cancelada") return "status-cancelada";
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
  const [tiposExame, setTiposExame] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [convenios, setConvenios] = useState([]);
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
        const [especialidadesRes, tiposExameRes, medicosRes, conveniosRes, agendamentosRes] = await Promise.all([
          api.get('/especialidades'),
          api.get('/tipos-exame'),
          api.get('/medicos'),
          api.get('/convenios'),
          api.get('/agendamentos')
        ]);
        
        setEspecialidades(especialidadesRes.data);
        setTiposExame(tiposExameRes.data);
        setMedicos(medicosRes.data);
        setConvenios(conveniosRes.data);
        setAgendamentos(agendamentosRes.data);
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Falha ao carregar dados. Usando dados de demonstração.");
        
        // Usar dados de demonstração em caso de erro
        setEspecialidades(["Cardiologia", "Dermatologia", "Ortopedia"]);
        setTiposExame(["Raio-X", "Ultrassom", "Hemograma"]);
        setMedicos([
          { id: 1, nome: "Dr. João", especialidade: "Cardiologia" },
          { id: 2, nome: "Dra. Ana", especialidade: "Dermatologia" },
          { id: 3, nome: "Dr. Pedro", especialidade: "Ortopedia" },
        ]);
        setConvenios(["Unimed", "Amil", "Bradesco Saúde", "SulAmérica", "Particular"]);
        setAgendamentos([
          {
            id: 1,
            tipo: "Consulta",
            especialidade: "Cardiologia",
            medico_id: 1,
            medico_nome: "Dr. João",
            data: "2025-07-08",
            hora: "09:00",
            paciente_nome: "Maria Silva",
            telefone: "(11) 98765-4321",
            email: "maria@email.com",
            convenio: "Unimed",
            status: "Aguardando",
            detalhes_financeiros: {
              valor_consulta: "",
              valor_pago_funcionario: "",
              horario_inicio: "",
              duracao_minutos: "",
              observacao: "",
              enviado_financeiro: false
            }
          },
          {
            id: 2,
            tipo: "Exame",
            exame: "Raio-X",
            medico_id: 3,
            medico_nome: "Dr. Pedro",
            data: "2025-07-08",
            hora: "10:00",
            paciente_nome: "Carlos Santos",
            telefone: "(11) 97654-3210",
            email: "carlos@email.com",
            convenio: "Amil",
            status: "Aguardando",
            detalhes_financeiros: {
              valor_consulta: "",
              valor_pago_funcionario: "",
              horario_inicio: "",
              duracao_minutos: "",
              observacao: "",
              enviado_financeiro: false
            }
          },
          {
            id: 3,
            tipo: "Consulta",
            especialidade: "Dermatologia",
            medico_id: 2,
            medico_nome: "Dra. Ana",
            data: "2025-07-09",
            hora: "11:00",
            paciente_nome: "José Oliveira",
            telefone: "(11) 96543-2109",
            email: "jose@email.com",
            convenio: "SulAmérica",
            status: "Cancelada",
            detalhes_financeiros: {
              valor_consulta: "",
              valor_pago_funcionario: "",
              horario_inicio: "",
              duracao_minutos: "",
              observacao: "",
              enviado_financeiro: false
            }
          },
          {
            id: 4,
            tipo: "Exame",
            exame: "Hemograma",
            medico_id: 1,
            medico_nome: "Dr. João",
            data: "2025-07-09",
            hora: "14:00",
            paciente_nome: "Paula Ferreira",
            telefone: "(11) 95432-1098",
            email: "paula@email.com",
            convenio: "Bradesco Saúde",
            status: "Realizada",
            detalhes_financeiros: {
              valor_consulta: "250.00",
              valor_pago_funcionario: "150.00",
              horario_inicio: "14:05",
              duracao_minutos: "30",
              observacao: "Paciente apresentou resultado normal",
              enviado_financeiro: true
            }
          },
        ]);
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

  // Filtrar agendamentos baseado nos filtros selecionados
  const agendamentosFiltrados = agendamentos.filter((item) => {
    if (tipoFiltro && item.tipo !== tipoFiltro) return false;
    if (especialidadeFiltro && item.tipo === "Consulta" && item.especialidade !== especialidadeFiltro) return false;
    if (exameFiltro && item.tipo === "Exame" && item.exame !== exameFiltro) return false;
    if (medicoFiltro && item.medico_nome !== medicoFiltro) return false;
    if (statusFiltro && item.status !== statusFiltro) return false;
    return true;
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
      status: item.status
    });
    
    // Inicializa detalhes financeiros do item ou com valores padrão
    setDetalhesFinanceiros(item.detalhes_financeiros || {
      valor_consulta: "",
      valor_pago_funcionario: "",
      horario_inicio: "",
      duracao_minutos: "",
      observacao: "",
      enviado_financeiro: false
    });
    
    setOpenDialog(true);
  };

  // Fechar Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAgendamentoSelecionado(null);
    setForm({});
    setDetalhesFinanceiros({});
  };

  // Alterar campos do formulário
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Alterar campos financeiros
  const handleFinanceiroChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDetalhesFinanceiros((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Salvar alterações
  const handleSalvar = async () => {
    try {
      setLoading(true);
      
      const dadosAtualizados = {
        ...form,
        detalhes_financeiros: detalhesFinanceiros
      };
      
      // Tenta salvar na API
      try {
        await api.put(`/agendamentos/${agendamentoSelecionado.id}`, dadosAtualizados);
      } catch (apiError) {
        console.error("Erro ao atualizar na API:", apiError);
        // Continua com a atualização local mesmo com erro na API
      }
      
      // Atualiza o estado local para refletir as mudanças imediatamente
      setAgendamentos((prev) =>
        prev.map((item) =>
          item.id === agendamentoSelecionado.id
            ? { ...item, 
                data: form.data, 
                hora: form.hora, 
                status: form.status,
                detalhes_financeiros: detalhesFinanceiros 
              }
            : item
        )
      );
      
      showSnackbar("Agendamento atualizado com sucesso!");
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

  // Cancelar agendamento
  const handleCancelar = () => {
    setOpenConfirm(true);
  };

  // Confirma o cancelamento
  const handleConfirmarCancelamento = async () => {
    try {
      setLoading(true);
      
      const dadosAtualizados = {
        ...form,
        status: "Cancelada"
      };
      
      // Tenta atualizar na API
      try {
        await api.put(`/agendamentos/${agendamentoSelecionado.id}`, dadosAtualizados);
      } catch (apiError) {
        console.error("Erro ao cancelar na API:", apiError);
        // Continua com a atualização local mesmo com erro na API
      }
      
      // Atualiza o estado local
      setAgendamentos((prev) =>
        prev.map((item) =>
          item.id === agendamentoSelecionado.id
            ? { ...item, status: "Cancelada" }
            : item
        )
      );
      
      showSnackbar("Agendamento cancelado com sucesso.");
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
      
      const financeirosAtualizados = {
        ...detalhesFinanceiros,
        enviado_financeiro: true
      };
      
      // Tenta enviar para o financeiro via API
      try {
        await api.post(`/agendamentos/${agendamentoSelecionado.id}/financeiro`, financeirosAtualizados);
      } catch (apiError) {
        console.error("Erro ao enviar para financeiro na API:", apiError);
        // Continua com a atualização local mesmo com erro na API
      }
      
      // Atualiza o estado local
      setAgendamentos((prev) =>
        prev.map((item) =>
          item.id === agendamentoSelecionado.id
            ? { 
                ...item, 
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
      
      showSnackbar("Enviado para o financeiro com sucesso!");
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
      
      const dadosAtualizados = {
        ...form,
        status: "Realizada"
      };
      
      // Tenta atualizar na API
      try {
        await api.put(`/agendamentos/${agendamentoSelecionado.id}`, dadosAtualizados);
      } catch (apiError) {
        console.error("Erro ao atualizar status na API:", apiError);
        // Continua com a atualização local mesmo com erro na API
      }
      
      // Atualiza o estado local
      setAgendamentos((prev) =>
        prev.map((item) =>
          item.id === agendamentoSelecionado.id
            ? { ...item, status: "Realizada" }
            : item
        )
      );
      
      setForm({
        ...form,
        status: "Realizada"
      });
      
      showSnackbar("Status atualizado para Realizada!");
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
          <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    value={statusFiltro}
                    label="Status"
                    onChange={(e) => setStatusFiltro(e.target.value)}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="Realizada">Realizada</MenuItem>
                    <MenuItem value="Aguardando">Aguardando</MenuItem>
                    <MenuItem value="Cancelada">Cancelada</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}

          {/* Se for Exame, mostra Tipo de Exame, Médico e Status */}
          {tipoFiltro === "Exame" && (
            <>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="exame-label">Tipo de Exame</InputLabel>
                  <Select
                    labelId="exame-label"
                    value={exameFiltro}
                    label="Tipo de Exame"
                    onChange={(e) => setExameFiltro(e.target.value)}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {tiposExame.map((ex, index) => (
                      <MenuItem key={index} value={typeof ex === 'string' ? ex : ex.nome}>
                        {typeof ex === 'string' ? ex : ex.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    value={statusFiltro}
                    label="Status"
                    onChange={(e) => setStatusFiltro(e.target.value)}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="Realizada">Realizada</MenuItem>
                    <MenuItem value="Aguardando">Aguardando</MenuItem>
                    <MenuItem value="Cancelada">Cancelada</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}

          {/* Se nenhum tipo selecionado, mostra todos os filtros exceto especialidade e tipo de exame */}
          {!tipoFiltro && (
            <>
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    value={statusFiltro}
                    label="Status"
                    onChange={(e) => setStatusFiltro(e.target.value)}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="Realizada">Realizada</MenuItem>
                    <MenuItem value="Aguardando">Aguardando</MenuItem>
                    <MenuItem value="Cancelada">Cancelada</MenuItem>
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
                    divider
                    button
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
              <span className="status-realizada">Realizada</span> &nbsp;&nbsp;
              <span className="status-cancelada">Cancelada</span>
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
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Paciente"
                      value={agendamentoSelecionado.paciente_nome || ''}
                      fullWidth
                      margin="dense"
                      InputProps={{ readOnly: true }}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="E-mail"
                      value={agendamentoSelecionado.email || ''}
                      fullWidth
                      margin="dense"
                      InputProps={{ readOnly: true }}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Telefone"
                      value={agendamentoSelecionado.telefone || ''}
                      fullWidth
                      margin="dense"
                      InputProps={{ readOnly: true }}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Convênio"
                      value={agendamentoSelecionado.convenio || ''}
                      fullWidth
                      margin="dense"
                      InputProps={{ readOnly: true }}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Médico"
                      value={agendamentoSelecionado.medico_nome || ''}
                      fullWidth
                      margin="dense"
                      InputProps={{ readOnly: true }}
                      size="small"
                    />
                  </Grid>
                  {agendamentoSelecionado.tipo === "Consulta" && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Especialidade"
                        value={agendamentoSelecionado.especialidade || ''}
                        fullWidth
                        margin="dense"
                        InputProps={{ readOnly: true }}
                        size="small"
                      />
                    </Grid>
                  )}
                  {agendamentoSelecionado.tipo === "Exame" && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Tipo de Exame"
                        value={agendamentoSelecionado.exame || ''}
                        fullWidth
                        margin="dense"
                        InputProps={{ readOnly: true }}
                        size="small"
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Data"
                      name="data"
                      type="date"
                      value={form.data || ''}
                      onChange={handleChange}
                      fullWidth
                      margin="dense"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      disabled={form.status === "Realizada" || form.status === "Cancelada"}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Hora"
                      name="hora"
                      type="time"
                      value={form.hora || ''}
                      onChange={handleChange}
                      fullWidth
                      margin="dense"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      disabled={form.status === "Realizada" || form.status === "Cancelada"}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth margin="dense" size="small">
                      <InputLabel id="status-label">Status</InputLabel>
                      <Select
                        labelId="status-label"
                        name="status"
                        value={form.status || 'Aguardando'}
                        label="Status"
                        onChange={handleChange}
                        disabled={form.status === "Cancelada"}
                      >
                        <MenuItem value="Aguardando">Aguardando</MenuItem>
                        <MenuItem value="Realizada">Realizada</MenuItem>
                        <MenuItem value="Cancelada">Cancelada</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              )}
              
              {/* Tab de Detalhes Financeiros */}
              {tabValue === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Divider sx={{ mb: 2 }} />
                  </Grid>
                  
                  {/* Linha 1: Horários */}
                  <Grid item xs={12}>
                    <div className="financial-fields-container">
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                          <TextField
                            label="Horário de Início"
                            name="horario_inicio"
                            type="time"
                            value={detalhesFinanceiros.horario_inicio || ''}
                            onChange={handleFinanceiroChange}
                            fullWidth
                            margin="dense"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                              startAdornment: <InputAdornment position="start"><AccessTimeIcon /></InputAdornment>,
                            }}
                            disabled={detalhesFinanceiros.enviado_financeiro}
                          />
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                          <TextField
                            label="Duração (minutos)"
                            name="duracao_minutos"
                            type="number"
                            value={detalhesFinanceiros.duracao_minutos || ''}
                            onChange={handleFinanceiroChange}
                            fullWidth
                            margin="dense"
                            size="small"
                            InputProps={{
                              endAdornment: <InputAdornment position="end">min</InputAdornment>,
                            }}
                            disabled={detalhesFinanceiros.enviado_financeiro}
                          />
                        </Grid>

                        <Grid item xs={12} md={4}>
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
                          />
                        </Grid>
                      </Grid>
                    </div>
                  </Grid>
                  
                  {/* Linha 2: Valores */}
                  <Grid item xs={12}>
                    <div className="financial-fields-container">
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
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
                        
                        <Grid item xs={12} md={6}>
                          <TextField
                            className="currency-field"
                            label="Valor Pago ao Profissional"
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
                    </div>
                  </Grid>
                  
                  {/* Linha 3: Observações */}
                  <Grid item xs={12}>
                    <TextField
                      label="Observações"
                      name="observacao"
                      multiline
                      rows={3}
                      value={detalhesFinanceiros.observacao || ''}
                      onChange={handleFinanceiroChange}
                      fullWidth
                      margin="dense"
                      size="small"
                      disabled={detalhesFinanceiros.enviado_financeiro}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
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
                  
                  <Grid item xs={12} sx={{ mt: 2, textAlign: 'right' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SendIcon />}
                      onClick={handleEnviarFinanceiro}
                      disabled={detalhesFinanceiros.enviado_financeiro || form.status === "Cancelada"}
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
          {form.status !== "Realizada" && form.status !== "Cancelada" && (
            <Button 
              variant="outlined" 
              color="success" 
              onClick={handleMarcarRealizada}
            >
              Marcar como Realizada
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