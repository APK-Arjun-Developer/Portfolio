import { cn } from '../../../lib/utils';
import { Reveal } from '../../Reveal';

interface SectionHeaderProps {
  kicker: string;
  title: string;
  intro?: string;
  id?: string;
  as?: 'h1' | 'h2';
  action?: React.ReactNode;
  /** Large and centred, like lettering painted on the wall above the doors. */
  centered?: boolean;
  className?: string;
}

export default function SectionHeader({
  kicker,
  title,
  intro,
  id,
  as: Heading = 'h2',
  action,
  centered,
  className,
}: Readonly<SectionHeaderProps>) {
  return (
    <Reveal
      className={cn(
        'mb-12 flex flex-wrap gap-x-10 gap-y-6 md:mb-16',
        centered ? 'flex-col items-center text-center' : 'items-end justify-between',
        className,
      )}
    >
      <div className={centered ? 'max-w-6xl' : 'max-w-3xl'}>
        <p className={cn('tm-eyebrow', centered && 'justify-center')}>{kicker}</p>
        <Heading
          id={id}
          className={cn(
            'mt-3 font-semibold',
            Heading === 'h1' && 'text-[clamp(2.5rem,5vw+1rem,4.75rem)]',
            Heading === 'h2' && centered && 'text-[clamp(2.25rem,4.2vw,3.75rem)]',
            Heading === 'h2' && !centered && 'text-[clamp(2rem,3vw+1rem,3.5rem)]',
            // After the font size: tailwind-merge drops a line height that comes before one.
            'leading-[1.02]',
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
