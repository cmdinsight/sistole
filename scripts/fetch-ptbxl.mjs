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
import { RECORD_IDS, SOURCE } from '../src/ecg12/records.js';

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
  const hea = await fetchRecord(id);
  const payload = prepareRecord(hea);
  const { dir, name } = remotePath(id);
  writeFileSync(dest, JSON.stringify({
    id: String(id),
    source: `${SOURCE.dataset} ${SOURCE.version} · ${dir}/${name}`,
    ...payload,
  }));
  bytes += statSync(dest).size;
  console.log(`  ✓ ${id}  ${payload.fs} Hz · ${payload.samples} muestras · ${(statSync(dest).size / 1024).toFixed(0)} KB`);
}

console.log(`\n${RECORD_IDS.length} registros en public/ecg12/ — ${(bytes / 1024).toFixed(0)} KB en total`);
console.log(`Fuente: ${SOURCE.citation}`);
