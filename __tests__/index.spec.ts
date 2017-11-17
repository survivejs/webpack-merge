import merge from '../src/index';
import { loadersKeys, LoaderKey } from '../src/loaderKeys';

describe('Merge', () => {
  loadersKeys.forEach(function (loadersKey) {
    normalMergeTest(merge, loadersKey);
  });
});


function normalMergeTest(mergeFn: typeof merge, loadersKey: LoaderKey) {
  it('should append recursive structures with ' + loadersKey, function () {
    const a = {
      module: {
        [loadersKey]: [{
          test: /\.js$/,
          loader: 'a'
        }, {
          test: /\.jade$/,
          loader: 'a'
        }],
      },
    };

    const b = {
      module: {
        [loadersKey]: [{
          test: /\.css$/,
          loader: 'b'
        }, {
          test: /\.sass$/,
          loader: 'b'
        }],
      }
    };
  
    const result = {
      module: {
        [loadersKey]: [{
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
        }],
      }
    };
  
    expect(mergeFn(a, b)).toEqual(result);
  });

  it('should not override loader string values with ' + loadersKey, function () {
    const a = {
      module: {
        [loadersKey]: [{
          test: /\.js$/,
          loader: 'a'
        }],
      },
    };
  
    const b = {
      module: {
        [loadersKey]: [{
          test: /\.js$/,
          loader: 'b'
        }, {
          test: /\.css$/,
          loader: 'b'
        }],
      },
    };

    const result = {
      module: {
        [loadersKey]: [{
          test: /\.js$/,
          loader: 'a'
        }, {
          test: /\.js$/,
          loader: 'b'
        }, {
          test: /\.css$/,
          loader: 'b'
        }],
      },
    };

    expect(merge(a, b)).toEqual(result);
  });

  it('should not append loaders with ' + loadersKey, function () {
    const a = {
      module: {
        [loadersKey]: [{
          test: /\.js$/,
          loaders: ['a'],
        }],
      },
    };
  
    const b = {
      module: {
        [loadersKey]: [{
          test: /\.js$/,
          loaders: ['b']
        }, {
          test: /\.css$/,
          loader: 'b'
        }],
      },
    };

    const result = {
      module: {
        [loadersKey]: [{
          test: /\.js$/,
          loaders: ['a']
        }, {
          test: /\.js$/,
          loaders: ['b']
        }, {
          test: /\.css$/,
          loader: 'b'
        }],
      },
    };

    expect(merge(a, b)).toEqual(result);
  });

  it('should duplicate loaders with ' + loadersKey, function () {
    const a = {
      module: {
        [loadersKey]: [{
          test: /\.js$/,
          loaders: ['a'],
        }],
      },
    };
  
    const b = {
      module: {
        [loadersKey]: [{
          test: /\.js$/,
          loaders: ['a', 'b']
        }],
      },
    };

    const result = {
      module: {
        [loadersKey]: [{
          test: /\.js$/,
          loaders: ['a']
        }, {
          test: /\.js$/,
          loaders: ['a', 'b']
        }],
      },
    };

    expect(merge(a, b)).toEqual(result);
  });

  it('should not override query options for the same loader with ' + loadersKey, function () {
    const a = {
      module: {
        [loadersKey]: [{
          test: /\.js$/,
          loaders: ['a?1']
        }],
      },
    };
  
    const b = {
      module: {
        [loadersKey]: [{
          test: /\.js$/,
          loaders: ['a?2', 'b']
        }],
      },
    };

    const c = {
      module: {
        [loadersKey]: [{
          test: /\.js$/,
          loaders: ['a', 'b?3']
        }],
      },
    };

    const result = {
      module: {
        [loadersKey]: [{
          test: /\.js$/,
          loaders: ['a?1']
        }, {
          test: /\.js$/,
          loaders: ['a?2', 'b']
        }, {
          test: /\.js$/,
          loaders: ['a', 'b?3']
        }],
      },
    };

    expect(merge(a, b, c)).toEqual(result);
  });
  
  it('should not allow overriding with an empty array in ' + loadersKey, function () {
    const a = {
      module: {
        [loadersKey]: [{
          test: /\.js$/,
          loaders: ['a?1']
        }],
      },
    };
  
    const b = {
      module: {
        [loadersKey]: [],
      },
    };

    const result = a;

    expect(merge(a, b)).toEqual(result);
  });
}