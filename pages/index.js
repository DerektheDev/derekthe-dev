import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faMobile, faBrain } from "@fortawesome/free-solid-svg-icons";
import { faLinkedinIn, faGithub } from "@fortawesome/free-brands-svg-icons";

const techStack = [
  { label: "Rails",     iconUrl: "https://cdn.simpleicons.org/rubyonrails/fb923c" },
  { label: "React",     iconUrl: "https://cdn.simpleicons.org/react/fb923c" },
  { label: "Front-End", iconUrl: "https://cdn.simpleicons.org/html5/fb923c" },
  { label: "AI",        faIcon: faBrain },
];
import derek from "../public/derek-linkedin.jpg";


const projects = [
  {
    name: "O'Reilly Answers",
    description: "AI-powered Q&A feature for the O'Reilly learning platform.",
    tags: ["React", "Django", "AI"],
    accent: "linear-gradient(135deg, #1a1a2e 0%, #2d1b00 100%)",
    url: "https://www.oreilly.com/online-learning/feature-answers.html",
  },
  {
    name: "Gyve",
    description: "Generosity platform for churches and charities.",
    tags: ["Rails", "React"],
    accent: "linear-gradient(135deg, #1a0a00 0%, #3d1500 100%)",
    url: "https://www.gyve.com",
  },
  {
    name: "iFIT",
    description: "Connected fitness platform powering NordicTrack and ProForm equipment.",
    tags: ["React", "Webviews"],
    accent: "linear-gradient(135deg, #0a0a1a 0%, #1a0d2e 100%)",
    url: "https://www.ifit.com",
  },
];

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

function NeuralBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    // Render at half resolution — cheaper, and the upscale adds natural softness
    // on top of the CSS blur that does the real merging work.
    const resize = () => {
      canvas.width  = Math.round(canvas.offsetWidth  / 2);
      canvas.height = Math.round(canvas.offsetHeight / 2);
    };
    resize();
    window.addEventListener("resize", resize);

    // Aurora bands — elongated ellipses that independently rotate + drift.
    // baseCx/Cy : resting center (0–1 fraction of W/H)
    // driftX/Y  : sinusoidal drift amplitude
    // phX/Y     : phase offset so bands start staggered
    // freqX/Y   : drift cycle speed
    // angle     : current rotation (radians)
    // dAngle    : rotation speed per frame
    // rx/ry     : ellipse radii as fraction of W/H (very wide, narrow = band shape)
    // color     : [r,g,b]
    // a         : peak center alpha
    const bands = [
      { angle:0.00, dAngle: 0.00080, baseCx:0.50, baseCy:0.38, driftX:0.14, driftY:0.09, phX:0.0, phY:0.0, freqX:0.25, freqY:0.31, rx:0.80, ry:0.22, color:[251,146, 60], a:0.80 },
      { angle:1.05, dAngle:-0.00060, baseCx:0.42, baseCy:0.58, driftX:0.16, driftY:0.11, phX:1.2, phY:2.1, freqX:0.19, freqY:0.27, rx:0.72, ry:0.19, color:[215, 52,  8], a:0.75 },
      { angle:2.20, dAngle: 0.00050, baseCx:0.62, baseCy:0.48, driftX:0.12, driftY:0.13, phX:2.4, phY:0.8, freqX:0.33, freqY:0.22, rx:0.76, ry:0.21, color:[255,178, 44], a:0.70 },
      { angle:1.60, dAngle:-0.00070, baseCx:0.37, baseCy:0.44, driftX:0.17, driftY:0.10, phX:3.6, phY:1.4, freqX:0.28, freqY:0.35, rx:0.68, ry:0.18, color:[162, 34,  4], a:0.78 },
      { angle:3.10, dAngle: 0.00065, baseCx:0.64, baseCy:0.54, driftX:0.13, driftY:0.12, phX:0.6, phY:3.2, freqX:0.37, freqY:0.20, rx:0.70, ry:0.20, color:[253,195,108], a:0.60 },
      { angle:0.70, dAngle:-0.00045, baseCx:0.54, baseCy:0.62, driftX:0.15, driftY:0.08, phX:4.8, phY:0.5, freqX:0.22, freqY:0.40, rx:0.74, ry:0.17, color:[195, 65, 12], a:0.68 },
    ];

    let t = 0;

    const draw = () => {
      t += 0.003;

      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      bands.forEach(b => {
        b.angle += b.dAngle;

        // Drifting center
        const cx = W * (b.baseCx + b.driftX * Math.sin(b.freqX * t + b.phX));
        const cy = H * (b.baseCy + b.driftY * Math.cos(b.freqY * t + b.phY));

        // Ellipse via context scale trick: scale Y so a circle becomes an ellipse
        const rx = W * b.rx;
        const ry = H * b.ry;
        const scaleY = ry / rx;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(b.angle);
        ctx.scale(1, scaleY);

        const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
        const [r, g, bv] = b.color;
        grd.addColorStop(0,    `rgba(${r},${g},${bv},${b.a})`);
        grd.addColorStop(0.45, `rgba(${r},${g},${bv},${+(b.a * 0.40).toFixed(3)})`);
        grd.addColorStop(0.80, `rgba(${r},${g},${bv},${+(b.a * 0.10).toFixed(3)})`);
        grd.addColorStop(1,    `rgba(${r},${g},${bv},0)`);

        ctx.beginPath();
        ctx.arc(0, 0, rx, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // CSS blur is the key ingredient — it merges the raw bands into one
  // continuous glowing aurora field. saturate lifts the warmth.
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 2,
        filter: "blur(48px) saturate(1.3)",
      }}
    />
  );
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

      <style>{`
        :root {
          --orange: #fb923c;
          --orange-dark: #c45c00;
          --bg: #1a1a1a;
        }

        body { background: var(--bg); }

        .space-mono { font-family: 'Space Mono', monospace; }

        /* Noise grain overlay */
        .page-wrap::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.04;
          pointer-events: none;
          z-index: 50;
        }

        /* Entrance animations */
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .rise { animation: riseIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.15s; }
        .d3 { animation-delay: 0.28s; }
        .d4 { animation-delay: 0.42s; }
        .d5 { animation-delay: 0.55s; }
        .d6 { animation-delay: 0.68s; }

        .hero-name {
          font-family: 'Bebas Neue', sans-serif;
          font-weight: 400;
          font-size: clamp(72px, 12vw, 140px);
          line-height: 0.95;
          letter-spacing: 0.04em;
        }

        /* Tech stack row */
        .tech-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .tech-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 16px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #e5e7eb;
        }
        .tech-item img {
          width: 18px;
          height: 18px;
          opacity: 0.75;
        }
        .tech-item .fa-brain {
          width: 14px;
          height: 14px;
          color: #fb923c;
          opacity: 0.75;
        }

        /* Mac-style mesh gradient blobs */
        .mesh-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
        }
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(72px);
        }

        @keyframes b1 {
          0%,100% { transform: translate(0px,    0px)   scale(1);    }
          25%     { transform: translate(60px,  -80px)  scale(1.15); }
          50%     { transform: translate(-40px, -30px)  scale(0.9);  }
          75%     { transform: translate(20px,   60px)  scale(1.05); }
        }
        @keyframes b2 {
          0%,100% { transform: translate(0px,    0px)   scale(1);    }
          30%     { transform: translate(-70px,  50px)  scale(1.2);  }
          60%     { transform: translate(50px,   80px)  scale(0.85); }
          80%     { transform: translate(-20px, -60px)  scale(1.1);  }
        }
        @keyframes b3 {
          0%,100% { transform: translate(0px,   0px)   scale(1);    }
          40%     { transform: translate(80px,  40px)  scale(0.9);  }
          70%     { transform: translate(-50px, 70px)  scale(1.15); }
        }
        @keyframes b4 {
          0%,100% { transform: translate(0px,    0px)   scale(1);   }
          35%     { transform: translate(-60px, -40px)  scale(1.1); }
          65%     { transform: translate(40px,   50px)  scale(0.9); }
        }

        /* Photo ring + heat corona */
        .photo-ring {
          box-shadow:
            0 0 0 3px var(--bg),
            0 0 0 5px var(--orange),
            0 0 28px 4px rgba(251,146,60,0.4),
            0 0 55px 10px rgba(234,88,12,0.18);
          animation: coronaHeat 16s ease-in-out infinite;
        }
        @keyframes coronaHeat {
          0%   { box-shadow: 0 0 0 3px var(--bg), 0 0 0 5px var(--orange), 0 0 16px 2px  rgba(251,146,60,0.18), 0 0 32px 5px  rgba(234,88,12,0.08); }
          7%   { box-shadow: 0 0 0 3px var(--bg), 0 0 0 5px var(--orange), 0 0 26px 5px  rgba(251,146,60,0.28), 0 0 50px 10px rgba(234,88,12,0.13); }
          13%  { box-shadow: 0 0 0 3px var(--bg), 0 0 0 5px var(--orange), 0 0 18px 2px  rgba(251,146,60,0.20), 0 0 36px 6px  rgba(234,88,12,0.09); }
          22%  { box-shadow: 0 0 0 3px var(--bg), 0 0 0 5px var(--orange), 0 0 22px 3px  rgba(251,146,60,0.24), 0 0 42px 7px  rgba(234,88,12,0.11); }
          31%  { box-shadow: 0 0 0 3px var(--bg), 0 0 0 5px var(--orange), 0 0 14px 1px  rgba(251,146,60,0.15), 0 0 28px 4px  rgba(234,88,12,0.07); }
          38%  { box-shadow: 0 0 0 3px var(--bg), 0 0 0 5px var(--orange), 0 0 30px 6px  rgba(251,146,60,0.32), 0 0 56px 12px rgba(234,88,12,0.15); }
          47%  { box-shadow: 0 0 0 3px var(--bg), 0 0 0 5px var(--orange), 0 0 20px 3px  rgba(251,146,60,0.22), 0 0 38px 7px  rgba(234,88,12,0.10); }
          55%  { box-shadow: 0 0 0 3px var(--bg), 0 0 0 5px var(--orange), 0 0 25px 4px  rgba(251,146,60,0.27), 0 0 46px 9px  rgba(234,88,12,0.12); }
          61%  { box-shadow: 0 0 0 3px var(--bg), 0 0 0 5px var(--orange), 0 0 15px 2px  rgba(251,146,60,0.17), 0 0 30px 5px  rgba(234,88,12,0.08); }
          72%  { box-shadow: 0 0 0 3px var(--bg), 0 0 0 5px var(--orange), 0 0 24px 4px  rgba(251,146,60,0.26), 0 0 44px 8px  rgba(234,88,12,0.12); }
          83%  { box-shadow: 0 0 0 3px var(--bg), 0 0 0 5px var(--orange), 0 0 17px 2px  rgba(251,146,60,0.19), 0 0 34px 5px  rgba(234,88,12,0.09); }
          91%  { box-shadow: 0 0 0 3px var(--bg), 0 0 0 5px var(--orange), 0 0 28px 5px  rgba(251,146,60,0.30), 0 0 52px 11px rgba(234,88,12,0.14); }
          100% { box-shadow: 0 0 0 3px var(--bg), 0 0 0 5px var(--orange), 0 0 16px 2px  rgba(251,146,60,0.18), 0 0 32px 5px  rgba(234,88,12,0.08); }
        }

        /* Buttons */
        .btn-fill {
          background: linear-gradient(135deg, var(--orange-dark) 0%, var(--orange) 100%);
          color: #5a2000;
          font-weight: 700;
          text-shadow: 0 1px 1px rgba(255,160,60,0.6);
          position: relative;
          overflow: hidden;
          transition: transform 0.18s cubic-bezier(0.22,1,0.36,1), box-shadow 0.18s ease, filter 0.18s ease;
        }
        .btn-fill::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%);
          transform: translateX(-100%);
          transition: transform 0.45s ease;
        }
        .btn-fill:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(251, 146, 60, 0.35);
          filter: brightness(1.06);
        }
        .btn-fill:hover::after { transform: translateX(100%); }
        .btn-fill:active {
          transform: translateY(0px);
          box-shadow: 0 2px 8px rgba(251, 146, 60, 0.2);
          filter: brightness(0.96);
        }

        .btn-outline {
          border: 1px solid rgba(251, 146, 60, 0.45);
          color: var(--orange);
          transition: transform 0.18s cubic-bezier(0.22,1,0.36,1), box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease;
        }
        .btn-outline:hover {
          transform: translateY(-2px);
          background: rgba(251, 146, 60, 0.08);
          border-color: var(--orange);
          box-shadow: 0 8px 24px rgba(251, 146, 60, 0.15), inset 0 0 0 1px rgba(251,146,60,0.3);
        }
        .btn-outline:active {
          transform: translateY(0px);
          box-shadow: none;
        }

/* Contact links */
        .contact-link { transition: color 0.2s; }
        .contact-link:hover { color: var(--orange); }
        .contact-link:hover .fa-icon { opacity: 0.8; }

        /* Work cards grid — responsive */
        .work-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 640px) {
          .work-grid { grid-template-columns: 1fr; }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .work-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* Work card focus styles */
        .work-card-link:focus-visible {
          outline: 2px solid var(--orange);
          outline-offset: 3px;
          border-radius: 10px;
        }

      `}</style>

      <div className="page-wrap min-h-screen bg-[#1a1a1a] text-white space-mono relative">

        {/* Scroll progress bar */}
        <div style={{
          position: 'fixed', top: 0, left: 0, zIndex: 200,
          height: '3px', width: `${scrollProgress * 100}%`,
          background: '#fb923c',
          borderRadius: '0 2px 2px 0',
          pointerEvents: 'none',
          transition: 'width 0.05s linear',
        }} />

        {/* Ambient glow */}
        <div style={{
          position: 'fixed', top: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: '800px', height: '600px',
          background: 'radial-gradient(ellipse at 50% -10%, rgba(251,146,60,0.09) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* Nav */}
        <nav className="rise d1 relative z-10 flex justify-center gap-10 px-6 py-5 border-b border-white/[0.05]" aria-label="Main navigation">
          <a href="/resume" className="text-[11px] tracking-[0.2em] text-gray-300 hover:text-orange-400 transition-colors">
            Resume
          </a>
          <a href="https://www.linkedin.com/in/derekthedev/" target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 text-[11px] tracking-[0.2em] text-gray-300 hover:text-orange-400 transition-colors"
            aria-label="LinkedIn (opens in new tab)">
            <FontAwesomeIcon icon={faLinkedinIn} className="w-3 h-3" />
            LinkedIn
          </a>
          <a href="https://github.com/derekthedev" target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 text-[11px] tracking-[0.2em] text-gray-300 hover:text-orange-400 transition-colors"
            aria-label="GitHub (opens in new tab)">
            <FontAwesomeIcon icon={faGithub} className="w-3 h-3" />
            GitHub
          </a>
        </nav>

        {/* Hero */}
        <div className="relative">
          <NeuralBackground />
          {/* mesh-bg blobs replaced by canvas mesh gradient */}
        <section className="relative z-10 max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">

          {/* Photo */}
          <div className="rise d2 mx-auto mb-10 relative" style={{ width: 148, height: 148 }}>
            <div className="w-full h-full rounded-full overflow-hidden photo-ring">
              <Image src={derek} alt="Derek Montgomery" width={148} height={148} className="object-cover w-full h-full" priority />
            </div>
          </div>

          <div>
            {/* Eyebrow */}
            <p className="rise d3 text-[22px] text-orange-400 tracking-[0.12em] mb-3">
              Hey, I'm
            </p>

            {/* Name */}
            <h1 className="rise d4 hero-name text-white mb-6">
              Derek Montgomery
            </h1>

            {/* Subtitle */}
            <p className="rise d5 text-[20px] text-gray-400 mb-5 leading-relaxed">
              Senior Software Engineer at{" "}
              <a href="https://www.oreilly.com/" target="_blank" rel="noreferrer" className="text-gray-200 font-medium hover:text-orange-400 transition-colors">O'Reilly Media</a>
            </p>

            {/* Tech stack */}
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

            {/* Bio */}
            <p className="rise d6 text-[15px] text-gray-400 leading-relaxed max-w-xl mx-auto mb-10">
              With over <span className="text-gray-200 font-medium">15 years</span> building digital products, I've got experience{" "}
              <span className="text-gray-200 font-medium">leading</span> engineering teams,{" "}
              <span className="text-gray-200 font-medium">building</span> startups, and{" "}
              <span className="text-gray-200 font-medium">consulting</span> for large corporations.
            </p>

            {/* CTAs */}
            <div className="rise d6 flex gap-4 justify-center">
              <a href="/resume" className="btn-fill text-[15px] px-8 py-3 rounded-lg tracking-wide">
                View Resume
              </a>
            </div>
          </div>
        </section>
        </div>

        {/* Work */}
        <WorkCards />

        {/* Footer */}
        <footer className="relative z-10 max-w-4xl mx-auto px-6 pb-10" aria-label="Contact">
          <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(251,146,60,0.3),transparent)', marginBottom: '2rem' }} />
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            {[
              { href: "mailto:derekthedev@icloud.com", label: "derekthedev@icloud.com", icon: faEnvelope, ariaLabel: "Email Derek" },
              { href: "tel:13098400133",               label: "309.840.0133",            icon: faMobile,   ariaLabel: "Call Derek" },
            ].map(({ href, label, icon, ariaLabel }) => (
              <a key={label} href={href} aria-label={ariaLabel}
                className="contact-link flex items-center gap-2 text-[12px] text-gray-300 hover:text-orange-400 transition-colors tracking-[0.06em]">
                <FontAwesomeIcon icon={icon} className="w-3.5 opacity-60" aria-hidden="true" />
                {label}
              </a>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 10, color: '#aaa', letterSpacing: '0.1em', marginTop: '1.5rem' }}>
            © 2026 Derek Montgomery
          </p>
        </footer>

      </div>
    </>
  );
}
