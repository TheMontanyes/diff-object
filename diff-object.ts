const diffObject = <
  S extends Record<K, S[K]>,
  N extends Record<K, P>,
  K extends keyof N & keyof S,
  P extends Partial<N[K]> & Partial<S[K]>
  >(
  prevState: S,
  nextState: N,
  deep = false
): Partial<N> => {
  const nextStateEntries = Object.entries(nextState) as [K, N[K]][];
  const different: Partial<N> = {};

  for (let i = 0; i < nextStateEntries.length; i++) {
    const [key, nextValue] = nextStateEntries[i];
    const prevValue: P = prevState[key];

    if (nextValue !== prevValue) {
      const isObjectValue = typeof nextValue === "object";

      if (deep && isObjectValue) {
        if (Array.isArray(nextValue)) {
          const isNotEmpty = nextValue.length > 0;

          if (prevValue) {
            const isDiffValue = nextValue.some(
              (value, index) =>
                value !== ((prevValue as unknown) as any[])[index]
            );

            if (isDiffValue && isNotEmpty) {
              different[key] = nextValue;
            }
          } else {
            if (isNotEmpty) {
              different[key] = nextValue;
            }
          }
        } else {
          const diffValue = diffObject(prevValue, nextValue, true);

          if (Object.values(diffValue).length > 0) {
            // @ts-ignore
            different[key] = diffValue;
          }
        }
      } else {
        different[key] = nextValue;
      }
    }
  }

  return different;
};

export default diffObject;
