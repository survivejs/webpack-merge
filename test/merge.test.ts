import assert from "assert";
import webpack from "webpack";
import { merge } from "../src";
import mergeTests from "../helpers/merge-tests";
import loadersKeys from "../helpers/loaders-keys";

describe("Merge", function () {
  normalMergeTests(merge);
  mergeTests(merge);
  customizeMergeTests(merge);
});

function normalMergeTests(merge) {
  loadersKeys.forEach(function (loadersKey) {
    normalMergeTest(merge, loadersKey);
  });
}

function normalMergeTest(merge, loadersKey) {
  it("should append recursive structures with " + loadersKey, function () {
    const a = {
      module: {},
    };
    a.module[loadersKey] = [
      {
        test: /\.js$/,
        loader: "a",
      },
      {
        test: /\.jade$/,
        loader: "a",
      },
    ];
    const b = {
      module: {},
    };
    b.module[loadersKey] = [
      {
        test: /\.css$/,
        loader: "b",
      },
      {
        test: /\.sass$/,
        loader: "b",
      },
    ];
    const result = {
      module: {},
    };
    result.module[loadersKey] = [
      {
        test: /\.js$/,
        loader: "a",
      },
      {
        test: /\.jade$/,
        loader: "a",
      },
      {
        test: /\.css$/,
        loader: "b",
      },
      {
        test: /\.sass$/,
        loader: "b",
      },
    ];

    assert.deepEqual(merge(a, b), result);
  });

  it(
    "should not override loader string values with " + loadersKey,
    function () {
      const a = {};
      a[loadersKey] = [
        {
          test: /\.js$/,
          loader: "a",
        },
      ];
      const b = {};
      b[loadersKey] = [
        {
          test: /\.js$/,
          loader: "b",
        },
        {
          test: /\.css$/,
          loader: "b",
        },
      ];
      const result = {};
      result[loadersKey] = [
        {
          test: /\.js$/,
          loader: "a",
        },
        {
          test: /\.js$/,
          loader: "b",
        },
        {
          test: /\.css$/,
          loader: "b",
        },
      ];

      assert.deepEqual(merge(a, b), result);
    }
  );

  it("should not append loaders with " + loadersKey, function () {
    const a = {};
    a[loadersKey] = [
      {
        test: /\.js$/,
        loaders: ["a"],
      },
    ];
    const b = {};
    b[loadersKey] = [
      {
        test: /\.js$/,
        loaders: ["b"],
      },
      {
        test: /\.css$/,
        loader: "b",
      },
    ];
    const result = {};
    result[loadersKey] = [
      {
        test: /\.js$/,
        loaders: ["a"],
      },
      {
        test: /\.js$/,
        loaders: ["b"],
      },
      {
        test: /\.css$/,
        loader: "b",
      },
    ];

    assert.deepEqual(merge(a, b), result);
  });

  it("should duplicate loaders with " + loadersKey, function () {
    const a = {};
    a[loadersKey] = [
      {
        test: /\.js$/,
        loaders: ["a"],
      },
    ];
    const b = {};
    b[loadersKey] = [
      {
        test: /\.js$/,
        loaders: ["a", "b"],
      },
    ];
    const result = {};
    result[loadersKey] = [
      {
        test: /\.js$/,
        loaders: ["a"],
      },
      {
        test: /\.js$/,
        loaders: ["a", "b"],
      },
    ];

    assert.deepEqual(merge(a, b), result);
  });

  it(
    "should not override query options for the same loader with " + loadersKey,
    function () {
      const a = {};
      a[loadersKey] = [
        {
          test: /\.js$/,
          loaders: ["a?1"],
        },
      ];
      const b = {};
      b[loadersKey] = [
        {
          test: /\.js$/,
          loaders: ["a?2", "b"],
        },
      ];
      const c = {};
      c[loadersKey] = [
        {
          test: /\.js$/,
          loaders: ["a", "b?3"],
        },
      ];
      const result = {};
      result[loadersKey] = [
        {
          test: /\.js$/,
          loaders: ["a?1"],
        },
        {
          test: /\.js$/,
          loaders: ["a?2", "b"],
        },
        {
          test: /\.js$/,
          loaders: ["a", "b?3"],
        },
      ];

      assert.deepEqual(merge(a, b, c), result);
    }
  );

  it(
    "should not allow overriding with an empty array in " + loadersKey,
    function () {
      const a = {};
      a[loadersKey] = [
        {
          test: /\.js$/,
          loaders: ["a?1"],
        },
      ];
      const b = {};
      b[loadersKey] = [];

      assert.deepEqual(merge(a, b), a);
    }
  );
}

function customizeMergeTests(merge) {
  it("should allow overriding array behavior", function () {
    const first = {
      entry: ["a"],
    };
    const second = {
      entry: ["b"],
    };

    assert.deepEqual(
      merge({
        customizeArray(a) {
          return a;
        },
      })(first, second),
      first
    );
  });

  it("should pass key to array customizer", function () {
    var receivedKey;
    const first = {
      entry: ["a"],
    };
    const second = {
      entry: ["b"],
    };
    const result = merge({
      customizeArray(a, _, key) {
        receivedKey = key;

        return a;
      },
    })(first, second);

    assert.equal(receivedKey, "entry");
    assert.deepEqual(result, first);
  });

  it("should allow overriding object behavior", function () {
    const first = {
      entry: {
        a: "foo",
      },
    };
    const second = {
      entry: {
        a: "bar",
      },
    };

    assert.deepEqual(
      merge({
        customizeObject(a) {
          return a;
        },
      })(first, second),
      first
    );
  });

  it("should pass key to object customizer", function () {
    var receivedKey;
    const first = {
      entry: {
        a: "foo",
      },
    };
    const second = {
      entry: {
        a: "bar",
      },
    };
    const result = merge({
      customizeObject(a, _, key) {
        receivedKey = key;

        return a;
      },
    })(first, second);

    assert.equal(receivedKey, "entry");
    assert.deepEqual(result, first);
  });

  it("should customize plugins", function () {
    var receivedKey;
    const config1 = {
      plugins: [
        new webpack.DefinePlugin({
          "process.env": {
            NODE_ENV: JSON.stringify("development"),
          },
        }),
        new webpack.HotModuleReplacementPlugin(),
      ],
    };
    const config2 = {
      plugins: [
        new webpack.DefinePlugin({
          __CLIENT__: true,
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.HotModuleReplacementPlugin(),
      ],
    };

    merge({
      customizeArray(_, __, key) {
        receivedKey = key;
      },
    })(config1, config2);

    assert.equal(receivedKey, "plugins");
  });

  it("should not mutate plugins #106", function () {
    const config1 = {
      entry: {
        page1: "src/page1",
        page2: "src/page2",
      },
      output: {
        path: "dist",
        publicPath: "/",
      },
    };
    const config2 = {
      entry: {
        page3: "src/page3",
        page4: "src/page4",
      },
      output: {
        path: "dist",
        publicPath: "/",
      },
    };
    const enhance = {
      plugins: [new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)],
    };

    const result1 = merge(config1, enhance);
    const result2 = merge(config2, enhance);

    assert.equal(result1.plugins.length, 1);
    assert.equal(result2.plugins.length, 1);

    result1.plugins.push(new webpack.HotModuleReplacementPlugin());

    assert.equal(result1.plugins.length, 2);
    assert.equal(result2.plugins.length, 1);
  });
}

export default normalMergeTests;
