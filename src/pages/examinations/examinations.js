import { useEffect, useMemo, useState } from 'react';
import ExaminationsTable from './examinationsTable';
import { useCookies } from 'react-cookie';
import api from '../../services/api';
import { Box, Typography } from '@mui/material';

const Examinations = ({ userRole }) => {
    const [cookies, setCookie] = useCookies(['userLogin', 'token']);

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log(userRole);
    useEffect(() => {
        api.post(
            `/api/med_exams/${userRole}`,
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
    console.log(data);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'type',
                header: 'Typ'
            },
            {
                accessorKey: 'disease',
                header: 'Choroba'
            },
            {
                accessorKey: 'doctor',
                header: 'Doktor'
            }
        ],
        []
    );

    if (userRole === 'doctor') {
        columns.push({
            accessorKey: 'patient',
            header: 'Pacient'
        });
    }
    columns.push(
        {
            accessorKey: 'startTime',
            header: 'Začiatok'
        },
        {
            accessorKey: 'endTime',
            header: 'Koniec'
        }
    );

    return (
        <>
            <Box display="flex" py={1} pr={2} mb={2} ml={1}>
                <Typography variant="h1" fontWeight="regular" color="text">
                    {userRole === 'patient' ? 'Moje vyšetrenia' : 'Vyšetrenia'}
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
