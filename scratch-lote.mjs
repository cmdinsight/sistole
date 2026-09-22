// Corre varias búsquedas de una sola pasada y reporta los mejores candidatos de
// cada una. Lo mismo que hace ptbxl-search.mjs, pero en lote.
import { measure } from './src/ecg12/measure.js';
import { decodeRecord } from './src/ecg12/record.js';
import { checkFindings, margin } from './src/ecg12/findings.js';
import { fetchRecord, prepareRecord } from './scripts/ptbxl.mjs';
import { loadIndex } from './scripts/ptbxl-index.mjs';

const CONFUNDEN = ['PACE','CLBBB','CRBBB','WPW','3AVB','2AVB'];
const idx = await loadIndex();
const cache = new Map();
async function medir(id) {
  if (cache.has(id)) return cache.get(id);
  let q = null;
  try { q = measure(decodeRecord(prepareRecord(await fetchRecord(id)))); } catch {}
  cache.set(id, q); return q;
}

const LOTE = JSON.parse(process.argv[2]);
for (const job of LOTE) {
  const spec = (await import('./scripts/ejemplos/' + job.spec)).default;
  const buscados = new Set(job.scp || []);
  let univ = idx.filter(r => {
    if (job.scp && !job.scp.some(c => r.scp[c] !== undefined)) return false;
    if (job.not && job.not.some(c => r.scp[c] !== undefined)) return false;
    if (job.todos && !job.todos.every(c => r.scp[c] !== undefined)) return false;
    if (CONFUNDEN.some(c => r.scp[c] !== undefined && !buscados.has(c))) return false;
    return true;
  }).slice(0, job.limit || 140);
  const filas = []; const fallosPorRegla = {};
  let pend = univ.slice();
  await Promise.all(Array.from({ length: 8 }, async () => {
    while (pend.length) {
      const r = pend.pop();
      const q = await medir(r.id);
      if (!q || !q.beats || q.beats.length < 6 || q.hr < 30 || q.hr > 230) continue;
      const malos = checkFindings(q, spec).filter((x) => !x.ok);
      if (malos.length) { for (const f of malos) fallosPorRegla[f.label] = (fallosPorRegla[f.label]||0)+1; continue; }
      filas.push({ r, q, m: margin(q, spec) });
    }
  }));
  // Primero limpio, después claro: un hallazgo mediano sobre un trazado nítido
  // enseña mejor que uno espectacular sobre uno sucio.
  filas.sort((a, b) => (a.q.noise - b.q.noise) || (b.m - a.m));
  console.log(`\n████ ${job.nombre} — ${univ.length} medidos · ${filas.length} cumplen`);
  if (!filas.length) {
    console.log('  reglas que fallan (cuántos registros incumple cada una):');
    for (const [k,v] of Object.entries(fallosPorRegla).sort((a,b)=>b[1]-a[1]).slice(0,6))
      console.log('    ' + String(v).padStart(4) + '  ' + k);
  }
  for (const f of filas.slice(0, 3)) {
    const uv = (x) => Math.round(x * 1000);
    console.log(`  ${String(f.r.id).padStart(6)} ${String(f.r.age).padStart(3)}${f.r.sex}  margen ${f.m.toFixed(2)}  ruido ${String(uv(f.q.noise)).padStart(3)}  FC ${String(Math.round(f.q.hr)).padStart(3)}  QRS ${f.q.qrsMs}  eje ${f.q.axisDeg===null?'—':Math.round(f.q.axisDeg)}  · ${Object.keys(f.r.scp).join('+')}`);
    console.log(`         ${(f.r.report||'').slice(0,115)}`);
  }
}
