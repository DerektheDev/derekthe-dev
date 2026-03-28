import { useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faMobile, faBrain } from "@fortawesome/free-solid-svg-icons";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";

const techStack = [
  { label: "Rails",     iconUrl: "https://cdn.simpleicons.org/rubyonrails/fb923c" },
  { label: "React",     iconUrl: "https://cdn.simpleicons.org/react/fb923c" },
  { label: "AI",        faIcon: faBrain },
  { label: "Front-End", iconUrl: "https://cdn.simpleicons.org/html5/fb923c" },
];
import derek from "../public/derek-2019.jpg";

const contactLinks = [
  { href: "mailto:derekthedev@icloud.com", label: "derekthedev@icloud.com", icon: faPaperPlane },
  { href: "https://www.linkedin.com/in/derekthedev/", label: "/in/derekthedev", icon: faLinkedinIn },
  { href: "tel:13098400133", label: "309.840.0133", icon: faMobile },
];

function NeuralBackground() {
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

        /* Name */
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
          gap: 28px;
          flex-wrap: wrap;
        }
        .tech-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #9ca3af;
        }
        .tech-item img {
          width: 15px;
          height: 15px;
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

        /* Photo ring */
        .photo-ring {
          box-shadow:
            0 0 0 3px var(--bg),
            0 0 0 5px var(--orange),
            0 0 48px rgba(251, 146, 60, 0.22);
        }

        /* Buttons */
        .btn-fill {
          background: linear-gradient(135deg, var(--orange-dark) 0%, var(--orange) 100%);
          color: #111;
          font-weight: 600;
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
      `}</style>

      <div className="page-wrap min-h-screen bg-[#1a1a1a] text-white space-mono relative">

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
          {[["Resume", "/resume"], ["GitHub", "https://github.com/derekthedev"], ["Contact", "mailto:derekthedev@icloud.com"]].map(([label, href]) => (
            <a key={label} href={href}
              className="text-[11px] tracking-[0.2em] uppercase text-gray-400 hover:text-orange-400 transition-colors">
              {label}
            </a>
          ))}
        </nav>

        {/* Hero */}
        <div className="relative">
          <NeuralBackground />
          <div className="mesh-bg">
            <div className="blob" style={{ width:520, height:520, top:'5%',  left:'20%', background:'rgba(251,146,60,0.22)', animation:'b1 14s ease-in-out infinite' }} />
            <div className="blob" style={{ width:400, height:400, top:'30%', left:'55%', background:'rgba(234,88,12,0.18)',  animation:'b2 18s ease-in-out infinite' }} />
            <div className="blob" style={{ width:460, height:360, top:'50%', left:'10%', background:'rgba(249,115,22,0.15)', animation:'b3 22s ease-in-out infinite' }} />
            <div className="blob" style={{ width:340, height:340, top:'10%', left:'65%', background:'rgba(180,50,10,0.18)',  animation:'b4 16s ease-in-out infinite' }} />
          </div>
        <section className="relative z-10 max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">

          {/* Photo */}
          <div className="rise d2 mx-auto mb-10 w-[116px] h-[116px] rounded-full overflow-hidden photo-ring">
            <Image src={derek} alt="Derek Montgomery" width={116} height={116} className="object-cover w-full h-full" priority />
          </div>

          {/* Eyebrow */}
          <p className="rise d3 text-[11px] text-orange-400 tracking-[0.45em] uppercase mb-3">
            Hey, I'm
          </p>

          {/* Name */}
          <h1 className="rise d4 hero-name text-white mb-6">
            Derek Montgomery
          </h1>

          {/* Subtitle */}
          <p className="rise d5 text-[20px] text-gray-400 mb-5 leading-relaxed">
            Senior Software Engineer at{" "}
            <span className="text-gray-200 font-medium">O'Reilly Media</span>
          </p>

          {/* Tech stack */}
          <div className="rise d5 tech-row mb-10">
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

          {/* CTAs */}
          <div className="rise d6 flex gap-4 justify-center">
            <a href="/resume" className="btn-fill text-[15px] px-8 py-3 rounded-lg tracking-wide">
              View Resume
            </a>
            <a href="https://www.linkedin.com/in/derekthedev/" target="_blank" rel="noreferrer"
              className="btn-outline text-[15px] px-8 py-3 rounded-lg tracking-wide flex items-center gap-2.5">
              <FontAwesomeIcon icon={faLinkedinIn} className="w-4 h-4" />
              LinkedIn
            </a>
          </div>
        </section>
        </div>

        {/* Contact */}
        <section className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
          <p className="text-sm uppercase tracking-[3px] text-gray-500 mb-8">
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
