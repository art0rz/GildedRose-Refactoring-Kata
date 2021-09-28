import { combineReducers } from 'redux';
import Types from './types';
import { AbstractItem, itemFactory } from 'gilded-rose-lib';

interface DefaultAction {
  type: Types.GET_ITEMS | Types.UPDATE_ITEM;
  payload: undefined;
}

interface GetItemsAction {
  type: Types.GET_ITEMS_COMPLETE;
  payload: Array<AbstractItem>;
}

interface UpdateItemAction {
  type: Types.UPDATE_ITEM_COMPLETE;
  payload: AbstractItem;
}

const inventoryReducer = (
  state: {
    items: Array<AbstractItem>;
    isUpdatingItems: boolean;
  } = {
    items: [],
    isUpdatingItems: false,
  },
  { type, payload }: DefaultAction | GetItemsAction | UpdateItemAction,
) => {
  switch (type) {
    case Types.GET_ITEMS: {
      return {
        ...state,
        isUpdatingItems: true,
      };
    }
    case Types.GET_ITEMS_COMPLETE: {
      return {
        ...state,
        items: (payload as Array<AbstractItem>).map((item) =>
          itemFactory(item.type, item.id, item.name, item.sellIn, item.quality),
        ),
        isUpdatingItems: false,
      };
    }
    case Types.UPDATE_ITEM: {
      return {
        ...state,
        isUpdatingItems: true,
      };
    }
    case Types.UPDATE_ITEM_COMPLETE: {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === (payload as AbstractItem).id ? payload : item,
        ),
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
