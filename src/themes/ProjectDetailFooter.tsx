import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Project } from '../data/personal';
import { analytics } from '../lib/analytics';
import BackToProjects from './BackToProjects';
import ProjectLinks from './ProjectLinks';
import { Reveal } from './Reveal';

const base = {
  bar: 'mt-24 flex flex-col items-start justify-between gap-6 border-t pt-8 sm:flex-row sm:items-center',
  next: 'group block rounded-[2rem] border p-8 transition-[border-color,transform] duration-300 hover:-translate-y-1 sm:p-10',
  title:
    'mt-3 flex items-center justify-between gap-6 text-[clamp(1.75rem,3vw+1rem,3rem)] font-extrabold leading-tight transition-colors',
};
const footerStyles = {
  signal: {
    bar: base.bar + ' border-sg-line',
    next: base.next + ' border-sg-line bg-sg-surface hover:border-sg-coral',
    kicker: 'sg-kicker',
    title: base.title + ' font-display text-sg-ink group-hover:text-sg-coral-text',
    arrow: 'sg-nudge-x shrink-0',
  },
  terminal: {
    bar: base.bar + ' border-tm-line',
    next: base.next + ' border-tm-line bg-tm-surface hover:border-tm-accent',
    kicker: 'tm-kicker',
    title: base.title + ' text-tm-ink group-hover:text-tm-accent-text',
    arrow: 'tm-nudge-x shrink-0',
  },
};

interface ProjectDetailFooterProps {
  theme: keyof typeof footerStyles;
  project: Project;
  next?: Project;
}

export default function ProjectDetailFooter({
  theme,
  project,
  next,
}: Readonly<ProjectDetailFooterProps>) {
  const styles = footerStyles[theme];
  return (
    <>
      <Reveal className={styles.bar}>
        <BackToProjects theme={theme}>Back to Projects</BackToProjects>
        <ProjectLinks theme={theme} project={project} />
      </Reveal>

      {next && next.id !== project.id && (
        <Reveal className="mt-12">
          <Link
            to={`/projects/${next.id}`}
            onClick={() => analytics.projectViewDetails(next.title)}
            className={styles.next}
          >
            <span className={styles.kicker}>Next project</span>
            <span className={styles.title}>
              {next.title}
              <ArrowRight
                size={36}
                strokeWidth={1.75}
                className={styles.arrow}
                aria-hidden="true"
              />
            </span>
          </Link>
        </Reveal>
      )}
    </>
  );
}
