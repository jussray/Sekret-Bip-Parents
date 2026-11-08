import { copyFile, mkdir, rm, stat, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root=process.cwd(), source=resolve(root,'public'), output=resolve(root,'dist');
const PUBLIC_FRONT_DOOR_FILES=['index.html','styles.css','app.js','404.html','_headers'];
if (!(await stat(resolve(source,'index.html')).catch(()=>null))?.isFile()) throw Error('Missing public front door');
await rm(output,{recursive:true,force:true}); // generated build only
await mkdir(output,{recursive:true});
for (const file of PUBLIC_FRONT_DOOR_FILES) await copyFile(resolve(source,file),resolve(output,file));
await writeFile(resolve(output,'build-info.json'),JSON.stringify({app:'sekret-bip-parent-front-door',commit:process.env.CF_PAGES_COMMIT_SHA||'local',mode:'welcome-only'})+'\n');
console.log('Built front door only; private features excluded from public deployment');
