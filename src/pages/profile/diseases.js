// material-ui
import { Box, Typography } from '@mui/material';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import logError from '../../utils/errorHandler';

export default function InsuranceHistory() {
    const [cookies, setCookie] = useCookies(['token']);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.post(
            `/api/patient_insurance_history`,
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
                logError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const renderItems = data.map((row) => (
        <Box key={row.insurance} display="flex" py={1} pr={2}>
            <Typography variant="body1" fontWeight="bold">
                {row.insurance}: &nbsp;
            </Typography>
            <Typography variant="body1" fontWeight="regular" color="text">
                &nbsp;{`${row.since} - ${row.till ? row.till : 'súčasnosť'}`}
            </Typography>
        </Box>
    ));

    return (
        <>
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
            {data && renderItems}
        </>
    );
}
