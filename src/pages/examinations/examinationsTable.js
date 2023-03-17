import React, { useEffect, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import { MRT_Localization_CS } from 'material-react-table/locales/cs';

const ExaminationsTable = ({ columns, data }) => {
    const [rowSelection, setRowSelection] = useState({});

    useEffect(() => {
        const attachmentId = Object.keys(rowSelection)[0];
        attachmentId && window.open(`/attachments/${attachmentId}`, '_blank');
    }, [rowSelection]);

    return (
        <MaterialReactTable
            columns={columns}
            data={data}
            localization={MRT_Localization_CS}
            enableRowSelection
            enableMultiRowSelection={false}
            getRowId={(row) => row.id}
            onRowSelectionChange={setRowSelection}
            state={{ rowSelection }}
        />
    );
};

export default ExaminationsTable;
