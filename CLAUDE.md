# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint via Next.js
```

Node >=24 is required.

## Architecture

Next.js (Pages Router) personal portfolio site. No `components/` directory — all React components live inline within the page file that uses them or in subfiles under `pages/`.

**Key files:**
- `pages/index.js` — Homepage. Contains the hero section, `NeuralBackground` (canvas animation), `WorkCards`, and footer all in one file. All styling is done with inline styles and a `<style>` JSX tag; Tailwind utility classes are used sparingly for layout.
- `pages/resume/` — Resume page, split into `index.js` (layout), `header.js`, `key-point.js`, `list.js`, `short-list.js`
- `data/resume-data.js` — All resume content (jobs, skills, education, etc.)
- `data/greek-data.js` — Data for `pages/greek/index.js`
- `styles/globals.css` — Tailwind base imports only; almost no custom CSS here

**Styling approach:** The homepage uses a `<style>` block with CSS custom properties (`--orange: #fb923c`, `--orange-dark`, `--bg: #1a1a1a`) as the source of truth for the color palette. The resume page uses Tailwind utility classes exclusively.

**Font Awesome:** CSS is manually imported in `_app.js` with `config.autoAddCss = false` to prevent double injection.
