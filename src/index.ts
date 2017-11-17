import { Rule, Configuration, NewModule, OldModule } from 'webpack';
import { LoaderKey } from './loaderKeys';

function defaultJoinArrays(key: string, ...rules: NewModule['rules'][]) {
  const ret: Rule[] = [];
  return rules.reduce((acc, current) => {
    return [...acc, ...current];
  }, ret);
}

function createCustomMerge(joinArrays: typeof defaultJoinArrays) {
  return function merge(...sources: Configuration[]) {
    const firstModule = sources[0].module;
    let key: LoaderKey;
    if (isOldModule(firstModule)) {
      key = 'loaders';
    } else {
      key = 'rules';
    }
  
    return sources.reduce((acc, current) => {
      return {
        ...acc,
        ...current,
        module: {
          ...acc.module,
          rules: defaultJoinArrays(key, acc.module[key], current.module[key]),
        },
      };
    });
  }
}

function isOldModule(module: NewModule | OldModule): module is OldModule {
  return Array.isArray((module as OldModule).loaders);
}

export default createCustomMerge(defaultJoinArrays);

