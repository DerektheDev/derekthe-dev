# Homepage CSS Modules Design

**Date:** 2026-04-03
**Status:** Approved

## Goal

Move all inline styles from the homepage components into per-component CSS Module files. This reduces JS noise, makes styles inspectable, and follows the CSS Modules pattern already available in the project.

## Scope

Four components have inline styles to migrate. `Nav.js` is already pure Tailwind and is out of scope.

## New Files

| File | Owns styles for |
|---|---|
| `pages/index.module.css` | Scroll progress bar, ambient glow |
| `pages/home/Hero.module.css` | Outer div overflow, photo wrapper dimensions, per-blob classes |
| `pages/home/WorkCards.module.css` | Section label, card base, card-accent, card body, description, tags, name label, hover states |
| `pages/home/Footer.module.css` | Divider, links container, copyright |

## Dynamic Values — CSS Custom Properties

Three runtime-dynamic values are passed as CSS variables via `style` prop and consumed in CSS:

### Scroll progress width (`index.js`)
```jsx
<div className={styles.progressBar} style={{ '--progress': scrollProgress }} />
```
```css
.progressBar { width: calc(var(--progress) * 100%); }
```

### Card stagger delay (`WorkCards.js`)
```jsx
<Tag className={styles.card} style={{ '--delay': `${i * 0.1}s` }} />
```
```css
.card {
  transition:
    opacity 0.5s ease var(--delay),
    transform 0.5s cubic-bezier(0.22,1,0.36,1) var(--delay);
}
```

### Card accent color (`WorkCards.js`)
```jsx
<div className={styles.cardAccent} style={{ '--accent': p.accent }} />
```
```css
.cardAccent { background: var(--accent); }
```

## Hover Behavior — JS Handlers → CSS

`WorkCards.js` currently uses `onMouseEnter`/`onMouseLeave` to imperatively set styles. These are replaced with CSS:

```css
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.4);
  border-color: #444;
}

.card:hover .cardAccent {
  filter: brightness(1.15);
}
```

The `onMouseEnter` and `onMouseLeave` props are removed entirely from the JSX.

## Intersection Observer Animation

The card entrance animation (opacity 0 → 1, translateY(20px) → 0) is driven by the IntersectionObserver in `WorkCards.js`. The observer sets `style.opacity` and `style.transform` directly on entry — this is JS-driven animation state, not static styling, and is left as-is.

The initial hidden state (`opacity: 0; transform: translateY(20px)`) moves into the `.card` CSS class.

## Blob Classes (`Hero.module.css`)

Each of the four blobs has unique position, size, color, and animation name. These become named classes:

```css
.blob1 { width: 520px; height: 520px; top: 5%;  left: 20%; background: rgba(251,146,60,0.22); animation: b1 14s ease-in-out infinite; }
.blob2 { width: 400px; height: 400px; top: 30%; left: 55%; background: rgba(234,88,12,0.18);  animation: b2 18s ease-in-out infinite; }
.blob3 { width: 460px; height: 360px; top: 50%; left: 10%; background: rgba(249,115,22,0.15); animation: b3 22s ease-in-out infinite; }
.blob4 { width: 340px; height: 340px; top: 10%; left: 65%; background: rgba(180,50,10,0.18);  animation: b4 16s ease-in-out infinite; }
```

The blob animation keyframes (`b1`–`b4`) already live in `home.css` and are not duplicated.

## What Stays in `home.css`

Global homepage classes that are referenced by multiple components or used as plain class names (not CSS Modules) remain in `home.css`:
- `:root` custom properties
- `body` background
- `.space-mono`, `.rise`, `.d1`–`.d6`, `.hero-name`
- `.tech-row`, `.tech-item`
- `.aurora-wrap`, `.c-glow`, `.c-crisp`
- `.mesh-bg`, `.blob` (base blob styles), blob keyframes
- `.photo-ring`, `coronaHeat` keyframe
- `.btn-fill`, `.btn-outline`
- `.contact-link`
- `.work-grid`, `.work-card-link`, media queries
- `.page-wrap::after` noise overlay

These are not migrated — they are consumed as plain class names across JSX and do not need module scoping.
