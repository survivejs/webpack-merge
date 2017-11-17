import { isPlainObject } from 'lodash';
import { defaultCustomizeArray, defaultCustomizeObject } from './defaultStrategy';

type Options = {
  customizeObject: typeof defaultCustomizeObject;
  customizeArray: typeof defaultCustomizeArray;
}

export default function createCustomMerge(options: Partial<Options> = { }) {
  const {
    customizeObject = defaultCustomizeObject,
    customizeArray = defaultCustomizeArray,
  } = options;
  return function merge<V extends object>(...sources: V[]) {
     return sources.reduce((acc, current) => {
      const c = { ...acc as object };
    
      Object.keys(current).forEach(key => {
        if (Array.isArray(c[key])) {
          c[key] = customizeArray(acc[key], current[key], key);
        } else if (isPlainObject(c[key])) {
          c[key] = customizeObject(c[key], current[key], key);
        } else {
          c[key] = current[key];
        }
      });
    
      return c as V;
    });
  }
}
