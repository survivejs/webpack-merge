/* eslint-env mocha */
const webpackMerge = require('..');
const normalMergeTests = require('./test-merge');
const mergeTests = require('./merge-tests');

describe('Merge strategy', function () {
  const merge = webpackMerge.strategy;

  normalMergeTests(merge(), 'preLoaders');
  normalMergeTests(merge(), 'loaders');
  normalMergeTests(merge(), 'postLoaders');
  normalMergeTests(merge(), 'rules');
  mergeTests(merge());
});
