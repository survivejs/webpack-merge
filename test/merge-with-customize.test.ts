import assert from "assert";
import webpack from "webpack";
import { mergeWithCustomize } from "../resolve";

describe("Merge", function () {
  customizeMergeTests(mergeWithCustomize);
});

function customizeMergeTests(merge) {
  it("should allow overriding array behavior", function () {
    const first = {
      entry: ["a"],
    };
    const second = {
      entry: ["b"],
    };

    assert.deepStrictEqual(
      merge({
        customizeArray(a) {
          return a;
        },
      })(first, second),
      first
    );
  });

  it("should pass key to array customizer", function () {
    let receivedKey;
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

    assert.strictEqual(receivedKey, "entry");
    assert.deepStrictEqual(result, first);
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

    assert.deepStrictEqual(
      merge({
        customizeObject(a) {
          return a;
        },
      })(first, second),
      first
    );
  });

  it("should pass key to object customizer", function () {
    let receivedKey;
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

    assert.strictEqual(receivedKey, "entry");
    assert.deepStrictEqual(result, first);
  });

  it("should customize plugins", function () {
    let receivedKey;
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
        new webpack.IgnorePlugin({
          resourceRegExp: /^\.\/locale$/,
          contextRegExp: /moment$/,
        }),
        new webpack.HotModuleReplacementPlugin(),
      ],
    };

    merge({
      customizeArray(_, __, key) {
        receivedKey = key;
      },
    })(config1, config2);

    assert.strictEqual(receivedKey, "plugins");
  });
}
