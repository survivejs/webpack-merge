import assert from "assert";
import { mergeStrategy } from "../src";
import normalMergeTests from "./merge.test";
import mergeTests from "../helpers/merge-tests";
import mergeStrategyTests from "../helpers/merge-strategy-tests";

describe("Merge strategy", function () {
  normalMergeTests(mergeStrategy());
  mergeTests(mergeStrategy());
  mergeStrategyTests(mergeStrategy);
  mergeStrategySpecificTests(mergeStrategy);
});

function mergeStrategySpecificTests(merge) {
  it("should work with nested arrays and prepend", function () {
    const a = {
      module: {
        loaders: [
          {
            test: /.jsx?$/,
            loaders: ["babel"],
            exclude: /node_modules/,
          },
        ],
      },
    };
    const b = {
      module: {
        loaders: [
          {
            test: /.jsx?$/,
            loaders: ["react-hot"],
            exclude: /node_modules/,
          },
        ],
      },
    };
    const result = {
      module: {
        loaders: [
          {
            test: /.jsx?$/,
            loaders: ["react-hot"],
            exclude: /node_modules/,
          },
          {
            test: /.jsx?$/,
            loaders: ["babel"],
            exclude: /node_modules/,
          },
        ],
      },
    };

    assert.deepEqual(
      merge({
        "module.loaders": "prepend",
      })(a, b),
      result
    );
  });

  it("should work with array wildcards", function () {
    const a = {
      entry: {
        main: ["./src\\config\\main.ts"],
        polyfills: ["./src\\config\\polyfills.ts"],
        styles: ["./src\\assets\\styles\\styles.sass"],
      },
    };
    const b = {
      entry: {
        main: ["./src\\config\\main.playground.ts"],
      },
    };
    const result = {
      entry: {
        main: ["./src\\config\\main.playground.ts"],
        polyfills: ["./src\\config\\polyfills.ts"],
        styles: ["./src\\assets\\styles\\styles.sass"],
      },
    };

    assert.deepEqual(
      merge({
        "entry.*": "replace",
      })(a, b),
      result
    );
  });
}
