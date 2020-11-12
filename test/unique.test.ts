import assert from "assert";
import webpack from "webpack";
import { mergeWithCustomize, unique } from "../resolve";

describe("Unique", function () {
  it("should allow unique definitions", function () {
    const output = mergeWithCustomize({
      customizeArray: unique(
        "plugins",
        ["HotModuleReplacementPlugin"],
        (plugin) => plugin.constructor && plugin.constructor.name
      ),
    })(
      {
        plugins: [new webpack.HotModuleReplacementPlugin()],
      },
      {
        plugins: [new webpack.HotModuleReplacementPlugin()],
      }
    );
    const expected = {
      plugins: [new webpack.HotModuleReplacementPlugin()],
    };

    assert.deepStrictEqual(output, expected);
  });

  it("should pick the last plugin (#119)", function () {
    const output = mergeWithCustomize({
      customizeArray: unique(
        "plugins",
        ["DefinePlugin"],
        (plugin) => plugin.constructor && plugin.constructor.name
      ),
    })(
      {
        plugins: [
          new webpack.DefinePlugin({
            a: "a",
          }),
        ],
      },
      {
        plugins: [
          new webpack.DefinePlugin({
            b: "b",
          }),
        ],
      }
    );
    const expected = {
      plugins: [
        new webpack.DefinePlugin({
          b: "b",
        }),
      ],
    };

    assert.deepStrictEqual(output, expected);
  });

  it("should not lose any plugins", function () {
    const output = mergeWithCustomize({
      customizeArray: unique(
        "plugins",
        ["HotModuleReplacementPlugin"],
        (plugin) => plugin.constructor && plugin.constructor.name
      ),
    })(
      {
        plugins: [
          new webpack.HotModuleReplacementPlugin(),
          new webpack.DefinePlugin({}),
        ],
      },
      {
        plugins: [new webpack.HotModuleReplacementPlugin()],
      }
    );
    // The HMR plugin is picked from the last one due to
    // default ordering!
    const expected = {
      plugins: [
        new webpack.DefinePlugin({}),
        new webpack.HotModuleReplacementPlugin(),
      ],
    };

    assert.deepStrictEqual(output, expected);
  });

  it("should check only against named plugins (#125)", function () {
    const output = mergeWithCustomize({
      customizeArray: unique(
        "plugins",
        ["DefinePlugin"],
        (plugin) => plugin.constructor && plugin.constructor.name
      ),
    })(
      {
        plugins: [
          new webpack.HotModuleReplacementPlugin(),
          new webpack.DefinePlugin({}),
        ],
      },
      {
        plugins: [new webpack.HotModuleReplacementPlugin()],
      }
    );
    const expected = {
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({}),
        new webpack.HotModuleReplacementPlugin(),
      ],
    };

    assert.deepStrictEqual(output, expected);
  });
});
