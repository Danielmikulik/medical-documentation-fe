import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { Autocomplete, Box, Button, Container, CssBaseline, Typography } from '@mui/material';
import api from '../../services/api';
import { useCookies } from 'react-cookie';
import { SnackbarProvider, useSnackbar } from 'notistack';
import logError from '../../utils/errorHandler';

function AddDoctor() {
    const [cookies, setCookie] = useCookies(['token']);

    const [people, setPeople] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [users, setUsers] = useState([]);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        api.get(`/api/person/all`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setPeople(res.data);
        });
    }, []);

    useEffect(() => {
        api.get(`/api/hospital/all`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setHospitals(res.data);
        });
    }, []);

    useEffect(() => {
        api.get(`/api/department_type/all`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setDepartments(res.data);
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
        const person = data.get('person')?.split(' ')[0];
        const hospital = data.get('hospital');
        const departmentType = data.get('departmentType');
        const user = data.get('user');
        sendRequest(person, hospital, departmentType, user);
    };

    const sendRequest = async (person, hospital, departmentType, user) => {
        if (!person || !hospital || !departmentType || !user) {
            enqueueSnackbar(`Vyplňte všetky povinné polia`, { variant: 'error' });
            return;
        }
        enqueueSnackbar(`Odosielam žiadosť o vytvorenie doktora.`, { variant: 'info' });
        await api
            .post(
                '/api/doctor',
                {
                    person: person,
                    hospital: hospital,
                    departmentType: departmentType,
                    userLogin: user
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`
                    }
                }
            )
            .then(() => {
                enqueueSnackbar('Doktor bol úspešne vytvorený', { variant: 'success' });
            })
            .catch(function (error) {
                const message = error.response.status === 409 ? 'Daný doktor už existuje.' : 'Nepodarilo sa vytvoriť doktora.';
                enqueueSnackbar(message, { variant: 'error' });
                logError(error);
            });
    };

    return (
        <Box>
            <Box display="flex" py={1} pr={2} mb={2} ml={1}>
                <Typography variant="h1" fontWeight="regular" color="text">
                    Pridať doktora
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
                            sx={{ mb: 2 }}
                            fullWidth
                            renderInput={(params) => <TextField {...params} label="Osoba" id="person" name="person" required />}
                        />
                        <Autocomplete
                            disablePortal
                            options={hospitals}
                            sx={{ mb: 2 }}
                            fullWidth
                            renderInput={(params) => <TextField {...params} label="Nemocnica" id="hospital" name="hospital" required />}
                        />
                        <Autocomplete
                            disablePortal
                            options={departments}
                            fullWidth
                            renderInput={(params) => (
                                <TextField {...params} label="Oddelenie" id="departmentType" name="departmentType" required />
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

export default function AddDoctorForm() {
    return (
        <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
            <AddDoctor />
        </SnackbarProvider>
    );
}
