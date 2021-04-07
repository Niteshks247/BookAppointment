import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

export default function DataTable(props) {

    const columns = props.columns; //array of objects

    const rows = props.rows; //array of objects

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
    </div>
  );
}
