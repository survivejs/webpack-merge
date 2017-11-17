import { isPlainObject } from 'lodash';
import { Rule, Configuration, NewModule, OldModule } from 'webpack';
import { LoaderKey } from './loaderKeys';

function defaultJoinArrays<V>(a: V[], b: V[], key: string) {
  return [...a, ...b];
}

function defaultCustomizeObject<V extends object>(acc: V, current: V, key?: string): V {
  const c = { ...acc as object };
  Object.keys(current).forEach(key => {
    if (Array.isArray(c[key])) {
      c[key] = defaultJoinArrays(acc[key], current[key], key);
    } else if (isPlainObject(c[key])) {
      c[key] = defaultCustomizeObject(c[key], current[key], key);
    } else {
      c[key] = current[key];
    }
  });

  return c as V;
}

function createCustomMerge(joinArrays: typeof defaultJoinArrays, customizeObject: typeof defaultCustomizeObject) {
  return function merge<V extends object>(...sources: V[]) {
     return sources.reduce((acc, current) => {
      return customizeObject(acc, current);
    });
  }
}

function isOldModule(module: NewModule | OldModule): module is OldModule {
  return Array.isArray((module as OldModule).loaders);
}

export default createCustomMerge(defaultJoinArrays, defaultCustomizeObject);

