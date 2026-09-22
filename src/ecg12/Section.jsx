import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Check, X, AlertTriangle, Activity, Stethoscope, Maximize2, Ruler } from 'lucide-react';
import TwelveLead from './TwelveLead.jsx';
import { sheetSize } from './draw.js';
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
  done: { es: 'Terminaste los ocho', en: 'You finished all eight', pt: 'Você terminou os oito' },
  doneSub: {
    es: 'Los ocho trazados son electrocardiogramas reales de PTB-XL, registrados a pacientes y anotados por cardiólogos. Entrenan la localización, que es lo que una sola derivación no puede enseñar.',
    en: 'All eight tracings are real electrocardiograms from PTB-XL, recorded from patients and annotated by cardiologists. They train localization, which a single lead cannot teach.',
    pt: 'Os oito traçados são eletrocardiogramas reais do PTB-XL, registrados em pacientes e anotados por cardiologistas. Treinam a localização, que uma única derivação não pode ensinar.',
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
  irregular: { es: '(irregular)', en: '(irregular)', pt: '(irregular)' },
  bpm: { es: 'lpm', en: 'bpm', pt: 'bpm' },
  rrVar: { es: 'variación RR', en: 'RR variation', pt: 'variação RR' },
  regularRhythm: { es: 'ritmo regular', en: 'regular rhythm', pt: 'ritmo regular' },
  irregularRhythm: { es: 'irregularmente irregular', en: 'irregularly irregular', pt: 'irregularmente irregular' },
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
const mm = (mv, lang) => {
  const abs = Math.abs(mv * 10);
  if (abs < 0.05) return `${num(0, 1, lang)} mm`;
  return `${mv >= 0 ? '+' : '−'}${num(abs, 1, lang)} mm`;
};

// El electro es ancho por naturaleza: 250 mm de papel. En un celular eso obliga a
// elegir entre achicarlo hasta que no se lea o dejar scroll horizontal. Se elige
// el scroll, que es lo que hace cualquiera con un electro impreso, y además se
// permite tocar una derivación para verla sola y en grande.
function EcgSheet({ signal, theme, highlight, lang, onLeadClick }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
      <div className="relative">
        <div className="overflow-x-auto">
          <div className="min-w-[680px]">
            <TwelveLead signal={signal} theme={theme} highlight={highlight} onLeadClick={onLeadClick} />
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
function Measured({ q, metrics, lang }) {
  if (!q || !metrics) return null;

  const chip = (key, label, value, tone) => (
    <span key={key} className={`px-2 py-1 rounded-lg border font-mono text-[11px] ${tone}`}>
      <span className="opacity-60">{label}</span> {value}
    </span>
  );

  let chips = [];
  let note = '';

  if (metrics.kind === 'st') {
    chips = metrics.leads.map((l) => {
      const v = q.st[l];
      // El umbral de 1 mm no es decorativo: por debajo de ese valor un desnivel
      // no se considera significativo en ninguna guía.
      const tone = v >= 0.1 ? 'text-rose-300 border-rose-900/60 bg-rose-950/30'
                 : v <= -0.1 ? 'text-sky-300 border-sky-900/60 bg-sky-950/30'
                 : 'text-slate-400 border-slate-800 bg-slate-950/60';
      return chip(l, l, mm(q.st[l], lang), tone);
    });
    note = L.measuredNote[lang];
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
function LeadZoom({ signal, lead, theme, lang, onClose }) {
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
          <TwelveLead signal={single} theme={theme} rhythmLead={lead} singleRow />
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
        <h2 className="font-display text-2xl text-slate-100">{L.done[lang]}</h2>
        <p className="text-3xl font-mono text-indigo-300">{score} / {CASES.length}</p>
        <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">{L.doneSub[lang]}</p>
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

          <Measured q={measured} metrics={c.metrics} lang={lang} />

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
        <LeadZoom signal={signal} lead={zoomLead} theme={theme} lang={lang} onClose={() => setZoomLead(null)} />
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
