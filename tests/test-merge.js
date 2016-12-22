/* eslint-env mocha */
const assert = require('assert');
const webpackMerge = require('..');
const mergeTests = require('./merge-tests');
const loadersKeys = require('./loaders-keys');

describe('Merge', function () {
  const merge = webpackMerge;

  normalMergeTests(merge);
  mergeTests(merge);
  customizeMergeTests(merge);
});

function normalMergeTests(merge) {
  loadersKeys.forEach(function (loadersKey) {
    normalMergeTest(merge, loadersKey);
  });
}

function normalMergeTest(merge, loadersKey) {
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

  it('should not allow overriding with an empty array in ' + loadersKey, function () {
    const a = {};
    a[loadersKey] = [{
      test: /\.js$/,
      loaders: ['a?1']
    }];
    const b = {};
    b[loadersKey] = [];

    assert.deepEqual(merge(a, b), a);
  });
}

function customizeMergeTests(merge) {
  it('should allow overriding array behavior', function () {
    const first = {
      entry: ['a']
    };
    const second = {
      entry: ['b']
    };

    assert.deepEqual(merge({
      customizeArray(a) { return a; }
    })(first, second), first);
  });

  it('should allow overriding object behavior', function () {
    const first = {
      entry: {
        a: 'foo'
      }
    };
    const second = {
      entry: {
        a: 'bar'
      }
    };

    assert.deepEqual(merge({
      customizeObject(a) { return a; }
    })(first, second), first);
  });
}

module.exports = normalMergeTests;
