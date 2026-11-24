import { useProjectFilter } from '../../project-filter';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type Project } from '../../../data/personal';
import { analytics } from '../../../lib/analytics';
import { projectLabel, projectKind, projectStatus } from '../content';
import ProjectLinks from '../../ProjectLinks';
import { Reveal } from '../../Reveal';
import SectionHeader from '../components/SectionHeader';

function BoardRow({ project }: Readonly<{ project: Project }>) {
  const to = `/projects/${project.id}`;
  return (
    <Reveal>
      <article className="grid gap-5 border-b border-tm-line py-8 lg:grid-cols-12 lg:gap-8">
        <div className="flex items-center gap-3 lg:col-span-2 lg:block">
          <p className="font-mono text-sm font-bold text-tm-accent-text">{projectLabel(project)}</p>
          <p className="tm-kicker lg:mt-2">{projectKind(project)}</p>
        </div>

        <div className="lg:col-span-7">
          <h2 className="text-[clamp(1.5rem,1.2vw+1rem,2rem)] font-bold leading-tight">
            <Link
              to={to}
              onClick={() => analytics.projectViewDetails(project.title)}
              className="transition-colors hover:text-tm-accent-text"
            >
              {project.title}
            </Link>
          </h2>
          <p className="mt-2 font-medium text-tm-ink">{project.tagline}</p>
          <p className="mt-3 text-[0.9375rem]">{project.description}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies used">
            {project.techStack.map((tech) => (
              <li key={tech} className="tm-tag">
                {tech}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-start gap-4 lg:col-span-3 lg:items-end lg:text-right">
          <span className="tm-tag-accent">{projectStatus(project)}</span>
          <Link
            to={to}
            onClick={() => analytics.projectViewDetails(project.title)}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-tm-ink hover:text-tm-accent-text"
            aria-label={`View details for ${project.title}`}
          >
            View details
            <ArrowRight size={15} className="tm-nudge-x" aria-hidden="true" />
          </Link>
          <ProjectLinks theme="terminal" project={project} className="lg:justify-end" />
        </div>
      </article>
    </Reveal>
  );
}

export default function Projects() {
  const { filtered, filter } = useProjectFilter('terminal');

  return (
    <div className="tm-wrap pt-14 md:pt-24">
      <SectionHeader
        as="h1"
        kicker="Work"
        title="Projects"
        intro="Company work and personal projects — full stack, frontend, and open-source."
      />

      {filter}

      <div id="projects-list" className="border-t border-tm-line">
        {filtered.map((project) => (
          <BoardRow key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
