import { skillGroups } from '../content';
import { RevealGroup, RevealItem } from './Reveal';

/** Skills grouped by engineering capability — no fake proficiency bars. */
export default function SkillGrid() {
  return (
    <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {skillGroups.map((group, i) => (
        <RevealItem
          as="li"
          key={group.title}
          className="flex flex-col rounded-3xl border border-sg-line bg-sg-surface p-6 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-sg-teal"
        >
          <span className="font-mono text-xs text-sg-faint" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3 className="mt-6 text-xl font-bold leading-tight">{group.title}</h3>
          <p className="mt-2 text-[0.9375rem]">{group.summary}</p>
          <ul className="mt-6 flex flex-wrap gap-1.5" aria-label={`${group.title} technologies`}>
            {group.items.map((item) => (
              <li key={item} className="sg-tag">
                {item}
              </li>
            ))}
          </ul>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
