// ═══════════════════════════════════════════════════════════════
// MEDICIÓN AUTOMÁTICA SOBRE EL TRAZADO
// ═══════════════════════════════════════════════════════════════
// Con trazados reales ya no alcanza con declarar los hallazgos: hay que
// medirlos. Este módulo detecta los QRS y mide, derivación por derivación, el
// desnivel del segmento ST respecto de la línea de base — que es exactamente lo
// que hace un médico contando cuadraditos, sólo que sin discutir.
//
// Sirve para dos cosas:
//   1. Las pruebas verifican que cada caso enseña lo que su electro muestra de
//      verdad. Si un registro de PTB-XL deja de tener elevación en II, III y
//      aVF, la prueba falla y el caso no se publica con un texto falso.
//   2. La app puede mostrar la medición al responder, que es la forma honesta
//      de decir "esto está elevado": con un número, no con una flecha.
//
// Convenciones (las de la práctica clínica):
//   · Línea de base → segmento PR, justo antes de que arranque el QRS.
//   · Punto J       → final del QRS.
//   · Desnivel ST   → se mide en J+60 ms.
// Se usa la MEDIANA entre latidos, no el promedio: una extrasístole o un
// artefacto aislado desplaza el promedio y no mueve la mediana.

const median = (xs) => {
  if (!xs.length) return 0;
  const s = Array.from(xs).sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

// ── Detección de QRS ──
// Pan-Tompkins reducido a lo esencial: derivada (el QRS es lo más empinado del
// trazado), cuadrado (todo positivo y se acentúan los picos) e integración en
// ventana móvil (junta el complejo en una sola joroba). Sobre eso, umbral
// adaptativo y un período refractario de 200 ms, que es el mínimo fisiológico
// entre dos despolarizaciones ventriculares.
export function slopeEnergy(sig, fs, windowSec = 0.10) {
  const n = sig.length;
  const d = new Float32Array(n);
  for (let i = 2; i < n - 2; i++) d[i] = (2 * sig[i + 2] + sig[i + 1] - sig[i - 1] - 2 * sig[i - 2]) / 8;

  const w = Math.max(1, Math.round(windowSec * fs));
  const out = new Float32Array(n);
  let acc = 0;
  for (let i = 0; i < n; i++) {
    acc += d[i] * d[i];
    if (i >= w) acc -= d[i - w] * d[i - w];
    out[i] = acc / w;
  }
  return out;
}

export function detectQRS(sig, fs) {
  const n = sig.length;
  const integ = slopeEnergy(sig, fs);

  // Umbral a partir de la mediana de la envolvente: robusto frente a un pico
  // aislado, que es lo que rompe un umbral basado en el máximo.
  const sorted = Array.from(integ).sort((a, b) => a - b);
  const p50 = sorted[Math.floor(n * 0.5)];
  const p98 = sorted[Math.floor(n * 0.98)];
  const thr = p50 + 0.35 * (p98 - p50);

  const refractory = Math.round(0.20 * fs);
  const peaks = [];
  let i = 0;
  while (i < n) {
    if (integ[i] <= thr) { i++; continue; }
    let j = i;
    while (j < n && integ[j] > thr) j++;
    // Dentro de la joroba, el pico real es el máximo absoluto de la señal cruda:
    // la integración corre el máximo unos milisegundos hacia adelante.
    const from = Math.max(0, i - Math.round(0.06 * fs));
    const to = Math.min(n, j + Math.round(0.02 * fs));
    let best = from, bestV = -Infinity;
    for (let k = from; k < to; k++) {
      const v = Math.abs(sig[k]);
      if (v > bestV) { bestV = v; best = k; }
    }
    if (!peaks.length || best - peaks[peaks.length - 1] >= refractory) peaks.push(best);
    i = j;
  }
  return peaks;
}

// Señal de detección: se suma la energía de varias derivaciones en vez de
// confiar en una sola. En un infarto una derivación puede quedar con un QRS
// minúsculo, y detectar sobre ella sola se pierde latidos.
function detectionSignal(leads, fs) {
  const use = ['II', 'V2', 'V5', 'I', 'V1'].filter((l) => leads[l]);
  const n = leads[use[0]].length;
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (const l of use) s += leads[l][i] * leads[l][i];
    out[i] = Math.sqrt(s);
  }
  return out;
}

// ── Límites del QRS ──
// No se miden latido a latido sino sobre un LATIDO PROMEDIO: se superponen
// todos los complejos alineados por el pico R y se promedian. El ruido es
// distinto en cada latido y se cancela; el complejo, que es igual en todos, se
// queda. Sobre esa plantilla limpia se busca dónde la energía del QRS cae al
// nivel del segmento PR, y ese punto es el J.
//
// La duración del QRS es una propiedad del registro, no de cada latido: medirla
// una vez sobre la plantilla es más estable, y además es lo correcto.
function qrsTemplate(det, beats, fs) {
  // Se promedia la ENERGÍA DE PENDIENTE, no la amplitud. La diferencia decide el
  // resultado en los trazados que más importan: con un supradesnivel grande, el
  // segmento ST queda lejos de la línea de base y una medición por amplitud lo
  // confunde con el final del QRS que todavía no terminó, corriendo el punto J
  // hasta dentro de la onda T. La pendiente, en cambio, vuelve a cero apenas
  // termina el complejo, esté el ST donde esté: el ST es plano, aunque esté alto.
  const env = slopeEnergy(det, fs, 0.03);
  const before = Math.round(0.12 * fs);
  const after = Math.round(0.20 * fs);
  const tpl = new Float64Array(before + after + 1);
  let used = 0;
  for (const r of beats) {
    if (r - before < 0 || r + after >= env.length) continue;
    for (let k = 0; k <= before + after; k++) tpl[k] += env[r - before + k];
    used++;
  }
  if (!used) return { onset: -Math.round(0.05 * fs), offset: Math.round(0.05 * fs) };
  for (let k = 0; k < tpl.length; k++) tpl[k] /= used;

  const rIdx = before;
  // Nivel de referencia: la energía en el segmento PR (120 a 80 ms antes de R),
  // donde el corazón está eléctricamente quieto.
  let ref = 0, refN = 0;
  for (let k = 0; k <= Math.round(0.04 * fs); k++) { ref += tpl[k]; refN++; }
  ref /= refN;
  let peak = 0;
  for (let k = 0; k < tpl.length; k++) peak = Math.max(peak, tpl[k]);
  const cut = ref + 0.06 * (peak - ref);

  let on = rIdx;
  while (on > 0 && tpl[on] > cut) on--;
  let off = rIdx;
  while (off < tpl.length - 1 && tpl[off] > cut) off++;

  // Topes fisiológicos: un QRS no dura menos de 50 ms ni, en este contexto, más
  // de 200 ms. Sin ellos un artefacto puede correr el punto J hasta la onda T y
  // el ST se mediría sobre la repolarización, que es justo lo que no se quiere.
  const minHalf = Math.round(0.025 * fs);
  on = Math.min(on, rIdx - minHalf);
  off = Math.max(off, rIdx + minHalf);
  off = Math.min(off, rIdx + Math.round(0.14 * fs));
  on = Math.max(on, rIdx - Math.round(0.09 * fs));

  return { onset: on - rIdx, offset: off - rIdx };   // en muestras, relativo al pico R
}

// ── Final de la onda T, por el método de la tangente ──
// El QT se mide desde el comienzo del QRS hasta que la T termina, y ahí está la
// dificultad: la T no termina en un punto nítido, se va acostando sobre la línea
// de base hasta confundirse con ella. Esperar a que "toque" la línea da valores
// largos y caprichosos, y una onda U detrás lo arruina del todo.
//
// El método de la tangente es lo que se usa a mano y lo que se hace acá: se toma
// la rama más empinada de la T —la de bajada si es positiva, la de subida si
// está invertida— se prolonga esa pendiente como una recta, y el final es donde
// esa recta cruza la línea de base. Al extrapolar desde la parte empinada, ni la
// cola de la T ni una U detrás mueven el resultado.
//
// Se hace sobre un LATIDO PROMEDIO. La pendiente es una derivada, y una derivada
// sobre señal cruda amplifica el ruido justo donde hay que medir con precisión.
function tEndTangent(beat, base, tFrom, tTo, fs) {
  // Pico de la T dentro de la ventana, con su signo.
  let pico = tFrom, valorPico = 0;
  for (let k = tFrom; k <= tTo; k++) {
    const v = beat[k] - base;
    if (Math.abs(v) > Math.abs(valorPico)) { valorPico = v; pico = k; }
  }
  // Una T de menos de 1 mm no permite trazar una tangente confiable: la
  // pendiente de retorno es tan suave que un microvoltio de ruido mueve el cruce
  // decenas de milisegundos. En la práctica tampoco se mide el QT en una
  // derivación con la T plana; se busca otra.
  if (Math.abs(valorPico) < 0.10) return null;

  // Rama de retorno: desde el pico hacia adelante, el punto de máxima pendiente.
  const paso = Math.max(1, Math.round(0.004 * fs));
  let mejor = -1, pendienteMax = 0;
  for (let k = pico + paso; k <= tTo - paso; k++) {
    // Pendiente con signo contrario al pico: la T vuelve hacia la línea de base.
    const m = (beat[k + paso] - beat[k - paso]) / (2 * paso);
    const vuelve = valorPico > 0 ? -m : m;
    if (vuelve > pendienteMax) { pendienteMax = vuelve; mejor = k; }
  }
  if (mejor < 0 || pendienteMax <= 0) return null;

  // Dónde cruza la tangente la línea de base.
  const m = (beat[mejor + paso] - beat[mejor - paso]) / (2 * paso);
  const cruce = mejor + (base - beat[mejor]) / m;
  if (!Number.isFinite(cruce) || cruce <= pico) return null;
  // Tope: la tangente no puede terminar más allá de la ventana de búsqueda más
  // un margen. Sin esto, una T casi plana da una pendiente mínima y el cruce se
  // proyecta a varios segundos.
  return Math.min(cruce, tTo + Math.round(0.08 * fs));
}

// ── Segunda onda R dentro del QRS ──
// Las "orejas de conejo" del bloqueo de rama derecha: en V1 el complejo es rsR',
// con una R chica, una S, y una segunda R más alta que la primera. Esa segunda
// onda es el ventrículo derecho despolarizándose solo y tarde, cuando el
// izquierdo ya terminó.
//
// Encontrarla es contar máximos locales dentro del QRS, sobre el latido
// promedio y separados al menos 25 ms para no confundir una muesca del ruido con
// una onda. Devuelve la altura de la SEGUNDA, que es el hallazgo; cero si hay
// una sola, que es lo normal.
function segundaR(beat, base, desde, hasta, fs) {
  const sep = Math.max(2, Math.round(0.025 * fs));
  const picos = [];
  for (let k = Math.max(desde, sep); k <= Math.min(hasta, beat.length - sep - 1); k++) {
    const v = beat[k] - base;
    if (v < 0.10) continue;                       // por debajo de 1 mm no es una onda
    let esPico = true;
    for (let j = k - sep; j <= k + sep; j++) if (beat[j] > beat[k]) { esPico = false; break; }
    if (!esPico) continue;
    if (picos.length && k - picos[picos.length - 1].k < sep) continue;
    picos.push({ k, v });
  }
  return picos.length >= 2 ? picos[picos.length - 1].v : 0;
}

/**
 * Mide un registro de 12 derivaciones.
 *
 * @param {{fs:number, leads:Object<string,Float32Array>}} signal
 * @returns {{hr:number, rr:number[], rrCv:number, beats:number[], st:Object<string,number>, qrsMs:number}}
 *   st está en mV: positivo = supradesnivel, negativo = infradesnivel.
 */
export function measure(signal) {
  const { fs, leads } = signal;
  const det = detectionSignal(leads, fs);
  const beats = detectQRS(det, fs);

  const rr = [];
  for (let i = 1; i < beats.length; i++) rr.push((beats[i] - beats[i - 1]) / fs);
  const rrMed = median(rr) || 1;
  // Variabilidad del RR como coeficiente de variación respecto de la mediana.
  // En ritmo sinusal queda por debajo de ~0,08; en fibrilación auricular trepa
  // muy por encima, y ese salto es el que separa los dos ritmos sin mirar la P.
  const rrCv = rr.length ? median(rr.map((x) => Math.abs(x - rrMed))) / rrMed : 0;

  // Se descartan el primero y el último latido: pueden quedar cortados por los
  // bordes de los 10 segundos y falsear la medición.
  const usable = beats.slice(1, -1);
  const { onset, offset } = qrsTemplate(det, usable, fs);
  const dJ60 = offset + Math.round(0.060 * fs);
  const dB0 = onset - Math.round(0.040 * fs);
  const dB1 = onset - Math.round(0.010 * fs);

  // Ventana donde se busca la onda T: desde poco después del punto J hasta
  // antes de que pueda aparecer la P siguiente. Se escala con el RR porque a
  // frecuencias altas la T se adelanta — si la ventana fuera fija, a 120 lpm se
  // estaría midiendo la P del latido siguiente y llamándola T.
  const dT0 = offset + Math.round(0.080 * fs);
  const dT1 = Math.min(
    Math.round(0.60 * fs),
    offset + Math.round(Math.max(0.16, 0.62 * Math.sqrt(rrMed)) * fs),
    // Y nunca más allá del 72% del RR. Sin este tope, a frecuencias altas la
    // ventana llegaba hasta el latido SIGUIENTE y medía su QRS como si fuera la
    // onda T: a 120 lpm daba T de 1 mV donde había 0,2. Lo que se rompe así no
    // avisa, porque el número que sale es plausible.
    Math.round(0.72 * rrMed * fs),
  );

  // Latido promedio por derivación: se superponen todos los complejos alineados
  // por el pico R. Lo usa la medición del QT, que necesita derivadas limpias.
  const promedio = (sig) => {
    const antes = -onset + Math.round(0.06 * fs);
    const despues = dT1 + Math.round(0.10 * fs);
    const tpl = new Float64Array(antes + despues + 1);
    let n = 0;
    for (const r0 of usable) {
      if (r0 - antes < 0 || r0 + despues >= sig.length) continue;
      for (let k = 0; k <= antes + despues; k++) tpl[k] += sig[r0 - antes + k];
      n++;
    }
    if (!n) return null;
    for (let k = 0; k < tpl.length; k++) tpl[k] /= n;
    return { tpl, rIdx: antes };
  };

  const st = {};
  const t = {};
  const qt = {};
  const rPrime = {};   // altura de la segunda R del QRS, 0 si hay una sola
  const sag = {};   // hundimiento del ST bajo la cuerda J→pico de la T
  const r = {};   // altura de la onda R (positiva)
  const sw = {};  // profundidad de la onda S (negativa)
  const span = {};// excursión máxima respecto de la línea de base, para el dibujo
  for (const lead of Object.keys(leads)) {
    const sig = leads[lead];
    const stVals = [];
    const tVals = [];
    const rVals = [];
    const sVals = [];
    const sagVals = [];
    let spanMax = 0;
    for (const r0 of usable) {
      if (r0 + dB0 < 0 || r0 + dT1 >= sig.length) continue;
      let base = 0;
      for (let k = r0 + dB0; k < r0 + dB1; k++) base += sig[k];
      base /= (dB1 - dB0);
      stVals.push(sig[r0 + dJ60] - base);

      // De la onda T interesa la amplitud CON SIGNO: una T invertida es el
      // hallazgo, y tomar el valor absoluto lo borraría.
      let peak = 0, peakIdx = r0 + dT0;
      for (let k = r0 + dT0; k <= r0 + dT1; k++) {
        const v = sig[k] - base;
        if (Math.abs(v) > Math.abs(peak)) { peak = v; peakIdx = k; }
      }
      tVals.push(peak);

      // ── Forma del segmento ST ──
      // No alcanza con saber CUÁNTO bajó el ST; importa CÓMO bajó, y lo que
      // separa las formas es dónde está el punto más bajo.
      //
      //   · Normal o isquemia horizontal: el ST arranca en su punto más bajo —el
      //     J— y de ahí sólo sube hacia la T. Nunca baja por debajo del J.
      //   · Efecto digitálico: el ST sigue bajando DESPUÉS del punto J, toca
      //     fondo en el medio del segmento y vuelve a subir. Esa panza es la
      //     "cubeta", y se mide como cuánto más abajo del J llega el trazado.
      //
      // Se mide contra el punto J y no contra la cuerda que va hasta el pico de
      // la T: esa cuerda sube, y entonces hasta un electro normal —con el ST
      // plano y la T alta— queda por debajo de ella y marcaba 124 µV de falsa
      // cubeta. Contra el J, un ST plano da cero, que es lo correcto.
      const jIdx = r0 + offset;
      const finST = Math.min(peakIdx, jIdx + Math.round(0.16 * fs));
      if (finST - jIdx >= Math.round(0.04 * fs)) {
        const vJ = sig[jIdx] - base;
        let hundimiento = 0;
        for (let k = jIdx; k <= finST; k++) hundimiento = Math.max(hundimiento, vJ - (sig[k] - base));
        sagVals.push(hundimiento);
      }

      // R y S dentro del complejo. La progresión de la R por las precordiales
      // —de una r mínima en V1 a una R dominante en V6— es un hallazgo en sí
      // mismo: cuando se pierde, hay que pensar en infarto anterior antiguo.
      let rMax = 0, sMin = 0;
      for (let k = r0 + onset; k <= r0 + offset; k++) {
        const v = sig[k] - base;
        if (v > rMax) rMax = v;
        if (v < sMin) sMin = v;
      }
      rVals.push(rMax);
      sVals.push(sMin);
      for (let k = r0 + dB0; k <= r0 + dT1; k++) spanMax = Math.max(spanMax, Math.abs(sig[k] - base));
    }
    st[lead] = median(stVals);
    t[lead] = median(tVals);
    sag[lead] = sagVals.length ? median(sagVals) : 0;

    // QT y segunda R de esta derivación, sobre el latido promedio.
    const prom = promedio(sig);
    if (prom) {
      const { tpl, rIdx } = prom;
      let base = 0;
      for (let k = rIdx + dB0; k < rIdx + dB1; k++) base += tpl[k];
      base /= (dB1 - dB0);

      rPrime[lead] = segundaR(tpl, base, rIdx + onset, rIdx + offset, fs);
      const fin = tEndTangent(tpl, base, rIdx + dT0, Math.min(tpl.length - 2, rIdx + dT1), fs);
      qt[lead] = fin === null ? null : ((fin - (rIdx + onset)) / fs) * 1000;
    } else {
      qt[lead] = null;
      rPrime[lead] = 0;
    }
    r[lead] = median(rVals);
    sw[lead] = median(sVals);
    span[lead] = spanMax;
  }

  // ── Ruido ──
  // Se mide comparando los latidos ENTRE SÍ. Un electro limpio repite el mismo
  // complejo latido tras latido; lo que cambia de uno a otro es ruido: temblor
  // muscular, mal contacto del electrodo, interferencia de red. Se toma la
  // desviación absoluta mediana entre latidos en cada instante del ciclo, y de
  // esas la mediana. La mediana en los dos pasos hace que una extrasístole
  // aislada —que sí es distinta, y no es ruido— no cuente como suciedad.
  //
  // La deriva de la línea de base entra en la cuenta, y está bien que entre: un
  // trazado que sube y baja con la respiración es igual de difícil de medir que
  // uno con temblor. Lo que se está midiendo no es "cuánto ruido eléctrico hay"
  // sino "cuánto cuesta leer este electro", que es lo que importa para decidir
  // si sirve para enseñar.
  let noise = 0;
  if (usable.length >= 3) {
    for (const lead of Object.keys(leads)) {
      const sig = leads[lead];
      const disp = [];
      for (let k = onset - Math.round(0.05 * fs); k <= dT1; k += Math.max(1, Math.round(0.008 * fs))) {
        const vals = [];
        for (const r0 of usable) {
          if (r0 + k < 0 || r0 + k >= sig.length) continue;
          vals.push(sig[r0 + k]);
        }
        if (vals.length < 3) continue;
        const c = median(vals);
        disp.push(median(vals.map((v) => Math.abs(v - c))));
      }
      noise = Math.max(noise, median(disp));
    }
  }

  // Se descartan las derivaciones donde la T es tan chata que el final no se
  // puede ubicar: un QT medido sobre una T invisible es un número inventado.
  //
  // Y después, entre las que quedan, se descartan las que se apartan demasiado
  // del consenso. Quedarse con el máximo a secas es frágil: basta una sola
  // derivación donde la tangente falle para estirar el QT del registro entero.
  // Pasó — once derivaciones midiendo 259 ms y una midiendo 609. La dispersión
  // real del QT entre derivaciones es de unas decenas de milisegundos, así que
  // un 20% de diferencia contra la mediana ya no es dispersión: es un error.
  const qtValidos = Object.values(qt).filter((v) => v !== null);
  const qtMediana = median(qtValidos);
  const qtCreibles = qtValidos.filter((v) => Math.abs(v - qtMediana) <= qtMediana * 0.20);
  const qtMax = qtCreibles.length ? Math.max(...qtCreibles) : null;

  return {
    hr: 60 / rrMed,
    noise,
    rr,
    rrCv,
    beats,
    st,
    t,
    sag,
    rPrime,
    qt,
    // El QT que se informa es el MÁS LARGO de las derivaciones donde la T se
    // puede medir, no el promedio. Es la convención clínica y tiene su razón: la
    // repolarización no termina al mismo tiempo en todo el ventrículo, y el
    // riesgo lo marca la última fibra en repolarizar, no la media.
    qtMs: qtMax,
    // QT corregido por frecuencia. A más taquicardia el QT se acorta solo, así
    // que sin corregir no se puede comparar entre pacientes ni con un umbral.
    // Bazett (QT/√RR) es la fórmula que se enseña y la que usan los equipos;
    // exagera la corrección en los extremos, y por eso se acompaña de
    // Fridericia (QT/∛RR), que se porta mejor en taquicardia.
    qtcBazett: qtMax === null ? null : qtMax / Math.sqrt(rrMed),
    qtcFridericia: qtMax === null ? null : qtMax / Math.cbrt(rrMed),
    r,
    s: sw,
    span,
    qrsMs: ((offset - onset) / fs) * 1000,
  };
}
