export function assertNotNull<T>(value: T): asserts value is Exclude<T, null | undefined> {
  if (value == null) {
    throw new Error('Value is undefined or null');
  }
}
