import { differenceWith } from 'lodash';

function mergeUnique(key, uniques, getter = a => a) {
  return (a, b, k) => (
    k === key && [
      ...a,
      ...differenceWith(
        b, a, item => uniques.includes(getter(item))
      )
    ]
  );
}

export default mergeUnique;
