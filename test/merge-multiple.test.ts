import { mergeMultiple } from "../src";
import mergeMultipleTests from "../helpers/merge-multiple-tests";

describe("Multiple merge", function () {
  mergeMultipleTests(mergeMultiple);
});
