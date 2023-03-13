// material-ui
import { Box, Breadcrumbs, Divider, Grid, Link, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useCookies } from 'react-cookie';
import Attachment from './attachment';
import logError from '../../utils/errorHandler';

// ==============================|| COMPONENTS - TYPOGRAPHY ||============================== //

export default function Attachments() {
    const { examId } = useParams();

    const [cookies, setCookie] = useCookies(['userLogin', 'token']);

    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get(`/api/attachment/${examId}`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        })
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
    console.log(data);

    const renderItems = data ? data.map((row, index) => <Attachment key={index} file={row.file} report={row.report} />) : [];

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
                <Stack spacing={3}>
                    <MainCard title="Správa z vyšetrenia">
                        <Stack spacing={3} sx={{ mt: -1.5 }}>
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
                        </Stack>
                    </MainCard>
                </Stack>
            </Grid>
        </Grid>
    );
}
