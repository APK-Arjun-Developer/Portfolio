import { skillGroups } from './signal/content';
import { RevealGroup, RevealItem } from './Reveal';

const skillStyles = {
  signal: {
    card: 'flex flex-col rounded-3xl border border-sg-line bg-sg-surface p-6 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-sg-teal',
    number: 'font-mono text-xs text-sg-faint',
    tag: 'sg-tag',
  },
  terminal: {
    card: 'flex flex-col rounded-3xl border border-tm-line bg-tm-surface p-6 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-tm-accent',
    number: 'font-mono text-xs text-tm-faint',
    tag: 'tm-tag',
  },
};

/** Skills grouped by engineering capability — no fake proficiency bars. */
export default function SkillGrid({ theme }: Readonly<{ theme: 'signal' | 'terminal' }>) {
  const styles = skillStyles[theme];
  return (
    <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {skillGroups.map((group, i) => (
        <RevealItem as="li" key={group.title} className={styles.card}>
          <span className={styles.number} aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3 className="mt-6 text-xl font-bold leading-tight">{group.title}</h3>
          <p className="mt-2 text-[0.9375rem]">{group.summary}</p>
          <ul className="mt-6 flex flex-wrap gap-1.5" aria-label={`${group.title} technologies`}>
            {group.items.map((item) => (
              <li key={item} className={styles.tag}>
                {item}
              </li>
            ))}
          </ul>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
