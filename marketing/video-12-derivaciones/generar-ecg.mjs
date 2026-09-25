import { readFileSync, writeFileSync } from 'node:fs';
import { decodeRecord } from '../../src/ecg12/record.js';
const rec = decodeRecord(JSON.parse(readFileSync(new URL('../../public/ecg12/12899.json', import.meta.url),'utf8')));
const out = {};
for (const l of rec.labels) out[l] = Array.from(rec.leads[l], v => Math.round(v*1000)/1000);
writeFileSync(process.argv[2], 'window.ECG = ' + JSON.stringify({fs: rec.fs, leads: out}) + ';\n');
console.log(rec.fs, rec.duration);
