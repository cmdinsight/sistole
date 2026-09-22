// ═══════════════════════════════════════════════════════════════
// PRUEBAS DEL MEDIDOR
// ═══════════════════════════════════════════════════════════════
// Con trazados reales, el medidor es lo que decide si un caso puede enseñar lo
// que dice que enseña. Un medidor mal calibrado dejaría pasar un texto falso,
// así que hay que validarlo contra señales de las que se conoce la respuesta.
//
// El generador sintético sirve exactamente para eso: sabemos dónde puso la
// elevación del ST y a qué frecuencia. Dejó de usarse para hacer los trazados de
// la sección —ahora son reales— y quedó como banco de pruebas, que es el papel
// que mejor le queda: sirve para comprobar, no para enseñar.

import { synth12 } from '../src/ecg12/synth.js';
import { measure } from '../src/ecg12/measure.js';
import { encodeRecord, decodeRecord } from '../src/ecg12/record.js';

let pass = 0, fail = 0;
const check = (n, c, e = '') => { c ? (pass++, console.log(`  ✓ ${n}`)) : (fail++, console.log(`  ✗ ${n}  ${e}`)); };
const uv = (x) => Math.round(x * 1000);

console.log('\n[1] Frecuencia cardíaca y regularidad');
for (const rate of [48, 72, 96, 120]) {
  const q = measure(synth12({ rate, fs: 250, duration: 10 }));
  check(`${rate} lpm se mide como ${rate}`, Math.abs(q.hr - rate) < 2, `(midió ${q.hr.toFixed(1)})`);
}
{
  const reg = measure(synth12({ rate: 80, fs: 250, duration: 10 }));
  const irr = measure(synth12({ rate: 130, fs: 250, duration: 10, irregular: 1, atrial: 'fib' }));
  check('ritmo regular → variabilidad del RR baja', reg.rrCv < 0.05, `(${reg.rrCv.toFixed(3)})`);
  check('fibrilación → variabilidad del RR alta', irr.rrCv > 0.12, `(${irr.rrCv.toFixed(3)})`);
  check('la irregular se distingue de la regular por un factor > 3',
        irr.rrCv > reg.rrCv * 3, `(${irr.rrCv.toFixed(3)} vs ${reg.rrCv.toFixed(3)})`);
}

console.log('\n[2] El ST se mide donde está y NO donde no está');
{
  const q = measure(synth12({ rate: 70, fs: 250, duration: 10, infarct: 'inferior', stAmp: 0.35 }));
  check('elevación en II, III y aVF', ['II', 'III', 'aVF'].every((l) => q.st[l] > 0.12),
        `(${['II','III','aVF'].map(l=>`${l}:${uv(q.st[l])}`).join(' ')})`);
  check('descenso recíproco en aVL', q.st.aVL < -0.08, `(${uv(q.st.aVL)} µV)`);
  check('las precordiales anteriores quedan sin elevación',
        ['V2','V3','V4'].every((l) => q.st[l] < 0.10), `(${['V2','V3','V4'].map(l=>`${l}:${uv(q.st[l])}`).join(' ')})`);
}
{
  const q = measure(synth12({ rate: 70, fs: 250, duration: 10, infarct: 'anteroseptal', stAmp: 0.35 }));
  check('elevación en V1 a V3', ['V1','V2','V3'].every((l) => q.st[l] > 0.12),
        `(${['V1','V2','V3'].map(l=>`${l}:${uv(q.st[l])}`).join(' ')})`);
  check('las inferiores quedan limpias', ['II','III','aVF'].every((l) => Math.abs(q.st[l]) < 0.10),
        `(${['II','III','aVF'].map(l=>`${l}:${uv(q.st[l])}`).join(' ')})`);
}
{
  const q = measure(synth12({ rate: 70, fs: 250, duration: 10 }));
  const worst = Math.max(...Object.values(q.st).map(Math.abs));
  check('sin infarto, ninguna derivación pasa de 60 µV', worst < 0.06, `(${uv(worst)} µV)`);
}

console.log('\n[3] La elevación medida crece con la que se puso');
{
  const vals = [0.1, 0.2, 0.4].map((a) =>
    measure(synth12({ rate: 70, fs: 250, duration: 10, infarct: 'inferior', stAmp: a })).st.III);
  check('monótona en III', vals[0] < vals[1] && vals[1] < vals[2],
        `(${vals.map(uv).join(' → ')} µV)`);
  check('proporcional: al cuádruple de lesión, entre 3 y 5 veces el desnivel',
        vals[2] / vals[0] > 3 && vals[2] / vals[0] < 5, `(×${(vals[2]/vals[0]).toFixed(2)})`);
}

console.log('\n[4] La onda T se mide con signo');
{
  const normal = measure(synth12({ rate: 70, fs: 250, duration: 10 }));
  const inverted = measure(synth12({ rate: 70, fs: 250, duration: 10, tInvert: 1 }));
  check('T positiva en II cuando es normal', normal.t.II > 0.1, `(${uv(normal.t.II)} µV)`);
  check('T negativa en II cuando está invertida', inverted.t.II < -0.05, `(${uv(inverted.t.II)} µV)`);
  check('T negativa en aVR aun con T normales', normal.t.aVR < 0, `(${uv(normal.t.aVR)} µV)`);
}

console.log('\n[5] Progresión de la onda R en las precordiales');
{
  const q = measure(synth12({ rate: 70, fs: 250, duration: 10 }));
  check('rS en V1: la S es más profunda que la R', q.r.V1 < -q.s.V1,
        `(R ${uv(q.r.V1)} vs S ${uv(-q.s.V1)})`);
  check('R dominante en V6', q.r.V6 > -q.s.V6, `(R ${uv(q.r.V6)} vs S ${uv(-q.s.V6)})`);
  check('la R crece de V1 a V5', q.r.V1 < q.r.V3 && q.r.V3 < q.r.V5,
        `(${['V1','V2','V3','V4','V5','V6'].map(l=>uv(q.r[l])).join('/')})`);
}

console.log('\n[6] El ruido se mide comparando latidos entre sí');
{
  const clean = synth12({ rate: 72, fs: 250, duration: 10 });
  const dirty = { ...clean, leads: { ...clean.leads } };
  // Ruido que cambia latido a latido: es lo que el medidor tiene que ver. Se usa
  // un generador pseudoaleatorio y no una suma de senos porque con un RR
  // perfectamente regular un seno puede caer siempre en la misma fase del
  // latido, y entonces no sería ruido: sería una deformación repetida del
  // complejo, que es justo lo que el medidor NO debe contar como suciedad.
  let seed = 7;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff - 0.5; };
  for (const l of Object.keys(dirty.leads)) {
    const src = clean.leads[l];
    const out = new Float32Array(src.length);
    for (let i = 0; i < src.length; i++) out[i] = src[i] + 0.40 * rnd();   // ±0,2 mV: un electrodo con mal contacto
    dirty.leads[l] = out;
  }
  const a = measure(clean), b = measure(dirty);
  check('un trazado limpio mide poco ruido', a.noise < 0.02, `(${uv(a.noise)} µV)`);
  check('agregarle temblor lo multiplica', b.noise > a.noise * 3, `(${uv(a.noise)} → ${uv(b.noise)} µV)`);
}

console.log('\n[7] Guardar y volver a leer no cambia la medición');
{
  const sig = synth12({ rate: 70, fs: 250, duration: 10, infarct: 'inferior', stAmp: 0.35, qWave: 0.25 });
  const before = measure(sig);
  const after = measure(decodeRecord(encodeRecord(sig.leads, sig.fs)));
  const diffs = Object.keys(before.st).map((l) => Math.abs(before.st[l] - after.st[l]));
  check('el ST no se mueve más de 5 µV en ninguna derivación',
        Math.max(...diffs) < 0.005, `(${uv(Math.max(...diffs))} µV)`);
  check('la frecuencia es la misma', Math.abs(before.hr - after.hr) < 0.5);
  check('III, aVR, aVL y aVF reconstruidas coinciden con las originales',
        ['III','aVR','aVL','aVF'].every((l) => Math.abs(before.st[l] - after.st[l]) < 0.005),
        `(${['III','aVR','aVL','aVF'].map(l=>`${l}:${uv(Math.abs(before.st[l]-after.st[l]))}`).join(' ')})`);
}

console.log(`\n${'─'.repeat(44)}\n${pass} pasaron, ${fail} fallaron\n`);
process.exit(fail ? 1 : 0);
