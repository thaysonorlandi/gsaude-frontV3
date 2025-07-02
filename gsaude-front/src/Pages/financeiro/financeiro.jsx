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
} from "@mui/material";
import dayjs from "dayjs";
import "./financeiro.css"; // Importando o CSS externo

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

export default function ConsultasFinanceiro() {
  const [open, setOpen] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);
  const [form, setForm] = useState({});

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
    let novoForm = { ...form, [name]: value };
    if (name === "horaInicio" || name === "tempoDuracao") {
      novoForm.horaFinal = calcularHoraFinal(
        name === "horaInicio" ? value : form.horaInicio,
        name === "tempoDuracao" ? value : form.tempoDuracao
      );
    }
    setForm(novoForm);
  };

  return (
    <Box
      className="consultas-container"
    >
      <Paper className="consultas-paper">
        <Typography variant="h5" gutterBottom>
          Consultas Atuais e Passadas
        </Typography>
        <List>
          {consultas.map((consulta) => (
            <ListItem
              key={consulta.id}
              divider
              button
              onClick={() => handleOpen(consulta)}
              className="consulta-list-item"
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

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Detalhes da Consulta</DialogTitle>
        <DialogContent>
          {consultaSelecionada && (
            <Box component="form" className="consulta-form">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Paciente"
                    value={consultaSelecionada.paciente}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Médico"
                    value={consultaSelecionada.medico}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Especialidade"
                    value={consultaSelecionada.especialidade}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Procedimento"
                    value={consultaSelecionada.procedimento}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Data"
                    value={dayjs(consultaSelecionada.data).format("DD/MM/YYYY")}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Hora Agendada"
                    value={consultaSelecionada.hora}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Valor Recebido"
                    name="valorRecebido"
                    value={form.valorRecebido}
                    onChange={handleChange}
                    fullWidth
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Valor Pago ao Profissional"
                    name="valorPago"
                    value={form.valorPago}
                    onChange={handleChange}
                    fullWidth
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Hora de Início"
                    name="horaInicio"
                    value={form.horaInicio}
                    onChange={handleChange}
                    fullWidth
                    type="time"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Tempo de Duração (minutos)"
                    name="tempoDuracao"
                    value={form.tempoDuracao}
                    onChange={handleChange}
                    fullWidth
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Hora Final"
                    name="horaFinal"
                    value={form.horaFinal}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Observações"
                    name="observacoes"
                    value={form.observacoes}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    minRows={2}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleClose}>
            Enviar ao Financeiro
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}