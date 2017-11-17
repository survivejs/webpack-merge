
import { defaultCustomizeArray, defaultCustomizeObject } from './merge';

type Options = {
  customizeObject: typeof defaultCustomizeObject;
  customizeArray: typeof defaultCustomizeArray;
}

export default function createCustomMerge({ customizeArray, customizeObject }: Options) {
  return function merge<V extends object>(...sources: V[]) {
     return sources.reduce((acc, current) => {
      return customizeObject(acc, current);
    });
  }
}
