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
  const accent = isCompany ? '#7C3AED' : '#2563EB'
  const accentBg = isCompany ? 'rgba(124,58,237,0.06)' : 'rgba(37,99,235,0.06)'
  const accentBorder = isCompany ? 'rgba(124,58,237,0.18)' : 'rgba(37,99,235,0.15)'
  const gradientFrom = isCompany ? '#7C3AED' : '#2563EB'
  const gradientTo = isCompany ? '#4F46E5' : '#0284C7'

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
          el.style.boxShadow = `0 12px 40px rgba(0,0,0,0.10), 0 0 0 1px ${accent}30`
          el.style.borderColor = `${accent}40`
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.boxShadow = ''
          el.style.borderColor = accentBorder
        }}
      >
        {/* Gradient thumbnail header */}
        <div
          className="h-2 w-full"
          style={{ background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})` }}
          aria-hidden="true"
        />

        <div className="flex flex-col flex-1 p-6">
          {/* Card header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="font-mono text-[10px] font-semibold"
                style={{ color: accent }}
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
                <span className="rounded-full px-2 py-0.5 text-[10px] text-text-secondary bg-gray-100 border border-gray-200">
                  {project.role}
                </span>
              )}
            </div>
            {project.npm && (
              <span
                className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{ color: '#d97706', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}
              >
                <Package size={9} aria-hidden="true" />
                NPM
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-text-heading mb-1 leading-snug">{project.title}</h3>

          {/* Company attribution */}
          {project.companyName && (
            <p className="text-xs text-text-secondary mb-2 font-mono">@ {project.companyName}</p>
          )}

          {/* Tagline */}
          <p className="text-sm mb-3 font-medium" style={{ color: accent }}>
            {project.tagline}
          </p>

          {/* Description */}
          <p className="text-sm text-text-body leading-relaxed mb-5 flex-1">
            {project.description}
          </p>

          {/* Key features */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
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
                  <span className="text-xs text-text-body leading-relaxed">{f}</span>
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
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
            <Link
              to={`/projects/${project.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all duration-200 hover:opacity-90"
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
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-text-secondary hover:text-text-heading transition-colors border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
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
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                style={{
                  color: '#d97706',
                  border: '1px solid rgba(245,158,11,0.25)',
                  background: 'rgba(245,158,11,0.06)',
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
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-text-secondary hover:text-text-heading transition-colors border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
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
                  background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.08))',
                  border: '1px solid rgba(37,99,235,0.25)',
                  color: '#2563EB',
                } : {
                  background: 'white',
                  border: '1px solid #E5E7EB',
                  color: '#6B7280',
                }}
              >
                {tab.icon}
                {tab.label}
                <span
                  className="ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                  style={isActive ? {
                    background: 'rgba(37,99,235,0.12)',
                    color: '#2563EB',
                  } : {
                    background: '#F3F4F6',
                    color: '#6B7280',
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

        {/* Open source spotlight */}
        {(activeTab === 'all' || activeTab === 'personal') && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16"
            aria-labelledby="opensource-heading"
          >
            <div
              className="rounded-2xl p-6 sm:p-8"
              style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.05) 0%, rgba(37,99,235,0.04) 100%)',
                border: '1px solid rgba(245,158,11,0.2)',
              }}
            >
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Package size={16} className="text-amber-500" aria-hidden="true" />
                    <span
                      id="opensource-heading"
                      className="text-xs font-semibold uppercase tracking-wider text-amber-600"
                    >
                      Open Source · NPM Package
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-text-heading mb-1">
                    mui-schema-form-builder
                  </h3>
                  <p className="text-sm text-text-body max-w-lg">
                    Published NPM package that converts JSON schema definitions into fully validated, accessible
                    Material UI forms with zero boilerplate. TypeScript-first. &lt;12 KB gzipped.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <a
                    href="https://www.npmjs.com/package/mui-schema-form-builder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors hover:opacity-90"
                    style={{
                      color: '#d97706',
                      border: '1px solid rgba(245,158,11,0.3)',
                      background: 'rgba(245,158,11,0.08)',
                    }}
                    aria-label="View mui-schema-form-builder on NPM (opens in new tab)"
                  >
                    <Package size={12} aria-hidden="true" />
                    View on NPM
                  </a>
                  <a
                    href="https://github.com/APK-Arjun-Developer/mui-schema-form-builder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-text-secondary hover:text-text-heading transition-colors border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
                    aria-label="View mui-schema-form-builder source code on GitHub (opens in new tab)"
                  >
                    <GithubIcon size={12} />
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </AuroraBackground>
  )
}
