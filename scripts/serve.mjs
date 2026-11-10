import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve(import.meta.dirname,'..');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png'};
const server = createServer(async (req,res) => {
  try {
    const path = resolve(root, '.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    if (path !== root && !path.startsWith(root+sep)) { res.writeHead(403); return res.end(); }
    const file = (await stat(path)).isDirectory() ? resolve(path,'index.html') : path;
    res.writeHead(200, {'Content-Type':types[extname(file)] || 'application/octet-stream','Cache-Control':'no-store'});
    res.end(await readFile(file));
  } catch { res.writeHead(404); res.end('Not found'); }
});
const port=Number(process.env.PORT || 4173);
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
