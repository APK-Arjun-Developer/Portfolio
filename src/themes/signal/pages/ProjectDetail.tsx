import BackToProjects from '../../BackToProjects';
import { projectDetailEntrance } from '../../reveal-motion';
import ProjectSectionTitle from '../../ProjectSectionTitle';
import { useProjectDetail } from '../../useProjectDetail';
import ProjectDetailFooter from '../../ProjectDetailFooter';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { flows } from '../content';
import { duration, ease } from '../motion';
import FlowDiagram from '../components/FlowDiagram';
import ProjectLinks from '../../ProjectLinks';
import { Reveal, RevealGroup, RevealItem } from '../../Reveal';

const enter = (delay: number) => projectDetailEntrance(delay, duration.section);

export default function ProjectDetail() {
  const { project, next } = useProjectDetail();

  if (!project) return <Navigate to="/projects" replace />;

  const isCompany = project.category === 'company';
  const flow = flows[project.id];

  return (
    <article className="sg-wrap pt-10 md:pt-16">
      <motion.div {...enter(0)}>
        <BackToProjects theme="signal">All Projects</BackToProjects>
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
            <ProjectLinks theme="signal" project={project} variant="buttons" className="mt-8" />
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
          <ProjectSectionTitle
            theme="signal"
            id="overview-heading"
            kicker="01"
            title="Problem & Overview"
          />
        </div>
        <Reveal className="lg:col-span-8">
          <p className="text-[clamp(1.125rem,0.6vw+1rem,1.375rem)] leading-relaxed text-sg-ink">
            {project.overview}
          </p>
        </Reveal>
      </section>

      {/* ── Features ── */}
      <section className="mt-24 md:mt-32" aria-labelledby="features-heading">
        <ProjectSectionTitle
          theme="signal"
          id="features-heading"
          kicker="02"
          title="Key Features"
        />
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
        <ProjectSectionTitle
          theme="signal"
          id="challenges-heading"
          kicker="03"
          title="Challenges & Solutions"
        />
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
        <ProjectSectionTitle theme="signal" id="techstack-heading" kicker="04" title="Tech Stack" />
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

      <ProjectDetailFooter theme="signal" project={project} next={next} />
    </article>
  );
}
