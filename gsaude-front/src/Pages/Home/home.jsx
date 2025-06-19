import React from 'react';
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
import './home.css';
import ListComponent from './list';
import { Outlet } from 'react-router-dom';

function Home() {
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
            <ListComponent />
            <Divider />
            <List>
              <ListItem key={1} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Deslogar"} />
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