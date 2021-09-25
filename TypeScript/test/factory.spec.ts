import { expect } from 'chai';
import { itemFactory } from '../app/factory';
import { ItemType } from '../app/config';
import { AgedItem, BackstagePassItem, LegendaryItem, NormalItem } from '../app/item';

describe('itemFactory', () => {
  it('should throw an error when given an ItemType that does not exist', () => {
    expect(() => itemFactory('foo' as any, 'bar', 1, 1)).to.throw(Error);
  });
  it('should construct the correct item class associated with the ItemType', () => {
    expect(itemFactory(ItemType.NORMAL, 'bar', 1, 1)).to.be.instanceOf(NormalItem);
    expect(itemFactory(ItemType.AGED, 'bar', 1, 1)).to.be.instanceOf(AgedItem);
    expect(itemFactory(ItemType.LEGENDARY, 'bar', 1, 1)).to.be.instanceOf(LegendaryItem);
    expect(itemFactory(ItemType.BACKSTAGE_PASS, 'bar', 1, 1)).to.be.instanceOf(BackstagePassItem);
  });
});
