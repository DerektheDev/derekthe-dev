# Homepage Component Split Design

**Date:** 2026-04-03
**Status:** Approved

## Goal

Split `pages/index.js` (~934 lines) into focused, single-purpose files following the existing pattern established by `pages/resume/`.

## File Structure

```
pages/
  index.js                  (~40 lines — composition, Head, scroll bar, ambient glow)
  home/
    Nav.js                  Navigation bar
    Hero.js                 Photo, name, eyebrow, subtitle, tech stack, bio, CTA, mesh blobs
    AuroraBackground.js     WebGL helix ribbon animation (two-canvas glow+crisp approach)
    NeuralBackground.js     Canvas 3D node graph animation with signals
    WorkCards.js            Selected work grid with intersection-observer entrance animation
    Footer.js               Contact links and copyright line
data/
  home-data.js              techStack, projects, and contactLinks arrays
styles/
  home.css                  All CSS currently in the <style> JSX block in index.js
```

## Component Responsibilities

### `pages/index.js`
- Imports and renders: `Nav`, `Hero`, `WorkCards`, `Footer`
- Contains: `Head` metadata, `useScrollProgress` hook, scroll progress bar div, ambient glow div
- Imports `styles/home.css`

### `pages/home/Nav.js`
- Self-contained nav bar with Resume, LinkedIn, GitHub links
- No props required; links are static

### `pages/home/Hero.js`
- Renders: `AuroraBackground`, `NeuralBackground`, mesh blob divs, photo, name, eyebrow, subtitle, tech stack row, bio paragraph, CTA button
- Imports `techStack` from `data/home-data.js`

### `pages/home/AuroraBackground.js`
- Full WebGL helix ribbon renderer (two canvases: glow + crisp)
- Self-contained; no props
- Exports: `AuroraBackground`

### `pages/home/NeuralBackground.js`
- Canvas 3D node graph with drift, rotation, and signal animations
- Self-contained; no props
- Exports: `NeuralBackground`

### `pages/home/WorkCards.js`
- Renders the project cards grid with intersection-observer entrance animation
- Imports `projects` from `data/home-data.js`

### `pages/home/Footer.js`
- Renders contact links and copyright
- Imports `contactLinks` from `data/home-data.js`

## Data

### `data/home-data.js`
Exports three named constants:
- `techStack` — array of `{ label, iconUrl?, faIcon? }`
- `projects` — array of `{ name, description, tags, accent, url, logo, logoStyle }`
- `contactLinks` — array of `{ href, label, icon, ariaLabel }` (currently inlined in footer)

## CSS

All styles from the `<style>` JSX block move verbatim to `styles/home.css`. Imported once in `pages/index.js` via `import '../styles/home.css'`. No styles are changed — this is a pure relocation.

## What Does Not Change

- No visual or behavioral changes
- No prop interfaces are added beyond what's needed for composition
- FontAwesome imports stay in each file that uses them
- The `derek` image import stays in `Hero.js`
