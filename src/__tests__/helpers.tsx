import type { ComponentType } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';

/** Exposes the current pathname so tests can assert on navigation. */
function LocationProbe() {
  const { pathname } = useLocation();
  return <span data-testid="location">{pathname}</span>;
}

/** Render a theme's app shell at `path` and wait for the lazy page to mount. */
export async function renderTheme(App: ComponentType, path = '/') {
  const user = userEvent.setup();
  const utils = render(
    <MemoryRouter initialEntries={[path]}>
      <App />
      <LocationProbe />
    </MemoryRouter>,
  );
  await waitForPage();
  return { user, ...utils };
}

/**
 * A cold lazy-route import (e.g. after vi.resetModules) can exceed Testing Library's 1s
 * default under a loaded full-suite + coverage run.
 */
const PAGE_LOAD_TIMEOUT = 5000;

/** Lazy pages render inside <main>; the first heading there means the page has mounted. */
export async function waitForPage() {
  const main = await screen.findByRole('main', {}, { timeout: PAGE_LOAD_TIMEOUT });
  await within(main).findAllByRole('heading', {}, { timeout: PAGE_LOAD_TIMEOUT });
}

export const currentPath = () => screen.getByTestId('location').textContent;
