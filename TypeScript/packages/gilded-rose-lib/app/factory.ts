import { getConfigForType, ItemType, AbstractItem } from './item';
import { ITypedItem } from './types';

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

/**
 * Given a ItemType, constructs the appropriate item class with the given properties and returns it.
 * Will throw an Error when given an item type that does not exist.
 * @throws Error
 * @param type {ItemType}
 * @param id {string}
 * @param name {string}
 * @param sellIn {number}
 * @param quality {number}
 * @param isConjured {number}
 */
export const itemFactory = ({
  type = ItemType.NORMAL,
  id,
  name,
  sellIn,
  quality,
  isConjured = false,
}: Optional<ITypedItem, 'isConjured'>): AbstractItem => {
  return new (getConfigForType(type).itemClass)(id, name, sellIn, quality, isConjured);
};
