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

    assert.deepEqual(merge(a, b), {foo: ['a', 'b']});
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

    assert.deepEqual(merge(a, b), {foo: ['a', 'b']});
  });
});
