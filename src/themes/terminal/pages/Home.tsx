import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { personal, projects } from '../../../data/personal';
import { analytics } from '../../../lib/analytics';
import { GithubIcon, LinkedinIcon } from '../../../components/BrandIcons';
import { calendarWords, firstName, flows, headline } from '../content';
import { useOpenContact } from '../contact';
import { useIntroReady } from '../intro';
import { duration, ease } from '../motion';
import FlipCalendar from '../components/FlipCalendar';
import GateRow from '../components/Gate';
import { Reveal } from '../components/Reveal';
import RouteMap from '../components/RouteMap';
import SectionHeader from '../components/SectionHeader';
import SkillGrid from '../components/SkillGrid';
import Story from '../components/Story';

const featured = projects.find((p) => p.id === 'multi-tenant-api')!;
const personalProjects = projects.filter((p) => p.category !== 'company');
const companyProjects = projects.filter((p) => p.category === 'company');

function Line({
  delay,
  soft,
  children,
}: Readonly<{ delay: number; soft?: boolean; children: string }>) {
  const ready = useIntroReady();
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className={soft ? 'block text-tm-faint' : 'block'}
        initial={{ y: '105%' }}
        animate={{ y: ready ? 0 : '105%' }}
        transition={{ duration: 0.9, ease: ease.out, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Home() {
  const ready = useIntroReady();
  const openContact = useOpenContact();
  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    transition: { duration: duration.section, ease: ease.out, delay },
  });

  return (
    <>
      {/* ── Hero ── */}
      <section className="tm-hero" aria-label="Introduction">
        <div className="tm-wrap grid flex-1 gap-6 pt-6 lg:grid-cols-12 lg:gap-8 lg:pt-10">
          <div className="self-center pb-6 lg:col-span-7 lg:pb-16">
            <motion.p {...enter(0.1)} className="tm-eyebrow">
              Available for opportunities
            </motion.p>

            <h1 className="mt-4 text-[clamp(2.75rem,5.2vw,5rem)] font-semibold leading-[1.02]">
              <span className="sr-only">
                Hi, I'm {firstName}. I am a {personal.role}.
              </span>
              <span aria-hidden="true">
                <Line delay={0.15}>{`Hi, I'm ${firstName}.`}</Line>
                <Line delay={0.27} soft>
                  I am a
                </Line>
              </span>
            </h1>
            <motion.div {...enter(0.4)} className="mt-2">
              <FlipCalendar words={calendarWords} />
            </motion.div>

            <motion.p
              {...enter(0.5)}
              className="mt-8 max-w-[34rem] text-[1.0625rem] font-medium leading-snug text-tm-ink"
            >
              {headline.map((part) => part.text).join(' ')}
            </motion.p>

            <motion.div {...enter(0.58)} className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/projects"
                className="tm-btn-primary group"
                onClick={() => analytics.ctaClick('view_projects')}
              >
                View Projects
                <span className="tm-badge">
                  <ArrowRight size={15} className="tm-nudge-x" aria-hidden="true" />
                </span>
              </Link>
              <button type="button" className="tm-btn-secondary" onClick={openContact}>
                Contact Me
              </button>
            </motion.div>

            <motion.ul
              {...enter(0.66)}
              className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm"
              aria-label="Social links"
            >
              <li>
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 font-medium text-tm-muted transition-colors hover:text-tm-ink"
                  aria-label="Visit my GitHub profile (opens in new tab)"
                  onClick={() => analytics.socialClick('github', 'home_hero')}
                >
                  <GithubIcon size={15} /> GitHub
                  <ArrowUpRight size={13} className="tm-nudge-ne" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 font-medium text-tm-muted transition-colors hover:text-tm-ink"
                  aria-label="Visit my LinkedIn profile (opens in new tab)"
                  onClick={() => analytics.socialClick('linkedin', 'home_hero')}
                >
                  <LinkedinIcon size={15} /> LinkedIn
                  <ArrowUpRight size={13} className="tm-nudge-ne" aria-hidden="true" />
                </a>
              </li>
            </motion.ul>
          </div>

          <motion.div {...enter(0.2)} className="flex items-end justify-center lg:col-span-5">
            <img
              src="/terminal/arjun-cutout.png"
              alt={`Portrait of ${personal.name}`}
              width={1024}
              height={1536}
              className="tm-hero-portrait h-auto w-full max-w-[22rem] lg:max-w-[26rem]"
            />
          </motion.div>
        </div>

        <div className="border-t border-tm-line">
          <div className="tm-wrap flex h-14 items-center justify-between gap-4 text-[0.8125rem] uppercase tracking-wide text-tm-muted">
            <span>{personal.role}</span>
            <span className="hidden md:inline">Based in Tamil Nadu, India</span>
            <span className="hidden items-center gap-2 sm:inline-flex" aria-hidden="true">
              Scroll to explore
              <ArrowDown size={13} />
            </span>
          </div>
        </div>
      </section>

      {/* ── The wall of doors ── */}
      <div className="tm-wall">
        <section className="tm-wrap" aria-labelledby="work-heading">
          <SectionHeader
            id="work-heading"
            kicker="Selected work"
            title="Personal projects, built in the open."
            centered
          />
          <GateRow gates={personalProjects} />
        </section>
        <div className="tm-floor" aria-hidden="true" />

        <section className="tm-wrap" aria-labelledby="company-heading">
          <SectionHeader
            id="company-heading"
            kicker="Company work"
            title="Shipped with product teams."
            centered
          />
          <GateRow gates={companyProjects} />
        </section>
      </div>

      {/* ── Story ── */}
      <Story
        id="experience-heading"
        kicker="Experience"
        title="Where I've worked."
        action={
          <Link to="/about" className="tm-btn-secondary group">
            Full background
            <ArrowRight size={16} className="tm-nudge-x" aria-hidden="true" />
          </Link>
        }
      />

      {/* ── The route behind the flagship project ── */}
      <section className="tm-wrap mt-24 md:mt-32" aria-label="How it works">
        <Reveal className="grid gap-8 rounded-[2rem] border border-tm-line bg-tm-surface p-6 sm:p-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="tm-eyebrow">How it works</p>
            <p className="mt-3 text-[clamp(1.5rem,1.5vw+1rem,2.25rem)] font-semibold leading-tight text-tm-ink">
              {featured.title}
            </p>
            <p className="mt-3">{featured.tagline}</p>
            <Link
              to={`/projects/${featured.id}`}
              onClick={() => analytics.projectViewDetails(featured.title)}
              className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-tm-accent-text"
            >
              Read the case study
              <ArrowRight size={15} className="tm-nudge-x" aria-hidden="true" />
            </Link>
          </div>
          <RouteMap flow={flows[featured.id]} className="lg:col-span-7" />
        </Reveal>
      </section>

      {/* ── Capabilities ── */}
      <section className="tm-wrap mt-24 md:mt-32" aria-labelledby="skills-heading">
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
