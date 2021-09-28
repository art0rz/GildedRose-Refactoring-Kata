import GildedRoseApiMiddleware from 'gilded-rose-api-middleware';

export default GildedRoseApiMiddleware({
  absolutePath: '/api/inventory/',
  catchAllKey: 'slug',
});
