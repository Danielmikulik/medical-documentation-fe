// material-ui
import { Box, Stack, Typography } from '@mui/material';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import parseJwt from '../../utils/jwtUtil';
import api from '../../services/api';
import logError from '../../utils/errorHandler';

export default function KeyValueCard({ url, patientBirthNumber }) {
    const labels = [];
    const values = [];

    const [cookies, setCookie] = useCookies(['userLogin', 'token']);

    const [data, setData] = useState({});
    const [dataArray, setDataArray] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const request = patientBirthNumber
        ? api.post(
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
        : api.get(url, {
              headers: {
                  Authorization: `Bearer ${cookies.token}`
              }
          });

    useEffect(() => {
        request
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setDataArray(res.data);
                } else {
                    setData(res.data);
                }
                setError(null);
            })
            .catch(function (error) {
                setError(error.message);
                logError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (data) {
        Object.keys(data).forEach((el) => labels.push(el));
        Object.values(data).forEach((el) => values.push(el));
    }

    const renderObjectItems = labels.map((label, key) => (
        <Box key={label} display="flex" py={1} pr={2}>
            <Typography variant="body1" fontWeight="bold">
                {label}: &nbsp;
            </Typography>
            {!Array.isArray(values[key]) && renderSingleValue(values[key])}
            {Array.isArray(values[key]) && <Stack spacing={0.75}>{renderArray(values[key])}</Stack>}
        </Box>
    ));

    const renderArrayItems = dataArray.map((row) => (
        <Box key={row} display="flex" py={1} pr={2}>
            <Typography variant="body1" fontWeight="regular">
                {row}
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
            {data && renderObjectItems}
            {dataArray && renderArrayItems}
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
