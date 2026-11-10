import { mkdir, cp, readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
await mkdir(resolve(root,'dist'), { recursive:true });
for (const name of ['index.html','src','assets','_headers','404.html']) {
  await cp(resolve(root,name), resolve(root,'dist',name), { recursive:true });
}
const html = await readFile(resolve(root,'dist/index.html'),'utf8');
for (const file of [...html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g)].map(m=>m[1])) {
  await access(resolve(root,'dist',file));
}
console.log('Built static website in dist/; all local HTML assets exist.');
