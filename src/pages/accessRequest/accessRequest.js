import React, { useEffect, useMemo, useState } from 'react';
import CreateAccessRequest from './createAccessRequest';
import api from '../../services/api';
import { useCookies } from 'react-cookie';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MaterialReactTable from 'material-react-table';
import { MRT_Localization_CS } from 'material-react-table/locales/cs';
import logError from '../../utils/errorHandler';

export default function AccessRequest() {
    const [cookies, setCookie] = useCookies(['token']);

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get(`/api/access_request/show`, {
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

    const columns = useMemo(
        () => [
            {
                accessorKey: 'patientName',
                header: 'Meno pacienta'
            },
            {
                accessorKey: 'patientBirthNumber',
                header: 'R.Č. pacienta'
            },
            {
                accessorKey: 'department',
                header: 'Oddelenie'
            },
            {
                accessorKey: 'count',
                header: 'Počet záznamov'
            }
        ],
        []
    );

    return (
        <Box>
            <Box display="flex" py={1} pr={2} mb={2} ml={1}>
                <Typography variant="h1" fontWeight="regular" color="text">
                    Žiadosť o prístup
                </Typography>
            </Box>
            <CreateAccessRequest />
            <Box display="flex" py={1} pr={2} mb={2} mt={3} ml={1}>
                <Typography variant="h1" fontWeight="regular" color="text">
                    Moje žiadosti
                </Typography>
            </Box>
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
            {data && <MaterialReactTable columns={columns} data={data} localization={MRT_Localization_CS} />}
        </Box>
    );
}
