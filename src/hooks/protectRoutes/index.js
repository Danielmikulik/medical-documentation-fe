import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../auth';
import parseJwt from '../../utils/jwtUtil';

export const ProtectRoutes = () => {
    const { cookies } = useAuth();

    return cookies.token ? <Outlet /> : <Navigate to="/login" exact />;
};

export const ProtectRoutesLogged = () => {
    const { cookies } = useAuth();

    return cookies.token ? <Navigate to="/" exact /> : <Outlet />;
};

export const ProtectRoutesByRoles = ({ allowedRoles }) => {
    const { cookies } = useAuth();

    const role = parseJwt(cookies.token)?.Authorities[0].authority.toLowerCase();

    return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/" exact />;
};

export const ProtectRoutesByDepartment = (allowedDepartment) => {
    const { cookies } = useAuth();

    const department = parseJwt(cookies.token)?.department;
    return allowedDepartment.department === department ? <Outlet /> : <Navigate to="/" exact />;
};

export function ProtectDashboardByRoles() {
    const { cookies } = useAuth();

    const role = parseJwt(cookies.token)?.Authorities[0].authority;

    switch (role) {
        case 'DOCTOR':
            return <Navigate to="/home_doctor" exact />;
        case 'PATIENT':
            return <Navigate to="/home_patient" exact />;
        case 'ADMIN':
            return <Navigate to="/home_default" exact />;
    }
}
