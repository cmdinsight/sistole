// ═══════════════════════════════════════════════════════════════
// GENERADOR SINTÉTICO DE 12 DERIVACIONES — BANCO DE PRUEBAS
// ═══════════════════════════════════════════════════════════════
// OJO: esto ya NO produce los trazados de la sección. Los ocho casos usan
// electrocardiogramas reales de PTB-XL (ver records.js). Lo que este módulo hace
// ahora es generar señales de las que se conoce la respuesta de antemano, para
// validar contra ellas el medidor de measure.js: si le pedimos 0,35 mV de
// elevación inferior y el medidor no la encuentra en II, III y aVF, el medidor
// está mal, y eso hay que saberlo antes de usarlo para decidir qué enseña cada
// caso real. Lo usan scripts/test-measure.mjs y scripts/test-ecg12.mjs.
//
// Mismo principio que el generador de una derivación de la app (sumas de
// gaussianas), pero cada onda es un VECTOR en 3D, no un número. La tensión de
// cada derivación sale de proyectar ese vector sobre su eje.
//
// Modelar el vector, y no cada derivación por separado, es lo que hace que sirva
// como referencia: un infarto es una corriente de lesión que apunta hacia la
// zona dañada, y al proyectarla las elevaciones del ST caen en las derivaciones
// correctas por geometría — II, III y aVF en un infarto inferior; V1 a V4 en uno
// anterior — en vez de quedar puestas a mano, que es justo lo que no serviría
// para comprobar nada.

import { LEAD_ORDER, project } from './leads.js';

const g = (t, c, w, a) => { const d = (t - c) / w; return a * Math.exp(-d * d); };
const scale = (v, k) => [v[0] * k, v[1] * k, v[2] * k];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

// ── Direcciones de cada onda en un corazón normal ──
// Valores en el sistema X=izquierda, Y=pies, Z=adelante.
const DIR = {
  // Despolarización auricular: abajo y a la izquierda → P positiva en II, negativa en aVR.
  p: [0.50, 0.60, 0.20],
  // Septo: se despolariza de izquierda a derecha → q pequeña en laterales, r pequeña en V1.
  septal: [-0.60, 0.10, 0.30],
  // Pared libre del ventrículo izquierdo, fase temprana: el frente todavía va
  // hacia adelante. Es la componente que genera la onda R de las precordiales
  // medias; sin ella V3 y V4 quedan sin R y la progresión no existe.
  midAnterior: [0.75, 0.35, 0.55],
  // Masa ventricular izquierda, fase tardía: abajo, izquierda y atrás → R
  // dominante en laterales, S profunda en V1.
  qrs: [0.60, 0.55, -0.55],
  // Bases ventriculares, último en despolarizarse → s terminal.
  terminal: [-0.30, -0.50, -0.40],
  // Repolarización: concordante con el QRS pero menos posterior → T positiva casi en todas.
  t: [0.55, 0.50, -0.25],
};

// ── Territorios coronarios: hacia dónde apunta la corriente de lesión ──
// El ST se eleva en las derivaciones que MIRAN la zona lesionada y se deprime
// en las opuestas (los cambios recíprocos salen gratis, son el mismo vector).
export const INFARCT_VECTORS = {
  inferior:     [0.05, 0.95, -0.20],   // cara diafragmática → II, III, aVF
  anterior:     [0.10, -0.10, 0.95],   // pared anterior → V1-V4
  anteroseptal: [-0.25, 0.00, 0.95],   // septo y anterior → V1-V3
  lateral:      [0.95, -0.15, 0.10],   // pared lateral → I, aVL, V5, V6
  anterolateral:[0.70, -0.10, 0.70],   // extensa → I, aVL, V3-V6
  posterior:    [0.20, 0.10, -0.95],   // cara posterior → descenso en V1-V3
};

const TAU = Math.PI * 2;

// Vector cardíaco en el instante t dentro de un latido (t en segundos desde la P).
function beatVector(t, opts) {
  const { stVector = null, stAmp = 0, qWave = 0, tInvert = 0, wide = 0, atrial = 'sinus' } = opts;

  const qrsW = 0.013 * (1 + wide * 1.6);   // el QRS se ensancha en bloqueos y ritmos ventriculares
  const rC = 0.41;

  let v = [0, 0, 0];
  // Actividad auricular. En fibrilación NO hay onda P: la aurícula no se
  // despolariza de forma organizada. Dibujar un ritmo irregular conservando las
  // P daría un trazado imposible, así que la P se omite por completo y la
  // ondulación fibrilatoria se agrega aparte, en generate().
  if (atrial === 'sinus') {
    v = add(v, scale(DIR.p, g(t, 0.20, 0.028, 0.15)));
  }
  v = add(v, scale(DIR.septal, g(t, rC - 0.028, 0.009, 0.22)));
  v = add(v, scale(DIR.midAnterior, g(t, rC - 0.012, 0.010 * (1 + wide), 0.62)));
  v = add(v, scale(DIR.qrs, g(t, rC, qrsW, 1.45)));
  v = add(v, scale(DIR.terminal, g(t, rC + 0.030 + wide * 0.02, 0.012 * (1 + wide), 0.30)));

  // Onda Q de necrosis: pérdida de vector en la zona infartada, o sea un vector
  // que apunta en sentido contrario al de la lesión, temprano en el QRS.
  if (qWave > 0 && stVector) {
    v = add(v, scale(stVector, -g(t, rC - 0.020, 0.012, qWave)));
  }

  // Onda T, que puede invertirse (isquemia evolucionada).
  const tAmp = 0.35 * (1 - 2 * tInvert);
  v = add(v, scale(DIR.t, g(t, 0.58, 0.045, tAmp)));

  // Corriente de lesión: desplaza el segmento ST completo, desde el final del
  // QRS hasta el inicio de la T. Es un escalón, no una campana.
  if (stVector && stAmp !== 0) {
    const stStart = rC + 0.045, stEnd = 0.56;
    if (t >= stStart && t <= stEnd) {
      const ramp = Math.min(1, (t - stStart) / 0.02);
      v = add(v, scale(stVector, stAmp * ramp));
    }
  }

  return v;
}

// Ruido fisiológico: deriva de la línea de base por respiración, más temblor
// muscular. Sin esto un trazado sintético se nota sintético al instante.
//
// Se suma al VECTOR, no a cada derivación por separado. No es un detalle: de las
// 12 derivaciones solo 8 se miden (I, II y V1-V6); III, aVR, aVL y aVF se
// calculan a partir de esas. Por eso en un electro real se cumple siempre
// II = I + III y aVR = -(I+II)/2, con ruido y todo. Si el ruido se inyectara
// derivación por derivación, esas identidades dejarían de cumplirse y el
// trazado sería imposible: un cardiólogo lo detecta mirando el eje.
const noiseVector = (t) => {
  const wander = 0.030 * Math.sin(TAU * 0.25 * t + 0.7);   // respiración
  const tremor = 0.008 * Math.sin(t * 2341.7) + 0.005 * Math.cos(t * 1973.3 + 1.2);
  const n = wander + tremor;
  // La deriva respiratoria es un movimiento del eje eléctrico al desplazarse el
  // corazón con el diafragma: se orienta, no es un escalar suelto.
  return [n * 0.35, n * 0.90, n * 0.25];
};

// Ondulación fibrilatoria: varias frecuencias incommensurables entre 5 y 9 Hz,
// que es el rango real de las ondas f. Van en la dirección auricular, así que
// se ven sobre todo en V1 y II — igual que en un trazado de verdad.
const fibVector = (t) => {
  const f =
    0.034 * Math.sin(TAU * 6.3 * t) +
    0.025 * Math.sin(TAU * 8.1 * t + 1.9) +
    0.018 * Math.sin(TAU * 5.2 * t + 0.6);
  return [DIR.p[0] * f * 0.5, DIR.p[1] * f * 0.6, DIR.p[2] * f * 1.9];
};

/**
 * Genera 10 segundos de 12 derivaciones.
 *
 * @param {object} o
 * @param {number} o.rate       frecuencia cardíaca en lpm
 * @param {number} o.fs         frecuencia de muestreo (Hz)
 * @param {number} o.duration   duración en segundos
 * @param {string} o.infarct    territorio de INFARCT_VECTORS, o null
 * @param {number} o.stAmp      magnitud de la elevación del ST (mV aprox.)
 * @param {number} o.qWave      profundidad de la onda Q de necrosis
 * @param {number} o.tInvert    0 = T normal, 1 = T completamente invertida
 * @param {number} o.wide       0 = QRS angosto, 1 = ensanchado
 * @param {number} o.irregular  variabilidad del RR (0 = regular, 1 = fibrilación auricular)
 * @param {string} o.atrial     'sinus' (con onda P) o 'fib' (sin P, con ondas f)
 * @returns {{fs:number, leads:Object<string, Float32Array>, labels:string[]}}
 */
export function synth12({
  rate = 72, fs = 250, duration = 10,
  infarct = null, stAmp = 0, qWave = 0, tInvert = 0, wide = 0, irregular = 0,
  atrial = 'sinus',
} = {}) {
  const n = Math.round(fs * duration);
  const stVector = infarct ? INFARCT_VECTORS[infarct] : null;
  const opts = { stVector, stAmp, qWave, tInvert, wide, atrial };

  // Tiempos de inicio de cada latido. Con irregular > 0 el RR varía como en una
  // fibrilación auricular, con un generador determinista para que el mismo caso
  // se vea siempre igual.
  let seed = 137;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  const rr = 60 / rate;
  const beats = [];
  for (let t = 0; t < duration + rr; ) {
    beats.push(t);
    t += irregular > 0 ? rr * (1 - irregular * 0.45 + rnd() * irregular * 0.9) : rr;
  }

  const leads = {};
  LEAD_ORDER.forEach((l) => { leads[l] = new Float32Array(n); });

  for (let i = 0; i < n; i++) {
    const t = i / fs;
    // Latido vigente: el que empezó más recientemente antes de t.
    let bi = 0;
    while (bi + 1 < beats.length && beats[bi + 1] <= t) bi++;
    const tb = t - beats[bi] + 0.20;   // +0.20 alinea la P con el inicio del latido

    let v = add(beatVector(tb, opts), noiseVector(t));
    if (atrial === 'fib') v = add(v, fibVector(t));
    for (let li = 0; li < LEAD_ORDER.length; li++) {
      leads[LEAD_ORDER[li]][i] = project(v, LEAD_ORDER[li]);
    }
  }

  return { fs, duration, leads, labels: LEAD_ORDER.slice() };
}
