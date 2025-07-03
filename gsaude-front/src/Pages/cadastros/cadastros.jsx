import React, { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  IconButton,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

export default function CadastroDinamico() {
  const [tipoCadastro, setTipoCadastro] = useState("");
  const [form, setForm] = useState({});
  const [diasHoras, setDiasHoras] = useState([{ dia: "", hora: "" }]);
  const [exameMedicos, setExameMedicos] = useState([{ medico: "" }]);
  const [exameDiasHoras, setExameDiasHoras] = useState([{ dia: "", hora: "" }]);

  const handleTipoChange = (e) => {
    setTipoCadastro(e.target.value);
    setForm({});
    setDiasHoras([{ dia: "", hora: "" }]);
    setExameMedicos([{ medico: "" }]);
    setExameDiasHoras([{ dia: "", hora: "" }]);
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Manipulação de dias e horas para médico
  const handleDiasHorasChange = (idx, field, value) => {
    const updated = diasHoras.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    setDiasHoras(updated);
  };

  const addDiasHoras = () => {
    setDiasHoras([...diasHoras, { dia: "", hora: "" }]);
  };

  const removeDiasHoras = (idx) => {
    setDiasHoras(diasHoras.filter((_, i) => i !== idx));
  };

  // Manipulação de dias e horas para exame
  const handleExameDiasHorasChange = (idx, field, value) => {
    const updated = exameDiasHoras.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    setExameDiasHoras(updated);
  };

  const addExameDiasHoras = () => {
    setExameDiasHoras([...exameDiasHoras, { dia: "", hora: "" }]);
  };

  const removeExameDiasHoras = (idx) => {
    setExameDiasHoras(exameDiasHoras.filter((_, i) => i !== idx));
  };

  // Manipulação de médicos para exame
  const handleExameMedicoChange = (idx, value) => {
    const updated = exameMedicos.map((item, i) =>
      i === idx ? { medico: value } : item
    );
    setExameMedicos(updated);
  };

  const addExameMedico = () => {
    setExameMedicos([...exameMedicos, { medico: "" }]);
  };

  const removeExameMedico = (idx) => {
    setExameMedicos(exameMedicos.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Cadastro realizado com sucesso!");
  };

  const diasSemana = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo",
  ];

  return (
    <Paper
      sx={{
        p: 4,
        maxWidth: 800,
        margin: "40px auto",
        borderRadius: 3,
        boxShadow: 4,
        background: "#fff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
        }}
      >
        <PersonAddIcon sx={{ color: "#1976d2", fontSize: 36, mr: 1 }} />
        <Typography
          variant="h5"
          component="h2"
          sx={{ color: "#1976d2", fontWeight: "bold", textAlign: "center" }}
        >
          Cadastro
        </Typography>
      </Box>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Seção: O que deseja cadastrar */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              O que deseja cadastrar?
            </Typography>
            <TextField
              select
              value={tipoCadastro}
              onChange={handleTipoChange}
              fullWidth
              required
            >
              <MenuItem value="medico">
                <MedicalServicesIcon sx={{ mr: 1, color: "#1976d2" }} />
                Médico
              </MenuItem>
              <MenuItem value="exame">
                <MedicalServicesIcon sx={{ mr: 1, color: "#1976d2" }} />
                Exame
              </MenuItem>
            </TextField>
          </Grid>

          {/* Seção: Dados do Médico */}
          {tipoCadastro === "medico" && (
            <>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 3, mb: 1 }}>
                  Dados do Médico
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nome do Médico"
                  name="nome"
                  value={form.nome || ""}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Especialidade"
                  name="especialidade"
                  value={form.especialidade || ""}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="CRM"
                  name="crm"
                  value={form.crm || ""}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Telefone"
                  name="telefone"
                  value={form.telefone || ""}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              {/* Seção: Horários disponíveis */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 3, mb: 1 }}>
                  Horários Disponíveis para Consultas
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {diasHoras.map((item, idx) => (
                  <Grid container spacing={2} key={idx} alignItems="center" sx={{ mb: 1 }}>
                    <Grid item xs={5} sm={4}>
                      <TextField
                        select
                        label="Dia"
                        value={item.dia}
                        onChange={(e) =>
                          handleDiasHorasChange(idx, "dia", e.target.value)
                        }
                        fullWidth
                        required
                      >
                        {diasSemana.map((dia) => (
                          <MenuItem key={dia} value={dia}>
                            {dia}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={5} sm={4}>
                      <TextField
                        label="Hora"
                        type="time"
                        value={item.hora}
                        onChange={(e) =>
                          handleDiasHorasChange(idx, "hora", e.target.value)
                        }
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ step: 300 }}
                      />
                    </Grid>
                    <Grid item xs={2} sm={2}>
                      <IconButton
                        color="primary"
                        onClick={addDiasHoras}
                        size="large"
                        sx={{ mr: 1 }}
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                      {diasHoras.length > 1 && (
                        <IconButton
                          color="error"
                          onClick={() => removeDiasHoras(idx)}
                          size="large"
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {/* Seção: Dados do Exame */}
          {tipoCadastro === "exame" && (
            <>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 3, mb: 1 }}>
                  Dados do Exame
                </Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  label="Nome do Exame"
                  name="nomeExame"
                  value={form.nomeExame || ""}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Código"
                  name="codigo"
                  value={form.codigo || ""}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Descrição"
                  name="descricao"
                  value={form.descricao || ""}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
              {/* Seção: Horários disponíveis para o exame */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 3, mb: 1 }}>
                  Horários Disponíveis para o Exame
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {exameDiasHoras.map((item, idx) => (
                  <Grid container spacing={2} key={idx} alignItems="center" sx={{ mb: 1 }}>
                    <Grid item xs={5} sm={4}>
                      <TextField
                        select
                        label="Dia"
                        value={item.dia}
                        onChange={(e) =>
                          handleExameDiasHorasChange(idx, "dia", e.target.value)
                        }
                        fullWidth
                        required
                      >
                        {diasSemana.map((dia) => (
                          <MenuItem key={dia} value={dia}>
                            {dia}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={5} sm={4}>
                      <TextField
                        label="Hora"
                        type="time"
                        value={item.hora}
                        onChange={(e) =>
                          handleExameDiasHorasChange(idx, "hora", e.target.value)
                        }
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ step: 300 }}
                      />
                    </Grid>
                    <Grid item xs={2} sm={2}>
                      <IconButton
                        color="primary"
                        onClick={addExameDiasHoras}
                        size="large"
                        sx={{ mr: 1 }}
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                      {exameDiasHoras.length > 1 && (
                        <IconButton
                          color="error"
                          onClick={() => removeExameDiasHoras(idx)}
                          size="large"
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                ))}
              </Grid>
              {/* Seção: Médicos que realizam o exame */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 3, mb: 1 }}>
                  Médicos que realizam este exame
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {exameMedicos.map((medico, idx) => (
                  <Grid container spacing={2} key={idx} alignItems="center" sx={{ mb: 1 }}>
                    <Grid item xs={10} sm={6}>
                      <TextField
                        label="Nome do Médico"
                        value={medico.medico}
                        onChange={(e) =>
                          handleExameMedicoChange(idx, e.target.value)
                        }
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={2} sm={2}>
                      <IconButton
                        color="primary"
                        onClick={addExameMedico}
                        size="large"
                        sx={{ mr: 1 }}
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                      {exameMedicos.length > 1 && (
                        <IconButton
                          color="error"
                          onClick={() => removeExameMedico(idx)}
                          size="large"
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {tipoCadastro && (
            <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
              <Button variant="contained" color="primary" size="large" type="submit">
                Salvar
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
    </Paper>
  );
}