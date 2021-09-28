// The Quality of an item is never more than 50
import { AbstractItem } from './item';
import { itemFactory } from './factory';

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

  add(item: AbstractItem) {
    this.items.push(item);
  }

  delete(id: string) {
    this.items = this.items.filter((item) => item.id !== id);
  }

  getById(id: string) {
    return this.items.find((item) => item.id === id);
  }

  updateItem(id: string, item: AbstractItem): AbstractItem {
    const originalItem = this.getById(id);

    if (originalItem === undefined) {
      throw new Error(`Couldn't find item with id ${id}`);
    }

    if (item.type !== originalItem.type) {
      const newItem = itemFactory(
        item.type,
        id,
        item.name,
        item.sellIn,
        item.quality,
        item.isConjured,
      );
      this.items.splice(this.items.indexOf(originalItem), 1, newItem);

      return newItem;
    } else {
      originalItem.update(item);
      return originalItem;
    }
  }
}
