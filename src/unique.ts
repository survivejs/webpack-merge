import { differenceWith } from 'lodash';

function mergeUnique(key: string, uniques: object[], getter = (a: {}) => a) {
  return (a: [], b: [], k: string) => (
    k === key && [
      ...a,
      ...differenceWith(
        b, a, item => uniques.indexOf(getter(item)) >= 0
      )
    ]
  );
}

export default mergeUnique;
