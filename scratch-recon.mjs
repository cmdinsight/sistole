// Reconocimiento de toda la lista de una vez: cuántos registros hay para cada
// hallazgo, y con qué se confunden. Antes de medir nada.
import { loadIndex, loadScpDictionary } from './scripts/ptbxl-index.mjs';
const idx = await loadIndex();
const dict = await loadScpDictionary();

const GRUPOS = {
  'ISQUEMIA': ['LMI','ALMI','ILMI','IPLMI','ISCAL','ISCAS','ISCLA','ISCIN','ISCIL','ISC_','NST_','STD_','DIG','ANEUR','EL'],
  'CONDUCCIÓN': ['CRBBB','LPFB','LAFB','2AVB','3AVB','1AVB','PSVT','SVARR','PAC','BIGU','TRIGU'],
  'RITMO': ['SVTAC','PSVT','STACH','SBRAD','SARRH','PVC','VCLVH','PACE','SR','AFIB','AFLT'],
  'CÁMARAS': ['RVH','LVH','LAO/LAE','RAO/RAE','LVOLT','HVOLT','SEHYP'],
  'OTROS': ['NORM','ABQRS','INVT','NT_','NDT','LOWT','QWAVE','PRC(S)','LNGQT','WPW','ILBBB','IRBBB','IVCD'],
};
for (const [g, codes] of Object.entries(GRUPOS)) {
  console.log('\n══ ' + g + ' ══');
  for (const c of codes) {
    const n = idx.filter(r => r.scp[c] !== undefined).length;
    if (n) console.log('  ' + String(n).padStart(5), c.padEnd(9), (dict[c]||'').slice(0,62));
  }
}
// Búsquedas por texto del informe, para los que no tienen código propio
console.log('\n══ POR TEXTO DEL INFORME ══');
const TXT = {
  'Wellens': /wellens/i,
  'De Winter': /de winter/i,
  'Brugada': /brugada/i,
  'Pericarditis': /perikarditis|pericarditis/i,
  'Repolarización precoz': /fr[uü]he repolarisation|early repolar/i,
  'Dextrocardia / electrodos': /dextrocard|arm lead|elektroden|reversed|vertauscht|limb lead reversal/i,
  'Hipopotasemia / onda U': /hypokali|hypokal[aä]|u-welle|u wave|prominent u/i,
  'Hipercalcemia/hipocalcemia': /hypercalc|hypocalc|hyperkalz|hypokalz/i,
  'Marcapasos': /schrittmacher|pacemaker|paced/i,
  'Mobitz II': /mobitz.*(ii|2)|typ ii|type ii/i,
};
for (const [nombre, re] of Object.entries(TXT)) {
  const hits = idx.filter(r => re.test(r.report||''));
  console.log('  ' + String(hits.length).padStart(4), nombre);
}
