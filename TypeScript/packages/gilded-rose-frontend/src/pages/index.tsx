import type { NextPage } from 'next';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton, Paper } from '@mui/material';
import Layout from '../components/layout';
import { DeleteForever, Edit } from '@mui/icons-material';
import { MouseEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateItems } from '../store/actions';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'type', headerName: 'Type', width: 150 },
  { field: 'quality', headerName: 'Quality', width: 150 },
  { field: 'sellIn', headerName: 'Sell in', width: 150 },
  {
    disableColumnMenu: true,
    filterable: false,
    sortable: false,
    field: 'actions',
    headerName: '',
    disableExport: true,
    renderCell: () => {
      const onClick = (event: MouseEvent) => {
        event.stopPropagation();
        // TODO: implement action buttons
      };

      return (
        <>
          <IconButton aria-label="Example" onClick={onClick}>
            <Edit />
          </IconButton>
          <IconButton aria-label="Example" onClick={onClick}>
            <DeleteForever />
          </IconButton>
        </>
      );
    },
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
