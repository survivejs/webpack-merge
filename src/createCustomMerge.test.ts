import createCustomMerge from './createCustomMerge';
import * as webpack from 'webpack';

describe('Custom merge function', () => {
  customMergeTests(createCustomMerge);
});

function customMergeTests(merge) {
  it('should allow overriding array behavior', function () {
    const first = {
      entry: ['a']
    };
    const second = {
      entry: ['b']
    };

    expect(merge({
      customizeArray(a) { return a; }
    })(first, second)).toEqual(first);
  });

  it('should pass key to array customizer', function () {
    var receivedKey;
    const first = {
      entry: ['a']
    };
    const second = {
      entry: ['b']
    };
    const result = merge({
      customizeArray(a, b, key) {
        receivedKey = key;

        return a;
      }
    })(first, second);

    expect(receivedKey).toEqual('entry');
    expect(result).toEqual(first);
  });

  it('should allow overriding object behavior', function () {
    const first = {
      entry: {
        a: 'foo'
      }
    };
    const second = {
      entry: {
        a: 'bar'
      }
    };

    expect(merge({
      customizeObject(a) { return a; }
    })(first, second)).toEqual(first);
  });

  it('should pass key to object customizer', function () {
    var receivedKey;
    const first = {
      entry: {
        a: 'foo'
      }
    };
    const second = {
      entry: {
        a: 'bar'
      }
    };
    const result = merge({
      customizeObject(a, b, key) {
        receivedKey = key;

        return a;
      }
    })(first, second);

    expect(receivedKey).toEqual('entry');
    expect(result).toEqual(first);
  });

  it('should customize plugins', function () {
    var receivedKey;
    const config1 = {
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('development')
          }
        }),
        new webpack.HotModuleReplacementPlugin()
      ]
    };
    const config2 = {
      plugins: [
        new webpack.DefinePlugin({
          __CLIENT__: true
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.HotModuleReplacementPlugin()
      ]
    };

    merge({
      customizeArray(a, b, key) {
        receivedKey = key;
      }
    })(config1, config2);

    expect(receivedKey).toEqual('plugins');
  });
}
