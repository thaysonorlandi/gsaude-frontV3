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
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
} from "@mui/material";
import { DateCalendar, LocalizationProvider, PickersDay } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ViewDayIcon from "@mui/icons-material/ViewDay";
import ListIcon from "@mui/icons-material/List";

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

function getEventosPorData(agendamentos, data) {
  return agendamentos.filter(
    (a) => a.data === dayjs(data).format("YYYY-MM-DD")
  );
}

function renderDay(day, _value, DayComponentProps, agendamentos) {
  const eventos = getEventosPorData(agendamentos, day);
  if (eventos.length === 0) return <PickersDay {...DayComponentProps} />;
  return (
    <Box sx={{ position: "relative" }}>
      <PickersDay {...DayComponentProps} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          position: "absolute",
          bottom: 4,
          left: 0,
          right: 0,
        }}
      >
        {eventos.map((evento, idx) => (
          <Box
            key={idx}
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor:
                evento.tipo === "Exame" ? "#43a047" : "#1976d2",
              marginLeft: idx > 0 ? "2px" : 0,
              border: "1px solid #fff",
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default function AgendaCalendario() {
  const [dataFiltro, setDataFiltro] = useState(dayjs());
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [subFiltro, setSubFiltro] = useState("");
  const [medicoFiltro, setMedicoFiltro] = useState("");
  const [view, setView] = useState("month");

  // Filtragem dos agendamentos
  const agendamentosFiltrados = agendamentos.filter((item) => {
    let ok = true;
    if (dataFiltro && (view === "day" || view === "list")) {
      ok = ok && item.data === dayjs(dataFiltro).format("YYYY-MM-DD");
    }
    if (tipoFiltro) {
      ok = ok && item.tipo === tipoFiltro;
      if (tipoFiltro === "Consulta" && subFiltro)
        ok = ok && item.especialidade === subFiltro;
      if (tipoFiltro === "Exame" && subFiltro)
        ok = ok && item.exame === subFiltro;
    }
    if (medicoFiltro) {
      ok = ok && item.medico === medicoFiltro;
    }
    return ok;
  });

  // Para destacar datas no calendário

  return (
    <Box className="agenda-container" sx={{ maxWidth: 1000, margin: "32px auto" }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Agenda de Consultas e Exames
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={3}>
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
            <Grid item xs={12} sm={3}>
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
            <Grid item xs={12} sm={3}>
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
          <Grid item xs={12} sm={3}>
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
          <Grid item xs={12} sm={3} sx={{ display: "flex", alignItems: "center" }}>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(_, next) => next && setView(next)}
              size="small"
            >
              <ToggleButton value="month" aria-label="Mês">
                <CalendarMonthIcon />
              </ToggleButton>
              <ToggleButton value="day" aria-label="Dia">
                <ViewDayIcon />
              </ToggleButton>
              <ToggleButton value="list" aria-label="Lista">
                <ListIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>

        {view === "month" && (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={dataFiltro}
              onChange={setDataFiltro}
              renderDay={(day, value, DayComponentProps) =>
                renderDay(day, value, DayComponentProps, agendamentos)
              }
              sx={{ mx: "auto" }}
            />
            <Typography variant="body2" sx={{ mt: 2 }}>
              <span style={{ color: "#1976d2", fontWeight: "bold" }}>●</span> Consulta &nbsp;
              <span style={{ color: "#43a047", fontWeight: "bold" }}>●</span> Exame
            </Typography>
          </LocalizationProvider>
        )}

        {view === "day" && (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <DateCalendar
                  value={dataFiltro}
                  onChange={setDataFiltro}
                  views={["day", "month", "year"]}
                  sx={{ mx: "auto" }}
                  renderDay={(day, value, DayComponentProps) =>
                    renderDay(day, value, DayComponentProps, agendamentos)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Agendamentos do dia {dayjs(dataFiltro).format("DD/MM/YYYY")}
                </Typography>
                <List>
                  {agendamentosFiltrados.length === 0 ? (
                    <Typography color="text.secondary" sx={{ ml: 2 }}>
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
                                <b>Hora:</b> {item.hora}
                              </span>
                            </>
                          }
                        />
                      </ListItem>
                    ))
                )}
                </List>
              </Grid>
            </Grid>
          </LocalizationProvider>
        )}

        {view === "list" && (
          <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={dataFiltro}
                onChange={setDataFiltro}
                views={["day", "month", "year"]}
                sx={{ mx: "auto", mb: 2 }}
                renderDay={(day, value, DayComponentProps) =>
                  renderDay(day, value, DayComponentProps, agendamentos)
                }
              />
            </LocalizationProvider>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Lista de Agendamentos do dia {dayjs(dataFiltro).format("DD/MM/YYYY")}
            </Typography>
            <List>
              {agendamentosFiltrados.length === 0 ? (
                <Typography color="text.secondary" sx={{ ml: 2 }}>
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
                            <b>Hora:</b> {item.hora}
                          </span>
                        </>
                      }
                    />
                  </ListItem>
                )))}
            </List>
          </>
        )}
      </Paper>
    </Box>
  );
}