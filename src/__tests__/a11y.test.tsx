import { describe, expect, it, vi } from 'vitest';
import { axe } from 'jest-axe';
import ClassicApp from '../themes/classic/App';
import SignalApp from '../themes/signal/App';
import { renderTheme } from './helpers';

vi.mock('react-ga4', () => ({
  default: { initialize: vi.fn(), send: vi.fn(), event: vi.fn() },
}));
vi.mock('lenis', () => ({
  default: class {
    raf() {}
    destroy() {}
  },
}));

/*
 * axe-core accessibility audit of every route in both themes. jsdom has no layout
 * engine, so jest-axe skips colour contrast (SonarCloud and manual checks cover it).
 */
const routes = ['/', '/about', '/projects', '/projects/multi-tenant-api', '/projects/dr-carrot'];

describe.each([
  ['classic', ClassicApp],
  ['signal', SignalApp],
])('%s theme — accessibility (axe)', (_name, App) => {
  it.each(routes)(
    '%s has no axe violations',
    async (path) => {
      const { container } = await renderTheme(App, path);
      expect(await axe(container)).toHaveNoViolations();
    },
    15000,
  );
});
