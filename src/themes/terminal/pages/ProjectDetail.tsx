import BackToProjects from '../../BackToProjects';
import { projectDetailEntrance } from '../../reveal-motion';
import ProjectSectionTitle from '../../ProjectSectionTitle';
import { useProjectDetail } from '../../useProjectDetail';
import ProjectDetailFooter from '../../ProjectDetailFooter';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { flows, projectLabel } from '../content';
import { duration } from '../motion';
import ProjectLinks from '../../ProjectLinks';
import RouteMap from '../components/RouteMap';
import { Reveal, RevealGroup, RevealItem } from '../../Reveal';

const enter = (delay: number) => projectDetailEntrance(delay, duration.section);

export default function ProjectDetail() {
  const { project, next } = useProjectDetail();

  if (!project) return <Navigate to="/projects" replace />;

  const isCompany = project.category === 'company';
  const flow = flows[project.id];

  return (
    <article className="tm-wrap pt-10 md:pt-16">
      <motion.div {...enter(0)}>
        <BackToProjects theme="terminal">All Projects</BackToProjects>
      </motion.div>

      {/* ── Boarding pass ── */}
      <motion.header {...enter(0.05)} className="tm-pass mt-8 grid md:mt-10 lg:grid-cols-12">
        <div className="p-6 sm:p-10 lg:col-span-7">
          <p className="tm-kicker">
            {projectLabel(project)} · {isCompany ? 'Company Project' : 'Personal Project'}
            {project.npm && ' · NPM Package'}
          </p>
          <h1 className="mt-4 text-[clamp(2.4rem,4vw+1rem,4.25rem)] font-extrabold leading-[0.98]">
            {project.title}
          </h1>
          <p className="mt-5 text-xl font-medium text-tm-accent-text">{project.tagline}</p>

          <dl className="mt-10 grid gap-6 border-y border-tm-line py-6 sm:grid-cols-2">
            {project.role && (
              <div>
                <dt className="tm-kicker">Role</dt>
                <dd className="mt-1.5 font-medium text-tm-ink">{project.role}</dd>
              </div>
            )}
            {project.companyName && (
              <div>
                <dt className="tm-kicker">Company</dt>
                <dd className="mt-1.5 font-medium text-tm-ink">{project.companyName}</dd>
              </div>
            )}
            <div className="sm:col-span-2">
              <dt className="tm-kicker">Technologies used</dt>
              <dd className="mt-3">
                <ul className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech, i) => (
                    <li key={tech} className={i === 0 ? 'tm-tag-accent' : 'tm-tag'}>
                      {tech}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>

          <ProjectLinks theme="terminal" project={project} variant="buttons" className="mt-8" />
        </div>

        {flow && (
          <div className="tm-pass__stub border-t border-tm-line p-6 sm:p-10 lg:col-span-5 lg:border-t-0">
            <RouteMap flow={flow} />
          </div>
        )}
      </motion.header>

      {/* ── Overview ── */}
      <section
        className="mt-24 grid gap-8 md:mt-32 lg:grid-cols-12"
        aria-labelledby="overview-heading"
      >
        <div className="lg:col-span-4">
          <ProjectSectionTitle
            theme="terminal"
            id="overview-heading"
            kicker="01"
            title="Problem & Overview"
          />
        </div>
        <Reveal className="lg:col-span-8">
          <p className="text-[clamp(1.125rem,0.6vw+1rem,1.375rem)] leading-relaxed text-tm-ink">
            {project.overview}
          </p>
        </Reveal>
      </section>

      {/* ── Features ── */}
      <section className="mt-24 md:mt-32" aria-labelledby="features-heading">
        <ProjectSectionTitle
          theme="terminal"
          id="features-heading"
          kicker="02"
          title="Key Features"
        />
        <RevealGroup as="ol" className="grid gap-4 md:grid-cols-2" aria-label="Key features">
          {project.features.map((f, i) => (
            <RevealItem
              as="li"
              key={f}
              className="flex gap-4 rounded-3xl border border-tm-line bg-tm-surface p-6 transition-colors duration-300 hover:border-tm-accent"
            >
              <span className="font-mono text-sm text-tm-accent-text" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[1.0625rem] text-tm-ink">{f}</span>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ── Challenges ── */}
      <section className="mt-24 md:mt-32" aria-labelledby="challenges-heading">
        <ProjectSectionTitle
          theme="terminal"
          id="challenges-heading"
          kicker="03"
          title="Challenges & Solutions"
        />
        <RevealGroup as="ol" className="space-y-6" aria-label="Technical challenges and solutions">
          {project.challenges.map((c, i) => (
            <RevealItem
              as="li"
              key={c.problem}
              className="grid overflow-hidden rounded-3xl border border-tm-line lg:grid-cols-2"
            >
              <div className="bg-tm-surface p-6 sm:p-8">
                <p className="tm-kicker">Problem {String(i + 1).padStart(2, '0')}</p>
                <p className="mt-4 text-xl font-bold leading-snug text-tm-ink sm:text-2xl">
                  {c.problem}
                </p>
              </div>
              <div className="border-t border-tm-line p-6 sm:p-8 lg:border-l lg:border-t-0">
                <p className="tm-kicker flex items-center gap-2 text-tm-ink">
                  <span className="h-2 w-2 rounded-full bg-tm-accent" aria-hidden="true" />
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
        <ProjectSectionTitle
          theme="terminal"
          id="techstack-heading"
          kicker="04"
          title="Tech Stack"
        />
        <RevealGroup
          as="ul"
          className="grid gap-px overflow-hidden rounded-3xl border border-tm-line bg-tm-line sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Complete list of technologies used"
        >
          {project.techStack.map((tech) => (
            <RevealItem as="li" key={tech} className="bg-tm-bg p-5 font-mono text-sm text-tm-ink">
              {tech}
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <ProjectDetailFooter theme="terminal" project={project} next={next} />
    </article>
  );
}
