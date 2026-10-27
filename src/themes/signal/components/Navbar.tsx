import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Menu, X } from 'lucide-react';
import { personal } from '../../../data/personal';
import { analytics } from '../../../lib/analytics';
import { cn } from '../../../lib/utils';
import { duration, ease } from '../motion';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
];

function isActive(pathname: string, to: string) {
  return to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`);
}

export default function Navbar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the mobile menu on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b bg-sg-bg transition-colors duration-200',
        scrolled || mobileOpen ? 'border-sg-line' : 'border-transparent',
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-sg-coral focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-sg-on-coral"
      >
        Skip to content
      </a>

      <nav
        className="sg-wrap flex h-[4.5rem] items-center justify-between gap-4"
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className="group flex items-center gap-3"
          aria-label={`${personal.name} — home`}
        >
          <span className="font-display text-xl font-extrabold tracking-tight text-sg-ink">
            AP<span className="text-sg-coral">.</span>
          </span>
          <span className="hidden text-sm font-medium text-sg-muted transition-colors group-hover:text-sg-ink sm:inline">
            {personal.name}
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-5">
          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.to);
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative block rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-colors duration-200',
                      active ? 'text-sg-ink' : 'text-sg-muted hover:text-sg-ink',
                    )}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="sg-nav-indicator"
                        className="absolute inset-x-4 -bottom-px h-[2px] rounded-full bg-sg-coral"
                        transition={{ duration: duration.ui + 0.08, ease: ease.inOut }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <ThemeToggle />

          <a
            href={personal.resumeUrl}
            download="arjun-p-resume.pdf"
            onClick={() => analytics.resumeDownload('desktop_navbar')}
            className="sg-btn-primary group hidden min-h-[2.5rem] px-5 text-sm md:inline-flex"
            aria-label="Download resume PDF"
          >
            Resume
            <Download
              size={14}
              className="transition-transform duration-200 group-hover:translate-y-0.5"
              aria-hidden="true"
            />
          </a>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-sg-ink transition-colors hover:bg-sg-raised md:hidden"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: duration.ui, ease: ease.out }}
            className="absolute inset-x-0 top-full border-b border-sg-line bg-sg-bg md:hidden"
          >
            <ul className="sg-wrap py-3">
              {navLinks.map((link) => {
                const active = isActive(pathname, link.to);
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex items-center justify-between border-b border-sg-line py-4 font-display text-3xl font-bold',
                        active ? 'text-sg-coral-text' : 'text-sg-ink',
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className="pb-2 pt-5">
                <a
                  href={personal.resumeUrl}
                  download="arjun-p-resume.pdf"
                  onClick={() => {
                    setMobileOpen(false);
                    analytics.resumeDownload('mobile_menu');
                  }}
                  className="sg-btn-primary w-full"
                  aria-label="Download resume PDF"
                >
                  <Download size={15} aria-hidden="true" />
                  Download Resume
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
