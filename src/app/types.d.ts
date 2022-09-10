/* eslint-disable @typescript-eslint/ban-types */
declare type Immutable<T> =
    T extends (infer R)[] ? ImmutableArray<R> :
    T extends Function ? T :
    T extends object ? ImmutableObject<T> :
    T;

type ImmutableArray<T> = ReadonlyArray<Immutable<T>>;

type ImmutableObject<T> = {
    readonly [P in keyof T]: Immutable<T[P]>;
};

// interface ObjectConstructor {
//   keys<T>(obj: T): Array<keyof T>;
// }

declare type NonNullableProps<T> = {
  [key in keyof T]: Exclude<T[key], null | undefined>;
};
