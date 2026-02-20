/* eslint-disable @typescript-eslint/no-unused-vars */
// Task 02: Mini functional–utility library
// All helpers are declared but not implemented.

function checkSource<T>(source: readonly T[]): void {
  if (source === null) {
    throw new TypeError('Source must be a non-null, non-undefined array');
  }
}

export function mapArray<T, R>(source: readonly T[], mapper: (item: T, index: number) => R): R[] {
  checkSource(source);
  const result: R[] = [];
  for (let i = 0; i < source.length; i++) {
    result.push(mapper(source[i], i));
  }
  return result;
}

export function filterArray<T>(source: readonly T[], predicate: (item: T, index: number) => boolean): T[] {
  checkSource(source);
  const result: T[] = [];
  for (let i = 0; i < source.length; i++) {
    if (predicate(source[i], i)) {
      result.push(source[i]);
    }
  }
  return result;
}

export function reduceArray<T, R>(source: readonly T[], reducer: (acc: R, item: T, index: number) => R, initial: R): R {
  checkSource(source);
  let acc = initial;
  for (let i = 0; i < source.length; i++) {
    acc = reducer(acc, source[i], i);
  }
  return acc;
}

export function partition<T>(source: readonly T[], predicate: (item: T) => boolean): [T[], T[]] {
  checkSource(source);
  const left: T[] = [];
  const right: T[] = [];
  for (let i = 0; i < source.length; i++) {
    if (predicate(source[i])) {
      left.push(source[i]);
    } else {
      right.push(source[i]);
    }
  }
  return [left, right];
}

export function groupBy<T, K extends PropertyKey>(source: readonly T[], keySelector: (item: T) => K): Record<K, T[]> {
  checkSource(source);
  const result: Record<K, T[]> = {} as Record<K, T[]>;
  for (let i = 0; i < source.length; i++) {
    const key = keySelector(source[i]);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(source[i]);
  }
  return result;
}
