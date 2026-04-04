import { useEffect, useRef } from "react";
import { projects } from "../../data/home-data";

export default function WorkCards() {
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
        fontSize: 18, letterSpacing: '0.18em',
        color: '#ccc', textAlign: 'center', marginBottom: '2rem', marginTop: '4rem',
      }}>
        Selected Work
      </p>
      <div className="work-grid">
        {projects.map((p, i) => {
          const cardStyle = {
            background: '#222',
            borderRadius: 10,
            overflow: 'hidden',
            border: '1px solid #2a2a2a',
            opacity: 0,
            transform: 'translateY(20px)',
            transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s`,
            display: 'flex',
            flexDirection: 'column',
            textDecoration: 'none',
            color: 'inherit',
          };
          const Tag = p.url ? 'a' : 'div';
          const linkProps = p.url ? { href: p.url, target: '_blank', rel: 'noreferrer' } : {};
          return (
            <Tag
              key={p.name}
              {...linkProps}
              className={`work-card${p.url ? ' work-card-link' : ''}`}
              style={cardStyle}
              aria-label={p.url ? `${p.name} — ${p.description} (opens in new tab)` : undefined}
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
              <div
                className="card-accent"
                style={{
                  height: 100,
                  background: p.accent,
                  position: 'relative',
                  transition: 'filter 0.22s cubic-bezier(0.22,1,0.36,1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* {p.logo && (
                  <img src={p.logo} alt={`${p.name} logo`} style={p.logoStyle} />
                )} */}
                <div style={{
                  position: 'absolute', bottom: 10, left: 12,
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 22, letterSpacing: '0.04em', color: '#fff',
                }}>
                  {p.name}
                </div>
              </div>
              <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <p style={{ fontSize: 14, color: '#aaa', lineHeight: 1.55, marginBottom: 10, flex: 1 }}>
                  {p.description}
                </p>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {p.tags.map((tag) => (
                    <span key={tag} style={{
                      fontSize: 12, background: '#2a2a2a', color: '#aaa',
                      padding: '3px 7px', borderRadius: 4,
                      fontFamily: "'Space Mono', monospace",
                      letterSpacing: '0.05em',
                    }}>
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
