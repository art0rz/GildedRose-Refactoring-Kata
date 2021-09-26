import { expect } from 'chai';
import { NormalItem } from '../app/item';
import { GildedRose } from '../app/gilded-rose';

describe('GildedRose', function () {
  it('should contain the same items supplied in the constructor', () => {
    const gildedRose = new GildedRose([
      new NormalItem('1', 'foo', 10, 10),
      new NormalItem('2', 'bar', 9, 9),
      new NormalItem('3', 'baz', 8, 8),
    ]);
    const items = gildedRose.items;
    expect(items[0].name).to.equal('foo');
    expect(items[0].sellIn).to.equal(10);
    expect(items[0].quality).to.equal(10);
    expect(items[1].name).to.equal('bar');
    expect(items[1].sellIn).to.equal(9);
    expect(items[1].quality).to.equal(9);
    expect(items[2].name).to.equal('baz');
    expect(items[2].sellIn).to.equal(8);
    expect(items[2].quality).to.equal(8);
  });
  it('should update the quality of all held items', () => {
    const gildedRose = new GildedRose([
      new NormalItem('1', 'foo', 10, 10),
      new NormalItem('2', 'bar', 9, 9),
      new NormalItem('3', 'baz', 8, 8),
    ]);
    gildedRose.updateQuality();
    const items = gildedRose.items;
    expect(items[0].name).to.equal('foo');
    expect(items[0].sellIn).to.equal(9);
    expect(items[0].quality).to.equal(9);
    expect(items[1].name).to.equal('bar');
    expect(items[1].sellIn).to.equal(8);
    expect(items[1].quality).to.equal(8);
    expect(items[2].name).to.equal('baz');
    expect(items[2].sellIn).to.equal(7);
    expect(items[2].quality).to.equal(7);
  });
});
