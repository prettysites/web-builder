# Craft rules

Defaults that make a page read as designed rather than generated. A user instruction or a strong reference overrides any of them.

## Type
- Two families at most: one display face with character, one quiet body face. A mono for labels or data is optional.
- Display sizes are large and tight: hero H1 `clamp(48px, 8vw, 128px)`, line-height 0.9–1.0, tracking −0.02 to −0.05em. Body stays 16–18px, line-height 1.5–1.6, measure 45–70 characters.
- Uppercase only for small labels: 11–13px, tracking +0.08 to +0.16em.
- One accent treatment per heading at most (a serif italic word, a colour word, or a live-textured word). Never all three.
- `text-wrap: balance` on headings, `pretty` on paragraphs. Break hero lines where the thought breaks.
- Avoid the default AI faces for display type (Inter, Space Grotesk, Poppins). Good starting points: Fraunces, Instrument Serif, Bricolage Grotesque, Syne, Unbounded, DM Serif Display, Manrope, Geist, IBM Plex.

## Colour
- Four to six tokens: background, ink, muted ink, line, one accent. Semantic colours (success, error) are separate.
- Tint neutrals toward the accent. Pure #808080 greys look unconsidered.
- Text over video or photos always gets a scrim or a calm area. Body text contrast ≥ 4.5:1.
- One loud colour, used on one or two elements. If it fights the background, shift its hue or saturation instead of adding a second accent.

## Space and layout
- Spacing steps: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128px. Sections breathe: 96–160px vertical on desktop, 64–96px on phones.
- Side gutter `clamp(16px, 4vw, 56px)`, content max-width 1120–1280px.
- Asymmetry beats centring everything. Put the hero copy against the calm side of the media.
- Cards only where something is a separate object. Same radius, padding and baseline for siblings.

## Motion
- One orchestrated moment per page. Everything else is quiet: reveals of 16–32px rise plus fade, 600–900ms, `cubic-bezier(0.16, 1, 0.3, 1)`.
- Entrances stagger 60–120ms in reading order and finish within ~1.2s.
- Hover feedback 150–250ms. Never `linear` or the browser default `ease` for entrances.
- Animate only `transform`, `opacity`, `filter` and `clip-path`. Keep blur ≤ 14px.
- Content is visible at rest. A reveal may animate in, but the page must not stay blank if the observer never fires.
- `prefers-reduced-motion: reduce`: no autoplaying motion beyond a static poster; scroll-driven scenes jump to their resting states.

## Copy
- Headlines are short and specific, with a point of view: "Time, kept quietly", not "Revolutionize your workflow".
- Banned filler: revolutionize, supercharge, seamless, cutting-edge, unlock, elevate, game-changer, next level, harness the power.
- Buttons say what happens: "Book a pipeline review", "Try a two-minute breath". Never "Learn more" or "Submit".
- No invented proof. Sample brands get sample content that is clearly not a claim.
- Headings without trailing full stops read cleaner in display sizes.

## Media
- Real footage, photography or 3D carries a page; flat stock illustrations don't.
- One hero asset, art-directed: subject on one side, calm area for text, colours that match the tokens.
- Video: H.264 MP4, muted, `playsinline`, poster frame, ≤ 1920px wide, ideally under 6 MB for a hero loop.
