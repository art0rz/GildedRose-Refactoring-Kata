import { combineReducers } from 'redux';
import Types from './types';
import { Item, ItemType } from 'gilded-rose-lib';

const inventoryReducer = (
  state: {
    items: Array<{
      id: string;
      name: string;
      sellIn: number;
      quality: number;
      type: ItemType;
    }>;
    isUpdatingItems: boolean;
  } = {
    items: [],
    isUpdatingItems: false,
  },
  { type, payload }: { type: Types; payload: Array<Item> },
) => {
  switch (type) {
    case Types.UPDATE_ITEMS: {
      return {
        ...state,
        isUpdatingItems: true,
      };
    }
    case Types.UPDATE_ITEMS_COMPLETE: {
      return {
        ...state,
        items: payload,
        isUpdatingItems: false,
      };
    }
    case Types.DELETE_ITEM: {
      return {
        ...state,
        isUpdatingItems: true,
      };
    }
    case Types.DELETE_ITEM_COMPLETE: {
      return {
        ...state,
        items: payload,
        isUpdatingItems: false,
      };
    }
    case Types.CREATE_ITEM: {
      return {
        ...state,
        isUpdatingItems: true,
      };
    }
    case Types.CREATE_ITEM_COMPLETE: {
      return {
        ...state,
        items: payload,
        isUpdatingItems: false,
      };
    }
    default:
      return state;
  }
};

// COMBINED REDUCERS
const reducers = {
  inventory: inventoryReducer,
};

export default combineReducers(reducers);
