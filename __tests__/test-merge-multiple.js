import webpackMerge from "..";
import mergeMultipleTests from "../helpers/merge-multiple-tests";

describe("Multiple merge", function () {
  const merge = webpackMerge.multiple;

  mergeMultipleTests(merge);
});
