import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

/*
 * jsdom gaps the themes rely on. Each stub is the smallest thing that lets the real
 * component code run; tests that need to steer them (e.g. matchMedia) override per test.
 */

export const mediaListeners = new Set<() => void>();
let prefersDark = false;

/** Flip the OS colour-scheme preference and notify listeners, as a browser would. */
export function setPrefersDark(dark: boolean) {
  prefersDark = dark;
  mediaListeners.forEach((listener) => listener());
}

function installMatchMedia() {
  window.matchMedia = vi.fn((query: string) => ({
    get matches() {
      return query.includes('prefers-color-scheme: dark') ? prefersDark : false;
    },
    media: query,
    onchange: null,
    addEventListener: (_: string, listener: () => void) => mediaListeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => mediaListeners.delete(listener),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

/** Reports every observed element as visible so scroll reveals run immediately. */
class VisibleIntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds: number[] = [];
  private readonly callback: IntersectionObserverCallback;
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
  observe(target: Element) {
    this.callback(
      [
        {
          target,
          isIntersecting: true,
          intersectionRatio: 1,
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRect: target.getBoundingClientRect(),
          rootBounds: null,
          time: 0,
        },
      ],
      this as unknown as IntersectionObserver,
    );
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

/*
 * Tests click real external / mailto / download links to assert analytics. Stop the
 * browser default (jsdom cannot navigate documents) without stopping React handlers.
 */
document.addEventListener(
  'click',
  (event) => {
    const link = (event.target as Element | null)?.closest?.('a[href]');
    const href = link?.getAttribute('href') ?? '';
    if (/^(https?:|mailto:)/.test(href) || link?.hasAttribute('download')) event.preventDefault();
  },
  true,
);

beforeEach(() => {
  prefersDark = false;
  mediaListeners.clear();
  installMatchMedia();
  window.IntersectionObserver =
    VisibleIntersectionObserver as unknown as typeof window.IntersectionObserver;
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
  });
  document.head.innerHTML = '<meta name="theme-color" content="#000000" />';
  delete document.documentElement.dataset.theme;
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});
