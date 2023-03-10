import React, { useEffect, useMemo, useState } from 'react';
import api from '../../../services/api';
import MaterialReactTable from 'material-react-table';
import { useCookies } from 'react-cookie';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { Box, Button } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import Typography from '@mui/material/Typography';
import logError from '../../../utils/errorHandler';
import { MRT_Localization_CS } from 'material-react-table/locales/cs';

function Access() {
    const [cookies, setCookie] = useCookies(['token']);

    const { enqueueSnackbar } = useSnackbar();

    //data and fetching state
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [totalRowCount, setTotalRowCount] = useState(0);

    //table state
    const [rowSelection, setRowSelection] = useState({});
    const [columnFilters, setColumnFilters] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5
    });

    useEffect(() => {
        if (!data.length) {
            setIsLoading(true);
        } else {
            setIsRefetching(true);
        }
        api.get(
            `/api/access_request/show_confirm?pageIndex=${pagination.pageIndex}&pageSize=${pagination.pageSize}${
                columnFilters ? '&' : ''
            }${columnFilters.map((filter) => `${filter.id}=${filter.value}`).join('&')}`,
            {
                headers: {
                    Authorization: `Bearer ${cookies.token}`
                }
            }
        )
            .then((res) => {
                setData(res.data.content);
                console.log(JSON.stringify(columnFilters ?? []));
                setTotalRowCount(res.data.totalRows);
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
    }, [pagination, columnFilters]);

    function handleConfirm() {
        const ids = Object.keys(rowSelection).map(Number);
        sendRequest(ids);
    }

    const sendRequest = async (ids) => {
        enqueueSnackbar('??iadosti na schv??lenie sa spracov??vaj??.', { variant: 'info' });
        await api
            .post(
                '/api/access_request/confirm',
                {
                    ids
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`
                    }
                }
            )
            .then((res) => {
                const successCount = Number(res.data);
                const message =
                    successCount === 1
                        ? '1 ??iados?? bola ??spe??ne schv??len??'
                        : successCount > 1 && successCount < 5
                        ? `${successCount} ??iadosti boli ??spe??ne schv??len??`
                        : `${successCount} ??iadost?? bolo ??spe??ne schv??len??ch.`;
                enqueueSnackbar(message, { variant: 'success' });
            })
            .catch(function (error) {
                enqueueSnackbar('Nepodarilo sa schv??li?? ??iados??.', { variant: 'error' });
                logError(error);
            });
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'patientName',
                header: 'Meno pacienta'
            },
            {
                accessorKey: 'patientBirthNumber',
                header: 'R.??. pacienta'
            },
            {
                accessorKey: 'requestDoctor',
                header: 'Doktor - ??iados??'
            },
            {
                accessorKey: 'examDoctor',
                header: 'Doktor - vy??etrenie'
            },
            {
                accessorKey: 'department',
                header: 'Oddelenie'
            },
            {
                accessorKey: 'startTime',
                header: '??as vy??etrenia'
            },
            {
                accessorKey: 'accessibleUntil',
                header: 'Spr??stupni?? do'
            }
        ],
        []
    );

    return (
        <Box>
            <Box display="flex" py={1} pr={2} mb={2} ml={1}>
                <Typography variant="h1" fontWeight="regular" color="text">
                    Zoznam ??iadost?? o pr??stup
                </Typography>
            </Box>
            <Button
                variant="contained"
                onClick={handleConfirm}
                disabled={!Object.keys(rowSelection).length}
                endIcon={<DoneIcon />}
                sx={{ mb: 3 }}
            >
                Potvrdi??
            </Button>
            <MaterialReactTable
                columns={columns}
                data={data}
                localization={MRT_Localization_CS}
                enableRowSelection
                getRowId={(row) => row.id}
                onRowSelectionChange={setRowSelection}
                rowCount={totalRowCount}
                manualPagination
                manualFiltering
                muiToolbarAlertBannerProps={
                    isError
                        ? {
                              color: 'error',
                              children: 'Nepodarilo sa na????ta?? d??ta'
                          }
                        : undefined
                }
                onColumnFiltersChange={setColumnFilters}
                onPaginationChange={setPagination}
                state={{
                    columnFilters,
                    pagination,
                    showAlertBanner: isError,
                    showProgressBars: isRefetching,
                    isLoading,
                    rowSelection
                }}
            />
        </Box>
    );
}

export default function AccessRequestConfirm() {
    return (
        <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
            <Access />
        </SnackbarProvider>
    );
}
