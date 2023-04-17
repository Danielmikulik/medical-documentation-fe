import { createContext, useContext, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import logError from '../../utils/errorHandler';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const navigate = useNavigate();
    const [cookies, setCookies, removeCookie] = useCookies();

    const login = async ({ userLogin, password }) => {
        let error = true;
        await api
            .post('/api/auth/authenticate', {
                userLogin: userLogin,
                password: password
            })
            .then((res) => {
                error = false;
                setCookies('token', res.data.token);
                navigate('/home');
            })
            .catch(function (error) {
                logError(error);
            });
        return error;
    };

    const logout = () => {
        ['token'].forEach((obj) => removeCookie(obj)); // remove data saved in cookies
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
