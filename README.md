# Arjun P — Portfolio

Personal portfolio built with React + Vite + Material UI. Showcases projects, skills, and experience as a Full Stack Developer.

**Live site:** https://APK-Arjun-Developer.github.io/portfolio

---

## Tech Stack

- **React 19** + **TypeScript**
- **Material UI v9** (component library + theming)
- **Vite** (build tool)
- **React Router v7** (client-side routing)
- **GitHub Actions** (CI/CD → GitHub Pages)

---

## Local Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

---

## Deployment

Pushes to `main` automatically deploy to GitHub Pages via `.github/workflows/deploy.yml`.

**One-time setup required:**
Go to repo **Settings → Pages → Source** and select **GitHub Actions**.

---

## Project Structure

```
src/
  components/
    layout/       # Navbar, Footer
    ui/           # FadeIn, SectionTitle (shared)
  data/
    personal.ts   # All content — name, links, projects, skills
  pages/
    Home/
    About/
    Projects/
public/
  favicon.svg
  resume.pdf
```

---

## Customisation

All content lives in `src/data/personal.ts` — update name, links, projects, and skills there. No changes needed elsewhere for content updates.
