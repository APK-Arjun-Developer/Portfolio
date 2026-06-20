import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, ExternalLink, Package, CheckCircle2,
  AlertCircle, Lightbulb, Code2,
} from 'lucide-react'
import { GithubIcon } from '../../components/ui/BrandIcons'
import { projects } from '../../data/personal'
import { analytics } from '../../lib/analytics'
import AuroraBackground from '../../components/ui/AuroraBackground'
import GlassCard from '../../components/ui/GlassCard'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay },
})

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-7">
      <div className="flex items-center gap-2.5 mb-2">
        <span
          className="font-mono text-[10px] font-bold tracking-widest"
          style={{ color: '#60a5fa', opacity: 0.8 }}
          aria-hidden="true"
        >
          {number}.
        </span>
        <div
          className="h-px w-12"
          style={{ background: 'linear-gradient(90deg, rgba(96,165,250,0.5), transparent)' }}
          aria-hidden="true"
        />
      </div>
      <h2 className="text-xl font-bold" style={{ color: '#f8fafc' }}>{title}</h2>
    </div>
  )
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const project = projects.find((p) => p.id === id)

  if (!project) return <Navigate to="/projects" replace />

  const isCompany = project.category === 'company'
  const accent = isCompany ? '#a78bfa' : '#60a5fa'
  const accentBase = isCompany ? '#8b5cf6' : '#3b82f6'
  const accentBg = isCompany ? 'rgba(139,92,246,0.10)' : 'rgba(59,130,246,0.10)'
  const accentBorder = isCompany ? 'rgba(139,92,246,0.28)' : 'rgba(59,130,246,0.28)'
  const gradientFrom = isCompany ? '#8b5cf6' : '#3b82f6'
  const gradientTo = isCompany ? '#4f46e5' : '#06b6d4'

  return (
    <AuroraBackground className="min-h-screen">
      <div className="container-xl py-28 sm:py-32" style={{ maxWidth: '60rem' }}>

        {/* ── Back ── */}
        <motion.div {...fadeUp(0)} className="mb-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors group"
            style={{ color: '#64748b' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#f8fafc' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#64748b' }}
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
          <motion.div {...fadeUp(0.05)} className="flex flex-wrap items-center gap-2 mb-4">
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
              <span className="text-xs font-mono" style={{ color: '#64748b' }}>
                @ {project.companyName}
              </span>
            )}
            {project.npm && (
              <span
                className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{
                  color: '#fb923c',
                  background: 'rgba(251,146,60,0.10)',
                  border: '1px solid rgba(251,146,60,0.25)',
                }}
              >
                <Package size={9} aria-hidden="true" />
                NPM Package
              </span>
            )}
          </motion.div>

          <motion.div {...fadeUp(0.06)}>
            <div
              className="w-12 h-1 rounded-full mb-4"
              style={{ background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})` }}
              aria-hidden="true"
            />
          </motion.div>

          <motion.h1
            {...fadeUp(0.08)}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-3"
            style={{ color: '#f8fafc' }}
          >
            {project.title}
          </motion.h1>

          <motion.p
            {...fadeUp(0.11)}
            className="text-lg mb-6 max-w-2xl font-medium"
            style={{ color: accent }}
          >
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
                onClick={() => analytics.projectGithubClick(project.title)}
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
                  color: '#fb923c',
                  border: '1px solid rgba(251,146,60,0.30)',
                  background: 'rgba(251,146,60,0.08)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'rgba(251,146,60,0.14)'
                  el.style.borderColor = 'rgba(251,146,60,0.45)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'rgba(251,146,60,0.08)'
                  el.style.borderColor = 'rgba(251,146,60,0.30)'
                }}
                aria-label={`View ${project.title} on NPM (opens in new tab)`}
                onClick={() => analytics.projectNpmClick(project.title)}
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
                onClick={() => analytics.projectDemoClick(project.title)}
              >
                <ExternalLink size={15} aria-hidden="true" />
                Live Demo
              </a>
            )}
          </motion.div>
        </header>

        {/* Divider */}
        <motion.div {...fadeUp(0.2)} className="my-10 divider-glow" role="separator" />

        {/* ── 01 Problem & Overview ── */}
        <motion.section {...fadeUp(0.22)} className="mb-14" aria-labelledby="overview-heading">
          <SectionHeading number="01" title="Problem & Overview" />
          <GlassCard className="p-6">
            <p
              id="overview-heading"
              className="leading-relaxed"
              style={{ color: '#94a3b8' }}
            >
              {project.overview}
            </p>
          </GlassCard>
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
                className="flex gap-3 items-start p-3.5 rounded-xl"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <CheckCircle2
                  size={16}
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: accent }}
                  aria-hidden="true"
                />
                <span className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>{f}</span>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        {/* ── 03 Challenges & Solutions ── */}
        <motion.section {...fadeUp(0.28)} className="mb-14" aria-labelledby="challenges-heading">
          <SectionHeading number="03" title="Challenges & Solutions" />
          <ol
            id="challenges-heading"
            className="space-y-5"
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
                    const el = e.currentTarget as HTMLElement
                    el.style.boxShadow = `0 8px 32px rgba(0,0,0,0.40), 0 0 0 1px ${accentBase}30`
                    el.style.borderColor = `${accentBase}35`
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.boxShadow = ''
                    el.style.borderColor = ''
                  }}
                >
                  <div className="grid sm:grid-cols-2">
                    {/* Problem */}
                    <div
                      className="p-5"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div className="sm:border-b-0 sm:border-r"
                        style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="flex h-6 w-6 items-center justify-center rounded-md"
                          style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.20)' }}
                        >
                          <AlertCircle size={12} style={{ color: '#f87171' }} aria-hidden="true" />
                        </div>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: '#f87171' }}>
                          Problem
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>{c.problem}</p>
                    </div>
                    {/* Solution */}
                    <div className="p-5" style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="flex h-6 w-6 items-center justify-center rounded-md"
                          style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
                        >
                          <Lightbulb size={12} style={{ color: accent }} aria-hidden="true" />
                        </div>
                        <span
                          className="font-mono text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: accent }}
                        >
                          Solution
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>{c.solution}</p>
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
                <motion.div
                  whileHover={{ y: -2, scale: 1.03 }}
                  className="px-4 py-3 rounded-xl cursor-default transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${accentBorder}`,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = accentBg
                    el.style.boxShadow = `0 4px 16px ${accentBase}20`
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(255,255,255,0.04)'
                    el.style.boxShadow = ''
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Code2 size={12} style={{ color: accent }} aria-hidden="true" />
                    <span className="text-sm font-medium" style={{ color: '#cbd5e1' }}>
                      {tech}
                    </span>
                  </div>
                </motion.div>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* ── Bottom CTA ── */}
        <motion.div {...fadeUp(0.32)}>
          <div className="divider-soft mb-8" role="separator" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors group"
              style={{ color: '#64748b' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#f8fafc' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#64748b' }}
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
                  onClick={() => analytics.projectGithubClick(project.title)}
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
                    color: '#fb923c',
                    border: '1px solid rgba(251,146,60,0.25)',
                    background: 'rgba(251,146,60,0.07)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(251,146,60,0.14)'
                    el.style.borderColor = 'rgba(251,146,60,0.40)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(251,146,60,0.07)'
                    el.style.borderColor = 'rgba(251,146,60,0.25)'
                  }}
                  aria-label={`View ${project.title} on NPM (opens in new tab)`}
                  onClick={() => analytics.projectNpmClick(project.title)}
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
                  onClick={() => analytics.projectDemoClick(project.title)}
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
