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

// Y el techo de DISPERSIÓN recortada por debajo del cual se puede afirmar que un
// ritmo es regular. Ver la regla `irregular`, más abajo, para por qué hacen
// falta las dos cifras.
export const RR_DISPERSO = 0.22;

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

  // Que NO haya una onda P delante del QRS. Es un hallazgo negativo y hay que
  // leerlo con el cuidado que merece un negativo.
  //
  // Lo que afirma exactamente: la medición del PR, que exige una deflexión de
  // al menos 0,3 mm seguida de un segmento isoeléctrico antes del QRS, no
  // encontró nada en ninguna de sus cinco derivaciones, sobre el latido
  // promedio. No afirma que la aurícula esté quieta —puede estar despolarizando
  // al mismo tiempo que el ventrículo, o hacia atrás, y quedar tapada.
  //
  // Calibración, que es lo que fija cuánto pesa: sobre 70 registros NORMALES la
  // medición del PR devuelve null en 7, o sea el 10 %, y 5 de esos 7 tienen buen
  // trazado. Un electro normal de cada diez la satisface. Sirve como UNA de
  // varias condiciones sobre un trazado ya mirado, y no alcanza sola para
  // afirmar que el impulso no nació en la aurícula.
  noPWave: (_, q) => ({
    label: 'ninguna onda P precede al QRS',
    fallos: q.prMs === null ? [] : [`PR de ${Math.round(q.prMs)} ms en ${q.pLead}`],
    margen: q.prMs === null ? 1 : -1,
  }),

  // ── DISOCIACIÓN AURICULOVENTRICULAR ──────────────────────────────────────
  // Que la aurícula y el ventrículo vayan cada uno a su ritmo. La medición está
  // en measure.js y devuelve null cuando no puede afirmarlo, que es casi
  // siempre: dispara en 1 de cada 11 bloqueos completos. A cambio no disparó en
  // ninguno de 70 normales, 50 bloqueos de primer grado ni 12 fibrilaciones.
  //
  // Esta regla sirve para CUSTODIAR un caso cuyo trazado ya se miró. Como
  // criterio de búsqueda no sirve, y como prueba clínica menos: que no dispare
  // no dice nada sobre el paciente.
  //
  // `min` es cuántas veces más rápida tiene que ir la aurícula. En un bloqueo
  // completo el escape ventricular es lento y la razón se va a 2 o más; pedir
  // apenas 1,15 dejaría pasar casos donde las dos frecuencias casi coinciden y
  // ahí el método pierde pie.
  avDissociation: ({ min }, q) => {
    const d = q.disociacion;
    return {
      label: `la aurícula va al menos ${min} veces más rápido que el ventrículo, con su propio ritmo`,
      fallos: !d ? ['no se pudo medir un ritmo auricular independiente']
            : d.razon < min ? [`razón ${d.razon.toFixed(2)}×`] : [],
      margen: d ? d.razon - min : -1,
    };
  },

  // ── LA ONDA J ────────────────────────────────────────────────────────────
  // Dos reglas separadas para las dos mitades del hallazgo, porque son
  // preguntas distintas y conviene que fallen por separado:
  //
  //   · jPoint  — CUÁNTO sube el punto J sobre la línea de base.
  //   · jNotch  — si esa subida tiene FORMA de onda J: una joroba que sube y
  //     vuelve a bajar antes del segmento ST.
  //
  // Es la segunda la que hace el diagnóstico. Un punto J elevado lo tiene
  // también un infarto agudo, y ahí el ST sale del J hacia arriba y se queda
  // arriba; en la repolarización precoz el trazado hace la joroba y desciende.
  // Pedir sólo la altura sería enseñar a confundirlos.
  //
  // El consenso de 2015 pone el umbral en 1 mm sobre dos derivaciones contiguas
  // inferiores o laterales. Contra los grupos etiquetados de PTB-XL y del CinC
  // 2021: exigir además 2 mm y una muesca de 1 mm deja 4 de 25 registros
  // etiquetados como repolarización precoz y NINGUNO de 32 normales.
  jPoint: ({ leads, min }, q) => ({
    label: `punto J elevado al menos ${mmStr(min)} en ${leads.join(', ')}`,
    fallos: leads.filter((l) => q.jAmp[l] < min).map((l) => `${l}=${uv(q.jAmp[l])}`),
    margen: Math.min(...leads.map((l) => q.jAmp[l] - min)),
  }),

  jNotch: ({ leads, min }, q) => ({
    label: `muesca de al menos ${mmStr(min)} en el punto J de ${leads.join(', ')}`,
    fallos: leads.filter((l) => q.jNotch[l] < min)
                 .map((l) => (q.jNotch[l] ? `${l}=${uv(q.jNotch[l])}` : `${l}=sin muesca`)),
    margen: Math.min(...leads.map((l) => q.jNotch[l] - min)),
  }),

  // ── LA ONDA U ────────────────────────────────────────────────────────────
  // Otra vez dos reglas, y otra vez porque son dos preguntas. Cuánto mide la
  // onda U, y cuánto mide COMPARADA con la T.
  //
  // La segunda es la que importa. Una U de 2 mm al lado de una T de 10 mm es
  // normal; la misma U de 2 mm al lado de una T de 1,3 mm es el electro de una
  // hipopotasemia. Lo que cambia con el potasio no es sólo que la U crece: es
  // que la T se aplana al mismo tiempo, y la razón entre las dos recoge las dos
  // mitades del cambio en un solo número.
  //
  // Calibrado contra los grupos etiquetados: pedir U ≥ 1,5 mm Y U/T ≥ 1 deja 3
  // de 17 registros etiquetados con onda U anormal en el CinC 2021, y 0 de 32
  // normales de PTB-XL. La mediana de la U en los normales es 0,00 mm: en un
  // electro normal esta medición directamente no encuentra una segunda onda.
  uWave: ({ leads, min }, q) => ({
    label: `onda U de al menos ${mmStr(min)} en ${leads.join(', ')}`,
    fallos: leads.filter((l) => (q.uAmp[l] ?? 0) < min)
                 .map((l) => (q.uAmp[l] === null ? `${l}=sin onda U separable` : `${l}=${uv(q.uAmp[l])}`)),
    margen: Math.min(...leads.map((l) => (q.uAmp[l] ?? 0) - min)),
  }),

  uToT: ({ leads, min }, q) => ({
    label: `onda U de al menos ${min} veces la T en ${leads.join(', ')}`,
    fallos: leads.filter((l) => (q.uOverT[l] ?? 0) < min)
                 .map((l) => (q.uOverT[l] === null ? `${l}=sin onda U separable` : `${l}=${q.uOverT[l].toFixed(2)}×`)),
    margen: Math.min(...leads.map((l) => (q.uOverT[l] ?? 0) - min)),
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

  // El reverso de rHeight: exigir que la R sea CHICA o no esté. Es el patrón
  // QS —el complejo que baja sin nada positivo delante— y lo que queda cuando
  // el músculo de esa pared murió: no hay quién genere el vector inicial.
  //
  // Se pide un techo, no cero, a propósito. Una R de 200 µV en V2 no es una R
  // normal: la mediana de V2 en los registros normales es 476 µV y la de V3,
  // 825. "R perdida" es un hallazgo cuantitativo, no una ausencia absoluta.
  rLoss: ({ leads, max }, q) => ({
    label: `onda R reducida o ausente (≤ ${mmStr(max)}) en ${leads.join(', ')}`,
    fallos: leads.filter((l) => q.r[l] > max).map((l) => `${l}=${uv(q.r[l])}`),
    margen: Math.min(...leads.map((l) => max - q.r[l])),
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
  // Acepta un grupo o una lista de grupos, porque el criterio generalizado son
  // dos umbrales distintos a la vez —5 mm en los miembros, 10 en las
  // precordiales— y las claves de un objeto no se pueden repetir.
  qrsAmplitude: (valor, q) => {
    const grupos = Array.isArray(valor) ? valor : [valor];
    const pp = (l) => q.r[l] - q.s[l];
    return {
      label: grupos.map((g) => `QRS de pico a pico ≤ ${mmStr(g.max)} en ${g.leads.join(', ')}`).join(' · '),
      fallos: grupos.flatMap((g) => g.leads.filter((l) => pp(l) > g.max).map((l) => `${l}=${uv(pp(l))}`)),
      margen: Math.min(...grupos.flatMap((g) => g.leads.map((l) => g.max - pp(l)))),
    };
  },

  // Intervalo PR, en milisegundos. Por encima de 200 hay bloqueo AV de primer
  // grado. Devuelve null cuando la P no se puede medir, y entonces la regla
  // falla: mejor que un caso no encuentre registro a que se afirme un PR que
  // nadie midió.
  //
  // ADVERTENCIA para quien use esta regla en un caso nuevo: en fibrilación
  // auricular la medición no sirve. Sobre 70 registros de FA no devolvió nada
  // en 51 —que es lo correcto, ahí no hay P— pero en los otros 19 encontró algo
  // y le puso número. Un caso que hable del PR tiene que pedir además
  // `irregular: false`.
  prMs: ([lo, hi], q) => ({
    label: `PR entre ${lo} y ${hi} ms`,
    fallos: q.prMs !== null && q.prMs >= lo && q.prMs <= hi
      ? [] : [q.prMs === null ? 'no medible' : `${Math.round(q.prMs)} ms`],
    margen: q.prMs === null ? -1 : Math.min(q.prMs - lo, hi - q.prMs) / 100,
  }),

  // Altura de la onda P. Por encima de 2,5 mm en II es sobrecarga de la
  // aurícula derecha —la P «pulmonale»—, y el umbral está comprobado sobre la
  // base: los registros normales dan 1,0 mm de mediana y NINGUNO de 25 llega a
  // 2,5, mientras que los etiquetados con crecimiento derecho dan 2,4.
  pHeight: ({ min, lead }, q) => ({
    label: `onda P de al menos ${mmStr(min)}${lead ? ` en ${lead}` : ''}`,
    fallos: q.pAmp !== null && q.pAmp >= min && (!lead || q.pLead === lead)
      ? [] : [q.pAmp === null ? 'no medible' : `${uv(q.pAmp)} en ${q.pLead}`],
    margen: q.pAmp === null ? -1 : q.pAmp - min,
  }),

  // Latidos prematuros de forma distinta: extrasístoles ventriculares.
  // Se pide un rango y no un mínimo, porque "cuántas hay" es parte del
  // hallazgo: una es un hallazgo banal, y muchas cambian la conducta.
  prematureBeats: ([lo, hi], q) => ({
    label: `entre ${lo} y ${hi} latidos prematuros de forma distinta`,
    fallos: q.prematuros >= lo && q.prematuros <= hi ? [] : [`hay ${q.prematuros}`],
    margen: Math.min(q.prematuros - lo, hi - q.prematuros),
  }),

  // Cuánto se estira el PR dentro del registro, latido a latido. Es el hallazgo
  // definitorio del Wenckebach, y el único que no se puede promediar: promediar
  // los PR de un Wenckebach borra exactamente lo que hay que ver.
  //
  // Calibrado contra los grupos etiquetados, con el estadístico recortado a los
  // percentiles 10-90: en ritmo sinusal normal da 20 ms de mediana —que es el
  // ruido de medir latido a latido, porque ahí el PR es constante— y los tres
  // Wenckebach del CinC 2021 dan 164, 180 y 228 ms.
  //
  // Sólo hay número cuando DOS derivaciones independientes dan la misma serie
  // dentro de 25 ms. Si no coinciden, es ruido y measure.js devuelve null.
  prLengthening: ({ min }, q) => ({
    label: `el PR se estira al menos ${min} ms de latido a latido`,
    fallos: q.prSalto !== null && q.prSalto >= min
      ? [] : [q.prSalto === null ? 'sin serie de PR fiable' : `${Math.round(q.prSalto)} ms`],
    margen: q.prSalto === null ? -1 : (q.prSalto - min) / 100,
  }),

  // La PAUSA, medida como cuántas veces el RR más corto entra en el más largo.
  // Es el número que separa las tres causas de un latido que falta, y no
  // necesita ver una sola onda P:
  //
  //   · por debajo de 2 → hubo decremento antes de la pausa. El PR se fue
  //     alargando latido a latido hasta que una P no condujo: Wenckebach.
  //   · alrededor de 2 → una P llegó demasiado pronto y encontró el nodo AV
  //     todavía refractario. La pausa dura casi exactamente dos ciclos porque
  //     el nodo sinusal ni se enteró.
  //   · por encima de 2 y sin relación con el ciclo → el nodo sinusal dejó de
  //     disparar, y la pausa dura lo que se le antojó.
  //
  // Comprobado contra las etiquetas escritas a mano en PTB-XL: los dos
  // Wenckebach confirmados dan 1,66 y 1,82, y los dos imitadores que la propia
  // base nombra —extrasístole auricular bloqueada y falla del nodo sinusal—
  // dan 2,21 y 2,08. Está en scripts/ejemplos/mobitz.mjs.
  pauseRatio: ([lo, hi], q) => {
    const rr = q.rr || [];
    if (rr.length < 4) {
      return { label: `pausa de ${lo} a ${hi} veces el RR más corto`, fallos: ['latidos insuficientes'], margen: -1 };
    }
    const largo = Math.max(...rr), corto = Math.min(...rr);
    const razon = largo / corto;
    return {
      label: `pausa de ${lo} a ${hi} veces el RR más corto`,
      fallos: razon >= lo && razon <= hi ? [] : [`razón=${razon.toFixed(2)}`],
      margen: Math.min(razon - lo, hi - razon),
    };
  },

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
  // Regular o irregular, y son dos preguntas distintas según hacia dónde se
  // pida, así que se miden con dos cifras distintas.
  //
  // Para decir IRREGULAR alcanza con el coeficiente de variación: es lo que
  // separa la fibrilación auricular del ritmo sinusal y está calibrado para eso.
  //
  // Para decir REGULAR hace falta además la dispersión recortada, y la razón
  // está en measure.js: el coeficiente usa la mediana de las desviaciones y es
  // ciego cuando la MINORÍA de los latidos se desvía. Un trazado con tres RR de
  // 1930 ms y dos de 1500 daba un coeficiente de 0,004 —perfectamente regular
  // según el número— y no lo es. Afirmar regularidad con esa sola cifra era
  // prometer más de lo que se estaba midiendo, y esta regla se usa como guarda
  // en 30 de los casos.
  //
  // El umbral de 0,22 sale de los propios casos y del registro que destapó el
  // problema. Los 30 casos que afirman ritmo regular van de 0,005 a 0,168 de
  // dispersión, así que el más justo tiene un 31 % de margen. JS22357 —tres RR
  // de 1930 ms y dos de 1500— da 0,247 y ahora falla, que es lo correcto. En 70
  // registros NORMALES el percentil 90 de la dispersión da 0,180 y el 99 da
  // 0,279: a 0,22 alrededor de un 6 % de los normales no puede afirmar
  // regularidad, y eso es el lado seguro del error — la regla se vuelve más
  // difícil de cumplir, no más fácil de cumplir mal. Los que tienen pausa de
  // verdad dan 0,80 y 1,02.
  irregular: (quiere, q) => {
    const esIrregular = q.rrCv > RR_IRREGULAR;
    const disperso = q.rrSpread > RR_DISPERSO;
    const ok = quiere ? esIrregular : (!esIrregular && !disperso);
    return {
      label: `el ritmo es ${quiere ? 'irregular' : 'regular'}`,
      fallos: ok ? [] : [disperso && !quiere
        ? `dispersión del RR ${q.rrSpread.toFixed(3)}`
        : `variación del RR ${q.rrCv.toFixed(3)}`],
      margen: quiere ? q.rrCv - RR_IRREGULAR
                     : Math.min(RR_IRREGULAR - q.rrCv, (RR_DISPERSO - q.rrSpread) / 3),
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
