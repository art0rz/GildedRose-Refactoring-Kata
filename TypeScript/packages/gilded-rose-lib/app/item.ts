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
  public quality!: number;
  public type!: ItemType;

  constructor(
    type: ItemType = ItemType.NORMAL,
    id: string,
    name: string,
    sellIn: number,
    quality: number,
  ) {
    super(name, sellIn, quality);
    this.id = id;
    this.type = type;
  }

  /**
   * Ages the item by the amount of days supplied as the argument `days`
   * @param days {number}
   * @return {number}
   */
  abstract updateQuality(days?: number): number;

  public toJSON() {
    return {
      type: this.type,
      id: this.id,
      name: this.name,
      quality: this.quality,
      sellIn: this.sellIn,
    };
  }

  public update({ name, quality, sellIn }: Partial<Item>) {
    if (name !== undefined) {
      this.name = name;
    }
    if (quality !== undefined) {
      this.quality = quality;
    }
    if (sellIn !== undefined) {
      this.sellIn = sellIn;
    }
  }
}

/**
 * Normal items degrade in quality over time
 */
export class NormalItem extends AbstractItem {
  constructor(id: string, name: string, sellIn: number, quality: number) {
    super(ItemType.NORMAL, id, name, sellIn, quality);
  }

  updateQuality(days: number = 1): number {
    let { qualityDegradation, minQuality, maxQuality } = getConfigForType(this.type);

    this.sellIn = this.sellIn - days;

    if (this.sellIn < 0) {
      qualityDegradation = qualityDegradation * 2;
    }

    this.quality = Math.min(
      maxQuality,
      Math.max(minQuality, this.quality - qualityDegradation * days),
    );

    return this.quality;
  }
}

/**
 * Aged items increase in quality over time
 */
export class AgedItem extends NormalItem {
  constructor(id: string, name: string, sellIn: number, quality: number) {
    super(id, name, sellIn, quality);
    this.type = ItemType.AGED;
  }
}

/**
 * Legendary items never decrease in quality
 */
export class LegendaryItem extends AbstractItem {
  constructor(id: string, name: string, sellIn: number, quality: number) {
    super(ItemType.LEGENDARY, id, name, sellIn, quality);
  }

  updateQuality(days: number = 1): number {
    this.sellIn = this.sellIn - days;
    return this.quality;
  }
}

/**
 * "Backstage passes", like aged brie, increases in Quality as its SellIn value approaches;
 * Quality increases by 2 when there are 10 days or less and by 3 when there are 5 days or less but
 * Quality drops to 0 after the concert
 */
export class BackstagePassItem extends AbstractItem {
  constructor(id: string, name: string, sellIn: number, quality: number) {
    super(ItemType.BACKSTAGE_PASS, id, name, sellIn, quality);
  }

  updateQuality(days: number = 1): number {
    let { qualityDegradation, minQuality, maxQuality } = getConfigForType(this.type);

    this.sellIn = this.sellIn - days;

    if (this.sellIn < 0) {
      // quality drops to 0 after the concert
      this.quality = 0;
    } else {
      // quality degrades +1, 10 days or less before concert
      if (this.sellIn < 10) {
        qualityDegradation--;
      }
      // quality degrades another +1, 5 days or less before concert
      if (this.sellIn < 5) {
        qualityDegradation--;
      }

      this.quality = Math.min(
        maxQuality,
        Math.max(minQuality, this.quality - qualityDegradation * days),
      );
    }

    return this.quality;
  }
}

/**
 * "Conjured" items degrade in Quality twice as fast as normal items
 */
export class ConjuredItem extends NormalItem {
  constructor(id: string, name: string, sellIn: number, quality: number) {
    super(id, name, sellIn, quality);
    this.type = ItemType.CONJURED;
  }
}

type ItemTypeClassMap = {
  [ItemType.NORMAL]: typeof ConjuredItem;
  [ItemType.AGED]: typeof AgedItem;
  [ItemType.LEGENDARY]: typeof LegendaryItem;
  [ItemType.BACKSTAGE_PASS]: typeof BackstagePassItem;
  [ItemType.CONJURED]: typeof ConjuredItem;
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
