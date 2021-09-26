import { expect } from 'chai';
import { itemFactory } from '../app/factory';
import { ItemType, AgedItem, BackstagePassItem, LegendaryItem, NormalItem } from '../app/item';

describe('itemFactory', () => {
  it('should throw an error when given an ItemType that does not exist', () => {
    expect(() => itemFactory('foo' as any, '1', 'bar', 1, 1)).to.throw(Error);
  });
  it('should construct the correct item class associated with the ItemType', () => {
    expect(itemFactory(ItemType.NORMAL, '1', 'bar', 1, 1)).to.be.instanceOf(NormalItem);
    expect(itemFactory(ItemType.AGED, '2', 'bar', 1, 1)).to.be.instanceOf(AgedItem);
    expect(itemFactory(ItemType.LEGENDARY, '3', 'bar', 1, 1)).to.be.instanceOf(LegendaryItem);
    expect(itemFactory(ItemType.BACKSTAGE_PASS, '4', 'bar', 1, 1)).to.be.instanceOf(
      BackstagePassItem,
    );
  });
});
