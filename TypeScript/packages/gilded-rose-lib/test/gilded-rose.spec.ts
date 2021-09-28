import { expect } from 'chai';
import { ItemType, NormalItem } from '../app/item';
import { GildedRose } from '../app/gilded-rose';

describe('GildedRose', function () {
  let gildedRose!: GildedRose;

  beforeEach(() => {
    gildedRose = new GildedRose([
      new NormalItem('1', 'foo', 10, 10),
      new NormalItem('2', 'bar', 9, 9),
      new NormalItem('3', 'baz', 8, 8),
    ]);
  });

  describe('constructor', () => {
    it('should contain the same items supplied in the constructor', () => {
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
  describe('getById', () => {
    it('should return the correct item associated with the ID', () => {
      expect(gildedRose.getById('3')?.id).to.equal('3');
    });
  });
  describe('add', () => {
    it('should add new items to the list', () => {
      expect(gildedRose.items.length).to.equal(3);
      gildedRose.add(new NormalItem('4', 'moo', 10, 10));
      expect(gildedRose.items.length).to.equal(4);
      expect(gildedRose.items[gildedRose.items.length - 1].id).to.equal('4');
    });
  });
  describe('delete', () => {
    it('should remove the item with the correct ID', () => {
      gildedRose.delete('3');
      expect(gildedRose.items.length).to.equal(2);
      expect(gildedRose.getById('3')).to.equal(undefined);
    });
  });
  describe('updateItem', () => {
    const item1 = new NormalItem('1', 'foo', 10, 10);
    const item2 = new NormalItem('2', 'bar', 9, 9);
    const item3 = new NormalItem('3', 'baz', 8, 8);
    gildedRose = new GildedRose([item1, item2, item3]);
    it('should update the correct item', () => {
      gildedRose.updateItem('1', {
        name: 'moo',
        type: ItemType.AGED,
      });
      expect(gildedRose.getById('1')?.name).to.equal('moo');
      expect(gildedRose.getById('1')?.type).to.equal(ItemType.AGED);
      gildedRose.updateItem('2', {
        name: 'woot',
      });
      expect(gildedRose.getById('2')?.name).to.equal('woot');
      expect(gildedRose.getById('2')?.type).to.equal(ItemType.NORMAL);
    });

    it('should throw an error when given a non-existant ID', () => {
      expect(() => gildedRose.updateItem('10', {})).to.throw();
    });
  });
});
