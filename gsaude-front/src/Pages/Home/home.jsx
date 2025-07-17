import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import './home.css';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import ConfigDialog from '../../components/ConfigDialog';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { usePermissions } from '../../hooks/usePermissions';
import { useUser } from '../../contexts/contexts';

import { getSystemConfig } from '../../services/systemConfigService';

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission, isPaciente } = usePermissions();
  const { logout } = useUser();
  const [openConfig, setOpenConfig] = React.useState(false);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [pendingNavigation, setPendingNavigation] = React.useState(null);
  const [emProcessoAgendamento, setEmProcessoAgendamento] = React.useState(false);
  const [logoUrl, setLogoUrl] = React.useState(null);

  // Buscar logo do sistema
  React.useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await getSystemConfig('site_logo');
        if (response.success && response.data.value) {
          setLogoUrl(response.data.value);
        }
      } catch {
        // Logo não encontrada, usar padrão
      }
    };

    fetchLogo();
  }, []);

  // Redireciona pacientes para a página de agendados se tentarem acessar a home
  React.useEffect(() => {
    if (isPaciente() && location.pathname === '/home') {
      navigate('/home/agendados', { replace: true });
    }
  }, [isPaciente, location.pathname, navigate]);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function handleOpenConfig() {
    setOpenConfig(true);
  }

  function handleCloseConfig() {
    setOpenConfig(false);
  }

  // Handler genérico para qualquer navegação
  function handleMenuNavigation(path) {
    if (emProcessoAgendamento && location.pathname !== path) {
      setOpenConfirm(true);
      setPendingNavigation(path);
    } else {
      navigate(path);
    }
  }

  function handleConfirmYes() {
    setOpenConfirm(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  }

  function handleConfirmNo() {
    setOpenConfirm(false);
    setPendingNavigation(null);
  }

  return (
    <Box className="home-vertical-root">
      <CssBaseline />
      {/* AppBar fixo no topo */}
      <AppBar position="static" className="home-appbar">
        <Toolbar className="home-toolbar">
          <Box className="home-appbar-content">
            <img
              src={logoUrl}
              alt="Logo"
              className="home-logo"
            />
            <Typography variant="h6" noWrap component="div" className="home-title">
              Agendamento de Consultas e Exames
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Conteúdo abaixo do AppBar */}
      <Box className="home-content-row">
        <Drawer
          variant="permanent"
          className="home-drawer"
          classes={{ paper: 'home-drawer-paper' }}
        >
          <Toolbar />
          <Box className="home-drawer-content">
            <div>
              <List>
                {hasPermission('agendamento') && (
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleMenuNavigation('/home')}>
                      <ListItemIcon>
                        <AssignmentIcon />
                      </ListItemIcon>
                      <ListItemText primary="Agendamento" />
                    </ListItemButton>
                  </ListItem>
                )}
                {hasPermission('agendados') && (
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleMenuNavigation('/home/agendados')}>
                      <ListItemIcon>
                        <CalendarMonthIcon />
                      </ListItemIcon>
                      <ListItemText primary="Horários Reservados" />
                    </ListItemButton>
                  </ListItem>
                )}
                {hasPermission('financeiro') && (
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleMenuNavigation('/home/financeiro')}>
                      <ListItemIcon>
                        <CurrencyExchangeIcon />
                      </ListItemIcon>
                      <ListItemText primary="Financeiro" />
                    </ListItemButton>
                  </ListItem>
                )}
              </List>
              {(hasPermission('cadastros') || hasPermission('configuracoes')) && <Divider />}
              <List>
                {hasPermission('cadastros') && (
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleMenuNavigation('/home/cadastros')}>
                      <ListItemIcon>
                        <PersonAddIcon />
                      </ListItemIcon>
                      <ListItemText primary="Cadastro" />
                    </ListItemButton>
                  </ListItem>
                )}
                {hasPermission('configuracoes') && (
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleOpenConfig}>
                      <ListItemIcon>
                        <SettingsIcon />
                      </ListItemIcon>
                      <ListItemText primary="Configurações" />
                    </ListItemButton>
                  </ListItem>
                )}
                <ConfigDialog open={openConfig} onClose={handleCloseConfig} />
              </List>
            </div>
            <div className="home-drawer-spacer" />
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout} className="logout-btn">
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Deslogar" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <Box component="main" className="home-main">
          <Outlet context={{ setEmProcessoAgendamento }} />
        </Box>
      </Box>
      {/* Diálogo de confirmação para descartar agendamento */}
      <Dialog open={openConfirm} onClose={handleConfirmNo}>
        <DialogTitle>Descartar Agendamento?</DialogTitle>
        <DialogContent>
          <Typography>
            Deseja sair e descartar o agendamento que está sendo realizado?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmNo} color="primary">
            Não
          </Button>
          <Button onClick={handleConfirmYes} color="error" variant="contained">
            Sim
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Home;