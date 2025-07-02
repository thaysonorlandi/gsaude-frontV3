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
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import "./agendamento.css";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";

const steps = ["Dados Iniciais", "Horários", "Dados Adicionais"];

const especialidades = [
  { value: "cardiologia", label: "Cardiologia" },
  { value: "dermatologia", label: "Dermatologia" },
];

const exames = [
  { value: "ultrassom", label: "Ultrassom" },
  { value: "raio_x", label: "Raio-X" },
];

const medicos = [
  {
    value: "dr_joao",
    label: "Dr. João",
    especialidade: "cardiologia",
    exames: ["ultrassom"],
  },
  {
    value: "dra_ana",
    label: "Dra. Ana",
    especialidade: "dermatologia",
    exames: ["raio_x", "ultrassom"],
  },
];

const horariosExemplo = [
  {
    data: "20/02/21",
    diaSemana: "Sáb",
    horarios: ["08:00", "08:20", "08:40"],
  },
  {
    data: "21/02/21",
    diaSemana: "Dom",
    horarios: ["10:00", "10:20", "10:40"],
  },
  {
    data: "22/02/21",
    diaSemana: "Seg",
    horarios: ["11:00", "10:20", "10:40"],
  },
  // ...outros dias
];
const FORMULARIO_INICIAL = {
  filial: "Hospital São Roque",
  paciente: "",
  tipo: "",
  especialidade: "",
  medico: "",
  data: "",
  hora: "",
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
  // Filtra médicos conforme seleção
  const medicosExame = form.tipoExame
    ? medicos.filter((m) => m.exames.includes(form.tipoExame))
    : [];

  const medicosConsulta = form.especialidade
    ? medicos.filter((m) => m.especialidade === form.especialidade)
    : [];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Limpa campos dependentes ao trocar procedimento
    if (e.target.name === "procedimento") {
      setForm((f) => ({
        ...f,
        procedimento: e.target.value,
        tipoExame: "",
        especialidade: "",
        medico: "",
      }));
    }
    if (e.target.name === "tipoExame" || e.target.name === "especialidade") {
      setForm((f) => ({
        ...f,
        medico: "",
      }));
    }
  };

  const handleFinalizar = (e) => {
    e.preventDefault();
    setDadosAgendamento(form);
    setOpen(true);
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
    0: ["medico"], // exemplo etapa 1
    1: ["data"],    // exemplo etapa 2
    2: ["nomePaciente", "idadePaciente", "convenioPaciente", "telefonePaciente"],               // exemplo etapa 3
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
              {/* Campos fixos do exemplo */}
              <Box className="agendamento-form-row">
                <Typography className="agendamento-label">Filial:</Typography>
                <Typography>{form.filial}</Typography>
              </Box>
              <Box className="agendamento-form-row">
                <Typography className="agendamento-label">Unidades:</Typography>
                <TextField
                  name="unidade"
                  value={form.unidade}
                  onChange={handleChange}
                  size="small"
                  variant="standard"
                  className="agendamento-input"
                  placeholder="Unidades"
                  fullWidth
                />
              </Box>
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

              {/* Se for exame, mostra tipos de exame e médicos */}
              {form.procedimento === "exame" && (
                <>
                  <Box className="agendamento-form-row">
                    <Typography className="agendamento-label">Tipo de Exame:</Typography>
                    <FormControl variant="standard" size="small" fullWidth>
                      <InputLabel>Tipo de Exame</InputLabel>
                      <Select
                        name="tipoExame"
                        value={form.tipoExame}
                        onChange={handleChange}
                        label="Tipo de Exame"
                      >
                        {exames.map((e) => (
                          <MenuItem key={e.value} value={e.value}>
                            {e.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  {form.tipoExame && (
                    <Box className="agendamento-form-row">
                      <Typography className="agendamento-label">Médico:</Typography>
                      <FormControl variant="standard" size="small" fullWidth>
                        <InputLabel>Médico</InputLabel>
                        <Select
                          name="medico"
                          value={form.medico}
                          onChange={handleChange}
                          label="Médico"
                        >
                          {medicosExame.map((m) => (
                            <MenuItem key={m.value} value={m.value}>
                              {m.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  )}
                </>
              )}

              {/* Se for consulta, mostra especialidade e médicos */}
              {form.procedimento === "consulta" && (
                <>
                  <Box className="agendamento-form-row">
                    <Typography className="agendamento-label">Especialidade:</Typography>
                    <FormControl variant="standard" size="small" fullWidth>
                      <InputLabel>Especialidade</InputLabel>
                      <Select
                        name="especialidade"
                        value={form.especialidade}
                        onChange={handleChange}
                        label="Especialidade"
                      >
                        {especialidades.map((e) => (
                          <MenuItem key={e.value} value={e.value}>
                            {e.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  {form.especialidade && (
                    <Box className="agendamento-form-row">
                      <Typography className="agendamento-label">Médico:</Typography>
                      <FormControl variant="standard" size="small" fullWidth>
                        <InputLabel>Médico</InputLabel>
                        <Select
                          name="medico"
                          value={form.medico}
                          onChange={handleChange}
                          label="Médico"
                        >
                          {medicosConsulta.map((m) => (
                            <MenuItem key={m.value} value={m.value}>
                              {m.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  )}
                </>
              )}
            </Box>
          )}
          {activeStep === 1 && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Escolha o horário disponível:
              </Typography>
              <Box className="horarios-disponiveis">
                {horariosExemplo.map((dia) => (
                  <Box key={dia.data} className="horarios-dia">
                    <Typography className="horarios-dia-titulo">
                      {dia.diaSemana} <br /> {dia.data}
                    </Typography>
                    <Box className="horarios-botoes">
                      {dia.horarios.map((hora) => (
                        <Button
                          key={hora}
                          variant={
                            horarioSelecionado.data === dia.data && horarioSelecionado.hora === hora
                              ? "contained"
                              : "outlined"
                          }
                          color="primary"
                          className="horario-botao"
                          onClick={() => handleSelecionarHorario(dia.data, hora)}
                          sx={{ my: 0.5, width: "70px" }}
                        >
                          {hora}
                        </Button>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
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
                  onChange={(e) => setForm({ ...form, nomePaciente: e.target.value })}
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
                  onChange={(e) => setForm({ ...form, idadePaciente: e.target.value })}
                  size="small"
                  variant="standard"
                  className="agendamento-input"
                  placeholder="Idade"
                  type="number"
                  fullWidth
                  required
                />
              </Box>
              <Box className="agendamento-form-row">
                <Typography className="agendamento-label">Convênio:</Typography>
                <TextField
                  name="convenioPaciente"
                  value={form.convenioPaciente || ""}
                  onChange={(e) => setForm({ ...form, convenioPaciente: e.target.value })}
                  size="small"
                  variant="standard"
                  className="agendamento-input"
                  placeholder="Convênio"
                  fullWidth
                  required
                />
              </Box>
              <Box className="agendamento-form-row">
                <Typography className="agendamento-label">Telefone:</Typography>
                <TextField
                  name="telefonePaciente"
                  value={form.telefonePaciente || ""}
                  onChange={(e) => setForm({ ...form, telefonePaciente: e.target.value })}
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
        <DialogTitle>Dados do Agendamento</DialogTitle>
        <DialogContent>
          {dadosAgendamento && (
            <>
              <Typography>
                <b>Paciente:</b> {dadosAgendamento.paciente}
              </Typography>
              <Typography>
                <b>Tipo:</b> {dadosAgendamento.tipo}
              </Typography>
              {dadosAgendamento.tipo === "Consulta" && (
                <Typography>
                  <b>Especialidade:</b> {dadosAgendamento.especialidade}
                </Typography>
              )}
              {dadosAgendamento.tipo === "Exame" && (
                <Typography>
                  <b>Tipo de Exame:</b> {dadosAgendamento.especialidade}
                </Typography>
              )}
              <Typography>
                <b>Médico:</b> {dadosAgendamento.medico}
              </Typography>
              <Typography>
                <b>Data:</b> {dadosAgendamento.data}
              </Typography>
              <Typography>
                <b>Hora:</b> {dadosAgendamento.hora}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mensagem de sucesso centralizada após fechar o pop-up */}
      {showMsg && (
        <Stack className="agendamento-alert-stack" direction="row" alignItems="center" justifyContent="center">
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