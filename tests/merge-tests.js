/* eslint-env mocha */
const assert = require('assert');

function mergeTests(merge) {
  it('should return the same config', function () {
    const config = {
      entry: {
        app: 'app'
      },
      output: {
        path: 'build',
        filename: '[name].js'
      },
      plugins: []
    };

    assert.deepEqual(merge(config), config);
  });

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

  it('should work with an array of objects', function () {
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

    assert.deepEqual(merge([a, b, c]), result);
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

  it('should not allow overriding with an empty array', function () {
    const a = {
      entry: ['foo']
    };
    const b = {
      entry: []
    };

    assert.deepEqual(merge(a, b), a);
  });

  it('should not allow overriding with an empty object', function () {
    const a = {
      entry: {
        a: 'foo'
      }
    };
    const b = {
      entry: {}
    };

    assert.deepEqual(merge(a, b), a);
  });

  it('should merge functions that return arrays', function () {
    const a = {
      postcss() {
        return ['a'];
      }
    };
    const b = {
      postcss() {
        return ['b'];
      }
    };
    const expected = ['a', 'b'];

    assert.deepEqual(merge(a, b).postcss(), expected);
  });

  it('should merge functions that return objects', function () {
    const a = {
      postcss() {
        return {
          a: 'foo'
        };
      }
    };
    const b = {
      postcss() {
        return {
          b: 'bar'
        };
      }
    };
    const expected = {
      a: 'foo',
      b: 'bar'
    };

    assert.deepEqual(merge(a, b).postcss(), expected);
  });

  it('should merge functions that take arguments', function () {
    const a = {
      postcss(arg) {
        return [arg];
      }
    };
    const b = {
      postcss(arg) {
        return [arg + 1, arg + 2];
      }
    };
    const expected = ['a', 'a1', 'a2'];

    assert.deepEqual(merge(a, b).postcss('a'), expected);
  });

  it('should not mutate inputs with mismatched keys', function () {
    const a = {
      entry: {}
    };

    const b = {};

    const aClone = JSON.parse(JSON.stringify(a));
    const config = merge({}, a, b);

    config.entry.main = 'src/index.js';

    assert.deepEqual(a, aClone);
  });
}

module.exports = mergeTests;
