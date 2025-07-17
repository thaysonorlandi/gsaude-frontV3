import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '../pages/home/home.jsx';
import Login from '../pages/login/login.jsx';
import Agendamento from '../pages/agendamento/agendamento.jsx';
import Agendados from '../pages/agendados/agendados.jsx';
import Financeiro from '../pages/financeiro/financeiro.jsx';
import Cadastros from '../pages/cadastros/cadastros.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute requiredPage="agendamento">
            <Agendamento />
          </ProtectedRoute>
        ),
      },
      {
        path: 'agendados',
        element: (
          <ProtectedRoute requiredPage="agendados">
            <Agendados />
          </ProtectedRoute>
        ),
      },
      {
        path: 'financeiro',
        element: (
          <ProtectedRoute requiredPage="financeiro">
            <Financeiro />
          </ProtectedRoute>
        ),
      },
      {
        path: 'cadastros',
        element: (
          <ProtectedRoute requiredPage="cadastros">
            <Cadastros />
          </ProtectedRoute>
        ),
      },
    ]
  },
  {
    path: '*',
    element: <Navigate to="/home" replace />
  }
]);

export default router
