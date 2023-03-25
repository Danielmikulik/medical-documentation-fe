import { useEffect, useState } from 'react';

// material-ui
import { Box, Grid, Typography } from '@mui/material';

// project import
import ExamCountAreaChart from './ExamCountAreaChart';
import MonthlyBarChart from './MonthlyBarChart';
import MainCard from 'components/MainCard';
import DashboardCard from 'components/cards/statistics/DashboardCard';

// assets
import api from '../../services/api';
import { useCookies } from 'react-cookie';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardPatient() {
    const [cookies, setCookie] = useCookies(['userLogin', 'token']);

    const [value, setValue] = useState('today');
    const [slot, setSlot] = useState('week');
    const [doctorCount, setDoctorCount] = useState('0');
    const [totalExamCount, setTotalExamCount] = useState('0');
    const [totalPrescriptionCount, setTotalPrescriptionCount] = useState('0');
    const [totalPrescriptionCountRetrieved, setPrescriptionsCountToRetrieve] = useState('0');
    const [examCounts, setExamCounts] = useState();
    const [prescriptionCounts, setPrescriptionCounts] = useState();

    useEffect(() => {
        api.get(`/api/patient/doctor_count`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setDoctorCount(res.data.toString());
        });
    }, []);

    useEffect(() => {
        api.get(`/api/med_exams/patient_stats`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setExamCounts(res.data);
        });
    }, []);

    useEffect(() => {
        api.get(`/api/prescription/patient_stats`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setPrescriptionCounts(res.data);
        });
    }, []);

    useEffect(() => {
        api.get(`/api/med_exams/patient_total_exam_count`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setTotalExamCount(res.data.toString());
        });
    }, []);

    useEffect(() => {
        api.get(`/api/prescription/patient_total_count`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setTotalPrescriptionCount(res.data.toString());
        });
    }, []);

    useEffect(() => {
        api.get(`/api/prescription/patient_to_retrieve`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setPrescriptionsCountToRetrieve(res.data.toString());
        });
    }, []);

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            {/* row 1 */}
            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Typography variant="h5">Prehľad</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <DashboardCard title="Počet navštívených lekárov" count={doctorCount} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <DashboardCard title="Celkový počet absolvovaných vyšetrení" count={totalExamCount} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <DashboardCard title="Celkový počet predpísaných receptov" count={totalPrescriptionCount} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <DashboardCard title="Počet receptov na vybratie" count={totalPrescriptionCountRetrieved} />
            </Grid>

            <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

            {/* row 2 */}
            <Grid item xs={12} md={7} lg={7}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Absolvované vyšetrenia</Typography>
                    </Grid>
                </Grid>
                <MainCard content={false} sx={{ mt: 1.5 }}>
                    <Box sx={{ pt: 1, pr: 2 }}>{examCounts && <ExamCountAreaChart slot={slot} examCounts={examCounts} />}</Box>
                </MainCard>
            </Grid>
            <Grid item xs={12} md={5} lg={5}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Predpísané recepty</Typography>
                    </Grid>
                    <Grid item />
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <Box sx={{ pt: 1, pr: 2 }}>{prescriptionCounts && <MonthlyBarChart prescriptionCounts={prescriptionCounts} />}</Box>
                </MainCard>
            </Grid>
        </Grid>
    );
}
