#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
// SEGUNDA FUENTE DE TRAZADOS: EL DESAFÍO CinC 2021
// ═══════════════════════════════════════════════════════════════
// PTB-XL se quedó corta para varios hallazgos: no tiene un solo registro
// etiquetado con repolarización precoz, ni con onda U, ni con taquicardia
// ventricular, ni un Wenckebach con ondas P visibles. El desafío CinC 2021
// junta ocho bases —PTB-XL entre ellas— en un mismo formato y bajo un catálogo
// común de 133 diagnósticos en SNOMED-CT, y son 88.000 electros de acceso
// abierto.
//
// Lo bueno es que no hace falta cambiar casi nada: son WFDB de 12 derivaciones
// a 500 Hz, o sea el mismo formato que ya se lee. Dos diferencias:
//
//   · los datos vienen en un .mat de MATLAB en vez de un .dat. No es un
//     problema: es una matriz de 12×5000 guardada por columnas, que para doce
//     señales es exactamente el intercalado que el lector ya esperaba, detrás
//     de una cabecera de 24 bytes. El propio .hea lo dice con el sufijo "+24".
//   · la metadata —edad, sexo, diagnósticos— viaja en los comentarios del .hea
//     y no en un CSV central. Eso obliga a leer cabeceras para indexar, y es la
//     parte cara de todo esto.
//
// El decodificado se comprobó contra el valor de la PRIMERA muestra que cada
// cabecera declara para cada señal: las doce coinciden exactamente.
import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { parseHeader } from './wfdb.mjs';

export const BASE = 'https://physionet.org/files/challenge-2021/1.0.3/training';
export const CACHE = join(dirname(new URL(import.meta.url).pathname), '..', '.cinc-cache');

// Las bases donde vive lo que falta. Ningbo es la grande y la que más aporta.
export const FUENTES = {
  ningbo: 35, chapman_shaoxing: 10, georgia: 11, cpsc_2018: 7, cpsc_2018_extra: 7, ptb: 1,
};

async function bajar(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r;
}

// Los nombres de archivo de un grupo, del listado del servidor.
export async function listarGrupo(fuente, g) {
  const cache = join(CACHE, 'listados', `${fuente}-g${g}.txt`);
  if (existsSync(cache)) return readFileSync(cache, 'utf8').split('\n').filter(Boolean);
  const html = await (await bajar(`${BASE}/${fuente}/g${g}/`)).text();
  const ids = [...html.matchAll(/href="([A-Za-z0-9_]+)\.hea"/g)].map((m) => m[1]);
  mkdirSync(dirname(cache), { recursive: true });
  writeFileSync(cache, ids.join('\n'));
  return ids;
}

// Sólo la cabecera: 700 bytes contra 120 KB del trazado. Indexar son cabeceras.
export async function cabecera(fuente, g, id) {
  const cache = join(CACHE, fuente, `g${g}`, `${id}.hea`);
  if (!existsSync(cache)) {
    const txt = await (await bajar(`${BASE}/${fuente}/g${g}/${id}.hea`)).text();
    mkdirSync(dirname(cache), { recursive: true });
    writeFileSync(cache, txt);
  }
  return cache;
}

// El trazado completo, ya con su .mat al lado, listo para prepareRecord().
export async function fetchRecord(fuente, g, id) {
  const hea = await cabecera(fuente, g, id);
  const mat = hea.replace(/\.hea$/, '.mat');
  if (!existsSync(mat)) {
    const buf = Buffer.from(await (await bajar(`${BASE}/${fuente}/g${g}/${id}.mat`)).arrayBuffer());
    writeFileSync(mat, buf);
  }
  return hea;
}

export function metadatos(heaPath) {
  const h = parseHeader(readFileSync(heaPath, 'utf8'));
  const c = h.comentarios || {};
  const edad = parseInt(c.age, 10);
  return {
    fs: h.fs,
    age: Number.isFinite(edad) && edad > 0 && edad < 120 ? edad : null,
    sex: c.sex === 'Male' ? 'M' : c.sex === 'Female' ? 'F' : null,
    dx: (c.dx || '').split(',').map((x) => x.trim()).filter(Boolean),
  };
}
