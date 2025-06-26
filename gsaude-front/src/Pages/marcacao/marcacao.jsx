import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText
} from '@mui/material';
import './marcacao.css';

const especialidades = [
  { value: 'outros', label: 'Outros' },
  { value: 'cardiologia', label: 'Cardiologia' },
  { value: 'dermatologia', label: 'Dermatologia' },
  { value: 'pediatria', label: 'Pediatria' }
];

const horarios = [
  { value: '', label: 'Indiferente' },
  { value: 'manha', label: 'Manhã' },
  { value: 'tarde', label: 'Tarde' },
  { value: 'noite', label: 'Noite' }
];

function Marcacao() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    dia: '',
    mes: '',
    ano: '',
    horario: '',
    especialidade: 'outros',
    observacoes: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Consulta marcada com sucesso!');
    setForm({
      nome: '',
      email: '',
      telefone: '',
      dia: '',
      mes: '',
      ano: '',
      horario: '',
      especialidade: 'outros',
      observacoes: ''
    });
  };

  return (
    <Box className="marcacao-container">
      <form className="marcacao-form-img" onSubmit={handleSubmit}>
        <Typography variant="h5" className="marcacao-titulo">
          Agende sua Consulta
        </Typography>
        <hr className="marcacao-hr" />

        <div className="marcacao-label-group">
          <label className="marcacao-label">
            Nome: <span className="marcacao-asterisco">*</span>
          </label>
          <TextField
            name="nome"
            value={form.nome}
            onChange={handleChange}
            size="small"
            fullWidth
            required
            variant="outlined"
            className="marcacao-input"
          />
        </div>

        <div className="marcacao-label-group">
          <label className="marcacao-label">
            Mail: <span className="marcacao-asterisco">*</span>
          </label>
          <TextField
            name="email"
            value={form.email}
            onChange={handleChange}
            size="small"
            fullWidth
            required
            variant="outlined"
            placeholder="nome@exemplo.com.br"
            className="marcacao-input"
            type="email"
          />
        </div>

        <div className="marcacao-label-group">
          <label className="marcacao-label">Telefone:</label>
          <TextField
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            size="small"
            fullWidth
            variant="outlined"
            placeholder="11955552222"
            className="marcacao-input"
            inputProps={{ maxLength: 11 }}
          />
          <FormHelperText className="marcacao-helper">Apenas números, sem espaços</FormHelperText>
        </div>

        <div className="marcacao-label-group">
          <label className="marcacao-label">
            Data e Hora: <span className="marcacao-asterisco">*</span>
          </label>
          <Box className="marcacao-data-row">
            <TextField
              name="dia"
              value={form.dia}
              onChange={handleChange}
              size="small"
              variant="outlined"
              placeholder="Dia"
              className="marcacao-data-input"
              inputProps={{ maxLength: 2 }}
              required
            />
            <span className="marcacao-data-sep">-</span>
            <TextField
              name="mes"
              value={form.mes}
              onChange={handleChange}
              size="small"
              variant="outlined"
              placeholder="Mês"
              className="marcacao-data-input"
              inputProps={{ maxLength: 2 }}
              required
            />
            <span className="marcacao-data-sep">-</span>
            <TextField
              name="ano"
              value={form.ano}
              onChange={handleChange}
              size="small"
              variant="outlined"
              placeholder="Ano"
              className="marcacao-data-input"
              inputProps={{ maxLength: 4 }}
              required
            />
          </Box>
        </div>

        <div className="marcacao-label-group">
          <label className="marcacao-label">Horário desejado:</label>
          <FormControl fullWidth size="small">
            <Select
              name="horario"
              value={form.horario}
              onChange={handleChange}
              variant="outlined"
              className="marcacao-input"
            >
              {horarios.map((h) => (
                <MenuItem key={h.value} value={h.value}>
                  {h.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="marcacao-label-group">
          <label className="marcacao-label">
            Especialidade desejada: <span className="marcacao-asterisco">*</span>
          </label>
          <FormControl fullWidth size="small" required>
            <Select
              name="especialidade"
              value={form.especialidade}
              onChange={handleChange}
              variant="outlined"
              className="marcacao-input"
            >
              {especialidades.map((esp) => (
                <MenuItem key={esp.value} value={esp.value}>
                  {esp.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="marcacao-label-group">
          <label className="marcacao-label">Observações:</label>
          <TextField
            name="observacoes"
            value={form.observacoes}
            onChange={handleChange}
            size="small"
            fullWidth
            multiline
            minRows={2}
            variant="outlined"
            className="marcacao-input"
          />
        </div>

        <Button
          type="submit"
          variant="outlined"
          className="marcacao-btn"
          disabled={
            !form.nome ||
            !form.email ||
            !form.dia ||
            !form.mes ||
            !form.ano ||
            !form.especialidade
          }
        >
          Enviar
        </Button>
      </form>
    </Box>
  );
}

export default Marcacao;