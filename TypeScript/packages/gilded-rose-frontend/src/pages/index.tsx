import type { NextPage } from 'next';
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid';
import { Paper } from '@mui/material';
import Layout from '../components/layout';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createItem, deleteItem, updateItems } from '../store/actions';
import DataGridActionsCell from '../components/data-grid-actions-cell';
import DataGridToolbar from '../components/data-grid-toolbar';
import ItemModal from '../components/item-modal';
import { Item } from 'gilded-rose-lib';

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
    renderCell: DataGridActionsCell,
  },
];

const Home: NextPage = () => {
  const { items, isUpdatingItems } = useSelector((state) => state.inventory);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updateItems());
  }, [dispatch]);

  const [selectedItems, setSelectedItems] = useState<Array<string>>([]);
  const [itemModalOpen, setItemModalOpen] = useState(false);

  const onSelectionChange = useCallback(async (ids: GridSelectionModel) => {
    setSelectedItems(ids as Array<string>);
  }, []);

  const onAddClick = useCallback(() => {
    setItemModalOpen(true);
  }, []);

  const onDeleteSelectionClick = useCallback(() => {
    console.log('woop');
    Promise.all(selectedItems.map((id) => dispatch(deleteItem(id))));
  }, [selectedItems, dispatch]);

  const onNewItemSubmit = useCallback(
    async (item: Item) => {
      await dispatch(createItem(item));
      setItemModalOpen(false);
    },
    [dispatch],
  );

  return (
    <Layout>
      <Paper>
        <DataGrid
          rows={items}
          columns={columns}
          loading={isUpdatingItems}
          checkboxSelection
          onSelectionModelChange={onSelectionChange}
          filterMode={'client'}
          components={{
            Toolbar: DataGridToolbar,
          }}
          componentsProps={{
            toolbar: {
              disableDeleteButton: selectedItems.length === 0,
              onDeleteClick: onDeleteSelectionClick,
              onAddClick: onAddClick,
            },
          }}
        />
      </Paper>
      <ItemModal
        open={itemModalOpen}
        onClose={() => undefined}
        onSubmit={onNewItemSubmit}
        loading={isUpdatingItems}
      />
    </Layout>
  );
};

export default Home;
