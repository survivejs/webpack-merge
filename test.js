'use strict';
var assert = require('assert');

var merge = require('./');

describe('Merge', function() {
  it('should override objects', function() {
    var a = {
      foo: 'a',
    };
    var b = {
      foo: 'b'
    };

    assert.deepEqual(merge(a, b), b);
  });

  it('should append arrays', function() {
    var a = {
      foo: ['a'],
    };
    var b = {
      foo: ['b'],
    };

    assert.deepEqual(merge(a, b), {
      foo: ['a', 'b']
    });
  });

  it('should append arrays without mutating', function() {
    var a = {
      foo: ['a'],
    };
    var b = {
      foo: ['b'],
    };

    // this should not mutate
    merge(a, b);

    assert.deepEqual(merge(a, b), {
      foo: ['a', 'b']
    });
  });

  it('should override objects of multiple objects', function() {
    var a = {
      foo: 'a',
    };
    var b = {
      foo: 'b'
    };
    var c = {
      foo: 'c',
    };

    assert.deepEqual(merge(a, b, c), c);
  });

  it('should append arrays of multiple objects', function() {
    var a = {
      foo: ['a'],
    };
    var b = {
      foo: ['b'],
    };
    var c = {
      foo: ['c'],
    };

    assert.deepEqual(merge(a, b, c), {
      foo: ['a', 'b', 'c']
    });
  });
});
