import React, { useEffect, useMemo, useState } from 'react';
import api from '../../../services/api';
import MaterialReactTable from 'material-react-table';
import { useCookies } from 'react-cookie';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { Box, Button, Tooltip } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import Typography from '@mui/material/Typography';
import logError from '../../../utils/errorHandler';
import { MRT_Localization_CS } from 'material-react-table/locales/cs';
import TooltipFetch from '../../../components/Tooltip/TooltipFetch';

function Prescription() {
    const [cookies, setCookie] = useCookies(['token']);

    const { enqueueSnackbar } = useSnackbar();

    //data and fetching state
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);

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
    }, [pagination, columnFilters]);

    function loadData() {
        if (!data.length) {
            setIsLoading(true);
        } else {
            setIsRefetching(true);
        }
        api.get(`/api/prescription/non_retrieved?pageIndex=${pagination.pageIndex}&pageSize=${pagination.pageSize}`, {
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
    }

    function handleConfirm() {
        const ids = Object.keys(rowSelection).map(Number);
        if (confirm('Naozaj chcete vybrať zvolené recepty?')) {
            sendRequest(ids);
        }
    }

    const sendRequest = async (ids) => {
        enqueueSnackbar('Recepty na vydanie sa spracovávajú.', { variant: 'info' });
        await api
            .post(
                `/api/prescription/confirm`,
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
                    enqueueSnackbar('Žiaden recept nebol vydaný.', { variant: 'info' });
                } else {
                    const message =
                        successCount === 1
                            ? '1 recept bol úspešne vydaný'
                            : successCount > 1 && successCount < 5
                            ? `${successCount} recepty boli úspešne vydané`
                            : `${successCount} receptov bolo úspešne vydaných.`;
                    enqueueSnackbar(message, { variant: 'success' });
                }
                loadData();
                setRowSelection({});
            })
            .catch(function (error) {
                enqueueSnackbar('Nepodarilo sa vydať recept.', { variant: 'error' });
                logError(error);
            });
    };

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
                accessorKey: 'patient',
                header: 'Pacient'
            },
            {
                accessorKey: 'doctor',
                header: 'Lekár'
            },
            {
                accessorKey: 'prescribedAt',
                header: 'Dátum vystavenia'
            }
        ],
        []
    );

    return (
        <Box>
            <Box display="flex" py={1} pr={2} mb={2} ml={1}>
                <Typography variant="h1" fontWeight="regular" color="text">
                    Recepty na vydanie
                </Typography>
            </Box>
            <Tooltip title="Vyberte recepty pre vybranie">
                <span>
                    <Button
                        variant="contained"
                        color={'success'}
                        onClick={handleConfirm}
                        disabled={!Object.keys(rowSelection).length}
                        endIcon={<DoneIcon />}
                        sx={{ mb: 3, mr: 2 }}
                    >
                        Vydať
                    </Button>
                </span>
            </Tooltip>
            <MaterialReactTable
                columns={columns}
                data={data}
                localization={MRT_Localization_CS}
                enableRowSelection
                getRowId={(row) => row.prescriptionId}
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

export default function PrescriptionConfirm() {
    return (
        <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
            <Prescription />
        </SnackbarProvider>
    );
}
