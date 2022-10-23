function mergeUnique(
  key: string,
  uniques: string[],
  getter: (a: object) => string
) {
  let uniquesSet = new Set(uniques)
  return (a: [], b: [], k: string) =>
    (k === key) && Array.from(
      [...a, ...b]
          .map((it: object) => ({ key: getter(it), value: it }))
          .map(({ key, value }) => ({ key: (uniquesSet.has(key) ? key : value), value: value}))
          .reduce(
              (m, { key, value}) => {
                m.delete(key); // This is required to preserve backward compatible order of elements after a merge.
                return m.set(key, value)
              },
              new Map<any, any>())
          .values())
}

export default mergeUnique;
