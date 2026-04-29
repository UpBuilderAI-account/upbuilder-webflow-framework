import type {
  AnimationEasing,
  AnimationEffect,
  Ix3AnimationConfig,
  Ix3AnimationProps,
} from './types';

export interface UpAnimationProps extends Ix3AnimationProps {
  animate?: AnimationEffect;
  animateHover?: AnimationEffect;
  animateClick?: AnimationEffect;
  animatePageLoad?: AnimationEffect;
  animateDelay?: number;
  animateDuration?: number;
  animateEasing?: AnimationEasing;
}

function stringifyIx3Config(config: Ix3AnimationConfig): string {
  return JSON.stringify(config);
}

export function extractAnimationAttrs(props: UpAnimationProps): Record<string, any> {
  const attrs: Record<string, any> = {};

  if (props.animate) attrs['data-animate'] = props.animate;
  if (props.animateHover) attrs['data-animate-hover'] = props.animateHover;
  if (props.animateClick) attrs['data-animate-click'] = props.animateClick;
  if (props.animatePageLoad) attrs['data-animate-pageload'] = props.animatePageLoad;
  if (props.animateDelay !== undefined) attrs['data-animate-delay'] = props.animateDelay;
  if (props.animateDuration !== undefined) attrs['data-animate-duration'] = props.animateDuration;
  if (props.animateEasing) attrs['data-animate-easing'] = props.animateEasing;

  if (typeof props.ix3 === 'string') {
    attrs['data-up-ix3'] = props.ix3;
  } else if (props.ix3) {
    attrs['data-up-ix3'] = props.ix3.preset || 'custom';
    attrs['data-up-ix3-config'] = stringifyIx3Config(props.ix3);
  }
  if (props.ix3Trigger) attrs['data-up-ix3-trigger'] = props.ix3Trigger;
  if (props.ix3Split) attrs['data-up-ix3-split'] = props.ix3Split;
  if (props.ix3Scrub !== undefined) attrs['data-up-ix3-scrub'] = String(props.ix3Scrub);
  if (props.ix3Stagger !== undefined) attrs['data-up-ix3-stagger'] = props.ix3Stagger;
  if (props.ix3Start) attrs['data-up-ix3-start'] = props.ix3Start;
  if (props.ix3End) attrs['data-up-ix3-end'] = props.ix3End;
  if (props.ix3Once !== undefined) attrs['data-up-ix3-once'] = String(props.ix3Once);
  if (props.ix3Duration !== undefined) attrs['data-up-ix3-duration'] = props.ix3Duration;
  if (props.ix3Delay !== undefined) attrs['data-up-ix3-delay'] = props.ix3Delay;
  if (props.ix3Ease) attrs['data-up-ix3-ease'] = props.ix3Ease;

  return attrs;
}

export function omitAnimationProps<T extends UpAnimationProps>(props: T): Omit<T, keyof UpAnimationProps> {
  const {
    animate,
    animateHover,
    animateClick,
    animatePageLoad,
    animateDelay,
    animateDuration,
    animateEasing,
    ix3,
    ix3Trigger,
    ix3Split,
    ix3Scrub,
    ix3Stagger,
    ix3Start,
    ix3End,
    ix3Once,
    ix3Duration,
    ix3Delay,
    ix3Ease,
    ...rest
  } = props;
  return rest as Omit<T, keyof UpAnimationProps>;
}
