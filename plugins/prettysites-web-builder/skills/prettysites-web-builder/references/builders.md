# Prompts for other builders

When the user wants a prompt to paste into another tool, the spec is the deliverable. Keep the spec's precision, then fit it to the tool.

| Tool | Open the prompt with | Notes |
|---|---|---|
| Lovable | "React + Vite + TypeScript + Tailwind + shadcn/ui; framer-motion for motion; lucide-react icons." | Tokens as HSL variables in `index.css`. Ask for one page, no auth, no backend. |
| Bolt | "Vite + React + TypeScript + Tailwind + Framer Motion, single page, no backend." | Number the sections; Bolt keeps numbered structure well. |
| v0 | "Next.js App Router + Tailwind + shadcn/ui; framer-motion for motion." | Describe every animation explicitly; v0 adds little motion on its own. |
| Cursor, Claude Code, Codex | The user's stack, or "one standalone index.html, inline CSS and JS, no build step". | They handle long specs; include the file layout and the QA command. |
| Kimi, Manus, Google AI Studio | "Build one standalone index.html with inline CSS and JS and no build step." | Spell out every media URL; agentic builders invent assets when unsure. |

## Rules for any builder
1. **Media URLs in full**, each with its role, fit and position.
2. **Every word of copy** written out. Left alone, builders write filler.
3. **Numbers instead of adjectives:** sizes per breakpoint, tracking, durations, easings, opacities.
4. **Order:** intent → tokens → layers → sections top to bottom → media → states → "Do not" list last.
5. **Length is fine.** 3–15k characters is normal for a hero that looks designed. Don't trim precision.
6. **Fixing drift:** one focused change per message ("H1 clamp(56px, 8vw, 120px), tracking −0.04em"), not a list of ten.

## Prompt skeleton
```
Build <page> for <brand>, <one-line product description>, for <visitor>.
Stack: <line from the table>.
Mood: <3 words>. Memorable moment: <one sentence>.

Design tokens: <exact values>
Fonts: <families, weights, Google Fonts link>
Layout and layers: <back-to-front list with z-index>
Sections:
1. <name> — layout, copy (exact), motion (from/to, duration, easing, trigger), mobile changes
2. …
Media: <slot → URL, fit, position, treatment>
Accessibility: visible focus, alt text, prefers-reduced-motion → <behaviour>
Do not: <list>
```
