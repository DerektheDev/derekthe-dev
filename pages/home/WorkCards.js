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
