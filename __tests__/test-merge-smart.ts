import { smart } from "../";
import mergeSmartTests from "./merge-smart-tests";
import mergeTests from "./merge-tests";

describe("Smart merge", () => {
  mergeTests(smart);
  mergeSmartTests(smart);
});
