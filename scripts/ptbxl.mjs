// ═══════════════════════════════════════════════════════════════
// PTB-XL — DESCARGA Y PREPARACIÓN DE REGISTROS REALES
// ═══════════════════════════════════════════════════════════════
// PTB-XL es un conjunto de 21.799 electrocardiogramas de 12 derivaciones, de 10
// segundos cada uno, anotados por cardiólogos. Lo publica PhysioNet bajo
// licencia Open Data Commons Attribution 1.0, que permite usarlos citando la
// fuente. La cita está en src/ecg12/records.js y se muestra en la app.
//
//   Wagner P. et al. "PTB-XL, a large publicly available electrocardiography
//   dataset". Scientific Data 7, 154 (2020).
//   https://physionet.org/content/ptb-xl/1.0.3/
//
// Este módulo baja un registro, lo lee con el lector WFDB propio y lo prepara
// para la app. Lo único que se le hace a la señal es bajar la frecuencia de
// muestreo de 500 a 250 Hz. No se filtra, no se recorta, no se "limpia": el
// trazado que ve el estudiante es el que se le registró a un paciente.

import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { readRecord } from './wfdb.mjs';
import { STORED_LEADS, encodeRecord } from '../src/ecg12/record.js';

const BASE = 'https://physionet.org/files/ptb-xl/1.0.3';
export const CACHE = join(dirname(new URL(import.meta.url).pathname), '..', '.ptbxl-cache');

/** PTB-XL agrupa los registros de a mil: el 12899 vive en records500/12000/. */
export function remotePath(id) {
  const n = String(id).padStart(5, '0');
  const bucket = `${String(Math.floor(Number(id) / 1000)).padStart(2, '0')}000`;
  return { name: `${n}_hr`, dir: `records500/${bucket}` };
}

async function download(url, dest) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
  writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
}

/** Baja el par .hea/.dat de un registro al caché local y devuelve la ruta del .hea. */
export async function fetchRecord(id, cache = CACHE) {
  mkdirSync(cache, { recursive: true });
  const { name, dir } = remotePath(id);
  const hea = join(cache, `${name}.hea`);
  for (const ext of ['hea', 'dat']) {
    const dest = join(cache, `${name}.${ext}`);
    if (!existsSync(dest)) await download(`${BASE}/${dir}/${name}.${ext}`, dest);
  }
  return hea;
}

/**
 * Baja el muestreo a la mitad. Antes de descartar una muestra de cada dos hay
 * que quitar lo que esté por encima de la nueva frecuencia de Nyquist, o esas
 * componentes reaparecen como frecuencias bajas falsas — aliasing — y ensucian
 * el trazado con ondulaciones que el paciente nunca tuvo. El filtro [1 2 1]/4 es
 * el más corto que hace el trabajo sin recortar la amplitud del QRS, que es lo
 * que no se puede tocar: de ella dependen los criterios de voltaje.
 */
export function decimate2(x) {
  const n = x.length;
  const sm = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const a = x[Math.max(0, i - 1)], b = x[i], c = x[Math.min(n - 1, i + 1)];
    sm[i] = (a + 2 * b + c) / 4;
  }
  const out = new Float32Array(Math.floor(n / 2));
  for (let i = 0; i < out.length; i++) out[i] = sm[i * 2];
  return out;
}

/** PTB-XL nombra las derivaciones en mayúsculas: AVR, AVL, AVF. */
const canon = (name) => (/^AV[RLF]$/.test(name) ? `a${name.slice(1)}` : name);

/**
 * Deja un registro listo para guardar: 250 Hz, las ocho derivaciones medidas.
 * @returns {{fs:number, samples:number, gain:number, leads:string[], data:string}}
 */
export function prepareRecord(heaPath, { fs: target = 250 } = {}) {
  const rec = readRecord(heaPath);
  const leads = {};
  rec.order.forEach((name) => { leads[canon(name)] = rec.leads[name]; });

  const missing = STORED_LEADS.filter((l) => !leads[l]);
  if (missing.length) throw new Error(`Al registro le faltan derivaciones: ${missing.join(', ')}`);

  let fs = rec.fs;
  const out = {};
  for (const l of STORED_LEADS) out[l] = leads[l];
  while (fs / 2 >= target && fs % 2 === 0) {
    for (const l of STORED_LEADS) out[l] = decimate2(out[l]);
    fs /= 2;
  }
  if (fs !== target) throw new Error(`No se puede llegar de ${rec.fs} Hz a ${target} Hz dividiendo por dos`);

  return encodeRecord(out, fs);
}
