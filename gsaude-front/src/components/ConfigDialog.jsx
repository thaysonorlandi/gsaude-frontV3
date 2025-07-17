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
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { getUsers, createUser, updateUser, deleteUser } from '../services/userService';

const permissoes = [
  { value: "admin", label: "Administrador", telas: ["Todas as telas"] },
  { value: "recepcao", label: "Recepção", telas: ["Agendamento", "Agendados", "Financeiro"] },
  { value: "paciente", label: "Paciente", telas: ["Agendados"] },
];

export default function ConfigDialog({ open, onClose }) {
  const [usuarios, setUsuarios] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [nome, setNome] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');
  const [confirmarSenha, setConfirmarSenha] = React.useState('');
  const [permissao, setPermissao] = React.useState('recepcao');
  const [editingUser, setEditingUser] = React.useState(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [deleteConfirm, setDeleteConfirm] = React.useState({
    open: false,
    user: null
  });

  // Carregar usuários ao abrir o diálogo
  React.useEffect(() => {
    const carregarUsuarios = async () => {
      try {
        setLoading(true);
        const response = await getUsers();
        if (response.success) {
          setUsuarios(response.data);
        } else {
          showSnackbar('Erro ao carregar usuários: ' + (response.message || 'Erro desconhecido'), 'error');
        }
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        if (error.response?.status === 403) {
          showSnackbar('Apenas administradores podem gerenciar usuários.', 'error');
        } else if (error.response?.status === 401) {
          showSnackbar('Sessão expirada. Faça login novamente.', 'error');
        } else {
          showSnackbar('Erro ao carregar usuários. Verifique sua conexão.', 'error');
        }
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      carregarUsuarios();
    } else {
      // Quando fechar o diálogo, reseta tudo
      resetForm();
    }
  }, [open]);

  const recarregarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      if (response.success) {
        setUsuarios(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      showSnackbar('Erro ao carregar usuários', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const resetForm = () => {
    setNome('');
    setEmail('');
    setSenha('');
    setConfirmarSenha('');
    setPermissao('recepcao');
    setEditingUser(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nome || !email) {
      showSnackbar('Nome e email são obrigatórios', 'error');
      return;
    }

    if (!editingUser && (!senha || !confirmarSenha)) {
      showSnackbar('Senha e confirmação são obrigatórias para novos usuários', 'error');
      return;
    }

    if (senha && senha !== confirmarSenha) {
      showSnackbar('Senhas não coincidem', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const userData = {
        name: nome,
        email,
        permissions: [permissao],
        is_active: true
      };

      if (senha) {
        userData.password = senha;
        userData.c_password = confirmarSenha;
      }

      let response;
      if (editingUser) {
        response = await updateUser(editingUser.id, userData);
        showSnackbar('Usuário atualizado com sucesso');
      } else {
        response = await createUser(userData);
        showSnackbar('Usuário criado com sucesso');
      }

      if (response.success) {
        await recarregarUsuarios();
        resetForm();
      }
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      showSnackbar(
        error.response?.data?.message || 'Erro ao salvar usuário',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (usuario) => {
    // Define como modo de edição e preenche os campos com dados atuais
    setEditingUser(usuario);
    setNome(usuario.name || '');
    setEmail(usuario.email || '');
    setSenha(''); // Senha sempre vazia por segurança
    setConfirmarSenha('');
    // Mantém a permissão atual
    if (usuario.permissions && usuario.permissions.length > 0) {
      setPermissao(usuario.permissions[0]);
    } else {
      setPermissao('recepcao');
    }
  };

  const handleDelete = (user) => {
    setDeleteConfirm({
      open: true,
      user
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.user) return;

    try {
      setLoading(true);
      const response = await deleteUser(deleteConfirm.user.id);
      if (response.success) {
        showSnackbar('Usuário excluído com sucesso');
        await recarregarUsuarios();
      }
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      showSnackbar('Erro ao excluir usuário', 'error');
    } finally {
      setLoading(false);
      setDeleteConfirm({ open: false, user: null });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ open: false, user: null });
  };

  const getUserPermissionLabel = (userPermissions) => {
    if (!userPermissions || userPermissions.length === 0) return 'Sem permissão';
    const permission = userPermissions[0];
    const permissaoObj = permissoes.find(p => p.value === permission);
    return permissaoObj ? permissaoObj.label : permission;
  };

  const getUserPermissionScreens = (userPermissions) => {
    if (!userPermissions || userPermissions.length === 0) return '';
    const permission = userPermissions[0];
    const permissaoObj = permissoes.find(p => p.value === permission);
    return permissaoObj ? permissaoObj.telas.join(', ') : '';
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Gerenciar Usuários
          {editingUser && (
            <Typography variant="subtitle2" color="primary">
              Editando: {editingUser.name}
            </Typography>
          )}
        </DialogTitle>
        <form onSubmit={handleSubmit} key={editingUser ? `edit-${editingUser.id}` : 'new'}>
          <DialogContent>
            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {/* Lista de usuários */}
                <Box mb={3}>
                  <Typography variant="h6" gutterBottom>
                    Usuários Cadastrados
                  </Typography>
                  <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {usuarios.length === 0 ? (
                      <ListItem>
                        <ListItemText primary="Nenhum usuário encontrado." />
                      </ListItem>
                    ) : (
                      usuarios.map((usuario) => (
                        <React.Fragment key={usuario.id}>
                          <ListItem>
                            <ListItemText
                              primary={
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Typography variant="body1">
                                    {usuario.name} — {usuario.email}
                                  </Typography>
                                  <Chip 
                                    label={getUserPermissionLabel(usuario.permissions)}
                                    size="small"
                                    color={usuario.permissions?.[0] === 'admin' ? 'error' : 
                                           usuario.permissions?.[0] === 'recepcao' ? 'primary' : 'default'}
                                  />
                                  {!usuario.is_active && (
                                    <Chip label="Inativo" size="small" color="warning" />
                                  )}
                                </Box>
                              }
                              secondary={
                                <>
                                  <span style={{ fontSize: '0.875rem', color: 'rgba(0, 0, 0, 0.6)' }}>
                                    Telas: {getUserPermissionScreens(usuario.permissions)}
                                  </span>
                                  {usuario.phone && (
                                    <span style={{ fontSize: '0.875rem', color: 'rgba(0, 0, 0, 0.6)', display: 'block' }}>
                                      Telefone: {usuario.phone}
                                    </span>
                                  )}
                                </>
                              }
                            />
                            <ListItemSecondaryAction>
                              <IconButton 
                                edge="end" 
                                color="primary" 
                                onClick={() => handleEdit(usuario)}
                                sx={{ mr: 1 }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton 
                                edge="end" 
                                color="error" 
                                onClick={() => handleDelete(usuario)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      ))
                    )}
                  </List>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Formulário para adicionar/editar usuário */}
                <Typography variant="h6" gutterBottom>
                  {editingUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
                </Typography>
                
                <TextField
                  margin="dense"
                  label="Nome"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  placeholder={editingUser ? '' : 'Digite o nome do usuário'}
                  autoComplete="off"
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
                  placeholder={editingUser ? '' : 'Digite o e-mail do usuário'}
                  autoComplete="off"
                  required
                />

                <TextField
                  margin="dense"
                  label={editingUser ? "Nova Senha (deixe em branco para manter)" : "Senha"}
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  variant="standard"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  autoComplete="new-password"
                  required={!editingUser}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  margin="dense"
                  label="Confirmar Senha"
                  type={showConfirmPassword ? "text" : "password"}
                  fullWidth
                  variant="standard"
                  value={confirmarSenha}
                  onChange={e => setConfirmarSenha(e.target.value)}
                  autoComplete="new-password"
                  required={!editingUser || senha}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          size="small"
                        >
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
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
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Button 
                variant="outlined" 
                onClick={resetForm}
                color="error"
                disabled={loading}
              >
                {editingUser ? 'Cancelar Edição' : 'Limpar Campos'}
              </Button>
              <Box display="flex" gap={1}>
                <Button onClick={onClose} disabled={loading}>
                  Fechar
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : editingUser ? 'Atualizar Usuário' : 'Adicionar Usuário'}
                </Button>
              </Box>
            </Box>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar para notificações */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Diálogo de confirmação para exclusão */}
      <Dialog
        open={deleteConfirm.open}
        onClose={cancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title" sx={{ color: 'error.main' }}>
          ⚠️ Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <Typography id="delete-dialog-description">
            Tem certeza que deseja excluir o usuário <strong>{deleteConfirm.user?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta ação não pode ser desfeita. O usuário será desativado do sistema.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancelar
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
