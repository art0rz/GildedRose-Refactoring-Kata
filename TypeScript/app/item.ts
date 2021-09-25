import { getConfigForType, ItemType } from './config';
import { Item } from './gilded-rose';

export abstract class AbstractItem extends Item {
  public name!: string;
  public sellIn!: number;
  public quality!: number;
  public type!: ItemType;

  constructor(type: ItemType = ItemType.NORMAL, name: string, sellIn: number, quality: number) {
    super(name, sellIn, quality);
    this.type = type;
  }

  /**
   * Ages the item by the amount of days supplied as the argument `days`
   * @param days {number}
   * @return {number}
   */
  abstract updateQuality(days?: number): number;
}

/**
 * Normal items degrade in quality over time
 */
export class NormalItem extends AbstractItem {
  constructor(name: string, sellIn: number, quality: number) {
    super(ItemType.NORMAL, name, sellIn, quality);
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
  constructor(name: string, sellIn: number, quality: number) {
    super(name, sellIn, quality);
    this.type = ItemType.AGED;
  }
}

/**
 * Legendary items never decrease in quality
 */
export class LegendaryItem extends NormalItem {
  constructor(name: string, sellIn: number, quality: number) {
    super(name, sellIn, quality);
    this.type = ItemType.LEGENDARY;
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
  constructor(name: string, sellIn: number, quality: number) {
    super(ItemType.BACKSTAGE_PASS, name, sellIn, quality);
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
