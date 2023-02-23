import { createContext, useContext, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import parseJwt from '../../utils/jwtUtil';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const navigate = useNavigate();
    const [cookies, setCookies, removeCookie] = useCookies();

    const login = async ({ userLogin, password }) => {
        const res = await api.post('/api/auth/authenticate', {
            userLogin: userLogin,
            password: password
        });
        const jwt = parseJwt(res.data.token);

        setCookies('token', res.data.token); // your token
        setCookies('userLogin', jwt.sub); // optional data
        // setCookies('userRole', jwt.role); // optional data

        navigate('/home');
    };

    const logout = () => {
        ['token', 'userLogin', 'userRole'].forEach((obj) => removeCookie(obj)); // remove data save in cookies
        navigate('/login');
    };

    const value = useMemo(
        () => ({
            cookies,
            login,
            logout
        }),
        [cookies]
    );

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useAuth = () => {
    return useContext(UserContext);
};
