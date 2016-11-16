/* eslint-env mocha */
const assert = require('assert');

function mergeTests(merge) {
  it('should append arrays of multiple objects by default', function () {
    const a = {
      foo: ['a']
    };
    const b = {
      foo: ['b']
    };
    const c = {
      foo: ['c']
    };
    const result = {
      foo: ['a', 'b', 'c']
    };

    assert.deepEqual(merge(a, b, c), result);
  });

  it('should override objects', function () {
    const a = {
      foo: 'a'
    };
    const result = {
      foo: 'b'
    };

    assert.deepEqual(merge(a, result), result);
  });

  it('should append arrays by default', function () {
    const a = {
      foo: ['a']
    };
    const b = {
      foo: ['b']
    };
    const result = {
      foo: ['a', 'b']
    };

    assert.deepEqual(merge(a, b), result);
  });

  it('should append arrays without mutating', function () {
    const a = {
      foo: ['a']
    };
    const b = {
      foo: ['b']
    };
    const result = {
      foo: ['a', 'b']
    };

    // this should not mutate
    merge(a, b);

    assert.deepEqual(merge(a, b), result);
  });

  it('should override objects of multiple objects', function () {
    const a = {
      foo: 'a'
    };
    const b = {
      foo: 'b'
    };
    const result = {
      foo: 'c'
    };

    assert.deepEqual(merge(a, b, result), result);
  });

  it('should deeply merge objects', function () {
    const a = {
      foo: { bar: 'a' }
    };
    const b = {
      foo: { baz: 'b' }
    };
    const result = {
      foo: {
        bar: 'a',
        baz: 'b'
      }
    };

    assert.deepEqual(merge(a, b), result);
  });

  it('should not error when there are no matching loaders', function () {
    const a = {
      loaders: [{
        test: /\.js$/,
        loader: 'a'
      }]
    };
    const b = {
      loaders: [{
        test: /\.css$/,
        loader: 'b'
      }]
    };
    const result = {
      loaders: [{
        test: /\.js$/,
        loader: 'a'
      }, {
        test: /\.css$/,
        loader: 'b'
      }]
    };

    assert.deepEqual(merge(a, b), result);
  });

  it('should not mutate inputs', function () {
    const a = {
      output: {
        filename: 'bundle.js'
      }
    };
    const b = {
      output: {
        path: 'path/b'
      }
    };

    const aClone = JSON.parse(JSON.stringify(a));
    merge({}, a, b);

    assert.deepEqual(a, aClone);
  });

  it('should allow overriding with an empty array', function () {
    const a = {
      entry: ['foo']
    };
    const b = {
      entry: []
    };

    assert.deepEqual(merge(a, b), b);
  });

  it('should allow overriding with an empty object', function () {
    const a = {
      entry: {
        a: 'foo'
      }
    };
    const b = {
      entry: {}
    };

    assert.deepEqual(merge(a, b), b);
  });
}

module.exports = mergeTests;
