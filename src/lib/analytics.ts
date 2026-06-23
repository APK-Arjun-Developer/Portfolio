import ReactGA from 'react-ga4';

const track = (event: string, params?: Record<string, string>) => {
  if (import.meta.env.VITE_GA_ENABLED !== 'true') return;
  ReactGA.event(event, params);
};

export const analytics = {
  resumeDownload: (location: 'desktop_navbar' | 'mobile_menu') =>
    track('resume_download', { location }),

  socialClick: (platform: 'github' | 'linkedin' | 'email', location: string) =>
    track('social_click', { platform, location }),

  ctaClick: (label: 'view_projects' | 'contact_me') => track('cta_click', { label }),

  projectGithubClick: (project: string) => track('project_github_click', { project }),

  projectNpmClick: (project: string) => track('project_npm_click', { project }),

  projectDemoClick: (project: string) => track('project_demo_click', { project }),

  projectFilterClick: (filter: string) => track('project_filter_click', { filter }),

  projectViewDetails: (project: string) => track('project_view_details', { project }),
};
