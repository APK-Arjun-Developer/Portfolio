import { beforeEach, describe, expect, it, vi } from 'vitest';
import ReactGA from 'react-ga4';
import { analytics } from '../lib/analytics';
import { cn } from '../lib/utils';

vi.mock('react-ga4', () => ({
  default: { initialize: vi.fn(), send: vi.fn(), event: vi.fn() },
}));

describe('analytics', () => {
  beforeEach(() => vi.mocked(ReactGA.event).mockClear());

  it('sends nothing unless VITE_GA_ENABLED is "true"', () => {
    vi.stubEnv('VITE_GA_ENABLED', 'false');
    analytics.ctaClick('view_projects');
    expect(ReactGA.event).not.toHaveBeenCalled();
  });

  it('sends each event with its parameters when enabled', () => {
    vi.stubEnv('VITE_GA_ENABLED', 'true');

    analytics.resumeDownload('footer');
    analytics.socialClick('github', 'home_hero');
    analytics.ctaClick('contact_me');
    analytics.projectGithubClick('A');
    analytics.projectNpmClick('B');
    analytics.projectDemoClick('C');
    analytics.projectFilterClick('company');
    analytics.projectViewDetails('D');

    expect(vi.mocked(ReactGA.event).mock.calls).toEqual([
      ['resume_download', { location: 'footer' }],
      ['social_click', { platform: 'github', location: 'home_hero' }],
      ['cta_click', { label: 'contact_me' }],
      ['project_github_click', { project: 'A' }],
      ['project_npm_click', { project: 'B' }],
      ['project_demo_click', { project: 'C' }],
      ['project_filter_click', { filter: 'company' }],
      ['project_view_details', { project: 'D' }],
    ]);
  });
});

describe('cn', () => {
  it('joins conditional classes and lets later Tailwind classes win', () => {
    const hidden = false;
    expect(cn('px-2 py-1', hidden && 'hidden', 'px-4')).toBe('py-1 px-4');
  });
});

describe('version', () => {
  it('exposes the package.json version injected at build time', async () => {
    const { version } = await import('../../package.json');
    const { appVersion, versionLabel } = await import('../lib/version');
    expect(appVersion).toBe(version);
    expect(versionLabel).toBe(`v${version}`);
  });
});
