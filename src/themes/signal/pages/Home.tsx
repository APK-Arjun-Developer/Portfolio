import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { experience, personal, projects, type Project } from '../../../data/personal';
import { analytics } from '../../../lib/analytics';
import { GithubIcon, LinkedinIcon } from '../../../components/BrandIcons';
import { flows, headline, heroFacts } from '../content';
import { duration, ease } from '../motion';
import FlowDiagram from '../components/FlowDiagram';
import ProjectPanel from '../components/ProjectPanel';
import SectionHeader from '../components/SectionHeader';
import SignalMesh from '../components/SignalMesh';
import SkillGrid from '../components/SkillGrid';
import SplitHeadline from '../components/SplitHeadline';
import { RevealGroup, RevealItem } from '../components/Reveal';

const featured = projects.find((p) => p.id === 'multi-tenant-api')!;
const personalProjects = projects.filter((p) => p.category !== 'company');
const companyProjects = projects.filter((p) => p.category === 'company');

/** Hero entrance: headline words start at 0.1s; everything settles by ~0.9s. */
const enter = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: duration.section, ease: ease.out, delay },
});

function CompanyCard({ project }: { project: Project }) {
  return (
    <RevealItem as="li">
      <Link
        to={`/projects/${project.id}`}
        onClick={() => analytics.projectViewDetails(project.title)}
        className="group flex h-full flex-col rounded-3xl border border-sg-line bg-sg-surface p-6 transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-sg-coral hover:shadow-[0_24px_50px_-30px_var(--sg-shadow)] focus-visible:border-sg-coral"
      >
        <p className="sg-kicker">{project.companyName}</p>
        <h3 className="mt-4 text-2xl font-bold leading-tight transition-colors group-hover:text-sg-coral-text">
          {project.title}
        </h3>
        <p className="mt-3 flex-1 text-[0.9375rem]">{project.tagline}</p>
        {project.role && <p className="mt-5 text-sm font-medium text-sg-ink">{project.role}</p>}
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies used">
          {project.techStack.slice(0, 4).map((tech) => (
            <li key={tech} className="sg-tag">
              {tech}
            </li>
          ))}
        </ul>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-sg-ink group-hover:text-sg-coral-text">
          Read case study
          <ArrowRight size={15} className="sg-nudge-x" aria-hidden="true" />
        </span>
      </Link>
    </RevealItem>
  );
}

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden" aria-label="Introduction">
        <SignalMesh />
        <div className="sg-wrap grid gap-14 pb-20 pt-12 md:pt-20 lg:grid-cols-12 lg:items-center lg:gap-10 lg:pb-28">
          <div className="lg:col-span-7">
            <motion.p {...enter(0)} className="sg-kicker flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-sg-teal" aria-hidden="true" />
              Available for opportunities · {personal.role}
            </motion.p>

            <SplitHeadline
              parts={headline}
              delay={0.1}
              className="mt-7 text-[clamp(2.25rem,3.4vw+1rem,4.25rem)] font-extrabold leading-[1.02] tracking-[-0.03em]"
            />

            <motion.p {...enter(0.42)} className="mt-8 max-w-[36rem] text-lg leading-relaxed">
              {personal.summary}
            </motion.p>

            <motion.div {...enter(0.52)} className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/projects"
                className="sg-btn-primary group"
                onClick={() => analytics.ctaClick('view_projects')}
              >
                View Projects
                <ArrowRight size={17} className="sg-nudge-x" aria-hidden="true" />
              </Link>
              <a
                href={`mailto:${personal.email}`}
                className="sg-btn-secondary group"
                aria-label={`Email me at ${personal.email}`}
                onClick={() => analytics.ctaClick('contact_me')}
              >
                <Mail size={16} aria-hidden="true" />
                Contact Me
              </a>
            </motion.div>

            <motion.ul
              {...enter(0.6)}
              className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm"
              aria-label="Social links"
            >
              <li>
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 font-medium text-sg-muted transition-colors hover:text-sg-ink"
                  aria-label="Visit my GitHub profile (opens in new tab)"
                  onClick={() => analytics.socialClick('github', 'home_hero')}
                >
                  <GithubIcon size={15} /> GitHub
                  <ArrowUpRight size={13} className="sg-nudge-ne" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 font-medium text-sg-muted transition-colors hover:text-sg-ink"
                  aria-label="Visit my LinkedIn profile (opens in new tab)"
                  onClick={() => analytics.socialClick('linkedin', 'home_hero')}
                >
                  <LinkedinIcon size={15} /> LinkedIn
                  <ArrowUpRight size={13} className="sg-nudge-ne" aria-hidden="true" />
                </a>
              </li>
            </motion.ul>
          </div>

          {/* Hero visual: the real request path of the flagship project */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 24, clipPath: 'inset(10% 0% 0% 0% round 2rem)' }}
            animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 2rem)' }}
            transition={{ duration: 0.8, ease: ease.out, delay: 0.25 }}
          >
            <div className="rounded-[2rem] border border-sg-line bg-sg-surface p-6 shadow-[0_40px_80px_-50px_var(--sg-shadow)] sm:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="sg-kicker">How it works</p>
                  <p className="mt-2 font-display text-lg font-bold leading-tight text-sg-ink">
                    {featured.title}
                  </p>
                </div>
                <span className="sg-tag-teal shrink-0">{featured.techStack[0]}</span>
              </div>
              <FlowDiagram flow={flows[featured.id]} live />
              <Link
                to={`/projects/${featured.id}`}
                onClick={() => analytics.projectViewDetails(featured.title)}
                className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-sg-coral-text"
              >
                Read the case study
                <ArrowRight size={15} className="sg-nudge-x" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Facts strip */}
        <motion.div {...enter(0.7)} className="border-y border-sg-line">
          <dl className="sg-wrap grid grid-cols-3">
            {heroFacts.map(({ value, label }, i) => (
              <div
                key={label}
                className={`flex flex-col-reverse gap-1 py-7 ${i > 0 ? 'border-l border-sg-line pl-4 sm:pl-8' : ''}`}
              >
                <dt className="sg-kicker">{label}</dt>
                <dd className="font-display text-[clamp(1.75rem,3vw+0.5rem,3rem)] font-extrabold leading-none text-sg-ink">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </section>

      {/* ── Selected (personal) work ── */}
      <section className="sg-wrap mt-24 md:mt-36" aria-labelledby="work-heading">
        <SectionHeader
          id="work-heading"
          kicker="Selected work"
          title="Personal projects, built in the open."
          action={
            <Link to="/projects" className="sg-btn-secondary group">
              All Projects
              <ArrowRight size={16} className="sg-nudge-x" aria-hidden="true" />
            </Link>
          }
        />
        <div className="space-y-24 md:space-y-32">
          {personalProjects.map((project, i) => (
            <ProjectPanel key={project.id} project={project} index={i} flip={i % 2 === 1} />
          ))}
        </div>
      </section>

      {/* ── Company work ── */}
      <section className="sg-wrap mt-32 md:mt-44" aria-labelledby="company-heading">
        <SectionHeader
          id="company-heading"
          kicker="Company work"
          title="Shipped with product teams."
        />
        <RevealGroup as="ul" className="grid gap-4 md:grid-cols-3">
          {companyProjects.map((project) => (
            <CompanyCard key={project.id} project={project} />
          ))}
        </RevealGroup>
      </section>

      {/* ── Experience strip ── */}
      <section className="sg-wrap mt-32 md:mt-44" aria-labelledby="experience-heading">
        <SectionHeader
          id="experience-heading"
          kicker="Experience"
          title="Where I've worked."
          action={
            <Link to="/about" className="sg-btn-secondary group">
              Full background
              <ArrowRight size={16} className="sg-nudge-x" aria-hidden="true" />
            </Link>
          }
        />
        <RevealGroup as="ol" className="border-t border-sg-line">
          {experience.map((job) => (
            <RevealItem
              as="li"
              key={job.period}
              className="grid gap-2 border-b border-sg-line py-7 md:grid-cols-12 md:items-baseline md:gap-8"
            >
              <span className="font-mono text-sm text-sg-faint md:col-span-3">{job.period}</span>
              <span className="font-display text-xl font-bold text-sg-ink md:col-span-5">
                {job.company}
              </span>
              <span className="md:col-span-4 md:text-right">
                {job.role} · {job.location}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ── Capabilities ── */}
      <section className="sg-wrap mt-32 md:mt-44" aria-labelledby="skills-heading">
        <SectionHeader
          id="skills-heading"
          kicker="Capabilities"
          title="What I build with."
          intro="Grouped by the kind of engineering work, with the tools I've used for each."
        />
        <SkillGrid />
      </section>
    </>
  );
}
