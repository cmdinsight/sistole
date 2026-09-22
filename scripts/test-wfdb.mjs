// Prueba de ida y vuelta: se escribe un registro WFDB con señales conocidas y se
// lee de vuelta. Si el lector interpreta mal la cabecera, el intercalado o la
// escala, la comparación lo delata.
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readRecord, parseHeader, writeRecordFiles } from './wfdb.mjs';
import { synth12 } from '../src/ecg12/synth.js';

let pass = 0, fail = 0;
const check = (n, c, e = '') => { c ? (pass++, console.log(`  ✓ ${n}`)) : (fail++, console.log(`  ✗ ${n}  ${e}`)); };

console.log('\n[1] Cabecera con el formato real de PTB-XL');
const hea = `00001_hr 12 500 5000 00:00:00 01/01/1970
00001_hr.dat 16 1000.0(0)/mV 16 0 -49 -1150 0 I
00001_hr.dat 16 1000.0(0)/mV 16 0 -6 12007 0 II
00001_hr.dat 16 1000.0(-12)/mV 16 0 43 5723 0 III
00001_hr.dat 16 1000.0(0)/mV 16 0 27 -3921 0 aVR
00001_hr.dat 16 1000.0(0)/mV 16 0 -46 8331 0 aVL
00001_hr.dat 16 1000.0(0)/mV 16 0 18 2215 0 aVF
00001_hr.dat 16 1000.0(0)/mV 16 0 -6 -4552 0 V1
00001_hr.dat 16 1000.0(0)/mV 16 0 -1 9902 0 V2
00001_hr.dat 16 1000.0(0)/mV 16 0 11 -388 0 V3
00001_hr.dat 16 1000.0(0)/mV 16 0 -11 6671 0 V4
00001_hr.dat 16 1000.0(0)/mV 16 0 -25 1123 0 V5
00001_hr.dat 16 1000.0(0)/mV 16 0 -13 5545 0 V6`;
const h = parseHeader(hea);
check('12 señales', h.nSig === 12);
check('500 Hz', h.fs === 500);
check('5000 muestras (10 s)', h.nSamples === 5000);
check('nombres de derivación leídos', h.signals.map(s => s.name).join(',') === 'I,II,III,aVR,aVL,aVF,V1,V2,V3,V4,V5,V6');
check('ganancia 1000/mV', h.signals[0].gain === 1000 && h.signals[0].units === 'mV');
check('baseline negativo entre paréntesis', h.signals[2].baseline === -12, `(${h.signals[2].baseline})`);
check('baseline por defecto 0', h.signals[0].baseline === 0);
check('comentarios y fecha no rompen el parseo', h.name === '00001_hr');

console.log('\n[2] Ida y vuelta con señales reales del generador');
const dir = mkdtempSync(join(tmpdir(), 'wfdb-'));
const sig = synth12({ rate: 68, fs: 500, duration: 10, infarct: 'anterior', stAmp: 0.3 });
const { hea: h2, dat } = writeRecordFiles('test', 500, sig.leads, sig.labels);
writeFileSync(join(dir, 'test.hea'), h2);
writeFileSync(join(dir, 'test.dat'), dat);

const back = readRecord(join(dir, 'test.hea'));
check('frecuencia preservada', back.fs === 500);
check('duración preservada', Math.abs(back.duration - 10) < 1e-9, `(${back.duration})`);
check('las 12 derivaciones vuelven', back.order.join(',') === sig.labels.join(','));

let maxErr = 0;
for (const l of sig.labels) {
  for (let i = 0; i < back.leads[l].length; i++) {
    maxErr = Math.max(maxErr, Math.abs(back.leads[l][i] - sig.leads[l][i]));
  }
}
// La única pérdida esperable es la cuantización a 1 µV (ganancia 1000/mV).
check('error máximo ≤ 1 µV (solo cuantización)', maxErr <= 0.001, `(${(maxErr * 1000).toFixed(3)} µV)`);

console.log('\n[3] Las identidades de las derivaciones sobreviven al viaje');
const near = (a, b) => Math.abs(a - b) < 0.0025;
let ein = true, gold = true;
for (let i = 0; i < back.leads.II.length; i += 11) {
  if (!near(back.leads.II[i], back.leads.I[i] + back.leads.III[i])) ein = false;
  if (!near(back.leads.aVR[i], -(back.leads.I[i] + back.leads.II[i]) / 2)) gold = false;
}
check('II = I + III tras leer del binario', ein);
check('aVR = -(I+II)/2 tras leer del binario', gold);

console.log('\n[4] Errores claros, no silenciosos');
writeFileSync(join(dir, 'bad.hea'), 'bad 2 500 100\nbad.dat 212 200(0)/mV 12 0 0 0 0 I\nbad.dat 212 200(0)/mV 12 0 0 0 0 II\n');
let msg = '';
try { readRecord(join(dir, 'bad.hea')); } catch (e) { msg = e.message; }
check('un formato no soportado avisa cuál es', msg.includes('212'), `("${msg}")`);

rmSync(dir, { recursive: true, force: true });
console.log(`\n${'─'.repeat(44)}\n${pass} pasaron, ${fail} fallaron\n`);
process.exit(fail ? 1 : 0);
