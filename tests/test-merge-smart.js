/* eslint-env mocha */
const assert = require('assert');
const webpackMerge = require('..');
const mergeTests = require('./merge-tests');

describe('Smart merge', function () {
  const merge = webpackMerge.smart;

  smartMergeIssueTest(merge);
  smartMergeTests(merge, 'preLoaders');
  smartMergeTests(merge, 'loaders');
  smartMergeTests(merge, 'postLoaders');
  smartMergeTests(merge, 'rules');
  mergeTests(merge);
});

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
    const result = {};
    result[loadersKey] = [{
      test: /\.js$/,
      // loaders are evaluated from right to left so it makes sense to
      // prepend here!!! this is an exception given normally we want to
      // append instead. without this the loader order doesn't make
      // any sense in this case
      loaders: ['a', 'b']
    }, {
      test: /\.css$/,
      loader: 'b'
    }];

    assert.deepEqual(merge(a, b), result);
  });

  it('should compare loaders by their whole name with ' + loadersKey, function () {
    const a = {};
    a[loadersKey] = [{
      test: /\.js$/,
      loaders: ['aa']
    }];
    const b = {};
    b[loadersKey] = [{
      test: /\.js$/,
      loaders: ['ab']
    }];
    const result = {};
    result[loadersKey] = [{
      test: /\.js$/,
      loaders: ['aa', 'ab']
    }];

    assert.deepEqual(merge(a, b), result);
  });

  it('should be able to merge loaders referenced by path with ' + loadersKey, function () {
    const a = {};
    a[loadersKey] = [{
      test: /\.js$/,
      loaders: ['/foo/bar-a.js?a=b']
    }];
    const b = {};
    b[loadersKey] = [{
      test: /\.js$/,
      loaders: ['/foo/bar-b.js?c=d']
    }];
    const result = {};
    result[loadersKey] = [{
      test: /\.js$/,
      // loaders are evaluated from right to left so it makes sense to
      // append here
      loaders: ['/foo/bar-a.js?a=b', '/foo/bar-b.js?c=d']
    }];

    assert.deepEqual(merge(a, b), result);
  });

  it('should append loader and loaders with ' + loadersKey, function () {
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
      // append here so that last one added wins
      loaders: ['a', 'b']
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

  it('should override loaders with props include ' + loadersKey, function () {
    const a = {};
    a[loadersKey] = [{
      test: /\.js$/,
      loaders: ['a'],
      include: './path'
    }];
    const b = {};
    b[loadersKey] = [{
      test: /\.js$/,
      loaders: ['a', 'b']
    }];
    const result = {};
    result[loadersKey] = [{
      test: /\.js$/,
      loaders: ['a', 'b'],
      include: './path'
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
        loaders: ['eslint', 'isparta-instrumenter']
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
        loaders: ['eslint'],
        include: [
          'foo',
          'bar'
        ]
      },
      {
        test: /\.jsx?$/,
        loaders: ['isparta-instrumenter'],
        include: 'baz'
      }
    ];

    assert.deepEqual(merge(common, isparta), result);
  });

  it('should not merge if a loader has include and string loader values for ' + loadersKey, function () {
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
        loader: 'isparta-instrumenter',
        include: 'baz'
      }
    ];
    const result = {
      module: {}
    };
    result.module[loadersKey] = [
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        include: [
          'foo',
          'bar'
        ]
      },
      {
        test: /\.jsx?$/,
        loader: 'isparta-instrumenter',
        include: 'baz'
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
        loaders: ['eslint'],
        exclude: [
          'foo',
          'bar'
        ]
      },
      {
        test: /\.jsx?$/,
        loaders: ['isparta-instrumenter'],
        exclude: 'baz'
      }
    ];

    assert.deepEqual(merge(common, isparta), result);
  });

  it('should not merge if a loader has exclude and string loader values for ' + loadersKey, function () {
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
        loader: 'isparta-instrumenter',
        exclude: 'baz'
      }
    ];
    const result = {
      module: {}
    };
    result.module[loadersKey] = [
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        exclude: [
          'foo',
          'bar'
        ]
      },
      {
        test: /\.jsx?$/,
        loader: 'isparta-instrumenter',
        exclude: 'baz'
      }
    ];

    assert.deepEqual(merge(common, isparta), result);
  });

  it('should use parent include/exclude for ' + loadersKey, function () {
    const common = {
      module: {}
    };
    common.module[loadersKey] = [
      {
        test: /\.js$/,
        include: [
          'apps',
          'lib',
          'thirdparty'
        ],
        exclude: /node_modules/,
        loaders: ['babel']
      }
    ];
    const strip = {
      module: {}
    };
    strip.module[loadersKey] = [
      {
        test: /\.js$/,
        loaders: ['strip?strip[]=debug']
      }
    ];
    const result = {
      module: {}
    };
    result.module[loadersKey] = [
      {
        test: /\.js$/,
        loaders: ['babel', 'strip?strip[]=debug'],
        include: [
          'apps',
          'lib',
          'thirdparty'
        ],
        exclude: /node_modules/
      }
    ];

    assert.deepEqual(merge(common, strip), result);
  });

  it('should use parent include/exclude even if only loader string is specified for ' + loadersKey, function () {
    const common = {
      module: {}
    };
    common.module[loadersKey] = [
      {
        test: /\.js$/,
        include: [
          'apps',
          'lib',
          'thirdparty'
        ],
        exclude: /node_modules/,
        loaders: 'eslint'
      }
    ];
    const eslint = {
      module: {}
    };
    eslint.module[loadersKey] = [
      {
        test: /\.js$/,
        loader: 'eslint',
        query: {
          rules: {
            'no-debugger': 0
          }
        }
      }
    ];
    const result = {
      module: {}
    };
    result.module[loadersKey] = [
      {
        test: /\.js$/,
        loader: 'eslint',
        query: {
          rules: {
            'no-debugger': 0
          }
        },
        include: [
          'apps',
          'lib',
          'thirdparty'
        ],
        exclude: /node_modules/
      }
    ];

    assert.deepEqual(merge(common, eslint), result);
  });
}

function smartMergeIssueTest(merge) {
  it('should merge with matching exclude and loaders', function () {
    const a = {
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loaders: ['babel']
          }
        ]
      }
    };
    const b = {
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loaders: ['coffee', 'foo']
          }
        ]
      }
    };
    const result = {
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loaders: ['babel', 'coffee', 'foo']
          }
        ]
      }
    };

    assert.deepEqual(merge(a, b), result);
  });
}
