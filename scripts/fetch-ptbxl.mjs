#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
// Baja de PhysioNet los registros que usa la sección de 12 derivaciones y los
// deja en public/ecg12/, listos para servir.
//
//   npm run fetch:ptbxl
//
// La lista de registros NO está acá: sale de src/ecg12/records.js, que es el
// único lugar donde se declara qué electro usa cada caso. Así no puede pasar que
// se agregue un caso y se olvide bajar su trazado, ni al revés.
//
// Los archivos generados se versionan en el repositorio. Bajarlos en cada build
// haría que la app dependa de que PhysioNet esté disponible en ese momento y de
// que nunca cambie un registro, y ninguna de las dos cosas está bajo control
// nuestro. Bajarlos una vez y revisarlos sí lo está.

import { writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchRecord, prepareRecord, remotePath } from './ptbxl.mjs';
import { RECORD_IDS, SOURCE, SOURCES } from '../src/ecg12/records.js';
import { fetchRecord as fetchCinc } from './cinc.mjs';
import { readFileSync as leer } from 'node:fs';

// Los identificadores del CinC 2021 empiezan con letra (JS12422); los de PTB-XL
// son números. El índice que dejó el escaneo de cabeceras dice en qué grupo
// está cada uno.
const esCinc = (id) => /^[A-Za-z]/.test(String(id));
let indiceCinc = null;
function grupoCinc(id) {
  indiceCinc = indiceCinc || JSON.parse(leer(join(root, '.cinc-cache', 'indice.json'), 'utf8'));
  for (const lista of Object.values(indiceCinc)) {
    const c = lista.find((x) => x.id === id);
    if (c) return c.g;
  }
  throw new Error(`${id} no está en .cinc-cache/indice.json`);
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'ecg12');
mkdirSync(outDir, { recursive: true });

const force = process.argv.includes('--force');
let bytes = 0;

for (const id of RECORD_IDS) {
  const dest = join(outDir, `${id}.json`);
  if (existsSync(dest) && !force) {
    bytes += statSync(dest).size;
    console.log(`  · ${id}  ya estaba (--force para rehacerlo)`);
    continue;
  }
  const cinc = esCinc(id);
  const hea = cinc ? await fetchCinc('ningbo', grupoCinc(id), id) : await fetchRecord(id);
  const payload = prepareRecord(hea);
  const { dir, name } = cinc
    ? { dir: `training/ningbo/g${grupoCinc(id)}`, name: id }
    : remotePath(id);
  writeFileSync(dest, JSON.stringify({
    id: String(id),
    source: `${(cinc ? SOURCES.cinc2021 : SOURCES.ptbxl).dataset} ${(cinc ? SOURCES.cinc2021 : SOURCES.ptbxl).version} · ${dir}/${name}`,
    ...payload,
  }));
  bytes += statSync(dest).size;
  console.log(`  ✓ ${id}  ${payload.fs} Hz · ${payload.samples} muestras · ${(statSync(dest).size / 1024).toFixed(0)} KB`);
}

console.log(`\n${RECORD_IDS.length} registros en public/ecg12/ — ${(bytes / 1024).toFixed(0)} KB en total`);
console.log(`Fuente: ${SOURCE.citation}`);
