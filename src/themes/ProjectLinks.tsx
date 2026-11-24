import { ArrowUpRight, Package } from 'lucide-react';
import type { Project } from '../data/personal';
import { analytics } from '../lib/analytics';
import { cn } from '../lib/utils';
import { GithubIcon } from '../components/BrandIcons';

const linkStyles = {
  signal: {
    primary: 'sg-btn-primary group',
    secondary: 'sg-btn-secondary group',
    inline:
      'group inline-flex items-center gap-1.5 text-sm font-semibold text-sg-ink transition-colors hover:text-sg-coral-text',
    arrow: 'sg-nudge-ne',
  },
  terminal: {
    primary: 'tm-btn-primary group',
    secondary: 'tm-btn-secondary group',
    inline:
      'group inline-flex items-center gap-1.5 text-sm font-semibold text-tm-ink transition-colors hover:text-tm-accent-text',
    arrow: 'tm-nudge-ne',
  },
};

interface ProjectLinksProps {
  theme: 'signal' | 'terminal';
  project: Project;
  /** buttons: case-study header; inline: compact text links inside cards */
  variant?: 'buttons' | 'inline';
  className?: string;
}

/** Demo / source / package links for a project, with analytics wired in one place. */
export default function ProjectLinks({
  theme,
  project,
  variant = 'inline',
  className,
}: Readonly<ProjectLinksProps>) {
  const showCode = Boolean(project.github) && project.category !== 'company';
  if (!showCode && !project.npm && !project.demo) return null;

  const buttons = variant === 'buttons';
  const styles = linkStyles[theme];
  const linkClass = buttons ? styles.secondary : styles.inline;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center',
        buttons ? 'gap-3' : 'gap-x-5 gap-y-2',
        className,
      )}
    >
      {project.demo && (
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          className={buttons ? styles.primary : linkClass}
          aria-label={`View live demo for ${project.title} (opens in new tab)`}
          onClick={() => analytics.projectDemoClick(project.title)}
        >
          {buttons ? 'Live Demo' : 'Demo'}
          <ArrowUpRight size={15} className={styles.arrow} aria-hidden="true" />
        </a>
      )}
      {showCode && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          aria-label={`View source code for ${project.title} on GitHub (opens in new tab)`}
          onClick={() => analytics.projectGithubClick(project.title)}
        >
          <GithubIcon size={14} />
          {buttons ? 'View Code' : 'Code'}
        </a>
      )}
      {project.npm && (
        <a
          href={project.npm}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          aria-label={`View ${project.title} on NPM (opens in new tab)`}
          onClick={() => analytics.projectNpmClick(project.title)}
        >
          <Package size={14} aria-hidden="true" />
          {buttons ? 'NPM Package' : 'NPM'}
        </a>
      )}
    </div>
  );
}
