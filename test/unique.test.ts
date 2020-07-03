import assert from "assert";
import webpack from "webpack";
import { mergeWithCustomize, unique } from "../src";

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

    assert.deepEqual(output, expected);
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
    const expected = {
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({}),
      ],
    };

    assert.deepEqual(output, expected);
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

    assert.deepEqual(output, expected);
  });
});
