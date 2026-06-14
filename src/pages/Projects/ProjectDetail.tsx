import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, ExternalLink, Package, CheckCircle2,
  AlertCircle, Lightbulb,
} from 'lucide-react'
import { GithubIcon } from '../../components/ui/BrandIcons'
import { projects } from '../../data/personal'
import AuroraBackground from '../../components/ui/AuroraBackground'
import GlassCard from '../../components/ui/GlassCard'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay },
})

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-mono text-[10px] font-semibold text-blue-500 opacity-80" aria-hidden="true">
          {number}.
        </span>
        <div className="h-px w-8 bg-blue-200" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-bold text-text-heading">{title}</h2>
    </div>
  )
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const project = projects.find((p) => p.id === id)

  if (!project) return <Navigate to="/projects" replace />

  const isCompany = project.category === 'company'
  const accent = isCompany ? '#7C3AED' : '#2563EB'
  const accentBg = isCompany ? 'rgba(124,58,237,0.07)' : 'rgba(37,99,235,0.07)'
  const accentBorder = isCompany ? 'rgba(124,58,237,0.22)' : 'rgba(37,99,235,0.2)'

  return (
    <AuroraBackground className="min-h-screen">
      <div className="container-xl py-28 sm:py-32" style={{ maxWidth: '60rem' }}>

        {/* ── Back ── */}
        <motion.div {...fadeUp(0)} className="mb-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-heading transition-colors group"
            aria-label="Back to all projects"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            All Projects
          </Link>
        </motion.div>

        {/* ── Header ── */}
        <header>
          <motion.div {...fadeUp(0.05)} className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ color: accent, background: accentBg, border: `1px solid ${accentBorder}` }}
            >
              {isCompany ? 'Company Project' : 'Personal Project'}
            </span>
            {project.role && (
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{ color: accent, background: accentBg, border: `1px solid ${accentBorder}` }}
              >
                {project.role}
              </span>
            )}
            {project.companyName && (
              <span className="text-xs text-text-secondary font-mono">@ {project.companyName}</span>
            )}
            {project.npm && (
              <span
                className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{ color: '#d97706', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}
              >
                <Package size={9} aria-hidden="true" />
                NPM Package
              </span>
            )}
          </motion.div>

          <motion.h1
            {...fadeUp(0.08)}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-heading tracking-tight leading-tight mb-3"
          >
            {project.title}
          </motion.h1>

          <motion.p {...fadeUp(0.11)} className="text-lg text-text-body mb-6 max-w-2xl">
            {project.tagline}
          </motion.p>

          {/* Tech stack */}
          <motion.div
            {...fadeUp(0.14)}
            className="flex flex-wrap gap-2 mb-6"
            aria-label="Technologies used"
          >
            {project.techStack.map((tech) => (
              <span key={tech} className="tech-badge">
                {tech}
              </span>
            ))}
          </motion.div>

          {/* Action buttons */}
          <motion.div {...fadeUp(0.17)} className="flex flex-wrap gap-3">
            {project.github && project.category !== 'company' && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass text-sm"
                aria-label={`View source code for ${project.title} on GitHub (opens in new tab)`}
              >
                <GithubIcon size={15} />
                View Code
              </a>
            )}
            {project.npm && (
              <a
                href={project.npm}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  color: '#d97706',
                  border: '1px solid rgba(245,158,11,0.3)',
                  background: 'rgba(245,158,11,0.06)',
                }}
                aria-label={`View ${project.title} on NPM (opens in new tab)`}
              >
                <Package size={15} aria-hidden="true" />
                NPM Package
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm"
                aria-label={`View live demo for ${project.title} (opens in new tab)`}
              >
                <ExternalLink size={15} aria-hidden="true" />
                Live Demo
              </a>
            )}
          </motion.div>
        </header>

        {/* Divider */}
        <motion.div {...fadeUp(0.2)} className="my-10 h-px bg-gray-200" role="separator" />

        {/* ── 01 Problem & Overview ── */}
        <motion.section {...fadeUp(0.22)} className="mb-14" aria-labelledby="overview-heading">
          <SectionHeading number="01" title="Problem & Overview" />
          <p id="overview-heading" className="text-text-body leading-relaxed max-w-3xl">
            {project.overview}
          </p>
        </motion.section>

        {/* ── 02 Key Features ── */}
        <motion.section {...fadeUp(0.25)} className="mb-14" aria-labelledby="features-heading">
          <SectionHeading number="02" title="Key Features" />
          <ul
            id="features-heading"
            className="grid gap-3 sm:grid-cols-2"
            aria-label="Key features"
          >
            {project.features.map((f, i) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="flex gap-3 items-start"
              >
                <CheckCircle2
                  size={16}
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: accent }}
                  aria-hidden="true"
                />
                <span className="text-sm text-text-body leading-relaxed">{f}</span>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        {/* ── 03 Challenges & Solutions ── */}
        <motion.section {...fadeUp(0.28)} className="mb-14" aria-labelledby="challenges-heading">
          <SectionHeading number="03" title="Challenges & Solutions" />
          <ol
            id="challenges-heading"
            className="space-y-4"
            aria-label="Technical challenges and solutions"
          >
            {project.challenges.map((c, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <GlassCard
                  className="overflow-hidden transition-shadow duration-300"
                  hover={false}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${accent}10`
                    ;(e.currentTarget as HTMLElement).style.borderColor = `${accent}30`
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.boxShadow = ''
                    ;(e.currentTarget as HTMLElement).style.borderColor = ''
                  }}
                >
                  <div className="grid sm:grid-cols-2">
                    {/* Problem */}
                    <div className="p-5 border-b sm:border-b-0 sm:border-r border-gray-100">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle size={13} className="text-rose-500" aria-hidden="true" />
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-rose-500">
                          Problem
                        </span>
                      </div>
                      <p className="text-sm text-text-body leading-relaxed">{c.problem}</p>
                    </div>
                    {/* Solution */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb size={13} aria-hidden="true" style={{ color: accent }} />
                        <span
                          className="font-mono text-[10px] font-semibold uppercase tracking-wider"
                          style={{ color: accent }}
                        >
                          Solution
                        </span>
                      </div>
                      <p className="text-sm text-text-body leading-relaxed">{c.solution}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.li>
            ))}
          </ol>
        </motion.section>

        {/* ── 04 Tech Stack ── */}
        <motion.section {...fadeUp(0.3)} className="mb-14" aria-labelledby="techstack-heading">
          <SectionHeading number="04" title="Tech Stack" />
          <ul
            id="techstack-heading"
            className="flex flex-wrap gap-3"
            aria-label="Complete list of technologies used"
          >
            {project.techStack.map((tech) => (
              <li key={tech}>
                <GlassCard
                  className="px-4 py-3 cursor-default group"
                  glow={isCompany ? 'violet' : 'blue'}
                  hover={false}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.borderColor = accentBorder
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.borderColor = ''
                  }}
                >
                  <span className="text-sm font-medium text-text-body group-hover:text-text-heading transition-colors">
                    {tech}
                  </span>
                </GlassCard>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* ── Bottom CTA ── */}
        <motion.div {...fadeUp(0.32)}>
          <div className="h-px bg-gray-200 mb-8" role="separator" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-heading transition-colors group"
              aria-label="Back to all projects"
            >
              <ArrowLeft
                size={15}
                className="transition-transform group-hover:-translate-x-0.5"
                aria-hidden="true"
              />
              Back to Projects
            </Link>
            <div className="flex flex-wrap gap-3">
              {project.github && project.category !== 'company' && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass text-sm"
                  aria-label={`View source code for ${project.title} on GitHub (opens in new tab)`}
                >
                  <GithubIcon size={15} />
                  View Code
                </a>
              )}
              {project.npm && (
                <a
                  href={project.npm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    color: '#d97706',
                    border: '1px solid rgba(245,158,11,0.25)',
                    background: 'rgba(245,158,11,0.05)',
                  }}
                  aria-label={`View ${project.title} on NPM (opens in new tab)`}
                >
                  <Package size={15} aria-hidden="true" />
                  NPM
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm"
                  aria-label={`View live demo for ${project.title} (opens in new tab)`}
                >
                  <ExternalLink size={14} aria-hidden="true" />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AuroraBackground>
  )
}
