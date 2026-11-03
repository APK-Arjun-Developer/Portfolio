import { cn } from '../../../lib/utils';
import type { Flow } from '../content';
import { RevealGroup, RevealItem } from './Reveal';

/** A project's request or data path, drawn as stops on a route. */
export default function RouteMap({
  flow,
  className,
}: Readonly<{ flow: Flow; className?: string }>) {
  return (
    <figure className={className}>
      <figcaption className="tm-kicker mb-4">{flow.caption}</figcaption>
      <div className="relative">
        <span
          className="absolute bottom-3 left-[0.4375rem] top-3 w-px bg-tm-line-strong"
          aria-hidden="true"
        />
        <RevealGroup as="ol" gap={0.05}>
          {flow.nodes.map((node, i) => {
            const focus = i === flow.focus;
            return (
              <RevealItem as="li" key={node} className="relative flex items-center gap-4 py-1.5">
                <span
                  className={cn(
                    'relative h-[0.9375rem] w-[0.9375rem] shrink-0 rounded-full border-2',
                    focus ? 'border-tm-accent bg-tm-accent' : 'border-tm-line-strong bg-tm-surface',
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    'min-w-0 break-words rounded-lg px-3 py-2 font-mono text-[0.8125rem] leading-snug',
                    focus ? 'bg-tm-accent text-tm-on-accent' : 'bg-tm-raised text-tm-ink',
                  )}
                >
                  {node}
                </span>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </figure>
  );
}
