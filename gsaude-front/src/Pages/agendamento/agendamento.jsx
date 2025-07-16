import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Stack,
  CircularProgress,
  Grid,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import "./agendamento.css";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { useAgendamento } from "../../hooks/useAgendamento";
import { formatarTelefone, removerMascaraTelefone } from "../../utils/formatters";

const steps = ["Dados Iniciais", "Horários", "Dados Adicionais"];

const FORMULARIO_INICIAL = {
  filialId: "",
  paciente: "",
  procedimento: "",
  especialidadeId: "",
  procedimentoId: "", // Mudou de tipoExameId para procedimentoId
  medicoId: "",
  data: "",
  hora: "",
  nomePaciente: "",
  idadePaciente: "",
  convenioId: "",
  telefonePaciente: "",
};

export default function Agendamento() {
  const location = useLocation();
  const { resetAgendamento, setEmProcessoAgendamento } = useOutletContext();
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = React.useState(FORMULARIO_INICIAL);
  const [horarioSelecionado, setHorarioSelecionado] = useState({});
  const [periodoSelecionado, setPeriodoSelecionado] = useState('semana');
  const [open, setOpen] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [dadosAgendamento, setDadosAgendamento] = useState(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  
  // Estados para horário de encaixe
  const [showEncaixeDialog, setShowEncaixeDialog] = useState(false);
  const [encaixeForm, setEncaixeForm] = useState({
    data: '',
    hora_inicio: '',
    hora_fim: '',
    intervalo_minutos: 30,
    observacoes: ''
  });

  const navigate = useNavigate();

  // Hook para gerenciar dados do agendamento
  const {
    loading,
    error,
    filiais,
    especialidades,
    procedimentos, // Mudou de tiposExame para procedimentos
    medicos,
    convenios,
    horariosDisponiveis,
    carregarMedicosPorEspecialidade,
    carregarMedicosPorProcedimento, // Mudou de carregarMedicosPorTipoExame
    carregarHorarios,
    criarAgendamento,
    setError,
  } = useAgendamento();

  // Sempre que acessar /home, reseta o formulário e etapa
  useEffect(() => {
    if (location.pathname === "/home") {
      setForm(FORMULARIO_INICIAL);
      setActiveStep(0);
    }
  }, [location.pathname]);

  useEffect(() => {
    setForm(FORMULARIO_INICIAL);
    setActiveStep(0);
  }, [resetAgendamento]);

  useEffect(() => {
    // Se activeStep > 1, está em processo de agendamento
    setEmProcessoAgendamento(activeStep > 1);
    // Limpa ao desmontar
    return () => setEmProcessoAgendamento(false);
  }, [activeStep, setEmProcessoAgendamento]);

  // Carrega médicos quando muda a especialidade
  useEffect(() => {
    if (form.especialidadeId && form.procedimento === "consulta") {
      console.log('Carregando médicos por especialidade:', form.especialidadeId);
      carregarMedicosPorEspecialidade(form.especialidadeId);
    }
  }, [form.especialidadeId, form.procedimento, carregarMedicosPorEspecialidade]);

  // Carrega médicos quando muda o procedimento (antes era tipoExameId)
  useEffect(() => {
    if (form.procedimentoId && form.procedimento === "exame") {
      console.log('Carregando médicos por procedimento:', form.procedimentoId);
      carregarMedicosPorProcedimento(form.procedimentoId);
    }
  }, [form.procedimentoId, form.procedimento, carregarMedicosPorProcedimento]);

  // Carrega horários quando muda o médico ou período
  useEffect(() => {
    if (form.medicoId) {
      console.log('Carregando horários para médico:', form.medicoId, 'período:', periodoSelecionado);
      carregarHorarios(form.medicoId, null, periodoSelecionado);
    }
  }, [form.medicoId, periodoSelecionado, carregarHorarios]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Tratamento especial para telefone com máscara
    if (name === 'telefonePaciente') {
      const telefoneFormatado = formatarTelefone(value);
      setForm({ ...form, [name]: telefoneFormatado });
      return;
    }
    
    setForm({ ...form, [name]: value });
    
    // Limpa campos dependentes ao trocar procedimento
    if (name === "procedimento") {
      setForm((f) => ({
        ...f,
        procedimento: value,
        procedimentoId: "", // Mudou de tipoExameId para procedimentoId
        especialidadeId: "",
        medicoId: "",
      }));
    }
    
    // Limpa médico ao trocar especialidade ou procedimento
    if (name === "procedimentoId" || name === "especialidadeId") {
      setForm((f) => ({
        ...f,
        medicoId: "",
      }));
    }
  };

  const handleFinalizar = async (e) => {
    e.preventDefault();
    
    try {
      // Função para garantir formato de data YYYY-MM-DD
      const garantirFormatoData = (data) => {
        if (!data) return null;
        
        // Se já está no formato correto, retorna
        if (typeof data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data)) {
          return data;
        }
        
        // Se é um objeto Date
        if (data instanceof Date) {
          const year = data.getFullYear();
          const month = String(data.getMonth() + 1).padStart(2, '0');
          const day = String(data.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }
        
        // Se é string em formato DD/MM/YYYY
        if (typeof data === 'string' && data.includes('/')) {
          const partes = data.split('/');
          if (partes.length === 3) {
            return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
          }
        }
        
        // Tenta converter qualquer outro formato
        try {
          const dateObj = new Date(data);
          if (!isNaN(dateObj.getTime())) {
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          }
        } catch (e) {
          console.error('Erro ao converter data:', e);
        }
        
        return data;
      };

      // Função para garantir formato de hora HH:MM
      const garantirFormatoHora = (hora) => {
        if (!hora) return null;
        
        // Se já está no formato correto HH:MM
        if (typeof hora === 'string' && /^\d{2}:\d{2}$/.test(hora)) {
          return hora;
        }
        
        // Se é string mas sem zero à esquerda
        if (typeof hora === 'string' && hora.includes(':')) {
          const partes = hora.split(':');
          if (partes.length === 2) {
            return `${partes[0].padStart(2, '0')}:${partes[1].padStart(2, '0')}`;
          }
        }
        
        // Se é um objeto Date, extrai a hora
        if (hora instanceof Date) {
          const hours = String(hora.getHours()).padStart(2, '0');
          const minutes = String(hora.getMinutes()).padStart(2, '0');
          return `${hours}:${minutes}`;
        }
        
        return hora;
      };

      // Preparar dados com formatação rigorosa
      const dataFormatada = garantirFormatoData(form.data);
      const horaFormatada = garantirFormatoHora(form.hora);
      
      console.log('=== DADOS ANTES DO ENVIO ===');
      console.log('Data original:', form.data);
      console.log('Data formatada:', dataFormatada);
      console.log('Hora original:', form.hora);
      console.log('Hora formatada:', horaFormatada);
      
      // Validação prévia
      if (!dataFormatada || !horaFormatada) {
        setError('Data e hora são obrigatórias e devem ser válidas');
        return;
      }
      
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dataFormatada)) {
        setError('Data deve estar no formato correto (YYYY-MM-DD)');
        return;
      }
      
      if (!/^\d{2}:\d{2}$/.test(horaFormatada)) {
        setError('Hora deve estar no formato correto (HH:MM)');
        return;
      }

      const dadosParaEnvio = {
        filial_id: parseInt(form.filialId),
        medico_id: parseInt(form.medicoId),
        tipo_procedimento: form.procedimento,
        especialidade_id: form.especialidadeId ? parseInt(form.especialidadeId) : null,
        procedimento_id: form.procedimentoId ? parseInt(form.procedimentoId) : null,
        data_agendamento: dataFormatada,
        hora_agendamento: horaFormatada,
        nome_paciente: form.nomePaciente.trim(),
        idade_paciente: parseInt(form.idadePaciente),
        convenio_id: parseInt(form.convenioId),
        telefone_paciente: removerMascaraTelefone(form.telefonePaciente),
      };

      console.log('=== DADOS FINAIS PARA ENVIO ===');
      console.log(JSON.stringify(dadosParaEnvio, null, 2));

      // Chama o serviço para criar o agendamento
      const resultado = await criarAgendamento(dadosParaEnvio);
      
      // Salva os dados completos para exibir no popup
      setDadosAgendamento({
        ...form,
        id: resultado.id,
        data: dataFormatada,
        hora: horaFormatada,
        // Adiciona os nomes dos itens selecionados
        nomeFilial: filiais.find(f => f.id == form.filialId)?.nome || '',
        nomeMedico: medicos.find(m => m.id == form.medicoId)?.nome || '',
        nomeEspecialidade: especialidades.find(e => e.id == form.especialidadeId)?.nome || '',
        nomeProcedimento: procedimentos.find(p => p.id == form.procedimentoId)?.nome || '',
        nomeConvenio: convenios.find(c => c.id == form.convenioId)?.nome || '',
      });
      
      setOpen(true);
    } catch (error) {
      console.error('Erro ao finalizar agendamento:', error);
      setError('Erro ao finalizar agendamento. Verifique os dados e tente novamente.');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setShowMsg(true);
    // Limpa o formulário e reseta etapas
    setForm(FORMULARIO_INICIAL);
    setActiveStep(0);
    setTimeout(() => {
      setShowMsg(false);
      navigate("/home"); // Redireciona para a página principal
    }, 2000); // 2 segundos para o usuário ver a mensagem
  };

  function handleCancelar() {
    // Abre o diálogo de confirmação
    setOpenCancelDialog(true);
  }

  function handleConfirmCancel() {
    // Limpa todo o formulário
    setForm(FORMULARIO_INICIAL);
    // Reseta para a primeira etapa
    setActiveStep(0);
    // Limpa horário selecionado
    setHorarioSelecionado({});
    // Limpa qualquer erro
    setError(null);
    // Fecha o diálogo
    setOpenCancelDialog(false);
    // Redireciona para a página inicial
    navigate("/home");
  }

  function handleCloseCancelDialog() {
    setOpenCancelDialog(false);
  }

  // Defina os campos obrigatórios de cada etapa em um objeto:
  const CAMPOS_OBRIGATORIOS = {
    0: ["filialId", "procedimento", "medicoId"], // etapa 1: dados iniciais
    1: ["data", "hora"],         // etapa 2: horários
    2: ["nomePaciente", "idadePaciente", "convenioId", "telefonePaciente"], // etapa 3: dados adicionais
  };

  // Supondo que form.medico tem o nome do médico selecionado

  // Atualize o handle para seleção de horário:
  function handleSelecionarHorario(data, hora) {
    console.log('Horário selecionado - Data:', data, 'Hora:', hora);
    
    // Garantir que a data esteja no formato YYYY-MM-DD
    let dataFormatada = data;
    if (data && typeof data === 'string') {
      // Se a data vier no formato DD/MM/YYYY, converter para YYYY-MM-DD
      if (data.includes('/')) {
        const partes = data.split('/');
        if (partes.length === 3) {
          dataFormatada = `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
        }
      }
      // Se a data vier no formato DD-MM-YYYY, converter para YYYY-MM-DD
      else if (data.includes('-') && data.length === 10 && !data.startsWith('20')) {
        const partes = data.split('-');
        if (partes.length === 3) {
          dataFormatada = `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
        }
      }
    }
    
    // Garantir que a hora esteja no formato HH:MM
    let horaFormatada = hora;
    if (hora && typeof hora === 'string') {
      // Se a hora não tem dois dígitos, adicionar zero à esquerda
      if (hora.length === 4 && hora.includes(':')) {
        const partes = hora.split(':');
        horaFormatada = `${partes[0].padStart(2, '0')}:${partes[1].padStart(2, '0')}`;
      } else if (hora.length === 5) {
        horaFormatada = hora; // Já está no formato correto
      }
    }
    
    console.log('Data formatada:', dataFormatada, 'Hora formatada:', horaFormatada);
    
    setHorarioSelecionado({ data: dataFormatada, hora: horaFormatada });
    setForm((f) => ({
      ...f,
      data: dataFormatada,
      hora: horaFormatada,
    }));
  }

  // Funções para o modal de encaixe
  const handleEncaixeSubmit = async (e) => {
    e.preventDefault();
    try {
      // Importar API
      const api = (await import('../../services/api')).default;
      
      await api.post(`/medicos/${form.medicoId}/horarios-encaixe`, encaixeForm);
      setShowEncaixeDialog(false);
      resetEncaixeForm();
      
      // Recarregar horários para mostrar o novo encaixe
      if (form.medicoId) {
        carregarHorarios(form.medicoId, null, periodoSelecionado);
      }
      
      setError(null);
    } catch (error) {
      console.error('Erro ao adicionar horário de encaixe:', error);
      setError(error.response?.data?.message || "Erro ao adicionar horário de encaixe");
    }
  };

  const resetEncaixeForm = () => {
    setEncaixeForm({
      data: '',
      hora_inicio: '',
      hora_fim: '',
      intervalo_minutos: 30,
      observacoes: ''
    });
  };

  // Função para voltar para a etapa anterior
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Função para avançar para a próxima etapa
  const handleNext = () => {
    // Validação antes de avançar
    if (activeStep === 0) {
      // Etapa 1: Validar dados iniciais
      if (!form.filialId || !form.procedimento || !form.medicoId) {
        setError('Preencha todos os campos obrigatórios');
        return;
      }
      
      if (form.procedimento === 'consulta' && !form.especialidadeId) {
        setError('Selecione uma especialidade para consulta');
        return;
      }
      
      if (form.procedimento === 'exame' && !form.procedimentoId) {
        setError('Selecione um tipo de exame');
        return;
      }
    }
    
    if (activeStep === 1) {
      // Etapa 2: Validar horário selecionado
      if (!form.data || !form.hora) {
        setError('Selecione um horário disponível');
        return;
      }
    }
    
    // Se passou nas validações, avança para a próxima etapa
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setError(null); // Limpa qualquer erro anterior
  };

  // Função para formatar data para exibição (dd-mm-yyyy)
  const formatarDataParaExibicao = (data) => {
    if (!data) return '';
    
    // Se já está no formato YYYY-MM-DD, converter para DD-MM-YYYY
    if (typeof data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data)) {
      const partes = data.split('-');
      return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }
    
    // Se é um objeto Date
    if (data instanceof Date) {
      const day = String(data.getDate()).padStart(2, '0');
      const month = String(data.getMonth() + 1).padStart(2, '0');
      const year = data.getFullYear();
      return `${day}-${month}-${year}`;
    }
    
    return data;
  };

  return (
    <Box className="agendamento-bg">
      <Paper className="agendamento-main">
        <Box className="agendamento-header">
          <AssignmentIcon fontSize="large" className="agendamento-header-icon" />
          <Typography variant="h5" className="agendamento-header-title">
            Agendamento
          </Typography>
        </Box>
        <Stepper activeStep={activeStep} alternativeLabel className="agendamento-stepper">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={handleFinalizar}>
          {activeStep === 0 && (
            <Box className="agendamento-form-section">
              {/* Filial */}
              <Box className="agendamento-form-row">
                <Typography className="agendamento-label">Filial:</Typography>
                <FormControl variant="standard" size="small" fullWidth>
                  <InputLabel>Selecione a Filial</InputLabel>
                  <Select
                    name="filialId"
                    value={form.filialId || ""}
                    onChange={handleChange}
                    label="Selecione a Filial"
                    displayEmpty
                  >
                    {filiais.map((filial) => (
                      <MenuItem key={filial.id} value={filial.id}>
                        {filial.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Procedimento */}
              <Box className="agendamento-form-row">
                <Typography className="agendamento-label">Procedimento:</Typography>
                <FormControl variant="standard" size="small" fullWidth>
                  <InputLabel>Exame ou Consulta</InputLabel>
                  <Select
                    name="procedimento"
                    value={form.procedimento || ""}
                    onChange={handleChange}
                    label="Exame ou Consulta"
                    displayEmpty
                  >
                    <MenuItem value="exame">Exame</MenuItem>
                    <MenuItem value="consulta">Consulta</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Se for exame, mostra procedimentos */}
              {form.procedimento === "exame" && (
                <Box className="agendamento-form-row">
                  <Typography className="agendamento-label">Tipo de Exame:</Typography>
                  <FormControl variant="standard" size="small" fullWidth>
                    <InputLabel>Tipo de Exame</InputLabel>
                    <Select
                      name="procedimentoId" // Mudou de tipoExameId para procedimentoId
                      value={form.procedimentoId || ""}
                      onChange={handleChange}
                      label="Tipo de Exame"
                      displayEmpty
                    >
                      {procedimentos.map((procedimento) => (
                        <MenuItem key={procedimento.id} value={procedimento.id}>
                          {procedimento.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}

              {/* Se for consulta, mostra especialidades */}
              {form.procedimento === "consulta" && (
                <Box className="agendamento-form-row">
                  <Typography className="agendamento-label">Especialidade:</Typography>
                  <FormControl variant="standard" size="small" fullWidth>
                    <InputLabel>Especialidade</InputLabel>
                    <Select
                      name="especialidadeId"
                      value={form.especialidadeId || ""}
                      onChange={handleChange}
                      label="Especialidade"
                      displayEmpty
                    >
                      {especialidades.map((especialidade) => (
                        <MenuItem key={especialidade.id} value={especialidade.id}>
                          {especialidade.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}

              {/* Médico - aparece quando tem especialidade ou procedimento */}
              {(form.especialidadeId || form.procedimentoId) && (
                <Box className="agendamento-form-row">
                  <Typography className="agendamento-label">Médico:</Typography>
                  <FormControl variant="standard" size="small" fullWidth>
                    <InputLabel>Médico</InputLabel>
                    <Select
                      name="medicoId"
                      value={form.medicoId || ""}
                      onChange={handleChange}
                      label="Médico"
                      displayEmpty
                    >
                      {medicos.map((medico) => (
                        <MenuItem key={medico.id} value={medico.id}>
                          {medico.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}

              {/* Indicador de carregamento */}
              {loading && (
                <Box display="flex" justifyContent="center" mt={2}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </Box>
          )}
          {activeStep === 1 && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Escolha o horário disponível:
              </Typography>
              
              {/* Exibir informações do médico selecionado */}
              {form.medicoId && (
                <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="primary">
                    Médico selecionado: {medicos.find(m => m.id == form.medicoId)?.nome || 'N/A'}
                  </Typography>
                  {form.especialidadeId && (
                    <Typography variant="body2" color="text.secondary">
                      Especialidade: {especialidades.find(e => e.id == form.especialidadeId)?.nome || 'N/A'}
                    </Typography>
                  )}
                  {form.procedimentoId && (
                    <Typography variant="body2" color="text.secondary">
                      Procedimento: {procedimentos.find(p => p.id == form.procedimentoId)?.nome || 'N/A'}
                    </Typography>
                  )}
                </Box>
              )}

              {/* Seletor de período */}
              {form.medicoId && (
                <Box sx={{ mb: 3 }}>
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Período</InputLabel>
                    <Select
                      value={periodoSelecionado}
                      onChange={(e) => setPeriodoSelecionado(e.target.value)}
                      label="Período"
                    >
                      <MenuItem value="semana">Esta semana</MenuItem>
                      <MenuItem value="mes">Este mês</MenuItem>
                      <MenuItem value="proximo_mes">Próximo mês</MenuItem>
                    </Select>
                  </FormControl>
                  
                  {/* Botão para adicionar horário de encaixe */}
                  <Button
                    variant="outlined"
                    color="warning"
                    size="small"
                    sx={{ ml: 2 }}
                    onClick={() => setShowEncaixeDialog(true)}
                  >
                    + Adicionar Encaixe
                  </Button>
                </Box>
              )}
              
              {/* Horário selecionado */}
              {horarioSelecionado.data && horarioSelecionado.hora && (
                <Box sx={{ mb: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="primary">
                    Horário selecionado: {formatarDataParaExibicao(horarioSelecionado.data)} às {horarioSelecionado.hora}
                  </Typography>
                </Box>
              )}
              
              {loading ? (
                <Box display="flex" justifyContent="center" mt={2}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <Box className="horarios-disponiveis">
                  {/* Log de debug para renderização */}
                  {console.log('RENDER - horariosDisponiveis:', horariosDisponiveis)}
                  {horariosDisponiveis.length > 0 ? horariosDisponiveis.map((dia) => (
                    <Box key={dia.data} className="horarios-dia">
                      <Typography className="horarios-dia-titulo">
                        {dia.diaSemana} <br /> {dia.data}
                      </Typography>
                      <Box className="horarios-botoes">
                        {dia.horarios && dia.horarios.length > 0 ? dia.horarios.map((horario) => (
                          <Button
                            key={`${dia.data}-${horario.hora}`}
                            variant={
                              horarioSelecionado.data === dia.data && horarioSelecionado.hora === horario.hora
                                ? "contained"
                                : "outlined"
                            }
                            color="primary"
                            className="horario-botao"
                            onClick={() => handleSelecionarHorario(dia.data, horario.hora)}
                            disabled={!horario.disponivel}
                            sx={{ 
                              my: 0.5, 
                              width: "70px",
                              opacity: horario.disponivel ? 1 : 0.5
                            }}
                          >
                            {horario.hora}
                          </Button>
                        )) : (
                          <Typography variant="body2" color="text.secondary">
                            Sem horários
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )) : (
                    <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                      {form.medicoId ? 'Nenhum horário disponível encontrado para este médico.' : 'Selecione um médico para ver os horários disponíveis.'}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          )}
          {activeStep === 2 && (
            <Box className="agendamento-form-section">
              <Typography variant="h6" gutterBottom>
                Dados do Paciente
              </Typography>
              <Box className="agendamento-form-row">
                <Typography className="agendamento-label">Nome:</Typography>
                <TextField
                  name="nomePaciente"
                  value={form.nomePaciente || ""}
                  onChange={handleChange}
                  size="small"
                  variant="standard"
                  className="agendamento-input"
                  placeholder="Nome do paciente"
                  fullWidth
                  required
                />
              </Box>
              <Box className="agendamento-form-row">
                <Typography className="agendamento-label">Idade:</Typography>
                <TextField
                  name="idadePaciente"
                  value={form.idadePaciente || ""}
                  onChange={handleChange}
                  size="small"
                  variant="standard"
                  className="agendamento-input"
                  placeholder="Idade"
                  type="number"
                  inputProps={{ min: 0 }}
                  fullWidth
                  required
                />
              </Box>
              <Box className="agendamento-form-row">
                <Typography className="agendamento-label">Convênio:</Typography>
                <FormControl variant="standard" size="small" fullWidth>
                  <InputLabel>Selecione o Convênio</InputLabel>
                  <Select
                    name="convenioId"
                    value={form.convenioId || ""}
                    onChange={handleChange}
                    label="Selecione o Convênio"
                    displayEmpty
                    required
                  >
                    {convenios.map((convenio) => (
                      <MenuItem key={convenio.id} value={convenio.id}>
                        {convenio.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box className="agendamento-form-row">
                <Typography className="agendamento-label">Telefone:</Typography>
                <TextField
                  name="telefonePaciente"
                  value={form.telefonePaciente || ""}
                  onChange={handleChange}
                  size="small"
                  variant="standard"
                  className="agendamento-input"
                  placeholder="(99) 99999-9999"
                  fullWidth
                  required
                />
              </Box>
            </Box>
          )}

          {/* Botões sempre visíveis e alinhados */}
          <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleCancelar}
              sx={{ 
                borderColor: '#d32f2f',
                color: '#d32f2f',
                '&:hover': {
                  borderColor: '#b71c1c',
                  backgroundColor: 'rgba(211, 47, 47, 0.04)'
                }
              }}
            >
              Cancelar
            </Button>
            
            <Stack direction="row" spacing={2}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Voltar
              </Button>
              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={
                    (activeStep === 0 && (!form.filialId || !form.procedimento || (!form.especialidadeId && !form.procedimentoId) || !form.medicoId)) ||
                    (activeStep === 1 && (!form.data || !form.hora)) ||
                    loading
                  }
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleFinalizar}
                  disabled={
                    !form.nomePaciente || 
                    !form.idadePaciente || 
                    !form.convenioId || 
                    !form.telefonePaciente ||
                    !form.data ||
                    !form.hora ||
                    loading
                  }
                >
                  {loading ? <CircularProgress size={20} /> : 'Finalizar'}
                </Button>
              )}
            </Stack>
          </Stack>
        </form>
      </Paper>

      {/* Pop-up com os dados do agendamento */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Agendamento Confirmado</DialogTitle>
        <DialogContent>
          {dadosAgendamento && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
                ✓ Agendamento realizado com sucesso!
              </Typography>
              
              <Typography sx={{ mb: 1 }}>
                <strong>Filial:</strong> {dadosAgendamento.nomeFilial}
              </Typography>
              
              <Typography sx={{ mb: 1 }}>
                <strong>Paciente:</strong> {dadosAgendamento.nomePaciente}
              </Typography>
              
              <Typography sx={{ mb: 1 }}>
                <strong>Idade:</strong> {dadosAgendamento.idadePaciente} anos
              </Typography>
              
              <Typography sx={{ mb: 1 }}>
                <strong>Telefone:</strong> {dadosAgendamento.telefonePaciente}
              </Typography>
              
              <Typography sx={{ mb: 1 }}>
                <strong>Convênio:</strong> {dadosAgendamento.nomeConvenio}
              </Typography>
              
              <Typography sx={{ mb: 1 }}>
                <strong>Tipo:</strong> {dadosAgendamento.procedimento === 'consulta' ? 'Consulta' : 'Exame'}
              </Typography>
              
              {dadosAgendamento.procedimento === "consulta" && (
                <Typography sx={{ mb: 1 }}>
                  <strong>Especialidade:</strong> {dadosAgendamento.nomeEspecialidade}
                </Typography>
              )}
              
              {dadosAgendamento.procedimento === "exame" && (
                <Typography sx={{ mb: 1 }}>
                  <strong>Tipo de Exame:</strong> {dadosAgendamento.nomeProcedimento}
                </Typography>
              )}
              
              <Typography sx={{ mb: 1 }}>
                <strong>Médico:</strong> {dadosAgendamento.nomeMedico}
              </Typography>
              
              <Typography sx={{ mb: 1 }}>
                <strong>Data:</strong> {formatarDataParaExibicao(dadosAgendamento.data)}
              </Typography>
              
              <Typography sx={{ mb: 1 }}>
                <strong>Horário:</strong> {dadosAgendamento.hora}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mensagem de erro */}
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      )}

      {/* Mensagem de sucesso centralizada após fechar o pop-up */}
      {showMsg && (
        <Stack className="agendamento-alert-stack" direction="row">
          <Alert
            severity="success"
            className="agendamento-alert"
            onClose={() => setShowMsg(false)}
          >
            Agendamento realizado com sucesso!
          </Alert>
        </Stack>
      )}

      {/* Diálogo de confirmação de cancelamento */}
      <Dialog open={openCancelDialog} onClose={handleCloseCancelDialog}>
        <DialogTitle>Cancelar Agendamento?</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja cancelar o agendamento? Todos os dados preenchidos serão perdidos.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog} color="primary">
            Não, continuar
          </Button>
          <Button onClick={handleConfirmCancel} color="error" variant="contained">
            Sim, cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para Adicionar Horário de Encaixe */}
      <Dialog open={showEncaixeDialog} onClose={() => {
        setShowEncaixeDialog(false);
        resetEncaixeForm();
      }} maxWidth="sm" fullWidth>
        <DialogTitle>
          Adicionar Horário de Encaixe - {medicos.find(m => m.id == form.medicoId)?.nome}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="data"
                label="Data"
                type="date"
                value={encaixeForm.data}
                onChange={(e) => setEncaixeForm({...encaixeForm, data: e.target.value})}
                fullWidth
                required
                margin="dense"
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0] // Não permite datas passadas
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="hora_inicio"
                label="Hora Início"
                type="time"
                value={encaixeForm.hora_inicio}
                onChange={(e) => setEncaixeForm({...encaixeForm, hora_inicio: e.target.value})}
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
                value={encaixeForm.hora_fim}
                onChange={(e) => setEncaixeForm({...encaixeForm, hora_fim: e.target.value})}
                fullWidth
                required
                margin="dense"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Intervalo entre consultas</InputLabel>
                <Select
                  name="intervalo_minutos"
                  value={encaixeForm.intervalo_minutos}
                  label="Intervalo entre consultas"
                  onChange={(e) => setEncaixeForm({...encaixeForm, intervalo_minutos: e.target.value})}
                  sx={{ minWidth: 200 }}
                >
                  <MenuItem value={15}>15 minutos</MenuItem>
                  <MenuItem value={30}>30 minutos</MenuItem>
                  <MenuItem value={45}>45 minutos</MenuItem>
                  <MenuItem value={60}>60 minutos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="observacoes"
                label="Observações"
                value={encaixeForm.observacoes}
                onChange={(e) => setEncaixeForm({...encaixeForm, observacoes: e.target.value})}
                fullWidth
                multiline
                rows={3}
                margin="dense"
                placeholder="Ex: Horário de encaixe para emergências"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowEncaixeDialog(false);
            resetEncaixeForm();
          }}>Cancelar</Button>
          <Button variant="contained" onClick={handleEncaixeSubmit}>Adicionar Encaixe</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}