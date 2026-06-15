import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ExternalLink, ArrowRight, Building2, Code2, Package, ChevronRight,
} from 'lucide-react'
import { GithubIcon } from '../../components/ui/BrandIcons'
import { projects, type Project } from '../../data/personal'
import AuroraBackground from '../../components/ui/AuroraBackground'
import SectionTitle from '../../components/ui/SectionTitle'
import GlassCard from '../../components/ui/GlassCard'

type FilterTab = 'all' | 'company' | 'personal'

function LayersIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  )
}

const tabs: { id: FilterTab; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All Projects', icon: <LayersIcon size={14} /> },
  { id: 'company', label: 'Company Work', icon: <Building2 size={14} /> },
  { id: 'personal', label: 'Personal', icon: <Code2 size={14} /> },
]

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isCompany = project.category === 'company'
  const accent = isCompany ? '#a78bfa' : '#60a5fa'
  const accentBase = isCompany ? '#8b5cf6' : '#3b82f6'
  const accentBg = isCompany ? 'rgba(139,92,246,0.10)' : 'rgba(59,130,246,0.10)'
  const accentBorder = isCompany ? 'rgba(139,92,246,0.25)' : 'rgba(59,130,246,0.25)'
  const gradientFrom = isCompany ? '#8b5cf6' : '#3b82f6'
  const gradientTo = isCompany ? '#4f46e5' : '#06b6d4'

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.07 }}
      whileHover={{ y: -4 }}
      className="group"
      aria-label={`Project: ${project.title}`}
    >
      <GlassCard
        className="h-full flex flex-col overflow-hidden"
        hover={false}
        style={{ border: `1px solid ${accentBorder}` }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.boxShadow = `0 16px 48px rgba(0,0,0,0.45), 0 0 0 1px ${accentBase}45`
          el.style.borderColor = `${accentBase}50`
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.boxShadow = ''
          el.style.borderColor = accentBorder
        }}
      >
        {/* Gradient header stripe */}
        <div
          className="h-1 w-full flex-shrink-0"
          style={{ background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})` }}
          aria-hidden="true"
        />

        <div className="flex flex-col flex-1 p-6">
          {/* Card header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="font-mono text-[10px] font-bold"
                style={{ color: accent, opacity: 0.7 }}
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: accent, background: accentBg, border: `1px solid ${accentBorder}` }}
              >
                {isCompany ? 'Company' : 'Personal'}
              </span>
              {project.role && (
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    color: '#64748b',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {project.role}
                </span>
              )}
            </div>
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
                NPM
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className="text-lg font-bold mb-1 leading-snug"
            style={{ color: '#f8fafc' }}
          >
            {project.title}
          </h3>

          {/* Company attribution */}
          {project.companyName && (
            <p
              className="text-xs mb-2 font-mono"
              style={{ color: '#64748b' }}
            >
              @ {project.companyName}
            </p>
          )}

          {/* Tagline */}
          <p className="text-sm mb-3 font-semibold" style={{ color: accent }}>
            {project.tagline}
          </p>

          {/* Description */}
          <p
            className="text-sm leading-relaxed mb-5 flex-1"
            style={{ color: '#94a3b8' }}
          >
            {project.description}
          </p>

          {/* Key features */}
          <div className="mb-5">
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-2.5"
              style={{ color: '#475569' }}
            >
              Key Features
            </p>
            <ul className="space-y-1.5" aria-label="Key features">
              {project.features.slice(0, 4).map((f) => (
                <li key={f} className="flex gap-2 items-start">
                  <ChevronRight
                    size={12}
                    className="mt-0.5 flex-shrink-0"
                    style={{ color: accent }}
                    aria-hidden="true"
                  />
                  <span className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5 mb-5" aria-label="Technologies used">
            {project.techStack.map((tech) => (
              <span key={tech} className="tech-badge text-[10px]">
                {tech}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div
            className="flex flex-wrap gap-2 pt-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            <Link
              to={`/projects/${project.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
              aria-label={`View details for ${project.title}`}
            >
              View Details
              <ArrowRight size={12} aria-hidden="true" />
            </Link>
            {project.github && project.category !== 'company' && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  color: '#94a3b8',
                  border: '1px solid rgba(255,255,255,0.10)',
                  background: 'rgba(255,255,255,0.04)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = '#f8fafc'
                  el.style.background = 'rgba(255,255,255,0.08)'
                  el.style.borderColor = 'rgba(255,255,255,0.18)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = '#94a3b8'
                  el.style.background = 'rgba(255,255,255,0.04)'
                  el.style.borderColor = 'rgba(255,255,255,0.10)'
                }}
                aria-label={`View source code for ${project.title} on GitHub (opens in new tab)`}
              >
                <GithubIcon size={12} />
                Code
              </a>
            )}
            {project.npm && (
              <a
                href={project.npm}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  color: '#fb923c',
                  border: '1px solid rgba(251,146,60,0.25)',
                  background: 'rgba(251,146,60,0.08)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'rgba(251,146,60,0.14)'
                  el.style.borderColor = 'rgba(251,146,60,0.40)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'rgba(251,146,60,0.08)'
                  el.style.borderColor = 'rgba(251,146,60,0.25)'
                }}
                aria-label={`View ${project.title} on NPM (opens in new tab)`}
              >
                <Package size={12} aria-hidden="true" />
                NPM
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  color: '#94a3b8',
                  border: '1px solid rgba(255,255,255,0.10)',
                  background: 'rgba(255,255,255,0.04)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = '#f8fafc'
                  el.style.background = 'rgba(255,255,255,0.08)'
                  el.style.borderColor = 'rgba(255,255,255,0.18)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = '#94a3b8'
                  el.style.background = 'rgba(255,255,255,0.04)'
                  el.style.borderColor = 'rgba(255,255,255,0.10)'
                }}
                aria-label={`View live demo for ${project.title} (opens in new tab)`}
              >
                <ExternalLink size={12} aria-hidden="true" />
                Demo
              </a>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.article>
  )
}

export default function Projects() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  const filtered = projects.filter((p) => {
    if (activeTab === 'all') return true
    if (activeTab === 'company') return p.category === 'company'
    return p.category !== 'company'
  })

  return (
    <AuroraBackground className="min-h-screen">
      <div className="container-xl section-py">
        <SectionTitle
          number="02"
          title="Projects"
          subtitle="Company work and personal projects — full stack, frontend, and open-source."
        />

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter projects by category"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const count =
              tab.id === 'all'
                ? projects.length
                : tab.id === 'company'
                  ? projects.filter((p) => p.category === 'company').length
                  : projects.filter((p) => p.category !== 'company').length
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls="projects-grid"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={isActive ? {
                  background: 'rgba(59,130,246,0.14)',
                  border: '1px solid rgba(59,130,246,0.35)',
                  color: '#60a5fa',
                  boxShadow: '0 2px 12px rgba(59,130,246,0.20)',
                } : {
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  color: '#64748b',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = '#94a3b8'
                    el.style.background = 'rgba(255,255,255,0.07)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = '#64748b'
                    el.style.background = 'rgba(255,255,255,0.04)'
                  }
                }}
              >
                {tab.icon}
                {tab.label}
                <span
                  className="ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                  style={isActive ? {
                    background: 'rgba(59,130,246,0.20)',
                    color: '#60a5fa',
                  } : {
                    background: 'rgba(255,255,255,0.06)',
                    color: '#64748b',
                  }}
                  aria-label={`${count} projects`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </motion.div>

        {/* Projects grid */}
        <div
          id="projects-grid"
          role="tabpanel"
          aria-label={`${activeTab === 'all' ? 'All' : activeTab === 'company' ? 'Company' : 'Personal'} projects`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid gap-6 sm:grid-cols-2"
            >
              {filtered.map((project, idx) => (
                <ProjectCard key={project.id} project={project} index={idx} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </AuroraBackground>
  )
}
