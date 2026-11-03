import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { MotionConfig, motion } from 'framer-motion';
import Lenis from 'lenis';
import BackToTop from './components/BackToTop';
import ContactDialog from './components/ContactDialog';
import ContactFooter from './components/ContactFooter';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import PullCord from './components/PullCord';
import { ContactContext } from './contact';
import { IntroContext, loaderNeeded } from './intro';
import { duration, ease, prefersReducedMotion } from './motion';
import { setLenis } from './scroll';
import './styles.css';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));

/** Phones and reduced motion keep native scrolling. */
function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return;

    const lenis = new Lenis({ smoothWheel: true });
    setLenis(lenis);
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      setLenis(null);
      lenis.destroy();
    };
  }, []);
}

/** "Terminal" theme — built with VITE_UI_THEME=terminal. */
export default function TerminalApp() {
  const location = useLocation();
  const [introReady, setIntroReady] = useState(() => !loaderNeeded());
  const [contactOpen, setContactOpen] = useState(false);
  const openPage = useCallback(() => setIntroReady(true), []);
  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);
  useSmoothScroll();

  return (
    <MotionConfig reducedMotion="user">
      <IntroContext.Provider value={introReady}>
        <ContactContext.Provider value={openContact}>
          <Loader onOpen={openPage} />
          <PullCord />
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main id="main-content" className="flex-1" tabIndex={-1}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: duration.ui + 0.1, ease: ease.out }}
              >
                <Suspense fallback={<div className="min-h-[70vh]" aria-busy="true" />}>
                  <Routes location={location}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projects/:id" element={<ProjectDetail />} />
                  </Routes>
                </Suspense>
              </motion.div>
            </main>
            <ContactFooter />
          </div>
          <BackToTop />
          <ContactDialog open={contactOpen} onClose={closeContact} />
        </ContactContext.Provider>
      </IntroContext.Provider>
    </MotionConfig>
  );
}
