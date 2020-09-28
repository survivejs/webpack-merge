import { Configuration } from "webpack";
import wildcard from "wildcard";
import mergeWith from "./merge-with";
import joinArrays from "./join-arrays";
import unique from "./unique";
import { CustomizeRule, ICustomizeOptions, Key } from "./types";

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

function customizeArray(rules: { [s: string]: CustomizeRule }) {
  return (a: any, b: any, key: Key) => {
    const matchedRule =
      Object.keys(rules).find(rule => wildcard(rule, key)) || "";
    const matchedValue = rules[matchedRule];

    // Array case ([<field>])
    if (!matchedRule) {
      const matchingRules = Object.keys(rules).filter(rule =>
        rule.startsWith(key)
      );

      if (matchingRules.length > 0) {
        // TODO: What if multiple rules match?
        const firstRule = matchingRules[0].split(key).filter(Boolean);

        if (firstRule.length > 0) {
          // https://stackoverflow.com/questions/1493027/javascript-return-string-between-square-brackets
          const arrayMatch = firstRule[0].replace(/(^.*\[|\].*$)/g, "");
          const matchingValue = rules[matchingRules[0]];

          // TODO: If there are properties after array match, merge within
          console.log("array match", arrayMatch);

          switch (matchingValue) {
            case CustomizeRule.Prepend:
              // TODO: Prepend within match
              return [...b, ...a];
            case CustomizeRule.Replace:
              // TODO: Replace within match
              return b;
            case CustomizeRule.Append:
            default:
              // TODO: Append within match
              return [...a, ...b];
          }
        }

        return [];
      }

      console.warn("customizeArray - No matching rules");

      return [];
    }

    switch (matchedValue) {
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

function customizeObject(rules: { [s: string]: CustomizeRule }) {
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
  CustomizeRule
};
