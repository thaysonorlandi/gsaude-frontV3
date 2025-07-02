import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/home/home';
import Login from '../pages/login/login';
import Agendamento from '../pages/agendamento/agendamento';
import Agendados from '../pages/agendados/agendados';
import Cadastros from '../pages/cadastros/cadastros';
import Financeiro from '../pages/financeiro/financeiro';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/home',
    element: <Home />,
    children: [
      {
        path: '/home',
        element: <Agendamento />,
      },
      {
        path: '/home/agendados',
        element: <Agendados />,
      },
      {
        path: '/home/cadastros',
        element: <Cadastros />,
      },
      {
        path: '/home/financeiro',
        element: <Financeiro />,
      },
    ],
  }
]);

export default router;