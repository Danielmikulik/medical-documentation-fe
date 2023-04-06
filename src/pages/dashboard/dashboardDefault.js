import React, { useEffect, useState } from 'react';

// material-ui
import { Box, Button, Grid, Stack, Typography, TextField } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import DashboardCard from 'components/cards/statistics/DashboardCard';

// assets
import api from '../../services/api';
import { useCookies } from 'react-cookie';
import IntervalCountAreaChart from './IntervalCountAreaChart';
import moment from 'moment/moment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
    const [cookies, setCookie] = useCookies(['token']);

    // chart data
    const [newUserCounts, setNewUserCounts] = useState();
    const now = new Date();
    const startDay = new Date(now.getFullYear() - 1, (now.getMonth() + 1) % 12, 1);
    const startDayString = moment(startDay).format('YYYY-MM-DD');
    const endDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const endDayString = moment(endDay).format('YYYY-MM-DD');
    const [dateSince, setDateSince] = useState(startDayString);
    const [dateUntil, setDateUntil] = useState(endDayString);
    const [slot, setSlot] = useState('month');
    const [series, setSeries] = useState([{}]);

    useEffect(() => {
        loadData();
    }, [dateSince, dateUntil, slot]);

    function loadData() {
        api.get(`/api/user/created_last_year?dateSince=${dateSince}&dateUntil=${dateUntil}&interval=${slot}`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setNewUserCounts(res.data);
            setSeries([
                {
                    name: 'Počet nových používateľov',
                    data: res.data.counts
                }
            ]);
        });
    }

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            {/* row 1 */}
            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Typography variant="h5">Prehľad</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <DashboardCard
                    title="Počet pacientov"
                    optionsUrl={'/api/disease_type/all'}
                    url={'/api/patient/count'}
                    param={'diseaseType'}
                    label={'Choroba'}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <DashboardCard
                    title="Počet lekárov"
                    optionsUrl={'/api/department_type/all'}
                    url={'/api/doctor/count'}
                    param={'departmentType'}
                    label={'Oddelenie'}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <DashboardCard
                    title="Počet nemocníc"
                    optionsUrl={'/api/department_type/all'}
                    url={'/api/hospital/count'}
                    param={'departmentType'}
                    label={'Oddelenie'}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <DashboardCard
                    title="Počet lekární"
                    optionsUrl={'/api/city/names'}
                    url={'/api/pharmacy/count'}
                    param={'city'}
                    label={'Mesto'}
                />
            </Grid>

            <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

            {/* row 2 */}
            <Grid item xs={12} md={11} lg={11}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Noví používatelia</Typography>
                    </Grid>
                    <Grid item>
                        <Stack direction="row" alignItems="center" spacing={0}>
                            <DatePicker
                                label={'Od'}
                                value={dateSince}
                                onChange={(value) => setDateSince(moment(value.$d).format('YYYY-MM-DD'))}
                                renderInput={(props) => <TextField {...props} sx={{ width: 150, mr: 1 }} />}
                            />
                            <DatePicker
                                label={'Do'}
                                value={dateUntil}
                                onChange={(value) => setDateUntil(moment(value.$d).format('YYYY-MM-DD'))}
                                renderInput={(props) => <TextField {...props} sx={{ width: 150 }} />}
                            />
                        </Stack>
                    </Grid>
                    <Grid item>
                        <Stack direction="row" alignItems="center" spacing={0}>
                            <Button
                                size="small"
                                onClick={() => setSlot('month')}
                                color={slot === 'month' ? 'primary' : 'secondary'}
                                variant={slot === 'month' ? 'outlined' : 'text'}
                            >
                                Month
                            </Button>
                            <Button
                                size="small"
                                onClick={() => setSlot('week')}
                                color={slot === 'week' ? 'primary' : 'secondary'}
                                variant={slot === 'week' ? 'outlined' : 'text'}
                            >
                                Week
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
                <MainCard content={false} sx={{ mt: 1.5 }}>
                    <Box sx={{ pt: 1, pr: 2 }}>
                        {newUserCounts && <IntervalCountAreaChart slot={slot} counts={newUserCounts} series={series} />}
                    </Box>
                </MainCard>
            </Grid>
        </Grid>
    );
}
