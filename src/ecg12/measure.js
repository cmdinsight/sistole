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

import { LEAD_VECTORS } from './leads.js';

// ── Eje eléctrico en el plano frontal ──
// Hacia dónde apunta, en promedio, la despolarización del ventrículo. Se calcula
// como se define: cada derivación de los miembros mide la PROYECCIÓN del vector
// sobre su propio eje, así que con varias proyecciones se reconstruye el vector.
//
// Se usa el ÁREA neta del QRS y no la altura de la R. El área es la integral del
// complejo, o sea lo que el vector aportó durante todo el tiempo que duró; la
// altura del pico es un solo instante. En un QRS con R y S grandes —donde el
// vector va primero para un lado y después para el otro— mirar sólo el pico da
// una respuesta que no representa al latido.
//
// Y se resuelve con las seis derivaciones a la vez, por mínimos cuadrados, en vez
// de con la receta de mirar I y aVF. No es rebuscamiento: las aumentadas valen
// √3/2 de las bipolares, y combinarlas sin corregir ese factor inclina el
// resultado. La geometría exacta ya está en leads.js, que es de donde sale.
const FRONTALES = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF'];

function ejeFrontal(areas) {
  let Sxx = 0, Sxy = 0, Syy = 0, bx = 0, by = 0;
  for (const l of FRONTALES) {
    if (areas[l] === undefined) continue;
    const [x, y] = LEAD_VECTORS[l];
    const mag = Math.hypot(x, y);
    if (!mag) continue;
    const ux = x / mag, uy = y / mag;
    const proyeccion = areas[l] / mag;
    Sxx += ux * ux; Sxy += ux * uy; Syy += uy * uy;
    bx += proyeccion * ux; by += proyeccion * uy;
  }
  const det = Sxx * Syy - Sxy * Sxy;
  if (!det) return null;
  const vx = (Syy * bx - Sxy * by) / det;
  const vy = (Sxx * by - Sxy * bx) / det;
  if (!Math.hypot(vx, vy)) return null;
  // Y apunta a los pies, así que atan2(vy, vx) da directamente la convención
  // habitual: 0° hacia la izquierda del paciente, +90° hacia abajo, −90° arriba.
  return (Math.atan2(vy, vx) * 180) / Math.PI;
}

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
// ── LA MUESCA DEL PUNTO J ─────────────────────────────────────────────────
// El hallazgo que define la repolarización precoz no es el supradesnivel —eso
// lo tiene también un infarto— sino CÓMO empieza: el QRS no termina bajando
// limpio hasta la línea del ST, sino que se frena y hace una joroba justo en el
// punto J. Es la onda J, y es lo único de todo el cuadro que un infarto agudo
// no imita.
//
// Se mide sobre el latido promedio y se pide que el pico de la joroba sea un
// máximo LOCAL de verdad: que suba desde un mínimo previo y que DESPUÉS VUELVA
// A BAJAR. La segunda mitad de esa condición es la que hace que la medición
// mida algo. Sin ella, el primer intento tomaba la subida del final de la S
// hasta el pico de la onda T como si fuera una muesca, y devolvía 24 mm de onda
// J en trazados donde no había ninguna; y lo peor es que también la devolvía en
// los normales, así que el número no separaba nada y encima parecía razonable.
//
// Los tres recaudos:
//
//   · sube al menos 0,04 mV (0,4 mm) desde el mínimo previo, y ese mínimo está
//     a menos de 50 ms. Por debajo de eso cualquier temblor del promedio
//     inventa una muesca.
//   · baja al menos 0,03 mV en los 60 ms siguientes. Esto es lo que separa la
//     joroba de la rampa que sube hacia la T.
//   · el pico cae en la zona del punto J —entre 40 ms antes y 30 ms después del
//     final del QRS medido—, no en el medio del complejo. Sin esta condición la
//     R bífida de un bloqueo de rama cuenta como onda J, y no lo es.
function muescaJ(beat, base, rIdx, onset, offset, fs) {
  const desde = rIdx + onset;
  const jIdx = rIdx + offset;
  const zona0 = jIdx - Math.round(0.040 * fs);
  const zona1 = jIdx + Math.round(0.030 * fs);
  const subida = Math.round(0.050 * fs);
  const bajada = Math.round(0.060 * fs);

  let muesca = 0;
  // La altura del punto J: el punto más alto de esa misma zona. Cuando hay
  // muesca es la cima de la joroba, que es lo que el consenso de 2015 llama Jp
  // y sobre lo que pone el umbral de 1 mm; cuando no la hay, es el punto J a
  // secas. Se devuelve siempre, haya muesca o no, porque las dos mitades del
  // hallazgo —cuánto sube y con qué forma— son preguntas distintas.
  let alto = -Infinity;
  for (let k = Math.max(zona0, desde + 1); k <= Math.min(zona1, beat.length - 2); k++) {
    alto = Math.max(alto, beat[k] - base);
    if (beat[k] < beat[k - 1] || beat[k] < beat[k + 1]) continue;   // máximo local
    if (beat[k] - base <= 0) continue;
    // El mínimo de donde arranca la joroba es el que está INMEDIATAMENTE antes:
    // se camina hacia atrás mientras el trazado siga bajando. Tomar el mínimo de
    // toda la ventana en cambio llegaría hasta el fondo de la S en las
    // derivaciones que la tienen profunda, y entonces la "muesca" sería toda la
    // subida de la S al punto J, que es lo que hace cualquier QRS normal.
    let minPrevio = k;
    while (minPrevio > Math.max(desde, k - subida) && beat[minPrevio - 1] <= beat[minPrevio]) minPrevio--;
    minPrevio = beat[minPrevio];
    let minPosterior = beat[k];
    for (let j = k; j <= Math.min(beat.length - 1, k + bajada); j++) minPosterior = Math.min(minPosterior, beat[j]);
    const sube = beat[k] - minPrevio;
    const baja = beat[k] - minPosterior;
    if (sube >= 0.04 && baja >= 0.03) muesca = Math.max(muesca, Math.min(sube, baja));
  }
  return { muesca, alto: Number.isFinite(alto) ? alto : 0 };
}

// ── LA ONDA U ────────────────────────────────────────────────────────────
// La deflexión chica que sigue a la onda T. Normalmente mide menos de la cuarta
// parte de la T y pasa desapercibida; cuando baja el potasio crece, la T se
// aplana, y llega a ser tan alta como la T o más alta. Ahí es el hallazgo.
//
// Se mide sobre el latido promedio, y ese promedio es lo que la hace medible:
// una onda de 0,2 mV no se distingue del ruido en un latido suelto y sí se
// distingue cuando ocho latidos la repiten en el mismo lugar.
//
// Esta función hace su propia separación entre T y U en vez de partir del pico
// de la T que mide el resto del módulo, y la razón es concreta. La amplitud de
// la T se toma como la deflexión MÁS GRANDE de la ventana de la T. Cuando la U
// crece hasta superar a la T —que es justamente lo que pasa en la
// hipopotasemia—, esa regla se queda con la U y la llama T. En V4 de JS22392 la
// T mide 1,5 mm y la U 2,3 mm, y el módulo informa "T 2,1 mm": está midiendo la
// U. Por eso acá se buscan las DOS jorobas por orden de aparición y no por
// tamaño: la primera es la T, la segunda es la U, y así la razón U/T significa
// lo que dice.
//
// Para que cuenten como dos ondas y no como una sola con ruido encima, se pide
// que el valle que las separa esté al menos 0,02 mV por debajo de las dos
// cimas. Sin esa condición, cualquier ondulación de la rama descendente de la T
// sale informada como onda U.
//
// Dos topes de ventana, y los dos hacen falta. El 85 % del RR la mantiene antes
// de la P del latido siguiente: confundir una P con una U sería informar
// hipopotasemia en un electro normal. Y 350 ms desde el pico de la T la
// mantienen dentro de lo que una U puede ser; sin ese segundo tope, en un
// trazado lento el máximo de toda la ventana caía a 700 ms de la R, sobre la
// línea de base, y salía informado como onda U de 0 mm.
function ondaU(beat, base, rIdx, dT0, dT1, fs, rrMuestras) {
  const finT = Math.min(beat.length - 2, rIdx + dT1);
  if (rIdx + dT0 >= finT) return null;

  // Primera joroba: el máximo hasta que el trazado empiece a bajar de verdad.
  // Se pide que la bajada dure 40 ms para no cortar en cualquier temblor.
  let tIdx = rIdx + dT0;
  for (let k = rIdx + dT0; k <= finT; k++) {
    if (beat[k] > beat[tIdx]) tIdx = k;
    else if (k - tIdx > Math.round(0.040 * fs)) break;
  }

  const hasta = Math.min(
    beat.length - 2,
    rIdx + Math.round(0.85 * rrMuestras),
    tIdx + Math.round(0.350 * fs),
  );
  if (tIdx + Math.round(0.040 * fs) >= hasta) return null;

  // El valle entre las dos.
  let valle = tIdx;
  for (let k = tIdx + 1; k <= hasta; k++) {
    if (beat[k] < beat[valle]) valle = k;
    else if (k - valle > Math.round(0.040 * fs)) break;
  }
  if (valle >= hasta) return null;

  let pico = valle;
  for (let k = valle; k <= hasta; k++) if (beat[k] > beat[pico]) pico = k;
  if (pico === valle) return null;

  const tAlto = beat[tIdx] - base;
  const uAlto = beat[pico] - base;
  const vAlto = beat[valle] - base;
  if (tAlto - vAlto < 0.02 || uAlto - vAlto < 0.02) return null;   // una sola onda
  // Y la U tiene que ser una onda POSITIVA de verdad, no un rizo sobre la línea
  // de base. Sin esto, en V5 y V6 de JS22392 —donde la T y la U están fundidas
  // en una sola meseta y no hay onda U separable— la función devolvía un pico de
  // 0,0 mm a 700 ms de la R: el valle y la cima eran dos temblores del promedio
  // separados por los 0,02 mV justos. Un hallazgo de amplitud cero no es un
  // hallazgo, y devolver null es la respuesta correcta.
  //
  // Queda dicho lo que esto NO mide: la onda U INVERTIDA, que es un signo de
  // isquemia. Medirla pide otra separación —una T positiva seguida de una
  // deflexión negativa— y no se intentó acá.
  if (uAlto < 0.02) return null;
  return { amp: uAlto, ms: ((pico - rIdx) / fs) * 1000, tAmp: tAlto };
}

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
// ── EL INTERVALO PR ───────────────────────────────────────────────────────
// Del comienzo de la onda P al comienzo del QRS: lo que tarda el estímulo en
// cruzar la aurícula y el nodo AV. Por encima de 200 ms hay bloqueo AV de
// primer grado.
//
// Se mide sobre el LATIDO PROMEDIO, y ahí hay una asimetría que conviene
// entender porque decide qué se puede y qué no se puede medir así. Promediar
// los latidos alineados por la R conserva la P cuando la conducción es 1:1
// —la P cae siempre a la misma distancia de la R, así que se suma consigo
// misma y el ruido se divide por la raíz del número de latidos— y la DESTRUYE
// cuando la aurícula va por su cuenta. Por eso este camino sirve para el
// bloqueo de primer grado y no sirve para el completo.
//
// La P de estos registros mide una o dos décimas de milivoltio, así que se
// prueba en varias derivaciones y se queda la que la muestra más alta. Por
// debajo de 0,3 mm no se mide nada: se devuelve null antes que un número
// inventado.
const LEADS_P = ['II', 'I', 'aVF', 'V1', 'III'];

function intervaloPR(leads, beats, fs, onset) {
  // Promedio propio, más ancho hacia atrás que el que usan el QT y la segunda
  // R: la P puede caer a un tercio de segundo de la R y aquel llega sólo a una
  // décima. Se arma acá en vez de ensanchar el otro, que está afinado para
  // derivadas limpias sobre la T y no conviene tocar.
  const antes = Math.round(0.42 * fs);
  const despues = Math.round(0.02 * fs);
  const promedioAncho = (sig) => {
    const tpl = new Float64Array(antes + despues + 1);
    let n = 0;
    for (const r0 of beats) {
      if (r0 - antes < 0 || r0 + despues >= sig.length) continue;
      for (let k = 0; k <= antes + despues; k++) tpl[k] += sig[r0 - antes + k];
      n++;
    }
    if (n < 3) return null;
    for (let k = 0; k < tpl.length; k++) tpl[k] /= n;
    return { tpl, rIdx: antes };
  };

  const salidas = [];
  for (const lead of LEADS_P) {
    if (!leads[lead]) continue;
    const prom = promedioAncho(leads[lead]);
    if (!prom) continue;
    const { tpl, rIdx } = prom;
    const iQRS = rIdx + onset;                       // comienzo del QRS
    const desde = Math.max(1, rIdx - Math.round(0.33 * fs));
    const hasta = iQRS - Math.round(0.010 * fs);
    if (hasta - desde < 3) continue;
    // Línea de base: el tramo anterior a la P, antes de que empiece a subir.
    let base = 0;
    const b0 = Math.max(0, desde - Math.round(0.05 * fs));
    for (let k = b0; k < desde; k++) base += tpl[k];
    base = desde > b0 ? base / (desde - b0) : tpl[desde];

    let iP = -1, amp = 0;
    for (let k = desde; k <= hasta; k++) {
      const v = Math.abs(tpl[k] - base);
      if (v > amp) { amp = v; iP = k; }
    }
    if (iP < 0 || amp < 0.03) continue;              // P de menos de 0,3 mm
    const signo = Math.sign(tpl[iP] - base);
    // Comienzo y final de la P: hacia atrás y hacia adelante hasta caer al 20 %
    // de su altura.
    let iP0 = iP;
    while (iP0 > desde && signo * (tpl[iP0] - base) > 0.20 * amp) iP0--;
    let iP1 = iP;
    while (iP1 < hasta && signo * (tpl[iP1] - base) > 0.20 * amp) iP1++;

    // Entre el final de la P y el comienzo del QRS tiene que haber un segmento
    // ISOELÉCTRICO. Sin esta condición, lo que se mide no es siempre una P: en
    // el registro normal de control daba 88 ms —imposible en ritmo sinusal—
    // porque agarraba la cola de la T, y en fibrilación y en aleteo, donde no
    // hay P ninguna, devolvía números de aspecto respetable. Un hallazgo que
    // aparece donde no existe es peor que uno que falta.
    const seg = iQRS - iP1;
    if (seg < Math.round(0.02 * fs)) continue;
    // La tolerancia no puede ser sólo proporcional a la P: con una P de 84 µV,
    // el 35 % son 29 µV, menos que la deriva normal de la línea de base, y se
    // rechazaban derivaciones buenas por unos pocos microvoltios de corrimiento.
    // Se le pone un piso absoluto de 35 µV, que sigue siendo muy inferior a la
    // cola de una onda T, que es lo que hay que dejar afuera.
    const tolera = Math.max(0.35 * amp, 0.035);
    let fuera = 0;
    for (let k = iP1; k < iQRS; k++) if (Math.abs(tpl[k] - base) > tolera) fuera++;
    if (fuera > 0.35 * seg) continue;

    const pr = ((iQRS - iP0) / fs) * 1000;
    // Por debajo de 100 ms no es un PR corto: es una medición equivocada. La
    // preexcitación, que sí los da, no se mide con esto y queda fuera.
    if (pr < 100 || pr > 420) continue;
    salidas.push({ lead, pr, amp });
  }
  if (!salidas.length) return { prMs: null, pAmp: null, pLead: null };
  salidas.sort((a, b) => b.amp - a.amp);
  return { prMs: salidas[0].pr, pAmp: salidas[0].amp, pLead: salidas[0].lead };
}

// ── EL PR, LATIDO A LATIDO ────────────────────────────────────────────────
// El PR promediado sirve para el bloqueo de primer grado, donde todos los
// latidos tienen el mismo. No sirve para el Wenckebach, donde el hallazgo ES
// que cada latido tiene uno distinto: promediarlos borra exactamente lo que hay
// que ver.
//
// Medirlo latido a latido es más frágil —no hay promedio que limpie el ruido—
// así que se mide en varias derivaciones y se exige que COINCIDAN. Si tres
// derivaciones independientes dan la misma serie de PR, está midiendo una onda
// P; si dan series distintas, está midiendo ruido. Ése es el control que faltó
// la primera vez que se intentó este caso.
function prPorLatido(leads, beats, fs, env) {
  const salidas = [];
  for (const lead of LEADS_P) {
    if (!leads[lead]) continue;
    const sig = leads[lead];
    const n = sig.length;
    const serie = [];
    for (const b of beats) {
      // Comienzo del QRS de ESTE latido, con la energía de pendiente.
      const piso = median(Array.from(env.slice(Math.max(0, b - Math.round(0.35 * fs)), Math.max(1, b - Math.round(0.20 * fs)))));
      let iQ = b;
      const lim = Math.max(0, b - Math.round(0.10 * fs));
      while (iQ > lim && env[iQ] > piso + 0.06 * (env[b] - piso)) iQ--;
      const desde = Math.max(0, b - Math.round(0.42 * fs));
      const hasta = iQ - Math.round(0.015 * fs);
      if (hasta - desde < 5) { serie.push(null); continue; }
      let base = 0, c = 0;
      for (let k = desde; k < desde + Math.round(0.04 * fs) && k < hasta; k++) { base += sig[k]; c++; }
      base = c ? base / c : 0;
      let iP = -1, amp = 0;
      for (let k = desde; k <= hasta; k++) { const v = Math.abs(sig[k] - base); if (v > amp) { amp = v; iP = k; } }
      if (iP < 0 || amp < 0.04) { serie.push(null); continue; }
      const sg = Math.sign(sig[iP] - base);
      let iP0 = iP;
      while (iP0 > desde && sg * (sig[iP0] - base) > 0.20 * amp) iP0--;
      const pr = ((iQ - iP0) / fs) * 1000;
      serie.push(pr >= 80 && pr <= 460 ? pr : null);
    }
    const validos = serie.filter((x) => x !== null);
    if (validos.length >= Math.max(4, beats.length * 0.6)) salidas.push({ lead, serie, validos });
  }
  if (salidas.length < 2) return { prSerie: null, prSalto: null, prLeads: 0 };

  // Se queda la serie de la derivación con más latidos medidos, pero sólo si
  // otra la CONFIRMA: dos series independientes que coinciden dentro de 25 ms.
  salidas.sort((a, b) => b.validos.length - a.validos.length);
  const ref = salidas[0];
  const coincide = salidas.slice(1).some((o) => {
    const pares = ref.serie.map((v, i) => [v, o.serie[i]]).filter(([a, b]) => a !== null && b !== null);
    if (pares.length < 4) return false;
    const dif = median(pares.map(([a, b]) => Math.abs(a - b)));
    return dif <= 25;
  });
  if (!coincide) return { prSerie: null, prSalto: null, prLeads: salidas.length };

  // Cuánto se estira el PR dentro del registro. NO se usa el máximo menos el
  // mínimo: ese número lo deciden los dos peores latidos, y en ritmo sinusal
  // —donde el PR es constante por definición— daba 72 ms de mediana, que es
  // ruido de medición y no variación real. Se recorta a los percentiles 10 y
  // 90, que es lo mismo pero sin dejar que dos latidos manden.
  const v = ref.validos.slice().sort((a, b) => a - b);
  const q = (p) => v[Math.min(v.length - 1, Math.max(0, Math.round((v.length - 1) * p)))];
  return {
    prSerie: ref.serie,
    prSalto: q(0.90) - q(0.10),
    prLeads: salidas.length,
  };
}

// ── LATIDOS PREMATUROS DE ORIGEN VENTRICULAR ──────────────────────────────
// Una extrasístole ventricular es un latido que llega ANTES de tiempo y que
// además NO SE PARECE a los otros. Se piden las dos cosas, y ninguna alcanza
// sola: prematuro también es una extrasístole auricular, que baja por el camino
// normal y sale idéntica a las demás; y distinto también sale un latido que el
// ruido deformó. Juntas son específicas.
//
// La forma se compara por CORRELACIÓN contra la plantilla del latido típico,
// no por ancho. Medir el ancho de un latido suelto es frágil —es una sola
// muestra, sin promediar—, mientras que la correlación usa los cien puntos de
// la ventana y no depende de acertar dónde empieza y termina el complejo.
//
// Calibrado sobre 70 registros de cada grupo: dispara en el 43 % de los
// etiquetados con extrasístole ventricular, en el 1 % de los normales y en el
// 4 % de las fibrilaciones. Sensibilidad media y especificidad alta, que es
// exactamente el reparto que conviene: lo que no se puede permitir es decirle
// a un electro normal que tiene extrasístoles.
// Umbral de parecido. Con la correlación al MEJOR desplazamiento un latido
// normal se acerca a 1, así que el corte sube respecto de la versión sin
// deslizamiento. El valor sale de la calibración, no de la intuición.
const UMBRAL_FORMA = 0.94;

function latidosPrematuros(leads, beats, fs, rrMed) {
  if (beats.length < 5) return { prematuros: 0, prematuridad: null, forma: null };
  // Compuesto propio, con TODAS las derivaciones medidas. El de detección usa
  // cinco y está afinado para encontrar picos, no para comparar formas: con
  // cinco, la extrasístole del registro 4647 correlacionaba 0,83 contra la
  // plantilla, y con ocho, 0,78. La diferencia decide si se detecta o no.
  const use = ['I', 'II', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'].filter((l) => leads[l]);
  const n = leads[use[0]].length;
  const det = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let x = 0;
    for (const l of use) x += leads[l][i] * leads[l][i];
    det[i] = Math.sqrt(x);
  }
  const w = Math.round(0.06 * fs);
  const tpl = [];
  for (let k = -w; k <= w; k++) {
    const v = [];
    for (const b of beats) { const i = b + k; if (i >= 0 && i < n) v.push(det[i]); }
    tpl.push(median(v) ?? 0);
  }
  // Correlación con el MEJOR desplazamiento, deslizando la ventana ±28 ms.
  // Sin esto el número depende de dónde cayó exactamente el pico detectado: en
  // el registro 4647 la misma extrasístole daba 0,78 o 0,87 según qué compuesto
  // hubiera fijado el pico. Un latido normal mal alineado se recupera al
  // deslizarlo; una extrasístole sigue sin parecerse por más que se la mueva.
  const desliz = Math.round(0.028 * fs);
  const unaCorr = (b, off) => {
    const x = [], y = [];
    for (let k = -w; k <= w; k++) { const i = b + off + k; if (i < 0 || i >= n) return null; x.push(det[i]); y.push(tpl[k + w]); }
    const mx = x.reduce((a, c) => a + c, 0) / x.length;
    const my = y.reduce((a, c) => a + c, 0) / y.length;
    let num = 0, d1 = 0, d2 = 0;
    for (let i = 0; i < x.length; i++) { num += (x[i] - mx) * (y[i] - my); d1 += (x[i] - mx) ** 2; d2 += (y[i] - my) ** 2; }
    return (d1 > 0 && d2 > 0) ? num / Math.sqrt(d1 * d2) : 0;
  };
  const correlacion = (b) => {
    let mejor = null;
    for (let off = -desliz; off <= desliz; off++) {
      const c = unaCorr(b, off);
      if (c !== null && (mejor === null || c > mejor)) mejor = c;
    }
    return mejor;
  };
  let prematuros = 0, peorPrem = null, peorForma = null;
  for (let i = 1; i < beats.length; i++) {
    const prem = ((beats[i] - beats[i - 1]) / fs) / rrMed;
    const c = correlacion(beats[i]);
    if (c === null) continue;
    if (prem < 0.85 && c < UMBRAL_FORMA) {
      prematuros++;
      if (peorPrem === null || prem < peorPrem) { peorPrem = prem; peorForma = c; }
    }
  }
  return { prematuros, prematuridad: peorPrem, forma: peorForma };
}

// ═══════════════════════════════════════════════════════════════
// DISOCIACIÓN AURICULOVENTRICULAR
// ═══════════════════════════════════════════════════════════════
// Que la aurícula y el ventrículo latan cada uno por su cuenta. Es lo que
// define el bloqueo AV completo —y lo que confirma una taquicardia
// ventricular—, o sea el hallazgo cuya conducta es un marcapasos. Por eso la
// medición tiene que errar hacia el "no sé" y no hacia el "sí".
//
// ── TRES INTENTOS QUE NO FUNCIONARON, Y LO QUE ENSEÑARON ─────────────────
//
// Los tres anteriores quisieron contestar "¿a qué frecuencia va la aurícula?", y
// para eso hay que ver las ondas P:
//
//   1. Detectar cada P por picos: 5 de 6 registros sin medición. Una P de
//      0,1 mV no se separa de 0,04 mV de ruido latido a latido.
//   2. Autocorrelación con el QRS tapado: acertó tres frecuencias de referencia
//      pero en 50 registros NORMALES dio razón auricular/ventricular de 1,31 de
//      mediana —tiene que dar 1,00— y marcó disociación en 6 de 50.
//   3. Resta del latido promedio: 1 de 3.
//
// ── LO QUE SÍ FUNCIONA: PLEGAR ──────────────────────────────────────────
//
// La pregunta se da vuelta. No "a qué frecuencia va la aurícula" sino "¿queda
// en el trazado algún ritmo que NO sea el del ventrículo?".
//
// Primero se resta el latido promedio alineado por la R. Eso saca todo lo que
// está atado al ventrículo, y acá está la asimetría que hace posible todo: en
// conducción 1:1 la P está atada al ventrículo y se va con la resta; cuando la
// aurícula va por su cuenta, la P sobrevive. Un electro normal queda sin nada
// periódico que encontrar, que es la respuesta correcta.
//
// Después se PLIEGA el residuo en cada período candidato: se promedian todas
// las muestras que caen en la misma fase. Con el período justo, las P se suman
// entre sí y el ruido se divide por la raíz del número de pliegues; con el
// período equivocado, las P caen en fases distintas y se borran igual que el
// ruido. Se barre de 45 a 200 por minuto y se mira dónde se levanta algo.
//
// Y esto es lo importante: en un electro normal el barrido TAMBIÉN encuentra
// algo —lo que queda del QRS y de la T después de la resta— pero lo encuentra
// en el período del VENTRÍCULO. La razón entre las dos frecuencias da 1,00. El
// hallazgo no es que aparezca un pico, es DÓNDE aparece.
//
// ── LAS GUARDAS, CADA UNA POR UN ERROR CONCRETO ─────────────────────────
//
// Con el barrido solo no alcanza, y las guardas no salieron de la teoría sino
// de mirar los que fallaban. Están explicadas una por una en formaAuricular() y
// en dosMitades(). La última es la que más costó: una deriva de la línea de
// base puede satisfacer todas las demás a la vez, porque es lenta y afecta a
// todas las derivaciones juntas. Lo que no puede hacer es repetir el mismo
// período en la primera mitad del trazado y en la segunda.
//
// ── CALIBRACIÓN ─────────────────────────────────────────────────────────
//
//                                      dispara
//   NORMAL ...........................  0 / 70
//   BLOQUEO AV 1° (conducción 1:1) ...  0 / 50
//   FIBRILACIÓN AURICULAR (sin P) ....  0 / 12
//   BLOQUEO AV COMPLETO ..............  1 / 11
//   DISOCIACIÓN AV (CinC 2021) .......  2 / 55
//
// Cero falsos positivos en 132 registros donde la conducción es 1:1 o no hay
// ondas P. Eso es lo que se necesitaba y lo que ninguno de los tres intentos
// anteriores logró.
//
// LO QUE ESTO NO ES: un detector. Encuentra 1 de cada 11 bloqueos completos.
// Sirve para CUSTODIAR un caso cuyo trazado ya se miró, no para buscar
// disociación en una base ni —muchísimo menos— para descartarla en un paciente.
// Que no dispare no dice nada.
//
// Y un límite de fondo: si las dos frecuencias fueran iguales, las P caerían
// siempre en la misma fase y esto no vería nada. La disociación isorrítmica
// queda fuera del alcance del método, no de este umbral.
const LEADS_A = ['II', 'III', 'aVF', 'V1', 'I', 'V2'];

// La señal menos el latido promedio alineado por la R.
function residuoVentricular(sig, beats, fs, rrMed) {
  const antes = Math.round(0.45 * fs);
  const despues = Math.round(Math.min(0.85, rrMed * 0.95) * fs);
  const tpl = new Float64Array(antes + despues + 1);
  let n = 0;
  for (const r0 of beats) {
    if (r0 - antes < 0 || r0 + despues >= sig.length) continue;
    for (let k = 0; k < tpl.length; k++) tpl[k] += sig[r0 - antes + k];
    n++;
  }
  if (n < 4) return null;
  for (let k = 0; k < tpl.length; k++) tpl[k] /= n;
  const res = new Float64Array(sig.length);
  const cubierto = new Uint8Array(sig.length);
  for (const r0 of beats) {
    for (let k = 0; k < tpl.length; k++) {
      const i = r0 - antes + k;
      if (i < 0 || i >= sig.length || cubierto[i]) continue;
      res[i] = sig[i] - tpl[k];
      cubierto[i] = 1;
    }
  }
  return { res, cubierto };
}

function prepararAuricular(leads, beats, fs, rrMed) {
  if (beats.length < 4) return null;
  const usa = LEADS_A.filter((l) => leads[l]);
  if (usa.length < 4) return null;
  const n = leads[usa[0]].length;

  // El QRS se TAPA, no se resta. Un desalineamiento de 4 ms sobre la pendiente
  // del QRS deja un residuo enorme, y con período igual al RR: el detector lo
  // toma por onda P y la medición contesta otra pregunta.
  const valido = new Uint8Array(n).fill(1);
  const w = Math.round(0.075 * fs);
  for (const r0 of beats) for (let i = Math.max(0, r0 - w); i < Math.min(n, r0 + w); i++) valido[i] = 0;

  const rs = [];
  for (const l of usa) {
    const r = residuoVentricular(leads[l], beats, fs, rrMed);
    if (!r) return null;
    for (let i = 0; i < n; i++) if (!r.cubierto[i]) valido[i] = 0;
    rs.push(r.res);
  }
  return { rs, valido, n, fs, rrMed, usa };
}

// La forma plegada de una derivación, con su media quitada.
function plegado(p, res, T) {
  const suma = new Float64Array(T), cuenta = new Int32Array(T);
  for (let i = 0; i < p.n; i++) { if (!p.valido[i]) continue; const b = i % T; suma[b] += res[i]; cuenta[b]++; }
  let m = 0, cn = 0;
  for (let b = 0; b < T; b++) if (cuenta[b]) { suma[b] /= cuenta[b]; m += suma[b]; cn++; }
  if (cn < T * 0.6) return null;
  m /= cn;
  for (let b = 0; b < T; b++) suma[b] -= m;
  return suma;
}

// Cuánta señal coherente queda al plegar en el período T.
function energiaPlegada(p, T) {
  let total = 0;
  for (const res of p.rs) {
    const f = plegado(p, res, T);
    if (!f) return null;
    let e = 0;
    for (let b = 0; b < T; b++) e += f[b] * f[b];
    total += e / T;
  }
  return Math.sqrt(total / p.rs.length);
}

// ¿Lo que se levantó tiene forma de onda P, y lo ve más de una derivación?
//
//   · UN SOLO lóbulo de la polaridad dominante. Una aurícula late una vez por
//     ciclo; dos lóbulos del mismo signo quieren decir que el período que
//     encontró el barrido es el doble del verdadero. Se cuentan sobre la forma
//     CON SIGNO: tomando el valor absoluto, el valle que sigue a toda P cuenta
//     como segunda deflexión y se caían los buenos.
//   · que dure lo que dura una P —entre 40 y 160 ms, y no más del 30 % del
//     ciclo—, y que mida lo que mide una P: entre 0,35 y 3 mm. Sin el techo, un
//     registro con 8 mm de deflexión salía informado como onda P.
//   · que DOS derivaciones más la vean en la misma fase. Es la misma condición
//     que hace confiable la medición del PR.
function formaAuricular(p, T) {
  const tol = Math.round(0.040 * p.fs);
  const vistas = [];
  for (const res of p.rs) {
    const f = plegado(p, res, T);
    if (!f) continue;
    let pico = 0;
    for (let b = 0; b < T; b++) if (Math.abs(f[b]) > Math.abs(f[pico])) pico = b;
    vistas.push({ f, pico, alto: Math.abs(f[pico]) });
  }
  if (!vistas.length) return null;
  vistas.sort((a, b) => b.alto - a.alto);
  const { f, pico, alto } = vistas[0];

  const acuerdan = vistas.slice(1).filter((v) => {
    const d = Math.abs(v.pico - pico);
    return Math.min(d, T - d) <= tol && v.alto >= 0.035;
  }).length;

  const signo = Math.sign(f[pico]);
  const arriba = new Uint8Array(T);
  for (let b = 0; b < T; b++) arriba[b] = signo * f[b] >= alto / 2 ? 1 : 0;
  let lobulos = 0, ancho = 0;
  for (let b = 0; b < T; b++) {
    if (!arriba[b] || arriba[(b - 1 + T) % T]) continue;
    lobulos++;
    let w = 0;
    while (w < T && arriba[(b + w) % T]) w++;
    for (let k = 0; k < w; k++) if ((b + k) % T === pico) ancho = w;
  }
  return { anchoMs: (Math.max(ancho, 1) / p.fs) * 1000, frac: Math.max(ancho, 1) / T, alto, lobulos, acuerdan };
}

function barrido(p, { minLpm = 45, maxLpm = 200 } = {}) {
  const T0 = Math.round((60 / maxLpm) * p.fs), T1 = Math.round((60 / minLpm) * p.fs);
  const curva = [];
  for (let T = T0; T <= T1; T++) {
    const a = energiaPlegada(p, T);
    if (a === null) continue;
    // Bajo puro ruido la amplitud plegada crece como raíz de T —menos pliegues,
    // menos promediado—. Sin normalizar, el barrido gana siempre en el período
    // más largo y el hallazgo sería un artefacto de la aritmética.
    curva.push({ T, norm: a / Math.sqrt(T) });
  }
  if (curva.length < 10) return null;
  let mejor = curva[0];
  for (const c of curva) if (c.norm > mejor.norm) mejor = c;
  const fondo = median(curva.map((c) => c.norm));
  return { mejor, realce: fondo ? mejor.norm / fondo : 0 };
}

// La prueba de las dos mitades: el mismo período en los primeros cinco segundos
// y en los últimos cinco. Es lo único que separa una aurícula de una deriva de
// la línea de base, porque la deriva satisface todas las demás guardas a la vez
// —es lenta y mueve todas las derivaciones juntas— y no puede repetir su
// período en dos tramos distintos del trazado.
function dosMitades(p, T) {
  const mitad = Math.floor(p.n / 2);
  const trozo = (desde, hasta) => {
    const b = barrido({ ...p, rs: p.rs.map((r) => r.slice(desde, hasta)),
                        valido: p.valido.slice(desde, hasta), n: hasta - desde });
    return b ? b.mejor.T : null;
  };
  const a = trozo(0, mitad), b = trozo(mitad, p.n);
  if (a === null || b === null) return false;
  const cerca = (x, y) => Math.abs(x - y) / Math.max(x, y) <= 0.08;
  return cerca(a, b) && cerca(a, T) && cerca(b, T);
}

function disociacionAV(leads, beats, fs, rrMed) {
  const p = prepararAuricular(leads, beats, fs, rrMed);
  if (!p) return null;
  const b = barrido(p);
  if (!b) return null;

  // ¿El máximo cayó en el período del VENTRÍCULO? Entonces no hay ningún otro
  // ritmo en el trazado, que es la respuesta normal. Los submúltiplos no hace
  // falta contemplarlos: plegar en T/2 una señal de período T manda cada
  // muestra a una fase distinta y se borra sola.
  const Trr = rrMed * fs;
  if ([1, 2].some((k) => Math.abs(b.mejor.T - k * Trr) < 0.10 * k * Trr)) return null;

  const lpm = 60 / (b.mejor.T / fs);
  const razon = lpm / (60 / rrMed);
  // La aurícula tiene que ir MÁS RÁPIDO que el ventrículo. Es lo que pasa en un
  // bloqueo completo —el escape de abajo es lento— y descartar la dirección
  // contraria quitó dos falsos positivos de un saque.
  if (razon < 1.15) return null;

  const f = formaAuricular(p, b.mejor.T);
  if (!f) return null;
  if (f.lobulos !== 1 || f.acuerdan < 2) return null;
  if (f.anchoMs < 40 || f.anchoMs > 160 || f.frac > 0.30) return null;
  if (f.alto < 0.035 || f.alto > 0.30) return null;
  if (b.realce < 1.8) return null;
  if (!dosMitades(p, b.mejor.T)) return null;

  return { lpm, razon, pAmp: f.alto, pMs: f.anchoMs, realce: b.realce, leads: f.acuerdan + 1 };
}

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

  // Y la DISPERSIÓN recortada del RR, que mide otra cosa y hace falta.
  //
  // rrCv usa la mediana de las desviaciones, que es robusta a un latido suelto
  // —una extrasístole no lo mueve— y por eso mismo es CIEGA cuando la minoría se
  // desvía. En JS22357 los RR miden 1936, 1460, 1928, 1572 y 1936 ms: dos de
  // cinco se apartan un 25 % y la mediana de las desviaciones sigue dando 8 ms,
  // o sea un coeficiente de 0,004. Ese trazado no es regular y el número decía
  // que sí. Un estadístico robusto puede esconder justo lo que se le pregunta.
  //
  // La dispersión recortada —el percentil 90 menos el 10, sobre la mediana— ve
  // las dos poblaciones y sigue descartando un latido aislado. Sobre los 30
  // registros de casos que afirman ritmo regular va de 0,005 a 0,168; los dos
  // que tienen pausa de verdad —extrasístole bloqueada y Wenckebach— dan 1,02 y
  // 0,80, y no afirman nada; la fibrilación auricular da 0,46 y 0,51.
  //
  // Con pocos latidos el recorte degenera en el rango, porque el percentil 10 de
  // cinco valores es el mínimo. Es una guarda, no una prueba.
  const rrSpread = (() => {
    if (rr.length < 3) return 0;
    const v = rr.slice().sort((a, b) => a - b);
    const q = (p) => v[Math.min(v.length - 1, Math.max(0, Math.round((v.length - 1) * p)))];
    return (q(0.90) - q(0.10)) / rrMed;
  })();

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

  // Los latidos prematuros usan su propio compuesto, sobre todas las
  // derivaciones: la forma de un latido se ve en las doce a la vez.
  const { prematuros, prematuridad, forma } = latidosPrematuros(leads, beats, fs, rrMed);
  // El PR latido a latido necesita la energía de pendiente del compuesto para
  // ubicar el comienzo de cada QRS por separado.
  const { prSerie, prSalto, prLeads } = prPorLatido(leads, usable, fs, slopeEnergy(det, fs, 0.03));

  // Si la aurícula late por su cuenta. Cuesta unos 55 ms, contra 12 del resto
  // de la medición, y se hace una sola vez al abrir un caso.
  const disociacion = disociacionAV(leads, beats, fs, rrMed);

  // El PR necesita el latido promedio y el comienzo del QRS, así que se mide
  // acá, una vez que los dos existen.
  const { prMs, pAmp, pLead } = intervaloPR(leads, usable, fs, onset);

  const areaQRS = {};   // área neta del complejo, para el eje
  const st = {};
  const t = {};
  const qt = {};
  const rPrime = {};   // altura de la segunda R del QRS, 0 si hay una sola
  const sag = {};   // hundimiento del ST bajo la cuerda J→pico de la T
  const jNotch = {};// altura de la muesca del punto J, 0 si el QRS baja limpio
  const jAmp = {};  // altura del punto J sobre la línea de base
  const uAmp = {};  // altura de la onda U, null si no se distingue de la T
  const uMs = {};   // dónde cae su pico respecto de la R, en ms
  const uOverT = {};// la U dividida por la T, con la T que separó ondaU
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

    // Área neta del QRS de esta derivación, sobre el latido promedio.
    const promArea = promedio(sig);
    if (promArea) {
      const { tpl, rIdx } = promArea;
      let base = 0;
      for (let k = rIdx + dB0; k < rIdx + dB1; k++) base += tpl[k];
      base /= (dB1 - dB0);
      let area = 0;
      for (let k = rIdx + onset; k <= rIdx + offset; k++) area += tpl[k] - base;
      areaQRS[lead] = area / fs;
    }
    sag[lead] = sagVals.length ? median(sagVals) : 0;

    // QT y segunda R de esta derivación, sobre el latido promedio.
    const prom = promedio(sig);
    if (prom) {
      const { tpl, rIdx } = prom;
      let base = 0;
      for (let k = rIdx + dB0; k < rIdx + dB1; k++) base += tpl[k];
      base /= (dB1 - dB0);

      rPrime[lead] = segundaR(tpl, base, rIdx + onset, rIdx + offset, fs);
      const j = muescaJ(tpl, base, rIdx, onset, offset, fs);
      jNotch[lead] = j.muesca;
      jAmp[lead] = j.alto;
      const fin = tEndTangent(tpl, base, rIdx + dT0, Math.min(tpl.length - 2, rIdx + dT1), fs);
      qt[lead] = fin === null ? null : ((fin - (rIdx + onset)) / fs) * 1000;

      const u = ondaU(tpl, base, rIdx, dT0, dT1, fs, rrMed * fs);
      uAmp[lead] = u ? u.amp : null;
      uMs[lead] = u ? u.ms : null;
      // La razón U/T se calcula con la T que separó ondaU, no con t[lead]: son
      // dos cosas distintas en cuanto la U supera a la T, y mezclarlas daría una
      // razón de 1 justo en los casos en que el hallazgo es que pasa de 1.
      uOverT[lead] = u && u.tAmp > 0.02 ? u.amp / u.tAmp : null;
    } else {
      qt[lead] = null;
      rPrime[lead] = 0;
      jNotch[lead] = 0;
      jAmp[lead] = 0;
      uAmp[lead] = null;
      uMs[lead] = null;
      uOverT[lead] = null;
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
    rrSpread,
    beats,
    st,
    t,
    areaQRS,
    axisDeg: ejeFrontal(areaQRS),
    sag,
    rPrime,
    jNotch,
    jAmp,
    uAmp,
    uMs,
    uOverT,
    disociacion,
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
    // Intervalo PR en milisegundos, null si la P no se puede medir. pAmp es la
    // altura de la P en la derivación que se usó: sirve para exigir, en un caso
    // que hable del PR, que la P se VEA.
    prMs,
    pAmp,
    pLead,
    // Cuántos latidos llegaron antes de tiempo Y con forma distinta, y de ellos
    // el más prematuro: prematuridad es su RR como fracción del RR típico
    // (0,61 = llegó al 61 % del ciclo), forma es su correlación con la
    // plantilla (1 = idéntico).
    prematuros,
    prematuridad,
    forma,
    // Serie de PR latido a latido (null donde la P no se pudo medir), y cuánto
    // se estira de punta a punta. Sólo se devuelve cuando dos derivaciones
    // independientes dan la misma serie.
    prSerie,
    prSalto,
    prLeads,
  };
}
