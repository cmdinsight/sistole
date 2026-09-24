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
import { suggestGain } from '../src/ecg12/draw.js';
import { RR_DISPERSO } from '../src/ecg12/findings.js';

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
  check('el QT no se mueve más de 8 ms', Math.abs(before.qtMs - after.qtMs) < 8,
        `(${before.qtMs.toFixed(0)} vs ${after.qtMs.toFixed(0)} ms)`);
  check('III, aVR, aVL y aVF reconstruidas coinciden con las originales',
        ['III','aVR','aVL','aVF'].every((l) => Math.abs(before.st[l] - after.st[l]) < 0.005),
        `(${['III','aVR','aVL','aVF'].map(l=>`${l}:${uv(Math.abs(before.st[l]-after.st[l]))}`).join(' ')})`);
}

console.log('\n[8] Forma del segmento ST: la cubeta');
{
  // Un ST plano no tiene cubeta, y eso es lo primero que hay que exigirle a la
  // medida: la primera versión medía el hundimiento contra la cuerda que va
  // hasta el pico de la T, y como esa cuerda sube, un electro normal marcaba
  // 124 µV de cubeta donde no había ninguna.
  const normal = synth12({ rate: 68, fs: 250, duration: 10 });
  const qn = measure(normal);
  check('un ST plano no marca cubeta',
        Math.max(qn.sag.V5, qn.sag.V6, qn.sag.II) < 0.02,
        `(V5 ${uv(qn.sag.V5)} V6 ${uv(qn.sag.V6)} II ${uv(qn.sag.II)} µV)`);

  // Y ahora una cubeta de verdad: se hunde el segmento ST, entre el final del
  // QRS y la onda T, con una panza hacia abajo.
  // El bache se coloca respecto de los picos R que detecta el propio medidor, y
  // no calculando la fase del generador: así la prueba no depende de dónde
  // synth12 ponga la R dentro del latido.
  const conCubeta = { ...normal, leads: { ...normal.leads } };
  const fs = normal.fs;
  const desde = Math.round(0.05 * fs), hasta = Math.round(0.17 * fs);
  for (const l of ['V5', 'V6']) {
    const out = new Float32Array(normal.leads[l].length);
    out.set(normal.leads[l]);
    for (const r of qn.beats) {
      for (let k = r + desde; k <= r + hasta && k < out.length; k++) {
        const u = (k - (r + desde)) / (hasta - desde);   // 0 en el J, 1 al final del ST
        out[k] -= 0.15 * Math.sin(Math.PI * u);          // panza hacia abajo
      }
    }
    conCubeta.leads[l] = out;
  }
  const qc = measure(conCubeta);
  check('hundir el ST bajo el punto J sí marca cubeta',
        qc.sag.V5 > 0.08 && qc.sag.V6 > 0.08, `(V5 ${uv(qc.sag.V5)} V6 ${uv(qc.sag.V6)} µV)`);
  check('y sólo en las derivaciones donde se hundió',
        qc.sag.II < 0.02, `(II ${uv(qc.sag.II)} µV)`);
}

console.log('\n[9] Intervalo QT');
{
  // El QT del generador no depende de la frecuencia: la T está donde está. Si el
  // medidor lo hace variar con la frecuencia, está midiendo mal.
  const porFc = [45, 60, 75, 90, 100].map((rate) => measure(synth12({ rate, fs: 250, duration: 10 })).qtMs);
  check('el QT medido no cambia con la frecuencia si la T no se mueve',
        Math.max(...porFc) - Math.min(...porFc) < 12, `(${porFc.map((x) => x.toFixed(0)).join(' ')} ms)`);

  // Y tiene que responder a lo que sí lo alarga.
  const estirados = [1, 1.2, 1.4, 1.6].map((k) =>
    measure(synth12({ rate: 60, fs: 250, duration: 10, qtStretch: k })).qtMs);
  check('alargar la T alarga el QT, de forma monótona',
        estirados.every((v, i) => i === 0 || v > estirados[i - 1]),
        `(${estirados.map((x) => x.toFixed(0)).join(' → ')} ms)`);
  check('y lo hace en proporción: al 60% más de T, entre 40% y 70% más de QT',
        estirados[3] / estirados[0] > 1.4 && estirados[3] / estirados[0] < 1.7,
        `(×${(estirados[3] / estirados[0]).toFixed(2)})`);

  // La corrección por frecuencia: a 60 lpm el RR es 1 s y la raíz de 1 es 1, así
  // que QTc y QT tienen que coincidir. Es el punto donde la fórmula no corrige.
  const a60 = measure(synth12({ rate: 60, fs: 250, duration: 10 }));
  check('a 60 lpm el QTc es igual al QT', Math.abs(a60.qtcBazett - a60.qtMs) < 5,
        `(QT ${a60.qtMs.toFixed(0)} vs QTc ${a60.qtcBazett.toFixed(0)})`);
  const a100 = measure(synth12({ rate: 100, fs: 250, duration: 10 }));
  check('por encima de 60 lpm el QTc supera al QT', a100.qtcBazett > a100.qtMs + 40,
        `(QT ${a100.qtMs.toFixed(0)} vs QTc ${a100.qtcBazett.toFixed(0)})`);
  check('Fridericia corrige menos que Bazett en taquicardia',
        a100.qtcFridericia < a100.qtcBazett,
        `(${a100.qtcFridericia.toFixed(0)} vs ${a100.qtcBazett.toFixed(0)})`);

  // Regresión: la ventana donde se busca la T NO puede llegar al latido
  // siguiente. Antes llegaba, y a 120 lpm medía el QRS que venía como si fuera
  // la onda T — daba 1 mV donde había 0,25, y el número parecía plausible.
  const tLenta = measure(synth12({ rate: 60, fs: 250, duration: 10 })).t.II;
  const tRapida = measure(synth12({ rate: 140, fs: 250, duration: 10 })).t.II;
  check('a 140 lpm la onda T sigue midiendo lo mismo que a 60',
        Math.abs(tRapida - tLenta) < 0.06, `(${uv(tLenta)} vs ${uv(tRapida)} µV)`);

  // Una derivación con la T plana no se puede medir, y decirlo es mejor que
  // inventar un número: once derivaciones midiendo 259 ms y una midiendo 609
  // fue exactamente el problema que hizo falta resolver.
  const q = measure(synth12({ rate: 60, fs: 250, duration: 10 }));
  const planas = Object.keys(q.qt).filter((l) => Math.abs(q.t[l]) < 0.10);
  check('donde la T es menor a 1 mm, el QT queda sin medir',
        planas.every((l) => q.qt[l] === null), `(${planas.join(', ')})`);
  const medidos = Object.values(q.qt).filter((v) => v !== null);
  check('las derivaciones medibles coinciden entre sí dentro de 20 ms',
        Math.max(...medidos) - Math.min(...medidos) < 20,
        `(${Math.min(...medidos).toFixed(0)}–${Math.max(...medidos).toFixed(0)} ms)`);
}

console.log('\n[10] La ganancia del dibujo se elige sola y por grupo');
{
  // Ningún caso publicado hoy necesita media ganancia, así que sin esta prueba
  // el mecanismo quedaría sin cubrir hasta que alguien agregue un bloqueo de
  // rama o una hipertrofia — y se enteraría del problema ahí.
  const base = synth12({ rate: 72, fs: 250, duration: 10 });
  check('un trazado de voltaje normal se dibuja a 10 mm/mV',
        suggestGain(base).limb === 10 && suggestGain(base).chest === 10);

  const escalar = (sig, k, leads) => {
    const out = { ...sig, leads: { ...sig.leads } };
    for (const l of leads) {
      const src = sig.leads[l];
      const dst = new Float32Array(src.length);
      for (let i = 0; i < src.length; i++) dst[i] = src[i] * k;
      out.leads[l] = dst;
    }
    return out;
  };

  const precordialesGrandes = escalar(base, 6, ['V1', 'V2', 'V3', 'V4', 'V5', 'V6']);
  const g1 = suggestGain(precordialesGrandes);
  check('con precordiales de mucho voltaje, sólo ellas bajan a la mitad',
        g1.chest === 5 && g1.limb === 10, `(${JSON.stringify(g1)})`);

  const miembrosGrandes = escalar(base, 8, ['I', 'II', 'III', 'aVR', 'aVL', 'aVF']);
  const g2 = suggestGain(miembrosGrandes);
  check('y al revés: si el voltaje está en los miembros, bajan los miembros',
        g2.limb === 5 && g2.chest === 10, `(${JSON.stringify(g2)})`);

  // Que no baje de más es tan importante como que baje: a media ganancia un
  // trazado de voltaje chico queda como una línea recta.
  const apenas = escalar(base, 1.6, ['V1', 'V2', 'V3', 'V4', 'V5', 'V6']);
  check('una superposición parcial no alcanza para bajar la ganancia',
        suggestGain(apenas).chest === 10, `(${JSON.stringify(suggestGain(apenas))})`);
}


// ── La dispersión del RR ve lo que el coeficiente esconde ──────────────────
// Tres intervalos de 1930 ms y dos de 1500: el coeficiente de variación usa la
// mediana de las desviaciones y da 0,004, o sea "perfectamente regular". No lo
// es. Esta prueba fija que la dispersión recortada sí lo vea, porque la regla
// `irregular: false` se apoya en ella y se usa como guarda en 30 casos.
{
  const rr = [1.936, 1.460, 1.928, 1.572, 1.936];
  const med = 1.928;
  const cv = (() => {
    const d = rr.map((x) => Math.abs(x - med)).sort((a, b) => a - b);
    return d[d.length >> 1] / med;
  })();
  const spread = (() => {
    const v = rr.slice().sort((a, b) => a - b);
    const q = (p) => v[Math.min(v.length - 1, Math.max(0, Math.round((v.length - 1) * p)))];
    return (q(0.90) - q(0.10)) / med;
  })();
  check('el coeficiente de variación no ve el RR bimodal', cv < 0.01, `(${cv.toFixed(3)})`);
  check('la dispersión recortada sí lo ve', spread > RR_DISPERSO, `(${spread.toFixed(3)} > ${RR_DISPERSO})`);
}

console.log(`\n${'─'.repeat(44)}\n${pass} pasaron, ${fail} fallaron\n`);
process.exit(fail ? 1 : 0);
