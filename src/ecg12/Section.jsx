import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Check, X, AlertTriangle, Activity, Stethoscope, Maximize2, Ruler } from 'lucide-react';
import TwelveLead from './TwelveLead.jsx';
import { sheetSize, suggestGain, MM_PER_MV } from './draw.js';
import { loadRecord, prefetchRecord } from './load.js';
import { measure } from './measure.js';
import { SOURCE } from './records.js';
import { CASES, shuffledOptions } from './cases.js';

const L = {
  title: { es: '12 derivaciones', en: '12-lead', pt: '12 derivações' },
  caseOf: { es: (a, b) => `Caso ${a} de ${b}`, en: (a, b) => `Case ${a} of ${b}`, pt: (a, b) => `Caso ${a} de ${b}` },
  years: { es: 'años', en: 'years old', pt: 'anos' },
  male: { es: 'Hombre', en: 'Man', pt: 'Homem' },
  female: { es: 'Mujer', en: 'Woman', pt: 'Mulher' },
  hr: { es: 'FC', en: 'HR', pt: 'FC' },
  bp: { es: 'PA', en: 'BP', pt: 'PA' },
  spo2: { es: 'SatO₂', en: 'SpO₂', pt: 'SatO₂' },
  rr: { es: 'FR', en: 'RR', pt: 'FR' },
  question: { es: '¿Qué muestra este electrocardiograma?', en: 'What does this electrocardiogram show?', pt: 'O que mostra este eletrocardiograma?' },
  correct: { es: 'Correcto', en: 'Correct', pt: 'Correto' },
  incorrect: { es: 'Incorrecto', en: 'Incorrect', pt: 'Incorreto' },
  wasAnswer: { es: 'La respuesta era', en: 'The answer was', pt: 'A resposta era' },
  why: { es: 'Por qué', en: 'Why', pt: 'Por quê' },
  pitfall: { es: 'El error frecuente', en: 'The common trap', pt: 'O erro frequente' },
  action: { es: 'Conducta', en: 'Management', pt: 'Conduta' },
  next: { es: 'Siguiente caso →', en: 'Next case →', pt: 'Próximo caso →' },
  restart: { es: 'Empezar de nuevo', en: 'Start over', pt: 'Começar de novo' },
  paper: { es: 'Papel', en: 'Paper', pt: 'Papel' },
  dark: { es: 'Oscuro', en: 'Dark', pt: 'Escuro' },
  tapLead: { es: 'Tocá una derivación para ampliarla', en: 'Tap a lead to enlarge it', pt: 'Toque numa derivação para ampliá-la' },
  swipe: { es: '← Deslizá para ver las precordiales (V1 a V6)', en: '← Swipe to see the precordial leads (V1 to V6)', pt: '← Deslize para ver as precordiais (V1 a V6)' },
  close: { es: 'Cerrar', en: 'Close', pt: 'Fechar' },
  // El número sale de CASES y no está escrito en el texto: la primera vez que se
  // agregó un caso, la pantalla final seguía felicitando por "los ocho".
  done: { es: (n) => `Terminaste los ${n}`, en: (n) => `You finished all ${n}`, pt: (n) => `Você terminou os ${n}` },
  doneSub: {
    es: (n) => `Los ${n} trazados son electrocardiogramas reales de PTB-XL, registrados a pacientes y anotados por cardiólogos. Entrenan la localización, que es lo que una sola derivación no puede enseñar.`,
    en: (n) => `All ${n} tracings are real electrocardiograms from PTB-XL, recorded from patients and annotated by cardiologists. They train localization, which a single lead cannot teach.`,
    pt: (n) => `Os ${n} traçados são eletrocardiogramas reais do PTB-XL, registrados em pacientes e anotados por cardiologistas. Treinam a localização, que uma única derivação não pode ensinar.`,
  },
  loading: { es: 'Cargando el trazado…', en: 'Loading the tracing…', pt: 'Carregando o traçado…' },
  loadError: {
    es: 'No se pudo cargar el trazado. Revisá la conexión y volvé a intentar.',
    en: 'The tracing could not be loaded. Check your connection and try again.',
    pt: 'Não foi possível carregar o traçado. Verifique a conexão e tente novamente.',
  },
  retry: { es: 'Reintentar', en: 'Retry', pt: 'Tentar de novo' },
  measured: { es: 'Medido sobre este trazado', en: 'Measured on this tracing', pt: 'Medido neste traçado' },
  measuredNote: {
    es: 'Desnivel del ST en J+60 ms respecto del segmento PR, promediado entre latidos.',
    en: 'ST deviation at J+60 ms relative to the PR segment, averaged across beats.',
    pt: 'Desnivelamento do ST em J+60 ms em relação ao segmento PR, média entre batimentos.',
  },
  halfGainNote: {
    es: (grupo) => `Los milímetros son a ganancia estándar, que es como se informa un desnivel. ${grupo} está dibujado a 5 mm/mV porque los complejos no entraban: ahí, lo que contás en la pantalla es la mitad de estos valores.`,
    en: (grupo) => `The millimetres are at standard gain, which is how a deviation is reported. ${grupo} is drawn at 5 mm/mV because the complexes did not fit: there, what you count on screen is half of these values.`,
    pt: (grupo) => `Os milímetros são em ganho padrão, que é como se informa um desnivelamento. ${grupo} está desenhado a 5 mm/mV porque os complexos não cabiam: ali, o que você conta na tela é a metade destes valores.`,
  },
  groupChest: { es: 'El grupo V1-V6', en: 'The V1-V6 group', pt: 'O grupo V1-V6' },
  groupLimb: { es: 'El grupo de los miembros', en: 'The limb lead group', pt: 'O grupo dos membros' },
  groupBoth: { es: 'Todo el trazado', en: 'The whole tracing', pt: 'Todo o traçado' },
  irregular: { es: '(irregular)', en: '(irregular)', pt: '(irregular)' },
  bpm: { es: 'lpm', en: 'bpm', pt: 'bpm' },
  rrVar: { es: 'variación RR', en: 'RR variation', pt: 'variação RR' },
  regularRhythm: { es: 'ritmo regular', en: 'regular rhythm', pt: 'ritmo regular' },
  irregularRhythm: { es: 'irregularmente irregular', en: 'irregularly irregular', pt: 'irregularmente irregular' },
  axisLabel: { es: 'eje', en: 'axis', pt: 'eixo' },
  axisNote: {
    es: 'El eje sale del área neta del QRS en las seis derivaciones de los miembros, resuelto con la geometría del plano frontal. Normal entre −30° y +90°: por debajo es desviación izquierda, por encima, derecha. Las flechas dicen si el complejo es neto positivo o negativo en cada derivación, que es como se lee el eje a ojo.',
    en: 'The axis comes from the net QRS area in the six limb leads, solved with the geometry of the frontal plane. Normal between −30° and +90°: below that is left deviation, above it, right. The arrows say whether the complex is net positive or negative in each lead, which is how the axis is read by eye.',
    pt: 'O eixo sai da área líquida do QRS nas seis derivações dos membros, resolvido com a geometria do plano frontal. Normal entre −30° e +90°: abaixo é desvio esquerdo, acima, direito. As setas dizem se o complexo é líquido positivo ou negativo em cada derivação, que é como se lê o eixo a olho.',
  },
  qrsWidth: { es: 'QRS', en: 'QRS', pt: 'QRS' },
  secondRLabel: { es: '2ª R', en: '2nd R', pt: '2ª R' },
  sLabel: { es: 'S', en: 'S', pt: 'S' },
  qrsNote: {
    es: 'Ancho del QRS sobre un latido promedio. La segunda R es un segundo pico positivo dentro del mismo complejo: en un QRS normal no existe, y su altura es la del ventrículo que se despolarizó tarde y solo.',
    en: 'QRS width on an averaged beat. The second R is a second positive peak inside the same complex: a normal QRS has none, and its height is that of the ventricle that depolarized late and alone.',
    pt: 'Largura do QRS sobre um batimento médio. A segunda R é um segundo pico positivo dentro do mesmo complexo: num QRS normal não existe, e sua altura é a do ventrículo que se despolarizou tarde e sozinho.',
  },
  // Cuando el eje y la segunda R aparecen juntos hay que decir por qué: son dos
  // bloqueos distintos sobre el mismo trazado, no un hallazgo con dos números.
  axisSecondRNote: {
    es: 'La segunda R de V1 y la desviación del eje son dos bloqueos distintos leídos sobre el mismo latido: el QRS ancho con segunda R es la rama derecha, el eje más allá de −45° con rS en la cara inferior es el fascículo anterior izquierdo.',
    en: 'The second R in V1 and the axis deviation are two separate blocks read on the same beat: the wide QRS with a second R is the right bundle, the axis beyond −45° with rS inferiorly is the left anterior fascicle.',
    pt: 'A segunda R de V1 e o desvio do eixo são dois bloqueios distintos lidos sobre o mesmo batimento: o QRS largo com segunda R é o ramo direito, o eixo além de −45° com rS na face inferior é o fascículo anterior esquerdo.',
  },
  // El bajo voltaje se define sobre la amplitud de PICO A PICO del QRS, que no
  // es ninguna de las otras medidas: no importa si el complejo es positivo o
  // negativo, importa cuánto mide de punta a punta.
  voltageNote: {
    es: 'Amplitud del QRS de pico a pico —lo que sube la R más lo que baja la S— en cada derivación. Hay bajo voltaje cuando NINGUNA de las seis derivaciones de los miembros llega a 5 mm; el criterio generalizado pide además que ninguna precordial llegue a 10 mm. Alcanza con que una sola derivación pase el umbral para que no se cumpla.',
    en: 'Peak-to-peak QRS amplitude — how far the R goes up plus how far the S goes down — in each lead. There is low voltage when NONE of the six limb leads reaches 5 mm; the generalized criterion also requires that no chest lead reaches 10 mm. A single lead above the threshold is enough for the criterion to fail.',
    pt: 'Amplitude do QRS de pico a pico — o que a R sobe mais o que a S desce — em cada derivação. Há baixa voltagem quando NENHUMA das seis derivações dos membros chega a 5 mm; o critério generalizado exige ainda que nenhuma precordial chegue a 10 mm. Basta uma derivação acima do limiar para o critério não se cumprir.',
  },
  limbGroup: { es: 'miembros', en: 'limb', pt: 'membros' },
  chestGroup: { es: 'precordiales', en: 'chest', pt: 'precordiais' },
  sagLabel: { es: 'cubeta', en: 'sag', pt: 'cubeta' },
  sagNote: {
    es: 'La cubeta es cuánto se hunde el ST por debajo del punto J antes de volver a subir. Un ST plano o que baja derecho da cero; sólo la forma cóncava lo levanta.',
    en: 'The sag is how far the ST dips below the J point before rising again. A flat or straight-sloping ST gives zero; only the concave shape raises it.',
    pt: 'A cubeta é o quanto o ST afunda abaixo do ponto J antes de voltar a subir. Um ST plano ou que desce reto dá zero; só a forma côncava o eleva.',
  },
  qtMs: { es: 'QT', en: 'QT', pt: 'QT' },
  qtcB: { es: 'QTc Bazett', en: 'QTc Bazett', pt: 'QTc Bazett' },
  qtcF: { es: 'QTc Fridericia', en: 'QTc Fridericia', pt: 'QTc Fridericia' },
  qtLeads: { es: (n) => `${n} derivaciones`, en: (n) => `${n} leads`, pt: (n) => `${n} derivações` },
  qtNote: {
    es: 'Del inicio del QRS al final de la T, por el método de la tangente, sobre un latido promedio. Se informa el QT más largo entre las derivaciones donde la T se puede medir. Prolongado por encima de 450 ms en hombres y 460 en mujeres.',
    en: 'From QRS onset to the end of the T, by the tangent method, on an averaged beat. The longest QT among the leads where the T can be measured is reported. Prolonged above 450 ms in men and 460 in women.',
    pt: 'Do início do QRS ao fim da T, pelo método da tangente, sobre um batimento médio. Informa-se o QT mais longo entre as derivações onde a T pode ser medida. Prolongado acima de 450 ms em homens e 460 em mulheres.',
  },
  rhythmNote: {
    es: 'La variación del RR es la diferencia típica entre latidos, relativa al RR. Por debajo de 0,08 el ritmo es regular.',
    en: 'RR variation is the typical beat-to-beat difference, relative to the RR interval. Below 0.08 the rhythm is regular.',
    pt: 'A variação do RR é a diferença típica entre batimentos, relativa ao RR. Abaixo de 0,08 o ritmo é regular.',
  },
  scenario: {
    es: 'El trazado es real. El relato clínico es un escenario armado alrededor de él para practicar la decisión.',
    en: 'The tracing is real. The clinical vignette is a scenario built around it to practise the decision.',
    pt: 'O traçado é real. O relato clínico é um cenário construído em torno dele para praticar a decisão.',
  },
  score: { es: 'Aciertos', en: 'Correct', pt: 'Acertos' },
};

// El hueco que ocupa el electro mientras se carga tiene que medir exactamente lo
// mismo que el electro: si creciera al llegar los datos, la página saltaría justo
// cuando el usuario está leyendo el caso.
const SHEET = sheetSize({});

// El separador decimal cambia con el idioma: en español y en portugués es la
// coma. Mostrar "3.9 mm" en español se lee como otra cosa.
const num = (v, d, lang) => v.toFixed(d).replace('.', lang === 'en' ? '.' : ',');

// Formatea un desnivel del ST como lo diría un médico: en milímetros de papel,
// con el signo adelante. 0,18 mV son 1,8 mm, o sea casi dos cuadraditos. Cuando
// redondea a cero se omite el signo: escribir "+0,0 mm" sugiere una dirección
// que la medición no tiene.
// Para amplitudes —la altura de una onda, la profundidad de otra— el signo no
// aporta: una onda S mide 2,6 mm de profundidad, no "+2,6". El signo se reserva
// para los desniveles del ST, donde la dirección ES el hallazgo.
const mmAbs = (mv, lang) => `${num(Math.abs(mv * 10), 1, lang)} mm`;

const mm = (mv, lang) => {
  const abs = Math.abs(mv * 10);
  if (abs < 0.05) return `${num(0, 1, lang)} mm`;
  return `${mv >= 0 ? '+' : '−'}${num(abs, 1, lang)} mm`;
};

// El electro es ancho por naturaleza: 250 mm de papel. En un celular eso obliga a
// elegir entre achicarlo hasta que no se lea o dejar scroll horizontal. Se elige
// el scroll, que es lo que hace cualquiera con un electro impreso, y además se
// permite tocar una derivación para verla sola y en grande.
function EcgSheet({ signal, theme, highlight, lang, onLeadClick, gain }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
      <div className="relative">
        <div className="overflow-x-auto">
          <div className="min-w-[680px]">
            <TwelveLead signal={signal} theme={theme} highlight={highlight} onLeadClick={onLeadClick} gain={gain} />
          </div>
        </div>
        {/* Degradado en el borde derecho: en mobile el electro no entra entero y sin
            esta señal el usuario no sabe que puede desplazarlo. Desaparece a partir
            de sm:, donde ya entra completo. */}
        <div className="sm:hidden pointer-events-none absolute inset-y-0 right-0 w-7 bg-gradient-to-l from-slate-950/55 to-transparent" />
      </div>
      {/* De dónde salió este electro. No es un pie de página decorativo: la
          licencia de PTB-XL pide atribución, y además el estudiante tiene
          derecho a saber que está mirando el registro de un paciente real y a
          poder ir a buscarlo. */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-slate-800/80">
        <a href={`${SOURCE.url}#files`} target="_blank" rel="noopener noreferrer"
           className="text-[10px] text-slate-500 hover:text-indigo-300 font-mono uppercase tracking-wider truncate transition-colors">
          {SOURCE.dataset} · {lang === 'es' ? 'registro' : lang === 'pt' ? 'registro' : 'record'} {signal.id}
        </a>
        <span className="flex items-center gap-1 text-[10px] text-slate-500 flex-shrink-0">
          <Maximize2 className="w-3 h-3" /><span className="hidden xs:inline sm:inline">{L.tapLead[lang]}</span>
        </span>
      </div>
      <p className="sm:hidden px-3 pb-2 text-[10px] text-slate-500">{L.swipe[lang]}</p>
    </div>
  );
}

// Las mediciones del trazado. Se muestran DESPUÉS de responder, y sólo lo que en
// ese caso significa algo. El sentido es cerrar la discusión: "el ST está
// elevado" es una opinión, "+3,9 mm en III" no.
//
// Qué se mide depende del caso, y eso no es un capricho de presentación. En un
// aleteo auricular las ondas F caen encima del segmento ST y no queda línea de
// base donde apoyar la medición: cualquier número de ST que se muestre ahí es
// falso. En esos casos se miden la frecuencia y la regularidad, que sí se pueden
// medir, y el número que no corresponde no se muestra.
function Measured({ q, metrics, lang, gain }) {
  if (!q || !metrics) return null;

  const chip = (key, label, value, tone) => (
    <span key={key} className={`px-2 py-1 rounded-lg border font-mono text-[11px] ${tone}`}>
      <span className="opacity-60">{label}</span> {value}
    </span>
  );

  let chips = [];
  let note = '';

  if (metrics.kind === 'axis') {
    if (q.axisDeg === null) return null;
    const desviado = q.axisDeg < -30 || q.axisDeg > 90;
    chips = [
      chip('ax', L.axisLabel[lang], `${Math.round(q.axisDeg)}°`,
           desviado ? 'text-amber-300 border-amber-900/60 bg-amber-950/30'
                    : 'text-slate-400 border-slate-800 bg-slate-950/60'),
      chip('w', L.qrsWidth[lang], `${Math.round(q.qrsMs)} ms`,
           q.qrsMs >= 120 ? 'text-amber-300 border-amber-900/60 bg-amber-950/30'
                          : 'text-slate-400 border-slate-800 bg-slate-950/60'),
      // Así se lee el eje a ojo: qué derivaciones dan un complejo neto positivo
      // y cuáles negativo. La flecha dice más que el área en milivoltios por
      // segundo, que no significa nada para quien mira el electro.
      ...(metrics.leads ?? []).map((l) => chip(`a-${l}`, l, q.areaQRS[l] >= 0 ? '↑' : '↓',
           q.areaQRS[l] >= 0 ? 'text-violet-300 border-violet-900/60 bg-violet-950/30'
                             : 'text-sky-300 border-sky-900/60 bg-sky-950/30')),
      // Un bloqueo bifascicular se lee en el eje Y en la segunda R: son los dos
      // fascículos caídos, y el panel tiene que mostrar los dos a la vez.
      ...(metrics.secondR ?? []).map((l) => chip(`r2-${l}`, `${L.secondRLabel[lang]} ${l}`, mmAbs(q.rPrime[l], lang),
           q.rPrime[l] > 0 ? 'text-violet-300 border-violet-900/60 bg-violet-950/30'
                           : 'text-slate-400 border-slate-800 bg-slate-950/60')),
    ];
    note = L.axisNote[lang] + (metrics.secondR ? ` ${L.axisSecondRNote[lang]}` : '');
  } else if (metrics.kind === 'qrs') {
    chips = [
      chip('w', L.qrsWidth[lang], `${Math.round(q.qrsMs)} ms`,
           q.qrsMs >= 120 ? 'text-amber-300 border-amber-900/60 bg-amber-950/30'
                          : 'text-slate-400 border-slate-800 bg-slate-950/60'),
      ...(metrics.secondR ?? []).map((l) => chip(`r2-${l}`, `${L.secondRLabel[lang]} ${l}`, mmAbs(q.rPrime[l], lang),
           q.rPrime[l] > 0 ? 'text-violet-300 border-violet-900/60 bg-violet-950/30'
                           : 'text-slate-400 border-slate-800 bg-slate-950/60')),
      ...(metrics.sDepth ?? []).map((l) => chip(`s-${l}`, `${L.sLabel[lang]} ${l}`, mmAbs(q.s[l], lang),
           'text-sky-300 border-sky-900/60 bg-sky-950/30')),
    ];
    note = L.qrsNote[lang];
  } else if (metrics.kind === 'voltage') {
    // Un grupo por umbral: 5 mm en los miembros, 10 mm en las precordiales. Se
    // marca la derivación que está POR DEBAJO, que es la anormal — al revés que
    // en casi todos los otros paneles, donde lo llamativo es lo que sobra.
    //
    // El criterio es del GRUPO, no de cada derivación: una V1 de 7 mm no es
    // anormal por sí sola, y pintarla de alarma diría algo que no es cierto. Se
    // marca el grupo entero cuando TODAS sus derivaciones quedan por debajo del
    // umbral, que es justamente cuando el criterio se cumple.
    const grupo = (leads, umbral, etiqueta) => {
      if (!leads.length) return [];
      const cumple = leads.every((l) => q.r[l] - q.s[l] <= umbral);
      const tono = cumple ? 'text-amber-300 border-amber-900/60 bg-amber-950/30'
                          : 'text-slate-400 border-slate-800 bg-slate-950/60';
      return [
        chip(`g-${etiqueta}`, '', etiqueta, 'text-slate-500 border-slate-800 bg-slate-950/60'),
        ...leads.map((l) => chip(`v-${l}`, l, mmAbs(q.r[l] - q.s[l], lang), tono)),
      ];
    };
    chips = [
      ...grupo(metrics.limb ?? [], 0.5, L.limbGroup[lang]),
      ...grupo(metrics.chest ?? [], 1.0, L.chestGroup[lang]),
    ];
    note = L.voltageNote[lang];
  } else if (metrics.kind === 'qt') {
    if (q.qtMs === null) return null;
    const medibles = Object.values(q.qt).filter((v) => v !== null);
    // El umbral depende del sexo, así que lo decide el caso y no este bloque.
    const alto = q.qtcBazett > (metrics.threshold ?? 450);
    const tono = alto ? 'text-amber-300 border-amber-900/60 bg-amber-950/30'
                      : 'text-slate-400 border-slate-800 bg-slate-950/60';
    chips = [
      chip('qt', L.qtMs[lang], `${Math.round(q.qtMs)} ms`, 'text-slate-300 border-slate-800 bg-slate-950/60'),
      chip('qtcb', L.qtcB[lang], `${Math.round(q.qtcBazett)} ms`, tono),
      chip('qtcf', L.qtcF[lang], `${Math.round(q.qtcFridericia)} ms`, tono),
      chip('n', '', L.qtLeads[lang](medibles.length), 'text-slate-400 border-slate-800 bg-slate-950/60'),
    ];
    note = L.qtNote[lang];
  } else if (metrics.kind === 'st') {
    chips = metrics.leads.map((l) => {
      const v = q.st[l];
      // El umbral de 1 mm no es decorativo: por debajo de ese valor un desnivel
      // no se considera significativo en ninguna guía.
      const tone = v >= 0.1 ? 'text-rose-300 border-rose-900/60 bg-rose-950/30'
                 : v <= -0.1 ? 'text-sky-300 border-sky-900/60 bg-sky-950/30'
                 : 'text-slate-400 border-slate-800 bg-slate-950/60';
      return chip(l, l, mm(q.st[l], lang), tone);
    });
    // gain es {limb, chest}: comparar el objeto con 10 daba SIEMPRE distinto, y
    // la nota de media ganancia aparecía en todos los casos, incluidos los
    // dibujados a escala estándar. Una advertencia que no corresponde es peor
    // que ninguna: hace desconfiar de los milímetros que sí están bien.
    const bajoLimb = gain.limb !== MM_PER_MV;
    const bajoChest = gain.chest !== MM_PER_MV;
    const grupo = bajoLimb && bajoChest ? L.groupBoth[lang] : bajoChest ? L.groupChest[lang] : L.groupLimb[lang];
    note = L.measuredNote[lang] + (bajoLimb || bajoChest ? ` ${L.halfGainNote[lang](grupo)}` : '');
    // Algunos casos no se juegan en cuánto bajó el ST sino en cómo bajó.
    if (metrics.sag) {
      chips = chips.concat(metrics.sag.map((l) => chip(
        `sag-${l}`, `${L.sagLabel[lang]} ${l}`, mmAbs(q.sag[l], lang),
        q.sag[l] >= 0.05 ? 'text-violet-300 border-violet-900/60 bg-violet-950/30'
                         : 'text-slate-400 border-slate-800 bg-slate-950/60')));
      note += ` ${L.sagNote[lang]}`;
    }
  } else {
    const irregular = q.rrCv > 0.08;
    chips = [
      chip('hr', L.hr[lang], `${Math.round(q.hr)} ${L.bpm[lang]}`, 'text-slate-300 border-slate-800 bg-slate-950/60'),
      chip('rr', L.rrVar[lang], num(q.rrCv, 3, lang),
           irregular ? 'text-amber-300 border-amber-900/60 bg-amber-950/30' : 'text-slate-400 border-slate-800 bg-slate-950/60'),
      chip('rhythm', '', irregular ? L.irregularRhythm[lang] : L.regularRhythm[lang],
           irregular ? 'text-amber-300 border-amber-900/60 bg-amber-950/30' : 'text-slate-400 border-slate-800 bg-slate-950/60'),
    ];
    note = L.rhythmNote[lang];
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="flex items-center gap-2 mb-2 text-slate-400">
        <Ruler className="w-4 h-4" />
        <span className="font-mono text-[11px] uppercase tracking-widest font-semibold">{L.measured[lang]}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">{chips}</div>
      <p className="text-[10px] text-slate-600 mt-2 leading-relaxed">{note}</p>
    </div>
  );
}

// Una sola derivación, a todo lo ancho y con el doble de alto: para mirar de
// cerca el segmento ST cuando la vista general no alcanza.
function LeadZoom({ signal, lead, theme, lang, onClose, gain }) {
  const single = useMemo(() => ({
    fs: signal.fs,
    duration: signal.duration,
    leads: { [lead]: signal.leads[lead] },
    labels: [lead],
  }), [signal, lead]);

  return (
    <div className="fixed inset-0 z-[180] bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-lg text-indigo-300 font-bold">{lead}</span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 text-sm">{L.close[lang]}</button>
        </div>
        <div className="rounded-2xl overflow-hidden border border-slate-700">
          <TwelveLead signal={single} theme={theme} rhythmLead={lead} singleRow gain={gain} />
        </div>
      </div>
    </div>
  );
}

export default function TwelveLeadSection({ lang = 'es', onAnswer }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [theme, setTheme] = useState('paper');
  const [zoomLead, setZoomLead] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const [signal, setSignal] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const c = CASES[idx];

  // El trazado se pide al entrar al caso. Mientras tanto se muestra un hueco del
  // tamaño exacto del electro: si el bloque creciera al llegar los datos, la
  // pantalla saltaría justo cuando el usuario está leyendo el caso.
  useEffect(() => {
    let vivo = true;
    setSignal(null);
    setLoadError(false);
    loadRecord(c.record)
      .then((s) => { if (vivo) setSignal(s); })
      .catch(() => { if (vivo) setLoadError(true); });
    // El caso siguiente se va pidiendo de fondo, así el paso es instantáneo.
    const next = CASES[idx + 1];
    if (next) prefetchRecord(next.record);
    return () => { vivo = false; };
  }, [c, attempt]);

  // Se mide una vez por trazado. Son 2.500 muestras por derivación: medirlo en
  // cada render se notaría al tocar cualquier botón.
  const measured = useMemo(() => (signal ? measure(signal) : null), [signal]);

  // Un electro de mucho voltaje —un bloqueo de rama, una hipertrofia— no entra
  // en la fila a ganancia estándar. Se dibuja a la mitad, como en el papel, y el
  // pie de la hoja lo dice.
  const gain = useMemo(() => (signal ? suggestGain(signal) : { limb: MM_PER_MV, chest: MM_PER_MV }), [signal]);

  // El orden de las opciones se calcula una vez por caso: si se recalculara en
  // cada render, se reacomodarían solas al responder.
  const options = useMemo(() => shuffledOptions(c), [c]);

  const answered = picked !== null;
  const isRight = answered && picked === c.answer;

  const pick = useCallback((id) => {
    if (answered) return;
    setPicked(id);
    const right = id === c.answer;
    if (right) setScore((s) => s + 1);
    if (onAnswer) onAnswer(right, c.id);
  }, [answered, c, onAnswer]);

  const next = useCallback(() => {
    if (idx + 1 >= CASES.length) { setFinished(true); return; }
    setIdx(idx + 1);
    setPicked(null);
    setZoomLead(null);
  }, [idx]);

  const restart = useCallback(() => {
    setIdx(0); setPicked(null); setScore(0); setFinished(false); setZoomLead(null);
  }, []);

  if (finished) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
          <Check className="w-7 h-7 text-emerald-400" />
        </div>
        <h2 className="font-display text-2xl text-slate-100">{L.done[lang](CASES.length)}</h2>
        <p className="text-3xl font-mono text-indigo-300">{score} / {CASES.length}</p>
        <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">{L.doneSub[lang](CASES.length)}</p>
        <p className="text-[11px] text-slate-600 max-w-md mx-auto leading-relaxed">
          <a href={SOURCE.url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
            {SOURCE.citation}
          </a>
          <br />{SOURCE.license}
        </p>
        <button onClick={restart}
          className="px-6 py-3 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold transition-colors">
          {L.restart[lang]}
        </button>
      </div>
    );
  }

  const sexLabel = c.sex === 'F' ? L.female[lang] : L.male[lang];

  // La frecuencia NO se escribe en el caso: se cuenta sobre el trazado. Así no
  // puede pasar lo que pasaría tarde o temprano si fuera un dato suelto, que el
  // texto diga 52 y el electro muestre 73. Todo lo demás —presión, saturación,
  // frecuencia respiratoria— es parte del escenario, porque PTB-XL no las trae.
  const vitals = [
    ['hr', measured ? `${Math.round(measured.hr)}${c.findings.irregular ? ` ${L.irregular[lang]}` : ''}` : '—'],
    ['bp', c.vitals.bp],
    ['spo2', `${c.vitals.spo2}%`],
    ['rr', c.vitals.rr],
  ];

  return (
    <div className="space-y-4">
      {/* Cabecera: progreso, aciertos y tema del papel */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-slate-500 uppercase tracking-widest">
            {L.caseOf[lang](idx + 1, CASES.length)}
          </span>
          <span className="font-mono text-[11px] text-slate-600">
            {L.score[lang]} {score}/{idx + (answered ? 1 : 0)}
          </span>
        </div>
        <div className="flex gap-1 p-0.5 bg-slate-900/70 border border-slate-800 rounded-lg">
          {['paper', 'dark'].map((th) => (
            <button key={th} onClick={() => setTheme(th)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${theme === th ? 'bg-slate-800 text-indigo-300' : 'text-slate-500 hover:text-slate-300'}`}>
              {L[th][lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Presentación clínica */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
        <div className="flex items-center gap-2 text-indigo-300">
          <Stethoscope className="w-4 h-4" />
          <span className="text-sm font-semibold">{sexLabel}, {c.age} {L.years[lang]}</span>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">{c.stem[lang]}</p>
        <div className="flex flex-wrap gap-2">
          {vitals.map(([k, v]) => (
            <span key={k} className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 font-mono text-[11px] text-slate-400">
              <span className="text-slate-600">{L[k][lang]}</span> {v}
            </span>
          ))}
        </div>
        <p className="text-[10px] text-slate-600 leading-relaxed">{L.scenario[lang]}</p>
      </div>

      {/* El electro. Las derivaciones sólo se resaltan DESPUÉS de responder: */}
      {/* marcarlas antes sería regalar la respuesta. */}
      {signal ? (
        <EcgSheet
          signal={signal}
          theme={theme}
          highlight={answered ? c.highlight : []}
          lang={lang}
          onLeadClick={setZoomLead}
          gain={gain}
        />
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-center"
             style={{ aspectRatio: `${SHEET.w} / ${SHEET.h}` }}>
          {loadError ? (
            <div className="text-center px-6 space-y-3">
              <p className="text-slate-400 text-sm">{L.loadError[lang]}</p>
              <button onClick={() => setAttempt((a) => a + 1)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors">
                {L.retry[lang]}
              </button>
            </div>
          ) : (
            <span className="text-slate-600 text-sm animate-pulse">{L.loading[lang]}</span>
          )}
        </div>
      )}

      {/* Pregunta y opciones */}
      {!answered && (
        <div className="space-y-2">
          <p className="text-slate-300 text-sm font-medium">{L.question[lang]}</p>
          {options.map((o) => (
            <button key={o.id} onClick={() => pick(o.id)}
              className="w-full text-left px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-300 hover:border-indigo-700/50 hover:bg-slate-800/60 active:scale-[0.99] transition-all text-sm">
              {o.label[lang]}
            </button>
          ))}
        </div>
      )}

      {/* Resultado y enseñanza */}
      {answered && (
        <div className="space-y-3">
          <div className={`rounded-xl border p-4 ${isRight ? 'border-emerald-700/50 bg-emerald-950/30' : 'border-rose-800/50 bg-rose-950/25'}`}>
            <div className="flex items-center gap-2 mb-1">
              {isRight ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-rose-400" />}
              <span className={`font-bold text-sm ${isRight ? 'text-emerald-300' : 'text-rose-300'}`}>
                {isRight ? L.correct[lang] : L.incorrect[lang]}
              </span>
            </div>
            {!isRight && (
              <p className="text-slate-400 text-sm">
                {L.wasAnswer[lang]}: <span className="text-slate-200 font-medium">
                  {c.options.find((o) => o.id === c.answer).label[lang]}
                </span>
              </p>
            )}
          </div>

          <Measured q={measured} metrics={c.metrics} lang={lang} gain={gain} />

          <Block icon={Activity} tone="indigo" title={L.why[lang]} text={c.explain[lang]} />
          <Block icon={AlertTriangle} tone="amber" title={L.pitfall[lang]} text={c.pitfall[lang]} />
          <Block icon={Stethoscope} tone="sky" title={L.action[lang]} text={c.action[lang]} />

          <button onClick={next}
            className="w-full py-3.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 active:scale-[0.99] text-white font-bold transition-all flex items-center justify-center gap-1">
            {L.next[lang]}
          </button>
        </div>
      )}

      {zoomLead && signal && (
        <LeadZoom signal={signal} lead={zoomLead} theme={theme} lang={lang} gain={gain} onClose={() => setZoomLead(null)} />
      )}
    </div>
  );
}

function Block({ icon: Icon, tone, title, text }) {
  const tones = {
    indigo: 'border-indigo-900/50 bg-indigo-950/20 text-indigo-300',
    amber: 'border-amber-900/50 bg-amber-950/20 text-amber-300',
    sky: 'border-sky-900/50 bg-sky-950/20 text-sky-300',
  };
  return (
    <div className={`rounded-xl border p-4 ${tones[tone]}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="w-4 h-4" />
        <span className="font-mono text-[11px] uppercase tracking-widest font-semibold">{title}</span>
      </div>
      <p className="text-slate-300 text-sm leading-relaxed">{text}</p>
    </div>
  );
}
