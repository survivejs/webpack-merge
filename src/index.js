import { mergeWith, values } from "lodash";
import joinArrays from "./join-arrays";
import unique from "./unique";

function merge(...sources) {
  // This supports
  // merge([<object>] | ...<object>)
  // merge({ customizeArray: <fn>, customizeObject: <fn>})([<object>] | ...<object>)
  // where fn = (a, b, key)
  if (sources.length === 1) {
    if (Array.isArray(sources[0])) {
      return mergeWith({}, ...sources[0], joinArrays(sources[0]));
    }

    if (sources[0].customizeArray || sources[0].customizeObject) {
      return (...structures) => {
        if (Array.isArray(structures[0])) {
          return mergeWith({}, ...structures[0], joinArrays(sources[0]));
        }

        return mergeWith({}, ...structures, joinArrays(sources[0]));
      };
    }

    return sources[0];
  }

  return mergeWith({}, ...sources, joinArrays());
}

const mergeMultiple = (...sources) => values(merge(sources));

// rules: { <field>: <'append'|'prepend'|'replace'> }
// All default to append but you can override here
const mergeStrategy = (rules = {}) =>
  merge({
    customizeArray: customizeArray(rules),
    customizeObject: customizeObject(rules),
  });

function customizeArray(rules) {
  return (a, b, key) => {
    switch (rules[key]) {
      case "prepend":
        return [...b, ...a];
      case "replace":
        return b;
      default:
        // append
        return false;
    }
  };
}

function customizeObject(rules) {
  return (a, b, key) => {
    switch (rules[key]) {
      case "prepend":
        return mergeWith({}, b, a, joinArrays());
      case "replace":
        return b;
      default:
        // append
        return false;
    }
  };
}

module.exports = merge;
module.exports.multiple = mergeMultiple;
module.exports.strategy = mergeStrategy;
module.exports.unique = unique;
