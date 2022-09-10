import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'backgroundImgSrc',
})
export class BackgroundImgSrcPipe implements PipeTransform {

  transform(url?: string | null, fromServer = false): string {
    if (url == null) { return ''; }
    return `url(${url})`;
  }

}
