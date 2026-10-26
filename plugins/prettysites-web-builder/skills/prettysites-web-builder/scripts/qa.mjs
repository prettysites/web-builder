#!/usr/bin/env node
// Screenshot + QA a page so you can see what you built.
//
// Usage:
//   node scripts/qa.mjs path/to/index.html [out_dir] [--wait 2500] [--full]
//   node scripts/qa.mjs http://localhost:5173 [out_dir]
//
// Writes desktop (1440x900) and phone (390x844) screenshots after entrance
// animations settle, an early desktop frame (350 ms) to check the first paint,
// and prints a QA report: console errors, failed requests, horizontal overflow,
// fonts that did not load, videos that are not playing, images that are broken.
//
// Needs Playwright:  npm i -D playwright && npx playwright install chromium
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { parseOptions, usage } from './qa-options.mjs';

let options;
try { options = parseOptions(process.argv.slice(2)); }
catch (error) { console.error(error.message); process.exit(2); }
if (options.help) { console.log(usage); process.exit(0); }
const { target, out, wait, full } = options;
if (!existsSync(out)) mkdirSync(out, { recursive: true });

let chromium;
try { ({ chromium } = await import('playwright')); }
catch { console.error('Playwright is missing: npm i -D playwright && npx playwright install chromium'); process.exit(2); }

const browser = await chromium.launch();
const report = [];
for (const [name, viewport] of [['desktop', { width: 1440, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: name === 'phone' ? 2 : 1 });
  const errors = [], failed = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
  page.on('pageerror', (e) => errors.push(String(e.message).slice(0, 200)));
  page.on('requestfailed', (r) => failed.push(`${r.failure()?.errorText || 'failed'} ${r.url().slice(0, 140)}`));
  page.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url().slice(0, 140)}`); });

  await page.goto(target, { waitUntil: 'domcontentloaded' });
  if (name === 'desktop') { await page.waitForTimeout(350); await page.screenshot({ path: `${out}/desktop-early.png` }); }
  await page.waitForTimeout(wait);
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: full });

  const facts = await page.evaluate(async () => {
    await document.fonts.ready;
    const fonts = [...document.fonts].map((f) => `${f.family.replace(/"/g, '')} ${f.weight} ${f.status}`);
    const vids = [...document.querySelectorAll('video')].map((v) => ({
      src: (v.currentSrc || v.src || '').split('/').pop().slice(0, 60),
      ready: v.readyState, playing: !v.paused && !v.ended, poster: !!v.poster,
    }));
    const brokenImgs = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src.slice(0, 120));
    const overflow = document.documentElement.scrollWidth - innerWidth;
    const wide = overflow > 0 ? [...document.querySelectorAll('body *')]
      .filter((e) => e.getBoundingClientRect().right > innerWidth + 1).slice(0, 5)
      .map((e) => e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : '')) : [];
    return { title: document.title, fonts, vids, brokenImgs, overflow, wide };
  });

  report.push({ name, ...facts, errors, failed });
  await page.close();
}
await browser.close();

let problems = 0;
const line = (ok, text) => { if (!ok) problems++; console.log(`${ok ? 'OK  ' : 'FIX '} ${text}`); };
console.log(`\nQA for ${target}\nScreenshots: ${out}\n`);
for (const r of report) {
  console.log(`— ${r.name}`);
  line(!!r.title, `title: ${r.title || '(missing)'}`);
  line(r.errors.length === 0, `console errors: ${r.errors.length ? r.errors.join(' | ') : 'none'}`);
  line(r.failed.length === 0, `failed requests: ${r.failed.length ? r.failed.join(' | ') : 'none'}`);
  line(r.overflow <= 0, `horizontal overflow: ${r.overflow > 0 ? `${r.overflow}px (${r.wide.join(', ')})` : 'none'}`);
  const badFonts = r.fonts.filter((f) => !f.endsWith('loaded'));
  line(badFonts.length === 0, `fonts: ${r.fonts.filter((f) => f.endsWith('loaded')).length} loaded${badFonts.length ? `, not loaded: ${badFonts.join(', ')}` : ''}`);
  for (const v of r.vids) line(v.ready >= 2 && (v.playing || v.poster), `video ${v.src}: readyState ${v.ready}, ${v.playing ? 'playing' : 'paused'}${v.poster ? ', has poster' : ', no poster'}`);
  line(r.brokenImgs.length === 0, `broken images: ${r.brokenImgs.length ? r.brokenImgs.join(' | ') : 'none'}`);
}
console.log(`\n${problems ? `${problems} item(s) to fix.` : 'No automatic issues found.'} Now open the screenshots and score the page with references/review.md.`);
writeFileSync(`${out}/report.json`, JSON.stringify({ target, automaticIssues: problems, viewports: report }, null, 2) + '\n');
if (problems) process.exitCode = 1;
