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
    const item1 = new NormalItem('1', 'foo', 10, 10, true);
    const item2 = new NormalItem('2', 'bar', 9, 9, true);
    const item3 = new NormalItem('3', 'baz', 8, 8);
    gildedRose = new GildedRose([item1, item2, item3]);
    it('should update the correct item', () => {
      gildedRose.updateItem('1', {
        name: 'moo',
        type: ItemType.AGED,
        quality: 20,
        sellIn: 20,
        isConjured: false,
      });
      expect(gildedRose.getById('1')?.name).to.equal('moo');
      expect(gildedRose.getById('1')?.type).to.equal(ItemType.AGED);
      expect(gildedRose.getById('1')?.quality).to.equal(20);
      expect(gildedRose.getById('1')?.sellIn).to.equal(20);
      expect(gildedRose.getById('1')?.isConjured).to.equal(false);
      gildedRose.updateItem('2', {
        name: 'woot',
        quality: 19,
        sellIn: 19,
        isConjured: false,
      });
      expect(gildedRose.getById('2')?.name).to.equal('woot');
      expect(gildedRose.getById('2')?.type).to.equal(ItemType.NORMAL);
      expect(gildedRose.getById('2')?.quality).to.equal(19);
      expect(gildedRose.getById('2')?.sellIn).to.equal(19);
      expect(gildedRose.getById('2')?.isConjured).to.equal(false);
    });

    it('should throw an error when given a non-existant ID', () => {
      expect(() => gildedRose.updateItem('10', {})).to.throw();
    });
  });
  describe('toJSON', () => {
    it('should return a list of all items', () => {
      expect(JSON.stringify(gildedRose)).to.equal(
        '[{"type":"normal","id":"1","name":"foo","quality":10,"sellIn":10,"isConjured":false},{"type":"normal","id":"2","name":"bar","quality":9,"sellIn":9,"isConjured":false},{"type":"normal","id":"3","name":"baz","quality":8,"sellIn":8,"isConjured":false}]',
      );
    });
  });
});
