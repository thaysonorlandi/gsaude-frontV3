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
  tipo: "",
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
  const [open, setOpen] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [dadosAgendamento, setDadosAgendamento] = useState(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
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
    if (form.especialidadeId) {
      carregarMedicosPorEspecialidade(form.especialidadeId);
    }
  }, [form.especialidadeId, carregarMedicosPorEspecialidade]);

  // Carrega médicos quando muda o procedimento (antes era tipoExameId)
  useEffect(() => {
    if (form.procedimentoId) {
      carregarMedicosPorProcedimento(form.procedimentoId);
    }
  }, [form.procedimentoId, carregarMedicosPorProcedimento]);

  // Carrega horários quando muda o médico
  useEffect(() => {
    if (form.medicoId) {
      carregarHorarios(form.medicoId);
    }
  }, [form.medicoId, carregarHorarios]);
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
      // Preparar dados para envio
      const dadosParaEnvio = {
        filial_id: form.filialId,
        medico_id: form.medicoId,
        tipo_procedimento: form.procedimento,
        especialidade_id: form.especialidadeId || null,
        procedimento_id: form.procedimentoId || null, // Mudou de tipo_exame_id
        data_agendamento: form.data,
        hora_agendamento: form.hora,
        nome_paciente: form.nomePaciente,
        idade_paciente: form.idadePaciente,
        convenio_id: form.convenioId,
        telefone_paciente: removerMascaraTelefone(form.telefonePaciente),
      };

      // Chama o serviço para criar o agendamento
      const resultado = await criarAgendamento(dadosParaEnvio);
      
      // Salva os dados completos para exibir no popup
      setDadosAgendamento({
        ...form,
        id: resultado.id,
        // Adiciona os nomes dos itens selecionados
        nomeFilial: filiais.find(f => f.id === form.filialId)?.nome || '',
        nomeMedico: medicos.find(m => m.id === form.medicoId)?.nome || '',
        nomeEspecialidade: especialidades.find(e => e.id === form.especialidadeId)?.nome || '',
        nomeProcedimento: procedimentos.find(p => p.id === form.procedimentoId)?.nome || '', // Mudou de nomeTipoExame
        nomeConvenio: convenios.find(c => c.id === form.convenioId)?.nome || '',
      });
      
      setOpen(true);
    } catch (error) {
      console.error('Erro ao finalizar agendamento:', error);
      setError('Erro ao finalizar agendamento. Tente novamente.');
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
    setOpenCancelDialog(true);
  }

  function handleConfirmCancel() {
    setOpenCancelDialog(false);
    setForm(FORMULARIO_INICIAL);
    navigate("/home");
  }

  function handleCloseCancelDialog() {
    setOpenCancelDialog(false);
  }

  // Defina os campos obrigatórios de cada etapa em um objeto:
  const CAMPOS_OBRIGATORIOS = {
    0: ["filialId", "medicoId"], // etapa 1: dados iniciais
    1: ["data", "hora"],         // etapa 2: horários
    2: ["nomePaciente", "idadePaciente", "convenioId", "telefonePaciente"], // etapa 3: dados adicionais
  };

  // Função dinâmica de validação:
  function isStepValid(step) {
    const campos = CAMPOS_OBRIGATORIOS[step] || [];
    return campos.every((campo) => form[campo] && String(form[campo]).trim() !== "");
  }

  // Supondo que form.medico tem o nome do médico selecionado

  // Atualize o handle para seleção de horário:
  function handleSelecionarHorario(data, hora) {
    setHorarioSelecionado({ data, hora });
    setForm((f) => ({
      ...f,
      data,
      hora,
    }));
  }

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
                    value={form.filialId}
                    onChange={handleChange}
                    label="Selecione a Filial"
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
                    value={form.procedimento}
                    onChange={handleChange}
                    label="Exame ou Consulta"
                  >
                    <MenuItem value="">
                      <em>Selecione</em>
                    </MenuItem>
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
                      value={form.procedimentoId}
                      onChange={handleChange}
                      label="Tipo de Exame"
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
                      value={form.especialidadeId}
                      onChange={handleChange}
                      label="Especialidade"
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
                      value={form.medicoId}
                      onChange={handleChange}
                      label="Médico"
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
              
              {loading ? (
                <Box display="flex" justifyContent="center" mt={2}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <Box className="horarios-disponiveis">
                  {horariosDisponiveis.map((dia) => (
                    <Box key={dia.data} className="horarios-dia">
                      <Typography className="horarios-dia-titulo">
                        {dia.diaSemana} <br /> {dia.data}
                      </Typography>
                      <Box className="horarios-botoes">
                        {dia.horarios.map((horario) => (
                          <Button
                            key={horario.hora}
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
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
              
              {horariosDisponiveis.length === 0 && !loading && (
                <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                  Nenhum horário disponível encontrado.
                </Typography>
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
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleCancelar}
              className="agendamento-btn-cancelar"
            >
              Cancelar
            </Button>
            {activeStep > 0 && (
              <Button variant="outlined" onClick={() => setActiveStep(activeStep - 1)}>
                Voltar
              </Button>
            )}
            {activeStep < Object.keys(CAMPOS_OBRIGATORIOS).length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setActiveStep(activeStep + 1)}
                disabled={!isStepValid(activeStep)}
              >
                Avançar
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!isStepValid(activeStep)}
              >
                Finalizar Agendamento
              </Button>
            )}
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
                <strong>Data:</strong> {dadosAgendamento.data}
              </Typography>
              
              <Typography sx={{ mb: 1 }}>
                <strong>Horário:</strong> {dadosAgendamento.hora}
              </Typography>
              
              {dadosAgendamento.id && (
                <Typography sx={{ mt: 2, fontSize: '0.9em', color: 'text.secondary' }}>
                  <strong>ID do Agendamento:</strong> #{dadosAgendamento.id}
                </Typography>
              )}
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
            Deseja cancelar a operação e retornar para a página inicial?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog} color="primary">
            Não
          </Button>
          <Button onClick={handleConfirmCancel} color="error" variant="contained">
            Sim
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}