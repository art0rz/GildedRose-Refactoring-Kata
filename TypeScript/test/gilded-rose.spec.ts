import { expect } from 'chai';
import { Item, GildedRose } from '../app/gilded-rose';

describe('Item', () =>
  it('should have properties equal to the constructor arguments', () => {
    const item = new Item('foo', 0, 0);
    expect(item.name).to.equal('foo');
    expect(item.sellIn).to.equal(0);
    expect(item.quality).to.equal(0);
  }));

describe('Gilded Rose', function () {
  it('should contain the same items supplied in the constructor', () => {
    const gildedRose = new GildedRose([
      new Item('foo', 10, 10),
      new Item('bar', 9, 9),
      new Item('baz', 8, 8),
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
  describe('regular items', () => {
    it('should reduce item quality and sellBy for regular items', function () {
      const gildedRose = new GildedRose([new Item('foo', 10, 10)]);
      const items = gildedRose.updateQuality();
      expect(items[0].name).to.equal('foo');
      expect(items[0].sellIn).to.equal(9);
      expect(items[0].quality).to.equal(9);
    });
    it('should not decrease item quality below 0', () => {
      const gildedRose = new GildedRose([new Item('foo', 10, 0)]);
      const items = gildedRose.updateQuality();
      expect(items[0].sellIn).to.equal(9);
      expect(items[0].quality).to.equal(0);
    });
    it('decrease quality twice as fast when sellIn is less than 0', () => {
      const gildedRose = new GildedRose([new Item('foo', 0, 10)]);
      const items = gildedRose.updateQuality();
      expect(items[0].sellIn).to.equal(-1);
      expect(items[0].quality).to.equal(8);
    });
    it('should not increase quality of over 50', () => {
      const gildedRose = new GildedRose([new Item('Aged Brie', 10, 50)]);
      const items = gildedRose.updateQuality();
      expect(items[0].sellIn).to.equal(9);
      expect(items[0].quality).to.equal(50);
    });
  });
  describe('aged items', () => {
    it('should increase item quality and decrease sellBy', () => {
      const gildedRose = new GildedRose([new Item('Aged Brie', 10, 10)]);
      const items = gildedRose.updateQuality();
      expect(items[0].sellIn).to.equal(9);
      expect(items[0].quality).to.equal(11);
    });
    it('increase quality twice as fast when sellIn is less than 0', () => {
      const gildedRose = new GildedRose([new Item('Aged Brie', 0, 10)]);
      const items = gildedRose.updateQuality();
      expect(items[0].sellIn).to.equal(-1);
      expect(items[0].quality).to.equal(12);
    });
    it('should keep keep increasing quality of after sellIn value', () => {
      const gildedRose = new GildedRose([new Item('Aged Brie', 0, 10)]);
      const items = gildedRose.updateQuality();
      expect(items[0].sellIn).to.equal(-1);
      expect(items[0].quality).to.equal(12);
    });
  });
  describe('legendary items', () => {
    it('should not increase or decrease quality and sellIn', () => {
      const gildedRose = new GildedRose([new Item('Sulfuras, Hand of Ragnaros', 10, 10)]);
      const items = gildedRose.updateQuality();
      expect(items[0].sellIn).to.equal(10);
      expect(items[0].quality).to.equal(10);
    });
    it('should be able to have a quality over 50', () => {
      const gildedRose = new GildedRose([new Item('Sulfuras, Hand of Ragnaros', 10, 80)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).to.equal(80);
    });
  });
  describe('backstage passes', function () {
    it('should increase quality by 1 point per day if sellIn is over 10 days', function () {
      const gildedRose = new GildedRose([
        new Item('Backstage passes to a TAFKAL80ETC concert', 15, 10),
      ]);
      const items = gildedRose.updateQuality();
      expect(items[0].sellIn).to.equal(14);
      expect(items[0].quality).to.equal(11);
    });
    it('should increase quality by 2 points per day if sellIn is less than or equal to 10 days', function () {
      const gildedRose = new GildedRose([
        new Item('Backstage passes to a TAFKAL80ETC concert', 9, 10),
      ]);
      const items = gildedRose.updateQuality();
      expect(items[0].sellIn).to.equal(8);
      expect(items[0].quality).to.equal(12);
    });
    it('should increase quality by 3 points per day if sellIn is less than or equal to 5 days', function () {
      const gildedRose = new GildedRose([
        new Item('Backstage passes to a TAFKAL80ETC concert', 5, 10),
      ]);
      const items = gildedRose.updateQuality();
      expect(items[0].sellIn).to.equal(4);
      expect(items[0].quality).to.equal(13);
    });
    it('should drop quality to 0 after sellIn value', () => {
      const gildedRose = new GildedRose([
        new Item('Backstage passes to a TAFKAL80ETC concert', 0, 10),
      ]);
      const items = gildedRose.updateQuality();
      expect(items[0].sellIn).to.equal(-1);
      expect(items[0].quality).to.equal(0);
    });
  });
  describe('conjured', () => {
    it('should decrease in quality twice as fast as regular items', () => {
      const gildedRose = new GildedRose([new Item('conjured', 10, 10)]);
      const items = gildedRose.updateQuality();
      expect(items[0].sellIn).to.equal(-1);
      expect(items[0].quality).to.equal(8);
    });
  });
});
