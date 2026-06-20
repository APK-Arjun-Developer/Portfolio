import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Download } from 'lucide-react'
import { personal } from '../../data/personal'
import { cn } from '../../lib/utils'
import { analytics } from '../../lib/analytics'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled ? 'py-3' : 'py-5',
        )}
        style={scrolled ? {
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          background: 'rgba(11,17,32,0.92)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        } : { }}
      >
        <nav
          className="container-xl flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-2.5 rounded-lg"
            aria-label="Home"
          >
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  boxShadow: '0 2px 8px rgba(59,130,246,0.40)',
                }}
                aria-hidden="true"
              >
                AP
              </div>
              <span
                className="text-sm font-semibold transition-colors"
                style={{ color: '#f8fafc' }}
              >
                {personal.name}
              </span>
            </motion.div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex" role="list">
            {navLinks.map((link) => {
              const active = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  role="listitem"
                  className={cn(
                    'relative px-4 py-2 text-sm rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                    active
                      ? 'font-semibold'
                      : 'font-medium',
                  )}
                  style={{
                    color: active ? '#60a5fa' : '#94a3b8',
                  }}
                  aria-current={active ? 'page' : undefined}
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = '#f8fafc'
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = '#94a3b8'
                  }}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: 'rgba(59,130,246,0.12)',
                        border: '1px solid rgba(59,130,246,0.28)',
                      }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.55 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center">
            <a
              href={personal.resumeUrl}
              download="arjun-p-resume.pdf"
              onClick={() => analytics.resumeDownload('desktop_navbar')}
              className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              style={{
                color: '#60a5fa',
                background: 'rgba(59,130,246,0.10)',
                border: '1px solid rgba(59,130,246,0.28)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'rgba(59,130,246,0.18)'
                el.style.borderColor = 'rgba(59,130,246,0.50)'
                el.style.boxShadow = '0 2px 12px rgba(59,130,246,0.25)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'rgba(59,130,246,0.10)'
                el.style.borderColor = 'rgba(59,130,246,0.28)'
                el.style.boxShadow = ''
              }}
              aria-label="Download resume PDF"
            >
              <Download size={13} aria-hidden="true" />
              Resume
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex md:hidden items-center justify-center p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            style={{ color: '#94a3b8' }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.color = '#f8fafc'
              el.style.background = 'rgba(255,255,255,0.07)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.color = '#94a3b8'
              el.style.background = 'transparent'
            }}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={20} aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu size={20} aria-hidden="true" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(4px)' }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              id="mobile-menu"
              key="panel"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-4 top-20 z-50 rounded-2xl p-4 shadow-2xl md:hidden"
              style={{
                background: '#0f1929',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.60)',
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <nav className="flex flex-col gap-1">
                {navLinks.map((link, i) => {
                  const active = location.pathname === link.to
                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={link.to}
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-3 rounded-xl text-sm font-medium transition-all"
                        style={active ? {
                          background: 'rgba(59,130,246,0.14)',
                          color: '#60a5fa',
                          border: '1px solid rgba(59,130,246,0.25)',
                          fontWeight: '600',
                        } : {
                          color: '#94a3b8',
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            const el = e.currentTarget as HTMLElement
                            el.style.color = '#f8fafc'
                            el.style.background = 'rgba(255,255,255,0.06)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            const el = e.currentTarget as HTMLElement
                            el.style.color = '#94a3b8'
                            el.style.background = 'transparent'
                          }
                        }}
                        aria-current={active ? 'page' : undefined}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  )
                })}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="mt-1 pt-2"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <a
                    href={personal.resumeUrl}
                    download="arjun-p-resume.pdf"
                    onClick={() => { setMobileOpen(false); analytics.resumeDownload('mobile_menu') }}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all"
                    style={{ color: '#60a5fa' }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = 'rgba(59,130,246,0.10)'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = 'transparent'
                    }}
                    aria-label="Download resume PDF"
                  >
                    <Download size={14} aria-hidden="true" />
                    Download Resume
                  </a>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
