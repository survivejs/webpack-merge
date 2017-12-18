import { differenceWith } from 'lodash';

function mergeUnique(key, uniques, getter = a => a) {
  return (a, b, k) => (
    k === key && [
      ...a,
      ...differenceWith(
        b, a, item => uniques.indexOf(getter(item)) >= 0
      )
    ]
  );
}

export default mergeUnique;
