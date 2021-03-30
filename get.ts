// stolen from https://github.com/ghoullier/awesome-template-literal-types#dot-notation-string-type-safe

export type PathImpl<T, Key extends keyof T> = Key extends string
  ? T[Key] extends Record<string, any> ? 
    | `${Key}.${
      & PathImpl<T[Key], Exclude<keyof T[Key], keyof any[]>>
      & string}`
    | `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}`
  : never
  : never;

export type PathImpl2<T> = PathImpl<T, keyof T> | keyof T;

export type Path<T> = PathImpl2<T> extends string | keyof T ? PathImpl2<T>
  : keyof T;

export type PathValue<T, P extends Path<T>> = P extends
  `${infer Key}.${infer Rest}`
  ? Key extends keyof T ? Rest extends Path<T[Key]> ? PathValue<T[Key], Rest>
  : never
  : never
  : P extends keyof T ? T[P]
  : never;

export default function get<T, P extends Path<T>>(
  object: T,
  path: P,
): PathValue<T, P> {
  return (path as string).split(".").reduce(
    (o: any, k: string) => o && o[k],
    object,
  );
}
