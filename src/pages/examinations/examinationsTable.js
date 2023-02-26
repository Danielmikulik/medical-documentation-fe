import React from 'react';
import MaterialReactTable from 'material-react-table';

const ExaminationsTable = ({ columns, data }) => {
    return <MaterialReactTable columns={columns} data={data} />;
};

export default ExaminationsTable;
