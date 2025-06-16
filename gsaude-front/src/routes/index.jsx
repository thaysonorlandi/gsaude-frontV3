import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/home/home';
import Login from '../pages/login/login';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

export default router;