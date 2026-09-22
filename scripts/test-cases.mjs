// ═══════════════════════════════════════════════════════════════
// PRUEBAS DE LOS CASOS CONTRA SUS TRAZADOS
// ═══════════════════════════════════════════════════════════════
// Esta es la prueba que importa. Los trazados son electrocardiogramas reales de
// pacientes: nadie los hizo a medida del texto que los acompaña. Entonces hay
// que demostrar, midiendo, que cada caso enseña lo que su electro muestra.
//
// Cada caso declara sus hallazgos en el campo `findings`, y acá se comprueban
// uno por uno sobre el registro descargado. Si mañana se cambia un registro por
// otro, o se retoca un texto, o PTB-XL publica una corrección, esto falla antes
// de que un estudiante lea algo que el trazado no dice.
//
// También se verifica lo que el caso NIEGA, que en un electro es la mitad del
// diagnóstico: un infarto inferior se llama inferior porque las precordiales
// están limpias, no sólo porque II, III y aVF están elevadas.

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodeRecord } from '../src/ecg12/record.js';
import { measure } from '../src/ecg12/measure.js';
import { checkFindings } from '../src/ecg12/findings.js';
import { CASES, shuffledOptions } from '../src/ecg12/cases.js';
import { RECORD_IDS, RECORDS, SOURCE } from '../src/ecg12/records.js';
import { LEAD_LABELS } from '../src/ecg12/record.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const LANGS = ['es', 'en', 'pt'];

let pass = 0, fail = 0;
const check = (n, c, e = '') => { c ? (pass++, console.log(`  ✓ ${n}`)) : (fail++, console.log(`  ✗ ${n}  ${e}`)); };
const uv = (x) => Math.round(x * 1000);

console.log('\n[1] Cada caso apunta a un registro descargado');
check('la lista de registros coincide con la de casos',
      RECORD_IDS.join(',') === CASES.map((c) => c.record).join(','),
      `(${RECORD_IDS.join(',')} vs ${CASES.map((c) => c.record).join(',')})`);
check('no hay dos casos con el mismo registro',
      new Set(CASES.map((c) => c.record)).size === CASES.length);
check('hay cita y licencia de la fuente',
      Boolean(SOURCE.citation && SOURCE.license && SOURCE.url));

const signals = {};
for (const c of CASES) {
  const f = join(root, 'public', 'ecg12', `${c.record}.json`);
  if (!existsSync(f)) {
    fail++;
    console.log(`  ✗ falta public/ecg12/${c.record}.json — corré: npm run fetch:ptbxl`);
    continue;
  }
  const json = JSON.parse(readFileSync(f, 'utf8'));
  signals[c.record] = { ...decodeRecord(json), source: json.source };
  pass++;
}
console.log(`  ✓ ${Object.keys(signals).length} trazados presentes en public/ecg12/`);

console.log('\n[2] Los trazados son legibles: 12 derivaciones, 10 s, sin ruido que impida medir');
for (const c of CASES) {
  const s = signals[c.record];
  if (!s) continue;
  const q = measure(s);
  const tag = `${c.id} (PTB-XL ${c.record})`;
  check(`${tag}: están las 12 derivaciones`,
        LEAD_LABELS.every((l) => s.leads[l] && s.leads[l].length === s.fs * 10));
  check(`${tag}: ruido entre latidos por debajo de 0,2 mV`, q.noise < 0.20, `(${uv(q.noise)} µV)`);
  check(`${tag}: el QRS medido es plausible`, q.qrsMs >= 50 && q.qrsMs <= 130, `(${q.qrsMs.toFixed(0)} ms)`);
  // En la grilla 3×4 una derivación con mucho voltaje invade la fila de al lado.
  // Pasa también en el papel de cualquier equipo y se lee igual, así que el
  // límite acá es generoso: sólo atrapa lo que sería ilegible.
  const span = Math.max(...LEAD_LABELS.map((l) => q.span[l]));
  check(`${tag}: la amplitud entra en la hoja`, span < 3.2, `(${span.toFixed(2)} mV)`);
}

console.log('\n[3] Cada caso enseña lo que su electro muestra');
// Las reglas viven en src/ecg12/findings.js, que es también lo que usa
// scripts/ptbxl-search.mjs para elegir los registros. Un solo predicado: el que
// encontró el caso es el que lo vigila.
for (const c of CASES) {
  const s = signals[c.record];
  if (!s) continue;
  for (const r of checkFindings(measure(s), c.findings)) {
    check(`${c.id}: ${r.label}`, r.ok, r.detalle && `(${r.detalle})`);
  }
}

console.log('\n[4] Los textos están completos en los tres idiomas');
for (const c of CASES) {
  const campos = ['stem', 'explain', 'pitfall', 'action'];
  const faltan = [];
  for (const campo of campos) {
    for (const l of LANGS) if (!c[campo]?.[l]?.trim()) faltan.push(`${campo}.${l}`);
  }
  for (const o of c.options) {
    for (const l of LANGS) if (!o.label?.[l]?.trim()) faltan.push(`opción ${o.id}.${l}`);
  }
  check(`${c.id}: sin textos faltantes`, !faltan.length, `(${faltan.join(', ')})`);
  check(`${c.id}: la respuesta correcta está entre las opciones`,
        c.options.some((o) => o.id === c.answer), `(respuesta ${c.answer})`);
  check(`${c.id}: las derivaciones resaltadas existen`,
        c.highlight.every((l) => LEAD_LABELS.includes(l)), `(${c.highlight.join(', ')})`);
}

console.log('\n[5] Las opciones no se pueden adivinar por su posición');
{
  const posiciones = CASES.map((c) => shuffledOptions(c).findIndex((o) => o.id === c.answer));
  check('la correcta nunca queda primera en todos los casos', new Set(posiciones).size > 1,
        `(posiciones ${posiciones.join(', ')})`);
  check('ninguna posición concentra más de la mitad de las respuestas',
        Math.max(...[0, 1, 2, 3].map((i) => posiciones.filter((p) => p === i).length)) <= CASES.length / 2,
        `(posiciones ${posiciones.join(', ')})`);
  for (const c of CASES) {
    const mezcladas = shuffledOptions(c);
    check(`${c.id}: la mezcla conserva todas las opciones`,
          mezcladas.length === c.options.length
          && c.options.every((o) => mezcladas.some((m) => m.id === o.id)));
    check(`${c.id}: la mezcla es estable entre llamadas`,
          shuffledOptions(c).map((o) => o.id).join() === mezcladas.map((o) => o.id).join());
  }
}

console.log('\n[6] Los datos del paciente son los del registro, no inventados');
for (const c of CASES) {
  const real = RECORDS[c.record];
  check(`${c.id}: edad y sexo coinciden con PTB-XL`,
        Boolean(real) && c.age === real.age && c.sex === real.sex,
        real ? `(caso ${c.age}/${c.sex} vs registro ${real.age}/${real.sex})` : '(sin metadatos)');
  check(`${c.id}: el registro declara su informe original`, Boolean(RECORDS[c.record]?.report?.trim()));
}

console.log(`\n${'─'.repeat(44)}\n${pass} pasaron, ${fail} fallaron\n`);
process.exit(fail ? 1 : 0);
