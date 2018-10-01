/* eslint-env mocha */
const webpackMerge = require('..');
const mergeMultipleTests = require('./merge-multiple-tests');

describe('Multiple merge', () => {
  const merge = webpackMerge.multiple;

  mergeMultipleTests(merge);
});
