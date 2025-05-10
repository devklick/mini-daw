export function getFirst<T>(items: ReadonlyArray<T>): T {
  return items[0];
}

export function getLast<T>(items: ReadonlyArray<T>): T {
  return items[items.length - 1];
}
