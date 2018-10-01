/* eslint-env mocha */
const assert = require('assert');
const webpack = require('webpack');
const merge = require('..');

describe('Unique', () => {
  test('should allow unique definitions', () => {
    const output = merge({
      customizeArray: merge.unique(
        'plugins',
        ['HotModuleReplacementPlugin'],
        plugin => plugin.constructor && plugin.constructor.name
      )
    })({
      plugins: [
        new webpack.HotModuleReplacementPlugin()
      ]
    }, {
      plugins: [
        new webpack.HotModuleReplacementPlugin()
      ]
    });
    const expected = {
      plugins: [
        new webpack.HotModuleReplacementPlugin()
      ]
    };

    assert.deepEqual(output, expected);
  });
});

