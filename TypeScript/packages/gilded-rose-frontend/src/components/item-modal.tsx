/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Item, ItemType, ITypedItem } from 'gilded-rose-lib';
import { Resolver, useController, UseControllerProps, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { SelectProps } from '@mui/material/Select/Select';
import { useEffect } from 'react';

const itemTypeCopy = {
  [ItemType.NORMAL]: 'Normal',
  [ItemType.AGED]: 'Aged',
  [ItemType.LEGENDARY]: 'Legendary',
  [ItemType.BACKSTAGE_PASS]: 'Backstage Pass',
};

const ControlledSelect = ({
  name,
  label,
  control,
  children,
  defaultValue,
}: SelectProps & UseControllerProps<Partial<ITypedItem>>) => {
  const {
    field: { ref, ...inputProps },
    fieldState: { invalid },
  } = useController({
    name,
    control,
    rules: { required: true },
  });
  return (
    <FormControl error={invalid}>
      <Select
        {...inputProps}
        name={name}
        label={label}
        inputRef={ref}
        value={inputProps.value || defaultValue}
      >
        {children}
      </Select>
    </FormControl>
  );
};

const schema = yup
  .object({
    id: yup.string(),
    type: yup.string().oneOf(Object.values(ItemType)).default(ItemType.NORMAL),
    name: yup.string().required(),
    quality: yup.number().integer().required(),
    sellIn: yup.number().integer().required(),
  })
  .required();

const boxStyles = ({ loading }: { loading: boolean }) => css`
  position: relative;
  ${loading === true &&
  `
  opacity: 0.3;
  pointer-events: none;
  `}
`;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (item: Item) => void;
  loading: boolean;
  item?: Partial<ITypedItem>;
}

const ItemModal = ({ open, onClose, onSubmit, loading, item }: Props) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Partial<ITypedItem>>({
    resolver: yupResolver(schema) as Resolver<Partial<ITypedItem>>,
  });

  useEffect(() => {
    if (item) {
      setValue('type', item.type);
      setValue('name', item.name);
      setValue('quality', item.quality);
      setValue('sellIn', item.sellIn);
    }
  }, [item, setValue]);

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
          <ControlledSelect
            control={control}
            name="type"
            label="Type"
            defaultValue={ItemType.NORMAL}
          >
            {Object.values(ItemType).map((v) => (
              <MenuItem key={v} value={v}>
                {itemTypeCopy[v]}
              </MenuItem>
            ))}
          </ControlledSelect>
          <TextField
            {...register('name', { required: true })}
            label="Name"
            autoComplete={'off'}
            error={errors.name !== undefined}
          />

          <TextField
            {...register('quality', { required: true })}
            label="Quality"
            autoComplete={'off'}
            type="number"
            error={errors.quality !== undefined}
          />
          <TextField
            {...register('sellIn', { required: true })}
            label="Sell in"
            autoComplete={'off'}
            type="number"
            error={errors.sellIn !== undefined}
          />
          <Button onClick={handleSubmit(onSubmit)} variant={'contained'}>
            Submit
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ItemModal;
