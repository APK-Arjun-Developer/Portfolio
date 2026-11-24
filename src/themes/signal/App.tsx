import { lazy } from 'react';
import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import ContactFooter from './components/ContactFooter';
import ThemeRoutes from '../ThemeRoutes';
import './styles.css';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));

/** "Coral Signal" theme — built with VITE_UI_THEME=signal. */
export default function SignalApp() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <ThemeRoutes Home={Home} About={About} Projects={Projects} ProjectDetail={ProjectDetail} />
        <ContactFooter />
      </div>
    </MotionConfig>
  );
}
