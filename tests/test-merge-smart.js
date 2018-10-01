/* eslint-env mocha */
const webpackMerge = require('..');
const mergeTests = require('./merge-tests');
const mergeSmartTests = require('./merge-smart-tests');

describe('Smart merge', () => {
  const merge = webpackMerge.smart;

  mergeTests(merge);
  mergeSmartTests(merge);
});
