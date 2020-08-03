import { Configuration } from "webpack";
import wildcard from "wildcard";
import mergeWith from "./merge-with";
import joinArrays from "./join-arrays";
import unique from "./unique";
import {
  CustomizeRule,
  ICustomizeRules,
  ICustomizeOptions,
  Key,
} from "./types";

function merge(
  firstConfiguration: Configuration | Configuration[],
  ...configurations: Configuration[]
): Configuration {
  return mergeWithCustomize({})(firstConfiguration, ...configurations);
}

function mergeWithCustomize(options: ICustomizeOptions) {
  return function mergeWithOptions(
    firstConfiguration: Configuration | Configuration[],
    ...configurations: Configuration[]
  ): Configuration {
    // No configuration at all
    if (!firstConfiguration) {
      return {};
    }

    // @ts-ignore
    if (firstConfiguration.then) {
      throw new TypeError("Promises are not supported");
    }

    if (configurations.length === 0) {
      if (Array.isArray(firstConfiguration)) {
        // Empty array
        if (firstConfiguration.length === 0) {
          return {};
        }

        // @ts-ignore
        if (firstConfiguration[0].then) {
          throw new TypeError("Promises are not supported");
        }

        return mergeWith(firstConfiguration, joinArrays(options));
      }

      return firstConfiguration;
    }

    return mergeWith(
      [firstConfiguration].concat(configurations),
      joinArrays(options)
    );
  };
}

function customizeArray(rules: ICustomizeRules) {
  return (a: any, b: any, key: Key) => {
    const match = Object.keys(rules).find((rule) => wildcard(rule, key)) || "";

    switch (rules[match]) {
      case CustomizeRule.Prepend:
        return [...b, ...a];
      case CustomizeRule.Replace:
        return b;
      case CustomizeRule.Append:
      default:
        return [...a, ...b];
    }
  };
}

function customizeObject(rules: ICustomizeRules) {
  return (a: any, b: any, key: Key) => {
    switch (rules[key]) {
      case CustomizeRule.Prepend:
        return mergeWith([b, a], joinArrays());
      case CustomizeRule.Replace:
        return b;
      case CustomizeRule.Append:
        return mergeWith([a, b], joinArrays());
    }
  };
}

export {
  // This will show up as .default in CommonJS but for TS it's backwards-compatible
  merge as default,
  merge,
  mergeWithCustomize,
  unique,
  customizeArray,
  customizeObject,
};
