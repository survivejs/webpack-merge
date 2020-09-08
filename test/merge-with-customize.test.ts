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

    assert.equal(receivedKey, "entry");
    assert.deepEqual(result, first);
  });

  it("should merge complex arrays with merge (#146)", function () {
    const a = {
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [{ loader: "style-loader" }, { loader: "sass-loader" }],
          },
        ],
      },
    };
    const b = {
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              {
                loader: "style-loader",
                options: {
                  modules: true,
                },
              },
            ],
          },
        ],
      },
    };

    const expected = {
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              {
                loader: "style-loader",
                options: {
                  modules: true,
                },
              },
              { loader: "sass-loader" },
            ],
          },
        ],
      },
    };

    // TODO: Can this be simplified? If so, how
    assert.deepEqual(
      merge({
        customizeArray(a, b, key) {
          if (key === "module.rules") {
            return a.map((v) => {
              let bv = b.find(
                ({ test }) => test.toString() === v.test.toString()
              );

              if (!bv) {
                return v;
              }

              return {
                ...v,
                use: v.use.map((uv) => {
                  let bvv = bv.use.find(({ loader }) => loader === uv.loader);

                  if (!bvv) {
                    return uv;
                  }

                  return {
                    ...uv,
                    options: {
                      ...(uv.options || {}),
                      ...bvv.options,
                    },
                  };
                }),
              };
            });
          }

          return b;
        },
      })(a, b),
      expected
    );
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
}
