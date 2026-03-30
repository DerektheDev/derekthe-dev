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

function AuroraBackground() {
  const glowRef = useRef(null);
  const crispRef = useRef(null);

  useEffect(() => {
    const glowCanvas = glowRef.current;
    const crispCanvas = crispRef.current;

    function initGL(canvas) {
      return canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false });
    }
    const glGlow = initGL(glowCanvas);
    const glCrisp = initGL(crispCanvas);
    if (!glGlow || !glCrisp) return;

    function resize() {
      const dpr = Math.min(devicePixelRatio, 2);
      const w = glowCanvas.parentElement.offsetWidth * dpr;
      const h = glowCanvas.parentElement.offsetHeight * dpr;
      glowCanvas.width = w; glowCanvas.height = h;
      crispCanvas.width = w; crispCanvas.height = h;
      glGlow.viewport(0, 0, w, h);
      glCrisp.viewport(0, 0, w, h);
    }
    resize();
    window.addEventListener('resize', resize);

    const vsSrc = `
      attribute vec3 a_pos;
      attribute vec3 a_normal;
      attribute vec4 a_col;
      attribute float a_edge;
      uniform mat4 u_proj;
      uniform mat4 u_view;
      varying vec4 v_col;
      varying float v_edge;
      varying vec3 v_norm;
      varying vec3 v_worldPos;
      void main() {
        vec4 wp = u_view * vec4(a_pos, 1.0);
        gl_Position = u_proj * wp;
        v_col = a_col;
        v_edge = a_edge;
        v_norm = (u_view * vec4(a_normal, 0.0)).xyz;
        v_worldPos = wp.xyz;
      }
    `;
    const fsSrc = `
      precision mediump float;
      varying vec4 v_col;
      varying float v_edge;
      varying vec3 v_norm;
      varying vec3 v_worldPos;
      void main() {
        float gauss = exp(-3.5 * v_edge * v_edge);
        vec3 n = normalize(v_norm);
        vec3 lightDir = normalize(vec3(0.3, 0.8, 0.5));
        float diffuse = dot(n, lightDir) * 0.5 + 0.5;
        float rim = 1.0 - abs(dot(normalize(-v_worldPos), n));
        rim = pow(rim, 2.0) * 0.6;
        vec3 lit = v_col.rgb * (diffuse * 0.7 + 0.3) + v_col.rgb * rim;
        lit *= 0.7;
        float alpha = gauss * v_col.a;
        gl_FragColor = vec4(lit * alpha, alpha);
      }
    `;

    function setupProgram(gl) {
      function mkShader(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src); gl.compileShader(s);
        return s;
      }
      const prog = gl.createProgram();
      gl.attachShader(prog, mkShader(gl.VERTEX_SHADER, vsSrc));
      gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, fsSrc));
      gl.linkProgram(prog); gl.useProgram(prog);
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
      gl.disable(gl.DEPTH_TEST); gl.clearColor(0, 0, 0, 0);
      return {
        prog,
        uProj: gl.getUniformLocation(prog, 'u_proj'),
        uView: gl.getUniformLocation(prog, 'u_view'),
        aPos: gl.getAttribLocation(prog, 'a_pos'),
        aNormal: gl.getAttribLocation(prog, 'a_normal'),
        aCol: gl.getAttribLocation(prog, 'a_col'),
        aEdge: gl.getAttribLocation(prog, 'a_edge'),
        buf: gl.createBuffer(),
      };
    }
    const pGlow = setupProgram(glGlow);
    const pCrisp = setupProgram(glCrisp);

    // Matrix helpers
    function perspective(fov, aspect, near, far) {
      const f = 1 / Math.tan(fov / 2), nf = 1 / (near - far);
      return new Float32Array([f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)*nf,-1, 0,0,2*far*near*nf,0]);
    }
    function mat4Mul(a, b) {
      const o = new Float32Array(16);
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++)
        o[j*4+i] = a[i]*b[j*4] + a[4+i]*b[j*4+1] + a[8+i]*b[j*4+2] + a[12+i]*b[j*4+3];
      return o;
    }
    function mat4RotY(a) { const c=Math.cos(a),s=Math.sin(a); return new Float32Array([c,0,s,0, 0,1,0,0, -s,0,c,0, 0,0,0,1]); }
    function mat4RotX(a) { const c=Math.cos(a),s=Math.sin(a); return new Float32Array([1,0,0,0, 0,c,-s,0, 0,s,c,0, 0,0,0,1]); }
    function mat4RotZ(a) { const c=Math.cos(a),s=Math.sin(a); return new Float32Array([c,-s,0,0, s,c,0,0, 0,0,1,0, 0,0,0,1]); }
    function mat4Trans(x, y, z) { return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1]); }

    // Helix parameters
    const SEGS = 400, TURNS = 4.0, R = 5.0, PITCH = 8.0;

    function vecCross(a, b) { return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]; }
    function vecNormalize(v) { const l = Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]) || 1; return [v[0]/l, v[1]/l, v[2]/l]; }
    function vecSub(a, b) { return [a[0]-b[0], a[1]-b[1], a[2]-b[2]]; }

    function helixPoint(t, phase, time, wobble) {
      const angle = t * TURNS * Math.PI * 2 + phase;
      let x = R * Math.cos(angle), y = (t - 0.5) * PITCH, z = R * Math.sin(angle);
      x += Math.sin(t*5 + time*0.6) * wobble;
      y += Math.sin(t*3.7 + time*0.4 + phase) * wobble * 0.6;
      z += Math.cos(t*4.3 + time*0.5 + phase*0.5) * wobble;
      x += Math.sin(t*2.1 + time*0.2) * wobble * 1.5;
      z += Math.cos(t*1.8 + time*0.25) * wobble * 1.2;
      return [x, y, z];
    }

    function buildRibbon(phase, wobble, c1, c2, width, time) {
      const verts = [];
      const points = [], tangents = [];
      for (let i = 0; i <= SEGS; i++) points.push(helixPoint(i/SEGS, phase, time, wobble));
      for (let i = 0; i <= SEGS; i++) tangents.push(vecNormalize(vecSub(points[Math.min(i+1,SEGS)], points[Math.max(i-1,0)])));
      let prevNorm;
      { const t0 = tangents[0]; let up = [0,1,0]; let bn = vecNormalize(vecCross(t0, up));
        if (Math.sqrt(bn[0]*bn[0]+bn[1]*bn[1]+bn[2]*bn[2]) < 0.01) { up = [1,0,0]; bn = vecNormalize(vecCross(t0, up)); }
        prevNorm = vecNormalize(vecCross(bn, t0)); }
      const normals = [prevNorm];
      for (let i = 1; i <= SEGS; i++) {
        const t0 = tangents[i-1], t1 = tangents[i];
        const b = vecCross(t0, t1); const bLen = Math.sqrt(b[0]*b[0]+b[1]*b[1]+b[2]*b[2]);
        if (bLen < 0.0001) { normals.push(prevNorm); } else {
          const axis = [b[0]/bLen, b[1]/bLen, b[2]/bLen];
          const cosA = Math.max(-1, Math.min(1, t0[0]*t1[0]+t0[1]*t1[1]+t0[2]*t1[2]));
          const ang = Math.acos(cosA); const c = Math.cos(ang), s = Math.sin(ang);
          const d = axis[0]*prevNorm[0]+axis[1]*prevNorm[1]+axis[2]*prevNorm[2];
          const cr = vecCross(axis, prevNorm);
          prevNorm = [prevNorm[0]*c+cr[0]*s+axis[0]*d*(1-c), prevNorm[1]*c+cr[1]*s+axis[1]*d*(1-c), prevNorm[2]*c+cr[2]*s+axis[2]*d*(1-c)];
          prevNorm = vecNormalize(prevNorm); normals.push(prevNorm);
        }
      }
      for (let i = 0; i <= SEGS; i++) {
        const t = i/SEGS, p = points[i], norm = normals[i], tang = tangents[i];
        const bn = vecNormalize(vecCross(tang, norm));
        const r = c1[0]+(c2[0]-c1[0])*t, g = c1[1]+(c2[1]-c1[1])*t, b2 = c1[2]+(c2[2]-c1[2])*t;
        const endDist = Math.min(t, 1-t), taper = Math.min(endDist*10, 1);
        const w = width*0.5, alpha = taper*0.16;
        verts.push(p[0]+bn[0]*w, p[1]+bn[1]*w, p[2]+bn[2]*w, norm[0],norm[1],norm[2], r,g,b2,alpha, -1);
        verts.push(p[0]-bn[0]*w, p[1]-bn[1]*w, p[2]-bn[2]*w, norm[0],norm[1],norm[2], r,g,b2,alpha, 1);
      }
      return new Float32Array(verts);
    }

    const ribbonDefs = [
      { phase: 0,            wobble: 0.35, c1:[0.98,0.57,0.24], c2:[0.96,0.62,0.04], width:1.6 },
      { phase: Math.PI*2/3,  wobble: 0.40, c1:[0.96,0.62,0.04], c2:[0.85,0.65,0.12], width:0.5 },
      { phase: Math.PI*4/3,  wobble: 0.30, c1:[0.85,0.65,0.12], c2:[0.98,0.57,0.24], width:1.0 },
      { phase: Math.PI*1/3,  wobble: 0.25, c1:[0.98,0.57,0.24], c2:[0.78,0.42,0.38], width:0.3 },
      { phase: Math.PI,      wobble: 0.45, c1:[0.96,0.62,0.04], c2:[0.98,0.57,0.24], width:0.7 },
    ];

    const start = performance.now();

    function drawScene(gl, p, proj, view, time) {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniformMatrix4fv(p.uProj, false, proj);
      gl.uniformMatrix4fv(p.uView, false, view);
      ribbonDefs.forEach(def => {
        const data = buildRibbon(def.phase, def.wobble, def.c1, def.c2, def.width, time);
        gl.bindBuffer(gl.ARRAY_BUFFER, p.buf);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
        const stride = 11 * 4;
        gl.enableVertexAttribArray(p.aPos); gl.vertexAttribPointer(p.aPos, 3, gl.FLOAT, false, stride, 0);
        gl.enableVertexAttribArray(p.aNormal); gl.vertexAttribPointer(p.aNormal, 3, gl.FLOAT, false, stride, 3*4);
        gl.enableVertexAttribArray(p.aCol); gl.vertexAttribPointer(p.aCol, 4, gl.FLOAT, false, stride, 6*4);
        gl.enableVertexAttribArray(p.aEdge); gl.vertexAttribPointer(p.aEdge, 1, gl.FLOAT, false, stride, 10*4);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, (SEGS+1)*2);
      });
    }

    let animId;
    function frame() {
      const time = (performance.now() - start) / 1000;
      const W = crispCanvas.width, H = crispCanvas.height;
      const proj = perspective(Math.PI/4, W/H, 0.1, 100);
      const camAngle = time * 0.12;
      const camTilt = Math.sin(time * 0.07) * 0.25 + 0.2;
      const camRoll = Math.sin(time * 0.05) * 0.06;
      const view = mat4Mul(mat4Trans(0,0,-6), mat4Mul(mat4RotZ(camRoll), mat4Mul(mat4RotX(camTilt), mat4RotY(camAngle))));
      drawScene(glCrisp, pCrisp, proj, view, time);
      drawScene(glGlow, pGlow, proj, view, time);
      animId = requestAnimationFrame(frame);
    }
    frame();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="aurora-wrap">
      <canvas ref={glowRef} className="c-glow" />
      <canvas ref={crispRef} className="c-crisp" />
    </div>
  );
}

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
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }}
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

        /* Aurora WebGL layers */
        .aurora-wrap { position: absolute; inset: 0; z-index: 0; }
        .c-glow { position: absolute; inset: -40px; width: calc(100% + 80px); height: calc(100% + 80px); filter: blur(32px); opacity: 0.16; }
        .c-crisp { position: absolute; inset: 0; width: 100%; height: 100%; }

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
        <div className="relative" style={{ overflow: 'hidden' }}>
          <AuroraBackground />
          <NeuralBackground />
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
