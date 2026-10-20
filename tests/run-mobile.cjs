// Run after npm run build. Requires npx playwright install chromium.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '../out');
const artifacts = path.resolve(__dirname, '../test-results');
fs.mkdirSync(artifacts, { recursive: true });
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
const server = http.createServer((req,res) => {
 let file;
 try { file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname)); } catch {res.writeHead(400).end();return;}
 if (file !== root && !file.startsWith(root + path.sep)) {res.writeHead(403).end();return;}
 if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file,'index.html');
 if (!fs.existsSync(file)) {res.writeHead(404).end();return;}
 res.setHeader('Content-Type',mime[path.extname(file)] || 'application/octet-stream');
 fs.createReadStream(file).pipe(res);
});
server.listen(0,'127.0.0.1',async()=>{
 const url=process.env.M3E_URL || `http://127.0.0.1:${server.address().port}`;
 let code=0;
 // Async children allow this process to serve requests while the browser runs.
 const {spawn}=require('node:child_process');
 for(const name of ['parity','gestures','flows','keyboard','prompt']) {
  const status=await new Promise(resolve=>{const p=spawn(process.execPath,[path.join(__dirname,'browser',name+'.cjs')],{stdio:'inherit',env:{...process.env,M3E_URL:url,M3E_ARTIFACT_DIR:artifacts}});p.on('exit',resolve);p.on('error',()=>resolve(1));});
  if(status!==0){code=1;break;}
 }
 server.close(()=>process.exit(code));
});
