import * as assert from "assert";
import { strategy } from "../";
import loadersKeys from "./loaders-keys";
import mergeStrategyTests from "./merge-strategy-tests";
import mergeTests from "./merge-tests";
import normalMergeTest from "./test-merge";

describe("Merge strategy", () => {
  normalMergeTests(strategy());
  mergeTests(strategy());
  mergeStrategyTests(strategy);
  mergeStrategySpecificTests(strategy);
});

function normalMergeTests(merge) {
  loadersKeys.forEach(loadersKey => normalMergeTest(merge, loadersKey));
}

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

    assert.deepEqual(
      merge({
        "module.loaders": "prepend"
      })(a, b),
      result
    );
  });
}
