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
    const result = {
      module: {}
    };
    result.module[loadersKey] = [{
      test: /\.css$/,
      loader: 'b'
    }, {
      test: /\.sass$/,
      loader: 'b'
    }, {
      test: /\.js$/,
      loader: 'a'
    }, {
      test: /\.jade$/,
      loader: 'a'
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
      loader: 'b'
    }, {
      test: /\.css$/,
      loader: 'b'
    }, {
      test: /\.js$/,
      loader: 'a'
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
      loaders: ['b']
    }, {
      test: /\.css$/,
      loader: 'b'
    }, {
      test: /\.js$/,
      loaders: ['a']
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
      loaders: ['a', 'b']
    }, {
      test: /\.js$/,
      loaders: ['a']
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
      loaders: ['a', 'b?3']
    }, {
      test: /\.js$/,
      loaders: ['a?2', 'b']
    }, {
      test: /\.js$/,
      loaders: ['a?1']
    }];

    assert.deepEqual(merge(a, b, c), result);
  });
}

function smartMergeTests(merge, loadersKey) {
  it('should override loader string values with ' + loadersKey, function () {
    const a = {};
    a[loadersKey] = [{
      test: /\.js$/,
      loader: 'a'
    }];
    const result = {};
    result[loadersKey] = [{
      test: /\.js$/,
      loader: 'b'
    }, {
      test: /\.css$/,
      loader: 'b'
    }];

    assert.deepEqual(merge(a, result), result);
  });

  it('should prepend loaders with ' + loadersKey, function () {
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
      // loaders are evaluated from right to left so it makes sense to
      // prepend here!!! this is an exception given normally we want to
      // append instead. without this the loader order doesn't make
      // any sense in this case
      loaders: ['b', 'a']
    }, {
      test: /\.css$/,
      loader: 'b'
    }];

    assert.deepEqual(merge(a, b), result);
  });

  it('should prepend loader and loaders with ' + loadersKey, function () {
    const a = {};
    a[loadersKey] = [{
      test: /\.js$/,
      loader: 'a'
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
      // loaders are evaluated from right to left so it makes sense to
      // prepend here!!! this is an exception given normally we want to
      // append instead. without this the loader order doesn't make
      // any sense in this case
      loaders: ['b', 'a']
    }, {
      test: /\.css$/,
      loader: 'b'
    }];

    assert.deepEqual(merge(a, b), result);
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
    const result = {};
    result[loadersKey] = [{
      test: /\.js$/,
      loaders: ['a', 'b']
    }];

    assert.deepEqual(merge(a, b), result);
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
    const result = {};
    result[loadersKey] = [{
      test: /\.js$/,
      loaders: ['a', 'b?3']
    }];

    assert.deepEqual(merge(a, b, c), result);
  });

  it('should merge module.loaders for ' + loadersKey, function () {
    const common = {
      module: {}
    };
    common.module[loadersKey] = [
      {
        test: /\.jsx?$/,
        loaders: ['eslint']
      }
    ];
    const isparta = {
      module: {}
    };
    isparta.module[loadersKey] = [
      {
        test: /\.jsx?$/,
        loaders: ['isparta-instrumenter']
      }
    ];
    const result = {
      module: {}
    };
    result.module[loadersKey] = [
      {
        test: /\.jsx?$/,
        loaders: ['isparta-instrumenter', 'eslint']
      }
    ];

    assert.deepEqual(merge(common, isparta), result);
  });

  it('should not merge if a loader has include for ' + loadersKey, function () {
    // these shouldn't be merged because `include` is defined.
    // instead, it should prepend to guarantee sane evaluation order
    const common = {
      module: {}
    };
    common.module[loadersKey] = [
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        include: [
          'foo',
          'bar'
        ]
      }
    ];
    const isparta = {
      module: {}
    };
    isparta.module[loadersKey] = [
      {
        test: /\.jsx?$/,
        loaders: ['isparta-instrumenter'],
        include: 'baz'
      }
    ];
    const result = {
      module: {}
    };
    result.module[loadersKey] = [
      {
        test: /\.jsx?$/,
        loaders: ['isparta-instrumenter'],
        include: 'baz'
      },
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        include: [
          'foo',
          'bar'
        ]
      }
    ];

    assert.deepEqual(merge(common, isparta), result);
  });

  it('should not merge if a loader has exclude for ' + loadersKey, function () {
    // these shouldn't be merged because `exclude` is defined.
    // instead, it should prepend to guarantee sane evaluation order
    const common = {
      module: {}
    };
    common.module[loadersKey] = [
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        exclude: [
          'foo',
          'bar'
        ]
      }
    ];
    const isparta = {
      module: {}
    };
    isparta.module[loadersKey] = [
      {
        test: /\.jsx?$/,
        loaders: ['isparta-instrumenter'],
        exclude: 'baz'
      }
    ];
    const result = {
      module: {}
    };
    result.module[loadersKey] = [
      {
        test: /\.jsx?$/,
        loaders: ['isparta-instrumenter'],
        exclude: 'baz'
      },
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        exclude: [
          'foo',
          'bar'
        ]
      }
    ];

    assert.deepEqual(merge(common, isparta), result);
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
    const result = {
      foo: ['c', 'b', 'a']
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

  it('should append arrays', function () {
    const a = {
      foo: ['a']
    };
    const b = {
      foo: ['b']
    };
    const result = {
      foo: ['b', 'a']
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
      foo: ['b', 'a']
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
}
