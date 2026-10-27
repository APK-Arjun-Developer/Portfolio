import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import ReactGA from 'react-ga4';
import SignalApp from '../../themes/signal/App';
import SignalMesh from '../../themes/signal/components/SignalMesh';
import { personal, projects } from '../../data/personal';
import { currentPath, renderTheme } from '../helpers';

vi.mock('react-ga4', () => ({
  default: { initialize: vi.fn(), send: vi.fn(), event: vi.fn() },
}));

const eventNames = () => vi.mocked(ReactGA.event).mock.calls.map(([name]) => name);

describe('Signal theme', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_GA_ENABLED', 'true');
    vi.mocked(ReactGA.event).mockClear();
  });

  describe('home', () => {
    it('renders the headline, hero CTAs, all projects and capabilities', async () => {
      await renderTheme(SignalApp, '/');

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'I build SaaS platforms where every tenant sees only its own data.',
      );
      expect(screen.getByRole('link', { name: /view projects/i })).toHaveAttribute(
        'href',
        '/projects',
      );
      for (const project of projects) {
        expect(screen.getAllByText(project.title).length).toBeGreaterThan(0);
      }
      expect(screen.getByRole('heading', { name: 'Frontend engineering' })).toBeInTheDocument();
      expect(screen.getByText("Where I've worked.")).toBeInTheDocument();
    });

    it('tracks hero and project interactions', async () => {
      const { user } = await renderTheme(SignalApp, '/');

      await user.click(screen.getByRole('link', { name: /visit my github profile/i }));
      await user.click(screen.getByRole('link', { name: /visit my linkedin profile/i }));
      await user.click(screen.getAllByRole('link', { name: /view live demo/i })[0]);
      await user.click(screen.getAllByRole('link', { name: /view source code/i })[0]);
      await user.click(screen.getAllByRole('link', { name: /on npm/i })[0]);

      expect(eventNames()).toEqual(
        expect.arrayContaining([
          'social_click',
          'project_demo_click',
          'project_github_click',
          'project_npm_click',
        ]),
      );
    });

    it('links company cards, the hero contact CTA and the featured case study', async () => {
      const { user } = await renderTheme(SignalApp, '/');
      const company = projects.find((p) => p.category === 'company')!;

      await user.click(screen.getByRole('link', { name: `Email me at ${personal.email}` }));
      expect(eventNames()).toContain('cta_click');

      await user.click(screen.getByRole('link', { name: /read the case study/i }));
      expect(currentPath()).toBe('/projects/multi-tenant-api');
      await user.click(
        within(screen.getByRole('navigation', { name: 'Main navigation' })).getByRole('link', {
          name: 'Home',
        }),
      );

      const companyCard = screen
        .getAllByRole('link')
        .find(
          (link) =>
            link.textContent?.includes(company.title) &&
            link.textContent.includes('Read case study'),
        )!;
      await user.click(companyCard);
      expect(currentPath()).toBe(`/projects/${company.id}`);
    });

    it('opens a case study from a project panel and moves the pointer spotlight', async () => {
      const { user, container } = await renderTheme(SignalApp, '/');

      const visual = container.querySelector<HTMLElement>('.sg-spot')!;
      fireEvent.pointerMove(visual, { clientX: 40, clientY: 30 });
      expect(visual.style.getPropertyValue('--px')).toMatch(/px$/);

      await user.click(screen.getAllByRole('link', { name: /view details for/i })[0]);
      expect(currentPath()).toMatch(/^\/projects\//);
      expect(eventNames()).toContain('project_view_details');
    });
  });

  it('shows the site version next to the logo', async () => {
    await renderTheme(SignalApp, '/');
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(within(nav).getByTitle(/^Site version v\d+\.\d+\.\d+/)).toHaveTextContent(
      /v\d+\.\d+\.\d+/,
    );
  });

  describe('navigation', () => {
    it('marks the active route and toggles the header border on scroll', async () => {
      await renderTheme(SignalApp, '/about');
      const nav = screen.getByRole('navigation', { name: 'Main navigation' });

      expect(within(nav).getByRole('link', { name: 'About' })).toHaveAttribute(
        'aria-current',
        'page',
      );

      const header = nav.closest('header')!;
      expect(header).toHaveClass('border-transparent');
      Object.defineProperty(window, 'scrollY', { configurable: true, value: 200 });
      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });
      expect(header).toHaveClass('border-sg-line');
      Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
    });

    it('opens the mobile menu, closes on Escape and on navigation', async () => {
      const { user } = await renderTheme(SignalApp, '/');
      const toggle = screen.getByRole('button', { name: 'Open navigation menu' });

      await user.click(toggle);
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await user.keyboard('{Escape}');
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(toggle).toHaveFocus();

      await user.click(toggle);
      const menu = document.getElementById('mobile-menu')!;
      await user.click(within(menu).getByRole('link', { name: 'Projects' }));
      await screen.findByRole('heading', { level: 1, name: 'Projects' });
      expect(screen.getByRole('button', { name: 'Open navigation menu' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    });

    it('tracks résumé downloads from the navbar, mobile menu and footer', async () => {
      const { user } = await renderTheme(SignalApp, '/');

      await user.click(screen.getAllByRole('link', { name: 'Download resume PDF' })[0]);
      await user.click(screen.getByRole('button', { name: 'Open navigation menu' }));
      const menu = document.getElementById('mobile-menu')!;
      await user.click(within(menu).getByRole('link', { name: 'Download resume PDF' }));
      await user.click(screen.getByRole('link', { name: /resume \(pdf\)/i }));

      const locations = vi
        .mocked(ReactGA.event)
        .mock.calls.filter(([name]) => name === 'resume_download')
        .map(([, params]) => (params as { location: string }).location);
      expect(locations).toEqual(['desktop_navbar', 'mobile_menu', 'footer']);
    });

    it('switches colour theme from the header toggle', async () => {
      const { user } = await renderTheme(SignalApp, '/');
      const dark = screen.getByRole('button', { name: 'Dark theme' });

      await user.click(dark);
      expect(dark).toHaveAttribute('aria-pressed', 'true');
      expect(document.documentElement.dataset.theme).toBe('dark');
    });
  });

  describe('projects page', () => {
    it('filters by category and records the filter', async () => {
      const { user, container } = await renderTheme(SignalApp, '/projects');
      const list = container.querySelector('#projects-list')!;
      expect(list.querySelectorAll('article')).toHaveLength(projects.length);

      await user.click(screen.getByRole('button', { name: /company work/i }));
      expect(list.querySelectorAll('article')).toHaveLength(
        projects.filter((p) => p.category === 'company').length,
      );

      await user.click(screen.getByRole('button', { name: /^personal/i }));
      expect(list.querySelectorAll('article')).toHaveLength(
        projects.filter((p) => p.category !== 'company').length,
      );
      expect(screen.getByRole('button', { name: /^personal/i })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      expect(eventNames()).toEqual(['project_filter_click', 'project_filter_click']);
    });
  });

  describe('case study page', () => {
    it('shows overview, features, challenges and stack for a personal project', async () => {
      const project = projects.find((p) => p.id === 'schema-form-builder')!;
      await renderTheme(SignalApp, `/projects/${project.id}`);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(project.title);
      expect(screen.getByText(project.overview)).toBeInTheDocument();
      for (const c of project.challenges) {
        expect(screen.getByText(c.problem)).toBeInTheDocument();
      }
      expect(screen.getAllByRole('link', { name: /view .* on npm/i })[0]).toHaveTextContent(
        'NPM Package',
      );
    });

    it('shows role and company for company work, without a code link', async () => {
      const project = projects.find((p) => p.id === 'dr-carrot')!;
      await renderTheme(SignalApp, `/projects/${project.id}`);

      expect(screen.getByText('Role')).toBeInTheDocument();
      expect(screen.getAllByText(project.companyName!).length).toBeGreaterThan(0);
      expect(screen.queryByRole('link', { name: /view source code/i })).toBeNull();
    });

    it('links to the next project and wraps around at the end', async () => {
      const last = projects[projects.length - 1];
      const { user } = await renderTheme(SignalApp, `/projects/${last.id}`);

      await user.click(screen.getByRole('link', { name: new RegExp(projects[0].title) }));
      expect(currentPath()).toBe(`/projects/${projects[0].id}`);
    });

    it('redirects unknown project ids to the projects list', async () => {
      await renderTheme(SignalApp, '/projects/does-not-exist');
      expect(currentPath()).toBe('/projects');
    });
  });

  describe('about page', () => {
    it('lists experience and education', async () => {
      await renderTheme(SignalApp, '/about');
      expect(screen.getByText('Current · Full-time')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'B.E. Aeronautical Engineering' })).toBeVisible();
    });
  });

  describe('contact footer', () => {
    it('copies the email address and resets the label', async () => {
      const { user } = await renderTheme(SignalApp, '/');
      // user-event installs its own clipboard on setup; spy on that one.
      const writeText = vi.spyOn(navigator.clipboard, 'writeText');

      await user.click(screen.getByRole('button', { name: /copy email/i }));
      expect(writeText).toHaveBeenCalledWith(personal.email);
      expect(await screen.findByText('Copied')).toBeInTheDocument();
      await waitFor(() => expect(screen.getByText('Copy email')).toBeInTheDocument(), {
        timeout: 3000,
      });
    });

    it('keeps the label when the clipboard refuses', async () => {
      const { user } = await renderTheme(SignalApp, '/');
      vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('denied'));

      await user.click(screen.getByRole('button', { name: /copy email/i }));
      expect(screen.getByText('Copy email')).toBeInTheDocument();
    });

    it('tracks the footer contact links', async () => {
      const { user } = await renderTheme(SignalApp, '/');
      const footer = screen.getByRole('contentinfo');

      await user.click(within(footer).getByRole('link', { name: /^github/i }));
      await user.click(within(footer).getByRole('link', { name: /^linkedin/i }));
      await user.click(within(footer).getByRole('link', { name: /^email/i }));
      await user.click(within(footer).getByRole('link', { name: personal.email }));

      expect(eventNames()).toEqual(['social_click', 'social_click', 'social_click', 'cta_click']);
    });
  });
});

describe('SignalMesh', () => {
  it('pauses its animation while off-screen', () => {
    class OffscreenObserver {
      private readonly cb: IntersectionObserverCallback;
      constructor(cb: IntersectionObserverCallback) {
        this.cb = cb;
      }
      observe(target: Element) {
        this.cb(
          [{ target, isIntersecting: false } as IntersectionObserverEntry],
          this as unknown as IntersectionObserver,
        );
      }
      disconnect() {}
    }
    window.IntersectionObserver = OffscreenObserver as unknown as typeof IntersectionObserver;

    const { container } = render(<SignalMesh />);
    expect(container.querySelector('.sg-mesh')).toHaveAttribute('data-paused', 'true');
  });
});
