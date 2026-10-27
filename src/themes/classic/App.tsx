import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollProgress from './components/ui/ScrollProgress';
import './styles.css';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/Projects/ProjectDetail'));

function PageLoader() {
  return (
    <output className="flex min-h-[60vh] items-center justify-center" aria-label="Loading page">
      <div className="relative h-10 w-10">
        <div
          className="h-full w-full animate-spin rounded-full border-2 border-transparent"
          style={{ borderTopColor: '#06b6d4', borderRightColor: 'rgba(6,182,212,0.2)' }}
        />
      </div>
    </output>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function SmoothScrollProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

/** The original dark "glass" portfolio — the default build (VITE_UI_THEME=classic or unset). */
export default function ClassicApp() {
  return (
    <SmoothScrollProvider>
      <div className="flex min-h-screen flex-col text-text-body">
        <ScrollProgress />
        <Navbar />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
