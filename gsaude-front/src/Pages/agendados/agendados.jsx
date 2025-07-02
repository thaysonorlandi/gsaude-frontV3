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
  ListItemIcon,
} from "@mui/material";
import dayjs from "dayjs";
import "./agendados.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

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
    status: "Realizada",
  },
  {
    id: 2,
    tipo: "Exame",
    exame: "Raio-X",
    medico: "Dr. Pedro",
    data: "2025-06-28",
    hora: "10:00",
    paciente: "Carlos",
    status: "Aguardando resposta",
  },
  {
    id: 3,
    tipo: "Consulta",
    especialidade: "Dermatologia",
    medico: "Dra. Ana",
    data: "2025-06-29",
    hora: "11:00",
    paciente: "José",
    status: "Cancelada",
  },
  {
    id: 4,
    tipo: "Exame",
    exame: "Hemograma",
    medico: "Dr. João",
    data: "2025-06-29",
    hora: "14:00",
    paciente: "Paula",
    status: "Aguardando resposta",
  },
];

function getStatusClass(status) {
  if (status === "Realizada") return "status-realizada";
  if (status === "Aguardando resposta") return "status-aguardando";
  if (status === "Cancelada") return "status-cancelada";
  return "";
}

export default function VerificarAgendamentos() {
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [especialidadeFiltro, setEspecialidadeFiltro] = useState("");
  const [exameFiltro, setExameFiltro] = useState("");
  const [medicoFiltro, setMedicoFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState(""); // Novo estado para o filtro de status

  // Filtragem dos agendamentos
  const agendamentosFiltrados = agendamentos.filter((item) => {
    if (tipoFiltro && item.tipo !== tipoFiltro) return false;
    if (especialidadeFiltro && item.tipo === "Consulta" && item.especialidade !== especialidadeFiltro) return false;
    if (exameFiltro && item.tipo === "Exame" && item.exame !== exameFiltro) return false;
    if (medicoFiltro && item.medico !== medicoFiltro) return false;
    if (statusFiltro && item.status !== statusFiltro) return false; // Filtra pelo status
    return true;
  });

  return (
    <Box className="agenda-container">
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
                    {especialidades.map((esp) => (
                      <MenuItem key={esp} value={esp}>
                        {esp}
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
                    {medicos.map((m) => (
                      <MenuItem key={m.nome} value={m.nome}>
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
                    <MenuItem value="Aguardando resposta">Aguardando resposta</MenuItem>
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
                    {tiposExame.map((ex) => (
                      <MenuItem key={ex} value={ex}>
                        {ex}
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
                    {medicos.map((m) => (
                      <MenuItem key={m.nome} value={m.nome}>
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
                    <MenuItem value="Aguardando resposta">Aguardando resposta</MenuItem>
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
                    {medicos.map((m) => (
                      <MenuItem key={m.nome} value={m.nome}>
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
                    <MenuItem value="Aguardando resposta">Aguardando resposta</MenuItem>
                    <MenuItem value="Cancelada">Cancelada</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </>
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
              <ListItem key={item.id} divider
                secondaryAction={
                  <span className={getStatusClass(item.status)}>
                    {item.status}
                  </span>
                }
              >
                <ListItemIcon>
                  <span
                    className={
                      item.tipo === "Exame"
                        ? "dot-exame"
                        : "dot-consulta"
                    }
                  />
                </ListItemIcon>
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
        <Box className="agenda-legenda" sx={{marginTop: 2}}>
          <span className="dot-consulta" /> Consulta &nbsp;&nbsp;
          <span className="dot-exame" /> Exame
        </Box>
      </Paper>
    </Box>
  );
}