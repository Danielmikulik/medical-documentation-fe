import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { Autocomplete, Box, Button, Container, CssBaseline, Typography } from '@mui/material';
import api from '../../services/api';
import { useCookies } from 'react-cookie';
import { SnackbarProvider, useSnackbar } from 'notistack';
import logError from '../../utils/errorHandler';

function RegisterUser() {
    const [cookies, setCookie] = useCookies(['token']);

    const [roles, setRoles] = useState([]);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        api.get(`/api/user/roles`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setRoles(res.data);
        });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const userLogin = data.get('user_login');
        const email = data.get('email');
        const password = data.get('password');
        const telephone = data.get('telephone');
        const role = data.get('role');
        sendRequest(userLogin, email, password, telephone, role);
    };

    const sendRequest = async (userLogin, email, password, telephone, role) => {
        if (!userLogin || !email || !password || !telephone || !role) {
            enqueueSnackbar(`Vyplňte všetky povinné polia`, { variant: 'error' });
            return;
        }
        enqueueSnackbar(`Odosielam žiadosť o vytvorenie používateľa.`, { variant: 'info' });
        await api
            .post(
                '/api/auth/register',
                {
                    userLogin: userLogin,
                    email: email,
                    password: password,
                    telephone: telephone,
                    role: role
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`
                    }
                }
            )
            .then(() => {
                enqueueSnackbar(`Používateľ ${userLogin} bol úspešne vytvorený`, { variant: 'success' });
            })
            .catch(function (error) {
                const message =
                    error.response.status === 409 ? `Používateľ ${userLogin} už existuje.` : 'Nepodarilo sa vytvoriť používateľa.';
                enqueueSnackbar(message, { variant: 'error' });
                logError(error);
            });
    };

    return (
        <Box>
            <Box display="flex" py={1} pr={2} mb={2} ml={1}>
                <Typography variant="h1" fontWeight="regular" color="text">
                    Registrácia používateľa
                </Typography>
            </Box>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField label="Prihlasovacie meno" id="user_login" name="user_login" sx={{ mb: 2 }} fullWidth required />
                        <TextField type="email" label="Email" id="email" name="email" sx={{ mb: 2 }} fullWidth required />
                        <TextField type="password" label="Heslo" id="password" name="password" sx={{ mb: 2 }} fullWidth required />
                        <TextField type="tel" label="Telefónne číslo" id="telephone" name="telephone" sx={{ mb: 2 }} fullWidth required />
                        <Autocomplete
                            disablePortal
                            options={roles}
                            fullWidth
                            renderInput={(params) => <TextField {...params} label="Používateľská rola" id="role" name="role" required />}
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Registrovať
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default function RegisterUserForm() {
    return (
        <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
            <RegisterUser />
        </SnackbarProvider>
    );
}
