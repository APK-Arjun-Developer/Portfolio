import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const linkStyles = {
  signal: 'text-sg-muted hover:text-sg-ink',
  terminal: 'text-tm-muted hover:text-tm-ink',
};

interface BackToProjectsProps {
  theme: keyof typeof linkStyles;
  children: string;
}

export default function BackToProjects({ theme, children }: Readonly<BackToProjectsProps>) {
  return (
    <Link
      to="/projects"
      className={`group inline-flex items-center gap-2 text-sm font-semibold transition-colors ${linkStyles[theme]}`}
      aria-label="Back to all projects"
    >
      <ArrowLeft
        size={16}
        className="transition-transform duration-200 group-hover:-translate-x-0.5"
        aria-hidden="true"
      />
      {children}
    </Link>
  );
}
