import { IconButton } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
import { MouseEvent, useCallback } from 'react';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useDispatch } from 'react-redux';
import { deleteItem } from '../store/actions';

const DataGridActionsCell = ({ row }: GridRenderCellParams) => {
  const dispatch = useDispatch();

  const onDeleteClick = useCallback(
    (event: MouseEvent) => {
      dispatch(deleteItem(row.id));
      event.stopPropagation();
    },
    [row, dispatch],
  );

  return (
    <>
      <IconButton aria-label="Example" onClick={onDeleteClick}>
        <DeleteForever />
      </IconButton>
    </>
  );
};

export default DataGridActionsCell;
