import { createBrowserRouter } from 'react-router-dom';
import Home from '../Pages/Home/index.jsx';

const router = createBrowserRouter([
  {
    path: '/Home',
    element: <Home />,
    },
    {
        path: '/Login',
        element: <h1>Login Page</h1>,
    },
    {
        path: '/Register',
        element: <h1>Register Page</h1>,   
    },
]);

export default router