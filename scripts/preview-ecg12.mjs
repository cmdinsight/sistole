#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
// DIBUJAR CANDIDATOS PARA MIRARLOS
// ═══════════════════════════════════════════════════════════════
//   npm run preview:ecg12 -- 12899 20139            # la hoja 3×4 completa
//   npm run preview:ecg12 -- 12899 --lead III aVL   # una derivación, en grande
//
// Deja los PNG en .ptbxl-preview/ (fuera del repositorio).
//
// Usa el MISMO draw.js que la app, no un dibujante aparte. Es la única forma de
// que lo que se revisa sea lo que después ve el estudiante: si el previsualizador
// dibujara por su cuenta, se podría aprobar un trazado que en la app se ve de
// otra manera.
//
// Este paso no es opcional aunque los números den bien. En la primera tanda
// hubo un registro con el descenso del ST más marcado de toda la base que, al
// dibujarlo, tenía las derivaciones de los miembros casi planas: la medición era
// correcta y el electro no servía para enseñar igual.
//
// Requiere Playwright, que NO es dependencia del proyecto porque sólo lo necesita
// esta herramienta:  npm i -D playwright && npx playwright install chromium

import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fetchRecord, prepareRecord } from './ptbxl.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const salida = join(raiz, '.ptbxl-preview');

const argv = process.argv.slice(2);
const derivaciones = [];
const ids = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--lead') { while (argv[i + 1] && !argv[i + 1].startsWith('--')) derivaciones.push(argv[++i]); }
  else ids.push(argv[i]);
}
if (!ids.length) { console.error('Uso: npm run preview:ecg12 -- <id> [<id>…] [--lead II III]'); process.exit(1); }

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('Falta Playwright, que esta herramienta necesita y el proyecto no incluye:');
  console.error('  npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}

mkdirSync(salida, { recursive: true });
const registros = {};
for (const id of ids) {
  process.stderr.write(`  ${id}…\r`);
  registros[id] = prepareRecord(await fetchRecord(id));
}
process.stderr.write('        \r');

// Los módulos de src/ se importan como ES modules nativos, sin compilar: son
// JavaScript a secas. Alcanza con un servidor de archivos mínimo.
const TIPOS = { '.html': 'text/html', '.js': 'text/javascript' };
const servidor = createServer(async (req, res) => {
  try {
    const ruta = join(raiz, decodeURIComponent(req.url.split('?')[0]));
    if (!ruta.startsWith(raiz)) { res.writeHead(403).end(); return; }
    const cuerpo = await readFile(ruta);
    res.writeHead(200, { 'Content-Type': TIPOS[ruta.slice(ruta.lastIndexOf('.'))] || 'application/octet-stream' });
    res.end(cuerpo);
  } catch { res.writeHead(404).end(); }
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const puerto = servidor.address().port;

const paginaPath = join(raiz, '.ptbxl-preview', 'index.html');
writeFileSync(paginaPath, `<!doctype html><meta charset="utf-8"><body style="margin:0;background:#0b1018">
<script type="module">
import { decodeRecord } from '/src/ecg12/record.js';
import { drawEcg, sheetSize } from '/src/ecg12/draw.js';
const REGISTROS = ${JSON.stringify(registros)};
const DERIVACIONES = ${JSON.stringify(derivaciones)};
const ANCHO = 1500;
for (const [id, rec] of Object.entries(REGISTROS)) {
  const senal = decodeRecord(rec);
  const vistas = DERIVACIONES.length ? DERIVACIONES.map((l) => ({ singleRow: true, rhythmLead: l })) : [{}];
  for (const v of vistas) {
    const rot = document.createElement('div');
    rot.textContent = 'PTB-XL ' + id + (v.rhythmLead ? ' · ' + v.rhythmLead : '');
    rot.style.cssText = 'color:#9fb0c8;font:600 18px ui-monospace,monospace;padding:8px 12px';
    const sz = sheetSize(v);
    const c = document.createElement('canvas');
    c.width = ANCHO; c.height = Math.round(ANCHO * sz.h / sz.w);
    c.dataset.nombre = id + (v.rhythmLead ? '-' + v.rhythmLead : '');
    drawEcg(c.getContext('2d'), { signal: senal, cssW: ANCHO, ...v });
    document.body.append(rot, c);
  }
}
document.title = 'listo';
</script></body>`);

const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1540, height: 900 } });
pagina.on('pageerror', (e) => console.error('[error en la página]', e.message));
await pagina.goto(`http://127.0.0.1:${puerto}/.ptbxl-preview/index.html`, { waitUntil: 'networkidle' });
await pagina.waitForFunction(() => document.title === 'listo', { timeout: 20000 });

const lienzos = pagina.locator('canvas');
for (let i = 0; i < await lienzos.count(); i++) {
  const nombre = await lienzos.nth(i).getAttribute('data-nombre');
  await lienzos.nth(i).screenshot({ path: join(salida, `${nombre}.png`) });
  console.log(`  ✓ .ptbxl-preview/${nombre}.png`);
}
await navegador.close();
servidor.close();
rmSync(paginaPath, { force: true });
