export type BooleanInput = boolean | 'true' | 'false' | '';
export type NumberInput = number | `${number}`;
export type PixelInput = number | `${number}` | `${number}px`

export const coerceBooleanInput = (value: BooleanInput) => value === true || value === 'true' || value === '';
export const coerceNumberInput = (value: NumberInput) => Number(value);
export const coerceToNonNegativeNumber = (value: number) => Math.max(0, value);
export const coerceToInteger = (value: number) => Number.isInteger(value) ? value : Math.round(value);
export const coercePixelInput = (value: PixelInput) => {
  if (typeof value === 'string') {
    let coercedValue = value;
    if (coercedValue.endsWith('px')) {
      coercedValue = coercedValue.replace('px', '') as any;
    }
    return +coercedValue;
  }
  return value;
};
export const coerceToNonNegativeInteger = (value: number) => coerceToInteger(coerceToNonNegativeNumber(value));
export const clamp = (value: number) => Math.max(0, Math.min(1, value));
