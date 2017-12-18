/* eslint-env mocha */
const assert = require('assert');
const webpackMerge = require('..');
const normalMergeTests = require('./test-merge');
const mergeTests = require('./merge-tests');
const mergeStrategyTests = require('./merge-strategy-tests');

describe('Merge strategy', function () {
  const merge = webpackMerge.strategy;

  normalMergeTests(merge());
  mergeTests(merge());
  mergeStrategyTests(merge);
  mergeStrategySpecificTests(merge);
});

function mergeStrategySpecificTests(merge) {
  it('should work with nested arrays and prepend', function () {
    const a = {
      module: {
        loaders: [
          {
            test: /.jsx?$/,
            loaders: ['babel'],
            exclude: /node_modules/
          }
        ]
      }
    };
    const b = {
      module: {
        loaders: [
          {
            test: /.jsx?$/,
            loaders: ['react-hot'],
            exclude: /node_modules/
          }
        ]
      }
    };
    const result = {
      module: {
        loaders: [
          {
            test: /.jsx?$/,
            loaders: ['react-hot'],
            exclude: /node_modules/
          },
          {
            test: /.jsx?$/,
            loaders: ['babel'],
            exclude: /node_modules/
          }
        ]
      }
    };

    assert.deepEqual(merge({
      'module.loaders': 'prepend'
    })(a, b), result);
  });
}
