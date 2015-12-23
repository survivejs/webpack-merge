/* eslint-env mocha */
const assert = require('assert');
const merge = require('./lib');

describe('Merge', function () {
  it('should override objects', function () {
    const a = {
      foo: 'a'
    };
    const b = {
      foo: 'b'
    };

    assert.deepEqual(merge(a, b), b);
  });

  it('should append arrays', function () {
    const a = {
      foo: ['a']
    };
    const b = {
      foo: ['b']
    };

    assert.deepEqual(merge(a, b), {
      foo: ['a', 'b']
    });
  });

  it('should append arrays without mutating', function () {
    const a = {
      foo: ['a']
    };
    const b = {
      foo: ['b']
    };

    // this should not mutate
    merge(a, b);

    assert.deepEqual(merge(a, b), {
      foo: ['a', 'b']
    });
  });

  it('should override objects of multiple objects', function () {
    const a = {
      foo: 'a'
    };
    const b = {
      foo: 'b'
    };
    const c = {
      foo: 'c'
    };

    assert.deepEqual(merge(a, b, c), c);
  });

  it('should append arrays of multiple objects', function () {
    const a = {
      foo: ['a']
    };
    const b = {
      foo: ['b']
    };
    const c = {
      foo: ['c']
    };

    assert.deepEqual(merge(a, b, c), {
      foo: ['a', 'b', 'c']
    });
  });

  it('should overwride loader string values', function () {
    const a = {
      loaders: [{
        test: /\.js$/,
        loader: 'a'
      }]
    };
    const b = {
      loaders: [{
        test: /\.js$/,
        loader: 'b'
      }, {
        test: /\.css$/,
        loader: 'b'
      }]
    };

    assert.deepEqual(merge(a, b), b);
  });

  it('should append loaders', function () {
    const a = {
      loaders: [{
        test: /\.js$/,
        loaders: ['a']
      }]
    };
    const b = {
      loaders: [{
        test: /\.js$/,
        loaders: ['b']
      }, {
        test: /\.css$/,
        loader: 'b'
      }]
    };

    assert.deepEqual(merge(a, b), {
      loaders: [{
        test: /\.js$/,
        loaders: ['a', 'b']
      }, {
        test: /\.css$/,
        loader: 'b'
      }]
    });
  });

  it('should not duplicate loaders', function () {
    const a = {
      loaders: [{
        test: /\.js$/,
        loaders: ['a']
      }]
    };
    const b = {
      loaders: [{
        test: /\.js$/,
        loaders: ['a', 'b']
      }]
    };

    assert.deepEqual(merge(a, b), {
      loaders: [{
        test: /\.js$/,
        loaders: ['a', 'b']
      }]
    });
  });

  it('should override query options for the same loader', function () {
    const a = {
      loaders: [{
        test: /\.js$/,
        loaders: ['a?1']
      }]
    };
    const b = {
      loaders: [{
        test: /\.js$/,
        loaders: ['a?2', 'b']
      }]
    };
    const c = {
      loaders: [{
        test: /\.js$/,
        loaders: ['a', 'b?3']
      }]
    };

    assert.deepEqual(merge(a, b, c), {
      loaders: [{
        test: /\.js$/,
        loaders: ['a', 'b?3']
      }]
    });
  });

});
