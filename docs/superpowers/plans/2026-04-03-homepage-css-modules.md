# Homepage CSS Modules Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move all inline styles from homepage components into per-component CSS Module files, using CSS custom properties for the three runtime-dynamic values.

**Architecture:** Each component that has inline styles gets a colocated `.module.css` file. Static styles move directly into classes. Dynamic values (scroll progress, card stagger delay, card accent color) are passed as CSS custom properties via `style` prop and consumed in CSS. JS hover handlers in WorkCards are replaced with CSS `:hover` rules using a toggled `.appeared` class to avoid transition-delay conflicts.

**Tech Stack:** Next.js CSS Modules, CSS custom properties

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `pages/index.module.css` | Scroll progress bar, ambient glow |
| Modify | `pages/index.js` | Import module, replace inline styles |
| Create | `pages/home/Hero.module.css` | Outer overflow, photo wrapper size, blob variants |
| Modify | `pages/home/Hero.js` | Import module, replace inline styles |
| Create | `pages/home/WorkCards.module.css` | All card styles + hover states via CSS |
| Modify | `pages/home/WorkCards.js` | Import module, replace inline styles, remove JS hover handlers |
| Create | `pages/home/Footer.module.css` | Divider, links container, copyright |
| Modify | `pages/home/Footer.js` | Import module, replace inline styles |
| Create | `pages/home/NeuralBackground.module.css` | Canvas positioning |
| Modify | `pages/home/NeuralBackground.js` | Import module, replace inline canvas style |

---

## Task 1: index.module.css — scroll progress bar and ambient glow

**Files:**
- Create: `pages/index.module.css`
- Modify: `pages/index.js`

**Note:** This is CSS-only refactoring with no behavior changes. Each task ends with a visual check in the browser instead of unit tests.

- [ ] **Step 1: Create `pages/index.module.css`**

```css
.progressBar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  height: 3px;
  width: calc(var(--progress) * 100%);
  background: #fb923c;
  border-radius: 0 2px 2px 0;
  pointer-events: none;
  transition: width 0.05s linear;
}

.ambientGlow {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 600px;
  background: radial-gradient(ellipse at 50% -10%, rgba(251,146,60,0.09) 0%, transparent 65%);
  pointer-events: none;
  z-index: 0;
}
```

- [ ] **Step 2: Update `pages/index.js`**

Replace the full file contents:

```jsx
import { useEffect, useState } from "react";
import Head from "next/head";
import Nav from "./home/Nav";
import Hero from "./home/Hero";
import WorkCards from "./home/WorkCards";
import Footer from "./home/Footer";
import styles from "./index.module.css";

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let rafId;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const el = document.documentElement;
        const scrolled = el.scrollTop || document.body.scrollTop;
        const total = el.scrollHeight - el.clientHeight;
        setProgress(total > 0 ? scrolled / total : 0);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);
  return progress;
}

export default function Home() {
  const scrollProgress = useScrollProgress();

  return (
    <>
      <Head>
        <title>Derek Montgomery — Software Engineer</title>
        <meta name="description" content="Senior Software Engineer specializing in Rails, React, and AI." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      </Head>

      <div className="page-wrap min-h-screen bg-[#1a1a1a] text-white space-mono relative">

        {/* Scroll progress bar */}
        <div className={styles.progressBar} style={{ '--progress': scrollProgress }} />

        {/* Ambient glow */}
        <div className={styles.ambientGlow} />

        <Nav />
        <Hero />
        <WorkCards />
        <Footer />

      </div>
    </>
  );
}
```

- [ ] **Step 3: Start dev server and verify**

```bash
npm run dev
```

Open http://localhost:3000. Confirm:
- Orange scroll progress bar appears at top when scrolling
- Page looks identical to before

- [ ] **Step 4: Commit**

```bash
git add pages/index.module.css pages/index.js
git commit -m "refactor: move index.js inline styles to index.module.css"
```

---

## Task 2: Hero.module.css — overflow, photo wrapper, blob variants

**Files:**
- Create: `pages/home/Hero.module.css`
- Modify: `pages/home/Hero.js`

**Note on blob keyframes:** `b1`–`b4` `@keyframes` are defined in `styles/home.css` (a global CSS file, not a module), so they are globally scoped and can be referenced by name from any CSS file including modules.

- [ ] **Step 1: Create `pages/home/Hero.module.css`**

```css
.heroOuter {
  overflow: hidden;
}

.photoWrapper {
  width: 148px;
  height: 148px;
}

.blob1 {
  width: 520px;
  height: 520px;
  top: 5%;
  left: 20%;
  background: rgba(251, 146, 60, 0.22);
  animation: b1 14s ease-in-out infinite;
}

.blob2 {
  width: 400px;
  height: 400px;
  top: 30%;
  left: 55%;
  background: rgba(234, 88, 12, 0.18);
  animation: b2 18s ease-in-out infinite;
}

.blob3 {
  width: 460px;
  height: 360px;
  top: 50%;
  left: 10%;
  background: rgba(249, 115, 22, 0.15);
  animation: b3 22s ease-in-out infinite;
}

.blob4 {
  width: 340px;
  height: 340px;
  top: 10%;
  left: 65%;
  background: rgba(180, 50, 10, 0.18);
  animation: b4 16s ease-in-out infinite;
}
```

- [ ] **Step 2: Update `pages/home/Hero.js`**

```jsx
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import derek from "../../public/derek-linkedin.jpg";
import { techStack } from "../../data/home-data";
import AuroraBackground from "./AuroraBackground";
import NeuralBackground from "./NeuralBackground";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <div className={`relative ${styles.heroOuter}`}>
      <AuroraBackground />
      <NeuralBackground />
      <div className="mesh-bg">
        <div className={`blob ${styles.blob1}`} />
        <div className={`blob ${styles.blob2}`} />
        <div className={`blob ${styles.blob3}`} />
        <div className={`blob ${styles.blob4}`} />
      </div>
      <section className="relative z-10 max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">

        <div className={`rise d2 mx-auto mb-10 relative ${styles.photoWrapper}`}>
          <div className="w-full h-full rounded-full overflow-hidden photo-ring">
            <Image src={derek} alt="Derek Montgomery" width={148} height={148} className="object-cover w-full h-full" priority />
          </div>
        </div>

        <div>
          <p className="rise d3 text-[22px] text-orange-400 tracking-[0.12em] mb-3">
            Hey, I'm
          </p>

          <h1 className="rise d4 hero-name text-white mb-6">
            Derek Montgomery
          </h1>

          <p className="rise d5 text-[20px] text-gray-400 mb-5 leading-relaxed">
            Senior Software Engineer at{" "}
            <a href="https://www.oreilly.com/" target="_blank" rel="noreferrer" className="text-gray-200 font-medium hover:text-orange-400 transition-colors">O'Reilly Media</a>
          </p>

          <div className="rise d5 tech-row my-9">
            {techStack.map(({ label, iconUrl, faIcon }) => (
              <span key={label} className="tech-item">
                {iconUrl
                  ? <img src={iconUrl} alt={label} />
                  : <FontAwesomeIcon icon={faIcon} className="fa-brain" />
                }
                {label}
              </span>
            ))}
          </div>

          <p className="rise d6 text-[15px] text-gray-400 leading-relaxed max-w-xl mx-auto mb-10">
            With over <span className="text-gray-200 font-medium">15 years</span> building digital products, I've got experience{" "}
            <span className="text-gray-200 font-medium">leading</span> engineering teams,{" "}
            <span className="text-gray-200 font-medium">building</span> startups, and{" "}
            <span className="text-gray-200 font-medium">consulting</span> for large corporations.
          </p>

          <div className="rise d6 flex gap-4 justify-center">
            <a href="/resume" className="btn-fill text-[15px] px-8 py-3 rounded-lg tracking-wide">
              View Resume
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Verify in browser**

Refresh http://localhost:3000. Confirm:
- Hero section looks identical (orange blobs animating, photo with ring glow, text)
- No content overflow visible

- [ ] **Step 4: Commit**

```bash
git add pages/home/Hero.module.css pages/home/Hero.js
git commit -m "refactor: move Hero.js inline styles to Hero.module.css"
```

---

## Task 3: WorkCards.module.css — card styles and CSS hover

**Files:**
- Create: `pages/home/WorkCards.module.css`
- Modify: `pages/home/WorkCards.js`

**Approach for card animation + hover:**
The entrance animation (opacity 0→1, translateY 20px→0) is handled by an IntersectionObserver that adds a `.appeared` class instead of directly setting `style.opacity`/`style.transform`. This avoids the specificity conflict where inline styles would block CSS `:hover` from overriding `transform`. The `.appeared` class also resets the transition so hover has no stagger delay.

- [ ] **Step 1: Create `pages/home/WorkCards.module.css`**

```css
.sectionLabel {
  font-size: 18px;
  letter-spacing: 0.18em;
  color: #ccc;
  text-align: center;
  margin-bottom: 2rem;
  margin-top: 4rem;
}

.card {
  background: #222;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #2a2a2a;
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.5s ease var(--delay, 0s),
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) var(--delay, 0s);
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
}

/* Added by IntersectionObserver when card enters viewport */
.appeared {
  opacity: 1;
  transform: none;
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}

.appeared:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  border-color: #444;
}

.appeared:hover .cardAccent {
  filter: brightness(1.15);
}

.cardAccent {
  height: 100px;
  background: var(--accent);
  position: relative;
  transition: filter 0.22s cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cardName {
  position: absolute;
  bottom: 10px;
  left: 12px;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 22px;
  letter-spacing: 0.04em;
  color: #fff;
}

.cardBody {
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.cardDescription {
  font-size: 14px;
  color: #aaa;
  line-height: 1.55;
  margin-bottom: 10px;
  flex: 1;
}

.cardTags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.tag {
  font-size: 12px;
  background: #2a2a2a;
  color: #aaa;
  padding: 3px 7px;
  border-radius: 4px;
  font-family: 'Space Mono', monospace;
  letter-spacing: 0.05em;
}
```

- [ ] **Step 2: Update `pages/home/WorkCards.js`**

```jsx
import { useEffect, useRef } from "react";
import { projects } from "../../data/home-data";
import styles from "./WorkCards.module.css";

export default function WorkCards() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll(`.${styles.card}`);
    if (!cards) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.appeared);
          }
        });
      },
      { threshold: 0.15 }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 max-w-4xl mx-auto px-6 pb-16">
      <p className={styles.sectionLabel}>
        Selected Work
      </p>
      <div className="work-grid">
        {projects.map((p, i) => {
          const Tag = p.url ? 'a' : 'div';
          const linkProps = p.url ? { href: p.url, target: '_blank', rel: 'noreferrer' } : {};
          return (
            <Tag
              key={p.name}
              {...linkProps}
              className={`${styles.card}${p.url ? ' work-card-link' : ''}`}
              style={{ '--delay': `${i * 0.1}s` }}
              aria-label={p.url ? `${p.name} — ${p.description} (opens in new tab)` : undefined}
            >
              <div
                className={styles.cardAccent}
                style={{ '--accent': p.accent }}
              >
                <div className={styles.cardName}>
                  {p.name}
                </div>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.cardDescription}>
                  {p.description}
                </p>
                <div className={styles.cardTags}>
                  {p.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Tag>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify in browser**

Refresh http://localhost:3000. Scroll down to cards. Confirm:
- Cards animate in with stagger delay as you scroll down
- Hovering a card lifts it with shadow and brightens the accent bar
- Card accent colors match the original
- Tags render correctly with monospace font
- Linked cards show focus outline when tabbing through

- [ ] **Step 4: Commit**

```bash
git add pages/home/WorkCards.module.css pages/home/WorkCards.js
git commit -m "refactor: move WorkCards.js inline styles to WorkCards.module.css, replace JS hover handlers with CSS"
```

---

## Task 4: Footer.module.css — divider, links container, copyright

**Files:**
- Create: `pages/home/Footer.module.css`
- Modify: `pages/home/Footer.js`

- [ ] **Step 1: Create `pages/home/Footer.module.css`**

```css
.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(251, 146, 60, 0.3), transparent);
  margin-bottom: 2rem;
}

.linksContainer {
  display: flex;
  gap: 24px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.copyright {
  text-align: center;
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.1em;
  margin-top: 1.5rem;
}
```

- [ ] **Step 2: Update `pages/home/Footer.js`**

```jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { contactLinks } from "../../data/home-data";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className="relative z-10 max-w-4xl mx-auto px-6 pb-10" aria-label="Contact">
      <div className={styles.divider} />
      <div className={styles.linksContainer}>
        {contactLinks.map(({ href, label, icon, ariaLabel }) => (
          <a key={label} href={href} aria-label={ariaLabel}
            className="contact-link flex items-center gap-2 text-[12px] text-gray-300 hover:text-orange-400 transition-colors tracking-[0.06em]">
            <FontAwesomeIcon icon={icon} className="w-3.5 opacity-60" aria-hidden="true" />
            {label}
          </a>
        ))}
      </div>
      <p className={styles.copyright}>
        © 2026 Derek Montgomery
      </p>
    </footer>
  );
}
```

- [ ] **Step 3: Verify in browser**

Refresh http://localhost:3000. Scroll to footer. Confirm:
- Orange gradient divider line renders
- Contact links are centered and spaced correctly
- Copyright text appears at bottom

- [ ] **Step 4: Commit**

```bash
git add pages/home/Footer.module.css pages/home/Footer.js
git commit -m "refactor: move Footer.js inline styles to Footer.module.css"
```

---

## Task 5: NeuralBackground.module.css — canvas positioning

**Files:**
- Create: `pages/home/NeuralBackground.module.css`
- Modify: `pages/home/NeuralBackground.js`

- [ ] **Step 1: Create `pages/home/NeuralBackground.module.css`**

```css
.canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}
```

- [ ] **Step 2: Update the return statement in `pages/home/NeuralBackground.js`**

Add the import at the top of the file (after the existing imports):

```js
import styles from "./NeuralBackground.module.css";
```

Replace the return statement:

```jsx
return (
  <canvas
    ref={canvasRef}
    className={styles.canvas}
  />
);
```

- [ ] **Step 3: Verify in browser**

Refresh http://localhost:3000. Confirm:
- Neural network background animation renders correctly over the hero section
- No visual change from before

- [ ] **Step 4: Commit**

```bash
git add pages/home/NeuralBackground.module.css pages/home/NeuralBackground.js
git commit -m "refactor: move NeuralBackground.js inline canvas style to NeuralBackground.module.css"
```
