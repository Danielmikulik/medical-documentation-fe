import { useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import api from '../../services/api';
import { Box, Typography } from '@mui/material';
import MaterialReactTable from 'material-react-table';

const Prescriptions = () => {
    const [cookies, setCookie] = useCookies(['userLogin', 'token']);

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.post(
            `/api/prescription/patient_prescriptions`,
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
                const processedData = res.data.map((row) => {
                    let temp = Object.assign({}, row);
                    if (temp.retrievedAt === '01.01.0001 00:00') {
                        temp.retrievedAt = 'Nevybraný';
                    }
                    return temp;
                });
                setData(processedData);
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

    const columns = useMemo(
        () => [
            {
                accessorKey: 'medicationName',
                header: 'Názov'
            },
            {
                accessorKey: 'medicationAmount',
                header: 'Veľkosť balenia'
            },
            {
                accessorKey: 'packageCount',
                header: 'Počet balení'
            },
            {
                accessorKey: 'doctor',
                header: 'Doktor'
            },
            {
                accessorKey: 'prescribedAt',
                header: 'Dátum vystavenia'
            },
            {
                accessorKey: 'retrievedAt',
                header: 'Dátum vybratia'
            }
        ],
        []
    );

    return (
        <>
            <Box display="flex" py={1} pr={2} mb={2} ml={1}>
                <Typography variant="h1" fontWeight="regular" color="text">
                    Moje Recepty
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
            {data && <MaterialReactTable columns={columns} data={data} />}
        </>
    );
};

export default Prescriptions;
