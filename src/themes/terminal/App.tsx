import { lazy, useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import Lenis from 'lenis';
import BackToTop from './components/BackToTop';
import ContactDialog from './components/ContactDialog';
import ContactFooter from './components/ContactFooter';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import PullCord from './components/PullCord';
import { ContactContext } from './contact';
import { IntroContext, loaderNeeded } from './intro';
import { duration, prefersReducedMotion } from './motion';
import { setLenis } from './scroll';
import { RevealDuration } from '../reveal-motion';
import ThemeRoutes from '../ThemeRoutes';
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
  const [introReady, setIntroReady] = useState(() => !loaderNeeded());
  const [contactOpen, setContactOpen] = useState(false);
  const openPage = useCallback(() => setIntroReady(true), []);
  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);
  useSmoothScroll();

  return (
    <MotionConfig reducedMotion="user">
      <RevealDuration.Provider value={duration.section}>
        <IntroContext.Provider value={introReady}>
          <ContactContext.Provider value={openContact}>
            <Loader onOpen={openPage} />
            <PullCord />
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <ThemeRoutes
                Home={Home}
                About={About}
                Projects={Projects}
                ProjectDetail={ProjectDetail}
              />
              <ContactFooter />
            </div>
            <BackToTop />
            <ContactDialog open={contactOpen} onClose={closeContact} />
          </ContactContext.Provider>
        </IntroContext.Provider>
      </RevealDuration.Provider>
    </MotionConfig>
  );
}
