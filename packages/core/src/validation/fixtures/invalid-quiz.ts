export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function withMissingField<T extends object>(
  value: T,
  key: keyof T,
): Omit<T, typeof key> {
  const copy = clone(value);
  delete copy[key];
  return copy;
}

export function withField<T extends object, K extends keyof T>(
  value: T,
  key: K,
  fieldValue: T[K],
): T {
  return {
    ...clone(value),
    [key]: fieldValue,
  };
}
