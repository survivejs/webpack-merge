import { isPlainObject } from 'lodash';
import createCustomMerge from './createCustomMerge';

export function defaultCustomizeArray<V>(a: V[], b: V[], key: string) {
  return [...a, ...b];
}

export function defaultCustomizeObject<V extends object>(acc: V, current: V, key?: string): V {
  const c = { ...acc as object };
  Object.keys(current).forEach(key => {
    if (Array.isArray(c[key])) {
      c[key] = defaultCustomizeArray(acc[key], current[key], key);
    } else if (isPlainObject(c[key])) {
      c[key] = defaultCustomizeObject(c[key], current[key], key);
    } else {
      c[key] = current[key];
    }
  });

  return c as V;
}

export default createCustomMerge({
  customizeArray: defaultCustomizeArray,
  customizeObject: defaultCustomizeObject,
});
