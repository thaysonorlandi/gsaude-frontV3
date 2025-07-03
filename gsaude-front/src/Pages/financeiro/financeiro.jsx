import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Snackbar,
  Alert,
  MenuItem, // adicione esta linha
} from "@mui/material";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);
import "./financeiro.css";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";


// Dados simulados
const consultas = [
  {
    id: 1,
    paciente: "Maria",
    medico: "Dr. João",
    especialidade: "Cardiologia",
    procedimento: "Consulta",
    data: "2025-06-28",
    hora: "09:00",
    valorRecebido: "",
    valorPago: "",
    horaInicio: "",
    tempoDuracao: "",
    horaFinal: "",
    observacoes: "",
    status: "Realizada",
  },
  {
    id: 2,
    paciente: "José",
    medico: "Dra. Ana",
    especialidade: "Dermatologia",
    procedimento: "Consulta",
    data: "2025-06-20",
    hora: "11:00",
    valorRecebido: "",
    valorPago: "",
    horaInicio: "",
    tempoDuracao: "",
    horaFinal: "",
    observacoes: "",
    status: "Pendente",
  },
];

function calcularHoraFinal(horaInicio, tempoDuracao) {
  if (!horaInicio || !tempoDuracao) return "";
  const [h, m] = horaInicio.split(":").map(Number);
  const totalMin = h * 60 + m + Number(tempoDuracao);
  const hora = String(Math.floor(totalMin / 60)).padStart(2, "0");
  const min = String(totalMin % 60).padStart(2, "0");
  return `${hora}:${min}`;
}

// Função para formatar valor monetário
function formatarMoeda(valor) {
  if (valor === "" || valor === undefined) return "";
  // Remove tudo que não for número
  const numero = valor.toString().replace(/\D/g, "");
  // Converte para centavos
  const centavos = (parseInt(numero, 10) / 100).toFixed(2);
  // Formata para moeda brasileira
  return "R$ " + centavos.replace(".", ",");
}

// Função para manter apenas números no input
function apenasNumeros(valor) {
  return valor.replace(/\D/g, "");
}

// Função para definir classe/cor do status
function getStatusClass(status) {
  if (status === "Realizada") return "status-realizada";
  if (status === "Pendente") return "status-pendente";
  return "";
}

export default function ConsultasFinanceiro() {
  const [open, setOpen] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);
  const [form, setForm] = useState({});
  const [sucesso, setSucesso] = useState(false);

  // Estado local das consultas
  const [consultasState, setConsultasState] = useState(consultas);

  const handleOpen = (consulta) => {
    setConsultaSelecionada(consulta);
    setForm({
      ...consulta,
      horaInicio: consulta.horaInicio || consulta.hora,
      tempoDuracao: consulta.tempoDuracao || "",
      horaFinal: consulta.horaFinal || "",
      valorRecebido: consulta.valorRecebido || "",
      valorPago: consulta.valorPago || "",
      observacoes: consulta.observacoes || "",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setConsultaSelecionada(null);
    setForm({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let novoForm = { ...form };

    if (name === "valorRecebido" || name === "valorPago") {
      // Mantém apenas números e limita a 8 dígitos
      const numeros = apenasNumeros(value).slice(0, 8);
      novoForm[name] = numeros;
    } else {
      novoForm[name] = value;
    }

    if (name === "horaInicio" || name === "tempoDuracao") {
      novoForm.horaFinal = calcularHoraFinal(
        name === "horaInicio" ? value : form.horaInicio,
        name === "tempoDuracao" ? value : form.tempoDuracao
      );
    }
    setForm(novoForm);
  };

  // Filtra procedimentos do dia atual ou anteriores
  const hoje = dayjs().format("YYYY-MM-DD");
  const procedimentosFiltrados = consultasState.filter(
    (c) => dayjs(c.data).isSameOrBefore(hoje)
  );

  const handleEnviar = () => {
    // Atualiza o status e outros campos no array local
    setConsultasState((prev) =>
      prev.map((c) =>
        c.id === consultaSelecionada.id ? { ...c, ...form } : c
      )
    );
    setSucesso(true);
    handleClose();
  };

  const handleCloseSnackbar = () => {
    setSucesso(false);
  };

  return (
    <Box className="consultas-container">
      <Paper className="consultas-paper">
        <Typography variant="h5" className="consultas-titulo">
          <CurrencyExchangeIcon className="consultas-icon" />
          Contabilidade
        </Typography>
        <List>
          {procedimentosFiltrados.map((consulta) => (
            <ListItem
              key={consulta.id}
              divider
              button
              onClick={() => handleOpen(consulta)}
              className="consulta-list-item"
              secondaryAction={
                <span className={getStatusClass(consulta.status)}>
                  {consulta.status}
                </span>
              }
            >
              <ListItemText
                primary={`${consulta.paciente} - ${consulta.especialidade} - ${consulta.medico}`}
                secondary={
                  <>
                    <span>
                      <b>Data:</b> {dayjs(consulta.data).format("DD/MM/YYYY")} &nbsp;|&nbsp;
                      <b>Hora:</b> {consulta.hora}
                    </span>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Detalhes da Consulta</DialogTitle>
        <DialogContent>
          {consultaSelecionada && (
            <Box component="form" className="consulta-form">
              {/* DADOS DO PACIENTE */}
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Dados do Paciente
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nome do Paciente"
                    value={consultaSelecionada.paciente}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Convênio"
                    value={consultaSelecionada.convenio || ""}
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>

              {/* DADOS DO MÉDICO/PROCEDIMENTO */}
              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                Dados do Médico / Procedimento
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Médico"
                    value={consultaSelecionada.medico}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Especialidade"
                    value={consultaSelecionada.especialidade}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Procedimento"
                    value={consultaSelecionada.procedimento}
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>

              {/* DADOS DA CONSULTA */}
              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                Dados da Consulta
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Data"
                    value={dayjs(consultaSelecionada.data).format("DD/MM/YYYY")}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Hora Agendada"
                    value={consultaSelecionada.hora}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Status"
                    value={consultaSelecionada.status}
                    fullWidth
                    size="small"
                    className={getStatusClass(consultaSelecionada.status)}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Hora de Início"
                    name="horaInicio"
                    value={form.horaInicio}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Tempo de Duração (minutos)"
                    name="tempoDuracao"
                    value={form.tempoDuracao}
                    onChange={handleChange}
                    fullWidth
                    inputProps={{ min: 0 }}
                    type="number"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Hora Final"
                    name="horaFinal"
                    value={form.horaFinal}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    size="small"
                  />
                </Grid>
              </Grid>

              {/* PAGAMENTOS */}
              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                Pagamentos
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Valor Recebido"
                    name="valorRecebido"
                    value={formatarMoeda(form.valorRecebido)}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    inputProps={{ maxLength: 11, inputMode: "numeric" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Valor Pago ao Profissional"
                    name="valorPago"
                    value={formatarMoeda(form.valorPago)}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    inputProps={{ maxLength: 11, inputMode: "numeric" }}
                  />
                </Grid>
              </Grid>

              {/* OBSERVAÇÃO */}
              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                Observação
              </Typography>
              <TextField
                label="Observações"
                name="observacoes"
                value={form.observacoes}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={2}
                size="small"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleEnviar}
            className="btn-financeiro"
          >
            Enviar ao Financeiro
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de sucesso */}
      <Snackbar
        open={sucesso}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        className="financeiro-alert-stack"
        direction="row"
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
      >
        <Alert
        severity="success"
        className="financeiro-alert"
        onClose={handleCloseSnackbar}
      >
        Enviado com sucesso!
      </Alert>
    </Snackbar>
  </Box>
);
}