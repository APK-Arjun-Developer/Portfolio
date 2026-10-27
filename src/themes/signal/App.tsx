import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { MotionConfig, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import ContactFooter from './components/ContactFooter';
import { duration, ease } from './motion';
import './styles.css';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));

/** "Coral Signal" theme — built with VITE_UI_THEME=signal. */
export default function SignalApp() {
  const location = useLocation();

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {/* Enter-only fade keyed by route: never blocks navigation waiting on an exit. */}
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
    </MotionConfig>
  );
}
