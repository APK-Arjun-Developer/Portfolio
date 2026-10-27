import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReactGA from 'react-ga4';
import { waitForPage } from './helpers';

vi.mock('react-ga4', () => ({
  default: { initialize: vi.fn(), send: vi.fn(), event: vi.fn() },
}));
// The classic theme (the alias default in vitest.config.ts) smooth-scrolls with Lenis.
vi.mock('lenis', () => ({
  default: class {
    raf() {}
    destroy() {}
  },
}));

/** App reads GA env vars at module load, so import it fresh per scenario. */
async function renderApp() {
  vi.resetModules();
  const { default: App } = await import('../App');
  render(<App />);
  await waitForPage();
}

describe('App (root)', () => {
  beforeEach(() => {
    vi.mocked(ReactGA.initialize).mockClear();
    vi.mocked(ReactGA.send).mockClear();
    window.history.pushState({}, '', '/');
  });

  it('renders the build-selected theme and leaves GA off by default', async () => {
    vi.stubEnv('VITE_GA_ENABLED', 'false');
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', '');
    await renderApp();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Arjun Prakash');
    expect(ReactGA.initialize).not.toHaveBeenCalled();
    expect(ReactGA.send).not.toHaveBeenCalled();
  });

  it('initialises GA and records a page view when enabled', async () => {
    vi.stubEnv('VITE_GA_ENABLED', 'true');
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST');
    window.history.pushState({}, '', '/about');
    await renderApp();

    expect(ReactGA.initialize).toHaveBeenCalledWith('G-TEST');
    expect(ReactGA.send).toHaveBeenCalledWith({ hitType: 'pageview', page: '/about' });
  });
});
