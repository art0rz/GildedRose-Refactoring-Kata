import { ITypedItem } from './types';

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
}

export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export abstract class AbstractItem extends Item {
  public id!: string;
  public name!: string;
  public sellIn!: number;
  public type!: ItemType;

  public isConjured!: boolean;

  constructor(
    id: string,
    name: string,
    sellIn: number,
    quality: number,
    isConjured: boolean = false,
  ) {
    super(name, sellIn, quality);
    this.isConjured = isConjured;
    this.id = id;
  }

  /**
   * Returns the quality of an item if aged by the amount of days passed to the method
   * @param age {number}
   * @return {number}
   */
  abstract simulateQuality(age: number): { sellIn: number; quality: number };

  /**
   * Ages the item by the amount of days supplied as the argument `days`
   * @param days {number}
   * @return {number}
   */
  updateQuality(days: number = 1): number {
    const { sellIn, quality } = this.simulateQuality(days);

    this.sellIn = sellIn;
    this.quality = quality;

    return quality;
  }

  public toJSON(): ITypedItem {
    return {
      type: this.type,
      id: this.id,
      name: this.name,
      quality: this.quality,
      sellIn: this.sellIn,
      isConjured: this.isConjured,
    };
  }

  public update({ name, quality, sellIn, isConjured }: Partial<ITypedItem>) {
    if (name !== undefined) {
      this.name = name;
    }
    if (quality !== undefined) {
      this.quality = quality;
    }
    if (sellIn !== undefined) {
      this.sellIn = sellIn;
    }
    if (isConjured !== undefined) {
      this.isConjured = isConjured;
    }
  }

  public getConjuredMultiplier() {
    if (this.isConjured === true) {
      return 2;
    } else {
      return 1;
    }
  }
}

/**
 * Normal items degrade in quality over time
 */
export class NormalItem extends AbstractItem {
  type = ItemType.NORMAL;

  simulateQuality(days): { sellIn: number; quality: number } {
    let { qualityDegradation, minQuality, maxQuality } = getConfigForType(this.type);

    const sellIn = this.sellIn - days;

    if (sellIn < 0) {
      // Once the sell by date has passed, Quality degrades twice as fast
      qualityDegradation = qualityDegradation * 2;
    }

    qualityDegradation *= this.getConjuredMultiplier();

    const quality = Math.min(
      maxQuality,
      Math.max(minQuality, this.quality - qualityDegradation * days),
    );

    return { sellIn, quality };
  }
}

/**
 * Aged items increase in quality over time
 */
export class AgedItem extends NormalItem {
  type = ItemType.AGED;
}

/**
 * Legendary items never decrease in quality
 */
export class LegendaryItem extends AbstractItem {
  type = ItemType.LEGENDARY;

  simulateQuality(days: number): { sellIn: number; quality: number } {
    return { quality: this.quality, sellIn: this.sellIn - days };
  }
}

/**
 * "Backstage passes", like aged brie, increases in Quality as its SellIn value approaches;
 * Quality increases by 2 when there are 10 days or less and by 3 when there are 5 days or less but
 * Quality drops to 0 after the concert
 */
export class BackstagePassItem extends AbstractItem {
  type = ItemType.BACKSTAGE_PASS;

  simulateQuality(days: number = 1): { quality: number; sellIn: number } {
    let { qualityDegradation, minQuality, maxQuality } = getConfigForType(this.type);

    const sellIn = this.sellIn - days;
    let quality = this.quality;

    if (sellIn < 0) {
      // quality drops to 0 after the concert
      quality = 0;
    } else {
      // quality degrades +1, 10 days or less before concert
      if (sellIn < 10) {
        qualityDegradation--;
      }
      // quality degrades another +1, 5 days or less before concert
      if (sellIn < 5) {
        qualityDegradation--;
      }

      qualityDegradation *= this.getConjuredMultiplier();

      quality = Math.min(maxQuality, Math.max(minQuality, quality - qualityDegradation * days));
    }

    return { quality, sellIn };
  }
}

type ItemTypeClassMap = {
  [ItemType.NORMAL]: typeof NormalItem;
  [ItemType.AGED]: typeof AgedItem;
  [ItemType.LEGENDARY]: typeof LegendaryItem;
  [ItemType.BACKSTAGE_PASS]: typeof BackstagePassItem;
};

export interface ItemTypeConfig<T> {
  itemClass: T;
  // the speed at which an item's quality degrades per day. negative values increase the item's quality
  qualityDegradation: number;
  // the minimum quality of an item
  minQuality: number;
  // the minimum quality of an item
  maxQuality: number;
}

export const itemTypeConfig: {
  [key in ItemType]: ItemTypeConfig<ItemTypeClassMap[key]>;
} = {
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
