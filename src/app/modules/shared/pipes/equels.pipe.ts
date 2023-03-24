import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'equels' })
export class EquelsPipe implements PipeTransform {
  transform(value: any, compare: any): boolean {
    return value === compare;
  }
}
