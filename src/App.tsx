import { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
// Resolved at build time from VITE_UI_THEME (see vite.config.ts) — only one theme is bundled.
import ThemeApp from '@theme-app';

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const GA_ENABLED = import.meta.env.VITE_GA_ENABLED === 'true';
if (GA_ENABLED && GA_ID) ReactGA.initialize(GA_ID);

function RouteEffects() {
  const location = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);

  useEffect(() => {
    if (GA_ID) ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
  }, [location]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteEffects />
      <ThemeApp />
    </BrowserRouter>
  );
}
