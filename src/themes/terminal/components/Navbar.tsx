import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Menu, X } from 'lucide-react';
import { personal } from '../../../data/personal';
import { analytics } from '../../../lib/analytics';
import { cn } from '../../../lib/utils';
import { useOpenContact } from '../contact';
import { duration, ease } from '../motion';

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
  const openContact = useOpenContact();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the menu on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-colors duration-300',
        scrolled ? 'border-tm-line bg-tm-bg' : 'border-transparent',
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-tm-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-tm-bg"
      >
        Skip to content
      </a>

      <nav
        className="tm-wrap flex h-[4.5rem] items-center justify-between gap-4 lg:h-[5.25rem]"
        aria-label="Main navigation"
      >
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setMenuOpen(true)}
          className="tm-chip flex h-11 w-14 items-center justify-center text-tm-ink lg:hidden"
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <Menu size={18} aria-hidden="true" />
        </button>

        <ul className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.to);
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'tm-navlink relative block py-1 text-base transition-colors duration-200',
                    active ? 'text-tm-ink' : 'text-tm-muted hover:text-tm-ink',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={openContact}
              className="tm-navlink block py-1 text-base text-tm-muted transition-colors duration-200 hover:text-tm-ink"
            >
              Contact
            </button>
          </li>
        </ul>

        {/* Room on the right for the pull cord, which hangs just past these. */}
        <div className="flex items-center gap-3 pr-10 sm:pr-14 lg:pr-0">
          <a
            href={personal.resumeUrl}
            onClick={() => analytics.resumeDownload('desktop_navbar')}
            className="tm-chip group hidden items-center gap-2 px-3.5 py-2.5 text-sm font-medium text-tm-ink lg:inline-flex"
            aria-label="Download resume PDF"
          >
            Resume
            <Download
              size={14}
              className="transition-transform duration-200 group-hover:translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </nav>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.ui + 0.1, ease: ease.out }}
            data-lenis-prevent
            className="tm-menu"
          >
            <div className="tm-wrap flex justify-start py-5">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  toggleRef.current?.focus();
                }}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#ffffff30] px-4 text-xs font-medium uppercase tracking-wider text-[#e8e4e0]"
              >
                <X size={14} aria-hidden="true" />
                Close
              </button>
            </div>
            <ul className="tm-wrap flex flex-1 flex-col justify-center gap-1">
              {navLinks.map((link, i) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    aria-current={isActive(pathname, link.to) ? 'page' : undefined}
                    className="tm-menu__item"
                  >
                    <small aria-hidden="true">{String(i + 1).padStart(2, '0')}</small>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  className="tm-menu__item"
                  onClick={() => {
                    setMenuOpen(false);
                    openContact();
                  }}
                >
                  <small aria-hidden="true">04</small>
                  <span>Contact</span>
                </button>
              </li>
            </ul>
            <div className="tm-wrap border-t border-[#ffffff1f] py-6">
              <a
                href={personal.resumeUrl}
                onClick={() => {
                  setMenuOpen(false);
                  analytics.resumeDownload('mobile_menu');
                }}
                className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#e8e4e0]"
                aria-label="Download resume PDF"
              >
                <Download size={15} aria-hidden="true" />
                Download Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
