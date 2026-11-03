import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import ReactGA from 'react-ga4';
import { MemoryRouter } from 'react-router-dom';
import { formatClock } from '../../themes/terminal/clock';
import FlipCalendar from '../../themes/terminal/components/FlipCalendar';
import Loader from '../../themes/terminal/components/Loader';
import { calendarWords, projectStatus, stops } from '../../themes/terminal/content';
import { composeMailto } from '../../themes/terminal/mail';
import TerminalApp from '../../themes/terminal/App';
import { education, experience, personal, projects } from '../../data/personal';
import { currentPath, renderTheme } from '../helpers';

vi.mock('react-ga4', () => ({
  default: { initialize: vi.fn(), send: vi.fn(), event: vi.fn() },
}));
const lenisDestroy = vi.hoisted(() => vi.fn());
const lenisCreated = vi.hoisted(() => vi.fn());
vi.mock('lenis', () => ({
  default: class {
    constructor() {
      lenisCreated();
    }
    raf() {}
    start() {}
    stop() {}
    scrollTo() {}
    destroy() {
      lenisDestroy();
    }
  },
}));

const eventNames = () => vi.mocked(ReactGA.event).mock.calls.map(([name]) => name);

/** Answer true for any media query containing one of `matching`. */
const stubMedia = (...matching: string[]) => {
  const original = window.matchMedia;
  window.matchMedia = vi.fn((query: string) => ({
    ...original(query),
    matches: matching.some((m) => query.includes(m)),
  })) as unknown as typeof window.matchMedia;
};

const mainEl = () => within(screen.getByRole('main'));

describe('Terminal theme', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_GA_ENABLED', 'true');
    vi.mocked(ReactGA.event).mockClear();
    lenisCreated.mockClear();
    // Tests other than the loader's own start as if the intro already played.
    sessionStorage.setItem('tm-boarded', '1');
  });

  describe('home', () => {
    it('renders the greeting, your headline, every project and the capabilities', async () => {
      await renderTheme(TerminalApp, '/');

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        `Hi, I'm Arjun. I am a ${personal.role}.`,
      );
      expect(
        screen.getByText('I build SaaS platforms where every tenant sees only its own data.'),
      ).toBeInTheDocument();
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

    it('tracks the hero social links', async () => {
      const { user } = await renderTheme(TerminalApp, '/');

      await user.click(screen.getByRole('link', { name: /visit my github profile/i }));
      await user.click(screen.getByRole('link', { name: /visit my linkedin profile/i }));

      expect(eventNames()).toEqual(['social_click', 'social_click']);
    });

    it('tracks project links on the projects page', async () => {
      const { user } = await renderTheme(TerminalApp, '/projects');

      await user.click(screen.getAllByRole('link', { name: /view live demo/i })[0]);
      await user.click(screen.getAllByRole('link', { name: /view source code/i })[0]);
      await user.click(screen.getAllByRole('link', { name: /on npm/i })[0]);

      expect(eventNames()).toEqual(
        expect.arrayContaining(['project_demo_click', 'project_github_click', 'project_npm_click']),
      );
    });

    it('opens the featured case study', async () => {
      const { user } = await renderTheme(TerminalApp, '/');

      await user.click(screen.getByRole('link', { name: /read the case study/i }));
      expect(currentPath()).toBe('/projects/multi-tenant-api');
    });

    it('opens the ability card, flips it, and closes it', async () => {
      const { user } = await renderTheme(TerminalApp, '/');
      const opener = screen.getByRole('button', { name: 'My ability card' });

      await user.click(opener);
      const card = screen.getByRole('dialog', { name: 'My ability card' });
      expect(within(card).getByText('Years Experience')).toBeInTheDocument();

      const stage = card.querySelector('.tm-card-stage')!;
      fireEvent.pointerMove(stage, { clientX: 40, clientY: 30 });
      fireEvent.pointerLeave(stage);

      const flip = within(card).getByRole('button', { name: 'Flip card' });
      await user.click(flip);
      expect(flip).toHaveAttribute('aria-pressed', 'true');

      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      expect(opener).toHaveFocus();
    });
  });

  describe('doors', () => {
    const doorLink = (title: string) => screen.getByRole('link', { name: `Open ${title}` });

    it('walks through the door, then navigates, tracking the visit once', async () => {
      const project = projects[0];
      const { user } = await renderTheme(TerminalApp, '/');
      const door = doorLink(project.title);

      await user.click(door);
      await user.click(door);
      expect(currentPath()).toBe('/');

      await waitFor(() => expect(currentPath()).toBe(`/projects/${project.id}`));
      expect(eventNames().filter((name) => name === 'project_view_details')).toHaveLength(1);
    });

    it('goes straight through for reduced motion', async () => {
      stubMedia('prefers-reduced-motion');
      const project = projects[1];
      const { user } = await renderTheme(TerminalApp, '/');

      await user.click(doorLink(project.title));
      expect(currentPath()).toBe(`/projects/${project.id}`);
    });

    it('leaves modified clicks to the browser', async () => {
      const project = projects[2];
      await renderTheme(TerminalApp, '/');

      fireEvent.click(doorLink(project.title), { ctrlKey: true });
      expect(eventNames()).toContain('project_view_details');
    });

    it('shows the "Click to enter" badge for a mouse only', async () => {
      const { container } = await renderTheme(TerminalApp, '/');
      const door = doorLink(projects[0].title);
      const badge = container.querySelector<HTMLElement>('.tm-door-cursor')!;

      expect(badge).toHaveTextContent('Click to enter');
      fireEvent.pointerEnter(door, { pointerType: 'touch' });
      expect(badge.dataset.on).toBe('false');
      fireEvent.pointerMove(door, { pointerType: 'mouse', clientX: 10, clientY: 10 });
      expect(badge.dataset.on).toBe('true');
      fireEvent.pointerLeave(door);
      expect(badge.dataset.on).toBe('false');
    });

    const state = (door: HTMLElement) => {
      const gate = door.closest<HTMLElement>('.tm-gate')!;
      return [gate.dataset.active, gate.dataset.dim];
    };

    it('brings the hovered door forward and fades only its own row', async () => {
      await renderTheme(TerminalApp, '/');
      const company = projects.filter((p) => p.category === 'company');
      const personal = projects.filter((p) => p.category !== 'company');
      const door = doorLink(personal[0].title);
      const neighbour = doorLink(personal[1].title);
      const otherRow = doorLink(company[0].title);

      expect(state(door)).toEqual(['false', 'false']);
      fireEvent.pointerEnter(door, { pointerType: 'mouse' });
      expect(state(door)).toEqual(['true', 'false']);
      expect(state(neighbour)).toEqual(['false', 'true']);
      expect(state(otherRow)).toEqual(['false', 'false']);

      // Moving straight onto the next door hands over without a gap.
      fireEvent.pointerEnter(neighbour, { pointerType: 'mouse' });
      fireEvent.pointerLeave(door);
      expect(state(neighbour)).toEqual(['true', 'false']);
      expect(state(door)).toEqual(['false', 'true']);

      fireEvent.pointerLeave(neighbour);
      expect(state(neighbour)).toEqual(['false', 'false']);
    });

    it('does the same on keyboard focus, but not on touch', async () => {
      await renderTheme(TerminalApp, '/');
      const door = doorLink(projects[0].title);

      fireEvent.pointerEnter(door, { pointerType: 'touch' });
      expect(state(door)).toEqual(['false', 'false']);

      fireEvent.focus(door);
      expect(state(door)).toEqual(['true', 'false']);
      fireEvent.blur(door);
      expect(state(door)).toEqual(['false', 'false']);
    });

    it('describes each door, with the last panel on the left', async () => {
      await renderTheme(TerminalApp, '/');
      const personal = projects.filter((p) => p.category !== 'company');
      const first = doorLink(personal[0].title);
      const last = doorLink(personal[personal.length - 1].title);

      expect(first).toHaveAccessibleDescription(expect.stringContaining(personal[0].tagline));
      expect(first.closest<HTMLElement>('.tm-gate')!.dataset.side).toBe('right');
      expect(last.closest<HTMLElement>('.tm-gate')!.dataset.side).toBe('left');
    });
  });

  it('shows the site version in the footer', async () => {
    await renderTheme(TerminalApp, '/');
    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByTitle(/^Site version v\d+\.\d+\.\d+/)).toHaveTextContent(
      /v\d+\.\d+\.\d+/,
    );
  });

  describe('smooth scrolling', () => {
    it('runs on desktop and is removed on unmount', async () => {
      const { unmount } = await renderTheme(TerminalApp, '/about');
      expect(lenisCreated).toHaveBeenCalled();
      unmount();
      expect(lenisDestroy).toHaveBeenCalled();
    });

    it.each(['pointer: coarse', 'prefers-reduced-motion'])('stays off for %s', async (query) => {
      stubMedia(query);
      await renderTheme(TerminalApp, '/about');
      expect(lenisCreated).not.toHaveBeenCalled();
    });
  });

  describe('navigation', () => {
    it('marks the active route and toggles the header on scroll', async () => {
      await renderTheme(TerminalApp, '/about');
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
      expect(header).toHaveClass('border-tm-line');
      Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
    });

    it('opens the menu overlay, closes on Escape, the close button and navigation', async () => {
      const { user } = await renderTheme(TerminalApp, '/');
      const toggle = screen.getByRole('button', { name: 'Open navigation menu' });

      await user.click(toggle);
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await user.keyboard('{Escape}');
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(toggle).toHaveFocus();

      await user.click(toggle);
      await user.click(screen.getByRole('button', { name: 'Close' }));
      expect(toggle).toHaveAttribute('aria-expanded', 'false');

      await user.click(toggle);
      const menu = document.getElementById('mobile-menu')!;
      await user.click(within(menu).getByRole('link', { name: /projects/i }));
      await screen.findByRole('heading', { level: 1, name: 'Projects' });
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });

    it('opens the contact dialog from the menu overlay', async () => {
      const { user } = await renderTheme(TerminalApp, '/');

      await user.click(screen.getByRole('button', { name: 'Open navigation menu' }));
      const menu = document.getElementById('mobile-menu')!;
      await user.click(within(menu).getByRole('button', { name: /contact/i }));
      expect(screen.getByRole('dialog', { name: 'Contact me' })).toBeInTheDocument();
    });

    it('tracks résumé downloads from the navbar, menu and footer', async () => {
      const { user } = await renderTheme(TerminalApp, '/');

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

    it('switches mode with the pull cord', async () => {
      const { user } = await renderTheme(TerminalApp, '/');
      const cord = screen.getByRole('switch', { name: /dark mode/i });

      await user.click(cord);
      expect(cord).toHaveAttribute('aria-checked', 'true');
      expect(document.documentElement.dataset.theme).toBe('dark');
    });

    it('shows the live clock', async () => {
      await renderTheme(TerminalApp, '/');
      expect(screen.getByText('Local time')).toBeInTheDocument();
    });

    it('formats the clock in 12-hour time', () => {
      expect(formatClock(new Date(2026, 2, 12, 0, 5)).time).toBe('12:05am');
      expect(formatClock(new Date(2026, 2, 12, 13, 41)).time).toBe('1:41pm');
      expect(formatClock(new Date(2026, 2, 12, 13, 41)).date).toBe('12 March, 2026');
    });

    it('shows the back-to-top button once scrolled, and uses it', async () => {
      const { user, container } = await renderTheme(TerminalApp, '/about');
      const button = container.querySelector('.tm-totop')!;
      expect(button).toHaveAttribute('data-show', 'false');

      Object.defineProperty(window, 'scrollY', { configurable: true, value: 900 });
      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });
      expect(button).toHaveAttribute('data-show', 'true');
      Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
      await user.click(button);
      expect(button).toBeInTheDocument();
    });

    it('scrolls natively when Lenis is off', async () => {
      stubMedia('pointer: coarse');
      const { user } = await renderTheme(TerminalApp, '/about');

      await user.click(screen.getByRole('button', { name: 'Back to top' }));
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });
  });

  describe('contact dialog', () => {
    const open = async () => {
      const utils = await renderTheme(TerminalApp, '/');
      const opener = within(screen.getByRole('main')).getByRole('button', { name: 'Contact Me' });
      await utils.user.click(opener);
      return { ...utils, opener, dialog: screen.getByRole('dialog', { name: 'Contact me' }) };
    };

    it('requires the essentials, then offers the composed email', async () => {
      const { user, dialog } = await open();

      await user.click(within(dialog).getByRole('button', { name: /write email/i }));
      expect(within(dialog).queryByRole('link', { name: /open the email/i })).toBeNull();

      await user.type(within(dialog).getByLabelText('Name'), 'Sam');
      await user.type(within(dialog).getByLabelText('Email'), 'sam@example.com');
      await user.type(within(dialog).getByLabelText('What do you need?'), 'A site');
      await user.click(within(dialog).getByRole('button', { name: /write email/i }));

      const link = await within(dialog).findByRole('link', { name: /open the email/i });
      expect(link.getAttribute('href')).toContain(`mailto:${personal.email}`);
      expect(link.getAttribute('href')).toContain(encodeURIComponent('Project enquiry from Sam'));
      expect(eventNames()).toContain('cta_click');
    });

    it('includes the phone number only when given', () => {
      const base = { name: 'Sam', email: 'sam@example.com', message: 'A site', phone: '' };
      expect(decodeURIComponent(composeMailto(base))).not.toContain('Phone:');
      expect(decodeURIComponent(composeMailto({ ...base, phone: '123' }))).toContain('Phone: 123');
    });

    it('closes on Escape and clicking outside, returning focus to the opener', async () => {
      const { user, opener, dialog } = await open();

      fireEvent.click(dialog.parentElement!);
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      expect(opener).toHaveFocus();

      await user.click(opener);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });

    it('keeps keyboard focus inside', async () => {
      const { user, dialog } = await open();
      const close = within(dialog).getByRole('button', { name: 'Close' });
      const submit = within(dialog).getByRole('button', { name: /write email/i });

      expect(close).toHaveFocus();
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(submit).toHaveFocus();
      await user.keyboard('{Tab}');
      expect(close).toHaveFocus();
    });

    it('holds the page still while open', async () => {
      await open();
      expect(document.documentElement.style.overflow).toBe('hidden');
      fireEvent.keyDown(window, { key: 'Escape' });
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      expect(document.documentElement.style.overflow).toBe('');
    });
  });

  describe('projects page', () => {
    it('filters by category and records the filter', async () => {
      const { user, container } = await renderTheme(TerminalApp, '/projects');
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
      expect(eventNames()).toEqual(['project_filter_click', 'project_filter_click']);
    });

    it('opens a project and tracks it', async () => {
      const { user } = await renderTheme(TerminalApp, '/projects');

      await user.click(screen.getByRole('link', { name: `View details for ${projects[0].title}` }));
      expect(currentPath()).toBe(`/projects/${projects[0].id}`);
      expect(eventNames()).toContain('project_view_details');
    });

    it('reads each status from what the project has', () => {
      expect(projectStatus(projects.find((p) => p.npm)!)).toBe('NPM package');
      expect(projectStatus(projects.find((p) => p.demo && !p.npm)!)).toBe('Live demo');
      expect(projectStatus(projects.find((p) => !p.demo && !p.npm)!)).toBe('Case study');
    });
  });

  describe('case study', () => {
    it('shows every section of a personal project', async () => {
      const project = projects.find((p) => p.id === 'schema-form-builder')!;
      await renderTheme(TerminalApp, `/projects/${project.id}`);

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
      await renderTheme(TerminalApp, `/projects/${project.id}`);

      expect(screen.getByText('Role')).toBeInTheDocument();
      expect(screen.getAllByText(project.companyName!).length).toBeGreaterThan(0);
      expect(screen.queryByRole('link', { name: /view source code/i })).toBeNull();
    });

    it('links to the next project and wraps around at the end', async () => {
      const last = projects[projects.length - 1];
      const { user } = await renderTheme(TerminalApp, `/projects/${last.id}`);

      await user.click(mainEl().getByRole('link', { name: new RegExp(projects[0].title) }));
      expect(currentPath()).toBe(`/projects/${projects[0].id}`);
    });

    it('redirects unknown project ids to the list', async () => {
      await renderTheme(TerminalApp, '/projects/does-not-exist');
      expect(currentPath()).toBe('/projects');
    });
  });

  describe('story', () => {
    it('runs from the current job back to education', () => {
      expect(stops.map((s) => s.title)).toEqual([
        ...experience.map((job) => job.company),
        education.degree,
      ]);
      expect(stops[0].badge).toBe('Current · Full-time');
    });

    it('lists responsibilities and education on the about page', async () => {
      await renderTheme(TerminalApp, '/about');
      expect(screen.getByText('Current · Full-time')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: education.degree })).toBeInTheDocument();
      expect(screen.getByText(experience[0].highlights[0])).toBeInTheDocument();
    });

    it('renders without the moving rail for reduced motion', async () => {
      stubMedia('prefers-reduced-motion');
      const { container } = await renderTheme(TerminalApp, '/about');
      expect(container.querySelector('.tm-rail--on')).toBeNull();
    });
  });

  describe('contact footer', () => {
    it('copies the email address and resets the label', async () => {
      const { user } = await renderTheme(TerminalApp, '/');
      const writeText = vi.spyOn(navigator.clipboard, 'writeText');

      await user.click(screen.getByRole('button', { name: /copy email/i }));
      expect(writeText).toHaveBeenCalledWith(personal.email);
      expect(await screen.findByText('Copied')).toBeInTheDocument();
      await waitFor(() => expect(screen.getByText('Copy email')).toBeInTheDocument(), {
        timeout: 3000,
      });
    });

    it('keeps the label when the clipboard refuses', async () => {
      const { user } = await renderTheme(TerminalApp, '/');
      vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('denied'));

      await user.click(screen.getByRole('button', { name: /copy email/i }));
      expect(screen.getByText('Copy email')).toBeInTheDocument();
    });

    it('tracks the footer contact links', async () => {
      const { user } = await renderTheme(TerminalApp, '/');
      const footer = screen.getByRole('contentinfo');

      await user.click(within(footer).getByRole('link', { name: /^github/i }));
      await user.click(within(footer).getByRole('link', { name: /^linkedin/i }));
      await user.click(within(footer).getByRole('link', { name: /^email/i }));
      await user.click(within(footer).getByRole('link', { name: personal.email }));

      expect(eventNames()).toEqual(['social_click', 'social_click', 'social_click', 'cta_click']);
    });

    it('opens the contact dialog and links every project', async () => {
      const { user } = await renderTheme(TerminalApp, '/about');
      const footer = screen.getByRole('contentinfo');

      for (const project of projects) {
        expect(within(footer).getByRole('link', { name: project.title })).toHaveAttribute(
          'href',
          `/projects/${project.id}`,
        );
      }
      await user.click(within(footer).getByRole('button', { name: 'Contact Me' }));
      expect(screen.getByRole('dialog', { name: 'Contact me' })).toBeInTheDocument();
    });
  });
});

describe('Loader', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  const screenEl = () => screen.queryByTestId('boarding-screen');

  it('plays once per session, then lifts and opens the page', async () => {
    const onOpen = vi.fn();
    const { unmount } = render(<Loader onOpen={onOpen} />);
    expect(screenEl()).toHaveAttribute('aria-hidden', 'true');

    await waitFor(() => expect(onOpen).toHaveBeenCalledOnce(), { timeout: 4000 });
    await waitFor(() => expect(screenEl()).toBeNull(), { timeout: 1500 });
    unmount();

    render(<Loader onOpen={onOpen} />);
    expect(screenEl()).toBeNull();
  });

  it('opens at the hard limit even if the fonts never load', async () => {
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: { ready: new Promise(() => {}) },
    });
    const onOpen = vi.fn();
    render(<Loader onOpen={onOpen} />);

    await waitFor(() => expect(onOpen).toHaveBeenCalledOnce(), { timeout: 4000 });
    delete (document as unknown as Record<string, unknown>).fonts;
  });

  it('does not play for reduced motion', () => {
    stubMedia('prefers-reduced-motion');
    render(<Loader onOpen={vi.fn()} />);
    expect(screenEl()).toBeNull();
  });

  it('does not block the page when session storage is unavailable', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    render(<Loader onOpen={vi.fn()} />);
    expect(screenEl()).toBeNull();
    getItem.mockRestore();
  });

  it('holds the hero entrance until it lifts', async () => {
    render(
      <MemoryRouter>
        <TerminalApp />
      </MemoryRouter>,
    );
    expect(screenEl()).toBeInTheDocument();
    expect(await screen.findByRole('heading', { level: 1 }, { timeout: 5000 })).toBeInTheDocument();
    await waitFor(() => expect(sessionStorage.getItem('tm-boarded')).toBe('1'), { timeout: 4000 });
  });
});

describe('FlipCalendar', () => {
  const word = (container: HTMLElement) =>
    container.querySelector('[data-word]')?.getAttribute('data-word');

  it('cycles the words, leaving the last page to lift away', async () => {
    const { container } = render(<FlipCalendar words={['One', 'Two']} hold={20} />);

    expect(word(container)).toBe('One');
    await waitFor(() => expect(word(container)).toBe('Two'));
    expect(container.querySelector('.tm-cal__leaf')).toHaveTextContent('One');
    await waitFor(() => expect(word(container)).toBe('One'));
  });

  it('holds the first word for reduced motion', async () => {
    stubMedia('prefers-reduced-motion');
    const { container } = render(<FlipCalendar words={['One', 'Two']} hold={5} />);

    await new Promise((resolve) => setTimeout(resolve, 40));
    expect(word(container)).toBe('One');
  });

  it('pauses while off-screen', async () => {
    window.IntersectionObserver = class {
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
    } as unknown as typeof IntersectionObserver;

    const { container } = render(<FlipCalendar words={['One', 'Two']} hold={5} />);
    await new Promise((resolve) => setTimeout(resolve, 40));
    expect(word(container)).toBe('One');
  });

  it('cycles real content that reads after "I am a"', () => {
    expect(calendarWords[0]).toBe(personal.role);
    for (const skill of ['React', '.NET', 'Node.js']) {
      expect(calendarWords.some((w) => w.startsWith(skill))).toBe(true);
    }
  });
});
