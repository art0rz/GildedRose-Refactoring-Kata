import { IconButton } from '@mui/material';
import { DeleteForever, Edit } from '@mui/icons-material';
import { MouseEvent, useCallback } from 'react';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useDispatch } from 'react-redux';
import { deleteItem } from '../store/actions';
import { AbstractItem } from 'gilded-rose-lib';

interface Props extends GridRenderCellParams {
  onEditClick(row: AbstractItem): void;
}

const DataGridActionsCell = ({ row, onEditClick: onEditClickProp }: Props) => {
  const dispatch = useDispatch();

  const onDeleteClick = useCallback(
    (event: MouseEvent) => {
      dispatch(deleteItem(row.id));
      event.stopPropagation();
    },
    [row, dispatch],
  );

  const onEditClick = useCallback(
    (event: MouseEvent) => {
      onEditClickProp(row as AbstractItem);
      event.stopPropagation();
    },
    [row, onEditClickProp],
  );

  return (
    <>
      <IconButton aria-label="Example" onClick={onEditClick}>
        <Edit />
      </IconButton>
      <IconButton aria-label="Example" onClick={onDeleteClick}>
        <DeleteForever />
      </IconButton>
    </>
  );
};

export default DataGridActionsCell;
