import { coerceElement } from '@angular/cdk/coercion';
import { ElementRef } from '@angular/core';
export type AnimationOptions = KeyframeAnimationOptions & { fill: 'both' };

export const animateElement= (
  elementOrElementRef: Element | ElementRef<Element>,
  keyframes: Keyframe[] | PropertyIndexedKeyframes,
  options: AnimationOptions,
  onDoneCb?: () => void
) => {
  const element = coerceElement(elementOrElementRef)
  const animation = element.animate(keyframes, options);
  animation.onfinish = () => {
    try {
      animation.commitStyles();
      animation.cancel();
      if (onDoneCb) { onDoneCb(); }
    } catch {
      let count = 0;

      const commitFn = () => {
        if (count >= 15) { return; }
        count++
        try {
          animation.commitStyles();
          animation.cancel();
          if (onDoneCb) { onDoneCb(); }
        } catch {
          requestAnimationFrame(commitFn);
        }
      };

      requestAnimationFrame(commitFn);
    }
  };
};
