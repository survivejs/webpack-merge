import { cloneDeep, isFunction, isPlainObject, mergeWith } from "lodash";
import { CustomizeArray, CustomizeObject, Key } from "./types";

const isArray = Array.isArray;

export default function joinArrays({
  customizeArray,
  customizeObject,
  key
}: {
  customizeArray?: CustomizeArray;
  customizeObject?: CustomizeObject;
  key?: Key;
}) {
  return function _joinArrays(a: any, b: any, k: Key): any {
    const newKey = key ? `${key}.${k}` : k;

    if (isFunction(a) && isFunction(b)) {
      return (...args: any[]) => _joinArrays(a(...args), b(...args), k);
    }
    if (isArray(a) && isArray(b)) {
      const customResult = customizeArray && customizeArray(a, b, newKey);

      return customResult || [...a, ...b];
    }

    if (isPlainObject(a) && isPlainObject(b)) {
      const customResult = customizeObject && customizeObject(a, b, newKey);

      return (
        customResult ||
        mergeWith(
          {},
          a,
          b,
          joinArrays({
            customizeArray,
            customizeObject,
            key: newKey
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
