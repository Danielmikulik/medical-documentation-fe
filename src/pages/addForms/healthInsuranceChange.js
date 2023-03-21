import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { Autocomplete, Box, Button, Container, CssBaseline, Typography } from '@mui/material';
import api from '../../services/api';
import { useCookies } from 'react-cookie';
import { SnackbarProvider, useSnackbar } from 'notistack';
import logError from '../../utils/errorHandler';

function ChangePatientsInsurance() {
    const [cookies, setCookie] = useCookies(['userLogin', 'token']);

    const [patients, setPatients] = useState([]);
    const [healthInsurance, setHealthInsurance] = useState([]);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        api.get(`/api/patient/all`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setPatients(res.data);
        });
    }, []);

    useEffect(() => {
        api.get(`/api/health_insurance/all`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setHealthInsurance(res.data);
        });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const patient = data.get('patient')?.split(' ')[0];
        const healthInsurance = data.get('healthInsurance');
        sendRequest(patient, healthInsurance);
    };

    const sendRequest = async (patient, healthInsurance) => {
        if (!patient || !healthInsurance) {
            enqueueSnackbar(`Vyplňte všetky povinné polia`, { variant: 'error' });
            return;
        }
        enqueueSnackbar(`Odosielam žiadosť o zmenu zdravotnej poisťovne.`, { variant: 'info' });
        await api
            .post(
                '/api/patient/health_insurance_change',
                {
                    patient: patient,
                    healthInsurance: healthInsurance
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`
                    }
                }
            )
            .then(() => {
                enqueueSnackbar('Zdravotná poisťovňa bola úspešne zmenená', { variant: 'success' });
            })
            .catch(function (error) {
                const message =
                    error.response.status === 409 ? 'Pacient už je vedený v danej poisťovni.' : 'Nepodarilo sa zmeniť zdravotnú poisťovňu.';
                enqueueSnackbar(message, { variant: 'error' });
                logError(error);
            });
    };

    return (
        <Box>
            <Box display="flex" py={1} pr={2} mb={2} ml={1}>
                <Typography variant="h1" fontWeight="regular" color="text">
                    Zmena zdravotnej poisťovne
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
                            options={patients}
                            sx={{ width: 300, mb: 2 }}
                            fullWidth
                            renderInput={(params) => <TextField {...params} label="Pacient" id="patient" name="patient" required />}
                        />
                        <Autocomplete
                            disablePortal
                            options={healthInsurance}
                            fullWidth
                            renderInput={(params) => (
                                <TextField {...params} label="Zdravotná poisťovňa" id="healthInsurance" name="healthInsurance" required />
                            )}
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Zmeniť
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default function HealthInsuranceChange() {
    return (
        <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
            <ChangePatientsInsurance />
        </SnackbarProvider>
    );
}
