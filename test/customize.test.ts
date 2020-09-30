import assert from "assert";
import {
  mergeWithCustomize,
  customizeArray,
  customizeObject
} from "../resolve";
import customizeTests from "../helpers/customize-tests";
import { CustomizeRule } from "../src/types";

describe("Merge strategy", function() {
  const merge = rules =>
    mergeWithCustomize({
      customizeArray: customizeArray(rules),
      customizeObject: customizeObject(rules)
    });

  customizeTests(merge);
  mergeStrategySpecificTests(merge);
  mergeNested();
});

function mergeNested() {
  it("should replace with nested notation", function() {
    const base = {
      entry: "demo",
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: ["css-loader"]
          },
          {
            test: /\.css$/,
            loaders: ["style-loader"]
          }
        ]
      }
    };
    const development = {
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: ["style-loader"]
          },
          {
            test: /\.less$/,
            loaders: ["css-loader"]
          }
        ]
      }
    };
    const result = {
      entry: "demo",
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: ["style-loader"]
          },
          {
            test: /\.css$/,
            loaders: ["style-loader"]
          }
          // TODO: Is it ok that this gets lost?
          /*{
            test: /\.less$/,
            loaders: ["css-loader"]
          }*/
        ]
      }
    };

    assert.deepStrictEqual(
      mergeWithCustomize({
        customizeArray: customizeArray({
          module: {
            rules: {
              test: CustomizeRule.Match,
              loaders: CustomizeRule.Replace
            }
          }
        })
      })(base, development),
      result
    );
  });

  it("should append with nested notation", function() {
    const base = {
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: ["css-loader"]
          }
        ]
      }
    };
    const development = {
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: ["style-loader"]
          }
        ]
      }
    };
    const result = {
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: ["css-loader", "style-loader"]
          }
        ]
      }
    };

    assert.deepStrictEqual(
      mergeWithCustomize({
        customizeArray: customizeArray({
          module: {
            rules: {
              test: CustomizeRule.Match,
              loaders: CustomizeRule.Append
            }
          }
        })
      })(base, development),
      result
    );
  });

  it("should prepend with nested notation", function() {
    const base = {
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: ["css-loader"]
          }
        ]
      }
    };
    const development = {
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: ["style-loader"]
          }
        ]
      }
    };
    const result = {
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: ["style-loader", "css-loader"]
          }
        ]
      }
    };

    assert.deepStrictEqual(
      mergeWithCustomize({
        customizeArray: customizeArray({
          module: {
            rules: {
              test: CustomizeRule.Match,
              loaders: CustomizeRule.Prepend
            }
          }
        })
      })(base, development),
      result
    );
  });

  it("should merge #149", function() {
    const base = {
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: [
              {
                loader: "css-loader"
              },
              {
                loader: "resolve-url-loader"
              }
            ]
          }
        ]
      }
    };
    const development = {
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: [
              {
                loader: "css-loader",
                options: {
                  sourceMap: true
                }
              }
            ]
          }
        ]
      }
    };
    const result = {
      module: {
        rules: [
          {
            test: /\.scss$/,
            loaders: [
              {
                loader: "css-loader",
                options: {
                  sourceMap: true
                }
              },
              {
                loader: "resolve-url-loader"
              }
            ]
          }
        ]
      }
    };

    assert.deepStrictEqual(
      mergeWithCustomize({
        customizeArray: customizeArray({
          module: {
            rules: {
              test: CustomizeRule.Match,
              loaders: {
                loader: CustomizeRule.Match,
                options: CustomizeRule.Replace
              }
            }
          }
        })
      })(base, development),
      result
    );
  });
}

function mergeStrategySpecificTests(merge) {
  it("should work with nested arrays and prepend", function() {
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
          },
          {
            test: /.jsx?$/,
            loaders: ["babel"],
            exclude: /node_modules/
          }
        ]
      }
    };

    assert.deepStrictEqual(
      merge({
        "module.loaders": "prepend"
      })(a, b),
      result
    );
  });

  it("should work with array wildcards", function() {
    const a = {
      entry: {
        main: ["./src\\config\\main.ts"],
        polyfills: ["./src\\config\\polyfills.ts"],
        styles: ["./src\\assets\\styles\\styles.sass"]
      }
    };
    const b = {
      entry: {
        main: ["./src\\config\\main.playground.ts"]
      }
    };
    const result = {
      entry: {
        main: ["./src\\config\\main.playground.ts"],
        polyfills: ["./src\\config\\polyfills.ts"],
        styles: ["./src\\assets\\styles\\styles.sass"]
      }
    };

    assert.deepStrictEqual(
      merge({
        "entry.*": "replace"
      })(a, b),
      result
    );
  });
}
