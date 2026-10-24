import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';import {dirname,join} from 'node:path';import {fileURLToPath} from 'node:url';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(readFileSync(join(root,'EXPORT_MANIFEST.json'),'utf8'));
let fail=0;
for (const file of manifest.files) {let data;try{data=readFileSync(join(root,file.path.replace(/^parent-app\//,'')))}catch{console.error('Missing',file.path);fail++;continue}
const sha=createHash('sha1').update(Buffer.from('blob '+data.length+'\0')).update(data).digest('hex');if(sha!==file.sha){console.error('Mismatch',file.path);fail++}}
if(manifest.files.length!==46){console.error('Bad count');fail++}
if(fail){console.error(fail+' integrity failures');process.exitCode=1}else console.log('Verified '+manifest.files.length+' pinned source files');
