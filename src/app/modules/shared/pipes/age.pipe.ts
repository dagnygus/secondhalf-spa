import * as moment from 'moment';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {

  transform(value: string): number {
    return moment().diff(moment(value, 'YYYY-MM-DD'), 'years');
  }

}
