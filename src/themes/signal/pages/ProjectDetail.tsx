import { motion } from 'framer-motion';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { projects } from '../../../data/personal';
import { analytics } from '../../../lib/analytics';
import { flows } from '../content';
import { duration, ease } from '../motion';
import FlowDiagram from '../components/FlowDiagram';
import ProjectLinks from '../components/ProjectLinks';
import { Reveal, RevealGroup, RevealItem } from '../components/Reveal';

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: duration.section, ease: ease.out, delay },
});

function SectionTitle({
  id,
  kicker,
  title,
}: Readonly<{ id: string; kicker: string; title: string }>) {
  return (
    <Reveal className="mb-8 md:mb-10">
      <p className="sg-kicker flex items-center gap-3">
        <span className="h-px w-8 bg-sg-coral" aria-hidden="true" />
        {kicker}
      </p>
      <h2 id={id} className="mt-3 text-[clamp(1.75rem,2vw+1rem,2.5rem)] font-bold leading-tight">
        {title}
      </h2>
    </Reveal>
  );
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const index = projects.findIndex((p) => p.id === id);
  const project = projects[index];

  if (!project) return <Navigate to="/projects" replace />;

  const isCompany = project.category === 'company';
  const flow = flows[project.id];
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="sg-wrap pt-10 md:pt-16">
      <motion.div {...enter(0)}>
        <Link
          to="/projects"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-sg-muted transition-colors hover:text-sg-ink"
          aria-label="Back to all projects"
        >
          <ArrowLeft
            size={16}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          All Projects
        </Link>
      </motion.div>

      {/* ── Header ── */}
      <header className="mt-10 grid gap-12 md:mt-14 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <motion.p {...enter(0.05)} className="sg-kicker">
            {isCompany ? 'Company Project' : 'Personal Project'}
            {project.npm && ' · NPM Package'}
          </motion.p>
          <motion.h1
            {...enter(0.1)}
            className="mt-4 text-[clamp(2.4rem,4.4vw+1rem,4.75rem)] font-extrabold leading-[0.98] tracking-[-0.03em]"
          >
            {project.title}
          </motion.h1>
          <motion.p {...enter(0.18)} className="mt-5 text-xl font-medium text-sg-coral-text">
            {project.tagline}
          </motion.p>

          <motion.dl
            {...enter(0.26)}
            className="mt-10 grid gap-6 border-y border-sg-line py-6 sm:grid-cols-2"
          >
            {project.role && (
              <div>
                <dt className="sg-kicker">Role</dt>
                <dd className="mt-1.5 font-medium text-sg-ink">{project.role}</dd>
              </div>
            )}
            {project.companyName && (
              <div>
                <dt className="sg-kicker">Company</dt>
                <dd className="mt-1.5 font-medium text-sg-ink">{project.companyName}</dd>
              </div>
            )}
            <div className="sm:col-span-2">
              <dt className="sg-kicker">Technologies used</dt>
              <dd className="mt-3">
                <ul className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech, i) => (
                    <li key={tech} className={i === 0 ? 'sg-tag-teal' : 'sg-tag'}>
                      {tech}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </motion.dl>

          <motion.div {...enter(0.32)}>
            <ProjectLinks project={project} variant="buttons" className="mt-8" />
          </motion.div>
        </div>

        {flow && (
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 24, clipPath: 'inset(10% 0% 0% 0% round 2rem)' }}
            animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 2rem)' }}
            transition={{ duration: 0.8, ease: ease.out, delay: 0.2 }}
          >
            <div className="rounded-[2rem] border border-sg-line bg-sg-surface p-6 sm:p-8">
              <FlowDiagram flow={flow} live />
            </div>
          </motion.div>
        )}
      </header>

      {/* ── Overview ── */}
      <section
        className="mt-24 grid gap-8 md:mt-32 lg:grid-cols-12"
        aria-labelledby="overview-heading"
      >
        <div className="lg:col-span-4">
          <SectionTitle id="overview-heading" kicker="01" title="Problem & Overview" />
        </div>
        <Reveal className="lg:col-span-8">
          <p className="text-[clamp(1.125rem,0.6vw+1rem,1.375rem)] leading-relaxed text-sg-ink">
            {project.overview}
          </p>
        </Reveal>
      </section>

      {/* ── Features ── */}
      <section className="mt-24 md:mt-32" aria-labelledby="features-heading">
        <SectionTitle id="features-heading" kicker="02" title="Key Features" />
        <RevealGroup as="ol" className="grid gap-4 md:grid-cols-2" aria-label="Key features">
          {project.features.map((f, i) => (
            <RevealItem
              as="li"
              key={f}
              className="flex gap-4 rounded-3xl border border-sg-line bg-sg-surface p-6 transition-colors duration-300 hover:border-sg-teal"
            >
              <span className="font-mono text-sm text-sg-coral-text" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[1.0625rem] text-sg-ink">{f}</span>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ── Challenges ── */}
      <section className="mt-24 md:mt-32" aria-labelledby="challenges-heading">
        <SectionTitle id="challenges-heading" kicker="03" title="Challenges & Solutions" />
        <RevealGroup as="ol" className="space-y-6" aria-label="Technical challenges and solutions">
          {project.challenges.map((c, i) => (
            <RevealItem
              as="li"
              key={c.problem}
              className="grid overflow-hidden rounded-3xl border border-sg-line lg:grid-cols-2"
            >
              <div className="bg-sg-surface p-6 sm:p-8">
                <p className="sg-kicker">Problem {String(i + 1).padStart(2, '0')}</p>
                <p className="mt-4 font-display text-xl font-bold leading-snug text-sg-ink sm:text-2xl">
                  {c.problem}
                </p>
              </div>
              <div className="border-t border-sg-line p-6 sm:p-8 lg:border-l lg:border-t-0">
                <p className="sg-kicker flex items-center gap-2 text-sg-ink">
                  <span className="h-2 w-2 rounded-full bg-sg-teal" aria-hidden="true" />
                  <span>Solution</span>
                </p>
                <p className="mt-4 text-[1.0625rem] leading-relaxed">{c.solution}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ── Tech stack ── */}
      <section className="mt-24 md:mt-32" aria-labelledby="techstack-heading">
        <SectionTitle id="techstack-heading" kicker="04" title="Tech Stack" />
        <RevealGroup
          as="ul"
          className="grid gap-px overflow-hidden rounded-3xl border border-sg-line bg-sg-line sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Complete list of technologies used"
        >
          {project.techStack.map((tech) => (
            <RevealItem as="li" key={tech} className="bg-sg-bg p-5 font-mono text-sm text-sg-ink">
              {tech}
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ── Footer: back, links, next ── */}
      <Reveal className="mt-24 flex flex-col items-start justify-between gap-6 border-t border-sg-line pt-8 sm:flex-row sm:items-center">
        <Link
          to="/projects"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-sg-muted transition-colors hover:text-sg-ink"
          aria-label="Back to all projects"
        >
          <ArrowLeft
            size={16}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Back to Projects
        </Link>
        <ProjectLinks project={project} />
      </Reveal>

      {next && next.id !== project.id && (
        <Reveal className="mt-12">
          <Link
            to={`/projects/${next.id}`}
            onClick={() => analytics.projectViewDetails(next.title)}
            className="group block rounded-[2rem] border border-sg-line bg-sg-surface p-8 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-sg-coral sm:p-10"
          >
            <span className="sg-kicker">Next project</span>
            <span className="mt-3 flex items-center justify-between gap-6 font-display text-[clamp(1.75rem,3vw+1rem,3rem)] font-extrabold leading-tight text-sg-ink transition-colors group-hover:text-sg-coral-text">
              {next.title}
              <ArrowRight
                size={36}
                strokeWidth={1.75}
                className="sg-nudge-x shrink-0"
                aria-hidden="true"
              />
            </span>
          </Link>
        </Reveal>
      )}
    </article>
  );
}
