import { useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import api from '../../services/api';
import { Box, Typography } from '@mui/material';
import MaterialReactTable from 'material-react-table';
import TextField from '@mui/material/TextField';
import { Autocomplete } from '@mui/material';
import { MRT_Localization_CS } from 'material-react-table/locales/cs';
import logError from '../../utils/errorHandler';

const Prescriptions = () => {
    const [cookies, setCookie] = useCookies(['userLogin', 'token']);

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [medications, setMedications] = useState([]);
    const [selectValue, setSelectValue] = useState();

    useEffect(() => {
        api.get(`/api/prescription/patient_medications`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setMedications(res.data);
        });
    }, []);

    useEffect(() => {
        api.post(
            `/api/prescription/patient_prescriptions`,
            {
                medication: selectValue
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
                logError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [selectValue]);

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

            <Autocomplete
                disablePortal
                id="medication_select"
                options={medications}
                sx={{ width: 300, marginBottom: 3 }}
                onChange={(e, v) => setSelectValue(v)}
                renderInput={(params) => <TextField {...params} label="Lieky" />}
            />

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
        </>
    );
};

export default Prescriptions;
