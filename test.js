/* eslint-env mocha */
const assert = require('assert');
const webpackMerge = require('./lib');

describe('Merge', function () {
  const merge = webpackMerge;

  normalMergeTests(merge, 'preLoaders');
  normalMergeTests(merge, 'loaders');
  normalMergeTests(merge, 'postLoaders');
  mergeTests(merge);
});

describe('Smart merge', function () {
  const merge = webpackMerge.smart;

  smartMergeTests(merge, 'preLoaders');
  smartMergeTests(merge, 'loaders');
  smartMergeTests(merge, 'postLoaders');
  mergeTests(merge);
});

function normalMergeTests(merge, loadersKey) {
  it('should merge recursive structures correctly with ' + loadersKey, function () {
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
    const c = {
      module: {}
    };
    c.module[loadersKey] = [{
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

    assert.deepEqual(merge(a, b), c);
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
    const c = {};
    c[loadersKey] = [{
      test: /\.js$/,
      loader: 'a'
    }, {
      test: /\.js$/,
      loader: 'b'
    }, {
      test: /\.css$/,
      loader: 'b'
    }];

    assert.deepEqual(merge(a, b), c);
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
    const c = {};
    c[loadersKey] = [{
      test: /\.js$/,
      loaders: ['a']
    }, {
      test: /\.js$/,
      loaders: ['b']
    }, {
      test: /\.css$/,
      loader: 'b'
    }];

    assert.deepEqual(merge(a, b), c);
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
    const c = {};
    c[loadersKey] = [{
      test: /\.js$/,
      loaders: ['a']
    }, {
      test: /\.js$/,
      loaders: ['a', 'b']
    }];

    assert.deepEqual(merge(a, b), c);
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
    const d = {};
    d[loadersKey] = [{
      test: /\.js$/,
      loaders: ['a?1']
    }, {
      test: /\.js$/,
      loaders: ['a?2', 'b']
    }, {
      test: /\.js$/,
      loaders: ['a', 'b?3']
    }];

    assert.deepEqual(merge(a, b, c), d);
  });
}

function smartMergeTests(merge, loadersKey) {
  it('should override loader string values with ' + loadersKey, function () {
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

    assert.deepEqual(merge(a, b), b);
  });

  it('should append loaders with ' + loadersKey, function () {
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
    const c = {};
    c[loadersKey] = [{
      test: /\.js$/,
      loaders: ['a', 'b']
    }, {
      test: /\.css$/,
      loader: 'b'
    }];

    assert.deepEqual(merge(a, b), c);
  });

  it('should not duplicate loaders with ' + loadersKey, function () {
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
    const c = {};
    c[loadersKey] = [{
      test: /\.js$/,
      loaders: ['a', 'b']
    }];

    assert.deepEqual(merge(a, b), c);
  });

  it('should override query options for the same loader with ' + loadersKey, function () {
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
    const d = {};
    d[loadersKey] = [{
      test: /\.js$/,
      loaders: ['a', 'b?3']
    }];

    assert.deepEqual(merge(a, b, c), d);
  });
}

function mergeTests(merge) {
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
}
