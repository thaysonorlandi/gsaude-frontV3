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
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import './cadastros.css';

export default function CadastroDinamico() {
  // Estado das abas
  const [tab, setTab] = useState(0);

  // Estado dos médicos e exames cadastrados
  const [medicos, setMedicos] = useState([]);
  const [exames, setExames] = useState([]);

  // Estado do Dialog de cadastro/edição
  const [openDialog, setOpenDialog] = useState(false);
  const [tipoCadastro, setTipoCadastro] = useState(""); // "medico" ou "exame"
  const [editIndex, setEditIndex] = useState(null);

  // Formulários
  const [form, setForm] = useState({});
  const [diasHoras, setDiasHoras] = useState([{ dia: "", hora: "" }]);
  const [exameMedicos, setExameMedicos] = useState([{ medico: "" }]);
  const [exameDiasHoras, setExameDiasHoras] = useState([{ dia: "", hora: "" }]);

  // Abas
  const handleTabChange = (e, newValue) => setTab(newValue);

  // Abrir Dialog para adicionar/editar
  const handleOpenDialog = (tipo, index = null) => {
    setTipoCadastro(tipo);
    setEditIndex(index);

    if (tipo === "medico" && index !== null) {
      // Editar médico
      const medico = medicos[index];
      setForm({
        nome: medico.nome,
        especialidade: medico.especialidade,
        crm: medico.crm,
        telefone: medico.telefone,
      });
      setDiasHoras(medico.diasHoras || [{ dia: "", hora: "" }]);
    } else if (tipo === "exame" && index !== null) {
      // Editar exame
      const exame = exames[index];
      setForm({
        nomeExame: exame.nomeExame,
        codigo: exame.codigo,
        descricao: exame.descricao,
      });
      setExameDiasHoras(exame.diasHoras || [{ dia: "", hora: "" }]);
      setExameMedicos(exame.medicos || [{ medico: "" }]);
    } else {
      // Novo cadastro
      setForm({});
      setDiasHoras([{ dia: "", hora: "" }]);
      setExameDiasHoras([{ dia: "", hora: "" }]);
      setExameMedicos([{ medico: "" }]);
    }
    setOpenDialog(true);
  };

  // Fechar Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setForm({});
    setDiasHoras([{ dia: "", hora: "" }]);
    setExameDiasHoras([{ dia: "", hora: "" }]);
    setExameMedicos([{ medico: "" }]);
    setEditIndex(null);
  };

  // Manipulação dos campos do formulário
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
  const addDiasHoras = () => setDiasHoras([...diasHoras, { dia: "", hora: "" }]);
  const removeDiasHoras = (idx) => setDiasHoras(diasHoras.filter((_, i) => i !== idx));

  // Manipulação de dias e horas para exame
  const handleExameDiasHorasChange = (idx, field, value) => {
    const updated = exameDiasHoras.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    setExameDiasHoras(updated);
  };
  const addExameDiasHoras = () => setExameDiasHoras([...exameDiasHoras, { dia: "", hora: "" }]);
  const removeExameDiasHoras = (idx) => setExameDiasHoras(exameDiasHoras.filter((_, i) => i !== idx));

  // Manipulação de médicos para exame
  const handleExameMedicoChange = (idx, value) => {
    const updated = exameMedicos.map((item, i) =>
      i === idx ? { medico: value } : item
    );
    setExameMedicos(updated);
  };
  const addExameMedico = () => setExameMedicos([...exameMedicos, { medico: "" }]);
  const removeExameMedico = (idx) => setExameMedicos(exameMedicos.filter((_, i) => i !== idx));

  // Salvar cadastro/edição
  const handleSubmit = (e) => {
    e.preventDefault();
    if (tipoCadastro === "medico") {
      const novoMedico = {
        nome: form.nome,
        especialidade: form.especialidade,
        crm: form.crm,
        telefone: form.telefone,
        diasHoras: diasHoras,
      };
      if (editIndex !== null) {
        setMedicos((prev) =>
          prev.map((m, i) => (i === editIndex ? novoMedico : m))
        );
      } else {
        setMedicos((prev) => [...prev, novoMedico]);
      }
    } else if (tipoCadastro === "exame") {
      const novoExame = {
        nomeExame: form.nomeExame,
        codigo: form.codigo,
        descricao: form.descricao,
        diasHoras: exameDiasHoras,
        medicos: exameMedicos,
      };
      if (editIndex !== null) {
        setExames((prev) =>
          prev.map((e, i) => (i === editIndex ? novoExame : e))
        );
      } else {
        setExames((prev) => [...prev, novoExame]);
      }
    }
    handleCloseDialog();
  };

  // Excluir médico/exame
  const handleDelete = (tipo, idx) => {
    if (tipo === "medico") setMedicos((prev) => prev.filter((_, i) => i !== idx));
    else setExames((prev) => prev.filter((_, i) => i !== idx));
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
    <Paper className="cadastro-container">
      <Box className="cadastro-header">
        <PersonAddIcon sx={{ color: "#1976d2", fontSize: 36, mr: 1 }} />
        <Typography
          variant="h5"
          component="h2"
          className="cadastro-titulo"
        >
          Cadastros
        </Typography>
      </Box>
      <Tabs value={tab} onChange={handleTabChange} centered className="cadastro-abas">
        <Tab label="Médicos" />
        <Tab label="Exames" />
      </Tabs>

      {/* Aba de Médicos */}
      {tab === 0 && (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => handleOpenDialog("medico")}
            >
              Adicionar Médico
            </Button>
          </Box>
          <List>
            {medicos.length === 0 && (
              <Typography color="text.secondary" sx={{ textAlign: "center", mt: 2 }}>
                Nenhum médico cadastrado.
              </Typography>
            )}
            {medicos.map((medico, idx) => (
              <React.Fragment key={idx}>
                <ListItem>
                  <ListItemText
                    primary={
                      <span>
                        <b>{medico.nome}</b> — {medico.especialidade}
                      </span>
                    }
                    secondary={
                      <>
                        <span>CRM: {medico.crm} | Tel: {medico.telefone}</span>
                        <br />
                        <span>
                          <b>Horários:</b>{" "}
                          {medico.diasHoras
                            .map((dh) => `${dh.dia} ${dh.hora}`)
                            .join(", ")}
                        </span>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      color="primary"
                      onClick={() => handleOpenDialog("medico", idx)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => handleDelete("medico", idx)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}

      {/* Aba de Exames */}
      {tab === 1 && (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => handleOpenDialog("exame")}
            >
              Adicionar Exame
            </Button>
          </Box>
          <List>
            {exames.length === 0 && (
              <Typography color="text.secondary" sx={{ textAlign: "center", mt: 2 }}>
                Nenhum exame cadastrado.
              </Typography>
            )}
            {exames.map((exame, idx) => (
              <React.Fragment key={idx}>
                <ListItem>
                  <ListItemText
                    primary={
                      <span>
                        <b>{exame.nomeExame}</b> {exame.codigo && `— Código: ${exame.codigo}`}
                      </span>
                    }
                    secondary={
                      <>
                        <span>{exame.descricao}</span>
                        <br />
                        <span>
                          <b>Horários:</b>{" "}
                          {exame.diasHoras
                            .map((dh) => `${dh.dia} ${dh.hora}`)
                            .join(", ")}
                        </span>
                        <br />
                        <span>
                          <b>Médicos:</b>{" "}
                          {exame.medicos.map((m) => m.medico).join(", ")}
                        </span>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      color="primary"
                      onClick={() => handleOpenDialog("exame", idx)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => handleDelete("exame", idx)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}

      {/* Dialog de Cadastro/Edição */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editIndex !== null
            ? tipoCadastro === "medico"
              ? "Editar Médico"
              : "Editar Exame"
            : tipoCadastro === "medico"
            ? "Cadastrar Médico"
            : "Cadastrar Exame"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={3}>
              {/* Formulário de Médico */}
              {tipoCadastro === "medico" && (
                <>
                  <Grid item>
                    <Typography variant="subtitle1" className="cadastro-form-subtitulo">
                      Dados do Médico
                    </Typography>
                  </Grid>
                  <Grid item className="cadastro-form-campos">
                    <Grid container spacing={2}>
                      <Grid item>
                        <TextField
                          label="Nome do Médico"
                          name="nome"
                          value={form.nome || ""}
                          onChange={handleChange}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item >
                        <TextField
                          label="Especialidade"
                          name="especialidade"
                          value={form.especialidade || ""}
                          onChange={handleChange}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          label="Telefone"
                          name="telefone"
                          value={form.telefone || ""}
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          label="CRM"
                          name="crm"
                          value={form.crm || ""}
                          onChange={handleChange}
                          fullWidth
                          required
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" className="cadastro-form-subtitulo">
                      Horários Disponíveis para Consultas
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    {diasHoras.map((item, idx) => (
                      <div className="cadastro-horarios-bloco" key={idx}>
                        <Grid container spacing={2} direction="column">
                          <Grid item xs={12}>
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
                          <Grid item xs={12}>
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
                        </Grid>
                        <div className="cadastro-horarios-botoes">
                          <IconButton color="primary" onClick={addDiasHoras}>
                            <AddCircleOutlineIcon />
                          </IconButton>
                          {diasHoras.length > 1 && (
                            <IconButton
                              color="error"
                              onClick={() => removeDiasHoras(idx)}
                            >
                              <RemoveCircleOutlineIcon />
                            </IconButton>
                          )}
                        </div>
                      </div>
                    ))}
                  </Grid>
                </>
              )}

              {/* Formulário de Exame */}
              {tipoCadastro === "exame" && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" className="cadastro-form-subtitulo">
                      Dados do Exame
                    </Typography>
                  </Grid>
                  <Grid item xs={12} className="cadastro-form-campos">
                    <Grid container spacing={2}>
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
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" className="cadastro-form-subtitulo">
                      Horários Disponíveis para o Exame
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    {exameDiasHoras.map((item, idx) => (
                      <div className="cadastro-horarios-bloco" key={idx}>
                        <Grid container spacing={2} direction="column">
                          <Grid item xs={12}>
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
                          <Grid item xs={12}>
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
                        </Grid>
                        <div className="cadastro-horarios-botoes">
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
                        </div>
                      </div>
                    ))}
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" className="cadastro-form-subtitulo">
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
            </Grid>
            {/* Botão de salvar alinhado à direita */}
            <div className="cadastro-dialog-botoes">
              <Button onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button variant="contained" type="submit">
                Salvar
              </Button>
            </div>
          </Box>
        </DialogContent>
      </Dialog>
    </Paper>
  );
}