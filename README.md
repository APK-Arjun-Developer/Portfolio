# Arjun Prakash — Portfolio

[![CI](https://github.com/APK-Arjun-Developer/Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/APK-Arjun-Developer/Portfolio/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=APK-Arjun-Developer_Portfolio&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=APK-Arjun-Developer_Portfolio)
[![GitHub release](https://img.shields.io/github/v/release/APK-Arjun-Developer/Portfolio)](https://github.com/APK-Arjun-Developer/Portfolio/releases)

Personal portfolio of a Full Stack Developer (React, TypeScript, ASP.NET Core, EF Core, SQL Server, PostgreSQL) — projects with detailed case studies, experience, and skills.

**Live site:** https://arjun-prakash.is-a.dev

## Tech stack

- **React 19** + **TypeScript**, **Vite 8**, **React Router 7**
- **Tailwind CSS 3** with per-theme design tokens
- **framer-motion** for animation (reduced-motion aware)
- **Vitest** + **Testing Library** for tests, **SonarCloud** for quality
- **semantic-release** for versioning, deployed on **Vercel**

## UI themes

The site ships with two complete designs. One is chosen **at build time** — only that theme's code, CSS, fonts, favicon and social image end up in the bundle.

| Theme               | Look                                                               | Select with                      |
| ------------------- | ------------------------------------------------------------------ | -------------------------------- |
| `classic` (default) | Dark "glass" design with blue/violet accents                       | `VITE_UI_THEME=classic` or unset |
| `signal`            | "Coral Signal": light/dark/system modes, flow-diagram case studies | `VITE_UI_THEME=signal`           |

Set `VITE_UI_THEME` in `.env` (local) or in Vercel's environment variables (production), or use the `build:*` / `dev:signal` scripts which pass `--mode`. Restart the dev server after changing it.

## Getting started

Requires [Bun](https://bun.sh) (npm works too).

```bash
bun install
cp .env.example .env   # optional — theme and Google Analytics settings
bun run dev            # classic theme at http://localhost:5173
bun run dev:signal     # signal theme
```

## Scripts

| Script                                  | Purpose                                                            |
| --------------------------------------- | ------------------------------------------------------------------ |
| `dev` / `dev:signal`                    | Dev server (theme from `.env` / signal)                            |
| `build`                                 | Type-check + production build using `VITE_UI_THEME`                |
| `build:classic` / `build:signal`        | Build a specific theme                                             |
| `preview`                               | Serve the last build                                               |
| `test` / `test:watch` / `test:coverage` | Vitest (coverage report in `coverage/`)                            |
| `lint` / `lint:fix`                     | ESLint                                                             |
| `format` / `format:check`               | Prettier                                                           |
| `typecheck`                             | `tsc -b`                                                           |
| `ci`                                    | Everything CI runs: format, lint, typecheck, coverage, both builds |
| `og:generate`                           | Re-render the social preview images in `public/`                   |
| `release`                               | semantic-release (runs in CI only)                                 |

## Environment variables

| Variable                 | Default   | Description                              |
| ------------------------ | --------- | ---------------------------------------- |
| `VITE_UI_THEME`          | `classic` | `classic` or `signal`                    |
| `VITE_GA_ENABLED`        | `false`   | `true` to send Google Analytics 4 events |
| `VITE_GA_MEASUREMENT_ID` | —         | GA4 measurement ID (`G-XXXXXXXXXX`)      |

All `VITE_*` values are embedded in the public bundle — never put secrets in them.

## Project structure

```
src/
  App.tsx              Router, GA page views; renders the build-selected theme (@theme-app)
  data/personal.ts     All content — profile, projects, experience, skills
  lib/                 analytics, version, utils (shared by both themes)
  components/          Shared components (brand icons)
  themes/
    classic/           Original design (App, pages, components, styles.css)
    signal/            Coral Signal (App, pages, components, motion.ts, content.ts, styles.css)
  __tests__/           Vitest suites for data, lib, root App and both themes
scripts/og-image.mjs   Renders public/og-image*.png with Playwright
```

Content changes only need `src/data/personal.ts` (and `src/themes/signal/content.ts` for signal-specific copy).

## Quality and CI

- **CI** (`.github/workflows/ci.yml`) — format, lint, typecheck and tests with coverage, then builds both themes.
- **SonarCloud** (`.github/workflows/sonarcloud.yml`) — analysis with coverage on every PR; the quality gate must pass.
- **Git hooks** (Husky):
  - `pre-commit` — `lint-staged` (ESLint + Prettier on staged files)
  - `commit-msg` — commitlint ([Conventional Commits](https://www.conventionalcommits.org), lower-case subject, ≤ 72 chars)
  - `pre-push` — branch-name check (`<type>/<kebab-case>`), lint, typecheck, tests, build

## Releases and versioning

Every push to `main` runs `.github/workflows/release.yml`: all checks, then **semantic-release** decides the next version from commit messages (`fix:` → patch, `feat:` → minor, breaking change → major), updates `package.json` and `CHANGELOG.md`, tags `vX.Y.Z` and publishes a GitHub release. The version is shown as a chip next to the logo in both themes.

`main` only accepts pull requests; the release commit is pushed with the `GH_TOKEN` secret (a personal access token of a ruleset bypass actor).

## Deployment

Vercel builds `main` with `bun run build`; `vercel.json` rewrites all routes to `index.html` for client-side routing.
