/**
 * Utility type to create a tuple of a specific length
 */
type Tuple<T, N extends number, R extends T[] = []> = R["length"] extends N
  ? R
  : Tuple<T, N, [T, ...R]>;

export function getFirst<T>(items: ReadonlyArray<T>): T {
  return items[0];
}

export function getLast<T>(items: ReadonlyArray<T>): T {
  return items[items.length - 1];
}

export function getChunks<T, I extends number>(
  items: ReadonlyArray<T>,
  size: I
): Array<Tuple<T, I>> {
  const chunks: Array<Tuple<T, I>> = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size) as Tuple<T, I>);
  }
  return chunks;
}
