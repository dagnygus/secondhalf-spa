type InputValueArr = number[] | string[] | boolean[];

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions, max-len
export const insertAt = function<T>(sourceArr: readonly T[], index: number, item: T | readonly T[]): readonly T[] {

  if (index < 0 || index >= sourceArr.length) {
    throw new Error('Argument out of the range');
  }

  switch (index) {
    case 0:
      if (item instanceof Array) {
        return item.concat(sourceArr);
      }
      return [ item ].concat(sourceArr);
    case sourceArr.length - 1:

      return sourceArr.concat(item);
    default:
      return sourceArr.slice(0, index).concat(item, sourceArr.slice(index));
  }

};

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export const removeAt = function<T>(sourceArr: readonly T[], index: number): readonly T[] {
  if (index < 0 || index >= sourceArr.length) {
    throw new Error('Argument out of the range');
  }

  switch (index) {
    case 0:
      return sourceArr.slice(1);
    case sourceArr.length - 1:
      return sourceArr.slice(0, index);
    default:
      return sourceArr.slice(0, index).concat(sourceArr.slice(index + 1));
  }

};

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export const replaceAt = function<T>(sourceArr: readonly T[], index: number, item: T): readonly T[] {
  if (index < 0 || index >= sourceArr.length) {
    throw new Error('Argument out of the range');
  }

  if (sourceArr.length === 0) {
    throw new Error('[ReplaceAt] Invalid operation. Array length equels 0');
  }

  switch (index) {
    case 0:
      if (sourceArr.length === 1) {
        return [ item ];
      }
      return [ item ].concat(sourceArr.slice(1));
    case sourceArr.length - 1:

      return sourceArr.slice(0, index).concat(item);
    default:
      return sourceArr.slice(0, index).concat(item, sourceArr.slice(index + 1));
  }

};

export const emptyArr: [] = [];
export const emptyObj: {} = {};
