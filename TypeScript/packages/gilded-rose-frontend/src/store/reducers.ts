import { combineReducers } from 'redux';
import Types from './types';
import { AbstractItem, itemFactory, ITypedItem } from 'gilded-rose-lib';

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
  payload: ITypedItem;
}

interface UpdateSimulatedAgeAction {
  type: Types.UPDATE_SIMULATED_AGE;
  payload: number;
}

interface State {
  items: Array<AbstractItem>;
  simulatedItems: Array<{ quality: number; sellIn: number }>;
  isUpdatingItems: boolean;
  simulatedAge: number;
}

const inventoryReducer = (
  state: State = {
    items: [],
    simulatedItems: [],
    isUpdatingItems: false,
    simulatedAge: 0,
  },
  { type, payload }: DefaultAction | GetItemsAction | UpdateItemAction | UpdateSimulatedAgeAction,
): State => {
  switch (type) {
    case Types.GET_ITEMS: {
      return {
        ...state,
        isUpdatingItems: true,
      };
    }
    case Types.GET_ITEMS_COMPLETE: {
      const items = (payload as Array<AbstractItem>).map((item) => itemFactory(item));
      return {
        ...state,
        items,
        simulatedItems: items.map((item) => item.simulateQuality(state.simulatedAge)),
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
      const items = state.items.map((item) =>
        // only update the selected item
        item.id === (payload as AbstractItem).id ? itemFactory(payload as ITypedItem) : item,
      );
      return {
        ...state,
        items,
        simulatedItems: items.map((item) => item.simulateQuality(state.simulatedAge)),
        isUpdatingItems: false,
      };
    }
    case Types.UPDATE_SIMULATED_AGE: {
      return {
        ...state,
        simulatedAge: payload as number,
        simulatedItems: state.items.map((item) => item.simulateQuality(payload as number)),
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
