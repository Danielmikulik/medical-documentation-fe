import React from 'react';
import TextField from '@mui/material/TextField';
import { Box, Button, Container, CssBaseline, Typography } from '@mui/material';
import api from '../../services/api';
import { useCookies } from 'react-cookie';
import { SnackbarProvider, useSnackbar } from 'notistack';
import logError from '../../utils/errorHandler';

function CreateCity() {
    const [cookies, setCookie] = useCookies(['userLogin', 'token']);

    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = data.get('name');
        const zipCode = data.get('zipCode');
        sendRequest(zipCode, name);
    };

    const sendRequest = async (zipCode, name) => {
        if (!zipCode || !name) {
            enqueueSnackbar(`Vyplňte všetky povinné polia`, { variant: 'error' });
            return;
        }
        enqueueSnackbar(`Odosielam žiadosť o vytvorenie mesta.`, { variant: 'info' });
        await api
            .post(
                '/api/city',
                {
                    zipCode: zipCode,
                    name: name
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`
                    }
                }
            )
            .then(() => {
                enqueueSnackbar('Nový záznam bol úspešne vytvorený', { variant: 'success' });
            })
            .catch(function (error) {
                const message = error.response.status === 409 ? 'Mesto s daným PSČ už existuje.' : 'Nepodarilo sa vytvoriť daný záznam.';
                enqueueSnackbar(message, { variant: 'error' });
                logError(error);
            });
    };

    return (
        <Box>
            <Box display="flex" py={1} pr={2} mb={2} ml={1}>
                <Typography variant="h1" fontWeight="regular" color="text">
                    Pridať mesto
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
                        <TextField label="psč" id="zipCode" name="zipCode" required fullWidth sx={{ mb: 1 }} />
                        <TextField label="Názov mesta" id="name" name="name" required fullWidth />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Vytvoriť
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default function AddCity({ url, title, label }) {
    return (
        <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
            <CreateCity />
        </SnackbarProvider>
    );
}
