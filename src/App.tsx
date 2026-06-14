import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import theme from './theme';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

const Home         = lazy(() => import('./pages/Home'));
const About        = lazy(() => import('./pages/About'));
const Projects     = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/Projects/ProjectDetail'));

function PageLoader() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <CircularProgress color="primary" size={32} />
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <Box component="main" sx={{ flex: 1 }}>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/"               element={<Home />} />
                <Route path="/about"          element={<About />} />
                <Route path="/projects"       element={<Projects />} />
                <Route path="/projects/:id"   element={<ProjectDetail />} />
              </Routes>
            </Suspense>
          </Box>
          <Footer />
        </Box>
      </HashRouter>
    </ThemeProvider>
  );
}
