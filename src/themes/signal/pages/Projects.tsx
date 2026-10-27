import { useState } from 'react';
import { motion } from 'framer-motion';
import { projects } from '../../../data/personal';
import { analytics } from '../../../lib/analytics';
import { cn } from '../../../lib/utils';
import { duration, ease } from '../motion';
import ProjectPanel from '../components/ProjectPanel';
import SectionHeader from '../components/SectionHeader';

type FilterTab = 'all' | 'company' | 'personal';

const tabs: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All Projects' },
  { id: 'company', label: 'Company Work' },
  { id: 'personal', label: 'Personal' },
];

const matches = (tab: FilterTab, category: string | undefined) =>
  tab === 'all' || (tab === 'company' ? category === 'company' : category !== 'company');

export default function Projects() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const filtered = projects.filter((p) => matches(activeTab, p.category));

  return (
    <div className="sg-wrap pt-14 md:pt-24">
      <SectionHeader
        as="h1"
        kicker="Work"
        title="Projects"
        intro="Company work and personal projects — full stack, frontend, and open-source."
      />

      <div
        className="mb-16 inline-flex flex-wrap gap-1 rounded-full border border-sg-line p-1 md:mb-24"
        role="group"
        aria-label="Filter projects by category"
      >
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
                active ? 'text-sg-on-coral' : 'text-sg-muted hover:text-sg-ink',
              )}
            >
              {active && (
                <motion.span
                  layoutId="sg-filter-pill"
                  className="absolute inset-0 rounded-full bg-sg-coral"
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
      </div>

      <div id="projects-list" className="space-y-24 md:space-y-32">
        {filtered.map((project, i) => (
          <ProjectPanel
            key={project.id}
            project={project}
            index={i}
            flip={i % 2 === 1}
            headingAs="h2"
          />
        ))}
      </div>
    </div>
  );
}
