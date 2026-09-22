// Fuerza un caso concreto sembrando su repaso como vencido, y captura el panel.
import { chromium } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root=path.resolve('dist');
const T={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png'};
const srv=http.createServer((q,res)=>{const u=decodeURIComponent(q.url.split('?')[0]);
  if(u.startsWith('/api/')){res.writeHead(200,{'content-type':'application/json'});res.end(JSON.stringify(u==='/api/me'?{user:{name:'P',email:'p@l',role:'medico'}}:{data:{}}));return;}
  let f=path.join(root,u); if(!fs.existsSync(f)||fs.statSync(f).isDirectory()) f=u.startsWith('/ecg12/')||u.startsWith('/assets/')?f:path.join(root,'index.html');
  if(!fs.existsSync(f)){res.writeHead(404);res.end('no');return;}
  res.writeHead(200,{'content-type':T[path.extname(f)]??'application/octet-stream'});fs.createReadStream(f).pipe(res);});
await new Promise(r=>srv.listen(4195,r));
const caso=process.argv[2], resp=process.argv[3];
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1400,height:1700}});
p.on('pageerror',e=>console.log('PAGE ERROR:',e.message));
await p.addInitScript((c)=>{const ayer=Date.now()-2*86400000;
  localStorage.setItem('sistole_sr12_v1::p_l',JSON.stringify({[c]:{interval:1,nextReview:ayer,seen:1,lapses:1,lastAnswered:ayer}}));},caso);
await p.goto('http://localhost:4195/',{waitUntil:'networkidle'}); await p.waitForTimeout(2500);
await p.locator('button').nth(4).click(); await p.waitForTimeout(3500);
const reg=(await p.getByText(/REGISTRO \d+/i).first().innerText()).match(/\d+/)[0];
console.log('caso mostrado: registro', reg);
if(resp){ const o=p.locator('button').filter({hasText:new RegExp(resp,'i')}).first();
  if(await o.count()) await o.click(); else await p.locator('button').nth(11).click();
  await p.waitForTimeout(1500); }
const panel=(await p.innerText('body')).split('\n').filter(l=>/mm|ms|lpm|razón|pausa|RR/i.test(l)).slice(0,6);
console.log('panel:', JSON.stringify(panel));
await p.screenshot({path:`.ptbxl-preview/ver-${caso}.png`,fullPage:true});
await b.close(); srv.close(); process.exit(0);
