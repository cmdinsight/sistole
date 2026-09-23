// Busca la FORMA de un paro sinusal sobre lo que ya está en caché: una línea de
// base regular, UNA pausa larga, y esa pausa sin ser un múltiplo del ciclo.
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { prepareRecord } from './scripts/ptbxl.mjs';
import { decodeRecord } from './src/ecg12/record.js';
import { measure } from './src/ecg12/measure.js';
import { loadIndex } from './scripts/ptbxl-index.mjs';
const CACHE = '.ptbxl-cache';
const meta = {};
for (const r of await loadIndex()) meta[r.id] = r;
const heas = readdirSync(CACHE).filter((f) => f.endsWith('_hr.hea'));
const mediana = (a) => { const v=a.slice().sort((x,y)=>x-y); const m=v.length>>1; return v.length%2?v[m]:(v[m-1]+v[m])/2; };
let n = 0;
for (const f of heas) {
  const id = String(parseInt(f.split('_')[0], 10));
  if (!meta[id]) continue;                       // sólo los revisados por humano
  let q;
  try { q = measure(decodeRecord(prepareRecord(join(CACHE, f)))); } catch (e) { continue; }
  n++;
  const rr = q.rr.map((x) => x * 1000);
  if (rr.length < 6 || q.noise > 0.08 || q.qrsMs > 120) continue;
  const larga = Math.max(...rr);
  const resto = rr.filter((x) => x !== larga);
  const base = mediana(resto);
  const disp = (Math.max(...resto) - Math.min(...resto)) / Math.min(...resto);
  const razon = larga / base;
  // Una sola pausa (las demás parejas), clara, y que no sea un múltiplo.
  const lejos = Math.abs(razon - Math.round(razon));
  if (disp > 0.35 || razon < 1.6 || lejos < 0.22) continue;
  console.log(String(id).padEnd(6), 'e'+String(meta[id].age??'?').padStart(3), meta[id].sex,
    'fc'+q.hr.toFixed(0).padStart(3), 'qrs'+q.qrsMs.toFixed(0).padStart(3), 'n'+(q.noise*1000).toFixed(0).padStart(3),
    'base'+base.toFixed(0).padStart(5), 'pausa'+larga.toFixed(0).padStart(5), 'razon'+razon.toFixed(2),
    'disp'+(disp*100).toFixed(0)+'%', '|', Object.keys(meta[id].scp).join(','), '|', (meta[id].report||'').slice(0,58));
}
console.error(`\n${n} registros medidos`);
