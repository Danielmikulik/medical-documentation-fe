// material-ui
import { Box, Breadcrumbs, Divider, Grid, Link, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import api from '../../services/api';
import { useCookies } from 'react-cookie';
import { useState, useEffect } from 'react';
import ProfileInfo from './profileInfo';
import parseJwt from '../../utils/jwtUtil';

function Profile() {
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
    console.log(data);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
                <Stack spacing={3}>
                    <MainCard title="Informácie" codeHighlight>
                        <Stack spacing={0.75} sx={{ mt: -1.5 }}>
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
                            {data && <ProfileInfo data={data} />}
                        </Stack>
                    </MainCard>
                </Stack>
            </Grid>
            <Grid item xs={12} lg={6}>
                <Stack spacing={3}>
                    <MainCard title="Alignment" codeHighlight>
                        <>
                            <Typography variant="body2" gutterBottom>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
                                dolore magna aliqua. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </Typography>
                            <Typography variant="body2" textAlign="center" gutterBottom>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
                                dolore magna aliqua. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </Typography>
                            <Typography variant="body2" textAlign="right">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
                                dolore magna aliqua. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </Typography>
                        </>
                    </MainCard>
                    <MainCard title="Gutter Bottom" codeHighlight>
                        <>
                            <Typography variant="body1" gutterBottom>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
                                dolore magna aliqua.
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
                                dolore magna aliqua.
                            </Typography>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Typography variant="h6">Size: 12px</Typography>
                                <Typography variant="h6">Weight: Regular</Typography>
                                <Typography variant="h6">Line Height: 20px</Typography>
                            </Breadcrumbs>
                        </>
                    </MainCard>
                    <MainCard title="Overline" codeHighlight>
                        <Stack spacing={1.5}>
                            <Typography variant="overline">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
                                dolore magna aliqua.
                            </Typography>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Typography variant="h6">Size: 12px</Typography>
                                <Typography variant="h6">Weight: Regular</Typography>
                                <Typography variant="h6">Line Height: 20px</Typography>
                            </Breadcrumbs>
                        </Stack>
                    </MainCard>
                    <MainCard title="Link" codeHighlight>
                        <Stack spacing={1.5}>
                            <Link href="#">www.mantis.com</Link>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Typography variant="h6">Size: 12px</Typography>
                                <Typography variant="h6">Weight: Regular</Typography>
                                <Typography variant="h6">Line Height: 20px</Typography>
                            </Breadcrumbs>
                        </Stack>
                    </MainCard>
                    <MainCard title="Colors" codeHighlight>
                        <>
                            <Typography variant="h6" color="textPrimary" gutterBottom>
                                This is textPrimary text color.
                            </Typography>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                This is textSecondary text color.
                            </Typography>
                            <Typography variant="h6" color="primary" gutterBottom>
                                This is primary text color.
                            </Typography>
                            <Typography variant="h6" color="secondary" gutterBottom>
                                This is secondary text color.
                            </Typography>
                            <Typography variant="h6" color="success" gutterBottom>
                                This is success text color.
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'warning.main' }} gutterBottom>
                                This is warning text color.
                            </Typography>
                            <Typography variant="h6" color="error" gutterBottom>
                                This is error text color.
                            </Typography>
                        </>
                    </MainCard>
                    <MainCard title="Paragraph" codeHighlight>
                        <>
                            <Typography variant="body1" gutterBottom>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
                                dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                            </Typography>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Typography variant="h6">Size: 14px</Typography>
                                <Typography variant="h6">Weight: Regular</Typography>
                                <Typography variant="h6">Line Height: 22px</Typography>
                            </Breadcrumbs>
                        </>
                    </MainCard>
                    <MainCard title="Font Style" codeHighlight>
                        <>
                            <Typography variant="body1" gutterBottom sx={{ fontStyle: 'italic' }}>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
                                dolore magna aliqua.
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontStyle: 'italic' }}>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
                                dolore magna aliqua.
                            </Typography>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Typography variant="h6">Size: 14px</Typography>
                                <Typography variant="h6">Weight: Italic Regular & Italic Bold</Typography>
                                <Typography variant="h6">Line Height: 22px</Typography>
                            </Breadcrumbs>
                        </>
                    </MainCard>
                </Stack>
            </Grid>
        </Grid>
    );
}

export default Profile;
