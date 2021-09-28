import { ItemType } from './item';

export interface IBaseItem {
  name: string;
  quality: number;
  sellIn: number;
}

export interface ITypedItem extends IBaseItem {
  id: string;
  type: ItemType;
  isConjured: boolean;
}
