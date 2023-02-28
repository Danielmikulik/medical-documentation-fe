import { useEffect, useMemo, useState } from 'react';
import ExaminationsTable from './examinationsTable';
import { useCookies } from 'react-cookie';
import api from '../../services/api';
import { Box, Typography } from '@mui/material';

const Examinations = () => {
    const [cookies, setCookie] = useCookies(['userLogin', 'token']);

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.post(
            `/api/med_exams/patient_exams`,
            {
                userLogin: cookies.userLogin
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
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    //should be memoized or stable
    const columns = useMemo(
        () => [
            {
                accessorKey: 'type', //access nested data with dot notation
                header: 'Typ'
            },
            {
                accessorKey: 'disease',
                header: 'Choroba'
            },
            {
                accessorKey: 'doctor', //normal accessorKey
                header: 'Doktor'
            },
            {
                accessorKey: 'startTime',
                header: 'Začiatok'
            },
            {
                accessorKey: 'endTime',
                header: 'Koniec'
            }
        ],
        []
    );

    return (
        <>
            <Box display="flex" py={1} pr={2} mb={2} ml={1}>
                <Typography variant="h1" fontWeight="regular" color="text">
                    Moje vyšetrenia
                </Typography>
            </Box>
            {loading && (
                <Typography variant="button" fontWeight="regular" color="text">
                    Načítavam údaje...
                </Typography>
            )}
            {error && (
                <Typography variant="button" fontWeight="regular" color="text">
                    Nepodarilo sa načítať údaje...
                </Typography>
            )}
            {data && <ExaminationsTable columns={columns} data={data} />}
        </>
    );
};

export default Examinations;
