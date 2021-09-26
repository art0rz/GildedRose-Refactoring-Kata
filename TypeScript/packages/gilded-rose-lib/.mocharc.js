'use strict';

module.exports = {
  require: ['./node_modules/ts-node/register', 'source-map-support/register'],
  recursive: true,
  spec: 'test/*.spec.ts',
};
