import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '../pages/home/home.jsx';
import Login from '../pages/login/login.jsx';
import Agendamento from '../pages/agendamento/agendamento.jsx';
import Agendados from '../pages/agendados/agendados.jsx';
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
            <h1>Financeiro</h1>
          </ProtectedRoute>
        ),
      },
      {
        path: 'cadastros',
        element: (
          <ProtectedRoute requiredPage="cadastros">
            <h1>Cadastros</h1>
          </ProtectedRoute>
        ),
      },
    ]
  },
  {
    path: '/register',
    element: <h1>Register Page</h1>,
  },
  {
    path: '*',
    element: <Navigate to="/home" replace />
  }
]);

export default router