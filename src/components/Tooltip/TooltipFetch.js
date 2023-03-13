import React, { useState } from 'react';
import { Tooltip, Typography } from '@mui/material';
import api from '../../services/api';
import { useCookies } from 'react-cookie';

export default function TooltipFetch({ endpoint, title }) {
    const [cookies, setCookie] = useCookies(['token']);
    const [data, setData] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const handleHover = () => {
        if (data) return;
        setIsFetching(true);
        api.get(endpoint, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            const info = `Nemocnica: ${res.data.hospital}\n\nOddelenie: ${res.data.department}\n\nEmail: ${res.data.email}`;
            setData(info);
            console.log(res.data);
            setIsFetching(false);
        });
    };

    return (
        <Tooltip
            title={isFetching ? 'Načítavam dáta...' : <Typography sx={{ whiteSpace: 'pre-wrap' }}>{data}</Typography>}
            placement="top"
            onMouseEnter={handleHover}
        >
            <Typography>{title}</Typography>
        </Tooltip>
    );
}
