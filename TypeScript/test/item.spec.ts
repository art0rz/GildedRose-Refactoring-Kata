import { AgedItem, BackstagePassItem, LegendaryItem, NormalItem } from '../app/item';
import { expect } from 'chai';
import { itemFactory } from '../app/factory';
import { ItemType } from '../app/config';

describe('item types', () => {
  describe('NormalItem', () => {
    it('should have properties equal to the constructor arguments', () => {
      const item = new NormalItem('foo', 0, 0);
      expect(item.name).to.equal('foo');
      expect(item.sellIn).to.equal(0);
      expect(item.quality).to.equal(0);
    });
    it('should reduce the sellIn value', () => {
      const item = new NormalItem('foo', 10, 10);
      item.updateQuality();
      expect(item.sellIn).to.equal(9);
    });
    it('should have the correct name', () => {
      const item = new NormalItem('foo', 10, 10);
      item.updateQuality();
      expect(item.name).to.equal('foo');
    });
    it('should reduce item quality and sellBy for regular items', function () {
      const item = new NormalItem('foo', 10, 10);
      expect(item.updateQuality()).to.equal(9);
    });
    it('should not reduce item quality below 0', () => {
      const item = new NormalItem('foo', 10, 0);
      expect(item.quality).to.equal(0);
    });
    it('reduces quality twice as fast when sellIn is less than 0', () => {
      const item = new NormalItem('foo', 0, 10);
      expect(item.updateQuality()).to.equal(8);
    });
  });
  describe('AgedItem', () => {
    it('should reduce the sellIn value', function () {
      const item = new AgedItem('foo', 10, 10);
      item.updateQuality();
      expect(item.sellIn).to.equal(9);
    });
    it('should increase item quality and reduce sellBy', () => {
      const item = new AgedItem('foo', 10, 10);
      expect(item.updateQuality()).to.equal(11);
    });
    it('increase quality twice as fast when sellIn is less than 0', () => {
      const item = new AgedItem('foo', 0, 10);
      expect(item.updateQuality()).to.equal(12);
    });
    it('should keep keep increasing quality of after sellIn value', () => {
      const item = new AgedItem('foo', 0, 10);
      expect(item.updateQuality()).to.equal(12);
    });
  });
  describe('LegendaryItem', () => {
    it('should not increase or reduce quality', () => {
      const item = new LegendaryItem('foo', 10, 10);
      item.updateQuality();
      expect(item.quality).to.equal(10);
    });
    it('should be able to have a quality over 50', () => {
      const item = new LegendaryItem('foo', 10, 80);
      expect(item.updateQuality()).to.equal(80);
    });
  });
  describe('BackstagePassItem', function () {
    it('should increase quality by 1 point per day if sellIn is over 10 days', function () {
      const item = new BackstagePassItem('foo', 15, 10);
      item.updateQuality();
      expect(item.quality).to.equal(11);
    });
    it('should increase quality by 2 points per day if sellIn is less than or equal to 10 days', function () {
      const item = new BackstagePassItem('foo', 11, 10);
      item.updateQuality();
      expect(item.sellIn).to.equal(10);
      expect(item.quality).to.equal(11);
      item.updateQuality();
      expect(item.sellIn).to.equal(9);
      expect(item.quality).to.equal(13);
      item.updateQuality();
      expect(item.sellIn).to.equal(8);
      expect(item.quality).to.equal(15);
    });
    it('should increase quality by 3 points per day if sellIn is less than or equal to 5 days', function () {
      const item = new BackstagePassItem('foo', 6, 10);
      item.updateQuality();
      expect(item.sellIn).to.equal(5);
      expect(item.quality).to.equal(12);
      item.updateQuality();
      expect(item.sellIn).to.equal(4);
      expect(item.quality).to.equal(15);
      item.updateQuality();
      expect(item.sellIn).to.equal(3);
      expect(item.quality).to.equal(18);
    });
    it('should drop quality to 0 after sellIn value', () => {
      const item = new BackstagePassItem('foo', 1, 10);

      item.updateQuality();
      expect(item.sellIn).to.equal(0);
      expect(item.quality).to.equal(13);
      item.updateQuality();
      expect(item.sellIn).to.equal(-1);
      expect(item.quality).to.equal(0);
      item.updateQuality();
      expect(item.sellIn).to.equal(-2);
      expect(item.quality).to.equal(0);
    });
  });

  describe('conjured', () => {
    it('should decrease in quality twice as fast as regular items', () => {
      const item = itemFactory(ItemType.CONJURED, 'conjured', 10, 10);
      item.updateQuality();
      expect(item.sellIn).to.equal(9);
      expect(item.quality).to.equal(8);
    });
  });
});
