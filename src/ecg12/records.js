// ═══════════════════════════════════════════════════════════════
// LOS REGISTROS: DE DÓNDE SALE CADA TRAZADO
// ═══════════════════════════════════════════════════════════════
// Los electrocardiogramas de la sección son reales. Salen de PTB-XL, una
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

// Dos fuentes, no una. PTB-XL cubre casi todo, pero hay hallazgos que no tiene
// —ni un solo Wenckebach con ondas P visibles, ninguna repolarización precoz,
// ninguna onda U— y para ésos se recurre al desafío CinC 2021, que junta ocho
// bases (PTB-XL entre ellas) en el mismo formato y con acceso abierto.
// Cada registro declara de dónde sale; el que no lo diga es de PTB-XL.
export const SOURCES = {
  ptbxl: {
    dataset: 'PTB-XL',
    version: '1.0.3',
    url: 'https://physionet.org/content/ptb-xl/1.0.3/',
    license: 'Open Data Commons Attribution License v1.0 (ODC-BY 1.0)',
    citation: 'Wagner P, Strodthoff N, Bousseljot R-D, Kreiseler D, Lunze FI, Samek W, Schaeffter T. '
      + 'PTB-XL, a large publicly available electrocardiography dataset. Scientific Data 7:154 (2020). '
      + 'PhysioNet, doi:10.13026/kfzx-aw45',
  },
  cinc2021: {
    dataset: 'CinC 2021',
    version: '1.0.3',
    url: 'https://physionet.org/content/challenge-2021/1.0.3/',
    license: 'Creative Commons Attribution 4.0 (CC BY 4.0)',
    citation: 'Reyna MA, Sadr N, Perez Alday EA, et al. Will Two Do? Varying Dimensions in '
      + 'Electrocardiography: the PhysioNet/Computing in Cardiology Challenge 2021. '
      + 'Computing in Cardiology 48 (2021). PhysioNet, doi:10.13026/34va-7q14',
  },
};

// Se conserva SOURCE apuntando a PTB-XL: es la fuente de la enorme mayoría de
// los registros y lo que la sección cita por defecto.
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
  14219: {
    age: 78, sex: 'F', scp: ['CLBBB'],
    report: 'sinusrhythmus llt vollstaendiger linksschenkelblock st-hebung in v1-v3 '
      + 't-veraenderungen pathologisches ekg',
  },
  1451: {
    age: 69, sex: 'F', scp: ['LVH'],
    report: 'sinusrytm vänster kammarhypertrofi',
  },
  8198: {
    age: 49, sex: 'F', scp: ['LNGQT'],
    report: 'sinusrhythmus lagetyp normal qt-verlängerung',
  },
  15985: {
    age: 84, sex: 'F', scp: ['DIG', 'AFIB'],
    report: 'vorhofflimmern normokard stlt st-hebung in v4-6, ii, iii, avf st-senkung in ii, iii, avf, v4-6 '
      + 'neg. t in ii, iii, avf, v4-6 digitalisveraenderung pathologisches ekg',
  },
  2017: {
    age: 82, sex: 'F', scp: ['CRBBB'],
    report: 'sinusrhythmus ueberdrehter linkstyp rechtsschenkelblock qrs(t) abnormal '
      + 'supraventr. extrasystolen pathologisch',
  },
  41: {
    age: 42, sex: 'M', scp: ['LAFB'],
    report: 'sinusrhythmus ueberdrehter linkstyp linksanteriorer hemiblock',
  },
  16389: {
    age: 75, sex: 'F', scp: ['CRBBB', 'LAFB'],
    report: 'sinus rhythm. left axis deviation. left anterior fascicular block. right bundle branch block. '
      + 'bifascicular block. pr interval is normal.',
  },
  // PTB-XL etiqueta este registro a la vez como NORM (probabilidad 100) y como
  // LPFB. La contradicción no es un error de la base: es exactamente lo que el
  // caso enseña, y por eso se transcribe tal cual.
  13052: {
    age: 35, sex: 'M', scp: ['NORM', 'LPFB'],
    report: 'sinusrhythmus ueberdrehter rechtstyp linksposteriorer hemiblock',
  },
  4215: {
    age: 62, sex: 'M', scp: ['NORM', 'LVOLT'],
    report: 'sinusrhythmus lagetyp normal periphere niederspannung',
  },
  // PTB-XL lo estadifica como Stadium III: un infarto ya evolucionado. Eso es
  // parte del hallazgo, porque el ST que sigue arriba a esa altura es
  // justamente lo que define el patrón.
  7953: {
    age: 76, sex: 'F', stage: 'Stadium III', scp: ['ASMI', 'ALMI', 'ANEUR'],
    report: 'sinus rhythm. tiny r waves in v2,3. q waves in i, avl, v4,5,6. t waves are low or flat '
      + 'in i, avl, v5,6. consistent with anterior and lateral myocardial infarction.',
  },
  9619: {
    age: 76, sex: 'M', scp: ['NORM', '1AVB'],
    report: 'sinusrhythmus a-v block i lagetyp normal st & t abnorm, wahrscheinlich inferolaterale '
      + 'ischÄmie oder linksbelastung 4.46 unbestÄtigter bericht',
  },
  11331: {
    age: 66, sex: 'M', scp: ['NORM', 'SBRAD'],
    report: 'sinusbradykardie lagetyp normal sonst normales ekg 4.46 unbestÄtigter bericht',
  },
  3957: {
    age: 77, sex: 'M', scp: ['NDT', 'LOWT', 'STD_'],
    report: 'sinus rhythm. st segments are depressed in i, ii, avl, v4,5,6. t waves are low or flat '
      + 'in limb leads and v4,5,6. this may be due to ischaemia.',
  },
  10094: {
    age: 68, sex: 'F', scp: ['NDT', 'LVOLT'],
    report: 'sinus rhythm. low limb lead voltage. t waves are flat or slightly inverted in i, avl, '
      + 'v3-6. findings are likely to be due to ischaemia.',
  },
  7889: {
    age: 74, sex: 'F', scp: ['PSVT'],
    report: 'av-tachykardie (dd:supraventr. tachykardie) linkstyp st-senkung in i,ii,v3-4 '
      + 't hoch in v2-4',
  },
  4110: {
    age: 40, sex: 'F', scp: ['NORM'],
    report: 'sinus rhythm. "dropped beats" due to blocked atrial premature beats. otherwise normal '
      + 'ecg, as before.',
  },
  4647: {
    age: 48, sex: 'M', scp: ['NORM', 'PVC'],
    report: 'premature ventricular contraction(s). sinus rhythm. otherwise normal ecg.',
  },
  18550: {
    age: 67, sex: 'F', scp: ['NDT', 'RAO/RAE', 'STD_', 'NT_'],
    report: 'sinus rhythm. probable right atrial enlargement. minor non-specific st segment '
      + 'depression and t wave flattening in chest leads.',
  },
  // Del desafío CinC 2021, base de Ningbo. PTB-XL no tiene ningún Wenckebach
  // con ondas P medibles: los dos que trae están documentados como imposibles
  // en scripts/ejemplos/mobitz.mjs.
  JS12422: {
    source: 'cinc2021', age: 61, sex: 'M', scp: ['54016002', '426177001'],
    report: 'mobitz type i wenckebach atrioventricular block; sinus bradycardia (SNOMED-CT)',
  },
  // Del CinC 2021, base de Ningbo. PTB-XL no tiene un solo registro etiquetado
  // con repolarización precoz.
  //
  // La base le pone además dos etiquetas que el trazado no sostiene, y conviene
  // dejarlo dicho: 6374002 (bloqueo de rama) sobre un QRS de 96 ms y sin R' en
  // V1, y 55827005 (hipertrofia ventricular izquierda) sobre un Sokolow de
  // 36,5 mm en un varón de 24 años, que es voltaje alto de gente joven y
  // delgada, no hipertrofia. Las dos son el mismo malentendido que este caso
  // enseña a no cometer.
  JS22294: {
    source: 'cinc2021', age: 24, sex: 'M',
    scp: ['428417006', '426177001', '427393009', '164930006', '55827005', '6374002'],
    report: 'early repolarization; sinus bradycardia; sinus arrhythmia; st interval abnormal; '
      + 'left ventricular high voltage; bundle branch block (SNOMED-CT)',
  },
  // Del CinC 2021, base de Ningbo. Los nombres de los códigos salen de la tabla
  // oficial del desafío, que scripts/cinc.mjs baja y guarda.
  //
  // La base lo etiqueta también como ritmo de la unión (29320008), y el trazado
  // no lo sostiene: hay una P de 0,5 mm en II antes de cada QRS, con un PR de
  // 292 ms. Eso es un PR largo, que forma parte del mismo cuadro, no un ritmo
  // nacido en el nodo AV. Es una P chica y se entiende que se pase por alto.
  JS22392: {
    source: 'cinc2021', age: 45, sex: 'M',
    scp: ['164937009', '29320008'],
    report: 'u wave abnormal; atrioventricular junctional rhythm (SNOMED-CT)',
  },
  // Del CinC 2021, base de Ningbo. PTB-XL tiene 11 bloqueos completos y varios
  // informes dicen ellos mismos que las P son "inconspicuous"; éste las tiene
  // medibles.
  //
  // La etiqueta dice taquicardia sinusal y la medición da una aurícula a 118:
  // las dos cosas se escribieron sin mirar a la otra.
  JS12522: {
    source: 'cinc2021', age: 42, sex: 'M',
    scp: ['27885002', '50799005', '81898007', '427084000'],
    report: 'complete heart block; atrioventricular dissociation; ventricular escape rhythm; '
      + 'sinus tachycardia (SNOMED-CT)',
  },
  // Del CinC 2021, base de Ningbo. PTB-XL no tiene ningún código para esto.
  //
  // La base lo etiqueta además como bloqueo AV de segundo grado, y el trazado no
  // lo sostiene: para hablar de segundo grado hacen falta P que conduzcan con un
  // PR reconocible y alguna que no, y acá NINGUNA conduce — el PR latido a
  // latido va de 84 a 332 ms sin orden. Es disociación, no conducción parcial.
  JS22128: {
    source: 'cinc2021', age: 39, sex: 'F',
    scp: ['61277005', '427084000', '55930002', '195042002'],
    report: 'accelerated idioventricular rhythm; sinus tachycardia; s t changes; '
      + '2nd degree av block (SNOMED-CT)',
  },
  // Del CinC 2021, base de Ningbo. Una sola etiqueta en toda la base, que es
  // raro y vale: nada que aclarar ni que descartar.
  JS22432: {
    source: 'cinc2021', age: 28, sex: 'F', scp: ['426664006'],
    report: 'accelerated junctional rhythm (SNOMED-CT)',
  },
  595: {
    age: 47, sex: 'F', scp: ['NORM'],
    report: 'sinus rhythm. normal ecg.',
  },
};

// El orden es el de los casos. scripts/fetch-ptbxl.mjs baja exactamente estos.
export const RECORD_IDS = ['12899', '20139', '13913', '2993', '2960', '12632', '5252', '14219', '1451', '8198', '15985', '2017', '41', '16389', '13052', '4215', '7953', '9619', '11331', '3957', '10094', '7889', '4110', '4647', '18550', 'JS12422', 'JS22294', 'JS22392', 'JS12522', 'JS22128', 'JS22432', '595'];
