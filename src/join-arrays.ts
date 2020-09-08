import cloneDeep from "clone-deep";
import mergeWith from "./merge-with";

export type Customize = (a: any, b: any, key: string) => any;

const isArray = Array.isArray;

export default function joinArrays({
  customizeArray,
  customizeObject,
  key,
}: {
  customizeArray?: Customize;
  customizeObject?: Customize;
  key?: string;
} = {}) {
  return function _joinArrays(a: any, b: any, k: string): any {
    const newKey = key ? `${key}.${k}` : k;

    if (isFunction(a) && isFunction(b)) {
      return (...args: any[]) => _joinArrays(a(...args), b(...args), k);
    }

    if (isArray(a) && isArray(b)) {
      const customResult = customizeArray && customizeArray(a, b, newKey);

      return customResult || [...a, ...b];
    }

    if (isRegex(b)) {
      return b;
    }

    if (isPlainObject(a) && isPlainObject(b)) {
      const customResult = customizeObject && customizeObject(a, b, newKey);

      return (
        customResult ||
        mergeWith(
          [a, b],
          joinArrays({
            customizeArray,
            customizeObject,
            key: newKey,
          })
        )
      );
    }

    if (isPlainObject(b)) {
      return cloneDeep(b);
    }

    if (isArray(b)) {
      return [...b];
    }

    return b;
  };
}

function isRegex(o) {
  return o instanceof RegExp;
}

// https://stackoverflow.com/a/7356528/228885
function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
  );
}

function isPlainObject(a) {
  if (a === null) {
    return false;
  }

  return typeof a === "object";
}
