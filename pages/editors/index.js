import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Nav from "../home/Nav";
import Footer from "../home/Footer";
import styles from "./index.module.css";

const editors = [
  {
    era: "Web Beginner Era",
    years: "~2010",
    items: [
      { name: "Dreamweaver", type: "IDE", status: "chosen", note: "Starting point. WYSIWYG + code split view. The on-ramp for a generation of web developers." },
      { name: "Coda", type: "Editor", status: "chosen", note: "Panic's Mac-native web editor. Beautiful, opinionated, built-in FTP/SSH. A beloved alternative to Dreamweaver for designers who coded." },
      { name: "Notepad++", type: "Editor", status: "tried", note: "Lightweight Windows staple. Fast, free, no-nonsense." },
      { name: "Nano", type: "Terminal", status: "tried", note: "Server edits. The editor you use when vim feels like too much." },
    ],
  },
  {
    era: "Rails / Agency Era",
    years: "2011–2014",
    items: [
      { name: "TextMate", type: "Editor", status: "chosen", note: "The Rails editor. DHH used it in the famous 15-minute blog screencast and the community followed. Defined an era before going quiet." },
      { name: "Aptana Studio", type: "IDE", status: "chosen", note: "The Rails IDE before RubyMine. Built on Eclipse but didn't feel like it. Beloved — then Appcelerator acquired it and it slowly died." },
      { name: "Sublime Text", type: "Editor", status: "chosen", note: "The upgrade everyone made. Fast, beautiful, multi-cursor editing. Set the bar for a generation." },
      { name: "Vim", type: "Terminal", status: "tried", note: "Server-side edits. Modal editing that never fully leaves you." },
      { name: "Neovim", type: "Terminal", status: "tried", note: "Vim modernized — Lua scripting, LSP support, thriving community. The serious vim path." },
      { name: "Brackets", type: "Editor", status: "tried", note: "Adobe's open-source web editor with live preview. Innovative, but couldn't compete with VS Code. Killed 2021." },
    ],
  },
  {
    era: "The Atom Moment",
    years: "2014–2016",
    items: [
      { name: "Atom", type: "Editor", status: "chosen", note: "GitHub's Electron editor. Heavily extensible, beloved briefly, slow eventually. Killed 2022 after VS Code won decisively." },
    ],
  },
  {
    era: "Enterprise Detour",
    years: "~2015–2018",
    items: [
      { name: "WebSphere Commerce Tooling", type: "IDE", status: "forced", note: "Eclipse-based. IBM. Not by choice. 45-second autocomplete. The hostage situation era." },
      { name: "Eclipse", type: "IDE", status: "tried", note: "The Java IDE that ruled the 2000s. Heavy, powerful, inescapable in enterprise contexts." },
      { name: "WebStorm", type: "IDE", status: "tried", note: "JetBrains's JavaScript IDE. The good kind of enterprise tooling — deep intelligence, actually fast." },
      { name: "RubyMine", type: "IDE", status: "tried", note: "JetBrains' Rails IDE. Deepest Ruby intelligence available. Still probably the best for serious Rails work." },
    ],
  },
  {
    era: "Modern Era",
    years: "2019–present",
    items: [
      { name: "VS Code", type: "Editor", status: "chosen", note: "Where almost everyone landed. Ubiquitous, fast ecosystem, won decisively against Atom and Sublime." },
      { name: "Zed", type: "Editor", status: "chosen", note: "Rust-based, genuinely fast, collaborative. Current exploration — the most interesting new editor in years." },
      { name: "Claude Code", type: "AI Environment", status: "chosen", note: "Not a traditional editor — but fundamentally mediates how you interact with code. Subagent/skill systems, MCP integrations, serious infrastructure work. Counts with an asterisk." },
    ],
  },
];

const STATUS_LABEL = { chosen: "Chosen", tried: "Tried", forced: "Forced" };

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
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);
  return progress;
}

function EraSection({ era, delay }) {
  const sectionRef = useRef(null);
  const [open, setOpen] = useState(new Set());

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
      { threshold: 0.12 }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  function toggle(name) {
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  return (
    <section ref={sectionRef} className={styles.eraSection}>
      <p className={styles.eraLabel}>
        <span>{era.era}</span>
        <span className={styles.eraYears}>{era.years}</span>
      </p>
      <div className={styles.cardList}>
        {era.items.map((item, i) => {
          const isOpen = open.has(item.name);
          return (
            <button
              key={item.name}
              className={styles.card}
              style={{ "--delay": `${(delay + i) * 0.07}s` }}
              onClick={() => toggle(item.name)}
              aria-expanded={isOpen}
            >
              <div className={styles.cardTop}>
                <span className={styles.cardName}>{item.name}</span>
                <div className={styles.cardTags}>
                  <span className={styles.tag}>{item.type}</span>
                  <span className={`${styles.tag} ${styles[item.status]}`}>
                    {STATUS_LABEL[item.status]}
                  </span>
                </div>
                <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}>›</span>
              </div>
              {isOpen && (
                <p className={styles.note}>{item.note}</p>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function Editors() {
  const scrollProgress = useScrollProgress();

  return (
    <>
      <Head>
        <title>Editors — Derek Montgomery</title>
        <meta name="description" content="A personal timeline of every text editor and IDE across 15 years of software development." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      </Head>

      <div className={`page-wrap space-mono ${styles.pageWrap}`}>
        <div className={styles.progressBar} style={{ "--progress": scrollProgress }} />
        <div className={styles.ambientGlow} />

        <Nav />

        <div className={`rise d2 ${styles.heroSection}`}>
          <p className={styles.greeting}>A personal record of</p>
          <h1 className={`hero-name ${styles.heroName}`}>Editors</h1>
          <p className={styles.tagline}>~15 years · 16 tools · one career</p>
        </div>

        <div className={styles.legendRow}>
          <span className={`${styles.tag} ${styles.chosen}`}>Chosen</span>
          <span className={`${styles.tag} ${styles.tried}`}>Tried</span>
          <span className={`${styles.tag} ${styles.forced}`}>Forced</span>
        </div>

        {editors.map((era, i) => (
          <EraSection
            key={era.era}
            era={era}
            delay={i * 2}
          />
        ))}

        <Footer />
      </div>
    </>
  );
}
