/* eslint-disable @typescript-eslint/prefer-function-type */
import { keyframes, style, animate, AnimationStyleMetadata, AnimationReferenceMetadata, animation } from '@angular/animations';

type DurationType = number | `${number}s` | `${number}ms`;

export interface NgAnimationFn {
  (duration: DurationType, delay: DurationType): AnimationReferenceMetadata;
  startState: AnimationStyleMetadata;
  endState: AnimationStyleMetadata;
}

export const bounceKeyframes = keyframes([
  style({
    offset: 0,
    easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    transform: 'translate3d(0, 0, 0)',
  }),
  style({
    offset: .2,
    easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    transform: 'translate3d(0, 0, 0)',
  }),
  style({
    offset: .4,
    easing: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
    transform: 'translate3d(0, -30px, 0) scaleY(1.1)',
  }),
  style({
    offset: .43,
    easing: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
    transform: 'translate3d(0, -30px, 0) scaleY(1.1)',
  }),
  style({
    offset: .53,
    easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    transform: 'translate3d(0, 0, 0)',
  }),
  style({
    offset: .7,
    easing: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
    transform: 'translate3d(0, -15px, 0) scaleY(1.05)',
  }),
  style({
    offset: .8,
    easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    transform: 'translate3d(0, 0, 0) scaleY(0.95)',
  }),
  style({
    offset: .9,
    transform: 'translate3d(0, -4px, 0) scaleY(1.02)',
  }),
  style({
    offset: 1,
    easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    transform: 'translate3d(0, 0, 0)',
  }),
]);

export const bounceAnimation = ((duration: DurationType, delay: DurationType) => animation([
  style({ transformOrigin: 'center' }),
  animate(`${duration} ${delay}`, bounceKeyframes)
])) as any as NgAnimationFn;

bounceAnimation.startState = bounceAnimation.endState = style({ transform: 'translate3d(0, 0, 0)' });

export const flashKeyframes = keyframes([
  style({
    offset: 0,
    opacity: 1,
  }),
  style({
    offset: .25,
    opacity: 0,
  }),
  style({
    offset: .5,
    opacity: 1,
  }),
  style({
    offset: .75,
    opacity: 0,
  }),
  style({
    offset: 1,
    opacity: 1,
  }),
]);

export const flashAnimtion = ((duration: DurationType, delay: DurationType) => animation([
  animate(`${duration} ${delay}`, flashKeyframes)
])) as any as NgAnimationFn;

flashAnimtion.startState = flashAnimtion.endState = style({ opacity: 0 });

export const polseKeyframes = keyframes([
  style({
    offset: 0,
    transform: 'scale3d(1, 1, 1)'
  }),
  style({
    offset: .5,
    transform: 'scale3d(1.05, 1.05, 1.05)'
  }),
  style({
    offset: 1,
    transform: 'scale3d(1, 1, 1)'
  }),
]);

export const polseAnimation = ((duration: DurationType, delay: DurationType) => animation([
  animate(`${duration} ${delay}`, polseKeyframes)
])) as any as NgAnimationFn;

polseAnimation.startState = polseAnimation.endState = style({ transform: 'scale3d(1, 1, 1)' });

export const rubberBandKeyframes = keyframes([
  style({ offset: 0, transform: 'scale3d(1, 1, 1)' }),
  style({ offset: .3, transform: 'scale3d(1.25, 0.75, 1)' }),
  style({ offset: .4, transform: 'scale3d(0.75, 1.25, 1)' }),
  style({ offset: .5, transform: 'scale3d(1.15, 0.85, 1)' }),
  style({ offset: .65, transform: 'scale3d(0.95, 1.05, 1)' }),
  style({ offset: .75, transform: 'scale3d(1.05, 0.95, 1)' }),
  style({ offset: 1, transform: 'scale3d(1, 1, 1)' }),
]);

export const rubberBandAnimation = ((duration: DurationType, delay: DurationType) => animation([
  animate(`${duration} ${delay}`, rubberBandKeyframes)
])) as any as NgAnimationFn;

rubberBandAnimation.startState = rubberBandAnimation.endState = style({ transform: 'scale3d(1, 1, 1)' });

export const shakeXKeyframes = keyframes([
  style({ offset: 0, transform: 'translate3d(0, 0, 0)' }),
  style({ offset: .1, transform: 'translate3d(-10px, 0, 0)' }),
  style({ offset: .2, transform: 'translate3d(10px, 0, 0)' }),
  style({ offset: .3, transform: 'translate3d(-10px, 0, 0)' }),
  style({ offset: .4, transform: 'translate3d(10px, 0, 0)' }),
  style({ offset: .5, transform: 'translate3d(-10px, 0, 0)' }),
  style({ offset: .6, transform: 'translate3d(10px, 0, 0)' }),
  style({ offset: .7, transform: 'translate3d(-10px, 0, 0)' }),
  style({ offset: .8, transform: 'translate3d(10px, 0, 0)' }),
  style({ offset: .9, transform: 'translate3d(-10px, 0, 0)' }),
  style({ offset: 1, transform: 'translate3d(0, 0, 0)' }),
]);

export const shakeXAnimation = ((duration: DurationType, delay: DurationType) => animation([
  animate(`${duration} ${delay}`, shakeXKeyframes)
])) as any as NgAnimationFn;

export const shakeYKeyframes = keyframes([
  style({ offset: 0, transform: 'translate3d(0, 0, 0)' }),
  style({ offset: .1, transform: 'translate3d(0, -10px, 0)' }),
  style({ offset: .2, transform: 'translate3d(0, 10px, 0)' }),
  style({ offset: .3, transform: 'translate3d(0, -10px, 0)' }),
  style({ offset: .4, transform: 'translate3d(0, 10px, 0)' }),
  style({ offset: .5, transform: 'translate3d(0, -10px, 0)' }),
  style({ offset: .6, transform: 'translate3d(0, 10px, 0)' }),
  style({ offset: .7, transform: 'translate3d(0, -10px, 0)' }),
  style({ offset: .8, transform: 'translate3d(0, 10px, 0)' }),
  style({ offset: .9, transform: 'translate3d(0, -10px, 0)' }),
  style({ offset: 1, transform: 'translate3d(0, 0, 0)' }),
]);

export const shakeYAnimation = ((duration: DurationType, delay: DurationType) => animation([
  animate(`${duration} ${delay}`, shakeYKeyframes)
])) as any as NgAnimationFn;

shakeXAnimation.startState =
  shakeXAnimation.endState =
  shakeYAnimation.startState =
  shakeYAnimation.endState = style({ transform: 'translate3d(0, 0, 0)' });

export const headShakeKeyframes = keyframes([
  style({ offset: 0, transform: 'translateX(0)' }),
  style({ offset: .065, transform: 'translateX(-6px) rotateY(-9deg)' }),
  style({ offset: .185, transform: 'translateX(5px) rotateY(7deg)' }),
  style({ offset: .315, transform: 'translateX(-3px) rotateY(-5deg)' }),
  style({ offset: .435, transform: 'translateX(2px) rotateY(3deg))' }),
  style({ offset: .5, transform: 'translateX(0)' }),
]);

export const headShakeAnimation = ((duration: DurationType, delay: DurationType) => animation([
  animate(`${duration} ${delay} ease-in-out`, headShakeKeyframes)
])) as any as NgAnimationFn;

headShakeAnimation.startState = headShakeAnimation.endState = style({ transform: 'translateX(0)' });

export const swingKeyframes = keyframes([
  style({ offset: .2, transform: 'rotate3d(0, 0, 1, 15deg)' }),
  style({ offset: .4, transform: 'rotate3d(0, 0, 1, -10deg)' }),
  style({ offset: .6, transform: 'rotate3d(0, 0, 1, 5deg)' }),
  style({ offset: .8, transform: 'rotate3d(0, 0, 1, -5deg)' }),
  style({ offset: 1, transform: 'rotate3d(0, 0, 1, 0deg)' }),
]);

export const swingAnimation = ((duration: DurationType, delay: DurationType) => animation([
  style({ transformOrigin: 'top center' }),
  animate(`${duration} ${delay}`, swingKeyframes)
])) as any as NgAnimationFn;

swingAnimation.startState = swingAnimation.endState = style({ transform: 'rotate3d(0, 0, 1, 15deg)' });

export const tadaKeyframes = keyframes([
  style({ offset: 0, transform: 'scale3d(1, 1, 1)' }),
  style({ offset: .1, transform: 'scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)' }),
  style({ offset: .2, transform: 'scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)' }),
  style({ offset: .3, transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)' }),
  style({ offset: .4, transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)' }),
  style({ offset: .5, transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)' }),
  style({ offset: .6, transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)' }),
  style({ offset: .7, transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)' }),
  style({ offset: .8, transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)' }),
  style({ offset: .9, transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)' }),
  style({ offset: 1, transform: 'scale3d(1, 1, 1)' }),
]);

export const tadaAnimation = ((duration: DurationType, delay: DurationType) => animation([
  animate(`${duration} ${delay}`, tadaKeyframes)
])) as any as NgAnimationFn;

tadaAnimation.startState = tadaAnimation.endState = style({ transform: 'scale3d(1, 1, 1)' });

export const wobbleKeyframes = keyframes([
  style({ offset: 0, transform: 'translate3d(0, 0, 0)' }),
  style({ offset: .15, transform: 'translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)' }),
  style({ offset: .3, transform: 'translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)' }),
  style({ offset: .45, transform: 'translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)' }),
  style({ offset: .6, transform: 'translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)' }),
  style({ offset: .75, transform: 'translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)' }),
  style({ offset: 1, transform: 'translate3d(0, 0, 0)' }),
]);

export const wobbleAnimation = ((duration: DurationType, delay: DurationType) => animation([
  animate(`${duration} ${delay}`, wobbleKeyframes)
])) as any as NgAnimationFn;

wobbleAnimation.startState = wobbleAnimation.endState = style({ transform: 'translate3d(0, 0, 0)' });

export const jelloKeyframes = keyframes([
  style({ offset: 0, transform: 'translate3d(0, 0, 0)' }),
  style({ offset: .111, transform: 'translate3d(0, 0, 0)' }),
  style({ offset: .222, transform: 'skewX(-12.5deg) skewY(-12.5deg)' }),
  style({ offset: .333, transform: 'skewX(6.25deg) skewY(6.25deg)' }),
  style({ offset: .444, transform: 'skewX(-3.125deg) skewY(-3.125deg)' }),
  style({ offset: .555, transform: 'skewX(1.5625deg) skewY(1.5625deg)' }),
  style({ offset: .666, transform: 'skewX(-0.78125deg) skewY(-0.78125deg)' }),
  style({ offset: .777, transform: 'skewX(0.390625deg) skewY(0.390625deg)' }),
  style({ offset: .888, transform: 'skewX(-0.1953125deg) skewY(-0.1953125deg)' }),
  style({ offset: 1, transform: 'translate3d(0, 0, 0)' }),
]);

export const jelloAnimation = ((duration: DurationType, delay: DurationType) => animation([
  style({ transformOrigin: 'center' }),
  animate(`${duration} ${delay}`, jelloKeyframes)
])) as any as NgAnimationFn;

jelloAnimation.startState = jelloAnimation.endState = style({ transform: 'translate3d(0, 0, 0)' });

export const heartBeatKeyframes = keyframes([
  style({ offset: 0, transform: 'scale(1)' }),
  style({ offset: .14, transform: 'scale(1.3)' }),
  style({ offset: .28, transform: 'scale(1)' }),
  style({ offset: .42, transform: 'scale(1.3)' }),
  style({ offset: .7, transform: 'scale(1)' }),
]);

export const heartBeatAnimation = ((duration: DurationType, delay: DurationType) => animation([
  animate(`${duration} ${delay} ease-in-out`, heartBeatKeyframes)
])) as any as NgAnimationFn;

heartBeatAnimation.startState = headShakeAnimation.endState = style({ transform: 'scale(1)' });

export const backInDownKeyframes = keyframes([
  style({ offset: 0, transform: 'translateY(-1200px) scale(0.7)', opacity: 0.7, }),
  style({ offset: .8, transform: 'translateY(0px) scale(0.7)', opacity: 0.7, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' }),
  style({ offset: 1, transform: 'scale(1)', opacity: 1 }),
]);

const backInDownStartState = style({ transform: 'translateY(-1200px) scale(0.7)', opacity: 0.7 });
const backInEndState = style({ transform: 'scale(1)', opacity: 1 });

export const backInDownAnimation = ((duration: DurationType, delay: DurationType) => animation([
  backInDownStartState,
  animate(`${duration} ${delay}`, backInDownKeyframes)
])) as any as NgAnimationFn;

backInDownAnimation.startState = backInDownStartState;
backInDownAnimation.endState = backInEndState;

export const backInLeftKeyframes = keyframes([
  style({ offset: 0, transform: 'translateX(-2000px) scale(0.7)', opacity: 0.7, }),
  style({ offset: .8, transform: 'translateX(0px) scale(0.7)', opacity: 0.7, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' }),
  style({ offset: 1, transform: 'scale(1)', opacity: 1 }),
]);

const backInLeftStartState = style({ transform: 'translateX(-2000px) scale(0.7)', opacity: 0.7 });

export const backInLeftAnimation = ((duration: DurationType, delay: DurationType) => animation([
  backInDownStartState,
  animate(`${duration} ${delay}`, backInLeftKeyframes)
])) as any as NgAnimationFn;

backInLeftAnimation.startState = backInLeftStartState;
backInLeftAnimation.endState = backInEndState;

export const backInRightKeyframes = keyframes([
  style({ offset: 0, transform: 'translateX(2000px) scale(0.7)', opacity: 0.7, }),
  style({ offset: .8, transform: 'translateX(0px) scale(0.7)', opacity: 0.7, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' }),
  style({ offset: 1, transform: 'scale(1)', opacity: 1 }),
]);

const backInRightStartState = style({ transform: 'translateX(2000px) scale(0.7)', opacity: 0.7 });

export const backInRightAnimation = ((duration: DurationType, delay: DurationType) => animation([
  backInDownStartState,
  animate(`${duration} ${delay}`, backInRightKeyframes)
])) as any as NgAnimationFn;

backInRightAnimation.startState = backInRightStartState;
backInRightAnimation.endState = backInEndState;

export const backInUpKeyframes = keyframes([
  style({ offset: 0, transform: 'translateY(1200px) scale(0.7)', opacity: 0.7, }),
  style({ offset: .8, transform: 'translateY(0px) scale(0.7)', opacity: 0.7, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' }),
  style({ offset: 1, transform: 'scale(1)', opacity: 1 }),
]);

const backInUpStartState = style({ transform: 'translateY(1200px) scale(0.7)', opacity: 0.7 });

export const backInUpAnimation = ((duration: DurationType, delay: DurationType) => animation([
  backInDownStartState,
  animate(`${duration} ${delay}`, backInUpKeyframes)
])) as any as NgAnimationFn;

backInUpAnimation.startState = backInUpStartState;
backInUpAnimation.endState = backInEndState;

const backOutStartState = style({ transform: 'scale(1)', opacity: 1 });

export const backOutDownKeyframes = keyframes([
  style({ offset: 0, transform: 'scale(1)', opacity: 1 }),
  style({ offset: .2, transform: 'translateY(0px) scale(0.7)', opacity: .7, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' }),
  style({ offset: 1, transform: 'translateY(700px) scale(0.7)', opacity: .7 }),
]);

export const backOutDownAnimation = ((duration: DurationType, delay: DurationType) => animation([
  backOutStartState,
  animate(`${duration} ${delay}`, backOutDownKeyframes)
])) as any as NgAnimationFn;

backOutDownAnimation.startState = backOutStartState;
backOutDownAnimation.endState = style({ transform: 'translateY(700px) scale(0.7)', opacity: .7 });

export const backOutLeftKeyframes = keyframes([
  style({ offset: 0, transform: 'scale(1)', opacity: 1 }),
  style({ offset: .2, transform: 'translateX(0px) scale(0.7)', opacity: .7, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' }),
  style({ offset: 1, transform: 'translateX(-2000px) scale(0.7)', opacity: .7 }),
]);

export const backOutLeftAnimation = ((duration: DurationType, delay: DurationType) => animation([
  backOutStartState,
  animate(`${duration} ${delay}`, backOutLeftKeyframes)
])) as any as NgAnimationFn;

backOutLeftAnimation.startState = backOutStartState;
backOutLeftAnimation.endState = style({ transform: 'translateX(-2000px) scale(0.7)', opacity: .7 });


export const backOutRightKeyframes = keyframes([
  style({ offset: 0, transform: 'scale(1)', opacity: 1 }),
  style({ offset: .2, transform: 'translateX(0px) scale(0.7)', opacity: .7, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' }),
  style({ offset: 1, transform: 'translateX(2000px) scale(0.7)', opacity: .7 }),
]);

export const backOutRightAnimation = ((duration: DurationType, delay: DurationType) => animation([
  backOutStartState,
  animate(`${duration} ${delay}`, backOutRightKeyframes)
])) as any as NgAnimationFn;

backOutRightAnimation.startState = backOutStartState;
backOutRightAnimation.endState = style({ transform: 'translateX(2000px) scale(0.7)', opacity: .7 });

export const backOutUpKeyframes = keyframes([
  style({ offset: 0, transform: 'scale(1)', opacity: 1 }),
  style({ offset: .2, transform: 'translateY(0px) scale(0.7)', opacity: .7, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' }),
  style({ offset: 1, transform: 'translateY(-700px) scale(0.7)', opacity: .7 }),
]);

export const backOutUpAnimation = ((duration: DurationType, delay: DurationType) => animation([
  backOutStartState,
  animate(`${duration} ${delay}`, backOutUpKeyframes)
])) as any as NgAnimationFn;

backOutUpAnimation.startState = backOutStartState;
backOutUpAnimation.endState = style({ transform: 'translateY(700px) scale(0.7)', opacity: .7 });

export const bounceInKeyframes = keyframes([
  style({ offset: 0, transform: 'scale3d(0.3, 0.3, 0.3)', opacity: 0, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
  style({ offset: .2, transform: 'scale3d(1.1, 1.1, 1.1)', easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
  style({ offset: .4, transform: 'scale3d(0.9, 0.9, 0.9)', easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
  style({ offset: .6, transform: 'scale3d(1.03, 1.03, 1.03)', opacity: 1, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
  style({ offset: .8, transform: 'scale3d(0.97, 0.97, 0.97)', easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
  style({ offset: 1, transform: 'scale3d(1, 1, 1)', opacity: 1, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
]);

const bounceInStartState = style({ transform: 'scale3d(0.3, 0.3, 0.3)', opacity: 0 });

export const bounceInAnimation = ((duration: DurationType, delay: DurationType) => animation([
  bounceInStartState,
  animate(`${duration} ${delay}`, bounceInKeyframes)
])) as any as NgAnimationFn;

bounceInAnimation.startState = bounceInStartState;
bounceInAnimation.endState = style({ transform: 'scale3d(1, 1, 1)', opacity: 1 });

const bounceInEndState = style({ transform: 'translate3d(0, 0, 0)' });

export const bounceInDownKeyframes = keyframes([
  style({ offset: 0, transform: 'translate3d(0, -3000px, 0) scaleY(3)', opacity: 0, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
  style({ offset: .6, transform: 'translate3d(0, 25px, 0) scaleY(0.9)', opacity: 1, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
  style({ offset: .75, transform: 'translate3d(0, -10px, 0) scaleY(0.95)', easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
  style({ offset: .9, transform: 'translate3d(0, 5px, 0) scaleY(0.985)', easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
  style({ offset: 1, transform: 'translate3d(0, 0, 0)', easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
]);

const bounceInDownStartState = style({ transform: 'translate3d(0, -3000px, 0) scaleY(3)', opacity: 0 });

export const bounceInDownAnimation = ((duration: DurationType, delay: DurationType) => animation([
  bounceInDownStartState,
  animate(`${duration} ${delay}`, bounceInDownKeyframes)
])) as any as NgAnimationFn;

bounceInDownAnimation.startState = bounceInDownStartState;
bounceInDownAnimation.endState = bounceInEndState;

export const bounceInLeftKeyframes = keyframes([
  style({ offset: 0, transform: 'translate3d(-3000px, 0, 0) scaleX(3)', opacity: 0, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
  style({ offset: .6, transform: 'translate3d(25px, 0, 0) scaleX(1)', opacity: 1, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
  style({ offset: .75, transform: 'translate3d(-10px, 0, 0) scaleX(0.98)', easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
  style({ offset: .9, transform: 'translate3d(5px, 0, 0) scaleX(0.995)', easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
  style({ offset: 1, transform: 'translate3d(0, 0, 0)', easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
]);

const bounceInLeftStartState = style({ transform: 'translate3d(-3000px, 0, 0) scaleX(3)', opacity: 0 });

export const bounceInLeftAnimation = ((duration: DurationType, delay: DurationType) => animation([
  bounceInLeftStartState,
  animate(`${duration} ${delay}`, bounceInLeftKeyframes)
])) as any as NgAnimationFn;

bounceInLeftAnimation.startState = bounceInLeftStartState;
bounceInLeftAnimation.endState = bounceInEndState;


export const bounceInRightKeyframes = keyframes([
  style({ offset: 0, transform: 'translate3d(3000px, 0, 0) scaleX(3)', opacity: 0, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
  style({ offset: .6, transform: 'translate3d(-25px, 0, 0) scaleX(1)', opacity: 1, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
  style({ offset: .75, transform: 'translate3d(10px, 0, 0) scaleX(0.98)', easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
  style({ offset: .9, transform: 'translate3d(-5px, 0, 0) scaleX(0.995)', easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
  style({ offset: 1, transform: 'translate3d(0, 0, 0)', easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
]);

const bounceInRightStartState = style({ transform: 'translate3d(3000px, 0, 0) scaleX(3)', opacity: 0 });

export const bounceInRightAnimation = ((duration: DurationType, delay: DurationType) => animation([
  bounceInRightStartState,
  animate(`${duration} ${delay}`, bounceInRightKeyframes)
])) as any as NgAnimationFn;

bounceInRightAnimation.startState = bounceInRightStartState;
bounceInRightAnimation.endState = bounceInEndState;

export const bounceInUpKeyframes = keyframes([
  style({ offset: 0, transform: 'translate3d(0, 3000px, 0) scaleY(3)', opacity: 0, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
  style({ offset: .6, transform: 'translate3d(0, -25px, 0) scaleY(0.9)', opacity: 1, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
  style({ offset: .75, transform: 'translate3d(0, 10px, 0) scaleY(0.95)', easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
  style({ offset: .9, transform: 'translate3d(0, -5px, 0) scaleY(0.985)', easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
  style({ offset: 1, transform: 'translate3d(0, 0, 0)', easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' }),
]);

const bounceInUpStartState = style({ transform: 'translate3d(0, 3000px, 0) scaleY(3)', opacity: 0 });

export const bounceInUpAnimation = ((duration: DurationType, delay: DurationType) => animation([
  bounceInUpStartState,
  animate(`${duration} ${delay}`, bounceInUpKeyframes)
])) as any as NgAnimationFn;

bounceInUpAnimation.startState = bounceInUpStartState;
bounceInUpAnimation.endState = bounceInEndState;

export const bounceOutKeyframes = keyframes([
  style({ offset: .2, transform: 'scale3d(0.9, 0.9, 0.9)' }),
  style({ offset: .5, transform: 'scale3d(1.1, 1.1, 1.1)' }),
  style({ offset: .55, transform: 'scale3d(1.1, 1.1, 1.1)', opacity: 1 }),
  style({ offset: 1, transform: 'scale3d(0.3, 0.3, 0.3)', opacity: 0 }),
]);



export const bounceOutAnimation = ((duration: DurationType, delay: DurationType) => animation([
  style({ transform: 'scale3d(1, 1, 1)' }),
  animate(`${duration} ${delay}`, bounceOutKeyframes)
])) as any as NgAnimationFn;

bounceOutAnimation.startState = style({ transform: 'scale3d(1, 1, 1)' });
bounceOutAnimation.endState = style({ transform: 'scale3d(0.3, 0.3, 0.3)', opacity: 0 });

export const bounceOutDownKeyframes = keyframes([
  style({ offset: .2, transform: 'translate3d(0, 10px, 0) scaleY(0.985)' }),
  style({ offset: .4, transform: 'translate3d(0, -20px, 0) scaleY(0.9)' }),
  style({ offset: .45, transform: 'translate3d(0, -20px, 0) scaleY(0.9)', opacity: 1 }),
  style({ offset: 1, transform: 'translate3d(0, 2000px, 0) scaleY(0.985)', opacity: 0 }),
]);

const bounceOutStartState = style({ transform: 'translate3d(0, 0, 0) scaleY(1)' });
const bounceOutDownEndState = style({ transform: 'translate3d(0, 2000px, 0) scaleY(0.985)', opacity: 0 });

export const bounceOutDownAnimation = ((duration: DurationType, delay: DurationType) => animation([
  bounceOutStartState,
  animate(`${duration} ${delay}`, bounceOutDownKeyframes)
])) as any as NgAnimationFn;

bounceOutDownAnimation.startState = bounceOutStartState;
bounceOutDownAnimation.endState = bounceOutDownEndState;

export const bounceOutLeftKeyframes = keyframes([
  style({ offset: .2, opacity: 1, transform: 'translate3d(20px, 0, 0) scaleX(0.9)' }),
  style({ offset: 1, opacity: 0, transform: 'translate3d(-2000px, 0, 0) scaleX(2)' }),
]);

export const bounceOutLeftEndState = style({ opacity: 0, transform: 'translate3d(-2000px, 0, 0) scaleX(2)' });

export const bounceOutLeftAnimation = ((duration: DurationType, delay: DurationType) => animation([
  bounceOutStartState,
  animate(`${duration} ${delay}`, bounceOutLeftKeyframes)
])) as any as NgAnimationFn;

bounceOutLeftAnimation.startState = bounceOutStartState;
bounceOutLeftAnimation.endState = bounceOutLeftEndState;

export const bounceOutRightKeyframes = keyframes([
  style({ offset: .2, opacity: 1, transform: 'translate3d(-20px, 0, 0) scaleX(0.9)' }),
  style({ offset: 1, opacity: 0, transform: 'translate3d(2000px, 0, 0) scaleX(2)' }),
]);

export const bounceOutRightEndState = style({ opacity: 0, transform: 'translate3d(2000px, 0, 0) scaleX(2)' });

export const bounceOutRightAnimation = ((duration: DurationType, delay: DurationType) => animation([
  bounceOutStartState,
  animate(`${duration} ${delay}`, bounceOutRightKeyframes)
])) as any as NgAnimationFn;

bounceOutRightAnimation.startState = bounceOutStartState;
bounceOutRightAnimation.endState = bounceOutRightEndState;

export const bounceOutUpKeyframes = keyframes([
  style({ offset: .2, transform: 'translate3d(0, -10px, 0) scaleY(0.985)' }),
  style({ offset: .4, transform: 'translate3d(0, 20px, 0) scaleY(0.9)' }),
  style({ offset: .45, transform: 'translate3d(0, 20px, 0) scaleY(0.9)', opacity: 1 }),
  style({ offset: 1, transform: 'translate3d(0, -2000px, 0) scaleY(0.985)', opacity: 0 }),
]);

const bounceOutUpEndState = style({ transform: 'translate3d(0, -2000px, 0) scaleY(0.985)', opacity: 0 });

export const bounceOutUpAnimation = ((duration: DurationType, delay: DurationType) => animation([
  bounceOutStartState,
  animate(`${duration} ${delay}`, bounceOutUpKeyframes)
])) as any as NgAnimationFn;

bounceOutUpAnimation.startState = bounceOutStartState;
bounceOutUpAnimation.endState = bounceOutUpEndState;

export const flipKeyframes = keyframes([
  style({
    offset: 0,
    transform: 'perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, -360deg)',
    easing: 'ease-out'
  }),
  style({
    offset: .4,
    transform: 'perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg)',
    easing: 'ease-out'
  }),
  style({
    offset: .5,
    transform: 'perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg)',
    easing: 'ease-in'
  }),
  style({
    offset: .9,
    transform: 'perspective(400px) scale3d(0.95, 0.95, 0.95) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg)',
    easing: 'ease-in'
  }),
  style({
    offset: 1,
    transform: 'perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg)',
    easing: 'ease-in'
  }),
]);

const flipBaseState = style({ backfaceVisibility: 'visible' });

export const flipAnimation = ((duration: DurationType, delay: DurationType) => animation([
  flipBaseState,
  animate(`${duration} ${delay}`, flipKeyframes)
])) as any as NgAnimationFn;

flipAnimation.startState = style({ transform: 'perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, -360deg)' });
flipAnimation.endState = style({ transform: 'perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg)' });

export const flipInXKeyframes = keyframes([
  style({
    offset: 0,
    transform: 'perspective(400px) rotate3d(1, 0, 0, 90deg)',
    easing: 'ease-in',
    opacity: 0
  }),
  style({
    offset: .4,
    transform: 'perspective(400px) rotate3d(1, 0, 0, -20deg)',
    easing: 'ease-in',
    opacity: 1
  }),
  style({
    offset: .6,
    transform: 'perspective(400px) rotate3d(1, 0, 0, 10deg)',
  }),
  style({
    offset: .8,
    transform: 'perspective(400px) rotate3d(1, 0, 0, -5deg)'
  }),
  style({
    offset: 1,
    transform: 'perspective(400px)'
  }),
]);

const flipInXStartState = style({ transform: 'perspective(400px) rotate3d(1, 0, 0, 90deg)', opacity: 0 });
const flipInXYEndState = style({ transform: 'perspective(400px)', opacity: 1 });

export const flipInXAnimation = ((duration: DurationType, delay: DurationType) => animation([
  flipInXStartState,
  flipBaseState,
  animate(`${duration} ${delay}`, flipInXKeyframes)
])) as any as NgAnimationFn;

flipInXAnimation.startState = flipInXStartState;
flipInXAnimation.endState = flipInXYEndState;

export const flipInYKeyframes = keyframes([
  style({
    offset: 0,
    transform: 'perspective(400px) rotate3d(0, 1, 0, 90deg)',
    easing: 'ease-in',
    opacity: 0
  }),
  style({
    offset: .4,
    transform: 'perspective(400px) rotate3d(0, 1, 0, -20deg)',
    easing: 'ease-in',
    opacity: 1
  }),
  style({
    offset: .6,
    transform: 'perspective(400px) rotate3d(0, 1, 0, 10deg)',
  }),
  style({
    offset: .8,
    transform: 'perspective(400px) rotate3d(0, 1, 0, -5deg)'
  }),
  style({
    offset: 1,
    transform: 'perspective(400px)'
  }),
]);

const flipInYStartState = style({ transform: 'perspective(400px) rotate3d(0, 1, 0, 90deg)', opacity: 0 });

export const flipInYAnimation = ((duration: DurationType, delay: DurationType) => animation([
  flipInYStartState,
  flipBaseState,
  animate(`${duration} ${delay}`, flipInYKeyframes)
])) as any as NgAnimationFn;

flipInYAnimation.startState = flipInYStartState;
flipInYAnimation.endState = flipInXYEndState;

export const flipOutXKeyframes = keyframes([
  style({ offset: 0, transform: 'perspective(400px)' }),
  style({ offset: .3, transform: 'perspective(400px) rotate3d(1, 0, 0, -20deg)', opacity: 1 }),
  style({ offset: 1, transform: 'perspective(400px) rotate3d(1, 0, 0, 90deg)', opacity: 0 }),
]);

const flipOutXYStartState = flipInXYEndState;
const flipOutXEndState = flipInXStartState;

export const flipOutXAnimation = ((duration: DurationType, delay: DurationType) => animation([
  flipOutXYStartState,
  animate(`${duration} ${delay}`, flipOutXKeyframes)
])) as any as NgAnimationFn;

flipOutXAnimation.startState = flipOutXYStartState;
flipOutXAnimation.endState = flipOutXEndState;

export const flipOutYKeyframes = keyframes([
  style({ offset: 0, transform: 'perspective(400px)' }),
  style({ offset: .3, transform: 'perspective(400px) rotate3d(0, 1, 0, -20deg)', opacity: 1 }),
  style({ offset: 1, transform: 'perspective(400px) rotate3d(0, 1, 0, 90deg)', opacity: 0 }),
]);

const flipOutYEndState = flipInYStartState;

export const flipOutYAnimation = ((duration: DurationType, delay: DurationType) => animation([
  flipOutXYStartState,
  animate(`${duration} ${delay}`, flipOutYKeyframes)
])) as any as NgAnimationFn;

flipOutYAnimation.startState = flipOutXYStartState;
flipOutYAnimation.endState = flipOutYEndState;

export const lightSpeedInLeftKeyframes = keyframes([
  style({ offset: 0, transform: 'translate3d(-100%, 0, 0) skewX(30deg)', opacity: 0 }),
  style({ offset: .6, transform: 'skewX(-20deg)', opacity: 1 }),
  style({ offset: .8, transform: 'skewX(5deg)', }),
  style({ offset: 1, transform: 'translate3d(0, 0, 0)' }),
]);

const lightSpeedInLeftStartState = style({ transform: 'translate3d(-100%, 0, 0) skewX(30deg)', opacity: 0 });
const lightSpeedInLeftRightEndState = style({ transform: 'translate3d(0, 0, 0)' });

export const lightSpeedLeftAnimation = ((duration: DurationType, delay: DurationType) => animation([
  lightSpeedInLeftStartState,
  animate(`${duration} ${delay} ease-out`, lightSpeedInLeftKeyframes)
])) as any as NgAnimationFn;

lightSpeedLeftAnimation.startState = lightSpeedInLeftStartState;
lightSpeedLeftAnimation.endState = lightSpeedInLeftRightEndState;

export const lightSpeedInRightKeyframes = keyframes([
  style({ offset: 0, transform: 'translate3d(100%, 0, 0) skewX(-30deg)', opacity: 0 }),
  style({ offset: .6, transform: 'skewX(20deg)', opacity: 1 }),
  style({ offset: .8, transform: 'skewX(-5deg)', }),
  style({ offset: 1, transform: 'translate3d(0, 0, 0)' }),
]);

const lightSpeedInRightStartState = style({ transform: 'translate3d(-100%, 0, 0) skewX(-30deg)', opacity: 0 });

export const lightSpeedRightAnimation = ((duration: DurationType, delay: DurationType) => animation([
  lightSpeedInRightStartState,
  animate(`${duration} ${delay} ease-out`, lightSpeedInRightKeyframes)
])) as any as NgAnimationFn;

lightSpeedRightAnimation.startState = lightSpeedInRightStartState;
lightSpeedRightAnimation.endState = lightSpeedInLeftRightEndState;

export const lightSpeedOutLeftKeyframes = keyframes([
  style({ offset: 0, opacity: 1 }),
  style({ offset: 1, transform: 'translate3d(-100%, 0, 0) skewX(-30deg)', opacity: 0 })
]);

const lightSpeedOutLeftRightStartState = style({ opacity: 1 });

export const lightSpeedOutLeftAnimation = ((duration: DurationType, delay: DurationType) => animation([
  lightSpeedOutLeftRightStartState,
  animate(`${duration} ${delay} ease-in`, lightSpeedOutLeftKeyframes)
])) as any as NgAnimationFn;

lightSpeedOutLeftAnimation.startState = lightSpeedOutLeftRightStartState;
lightSpeedOutLeftAnimation.endState = lightSpeedInRightStartState;

export const lightSpeedOutRightKeyframes = keyframes([
  style({ offset: 0, opacity: 1 }),
  style({ offset: 1, transform: 'translate3d(100%, 0, 0) skewX(30deg)', opacity: 0 })
]);

export const lightSpeedOutRightAnimation = ((duration: DurationType, delay: DurationType) => animation([
  lightSpeedOutLeftRightStartState,
  animate(`${duration} ${delay} ease-in`, lightSpeedOutRightKeyframes)
])) as any as NgAnimationFn;

lightSpeedOutRightAnimation.startState = lightSpeedOutLeftRightStartState;
lightSpeedOutRightAnimation.endState = lightSpeedInLeftStartState;

export const hingeKeyframes = keyframes([
  style({ offset: 0, easing: 'ease-in-out' }),
  style({ offset: .2, easing: 'ease-in-out', transform: 'rotate3d(0, 0, 1, 80deg)' }),
  style({ offset: .4, easing: 'ease-in-out', transform: 'rotate3d(0, 0, 1, 60deg)' }),
  style({ offset: .6, easing: 'ease-in-out', transform: 'rotate3d(0, 0, 1, 80deg)' }),
  style({ offset: .8, easing: 'ease-in-out', transform: 'rotate3d(0, 0, 1, 60deg)', opacity: 1 }),
  style({ offset: 1, transform: 'translate3d(0, 700px, 0)', opacity: 0 }),
]);

const hingeBaseState = style({ transformOrigin: 'top left' });

export const hingeAnimation = ((duration: DurationType, delay: DurationType) => animation([
  hingeBaseState,
  animate(`${duration} ${delay}`, hingeKeyframes)
])) as any as NgAnimationFn;

hingeAnimation.startState = style({  transform: 'translate3d(0, 0, 0)', opacity: 1 });
hingeAnimation.endState = style({ transform: 'translate3d(0, 700px, 0)', opacity: 0 });

export const jackInTheBoxKeyframes = keyframes([
  style({ offset: 0, opacity: 0, transform: 'scale(0.1) rotate(30deg)', transformOrigin: 'center bottom' }),
  style({ offset: .5, transform: 'rotate(-10deg)', opacity: 1, }),
  style({ offset: .7, transform: 'rotate(3deg)', }),
  style({ offset: 1, transform: 'scale(1)', }),
]);

const jackInTheBoxStartState = style({ opacity: 0, transform: 'scale(0.1) rotate(30deg)', transformOrigin: 'center bottom' });

export const jackInTheBoxAnimation = ((duration: DurationType, delay: DurationType) => animation([
  jackInTheBoxStartState,
  animate(`${duration} ${delay}`, jackInTheBoxKeyframes)
])) as any as NgAnimationFn;

jackInTheBoxAnimation.startState = jackInTheBoxStartState;
jackInTheBoxAnimation.endState = style({ opacity: 1, transform: 'scale(1)', });

export const rollInLeftKeyframes = keyframes([
  style({ offset: 0, opacity: 0, transform: 'translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg)' }),
  style({ offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
]);

const rollInLeftStartState = style({ opacity: 0, transform: 'translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg)' });
const rollInLeftRightEndState = style({ opacity: 1, transform: 'translate3d(0, 0, 0)' });

export const rollInLeftAnimation = ((duration: DurationType, delay: DurationType) => animation([
  rollInLeftStartState,
  animate(`${duration} ${delay} cubic-bezier(0.33, 1, 0.68, 1)`, rollInLeftKeyframes)
])) as any as NgAnimationFn;

rollInLeftAnimation.startState = rollInLeftStartState;
rollInLeftAnimation.endState = rollInLeftRightEndState;

export const rollInRightKeyframes = keyframes([
  style({ offset: 0, opacity: 0, transform: 'translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg)' }),
  style({ offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
]);

const rollInRightStartState = style({ opacity: 0, transform: 'translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg)' });

export const rollInRightAnimation = ((duration: DurationType, delay: DurationType) => animation([
  rollInRightStartState,
  animate(`${duration} ${delay} cubic-bezier(0.33, 1, 0.68, 1)`, rollInRightKeyframes)
])) as any as NgAnimationFn;

rollInRightAnimation.startState = rollInRightStartState;
rollInRightAnimation.endState = rollInLeftRightEndState;

export const rollOutRightKeyframes = keyframes([
  style({ offset: 0, opacity: 1 }),
  style({ offset: 1, opacity: 0, transform: 'translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg)' }),
]);

const rollOutLeftRightStartState = style({ opacity: 1 });
const rollOutRightEndState = rollInRightStartState;

export const rollOutRightAnimation = ((duration: DurationType, delay: DurationType) => animation([
  rollOutLeftRightStartState,
  animate(`${duration} ${delay} ease-in`, rollOutRightKeyframes)
])) as any as NgAnimationFn;

rollOutRightAnimation.startState = rollOutLeftRightStartState;
rollOutRightAnimation.endState = rollOutRightEndState;

export const rollOutLeftKeyframes = keyframes([
  style({ offset: 0, opacity: 1 }),
  style({ offset: 1, opacity: 0, transform: 'translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg)' }),
]);

const rollOutLeftEndState = rollInLeftStartState;

export const rollOutLeftAnimation = ((duration: DurationType, delay: DurationType) => animation([
  rollOutLeftRightStartState,
  animate(`${duration} ${delay} ease-in`, rollOutLeftKeyframes)
])) as any as NgAnimationFn;

rollOutLeftAnimation.startState = rollOutLeftRightStartState;
rollOutLeftAnimation.endState = rollOutLeftEndState;

export const zoomInKeyframes = keyframes([
  style({ offset: 0, opacity: 0, transform: 'scale3d(0.3, 0.3, 0.3)' }),
  style({ offset: .5, opacity: 1, transform: 'scale3d(0.65, 0.65, 0.65)' }),
  style({ offset: 1, transform: 'scale3d(1, 1, 1)' }),
]);

const zoomInStartState = style({ opacity: 0, transform: 'scale3d(0.3, 0.3, 0.3)' });
const zoomInEndState = style({ opacity: 1 });

export const zoomInAnimation = ((duration: DurationType, delay: DurationType) => animation([
  zoomInStartState,
  animate(`${duration} ${delay}`, zoomInKeyframes)
])) as any as NgAnimationFn;

zoomInAnimation.startState = zoomInStartState;
zoomInAnimation.endState = zoomInEndState;

export const zoomInDownKeyframes = keyframes([
  style({
    offset: 0,
    opacity: 0,
    transform: 'scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0)',
  }),
  style({
    offset: .6,
    opacity: 1,
    transform: 'scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0)',
  }),
  style({
    offset: 1,
    transform: 'scale3d(1, 1, 1) translate3d(0, 0, 0)',
  })
]);

const zoomInDownStartState = style({ opacity: 0, transform: 'scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0)' });
const zoomInDownUpLeftRightEndState = zoomInEndState;

export const zoomInDownAnimation = ((duration: DurationType, delay: DurationType) => animation([
  zoomInDownStartState,
  animate(`${duration} ${delay} cubic-bezier(0.550, 0.055, 0.675, 0.190)`, zoomInDownKeyframes)
])) as any as NgAnimationFn;

zoomInDownAnimation.startState = zoomInDownStartState;
zoomInDownAnimation.endState = zoomInDownUpLeftRightEndState;

export const zoomInUpKeyframes = keyframes([
  style({
    offset: 0,
    opacity: 0,
    transform: 'scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0)',
  }),
  style({
    offset: .6,
    opacity: 1,
    transform: 'scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0)',
  }),
  style({
    offset: 1,
    transform: 'scale3d(1, 1, 1) translate3d(0, 0, 0)',
  })
]);

const zoomInUpStartState = style({ opacity: 0, transform: 'scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0)' });

export const zoomInUpAnimation = ((duration: DurationType, delay: DurationType) => animation([
  zoomInUpStartState,
  animate(`${duration} ${delay} cubic-bezier(0.550, 0.055, 0.675, 0.190)`, zoomInUpKeyframes)
])) as any as NgAnimationFn;

zoomInUpAnimation.startState = zoomInUpStartState;
zoomInUpAnimation.endState = zoomInDownUpLeftRightEndState;

export const zoomInLeftKeyframes = keyframes([
  style({
    offset: 0,
    opacity: 0,
    transform: 'scale3d(0.1, 0.1, 0.1) translate3d(-1000px, 0, 0)',
  }),
  style({
    offset: .6,
    opacity: 1,
    transform: 'scale3d(0.475, 0.475, 0.475) translate3d(10px, 0, 0)',
  }),
  style({
    offset: 1,
    transform: 'scale3d(1, 1, 1) translate3d(0, 0, 0)',
  })
]);

const zoomInLeftStartState = style({ opacity: 0, transform: 'scale3d(0.1, 0.1, 0.1) translate3d(-1000px, 0, 0)' });

export const zoomInLeftAnimation = ((duration: DurationType, delay: DurationType) => animation([
  zoomInLeftStartState,
  animate(`${duration} ${delay} cubic-bezier(0.550, 0.055, 0.675, 0.190)`, zoomInLeftKeyframes)
])) as any as NgAnimationFn;

zoomInLeftAnimation.startState = zoomInLeftStartState;
zoomInLeftAnimation.endState = zoomInDownUpLeftRightEndState;

export const zoomInRightKeyframes = keyframes([
  style({
    offset: 0,
    opacity: 0,
    transform: 'scale3d(0.1, 0.1, 0.1) translate3d(1000px, 0, 0)',
  }),
  style({
    offset: .6,
    opacity: 1,
    transform: 'scale3d(0.475, 0.475, 0.475) translate3d(-10px, 0, 0)',
  }),
  style({
    offset: 1,
    transform: 'scale3d(1, 1, 1) translate3d(0, 0, 0)',
  })
]);

const zoomInRightStartState = style({ opacity: 0, transform: 'scale3d(0.1, 0.1, 0.1) translate3d(1000px, 0, 0)' });

export const zoomInRightAnimation = ((duration: DurationType, delay: DurationType) => animation([
  zoomInRightStartState,
  animate(`${duration} ${delay} cubic-bezier(0.550, 0.055, 0.675, 0.190)`, zoomInRightKeyframes)
])) as any as NgAnimationFn;

zoomInRightAnimation.startState = zoomInRightStartState;
zoomInRightAnimation.endState = zoomInDownUpLeftRightEndState;

export const zoomOutKeyframes = keyframes([
  style({ offset: 0, opacity: 1, transform: 'scale3d(1, 1, 1)' }),
  style({ offset: .5, opacity: 0, transform: 'scale3d(.3, .3, .3)' }),
  style({ offset: 1, opacity: 0 }),
]);

const zoomOutStartState = zoomInEndState;
const zoomOutEndState = style({ opacity: 0 });
const zoomOutUpDownBaseStyle = style({ transformOrigin: 'center bottom' });

export const zoomOutAnimation = ((duration: DurationType, delay: DurationType) => animation([
  zoomOutStartState,
  animate(`${duration} ${delay}`, zoomOutKeyframes)
])) as any as NgAnimationFn;

zoomOutAnimation.startState = zoomOutStartState;
zoomOutAnimation.endState = zoomOutEndState;

export const zoomOutDownKeyframes = keyframes([
  style({ offset: 0, opacity: 1, transform: 'scale3d(1, 1, 1) translate3d(0, 0, 0)' }),
  style({
    offset: .4,
    opacity: 1,
    transform: 'scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0)',
    easing: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)'
  }),
  style({
    offset: 1,
    opacity: 0,
    transform: 'scale3d(0.1, 0.1, 0.1) translate3d(0, 2000px, 0)',
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
  }),
]);

const zoomOutDownEndState = style({ opacity: 0, transform: 'scale3d(0.1, 0.1, 0.1) translate3d(0, 2000px, 0)' });

export const zoomOutDownAnimation = ((duration: DurationType, delay: DurationType) => animation([
  zoomOutUpDownBaseStyle,
  zoomOutStartState,
  animate(`${duration} ${delay}`, zoomOutDownKeyframes)
])) as any as NgAnimationFn;

zoomOutDownAnimation.startState = zoomOutStartState;
zoomOutDownAnimation.endState = zoomOutDownEndState;

export const zoomOutUpKeyframes = keyframes([
  style({ offset: 0, opacity: 1, transform: 'scale3d(1, 1, 1) translate3d(0, 0, 0)' }),
  style({
    offset: .4,
    opacity: 1,
    transform: 'scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0)',
    easing: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)'
  }),
  style({
    offset: 1,
    opacity: 0,
    transform: 'scale3d(0.1, 0.1, 0.1) translate3d(0, -2000px, 0)',
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
  }),
]);

const zoomOutUpEndState = style({ opacity: 0, transform: 'scale3d(0.1, 0.1, 0.1) translate3d(0, -2000px, 0)' });

export const zoomOutUpAnimation = ((duration: DurationType, delay: DurationType) => animation([
  zoomOutUpDownBaseStyle,
  zoomOutStartState,
  animate(`${duration} ${delay}`, zoomOutUpKeyframes)
])) as any as NgAnimationFn;

zoomOutUpAnimation.startState = zoomOutStartState;
zoomOutUpAnimation.endState = zoomOutUpEndState;

export const zoomOutLeftKeyframes = keyframes([
  style({ offset: 0, opacity: 1, transform: 'scale3d(1, 1, 1) translate3d(0, 0, 0)' }),
  style({
    offset: .4,
    opacity: 1,
    transform: 'scale3d(0.475, 0.475, 0.475) translate3d(42px, 0, 0)',
    easing: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)'
  }),
  style({
    offset: 1,
    opacity: 0,
    transform: 'scale3d(0.1, 0.1, 0.1) translate3d(-2000px, 0, 0)',
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
  }),
]);

const zoomOutLeftEndState = style({ opacity: 0, transform: 'scale3d(0.1, 0.1, 0.1) translate3d(-2000px, 0, 0)' });

export const zoomOutLeftAnimation = ((duration: DurationType, delay: DurationType) => animation([
  style({ transformOrigin: 'left center' }),
  zoomOutStartState,
  animate(`${duration} ${delay}`, zoomOutLeftKeyframes)
])) as any as NgAnimationFn;

zoomOutLeftAnimation.startState = zoomOutStartState;
zoomOutLeftAnimation.endState = zoomOutLeftEndState;

export const zoomOutRightKeyframes = keyframes([
  style({ offset: 0, opacity: 1, transform: 'scale3d(1, 1, 1) translate3d(0, 0, 0)' }),
  style({
    offset: .4,
    opacity: 1,
    transform: 'scale3d(0.475, 0.475, 0.475) translate3d(-42px, 0, 0)',
    easing: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)'
  }),
  style({
    offset: 1,
    opacity: 0,
    transform: 'scale3d(0.1, 0.1, 0.1) translate3d(2000px, 0, 0)',
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
  }),
]);

const zoomOutRightEndState = style({ opacity: 0, transform: 'scale3d(0.1, 0.1, 0.1) translate3d(2000px, 0, 0)' });

export const zoomOutRightAnimation = ((duration: DurationType, delay: DurationType) => animation([
  style({ transformOrigin: 'right center' }),
  zoomOutStartState,
  animate(`${duration} ${delay}`, zoomOutRightKeyframes)
])) as any as NgAnimationFn;

zoomOutRightAnimation.startState = zoomOutStartState;
zoomOutRightAnimation.endState = zoomOutRightEndState;

export const fadeInKeyframes = keyframes([
  style({ offset: 0, opacity: 0 }),
  style({ offset: 1, opacity: 1 }),
]);

const fadeInStartState = style({ opacity: 0 });
const fadeInEndState = zoomInDownUpLeftRightEndState;

export const fadeInAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeInStartState,
  animate(`${duration} ${delay}`, fadeInKeyframes)
])) as any as NgAnimationFn;

fadeInAnimation.startState = fadeInStartState;
fadeInAnimation.endState = fadeInEndState;

export const fadeInDownKeyframes = keyframes([
  style({ offset: 0, opacity: 0, transform: 'translate3d(0, -100%, 0)' }),
  style({ offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
]);

const fadeInDownStartState = style({ opacity: 0, transform: 'translate3d(0, -100%, 0)' });

export const fadeInDownAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeInDownStartState,
  animate(`${duration} ${delay} ease-out`, fadeInDownKeyframes)
])) as any as NgAnimationFn;

fadeInDownAnimation.startState = fadeInDownStartState;
fadeInDownAnimation.endState = fadeInEndState;

export const fadeInUpKeyframes = keyframes([
  style({ offset: 0, opacity: 0, transform: 'translate3d(0, 100%, 0)' }),
  style({ offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
]);

const fadeInUpStartState = style({ opacity: 0, transform: 'translate3d(0, 100%, 0)' });

export const fadeInUpAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeInUpStartState,
  animate(`${duration} ${delay} ease-out`, fadeInUpKeyframes)
])) as any as NgAnimationFn;

fadeInUpAnimation.startState = fadeInUpStartState;
fadeInUpAnimation.endState = fadeInEndState;

export const fadeInDownBigKeyframes = keyframes([
  style({ offset: 0, opacity: 0, transform: 'translate3d(0, -2000px, 0)' }),
  style({ offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
]);

const fadeInDownBigStartState = style({ opacity: 0, transform: 'translate3d(0, -2000px, 0)' });

export const fadeInDownBigAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeInDownBigStartState,
  animate(`${duration} ${delay} ease-out`, fadeInDownBigKeyframes)
])) as any as NgAnimationFn;

fadeInDownBigAnimation.startState = fadeInDownBigStartState;
fadeInDownBigAnimation.endState = fadeInEndState;

export const fadeInUpBigKeyframes = keyframes([
  style({ offset: 0, opacity: 0, transform: 'translate3d(0, 2000px, 0)' }),
  style({ offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
]);

const fadeInUpBigStartState = style({ opacity: 0, transform: 'translate3d(0, 2000px, 0)' });

export const fadeInUpBigAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeInUpBigStartState,
  animate(`${duration} ${delay} ease-out`, fadeInUpBigKeyframes)
])) as any as NgAnimationFn;

fadeInUpBigAnimation.startState = fadeInUpBigStartState;
fadeInUpBigAnimation.endState = fadeInEndState;

export const fadeInLeftKeyframes = keyframes([
  style({ offset: 0, opacity: 0, transform: 'translate3d(-100%, 0, 0)' }),
  style({ offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
]);

const fadeInLeftStartState = style({ opacity: 0, transform: 'translate3d(-100%, 0, 0)' });

export const fadeInLeftAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeInLeftStartState,
  animate(`${duration} ${delay} ease-out`, fadeInLeftKeyframes)
])) as any as NgAnimationFn;

fadeInLeftAnimation.startState = fadeInLeftStartState;
fadeInLeftAnimation.endState = fadeInEndState;

export const fadeInRightKeyframes = keyframes([
  style({ offset: 0, opacity: 0, transform: 'translate3d(100%, 0, 0)' }),
  style({ offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
]);

const fadeInRightStartState = style({ opacity: 0, transform: 'translate3d(100%, 0, 0)' });

export const fadeInRightAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeInRightStartState,
  animate(`${duration} ${delay} ease-out`, fadeInRightKeyframes)
])) as any as NgAnimationFn;

fadeInRightAnimation.startState = fadeInRightStartState;
fadeInRightAnimation.endState = fadeInEndState;

export const fadeInLeftBigKeyframes = keyframes([
  style({ offset: 0, opacity: 0, transform: 'translate3d(-2000px, 0, 0)' }),
  style({ offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
]);

const fadeInLeftBigStartState = style({ opacity: 0, transform: 'translate3d(-2000px, 0, 0)' });

export const fadeInLeftBigAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeInLeftBigStartState,
  animate(`${duration} ${delay} ease-out`, fadeInLeftBigKeyframes)
])) as any as NgAnimationFn;

fadeInLeftBigAnimation.startState = fadeInLeftBigStartState;
fadeInLeftBigAnimation.endState = fadeInEndState;

export const fadeInRightBigKeyframes = keyframes([
  style({ offset: 0, opacity: 0, transform: 'translate3d(2000px, 0, 0)' }),
  style({ offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
]);

const fadeInRightBigStartState = style({ opacity: 0, transform: 'translate3d(2000px, 0, 0)' });

export const fadeInRightBigAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeInRightBigStartState,
  animate(`${duration} ${delay} ease-out`, fadeInRightBigKeyframes)
])) as any as NgAnimationFn;

fadeInRightBigAnimation.startState = fadeInLeftBigStartState;
fadeInRightBigAnimation.endState = fadeInEndState;

export const fadeInBottomLeftKeyframes = keyframes([
  style({ offset: 0, opacity: 0, transform: 'translate3d(-100%, 100%, 0)' }),
  style({ offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
]);

const fadeInBottomLeftStartState = style({ opacity: 0, transform: 'translate3d(-100%, 100%, 0)' });

export const fadeInBottomLeftAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeInBottomLeftStartState,
  animate(`${duration} ${delay} ease-out`, fadeInBottomLeftKeyframes)
])) as any as NgAnimationFn;

fadeInBottomLeftAnimation.startState = fadeInBottomLeftStartState;
fadeInBottomLeftAnimation.endState = fadeInEndState;

export const fadeInBottomRightKeyframes = keyframes([
  style({ offset: 0, opacity: 0, transform: 'translate3d(100%, 100%, 0)' }),
  style({ offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
]);

const fadeInBottomRightStartState = style({ opacity: 0, transform: 'translate3d(100%, 100%, 0)' });

export const fadeInBottomRightAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeInBottomRightStartState,
  animate(`${duration} ${delay} ease-out`, fadeInBottomRightKeyframes)
])) as any as NgAnimationFn;

fadeInBottomRightAnimation.startState = fadeInBottomRightStartState;
fadeInBottomRightAnimation.endState = fadeInEndState;

export const fadeInTopLeftKeyframes = keyframes([
  style({ offset: 0, opacity: 0, transform: 'translate3d(-100%, -100%, 0)' }),
  style({ offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
]);

const fadeInTopLeftStartState = style({ opacity: 0, transform: 'translate3d(-100%, -100%, 0)' });

export const fadeInTopLeftAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeInTopLeftStartState,
  animate(`${duration} ${delay} ease-out`, fadeInTopLeftKeyframes)
])) as any as NgAnimationFn;

fadeInTopLeftAnimation.startState = fadeInTopLeftStartState;
fadeInTopLeftAnimation.endState = fadeInEndState;

export const fadeInTopRightKeyframes = keyframes([
  style({ offset: 0, opacity: 0, transform: 'translate3d(100%, -100%, 0)' }),
  style({ offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
]);

const fadeInTopRightStartState = style({ opacity: 0, transform: 'translate3d(100%, -100%, 0)' });

export const fadeInTopRightAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeInTopRightStartState,
  animate(`${duration} ${delay} ease-out`, fadeInTopRightKeyframes)
])) as any as NgAnimationFn;

fadeInTopRightAnimation.startState = fadeInTopRightStartState;
fadeInTopRightAnimation.endState = fadeInEndState;

export const fadeOutKeyframes = keyframes([
  style({ offset: 0, opacity: 1 }),
  style({ offset: 1, opacity: 0 }),
]);

const fadeOutStartState = fadeInEndState;
const fadeOutEndState = style({ opacity: 0 });

export const fadeOutAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeOutStartState,
  animate(`${duration} ${delay}`, fadeOutKeyframes)
])) as any as NgAnimationFn;

fadeOutAnimation.startState = fadeOutStartState;
fadeOutAnimation.endState = fadeOutEndState;

export const fadeOutDownKeyframes = keyframes([
  style({ offset: 0, opacity: 1 }),
  style({ offset: 1, opacity: 0, transform: 'translate3d(0, 100%, 0)' }),
]);

const fadeOutDownEndState = fadeInUpStartState;

export const fadeOutDownAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeOutStartState,
  animate(`${duration} ${delay} ease-in`, fadeOutDownKeyframes)
])) as any as NgAnimationFn;

fadeOutDownAnimation.startState = fadeOutStartState;
fadeOutDownAnimation.endState = fadeOutDownEndState;

export const fadeOutUpKeyframes = keyframes([
  style({ offset: 0, opacity: 1 }),
  style({ offset: 1, opacity: 0, transform: 'translate3d(0, -100%, 0)' }),
]);

const fadeOutUpEndState = fadeInDownStartState;

export const fadeOutUpAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeOutStartState,
  animate(`${duration} ${delay} ease-in`, fadeOutUpKeyframes)
])) as any as NgAnimationFn;

fadeOutUpAnimation.startState = fadeOutStartState;
fadeOutUpAnimation.endState = fadeOutUpEndState;

export const fadeOutLeftKeyframes = keyframes([
  style({ offset: 0, opacity: 1 }),
  style({ offset: 1, opacity: 0, transform: 'translate3d(-100%, 0, 0)' }),
]);

const fadeOutLeftEndState = fadeInRightStartState;

export const fadeOutLeftAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeOutStartState,
  animate(`${duration} ${delay} ease-in`, fadeOutLeftKeyframes)
])) as any as NgAnimationFn;

fadeOutLeftAnimation.startState = fadeOutStartState;
fadeOutLeftAnimation.endState = fadeOutLeftEndState;

export const fadeOutRightKeyframes = keyframes([
  style({ offset: 0, opacity: 1 }),
  style({ offset: 1, opacity: 0, transform: 'translate3d(100%, 0, 0)' }),
]);

const fadeOutRightEndState = fadeInLeftStartState;

export const fadeOutRightAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeOutStartState,
  animate(`${duration} ${delay} ease-in`, fadeOutRightKeyframes)
])) as any as NgAnimationFn;

fadeOutRightAnimation.startState = fadeOutStartState;
fadeOutRightAnimation.endState = fadeOutRightEndState;

export const fadeOutDownBigKeyframes = keyframes([
  style({ offset: 0, opacity: 1 }),
  style({ offset: 1, opacity: 0, transform: 'translate3d(0, 2000px, 0)' }),
]);

const fadeOutDownBigEndState = fadeInUpBigStartState;

export const fadeOutDownBigAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeOutStartState,
  animate(`${duration} ${delay} ease-in`, fadeOutDownBigKeyframes)
])) as any as NgAnimationFn;

fadeOutDownBigAnimation.startState = fadeOutStartState;
fadeOutDownBigAnimation.endState = fadeOutDownBigEndState;

export const fadeOutUpBigKeyframes = keyframes([
  style({ offset: 0, opacity: 1 }),
  style({ offset: 1, opacity: 0, transform: 'translate3d(0, -2000px, 0)' }),
]);

const fadeOutUpBigEndState = fadeInDownBigStartState;

export const fadeOutUpBigAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeOutStartState,
  animate(`${duration} ${delay} ease-in`, fadeOutUpBigKeyframes)
])) as any as NgAnimationFn;

fadeOutUpBigAnimation.startState = fadeOutStartState;
fadeOutUpBigAnimation.endState = fadeOutUpBigEndState;

export const fadeOutLeftBigKeyframes = keyframes([
  style({ offset: 0, opacity: 1 }),
  style({ offset: 1, opacity: 0, transform: 'translate3d(-2000px, 0, 0)' }),
]);

const fadeOutLeftBigEndState = fadeInRightBigStartState;

export const fadeOutLeftBigAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeOutStartState,
  animate(`${duration} ${delay} ease-in`, fadeOutLeftBigKeyframes)
])) as any as NgAnimationFn;

fadeOutLeftBigAnimation.startState = fadeOutStartState;
fadeOutLeftBigAnimation.endState = fadeOutLeftBigEndState;

export const fadeOutRightBigKeyframes = keyframes([
  style({ offset: 0, opacity: 1 }),
  style({ offset: 1, opacity: 0, transform: 'translate3d(2000px, 0, 0)' }),
]);

const fadeOutRightBigEndState = fadeInLeftBigStartState;

export const fadeOutRightBigAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeOutStartState,
  animate(`${duration} ${delay} ease-in`, fadeOutRightBigKeyframes)
])) as any as NgAnimationFn;

fadeOutRightBigAnimation.startState = fadeOutStartState;
fadeOutRightBigAnimation.endState = fadeOutRightBigEndState;

export const fadeOutBottomLeftKeyframes = keyframes([
  style({ offset: 0, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
  style({ offset: 1, opacity: 0, transform: 'translate3d(-100%, 100%, 0)' }),
]);

const fadeOutBottonLeftEndState = fadeInBottomRightStartState;

export const fadeOutBottomLeftAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeOutStartState,
  animate(`${duration} ${delay} ease-in`, fadeOutBottomLeftKeyframes)
])) as any as NgAnimationFn;

fadeOutBottomLeftAnimation.startState = fadeOutStartState;
fadeOutBottomLeftAnimation.endState = fadeOutBottonLeftEndState;

export const fadeOutBottomRightKeyframes = keyframes([
  style({ offset: 0, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
  style({ offset: 1, opacity: 0, transform: 'translate3d(100%, 100%, 0)' }),
]);

const fadeOutBottonRightEndState = fadeInBottomLeftStartState;

export const fadeOutBottomRightAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeOutStartState,
  animate(`${duration} ${delay} ease-in`, fadeOutBottomRightKeyframes)
])) as any as NgAnimationFn;

fadeOutBottomRightAnimation.startState = fadeOutStartState;
fadeOutBottomRightAnimation.endState = fadeOutBottonRightEndState;

export const fadeOutTopLeftKeyframes = keyframes([
  style({ offset: 0, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
  style({ offset: 1, opacity: 0, transform: 'translate3d(-100%, -100%, 0)' }),
]);

const fadeOutTopLeftEndState = fadeInTopLeftStartState;

export const fadeOutTopLeftAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeOutStartState,
  animate(`${duration} ${delay} ease-in`, fadeOutTopLeftKeyframes)
])) as any as NgAnimationFn;

fadeOutTopLeftAnimation.startState = fadeOutStartState;
fadeOutTopLeftAnimation.endState = fadeOutTopLeftEndState;

export const fadeOutTopRightKeyframes = keyframes([
  style({ offset: 0, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
  style({ offset: 1, opacity: 0, transform: 'translate3d(100%, -100%, 0)' }),
]);

const fadeOutTopRightEndState = fadeInTopRightStartState;

export const fadeOutTopRightAnimation = ((duration: DurationType, delay: DurationType) => animation([
  fadeOutStartState,
  animate(`${duration} ${delay} ease-in`, fadeOutTopRightKeyframes)
])) as any as NgAnimationFn;

fadeOutTopRightAnimation.startState = fadeOutStartState;
fadeOutTopRightAnimation.endState = fadeOutTopRightEndState;

export const rotateInKeyframes = keyframes([
  style({ offset: 0, opacity: 0, transform: 'rotate3d(0, 0, 1, -200deg)' }),
  style({ offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
]);

const rotateInStartState = style({ opacity: 0, transform: 'rotate3d(0, 0, 1, -200deg)' });
const rotataInEndState = fadeInEndState;

export const rotateInAnimation = ((duration: DurationType, delay: DurationType) => animation([
  style({ transformOrigin: 'center' }),
  rotateInStartState,
  animate(`${duration} ${delay} cubic-bezier(0.215, 0.61, 0.355, 1)`, rotateInKeyframes)
])) as any as NgAnimationFn;

rotateInAnimation.startState = rotateInStartState;
rotateInAnimation.endState = rotataInEndState;

export const rotateInLeftDownKeyframes = keyframes([
  style({ offset: 0, opacity: 0, transform: 'rotate3d(0, 0, 1, -45deg)' }),
  style({ offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
]);

const rotateInLeftDownStartState = style({ opacity: 0, transform: 'rotate3d(0, 0, 1, -45deg)' });

export const rotateInLeftDownAnimation = ((duration: DurationType, delay: DurationType) => animation([
  style({ transformOrigin: 'left bottom' }),
  rotateInLeftDownStartState,
  animate(`${duration} ${delay} cubic-bezier(0.215, 0.61, 0.355, 1)`, rotateInLeftDownKeyframes)
])) as any as NgAnimationFn;

rotateInLeftDownAnimation.startState = rotateInLeftDownStartState;
rotateInLeftDownAnimation.endState = rotataInEndState;

export const rotateInRightDownKeyframes = keyframes([
  style({ offset: 0, opacity: 0, transform: 'rotate3d(0, 0, 1, 45deg)' }),
  style({ offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
]);

const rotateInRightDownStartState = style({ opacity: 0, transform: 'rotate3d(0, 0, 1, 45deg)' });

export const rotateInRightDownAnimation = ((duration: DurationType, delay: DurationType) => animation([
  style({ transformOrigin: 'right bottom' }),
  rotateInRightDownStartState,
  animate(`${duration} ${delay} cubic-bezier(0.215, 0.61, 0.355, 1)`, rotateInRightDownKeyframes)
])) as any as NgAnimationFn;

rotateInRightDownAnimation.startState = rotateInRightDownStartState;
rotateInRightDownAnimation.endState = rotataInEndState;

export const rotateInLeftUpKeyframes = keyframes([
  style({ offset: 0, opacity: 0, transform: 'rotate3d(0, 0, 1, 45deg)' }),
  style({ offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
]);

const rotateInLeftUpStartState = rotateInRightDownStartState;

export const rotateInLeftUpAnimation = ((duration: DurationType, delay: DurationType) => animation([
  style({ transformOrigin: 'left bottom' }),
  rotateInLeftUpStartState,
  animate(`${duration} ${delay} cubic-bezier(0.215, 0.61, 0.355, 1)`, rotateInLeftUpKeyframes)
])) as any as NgAnimationFn;

rotateInLeftUpAnimation.startState = rotateInLeftUpStartState;
rotateInLeftUpAnimation.endState = rotataInEndState;

export const rotateInRightUpKeyframes = keyframes([
  style({ offset: 0, opacity: 0, transform: 'rotate3d(0, 0, 1, -45deg)' }),
  style({ offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
]);

const rotateInRightUpStartState = rotateInLeftDownStartState;

export const rotateInRightUpAnimation = ((duration: DurationType, delay: DurationType) => animation([
  style({ transformOrigin: 'right bottom' }),
  rotateInLeftDownStartState,
  animate(`${duration} ${delay} cubic-bezier(0.215, 0.61, 0.355, 1)`, rotateInRightUpKeyframes)
])) as any as NgAnimationFn;

rotateInRightUpAnimation.startState = rotateInRightUpStartState;
rotateInRightUpAnimation.endState = rotataInEndState;

export const rotateOutKeyframes = keyframes([
  style({ offset: 0, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
  style({ offset: 1, opacity: 0, transform: 'rotate3d(0, 0, 1, -200deg)' }),
]);

const rotateOutStartState = style({ opacity: 1, transform: 'translate3d(0, 0, 0)' });
const rotataOutEndState = fadeOutEndState;

export const rotateOutAnimation = ((duration: DurationType, delay: DurationType) => animation([
  style({ transformOrigin: 'center' }),
  rotateOutStartState,
  animate(`${duration} ${delay} cubic-bezier(0.215, 0.61, 0.355, 1)`, rotateOutKeyframes)
])) as any as NgAnimationFn;

rotateOutAnimation.startState = rotateOutStartState;
rotateOutAnimation.endState = rotataOutEndState;

export const rotateOutLeftDownKeyframes = keyframes([
  style({ offset: 0, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
  style({ offset: 1, opacity: 0, transform: 'rotate3d(0, 0, 1, 45deg)' }),
]);

export const rotateOutLeftDownAnimation = ((duration: DurationType, delay: DurationType) => animation([
  style({ transformOrigin: 'left bottom' }),
  rotateOutStartState,
  animate(`${duration} ${delay} cubic-bezier(0.215, 0.61, 0.355, 1)`, rotateOutLeftDownKeyframes)
])) as any as NgAnimationFn;

rotateOutLeftDownAnimation.startState = rotateOutStartState;
rotateOutLeftDownAnimation.endState = style({ opacity: 0, transform: 'rotate3d(0, 0, 1, 45deg)' });

export const rotateOutRightDownKeyframes = keyframes([
  style({ offset: 0, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
  style({ offset: 1, opacity: 0, transform: 'rotate3d(0, 0, 1, -45deg)' }),
]);

export const rotateOutRightDownAnimation = ((duration: DurationType, delay: DurationType) => animation([
  style({ transformOrigin: 'right bottom' }),
  rotateOutStartState,
  animate(`${duration} ${delay} cubic-bezier(0.215, 0.61, 0.355, 1)`, rotateOutRightDownKeyframes)
])) as any as NgAnimationFn;

rotateOutRightDownAnimation.startState = rotateOutStartState;
rotateOutRightDownAnimation.endState = style({ opacity: 0, transform: 'rotate3d(0, 0, 1, -45deg)' });

export const rotateOutLeftUpKeyframes = keyframes([
  style({ offset: 0, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
  style({ offset: 1, opacity: 0, transform: 'rotate3d(0, 0, 1, -45deg)' }),
]);

export const rotateOutLeftUpAnimation = ((duration: DurationType, delay: DurationType) => animation([
  style({ transformOrigin: 'left bottom' }),
  rotateOutStartState,
  animate(`${duration} ${delay} cubic-bezier(0.215, 0.61, 0.355, 1)`, rotateOutLeftUpKeyframes)
])) as any as NgAnimationFn;

rotateOutLeftUpAnimation.startState = rotateOutStartState;
rotateOutLeftUpAnimation.endState = rotateOutRightDownAnimation.endState;

export const rotateOutRightUpKeyframes = keyframes([
  style({ offset: 0, opacity: 1, transform: 'translate3d(0, 0, 0)' }),
  style({ offset: 1, opacity: 0, transform: 'rotate3d(0, 0, 1, 45deg)' }),
]);

export const rotateOutRightUpAnimation = ((duration: DurationType, delay: DurationType) => animation([
  style({ transformOrigin: 'right bottom' }),
  rotateOutStartState,
  animate(`${duration} ${delay} cubic-bezier(0.215, 0.61, 0.355, 1)`, rotateOutRightUpKeyframes)
])) as any as NgAnimationFn;
