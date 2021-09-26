import Types from './types';
import { Dispatch } from 'redux';

export const updateItems = () => async (dispatch: Dispatch) => {
  dispatch({ type: Types.UPDATE_ITEMS });
  const { inventory } = await (await fetch('/api/inventory')).json();
  return dispatch({ type: Types.UPDATE_ITEMS_COMPLETE, payload: inventory });
};

export const deleteItem = (id: string) => async (dispatch: Dispatch) => {
  dispatch({ type: Types.DELETE_ITEM });
  const { inventory } = await (
    await fetch(`/api/inventory`, {
      method: 'delete',
      body: JSON.stringify({
        id,
      }),
    })
  ).json();
  return dispatch({ type: Types.DELETE_ITEM_COMPLETE, payload: inventory });
};
