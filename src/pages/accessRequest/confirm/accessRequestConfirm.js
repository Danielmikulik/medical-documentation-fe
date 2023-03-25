import React, { useEffect, useMemo, useState } from 'react';
import api from '../../../services/api';
import MaterialReactTable from 'material-react-table';
import { useCookies } from 'react-cookie';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { Box, Button, FormControlLabel, Switch, Tooltip } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import BlockIcon from '@mui/icons-material/Block';
import Typography from '@mui/material/Typography';
import logError from '../../../utils/errorHandler';
import { MRT_Localization_CS } from 'material-react-table/locales/cs';
import TooltipFetch from '../../../components/Tooltip/TooltipFetch';

function Access() {
    const [cookies, setCookie] = useCookies(['token']);

    const { enqueueSnackbar } = useSnackbar();

    //data and fetching state
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);

    const [showRejected, setShowRejected] = React.useState(false);

    //table state
    const [rowSelection, setRowSelection] = useState({});
    const [columnFilters, setColumnFilters] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5
    });
    const [totalRowCount, setTotalRowCount] = useState(0);
    const [totalPageCount, setTotalPageCount] = useState(0);

    useEffect(() => {
        loadData();
    }, [pagination, columnFilters, showRejected]);

    function loadData() {
        if (!data.length) {
            setIsLoading(true);
        } else {
            setIsRefetching(true);
        }
        api.get(
            `/api/access_request/show_confirm?pageIndex=${pagination.pageIndex}&pageSize=${
                pagination.pageSize
            }&showRejected=${showRejected}${columnFilters ? '&' : ''}${columnFilters
                .map((filter) => `${filter.id}=${filter.value}`)
                .join('&')}`,
            {
                headers: {
                    Authorization: `Bearer ${cookies.token}`
                }
            }
        )
            .then((res) => {
                const processedData = res.data.content.map((row) => {
                    let temp = Object.assign({}, row);
                    temp.requestDoctor = <TooltipFetch endpoint={`/api/doctor/${temp.requestDoctorId}`} title={temp.requestDoctor} />;
                    temp.examDoctor = <TooltipFetch endpoint={`/api/doctor/${temp.examDoctorId}`} title={temp.examDoctor} />;
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

    function handleConfirm() {
        const ids = Object.keys(rowSelection).map(Number);
        if (confirm('Naozaj chcete potvrdiť vybrané žiadosti?')) {
            sendRequest(ids, 'confirm');
        }
    }

    function handleReject() {
        const ids = Object.keys(rowSelection).map(Number);
        if (confirm('Naozaj chcete zamietnuť vybrané žiadosti?')) {
            sendRequest(ids, 'reject');
        }
    }

    const sendRequest = async (ids, action) => {
        enqueueSnackbar('Žiadosti na schválenie sa spracovávajú.', { variant: 'info' });
        await api
            .post(
                `/api/access_request/${action}`,
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
                if (successCount === 0) {
                    enqueueSnackbar('Žiadna žiadosť nebola spracovaná.', { variant: 'info' });
                } else {
                    const message =
                        successCount === 1
                            ? '1 žiadosť bola úspešne spracovaná'
                            : successCount > 1 && successCount < 5
                            ? `${successCount} žiadosti boli úspešne spracované`
                            : `${successCount} žiadostí bolo úspešne spracovaných.`;
                    enqueueSnackbar(message, { variant: 'success' });
                }
                loadData();
                setRowSelection({});
            })
            .catch(function (error) {
                enqueueSnackbar('Nepodarilo sa spracovať žiadosť.', { variant: 'error' });
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
                header: 'R.Č. pacienta'
            },
            {
                accessorKey: 'requestDoctor',
                header: 'Doktor - žiadosť'
            },
            {
                accessorKey: 'examDoctor',
                header: 'Doktor - vyšetrenie'
            },
            {
                accessorKey: 'department',
                header: 'Oddelenie'
            },
            {
                accessorKey: 'startTime',
                header: 'Čas vyšetrenia'
            },
            {
                accessorKey: 'accessibleUntil',
                header: 'Sprístupniť do'
            },
            {
                accessorKey: 'state',
                header: 'stav'
            }
        ],
        []
    );

    return (
        <Box>
            <Box display="flex" py={1} pr={2} mb={2} ml={1}>
                <Typography variant="h1" fontWeight="regular" color="text">
                    Zoznam žiadostí o prístup
                </Typography>
            </Box>
            <Tooltip title="Vyberte žiadosti pre potvrdenie">
                <span>
                    <Button
                        variant="contained"
                        color={'success'}
                        onClick={handleConfirm}
                        disabled={!Object.keys(rowSelection).length}
                        endIcon={<DoneIcon />}
                        sx={{ mb: 3, mr: 2 }}
                    >
                        Potvrdiť
                    </Button>
                    <Button
                        variant="contained"
                        color={'error'}
                        onClick={handleReject}
                        disabled={!Object.keys(rowSelection).length}
                        endIcon={<BlockIcon />}
                        sx={{ mb: 3, mr: 2 }}
                    >
                        Zamietnuť
                    </Button>
                </span>
            </Tooltip>
            <FormControlLabel
                control={<Switch checked={showRejected} onChange={(e, v) => setShowRejected(v)} />}
                label="Zobraziť zamietnuté"
                sx={{ mb: 3, mr: 2 }}
            />
            <MaterialReactTable
                columns={columns}
                data={data}
                localization={MRT_Localization_CS}
                enableRowSelection
                getRowId={(row) => row.id}
                onRowSelectionChange={setRowSelection}
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
