import { customizeArray, customizeObject } from "./customize";
import joinArrays from "./join-arrays";
import { merge, mergeWithCustomize } from "./merge";
import unique from "./unique";

export {
  joinArrays,
  // This will show up as .default in CommonJS but for TS it's backwards-compatible
  merge as default,
  merge,
  mergeWithCustomize,
  unique,
  customizeArray,
  customizeObject,
};
