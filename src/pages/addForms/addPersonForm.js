import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { Autocomplete, Box, Button, Container, CssBaseline, Typography } from '@mui/material';
import api from '../../services/api';
import { useCookies } from 'react-cookie';
import { SnackbarProvider, useSnackbar } from 'notistack';
import logError from '../../utils/errorHandler';

function AddPerson() {
    const [cookies, setCookie] = useCookies(['token']);

    const [cities, setCities] = useState([]);

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

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = data.get('name');
        const surname = data.get('surname');
        const birth_number = data.get('birth_number');
        const birth_date = data.get('birth_date');
        const zipCode = data.get('city')?.split(' ')[0];
        const address = data.get('address');
        sendRequest(name, surname, birth_number, birth_date, zipCode, address);
    };

    const sendRequest = async (name, surname, birth_number, birth_date, zipCode, address) => {
        if (!name || !surname || !address || !birth_date || !zipCode) {
            enqueueSnackbar(`Vyplňte všetky povinné polia`, { variant: 'error' });
            return;
        }
        enqueueSnackbar(`Odosielam žiadosť o vytvorenie osoby.`, { variant: 'info' });
        await api
            .post(
                '/api/person',
                {
                    name: name,
                    surname: surname,
                    birthNumber: birth_number,
                    birthDate: birth_date,
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
                enqueueSnackbar('Osoba bola úspešne vytvorená', { variant: 'success' });
            })
            .catch(function (error) {
                const message = error.response.status === 409 ? 'Daná osoba už existuje.' : 'Nepodarilo sa vytvoriť osobu.';
                enqueueSnackbar(message, { variant: 'error' });
                logError(error);
            });
    };

    return (
        <Box>
            <Box display="flex" py={1} pr={2} mb={2} ml={1}>
                <Typography variant="h1" fontWeight="regular" color="text">
                    Pridať osobu
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
                        <TextField label="Meno" id="name" name="name" sx={{ mb: 2 }} fullWidth required />
                        <TextField label="Priezvisko" id="surname" name="surname" sx={{ mb: 2 }} fullWidth required />
                        <TextField label="Rodné číslo" id="birth_number" name="birth_number" fullWidth />
                        <TextField
                            id="birth_date"
                            name="birth_date"
                            label="Dátum narodenia"
                            type="date"
                            margin={'normal'}
                            defaultValue={new Date().toJSON().slice(0, 10)}
                            sx={{ mb: 2 }}
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                            required
                        />
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

export default function AddPersonForm() {
    return (
        <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
            <AddPerson />
        </SnackbarProvider>
    );
}
