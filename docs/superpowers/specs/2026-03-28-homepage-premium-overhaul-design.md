# Homepage Premium Overhaul — Design Spec

**Date:** 2026-03-28
**Branch:** homepage
**File:** `pages/index.js`

---

## Overview

Upgrade the existing homepage from a polished static hero to a fully "Alive" premium experience. The page already has strong bones (3D neural net, animated blobs, corona photo ring, staggered rise-in entrance). This spec layers in cursor interactivity, a shimmer hero name, two new scrollable sections (stats strip + selected work), and a cleaner footer.

The guiding principle: every enhancement should feel like it belongs — nothing fights for attention, everything responds.

---

## Interaction Layer

### 1. Custom Cursor

Replace the default OS cursor with a two-part custom cursor:

- **Dot** — 10px solid orange circle (`#fb923c`), follows cursor exactly, no lag
- **Ring** — 36px transparent circle with a 1.5px orange border, follows cursor with ~100ms lerp lag
- On hover over links/buttons: dot scales up to 16px, ring scales to 48px and fills with `rgba(251,146,60,0.08)`
- Implementation: a `useCursor` hook + two `position: fixed` `div`s at the top of the page wrapper, updated via `mousemove`

### 2. Neural Net Cursor Reactivity

Extend the existing `NeuralBackground` canvas animation. When the cursor moves over the canvas:

- Nodes within a **120px radius** of the cursor experience a repulsion force proportional to proximity
- Force equation: `force = (1 - dist/120) * 1.8`, applied as a velocity nudge away from cursor each frame
- Nodes gradually return to their natural drift once cursor moves away (exponential decay, factor `0.92` per frame)
- A shared `cursorPosRef = useRef({ x: -999, y: -999 })` is updated on `mousemove` and passed to `NeuralBackground` — no React state, no re-renders. The canvas animation loop reads it directly each frame.

### 3. Magnetic CTA Button

The "View Resume" button gets a magnetic pull effect:

- On `mousemove`, if cursor is within **70px** of the button's center, the button translates toward the cursor
- Max displacement: **±14px** on both axes
- Translation formula: `offset = (cursorDelta / 70) * 14`
- On `mouseleave`, button springs back to origin via CSS `transition: transform 0.4s cubic-bezier(0.22,1,0.36,1)`
- Implementation: `useRef` on the button + `mousemove` listener on the button's parent

### 4. Hero Parallax on Mousemove

Three layers of the hero move at different depths as the cursor moves, creating a subtle 3D illusion:

| Layer | Element | Movement factor |
|-------|---------|----------------|
| Far | Neural net canvas | Already moves (3D rotation) |
| Mid | Hero text (name, eyebrow, subtitle) | `0.012x` cursor offset |
| Near | Photo + corona ring | `0.022x` cursor offset |

- Movement is relative to viewport center: `delta = cursor - viewportCenter`
- Applied as `transform: translate(deltaX * factor, deltaY * factor)` on `mousemove`
- Smoothed with `requestAnimationFrame` lerp (factor `0.08`) to avoid jitter
- Each layer is wrapped in a new `div` so the parallax `transform` doesn't conflict with the existing rise-in `transform` on child elements

---

## Hero Enhancements

### 5. Name Shimmer

The "DEREK MONTGOMERY" Bebas Neue hero text gets a subtle moving light streak:

- CSS `background: linear-gradient(90deg, #fff 0%, rgba(255,210,160,0.9) 45%, #fff 100%)` clipped to text
- `background-size: 200%`, animated with `background-position` from `-200%` to `200%`
- Duration: 1.2s ease-in-out for the sweep, then idle for 5s, repeating — total cycle ~6.2s
- Implemented as a CSS `@keyframes` animation on the `.hero-name` element with `animation-fill-mode: both`

---

## New Sections

### 6. Stats Strip

A slim horizontal strip between the hero and the work section. Scrolls into view with a fade-rise animation triggered by `IntersectionObserver`.

**Stats to display (3 items):**

| Stat | Value | Label |
|------|-------|-------|
| Experience | 15+ | Years |
| Startups Built | 3+ | Ventures |
| Coffees | ∞ | Consumed |

- Numbers animate from `0` to their target value over `1.2s` using `requestAnimationFrame` easing
- Count-up triggers once when the strip enters the viewport (IntersectionObserver, `threshold: 0.4`)
- Separated by `1px` vertical dividers (`#2a2a2a`), centered layout
- Orange gradient dividers above and below the strip

### 7. Selected Work Cards

A `3-column` card grid below the stats strip. Each card:

**Card anatomy:**
- Top: a `100px` tall color block (dark gradient, project-specific accent), with the project name in Bebas Neue overlaid at the bottom-left
- Body: 2-line description, tech tag pills (`#2a2a2a` background, `#888` text)
- Border: `1px solid #2a2a2a`, `border-radius: 10px`, `overflow: hidden`

**Hover state:**
- Card lifts: `transform: translateY(-4px)`, `box-shadow: 0 12px 32px rgba(0,0,0,0.4)`
- Color block accent brightens: `filter: brightness(1.15)` with a subtle `rgba(251,146,60,0.12)` overlay fade-in
- Transition: `0.22s cubic-bezier(0.22,1,0.36,1)`

**Scroll reveal:**
- Cards stagger-fade in (opacity 0→1, translateY 20px→0) as the section enters viewport
- Card 1 delay: 0s, Card 2: 0.1s, Card 3: 0.2s

**Placeholder content (to be replaced by Derek):**

| # | Project Name | Description | Tags |
|---|-------------|-------------|------|
| 1 | O'Reilly Platform | Learning platform serving millions of engineers | Rails, React |
| 2 | AI Tooling | Internal AI-assisted developer tooling | AI, Ruby |
| 3 | [Your project] | [Your description] | [Tags] |

**Section heading:** `"Selected Work"` — `8px`, `tracking-[0.25em]`, `uppercase`, `text-gray-600`, centered, above the grid

---

## Scroll Progress Bar

A `3px` tall orange line fixed at the very top of the viewport (`z-index: 100`), above the nav:

- Width is `scroll / (scrollHeight - clientHeight) * 100%`
- Color: `#fb923c`
- Updated on `scroll` event via `requestAnimationFrame`
- No border-radius on left; `border-radius: 0 2px 2px 0` on right end

---

## Footer Upgrade

Replace the current contact section with a proper footer:

- A `1px` gradient divider above: `linear-gradient(90deg, transparent, rgba(251,146,60,0.3), transparent)`
- Single row: email · phone · LinkedIn icon · GitHub icon
- Icons: `faEnvelope` (replaces current `faPaperPlane`) from `free-solid-svg-icons`; `faMobile` already imported; `faLinkedinIn` already imported; `faGithub` added from `@fortawesome/free-brands-svg-icons`
- All items `text-gray-500`, hover `text-orange-400`, `transition-colors 0.2s`
- `8px` font size, `tracking-[0.15em]`, `uppercase`
- Small copyright line below: `© 2026 Derek Montgomery`, `text-gray-700`, centered

---

## Architecture & Implementation Notes

- All interaction hooks (`useCursor`, `useParallax`, `useMagnetic`, `useCountUp`, `useScrollProgress`) are implemented as custom React hooks in `pages/index.js` (inline, since this is a single-page Next.js file with no `src/` structure)
- The `NeuralBackground` component receives `cursorPos` as a prop and reads it via ref inside the animation loop — no re-renders triggered
- `IntersectionObserver` instances are created inside `useEffect` with proper cleanup
- The custom cursor `div`s are appended to a `<div id="cursor-root">` rendered at the top of the page wrapper, outside the main content flow
- All new CSS is added to the existing inline `<style>` block in `index.js`

---

## What Is Not Changing

- The existing neural net 3D rotation and signal animations
- The photo corona ring animation
- The mesh gradient blob animations
- The noise grain overlay
- The ambient top glow
- The staggered rise-in entrance animations
- The nav structure
- The tech stack row
- The bio paragraph

---

## Out of Scope

- Mobile-specific interaction fallbacks (cursor effects degrade gracefully — no custom cursor on touch devices via `@media (pointer: coarse)`)
- A loading/intro sequence
- Page transitions
- Dark/light mode toggle
