import { getConfigForType, ItemType, AbstractItem } from './item';

/**
 * Given a ItemType, constructs the appropriate item class with the given properties and returns it.
 * Will throw an Error when given an item type that does not exist.
 * @throws Error
 * @param type {ItemType}
 * @param id {string}
 * @param name {string}
 * @param sellIn {number}
 * @param quality {quality}
 */
export const itemFactory = (
  type: ItemType = ItemType.NORMAL,
  id: string,
  name: string,
  sellIn: number,
  quality: number,
): AbstractItem => {
  return new (getConfigForType(type).itemClass)(id, name, sellIn, quality);
};
