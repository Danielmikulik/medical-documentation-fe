import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { Autocomplete, Box, Button, Container, CssBaseline, Typography } from '@mui/material';
import api from '../../services/api';
import { useCookies } from 'react-cookie';
import { SnackbarProvider, useSnackbar } from 'notistack';
import logError from '../../utils/errorHandler';

function AddPharmacy() {
    const [cookies, setCookie] = useCookies(['token']);

    const [cities, setCities] = useState([]);
    const [users, setUsers] = useState([]);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        api.get(`/api/city/all`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setCities(res.data);
        });
    }, []);

    useEffect(() => {
        api.get(`/api/user/logins`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setUsers(res.data);
        });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = data.get('name');
        const user = data.get('user');
        const zipCode = data.get('city')?.split(' ')[0];
        const address = data.get('address');
        sendRequest(name, user, zipCode, address);
    };

    const sendRequest = async (name, user, zipCode, address) => {
        if (!name || !user || !address || !zipCode) {
            enqueueSnackbar(`Vyplňte všetky povinné polia`, { variant: 'error' });
            return;
        }
        enqueueSnackbar(`Odosielam žiadosť o vytvorenie lekárne.`, { variant: 'info' });
        await api
            .post(
                '/api/pharmacy',
                {
                    name: name,
                    userLogin: user,
                    zipCode: zipCode,
                    address: address
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`
                    }
                }
            )
            .then(() => {
                enqueueSnackbar('Lekáreň bola úspešne vytvorená', { variant: 'success' });
            })
            .catch(function (error) {
                const message = error.response.status === 409 ? 'Daná lekáreň už existuje.' : 'Nepodarilo sa vytvoriť lekáreň.';
                enqueueSnackbar(message, { variant: 'error' });
                logError(error);
            });
    };

    return (
        <Box>
            <Box display="flex" py={1} pr={2} mb={2} ml={1}>
                <Typography variant="h1" fontWeight="regular" color="text">
                    Pridať lekáreň
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
                        <Autocomplete
                            disablePortal
                            options={users}
                            sx={{ width: 350, mb: 2 }}
                            fullWidth
                            renderInput={(params) => <TextField {...params} label="Používateľ" id="user" name="user" required />}
                        />
                        <TextField label="Názov" id="name" name="name" sx={{ mb: 2 }} fullWidth required />
                        <Autocomplete
                            disablePortal
                            options={cities}
                            sx={{ mb: 2 }}
                            fullWidth
                            renderInput={(params) => <TextField {...params} label="Mesto" id="city" name="city" required />}
                        />
                        <TextField label="Adresa" id="address" name="address" fullWidth required />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Vytvoriť
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default function AddPharmacyForm() {
    return (
        <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
            <AddPharmacy />
        </SnackbarProvider>
    );
}
