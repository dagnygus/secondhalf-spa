export type AnimationOptions = KeyframeAnimationOptions & { fill: 'both' };

export const animateElement= (element: Element, keyframes: Keyframe[] | PropertyIndexedKeyframes, options: AnimationOptions) => {
  const animation = element.animate(keyframes, options);
  animation.onfinish = () => {
    animation.commitStyles();
    animation.cancel();
  };
};
