import { Suspense, type ComponentType } from 'react';
import { motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ease } from './reveal-motion';

interface ThemeRoutesProps {
  Home: ComponentType;
  About: ComponentType;
  Projects: ComponentType;
  ProjectDetail: ComponentType;
}

export default function ThemeRoutes({
  Home,
  About,
  Projects,
  ProjectDetail,
}: Readonly<ThemeRoutesProps>) {
  const location = useLocation();

  return (
    <main id="main-content" className="flex-1" tabIndex={-1}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: ease.out }}
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
  );
}
