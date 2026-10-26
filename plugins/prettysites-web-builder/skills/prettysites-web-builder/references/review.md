# Look-and-fix review

Run `node scripts/qa.mjs <page> shots/`, open every screenshot, then go through this file.

## Blocking (fix before scoring)
- Any console error, failed request or missing font in the QA report
- Horizontal scroll on the 390px phone shot
- The first paint is blank or a white flash on a dark page
- Text unreadable over media in any shot
- A video that should play is paused or missing a poster
- Content overlapping the nav or other content
- Placeholder copy, invented proof, emoji icons, dead links without a demo note

## Score 1–10
| Area | 10 looks like |
|---|---|
| Memorable moment | You could describe the page to a friend in one sentence |
| Typography | Clear hierarchy, deliberate pairing, tight display type, comfortable body |
| Composition | Strong asymmetry or a strong centre; nothing feels randomly placed |
| Media | Art-directed, subject and text don't fight, colours match the tokens |
| Motion | One orchestrated moment, quiet elsewhere, smooth at 60fps |
| Copy | Specific, short, no filler, buttons say what happens |
| Mobile | Designed, not squeezed: crops, sizes and order make sense on a phone |
| Polish | Consistent radii, spacing steps and alignment; focus states visible |

Pass: average ≥ 8 and nothing below 7. Otherwise fix the three lowest areas and run QA again (max three rounds; report what's left).

## Fix moves
- **Generic:** make the display type bigger and tighter, cut a section, cut words, strengthen the one moment.
- **Busy:** remove decoration, unify radii, add one spacing step, reduce to bg / ink / muted / accent.
- **Flat:** add a media layer, a gradient scrim, film grain, glass surfaces or light falloff.
- **Text fights media:** move the copy to the calm area, add a scrim, or choose a calmer clip.
- **Mobile broken:** re-crop with `object-position` or a vertical asset, scale type with clamp(), stack columns, hide secondary nav behind a menu.
- **Motion janky:** animate only transform/opacity/filter/clip-path, lower blur, pause off-screen loops, re-encode scrub video with dense keyframes.
