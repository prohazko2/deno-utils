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

// stolen from https://github.com/ghoullier/awesome-template-literal-types#dot-notation-string-type-safe

type PathImpl<T, Key extends keyof T> = Key extends string
  ? T[Key] extends Record<string, any> ? 
    | `${Key}.${
      & PathImpl<T[Key], Exclude<keyof T[Key], keyof any[]>>
      & string}`
    | `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}`
  : never
  : never;

type PathImpl2<T> = PathImpl<T, keyof T> | keyof T;

type Path<T> = PathImpl2<T> extends string | keyof T ? PathImpl2<T> : keyof T;

type PathValue<T, P extends Path<T>> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T ? Rest extends Path<T[Key]> ? PathValue<T[Key], Rest>
  : never
  : never
  : P extends keyof T ? T[P]
  : never;

export function get<T, P extends Path<T>>(
  object: T,
  path: P,
): PathValue<T, P> {
  return (path as string).split(".").reduce(
    (o: any, k: string) => o && o[k],
    object,
  );
}

// tired of googling this "bit" of code every time (pun intended)
export function bit(value: number, bit: number) {
  return (value & (1 << bit)) !== 0;
}
