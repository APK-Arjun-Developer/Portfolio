import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import ReactGA from 'react-ga4';
import ClassicApp from '../../themes/classic/App';
import { personal, projects } from '../../data/personal';
import { currentPath, renderTheme } from '../helpers';

vi.mock('react-ga4', () => ({
  default: { initialize: vi.fn(), send: vi.fn(), event: vi.fn() },
}));
vi.mock('lenis', () => ({
  default: class {
    raf() {}
    destroy() {}
  },
}));

const eventNames = () => vi.mocked(ReactGA.event).mock.calls.map(([name]) => name);

/** The classic theme styles hover states imperatively; exercise every handler. */
function hoverEverything(root: HTMLElement) {
  root.querySelectorAll('*').forEach((el) => {
    fireEvent.mouseEnter(el);
    fireEvent.mouseLeave(el);
  });
}

describe('Classic theme', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_GA_ENABLED', 'true');
    vi.mocked(ReactGA.event).mockClear();
  });

  it('renders the home hero, stats and contact links', async () => {
    const { user, container } = await renderTheme(ClassicApp, '/');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(personal.name);
    expect(screen.getAllByText('Years Experience').length).toBeGreaterThan(0);
    hoverEverything(container);

    await user.click(screen.getByRole('link', { name: 'View my projects' }));
    expect(currentPath()).toBe('/projects');
    expect(eventNames()).toContain('cta_click');
  });

  it('tracks hero and footer social links', async () => {
    const { user } = await renderTheme(ClassicApp, '/');

    await user.click(screen.getByRole('link', { name: /visit my github profile/i }));
    await user.click(screen.getByRole('link', { name: /visit my linkedin profile/i }));
    await user.click(screen.getAllByRole('link', { name: `Email me at ${personal.email}` })[0]);
    await user.click(screen.getAllByRole('link', { name: `Email me at ${personal.email}` })[1]);
    await user.click(screen.getByRole('link', { name: 'GitHub profile' }));

    expect(eventNames()).toEqual([
      'social_click',
      'social_click',
      'cta_click',
      'social_click',
      'social_click',
    ]);
  });

  it('renders the about page with experience and skills', async () => {
    const { container } = await renderTheme(ClassicApp, '/about');

    expect(screen.getByRole('heading', { name: 'Experience' })).toBeInTheDocument();
    expect(screen.getAllByText('PostgreSQL').length).toBeGreaterThan(0);
    hoverEverything(container);
  });

  it('shows the site version next to the logo', async () => {
    await renderTheme(ClassicApp, '/');
    expect(screen.getByTitle(/^Site version v\d+\.\d+\.\d+/)).toHaveTextContent(/v\d+\.\d+\.\d+/);
  });

  describe('navbar', () => {
    it('shrinks on scroll and tracks the résumé download', async () => {
      const { user } = await renderTheme(ClassicApp, '/');
      const header = screen.getByRole('banner');

      expect(header).toHaveClass('py-5');
      Object.defineProperty(window, 'scrollY', { configurable: true, value: 100 });
      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });
      expect(header).toHaveClass('py-3');
      Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });

      await user.click(screen.getAllByRole('link', { name: 'Download resume PDF' })[0]);
      expect(eventNames()).toContain('resume_download');
    });

    it('opens the mobile menu, locks scrolling, and closes via backdrop or link', async () => {
      const { user, container } = await renderTheme(ClassicApp, '/');

      await user.click(screen.getByRole('button', { name: 'Open navigation menu' }));
      const dialog = screen.getByRole('dialog', { name: 'Navigation menu' });
      expect(document.body.style.overflow).toBe('hidden');
      hoverEverything(container);

      await user.click(within(dialog).getByRole('link', { name: 'Download resume PDF' }));
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());

      await user.click(screen.getByRole('button', { name: 'Open navigation menu' }));
      fireEvent.click(container.querySelector('[aria-hidden="true"].fixed.inset-0')!);
      await user.click(screen.getByRole('button', { name: 'Open navigation menu' }));
      await user.click(within(screen.getByRole('dialog')).getByRole('link', { name: 'About' }));
      await screen.findByRole('heading', { name: 'About Me' });
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('projects', () => {
    it('filters projects by category tab', async () => {
      const { user, container } = await renderTheme(ClassicApp, '/projects');
      hoverEverything(container);

      await user.click(screen.getByRole('tab', { name: /company work/i }));
      expect(screen.getByRole('tab', { name: /company work/i })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      // The grid swaps inside AnimatePresence mode="wait": old cards exit first.
      await waitFor(() =>
        expect(screen.getAllByRole('article')).toHaveLength(
          projects.filter((p) => p.category === 'company').length,
        ),
      );

      await user.click(screen.getByRole('tab', { name: /personal/i }));
      await waitFor(() =>
        expect(screen.getAllByRole('article')).toHaveLength(
          projects.filter((p) => p.category !== 'company').length,
        ),
      );
      hoverEverything(container);
      expect(eventNames()).toEqual(['project_filter_click', 'project_filter_click']);
    });

    it('tracks card links and opens a project', async () => {
      const { user } = await renderTheme(ClassicApp, '/projects');

      await user.click(screen.getAllByRole('link', { name: /view source code/i })[0]);
      await user.click(screen.getAllByRole('link', { name: /on npm/i })[0]);
      await user.click(screen.getAllByRole('link', { name: /view live demo/i })[0]);
      await user.click(screen.getAllByRole('link', { name: /view details for/i })[0]);

      expect(currentPath()).toBe(`/projects/${projects[0].id}`);
      expect(eventNames()).toEqual([
        'project_github_click',
        'project_npm_click',
        'project_demo_click',
        'project_view_details',
      ]);
    });

    it('renders a personal case study with header and footer actions', async () => {
      const project = projects.find((p) => p.id === 'schema-form-builder')!;
      const { user, container } = await renderTheme(ClassicApp, `/projects/${project.id}`);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(project.title);
      expect(screen.getByText('Personal Project')).toBeInTheDocument();
      // Header says "NPM Package", footer says "NPM".
      const npm = screen.getAllByRole('link', { name: /on npm/i });
      expect(npm.map((a) => a.textContent?.trim())).toEqual(['NPM Package', 'NPM']);
      hoverEverything(container);

      await user.click(screen.getAllByRole('link', { name: /view source code/i })[0]);
      await user.click(npm[1]);
      await user.click(screen.getAllByRole('link', { name: /view live demo/i })[1]);
      expect(eventNames()).toEqual([
        'project_github_click',
        'project_npm_click',
        'project_demo_click',
      ]);

      await user.click(screen.getAllByRole('link', { name: 'Back to all projects' })[1]);
      expect(currentPath()).toBe('/projects');
    });

    it('renders a company case study without source links', async () => {
      const project = projects.find((p) => p.category === 'company')!;
      await renderTheme(ClassicApp, `/projects/${project.id}`);

      expect(screen.getByText('Company Project')).toBeInTheDocument();
      expect(screen.getByText(`@ ${project.companyName}`)).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /view source code/i })).toBeNull();
    });

    it('redirects unknown project ids to the projects list', async () => {
      await renderTheme(ClassicApp, '/projects/nope');
      expect(currentPath()).toBe('/projects');
    });
  });
});
