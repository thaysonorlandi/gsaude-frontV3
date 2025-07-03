import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const permissoes = [
  { value: "usuario", label: "Usuário", telas: ["Agendamento", "Financeiro", "Agendados"] },
  { value: "adm", label: "Administrador", telas: ["Todas as telas"] },
  { value: "visualizacao", label: "Visualização", telas: ["Agendados"] },
];

export default function ConfigDialog({ open, onClose }) {
  const [usuarios, setUsuarios] = React.useState([]);
  const [nome, setNome] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [permissao, setPermissao] = React.useState('usuario');

  function handleSubmit(e) {
    e.preventDefault();
    if (!nome || !email) return;
    setUsuarios(prev => [
      ...prev,
      { nome, email, permissao }
    ]);
    setNome('');
    setEmail('');
    setPermissao('usuario');
  }

  function handleDelete(idx) {
    setUsuarios(prev => prev.filter((_, i) => i !== idx));
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Gerenciar Usuários</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <List>
            {usuarios.length === 0 && (
              <ListItem>
                <ListItemText primary="Nenhum usuário cadastrado." />
              </ListItem>
            )}
            {usuarios.map((usuario, idx) => (
              <React.Fragment key={idx}>
                <ListItem>
                  <ListItemText
                    primary={`${usuario.nome} — ${usuario.email}`}
                    secondary={
                      <>
                        Permissão: <b>{permissoes.find(p => p.value === usuario.permissao)?.label}</b>
                        <br />
                        Telas: {permissoes.find(p => p.value === usuario.permissao)?.telas.join(", ")}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" color="error" onClick={() => handleDelete(idx)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
          <TextField
            margin="dense"
            label="Nome"
            type="text"
            fullWidth
            variant="standard"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label="E-mail"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <FormControl fullWidth margin="dense" variant="standard" required>
            <InputLabel id="permissao-label">Permissão</InputLabel>
            <Select
              labelId="permissao-label"
              value={permissao}
              onChange={e => setPermissao(e.target.value)}
              label="Permissão"
            >
              {permissoes.map(p => (
                <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Telas Permitidas"
            value={permissoes.find(p => p.value === permissao)?.telas.join(", ") || ""}
            fullWidth
            variant="standard"
            InputProps={{ readOnly: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Fechar</Button>
          <Button type="submit" variant="contained">Adicionar Usuário</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}