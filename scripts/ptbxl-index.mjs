// ═══════════════════════════════════════════════════════════════
// ÍNDICE DE PTB-XL
// ═══════════════════════════════════════════════════════════════
// Baja y lee las dos tablas de metadatos de la base: el listado de los 21.799
// registros y el diccionario de códigos SCP con que los cardiólogos los
// anotaron. Sirve para reducir el universo ANTES de medir: medir un registro
// cuesta bajarlo, y bajar veintiún mil para buscar ocho no tiene sentido.
//
// El filtro por defecto deja fuera lo que ya sabemos que no sirve para enseñar:
// registros sin revisión humana, o que la propia base marca con ruido, deriva de
// la línea de base, problemas de electrodos o marcapasos. De 21.799 quedan unos
// 12.700, y esos son el punto de partida.

import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CACHE } from './ptbxl.mjs';

const BASE = 'https://physionet.org/files/ptb-xl/1.0.3';
const TABLAS = ['ptbxl_database.csv', 'scp_statements.csv'];

/**
 * Lector de CSV. Hace falta uno de verdad y no un split por comas: la columna
 * scp_codes trae un diccionario entre comillas con comas adentro
 * ("{'IMI': 100.0, 'SR': 0.0}"), y partir por comas lo haría pedazos.
 */
export function parseCsv(text) {
  const filas = [];
  let campo = '', fila = [], entreComillas = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (entreComillas) {
      if (ch === '"') {
        if (text[i + 1] === '"') { campo += '"'; i++; }   // comilla escapada
        else entreComillas = false;
      } else campo += ch;
    } else if (ch === '"') entreComillas = true;
    else if (ch === ',') { fila.push(campo); campo = ''; }
    else if (ch === '\n') { fila.push(campo); filas.push(fila); fila = []; campo = ''; }
    else if (ch !== '\r') campo += ch;
  }
  if (campo || fila.length) { fila.push(campo); filas.push(fila); }
  const cab = filas.shift();
  return filas.filter((f) => f.length === cab.length)
              .map((f) => Object.fromEntries(cab.map((k, i) => [k, f[i]])));
}

/** El diccionario de scp_codes viene en sintaxis de Python: {'IMI': 100.0}. */
function parseScp(txt) {
  const out = {};
  for (const m of (txt || '').matchAll(/'([^']+)':\s*([\d.]+)/g)) out[m[1]] = parseFloat(m[2]);
  return out;
}

async function bajarTablas() {
  mkdirSync(CACHE, { recursive: true });
  for (const t of TABLAS) {
    const dest = join(CACHE, t);
    if (existsSync(dest)) continue;
    process.stderr.write(`  bajando ${t}…\n`);
    const r = await fetch(`${BASE}/${t}`);
    if (!r.ok) throw new Error(`${t}: HTTP ${r.status}`);
    writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
  }
}

const RUIDO = ['baseline_drift', 'static_noise', 'burst_noise', 'electrodes_problems'];

/**
 * Devuelve los registros de la base, ya parseados.
 *
 * @param {object} o
 * @param {boolean} o.soloLimpios  por defecto true: descarta lo no revisado por
 *   un humano y lo que la base marca como ruidoso o con marcapasos.
 * @returns {{id:string, age:number, sex:'M'|'F', scp:Object<string,number>,
 *            report:string, stage:string, axis:string}[]}
 */
export async function loadIndex({ soloLimpios = true } = {}) {
  await bajarTablas();
  const filas = parseCsv(readFileSync(join(CACHE, 'ptbxl_database.csv'), 'utf8'));
  return filas
    .filter((r) => {
      if (!soloLimpios) return true;
      if (r.validated_by_human !== 'True') return false;
      if ((r.pacemaker || '').trim()) return false;
      return RUIDO.every((k) => !(r[k] || '').trim());
    })
    .map((r) => ({
      id: r.ecg_id,
      // La base anonimiza las edades mayores de 89 poniendo 300. Se deja en null
      // para que nadie escriba "paciente de 300 años" en un caso.
      age: parseFloat(r.age) >= 300 ? null : Math.round(parseFloat(r.age)),
      sex: r.sex === '1' ? 'F' : 'M',
      scp: parseScp(r.scp_codes),
      report: (r.report || '').replace(/\s+/g, ' ').trim(),
      stage: r.infarction_stadium1 || '',
      axis: r.heart_axis || '',
    }));
}

/** Descripción legible de cada código SCP, para imprimir resultados. */
export async function loadScpDictionary() {
  await bajarTablas();
  const filas = parseCsv(readFileSync(join(CACHE, 'scp_statements.csv'), 'utf8'));
  const out = {};
  for (const f of filas) out[f[''] || f[Object.keys(f)[0]]] = f.description;
  return out;
}
