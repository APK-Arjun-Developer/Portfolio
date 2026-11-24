import { createContext, useContext } from 'react';
import { prefersReducedMotion } from './motion';

const BOARDED_KEY = 'tm-boarded';

/** The loader plays once per session, and never for reduced motion. */
export function loaderNeeded() {
  if (prefersReducedMotion()) return false;
  try {
    return sessionStorage.getItem(BOARDED_KEY) === null;
  } catch {
    return false;
  }
}

export function markBoarded() {
  try {
    sessionStorage.setItem(BOARDED_KEY, '1');
  } catch {
    // Without storage the loader just plays again on the next load.
  }
}

/** True once the page is uncovered, so the hero plays its entrance where it can be seen. */
export const IntroContext = createContext(true);
export const useIntroReady = () => useContext(IntroContext);
