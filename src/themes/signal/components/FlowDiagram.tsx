import { cn } from '../../../lib/utils';
import type { Flow } from '../content';
import { RevealGroup, RevealItem } from './Reveal';

interface FlowDiagramProps {
  flow: Flow;
  /** Run the packet animation continuously instead of only on parent hover/focus. */
  live?: boolean;
  className?: string;
}

/**
 * Vertical flow of a project's request/data path. Packets travel the connectors while
 * the enclosing `.group` is hovered or focused (or always when `live`).
 */
export default function FlowDiagram({ flow, live, className }: FlowDiagramProps) {
  return (
    <figure className={cn('sg-flow', className)} data-live={live || undefined}>
      <figcaption className="sg-kicker mb-4">{flow.caption}</figcaption>
      <RevealGroup as="ol" gap={0.05}>
        {flow.nodes.map((node, i) => {
          const focus = i === flow.focus;
          return (
            <RevealItem as="li" key={node}>
              {i > 0 && (
                <span
                  className="relative ml-[1.3rem] block h-6 w-px bg-sg-line-strong"
                  aria-hidden="true"
                >
                  <span
                    className="sg-packet absolute -left-[3px] top-0 h-[7px] w-[7px] rounded-full bg-sg-coral"
                    style={{ animationDelay: `${(i - 1) * 0.3}s` }}
                  />
                </span>
              )}
              <div
                className={cn(
                  'flex items-baseline gap-3 rounded-xl border px-3.5 py-2.5 font-mono text-[0.8125rem] leading-snug',
                  focus
                    ? 'border-sg-coral bg-sg-coral text-sg-on-coral'
                    : 'border-sg-line bg-sg-bg text-sg-ink',
                )}
              >
                <span className={cn('text-[0.6875rem]', focus ? 'opacity-80' : 'text-sg-faint')}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0 break-words">{node}</span>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </figure>
  );
}
