# Techniques

Recipes for memorable moments, with single-file implementation examples. Pick one as the page's signature and keep the rest quiet. All recipes respect `prefers-reduced-motion`.

| Recipe | Use it when | Weight |
|---|---|---|
| 1. Scroll-scrubbed video | A transformation should play as the visitor scrolls (take-off, assembly, zoom from orbit) | heavy |
| 2. Idle loop + scroll layer | The scene must feel alive before anyone scrolls | medium |
| 3. Seamless background loop | A clip has a visible cut at the loop point | light |
| 4. Live-textured giant type | A single word should be the hero, filled with moving colour | light |
| 5. 3D product with exploded view | A physical product should rotate and come apart on scroll | heavy |
| 6. Floating phrases that avoid the text | An ambient hero needs drifting words that never cover the headline | medium |
| 7. Glass panel over media | Controls or cards sit on top of moving footage | light |
| 8. Word-by-word blur reveal | A headline should breathe in on load | light |
| 9. Scroll-linked fade content | Sections appear after a cinematic hero | light |
| 10. Mobile media framing | The subject crops badly on phones | light |

---

## 1. Scroll-scrubbed video

Scroll position sets `video.currentTime`. Two things make it smooth: an encode with a keyframe every few frames, and easing the time toward its target instead of seeking on every scroll event.

Encode (see `media.md`): `-g 4 -keyint_min 4 -sc_threshold 0`, no B-frames, `+faststart`.

```html
<section class="scrub" style="height:400vh">
  <div class="stage" style="position:sticky;top:0;height:100vh;overflow:hidden">
    <video id="film" src="film.mp4" muted playsinline preload="auto"
           style="width:100%;height:100%;object-fit:cover"></video>
  </div>
</section>
<script>
const v = document.getElementById('film'), sec = document.querySelector('.scrub');
let target = 0, shown = 0;
const progress = () => {
  const r = sec.getBoundingClientRect();
  return Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
};
// piecewise map: hold the first beat, then play, then hold the last frame
const map = (p) => p < 0.08 ? 0 : p > 0.92 ? 1 : (p - 0.08) / 0.84;
addEventListener('scroll', () => { target = map(progress()) * (v.duration || 0); }, { passive: true });
(function tick() {
  shown += (target - shown) * 0.18;
  if (Math.abs(target - shown) > 0.01 && v.readyState >= 2) v.currentTime = shown;
  requestAnimationFrame(tick);
})();
</script>
```
- Hold beats at the start and end (`map`) so the first and last frames are readable.
- iOS needs one user gesture before seeking works reliably: call `v.play().then(() => v.pause())` on the first touch.
- Reduced motion: show the poster and the final frame as two stills.

## 2. Idle loop + scroll layer

The hero plays a short ambient loop (propeller turning, steam rising) until the visitor scrolls, then crossfades into the scrubbed film from recipe 1.

```js
const idle = document.getElementById('idle');   // autoplay muted loop playsinline
const film = document.getElementById('film');   // scrubbed, starts on the same frame as idle
addEventListener('scroll', () => {
  const p = map(progress());
  const fade = Math.min(1, p / 0.04);            // first 4% of the scroll swaps layers
  idle.style.opacity = 1 - fade;
  film.style.opacity = fade;
  if (fade === 1 && !idle.paused) idle.pause();
  if (fade === 0 && idle.paused) idle.play();
}, { passive: true });
```
Generate the idle loop from the film's first frame, so the swap is invisible.

## 3. Seamless background loop

A clip played forward then reversed has no cut. Build it once with ffmpeg; never reverse at runtime.

```bash
ffmpeg -i clip.mp4 -filter_complex "[0:v]reverse[r];[0:v][r]concat=n=2:v=1[v]" -map "[v]" \
  -c:v libx264 -crf 22 -pix_fmt yuv420p -movflags +faststart -an loop.mp4
```
For motion that must keep its direction (clouds drifting one way), crossfade the last second into the first instead.

## 4. Live-textured giant type

A WebGL shader paints moving colour; the word cuts through a solid layer with `mix-blend-mode: lighten`, so the shader shows only inside the letters.

```html
<div class="knock" style="position:relative;isolation:isolate;overflow:hidden">
  <canvas style="position:absolute;inset:0;width:100%;height:100%"></canvas>
  <h1 style="position:relative;margin:0;background:var(--bg);color:#000;mix-blend-mode:lighten;
             font:800 clamp(84px,20vw,320px)/.82 var(--display);letter-spacing:-.055em">Pipeline</h1>
</div>
```
- Keep every shader colour darker than `--bg` per channel, otherwise the background tints.
- Fragment shader idea: two levels of fbm domain warping mapped onto 4–5 brand colours, time scaled by ~0.06.
- Render only while visible (IntersectionObserver); with reduced motion, draw one frame.
- Fallback without WebGL: plain coloured type.

## 5. 3D product with exploded view

Three.js, a group per part, and one scroll-driven state object.

```js
const EXPLODE = { crystal: 1.9, bezel: 1.35, hands: 0.95, dial: 0.5, case: 0, movement: -0.85, back: -1.4 };
// keyframes per section: [rotX, rotY, x, y, scale, explode]
const KEYS = [[0.16, -0.3, 1.5, 0, 1, 0], [0.04, -1.45, -1.4, 0, 1.1, 0], [-1.0, -0.26, 1.2, 0, 0.78, 1]];
function frame(dt) {
  const t = target(sectionProgress());              // interpolate KEYS with smoothstep
  const k = 1 - Math.pow(0.0015, dt);               // frame-rate independent easing
  for (const n in cur) cur[n] += (t[n] - cur[n]) * k;
  model.rotation.set(cur.rx, cur.ry, 0);
  model.position.set(cur.x, cur.y, 0);
  model.scale.setScalar(cur.s);
  for (const [part, off] of Object.entries(EXPLODE)) parts[part].position.z = off * cur.explode;
}
```
- Lighting: `RoomEnvironment` through `PMREMGenerator` gives believable metal for free; add one directional key light.
- A real GLB model beats procedural geometry for anything photographic. Compress it with `npx @gltf-transform/cli optimize in.glb out.glb --texture-compress webp`.
- Exploded labels are HTML, positioned each frame by projecting an anchor with `vector.project(camera)`; fade them in only past ~60% explode.
- Tilt the explode axis toward the screen's vertical (rotate X about −1 rad) so parts stack top to bottom and labels don't collide.

## 6. Floating phrases that avoid the text

Short phrases fade in at random positions, never on top of the headline or buttons.

```js
const avoid = () => [...document.querySelectorAll('h1, .sub, .cta')].map(e => e.getBoundingClientRect());
const hits = (a, b, pad = 16) => !(a.right + pad < b.left || a.left - pad > b.right || a.bottom + pad < b.top || a.top - pad > b.bottom);
function place(el) {
  for (let i = 0; i < 40; i++) {
    el.style.left = Math.random() * (innerWidth - el.offsetWidth - 32) + 16 + 'px';
    el.style.top = Math.random() * (innerHeight - el.offsetHeight - 120) + 80 + 'px';
    const r = el.getBoundingClientRect();
    if (![...avoid(), ...live.map(x => x.getBoundingClientRect())].some(b => hits(r, b))) return true;
  }
  return false;                                      // no free spot: skip this phrase
}
```
Limit to 4–5 visible on desktop and 2 on phones, balance left and right, stagger words 80–120ms, and stop the loop when the tab is hidden.

## 7. Glass panel over media

```css
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px) saturate(1.4);
  -webkit-backdrop-filter: blur(18px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 20px 50px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
}
@supports not (backdrop-filter: blur(1px)) { .glass { background: rgba(20, 20, 24, 0.72); } }
```
Text on glass needs ≥ 4.5:1 against the darkest frame of the footage; check a screenshot at the worst moment.

## 8. Word-by-word blur reveal

```js
const h = document.querySelector('[data-words]');
h.innerHTML = h.textContent.trim().split(/\s+/).map((w, i) =>
  `<span style="display:inline-block;opacity:0;filter:blur(10px);transform:translateY(12px);
   transition:opacity .9s ${i * 90}ms cubic-bezier(.16,1,.3,1),filter .9s ${i * 90}ms,transform .9s ${i * 90}ms cubic-bezier(.16,1,.3,1)">${w}</span>`
).join(' ');
requestAnimationFrame(() => h.querySelectorAll('span').forEach(s => { s.style.opacity = 1; s.style.filter = 'none'; s.style.transform = 'none'; }));
```
Keep the original text in `aria-label` on the heading so screen readers read one sentence.

## 9. Scroll-linked fade content

```css
.reveal { transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1); }
.js .reveal:not(.in) { opacity: 0; transform: translateY(24px); }
@media (prefers-reduced-motion: reduce) { .js .reveal:not(.in) { opacity: 1; transform: none; } }
```
```js
document.documentElement.classList.add('js');
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
```
The `js` class means the content stays visible if scripts fail.

## 10. Mobile media framing

- Set `object-position` per breakpoint so the subject stays in frame: `object-position: 70% 50%` on phones when the subject sits right of centre.
- Prefer a separate 9:16 crop for phones (`<source media="(max-width: 860px)" src="hero-vertical.mp4">`) over squeezing a 16:9 clip.
- Put a gradient fade (`linear-gradient(to top, var(--bg) 55%, transparent)`) behind bottom-anchored text when media extends under it.
