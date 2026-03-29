import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faMobile, faBrain } from "@fortawesome/free-solid-svg-icons";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";

const techStack = [
  { label: "Rails",     iconUrl: "https://cdn.simpleicons.org/rubyonrails/fb923c" },
  { label: "React",     iconUrl: "https://cdn.simpleicons.org/react/fb923c" },
  { label: "Front-End", iconUrl: "https://cdn.simpleicons.org/html5/fb923c" },
  { label: "AI",        faIcon: faBrain },
];
import derek from "../public/derek-linkedin.jpg";

const contactLinks = [
  { href: "mailto:derekthedev@icloud.com", label: "derekthedev@icloud.com", icon: faPaperPlane },
  { href: "tel:13098400133", label: "309.840.0133", icon: faMobile },
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

function useCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef(null);
  const dotScale = useRef(1);

  useEffect(() => {
    const onMove = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);

    const loop = () => {
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${pos.current.x - 5}px, ${pos.current.y - 5}px) scale(${dotScale.current})`;
      }
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${ringPos.current.x - 18}px, ${ringPos.current.y - 18}px)`;
      }
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);

    const onEnter = () => {
      dotScale.current = 1.6;
      if (ringRef.current) {
        ringRef.current.style.width = '48px';
        ringRef.current.style.height = '48px';
        ringRef.current.style.background = 'rgba(251,146,60,0.08)';
      }
    };
    const onLeave = () => {
      dotScale.current = 1;
      if (ringRef.current) {
        ringRef.current.style.width = '36px';
        ringRef.current.style.height = '36px';
        ringRef.current.style.background = 'transparent';
      }
    };

    const interactiveEls = Array.from(document.querySelectorAll('a, button'));
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId.current);
      interactiveEls.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return { dotRef, ringRef };
}

function NeuralBackground({ cursorPosRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const NODE_COUNT = 72;
    const CONNECT_DIST = 180; // 3D distance threshold

    // Nodes live in local 3D space; they drift slowly
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      lx: (Math.random() - 0.5) * canvas.width  * 1.2,
      ly: (Math.random() - 0.5) * canvas.height * 1.2,
      lz: (Math.random() - 0.5) * 500,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      vz: (Math.random() - 0.5) * 0.18,
      r:  Math.random() * 1.8 + 1,
      opacity: Math.random() * 0.25 + 0.08,
    }));

    // Slow rotation angles (radians)
    let angleY = 0;
    let angleX = 0;
    const FOCAL = 700;

    // Project a local-space 3D point → screen 2D + depth info
    function project(lx, ly, lz) {
      // Rotate Y
      const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
      const wx =  lx * cosY + lz * sinY;
      const wz = -lx * sinY + lz * cosY;
      // Rotate X
      const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
      const wy =  ly * cosX - wz * sinX;
      const fz =  ly * sinX + wz * cosX;

      const depth = FOCAL + fz;
      if (depth < 1) return null;
      const scale = FOCAL / depth;
      return {
        sx: canvas.width  / 2 + wx * scale,
        sy: canvas.height / 2 + wy * scale,
        scale,   // 1 = at focal plane; >1 closer; <1 further
        fz,      // for depth-based fade
      };
    }

    // Signals: track by node index pairs + progress t
    const signals = [];
    const spawnSignal = () => {
      const ai = Math.floor(Math.random() * nodes.length);
      const bi = Math.floor(Math.random() * nodes.length);
      if (ai === bi) return;
      const a = nodes[ai], b = nodes[bi];
      const dx = b.lx - a.lx, dy = b.ly - a.ly, dz = b.lz - a.lz;
      if (Math.sqrt(dx*dx + dy*dy + dz*dz) < CONNECT_DIST) {
        signals.push({ ai, bi, t: 0, speed: Math.random() * 0.004 + 0.003 });
      }
    };
    const signalInterval = setInterval(spawnSignal, 600);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Advance rotation
      angleY += 0.0018;
      angleX += 0.0007;

      // Drift nodes in local space (gentle bounce)
      nodes.forEach(n => {
        n.lx += n.vx; n.ly += n.vy; n.lz += n.vz;
        const bx = canvas.width  * 0.65;
        const by = canvas.height * 0.65;
        const bz = 260;
        if (Math.abs(n.lx) > bx) n.vx *= -1;
        if (Math.abs(n.ly) > by) n.vy *= -1;
        if (Math.abs(n.lz) > bz) n.vz *= -1;
      });

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
            n.vx += (dx / dist) * force * 0.04;
            n.vy += (dy / dist) * force * 0.04;
          }
          // Decay back toward natural speed
          n.vx *= 0.96;
          n.vy *= 0.96;
        });
      }

      // Project all nodes once
      const projected = nodes.map(n => project(n.lx, n.ly, n.lz));

      // Draw edges (3D distance check, projected draw)
      for (let i = 0; i < nodes.length; i++) {
        if (!projected[i]) continue;
        for (let j = i + 1; j < nodes.length; j++) {
          if (!projected[j]) continue;
          const dx = nodes[j].lx - nodes[i].lx;
          const dy = nodes[j].ly - nodes[i].ly;
          const dz = nodes[j].lz - nodes[i].lz;
          const dist3d = Math.sqrt(dx*dx + dy*dy + dz*dz);
          if (dist3d < CONNECT_DIST) {
            // Fade by distance AND average depth
            const proximity = 1 - dist3d / CONNECT_DIST;
            const depthFade = Math.min(projected[i].scale, projected[j].scale);
            const alpha = proximity * depthFade * 0.18;
            ctx.beginPath();
            ctx.moveTo(projected[i].sx, projected[i].sy);
            ctx.lineTo(projected[j].sx, projected[j].sy);
            ctx.strokeStyle = `rgba(255,255,255,${Math.min(alpha, 0.22)})`;
            ctx.lineWidth = 0.8 * depthFade;
            ctx.stroke();
          }
        }
      }

      // Draw nodes (size + opacity scale with depth)
      nodes.forEach((n, i) => {
        const p = projected[i];
        if (!p) return;
        const r = n.r * p.scale;
        const opacity = n.opacity * Math.min(p.scale * 1.1, 1);
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, Math.max(r, 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.fill();
      });

      // Draw & advance signals
      for (let i = signals.length - 1; i >= 0; i--) {
        const s = signals[i];
        s.t += s.speed;
        if (s.t >= 1) { signals.splice(i, 1); continue; }
        const pa = projected[s.ai], pb = projected[s.bi];
        if (!pa || !pb) continue;
        const x = pa.sx + (pb.sx - pa.sx) * s.t;
        const y = pa.sy + (pb.sy - pa.sy) * s.t;
        const depthScale = pa.scale + (pb.scale - pa.scale) * s.t;
        const glowR = 5 * depthScale;
        const grd = ctx.createRadialGradient(x, y, 0, x, y, glowR);
        grd.addColorStop(0, `rgba(255,255,255,${0.8 * depthScale})`);
        grd.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.arc(x, y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(signalInterval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}

export default function Home() {
  const scrollProgress = useScrollProgress();
  const { dotRef, ringRef } = useCursor();
  const cursorPosRef = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const onMove = (e) => { cursorPosRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

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

        /* Name shimmer */
        @keyframes nameShimmer {
          0%, 55%  { background-position: -200% center; }
          75%, 100% { background-position: 200% center; }
        }
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

        @media (pointer: fine) {
          *, *::before, *::after { cursor: none !important; }
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

        {/* Ambient glow */}
        <div style={{
          position: 'fixed', top: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: '800px', height: '600px',
          background: 'radial-gradient(ellipse at 50% -10%, rgba(251,146,60,0.09) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* Nav */}
        <nav className="rise d1 relative z-10 flex justify-center gap-10 px-6 py-5 border-b border-white/[0.05]">
          {[["Resume", "/resume"], ["LinkedIn", "https://www.linkedin.com/in/derekthedev/"], ["GitHub", "https://github.com/derekthedev"]].map(([label, href]) => (
            <a key={label} href={href}
              className="text-[11px] tracking-[0.2em] uppercase text-gray-400 hover:text-orange-400 transition-colors">
              {label}
            </a>
          ))}
        </nav>

        {/* Hero */}
        <div className="relative">
          <NeuralBackground cursorPosRef={cursorPosRef} />
          <div className="mesh-bg">
            <div className="blob" style={{ width:520, height:520, top:'5%',  left:'20%', background:'rgba(251,146,60,0.22)', animation:'b1 14s ease-in-out infinite' }} />
            <div className="blob" style={{ width:400, height:400, top:'30%', left:'55%', background:'rgba(234,88,12,0.18)',  animation:'b2 18s ease-in-out infinite' }} />
            <div className="blob" style={{ width:460, height:360, top:'50%', left:'10%', background:'rgba(249,115,22,0.15)', animation:'b3 22s ease-in-out infinite' }} />
            <div className="blob" style={{ width:340, height:340, top:'10%', left:'65%', background:'rgba(180,50,10,0.18)',  animation:'b4 16s ease-in-out infinite' }} />
          </div>
        <section className="relative z-10 max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">

          {/* Photo */}
          <div className="rise d2 mx-auto mb-10 relative" style={{ width: 148, height: 148 }}>
            <div className="w-full h-full rounded-full overflow-hidden photo-ring">
              <Image src={derek} alt="Derek Montgomery" width={148} height={148} className="object-cover w-full h-full" priority />
            </div>
          </div>

          {/* Eyebrow */}
          <p className="rise d3 text-[22px] text-orange-400 tracking-[0.12em] mb-3">
            Hey, I'm
          </p>

          {/* Name */}
          <h1 className="rise d4 hero-name mb-6">
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
            <span className="text-gray-200 font-medium">leading engineering teams</span>,{" "}
            <span className="text-gray-200 font-medium">building startups</span>, and{" "}
            <span className="text-gray-200 font-medium">consulting for large corporations</span>.
          </p>

          {/* CTAs */}
          <div className="rise d6 flex gap-4 justify-center">
            <a href="/resume" className="btn-fill text-[15px] px-8 py-3 rounded-lg tracking-wide">
              View Resume
            </a>
          </div>
        </section>
        </div>

        {/* Contact */}
        <section className="relative z-10 max-w-4xl mx-auto px-6 py-8 text-center">
          <p className="text-[17px] uppercase tracking-[3px] text-gray-400 mb-4">
            Get in Touch
          </p>
          <div className="flex gap-10 justify-center items-center">
            {contactLinks.map(({ href, label, icon }) => (
              <a key={label} href={href} className="contact-link flex items-center gap-2.5 text-[13px] text-gray-400">
                <FontAwesomeIcon icon={icon} className="fa-icon w-4 opacity-50" />
                {label}
              </a>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
