/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { EASE_OUT_SINE, getElasticEaseIn, getElasticEaseInOut, getElasticEaseOut } from './cubik-bezier';
export function getElasticInKeyframes(oscilations: number, keyframeGenFn: (currentEaseValue: number) => Keyframe): Keyframe[] {
  if (!Number.isInteger(oscilations)) {
    throw new Error('The argument of \'getElasticInKeyframes\' must be an integer!');
  }
  oscilations++;
  const elasticInFn = getElasticEaseIn(oscilations);
  const oscilationFrequency = 1 / oscilations;
  const keyframes: Keyframe[] = [];

  for (let i = 0; i <= oscilations; i++ ) {
    switch (i) {
      case 0:
        const firstKeyframe = keyframeGenFn(0);
        firstKeyframe.offset = 0;
        firstKeyframe.easing = EASE_OUT_SINE;
        keyframes.push(firstKeyframe);
        break;
      case oscilations:
        const lastKeyframe = keyframeGenFn(1);
        lastKeyframe.offset = 1;
        lastKeyframe.easing = EASE_OUT_SINE;
        keyframes.push(lastKeyframe);
        break;
      default:
        const singleKeyframe = keyframeGenFn(elasticInFn(i * oscilationFrequency));
        singleKeyframe.offset = i * oscilationFrequency;
        singleKeyframe.easing = EASE_OUT_SINE;
        keyframes.push(singleKeyframe);
        break;
    }
  }

  return keyframes;
}

export function getElasticOutKeyframes(oscilations: number, keyframeGenFn: (currentEaseValue: number) => Keyframe): Keyframe[] {
  if (!Number.isInteger(oscilations)) {
    throw new Error('The argument of \'getElasticInKeyframes\' must be an integer!');
  }
  oscilations++;
  const elasticOutFn = getElasticEaseOut(oscilations);
  const oscilationFrequency = 1 / oscilations;
  const keyframes: Keyframe[] = [];

  for (let i = 0; i <= oscilations; i++ ) {
    switch (i) {
      case 0:
        const firstKeyframe = keyframeGenFn(0);
        firstKeyframe.offset = 0;
        firstKeyframe.easing = EASE_OUT_SINE;
        keyframes.push(firstKeyframe);
        break;
      case oscilations:
        const lastKeyframe = keyframeGenFn(1);
        lastKeyframe.offset = 1;
        lastKeyframe.easing = EASE_OUT_SINE;
        keyframes.push(lastKeyframe);
        break;
      default:
        const singleKeyframe = keyframeGenFn(elasticOutFn(i * oscilationFrequency));
        singleKeyframe.offset = i * oscilationFrequency;
        singleKeyframe.easing = EASE_OUT_SINE;
        keyframes.push(singleKeyframe);
        break;
    }
  }

  return keyframes;
}

export function getElasticInOutKeyframes(oscilations: number, keyframeGenFn: (currentEaseValue: number) => Keyframe): Keyframe[] {
  if (!Number.isInteger(oscilations)) {
    throw new Error('The argument of \'getElasticInKeyframes\' must be an integer!');
  }
  oscilations++;
  const totalOscilations = 2 * oscilations;
  const elasticOutFn = getElasticEaseInOut(oscilations);
  const oscilationFrequency = 1 / totalOscilations;
  const keyframes: Keyframe[] = [];

  for (let i = 0; i <= totalOscilations; i++ ) {
    switch (i) {
      case 0:
        const firstKeyframe = keyframeGenFn(0);
        firstKeyframe.offset = 0;
        firstKeyframe.easing = EASE_OUT_SINE;
        keyframes.push(firstKeyframe);
        break;
      case totalOscilations:
        const lastKeyframe = keyframeGenFn(1);
        lastKeyframe.offset = 1;
        lastKeyframe.easing = EASE_OUT_SINE;
        keyframes.push(lastKeyframe);
        break;
      case oscilations:
        break;
      default:
        const singleKeyframe = keyframeGenFn(elasticOutFn(i * oscilationFrequency));
        singleKeyframe.offset = i * oscilationFrequency;
        singleKeyframe.easing = EASE_OUT_SINE;
        keyframes.push(singleKeyframe);
        break;
    }
  }

  return keyframes;
}

export function composeKeyframes(...args: (Keyframe & { offset: number })[][]): Keyframe[] {
  const keyframes: (Keyframe & { offset: number })[] = [];

  args.forEach((arg) => {
    keyframes.push(...arg);
  });

  keyframes.sort((a, b) => a.offset - b.offset);
  return keyframes;
}
