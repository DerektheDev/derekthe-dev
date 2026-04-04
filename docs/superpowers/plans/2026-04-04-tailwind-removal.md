# Tailwind Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove Tailwind CSS entirely — dependency, config, PostCSS plugin, and all utility classes — replacing everything with per-component CSS Modules and a minimal handwritten reset.

**Architecture:** Each component gets a colocated `.module.css` file. Existing homepage modules (Hero, WorkCards, Footer, index) are extended with the remaining Tailwind classes. New modules are created for Nav, all resume components, and the Greek page. Infrastructure changes (globals.css, postcss.config.js, package.json, tailwind.config.js deletion) land in Task 1.

**Tech Stack:** Next.js 16 (Pages Router), CSS Modules, autoprefixer

> **Node requirement:** Node >=24 required. If `npm` is not found in PATH, run `nvm use 24` first or prefix commands with `~/.nvm/versions/node/v24.13.0/bin/npm`.

> **Project root:** All file paths are relative to `/Users/dmontgomery/Projects/derekthe-dev`.

---

### Task 1: Infrastructure — Remove Tailwind from build pipeline

**Files:**
- Modify: `styles/globals.css`
- Modify: `postcss.config.js`
- Delete: `tailwind.config.js`
- Modify: `package.json`

- [ ] **Step 1: Replace `@tailwind` directives in `styles/globals.css` with minimal reset**

Replace the top three lines:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

With this reset (insert before the existing `html, body` rule):
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

The resulting file should look like:
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

html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}
```

- [ ] **Step 2: Remove `tailwindcss` plugin from `postcss.config.js`**

Replace entire file content with:
```js
module.exports = {
  plugins: {
    autoprefixer: {},
  },
}
```

- [ ] **Step 3: Delete `tailwind.config.js`**

```bash
rm /Users/dmontgomery/Projects/derekthe-dev/tailwind.config.js
```

- [ ] **Step 4: Remove `tailwindcss` from `package.json` devDependencies**

In `package.json`, remove the line:
```json
"tailwindcss": "^3.4.19"
```

The `devDependencies` block should now be:
```json
"devDependencies": {
  "autoprefixer": "^10.4.27",
  "eslint": "^10.1.0",
  "eslint-config-next": "^16.2.1",
  "postcss": "^8.5.8"
}
```

- [ ] **Step 5: Run `npm install` to update the lockfile**

```bash
cd /Users/dmontgomery/Projects/derekthe-dev && npm install
```

Expected: lockfile updated, `tailwindcss` removed from `node_modules`.

- [ ] **Step 6: Verify build succeeds**

```bash
cd /Users/dmontgomery/Projects/derekthe-dev && npm run build
```

Expected: Build completes with no errors. Tailwind-related warnings ("no utility classes found", etc.) will disappear.

- [ ] **Step 7: Commit**

```bash
cd /Users/dmontgomery/Projects/derekthe-dev && git add styles/globals.css postcss.config.js package.json package-lock.json && git commit -m "feat: remove Tailwind from build pipeline, add minimal CSS reset"
```

---

### Task 2: Nav component

**Files:**
- Create: `pages/home/Nav.module.css`
- Modify: `pages/home/Nav.js`

- [ ] **Step 1: Create `pages/home/Nav.module.css`**

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
  transition-property: color;
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

- [ ] **Step 2: Replace Tailwind classes in `pages/home/Nav.js`**

Replace entire file content with:
```jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedinIn, faGithub } from "@fortawesome/free-brands-svg-icons";
import styles from "./Nav.module.css";

export default function Nav() {
  return (
    <nav className={`rise d1 ${styles.nav}`} aria-label="Main navigation">
      <a href="/resume" className={styles.link}>
        Resume
      </a>
      <a href="https://www.linkedin.com/in/derekthedev/" target="_blank" rel="noreferrer"
        className={styles.linkWithIcon}
        aria-label="LinkedIn (opens in new tab)">
        <FontAwesomeIcon icon={faLinkedinIn} className={styles.icon} />
        LinkedIn
      </a>
      <a href="https://github.com/derekthedev" target="_blank" rel="noreferrer"
        className={styles.linkWithIcon}
        aria-label="GitHub (opens in new tab)">
        <FontAwesomeIcon icon={faGithub} className={styles.icon} />
        GitHub
      </a>
    </nav>
  );
}
```

- [ ] **Step 3: Verify build succeeds**

```bash
cd /Users/dmontgomery/Projects/derekthe-dev && npm run build
```

Expected: Build completes with no errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/dmontgomery/Projects/derekthe-dev && git add pages/home/Nav.module.css pages/home/Nav.js && git commit -m "refactor: move Nav Tailwind classes to Nav.module.css"
```

---

### Task 3: Homepage page wrapper

**Files:**
- Modify: `pages/index.module.css`
- Modify: `pages/index.js`

- [ ] **Step 1: Add `.pageWrap` to `pages/index.module.css`**

Append to the existing file (which already has `.progressBar` and `.ambientGlow`):
```css
.pageWrap {
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #fff;
  position: relative;
}
```

- [ ] **Step 2: Update `pages/index.js` to use module class**

Change line 45 from:
```jsx
      <div className="page-wrap min-h-screen bg-[#1a1a1a] text-white space-mono relative">
```
To:
```jsx
      <div className={`page-wrap space-mono ${styles.pageWrap}`}>
```

- [ ] **Step 3: Verify build succeeds**

```bash
cd /Users/dmontgomery/Projects/derekthe-dev && npm run build
```

Expected: Build completes with no errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/dmontgomery/Projects/derekthe-dev && git add pages/index.module.css pages/index.js && git commit -m "refactor: move index.js page wrapper Tailwind classes to index.module.css"
```

---

### Task 4: Hero component

**Files:**
- Modify: `pages/home/Hero.module.css`
- Modify: `pages/home/Hero.js`

- [ ] **Step 1: Extend `pages/home/Hero.module.css` with remaining Tailwind classes**

Append to the existing file (which already has `.heroOuter`, `.photoWrapper`, `.blob1`–`.blob4`). Also update `.heroOuter` and `.photoWrapper` to absorb Tailwind positional utilities:

Replace entire file content with:
```css
.heroOuter {
  overflow: hidden;
  position: relative;
}

.photoWrapper {
  width: 148px;
  height: 148px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2.5rem;
  position: relative;
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
  transition-property: color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.oreillyLink:hover {
  color: #fb923c;
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

.techRow {
  margin-top: 2.25rem;
  margin-bottom: 2.25rem;
}
```

- [ ] **Step 2: Replace `pages/home/Hero.js` with module classes**

Replace entire file content with:
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
    <div className={styles.heroOuter}>
      <AuroraBackground />
      <NeuralBackground />
      <div className="mesh-bg">
        <div className={`blob ${styles.blob1}`} />
        <div className={`blob ${styles.blob2}`} />
        <div className={`blob ${styles.blob3}`} />
        <div className={`blob ${styles.blob4}`} />
      </div>
      <section className={styles.section}>

        <div className={`rise d2 ${styles.photoWrapper}`}>
          <div className={`photo-ring ${styles.photoRingContainer}`}>
            <Image src={derek} alt="Derek Montgomery" width={148} height={148} className={styles.photo} priority />
          </div>
        </div>

        <div>
          <p className={`rise d3 ${styles.greeting}`}>
            Hey, I'm
          </p>

          <h1 className={`rise d4 hero-name ${styles.heroName}`}>
            Derek Montgomery
          </h1>

          <p className={`rise d5 ${styles.role}`}>
            Senior Software Engineer at{" "}
            <a href="https://www.oreilly.com/" target="_blank" rel="noreferrer" className={styles.oreillyLink}>O'Reilly Media</a>
          </p>

          <div className={`rise d5 tech-row ${styles.techRow}`}>
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

          <p className={`rise d6 ${styles.bio}`}>
            With over <span className={styles.highlight}>15 years</span> building digital products, I've got experience{" "}
            <span className={styles.highlight}>leading</span> engineering teams,{" "}
            <span className={styles.highlight}>building</span> startups, and{" "}
            <span className={styles.highlight}>consulting</span> for large corporations.
          </p>

          <div className={`rise d6 ${styles.buttonRow}`}>
            <a href="/resume" className={`btn-fill ${styles.resumeBtn}`}>
              View Resume
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Verify build succeeds**

```bash
cd /Users/dmontgomery/Projects/derekthe-dev && npm run build
```

Expected: Build completes with no errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/dmontgomery/Projects/derekthe-dev && git add pages/home/Hero.module.css pages/home/Hero.js && git commit -m "refactor: move Hero.js Tailwind classes to Hero.module.css"
```

---

### Task 5: Footer component

**Files:**
- Modify: `pages/home/Footer.module.css`
- Modify: `pages/home/Footer.js`

- [ ] **Step 1: Extend `pages/home/Footer.module.css`**

Replace entire file content with (preserving existing `.divider`, `.linksContainer`, `.copyright` and adding new classes):
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

- [ ] **Step 2: Update `pages/home/Footer.js`**

Replace entire file content with:
```jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { contactLinks } from "../../data/home-data";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer} aria-label="Contact">
      <div className={styles.divider} />
      <div className={styles.linksContainer}>
        {contactLinks.map(({ href, label, icon, ariaLabel }) => (
          <a key={label} href={href} aria-label={ariaLabel}
            className={`contact-link ${styles.contactLink}`}>
            <FontAwesomeIcon icon={icon} className={styles.contactIcon} aria-hidden="true" />
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

- [ ] **Step 3: Verify build succeeds**

```bash
cd /Users/dmontgomery/Projects/derekthe-dev && npm run build
```

Expected: Build completes with no errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/dmontgomery/Projects/derekthe-dev && git add pages/home/Footer.module.css pages/home/Footer.js && git commit -m "refactor: move Footer.js remaining Tailwind classes to Footer.module.css"
```

---

### Task 6: WorkCards component

**Files:**
- Modify: `pages/home/WorkCards.module.css`
- Modify: `pages/home/WorkCards.js`

- [ ] **Step 1: Append `.section` to `pages/home/WorkCards.module.css`**

Append to the existing file:
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

- [ ] **Step 2: Update `pages/home/WorkCards.js` section element**

Change line 26 from:
```jsx
    <section ref={sectionRef} className="relative z-10 max-w-4xl mx-auto px-6 pb-16">
```
To:
```jsx
    <section ref={sectionRef} className={styles.section}>
```

- [ ] **Step 3: Verify build succeeds**

```bash
cd /Users/dmontgomery/Projects/derekthe-dev && npm run build
```

Expected: Build completes with no errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/dmontgomery/Projects/derekthe-dev && git add pages/home/WorkCards.module.css pages/home/WorkCards.js && git commit -m "refactor: move WorkCards section wrapper Tailwind classes to WorkCards.module.css"
```

---

### Task 7: Resume page layout

**Files:**
- Create: `pages/resume/index.module.css`
- Modify: `pages/resume/index.js`

- [ ] **Step 1: Create `pages/resume/index.module.css`**

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

- [ ] **Step 2: Replace `pages/resume/index.js` with module classes**

Replace entire file content with:
```jsx
import List from "./list";
import ShortList from "./short-list";
import KeyPoint from "./key-point";
import {
  jobs,
  schools,
  skills,
  built,
  brands,
  // interests,
  proficiencies,
  industries,
} from "../../data/resume-data";
import Header from "./header";
import styles from "./index.module.css";

export default function Resume() {
  return (
    <main className={styles.main}>
      <Header />
      <section className={styles.grid}>
        <div className={styles.col}>
          <KeyPoint
            title="Recent Work Experience"
            entries={jobs}
            highlightEntries
          />
        </div>
        <div className={styles.col}>
          <KeyPoint title="Education" entries={schools} />
          <ShortList title="Tech" entries={proficiencies} />
          <List title="Skills & Competencies" entries={skills} />
          <List title="What I've Built" entries={built} />
          <List title="Brands Served" entries={brands} />
          <List title="Industries Served" entries={industries} />
          {/* <ShortList title="Interests" entries={interests} /> */}
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Verify build succeeds**

```bash
cd /Users/dmontgomery/Projects/derekthe-dev && npm run build
```

Expected: Build completes with no errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/dmontgomery/Projects/derekthe-dev && git add pages/resume/index.module.css pages/resume/index.js && git commit -m "refactor: move resume/index.js Tailwind classes to index.module.css"
```

---

### Task 8: Resume header component

**Files:**
- Create: `pages/resume/header.module.css`
- Modify: `pages/resume/header.js`

- [ ] **Step 1: Create `pages/resume/header.module.css`**

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
  line-height: 2.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.title {
  font-size: 1.5rem;
  line-height: 2rem;
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

- [ ] **Step 2: Replace `pages/resume/header.js` with module classes**

Replace entire file content with:
```jsx
import Image from "next/image";
import derek from "../../public/derek-linkedin.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faMobile,
  faMapPin,
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import styles from "./header.module.css";

const iconStyle = {
  fontSize: 30,
  color: "#fb923c",
  width: "20px",
};

const contactItems = [
  {
    text: "derekthedev@icloud.com",
    link: "mailto:derekthedev@icloud.com",
    icon: faPaperPlane,
  },
  {
    text: "309.840.0133",
    link: "tel:13098400133",
    icon: faMobile,
  },
  {
    text: "/in/derekthedev",
    link: "https://www.linkedin.com/in/derekthedev/",
    icon: faLinkedinIn,
  },
  {
    text: "DeKalb, Illinois",
    icon: faMapPin,
  },
];

const Header = () => (
  <header className={styles.header}>
    <section className={styles.leftSection}>
      <div className={styles.nameWrapper}>
        <div className={styles.highlightBar} />
        <h1 className={styles.name}>Derek Montgomery</h1>
        <h2 className={styles.title}>Rails | React | Front-End | AI</h2>
      </div>
      <p className={styles.description}>
        Partnering with high-standards individuals to build beautiful,
        performant, accessible, and exciting software with humans in mind.
      </p>
    </section>
    <div className={styles.photoContainer}>
      <div className={styles.photoBorder}>
        <Image
          src={derek}
          alt="Derek Montgomery"
          width={150}
          height={150}
          className={styles.photo}
        />
      </div>
    </div>
    <nav className={styles.contactNav}>
      <ul className={styles.contactList}>
        {contactItems.map(({ text, link, icon }) => (
          <li key={text} className={styles.contactItem}>
            <FontAwesomeIcon
              icon={icon}
              style={iconStyle}
              className={styles.contactIcon}
            />
            <span>
              {link ? (
                <a href={link} className={styles.contactLink}>
                  {text}
                </a>
              ) : (
                text
              )}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  </header>
);

export default Header;
```

- [ ] **Step 3: Verify build succeeds**

```bash
cd /Users/dmontgomery/Projects/derekthe-dev && npm run build
```

Expected: Build completes with no errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/dmontgomery/Projects/derekthe-dev && git add pages/resume/header.module.css pages/resume/header.js && git commit -m "refactor: move resume/header.js Tailwind classes to header.module.css"
```

---

### Task 9: Resume key-point component

**Files:**
- Create: `pages/resume/key-point.module.css`
- Modify: `pages/resume/key-point.js`

- [ ] **Step 1: Create `pages/resume/key-point.module.css`**

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
  line-height: 2.25rem;
  font-weight: 400;
}

.sectionSubtitle {
  font-size: 1.5rem;
  line-height: 2rem;
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
  line-height: 2rem;
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
  line-height: 2rem;
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

- [ ] **Step 2: Replace `pages/resume/key-point.js` with module classes**

Replace entire file content with:
```jsx
import styles from "./key-point.module.css";

const KeyPoint = ({
  highlightEntries,
  title = "Default Title",
  subtitle,
  entries = [],
}) => (
  <div className={styles.wrapper}>
    <h2 className={styles.sectionTitle}>{title}</h2>
    {subtitle && <h3 className={styles.sectionSubtitle}>{subtitle}</h3>}

    {entries.map(
      (
        {
          title,
          subtitle,
          titleLink,
          bullets,
          dateRange,
          location,
          suppressHighlight,
        },
        index
      ) => {
        const showHighlight = highlightEntries && !suppressHighlight;

        return (
          <div key={index} className={styles.entry}>
            <div className={styles.entryInner}>
              {showHighlight && <div className={styles.highlightBar} />}
              <div className={styles.dateRow}>
                {dateRange && (
                  <h3 className={styles.dateLabel}>{dateRange.join(" - ")}</h3>
                )}
              </div>
              <h3 className={styles.entryTitle}>
                {titleLink ? (
                  <a
                    href={titleLink}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.entryLink}
                  >
                    {title}
                  </a>
                ) : (
                  title
                )}
              </h3>
              <h4 className={styles.entrySubtitle}>{subtitle}</h4>
            </div>
            <ul className={styles.bullets}>
              {bullets.map((bullet, index) => (
                <li key={index} className={styles.bullet}>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        );
      }
    )}
  </div>
);

export default KeyPoint;
```

- [ ] **Step 3: Verify build succeeds**

```bash
cd /Users/dmontgomery/Projects/derekthe-dev && npm run build
```

Expected: Build completes with no errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/dmontgomery/Projects/derekthe-dev && git add pages/resume/key-point.module.css pages/resume/key-point.js && git commit -m "refactor: move resume/key-point.js Tailwind classes to key-point.module.css"
```

---

### Task 10: Resume list and short-list components

**Files:**
- Create: `pages/resume/list.module.css`
- Modify: `pages/resume/list.js`
- Create: `pages/resume/short-list.module.css`
- Modify: `pages/resume/short-list.js`

- [ ] **Step 1: Create `pages/resume/list.module.css`**

```css
.title {
  font-size: 1.875rem;
  line-height: 2.25rem;
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

- [ ] **Step 2: Replace `pages/resume/list.js` with module classes**

Replace entire file content with:
```jsx
import styles from "./list.module.css";

const List = ({ title = "Default", entries = [] }) => {
  const firstHalf = entries.slice(0, Math.floor(entries.length / 2));
  const secondHalf = entries.slice(Math.floor(entries.length / 2));

  return (
    <div>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.grid}>
        {[firstHalf, secondHalf].map((entries, halfIndex) => {
          return (
            <ul key={halfIndex} className={styles.column}>
              {entries.map((entry, i) => (
                <li key={i} className={styles.item}>
                  {entry}
                </li>
              ))}
            </ul>
          );
        })}
      </div>
    </div>
  );
};

export default List;
```

- [ ] **Step 3: Create `pages/resume/short-list.module.css`**

```css
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.title {
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 400;
}

.list {
  font-weight: 300;
}
```

- [ ] **Step 4: Replace `pages/resume/short-list.js` with module classes**

Replace entire file content with:
```jsx
import styles from "./short-list.module.css";

const List = ({ title = "Default", entries = [] }) => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>
      <ul className={styles.list}>{entries.join(" | ")}</ul>
    </div>
  );
};

export default List;
```

- [ ] **Step 5: Verify build succeeds**

```bash
cd /Users/dmontgomery/Projects/derekthe-dev && npm run build
```

Expected: Build completes with no errors.

- [ ] **Step 6: Commit**

```bash
cd /Users/dmontgomery/Projects/derekthe-dev && git add pages/resume/list.module.css pages/resume/list.js pages/resume/short-list.module.css pages/resume/short-list.js && git commit -m "refactor: move resume list components Tailwind classes to CSS modules"
```

---

### Task 11: Greek page

**Files:**
- Create: `pages/greek/index.module.css`
- Modify: `pages/greek/index.js`

- [ ] **Step 1: Create `pages/greek/index.module.css`**

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

- [ ] **Step 2: Replace `pages/greek/index.js` with module classes**

Replace entire file content with:
```jsx
import { useState } from "react";
import ReactCardFlip from "react-card-flip";

import { data as greekData } from "../../data/greek-data";
import styles from "./index.module.css";

export default function GreekCards() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <main className={styles.main}>
      {greekData.map((letter) => (
        <ReactCardFlip isFlipped={isFlipped} key={letter.name}>
          <div className={styles.card} onClick={() => setIsFlipped(true)}>
            <p className={styles.letter}>{letter.lower}</p>
          </div>
          <div className={styles.card} onClick={() => setIsFlipped(false)}>
            <p className={styles.name}>{letter.name}</p>
          </div>
        </ReactCardFlip>
      ))}
    </main>
  );
}
```

Note: The `Slider` import and `sliderSettings` variable were already commented out in the original. They have been removed here since they are unused. If you want to preserve them, keep `import Slider from "react-slick"` and the `sliderSettings` variable.

- [ ] **Step 3: Verify build succeeds**

```bash
cd /Users/dmontgomery/Projects/derekthe-dev && npm run build
```

Expected: Build completes with no errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/dmontgomery/Projects/derekthe-dev && git add pages/greek/index.module.css pages/greek/index.js && git commit -m "refactor: move greek/index.js Tailwind classes to index.module.css"
```

---

## Completion Checklist

After all tasks are done, verify:

- [ ] `tailwind.config.js` does not exist
- [ ] `package.json` has no `tailwindcss` entry
- [ ] `styles/globals.css` has no `@tailwind` directives
- [ ] `postcss.config.js` has only `autoprefixer` in plugins
- [ ] `npm run build` passes cleanly
- [ ] No file in `pages/` contains a string matching Tailwind class patterns like `text-[`, `md:`, `bg-[`, `hover:text-`, `font-light`, etc.

Quick grep to verify no Tailwind stragglers remain:
```bash
cd /Users/dmontgomery/Projects/derekthe-dev && grep -r "className=.*text-\[" pages/ || echo "No text-[] classes found"
grep -r "className=.*md:" pages/ || echo "No md: classes found"
grep -r "className=.*font-light\|font-semibold\|font-medium\|font-normal" pages/ || echo "No font-* utility classes found"
```
