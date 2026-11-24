import { Reveal } from './Reveal';

const styles = {
  signal: { kicker: 'sg-kicker', marker: 'h-px w-8 bg-sg-coral' },
  terminal: { kicker: 'tm-kicker', marker: 'h-2 w-2 rounded-full bg-tm-accent' },
};

interface ProjectSectionTitleProps {
  theme: keyof typeof styles;
  id: string;
  kicker: string;
  title: string;
}

export default function ProjectSectionTitle({
  theme,
  id,
  kicker,
  title,
}: Readonly<ProjectSectionTitleProps>) {
  const { kicker: kickerClass, marker } = styles[theme];

  return (
    <Reveal className="mb-8 md:mb-10">
      <p className={`flex items-center gap-3 ${kickerClass}`}>
        <span className={marker} aria-hidden="true" />
        <span>{kicker}</span>
      </p>
      <h2 id={id} className="mt-3 text-[clamp(1.75rem,2vw+1rem,2.5rem)] font-bold leading-tight">
        {title}
      </h2>
    </Reveal>
  );
}
