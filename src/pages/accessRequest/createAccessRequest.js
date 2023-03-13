import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { Autocomplete, Button, Snackbar } from '@mui/material';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import api from '../../services/api';
import { useCookies } from 'react-cookie';
import { SnackbarProvider, useSnackbar } from 'notistack';
import logError from '../../utils/errorHandler';

function Access() {
    const [cookies, setCookie] = useCookies(['userLogin', 'token']);
    const [patients, setPatients] = useState([]);
    const [departments, setDepartments] = useState([]);

    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const patient = data.get('patient').split(' ')[0];
        const department = data.get('department');
        const dateSince = data.get('dateSince');
        const dateUntil = data.get('dateUntil');
        sendRequest(patient, department, dateSince, dateUntil);
    };

    useEffect(() => {
        api.get(`/api/med_exams/doctors_patients`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setPatients(res.data);
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

    const sendRequest = async (patient, department, dateSince, dateUntil) => {
        enqueueSnackbar(`Odosielam žiadosť o sprístupnenie záznamov.`, { variant: 'info' });
        const res = await api
            .post(
                '/api/access_request/create',
                {
                    patient: patient,
                    department: department,
                    dateSince: dateSince,
                    dateUntil: dateUntil
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`
                    }
                }
            )
            .then((res) => {
                const message =
                    res.data === 1
                        ? '1 žiadosť bola úspešne vytvorená'
                        : res.data > 1 && res.data < 5
                        ? `${res.data} žiadosti boli úspešne vytvorené`
                        : `${res.data} žiadostí bolo úspešne vytvorených.`;
                enqueueSnackbar(message, { variant: 'success' });
            })
            .catch(function (error) {
                enqueueSnackbar('Nepodarilo sa vytvoriť žiadosť.', { variant: 'error' });
                logError(error);
            });
    };

    return (
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
                <Typography component="h1" variant="h5">
                    Vytvorenie žiadosti
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Autocomplete
                        disablePortal
                        options={patients}
                        sx={{ mb: 2 }}
                        fullWidth
                        // onChange={(e, v) => setSelectValue(v)}
                        renderInput={(params) => <TextField {...params} label="Pacient" id="patient" name="patient" required />}
                    />
                    <Autocomplete
                        disablePortal
                        options={departments}
                        sx={{ mb: 2 }}
                        fullWidth
                        renderInput={(params) => <TextField {...params} label="Oddelenie" id="department" name="department" required />}
                    />
                    <TextField
                        id="dateSince"
                        name="dateSince"
                        label="Záznamy od"
                        type="date"
                        margin={'normal'}
                        defaultValue={new Date().toJSON().slice(0, 10)}
                        fullWidth
                        InputLabelProps={{
                            shrink: true
                        }}
                        required
                    />
                    <TextField
                        id="dateUntil"
                        name="dateUntil"
                        label="Sprístupniť do"
                        type="date"
                        margin={'normal'}
                        defaultValue={new Date().toJSON().slice(0, 10)}
                        fullWidth
                        InputLabelProps={{
                            shrink: true
                        }}
                        required
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Požiadať
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default function CreateAccessRequest() {
    return (
        <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
            <Access />
        </SnackbarProvider>
    );
}
