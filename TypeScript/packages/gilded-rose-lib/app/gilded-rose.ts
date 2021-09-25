// The Quality of an item is never more than 50
import { AbstractItem } from './item';

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

export class GildedRose {
  items: Array<AbstractItem>;

  constructor(items = [] as Array<AbstractItem>) {
    this.items = items;
  }

  /**
   * Update quality of all held items
   */
  updateQuality() {
    for (const item of this.items) {
      item.updateQuality();
    }
    return this.items;
  }
}
