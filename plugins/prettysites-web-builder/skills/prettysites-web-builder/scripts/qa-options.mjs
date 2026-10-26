import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const usage = 'Usage: node scripts/qa.mjs <file-or-url> [out_dir] [--wait ms] [--full]';
export function parseOptions(argv) {
  const positional = [];
  let wait = 2500, full = false;
  for (let index = 0; index < argv.length; index++) {
    const value = argv[index];
    if (value === '--help' || value === '-h') return { help: true };
    if (value === '--full') full = true;
    else if (value === '--wait') {
      const supplied = argv[++index];
      wait = Number(supplied);
      if (supplied === undefined || supplied.trim() === '' || !Number.isFinite(wait) || wait < 0 || wait > 60000) throw Error('--wait must be 0–60000 milliseconds');
    } else if (value.startsWith('-')) throw Error('Unknown option: ' + value);
    else positional.push(value);
  }
  if (!positional.length || positional.length > 2) throw Error(usage);
  const source = positional[0];
  if (/^[a-z]+:\/\//i.test(source) && !/^https?:\/\//i.test(source)) throw Error('Use an HTTP(S) URL or local file path');
  if (!/^https?:\/\//i.test(source) && !existsSync(resolve(source))) throw Error('Local file does not exist: ' + source);
  return { target: /^https?:\/\//i.test(source) ? new URL(source).href : pathToFileURL(resolve(source)).href, out: resolve(positional[1] || 'shots'), wait, full };
}
