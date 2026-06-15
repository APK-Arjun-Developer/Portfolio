import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ArrowRight, ExternalLink, ChevronDown, Package, Layers, Building2, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { personal } from '../../data/personal'
import AuroraBackground from '../../components/ui/AuroraBackground'
import { GithubIcon, LinkedinIcon } from '../../components/ui/BrandIcons'

const techStack = ['React', 'Node.js', '.NET Core', 'SQL'] as const

const heroStats = [
  { value: '2+', label: 'Years Experience', Icon: Layers },
  { value: '6', label: 'Projects Shipped', Icon: Package },
  { value: '2', label: 'Companies', Icon: Building2 },
  { value: '1', label: 'NPM Package', Icon: Package },
]

const easing: [number, number, number, number] = [0.22, 1, 0.36, 1]

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easing },
  },
}

export default function Home() {
  return (
    <AuroraBackground className="flex min-h-screen flex-col">
      {/* ── Hero ── */}
      <section className="flex flex-1 items-center pt-28 pb-20" aria-label="Introduction">
        <div className="container-xl w-full">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            {/* Status badge */}
            <motion.div variants={item}>
              <div
                className="mb-8 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-semibold"
                style={{
                  background: 'rgba(34,197,94,0.10)',
                  border: '1px solid rgba(34,197,94,0.25)',
                  color: '#4ade80',
                }}
                role="status"
                aria-label="Currently available for new opportunities"
              >
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span
                    className="animate-beacon absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ background: '#4ade80' }}
                  />
                  <span
                    className="relative inline-flex h-2 w-2 rounded-full"
                    style={{ background: '#22c55e' }}
                  />
                </span>
                Available for opportunities
              </div>
            </motion.div>

            {/* Greeting */}
            <motion.p
              variants={item}
              className="mb-2 font-mono text-sm"
              style={{ color: '#64748b' }}
            >
              Hi, I'm
            </motion.p>

            {/* Name */}
            <motion.h1
              variants={item}
              className="mb-4 font-heading text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
              style={{ color: '#f8fafc' }}
            >
              {personal.name}
            </motion.h1>

            {/* Role */}
            <motion.div variants={item} className="mb-6">
              <span className="text-2xl font-bold sm:text-3xl lg:text-4xl gradient-text">
                {personal.role}
              </span>
              <span
                className="text-2xl font-bold sm:text-3xl lg:text-4xl"
                style={{ color: '#334155' }}
              >
                .
              </span>
            </motion.div>

            {/* Summary */}
            <motion.p
              variants={item}
              className="mb-8 max-w-2xl text-base leading-relaxed sm:text-lg"
              style={{ color: '#94a3b8' }}
            >
              {personal.summary}
            </motion.p>

            {/* Tech stack pills */}
            <motion.div
              variants={item}
              className="mb-10 flex flex-wrap gap-2"
              aria-label="Core technologies"
            >
              {techStack.map((tech) => (
                <span key={tech} className="tech-badge">
                  {tech}
                </span>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div variants={item} className="mb-10 flex flex-wrap gap-3">
              <Link
                to="/projects"
                className="btn-primary group"
                aria-label="View my projects"
              >
                View Projects
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <a
                href={`mailto:${personal.email}`}
                className="btn-glass"
                aria-label={`Email me at ${personal.email}`}
              >
                <Mail size={15} aria-hidden="true" />
                Contact Me
              </a>
            </motion.div>

            {/* Social links */}
            <motion.div
              variants={item}
              className="flex flex-wrap items-center gap-5"
              aria-label="Social links"
            >
              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm transition-colors"
                style={{ color: '#64748b' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#f8fafc' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#64748b' }}
                aria-label="Visit my GitHub profile (opens in new tab)"
              >
                <GithubIcon size={16} />
                GitHub
                <ExternalLink size={11} className="opacity-40" aria-hidden="true" />
              </a>
              <span className="h-1 w-1 rounded-full" style={{ background: '#1e293b' }} aria-hidden="true" />
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm transition-colors"
                style={{ color: '#64748b' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#f8fafc' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#64748b' }}
                aria-label="Visit my LinkedIn profile (opens in new tab)"
              >
                <LinkedinIcon size={16} />
                LinkedIn
                <ExternalLink size={11} className="opacity-40" aria-hidden="true" />
              </a>
              <span className="h-1 w-1 rounded-full" style={{ background: '#1e293b' }} aria-hidden="true" />
              <a
                href={`mailto:${personal.email}`}
                className="text-sm transition-colors"
                style={{ color: '#64748b' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#f8fafc' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#64748b' }}
                aria-label={`Email me at ${personal.email}`}
              >
                {personal.email}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        aria-label="Career statistics"
      >
        <div
          className="border-t"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <div className="container-xl py-8">
            <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {heroStats.map(({ value, label, Icon }) => (
                <div
                  key={label}
                  className="group flex flex-col items-center gap-1 text-center py-4 px-3 rounded-2xl transition-all duration-200 cursor-default"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(255,255,255,0.05)'
                    el.style.borderColor = 'rgba(255,255,255,0.10)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(255,255,255,0.02)'
                    el.style.borderColor = 'rgba(255,255,255,0.05)'
                  }}
                >
                  <Icon
                    size={14}
                    className="mb-1 transition-colors group-hover:text-blue-400"
                    style={{ color: '#475569' }}
                    aria-hidden="true"
                  />
                  <dt className="sr-only">{label}</dt>
                  <dd
                    className="text-2xl font-bold gradient-text"
                    aria-label={`${value} ${label}`}
                  >
                    {value}
                  </dd>
                  <dd className="text-xs" style={{ color: '#64748b' }} aria-hidden="true">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </motion.section>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ color: '#334155' }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </AuroraBackground>
  )
}
