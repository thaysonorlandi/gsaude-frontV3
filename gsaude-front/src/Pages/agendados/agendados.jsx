import React, { useState } from "react";
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
} from "@mui/material";
import dayjs from "dayjs";

import "./agendados.css";

// Dados simulados
const especialidades = ["Cardiologia", "Dermatologia", "Ortopedia"];
const tiposExame = ["Raio-X", "Ultrassom", "Hemograma"];
const medicos = [
  { nome: "Dr. João", especialidade: "Cardiologia" },
  { nome: "Dra. Ana", especialidade: "Dermatologia" },
  { nome: "Dr. Pedro", especialidade: "Ortopedia" },
];
const agendamentos = [
  {
    id: 1,
    tipo: "Consulta",
    especialidade: "Cardiologia",
    medico: "Dr. João",
    data: "2025-06-28",
    hora: "09:00",
    paciente: "Maria",
  },
  {
    id: 2,
    tipo: "Exame",
    exame: "Raio-X",
    medico: "Dr. Pedro",
    data: "2025-06-28",
    hora: "10:00",
    paciente: "Carlos",
  },
  {
    id: 3,
    tipo: "Consulta",
    especialidade: "Dermatologia",
    medico: "Dra. Ana",
    data: "2025-06-29",
    hora: "11:00",
    paciente: "José",
  },
  {
    id: 4,
    tipo: "Exame",
    exame: "Hemograma",
    medico: "Dr. João",
    data: "2025-06-29",
    hora: "14:00",
    paciente: "Paula",
  },
];

export default function AgendaConsultas() {
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [subFiltro, setSubFiltro] = useState("");
  const [medicoFiltro, setMedicoFiltro] = useState("");

  // Filtragem dos agendamentos
  const agendamentosFiltrados = agendamentos.filter((item) => {
    if (tipoFiltro && item.tipo !== tipoFiltro) return false;
    if (tipoFiltro === "Consulta" && subFiltro && item.especialidade !== subFiltro) return false;
    if (tipoFiltro === "Exame" && subFiltro && item.exame !== subFiltro) return false;
    if (medicoFiltro && item.medico !== medicoFiltro) return false;
    return true;
  });

  return (
    <Box className="agenda-container">
      <Paper className="agenda-paper">
        <Typography variant="h5" gutterBottom>
          Lista de Consultas e Exames
        </Typography>
        <Grid container spacing={2} className="agenda-filtros">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="tipo-label">Tipo</InputLabel>
              <Select
                labelId="tipo-label"
                value={tipoFiltro}
                label="Tipo"
                onChange={(e) => {
                  setTipoFiltro(e.target.value);
                  setSubFiltro("");
                }}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Consulta">Consulta</MenuItem>
                <MenuItem value="Exame">Exame</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {tipoFiltro === "Consulta" && (
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="esp-label">Especialidade</InputLabel>
                <Select
                  labelId="esp-label"
                  value={subFiltro}
                  label="Especialidade"
                  onChange={(e) => setSubFiltro(e.target.value)}
                >
                  <MenuItem value="">Todas</MenuItem>
                  {especialidades.map((esp) => (
                    <MenuItem key={esp} value={esp}>
                      {esp}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          {tipoFiltro === "Exame" && (
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="exame-label">Tipo de Exame</InputLabel>
                <Select
                  labelId="exame-label"
                  value={subFiltro}
                  label="Tipo de Exame"
                  onChange={(e) => setSubFiltro(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {tiposExame.map((ex) => (
                    <MenuItem key={ex} value={ex}>
                      {ex}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          {tipoFiltro && (
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="medico-label">Médico</InputLabel>
                <Select
                  labelId="medico-label"
                  value={medicoFiltro}
                  label="Médico"
                  onChange={(e) => setMedicoFiltro(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {medicos.map((m) => (
                    <MenuItem key={m.nome} value={m.nome}>
                      {m.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
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
              <ListItem key={item.id} divider>
                <ListItemText
                  primary={
                    item.tipo === "Consulta"
                      ? `Consulta de ${item.especialidade}`
                      : `Exame: ${item.exame}`
                  }
                  secondary={
                    <>
                      <span>
                        <b>Paciente:</b> {item.paciente} &nbsp;|&nbsp;
                        <b>Médico:</b> {item.medico} &nbsp;|&nbsp;
                        <b>Data:</b> {dayjs(item.data).format("DD/MM/YYYY")} &nbsp;|&nbsp;
                        <b>Hora:</b> {item.hora}
                      </span>
                    </>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Box>
  );
}