/* eslint-env mocha */
const assert = require('assert');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const loadersKeys = require('./loaders-keys');

function mergeSmartTests(merge) {
  commonTests(merge);

  loadersKeys.forEach(function (loadersKey) {
    mergeSmartTest(merge, loadersKey);
  });
}

function commonTests(merge) {
  test('should not merge if enforce rules are different (#65)', () => {
    const a = {
      module: {
        rules: [
          {
            test: /\.vue$/,
            loader: 'eslint-loader',
            enforce: 'pre',
            exclude: /node_modules/
          }
        ]
      }
    };
    const b = {
      module: {
        rules: [
          {
            test: /\.vue$/,
            loader: 'vue-loader'
          }
        ]
      }
    };
    const result = {
      module: {
        rules: [
          {
            test: /\.vue$/,
            loader: 'eslint-loader',
            enforce: 'pre',
            exclude: /node_modules/
          },
          {
            test: /\.vue$/,
            loader: 'vue-loader'
          }
        ]
      }
    };

    assert.deepEqual(merge(a, b), result);
  });

  test('should not merge if enforce rules are different II (#65)', () => {
    const a = {
      module: {
        rules: [
          {
            test: /\.vue$/,
            loader: 'vue-loader'
          }
        ]
      }
    };
    const b = {
      module: {
        rules: [
          {
            test: /\.vue$/,
            loader: 'eslint-loader',
            enforce: 'pre',
            exclude: /node_modules/
          }
        ]
      }
    };
    const result = {
      module: {
        rules: [
          {
            test: /\.vue$/,
            loader: 'vue-loader'
          },
          {
            test: /\.vue$/,
            loader: 'eslint-loader',
            enforce: 'pre',
            exclude: /node_modules/
          }
        ]
      }
    };

    assert.deepEqual(merge(a, b), result);
  });


  test('should merge with matching exclude and loaders', () => {
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

  test(
    'in lists with matching `test` properties, should merge with matching exclude and loaders',
    () => {
      const a = {
        module: {
          loaders: [
            {
              test: /\.js$/,
              include: './src',
              loaders: ['babel']
            },
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
              include: './src',
              loaders: ['babel']
            },
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loaders: ['babel', 'coffee', 'foo']
            }
          ]
        }
      };

      assert.deepEqual(merge(a, b), result);
    }
  );

  test('should not lose CopyWebpackPlugin (#56)', () => {
    const a = {
      plugins: [
        new CopyWebpackPlugin()
      ]
    };
    const b = {
      plugins: [
        new webpack.optimize.UglifyJsPlugin()
      ]
    };
    const merged = merge(a, b);

    assert.equal(merged.plugins.length, 2);
    // CopyWebpackPlugin is actually a function that gets applied above
    assert.ok(merged.plugins[0].apply);
    assert.equal(merged.plugins[1].constructor.name, 'UglifyJsPlugin');
  });
}

function mergeSmartTest(merge, loadersKey) {
  test('should override loader string values with ' + loadersKey, () => {
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

  test(
    'should not merge to parent if there is no include for ' + loadersKey + ' #68',
    () => {
      const common = {
        module: {}
      };
      common.module[loadersKey] = [
        {
          test: /\.js$/,
          loaders: ['babel'],
          include: 'apps'
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
          loaders: ['babel'],
          include: 'apps'
        },
        {
          test: /\.js$/,
          loaders: ['strip?strip[]=debug']
        }
      ];

      assert.deepEqual(merge(common, strip), result);
    }
  );

  test(
    'should not merge to parent if there is no exclude for ' + loadersKey + ' #68',
    () => {
      const common = {
        module: {}
      };
      common.module[loadersKey] = [
        {
          test: /\.js$/,
          loaders: ['babel'],
          exclude: 'apps'
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
          loaders: ['babel'],
          exclude: 'apps'
        },
        {
          test: /\.js$/,
          loaders: ['strip?strip[]=debug']
        }
      ];

      assert.deepEqual(merge(common, strip), result);
    }
  );

  test('should append loaders with ' + loadersKey, () => {
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

  test(
    'should compare loaders by their whole name with ' + loadersKey,
    () => {
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
    }
  );

  test(
    'should be able to merge loaders referenced by path with ' + loadersKey,
    () => {
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
    }
  );

  test('should append loader and loaders with ' + loadersKey, () => {
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

  test('should not duplicate loaders with ' + loadersKey, () => {
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

  test(
    'should not override loaders with props include ' + loadersKey,
    () => {
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
        loaders: ['a'],
        include: './path'
      }, {
        test: /\.js$/,
        loaders: ['a', 'b']
      }];

      assert.deepEqual(merge(a, b), result);
    }
  );

  test(
    'should override query options for the same loader with ' + loadersKey,
    () => {
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
    }
  );

  test('should merge module.loaders for ' + loadersKey, () => {
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

  test(
    'should not merge if a loader has include for ' + loadersKey,
    () => {
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
    }
  );

  test(
    'should not merge if a loader has include and string loader values for ' + loadersKey,
    () => {
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
    }
  );

  test(
    'should not merge if a loader has exclude for ' + loadersKey,
    () => {
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
    }
  );

  test(
    'should not merge if a loader has exclude and string loader values for ' + loadersKey,
    () => {
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
    }
  );

  test('should not use parent include/exclude for ' + loadersKey, () => {
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
        include: [
          'apps',
          'lib',
          'thirdparty'
        ],
        exclude: /node_modules/,
        loaders: ['babel']
      },
      {
        test: /\.js$/,
        loaders: ['strip?strip[]=debug']
      }
    ];

    assert.deepEqual(merge(common, strip), result);
  });

  test(
    'should not use parent include/exclude even if only loader string is specified for ' + loadersKey,
    () => {
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
          include: [
            'apps',
            'lib',
            'thirdparty'
          ],
          exclude: /node_modules/,
          loaders: 'eslint'
        },
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

      assert.deepEqual(merge(common, eslint), result);
    }
  );

  test('should respect a new order for ' + loadersKey, () => {
    const common = {
      module: {}
    };
    common.module[loadersKey] = [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ];
    const extractText = {
      module: {}
    };
    extractText.module[loadersKey] = [
      {
        test: /\.css$/,
        use: [
          'extract-text',
          'style-loader',
          'css-loader'
        ]
      }
    ];
    const result = {
      module: {}
    };
    result.module[loadersKey] = [
      {
        test: /\.css$/,
        use: [
          'extract-text',
          'style-loader',
          'css-loader'
        ]
      }
    ];

    assert.deepEqual(merge(common, extractText), result);
  });

  test('should respect the existing order for ' + loadersKey, () => {
    const common = {
      module: {}
    };
    common.module[loadersKey] = [
      {
        test: /\.css$/,
        use: [
          { loader: 'css-loader', options: { myOptions: true } },
          { loader: 'style-loader' }
        ]
      }
    ];
    const extractText = {
      module: {}
    };
    extractText.module[loadersKey] = [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader', options: { someSetting: true } }
        ]
      }
    ];
    const result = {
      module: {}
    };
    result.module[loadersKey] = [
      {
        test: /\.css$/,
        use: [
          { loader: 'css-loader', options: { myOptions: true } },
          { loader: 'style-loader', options: { someSetting: true } }
        ]
      }
    ];

    assert.deepEqual(merge(common, extractText), result);
  });

  test(
    'should respect second order when existing/new have conflicting orders for ' + loadersKey,
  () => {
    const common = {
      module: {}
    };
    common.module[loadersKey] = [
      {
        test: /\.css$/,
        use: [
          { loader: 'css-loader' },
          { loader: 'style-loader' },
          { loader: 'other-loader' }
        ]
      }
    ];

    const extractText = {
      module: {}
    };
    extractText.module[loadersKey] = [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      }
    ];
    const result = {
      module: {}
    };
    result.module[loadersKey] = [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'other-loader'
        ]
      }
    ];

    assert.deepEqual(merge(common, extractText), result);
  });

  test('should merge oneOf rules for ' + loadersKey, function () {
    const a = {
      [loadersKey]: [{
        oneOf: [
          {
            test: /\.js$/,
            loader: 'a'
          }
        ]
      }]
    };

    const result = {
      [loadersKey]: [{
        oneOf: [
          {
            test: /\.js$/,
            loader: 'b'
          },
          {
            test: /\.css$/,
            loader: 'b'
          }
        ]
      }]
    };

    assert.deepEqual(merge(a, result), result);
  });

  test('should overwrite with oneOf for ' + loadersKey, function () {
    const a = {
      [loadersKey]: [
        {
          test: /\.js$/,
          loader: 'a'
        }
      ]
    };
    const b = {
      [loadersKey]: [{
        test: /\.js$/,
        oneOf: [
          {
            resourceQuery: /inline/, // foo.css?inline
            use: 'url-loader'
          },
          {
            resourceQuery: /external/, // foo.css?external
            use: 'file-loader'
          }
        ]
      }]
    };

    assert.deepEqual(merge(a, b), b);
  });
}

module.exports = mergeSmartTests;
