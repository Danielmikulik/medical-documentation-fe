import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import { ProtectRoutesLogged } from '../hooks/protectRoutes';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/auth-forms/AuthLogin')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/auth-forms/AuthRegister')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
    element: <ProtectRoutesLogged />,
    children: [
        {
            path: '/',
            element: <MinimalLayout />,
            children: [
                {
                    path: 'login',
                    element: <AuthLogin />
                },
                {
                    path: 'register',
                    element: <AuthRegister />
                }
            ]
        }
    ]
};

export default LoginRoutes;
