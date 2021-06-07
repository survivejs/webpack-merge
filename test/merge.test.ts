import assert from "assert";
import merge, { merge as defaultMerge } from "../resolve";
import mergeTests from "../helpers/merge-tests";
import loadersKeys from "../helpers/loaders-keys";

describe("Merge", function () {
  normalMergeTests(merge);
  mergeTests(merge);

  it("should export default merge", function () {
    assert.strictEqual(merge, defaultMerge);
  });
});

function normalMergeTests(merge) {
  loadersKeys.forEach(function (loadersKey) {
    normalMergeTest(merge, loadersKey);
  });
}

function normalMergeTest(merge, loadersKey) {
  it("should throw with an empty configuration", function () {
    assert.throws(() => merge(), {
      name: "TypeError",
      message: "Merging undefined is not supported",
    });
  });

  it("should throw with undefined 1/4", function () {
    assert.throws(() => merge(undefined), {
      name: "TypeError",
      message: "Merging undefined is not supported",
    });
  });

  it("should throw with undefined 2/4", function () {
    assert.throws(() => merge([undefined]), {
      name: "TypeError",
      message: "Merging undefined is not supported",
    });
  });

  it("should throw with undefined 2/4", function () {
    const result = { devServer: null };

    assert.throws(
      () =>
        merge(
          {
            devServer: { base: true },
          },
          undefined,
          result
        ),
      {
        name: "TypeError",
        message: "Merging undefined is not supported",
      }
    );
  });

  it("should throw with undefined 3/4", function () {
    const result = { devServer: null };

    assert.throws(
      () =>
        merge(
          undefined,
          {
            devServer: { base: true },
          },
          result
        ),
      {
        name: "TypeError",
        message: "Merging undefined is not supported",
      }
    );
  });

  it("should work with an empty array", function () {
    assert.deepStrictEqual(merge([]), {});
  });

  it("should override with null (#144)", function () {
    const result = { devServer: null };

    assert.deepStrictEqual(
      merge(
        {
          devServer: { base: true },
        },
        result
      ),
      result
    );
  });

  it("should allow merging optimization config to itself (#145)", function () {
    const config = {
      optimization: {
        runtimeChunk: {
          name: "runtime",
        },

        splitChunks: {
          minChunks: 2,
          minSize: 30000,

          cacheGroups: {
            clientApplication: {
              name: "clientApplication",
              test: /applications\/client/,
              chunks: "all",
              enforce: true,
            },
          },
        },
      },
    };

    assert.deepStrictEqual(merge(config, config), config);
  });

  it("should error on promise", function () {
    const a = {
      module: {},
    };

    assert.throws(() => merge(Promise.resolve(a), Promise.resolve(a)), {
      name: "TypeError",
      message: "Promises are not supported",
    });
  });

  it("should error on promises inside an array", function () {
    const a = {
      module: {},
    };

    assert.throws(() => merge([Promise.resolve(a), Promise.resolve(a)]), {
      name: "TypeError",
      message: "Promises are not supported",
    });
  });

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

    assert.deepStrictEqual(merge(a, b), result);
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

      assert.deepStrictEqual(merge(a, b), result);
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

    assert.deepStrictEqual(merge(a, b), result);
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

    assert.deepStrictEqual(merge(a, b), result);
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

      assert.deepStrictEqual(merge(a, b, c), result);
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

      assert.deepStrictEqual(merge(a, b), a);
    }
  );

  it("should not pollute __proto__", function () {
    const obj = { tmp: "" };

    // @ts-ignore: Pollute __proto__ on purpose
    merge(obj, (obj.__proto__.polluted = "Proto has been polluted"));

    const obj_new = [];

    // @ts-ignore: Pollute __proto__ on purpose
    expect(obj_new.polluted).toEqual(undefined);
  });
}

export default normalMergeTests;
