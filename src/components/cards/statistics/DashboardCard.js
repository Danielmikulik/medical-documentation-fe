import PropTypes from 'prop-types';

// material-ui
import { Autocomplete, Box, Chip, Grid, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// assets
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import api from '../../../services/api';

// ==============================|| STATISTICS - ECOMMERCE CARD  ||============================== //

export default function DashboardCard({ color, title, percentage, isLoss, extra, optionsUrl, url, param, label }) {
    const [cookies, setCookie] = useCookies(['token']);
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState('');
    const [count, setCount] = useState('');

    useEffect(() => {
        api.get(optionsUrl, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setOptions(res.data);
        });
    }, []);

    useEffect(() => {
        api.get(`${url}?${param}=${selected}`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setCount(res.data);
        });
    }, [selected]);

    function handleOnChange(event, value) {
        const newValue = value ? value : '';
        setSelected(newValue);
    }

    return (
        <MainCard contentSX={{ p: 2.25 }}>
            <Stack spacing={0.5}>
                <Typography variant="h6" color="textSecondary">
                    {title}
                </Typography>
                <Grid container alignItems="center">
                    <Grid item>
                        <Typography variant="h4" color="inherit">
                            {count}
                        </Typography>
                    </Grid>
                    <Autocomplete
                        disablePortal
                        options={options}
                        sx={{ mb: 1, mt: 1 }}
                        fullWidth
                        onChange={handleOnChange}
                        renderInput={(params) => <TextField {...params} label={label} />}
                    />
                    {percentage && (
                        <Grid item>
                            <Chip
                                variant="combined"
                                color={color}
                                icon={
                                    <>
                                        {!isLoss && <RiseOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />}
                                        {isLoss && <FallOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />}
                                    </>
                                }
                                label={`${percentage}%`}
                                sx={{ ml: 1.25, pl: 1 }}
                                size="small"
                            />
                        </Grid>
                    )}
                </Grid>
            </Stack>
            <Box sx={{ pt: 2.25 }}>
                {extra && (
                    <Typography variant="caption" color="textSecondary">
                        You made an extra{' '}
                        <Typography component="span" variant="caption" sx={{ color: `${color || 'primary'}.main` }}>
                            {extra}
                        </Typography>{' '}
                        this year
                    </Typography>
                )}
            </Box>
        </MainCard>
    );
}

DashboardCard.propTypes = {
    color: PropTypes.string,
    title: PropTypes.string,
    count: PropTypes.string,
    percentage: PropTypes.number,
    isLoss: PropTypes.bool,
    extra: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
};

DashboardCard.defaultProps = {
    color: 'primary'
};
