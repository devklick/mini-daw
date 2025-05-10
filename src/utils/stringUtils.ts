type CapitalizeWord<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${Uppercase<First>}${Rest}`
  : S;

export function capitalize<T extends string>(str: T): CapitalizeWord<T> {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as CapitalizeWord<T>;
}

export function uppercase<T extends string>(str: T): Uppercase<T> {
  return str.toUpperCase() as Uppercase<T>;
}
