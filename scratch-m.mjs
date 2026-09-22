import { measure } from './src/ecg12/measure.js';
import { decodeRecord } from './src/ecg12/record.js';
import { fetchRecord, prepareRecord } from './scripts/ptbxl.mjs';
import { loadIndex } from './scripts/ptbxl-index.mjs';
const idx = await loadIndex();
const L = ['I','II','III','aVR','aVL','aVF','V1','V2','V3','V4','V5','V6'];
for (const a of process.argv.slice(2)) {
  const r = idx.find(x=>x.id===a);
  const q = measure(decodeRecord(prepareRecord(await fetchRecord(parseInt(a,10)))));
  const mm=(v)=>(v*10).toFixed(1).padStart(6); const uv=(v)=>String(Math.round(v*1000)).padStart(5);
  console.log(`\n══ ${a} · ${r?.age}${r?.sex} · FC ${q.hr.toFixed(0)} · QRS ${q.qrsMs} · eje ${q.axisDeg?.toFixed(0)} · PR ${q.prMs===null?'—':q.prMs.toFixed(0)} · QTc ${q.qtcBazett?.toFixed(0)} · ruido ${Math.round(q.noise*1000)} · cv ${q.rrCv.toFixed(3)}`);
  console.log(`   ${Object.keys(r?.scp||{}).join('+')} | ${(r?.report||'').slice(0,130)}`);
  for (const l of L) console.log('  ',l.padEnd(4),'R',mm(q.r[l]),'S',mm(-q.s[l]),'pp',mm(q.r[l]-q.s[l]),'ST',uv(q.st[l]),'T',uv(q.t[l]),"R'",mm(q.rPrime[l]||0));
}
