export type DeepWritable<T> = {
  -readonly [P in keyof T]: T[P] extends object ? DeepWritable<T[P]> : T[P];
};

export function clone<T, W extends boolean = false>(
  value: T,
  options?: { writable?: W } & Parameters<typeof structuredClone>[1]
): W extends true ? DeepWritable<T> : T {
  return structuredClone(value, options);
}
