// material-ui
import { Grid, Stack } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import ProfileInfo from './profileInfo';
import DateRangeKeyValueCard from './dateRangeKeyValueCard';
import { useCookies } from 'react-cookie';
import parseJwt from '../../utils/jwtUtil';

function Profile() {
    const [cookies, setCookie] = useCookies(['userLogin', 'token']);

    const role = parseJwt(cookies.token)?.Authorities[0].authority.toLowerCase();

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
                <Stack spacing={3}>
                    <MainCard title="Informácie">
                        <Stack spacing={0.75} sx={{ mt: -1.5 }}>
                            <ProfileInfo />
                        </Stack>
                    </MainCard>
                </Stack>
            </Grid>
            <Grid item xs={12} lg={6}>
                <Stack spacing={3}>
                    {role === 'patient' && (
                        <MainCard title="Choroby">
                            <Stack spacing={0.75} sx={{ mt: -1.5 }}>
                                <DateRangeKeyValueCard keys={['disease', 'diagnosed', 'cured']} url={'/api/disease'} />
                            </Stack>
                        </MainCard>
                    )}
                    {role === 'patient' && (
                        <MainCard title="História zdravotných poisťovní">
                            <Stack spacing={0.75} sx={{ mt: -1.5 }}>
                                <DateRangeKeyValueCard keys={['insurance', 'since', 'till']} url={'/api/patient_insurance_history'} />
                            </Stack>
                        </MainCard>
                    )}
                </Stack>
            </Grid>
        </Grid>
    );
}

export default Profile;
