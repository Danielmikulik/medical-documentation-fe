import React, { useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import api from '../../services/api';
import { Box, Typography } from '@mui/material';
import MaterialReactTable from 'material-react-table';
import TextField from '@mui/material/TextField';
import { Autocomplete } from '@mui/material';
import { MRT_Localization_CS } from 'material-react-table/locales/cs';
import logError from '../../utils/errorHandler';
import TooltipFetch from '../../components/Tooltip/TooltipFetch';

const Prescriptions = () => {
    const [cookies, setCookie] = useCookies(['userLogin', 'token']);

    //data and fetching state
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);

    //table state
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5
    });
    const [totalRowCount, setTotalRowCount] = useState(0);
    const [totalPageCount, setTotalPageCount] = useState(0);

    const [medications, setMedications] = useState([]);
    const [selectValue, setSelectValue] = useState('');

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
        loadData();
    }, [pagination, selectValue]);

    function loadData() {
        if (!data.length) {
            setIsLoading(true);
        } else {
            setIsRefetching(true);
        }
        api.get(
            `/api/prescription/patient_prescriptions?pageIndex=${pagination.pageIndex}&pageSize=${pagination.pageSize}&medication=${selectValue}`,
            {
                headers: {
                    Authorization: `Bearer ${cookies.token}`
                }
            }
        )
            .then((res) => {
                const processedData = res.data.content.map((row) => {
                    let temp = Object.assign({}, row);
                    if (temp.retrievedAt === '01.01.0001 00:00') {
                        temp.retrievedAt = 'Nevybraný';
                    }
                    temp.doctor = <TooltipFetch endpoint={`/api/doctor/${temp.doctorId}`} title={temp.doctor} />;
                    return temp;
                });
                setData(processedData);
                setTotalRowCount(res.data.totalRows);
                setTotalPageCount(res.data.totalPages);
            })
            .catch(function (error) {
                setIsError(true);
                setIsLoading(false);
                setIsRefetching(false);
                logError(error);
            })
            .finally(() => {
                setIsLoading(false);
                setIsRefetching(false);
            });
    }

    function handleOnChange(event, value) {
        const newValue = value ? value : '';
        setSelectValue(newValue);
    }

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
                header: 'Lekár'
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
                onChange={handleOnChange}
                renderInput={(params) => <TextField {...params} label="Liek" />}
            />
            <MaterialReactTable
                columns={columns}
                data={data}
                localization={MRT_Localization_CS}
                rowCount={totalRowCount}
                pageCount={totalPageCount}
                manualPagination
                manualFiltering
                muiToolbarAlertBannerProps={
                    isError
                        ? {
                              color: 'error',
                              children: 'Nepodarilo sa načítať dáta'
                          }
                        : undefined
                }
                onPaginationChange={setPagination}
                state={{
                    pagination,
                    showAlertBanner: isError,
                    showProgressBars: isRefetching,
                    isLoading
                }}
            />
        </>
    );
};

export default Prescriptions;
