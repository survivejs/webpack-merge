import { Configuration } from "webpack";
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

// rules: { <field>: <'append'|'prepend'|'replace'> }
// All default to append but you can override here
const mergeStrategy = (rules = {}) =>
  mergeWithCustomize({
    customizeArray: customizeArray(rules),
    customizeObject: customizeObject(rules),
  });

function customizeArray(rules: ICustomizeRules) {
  return (a: any, b: any, key: Key) => {
    switch (rules[key]) {
      case CustomizeRule.Prepend:
        return [...b, ...a];
      case CustomizeRule.Replace:
        return b;
      case CustomizeRule.Append:
        return [...a, ...b];
    }
  };
}

function mergeWithCustomize(options: ICustomizeOptions) {
  return function mergeWithOptions(
    firstConfiguration: Configuration | Configuration[],
    ...configurations: Configuration[]
  ): Configuration {
    if (configurations.length === 0) {
      if (Array.isArray(firstConfiguration)) {
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

export { merge, mergeStrategy, mergeWithCustomize, unique };
