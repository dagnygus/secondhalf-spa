import { AsyncPipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'assert' })
export class AssertPipe implements PipeTransform {
  transform<T>(value: T): Exclude<T, null | undefined> {
    if (value == null) {
      throw new Error('Assertion Failed');
    }
    return value as any
  }
}
