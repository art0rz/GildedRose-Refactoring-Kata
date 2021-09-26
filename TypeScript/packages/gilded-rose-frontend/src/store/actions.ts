import Types from './types';
import { Dispatch } from 'redux';

export const updateItems = () => async (dispatch: Dispatch) => {
  dispatch({ type: Types.UPDATE_ITEMS });
  const { inventory } = await (await fetch('/api/inventory')).json();
  return dispatch({ type: Types.UPDATE_ITEMS_COMPLETE, payload: inventory });
};
