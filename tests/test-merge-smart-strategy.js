/* eslint-env mocha */
const assert = require('assert');
const webpackMerge = require('..');
const mergeTests = require('./merge-tests');
const mergeSmartTests = require('./merge-smart-tests');
const mergeStrategyTests = require('./merge-strategy-tests');

describe('Smart merge strategy', function () {
  const merge = webpackMerge.smartStrategy;

  mergeTests(merge());
  mergeSmartTests(merge());
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
            loaders: ['react-hot', 'babel'],
            exclude: /node_modules/
          }
        ]
      }
    };

    assert.deepEqual(merge({
      'module.loaders': 'prepend'
    })(a, b), result);
  });

  it('should work with nested arrays and replace', function () {
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
          }
        ]
      }
    };

    assert.deepEqual(merge({
      'module.loaders': 'replace'
    })(a, b), result);
  });
}
