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

/** Lazy pages render inside <main>; the first heading there means the page has mounted. */
export async function waitForPage() {
  const main = await screen.findByRole('main');
  await within(main).findAllByRole('heading');
}

export const currentPath = () => screen.getByTestId('location').textContent;
