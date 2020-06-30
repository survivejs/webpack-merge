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
});
