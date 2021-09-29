import { expect } from 'chai';
import { itemFactory } from '../app/factory';
import { ItemType, AgedItem, BackstagePassItem, LegendaryItem, NormalItem } from '../app/item';

describe('itemFactory', () => {
  it('should throw an error when given an ItemType that does not exist', () => {
    expect(() =>
      itemFactory({ type: 'foo' as any, id: '1', name: 'bar', quality: 1, sellIn: 1 }),
    ).to.throw(Error);
  });
  it('should construct the correct item class associated with the ItemType', () => {
    expect(
      itemFactory({ type: ItemType.NORMAL, id: '1', name: 'bar', quality: 1, sellIn: 1 }),
    ).to.be.instanceOf(NormalItem);
    expect(
      itemFactory({ type: ItemType.AGED, id: '2', name: 'bar', quality: 1, sellIn: 1 }),
    ).to.be.instanceOf(AgedItem);
    expect(
      itemFactory({ type: ItemType.LEGENDARY, id: '3', name: 'bar', quality: 1, sellIn: 1 }),
    ).to.be.instanceOf(LegendaryItem);
    expect(
      itemFactory({ type: ItemType.BACKSTAGE_PASS, id: '4', name: 'bar', quality: 1, sellIn: 1 }),
    ).to.be.instanceOf(BackstagePassItem);
  });
});
