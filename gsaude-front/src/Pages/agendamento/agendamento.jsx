import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";

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
  // ...outros dias
];

export default function Agendamento() {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({
    filial: "Hospital de Caridade São Roque",
    unidade: "",
    procedimento: "",
    tipoExame: "",
    especialidade: "",
    medico: "",
    data: "",
    horaInicial: "",
    horaFinal: "",
  });
  const [horarioSelecionado, setHorarioSelecionado] = useState({});
  const [open, setOpen] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [dadosAgendamento, setDadosAgendamento] = useState(null);
  const navigate = useNavigate();

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

  const handleNext = () => setActiveStep((prev) => prev + 1);

  const handleFinalizar = (e) => {
    e.preventDefault();
    setDadosAgendamento(form);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setShowMsg(true);
    setTimeout(() => {
      setShowMsg(false);
      navigate("/home"); // Redireciona para a página principal
    }, 2000); // 2 segundos para o usuário ver a mensagem
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
            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button variant="contained" color="primary" onClick={handleNext}>
                Avançar
              </Button>
            </Box>
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
                        onClick={() => setHorarioSelecionado({ data: dia.data, hora })}
                        sx={{ my: 0.5, width: "70px" }}
                      >
                        {hora}
                      </Button>
                    ))}
                    <Button variant="text" size="small" sx={{ mt: 1 }}>
                      Mais...
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button
                variant="contained"
                color="primary"
                disabled={!horarioSelecionado.data || !horarioSelecionado.hora}
                onClick={handleNext}
              >
                Avançar
              </Button>
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
            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button variant="contained" color="primary" onClick={handleFinalizar}>
                Finalizar Agendamento
              </Button>
            </Box>
          </Box>
        )}
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
    </Box>
  );
}