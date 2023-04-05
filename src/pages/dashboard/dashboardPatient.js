import React, { useEffect, useState } from 'react';

// material-ui
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

// project import
import IntervalCountAreaChart from './IntervalCountAreaChart';
import IntervalCountBarChart from './IntervalCountBarChart';
import MainCard from 'components/MainCard';
import DashboardCard from 'components/cards/statistics/DashboardCard';

// assets
import api from '../../services/api';
import { useCookies } from 'react-cookie';
import moment from 'moment/moment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardPatient() {
    const [cookies, setCookie] = useCookies(['userLogin', 'token']);

    // chart data
    const [examCounts, setExamCounts] = useState();
    const [prescriptionCounts, setPrescriptionCounts] = useState();
    const now = new Date();
    const startDay = new Date(now.getFullYear() - 1, (now.getMonth() + 1) % 12, 1);
    const startDayString = moment(startDay).format('YYYY-MM-DD');
    const endDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const endDayString = moment(endDay).format('YYYY-MM-DD');
    const [dateSinceExams, setDateSinceExams] = useState(startDayString);
    const [dateUntilExams, setDateUntilExams] = useState(endDayString);
    const [slotExams, setSlotExams] = useState('month');
    const [seriesExams, setSeriesExams] = useState([{}]);
    const [dateSincePrescriptions, setDateSincePrescriptions] = useState(startDayString);
    const [dateUntilPrescriptions, setDateUntilPrescriptions] = useState(endDayString);
    const [slotPrescriptions, setSlotPrescriptions] = useState('month');
    const [seriesPrescriptions, setSeriesPrescriptions] = useState([{}]);

    useEffect(() => {
        loadExamsData();
    }, [dateSinceExams, dateUntilExams, slotExams]);

    useEffect(() => {
        loadPrescriptionsData();
    }, [dateSincePrescriptions, dateUntilPrescriptions, slotPrescriptions]);

    function loadExamsData() {
        api.get(`/api/med_exams/patient_stats?dateSince=${dateSinceExams}&dateUntil=${dateUntilExams}&interval=${slotExams}`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setExamCounts(res.data);
            setSeriesExams([
                {
                    name: 'Počet absolvovaných vyšetrení',
                    data: res.data.counts
                }
            ]);
        });
    }

    function loadPrescriptionsData() {
        api.get(
            `/api/prescription/patient_stats?dateSince=${dateSincePrescriptions}&dateUntil=${dateUntilPrescriptions}&interval=${slotPrescriptions}`,
            {
                headers: {
                    Authorization: `Bearer ${cookies.token}`
                }
            }
        ).then((res) => {
            setPrescriptionCounts(res.data);
            setSeriesPrescriptions([
                {
                    name: 'Počet predpísaných receptov',
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
                    title="Počet navštívených lekárov"
                    optionsUrl={'/api/department_type/all'}
                    url={'/api/patient/doctor_count'}
                    param={'departmentType'}
                    label={'Oddelenie'}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <DashboardCard
                    title="Celkový počet absolvovaných vyšetrení"
                    optionsUrl={'/api/department_type/all'}
                    url={'/api/med_exams/patient_total_exam_count'}
                    param={'departmentType'}
                    label={'Oddelenie'}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <DashboardCard
                    title="Celkový počet predpísaných receptov"
                    optionsUrl={'/api/prescription/patient_medications_full'}
                    url={'/api/prescription/patient_total_count'}
                    param={'medication'}
                    label={'Liek'}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <DashboardCard
                    title="Počet receptov na vybratie"
                    optionsUrl={'/api/prescription/patient_medications_full'}
                    url={'/api/prescription/patient_to_retrieve'}
                    param={'medication'}
                    label={'Liek'}
                />
            </Grid>

            <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

            {/* row 2 */}
            <Grid item xs={12} md={7} lg={7}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Absolvované vyšetrenia</Typography>
                    </Grid>
                    <Grid item>
                        <Stack direction="row" alignItems="center" spacing={0}>
                            <DatePicker
                                label={'Od'}
                                value={dateSinceExams}
                                onChange={(value) => setDateSinceExams(moment(value.$d).format('YYYY-MM-DD'))}
                                renderInput={(props) => <TextField {...props} sx={{ width: 150, mr: 1 }} />}
                            />
                            <DatePicker
                                label={'Do'}
                                value={dateUntilExams}
                                onChange={(value) => setDateUntilExams(moment(value.$d).format('YYYY-MM-DD'))}
                                renderInput={(props) => <TextField {...props} sx={{ width: 150 }} />}
                            />
                        </Stack>
                    </Grid>
                    <Grid item>
                        <Stack direction="column" alignItems="center" spacing={0}>
                            <Button
                                size="small"
                                onClick={() => setSlotExams('month')}
                                color={slotExams === 'month' ? 'primary' : 'secondary'}
                                variant={slotExams === 'month' ? 'outlined' : 'text'}
                            >
                                Mesiac
                            </Button>
                            <Button
                                size="small"
                                onClick={() => setSlotExams('week')}
                                color={slotExams === 'week' ? 'primary' : 'secondary'}
                                variant={slotExams === 'week' ? 'outlined' : 'text'}
                            >
                                Týždeň
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
                <MainCard content={false} sx={{ mt: 1.5 }}>
                    <Box sx={{ pt: 1, pr: 2 }}>
                        {examCounts && <IntervalCountAreaChart slot={slotExams} counts={examCounts} series={seriesExams} />}
                    </Box>
                </MainCard>
            </Grid>
            <Grid item xs={12} md={5} lg={5}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Predpísané recepty</Typography>
                    </Grid>
                    <Grid item>
                        <Stack direction="row" alignItems="center" spacing={0}>
                            <DatePicker
                                label={'Od'}
                                value={dateSincePrescriptions}
                                onChange={(value) => setDateSincePrescriptions(moment(value.$d).format('YYYY-MM-DD'))}
                                renderInput={(props) => <TextField {...props} sx={{ width: 150, mr: 1 }} />}
                            />
                            <DatePicker
                                label={'Do'}
                                value={dateUntilPrescriptions}
                                onChange={(value) => setDateUntilPrescriptions(moment(value.$d).format('YYYY-MM-DD'))}
                                renderInput={(props) => <TextField {...props} sx={{ width: 150 }} />}
                            />
                        </Stack>
                    </Grid>
                    <Grid item>
                        <Stack direction="column" alignItems="center" spacing={0}>
                            <Button
                                size="small"
                                onClick={() => setSlotPrescriptions('month')}
                                color={slotPrescriptions === 'month' ? 'primary' : 'secondary'}
                                variant={slotPrescriptions === 'month' ? 'outlined' : 'text'}
                            >
                                Mesiac
                            </Button>
                            <Button
                                size="small"
                                onClick={() => setSlotPrescriptions('week')}
                                color={slotPrescriptions === 'week' ? 'primary' : 'secondary'}
                                variant={slotPrescriptions === 'week' ? 'outlined' : 'text'}
                            >
                                Týždeň
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <Box sx={{ pt: 1, pr: 2 }}>
                        {prescriptionCounts && (
                            <IntervalCountBarChart
                                slot={slotPrescriptions}
                                prescriptionCounts={prescriptionCounts}
                                series={seriesPrescriptions}
                            />
                        )}
                    </Box>
                </MainCard>
            </Grid>
        </Grid>
    );
}
