import type { Variants } from 'framer-motion';

/*
 * Motion system for the Terminal theme. Physical things (doors, the timeline rail) use springs;
 * everything else eases on transform/opacity.
 *
 * <MotionConfig reducedMotion="user"> in App.tsx drops framer-motion transforms for users
 * who prefer reduced motion. prefersReducedMotion() covers what framer-motion can't see:
 * the loader, the calendar timer, the door walk-through and smooth scrolling.
 */

type Bezier = [number, number, number, number];

export const ease = {
  /** Entrances and reveals */
  out: [0.16, 1, 0.3, 1] as Bezier,
  /** Things that travel: nav indicator, filter pill */
  inOut: [0.65, 0, 0.35, 1] as Bezier,
};

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

export const stagger = {
  list: 0.06,
  words: 0.03,
};

export const viewportOnce = { once: true, amount: 0.15 } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: duration.section, ease: ease.out } },
};

export const staggerGroup = (gap = stagger.list, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
