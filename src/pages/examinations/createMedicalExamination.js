import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { Autocomplete, Button, Grid, Stack, Tooltip } from '@mui/material';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import api from '../../services/api';
import { useCookies } from 'react-cookie';
import { SnackbarProvider, useSnackbar } from 'notistack';
import logError from '../../utils/errorHandler';
import MainCard from '../../components/MainCard';
import PatientInfo from '../patientInfo/patientInfo';
import InfoIcon from '@mui/icons-material/Info';

function MedicalExam() {
    const [cookies, setCookie] = useCookies(['userLogin', 'token']);
    const [patients, setPatients] = useState([]);
    const [examinationTypes, setExaminationTypes] = useState([]);
    const [diseaseTypes, setDiseaseTypes] = useState([]);
    const [patientBirthNumber, setPatientBirthNumber] = useState('');
    const [showPatientInfo, setShowPatientInfo] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const patient = data.get('patient').split(' ')[0];
        const examinationType = data.get('examinationType');
        const diseaseType = data.get('diseaseType');
        const startTime = data.get('startTime');
        const endTime = data.get('endTime');
        if (!patient || !examinationType || !startTime || !endTime) {
            enqueueSnackbar(`Vyplňte všetky povinné polia`, { variant: 'error' });
            return;
        }
        sendRequest(patient, examinationType, diseaseType, startTime, endTime);
    };

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
        api.get(`/api/examination_type/all`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setExaminationTypes(res.data);
        });
    }, []);

    useEffect(() => {
        api.get(`/api/disease_type/all`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setDiseaseTypes(res.data);
        });
    }, []);

    const sendRequest = async (patient, examinationType, diseaseType, startTime, endTime) => {
        enqueueSnackbar(`Odosielam žiadosť o sprístupnenie záznamov.`, { variant: 'info' });
        await api
            .post(
                '/api/med_exams/create',
                {
                    patient: patient,
                    examinationType: examinationType,
                    diseaseType: diseaseType,
                    startTime: startTime,
                    endTime: endTime
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`
                    }
                }
            )
            .then(() => {
                enqueueSnackbar('Záznam z vyšetrenia bol úspešne vytvorený', { variant: 'success' });
            })
            .catch(function (error) {
                enqueueSnackbar('Nepodarilo sa vytvoriť záznam z vyšetrenia.', { variant: 'error' });
                logError(error);
            });
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

    return (
        <Box>
            <Box display="flex" py={1} pr={2} mb={2} ml={1}>
                <Typography variant="h1" fontWeight="regular" color="text">
                    Vytvoriť vyšetrenie
                </Typography>
            </Box>
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
                            <Box>
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
                                            Vytvoriť vyšetrenie
                                        </Typography>
                                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                                            <Autocomplete
                                                disablePortal
                                                options={patients}
                                                freeSolo
                                                sx={{ mb: 2 }}
                                                fullWidth
                                                onInputChange={handlePatientOnChange}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Pacient" id="patient" name="patient" required />
                                                )}
                                            />
                                            <Autocomplete
                                                disablePortal
                                                options={examinationTypes}
                                                sx={{ mb: 2 }}
                                                fullWidth
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Typ vyšetrenia"
                                                        id="examinationType"
                                                        name="examinationType"
                                                        required
                                                    />
                                                )}
                                            />
                                            <Autocomplete
                                                disablePortal
                                                options={diseaseTypes}
                                                sx={{ mb: 2 }}
                                                fullWidth
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Choroba" id="diseaseType" name="diseaseType" />
                                                )}
                                            />
                                            <TextField
                                                id="startTime"
                                                name="startTime"
                                                label="Začiatok vyšetrenia"
                                                type="datetime-local"
                                                margin={'normal'}
                                                defaultValue={new Date().toJSON().slice(0, 16)}
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                required
                                            />
                                            <TextField
                                                id="endTime"
                                                name="endTime"
                                                label="Koniec vyšetrenia"
                                                type="datetime-local"
                                                margin={'normal'}
                                                defaultValue={new Date().toJSON().slice(0, 16)}
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                required
                                            />
                                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                                Vytvoriť
                                            </Button>
                                        </Box>
                                    </Box>
                                </Container>
                            </Box>
                        </MainCard>
                    </Stack>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Stack spacing={3}>{showPatientInfo && <PatientInfo patientBirthNumber={patientBirthNumber} />}</Stack>
                </Grid>
            </Grid>
        </Box>
    );
}

export default function CreateMedicalExamination() {
    return (
        <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
            <MedicalExam />
        </SnackbarProvider>
    );
}
