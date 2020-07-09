import assert from "assert";
import { merge } from "../";
import mergeTests from "../helpers/merge-tests";
import loadersKeys from "../helpers/loaders-keys";

describe("Merge", function () {
  normalMergeTests(merge);
  mergeTests(merge);
});

function normalMergeTests(merge) {
  loadersKeys.forEach(function (loadersKey) {
    normalMergeTest(merge, loadersKey);
  });
}

function normalMergeTest(merge, loadersKey) {
  it("should work with an empty configuration", function () {
    assert.deepEqual(merge(), {});
  });

  it("should work with an empty array", function () {
    assert.deepEqual(merge([]), {});
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

export default normalMergeTests;
