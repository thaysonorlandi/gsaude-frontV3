import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/home/home.jsx';
import Login from '../pages/login/login.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
    },
    {
        path: '/home',
        element: <Home />,
    },
    {
        path: '/register',
        element: <h1>Register Page</h1>,
    },
]);

export default router