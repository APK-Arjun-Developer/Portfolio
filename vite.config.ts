import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv, type HtmlTagDescriptor, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const THEMES = ['signal', 'classic'] as const;
type UiTheme = (typeof THEMES)[number];
const DEFAULT_THEME: UiTheme = 'classic';

function resolveTheme(value: string | undefined): UiTheme {
  if (!value) return DEFAULT_THEME;
  if ((THEMES as readonly string[]).includes(value)) return value as UiTheme;
  console.warn(
    `[ui-theme] Unknown VITE_UI_THEME "${value}" — expected ${THEMES.join(' | ')}. Using "${DEFAULT_THEME}".`,
  );
  return DEFAULT_THEME;
}

const fontLink = (families: string): HtmlTagDescriptor => ({
  tag: 'link',
  attrs: { rel: 'stylesheet', href: `https://fonts.googleapis.com/css2?${families}&display=swap` },
  injectTo: 'head',
});

const favicon = (href: string): HtmlTagDescriptor[] => [
  { tag: 'link', attrs: { rel: 'icon', type: 'image/svg+xml', href }, injectTo: 'head' },
  { tag: 'link', attrs: { rel: 'apple-touch-icon', href }, injectTo: 'head' },
];

// Runs before first paint: resolves the stored light/dark/system preference (signal only).
const signalThemeBootstrap = `(function () {
  var pref = 'system';
  try { pref = localStorage.getItem('theme') || 'system'; } catch (e) {}
  var dark = pref === 'dark' || (pref !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]').setAttribute('content', dark ? '#0f1115' : '#fbf7f2');
})();`;

const headTags: Record<UiTheme, HtmlTagDescriptor[]> = {
  signal: [
    { tag: 'meta', attrs: { name: 'theme-color', content: '#0f1115' }, injectTo: 'head-prepend' },
    { tag: 'script', children: signalThemeBootstrap, injectTo: 'head' },
    ...favicon('/favicon-signal.svg'),
    fontLink(
      'family=Hanken+Grotesk:ital,wght@0,400..700;1,400&family=JetBrains+Mono:wght@400;500&family=Syne:wght@600..800',
    ),
  ],
  classic: [
    { tag: 'meta', attrs: { name: 'theme-color', content: '#08080e' }, injectTo: 'head-prepend' },
    ...favicon('/favicon.svg'),
    fontLink(
      'family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@600;700;800;900&family=JetBrains+Mono:wght@400;500;600',
    ),
  ],
};

function uiThemeHead(theme: UiTheme): Plugin {
  return {
    name: 'ui-theme-head',
    transformIndexHtml: () => headTags[theme],
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // `--mode signal` / `--mode classic` picks a theme explicitly (cross-platform, used by
  // the build:* scripts); otherwise VITE_UI_THEME from the environment / .env decides.
  const modeTheme = (THEMES as readonly string[]).includes(mode) ? mode : undefined;
  const theme = resolveTheme(modeTheme ?? loadEnv(mode, process.cwd(), 'VITE_').VITE_UI_THEME);
  // Read by tailwind.config.js to scope content scanning to this theme.
  process.env.VITE_UI_THEME = theme;

  return {
    plugins: [react(), uiThemeHead(theme)],
    base: '/',
    resolve: {
      alias: {
        '@theme-app': fileURLToPath(new URL(`./src/themes/${theme}/App.tsx`, import.meta.url)),
      },
    },
  };
});
