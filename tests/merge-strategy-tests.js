/* eslint-env mocha */
const assert = require('assert');

function mergeStrategyTests(merge) {
  it('should allow setting to array append', function () {
    const a = {
      entry: ['foo', 'bar', 'baz']
    };
    const b = {
      entry: ['zoo']
    };
    const result = {
      entry: ['foo', 'bar', 'baz', 'zoo']
    };

    assert.deepEqual(merge({
      entry: 'append'
    })(a, b), result);
  });

  it('should allow setting to array prepend', function () {
    const a = {
      entry: ['foo', 'bar', 'baz']
    };
    const b = {
      entry: ['zoo']
    };
    const result = {
      entry: ['zoo', 'foo', 'bar', 'baz']
    };

    assert.deepEqual(merge({
      entry: 'prepend'
    })(a, b), result);
  });

  it('should allow setting to object append', function () {
    const a = {
      entry: {
        foo: 'bar'
      }
    };
    const b = {
      entry: {
        bar: 'baz'
      }
    };
    const result = {
      entry: {
        foo: 'bar',
        bar: 'baz'
      }
    };

    assert.deepEqual(
      Object.keys(merge({
        entry: 'append'
      })(a, b).entry),
      Object.keys(result.entry)
    );
  });

  it('should allow setting to object prepend', function () {
    const a = {
      entry: {
        foo: 'bar'
      }
    };
    const b = {
      entry: {
        bar: 'baz'
      }
    };
    const result = {
      entry: {
        bar: 'baz',
        foo: 'bar'
      }
    };

    assert.deepEqual(
      Object.keys(merge({
        entry: 'prepend'
      })(a, b).entry),
      Object.keys(result.entry)
    );
  });

  it('should allow replace strategy for arrays', function () {
    const a = {
      entry: [
        'foo'
      ]
    };
    const b = {
      entry: [
        'bar'
      ]
    };
    const result = {
      entry: [
        'bar'
      ]
    };

    assert.deepEqual(
      Object.keys(merge({
        entry: 'replace'
      })(a, b).entry),
      Object.keys(result.entry)
    );
  });

  it('should allow replace strategy for objects', function () {
    const a = {
      entry: {
        foo: 'bar'
      }
    };
    const b = {
      entry: {
        bar: 'baz'
      }
    };
    const result = {
      entry: {
        bar: 'baz'
      }
    };

    assert.deepEqual(
      Object.keys(merge({
        entry: 'replace'
      })(a, b).entry),
      Object.keys(result.entry)
    );
  });
}

module.exports = mergeStrategyTests;
