import { motion } from 'framer-motion';
import { skills } from '../../data/personal';
import AuroraBackground from '../../components/ui/AuroraBackground';
import SectionTitle from '../../components/ui/SectionTitle';
import GlassCard from '../../components/ui/GlassCard';
import TechCard from '../../components/ui/TechCard';
import { MapPin, CalendarDays, Briefcase } from 'lucide-react';

const careerStart = new Date('2023-08-01');
function getDynamicExperience() {
  const now = new Date();
  const months =
    (now.getFullYear() - careerStart.getFullYear()) * 12 +
    (now.getMonth() - careerStart.getMonth());
  const years = months / 12;
  return years % 1 === 0 ? `${years}` : years.toFixed(1);
}

const timeline = [
  {
    period: 'Feb 2025 – Present',
    role: 'Full Stack Developer',
    company: 'Techbumbles Software Solutions Pvt Ltd',
    location: 'Erode, TN',
    accent: '#60a5fa',
    accentBg: 'rgba(59,130,246,0.10)',
    accentBorder: 'rgba(59,130,246,0.25)',
    highlights: [
      'Building scalable full-stack web applications with React, Node.js, .NET Core and PostgreSQL',
      'Collaborating with cross-functional teams to deliver new features and improve system architecture',
      'Implementing best practices in performance optimisation, security, and maintainability',
    ],
  },
  {
    period: 'Aug 2023 – Jan 2025',
    role: 'Full Stack Developer',
    company: 'PM Square Soft Services Pvt Ltd',
    location: 'Coimbatore, TN',
    accent: '#a78bfa',
    accentBg: 'rgba(139,92,246,0.10)',
    accentBorder: 'rgba(139,92,246,0.25)',
    highlights: [
      'Developed high-performance web apps using React, Node.js, and .NET Core',
      'Designed and optimised databases with MySQL, SQLite, and SQL Server',
      'Conducted code reviews, debugging, and maintained architecture and user-guide documentation',
    ],
  },
];

const allSkills = [...skills.frontend, ...skills.backend, ...skills.databases, ...skills.tools];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: {
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    delay,
  },
});

export default function About() {
  return (
    <AuroraBackground className="min-h-screen">
      <div className="container-xl section-py">
        {/* ── 01 About Me ── */}
        <section aria-labelledby="about-heading">
          <SectionTitle id="about-heading" number="01" title="About Me" />

          <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
            {/* Bio copy */}
            <div className="lg:col-span-3 space-y-5">
              {(
                [
                  <>
                    I'm a Full Stack Developer with experience building production web applications
                    using{' '}
                    <span className="font-medium" style={{ color: '#60a5fa' }}>
                      React, Node.js, and .NET Core
                    </span>
                    . I work across the full stack — from database design to responsive UI.
                  </>,
                  <>
                    I've shipped multi-role SaaS platforms in healthcare, food delivery, and parking
                    — systems where data integrity, real-time updates, and role-based access control
                    matter.
                  </>,
                  <>
                    I graduated with a B.E. in Aeronautical Engineering from Excel Engineering
                    College (CGPA 8.0) and transitioned into software through the NxtWave MERN
                    programme in 2023.
                  </>,
                ] as React.ReactNode[]
              ).map((para, i) => (
                <motion.p
                  key={i}
                  {...fadeUp(i * 0.08)}
                  className="leading-relaxed"
                  style={{ color: '#94a3b8' }}
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Quick stats */}
            <motion.div {...fadeUp(0.15)} className="lg:col-span-2">
              <GlassCard className="p-6 space-y-6" strong>
                <dl className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Years Experience', value: getDynamicExperience() },
                    { label: 'Companies', value: '2' },
                    { label: 'Projects Shipped', value: '6' },
                    { label: 'NPM Packages', value: '1' },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="text-center p-3 rounded-xl"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <dd className="text-3xl font-bold gradient-text">{value}</dd>
                      <dt className="mt-1 text-xs" style={{ color: '#64748b' }}>
                        {label}
                      </dt>
                    </div>
                  ))}
                </dl>
                <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-xs text-center" style={{ color: '#64748b' }}>
                    Based in Tamil Nadu, India
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* ── 02 Experience ── */}
        <section className="mt-24 sm:mt-32" aria-labelledby="experience-heading">
          <SectionTitle id="experience-heading" number="02" title="Experience" />

          <div className="relative max-w-2xl">
            {/* Vertical track */}
            <div
              className="absolute left-[7px] top-4 bottom-4 w-0.5 rounded-full"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(96,165,250,0.45), rgba(167,139,250,0.20), transparent)',
              }}
              aria-hidden="true"
            />

            <ol className="relative space-y-10">
              {timeline.map((entry, i) => (
                <motion.li key={entry.period} {...fadeUp(i * 0.12)} className="relative flex gap-6">
                  {/* Timeline dot */}
                  <div className="mt-1.5 flex-shrink-0 relative z-10">
                    <div
                      className="h-3.5 w-3.5 rounded-full border-2"
                      style={{
                        background: '#0b1120',
                        borderColor: entry.accent,
                        boxShadow: `0 0 12px ${entry.accent}55`,
                      }}
                      aria-hidden="true"
                    />
                  </div>

                  <GlassCard className="flex-1 overflow-hidden" glow={i === 0 ? 'blue' : 'violet'}>
                    {/* Accent top stripe */}
                    <div
                      className="h-0.5 w-full"
                      style={{ background: `linear-gradient(90deg, ${entry.accent}, transparent)` }}
                      aria-hidden="true"
                    />
                    <div className="p-5">
                      <time
                        className="font-mono text-[11px] font-bold tracking-wider"
                        style={{ color: entry.accent }}
                      >
                        {entry.period}
                      </time>
                      <div className="flex flex-wrap items-start justify-between gap-2 mt-1.5 mb-3">
                        <div>
                          <h3 className="text-base font-bold" style={{ color: '#f8fafc' }}>
                            {entry.role}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-0.5">
                            <p className="text-sm" style={{ color: '#cbd5e1' }}>
                              {entry.company}
                            </p>
                            <span
                              className="flex items-center gap-1 text-xs"
                              style={{ color: '#64748b' }}
                            >
                              <MapPin size={11} aria-hidden="true" />
                              {entry.location}
                            </span>
                          </div>
                        </div>
                        <span
                          className="shrink-0 flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                          style={{
                            color: entry.accent,
                            background: entry.accentBg,
                            border: `1px solid ${entry.accentBorder}`,
                          }}
                        >
                          <Briefcase size={9} aria-hidden="true" />
                          Full-time
                        </span>
                      </div>

                      <ul
                        className="space-y-2"
                        aria-label={`Key responsibilities at ${entry.company}`}
                      >
                        {entry.highlights.map((h) => (
                          <li key={h} className="flex gap-2.5 items-start">
                            <span
                              className="mt-2 h-1 w-1 rounded-full flex-shrink-0"
                              style={{ background: entry.accent }}
                              aria-hidden="true"
                            />
                            <span className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                              {h}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </GlassCard>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── 03 Technical Skills ── */}
        <section className="mt-24 sm:mt-32" aria-labelledby="skills-heading">
          <SectionTitle
            id="skills-heading"
            number="03"
            title="Technical Skills"
            subtitle="Technologies I work with across the full stack."
          />

          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}
            aria-label="Technical skills"
          >
            {allSkills.map((skill, i) => (
              <TechCard key={skill} name={skill} index={i} />
            ))}
          </div>
        </section>

        {/* ── Education callout ── */}
        <motion.section {...fadeUp(0.1)} className="mt-16" aria-labelledby="education-heading">
          <GlassCard className="overflow-hidden">
            <div
              className="h-0.5 w-full"
              style={{
                background:
                  'linear-gradient(90deg, rgba(96,165,250,0.5), rgba(167,139,250,0.3), transparent)',
              }}
              aria-hidden="true"
            />
            <div className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1">
                <h3
                  id="education-heading"
                  className="text-sm font-semibold mb-1"
                  style={{ color: '#f8fafc' }}
                >
                  B.E. Aeronautical Engineering
                </h3>
                <p className="text-sm" style={{ color: '#94a3b8' }}>
                  Excel Engineering College · CGPA 8.0 · Transitioned into software via NxtWave MERN
                  in 2023
                </p>
              </div>
              <div
                className="flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <CalendarDays size={12} style={{ color: '#64748b' }} aria-hidden="true" />
                <span className="text-xs" style={{ color: '#64748b' }}>
                  2023
                </span>
              </div>
            </div>
          </GlassCard>
        </motion.section>
      </div>
    </AuroraBackground>
  );
}
