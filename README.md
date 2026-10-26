# PrettySites Web Builder: a free agent skill

**Make Claude, Codex or Cursor build cinematic websites that don't look AI-made.**

AI-built sites look alike because the brief is vague, the media is missing and nobody checks the result. This skill gives your agent a fixed routine: decide the one memorable moment, write an exact spec, use real media, build with motion recipes with example code, then **screenshot its own work and fix it** until it passes a design review.

## What's inside
- **A spec template** that forces real values: hex colours, clamp() sizes, easings, durations, exact copy and a "do not" list.
- **68 motion recipes with example code** (a starting point to adapt and check, not a tested component library), including PrettySites signatures:
  - scroll-scrubbed video;
  - an idle loop that hands over to scroll;
  - seamless loops;
  - live-textured giant type;
  - a 3D product with an exploded view;
  - floating phrases that never cover the headline;
  - glass panels;
  - word-by-word reveals;
  - mobile media framing;

  plus an extended library of 58 more: liquid glass, depth carousels, cursor spotlights, stacking cards, text scramble, 3D models with Three.js and more.
- **Craft rules with numbers** for type, colour, spacing, motion and copy, including a list of filler words to avoid.
- **Media guide:** prompt formulas for image and video generators, plus ffmpeg recipes for web loops, scroll-scrub encodes, posters and vertical crops.
- **Look-and-fix loop:** `scripts/qa.mjs` (Node) or `scripts/shoot.py` (Python) takes desktop, phone and first-paint screenshots and reports console errors, failed requests, overflow, fonts and videos. A scoring rubric decides what to fix next.
- **Prompt mode:** ask for a prompt instead of code and get one shaped for Lovable, Bolt, v0, Cursor, Codex, Claude Code or Kimi.

## Install

### Claude.ai and Claude desktop
1. Download `prettysites-web-builder.zip` from the latest release.
2. In Claude, open **Customize → Skills**, upload the zip and switch the skill on. Code execution must be enabled.

### Claude Code (plugin)
```
/plugin marketplace add prettysites/web-builder
/plugin install prettysites-web-builder@prettysites
```

### Claude Code, Codex, Cursor and other agents (manual)
Download `prettysites-web-builder.zip` from the latest release and unzip it, or clone this repository and copy `plugins/prettysites-web-builder/skills/prettysites-web-builder`. Put the `prettysites-web-builder` folder (the one that contains `SKILL.md`) into your agent's skills folder:
- Claude Code: `~/.claude/skills/` (all projects) or `.claude/skills/` (one project)
- Codex: `~/.agents/skills/` (all projects) or `.agents/skills/` (one repository)
- Cursor: `~/.cursor/skills/` or `~/.agents/skills/` (all projects), or `.cursor/skills/` (one project)

Restart the agent or open a new chat so it picks the skill up.

### Optional: let the agent see its work
```
npm i -D playwright && npx playwright install chromium
```

## Try it
Ask for a site and the skill takes over:
- "Build a landing page hero for a ceramic studio in Porto. Quiet, warm, tactile."
- "Make a scroll story for an electric boat: dock at dawn, then open water."
- "Write a Lovable prompt for a waitlist page for my AI travel app."
- "Here's my site. Make it look designed."

## Start from a finished design
[PrettySites](https://prettysites.io/?utm_source=github&utm_medium=agent-skill&utm_campaign=web-builder&utm_content=readme) is a catalog of cinematic website designs. You can watch each one in motion, then copy it as a full prompt for your AI builder, with editable code and media. There are free designs to try, and every premium design comes in one membership. **Background Studio** turns a moving background, your brand and a headline into one prompt.

👉 **[Browse the catalog](https://prettysites.io/?utm_source=github&utm_medium=agent-skill&utm_campaign=web-builder&utm_content=readme-cta)**

## License
MIT. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
