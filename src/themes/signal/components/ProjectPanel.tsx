import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Project } from '../../../data/personal';
import { analytics } from '../../../lib/analytics';
import { cn } from '../../../lib/utils';
import { flows } from '../content';
import FlowDiagram from './FlowDiagram';
import ProjectLinks from './ProjectLinks';
import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '../motion';

interface ProjectPanelProps {
  project: Project;
  index: number;
  /** Put the visual on the right (alternating layout). */
  flip?: boolean;
  headingAs?: 'h2' | 'h3';
}

/** Pointer spotlight on the visual: two CSS custom properties, no re-render. */
function trackPointer(e: React.PointerEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--px', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--py', `${e.clientY - rect.top}px`);
}

/** Large editorial project row: architecture visual on one side, story on the other. */
export default function ProjectPanel({
  project,
  index,
  flip,
  headingAs: Heading = 'h3',
}: Readonly<ProjectPanelProps>) {
  const flow = flows[project.id];
  const isCompany = project.category === 'company';
  const href = `/projects/${project.id}`;
  const openDetails = () => analytics.projectViewDetails(project.title);

  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="group grid items-center gap-8 lg:grid-cols-12 lg:gap-14"
    >
      {/* Visual */}
      <div className={cn('lg:col-span-6', flip && 'lg:order-2')}>
        <Link
          to={href}
          tabIndex={-1}
          aria-hidden="true"
          onClick={openDetails}
          onPointerMove={trackPointer}
          className="sg-spot relative block overflow-hidden rounded-[1.75rem] border border-sg-line bg-sg-surface p-6 transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within:border-sg-coral group-hover:-translate-y-1 group-hover:border-sg-coral group-hover:shadow-[0_28px_60px_-34px_var(--sg-shadow)] sm:p-9"
        >
          <span className="relative mb-6 flex items-center justify-between font-mono text-xs text-sg-faint">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <span>{project.techStack[0]}</span>
          </span>
          {flow && <FlowDiagram flow={flow} className="relative" />}
        </Link>
      </div>

      {/* Story */}
      <div className="min-w-0 lg:col-span-6">
        <p className="sg-kicker">
          {isCompany ? `Company · ${project.companyName}` : 'Personal project'}
          {project.role && <span className="text-sg-muted"> · {project.role}</span>}
        </p>
        <Heading className="mt-3 text-[clamp(1.75rem,2.4vw+1rem,2.75rem)] font-bold leading-[1.05]">
          <Link
            to={href}
            onClick={openDetails}
            className="transition-colors hover:text-sg-coral-text"
          >
            {project.title}
          </Link>
        </Heading>
        <p className="mt-3 text-lg font-medium text-sg-coral-text">{project.tagline}</p>
        <p className="mt-4 max-w-[38rem]">{project.description}</p>

        {project.challenges[0] && (
          <div className="mt-6 max-w-[38rem] border-l-2 border-sg-teal pl-4">
            <p className="sg-kicker">Key challenge</p>
            <p className="mt-1.5 text-[0.9375rem] text-sg-ink">{project.challenges[0].problem}</p>
          </div>
        )}

        <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies used">
          {project.techStack.slice(0, 6).map((tech, i) => (
            <li key={tech} className={i === 0 ? 'sg-tag-teal' : 'sg-tag'}>
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link
            to={href}
            onClick={openDetails}
            className="sg-btn-primary group"
            aria-label={`View details for ${project.title}`}
          >
            Read case study
            <ArrowRight size={16} className="sg-nudge-x" aria-hidden="true" />
          </Link>
          <ProjectLinks project={project} />
        </div>
      </div>
    </motion.article>
  );
}
