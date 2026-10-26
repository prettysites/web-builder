# Spec template

Write this before any code. Copy the skeleton, replace every `…` with a concrete value, and delete lines that don't apply. If a line can't be filled with a number or exact string, the decision isn't made yet.

```
# <Brand> — <page type>

## Intent
Product: …                          Visitor: …
Mood (3 words): …                   Memorable moment: …
Primary action: <verb + object>     Output: index.html | <stack> | prompt for <tool>

## Tokens
--bg: #…    --ink: #…    --muted: #…    --line: rgba(…)    --accent: #…
Display font: <family>, <weights>, tracking <em>     Body font: <family>, <weights>
Utility font (labels/data): <family or none>
Type scale: h1 clamp(…px, …vw, …px)/line-height …;  h2 clamp(…);  body …px/…;  label …px uppercase +0.12em
Radius: …px (cards), 999px (pills)       Grid: max-width …px, gutter clamp(16px, 4vw, 56px)
Easing: --out cubic-bezier(0.16, 1, 0.3, 1); --in-out cubic-bezier(0.65, 0, 0.35, 1)

## Layers (back to front, with z-index)
0  background: <video | canvas | image | colour> — source, fit, position, overlay
1  scrim: <gradient with exact stops>
2  content: …
3  fixed UI: nav, controls
4  overlays: toasts, loader

## Sections (in order)
### 1. Hero
Layout: <grid/flex, alignment, exact offsets per breakpoint>
Copy: eyebrow "…" · H1 "…" · sub "…" · CTA "…" → <target>
Motion: <element> from <state> to <state>, <duration>ms, <easing>, delay <ms>, stagger <ms>
Interaction: <scroll range or pointer> → <property>, mapping <in → out>
Mobile (≤ 860px): <what changes>
### 2. …

## Media
| Slot | Source (exact URL or file) | Size / duration | Treatment |
|---|---|---|---|

## States and edge cases
Loading: …   No WebGL / video failed: …   Reduced motion: …   Keyboard: …   Demo links: …

## Do not
- No extra sections beyond the list above
- No placeholder images, emoji icons, invented logos, testimonials or metrics
- …
```

## Precision checklist

- [ ] Every colour is a hex/rgba value and every size is px, rem or clamp().
- [ ] Every animation has from/to values, duration, easing and trigger.
- [ ] Every piece of visible copy is written out, including nav and footer.
- [ ] Mobile behaviour is stated for each section, not "make it responsive".
- [ ] Media slots have real sources or an explicit no-media design.
- [ ] The "Do not" list closes the spec (builders follow what comes last).
