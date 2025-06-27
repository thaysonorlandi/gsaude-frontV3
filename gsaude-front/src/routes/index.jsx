import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/home/home';
import Login from '../pages/login/login';
import Agendamento from '../pages/agendamento/agendamento';
import Agendados from '../pages/agendados/agendados';
import Cadastros from '../pages/cadastros/cadastros';

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
    ],
  }
]);

export default router;