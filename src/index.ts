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

function merge<C extends {} = Configuration>(
  firstConfiguration: C | C[],
  ...configurations: C[]
): C {
  return mergeWithCustomize({})(firstConfiguration, ...configurations);
}

function mergeWithCustomize(options: ICustomizeOptions) {
  return function mergeWithOptions<C extends {} = Configuration>(
    firstConfiguration: C | C[],
    ...configurations: C[]
  ): C {
    // No configuration at all
    if (!firstConfiguration) {
      return {} as C;
    }

    // @ts-ignore
    if (firstConfiguration.then) {
      throw new TypeError("Promises are not supported");
    }

    if (configurations.length === 0) {
      if (Array.isArray(firstConfiguration)) {
        // Empty array
        if (firstConfiguration.length === 0) {
          return {} as C;
        }

        // @ts-ignore
        if (firstConfiguration[0].then) {
          throw new TypeError("Promises are not supported");
        }

        return mergeWith(firstConfiguration, joinArrays(options)) as C;
      }

      return firstConfiguration;
    }

    return mergeWith(
      [firstConfiguration].concat(configurations),
      joinArrays(options)
    ) as C;
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

export { merge, mergeWithCustomize, unique, customizeArray, customizeObject };
