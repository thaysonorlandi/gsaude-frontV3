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
import { Outlet, useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import ConfigDialog from '../../components/ConfigDialog';
// const drawerWidth = 240;

function Home() {
  const navigate = useNavigate();
  const [openConfig, setOpenConfig] = React.useState(false);

  function handleLogout() {
    // Limpar contexto do usuário se necessário
    navigate('/login');
  }

  function handleMarcacao() {
    navigate('/home');
  }

  function handleCadastro() {
    navigate('/home/cadastros');
  }

  function handleOpenConfig() {
    setOpenConfig(true);
  }

  function handleCloseConfig() {
    setOpenConfig(false);
  }

  return (
    <Box className="home-vertical-root">
      <CssBaseline />
      {/* AppBar fixo no topo */}
      <AppBar position="static" className="home-appbar">
        <Toolbar className="home-toolbar">
          <Typography variant="h6" noWrap component="div" className="home-title">
            Agendamento de Consultas e Exames
          </Typography>
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
          {/*<Box className="home-drawer-content" style={{display: 'flex', flexDirection: 'column', height: '100%'}}>*/}
            <div>
              <List>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleMarcacao}>
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Marcação" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleCadastro}>
                    <ListItemIcon>
                      <PersonAddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Cadastro" />
                  </ListItemButton>
                </ListItem>
              </List>
              <Divider />
              <List>
              <ListItem disablePadding>
                <ListItemButton onClick={handleOpenConfig}>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Configurações" />
                </ListItemButton>
              </ListItem>
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
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Home;