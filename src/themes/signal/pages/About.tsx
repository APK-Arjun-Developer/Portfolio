import { education, experience } from '../../../data/personal';
import { heroFacts } from '../content';
import SectionHeader from '../components/SectionHeader';
import SkillGrid from '../components/SkillGrid';
import { Reveal, RevealGroup, RevealItem } from '../components/Reveal';

export default function About() {
  return (
    <div className="sg-wrap pt-14 md:pt-24">
      {/* ── About Me ── */}
      <section aria-labelledby="about-heading">
        <SectionHeader as="h1" id="about-heading" kicker="About" title="About Me" />

        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="space-y-6 lg:col-span-7">
            <p className="text-[clamp(1.25rem,1vw+1rem,1.625rem)] leading-snug text-sg-ink">
              I'm a Full Stack Developer with experience building production web applications using{' '}
              <span className="text-sg-coral-text">React, Node.js, and .NET Core</span>. I work
              across the full stack — from database design to responsive UI.
            </p>
            <p className="max-w-[38rem] text-lg">
              I've shipped multi-role SaaS platforms in healthcare, food delivery, and parking —
              systems where data integrity, real-time updates, and role-based access control matter.
            </p>
            <p className="max-w-[38rem] text-lg">
              I graduated with a B.E. in Aeronautical Engineering from Excel Engineering College
              (CGPA 8.0) and transitioned into software through the NxtWave MERN programme in 2023.
            </p>
          </Reveal>

          <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.1}>
            <div className="rounded-3xl border border-sg-line bg-sg-surface p-6">
              <dl className="grid grid-cols-3 gap-4 lg:grid-cols-1 lg:gap-6">
                {heroFacts.map(({ value, label }) => (
                  <div key={label} className="flex flex-col-reverse gap-1">
                    <dt className="sg-kicker">{label}</dt>
                    <dd className="font-display text-4xl font-extrabold leading-none text-sg-ink">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 border-t border-sg-line pt-4 font-mono text-xs text-sg-faint">
                Based in Tamil Nadu, India
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Experience ── */}
      <section className="mt-32 md:mt-44" aria-labelledby="experience-heading">
        <SectionHeader id="experience-heading" kicker="Experience" title="Experience" />

        <RevealGroup as="ol" className="relative space-y-6">
          {experience.map((entry, i) => (
            <RevealItem
              as="li"
              key={entry.period}
              className="grid gap-6 rounded-3xl border border-sg-line bg-sg-surface p-6 sm:p-8 lg:grid-cols-12"
            >
              <div className="lg:col-span-4">
                <time className="font-mono text-sm text-sg-coral-text">{entry.period}</time>
                <h3 className="mt-3 text-2xl font-bold leading-tight">{entry.company}</h3>
                <p className="mt-2 text-sm">
                  {entry.role} · {entry.location}
                </p>
                <span className="mt-4 inline-flex sg-tag-teal">
                  {i === 0 ? 'Current · Full-time' : 'Full-time'}
                </span>
              </div>
              <ul
                className="space-y-3 lg:col-span-8"
                aria-label={`Key responsibilities at ${entry.company}`}
              >
                {entry.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-[1.0625rem]">
                    <span
                      className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-sg-coral"
                      aria-hidden="true"
                    />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ── Skills ── */}
      <section className="mt-32 md:mt-44" aria-labelledby="skills-heading">
        <SectionHeader
          id="skills-heading"
          kicker="Capabilities"
          title="Technical Skills"
          intro="Technologies I work with across the full stack."
        />
        <SkillGrid />
      </section>

      {/* ── Education ── */}
      <section className="mt-16" aria-labelledby="education-heading">
        <Reveal className="flex flex-col gap-4 rounded-3xl border border-sg-line p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="sg-kicker">Education</p>
            <h2 id="education-heading" className="mt-2 text-2xl font-bold">
              {education.degree}
            </h2>
            <p className="mt-2">{education.detail}</p>
          </div>
          <span className="font-display text-3xl font-extrabold text-sg-faint">
            {education.year}
          </span>
        </Reveal>
      </section>
    </div>
  );
}
