# Media

## Sourcing order
1. The user's own photos, footage, renders or 3D files.
2. Generated media from a tool the user has (image, video or 3D generation). Confirm the cost before any paid generation the user didn't ask for.
3. Free-licence sources the user approves (CC0 or CC BY with credit). Record the source and licence in a short `MEDIA.md` next to the page.
4. No media: a type-, colour- and shader-led design. Never use invented URLs or grey boxes.

Never use footage of real people without permission, celebrities, logos, trademarks or recognisable characters.

## Prompt formulas

**Hero still (also the first frame of a video):**
`<subject>, <setting>, <time of day and light>, <lens and camera height>, <palette in 3 colours>, empty <left|right|upper> third for a headline, photorealistic, no text, no logos`

**Image-to-video:**
`Locked-off camera. <one motion>: <how it moves, speed>. <secondary ambient motion>. Ends on <state>. No cuts, no camera shake, no text.`

Use the same image as start and end frame for an idle loop, or two frames of one scene for a transformation (cockpit → plane flying away). One clear motion per clip; several small ones read as noise.

**Consistency across clips:** generate the key stills first, approve them, then animate between them. Changing the prompt between clips changes the object.

## Preparing video with ffmpeg

Web hero loop (≤ 1920px, no audio, fast start):
```bash
ffmpeg -i in.mp4 -an -vf "scale=1920:-2:flags=lanczos,fps=24" -c:v libx264 -preset slow -crf 22 \
  -pix_fmt yuv420p -movflags +faststart hero.mp4
```

Scroll-scrub version (a keyframe every 4 frames, no B-frames, to shorten seek distance):
```bash
ffmpeg -i in.mp4 -an -vf "scale=1920:-2,fps=24" -c:v libx264 -preset slow -crf 20 -g 4 -keyint_min 4 \
  -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart scrub.mp4
```

Poster from the first frame:
```bash
ffmpeg -i hero.mp4 -frames:v 1 -q:v 3 poster.jpg
```

Optional vertical crop for hero footage (subject at 60% across; inspect framing and keep the source). Never crop a recorded catalog UI to hide aspect-ratio problems:
```bash
ffmpeg -i hero.mp4 -vf "crop=ih*9/16:ih:(iw-ih*9/16)*0.6:0,scale=1080:-2" -c:v libx264 -crf 22 \
  -pix_fmt yuv420p -movflags +faststart -an hero-vertical.mp4
```

Seamless ping-pong loop: see `techniques/prettysites-signatures.md`, recipe 3.

## Images
- WebP or AVIF at 1.5–2× the displayed width, with `width`/`height` attributes to prevent layout shift.
- `loading="lazy"` below the fold, `fetchpriority="high"` on the hero image.
- Transparent cut-outs: PNG or WebP with alpha; trim empty margins.
