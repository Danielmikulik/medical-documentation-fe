import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { Autocomplete, Box, Button, Container, CssBaseline, Typography } from '@mui/material';
import api from '../../services/api';
import { useCookies } from 'react-cookie';
import { SnackbarProvider, useSnackbar } from 'notistack';
import logError from '../../utils/errorHandler';

function CreateDepartment() {
    const [cookies, setCookie] = useCookies(['userLogin', 'token']);

    const [hospitals, setHospitals] = useState([]);
    const [departments, setDepartments] = useState([]);

    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const hospital = data.get('hospital');
        const departmentType = data.get('departmentType');
        sendRequest(hospital, departmentType);
    };

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

    const sendRequest = async (hospital, departmentType) => {
        if (!hospital || !departmentType) {
            enqueueSnackbar(`Vyplňte všetky povinné polia`, { variant: 'error' });
            return;
        }
        enqueueSnackbar(`Odosielam žiadosť o vytvorenie oddelenia.`, { variant: 'info' });
        await api
            .post(
                '/api/department',
                {
                    hospital: hospital,
                    departmentType: departmentType
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
                const message =
                    error.response.status === 409
                        ? 'Daný typ oddelenia v danej nemocnici už existuje.'
                        : 'Nepodarilo sa vytvoriť daný záznam.';
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
                            options={hospitals}
                            sx={{ width: 300, mb: 2 }}
                            fullWidth
                            renderInput={(params) => <TextField {...params} label="Nemocnica" id="hospital" name="hospital" required />}
                        />
                        <Autocomplete
                            disablePortal
                            options={departments}
                            fullWidth
                            renderInput={(params) => (
                                <TextField {...params} label="Typ oddelenia" id="departmentType" name="departmentType" required />
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

export default function AddDepartmentForm() {
    return (
        <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
            <CreateDepartment />
        </SnackbarProvider>
    );
}
