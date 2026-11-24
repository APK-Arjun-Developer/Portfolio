import { useState } from 'react';
import { motion } from 'framer-motion';
import { projects } from '../data/personal';
import { analytics } from '../lib/analytics';
import { cn } from '../lib/utils';
import { ease } from './reveal-motion';

const filterStyles = {
  signal: {
    container: 'mb-16 inline-flex flex-wrap gap-1 rounded-full border border-sg-line p-1 md:mb-24',
    active: 'text-sg-on-coral',
    inactive: 'text-sg-muted hover:text-sg-ink',
    pillId: 'sg-filter-pill',
    pill: 'absolute inset-0 rounded-full bg-sg-coral',
  },
  terminal: {
    container: 'mb-10 inline-flex flex-wrap gap-1 rounded-full border border-tm-line p-1 md:mb-14',
    active: 'text-tm-on-accent',
    inactive: 'text-tm-muted hover:text-tm-ink',
    pillId: 'tm-filter-pill',
    pill: 'absolute inset-0 rounded-full bg-tm-accent',
  },
};

type FilterTab = 'all' | 'company' | 'personal';

const tabs: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All Projects' },
  { id: 'company', label: 'Company Work' },
  { id: 'personal', label: 'Personal' },
];

const matches = (tab: FilterTab, category: string | undefined) =>
  tab === 'all' || (tab === 'company' ? category === 'company' : category !== 'company');

export function useProjectFilter(theme: keyof typeof filterStyles) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const filtered = projects.filter((project) => matches(activeTab, project.category));
  const styles = filterStyles[theme];

  const filter = (
    <fieldset className={styles.container}>
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
              active ? styles.active : styles.inactive,
            )}
          >
            {active && (
              <motion.span
                layoutId={styles.pillId}
                className={styles.pill}
                transition={{ duration: 0.26, ease: ease.inOut }}
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
  );
  return { filtered, filter };
}
