import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/home/home';
import Login from '../pages/login/login';

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
        element: <Marcacao />,
      },
      {
        path: '/home/cadastros',
        element: <Cadastros />,
      },
    ],
  }
]);

export default router;