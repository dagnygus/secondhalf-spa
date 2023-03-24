/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
const NEWTON_ITERATIONS = 4;
const NEWTON_MIN_SLOPE = 0.001;
const SUBDIVISION_PRECISION = 0.0000001;
const SUBDIVISION_MAX_ITERATIONS = 10;

const kSplineTableSize = 11;
const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

const float32ArraySupported = typeof Float32Array === 'function';

function _A(aA1: number, aA2: number): number { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
function _B(aA1: number, aA2: number): number { return 3.0 * aA2 - 6.0 * aA1; }
function _C(aA1: number): number { return 3.0 * aA1; }

function _calcBezier(aT: number, aA1: number, aA2: number): number {
  return ((_A(aA1, aA2) * aT + _B(aA1, aA2)) * aT + _C(aA1)) * aT;
}

function _getSlope(aT: number, aA1: number, aA2: number): number {
  return 3.0 * _A(aA1, aA2) * aT * aT + 2.0 * _B(aA1, aA2) * aT + _C(aA1);
}

function _binarySubdivide(aX: number, aA: number, aB: number, mX1: number, mX2: number): number {
  let currentX;
  let currentT;
  let i = 0;
  do {
    currentT = aA + (aB - aA) / 2.0;
    currentX = _calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0.0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
  return currentT;
}

function _newtonRaphsonIterate(aX: number, aGuessT: number, mX1: number, mX2: number): number {
  for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
    const currentSlope = _getSlope(aGuessT, mX1, mX2);
    if (currentSlope === 0.0) {
      return aGuessT;
    }
    const currentX = _calcBezier(aGuessT, mX1, mX2) - aX;
    aGuessT -= currentX / currentSlope;
  }
  return aGuessT;
}

export function linearEasing(x: number): number {
  return x;
}

export function getCubicBezierEasing(mX1: number, mY1: number, mX2: number, mY2: number): (t: number) => number {
  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
    throw new Error('bezier x values must be in [0, 1] range');
  }

  if (mX1 === mY1 && mX2 === mY2) {
    return linearEasing;
  }

  // Precompute samples table
  const sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
  for (let i = 0; i < kSplineTableSize; ++i) {
    sampleValues[i] = _calcBezier(i * kSampleStepSize, mX1, mX2);
  }

  function getTForX(aX: number): number {
    let intervalStart = 0.0;
    let currentSample = 1;
    const lastSample = kSplineTableSize - 1;

    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;

    // Interpolate to provide an initial guess for t
    const dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    const guessForT = intervalStart + dist * kSampleStepSize;

    const initialSlope = _getSlope(guessForT, mX1, mX2);
    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return _newtonRaphsonIterate(aX, guessForT, mX1, mX2);
    } else if (initialSlope === 0.0) {
      return guessForT;
    } else {
      return _binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
    }
  }

  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  return function(t: number): number {
    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
    if (t <= 0) {
      return 0;
    }

    if (t >= 1) {
      return 1;
    }

    return _calcBezier(getTForX(t), mY1, mY2);
  };
}

export type Easing = 'ease' |
                     'ease-in' |
                     'ease-out' |
                     'ease-in-out' |
                     'ease-in-sine' |
                     'ease-out-sine' |
                     'ease-in-out-sine' |
                     'ease-in-quad' |
                     'ease-out-quad' |
                     'ease-in-out-quad' |
                     'ease-in-cubic' |
                     'ease-out-cubic' |
                     'ease-in-out-cubic' |
                     'ease-in-quart' |
                     'ease-out-quart' |
                     'ease-in-out-quart' |
                     'ease-in-quint' |
                     'ease-out-quint' |
                     'ease-in-out-quint' |
                     'ease-in-expo' |
                     'ease-out-expo' |
                     'ease-in-out-expo' |
                     'ease-in-circ' |
                     'ease-out-circ' |
                     'ease-in-out-circ' |
                     'ease-in-back' |
                     'ease-out-back' |
                     'ease-in-out-back';


export const EASE = 'cubic-bezier(0.25, 0.1, 0.25, 1.0)';
export const EASE_IN = 'cubic-bezier(0.42, 0.0, 1.0, 1.0)';
export const EASE_OUT = 'cubic-bezier(0.0, 0.0, 0.58, 1.0)';
export const EASE_IN_OUT = 'cubic-bezier(0.42, 0.0, 0.58, 1.0)';
export const EASE_IN_SINE = 'cubic-bezier(0.12, 0, 0.39, 0)';
export const EASE_OUT_SINE = 'cubic-bezier(0.61, 1, 0.88, 1)';
export const EASE_IN_OUT_SINE = 'cubic-bezier(0.37, 0, 0.63, 1)';
export const EASE_IN_QUAD = 'cubic-bezier(0.11, 0, 0.5, 0)';
export const EASE_OUT_QUAD = 'cubic-bezier(0.5, 1, 0.89, 1)';
export const EASE_IN_OUT_QUAD = 'cubic-bezier(0.45, 0, 0.55, 1)';
export const EASE_IN_CUBIC = 'cubic-bezier(0.32, 0, 0.67, 0)';
export const EASE_OUT_CUBIC = 'cubic-bezier(0.33, 1, 0.68, 1)';
export const EASE_IN_OUT_CUBIC = 'cubic-bezier(0.65, 0, 0.35, 1)';
export const EASE_IN_QUART = 'cubic-bezier(0.5, 0, 0.75, 0)';
export const EASE_OUT_QUART = 'cubic-bezier(0.25, 1, 0.5, 1)';
export const EASE_IN_OUT_QUART = 'cubic-bezier(0.76, 0, 0.24, 1)';
export const EASE_IN_QUINT = 'cubic-bezier(0.64, 0, 0.78, 0)';
export const EASE_OUT_QUINT = 'cubic-bezier(0.22, 1, 0.36, 1)';
export const EASE_IN_OUT_QUINT = 'cubic-bezier(0.83, 0, 0.17, 1)';
export const EASE_IN_EXPO = 'cubic-bezier(0.7, 0, 0.84, 0)';
export const EASE_OUT_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';
export const EASE_IN_OUT_EXPO = 'cubic-bezier(0.87, 0, 0.13, 1)';
export const EASE_IN_CIRC = 'cubic-bezier(0.55, 0, 1, 0.45)';
export const EASE_OUT_CIRC = 'cubic-bezier(0, 0.55, 0.45, 1)';
export const EASE_IN_OUT_CIRC = 'cubic-bezier(0.85, 0, 0.15, 1)';
export const EASE_IN_BACK = 'cubic-bezier(0.36, 0, 0.66, -0.56)';
export const EASE_OUT_BACK = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
export const EASE_IN_OUT_BACK = 'cubic-bezier(0.68, -0.6, 0.32, 1.6)';

export const ease = getCubicBezierEasing(0.25, 0.1, 0.25, 1.0);
export const easeIn = getCubicBezierEasing(0.42, 0.0, 1.0, 1.0);
export const easeOut = getCubicBezierEasing(0.0, 0.0, 0.58, 1.0);
export const easeInOut = getCubicBezierEasing(0.42, 0.0, 0.58, 1.0);
export const easeInSine = getCubicBezierEasing(0.12, 0, 0.39, 0);
export const easeOutSine = getCubicBezierEasing(0.61, 1, 0.88, 1);
export const easeInOutSine = getCubicBezierEasing(0.37, 0, 0.63, 1);
export const easeInQuad = getCubicBezierEasing(0.11, 0, 0.5, 0);
export const easeOutQuad = getCubicBezierEasing(0.5, 1, 0.89, 1);
export const easeInOutQuad = getCubicBezierEasing(0.45, 0, 0.55, 1);
export const easeInCubic = getCubicBezierEasing(0.32, 0, 0.67, 0);
export const easeOutCubic = getCubicBezierEasing(0.33, 1, 0.68, 1);
export const easeInOutCubic = getCubicBezierEasing(0.65, 0, 0.35, 1);
export const easeInQuart = getCubicBezierEasing(0.5, 0, 0.75, 0);
export const easeOutQuart = getCubicBezierEasing(0.25, 1, 0.5, 1);
export const easeInOutQuart = getCubicBezierEasing(0.76, 0, 0.24, 1);
export const easeInQuint = getCubicBezierEasing(0.64, 0, 0.78, 0);
export const easeOutQuint = getCubicBezierEasing(0.22, 1, 0.36, 1);
export const easeInOutQuint = getCubicBezierEasing(0.83, 0, 0.17, 1);
export const easeInExpo = getCubicBezierEasing(0.7, 0, 0.84, 0);
export const easeOutExpo = getCubicBezierEasing(0.16, 1, 0.3, 1);
export const easeInOutExpo = getCubicBezierEasing(0.87, 0, 0.13, 1);
export const easeInCirc = getCubicBezierEasing(0.55, 0, 1, 0.45);
export const easeOutCirc = getCubicBezierEasing(0, 0.55, 0.45, 1);
export const easeInOutCirc = getCubicBezierEasing(0.85, 0, 0.15, 1);
export const easeInBack = getCubicBezierEasing(0.36, 0, 0.66, -0.56);
export const easeOutBack = getCubicBezierEasing(0.34, 1.56, 0.64, 1);
export const easeInOutBack = getCubicBezierEasing(0.68, -0.6, 0.32, 1.6);

export const getEaseing: (easing: Easing) => (t: number) => number = (easing: Easing) => {
  switch (easing) {
    case 'ease': return ease;
    case 'ease-in': return easeIn;
    case 'ease-out': return easeOut;
    case 'ease-in-out': return easeInOut;
    case 'ease-in-sine': return easeInSine;
    case 'ease-out-sine': return easeOutSine;
    case 'ease-in-out-sine': return easeInOut;
    case 'ease-in-quad': return easeInQuad;
    case 'ease-out-quad': return easeOutQuad;
    case 'ease-in-out-quad': return easeInOutQuad;
    case 'ease-in-cubic': return easeInCubic;
    case 'ease-out-cubic': return easeOutCubic;
    case 'ease-in-out-cubic': return easeInOutCubic;
    case 'ease-in-quart': return easeInQuart;
    case 'ease-out-quart': return easeOutQuart;
    case 'ease-in-out-quart': return easeInOutQuart;
    case 'ease-in-quint': return easeInQuint;
    case 'ease-out-quint': return easeOutQuint;
    case 'ease-in-out-quint': return easeInQuint;
    case 'ease-in-expo' : return easeInExpo;
    case 'ease-out-expo': return easeOutExpo;
    case 'ease-in-out-expo': return easeInOutExpo;
    case 'ease-in-circ': return easeInCirc;
    case 'ease-out-circ': return easeOutCirc;
    case 'ease-in-out-circ': return easeInOutCirc;
    case 'ease-in-back': return easeInBack;
    case 'ease-out-back': return easeOutBack;
    case 'ease-in-out-back': return easeInOutBack;
    default: return null!;
  }
};

const _getSineFn = (oscilations: number) => (t: number) => {
    const rescaledT = t * oscilations;
    const integerPart = Math.floor(rescaledT);
    const sign = ((integerPart + 1) % 2 === 0 ? -1  : 1) * (oscilations % 2 === 0 ? -1 : 1);

    return 2 * sign * (easeInSine(rescaledT - integerPart) - 0.5);
  };

export const getElasticEaseIn = (oscilations: number) => {
  if (!Number.isInteger(oscilations) && oscilations < 0) {
    throw new Error('the argument \'oscilations\' of \'getElasticEaseIn\' function must a positive integer!');
  }

  oscilations++;

  const sineFn = _getSineFn(oscilations);

  return (t: number) => easeInExpo(t) * sineFn(t);
};

export const getElasticEaseOut = (oscilations: number) => {
  if (!Number.isInteger(oscilations) && oscilations < 0) {
    throw new Error('the argument \'oscilations\' of \'getElasticEaseOut\' function must a positive integer!');
  }

  oscilations++;

  const sineFn = _getSineFn(oscilations);
  const sign = oscilations % 2 === 0 ? 1 : -1;

  return (t: number) => sign * (easeOutExpo(t) - 1) * sineFn(t) + 1;
};

export const getElasticEaseInOut = (oscilations: number) => {
  if (!Number.isInteger(oscilations) && oscilations < 0) {
    throw new Error('the argument \'oscilations\' of \'getElasticEaseInOut\' function must a positive integer!');
  }

  oscilations++;

  const sineFn = _getSineFn(oscilations);

  return (t: number) => {
    if (t < 0.5) {
      return 0.5 * easeInExpo(2 * t) * sineFn(2 * t);
    } else {
      if (oscilations % 2 === 0) {
        return 0.5 * (easeOutExpo(2 * t - 1) - 1) * sineFn(2 * t - 1) + 1;
      } else {
        return 0.5 * (1 - easeOutExpo(2 * t - 1)) * sineFn(2 * t - 1) + 1;
      }
    }
  };
};

export const getNumerationFn = (xFrom: number, xTo: number, scaleT: number, easingFn: (t: number) => number) => {
  const deltaX = xTo - xFrom;
  return (t: number) => xFrom + deltaX * easingFn(t / scaleT);
};
