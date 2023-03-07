import React, { useEffect, useState } from 'react';
import MaterialReactTable from 'material-react-table';

const ExaminationsTable = ({ columns, data }) => {
    const [rowSelection, setRowSelection] = useState({});

    useEffect(() => {
        const attachmentId = Object.keys(rowSelection)[0];
        console.log(attachmentId);
        attachmentId && window.open(`/attachments/${attachmentId}`, '_blank');
    }, [rowSelection]);

    return (
        <MaterialReactTable
            columns={columns}
            data={data}
            enableRowSelection
            enableMultiRowSelection={false}
            getRowId={(row) => row.id}
            onRowSelectionChange={setRowSelection} //connect internal row selection state to your own
            state={{ rowSelection }}
        />
    );
};

export default ExaminationsTable;
