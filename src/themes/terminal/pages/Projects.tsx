import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects, type Project } from '../../../data/personal';
import { analytics } from '../../../lib/analytics';
import { cn } from '../../../lib/utils';
import { projectLabel, projectKind, projectStatus } from '../content';
import { duration, ease } from '../motion';
import ProjectLinks from '../components/ProjectLinks';
import { Reveal } from '../components/Reveal';
import SectionHeader from '../components/SectionHeader';

type FilterTab = 'all' | 'company' | 'personal';

const tabs: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All Projects' },
  { id: 'company', label: 'Company Work' },
  { id: 'personal', label: 'Personal' },
];

const matches = (tab: FilterTab, category: string | undefined) =>
  tab === 'all' || (tab === 'company' ? category === 'company' : category !== 'company');

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
          <ProjectLinks project={project} className="lg:justify-end" />
        </div>
      </article>
    </Reveal>
  );
}

export default function Projects() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const filtered = projects.filter((p) => matches(activeTab, p.category));

  return (
    <div className="tm-wrap pt-14 md:pt-24">
      <SectionHeader
        as="h1"
        kicker="Work"
        title="Projects"
        intro="Company work and personal projects — full stack, frontend, and open-source."
      />

      <fieldset className="mb-10 inline-flex flex-wrap gap-1 rounded-full border border-tm-line p-1 md:mb-14">
        <legend className="sr-only">Filter projects by category</legend>
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          const count = projects.filter((p) => matches(tab.id, p.category)).length;
          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={active}
              aria-controls="projects-list"
              onClick={() => {
                setActiveTab(tab.id);
                analytics.projectFilterClick(tab.id);
              }}
              className={cn(
                'relative inline-flex min-h-[2.5rem] items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors duration-200',
                active ? 'text-tm-on-accent' : 'text-tm-muted hover:text-tm-ink',
              )}
            >
              {active && (
                <motion.span
                  layoutId="tm-filter-pill"
                  className="absolute inset-0 rounded-full bg-tm-accent"
                  transition={{ duration: duration.ui + 0.06, ease: ease.inOut }}
                />
              )}
              <span className="relative">{tab.label}</span>
              <span
                className="relative font-mono text-xs opacity-75"
                aria-label={`${count} projects`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </fieldset>

      <div id="projects-list" className="border-t border-tm-line">
        {filtered.map((project) => (
          <BoardRow key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
