import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { Autocomplete, Button, Grid, Stack, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import api from '../../services/api';
import { useCookies } from 'react-cookie';
import { SnackbarProvider, useSnackbar } from 'notistack';
import logError from '../../utils/errorHandler';
import MainCard from '../../components/MainCard';
import InfoIcon from '@mui/icons-material/Info';
import PatientInfo from '../patientInfo/patientInfo';

function Access() {
    const [cookies, setCookie] = useCookies(['userLogin', 'token']);
    const [patients, setPatients] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [patientBirthNumber, setPatientBirthNumber] = useState('');
    const [showPatientInfo, setShowPatientInfo] = useState(false);

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

    function handlePatientOnChange(event, value) {
        const birthNumber = value?.split(' ')[0];
        setPatientBirthNumber(birthNumber);
        console.log(birthNumber);
    }

    function handleShowPatientInfoClick() {
        const show = showPatientInfo;
        setShowPatientInfo(!show);
    }

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
        api.get(`/api/department_type/all`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setDepartments(res.data);
        });
    }, []);

    const sendRequest = async (patient, department, dateSince, dateUntil) => {
        if (!patient || !department || !dateSince || !dateUntil) {
            enqueueSnackbar(`Vyplňte všetky povinné polia`, { variant: 'error' });
            return;
        }
        enqueueSnackbar(`Odosielam žiadosť o sprístupnenie záznamov.`, { variant: 'info' });
        await api
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
                if (res.data === 0) {
                    enqueueSnackbar('Nenašla sa žiadosť vyhovujúca zadaným kritériam', { variant: 'info' });
                    return;
                }
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
        <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
                <Stack spacing={3}>
                    <MainCard>
                        <Tooltip title="Zadajte pacientové rodné číslo">
                            <span>
                                <Button
                                    variant="contained"
                                    onClick={handleShowPatientInfoClick}
                                    disabled={patientBirthNumber === ''}
                                    startIcon={<InfoIcon />}
                                    sx={{ mb: 3 }}
                                >
                                    {`${showPatientInfo ? 'Skryť' : 'Zobraziť'}`} info o pacientovi
                                </Button>
                            </span>
                        </Tooltip>
                        <Box
                            sx={{
                                marginTop: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                        >
                            <Typography component="h1" variant="h5">
                                Vytvoriť žiadosť
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                                <Autocomplete
                                    disablePortal
                                    options={patients}
                                    freeSolo
                                    sx={{ mb: 2 }}
                                    fullWidth
                                    onInputChange={handlePatientOnChange}
                                    renderInput={(params) => <TextField {...params} label="Pacient" id="patient" name="patient" required />}
                                />
                                <Autocomplete
                                    disablePortal
                                    options={departments}
                                    sx={{ mb: 2 }}
                                    fullWidth
                                    renderInput={(params) => (
                                        <TextField {...params} label="Oddelenie" id="department" name="department" required />
                                    )}
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
                    </MainCard>
                </Stack>
            </Grid>
            <Grid item xs={12} lg={6}>
                <Stack spacing={3}>{showPatientInfo && <PatientInfo patientBirthNumber={patientBirthNumber} />}</Stack>
            </Grid>
        </Grid>
    );
}

export default function CreateAccessRequest() {
    return (
        <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
            <Access />
        </SnackbarProvider>
    );
}
