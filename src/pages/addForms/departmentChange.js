import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { Autocomplete, Box, Button, Container, CssBaseline, Typography } from '@mui/material';
import api from '../../services/api';
import { useCookies } from 'react-cookie';
import { SnackbarProvider, useSnackbar } from 'notistack';
import logError from '../../utils/errorHandler';

function ChangeDoctorsDepartment() {
    const [cookies, setCookie] = useCookies(['userLogin', 'token']);

    const [doctors, setDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [departments, setDepartments] = useState([]);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        api.get(`/api/doctor/all`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setDoctors(res.data);
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

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const doctor = data.get('doctor')?.split(' ')[0];
        const hospital = data.get('hospital');
        const departmentType = data.get('departmentType');
        sendRequest(doctor, hospital, departmentType);
    };

    const sendRequest = async (doctor, hospital, departmentType) => {
        if (!doctor || !hospital || !departmentType) {
            console.log(doctor);
            console.log(hospital);
            console.log(departmentType);
            enqueueSnackbar(`Vyplňte všetky povinné polia`, { variant: 'error' });
            return;
        }
        enqueueSnackbar(`Odosielam žiadosť o zmenu oddelenia.`, { variant: 'info' });
        await api
            .post(
                '/api/doctor/department_change',
                {
                    doctor: doctor,
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
                enqueueSnackbar('Oddelenie bolo úspešne zmenené', { variant: 'success' });
            })
            .catch(function (error) {
                const message = error.response.status === 409 ? 'Doktor už pracuje na danom oddelení.' : 'Nepodarilo sa zmaniť oddelenie.';
                enqueueSnackbar(message, { variant: 'error' });
                logError(error);
            });
    };

    return (
        <Box>
            <Box display="flex" py={1} pr={2} mb={2} ml={1}>
                <Typography variant="h1" fontWeight="regular" color="text">
                    Zmena oddelenia
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
                            options={doctors}
                            sx={{ mb: 2 }}
                            fullWidth
                            renderInput={(params) => <TextField {...params} label="Doktor" id="doctor" name="doctor" required />}
                        />
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
                                <TextField {...params} label="Oddelenie" id="departmentType" name="departmentType" required />
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

export default function DepartmentChange() {
    return (
        <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
            <ChangeDoctorsDepartment />
        </SnackbarProvider>
    );
}
