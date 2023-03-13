// material-ui
import { Box, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import parseJwt from '../../utils/jwtUtil';
import api from '../../services/api';
import logError from '../../utils/errorHandler';

function ProfileInfo() {
    const labels = [];
    const values = [];

    const [cookies, setCookie] = useCookies(['userLogin', 'token']);

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const role = parseJwt(cookies.token)?.Authorities[0].authority.toLowerCase();

    useEffect(() => {
        api.post(
            `/api/user/${role}`,
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

    Object.keys(data).forEach((el) => labels.push(el));
    Object.values(data).forEach((el) => values.push(el));

    const renderItems = labels.map((label, key) => (
        <Box key={label} display="flex" py={1} pr={2}>
            <Typography variant="body1" fontWeight="bold">
                {label}: &nbsp;
            </Typography>
            {!Array.isArray(values[key]) && renderSingleValue(values[key])}
            {Array.isArray(values[key]) && <Stack spacing={0.75}>{renderArray(values[key])}</Stack>}
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

function renderSingleValue(value) {
    return (
        <Typography variant="body1" fontWeight="regular" color="text">
            &nbsp;{value}
        </Typography>
    );
}

function renderArray(array) {
    return array.map((value) => (
        <Typography variant="body1" fontWeight="regular" color="text">
            &nbsp;{value}
        </Typography>
    ));
}

export default ProfileInfo;
