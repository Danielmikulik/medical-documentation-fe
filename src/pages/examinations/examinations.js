import React, { useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import api from '../../services/api';
import { Autocomplete, Box, Typography } from '@mui/material';
import logError from '../../utils/errorHandler';
import TooltipFetch from '../../components/Tooltip/TooltipFetch';
import TextField from '@mui/material/TextField';
import { MRT_Localization_CS } from 'material-react-table/locales/cs';
import MaterialReactTable from 'material-react-table';

const Examinations = ({ userRole }) => {
    const [cookies, setCookie] = useCookies(['userLogin', 'token']);

    //fetching state
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);

    //data
    const [data, setData] = useState([]);
    const [totalRowCount, setTotalRowCount] = useState(0);
    const [totalPageCount, setTotalPageCount] = useState(0);
    const [patients, setPatients] = useState([]);
    const [selectValue, setSelectValue] = useState();

    //table state
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5
    });

    useEffect(() => {
        api.get(`/api/med_exams/doctors_patients`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        }).then((res) => {
            setPatients(res.data);
        });
    }, []);

    useEffect(() => {
        const appendix = selectValue ? `&birthNumber=${selectValue.split(' ')[0]}` : '';
        api.get(`/api/med_exams/${userRole}?pageIndex=${pagination.pageIndex}&pageSize=${pagination.pageSize}${appendix}`, {
            headers: {
                Authorization: `Bearer ${cookies.token}`
            }
        })
            .then((res) => {
                const processedData = res.data.content.map((row) => {
                    let temp = Object.assign({}, row);
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
    }, [selectValue, pagination]);

    useEffect(() => {
        const attachmentId = Object.keys(rowSelection)[0];
        attachmentId && window.open(`/attachments/${attachmentId}`, '_blank');
    }, [rowSelection]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'type',
                header: 'Typ'
            },
            {
                accessorKey: 'disease',
                header: 'Choroba'
            },
            {
                accessorKey: 'doctor',
                header: 'Doktor'
            }
        ],
        []
    );

    if (userRole === 'doctor') {
        columns.push({
            accessorKey: 'patient',
            header: 'Pacient'
        });
    }
    columns.push(
        {
            accessorKey: 'startTime',
            header: 'Začiatok'
        },
        {
            accessorKey: 'endTime',
            header: 'Koniec'
        }
    );

    return (
        <>
            <Box display="flex" py={1} pr={2} mb={2} ml={1}>
                <Typography variant="h1" fontWeight="regular" color="text">
                    {userRole === 'patient' ? 'Moje vyšetrenia' : 'Vyšetrenia'}
                </Typography>
            </Box>
            {userRole === 'doctor' && (
                <Autocomplete
                    disablePortal
                    id="patient_select"
                    options={patients}
                    sx={{ width: 300, marginBottom: 3 }}
                    onChange={(e, v) => setSelectValue(v)}
                    renderInput={(params) => <TextField {...params} label="Pacient" />}
                />
            )}
            <MaterialReactTable
                columns={columns}
                data={data}
                localization={MRT_Localization_CS}
                enableRowSelection
                enableMultiRowSelection={false}
                getRowId={(row) => row.id}
                onRowSelectionChange={setRowSelection}
                rowCount={totalRowCount}
                pageCount={totalPageCount}
                manualPagination
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
                    isLoading,
                    rowSelection
                }}
            />
        </>
    );
};

export default Examinations;
