import { Box, IconButton } from '@mui/material';
import { Add, DeleteForever } from '@mui/icons-material';

interface Props {
  disableDeleteButton: boolean;
  onDeleteClick: () => void;
  onAddClick: () => void;
}

const DataGridToolbar = ({ disableDeleteButton, onDeleteClick, onAddClick }: Props) => {
  return (
    <Box sx={{ p: 1 }}>
      <IconButton size="small" color="primary" onClick={onAddClick}>
        <Add />
        Add
      </IconButton>
      <IconButton
        size="small"
        color="primary"
        onClick={onDeleteClick}
        disabled={disableDeleteButton}
      >
        <DeleteForever />
        Delete selection
      </IconButton>
    </Box>
  );
};

export default DataGridToolbar;
