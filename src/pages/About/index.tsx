import { motion } from 'framer-motion'
import { skills } from '../../data/personal'
import AuroraBackground from '../../components/ui/AuroraBackground'
import SectionTitle from '../../components/ui/SectionTitle'
import GlassCard from '../../components/ui/GlassCard'
import { MapPin, CalendarDays } from 'lucide-react'

/* ── Career start date (from original About page) ── */
const careerStart = new Date('2023-08-01')
function getDynamicExperience() {
  const now = new Date()
  const months =
    (now.getFullYear() - careerStart.getFullYear()) * 12 +
    (now.getMonth() - careerStart.getMonth())
  const years = months / 12
  return years % 1 === 0 ? `${years}` : years.toFixed(1)
}

/* ── Experience timeline (preserved from original About page) ── */
const timeline = [
  {
    period: 'Feb 2025 – Present',
    role: 'Full Stack Developer',
    company: 'Techbumbles Software Solutions Pvt Ltd',
    location: 'Erode, TN',
    accent: '#06b6d4',
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
    accent: '#8b5cf6',
    highlights: [
      'Developed high-performance web apps using React, Node.js, and .NET Core',
      'Designed and optimised databases with MySQL, SQLite, and SQL Server',
      'Conducted code reviews, debugging, and maintained architecture and user-guide documentation',
    ],
  },
]

/* ── Skills (preserved from original About page) ── */
const skillSections = [
  {
    label: 'Backend',
    items: skills.backend,
    accent: '#06b6d4',
    accentBg: 'rgba(6,182,212,0.07)',
    accentBorder: 'rgba(6,182,212,0.2)',
  },
  {
    label: 'Frontend',
    items: skills.frontend,
    accent: '#8b5cf6',
    accentBg: 'rgba(139,92,246,0.07)',
    accentBorder: 'rgba(139,92,246,0.2)',
  },
  {
    label: 'Databases',
    items: skills.databases,
    accent: '#f59e0b',
    accentBg: 'rgba(245,158,11,0.07)',
    accentBorder: 'rgba(245,158,11,0.2)',
  },
  {
    label: 'Tools',
    items: skills.tools,
    accent: '#f43f5e',
    accentBg: 'rgba(244,63,94,0.07)',
    accentBorder: 'rgba(244,63,94,0.2)',
  },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay },
})

export default function About() {
  return (
    <AuroraBackground className="min-h-screen">
      <div className="container-xl section-py">

        {/* ── 01 About Me ── */}
        <section aria-labelledby="about-heading">
          <SectionTitle id="about-heading" number="01" title="About Me" />

          <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
            {/* Bio copy */}
            <div className="lg:col-span-3 space-y-4">
              {([
                <>
                  I'm a Full Stack Developer with experience building production web applications
                  using{' '}
                  <span className="text-cyan-400 font-medium">React, Node.js, and .NET Core</span>.
                  I work across the full stack — from database design to responsive UI.
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
              ] as React.ReactNode[]).map((para, i) => (
                <motion.p
                  key={i}
                  {...fadeUp(i * 0.08)}
                  className="text-slate-400 leading-relaxed"
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Quick stats */}
            <motion.div {...fadeUp(0.15)} className="lg:col-span-2">
              <GlassCard className="p-6 space-y-6">
                <dl className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Years Experience', value: getDynamicExperience() },
                    { label: 'Companies', value: '2' },
                    { label: 'Projects Shipped', value: '6' },
                    { label: 'NPM Packages', value: '1' },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <dd className="text-3xl font-bold gradient-text">{value}</dd>
                      <dt className="mt-0.5 text-xs text-slate-500">{label}</dt>
                    </div>
                  ))}
                </dl>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="pt-4">
                  <p className="text-xs text-slate-500 text-center">Based in Tamil Nadu, India</p>
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
                  'linear-gradient(to bottom, rgba(6,182,212,0.4), rgba(139,92,246,0.15))',
              }}
              aria-hidden="true"
            />

            <ol className="relative space-y-10">
              {timeline.map((entry, i) => (
                <motion.li
                  key={entry.period}
                  {...fadeUp(i * 0.12)}
                  className="relative flex gap-6"
                >
                  {/* Timeline dot */}
                  <div className="mt-1 flex-shrink-0 relative z-10">
                    <div
                      className="h-4 w-4 rounded-full border-2"
                      style={{
                        background: '#08080e',
                        borderColor: entry.accent,
                        boxShadow: `0 0 10px ${entry.accent}40`,
                      }}
                      aria-hidden="true"
                    />
                  </div>

                  <GlassCard
                    className="flex-1 p-5"
                    glow={i === 0 ? 'cyan' : 'violet'}
                  >
                    <time
                      className="font-mono text-xs font-medium"
                      style={{ color: entry.accent }}
                    >
                      {entry.period}
                    </time>
                    <h3 className="text-base font-bold text-slate-100 mt-0.5">{entry.role}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 mb-4">
                      <p className="text-sm text-slate-400">{entry.company}</p>
                      <span className="flex items-center gap-1 text-xs text-slate-600">
                        <MapPin size={11} aria-hidden="true" />
                        {entry.location}
                      </span>
                    </div>
                    <ul
                      className="space-y-2"
                      aria-label={`Key responsibilities at ${entry.company}`}
                    >
                      {entry.highlights.map((h) => (
                        <li key={h} className="flex gap-2 items-start">
                          <span
                            className="mt-2 h-1 w-1 rounded-full flex-shrink-0"
                            style={{ background: entry.accent }}
                            aria-hidden="true"
                          />
                          <span className="text-sm text-slate-400 leading-relaxed">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── 03 Technical Skills ── */}
        <section className="mt-24 sm:mt-32" aria-labelledby="skills-heading">
          <SectionTitle id="skills-heading" number="03" title="Technical Skills" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {skillSections.map((section, i) => (
              <motion.div key={section.label} {...fadeUp(i * 0.08)}>
                <GlassCard
                  className="h-full p-5 transition-all duration-300 cursor-default"
                  hover={false}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = section.accentBorder
                    el.style.boxShadow = `0 0 24px ${section.accent}18`
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = ''
                    el.style.boxShadow = ''
                  }}
                >
                  {/* Category header */}
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ background: section.accent }}
                      aria-hidden="true"
                    />
                    <span
                      className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em]"
                      style={{ color: section.accent }}
                    >
                      {section.label}
                    </span>
                  </div>

                  {/* Skills */}
                  <ul
                    className="flex flex-wrap gap-1.5"
                    aria-label={`${section.label} skills`}
                  >
                    {section.items.map((skill) => (
                      <li
                        key={skill}
                        className="rounded-md px-2.5 py-1 text-xs font-medium text-slate-300"
                        style={{
                          background: section.accentBg,
                          border: `1px solid ${section.accentBorder}`,
                        }}
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Education callout ── */}
        <motion.section {...fadeUp(0.1)} className="mt-16" aria-labelledby="education-heading">
          <GlassCard className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <h3
                id="education-heading"
                className="text-sm font-semibold text-slate-200 mb-1"
              >
                B.E. Aeronautical Engineering
              </h3>
              <p className="text-sm text-slate-400">
                Excel Engineering College · CGPA 8.0 · Transitioned into software via NxtWave
                MERN in 2023
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <CalendarDays size={13} className="text-slate-600" aria-hidden="true" />
              <span className="text-xs text-slate-600">2023</span>
            </div>
          </GlassCard>
        </motion.section>
      </div>
    </AuroraBackground>
  )
}
