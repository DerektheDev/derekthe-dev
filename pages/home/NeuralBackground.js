import { useEffect, useRef } from "react";

export default function NeuralBackground() {
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

    const NODE_COUNT = 90;
    const CONNECT_DIST = 210;

    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      lx: (Math.random() - 0.5) * canvas.width  * 1.2,
      ly: (Math.random() - 0.5) * canvas.height * 1.2,
      lz: (Math.random() - 0.5) * 500,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      vz: (Math.random() - 0.5) * 0.18,
      r:  Math.random() * 2.4 + 1.2,
      opacity: Math.random() * 0.35 + 0.12,
    }));

    let angleY = 0;
    let angleX = 0;
    const FOCAL = 700;

    function project(lx, ly, lz) {
      const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
      const wx =  lx * cosY + lz * sinY;
      const wz = -lx * sinY + lz * cosY;
      const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
      const wy =  ly * cosX - wz * sinX;
      const fz =  ly * sinX + wz * cosX;

      const depth = FOCAL + fz;
      if (depth < 1) return null;
      const scale = FOCAL / depth;
      return {
        sx: canvas.width  / 2 + wx * scale,
        sy: canvas.height / 2 + wy * scale,
        scale,
        fz,
      };
    }

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

      angleY += 0.0018;
      angleX += 0.0007;

      nodes.forEach(n => {
        n.lx += n.vx; n.ly += n.vy; n.lz += n.vz;
        const bx = canvas.width  * 0.65;
        const by = canvas.height * 0.65;
        const bz = 260;
        if (Math.abs(n.lx) > bx) n.vx *= -1;
        if (Math.abs(n.ly) > by) n.vy *= -1;
        if (Math.abs(n.lz) > bz) n.vz *= -1;
      });

      const projected = nodes.map(n => project(n.lx, n.ly, n.lz));

      for (let i = 0; i < nodes.length; i++) {
        if (!projected[i]) continue;
        for (let j = i + 1; j < nodes.length; j++) {
          if (!projected[j]) continue;
          const dx = nodes[j].lx - nodes[i].lx;
          const dy = nodes[j].ly - nodes[i].ly;
          const dz = nodes[j].lz - nodes[i].lz;
          const dist3d = Math.sqrt(dx*dx + dy*dy + dz*dz);
          if (dist3d < CONNECT_DIST) {
            const proximity = 1 - dist3d / CONNECT_DIST;
            const depthFade = Math.min(projected[i].scale, projected[j].scale);
            const alpha = proximity * depthFade * 0.28;
            ctx.beginPath();
            ctx.moveTo(projected[i].sx, projected[i].sy);
            ctx.lineTo(projected[j].sx, projected[j].sy);
            ctx.strokeStyle = `rgba(255,255,255,${Math.min(alpha, 0.35)})`;
            ctx.lineWidth = 0.8 * depthFade;
            ctx.stroke();
          }
        }
      }

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
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }}
    />
  );
}
