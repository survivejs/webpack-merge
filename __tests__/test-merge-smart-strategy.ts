import * as assert from "assert";
import { mergeSmartStrategy } from "../";
import mergeSmartTests from "./merge-smart-tests";
import mergeStrategyTests from "./merge-strategy-tests";
import mergeTests from "./merge-tests";

describe("Smart merge strategy", () => {
  mergeTests(mergeSmartStrategy());
  mergeSmartTests(mergeSmartStrategy());
  mergeStrategyTests(mergeSmartStrategy);
  mergeStrategySpecificTests(mergeSmartStrategy);
});

function mergeStrategySpecificTests(merge) {
  test("should work with nested arrays and prepend", () => {
    const a = {
      module: {
        loaders: [
          {
            test: /.jsx?$/,
            loaders: ["babel"],
            exclude: /node_modules/
          }
        ]
      }
    };
    const b = {
      module: {
        loaders: [
          {
            test: /.jsx?$/,
            loaders: ["react-hot"],
            exclude: /node_modules/
          }
        ]
      }
    };
    const result = {
      module: {
        loaders: [
          {
            test: /.jsx?$/,
            loaders: ["react-hot", "babel"],
            exclude: /node_modules/
          }
        ]
      }
    };

    assert.deepEqual(
      merge({
        "module.loaders.loaders": "prepend"
      })(a, b),
      result
    );
  });

  test("should work with nested arrays and replace", () => {
    const a = {
      module: {
        loaders: [
          {
            test: /.jsx?$/,
            loaders: ["babel"],
            exclude: /node_modules/
          }
        ]
      }
    };
    const b = {
      module: {
        loaders: [
          {
            test: /.jsx?$/,
            loaders: ["react-hot"],
            exclude: /node_modules/
          }
        ]
      }
    };
    const result = {
      module: {
        loaders: [
          {
            test: /.jsx?$/,
            loaders: ["react-hot"],
            exclude: /node_modules/
          }
        ]
      }
    };

    assert.deepEqual(
      merge({
        "module.loaders.loaders": "replace"
      })(a, b),
      result
    );
  });

  test("should work with nested arrays and replace with rules", () => {
    const a = {
      module: {
        rules: [
          {
            test: /.jsx?$/,
            loaders: ["babel"],
            exclude: /node_modules/
          }
        ]
      }
    };
    const b = {
      module: {
        rules: [
          {
            test: /.jsx?$/,
            loaders: ["react-hot"],
            exclude: /node_modules/
          }
        ]
      }
    };
    const result = {
      module: {
        rules: [
          {
            test: /.jsx?$/,
            loaders: ["react-hot"],
            exclude: /node_modules/
          }
        ]
      }
    };

    assert.deepEqual(
      merge({
        "module.rules.loaders": "replace"
      })(a, b),
      result
    );
  });

  test("should work with use and same types (#63)", () => {
    const a = {
      module: {
        rules: [
          {
            test: /\.js$/,
            use: "babel"
          }
        ]
      }
    };
    const b = {
      module: {
        rules: [
          {
            test: /\.js$/,
            use: "coffee"
          }
        ]
      }
    };
    const result = {
      module: {
        rules: [
          {
            test: /\.js$/,
            use: "coffee"
          }
        ]
      }
    };

    assert.deepEqual(
      merge({
        "module.rules.use": "replace"
      })(a, b),
      result
    );
  });

  test("should work with two level nesting (#64)", () => {
    const common = {
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /(node_modules|lib)/,
            use: [
              {
                loader: "babel-loader",
                options: {
                  cacheDirectory: true
                }
              }
            ]
          }
        ]
      }
    };
    const prod = {
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /(node_modules|lib)/,
            use: [
              {
                loader: "string-replace-loader",
                options: {
                  multiple: [
                    {
                      search: /["']ngInject["'];*/,
                      replace: "",
                      flags: "g"
                    }
                  ]
                }
              },
              "ng-annotate-loader"
            ]
          }
        ]
      }
    };
    const expected = {
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /(node_modules|lib)/,
            use: [
              {
                loader: "string-replace-loader",
                options: {
                  multiple: [
                    {
                      search: /["']ngInject["'];*/,
                      replace: "",
                      flags: "g"
                    }
                  ]
                }
              },
              "ng-annotate-loader",
              {
                loader: "babel-loader",
                options: {
                  cacheDirectory: true
                }
              }
            ]
          }
        ]
      }
    };

    assert.deepEqual(
      merge({
        "module.rules.use": "prepend"
      })(common, prod),
      expected
    );
  });

  test("should work with nested arrays and replace", () => {
    const a = {
      module: {
        loaders: [
          {
            test: /.jsx?$/,
            loaders: ["babel"],
            exclude: /node_modules/
          }
        ]
      }
    };
    const b = {
      module: {
        loaders: [
          {
            test: /.jsx?$/,
            loaders: ["react-hot"],
            exclude: /node_modules/
          }
        ]
      }
    };
    const result = {
      module: {
        loaders: [
          {
            test: /.jsx?$/,
            loaders: ["react-hot"],
            exclude: /node_modules/
          }
        ]
      }
    };

    assert.deepEqual(
      merge({
        "module.loaders": "replace"
      })(a, b),
      result
    );
  });
}
