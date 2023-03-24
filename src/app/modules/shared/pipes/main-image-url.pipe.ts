import { environment } from '../../../../environments/environment';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mainImageUrl'
})
export class MainImageUrlPipe implements PipeTransform {

  transform(value?: string | null | undefined, asBackground?: boolean): string {
    if (asBackground) {
      return `url(${value != null ? value : environment.portaitPlaceholderUrl})`;
    } else {
      return value ? value : environment.portaitPlaceholderUrl;
    }
  }

}
