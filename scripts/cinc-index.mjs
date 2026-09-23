#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
// ÍNDICE DE CANDIDATOS DEL CinC 2021
// ═══════════════════════════════════════════════════════════════
// Busca en las cabeceras de Ningbo los registros que llevan un diagnóstico dado
// y los agrega a .cinc-cache/indice.json, que es de donde salen los candidatos
// de cada caso nuevo.
//
//   npm run index:cinc -- 81898007 61277005          # sobre lo ya bajado
//   npm run index:cinc -- 81898007 --grupos 20       # baja hasta el grupo 20
//
// Indexar son CABECERAS, no trazados: 700 bytes contra 120 KB. Aun así Ningbo
// tiene 35 grupos de mil registros cada uno, así que por defecto sólo mira lo
// que ya está en caché y hay que pedir explícitamente que baje más.
//
// El índice se guarda con todo lo que hace falta para decidir sin volver a
// bajar nada: grupo, edad, sexo y la lista de diagnósticos. Nombres de los
// códigos: cinc.mjs los trae de la tabla oficial del desafío.
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CACHE, FUENTES, listarGrupo, cabecera, metadatos, diccionarioDx } from './cinc.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const destino = join(CACHE, 'indice.json');

const argv = process.argv.slice(2);
const codigos = argv.filter((a) => /^\d+$/.test(a));
const iG = argv.indexOf('--grupos');
const hastaGrupo = iG >= 0 ? parseInt(argv[iG + 1], 10) : 0;   // 0 = sólo lo cacheado
if (!codigos.length) {
  console.error('Uso: npm run index:cinc -- <codigo SNOMED>... [--grupos N]');
  process.exit(1);
}

const dic = await diccionarioDx();
for (const c of codigos) console.log(`  ${c}  ${dic[c] || '(no está en el catálogo del desafío)'}`);

const indice = existsSync(destino) ? JSON.parse(readFileSync(destino, 'utf8')) : {};
const yaEsta = new Set(Object.values(indice).flat().map((x) => `${x.id}`));
const encontrados = Object.fromEntries(codigos.map((c) => [c, indice[c] ? [...indice[c]] : []]));
const vistos = Object.fromEntries(codigos.map((c) => [c, new Set((indice[c] || []).map((x) => x.id))]));

let mirados = 0, bajados = 0;
for (let g = 1; g <= FUENTES.ningbo; g++) {
  let ids;
  try { ids = await listarGrupo('ningbo', g); } catch (e) { continue; }
  for (const id of ids) {
    const local = join(CACHE, 'ningbo', `g${g}`, `${id}.hea`);
    if (!existsSync(local)) {
      if (g > hastaGrupo) continue;              // no bajar más de lo pedido
      try { await cabecera('ningbo', g, id); bajados++; } catch (e) { continue; }
    }
    mirados++;
    const meta = metadatos(local);
    for (const c of codigos) {
      if (meta.dx.includes(c) && !vistos[c].has(id)) {
        vistos[c].add(id);
        encontrados[c].push({ g, id, fs: meta.fs, age: meta.age, sex: meta.sex, dx: meta.dx });
      }
    }
  }
  process.stderr.write(`g${g} `);
}
process.stderr.write('\n');

for (const c of codigos) indice[c] = encontrados[c];
mkdirSync(dirname(destino), { recursive: true });
writeFileSync(destino, JSON.stringify(indice));
console.log(`\n${mirados} cabeceras miradas (${bajados} bajadas ahora)`);
for (const c of codigos) console.log(`  ${c}: ${encontrados[c].length} registros`);
