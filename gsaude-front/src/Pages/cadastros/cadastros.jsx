import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import './cadastros.css';

// Componente para cada tabela de cadastro
function CadastroTabela({ tipo, dados, onEdit, onDelete, onAdd }) {
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Lista de {tipo}</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => onAdd(tipo)}
        >
          Novo {tipo}
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dados.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.nome}</TableCell>
                <TableCell>{item.descricao}</TableCell>
                <TableCell>{item.status ? 'Ativo' : 'Inativo'}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => onEdit(item)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(item)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// Componente principal para gerenciar os cadastros
function Cadastros() {
  const [tabAtiva, setTabAtiva] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [itemEmEdicao, setItemEmEdicao] = useState(null);
  const [tipoAtual, setTipoAtual] = useState('');

  // Dados simulados para demonstração
  const [medicos, setMedicos] = useState([
    { id: 1, nome: 'Dr. João Silva', descricao: 'Cardiologista', status: true },
    { id: 2, nome: 'Dra. Ana Santos', descricao: 'Dermatologista', status: true },
    { id: 3, nome: 'Dr. Pedro Almeida', descricao: 'Ortopedista', status: true },
  ]);

  const [especialidades, setEspecialidades] = useState([
    { id: 1, nome: 'Cardiologia', descricao: 'Doenças do coração', status: true },
    { id: 2, nome: 'Dermatologia', descricao: 'Doenças da pele', status: true },
    { id: 3, nome: 'Ortopedia', descricao: 'Sistema ósseo e muscular', status: true },
  ]);

  const [convenios, setConvenios] = useState([
    { id: 1, nome: 'Unimed', descricao: 'Plano Empresarial', status: true },
    { id: 2, nome: 'Bradesco', descricao: 'Plano Nacional', status: true },
    { id: 3, nome: 'Amil', descricao: 'Plano Completo', status: true },
  ]);

  const handleTabChange = (event, newValue) => {
    setTabAtiva(newValue);
  };

  const handleOpenDialog = (tipo, item = null) => {
    setTipoAtual(tipo);
    setItemEmEdicao(item || { nome: '', descricao: '', status: true });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setItemEmEdicao(null);
  };

  const handleSave = () => {
    if (!itemEmEdicao) return;

    let dadosAtualizados = [];
    let setDados;

    switch (tipoAtual) {
      case 'Médicos':
        dadosAtualizados = itemEmEdicao.id
          ? medicos.map(m => (m.id === itemEmEdicao.id ? itemEmEdicao : m))
          : [...medicos, { ...itemEmEdicao, id: medicos.length + 1 }];
        setDados = setMedicos;
        break;
      case 'Especialidades':
        dadosAtualizados = itemEmEdicao.id
          ? especialidades.map(e => (e.id === itemEmEdicao.id ? itemEmEdicao : e))
          : [...especialidades, { ...itemEmEdicao, id: especialidades.length + 1 }];
        setDados = setEspecialidades;
        break;
      case 'Convênios':
        dadosAtualizados = itemEmEdicao.id
          ? convenios.map(c => (c.id === itemEmEdicao.id ? itemEmEdicao : c))
          : [...convenios, { ...itemEmEdicao, id: convenios.length + 1 }];
        setDados = setConvenios;
        break;
      default:
        break;
    }

    setDados(dadosAtualizados);
    handleCloseDialog();
  };

  const handleDelete = (item) => {
    let dadosAtualizados = [];
    let setDados;

    switch (tabAtiva) {
      case 0:
        dadosAtualizados = medicos.filter(m => m.id !== item.id);
        setDados = setMedicos;
        break;
      case 1:
        dadosAtualizados = especialidades.filter(e => e.id !== item.id);
        setDados = setEspecialidades;
        break;
      case 2:
        dadosAtualizados = convenios.filter(c => c.id !== item.id);
        setDados = setConvenios;
        break;
      default:
        break;
    }

    setDados(dadosAtualizados);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItemEmEdicao({ ...itemEmEdicao, [name]: value });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Cadastros
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabAtiva}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Médicos" />
          <Tab label="Especialidades" />
          <Tab label="Convênios" />
        </Tabs>
      </Paper>

      {tabAtiva === 0 && (
        <CadastroTabela
          tipo="Médicos"
          dados={medicos}
          onEdit={(item) => handleOpenDialog('Médicos', item)}
          onDelete={handleDelete}
          onAdd={handleOpenDialog}
        />
      )}
      
      {tabAtiva === 1 && (
        <CadastroTabela
          tipo="Especialidades"
          dados={especialidades}
          onEdit={(item) => handleOpenDialog('Especialidades', item)}
          onDelete={handleDelete}
          onAdd={handleOpenDialog}
        />
      )}
      
      {tabAtiva === 2 && (
        <CadastroTabela
          tipo="Convênios"
          dados={convenios}
          onEdit={(item) => handleOpenDialog('Convênios', item)}
          onDelete={handleDelete}
          onAdd={handleOpenDialog}
        />
      )}

      {/* Diálogo para adição/edição */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{itemEmEdicao?.id ? `Editar ${tipoAtual}` : `Novo ${tipoAtual}`}</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 1 }}>
            <TextField
              margin="dense"
              name="nome"
              label="Nome"
              fullWidth
              variant="outlined"
              value={itemEmEdicao?.nome || ''}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="descricao"
              label="Descrição"
              fullWidth
              variant="outlined"
              value={itemEmEdicao?.descricao || ''}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Cadastros;