import React, { useState } from 'react';
import {
  Box, Typography, Button, MenuItem, Select, InputLabel, FormControl, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip
} from '@mui/material';
import './agendamento.css';

const especialidades = [
  { value: 'cardiologia', label: 'Cardiologia' },
  { value: 'dermatologia', label: 'Dermatologia' }
];
const procedimentos = [
  { value: 'ultrassom', label: 'Ultrassom' },
  { value: 'raio_x', label: 'Raio-X' }
];
const medicos = [
  { value: 'dr_joao', label: 'Dr. João', especialidade: 'cardiologia', procedimentos: ['ultrassom'] },
  { value: 'dra_ana', label: 'Dra. Ana', especialidade: 'dermatologia', procedimentos: ['raio_x', 'ultrassom'] }
];
const horariosDisponiveis = {
  '2025-06-30': ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00'],
  '2025-07-01': [],
  '2025-07-02': ['08:00', '08:30', '09:00', '09:30', '10:00']
};

function Agendamento() {
  const [tipo, setTipo] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [procedimento, setProcedimento] = useState('');
  const [medico, setMedico] = useState('');
  const [dia, setDia] = useState('');
  const [hora, setHora] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [paciente, setPaciente] = useState({ nome: '', email: '', telefone: '' });

  const medicosFiltrados = tipo === 'consulta'
    ? medicos.filter(m => m.especialidade === especialidade)
    : tipo === 'exame'
      ? medicos.filter(m => m.procedimentos.includes(procedimento))
      : [];

  const diasDisponiveis = Object.keys(horariosDisponiveis);
  const horariosDia = horariosDisponiveis[dia] || [];

  const handleAgendar = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  const handlePacienteChange = (e) => {
    setPaciente({ ...paciente, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Agendamento realizado!');
    setOpenDialog(false);
  };

  return (
    <Box className="agendamento-container">
      <Typography variant="h4" className="agendamento-titulo">
          Agendamento
        </Typography>
      <Box className="agendamento-card">
        <Box className="agendamento-form">
          <FormControl fullWidth className="agendamento-form-control">
            <InputLabel id="tipo-label">Tipo de Agendamento</InputLabel>
            <Select
              labelId="tipo-label"
              value={tipo}
              label="Tipo de Agendamento"
              onChange={e => {
                setTipo(e.target.value);
                setEspecialidade('');
                setProcedimento('');
                setMedico('');
                setDia('');
                setHora('');
              }}
            >
              <MenuItem value="consulta">Consulta</MenuItem>
              <MenuItem value="exame">Exame</MenuItem>
            </Select>
          </FormControl>

          {tipo === 'consulta' && (
            <FormControl fullWidth className="agendamento-form-control">
              <InputLabel id="especialidade-label">Especialidade</InputLabel>
              <Select
                labelId="especialidade-label"
                value={especialidade}
                label="Especialidade"
                onChange={e => {
                  setEspecialidade(e.target.value);
                  setMedico('');
                  setDia('');
                  setHora('');
                }}
              >
                {especialidades.map(e => (
                  <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {tipo === 'exame' && (
            <FormControl fullWidth className="agendamento-form-control">
              <InputLabel id="procedimento-label">Procedimento</InputLabel>
              <Select
                labelId="procedimento-label"
                value={procedimento}
                label="Procedimento"
                onChange={e => {
                  setProcedimento(e.target.value);
                  setMedico('');
                  setDia('');
                  setHora('');
                }}
              >
                {procedimentos.map(p => (
                  <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {(tipo === 'consulta' && especialidade) && (
            <FormControl fullWidth className="agendamento-form-control">
              <InputLabel id="medico-label">Médico</InputLabel>
              <Select
                labelId="medico-label"
                value={medico}
                label="Médico"
                onChange={e => {
                  setMedico(e.target.value);
                  setDia('');
                  setHora('');
                }}
              >
                {medicosFiltrados.map(m => (
                  <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {(tipo === 'exame' && procedimento) && (
            <FormControl fullWidth className="agendamento-form-control">
              <InputLabel id="medico-label">Médico</InputLabel>
              <Select
                labelId="medico-label"
                value={medico}
                label="Médico"
                onChange={e => {
                  setMedico(e.target.value);
                  setDia('');
                  setHora('');
                }}
              >
                {medicosFiltrados.map(m => (
                  <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {medico && (
            <Box className="agendamento-horarios">
              <Typography variant="subtitle1" className="agendamento-horarios-titulo">
                Selecione o horário desejado na lista abaixo.
              </Typography>
              <Box className="agendamento-horarios-tabela">
                <Box className="agendamento-horarios-header">
                  <Box className="agendamento-horarios-data">Data</Box>
                  <Box className="agendamento-horarios-disponiveis">Horários Disponíveis</Box>
                </Box>
                {diasDisponiveis.map(data => (
                  <Box key={data} className="agendamento-horarios-row">
                    <Box className="agendamento-horarios-data">
                      {new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} {' '}
                      <span className="agendamento-horarios-dia">
                        {['domingo','segunda','terça','quarta','quinta','sexta','sábado'][new Date(data).getDay()]}
                      </span>
                    </Box>
                    <Box className="agendamento-horarios-disponiveis">
                      {horariosDisponiveis[data].length === 0 ? (
                        <span className="agendamento-horarios-nao-atende">Não Atende</span>
                      ) : (
                        horariosDisponiveis[data].slice(0, 8).map(h => (
                          <Chip
                            key={h}
                            label={h}
                            clickable
                            color={dia === data && hora === h ? 'primary' : 'default'}
                            onClick={() => { setDia(data); setHora(h); }}
                            className="agendamento-horarios-chip"
                          />
                        ))
                      )}
                      {horariosDisponiveis[data].length > 8 && (
                        <Chip label={`+${horariosDisponiveis[data].length - 8}`} className="agendamento-horarios-chip" />
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          <Button
            variant="contained"
            color="primary"
            className="agendamento-btn"
            disabled={!tipo || !medico || !dia || !hora}
            onClick={handleAgendar}
          >
            Agendar
          </Button>
        </Box>

      {/* Pop-up para dados do paciente */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Dados do Paciente</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent className="agendamento-dialog-content">
            <TextField
              label="Nome"
              name="nome"
              value={paciente.nome}
              onChange={handlePacienteChange}
              required
              fullWidth
              margin="dense"
            />
            <TextField
              label="E-mail"
              name="email"
              value={paciente.email}
              onChange={handlePacienteChange}
              required
              type="email"
              fullWidth
              margin="dense"
            />
            <TextField
              label="Telefone"
              name="telefone"
              value={paciente.telefone}
              onChange={handlePacienteChange}
              required
              fullWidth
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancelar</Button>
            <Button type="submit" variant="contained">Confirmar</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
    </Box>
  );
}

export default Agendamento;