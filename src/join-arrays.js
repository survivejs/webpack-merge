import {
  cloneDeep, isFunction, isPlainObject, mergeWith
} from 'lodash';

const isArray = Array.isArray;

export default function joinArrays({
  customizeArray,
  customizeObject,
  key
} = {}) {
  return function _joinArrays(a, b, k) {
    const newKey = key ? `${key}.${k}` : k;

    if (isFunction(a) && isFunction(b)) {
      return (...args) => _joinArrays(a(...args), b(...args), k);
    }
    if (isArray(a) && isArray(b)) {
      const customResult = customizeArray && customizeArray(a, b, newKey);

      return customResult || [...a, ...b];
    }

    if (isPlainObject(a) && isPlainObject(b)) {
      const customResult = customizeObject && customizeObject(a, b, newKey);

      return customResult || mergeWith({}, a, b, joinArrays({
        customizeArray,
        customizeObject,
        key: newKey
      }));
    }

    if (isPlainObject(b)) {
      return cloneDeep(b);
    }

    return b;
  };
}
