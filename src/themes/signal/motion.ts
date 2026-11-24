import { ease as sharedEase, fadeUp as makeFadeUp } from '../reveal-motion';
export { viewportOnce } from '../reveal-motion';

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

export const duration = {
  micro: 0.14,
  ui: 0.2,
  card: 0.3,
  section: 0.56,
  heroWord: 0.55,
};

export const ease = { ...sharedEase, std: [0.2, 0, 0, 1] as [number, number, number, number] };
export const stagger = { words: 0.03 };
export const fadeUp = makeFadeUp(duration.section);
