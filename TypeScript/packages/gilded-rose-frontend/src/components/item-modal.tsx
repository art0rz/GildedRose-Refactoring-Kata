/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Item, ItemType } from 'gilded-rose-lib';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (item: Item) => void;
  loading: boolean;
}

const itemTypeCopy = {
  [ItemType.NORMAL]: 'Normal',
  [ItemType.AGED]: 'Aged',
  [ItemType.LEGENDARY]: 'Legendary',
  [ItemType.BACKSTAGE_PASS]: 'Backstage Pass',
  [ItemType.CONJURED]: 'Conjured',
};

const boxStyles = ({ loading }: { loading: boolean }) => css`
  position: relative;
  ${loading === true &&
  `
  opacity: 0.3;
  pointer-events: none;
  `}
`;

const schema = yup
  .object({
    type: yup.string().default(ItemType.NORMAL).oneOf(Object.values(ItemType)),
    name: yup.string().required(),
    quality: yup.number().integer().required(),
    sellIn: yup.number().integer().required(),
  })
  .required();

const ItemModal = ({ open, onClose, onSubmit, loading }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      css={css`
        display: flex;
        align-content: center;
        justify-content: center;
        align-items: center;
      `}
    >
      <Paper elevation={24}>
        {loading && (
          <CircularProgress
            css={css`
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            `}
          />
        )}
        <Box
          css={boxStyles({ loading })}
          onSubmit={handleSubmit(onSubmit)}
          component="form"
          autoCorrect={'off'}
          autoCapitalize={'off'}
          sx={{
            p: 2,
            display: 'grid',
            gap: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            Create new item
          </Typography>
          <Select
            {...register('type', { required: true })}
            label="Type"
            error={errors.type !== undefined}
          >
            {Object.values(ItemType).map((v) => (
              <MenuItem key={v} value={v}>
                {itemTypeCopy[v]}
              </MenuItem>
            ))}
          </Select>
          <TextField
            {...register('name', { required: true })}
            label="Name"
            error={errors.name !== undefined}
          />

          <TextField
            {...register('quality', { required: true })}
            label="Quality"
            type="number"
            error={errors.quality !== undefined}
          />
          <TextField
            {...register('sellIn', { required: true })}
            label="Sell in"
            type="number"
            error={errors.sellIn !== undefined}
          />
          <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ItemModal;
