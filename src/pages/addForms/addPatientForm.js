import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { Autocomplete, Box, Button, Container, CssBaseline, Typography } from '@mui/material';
import api from '../../services/api';
import { useCookies } from 'react-cookie';
import { SnackbarProvider, useSnackbar } from 'notistack';
import logError from '../../utils/errorHandler';

function AddPatient() {
    const [cookies, setCookie] = useCookies(['token']);

    const [people, setPeople] = useState([]);
    const [generalPractitioners, setGeneralPractitioners] = useState([]);
    const [healthInsurances, setHealthInsurances] = useState([]);
    const [users, setUsers] = useState([]);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        api.get(`/api/person/unassigned`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setPeople(res.data);
        });
    }, []);

    useEffect(() => {
        api.get(`/api/doctor/general_practitioners`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setGeneralPractitioners(res.data);
        });
    }, []);

    useEffect(() => {
        api.get(`/api/health_insurance/all`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setHealthInsurances(res.data);
        });
    }, []);

    useEffect(() => {
        api.get(`/api/user/unused_patient_logins`, {
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
        const person = data.get('person')?.split(' ')[0];
        const generalPractitioner = data.get('general_practitioner')?.split(' ')[0];
        const healthInsurance = data.get('health_insurance');
        const user = data.get('user');
        sendRequest(person, generalPractitioner, healthInsurance, user);
    };

    const sendRequest = async (person, generalPractitioner, healthInsurance, user) => {
        if (!person || !generalPractitioner || !healthInsurance || !user) {
            enqueueSnackbar(`Vyplňte všetky povinné polia`, { variant: 'error' });
            return;
        }
        enqueueSnackbar(`Odosielam žiadosť o vytvorenie pacienta.`, { variant: 'info' });
        await api
            .post(
                '/api/patient',
                {
                    person: person,
                    generalPractitioner: generalPractitioner,
                    healthInsurance: healthInsurance,
                    userLogin: user
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`
                    }
                }
            )
            .then(() => {
                enqueueSnackbar('Pacient bol úspešne vytvorený', { variant: 'success' });
            })
            .catch(function (error) {
                const message = error.response.status === 409 ? 'Daný pacient už existuje.' : 'Nepodarilo sa vytvoriť pacienta.';
                enqueueSnackbar(message, { variant: 'error' });
                logError(error);
            });
    };

    return (
        <Box>
            <Box display="flex" py={1} pr={2} mb={2} ml={1}>
                <Typography variant="h1" fontWeight="regular" color="text">
                    Pridať pacienta
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
                        <Autocomplete
                            disablePortal
                            options={people}
                            sx={{ width: 350, mb: 2 }}
                            fullWidth
                            renderInput={(params) => <TextField {...params} label="Osoba" id="person" name="person" required />}
                        />
                        <Autocomplete
                            disablePortal
                            options={generalPractitioners}
                            sx={{ mb: 2 }}
                            fullWidth
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Praktický lekár"
                                    id="general_practitioner"
                                    name="general_practitioner"
                                    required
                                />
                            )}
                        />
                        <Autocomplete
                            disablePortal
                            options={healthInsurances}
                            sx={{ mb: 2 }}
                            fullWidth
                            renderInput={(params) => (
                                <TextField {...params} label="Zdravotná poisťovňa" id="health_insurance" name="health_insurance" required />
                            )}
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Vytvoriť
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default function AddPatientForm() {
    return (
        <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
            <AddPatient />
        </SnackbarProvider>
    );
}
