// material-ui
import { Box, Grid, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import KeyValueCard from '../profile/KeyValueCard';
import DateRangeKeyValueCard from '../profile/dateRangeKeyValueCard';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import logError from '../../utils/errorHandler';

export default function PatientInfo({ patientBirthNumber }) {
    const [cookies, setCookie] = useCookies(['token']);

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('SOM TU');
        api.post(
            '/api/patient/name',
            {
                value: patientBirthNumber
            },
            {
                headers: {
                    Authorization: `Bearer ${cookies.token}`
                }
            }
        )
            .then((res) => {
                setData(res.data);
                setError(null);
            })
            .catch(function (error) {
                setError(error.message);
                setData(null);
                logError(error);
            });
    }, []);

    return (
        <Stack spacing={3}>
            <Typography ml={0.5} variant="h3" fontWeight="bold">
                {(data && `Meno: ${data}`) || 'Pacient s daným rodným číslom neexistuje'}
            </Typography>
            {data && (
                <MainCard title="Choroby">
                    <Stack spacing={0.75} sx={{ mt: -1.5 }}>
                        <DateRangeKeyValueCard
                            keys={['disease', 'diagnosed', 'cured']}
                            url={'/api/disease'}
                            patientBirthNumber={patientBirthNumber}
                        />
                    </Stack>
                </MainCard>
            )}
            {data && (
                <MainCard title="Lieky">
                    <Stack spacing={0.75} sx={{ mt: -1.5 }}>
                        <KeyValueCard
                            url={'/api/prescription/patient_medications_by_birth_number'}
                            patientBirthNumber={patientBirthNumber}
                        />
                    </Stack>
                </MainCard>
            )}
        </Stack>
    );
}
