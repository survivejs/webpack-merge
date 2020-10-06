import assert from "assert";
import {
  customizeArray,
  customizeObject,
  mergeWithCustomize
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
});

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
        "module.loaders": CustomizeRule.Prepend
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
        "entry.*": CustomizeRule.Replace
      })(a, b),
      result
    );
  });
}
