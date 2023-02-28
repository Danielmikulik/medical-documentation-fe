// material-ui
import { Box, Stack, Typography } from '@mui/material';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import parseJwt from '../../utils/jwtUtil';
import api from '../../services/api';

export default function InsuranceHistory() {
    const labels = [];
    const values = [];

    const [cookies, setCookie] = useCookies(['userLogin', 'token']);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const role = parseJwt(cookies.token)?.Authorities[0].authority.toLowerCase();

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
