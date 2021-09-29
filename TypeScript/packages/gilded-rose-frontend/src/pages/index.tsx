import type { NextPage } from 'next';
import { DataGrid, GridSelectionModel } from '@mui/x-data-grid';
import { Checkbox, Paper } from '@mui/material';
import Layout from '../components/layout';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createItem, deleteItem, getItems, updateItem } from '../store/actions';
import DataGridActionsCell from '../components/data-grid-actions-cell';
import DataGridToolbar from '../components/data-grid-toolbar';
import ItemModal from '../components/item-modal';
import { AbstractItem, Item, ITypedItem } from 'gilded-rose-lib';

const Home: NextPage = () => {
  const { items, isUpdatingItems, simulatedItems } = useSelector((state) => state.inventory);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getItems());
  }, [dispatch]);

  const [selectedItems, setSelectedItems] = useState<Array<string>>([]);
  const [editingItem, setEditingItem] = useState<AbstractItem | undefined>(undefined);
  const [itemModalOpen, setItemModalOpen] = useState(false);

  const onSelectionChange = useCallback(async (ids: GridSelectionModel) => {
    setSelectedItems(ids as Array<string>);
  }, []);

  const onAddClick = useCallback(() => {
    setItemModalOpen(true);
  }, []);

  const onEditItemClick = useCallback((row: AbstractItem) => {
    setEditingItem(row);
    setItemModalOpen(true);
  }, []);

  const onModalClose = useCallback(() => {
    setItemModalOpen(false);
    setEditingItem(undefined);
  }, []);

  const onDeleteSelectionClick = useCallback(() => {
    Promise.all(selectedItems.map((id) => dispatch(deleteItem(id))));
  }, [selectedItems, dispatch]);

  const onNewItemSubmit = useCallback(
    async (item: Item) => {
      if (editingItem !== undefined) {
        await dispatch(updateItem(editingItem.id, item));
      } else {
        await dispatch(createItem(item));
      }
      setItemModalOpen(false);
    },
    [dispatch, editingItem],
  );

  const [gridItems, setGridItems] = useState<Array<ITypedItem>>([]);

  useEffect(() => {
    setGridItems(
      items.map((item, idx) => ({
        ...item,
        ...simulatedItems[idx],
      })),
    );
  }, [items, simulatedItems]);

  const getItemById = useCallback(
    (id: string) => {
      return items.find((item) => id === item.id);
    },
    [items],
  );

  return (
    <Layout>
      <Paper
        sx={{
          position: 'relative',
          zIndex: 2,
        }}
      >
        <DataGrid
          rows={gridItems}
          columns={[
            { field: 'name', headerName: 'Name', flex: 1 },
            { field: 'type', headerName: 'Type', width: 150 },
            { field: 'quality', headerName: 'Quality', width: 150 },
            { field: 'sellIn', headerName: 'Sell in', width: 150 },
            {
              field: 'isConjured',
              headerName: 'Conjured',
              width: 150,
              renderCell({ value }) {
                return <Checkbox disabled={true} checked={value as boolean} />;
              },
            },
            {
              disableColumnMenu: true,
              filterable: false,
              sortable: false,
              field: 'actions',
              headerName: '',
              disableExport: true,
              renderCell: (props) => (
                <DataGridActionsCell
                  item={getItemById(props.id)}
                  onEditClick={onEditItemClick}
                  {...props}
                />
              ),
            },
          ]}
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
        onClose={onModalClose}
        onSubmit={onNewItemSubmit}
        loading={isUpdatingItems}
        item={editingItem}
      />
    </Layout>
  );
};

export default Home;
