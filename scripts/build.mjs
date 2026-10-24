import { cp, mkdir, rm, stat, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const src = resolve(root, 'public');
const out = resolve(root, 'dist');
if (!(await stat(resolve(src, 'index.html')).catch(() => null))?.isFile()) {
  throw new Error('Missing public/index.html');
}
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(src, out, { recursive: true });
await writeFile(resolve(out, 'build-info.json'), JSON.stringify({
  app: 'sekret-bip-parent-portal',
  commit: process.env.CF_PAGES_COMMIT_SHA || 'local',
  build: 'static-no-child-data'
}) + '\n');
console.log('Built privacy-first parent portal into dist/');
