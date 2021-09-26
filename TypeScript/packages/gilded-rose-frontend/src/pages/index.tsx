import type { NextPage } from 'next';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Paper } from '@mui/material';
import Layout from '../components/layout';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateItems } from '../store/actions';
import DataGridActionsCell from '../components/data-grid-actions-cell';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', flex: 1, editable: true },
  { field: 'type', headerName: 'Type', width: 150, editable: true },
  { field: 'quality', headerName: 'Quality', width: 150, editable: true },
  { field: 'sellIn', headerName: 'Sell in', width: 150, editable: true },
  {
    disableColumnMenu: true,
    filterable: false,
    sortable: false,
    field: 'actions',
    headerName: '',
    disableExport: true,
    renderCell: DataGridActionsCell,
  },
];

const Home: NextPage = () => {
  const { items, isUpdatingItems } = useSelector((state) => state.inventory);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updateItems());
  }, [dispatch]);

  return (
    <Layout>
      <Paper>
        <DataGrid rows={items} columns={columns} loading={isUpdatingItems} checkboxSelection />
      </Paper>
    </Layout>
  );
};

export default Home;
