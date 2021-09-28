import { AgedItem, BackstagePassItem, LegendaryItem, NormalItem } from '../app/item';
import { expect } from 'chai';

describe('Conjured items', () => {
  describe('NormalItem', () => {
    it('reduces quality twice as fast when it is a conjured item', () => {
      const item = new NormalItem('1', 'foo', 10, 10, true);
      expect(item.updateQuality()).to.equal(8);
    });
    it('reduces quality four times as fast when it is a conjured item and it is past its sellIn date', () => {
      const item = new NormalItem('1', 'foo', 0, 10, true);
      expect(item.updateQuality()).to.equal(6);
    });
  });
  describe('AgedItem', () => {
    it('should increase quality twice as fast when it is a conjured item', () => {
      const item = new AgedItem('1', 'foo', 10, 10, true);
      expect(item.updateQuality()).to.equal(12);
    });
    it('should increase quality four times as fast when it is a conjured item and it is past its sellIn date', () => {
      const item = new AgedItem('1', 'foo', 0, 10, true);
      expect(item.updateQuality()).to.equal(14);
    });
  });
  describe('Legendary', () => {
    it('should not change in quality', () => {
      const item = new LegendaryItem('1', 'foo', 10, 50, true);
      expect(item.updateQuality()).to.equal(50);
    });
  });
  describe('BackstagePassItem', () => {
    it('should increase quality by 4 points per day if sellIn is less than or equal to 10 days', function () {
      const item = new BackstagePassItem('1', 'foo', 11, 10, true);
      item.updateQuality();
      expect(item.sellIn).to.equal(10);
      expect(item.quality).to.equal(12);
      item.updateQuality();
      expect(item.sellIn).to.equal(9);
      expect(item.quality).to.equal(16);
      item.updateQuality();
      expect(item.sellIn).to.equal(8);
      expect(item.quality).to.equal(20);
    });
    it('should increase quality by 6 points per day if sellIn is less than or equal to 5 days', function () {
      const item = new BackstagePassItem('1', 'foo', 6, 10, true);
      item.updateQuality();
      expect(item.sellIn).to.equal(5);
      expect(item.quality).to.equal(14);
      item.updateQuality();
      expect(item.sellIn).to.equal(4);
      expect(item.quality).to.equal(20);
      item.updateQuality();
      expect(item.sellIn).to.equal(3);
      expect(item.quality).to.equal(26);
    });
    it('should drop quality to 0 after sellIn value', () => {
      const item = new BackstagePassItem('1', 'foo', 1, 10, true);

      item.updateQuality();
      expect(item.sellIn).to.equal(0);
      expect(item.quality).to.equal(16);
      item.updateQuality();
      expect(item.sellIn).to.equal(-1);
      expect(item.quality).to.equal(0);
      item.updateQuality();
      expect(item.sellIn).to.equal(-2);
      expect(item.quality).to.equal(0);
    });
  });
});
