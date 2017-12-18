/* eslint-env mocha */
const webpackMerge = require('..');
const mergeMultipleTests = require('./merge-multiple-tests');

describe('Multiple merge', function () {
  const merge = webpackMerge.multiple;

  mergeMultipleTests(merge);
});
