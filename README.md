# Arjun Prakash — Portfolio

[![CI](https://github.com/APK-Arjun-Developer/Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/APK-Arjun-Developer/Portfolio/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=APK-Arjun-Developer_Portfolio&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=APK-Arjun-Developer_Portfolio)
[![GitHub release](https://img.shields.io/github/v/release/APK-Arjun-Developer/Portfolio)](https://github.com/APK-Arjun-Developer/Portfolio/releases)

Personal portfolio of a Full Stack Developer (React, TypeScript, ASP.NET Core, EF Core, SQL Server, PostgreSQL): projects with detailed case studies, experience and skills.

**Live site:** https://arjun-prakash.is-a.dev

## Contents

1. [Overall flow](#1-overall-flow)
2. [Tech stack](#2-tech-stack)
3. [Getting started](#3-getting-started)
4. [Scripts](#4-scripts)
5. [UI themes](#5-ui-themes)
6. [Environment variables](#6-environment-variables)
7. [Project structure](#7-project-structure)
8. [Branch naming](#8-branch-naming)
9. [Commit messages](#9-commit-messages)
10. [Git hooks](#10-git-hooks)
11. [Prettier](#11-prettier)
12. [ESLint](#12-eslint)
13. [TypeScript](#13-typescript)
14. [Tests](#14-tests)
15. [Build](#15-build)
16. [SonarCloud](#16-sonarcloud)
17. [CI](#17-ci)
18. [Versioning and releases](#18-versioning-and-releases)
19. [Deployment](#19-deployment)
20. [Repository settings and secrets](#20-repository-settings-and-secrets)
21. [Day-to-day workflow](#21-day-to-day-workflow)
22. [Troubleshooting](#22-troubleshooting)

---

## 1. Overall flow

```
feature branch ──PR──▶ main ──▶ semantic-release ──▶ Vercel deploy
 (local hooks)    (CI + SonarCloud)  (version, tag,      (arjun-prakash.is-a.dev)
                                      CHANGELOG, release)
```

1. Work on a `<type>/<description>` branch. Git hooks lint, type-check and test locally.
2. Open a pull request to `main`. **CI** and **SonarCloud** must pass.
3. Merge. The **release** workflow re-verifies everything, then semantic-release bumps the version, tags `vX.Y.Z` and publishes a GitHub release.
4. **Vercel** deploys `main`. The new version shows in the navbar.

`main` only accepts changes through pull requests.

## 2. Tech stack

| Area      | Tools                                                                 |
| --------- | --------------------------------------------------------------------- |
| App       | React 19, TypeScript 6, React Router 7                                |
| Build     | Vite 8 (Rolldown), Tailwind CSS 3, PostCSS                            |
| Motion    | framer-motion (reduced-motion aware)                                  |
| Analytics | Google Analytics 4 via `react-ga4` (opt-in)                           |
| Tests     | Vitest 5, Testing Library, jsdom, v8 coverage                         |
| Quality   | ESLint 10, Prettier 3, SonarCloud                                     |
| Workflow  | Bun, Husky, lint-staged, commitlint, semantic-release, GitHub Actions |
| Hosting   | Vercel                                                                |

## 3. Getting started

Requires [Bun](https://bun.sh) (npm also works) and Node.js 22+.

```bash
git clone https://github.com/APK-Arjun-Developer/Portfolio.git
cd Portfolio
bun install            # also installs the Husky git hooks ("prepare" script)
cp .env.example .env   # optional: theme and Google Analytics settings
bun run dev            # http://localhost:5173 (classic theme)
bun run dev:signal     # same, with the Coral Signal theme
```

## 4. Scripts

| Script                           | What it does                                                                                       |
| -------------------------------- | -------------------------------------------------------------------------------------------------- |
| `dev` / `dev:signal`             | Dev server (theme from `.env`, or Signal)                                                          |
| `build`                          | `tsc -b` + production build using `VITE_UI_THEME` (what Vercel runs)                               |
| `build:classic` / `build:signal` | Production build of one specific theme                                                             |
| `preview`                        | Serve the last build locally                                                                       |
| `og:generate`                    | Re-render the social preview images in `public/`                                                   |
| `format` / `format:check`        | Prettier: rewrite files / check only                                                               |
| `lint` / `lint:fix`              | ESLint: report / auto-fix                                                                          |
| `typecheck`                      | `tsc -b` (no emit)                                                                                 |
| `test` / `test:watch`            | Vitest once / in watch mode                                                                        |
| `test:coverage`                  | Vitest with v8 coverage (`coverage/`, including `lcov.info` for SonarCloud)                        |
| `ci`                             | Everything CI runs: format:check → lint → typecheck → test:coverage → build:classic → build:signal |
| `release`                        | semantic-release (CI only)                                                                         |
| `prepare`                        | Installs the Husky hooks (runs automatically on install)                                           |

Run **`bun run ci`** before opening a pull request. If it passes locally, CI will pass too.

## 5. UI themes

The site ships with two complete designs. One is chosen **at build time**. Only that theme's code, CSS, fonts, favicon, `theme-color` and social image end up in the bundle.

| Theme               | Look                                                                              |
| ------------------- | --------------------------------------------------------------------------------- |
| `classic` (default) | Dark "glass" design with blue and violet accents                                  |
| `signal`            | "Coral Signal": light/dark/system modes, flow-diagram case studies, motion system |

**Switching the live site:** in Vercel → Settings → Environment Variables, set `VITE_UI_THEME` to `signal` or `classic`, then **redeploy**. Saving the variable alone changes nothing.

**Locally:** set `VITE_UI_THEME` in `.env` and restart the dev server, or use `dev:signal` / `build:signal` / `build:classic`, which pass Vite's `--mode` and ignore `.env`.

How it works:

- `vite.config.ts` resolves the theme (`--mode` first, then `VITE_UI_THEME`, else `classic`). An unknown value falls back to `classic` with a warning.
- The alias `@theme-app` points at `src/themes/<theme>/App.tsx`, which `src/App.tsx` imports.
- The `ui-theme-head` plugin injects that theme's fonts, `theme-color`, favicon, social image tags and, for Signal, the light/dark bootstrap script.
- `tailwind.config.js` scans only the active theme's files, so the CSS has no leftovers from the other theme.

The Light / System / Dark toggle in the Signal navbar is a per-visitor setting stored in their browser. It doesn't switch between themes.

## 6. Environment variables

| Variable                 | Default   | Description                               |
| ------------------------ | --------- | ----------------------------------------- |
| `VITE_UI_THEME`          | `classic` | `classic` or `signal`, read at build time |
| `VITE_GA_ENABLED`        | `false`   | Set to exactly `true` to send GA4 events  |
| `VITE_GA_MEASUREMENT_ID` | (none)    | GA4 measurement ID (`G-XXXXXXXXXX`)       |

- Locally: copy `.env.example` to `.env` (git-ignored).
- Production: Vercel environment variables, followed by a redeploy.
- Every `VITE_*` value is embedded in the public JavaScript bundle. **Never put secrets in them.**

## 7. Project structure

```
.github/workflows/      ci.yml, sonarcloud.yml, branch-name.yml, release.yml
.husky/                 pre-commit, commit-msg, pre-push
public/                 favicons, og-image*.png, resume.pdf
scripts/og-image.mjs    renders the social preview cards (Playwright)
src/
  App.tsx               router, scroll reset, GA page views; renders @theme-app
  main.tsx              entry point
  data/personal.ts      ALL content: profile, projects, experience, education, skills
  lib/                  analytics.ts, version.ts, utils.ts (shared)
  components/           shared components (BrandIcons)
  themes/
    classic/            App, pages, components, styles.css
    signal/             App, pages, components, motion.ts, content.ts, theme.ts, styles.css
  __tests__/            Vitest suites + setup.ts + helpers.tsx
```

To change content, edit `src/data/personal.ts`. Signal-only copy (headline, skill groups, flow diagrams) lives in `src/themes/signal/content.ts`.

## 8. Branch naming

```
<type>/<kebab-case-description>
```

| Rule        | Value                                                                                                                                                      |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Valid types | `feat` `fix` `ci` `chore` `docs` `refactor` `test` `perf` `hotfix`                                                                                         |
| Description | lowercase letters, digits and hyphens: `[a-z0-9][a-z0-9-]*`                                                                                                |
| Exempt      | `main`                                                                                                                                                     |
| Enforced by | `.husky/pre-push` locally, and `.github/workflows/branch-name.yml` on every PR to `main` (catches `--no-verify` pushes and branches created on github.com) |

Examples: `feat/contact-form`, `fix/sonar-classic-issues`, `docs/full-readme`.

## 9. Commit messages

[Conventional Commits](https://www.conventionalcommits.org), enforced by commitlint (`.commitlintrc.json`, extends `@commitlint/config-conventional`):

```
<type>(<optional scope>): <subject>

<optional body>
```

| Rule       | Value                                                              |
| ---------- | ------------------------------------------------------------------ |
| Types      | `feat` `fix` `ci` `chore` `docs` `refactor` `test` `perf` `hotfix` |
| Subject    | entirely lowercase                                                 |
| Header     | at most 72 characters                                              |
| Body lines | over 100 characters produce a warning only                         |

| Message                             | Result                  |
| ----------------------------------- | ----------------------- |
| `feat: add contact form`            | ✅ valid, minor release |
| `fix(classic): correct footer link` | ✅ valid, patch release |
| `Added contact form`                | ❌ missing type         |
| `fix: Resolve SonarCloud issues`    | ❌ subject has capitals |

The type also decides the next version. See [Versioning and releases](#18-versioning-and-releases).

## 10. Git hooks

Husky installs these on `bun install` / `npm install` (via the `prepare` script). They live in `.husky/`.

| Hook           | Runs on      | What it does                                                    | Fails when                     |
| -------------- | ------------ | --------------------------------------------------------------- | ------------------------------ |
| **pre-commit** | `git commit` | `lint-staged` on **staged files only** (see below)              | ESLint errors in staged files  |
| **commit-msg** | `git commit` | commitlint                                                      | message breaks the rules above |
| **pre-push**   | `git push`   | branch-name check, then `lint` → `typecheck` → `test` → `build` | any step fails                 |

lint-staged configuration (in `package.json`):

| Staged files                       | Commands                          |
| ---------------------------------- | --------------------------------- |
| `*.{ts,tsx}`                       | `eslint`, then `prettier --write` |
| `*.{js,json,css,html,md,yml,yaml}` | `prettier --write`                |

The release job sets `HUSKY=0`, so the hooks don't run in CI.

## 11. Prettier

Config: `prettier.config.js`. Ignored: `.prettierignore` (`node_modules`, `dist`, `coverage`, `bun.lock`, `*.min.js`, generated `CHANGELOG.md`).

| Option          | Value      |
| --------------- | ---------- |
| `semi`          | `true`     |
| `singleQuote`   | `true`     |
| `trailingComma` | `'all'`    |
| `printWidth`    | `100`      |
| `tabWidth`      | `2`        |
| `arrowParens`   | `'always'` |
| `endOfLine`     | `'lf'`     |

`.gitattributes` (`* text=auto eol=lf`) makes Git check files out with LF everywhere, so `endOfLine: 'lf'` passes on Windows too.

Run `bun run format` to fix everything, or `bun run format:check` to check (as CI does).

## 12. ESLint

Config: `eslint.config.js` (flat config). Ignored: `dist`, `coverage`.

| Applied to         | Rule sets                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| `**/*.{ts,tsx}`    | `@eslint/js` recommended, `typescript-eslint` recommended, `react-hooks` recommended, `react-refresh` (Vite) |
| `src/__tests__/**` | `react-refresh/only-export-components` turned off (test helpers mix components and functions)                |

Run `bun run lint`, or `bun run lint:fix` to auto-fix.

## 13. TypeScript

`tsconfig.json` holds only project references:

| Project              | Covers                               | Key options                                                                                                                                                                                       |
| -------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tsconfig.app.json`  | `src/` (app + tests)                 | **`strict`**, `target: es2023`, `moduleResolution: bundler`, `jsx: react-jsx`, `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `verbatimModuleSyntax`, `noFallthroughCasesInSwitch` |
| `tsconfig.node.json` | `vite.config.ts`, `vitest.config.ts` | Node-side config files                                                                                                                                                                            |

Global types for `src/vite-env.d.ts`:

- `__APP_VERSION__`: injected at build time
- `ImportMetaEnv`: `VITE_*` variables
- the `@theme-app` module

`bun run typecheck` runs `tsc -b`. It runs in pre-push, CI, the SonarCloud job and the release job.

## 14. Tests

| Item        | Details                                                                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Runner      | Vitest 5 with jsdom (`vitest.config.ts`)                                                                                                   |
| Libraries   | `@testing-library/react`, `user-event`, `jest-dom`, `jest-axe` (accessibility)                                                             |
| Location    | `src/__tests__/**/*.test.{ts,tsx}`                                                                                                         |
| Setup       | `src/__tests__/setup.ts`: stubs `matchMedia`, `IntersectionObserver`, clipboard and `scrollTo`; blocks jsdom navigation for external links |
| Helpers     | `src/__tests__/helpers.tsx`: `renderTheme(App, path)`, `waitForPage()`, `currentPath()`                                                    |
| Coverage    | v8 provider; reporters `text`, `json`, `html`, `lcov`; `main.tsx` and `vite-env.d.ts` excluded                                             |
| Thresholds  | **lines ≥ 80%, branches ≥ 80%**. The run fails below either.                                                                               |
| Theme alias | `@theme-app` resolves to the classic theme in tests; both themes are also tested directly                                                  |

| Suite                         | Covers                                                                                                   |
| ----------------------------- | -------------------------------------------------------------------------------------------------------- |
| `data.test.ts`                | years-of-experience maths, project ids, flow diagrams                                                    |
| `lib.test.ts`                 | analytics events on/off, `cn`, version label                                                             |
| `App.test.tsx`                | root app, GA initialisation and page views                                                               |
| `classic/ClassicApp.test.tsx` | every classic route, navbar, mobile menu, project filter, links                                          |
| `signal/SignalApp.test.tsx`   | every Signal route, navigation, filter, case studies, contact footer                                     |
| `signal/theme.test.tsx`       | light/dark/system preference, OS changes, blocked storage                                                |
| `a11y.test.tsx`               | axe-core audit of every route in both themes (`toHaveNoViolations`); colour contrast is skipped in jsdom |

## 15. Build

| Item           | Details                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| Tool           | Vite 8 (`vite.config.ts`) with `@vitejs/plugin-react`                                                        |
| Output         | `dist/`, a static single-page app                                                                            |
| Code splitting | each route page is lazy-loaded                                                                               |
| Version        | `package.json` version injected as `__APP_VERSION__` and shown in the navbar chip                            |
| Theme          | see [UI themes](#5-ui-themes)                                                                                |
| Social images  | `public/og-image.png` (classic), `public/og-image-signal.png` (Signal), 1200×630, absolute URLs in meta tags |

Regenerate the social images after changing the name, role or headline:

```bash
bun run og:generate   # uses your installed Chrome via Playwright
```

## 16. SonarCloud

| Item         | Details                                                                                      |
| ------------ | -------------------------------------------------------------------------------------------- |
| Config       | `sonar-project.properties`, workflow `.github/workflows/sonarcloud.yml`                      |
| Project      | `APK-Arjun-Developer_Portfolio`, organization `apk-arjun-developer`                          |
| Runs on      | pushes to `main` and pull requests into `main`                                               |
| Steps        | install → typecheck → `test:coverage` → SonarCloud scan                                      |
| Sources      | `src/` (tests and `vite-env.d.ts` excluded)                                                  |
| Coverage     | `coverage/lcov.info`; `main.tsx` excluded from coverage                                      |
| Duplication  | `src/data/**` excluded from copy-paste detection: the project objects share the same shape   |
| Gate         | `sonar.qualitygate.wait=true`: the job fails, and blocks the PR, when the quality gate fails |
| Editor       | `.vscode/settings.json` binds SonarLint (connected mode) to the project                      |
| Requirements | `SONAR_TOKEN` secret; **Automatic Analysis turned off** in SonarCloud (CI analysis only)     |

## 17. CI

`.github/workflows/ci.yml` runs on pushes and pull requests to `main`, using Bun.

| Job                                      | Steps                                                                                              |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Format, Lint, Typecheck & Test**       | `format:check` → `lint` → `typecheck` → `test:coverage` → `bun audit` (informational, never fails) |
| **Build (classic)** / **Build (signal)** | run after the first job, in parallel: `build:classic` and `build:signal`                           |

Both themes must build on every change, even though only one is deployed.

`.github/workflows/branch-name.yml` also runs on every pull request to `main` and fails when the source branch doesn't match [the naming rule](#8-branch-naming).

## 18. Versioning and releases

`.github/workflows/release.yml` + `.releaserc.json` (semantic-release).

**Trigger:** every push to `main`, which normally means merging a pull request.

**Steps:** format → lint → typecheck → test → build classic → build signal → semantic-release.

**How the version is chosen** from the commits since the last tag:

| Commits contain                                   | Release | Example       |
| ------------------------------------------------- | ------- | ------------- |
| `fix:`                                            | patch   | 1.0.2 → 1.0.3 |
| `feat:`                                           | minor   | 1.0.2 → 1.1.0 |
| `feat!:` / `fix!:` or a `BREAKING CHANGE:` footer | major   | 1.0.2 → 2.0.0 |
| only `chore` `docs` `ci` `test` `refactor` `perf` | none    | (none)        |

**What a release does:**

1. Writes the new version to `package.json` (npm publishing disabled: `npmPublish: false`).
2. Updates `CHANGELOG.md`.
3. Commits `chore(release): x.y.z [skip ci]` to `main`.
4. Creates and pushes the tag `vX.Y.Z`.
5. Publishes a GitHub release with notes, and comments on the released PRs.

**Secrets:** `GH_TOKEN`, a personal access token of a ruleset bypass actor (falls back to `GITHUB_TOKEN`).

## 19. Deployment

| Item    | Details                                                                |
| ------- | ---------------------------------------------------------------------- |
| Host    | Vercel, connected to this repository                                   |
| Trigger | every push to `main`, including the release commit                     |
| Command | `bun run build`                                                        |
| Routing | `vercel.json` rewrites all paths to `index.html` (client-side routing) |
| Theme   | Vercel env var `VITE_UI_THEME` (unset means `classic`)                 |
| Domain  | https://arjun-prakash.is-a.dev                                         |

A merge produces two deployments: the merge commit, then the release commit. **The second one carries the new version number.**

## 20. Repository settings and secrets

| Where                        | Setting                                                               | Purpose                                 |
| ---------------------------- | --------------------------------------------------------------------- | --------------------------------------- |
| GitHub ruleset on `main`     | changes must go through a pull request                                | protects `main`                         |
| Ruleset bypass list          | Repository admin (always)                                             | lets the release commit and tag through |
| Actions secret `GH_TOKEN`    | personal access token (Contents, Issues, Pull requests: read & write) | release commit, tag, GitHub release     |
| Actions secret `SONAR_TOKEN` | SonarCloud token                                                      | SonarCloud scan                         |
| SonarCloud project           | Automatic Analysis: **off**                                           | CI-based analysis only                  |
| Vercel environment variables | `VITE_UI_THEME`, `VITE_GA_ENABLED`, `VITE_GA_MEASUREMENT_ID`          | theme and analytics                     |

When `GH_TOKEN` expires, releases fail. Renew it and update the secret (it's shared with `mui-schema-form-builder`).

## 21. Day-to-day workflow

```bash
git switch main && git pull
git switch -c feat/my-change                  # valid branch name

# ...edit...
bun run ci                                    # optional: everything CI will run

git add <files>
git commit -m "feat: describe the change"     # lint-staged + commitlint
git push -u origin feat/my-change             # branch check + lint + typecheck + test + build

# Open a PR to main → CI + SonarCloud must pass → merge
# → release workflow tags vX.Y.Z → Vercel deploys → navbar shows the new version
```

## 22. Troubleshooting

| Problem                                                        | Cause / fix                                                                         |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Push rejected: "Branch name … is invalid"                      | Rename the branch: `git branch -m <type>/<description>`                             |
| Commit rejected by commitlint                                  | Use `type: lowercase subject` within 72 characters                                  |
| `format:check` fails on every file (Windows)                   | CRLF line endings. Run `bun run format`; `.gitattributes` keeps new checkouts in LF |
| Dev server: "The `bg-sg-bg` class does not exist"              | Tailwind config cached from before a theme change. Restart the dev server           |
| Theme didn't change after editing `.env` / Vercel              | Restart the dev server locally, or **redeploy** on Vercel                           |
| SonarCloud: "CI analysis while Automatic Analysis is enabled"  | Turn off Automatic Analysis in the SonarCloud project settings                      |
| Release: "GH013 … Changes must be made through a pull request" | Ruleset bypass missing, or `GH_TOKEN` missing or expired                            |
| Old favicon or link preview still showing                      | Browser and social caches: hard refresh (Ctrl+Shift+R), or LinkedIn Post Inspector  |
