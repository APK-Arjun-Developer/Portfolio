import { cn } from '../../../lib/utils';
import { Reveal } from './Reveal';

interface SectionHeaderProps {
  kicker: string;
  title: string;
  intro?: string;
  id?: string;
  as?: 'h1' | 'h2';
  action?: React.ReactNode;
  className?: string;
}

export default function SectionHeader({
  kicker,
  title,
  intro,
  id,
  as: Heading = 'h2',
  action,
  className,
}: Readonly<SectionHeaderProps>) {
  return (
    <Reveal
      className={cn(
        'mb-12 flex flex-wrap items-end justify-between gap-x-10 gap-y-6 md:mb-16',
        className,
      )}
    >
      <div className="max-w-3xl">
        <p className="sg-kicker flex items-center gap-3">
          <span className="h-px w-8 bg-sg-coral" aria-hidden="true" />
          {kicker}
        </p>
        <Heading
          id={id}
          className={cn(
            'mt-4 font-bold leading-[1.02]',
            Heading === 'h1'
              ? 'text-[clamp(2.5rem,5vw+1rem,4.75rem)]'
              : 'text-[clamp(2rem,3vw+1rem,3.5rem)]',
          )}
        >
          {title}
        </Heading>
        {intro && <p className="mt-5 max-w-2xl text-lg">{intro}</p>}
      </div>
      {action}
    </Reveal>
  );
}
