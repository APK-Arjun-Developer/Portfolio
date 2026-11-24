import { useCallback, useEffect, useState } from 'react';
import { prefersReducedMotion } from './motion';

export type Mode = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const THEME_COLORS = { light: '#e9e5e0', dark: '#1a1818' } as const;
const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

function readChoice(): Mode | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // Storage can be unavailable (private mode, blocked site data) — follow the OS instead.
  }
  return null;
}

function applyMode(mode: Mode) {
  document.documentElement.dataset.theme = mode;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[mode]);
}

/** Follows the OS colour scheme until the visitor pulls the cord, then remembers it. */
export function useMode() {
  const [choice, setChoice] = useState<Mode | null>(readChoice);
  const [systemDark, setSystemDark] = useState(() => darkQuery().matches);
  const mode: Mode = choice ?? (systemDark ? 'dark' : 'light');

  useEffect(() => {
    applyMode(mode);
  }, [mode]);

  useEffect(() => {
    const query = darkQuery();
    const onChange = () => setSystemDark(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const toggle = useCallback(() => {
    const next: Mode = mode === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Non-persistent is fine; the choice still applies for this visit.
    }
    const commit = () => {
      applyMode(next);
      setChoice(next);
    };
    // One crossfade of the whole page instead of every element transitioning its colours.
    if (document.startViewTransition && !prefersReducedMotion()) {
      document.startViewTransition(commit);
    } else {
      commit();
    }
  }, [mode]);

  return { mode, toggle };
}
