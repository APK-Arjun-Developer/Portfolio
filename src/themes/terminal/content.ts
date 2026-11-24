import { education, experience, personal, projects, type Project } from '../../data/personal';

/*
 * Presentation helpers for the Terminal theme. Every fact comes from src/data/personal.ts
 * or the Signal theme's content.
 */

export { flows, headline, heroFacts, skillGroups, type Flow } from '../signal/content';

export const firstName = personal.name.split(' ')[0];

/** What the hero's flip calendar cycles through, after "I am a". */
export const calendarWords = [
  personal.role,
  'React Developer',
  '.NET Developer',
  'Node.js Developer',
];

const doorColours = ['#22344f', '#4d3743', '#74836e', '#a5552c', '#2f5157', '#6b4a31', '#45456a'];

export const doorColour = (index: number) => doorColours[index % doorColours.length];

export const projectLabel = (project: Project) =>
  `No. ${String(projects.indexOf(project) + 1).padStart(2, '0')}`;

/** Status shown on the projects page, read from what the project actually has. */
export function projectStatus(project: Project) {
  if (project.npm) return 'NPM package';
  if (project.demo) return 'Live demo';
  return 'Case study';
}

export const projectKind = (project: Project) =>
  project.category === 'company' ? 'Company' : 'Personal';

export interface Stop {
  /** Rolled into view beside the timeline as this stop becomes active. */
  year: string;
  period: string;
  title: string;
  subtitle: string;
  badge?: string;
  highlights: string[];
  /** Two RGB triplets for the soft light behind the page at this stop. */
  light: [string, string];
}

/** Current job first, back to education. */
export const stops: Stop[] = [
  ...experience.map((job, i) => ({
    year: /\d{4}/.exec(job.period)?.[0] ?? '',
    period: job.period,
    title: job.company,
    subtitle: `${job.role} · ${job.location}`,
    badge: i === 0 ? 'Current · Full-time' : 'Full-time',
    highlights: job.highlights,
    light: (i === 0 ? ['226, 122, 58', '92, 132, 202'] : ['178, 106, 148', '226, 178, 70']) as [
      string,
      string,
    ],
  })),
  {
    year: education.year,
    period: education.year,
    title: education.degree,
    subtitle: education.detail,
    highlights: [],
    light: ['132, 174, 104', '92, 132, 202'],
  },
];
