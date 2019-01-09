import * as webpack from "webpack";
import merge, { unique } from "../";

describe("Unique", () => {
  test("should allow unique definitions", () => {
    const output = merge({
      customizeArray: unique(
        "plugins",
        ["HotModuleReplacementPlugin"],
        plugin => plugin.constructor && plugin.constructor.name
      )
    })(
      {
        plugins: [new webpack.HotModuleReplacementPlugin()]
      },
      {
        plugins: [new webpack.HotModuleReplacementPlugin()]
      }
    );
    const expected = {
      plugins: [new webpack.HotModuleReplacementPlugin()]
    };

    expect(output).toEqual(expected);
  });
});
