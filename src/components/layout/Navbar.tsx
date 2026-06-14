import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Download } from 'lucide-react'
import { personal } from '../../data/personal'
import { cn } from '../../lib/utils'

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
    setMobileOpen(false)
  }, [location.pathname])

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
          scrolled ? 'py-3 border-b border-gray-200' : 'py-5',
        )}
        style={scrolled ? {
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          background: 'rgba(250,250,250,0.92)',
        } : {}}
      >
        <nav
          className="container-xl flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-2.5 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Home"
          >
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
                aria-hidden="true"
              >
                AP
              </div>
              <span className="text-sm font-semibold text-text-heading transition-colors group-hover:text-blue-600">
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
                      ? 'text-text-heading font-medium'
                      : 'text-text-secondary hover:text-text-heading hover:bg-gray-100',
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-gray-100"
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
              className="flex items-center gap-1.5 rounded-lg border border-blue-200 px-3.5 py-1.5 text-xs font-medium text-blue-600 transition-all hover:bg-blue-50 hover:border-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Download resume PDF"
            >
              <Download size={13} aria-hidden="true" />
              Resume
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex md:hidden items-center justify-center p-2 rounded-lg text-text-secondary hover:text-text-heading hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
              className="fixed inset-0 z-40 md:hidden bg-black/20 backdrop-blur-sm"
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
              className="fixed inset-x-4 top-20 z-50 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl md:hidden"
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
                        className={cn(
                          'block px-4 py-3 rounded-xl text-sm font-medium transition-all',
                          active
                            ? 'bg-gray-100 text-text-heading'
                            : 'text-text-secondary hover:text-text-heading hover:bg-gray-50',
                        )}
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
                  className="mt-1 border-t border-gray-100 pt-2"
                >
                  <a
                    href={personal.resumeUrl}
                    download="arjun-p-resume.pdf"
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-blue-600 transition-all hover:bg-blue-50"
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
