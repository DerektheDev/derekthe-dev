import { useState } from "react";
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

export default function Editors() {
  const [open, setOpen] = useState(new Set());

  function toggle(key) {
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

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
        <div className={styles.ambientGlow} />
        <Nav />

        <main className={styles.main}>
          <header className={`rise d1 ${styles.header}`}>
            <h1 className={styles.title}>Editors</h1>
            <p className={styles.tagline}>~15 years · 16 tools · one career</p>
          </header>

          <div className={`rise d2 ${styles.legend}`}>
            <span className={`${styles.badge} ${styles.chosen}`}>Chosen</span>
            <span className={`${styles.badge} ${styles.tried}`}>Tried</span>
            <span className={`${styles.badge} ${styles.forced}`}>Forced</span>
          </div>

          <div className={`rise d3 ${styles.timeline}`}>
            {editors.map((era) => (
              <div key={era.era} className={styles.era}>
                <div className={styles.eraHeader}>
                  <span className={styles.eraName}>{era.era}</span>
                  <span className={styles.eraYears}>{era.years}</span>
                </div>

                <div className={styles.items}>
                  {era.items.map((item) => {
                    const key = `${era.era}::${item.name}`;
                    const isOpen = open.has(key);
                    return (
                      <div key={item.name} className={styles.itemWrap}>
                        <div className={styles.dotCol}>
                          <div className={`${styles.dot} ${styles[item.status + "Dot"]}`} />
                          <div className={styles.stem} />
                        </div>
                        <button
                          className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}
                          onClick={() => toggle(key)}
                          aria-expanded={isOpen}
                        >
                          <div className={styles.itemRow}>
                            <span className={styles.itemName}>{item.name}</span>
                            <div className={styles.badges}>
                              <span className={styles.typeBadge}>{item.type}</span>
                              <span className={`${styles.badge} ${styles[item.status]}`}>
                                {STATUS_LABEL[item.status]}
                              </span>
                            </div>
                            <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}>›</span>
                          </div>
                          {isOpen && (
                            <p className={styles.note}>{item.note}</p>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
