/// <reference types="vite/client" />

/** package.json version at build time, injected by `define` in vite.config.ts. */
declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  /** Which UI theme to build: 'classic' (default) or 'signal'. */
  readonly VITE_UI_THEME?: 'signal' | 'classic';
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_GA_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** Aliased in vite.config.ts to src/themes/<VITE_UI_THEME>/App.tsx. */
declare module '@theme-app' {
  import type { ComponentType } from 'react';
  const ThemeApp: ComponentType;
  export default ThemeApp;
}
