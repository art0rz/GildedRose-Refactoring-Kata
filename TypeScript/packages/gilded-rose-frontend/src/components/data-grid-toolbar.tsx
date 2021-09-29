import { Button, IconButton, Slider, Stack, Typography } from '@mui/material';
import { Add, DeleteForever } from '@mui/icons-material';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSimulatedAge } from '../store/actions';

interface Props {
  disableDeleteButton: boolean;
  onDeleteClick: () => void;
  onAddClick: () => void;
  onAgeChange: (age: number) => void;
}

const DataGridToolbar = ({ disableDeleteButton, onDeleteClick, onAddClick }: Props) => {
  const { simulatedAge } = useSelector((state) => state.inventory);
  const dispatch = useDispatch();
  const onAgeChange = useCallback(
    (event) => {
      dispatch(updateSimulatedAge(event.target.value));
    },
    [dispatch],
  );

  const resetAge = useCallback(() => dispatch(updateSimulatedAge(0)), [dispatch]);

  return (
    <Stack direction="row" spacing={4} sx={{ p: 2, pr: 4, alignItems: 'center' }}>
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

      <Typography
        sx={{
          whiteSpace: 'nowrap',
        }}
      >
        Simulate age:
      </Typography>
      <Slider
        size={'small'}
        valueLabelDisplay="auto"
        min={-30}
        max={30}
        value={simulatedAge}
        onChange={onAgeChange}
      />
      <Button size={'small'} onClick={resetAge}>
        Reset
      </Button>
    </Stack>
  );
};

export default DataGridToolbar;
