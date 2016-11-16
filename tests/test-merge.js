/* eslint-env mocha */
const assert = require('assert');
const webpackMerge = require('..');
const mergeTests = require('./merge-tests');

describe('Merge', function () {
  const merge = webpackMerge;

  normalMergeTests(merge, 'preLoaders');
  normalMergeTests(merge, 'loaders');
  normalMergeTests(merge, 'postLoaders');
  normalMergeTests(merge, 'rules');
  mergeTests(merge);
});

function normalMergeTests(merge, loadersKey) {
  it('should append recursive structures with ' + loadersKey, function () {
    const a = {
      module: {}
    };
    a.module[loadersKey] = [{
      test: /\.js$/,
      loader: 'a'
    }, {
      test: /\.jade$/,
      loader: 'a'
    }];
    const b = {
      module: {}
    };
    b.module[loadersKey] = [{
      test: /\.css$/,
      loader: 'b'
    }, {
      test: /\.sass$/,
      loader: 'b'
    }];
    const result = {
      module: {}
    };
    result.module[loadersKey] = [{
      test: /\.js$/,
      loader: 'a'
    }, {
      test: /\.jade$/,
      loader: 'a'
    }, {
      test: /\.css$/,
      loader: 'b'
    }, {
      test: /\.sass$/,
      loader: 'b'
    }];

    assert.deepEqual(merge(a, b), result);
  });

  it('should not override loader string values with ' + loadersKey, function () {
    const a = {};
    a[loadersKey] = [{
      test: /\.js$/,
      loader: 'a'
    }];
    const b = {};
    b[loadersKey] = [{
      test: /\.js$/,
      loader: 'b'
    }, {
      test: /\.css$/,
      loader: 'b'
    }];
    const result = {};
    result[loadersKey] = [{
      test: /\.js$/,
      loader: 'a'
    }, {
      test: /\.js$/,
      loader: 'b'
    }, {
      test: /\.css$/,
      loader: 'b'
    }];

    assert.deepEqual(merge(a, b), result);
  });

  it('should not append loaders with ' + loadersKey, function () {
    const a = {};
    a[loadersKey] = [{
      test: /\.js$/,
      loaders: ['a']
    }];
    const b = {};
    b[loadersKey] = [{
      test: /\.js$/,
      loaders: ['b']
    }, {
      test: /\.css$/,
      loader: 'b'
    }];
    const result = {};
    result[loadersKey] = [{
      test: /\.js$/,
      loaders: ['a']
    }, {
      test: /\.js$/,
      loaders: ['b']
    }, {
      test: /\.css$/,
      loader: 'b'
    }];

    assert.deepEqual(merge(a, b), result);
  });

  it('should duplicate loaders with ' + loadersKey, function () {
    const a = {};
    a[loadersKey] = [{
      test: /\.js$/,
      loaders: ['a']
    }];
    const b = {};
    b[loadersKey] = [{
      test: /\.js$/,
      loaders: ['a', 'b']
    }];
    const result = {};
    result[loadersKey] = [{
      test: /\.js$/,
      loaders: ['a']
    }, {
      test: /\.js$/,
      loaders: ['a', 'b']
    }];

    assert.deepEqual(merge(a, b), result);
  });

  it('should not override query options for the same loader with ' + loadersKey, function () {
    const a = {};
    a[loadersKey] = [{
      test: /\.js$/,
      loaders: ['a?1']
    }];
    const b = {};
    b[loadersKey] = [{
      test: /\.js$/,
      loaders: ['a?2', 'b']
    }];
    const c = {};
    c[loadersKey] = [{
      test: /\.js$/,
      loaders: ['a', 'b?3']
    }];
    const result = {};
    result[loadersKey] = [{
      test: /\.js$/,
      loaders: ['a?1']
    }, {
      test: /\.js$/,
      loaders: ['a?2', 'b']
    }, {
      test: /\.js$/,
      loaders: ['a', 'b?3']
    }];

    assert.deepEqual(merge(a, b, c), result);
  });

  it('should allow overriding with an empty array in ' + loadersKey, function () {
    const a = {};
    a[loadersKey] = [{
      test: /\.js$/,
      loaders: ['a?1']
    }];
    const b = {};
    b[loadersKey] = [];
    const result = {};
    result[loadersKey] = [];

    assert.deepEqual(merge(a, b), result);
  });
}

module.exports = normalMergeTests;
