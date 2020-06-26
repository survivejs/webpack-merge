import webpackMerge from "../src";
import mergeTests from "../helpers/merge-tests";
import mergeSmartTests from "../helpers/merge-smart-tests";

describe("Smart merge", function () {
  const merge = webpackMerge.smart;

  mergeTests(merge);
  mergeSmartTests(merge);
});
