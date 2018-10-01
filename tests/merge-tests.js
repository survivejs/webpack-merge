/* eslint-env mocha */
const assert = require('assert');

function mergeTests(merge) {
  test('should return the same config', () => {
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

  test('should append arrays of multiple objects by default', () => {
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

  test('should work with an array of objects', () => {
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

  test('should override objects', () => {
    const a = {
      foo: 'a'
    };
    const result = {
      foo: 'b'
    };

    assert.deepEqual(merge(a, result), result);
  });

  test('should append arrays by default', () => {
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

  test('should append arrays without mutating', () => {
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

  test('should override objects of multiple objects', () => {
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

  test('should deeply merge objects', () => {
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

  test('should not error when there are no matching loaders', () => {
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

  test('should not mutate inputs', () => {
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

  test('should not allow overriding with an empty array', () => {
    const a = {
      entry: ['foo']
    };
    const b = {
      entry: []
    };

    assert.deepEqual(merge(a, b), a);
  });

  test('should not allow overriding with an empty object', () => {
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

  test('should merge functions that return arrays', () => {
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

  test('should merge functions that return objects', () => {
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

  test('should merge functions that take arguments', () => {
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

  test('should not mutate inputs with mismatched keys', () => {
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
