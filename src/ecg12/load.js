// ═══════════════════════════════════════════════════════════════
// CARGA DE LOS TRAZADOS
// ═══════════════════════════════════════════════════════════════
// Los registros no viajan dentro del bundle: se piden cuando hacen falta. Son
// unos 50 KB cada uno, y meterlos en el JavaScript principal haría más lenta la
// primera pantalla para todo el mundo, incluida la mayoría que nunca abre esta
// sección. Se piden de a uno, el del caso que se está mirando.
//
// Una vez pedido, el registro queda en memoria y además en el caché del
// navegador, así que volver atrás en los casos no vuelve a usar datos.

import { decodeRecord } from './record.js';

const cache = new Map();
const inFlight = new Map();

export const recordUrl = (id) => `/ecg12/${id}.json`;

/**
 * Trae y decodifica un registro. Llamarla dos veces con el mismo id mientras la
 * primera está en curso no dispara dos pedidos: se comparte la promesa.
 * @returns {Promise<{fs:number, duration:number, leads:Object, labels:string[], source:string}>}
 */
export function loadRecord(id) {
  const key = String(id);
  if (cache.has(key)) return Promise.resolve(cache.get(key));
  if (inFlight.has(key)) return inFlight.get(key);

  const p = fetch(recordUrl(key))
    .then((r) => {
      if (!r.ok) throw new Error(`No se pudo cargar el trazado ${key} (HTTP ${r.status})`);
      return r.json();
    })
    .then((json) => {
      const signal = { ...decodeRecord(json), source: json.source, id: json.id };
      cache.set(key, signal);
      inFlight.delete(key);
      return signal;
    })
    .catch((e) => { inFlight.delete(key); throw e; });

  inFlight.set(key, p);
  return p;
}

/** Pide un registro sin esperarlo, para que el caso siguiente ya esté cuando se llegue. */
export function prefetchRecord(id) {
  loadRecord(id).catch(() => {});
}
