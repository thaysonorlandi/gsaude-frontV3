import { createBrowserRouter } from 'react-router-dom';
import Home from '../Pages/home/home.jsx';

const router = createBrowserRouter([
  {
    path: '/home',
    element: <Home />,
    },
    {
        path: '/login',
        element: <h1>Login Page</h1>,
    },
    {
        path: '/register',
        element: <h1>Register Page</h1>,
    },
]);

export default router