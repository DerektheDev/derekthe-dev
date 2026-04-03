import { useEffect, useRef } from "react";

export default function AuroraBackground() {
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
