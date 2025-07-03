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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  DialogContentText,
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

  // Estado para controle do Dialog e agendamento selecionado
  const [openDialog, setOpenDialog] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [form, setForm] = useState({});

  // Estado local dos agendamentos (para simulação)
  const [agendamentosState, setAgendamentosState] = useState(agendamentos);

  // Atualize o filtro para usar o estado local
  const agendamentosFiltrados = agendamentosState.filter((item) => {
    if (tipoFiltro && item.tipo !== tipoFiltro) return false;
    if (especialidadeFiltro && item.tipo === "Consulta" && item.especialidade !== especialidadeFiltro) return false;
    if (exameFiltro && item.tipo === "Exame" && item.exame !== exameFiltro) return false;
    if (medicoFiltro && item.medico !== medicoFiltro) return false;
    if (statusFiltro && item.status !== statusFiltro) return false;
    return true;
  });

  // Abrir Dialog
  const handleOpenDialog = (item) => {
    setAgendamentoSelecionado(item);
    setForm({
      ...item,
      data: item.data,
      hora: item.hora,
    });
    setOpenDialog(true);
  };

  // Fechar Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAgendamentoSelecionado(null);
    setForm({});
  };

  // Alterar campos do formulário
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Salvar reagendamento
  const handleSalvar = () => {
    setAgendamentosState((prev) =>
      prev.map((item) =>
        item.id === agendamentoSelecionado.id
          ? { ...item, data: form.data, hora: form.hora }
          : item
      )
    );
    handleCloseDialog();
  };

  // Estado para pop-up de confirmação
  const [openConfirm, setOpenConfirm] = useState(false);

  // Cancelar agendamento
  const handleCancelar = () => {
    setOpenConfirm(true);
  };

  // Confirma o cancelamento
  const handleConfirmarCancelamento = () => {
    setAgendamentosState((prev) =>
      prev.map((item) =>
        item.id === agendamentoSelecionado.id
          ? { ...item, status: "Cancelada" }
          : item
      )
    );
    setOpenConfirm(false);
    handleCloseDialog();
  };

  // Cancela o pop-up de confirmação
  const handleFecharConfirm = () => {
    setOpenConfirm(false);
  };

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
              <ListItem
                key={item.id}
                divider
                button
                // Só permite abrir se não for Realizada ou Cancelada
                onClick={() => {
                  if (item.status !== "Realizada" && item.status !== "Cancelada") {
                    handleOpenDialog(item);
                  }
                }}
                secondaryAction={
                  <span className={getStatusClass(item.status)}>
                    {item.status}
                  </span>
                }
                style={{
                  cursor:
                    item.status === "Realizada" || item.status === "Cancelada"
                      ? "not-allowed"
                      : "pointer",
                }}
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
                    <span>
                      <b>Paciente:</b> {item.paciente} &nbsp;|&nbsp;
                      <b>Médico:</b> {item.medico} &nbsp;|&nbsp;
                      <b>Data:</b> {dayjs(item.data).format("DD/MM/YYYY")} &nbsp;|&nbsp;
                      <b>Hora:</b> {item.hora}
                    </span>
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

      {/* Dialog para reagendar ou cancelar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>
          {agendamentoSelecionado?.tipo === "Consulta"
            ? "Detalhes da Consulta"
            : "Detalhes do Exame"}
        </DialogTitle>
        <DialogContent>
          {agendamentoSelecionado && (
            <Box component="form" sx={{ mt: 1 }}>
              <TextField
                label="Paciente"
                value={agendamentoSelecionado.paciente}
                fullWidth
                margin="dense"
                InputProps={{ readOnly: true }}
                size="small"
              />
              <TextField
                label="Médico"
                value={agendamentoSelecionado.medico}
                fullWidth
                margin="dense"
                InputProps={{ readOnly: true }}
                size="small"
              />
              {agendamentoSelecionado.tipo === "Consulta" && (
                <TextField
                  label="Especialidade"
                  value={agendamentoSelecionado.especialidade}
                  fullWidth
                  margin="dense"
                  InputProps={{ readOnly: true }}
                  size="small"
                />
              )}
              {agendamentoSelecionado.tipo === "Exame" && (
                <TextField
                  label="Exame"
                  value={agendamentoSelecionado.exame}
                  fullWidth
                  margin="dense"
                  InputProps={{ readOnly: true }}
                  size="small"
                />
              )}
              <TextField
                label="Data"
                name="data"
                type="date"
                value={form.data}
                onChange={handleChange}
                fullWidth
                margin="dense"
                size="small"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Hora"
                name="hora"
                type="time"
                value={form.hora}
                onChange={handleChange}
                fullWidth
                margin="dense"
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleCancelar}>
            Cancelar Agendamento
          </Button>
          <Button onClick={handleCloseDialog}>Fechar</Button>
          <Button variant="contained" onClick={handleSalvar}>
            Salvar Alterações
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pop-up de confirmação */}
      <Dialog open={openConfirm} onClose={handleFecharConfirm}>
        <DialogTitle>Cancelar Agendamento</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja cancelar este agendamento?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharConfirm}>Não</Button>
          <Button color="error" onClick={handleConfirmarCancelamento} autoFocus>
            Sim, cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}