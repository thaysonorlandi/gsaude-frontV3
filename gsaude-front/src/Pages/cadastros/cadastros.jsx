import React, { useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Typography,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import "./cadastros.css";

const especialidades = [
  "Cardiologia",
  "Dermatologia",
  "Ortopedia",
  "Pediatria",
  "Clínico Geral",
];

function Cadastros() {
  const [tipo, setTipo] = useState("medico");
  const [medicos, setMedicos] = useState([]);
  const [exames, setExames] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    especialidade: "",
    horarios: "",
    exame: "",
    medicoResponsavel: "",
    horariosExame: "",
  });

  const medicosDisponiveis = medicos.map((m) => m.nome);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTipoChange = (e) => {
    setTipo(e.target.value);
    setForm({
      nome: "",
      especialidade: "",
      horarios: "",
      exame: "",
      medicoResponsavel: "",
      horariosExame: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tipo === "medico") {
      setMedicos([
        ...medicos,
        {
          nome: form.nome,
          especialidade: form.especialidade,
          horarios: form.horarios.split(",").map((h) => h.trim()),
        },
      ]);
    } else {
      setExames([
        ...exames,
        {
          exame: form.exame,
          medicoResponsavel: form.medicoResponsavel,
          horarios: form.horariosExame.split(",").map((h) => h.trim()),
        },
      ]);
    }
    setForm({
      nome: "",
      especialidade: "",
      horarios: "",
      exame: "",
      medicoResponsavel: "",
      horariosExame: "",
    });
  };

  return (
    <div className="cadastro-container">
      <Paper className="cadastro-paper">
        <Typography variant="h5" gutterBottom>
          Cadastro de Médicos e Exames
        </Typography>
        <FormControl fullWidth className="cadastro-form-control">
          <InputLabel id="tipo-label">Tipo de Cadastro</InputLabel>
          <Select
            labelId="tipo-label"
            value={tipo}
            label="Tipo de Cadastro"
            onChange={handleTipoChange}
          >
            <MenuItem value="medico">Médico</MenuItem>
            <MenuItem value="exame">Exame</MenuItem>
          </Select>
        </FormControl>
        <form onSubmit={handleSubmit}>
          {tipo === "medico" ? (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nome do Médico"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="especialidade-label">Especialidade</InputLabel>
                  <Select
                    labelId="especialidade-label"
                    name="especialidade"
                    value={form.especialidade}
                    label="Especialidade"
                    onChange={handleChange}
                  >
                    {especialidades.map((esp) => (
                      <MenuItem key={esp} value={esp}>
                        {esp}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Horários disponíveis (ex: 08:00, 09:00, 10:00)"
                  name="horarios"
                  value={form.horarios}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nome do Exame"
                  name="exame"
                  value={form.exame}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="medico-label">Médico Responsável</InputLabel>
                  <Select
                    labelId="medico-label"
                    name="medicoResponsavel"
                    value={form.medicoResponsavel}
                    label="Médico Responsável"
                    onChange={handleChange}
                  >
                    {medicosDisponiveis.length === 0 ? (
                      <MenuItem value="" disabled>
                        Cadastre um médico primeiro
                      </MenuItem>
                    ) : (
                      medicosDisponiveis.map((nome) => (
                        <MenuItem key={nome} value={nome}>
                          {nome}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Horários disponíveis (ex: 08:00, 09:00, 10:00)"
                  name="horariosExame"
                  value={form.horariosExame}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          )}
          <div className="cadastro-btn-box">
            <Button type="submit" variant="contained">
              Cadastrar
            </Button>
          </div>
        </form>
        <div className="cadastro-listas">
          <Typography variant="h6">Médicos cadastrados</Typography>
          <List>
            {medicos.map((m, idx) => (
              <ListItem key={idx}>
                <ListItemText
                  primary={`${m.nome} (${m.especialidade})`}
                  secondary={`Horários: ${m.horarios.join(", ")}`}
                />
              </ListItem>
            ))}
          </List>
          <Typography variant="h6" className="cadastro-lista-titulo">
            Exames cadastrados
          </Typography>
          <List>
            {exames.map((e, idx) => (
              <ListItem key={idx}>
                <ListItemText
                  primary={`${e.exame} (Médico: ${e.medicoResponsavel})`}
                  secondary={`Horários: ${e.horarios.join(", ")}`}
                />
              </ListItem>
            ))}
          </List>
        </div>
      </Paper>
    </div>
  );
}

export default Cadastros;