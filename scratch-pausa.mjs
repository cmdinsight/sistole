// Busca pausas de VERDAD: un intervalo largo comparado con el ciclo de BASE
// —la mediana de los demás—, no con el más corto de la tira. La diferencia
// importa: si hay una extrasístole, el intervalo más corto es el prematuro y la
// razón max/min mide la prematuridad, no la pausa.
import { readFileSync } from 'node:fs';
import { fetchRecord, diccionarioDx } from './scripts/cinc.mjs';
import { prepareRecord } from './scripts/ptbxl.mjs';
import { decodeRecord } from './src/ecg12/record.js';
import { measure } from './src/ecg12/measure.js';
const dx = await diccionarioDx();
const idx = JSON.parse(readFileSync('.cinc-cache/indice.json', 'utf8'));
const LEADS = ['I','II','III','aVR','aVL','aVF','V1','V2','V3','V4','V5','V6'];
const mediana = (a) => { const v=a.slice().sort((x,y)=>x-y); const m=v.length>>1; return v.length%2?v[m]:(v[m-1]+v[m])/2; };
for (const c of idx[process.argv[2]]) {
  let sig; try { sig = decodeRecord(prepareRecord(await fetchRecord('ningbo', c.g, c.id))); } catch (e) { continue; }
  const fs = sig.fs; let plana = false;
  for (const l of LEADS) { const s = sig.leads[l]; if (!s) { plana=true; break; }
    let peor = Infinity;
    for (let i=0;i+fs<=s.length;i+=fs){let lo=Infinity,hi=-Infinity;
      for(let k=i;k<i+fs;k++){if(s[k]<lo)lo=s[k];if(s[k]>hi)hi=s[k];} peor=Math.min(peor,hi-lo);}
    if (peor < 0.05) { plana=true; break; } }
  if (plana) continue;
  const q = measure(sig);
  const rr = q.rr.map(x => x*1000);
  if (rr.length < 4) continue;
  const larga = Math.max(...rr);
  const base = mediana(rr.filter(x => x < larga * 0.75));   // el ciclo sin la pausa
  if (!base) continue;
  const razon = larga / base;
  // Lo que interesa: pausas que NO son un múltiplo del ciclo.
  const lejosDeEntero = Math.min(Math.abs(razon - Math.round(razon)), 0.5);
  console.log(c.id.padEnd(8), 'e'+String(c.age??'?').padStart(3), c.sex, 'fc'+q.hr.toFixed(0).padStart(3),
    'qrs'+q.qrsMs.toFixed(0).padStart(3), 'n'+(q.noise*1000).toFixed(0).padStart(3), 'lat'+String(q.beats.length).padStart(2),
    'base'+base.toFixed(0).padStart(5), 'pausa'+larga.toFixed(0).padStart(5), 'razon'+razon.toFixed(2),
    lejosDeEntero > 0.20 ? ' NO-MULTIPLO' : '            ',
    '|', c.dx.map(k=>dx[k]||k).join('; ').slice(0,52));
}
