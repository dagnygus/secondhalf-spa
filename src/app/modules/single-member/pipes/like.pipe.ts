import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'like'
})
export class LikePipe implements PipeTransform {

  transform(liked: boolean | null | undefined, gender: string): string {
    if (!liked) {
      return 'Like me!';
    }

    if (gender === 'male') {
      return 'You like him!';
    } else {
      return 'You like her!';
    }
  }

}
