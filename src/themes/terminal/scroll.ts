import type Lenis from 'lenis';
import { prefersReducedMotion } from './motion';

/*
 * The one Lenis instance, so dialogs can hold the page still and "back to top" can glide.
 * On phones and with reduced motion there is no instance and native scrolling applies.
 */
let lenis: Lenis | null = null;
let holds = 0;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function holdScroll() {
  holds += 1;
  lenis?.stop();
  document.documentElement.style.overflow = 'hidden';
}

export function releaseScroll() {
  holds = Math.max(0, holds - 1);
  if (holds > 0) return;
  lenis?.start();
  document.documentElement.style.removeProperty('overflow');
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}
