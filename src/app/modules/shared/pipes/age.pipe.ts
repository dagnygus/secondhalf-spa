import { Pipe, PipeTransform } from '@angular/core';
import { parse, differenceInYears } from 'date-fns';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {

  transform(value: string): number {

    const result = parse(value, 'yyyy-MM-dd', new Date());

    return differenceInYears(new Date(), result);
  }

}
