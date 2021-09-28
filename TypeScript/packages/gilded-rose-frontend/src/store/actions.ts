import Types from './types';
import { Dispatch } from 'redux';
import { Item } from 'gilded-rose-lib';

export const getItems = () => async (dispatch: Dispatch) => {
  dispatch({ type: Types.GET_ITEMS });
  const { inventory } = await (await fetch('/api/inventory')).json();
  return dispatch({ type: Types.GET_ITEMS_COMPLETE, payload: inventory });
};

export const deleteItem = (id: string) => async (dispatch: Dispatch) => {
  dispatch({ type: Types.DELETE_ITEM });
  dispatch({ type: Types.GET_ITEMS });
  const { inventory } = await (
    await fetch(`/api/inventory/${id}`, {
      method: 'delete',
    })
  ).json();
  dispatch({ type: Types.DELETE_ITEM_COMPLETE });
  return dispatch({ type: Types.GET_ITEMS_COMPLETE, payload: inventory });
};

export const createItem = (item: Item) => async (dispatch: Dispatch) => {
  dispatch({ type: Types.CREATE_ITEM });
  dispatch({ type: Types.GET_ITEMS });
  const { inventory } = await (
    await fetch(`/api/inventory`, {
      method: 'post',
      body: JSON.stringify(item),
    })
  ).json();
  dispatch({ type: Types.CREATE_ITEM_COMPLETE, payload: inventory });
  return dispatch({ type: Types.GET_ITEMS_COMPLETE });
};

export const updateItem = (id: string, item: Item) => async (dispatch: Dispatch) => {
  dispatch({ type: Types.UPDATE_ITEM });
  const newItem = await (
    await fetch(`/api/inventory/${id}`, {
      method: 'post',
      body: JSON.stringify(item),
    })
  ).json();
  return dispatch({ type: Types.UPDATE_ITEM_COMPLETE, payload: newItem });
};
