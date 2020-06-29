import { mergeWith, values } from "lodash";
import { Configuration } from "webpack";
import joinArrays from "./join-arrays";
import unique from "./unique";
import {
  CustomizeRule,
  ICustomizeRules,
  ICustomizeOptions,
  Key,
} from "./types";

function merge(
  firstSource: Configuration | Configuration[] | ICustomizeOptions,
  ...sources: Configuration[]
) {
  // This supports
  // merge([<object>] | ...<object>)
  // merge({ customizeArray: <fn>, customizeObject: <fn>})([<object>] | ...<object>)
  // where fn = (a, b, key)
  if (sources.length === 1) {
    if (Array.isArray(firstSource)) {
      return mergeWith(
        {},
        ...firstSource,
        joinArrays(firstSource as ICustomizeOptions)
      );
    }

    if (
      (firstSource as ICustomizeOptions).customizeArray ||
      (firstSource as ICustomizeOptions).customizeObject
    ) {
      return function mergeWithOptions() {
        const structures = arguments;

        if (Array.isArray(structures[0])) {
          return mergeWith(
            {},
            ...structures[0],
            joinArrays(firstSource as ICustomizeOptions)
          );
        }

        return mergeWith(
          {},
          ...structures,
          joinArrays(firstSource as ICustomizeOptions)
        );
      };
    }

    return sources[0];
  }

  return mergeWith({}, ...sources, joinArrays());
}

const mergeMultiple = (...sources: Configuration[]): Configuration[] =>
  values(merge(sources));

// rules: { <field>: <'append'|'prepend'|'replace'> }
// All default to append but you can override here
const mergeStrategy = (rules = {}) =>
  merge({
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
        return false;
    }
  };
}

function customizeObject(rules: ICustomizeRules) {
  return (a: any, b: any, key: Key) => {
    switch (rules[key]) {
      case CustomizeRule.Prepend:
        return mergeWith({}, b, a, joinArrays());
      case CustomizeRule.Replace:
        return b;
      case CustomizeRule.Append:
        return false;
    }
  };
}

export { merge, mergeMultiple, mergeStrategy, unique };
