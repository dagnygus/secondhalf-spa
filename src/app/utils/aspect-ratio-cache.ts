const __aspect_ratio_p_bot_values = new Map<string, string>();
const __aspect_ratio_ref_count = new Map<string, number>();

export function add(value: string): void {
  if (__aspect_ratio_p_bot_values.has(value)) {
    let refCount = __aspect_ratio_ref_count.get(value)!;
    refCount++;
    __aspect_ratio_ref_count.set(value, refCount);
  } else {
    __aspect_ratio_p_bot_values.set(value, `calc(100% * (1 / (${value})))`);
    __aspect_ratio_ref_count.set(value, 1);
  }
}

export function getPaddingBottom(value: string): string | undefined {
  return __aspect_ratio_p_bot_values.get(value);
}

export function substract(value: string): void {
  if (!__aspect_ratio_ref_count.has(value)) { return; }
  let refCount = __aspect_ratio_ref_count.get(value)!;
  refCount--;
  if (refCount === 0) {
    __aspect_ratio_ref_count.delete(value);
    __aspect_ratio_p_bot_values.delete(value);
  } else {
    __aspect_ratio_ref_count.set(value, refCount);
  }
}
