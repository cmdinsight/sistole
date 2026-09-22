#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
// BUSCADOR DE REGISTROS PARA UN CASO NUEVO
// ═══════════════════════════════════════════════════════════════
// Se describe el electro que se quiere enseñar y la herramienta lo busca en
// PTB-XL. La descripción es un `findings`, el mismo objeto que después va en
// cases.js y que las pruebas usan para vigilar el caso.
//
//   # Un bloqueo completo de rama izquierda, entre los anotados como tal
//   npm run search:ptbxl -- --scp CLBBB --findings ejemplos/clbbb.mjs
//
//   # Buscar reemplazo para un caso que ya existe, con sus mismos hallazgos
//   npm run search:ptbxl -- --case inferior-stemi
//
//   # Por lo que escribió el cardiólogo, cuando no hay un código que sirva
//   npm run search:ptbxl -- --report "posterior" --findings ejemplos/posterior.mjs
//
// El orden de los resultados NO es por lo grande que sea el hallazgo sino por lo
// CLARO que se vea: cuenta el margen con que se cumple la regla más ajustada, y
// penaliza el ruido entre latidos. Un infarto espectacular sobre un trazado
// sucio enseña peor que uno moderado sobre uno limpio.
//
// Lo que la herramienta NO hace es decidir. Imprime candidatos con sus números;
// hay que mirarlos dibujados antes de elegir:
//
//   npm run preview:ecg12 -- 12899 20139
//
// Se aprendió por las malas: en la primera tanda un registro pasaba todos los
// filtros numéricos y al dibujarlo tenía las derivaciones de los miembros
// planas. Los números descartan; la vista decide.

import { measure } from '../src/ecg12/measure.js';
import { decodeRecord } from '../src/ecg12/record.js';
import { checkFindings, margin } from '../src/ecg12/findings.js';
import { fetchRecord, prepareRecord } from './ptbxl.mjs';
import { loadIndex, loadScpDictionary } from './ptbxl-index.mjs';
import { CASES } from '../src/ecg12/cases.js';

const LEADS = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'];
const uv = (x) => Math.round(x * 1000);

function args(argv) {
  const o = { limit: 250, top: 8 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--scp') o.scp = argv[++i].split(',');
    else if (a === '--not-scp') o.notScp = argv[++i].split(',');
    else if (a === '--report') o.report = argv[++i].toLowerCase();
    else if (a === '--findings') o.findings = argv[++i];
    else if (a === '--case') o.case = argv[++i];
    else if (a === '--limit') o.limit = parseInt(argv[++i], 10);
    else if (a === '--top') o.top = parseInt(argv[++i], 10);
    else if (a === '--stage') o.stage = argv[++i];
  }
  return o;
}

// Códigos que arruinan un caso pensado para otra cosa: un marcapasos o un
// bloqueo de rama cambian por completo la forma del QRS y del ST. Se excluyen
// salvo que sean justamente lo que se está buscando.
const CONFUNDEN = ['PACE', 'CLBBB', 'CRBBB', 'WPW', '3AVB', '2AVB'];

const o = args(process.argv.slice(2));

let findings;
if (o.case) {
  const c = CASES.find((x) => x.id === o.case);
  if (!c) { console.error(`No existe el caso "${o.case}". Hay: ${CASES.map((x) => x.id).join(', ')}`); process.exit(1); }
  findings = c.findings;
  console.log(`Hallazgos tomados del caso "${c.id}" (hoy usa el registro ${c.record}).`);
} else if (o.findings) {
  findings = (await import(new URL(o.findings, `file://${process.cwd()}/`).href)).default;
} else {
  console.error('Falta --findings <archivo.mjs> o --case <id>. Ver el encabezado de este archivo.');
  process.exit(1);
}

const dic = await loadScpDictionary();
const idx = await loadIndex();

const buscados = new Set(o.scp || []);
const universo = idx.filter((r) => {
  if (o.scp && !o.scp.some((c) => r.scp[c] !== undefined)) return false;
  if (o.notScp && o.notScp.some((c) => r.scp[c] !== undefined)) return false;
  if (o.stage && r.stage !== o.stage) return false;
  if (o.report && !r.report.toLowerCase().includes(o.report)) return false;
  if (CONFUNDEN.some((c) => r.scp[c] !== undefined && !buscados.has(c))) return false;
  return true;
});

const aMedir = universo.slice(0, o.limit);
console.log(`\n${universo.length} registros pasan el prefiltro; se miden ${aMedir.length}.`);
if (universo.length > aMedir.length) console.log('(subí --limit para abarcar más)');

const hallados = [];
let n = 0;
for (const r of aMedir) {
  n++;
  if (n % 25 === 0) process.stderr.write(`  medidos ${n}/${aMedir.length}\r`);
  let q;
  try {
    q = measure(decodeRecord(prepareRecord(await fetchRecord(r.id))));
  } catch (e) { continue; }

  // Descartes de legibilidad, antes de mirar los hallazgos. Un QRS fuera de
  // rango casi siempre significa que la detección falló, y entonces ninguna de
  // las otras mediciones de ese registro es confiable.
  if (!(q.qrsMs >= 50 && q.qrsMs <= 130)) continue;
  if (q.noise > 0.20) continue;

  const reglas = checkFindings(q, findings);
  if (!reglas.every((x) => x.ok)) continue;
  hallados.push({ r, q, margen: margin(q, findings) });
}
process.stderr.write('                              \r');

// Claridad antes que tamaño: el margen manda, el ruido resta.
hallados.sort((a, b) => (b.margen - b.q.noise * 2) - (a.margen - a.q.noise * 2));

console.log(`\n${hallados.length} cumplen todos los hallazgos. Los ${Math.min(o.top, hallados.length)} más claros:\n`);
for (const { r, q, margen } of hallados.slice(0, o.top)) {
  const span = Math.max(...LEADS.map((l) => q.span[l]));
  const codigos = Object.entries(r.scp).sort((a, b) => b[1] - a[1])
    .map(([c, p]) => `${c}${p ? '' : '?'}`).join(' ');
  console.log(`── ${r.id}  ${r.age ?? '≥90'}${r.sex}  ${r.stage || ''}`);
  console.log(`   margen ${(margen * 10).toFixed(2)} mm · ruido ${uv(q.noise)} µV · FC ${q.hr.toFixed(0)} · QRS ${q.qrsMs.toFixed(0)} ms · excursión ${span.toFixed(2)} mV${span > 3 ? '  ← necesita media ganancia' : ''}`);
  console.log(`   ST ${LEADS.map((l) => `${l}:${uv(q.st[l])}`).join(' ')}`);
  console.log(`   T  ${LEADS.map((l) => `${l}:${uv(q.t[l])}`).join(' ')}`);
  console.log(`   SCP ${codigos}`);
  const nombres = Object.keys(r.scp).map((c) => dic[c]).filter(Boolean).slice(0, 3).join('; ');
  if (nombres) console.log(`       ${nombres}`);
  console.log(`   informe: ${r.report.slice(0, 150)}`);
  console.log('');
}

if (hallados.length) {
  console.log(`Mirálos antes de elegir:  npm run preview:ecg12 -- ${hallados.slice(0, o.top).map((h) => h.r.id).join(' ')}`);
} else {
  console.log('Nada cumple. Aflojá algún umbral del findings, ampliá el prefiltro o subí --limit.');
}
