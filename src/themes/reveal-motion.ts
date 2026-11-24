import { createContext } from 'react';
import type { Variants } from 'framer-motion';

type Bezier = [number, number, number, number];

export const ease = {
  out: [0.16, 1, 0.3, 1] as Bezier,
  inOut: [0.65, 0, 0.35, 1] as Bezier,
};

export const RevealDuration = createContext(0.56);
export const viewportOnce = { once: true, amount: 0.15 } as const;

export const projectDetailEntrance = (delay: number, duration: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration, ease: ease.out, delay },
});

export const fadeUp = (duration: number): Variants => ({
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration, ease: ease.out } },
});

export const staggerGroup = (gap = 0.06, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});
