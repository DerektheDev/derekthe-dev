# Tailwind Removal Design Spec

**Date:** 2026-04-04
**Status:** Approved

## Goal

Fully remove Tailwind CSS from the project — dependency, config, PostCSS plugin, and all utility classes in JSX. Replace with per-component CSS Module files. Replace `@tailwind base` with a minimal handwritten reset in `globals.css`.

## Approach

Strict per-component CSS Modules. Every file that uses Tailwind gets a colocated `.module.css`. Homepage components already have modules and are extended. Resume and Greek page get new module files.

---

## Tailwind Value Reference

Exact CSS values for every Tailwind class used in the project. Implementation must use these values.

### Typography
| Tailwind | CSS |
|---|---|
| `text-4xl` | `font-size: 2.25rem; line-height: 2.5rem` |
| `text-3xl` | `font-size: 1.875rem; line-height: 2.25rem` |
| `text-2xl` | `font-size: 1.5rem; line-height: 2rem` |
| `text-[22px]` | `font-size: 22px` |
| `text-[20px]` | `font-size: 20px` |
| `text-[15px]` | `font-size: 15px` |
| `text-[12px]` | `font-size: 12px` |
| `text-[11px]` | `font-size: 11px` |
| `font-semibold` | `font-weight: 600` |
| `font-medium` | `font-weight: 500` |
| `font-normal` | `font-weight: 400` |
| `font-light` | `font-weight: 300` |
| `leading-relaxed` | `line-height: 1.625` |
| `leading-5` | `line-height: 1.25rem` |
| `tracking-wide` | `letter-spacing: 0.025em` |
| `tracking-[0.12em]` | `letter-spacing: 0.12em` |
| `tracking-[0.2em]` | `letter-spacing: 0.2em` |
| `tracking-[0.06em]` | `letter-spacing: 0.06em` |
| `text-center` | `text-align: center` |
| `text-left` | `text-align: left` |
| `text-right` | `text-align: right` |
| `underline` | `text-decoration: underline` |
| `hover:no-underline` | `text-decoration: none` on hover |

### Colors
| Tailwind | CSS |
|---|---|
| `text-white` | `color: #fff` |
| `text-gray-200` | `color: #e5e7eb` |
| `text-gray-300` | `color: #d1d5db` |
| `text-gray-400` | `color: #9ca3af` |
| `text-orange-400` | `color: #fb923c` |
| `hover:text-orange-400` | `color: #fb923c` on hover |
| `bg-[#1a1a1a]` | `background-color: #1a1a1a` |
| `border-white/[0.05]` | `border-color: rgba(255, 255, 255, 0.05)` |
| `border-orange-400` | `border-color: #fb923c` |
| `border-gray-600` | `border-color: #4b5563` |
| `opacity-60` | `opacity: 0.6` |
| `transition-colors` | `transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms` |

### Sizing & Layout
| Tailwind | CSS |
|---|---|
| `min-h-screen` | `min-height: 100vh` |
| `h-screen` | `height: 100vh` |
| `h-full` | `height: 100%` |
| `w-full` | `width: 100%` |
| `w-3` | `width: 0.75rem` |
| `h-3` | `height: 0.75rem` |
| `w-3.5` | `width: 0.875rem` |
| `max-w-screen-lg` | `max-width: 1024px` |
| `max-w-4xl` | `max-width: 56rem` |
| `max-w-3xl` | `max-width: 48rem` |
| `max-w-xl` | `max-width: 36rem` |
| `max-w-sm` | `max-width: 24rem` |
| `mx-auto` | `margin-left: auto; margin-right: auto` |
| `shrink-0` | `flex-shrink: 0` |

### Spacing
| Tailwind | CSS |
|---|---|
| `px-6` | `padding-left: 1.5rem; padding-right: 1.5rem` |
| `px-8` | `padding-left: 2rem; padding-right: 2rem` |
| `px-12` | `padding-left: 3rem; padding-right: 3rem` |
| `py-3` | `padding-top: 0.75rem; padding-bottom: 0.75rem` |
| `py-4` | `padding-top: 1rem; padding-bottom: 1rem` |
| `py-5` | `padding-top: 1.25rem; padding-bottom: 1.25rem` |
| `pt-20` | `padding-top: 5rem` |
| `pb-6` | `padding-bottom: 1.5rem` |
| `pb-10` | `padding-bottom: 2.5rem` |
| `pb-16` | `padding-bottom: 4rem` |
| `mb-2` | `margin-bottom: 0.5rem` |
| `mb-3` | `margin-bottom: 0.75rem` |
| `mb-4` | `margin-bottom: 1rem` |
| `mb-5` | `margin-bottom: 1.25rem` |
| `mb-6` | `margin-bottom: 1.5rem` |
| `mb-10` | `margin-bottom: 2.5rem` |
| `-ml-12` | `margin-left: -3rem` |
| `mt-12` | `margin-top: 3rem` |
| `my-12` | `margin-top: 3rem; margin-bottom: 3rem` |
| `gap-1.5` | `gap: 0.375rem` |
| `gap-2` | `gap: 0.5rem` |
| `gap-4` | `gap: 1rem` |
| `gap-6` | `gap: 1.5rem` |
| `gap-10` | `gap: 2.5rem` |
| `gap-x-4` | `column-gap: 1rem` |
| `gap-x-10` | `column-gap: 2.5rem` |
| `gap-x-12` | `column-gap: 3rem` |
| `gap-y-2` | `row-gap: 0.5rem` |
| `gap-y-4` | `row-gap: 1rem` |

### Flexbox & Grid
| Tailwind | CSS |
|---|---|
| `flex` | `display: flex` |
| `flex-col` | `flex-direction: column` |
| `items-center` | `align-items: center` |
| `justify-center` | `justify-content: center` |
| `justify-between` | `justify-content: space-between` |
| `justify-end` | `justify-content: flex-end` |
| `justify-self-center` | `justify-self: center` |
| `justify-self-end` | `justify-self: end` |
| `flex-wrap` | `flex-wrap: wrap` |
| `grid` | `display: grid` |
| `grid-cols-1` | `grid-template-columns: repeat(1, minmax(0, 1fr))` |
| `md:grid-cols-2` | `grid-template-columns: repeat(2, minmax(0, 1fr))` at ≥768px |
| `md:grid-cols-[1fr_auto_1fr]` | `grid-template-columns: 1fr auto 1fr` at ≥768px |
| `md:order-2` | `order: 2` at ≥768px |

### Positioning & Borders
| Tailwind | CSS |
|---|---|
| `relative` | `position: relative` |
| `z-10` | `z-index: 10` |
| `overflow-hidden` | `overflow: hidden` |
| `rounded-full` | `border-radius: 9999px` |
| `rounded-lg` | `border-radius: 0.5rem` |
| `rounded` | `border-radius: 0.25rem` |
| `object-cover` | `object-fit: cover` |
| `border-b` | `border-bottom-width: 1px; border-bottom-style: solid` |
| `border-b-4` | `border-bottom-width: 4px; border-bottom-style: solid` |
| `border-4` | `border-width: 4px; border-style: solid` |
| `md:border-l-[30px]` | `border-left-width: 30px; border-left-style: solid` at ≥768px |
| `shadow-lg` | `box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)` |

### Pseudo-class utilities
| Tailwind | CSS |
|---|---|
| `only:h-full` | `height: 100%` when `:only-child` |
| `screen:my-12` (custom) | `margin-top: 3rem; margin-bottom: 3rem` inside `@media screen` |

### Responsive breakpoint
All `md:` classes apply at `@media (min-width: 768px)`.

---

## Section 1: Infrastructure

### `styles/globals.css`
Remove:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Add minimal reset (replaces Tailwind Preflight for what this site uses):
```css
h1, h2, h3, h4, h5, h6 {
  font-size: inherit;
  font-weight: inherit;
}

img, svg {
  display: block;
}

img {
  max-width: 100%;
  height: auto;
}

button, input, select, textarea {
  font-family: inherit;
}
```

The existing rules (`html,body { padding: 0; margin: 0 }`, `a { color: inherit; text-decoration: none }`, `* { box-sizing: border-box }`) are retained.

### `postcss.config.js`
Remove `tailwindcss: {}` from plugins. Keep `autoprefixer: {}`.

```js
module.exports = {
  plugins: {
    autoprefixer: {},
  },
}
```

### `tailwind.config.js`
Delete entirely.

### `package.json`
Remove `tailwindcss` from `devDependencies`. Run `npm install` to update lockfile.

---

## Section 2: Homepage CSS Modules

### New: `pages/home/Nav.module.css`

```css
.nav {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.link {
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #d1d5db;
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.link:hover {
  color: #fb923c;
}

.linkWithIcon {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #d1d5db;
  transition-property: color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.linkWithIcon:hover {
  color: #fb923c;
}

.icon {
  width: 0.75rem;
  height: 0.75rem;
}
```

**`pages/home/Nav.js` changes:** Replace `className="rise d1 relative z-10 flex justify-center gap-10 px-6 py-5 border-b border-white/[0.05]"` with `className={\`rise d1 ${styles.nav}\`}`. Replace link classNames with `styles.link` / `styles.linkWithIcon`. Replace icon classNames with `styles.icon`. Import `styles from "./Nav.module.css"`.

---

### Extend: `pages/index.module.css`

Add:
```css
.pageWrap {
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #fff;
  position: relative;
}
```

**`pages/index.js` changes:** Replace `className="page-wrap min-h-screen bg-[#1a1a1a] text-white space-mono relative"` with `className={\`page-wrap space-mono ${styles.pageWrap}\`}`.

---

### Extend: `pages/home/Hero.module.css`

Add:
```css
.section {
  position: relative;
  z-index: 10;
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
  padding: 5rem 1.5rem 4rem;
  text-align: center;
}

.photoRingContainer {
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  overflow: hidden;
}

.photo {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.greeting {
  font-size: 22px;
  color: #fb923c;
  letter-spacing: 0.12em;
  margin-bottom: 0.75rem;
}

.heroName {
  color: #fff;
  margin-bottom: 1.5rem;
}

.role {
  font-size: 20px;
    color: #9ca3af;
  margin-bottom: 1.25rem;
  line-height: 1.625;
}

.oreillyLink {
  color: #e5e7eb;
  font-weight: 500;
}

.oreillyLink:hover {
  color: #fb923c;
  transition-property: color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.bio {
  font-size: 15px;
  color: #9ca3af;
  line-height: 1.625;
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2.5rem;
}

.highlight {
  color: #e5e7eb;
  font-weight: 500;
}

.buttonRow {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.resumeBtn {
  font-size: 15px;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  letter-spacing: 0.025em;
}
```

**`pages/home/Hero.js` changes:** Replace all remaining Tailwind classNames with module classes. The `rise d2 d3 d4 d5 d6` animation classes from `home.css` are retained alongside module classes.

---

### Extend: `pages/home/Footer.module.css`

Add:
```css
.footer {
  position: relative;
  z-index: 10;
  max-width: 56rem;
  margin-left: auto;
  margin-right: auto;
  padding: 0 1.5rem 2.5rem;
}

.contactLink {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 12px;
  color: #d1d5db;
  letter-spacing: 0.06em;
  transition-property: color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.contactLink:hover {
  color: #fb923c;
}

.contactIcon {
  width: 0.875rem;
  opacity: 0.6;
}
```

**`pages/home/Footer.js` changes:** Replace footer wrapper and contact link Tailwind classes with module classes.

---

### Extend: `pages/home/WorkCards.module.css`

Add:
```css
.section {
  position: relative;
  z-index: 10;
  max-width: 56rem;
  margin-left: auto;
  margin-right: auto;
  padding: 0 1.5rem 4rem;
}
```

**`pages/home/WorkCards.js` changes:** Replace `className="relative z-10 max-w-4xl mx-auto px-6 pb-16"` on the `<section>` with `className={styles.section}`.

---

## Section 3: Resume CSS Modules

All new files.

### `pages/resume/index.module.css`

```css
.main {
  max-width: 1024px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  margin-top: 3rem;
}

@media screen {
  .main {
    margin-top: 3rem;
    margin-bottom: 3rem;
  }
}

@media (min-width: 768px) {
  .main {
    padding-left: 3rem;
    padding-right: 3rem;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  column-gap: 2.5rem;
  row-gap: 1rem;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.col {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  justify-content: space-between;
}
```

---

### `pages/resume/header.module.css`

```css
.header {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  padding-bottom: 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 4px solid #fb923c;
  row-gap: 1rem;
  column-gap: 3rem;
}

@media (min-width: 768px) {
  .header {
    grid-template-columns: 1fr auto 1fr;
  }
}

.leftSection {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
}

@media (min-width: 768px) {
  .leftSection {
    text-align: left;
  }
}

.nameWrapper {
  position: relative;
}

.highlightBar {
  border-left: 30px solid #fb923c;
  height: 100%;
  position: absolute;
  margin-left: -3rem;
  display: none;
}

@media (min-width: 768px) {
  .highlightBar {
    display: block;
  }
}

.name {
  font-size: 2.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 400;
}

.description {
  font-weight: 300;
}

.photoContainer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.photoBorder {
  border: 4px solid #4b5563;
  border-radius: 9999px;
  display: flex;
  align-items: center;
}

.photo {
  border-radius: 9999px;
}

.contactNav {
  font-weight: 300;
  justify-self: center;
}

@media (min-width: 768px) {
  .contactNav {
    text-align: right;
    justify-self: end;
  }
}

.contactList {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}

.contactItem {
  display: flex;
  gap: 1rem;
  align-items: center;
}

@media (min-width: 768px) {
  .contactItem {
    justify-content: flex-end;
  }
}

.contactIcon {
  order: 0;
}

@media (min-width: 768px) {
  .contactIcon {
    order: 2;
  }
}

.contactLink {
  text-decoration: underline;
}

.contactLink:hover {
  text-decoration: none;
}
```

---

### `pages/resume/key-point.module.css`

```css
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
}

.wrapper:only-child {
  height: 100%;
}

.sectionTitle {
  font-size: 1.875rem;
  font-weight: 400;
}

.sectionSubtitle {
  font-size: 1.5rem;
  font-weight: 600;
}

.entry {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.entryInner {
  position: relative;
}

.highlightBar {
  border-left: 30px solid #fb923c;
  height: 100%;
  position: absolute;
  margin-left: -3rem;
  display: none;
}

@media (min-width: 768px) {
  .highlightBar {
    display: block;
  }
}

.dateRow {
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  font-weight: 300;
}

.dateLabel {
  color: #fb923c;
}

.entryTitle {
  font-size: 1.5rem;
  font-weight: 400;
}

.entryLink {
  text-decoration: underline;
}

.entryLink:hover {
  text-decoration: none;
}

.entrySubtitle {
  font-size: 1.5rem;
  font-weight: 300;
}

.bullets {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.bullet {
  font-weight: 300;
}
```

---

### `pages/resume/list.module.css`

```css
.title {
  font-size: 1.875rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  column-gap: 1rem;
  row-gap: 0.5rem;
  font-weight: 300;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.column {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item {
  line-height: 1.25rem;
}
```

---

### `pages/resume/short-list.module.css`

```css
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.title {
  font-size: 1.875rem;
  font-weight: 400;
}

.list {
  font-weight: 300;
}
```

---

## Section 4: Greek CSS Module

### `pages/greek/index.module.css`

```css
.main {
  max-width: 1024px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 3rem;
  margin-bottom: 3rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

@media (min-width: 768px) {
  .main {
    padding-left: 3rem;
    padding-right: 3rem;
  }
}

.card {
  display: flex;
  flex-direction: column;
  padding: 1rem 1.5rem;
  max-width: 24rem;
  border-radius: 0.25rem;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  align-items: center;
  border: 1px solid #4b5563;
  height: 100vh;
  justify-content: center;
}

.letter {
  font-size: 2.25rem;
  line-height: 2.5rem;
}

.name {
  font-size: 2.25rem;
  line-height: 2.5rem;
}
```

---

## Files Changed Summary

| Action | File |
|---|---|
| Modify | `styles/globals.css` |
| Modify | `postcss.config.js` |
| Delete | `tailwind.config.js` |
| Modify | `package.json` |
| **New** | `pages/home/Nav.module.css` |
| Modify | `pages/home/Nav.js` |
| Extend | `pages/index.module.css` |
| Modify | `pages/index.js` |
| Extend | `pages/home/Hero.module.css` |
| Modify | `pages/home/Hero.js` |
| Extend | `pages/home/Footer.module.css` |
| Modify | `pages/home/Footer.js` |
| Extend | `pages/home/WorkCards.module.css` |
| Modify | `pages/home/WorkCards.js` |
| **New** | `pages/resume/index.module.css` |
| Modify | `pages/resume/index.js` |
| **New** | `pages/resume/header.module.css` |
| Modify | `pages/resume/header.js` |
| **New** | `pages/resume/key-point.module.css` |
| Modify | `pages/resume/key-point.js` |
| **New** | `pages/resume/list.module.css` |
| Modify | `pages/resume/list.js` |
| **New** | `pages/resume/short-list.module.css` |
| Modify | `pages/resume/short-list.js` |
| **New** | `pages/greek/index.module.css` |
| Modify | `pages/greek/index.js` |
