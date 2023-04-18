import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { Autocomplete, Box, Button, Container, CssBaseline, Typography } from '@mui/material';
import api from '../../services/api';
import { useCookies } from 'react-cookie';
import { SnackbarProvider, useSnackbar } from 'notistack';
import logError from '../../utils/errorHandler';

function CreatePrescriptionForm() {
    const [cookies, setCookie] = useCookies(['userLogin', 'token']);

    const [patients, setPatients] = useState([]);
    const [medications, setMedications] = useState([]);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        api.get(`/api/patient/doctors_patients`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setPatients(res.data);
        });
    }, []);

    useEffect(() => {
        api.get(`/api/medication/all`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setMedications(res.data);
        });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const patient = data.get('patient')?.split(' ')[0];
        const medicationString = data.get('medication')?.split(' ');
        const medication = medicationString.slice(0, -2).join(' ');
        const amount = data.get('amount');
        sendRequest(patient, medication, amount);
    };

    const sendRequest = async (patient, medication, amount) => {
        if (!patient || !medication || !amount) {
            enqueueSnackbar(`Vyplňte všetky povinné polia`, { variant: 'error' });
            return;
        }
        enqueueSnackbar(`Odosielam žiadosť o vytvorenie receptu.`, { variant: 'info' });
        await api
            .post(
                '/api/prescription',
                {
                    patient: patient,
                    medication: medication,
                    amount: amount
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`
                    }
                }
            )
            .then(() => {
                enqueueSnackbar('Recept bol úspešne vytvorený', { variant: 'success' });
            })
            .catch(function (error) {
                const message = 'Nepodarilo sa vytvoriť daný záznam.';
                enqueueSnackbar(message, { variant: 'error' });
                logError(error);
            });
    };

    return (
        <Box>
            <Box display="flex" py={1} pr={2} mb={2} ml={1}>
                <Typography variant="h1" fontWeight="regular" color="text">
                    Pridať oddelenie
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
                            freeSolo
                            options={patients}
                            sx={{ mb: 2 }}
                            fullWidth
                            renderInput={(params) => <TextField {...params} label="Pacient" id="patient" name="patient" required />}
                        />
                        <Autocomplete
                            disablePortal
                            options={medications}
                            sx={{ mb: 2 }}
                            fullWidth
                            renderInput={(params) => <TextField {...params} label="Liek" id="medication" name="medication" required />}
                        />
                        <TextField type="number" label="Množstvo" id="amount" name="amount" fullWidth sx={{ mb: 2 }} required />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Vytvoriť
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default function CreatePrescription() {
    return (
        <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
            <CreatePrescriptionForm />
        </SnackbarProvider>
    );
}
