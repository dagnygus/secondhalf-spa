import { Pipe, PipeTransform } from '@angular/core';

const YOU_LIKE_HER = 'You like her!';
const YOU_LIKE_HIM = 'You like him!';
const LIKE = 'Like me!';
const MALE = 'male';

@Pipe({
  name: 'like'
})
export class LikePipe implements PipeTransform {

  transform(liked: boolean | null | undefined, gender: string): string {
    if (!liked) {
      return LIKE;
    }

    if (gender === MALE) {
      return YOU_LIKE_HIM;
    } else {
      return YOU_LIKE_HER;
    }
  }

}
