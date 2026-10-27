import type { Variants } from 'framer-motion';

/*
 * Motion system for the Signal theme. Everything animates transform/opacity only.
 *
 *   micro    140ms  icon nudges, tag/link hover            (CSS, see styles.css)
 *   ui       200ms  buttons, nav indicator, theme toggle
 *   card     300ms  card lift, border, diagram emphasis
 *   section  560ms  section/content entrances (16px rise + fade), once per visit
 *   hero     ≤ 900ms total for the headline word reveal
 *
 * <MotionConfig reducedMotion="user"> in App.tsx drops all transforms for users who
 * prefer reduced motion; entrances then become plain fades.
 */

type Bezier = [number, number, number, number];

export const ease = {
  /** Entrances and reveals */
  out: [0.16, 1, 0.3, 1] as Bezier,
  /** State changes: hover, press, focus */
  std: [0.2, 0, 0, 1] as Bezier,
  /** Things that travel: nav indicator, packets */
  inOut: [0.65, 0, 0.35, 1] as Bezier,
};

export const duration = {
  micro: 0.14,
  ui: 0.2,
  card: 0.3,
  section: 0.56,
  heroWord: 0.55,
};

export const stagger = {
  list: 0.06,
  words: 0.03,
};

/** Trigger once, slightly before the element is fully in view. */
export const viewportOnce = { once: true, amount: 0.15 } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: duration.section, ease: ease.out } },
};

export const staggerGroup = (gap = stagger.list, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});
