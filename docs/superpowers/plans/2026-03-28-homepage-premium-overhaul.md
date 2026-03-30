# Homepage Premium Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing homepage into a fully "Alive" premium experience with cursor interactivity, shimmer effects, parallax depth, and two new scrollable sections (stats strip + selected work cards).

**Architecture:** All changes live in `pages/index.js` — inline custom hooks (no `src/` structure exists), extended `NeuralBackground` component, new sections appended below the hero. No new files are created; no new npm packages are needed. Verification is browser-based (`yarn dev`) since there is no test framework.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS, Font Awesome, Canvas API (existing)

---

## File Structure

| File | Change |
|------|--------|
| `pages/index.js` | All changes — hooks, component extension, new sections, CSS, footer |

---

## Task 1: Scroll Progress Bar

**Files:**
- Modify: `pages/index.js`

- [ ] **Step 1: Add `useScrollProgress` hook above the `NeuralBackground` function**

Insert this after the existing imports and `techStack`/`contactLinks` definitions, before `function NeuralBackground()`:

```js
function useScrollProgress() {
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    let rafId;
    const onScroll = () => {
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
```

- [ ] **Step 2: Import `useState` — add it to the existing React import destructure at the top of `Home`**

The file uses `useEffect` and `useRef` already. Add `useState` to the import:

```js
import { useEffect, useRef, useState } from "react";
```

- [ ] **Step 3: Call the hook and render the bar in `Home`**

Inside `export default function Home()`, before the `return`, add:

```js
const scrollProgress = useScrollProgress();
```

Then at the very top of the JSX, as the first child inside `<div className="page-wrap ...">`, add:

```jsx
{/* Scroll progress bar */}
<div style={{
  position: 'fixed', top: 0, left: 0, zIndex: 200,
  height: '3px', width: `${scrollProgress * 100}%`,
  background: '#fb923c',
  borderRadius: '0 2px 2px 0',
  pointerEvents: 'none',
  transition: 'width 0.05s linear',
}} />
```

- [ ] **Step 4: Verify in browser**

Run `yarn dev` (if not already running). Scroll the page. The orange bar should grow from left to right as you scroll down. At the top it should be invisible (0 width); fully scrolled it should span the full viewport width.

- [ ] **Step 5: Commit**

```bash
git add pages/index.js
git commit -m "feat: add scroll progress bar"
```

---

## Task 2: Name Shimmer

**Files:**
- Modify: `pages/index.js`

- [ ] **Step 1: Add shimmer keyframe to the inline `<style>` block**

Inside the existing `<style>{`...`}</style>`, add after the `.btn-outline:active` rule:

```css
/* Name shimmer */
@keyframes nameShimmer {
  0%, 55%  { background-position: -200% center; }
  75%, 100% { background-position: 200% center; }
}
.hero-name {
  background: linear-gradient(
    90deg,
    #ffffff 0%,
    #ffffff 35%,
    rgba(255, 210, 160, 0.92) 48%,
    #ffffff 61%,
    #ffffff 100%
  );
  background-size: 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: nameShimmer 6.5s ease-in-out infinite,
             riseIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}
```

Note: This replaces the current `.hero-name` rule (which only sets font properties). Keep the font properties — merge them:

```css
.hero-name {
  font-family: 'Bebas Neue', sans-serif;
  font-weight: 400;
  font-size: clamp(72px, 12vw, 140px);
  line-height: 0.95;
  letter-spacing: 0.04em;
  background: linear-gradient(
    90deg,
    #ffffff 0%,
    #ffffff 35%,
    rgba(255, 210, 160, 0.92) 48%,
    #ffffff 61%,
    #ffffff 100%
  );
  background-size: 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: nameShimmer 6.5s ease-in-out infinite,
             riseIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}
```

- [ ] **Step 2: Verify in browser**

Reload the page. The name "DEREK MONTGOMERY" should still be white/light, and every ~6.5 seconds a warm golden-white shimmer streak should sweep across it from left to right. The rise-in entrance should still work on load.

- [ ] **Step 3: Commit**

```bash
git add pages/index.js
git commit -m "feat: add shimmer streak to hero name"
```

---

## Task 3: Custom Cursor

**Files:**
- Modify: `pages/index.js`

- [ ] **Step 1: Add `useCursor` hook**

Add this after `useScrollProgress`, before `function NeuralBackground()`:

```js
function useCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef(null);

  useEffect(() => {
    const onMove = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);

    const loop = () => {
      // Dot: instant
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${pos.current.x - 5}px, ${pos.current.y - 5}px)`;
      }
      // Ring: lerp
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${ringPos.current.x - 18}px, ${ringPos.current.y - 18}px)`;
      }
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);

    // Scale up on interactive elements
    const onEnter = () => {
      if (dotRef.current)  dotRef.current.style.transform += ' scale(1.6)';
      if (ringRef.current) { ringRef.current.style.width = '48px'; ringRef.current.style.height = '48px'; ringRef.current.style.background = 'rgba(251,146,60,0.08)'; }
    };
    const onLeave = () => {
      if (ringRef.current) { ringRef.current.style.width = '36px'; ringRef.current.style.height = '36px'; ringRef.current.style.background = 'transparent'; }
    };
    const addListeners = () => {
      document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    addListeners();

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return { dotRef, ringRef };
}
```

- [ ] **Step 2: Add `cursor: none` to the page and hide default cursor**

In the inline `<style>` block, add:

```css
/* Hide default cursor */
*, *::before, *::after { cursor: none !important; }
```

- [ ] **Step 3: Call the hook and render the cursor elements in `Home`**

Inside `Home`, add before the `return`:

```js
const { dotRef, ringRef } = useCursor();
```

Add these two `div`s as the first children inside `<div className="page-wrap ...">`, after the scroll progress bar:

```jsx
{/* Custom cursor */}
<div ref={dotRef} style={{
  position: 'fixed', top: 0, left: 0, zIndex: 9999,
  width: 10, height: 10, borderRadius: '50%',
  background: '#fb923c', pointerEvents: 'none',
  transition: 'width 0.15s, height 0.15s',
  willChange: 'transform',
}} />
<div ref={ringRef} style={{
  position: 'fixed', top: 0, left: 0, zIndex: 9998,
  width: 36, height: 36, borderRadius: '50%',
  border: '1.5px solid #fb923c', background: 'transparent',
  pointerEvents: 'none',
  transition: 'width 0.2s, height 0.2s, background 0.2s',
  willChange: 'transform',
}} />
```

- [ ] **Step 4: Disable cursor on touch devices**

In the inline `<style>` block, wrap the `cursor: none` rule:

```css
@media (pointer: fine) {
  *, *::before, *::after { cursor: none !important; }
}
```

- [ ] **Step 5: Verify in browser**

Move the mouse around the page. You should see a small orange dot that tracks exactly, and a larger orange ring that follows with a slight lag. Hover over "View Resume" or nav links — the ring should expand and fill slightly. On a touch device (or by switching DevTools to touch emulation), the default cursor should return.

- [ ] **Step 6: Commit**

```bash
git add pages/index.js
git commit -m "feat: add custom cursor with dot and lagging ring"
```

---

## Task 4: Neural Net Cursor Reactivity

**Files:**
- Modify: `pages/index.js`

- [ ] **Step 1: Add `cursorPosRef` to the `Home` component and pass it to `NeuralBackground`**

Inside `Home`, before the `return`, add:

```js
const cursorPosRef = useRef({ x: -999, y: -999 });
```

Add a `mousemove` listener to update it (inside a `useEffect` in `Home`):

```js
useEffect(() => {
  const onMove = (e) => { cursorPosRef.current = { x: e.clientX, y: e.clientY }; };
  window.addEventListener('mousemove', onMove);
  return () => window.removeEventListener('mousemove', onMove);
}, []);
```

Update the `NeuralBackground` usage in JSX to pass the ref:

```jsx
<NeuralBackground cursorPosRef={cursorPosRef} />
```

- [ ] **Step 2: Update `NeuralBackground` to accept and use `cursorPosRef`**

Change the function signature:

```js
function NeuralBackground({ cursorPosRef }) {
```

Inside the `draw` function, after the node drift loop (`nodes.forEach(n => { ... })`), add the cursor repulsion:

```js
// Cursor repulsion
const cp = cursorPosRef?.current;
if (cp && cp.x > 0) {
  nodes.forEach(n => {
    const p = project(n.lx, n.ly, n.lz);
    if (!p) return;
    const dx = p.sx - cp.x;
    const dy = p.sy - cp.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const REPEL_RADIUS = 120;
    if (dist < REPEL_RADIUS && dist > 0) {
      const force = (1 - dist / REPEL_RADIUS) * 1.8;
      // Convert screen-space nudge back to local-space velocity
      n.vx += (dx / dist) * force * 0.04;
      n.vy += (dy / dist) * force * 0.04;
    }
    // Decay back toward natural speed
    n.vx *= 0.96;
    n.vy *= 0.96;
  });
}
```

- [ ] **Step 3: Verify in browser**

Move the cursor over the neural net canvas. Nodes near the cursor should scatter away. Move slowly — you should see the net deform around your cursor like a force field. Move away — nodes should gradually settle back to their natural drift.

- [ ] **Step 4: Commit**

```bash
git add pages/index.js
git commit -m "feat: neural net nodes repel cursor"
```

---

## Task 5: Magnetic CTA Button

**Files:**
- Modify: `pages/index.js`

- [ ] **Step 1: Add `useMagnetic` hook**

Add after `useCursor`, before `function NeuralBackground()`:

```js
function useMagnetic(strength = 0.35) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const RADIUS = 70;
      if (dist < RADIUS) {
        const tx = dx * strength;
        const ty = dy * strength;
        el.style.transform = `translate(${tx}px, ${ty}px)`;
      }
    };
    const onLeave = () => {
      el.style.transform = 'translate(0px, 0px)';
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  return ref;
}
```

- [ ] **Step 2: Apply the hook to the CTA button**

In `Home`, add before the `return`:

```js
const ctaRef = useMagnetic(0.35);
```

Find the CTA `<a>` tag and add `ref={ctaRef}` and a transition for the spring-back:

```jsx
<a
  ref={ctaRef}
  href="/resume"
  className="btn-fill text-[15px] px-8 py-3 rounded-lg tracking-wide"
  style={{ display: 'inline-block', transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1)' }}
>
  View Resume
</a>
```

- [ ] **Step 3: Verify in browser**

Move the cursor toward (but not necessarily onto) the "View Resume" button. Within about 70px of center, the button should physically slide toward your cursor. Move away — it should spring back smoothly.

- [ ] **Step 4: Commit**

```bash
git add pages/index.js
git commit -m "feat: magnetic pull effect on CTA button"
```

---

## Task 6: Hero Parallax on Mousemove

**Files:**
- Modify: `pages/index.js`

- [ ] **Step 1: Add `useParallax` hook**

Add after `useMagnetic`, before `function NeuralBackground()`:

```js
function useParallax(factor) {
  const ref = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      target.current = {
        x: (e.clientX - cx) * factor,
        y: (e.clientY - cy) * factor,
      };
    };
    window.addEventListener('mousemove', onMove);

    const loop = () => {
      current.current.x += (target.current.x - current.current.x) * 0.08;
      current.current.y += (target.current.y - current.current.y) * 0.08;
      if (ref.current) {
        ref.current.style.transform =
          `translate(${current.current.x}px, ${current.current.y}px)`;
      }
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [factor]);

  return ref;
}
```

- [ ] **Step 2: Create the two parallax layer refs in `Home`**

Add before the `return`:

```js
const parallaxTextRef  = useParallax(0.012);   // mid layer — text
const parallaxPhotoRef = useParallax(0.022);   // near layer — photo
```

- [ ] **Step 3: Wrap hero text in mid-layer div**

Inside the `<section>` in the hero, wrap the eyebrow + name + subtitle + tech row + bio + CTAs in a new div:

```jsx
<div ref={parallaxTextRef} style={{ willChange: 'transform' }}>
  {/* Eyebrow */}
  <p className="rise d3 ...">Hey, I'm</p>
  {/* Name */}
  <h1 className="rise d4 hero-name ...">Derek Montgomery</h1>
  {/* Subtitle */}
  <p className="rise d5 ...">Senior Software Engineer at ...</p>
  {/* Tech stack */}
  <div className="rise d5 tech-row ...">...</div>
  {/* Bio */}
  <p className="rise d6 ...">With over ...</p>
  {/* CTAs */}
  <div className="rise d6 ...">...</div>
</div>
```

- [ ] **Step 4: Wrap photo in near-layer div**

Wrap just the photo `<div>` in:

```jsx
<div ref={parallaxPhotoRef} style={{ willChange: 'transform' }}>
  <div className="rise d2 mx-auto mb-10 relative" style={{ width: 148, height: 148 }}>
    <div className="w-full h-full rounded-full overflow-hidden photo-ring">
      <Image src={derek} alt="Derek Montgomery" width={148} height={148} className="object-cover w-full h-full" priority />
    </div>
  </div>
</div>
```

- [ ] **Step 5: Verify in browser**

Move the cursor around the hero area. The photo should shift slightly more than the text, creating a sense of depth — like the photo is floating closer to you. The neural net canvas moves independently behind them. The overall effect should feel like looking into a 3D scene.

- [ ] **Step 6: Commit**

```bash
git add pages/index.js
git commit -m "feat: hero parallax depth on mousemove"
```

---

## Task 7: Stats Strip

**Files:**
- Modify: `pages/index.js`

- [ ] **Step 1: Add `useCountUp` hook**

Add after `useParallax`, before `function NeuralBackground()`:

```js
function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const triggered = useRef(false);
  const ref = useRef(null);

  useEffect(() => {
    if (target === Infinity || target === '∞') { setValue('∞'); return; }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          const start = performance.now();
          const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { value, ref };
}
```

- [ ] **Step 2: Add `StatsStrip` component**

Add after `useCountUp`, before `function NeuralBackground()`:

```js
function StatsStrip() {
  const years    = useCountUp(15, 1200);
  const ventures = useCountUp(3,  900);
  const coffees  = useCountUp('∞');

  const stats = [
    { countHook: years,    suffix: '+', label: 'Years' },
    { countHook: ventures, suffix: '+', label: 'Ventures' },
    { countHook: coffees,  suffix: '',  label: 'Coffees' },
  ];

  return (
    <div
      ref={years.ref}
      className="relative z-10 max-w-3xl mx-auto px-6 py-10"
    >
      {/* Top divider */}
      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(251,146,60,0.3),transparent)', marginBottom: '2rem' }} />

      <div style={{ display: 'flex', justifyContent: 'center', gap: 0 }}>
        {stats.map(({ countHook, suffix, label }, i) => (
          <div key={label} style={{
            textAlign: 'center',
            padding: '0 2.5rem',
            borderRight: i < stats.length - 1 ? '1px solid #2a2a2a' : 'none',
          }}>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(40px, 7vw, 64px)',
              lineHeight: 1,
              color: '#fb923c',
              letterSpacing: '0.02em',
            }}>
              {countHook.value}{suffix}
            </div>
            <div style={{
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#555',
              marginTop: 6,
            }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom divider */}
      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)', marginTop: '2rem' }} />
    </div>
  );
}
```

- [ ] **Step 3: Render `StatsStrip` in `Home`**

Add `<StatsStrip />` directly after the closing `</div>` of the hero section (the `</div>` that closes `<div className="relative">`), before the contact section:

```jsx
{/* Stats */}
<StatsStrip />
```

- [ ] **Step 4: Verify in browser**

Scroll down past the hero. The stats strip should appear. "15+", "3+", and "∞" should count up from 0 when the strip enters the viewport. Numbers should animate smoothly with an ease-out. The strip should only count once — scrolling up and back down should not reset it.

- [ ] **Step 5: Commit**

```bash
git add pages/index.js
git commit -m "feat: add stats strip with animated count-up"
```

---

## Task 8: Selected Work Cards

**Files:**
- Modify: `pages/index.js`

- [ ] **Step 1: Define project data**

Add this near the top of `pages/index.js`, alongside `techStack` and `contactLinks`:

```js
const projects = [
  {
    name: "O'Reilly Platform",
    description: "Learning platform serving millions of engineers worldwide.",
    tags: ["Rails", "React"],
    accent: "linear-gradient(135deg, #1a1a2e 0%, #2d1b00 100%)",
  },
  {
    name: "AI Tooling",
    description: "Internal AI-assisted developer tooling at O'Reilly.",
    tags: ["AI", "Ruby"],
    accent: "linear-gradient(135deg, #1a0a00 0%, #3d1500 100%)",
  },
  {
    name: "Your Project",
    description: "Replace this with your own project description.",
    tags: ["Your", "Tags"],
    accent: "linear-gradient(135deg, #0a0a1a 0%, #1a0d2e 100%)",
  },
];
```

- [ ] **Step 2: Add `WorkCards` component**

Add after `StatsStrip`, before `function NeuralBackground()`:

```js
function WorkCards() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll('.work-card');
    if (!cards) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
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
      <p style={{
        fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
        color: '#555', textAlign: 'center', marginBottom: '2rem',
      }}>
        Selected Work
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {projects.map((p, i) => (
          <div
            key={p.name}
            className="work-card"
            style={{
              background: '#222',
              borderRadius: 10,
              overflow: 'hidden',
              border: '1px solid #2a2a2a',
              opacity: 0,
              transform: 'translateY(20px)',
              transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)';
              e.currentTarget.style.borderColor = '#444';
              e.currentTarget.querySelector('.card-accent').style.filter = 'brightness(1.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#2a2a2a';
              e.currentTarget.querySelector('.card-accent').style.filter = 'brightness(1)';
            }}
          >
            {/* Color block header */}
            <div
              className="card-accent"
              style={{
                height: 100,
                background: p.accent,
                position: 'relative',
                transition: 'filter 0.22s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              <div style={{
                position: 'absolute', bottom: 10, left: 12,
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 22, letterSpacing: '0.04em', color: '#fff',
              }}>
                {p.name}
              </div>
            </div>
            {/* Card body */}
            <div style={{ padding: '12px 14px' }}>
              <p style={{ fontSize: 12, color: '#777', lineHeight: 1.55, marginBottom: 10 }}>
                {p.description}
              </p>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {p.tags.map((tag) => (
                  <span key={tag} style={{
                    fontSize: 10, background: '#2a2a2a', color: '#888',
                    padding: '3px 7px', borderRadius: 4,
                    fontFamily: "'Space Mono', monospace",
                    letterSpacing: '0.05em',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Render `WorkCards` in `Home`**

Add `<WorkCards />` after `<StatsStrip />`:

```jsx
{/* Work */}
<WorkCards />
```

- [ ] **Step 4: Verify in browser**

Scroll down. The three cards should fade and rise in with a stagger (card 2 slightly after card 1, card 3 slightly after card 2). Hover a card — it should lift 4px and the color block should brighten. Move away — it springs back. Cards should only animate in once.

- [ ] **Step 5: Commit**

```bash
git add pages/index.js
git commit -m "feat: add selected work cards with scroll reveal"
```

---

## Task 9: Footer Upgrade

**Files:**
- Modify: `pages/index.js`

- [ ] **Step 1: Add `faGithub` import**

Find the existing brands import line:

```js
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
```

Add `faGithub`:

```js
import { faLinkedinIn, faGithub } from "@fortawesome/free-brands-svg-icons";
```

- [ ] **Step 2: Update the solid icons import**

Find:

```js
import { faPaperPlane, faMobile, faBrain } from "@fortawesome/free-solid-svg-icons";
```

Replace `faPaperPlane` with `faEnvelope`:

```js
import { faEnvelope, faMobile, faBrain } from "@fortawesome/free-solid-svg-icons";
```

- [ ] **Step 3: Replace the contact section with the new footer**

Find and replace the entire `{/* Contact */}` section (from `<section className="relative z-10 max-w-4xl...">` to its closing `</section>`) with:

```jsx
{/* Footer */}
<footer className="relative z-10 max-w-4xl mx-auto px-6 pb-10">
  <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(251,146,60,0.3),transparent)', marginBottom: '2rem' }} />
  <div style={{ display: 'flex', gap: 24, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
    {[
      { href: "mailto:derekthedev@icloud.com", label: "derekthedev@icloud.com", icon: faEnvelope },
      { href: "tel:13098400133",               label: "309.840.0133",            icon: faMobile },
      { href: "https://www.linkedin.com/in/derekthedev/", label: "LinkedIn",    icon: faLinkedinIn },
      { href: "https://github.com/derekthedev",           label: "GitHub",      icon: faGithub },
    ].map(({ href, label, icon }) => (
      <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
        className="contact-link flex items-center gap-2 text-[12px] text-gray-500 hover:text-orange-400 transition-colors tracking-[0.12em] uppercase">
        <FontAwesomeIcon icon={icon} className="w-3.5 opacity-60" />
        {label}
      </a>
    ))}
  </div>
  <p style={{ textAlign: 'center', fontSize: 10, color: '#333', letterSpacing: '0.1em', marginTop: '1.5rem' }}>
    © 2026 Derek Montgomery
  </p>
</footer>
```

- [ ] **Step 4: Verify in browser**

Scroll to the bottom. You should see the gradient divider, then a row with email, phone, LinkedIn, and GitHub links (each with an icon). Hover each link — it should turn orange. The LinkedIn and GitHub links should open in a new tab. The copyright line should be visible below.

- [ ] **Step 5: Commit**

```bash
git add pages/index.js
git commit -m "feat: upgrade footer with github link and copyright"
```

---

## Task 10: Final Integration Check

**Files:**
- Modify: `pages/index.js` (if needed)

- [ ] **Step 1: Run a full build to catch any issues**

```bash
yarn build
```

Expected: Build completes with no errors. Warnings about `<img>` elements are acceptable (pre-existing).

- [ ] **Step 2: Full walkthrough checklist**

Start `yarn dev` and verify each feature end-to-end:

| Feature | How to verify |
|---------|--------------|
| Scroll progress bar | Scroll slowly — orange bar fills from left |
| Name shimmer | Wait 6–7s — golden streak sweeps across "DEREK MONTGOMERY" |
| Custom cursor | Move mouse — orange dot + lagging ring visible |
| Cursor on touch | DevTools → touch emulation → default cursor returns |
| Neural net reactivity | Move cursor over canvas — nodes scatter away |
| Magnetic CTA | Approach "View Resume" — button pulls toward cursor |
| Hero parallax | Move mouse — photo shifts more than text, creates depth |
| Stats count-up | Scroll to stats — numbers count up from 0, only once |
| Work cards reveal | Scroll to cards — stagger fade+rise in |
| Work card hover | Hover card — lifts 4px, color block brightens |
| Footer links | Click LinkedIn/GitHub — open in new tab |
| Footer email | Click email link — mail client opens |

- [ ] **Step 3: Fix any issues found**

Address anything that failed the checklist above before committing.

- [ ] **Step 4: Final commit**

```bash
git add pages/index.js
git commit -m "chore: verify homepage premium overhaul complete"
```
