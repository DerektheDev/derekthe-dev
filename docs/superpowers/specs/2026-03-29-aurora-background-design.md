# Aurora Background — Design Spec

## Summary

Add a WebGL aurora effect behind the existing neural network animation in the homepage hero section. The aurora renders 3D helical ribbons in warm colors (orange, amber, gold) that rotate in perspective, creating a layered visual: aurora → mesh blobs → neural net → hero content.

## Visual Design

### What it looks like
- 5 ribbon strands wound around a large 3D helix, slowly rotating
- Ribbons vary in width (thick 1.6 down to thin 0.3 wisps) for visual variety
- Soft gaussian edges — bright glowing core fading to transparent at the edges
- Half-lambert shading + Fresnel rim glow gives 3D volume/curvature
- A blurred glow canvas behind the crisp canvas adds atmospheric bloom
- The helix radius (5.0) and pitch (8.0) are large enough that ribbons extend well beyond the viewport on all sides — no visible cutoffs

### Color palette
- Orange: rgb(250, 145, 61) → Amber: rgb(245, 158, 11)
- Amber: rgb(245, 158, 11) → Gold: rgb(217, 166, 31)
- Gold: rgb(217, 166, 31) → Orange: rgb(250, 145, 61)
- Muted rose wisp: rgb(199, 107, 97)
- Mid amber→orange accent

### Animation
- Camera orbits the helix on the Y axis at 0.25 rad/s
- Camera tilt oscillates ±35° on a ~48s cycle
- Gentle camera roll (±0.1 rad) on a ~70s cycle
- Ribbons have organic wobble from layered sin/cos perturbations on x, y, z
- Overall feel: medium intensity, Stripe-like fluidity

## Architecture

### Layering order (back to front)
1. **AuroraBackground** — new WebGL dual-canvas component (glow + crisp)
2. **mesh-bg blobs** — existing CSS animated gradient blobs (unchanged)
3. **NeuralBackground** — existing canvas neural net (unchanged)
4. **Hero content** — text, photo, CTAs (z-index: 10)

### New component: `AuroraBackground`
- Lives inline in `pages/index.js` (follows existing pattern — no `components/` directory)
- Returns two `<canvas>` elements wrapped in a positioned container
- Uses WebGL with vertex + fragment shaders
- Dual-canvas approach: one canvas has CSS `filter: blur(32px)` for glow, the other renders crisp
- Builds ribbon geometry each frame as triangle strips using parallel transport for stable normals

### Technical details

**Shaders:**
- Vertex shader: transforms positions via projection + view matrices, passes normal/edge/color varyings
- Fragment shader: gaussian alpha falloff across ribbon width (`exp(-3.5 * edge²)`), half-lambert diffuse + Fresnel rim for 3D volume, moderate brightness (0.9x multiplier)

**Geometry per ribbon (built each frame):**
- 400 segments per ribbon, 5 ribbons = 2000 total segments
- Each segment: 2 vertices (left/right edge of ribbon) with position, normal, color, edge parameter
- Normals computed via parallel transport (Rodrigues rotation) for twist-free frames
- Blending: additive (`gl.blendFunc(gl.ONE, gl.ONE)`) — ribbons glow where they overlap

**Helix parameters:**
- Radius: 5.0, Pitch: 8.0, Turns: 4.0
- 5 strands at phases: 0, 2π/3, 4π/3, π/3, π
- Wobble amounts: 0.25–0.45 (layered sin/cos on x, y, z)

**Performance:**
- WebGL is GPU-accelerated
- No per-frame canvas filter calls (blur is CSS-only on the glow canvas)
- Geometry is rebuilt per frame (Float32Array) — ~44K floats total, well within budget
- `devicePixelRatio` capped at 2

### DOM structure change in hero section
```jsx
<div className="relative">
  <AuroraBackground />     {/* NEW — positioned absolute, z-index 0 */}
  <div className="mesh-bg"> {/* existing blobs, z-index 1 */}
  <NeuralBackground />      {/* existing, positioned absolute */}
  <section className="relative z-10"> {/* hero content */}
```

### What stays the same
- `NeuralBackground` component — completely unchanged
- `mesh-bg` blobs — completely unchanged
- Hero content, nav, footer, work cards — unchanged
- All existing CSS custom properties and animations — unchanged

### Coverage
- Hero section only (same as existing NeuralBackground)
- Aurora canvases are `position: absolute; inset: 0` within the hero wrapper

## Reference implementation
The working prototype is at `.superpowers/brainstorm/82143-1774816318/content/aurora-ribbons-v3.html`
