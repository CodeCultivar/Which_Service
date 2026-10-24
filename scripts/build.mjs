// Builds the site into dist/. Copies index.html and assets/, filling in the keys from environment variables
// (in GitHub Actions these come from repository secrets). Anything filled in is visible in the published page.
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from 'node:fs';

const KEYS = [
  { name: 'FIREBASE_API_KEY', required: true,  why: 'Google sign-in and sync need it' },
  { name: 'TMDB_KEY',         required: false, why: 'without it each device pastes its own key in Settings' },
];

let html = readFileSync('index.html', 'utf8');
let failed = false;
for (const { name, required, why } of KEYS) {
  const token = '__' + name + '__';
  const value = (process.env[name] || '').trim();
  if (!html.includes(token)) { console.error('index.html has no ' + token + ' placeholder'); failed = true; continue; }
  if (!value) {
    if (required) { console.error('Missing secret ' + name + ' (' + why + ').'); failed = true; }
    else console.warn('Secret ' + name + ' is not set: ' + why + '.');
    continue;
  }
  if (!/^[A-Za-z0-9._-]+$/.test(value)) { console.error(name + ' has unexpected characters. Re-copy it without spaces or quotes.'); failed = true; continue; }
  html = html.split(token).join(value);
  console.log('Filled in ' + name + ' (' + value.length + ' characters).');
}
const sha = (process.env.GITHUB_SHA || '').slice(0, 7) || 'local';
html = html.split('__BUILD__').join(sha + ' ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC');
if (failed) process.exit(1);

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
writeFileSync('dist/index.html', html);
cpSync('assets', 'dist/assets', { recursive: true });
console.log('Built dist/.');
