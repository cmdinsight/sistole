// ═══════════════════════════════════════════════════════════════
// HALLAZGOS: UN VOCABULARIO, DOS USOS
// ═══════════════════════════════════════════════════════════════
// Un `findings` describe, en términos medibles, lo que un electro tiene que
// mostrar: "ST elevado al menos 1,5 mm en II, III y aVF", "ritmo regular",
// "frecuencia entre 60 y 90". Ese mismo objeto sirve para las dos mitades del
// trabajo, y ahí está el sentido de tenerlo en un solo lugar:
//
//   BUSCAR   scripts/ptbxl-search.mjs recorre PTB-XL midiendo registros y se
//            queda con los que lo satisfacen. Se escribe el caso que se quiere
//            enseñar y la herramienta trae los electros que lo muestran.
//   CUSTODIAR  scripts/test-cases.mjs comprueba, en cada corrida de las pruebas,
//            que el registro elegido lo siga satisfaciendo.
//
// El predicado que encuentra el caso es el mismo que después lo vigila. Si
// fueran dos implementaciones, tarde o temprano dirían cosas distintas y la
// segunda dejaría pasar lo que la primera había elegido con otro criterio.
//
// Todos los umbrales están en milivoltios, que es la unidad en que mide
// measure.js. 0,1 mV = 1 mm de papel = un cuadradito.

const uv = (x) => `${Math.round(x * 1000)} µV`;
const mmStr = (x) => `${(x * 10).toFixed(1)} mm`;

// El umbral de irregularidad. En ritmo sinusal la variación del RR queda por
// debajo de 0,05 incluso con arritmia respiratoria; en fibrilación auricular
// trepa muy por encima. El 0,08 es el valle entre las dos poblaciones.
export const RR_IRREGULAR = 0.08;

// Cada regla sabe describirse y sabe evaluarse. Agregar un tipo de hallazgo
// nuevo es agregar una entrada acá, y queda disponible para buscar y para
// comprobar al mismo tiempo.
const REGLAS = {
  stElevation: ({ leads, min }, q) => ({
    label: `ST elevado ≥ ${mmStr(min)} en ${leads.join(', ')}`,
    fallos: leads.filter((l) => q.st[l] < min).map((l) => `${l}=${uv(q.st[l])}`),
    // El margen es cuánto sobra por encima del umbral en la derivación más
    // justa. Sirve para ordenar candidatos: entre dos registros que cumplen,
    // el de margen mayor muestra el hallazgo con más claridad.
    margen: Math.min(...leads.map((l) => q.st[l] - min)),
  }),
  stDepression: ({ leads, min }, q) => ({
    label: `ST descendido ≥ ${mmStr(min)} en ${leads.join(', ')}`,
    fallos: leads.filter((l) => q.st[l] > -min).map((l) => `${l}=${uv(q.st[l])}`),
    margen: Math.min(...leads.map((l) => -q.st[l] - min)),
  }),
  stFlat: ({ leads, max }, q) => ({
    label: `ST sin desnivel (< ${mmStr(max)}) en ${leads.join(', ')}`,
    fallos: leads.filter((l) => Math.abs(q.st[l]) > max).map((l) => `${l}=${uv(q.st[l])}`),
    margen: Math.min(...leads.map((l) => max - Math.abs(q.st[l]))),
  }),
  tInversion: ({ leads, min }, q) => ({
    label: `T invertida ≥ ${mmStr(min)} en ${leads.join(', ')}`,
    fallos: leads.filter((l) => q.t[l] > -min).map((l) => `${l}=${uv(q.t[l])}`),
    margen: Math.min(...leads.map((l) => -q.t[l] - min)),
  }),
  tUpright: ({ leads, min }, q) => ({
    label: `T positiva ≥ ${mmStr(min)} en ${leads.join(', ')}`,
    fallos: leads.filter((l) => q.t[l] < min).map((l) => `${l}=${uv(q.t[l])}`),
    margen: Math.min(...leads.map((l) => q.t[l] - min)),
  }),
  // R dominante: la onda R supera en altura a la profundidad de la S. En V1 es
  // anormal (hace pensar en infarto posterior o hipertrofia derecha); en V6 es
  // lo esperable.
  dominantR: (leads, q) => ({
    label: `R dominante en ${leads.join(', ')}`,
    fallos: leads.filter((l) => q.r[l] <= -q.s[l]).map((l) => `${l} R=${uv(q.r[l])} S=${uv(-q.s[l])}`),
    margen: Math.min(...leads.map((l) => q.r[l] + q.s[l])),
  }),
  rsPattern: (leads, q) => ({
    label: `patrón rS (S más profunda que R) en ${leads.join(', ')}`,
    fallos: leads.filter((l) => q.r[l] >= -q.s[l]).map((l) => `${l} R=${uv(q.r[l])} S=${uv(-q.s[l])}`),
    margen: Math.min(...leads.map((l) => -q.s[l] - q.r[l])),
  }),
  // Segunda onda R dentro del QRS: las "orejas de conejo". Es el hallazgo que
  // convierte una R alta en V1 en un bloqueo de rama derecha, y no en un infarto
  // posterior o una hipertrofia derecha, donde la R es alta pero única.
  secondR: ({ leads, min }, q) => ({
    label: `segunda onda R de al menos ${mmStr(min)} en ${leads.join(', ')}`,
    fallos: leads.filter((l) => q.rPrime[l] < min).map((l) => q.rPrime[l] ? `${l}=${uv(q.rPrime[l])}` : `${l}=sin segunda R`),
    margen: Math.min(...leads.map((l) => q.rPrime[l] - min)),
  }),

  // Altura mínima de la onda R. Sirve para exigir que la R INICIAL exista, que
  // es lo que separa un hemibloqueo de un infarto inferior antiguo: los dos dan
  // desviación izquierda del eje y complejos negativos en II, III y aVF, pero en
  // el hemibloqueo el complejo empieza con una r pequeña y en el infarto empieza
  // con una Q, sin nada positivo delante.
  rHeight: ({ leads, min }, q) => ({
    label: `onda R de al menos ${mmStr(min)} en ${leads.join(', ')}`,
    fallos: leads.filter((l) => q.r[l] < min).map((l) => `${l}=${uv(q.r[l])}`),
    margen: Math.min(...leads.map((l) => q.r[l] - min)),
  }),

  // Profundidad mínima de la onda S. En el bloqueo de rama derecha el
  // ventrículo derecho se despolariza tarde y su vector apunta a la derecha y
  // adelante: eso levanta la R' de V1 y, al mismo tiempo y por lo mismo, cava
  // una S ancha en las derivaciones que miran a la izquierda, I y V6. Las dos
  // caras del mismo retraso.
  sDepth: ({ leads, min }, q) => ({
    label: `onda S de al menos ${mmStr(min)} en ${leads.join(', ')}`,
    fallos: leads.filter((l) => -q.s[l] < min).map((l) => `${l}=${uv(-q.s[l])}`),
    margen: Math.min(...leads.map((l) => -q.s[l] - min)),
  }),

  // Amplitud del QRS de pico a pico: lo que sube la R más lo que baja la S, en
  // la misma derivación. Es la medida con la que está definido el bajo voltaje,
  // y no se parece a ninguna de las otras: acá no interesa si el complejo es
  // positivo o negativo, interesa cuánto MIDE de punta a punta.
  //
  // Los umbrales son los clásicos y no son arbitrarios: 5 mm en las seis
  // derivaciones de los miembros, 10 mm en las seis precordiales. Y la palabra
  // que importa es TODAS: alcanza con que una sola derivación de los miembros
  // pase los 5 mm para que no haya bajo voltaje. Por eso la regla exige el
  // máximo en cada una de las derivaciones de la lista, y el margen es el de la
  // derivación MÁS ALTA, que es la que decide.
  qrsAmplitude: ({ leads, max }, q) => ({
    label: `QRS de pico a pico ≤ ${mmStr(max)} en ${leads.join(', ')}`,
    fallos: leads.filter((l) => q.r[l] - q.s[l] > max).map((l) => `${l}=${uv(q.r[l] - q.s[l])}`),
    margen: Math.min(...leads.map((l) => max - (q.r[l] - q.s[l]))),
  }),

  rProgression: ([a, b], q) => ({
    label: `la onda R crece de ${a} a ${b}`,
    fallos: q.r[b] > q.r[a] ? [] : [`${a}=${uv(q.r[a])} ${b}=${uv(q.r[b])}`],
    margen: q.r[b] - q.r[a],
  }),
  // Lo contrario, y es un hallazgo por derecho propio: cuando la R deja de
  // crecer por las precordiales hay que pensar en infarto anterior antiguo.
  rRegression: ([a, b], q) => ({
    label: `la onda R NO progresa de ${a} a ${b}`,
    fallos: q.r[b] <= q.r[a] ? [] : [`${a}=${uv(q.r[a])} ${b}=${uv(q.r[b])}`],
    margen: q.r[a] - q.r[b],
  }),
  // Cuánto se hunde el segmento ST por debajo del punto J antes de volver a
  // subir: la panza de la "cubeta" del efecto digitálico.
  //
  // Advertencia sobre este hallazgo, porque el número invita a más de lo que
  // puede dar: mide una FORMA, no una causa. Sobre la base, los registros con
  // digital dan una mediana de 35 µV y los de isquemia lateral, 25. Es una
  // diferencia real pero chica, con mucha superposición. Sirve para elegir un
  // trazado donde la forma se vea clara y para describirla; NO sirve para
  // afirmar que un electro con cubeta es digital y no isquemia. Eso lo decide la
  // lista de medicamentos, no el electrocardiograma.
  stSag: ({ leads, min }, q) => ({
    label: `el ST se hunde ≥ ${mmStr(min)} bajo el punto J en ${leads.join(', ')}`,
    fallos: leads.filter((l) => q.sag[l] < min).map((l) => `${l}=${uv(q.sag[l])}`),
    margen: Math.min(...leads.map((l) => q.sag[l] - min)),
  }),

  // Índice de Sokolow-Lyon: la S más profunda de V1 más la R más alta de V5 o
  // V6. Es el criterio de voltaje clásico de hipertrofia ventricular izquierda,
  // y el umbral son 35 mm, o sea 3,5 mV.
  //
  // Suma DOS derivaciones opuestas a propósito. Un ventrículo izquierdo grande
  // despolariza más masa hacia la izquierda y atrás: eso agranda la R de las
  // laterales y, por el mismo vector visto de frente, agranda la S de V1. Sumar
  // las dos mide el vector entero en vez de una de sus dos caras, y por eso el
  // índice aguanta mejor las variaciones de posición del corazón que cualquier
  // derivación sola.
  sokolowLyon: ({ min }, q) => {
    const suma = -q.s.V1 + Math.max(q.r.V5, q.r.V6);
    return {
      label: `índice de Sokolow-Lyon ≥ ${mmStr(min)} (S de V1 + R de V5 o V6)`,
      fallos: suma >= min ? [] : [`${mmStr(suma)}`],
      margen: suma - min,
    };
  },

  // Relación entre el desnivel del ST y la profundidad de la S, en las
  // derivaciones donde el QRS es negativo. Es el criterio con que hoy se busca
  // un infarto ESCONDIDO detrás de un bloqueo de rama izquierda (Sgarbossa
  // modificado, Smith 2012).
  //
  // El razonamiento: un bloqueo de rama por sí solo eleva el ST de forma
  // PROPORCIONAL al tamaño del complejo — cuanto más profunda la S, más elevado
  // el ST, y la relación se mantiene alrededor de 0,15-0,20. Cuando esa
  // proporción se rompe y el ST sube por encima del 25% de la S, la elevación ya
  // no la explica el bloqueo y hay que pensar en oclusión.
  //
  // Por eso mirar sólo los milímetros no alcanza: 5 mm de elevación sobre una S
  // de 30 mm son esperables, y 3 mm sobre una S de 8 mm no lo son.
  stToSRatio: ({ leads, max }, q) => ({
    label: `el ST es menos del ${Math.round(max * 100)}% de la S en ${leads.join(', ')}`,
    fallos: leads.filter((l) => Math.abs(q.st[l]) > Math.abs(q.s[l]) * max)
                 .map((l) => `${l}=${(Math.abs(q.st[l]) / Math.abs(q.s[l]) * 100).toFixed(0)}%`),
    margen: Math.min(...leads.map((l) => max - Math.abs(q.st[l]) / Math.abs(q.s[l]))),
  }),

  // Eje eléctrico del QRS en el plano frontal, en grados. Normal entre −30° y
  // +90°; por debajo de −30° es desviación izquierda y por encima de +90°,
  // derecha.
  //
  // Validado contra la columna heart_axis de PTB-XL: los registros que la base
  // llama MID miden +54° de mediana, los LAD −34°, los ALAD −49° y los RAD
  // +101°. El orden sale bien y las medianas no se solapan.
  axisDeg: ([lo, hi], q) => ({
    label: `eje entre ${lo}° y ${hi}°`,
    fallos: q.axisDeg !== null && q.axisDeg >= lo && q.axisDeg <= hi
      ? [] : [q.axisDeg === null ? 'no medible' : `${q.axisDeg.toFixed(0)}°`],
    margen: q.axisDeg === null ? -1 : Math.min(q.axisDeg - lo, hi - q.axisDeg) / 90,
  }),

  // Ancho del QRS en milisegundos. Es EL hallazgo de los bloqueos de rama: por
  // encima de 120 ms el ventrículo ya no se despolarizó por el sistema de
  // conducción sino de músculo en músculo, que es más lento.
  qrsMs: ([lo, hi], q) => ({
    label: `QRS entre ${lo} y ${hi} ms`,
    fallos: q.qrsMs >= lo && q.qrsMs <= hi ? [] : [`${q.qrsMs.toFixed(0)} ms`],
    margen: Math.min(q.qrsMs - lo, hi - q.qrsMs) / 400,
  }),
  // QT corregido por frecuencia, en milisegundos. El umbral habitual de
  // prolongación son 450 ms en hombres y 460 en mujeres; por encima de 500 el
  // riesgo de torsades de pointes deja de ser teórico.
  qtcMs: ([lo, hi], q) => ({
    label: `QTc entre ${lo} y ${hi} ms`,
    fallos: q.qtcBazett !== null && q.qtcBazett >= lo && q.qtcBazett <= hi
      ? [] : [q.qtcBazett === null ? 'no medible' : `${q.qtcBazett.toFixed(0)} ms`],
    margen: q.qtcBazett === null ? -1 : Math.min(q.qtcBazett - lo, hi - q.qtcBazett) / 400,
  }),

  // Cuánto se parecen entre sí los QT medidos en cada derivación. No es un
  // hallazgo clínico: es una condición para que el hallazgo se pueda afirmar.
  //
  // El final de la onda T es lo más difícil de ubicar de un electro, y cuando
  // las derivaciones no coinciden, el QT del registro depende de cuál se mire.
  // Se encontró un candidato donde la mediana daba un QTc de 434 ms —normal— y
  // el máximo daba 502 —prolongado—: el diagnóstico cambiaba según la elección,
  // y un caso así no se puede enseñar por mucho que la etiqueta diga QT largo.
  qtSpreadMs: ({ max }, q) => {
    const medidos = Object.values(q.qt).filter((v) => v !== null);
    const rango = medidos.length ? Math.max(...medidos) - Math.min(...medidos) : Infinity;
    return {
      label: `las derivaciones coinciden en el QT dentro de ${max} ms`,
      fallos: medidos.length >= 6 && rango <= max ? []
        : [medidos.length < 6 ? `sólo ${medidos.length} derivaciones medibles` : `${rango.toFixed(0)} ms de diferencia`],
      margen: (max - rango) / 400,
    };
  },

  rate: ([lo, hi], q) => ({
    label: `frecuencia entre ${lo} y ${hi} lpm`,
    fallos: q.hr >= lo && q.hr <= hi ? [] : [`${q.hr.toFixed(0)} lpm`],
    margen: Math.min(q.hr - lo, hi - q.hr) / 60,
  }),
  irregular: (quiere, q) => {
    const esIrregular = q.rrCv > RR_IRREGULAR;
    return {
      label: `el ritmo es ${quiere ? 'irregular' : 'regular'}`,
      fallos: esIrregular === quiere ? [] : [`variación del RR ${q.rrCv.toFixed(3)}`],
      margen: quiere ? q.rrCv - RR_IRREGULAR : RR_IRREGULAR - q.rrCv,
    };
  },
};

/**
 * Evalúa un `findings` contra una medición.
 *
 * @param {object} q          lo que devuelve measure()
 * @param {object} findings   el objeto declarado en cases.js
 * @returns {{ok:boolean, label:string, detalle:string, margen:number}[]}
 *   Una entrada por regla declarada, en el orden en que se escribieron.
 */
export function checkFindings(q, findings) {
  const out = [];
  for (const [clave, valor] of Object.entries(findings || {})) {
    const regla = REGLAS[clave];
    if (!regla) {
      out.push({ ok: false, label: `hallazgo desconocido: ${clave}`, detalle: '', margen: -Infinity });
      continue;
    }
    if (valor === undefined) continue;
    const { label, fallos, margen } = regla(valor, q);
    out.push({
      ok: fallos.length === 0,
      label,
      detalle: fallos.length ? `falla en ${fallos.join(' ')}` : '',
      margen,
    });
  }
  return out;
}

/** true si la medición satisface todas las reglas declaradas. */
export const satisfies = (q, findings) => checkFindings(q, findings).every((r) => r.ok);

/**
 * Cuán holgadamente las satisface: el margen de la regla más ajustada. Negativo
 * si alguna no se cumple. Es el criterio para ordenar candidatos — entre dos
 * electros que muestran el hallazgo, enseña mejor el que lo muestra más claro.
 */
export const margin = (q, findings) => {
  const rs = checkFindings(q, findings);
  return rs.length ? Math.min(...rs.map((r) => r.margen)) : 0;
};
