// ═══════════════════════════════════════════════════════════════
// LOS REGISTROS: DE DÓNDE SALE CADA TRAZADO
// ═══════════════════════════════════════════════════════════════
// Los ocho electrocardiogramas de la sección son reales. Salen de PTB-XL, una
// base de 21.799 registros de 12 derivaciones, de 10 segundos, anotados por
// cardiólogos, que el Physikalisch-Technische Bundesanstalt publica en
// PhysioNet. Se eligieron midiendo los 21.799 con el módulo measure.js y
// quedándose con los que muestran el hallazgo de forma limpia y legible; después
// se miraron uno por uno.
//
// Acá va sólo la PROCEDENCIA: quién es el paciente según la base y qué escribió
// el cardiólogo que lo anotó. La enseñanza está en cases.js, y lo que cada caso
// afirma se comprueba midiendo el trazado en scripts/test-cases.mjs.
//
// El informe se transcribe tal como está en la base, en el idioma en que fue
// escrito, sin traducir ni corregir. Es la anotación original: si se la
// retocara, dejaría de servir como referencia contra la cual contrastar.

export const SOURCE = {
  dataset: 'PTB-XL',
  version: '1.0.3',
  url: 'https://physionet.org/content/ptb-xl/1.0.3/',
  license: 'Open Data Commons Attribution License v1.0 (ODC-BY 1.0)',
  citation: 'Wagner P, Strodthoff N, Bousseljot R-D, Kreiseler D, Lunze FI, Samek W, Schaeffter T. '
    + 'PTB-XL, a large publicly available electrocardiography dataset. Scientific Data 7:154 (2020). '
    + 'PhysioNet, doi:10.13026/kfzx-aw45',
};

// sex y age son los del registro, no los del guion clínico: quien mira el
// trazado está mirando a esta persona. `report` es la anotación del cardiólogo.
export const RECORDS = {
  12899: {
    age: 67, sex: 'F', stage: 'Stadium I', scp: ['IMI'],
    report: 'sinus rhythm. st segments are elevated in ii, iii, avf. st segments are depressed in i, avl, '
      + 'this is probably reciprocal. consistent with early inferior myocardial infarction.',
  },
  20139: {
    age: 82, sex: 'M', stage: 'Stadium I', scp: ['ASMI'],
    report: 'sinusrhythmus a-v block i lagetyp normal subakuter anteriorer infarkt sicher '
      + 'st-hebung in v1-v4 t neg in v1-v5 path. ekg fehlende r-progression',
  },
  13913: {
    age: 68, sex: 'M', stage: 'Stadium I', scp: ['ASMI', 'ALMI', '1AVB', 'STACH'],
    report: 'sinus tachycardia. q waves in v2,3. st segments are elevated in i, ii, avl, v2-6, the elevation '
      + 'being especially marked in v2,3,4. st segments are depressed in iii. consistent with recent anterior '
      + 'and lateral myocardial infarction',
  },
  2993: {
    age: 85, sex: 'F', stage: 'Stadium I', scp: ['IPLMI'],
    report: 'sinus rhythm. acute inferolateral infarct with true posterior involvement.',
  },
  2960: {
    age: 87, sex: 'M', stage: 'unknown', scp: ['INJAS', 'INJAL', 'INVT'],
    report: 'sinus rhythm. r-s transition zone in v leads displaced to the right. t waves are inverted in '
      + 'i, ii, avl, v2-6. findings are likely to be due to ischaemic heart disease. they may represent '
      + 'subendocardial infarction of uncertain age',
  },
  12632: {
    age: 61, sex: 'F', scp: ['AFIB', 'LVOLT'],
    report: 'atrial fibrillation with rapid ventricular response. low limb lead voltage. otherwise normal ecg.',
  },
  5252: {
    age: 84, sex: 'M', scp: ['AFLT'],
    // El informe automático dice "ritmo regular, no se reconoce onda P" y no
    // nombra el aleteo: fue el cardiólogo quien lo etiquetó AFLT. Ese desacuerdo
    // es parte de lo que el caso enseña, así que se deja tal cual.
    report: 'regelmässiger rhythmus, keine p-welle erkannt lagetyp normal st & t abnormal, wahrscheinlich '
      + 'anteriore ischämie oder linksbelastung laterale ischämie oder linksbelastung inferolaterale '
      + 'ischämie oder linksbelastung',
  },
  595: {
    age: 47, sex: 'F', scp: ['NORM'],
    report: 'sinus rhythm. normal ecg.',
  },
};

// El orden es el de los casos. scripts/fetch-ptbxl.mjs baja exactamente estos.
export const RECORD_IDS = ['12899', '20139', '13913', '2993', '2960', '12632', '5252', '595'];
