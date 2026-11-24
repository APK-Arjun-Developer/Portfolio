export { ease } from '../reveal-motion';

/*
 * Motion system for the Terminal theme. Physical things (doors, the timeline rail) use springs;
 * everything else eases on transform/opacity.
 *
 * <MotionConfig reducedMotion="user"> in App.tsx drops framer-motion transforms for users
 * who prefer reduced motion. prefersReducedMotion() covers what framer-motion can't see:
 * the loader, the calendar timer, the door walk-through and smooth scrolling.
 */

export const duration = {
  ui: 0.2,
  section: 0.6,
  heroWord: 0.6,
};

export const spring = {
  /** A heavy door on a closer: slight overshoot, then it settles. */
  door: { type: 'spring', stiffness: 150, damping: 16 },
  /** The timeline rail following scroll. */
  rail: { stiffness: 120, damping: 24 },
} as const;

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
