export function unique<T = unknown>(array: T[] = []) {
  return array.filter((item, pos, self) => {
    return self.indexOf(item) === pos;
  });
}

export function only<T, K extends keyof T>(
  object: T,
  keys: K | K[] | string[] = [],
): Pick<T, K> {
  object = (object || {}) as T;
  keys = (Array.isArray(keys) ? keys : [keys]) as string[];

  return keys.reduce((result, key) => {
    (result as any)[key] = (object as any)[key];
    return result;
  }, {} as T);
}

export function chunk<T = unknown>(array: T[] = [], size = 2) {
  array = [...array];

  const result = [];
  while (array.length) {
    result.push(array.splice(0, size));
  }
  return result;
}

// tired of googling this "bit" of code every time (pun intended)
export function bit(value: number, bit: number) {
  return (value & (1 << bit)) !== 0;
}
