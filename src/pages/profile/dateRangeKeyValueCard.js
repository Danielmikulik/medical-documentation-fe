// material-ui
import { Box, Stack, Typography } from '@mui/material';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import logError from '../../utils/errorHandler';

export default function DateRangeKeyValueCard({ keys, url, patientBirthNumber }) {
    const [cookies, setCookie] = useCookies(['userLogin', 'token']);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('SOM TU');
        api.post(
            url,
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
                console.log('SOM TU');
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
    console.log(data);

    const renderItems = data.map((row) => (
        <Box key={row[keys[0]]} display="flex" py={1} pr={2}>
            <Typography variant="body1" fontWeight="bold">
                {row[keys[0]]}: &nbsp;
            </Typography>
            <Typography variant="body1" fontWeight="regular" color="text">
                &nbsp;{`${row[keys[1]]} - ${row[keys[2]] ? row[keys[2]] : 'súčasnosť'}`}
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
