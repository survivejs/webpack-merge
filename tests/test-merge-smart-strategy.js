/* eslint-env mocha */
const assert = require('assert');
const webpack = require('webpack');
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


  it('should support merging plugins through configuration', function () {
    const a = {
      plugins: [
        new webpack.LoaderOptionsPlugin({
          options: {
            babel: {
              sourceMaps: true,
              presets: ['es2015']
            }
          }
        })
      ]
    };
    const b = {
      plugins: [
        new webpack.LoaderOptionsPlugin({
          options: {
            babel: {
              presets: ['es2016', 'stage-0']
            }
          }
        })
      ]
    };
    const result = {
      plugins: [
        new webpack.LoaderOptionsPlugin({
          options: {
            babel: {
              sourceMaps: true,
              presets: ['es2015', 'es2016', 'stage-0']
            }
          }
        })
      ]
    };

    // The merged test function can't be compared
    delete a.plugins[0].options.test;
    delete b.plugins[0].options.test;
    delete result.plugins[0].options.test;

    assert.deepEqual(
      merge(
        {},
        ['LoaderOptionsPlugin']
      )(a, b),
      result
    );
  });
}
