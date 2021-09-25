import {
  AbstractItem,
  AgedItem,
  BackstagePassItem,
  ConjuredItem,
  LegendaryItem,
  NormalItem,
} from './item';

export const DEFAULT_MAX_ITEM_QUALITY = 50;
export const DEFAULT_MIN_ITEM_QUALITY = 0;

export enum ItemType {
  // normal items decrease in quality over time
  NORMAL = 'normal',
  // aged items increase in quality over time
  AGED = 'aged',
  // legendary items never decrease in quality
  LEGENDARY = 'legendary',
  // "Backstage passes", like aged brie, increases in Quality as its SellIn value approaches;
  // 	Quality increases by 2 when there are 10 days or less and by 3 when there are 5 days or less but
  // 	Quality drops to 0 after the concert
  BACKSTAGE_PASS = 'backstage-pass',
  // conjured items degrade in quality twice as fast as normal items
  CONJURED = 'conjured',
}

export interface ItemTypeConfig<T extends AbstractItem> {
  itemClass: T;
  // the speed at which an item's quality degrades per day. negative values increase the item's quality
  qualityDegradation: number;
  // the minimum quality of an item
  minQuality: number;
  // the minimum quality of an item
  maxQuality: number;
}

export const itemTypeConfig: Record<ItemType, ItemTypeConfig<any>> = {
  [ItemType.NORMAL]: {
    qualityDegradation: 1,
    minQuality: DEFAULT_MIN_ITEM_QUALITY,
    maxQuality: DEFAULT_MAX_ITEM_QUALITY,
    itemClass: NormalItem,
  },
  [ItemType.AGED]: {
    qualityDegradation: -1,
    minQuality: DEFAULT_MIN_ITEM_QUALITY,
    maxQuality: DEFAULT_MAX_ITEM_QUALITY,
    itemClass: AgedItem,
  },
  [ItemType.LEGENDARY]: {
    qualityDegradation: 0,
    minQuality: DEFAULT_MIN_ITEM_QUALITY,
    maxQuality: Infinity,
    itemClass: LegendaryItem,
  },
  [ItemType.BACKSTAGE_PASS]: {
    qualityDegradation: -1,
    minQuality: DEFAULT_MIN_ITEM_QUALITY,
    maxQuality: DEFAULT_MAX_ITEM_QUALITY,
    itemClass: BackstagePassItem,
  },
  [ItemType.CONJURED]: {
    qualityDegradation: 2,
    minQuality: DEFAULT_MIN_ITEM_QUALITY,
    maxQuality: DEFAULT_MAX_ITEM_QUALITY,
    itemClass: ConjuredItem,
  },
};

/**
 * Given an ItemType, finds the associated ItemConfig and returns it.
 * Throws an Error when given an ItemType that does not exist
 * @throws Error
 * @param type
 */
export const getConfigForType = (type: ItemType) => {
  if (itemTypeConfig[type] === undefined) {
    throw new Error(`No such item type ${type}`);
  }

  return itemTypeConfig[type];
};
