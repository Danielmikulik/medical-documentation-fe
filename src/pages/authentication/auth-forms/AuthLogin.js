// import React from 'react';
// import { Link as RouterLink } from 'react-router-dom';
//
// // material-ui
// import {
//     Button,
//     Checkbox,
//     Divider,
//     FormControlLabel,
//     FormHelperText,
//     Grid,
//     Link,
//     IconButton,
//     InputAdornment,
//     InputLabel,
//     OutlinedInput,
//     Stack,
//     Typography,
//     TextField
// } from '@mui/material';
//
// // third party
// import * as Yup from 'yup';
// import { Formik } from 'formik';
//
// // project import
// import FirebaseSocial from './FirebaseSocial';
// import AnimateButton from 'components/@extended/AnimateButton';
//
// // assets
// import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
//
// // ============================|| FIREBASE - LOGIN ||============================ //
//
// const AuthLogin = () => {
//     const [checked, setChecked] = React.useState(false);
//
//     const [showPassword, setShowPassword] = React.useState(false);
//     const handleClickShowPassword = () => {
//         setShowPassword(!showPassword);
//     };
//
//     const handleMouseDownPassword = (event) => {
//         event.preventDefault();
//     };
//
//     return (
//         <>
//             <Formik
//                 initialValues={{
//                     email: 'info@codedthemes.com',
//                     password: '123456',
//                     submit: null
//                 }}
//                 validationSchema={Yup.object().shape({
//                     email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
//                     password: Yup.string().max(255).required('Password is required')
//                 })}
//                 onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
//                     try {
//                         setStatus({ success: false });
//                         setSubmitting(false);
//                     } catch (err) {
//                         setStatus({ success: false });
//                         setErrors({ submit: err.message });
//                         setSubmitting(false);
//                     }
//                 }}
//             >
//                 {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
//                     <form noValidate onSubmit={handleSubmit}>
//                         <Grid container spacing={3}>
//                             <Grid item xs={12}>
//                                 <Stack spacing={1}>
//                                     <TextField id="outlined-basic" label="Outlined" variant="outlined" />
//                                     <InputLabel htmlFor="email-login">Email Address</InputLabel>
//                                     <TextField
//                                         id="email-login"
//                                         type="email"
//                                         value={values.email}
//                                         name="email"
//                                         onBlur={handleBlur}
//                                         onChange={handleChange}
//                                         variant="outlined"
//                                         placeholder="Enter email address"
//                                         fullWidth
//                                         error={Boolean(touched.email && errors.email)}
//                                     />
//                                     {touched.email && errors.email && (
//                                         <FormHelperText error id="standard-weight-helper-text-email-login">
//                                             {errors.email}
//                                         </FormHelperText>
//                                     )}
//                                 </Stack>
//                             </Grid>
//                             <Grid item xs={12}>
//                                 <Stack spacing={1}>
//                                     <InputLabel htmlFor="password-login">Password</InputLabel>
//                                     <TextField
//                                         fullWidth
//                                         error={Boolean(touched.password && errors.password)}
//                                         id="-password-login"
//                                         type={showPassword ? 'text' : 'password'}
//                                         value={values.password}
//                                         name="password"
//                                         onBlur={handleBlur}
//                                         onChange={handleChange}
//                                         endAdornment={
//                                             <InputAdornment position="end">
//                                                 <IconButton
//                                                     aria-label="toggle password visibility"
//                                                     onClick={handleClickShowPassword}
//                                                     onMouseDown={handleMouseDownPassword}
//                                                     edge="end"
//                                                     size="large"
//                                                 >
//                                                     {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
//                                                 </IconButton>
//                                             </InputAdornment>
//                                         }
//                                         placeholder="Enter password"
//                                     />
//                                     {touched.password && errors.password && (
//                                         <FormHelperText error id="standard-weight-helper-text-password-login">
//                                             {errors.password}
//                                         </FormHelperText>
//                                     )}
//                                 </Stack>
//                             </Grid>
//
//                             <Grid item xs={12} sx={{ mt: -1 }}>
//                                 <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
//                                     <FormControlLabel
//                                         control={
//                                             <Checkbox
//                                                 checked={checked}
//                                                 onChange={(event) => setChecked(event.target.checked)}
//                                                 name="checked"
//                                                 color="primary"
//                                                 size="small"
//                                             />
//                                         }
//                                         label={<Typography variant="h6">Keep me sign in</Typography>}
//                                     />
//                                     <Link variant="h6" component={RouterLink} to="" color="text.primary">
//                                         Forgot Password?
//                                     </Link>
//                                 </Stack>
//                             </Grid>
//                             {errors.submit && (
//                                 <Grid item xs={12}>
//                                     <FormHelperText error>{errors.submit}</FormHelperText>
//                                 </Grid>
//                             )}
//                             <Grid item xs={12}>
//                                 <AnimateButton>
//                                     <Button
//                                         disableElevation
//                                         disabled={isSubmitting}
//                                         fullWidth
//                                         size="large"
//                                         type="submit"
//                                         variant="contained"
//                                         color="primary"
//                                     >
//                                         Login
//                                     </Button>
//                                 </AnimateButton>
//                             </Grid>
//                             <Grid item xs={12}>
//                                 <Divider>
//                                     <Typography variant="caption"> Login with</Typography>
//                                 </Divider>
//                             </Grid>
//                             <Grid item xs={12}>
//                                 <FirebaseSocial />
//                             </Grid>
//                         </Grid>
//                     </form>
//                 )}
//             </Formik>
//         </>
//     );
// };
//
// export default AuthLogin;

import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../../../hooks/auth';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © Zdravotná Dokumentácia '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export default function Login() {
    const { login } = useAuth();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const userLogin = data.get('userLogin');
        const password = data.get('password');
        login({ userLogin, password });
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Prihlásenie
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="userLogin"
                            label="Prihlasovacie meno"
                            name="userLogin"
                            autoComplete="userLogin"
                            /* eslint-disable-next-line jsx-a11y/no-autofocus */
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Heslo"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Zapamätať prihlásenie" />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Prihlásiť sa
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Zabudli ste heslo?
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}
