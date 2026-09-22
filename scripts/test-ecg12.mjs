import { synth12 } from '../src/ecg12/synth.js';

let pass=0, fail=0;
const check=(n,c,e='')=>{c?(pass++,console.log(`  ✓ ${n}`)):(fail++,console.log(`  ✗ ${n}  ${e}`));};

const fs=500;
// Ventanas dentro del primer latido (FC 72 → RR 0,833 s; la R cae en t≈0,21 s).
const win=(sig,a,b)=>sig.slice(Math.round(a*fs),Math.round(b*fs));
const mean=a=>a.reduce((x,y)=>x+y,0)/a.length;
const maxOf=a=>Math.max(...a), minOf=a=>Math.min(...a);

const measure=(leads,lead)=>{
  const s=leads[lead];
  const base=mean(win(s,0.60,0.75));          // segmento TP: línea de base
  return {
    p:    maxOf(win(s,-0.02+0.02,0.06))-base, // onda P (t≈0,00-0,06)
    pMin: minOf(win(s,0.00,0.06))-base,
    r:    maxOf(win(s,0.185,0.235))-base,     // pico R
    s:    minOf(win(s,0.185,0.260))-base,     // nadir S
    q:    minOf(win(s,0.175,0.205))-base,     // onda q septal
    st:   mean(win(s,0.265,0.340))-base,      // segmento ST
    t:    maxOf(win(s,0.360,0.420))-base,
    tMin: minOf(win(s,0.360,0.420))-base,
  };
};

console.log('\n[1] Corazón normal — polaridades que tienen que salir solas');
const norm=synth12({rate:72,fs}).leads;
const m=Object.fromEntries(['I','II','III','aVR','aVL','aVF','V1','V2','V3','V4','V5','V6'].map(l=>[l,measure(norm,l)]));

check('P positiva en II', m.II.p>0.05, `(${m.II.p.toFixed(2)})`);
check('P NEGATIVA en aVR', m.aVR.pMin<-0.05, `(${m.aVR.pMin.toFixed(2)})`);
check('QRS positivo en II', m.II.r>0.5, `(${m.II.r.toFixed(2)})`);
check('QRS NEGATIVO en aVR', m.aVR.s<-0.5, `(${m.aVR.s.toFixed(2)})`);
check('T positiva en II', m.II.t>0.1, `(${m.II.t.toFixed(2)})`);
check('T NEGATIVA en aVR', m.aVR.tMin<-0.05, `(${m.aVR.tMin.toFixed(2)})`);

console.log('\n[2] Morfología precordial');
check('V1 con patrón rS (r pequeña, S profunda)', m.V1.r>0.02 && m.V1.r<0.35 && m.V1.s<-0.4, `r=${m.V1.r.toFixed(2)} S=${m.V1.s.toFixed(2)}`);
check('V6 con patrón qR (q septal, R dominante)', m.V6.q<-0.03 && m.V6.r>0.4, `q=${m.V6.q.toFixed(2)} R=${m.V6.r.toFixed(2)}`);
check('q septal también en I y aVL', m.I.q<-0.02 && m.aVL.q<-0.02, `I=${m.I.q.toFixed(2)} aVL=${m.aVL.q.toFixed(2)}`);

console.log('\n[3] Progresión de la onda R (V1→V6)');
const prog=['V1','V2','V3','V4','V5','V6'].map(l=>m[l].r);
console.log('     R:', prog.map(v=>v.toFixed(2)).join('  '));
let mono=true; for(let i=1;i<prog.length;i++) if(prog[i]<prog[i-1]-0.01) mono=false;
check('la R crece de V1 a V6', mono);
const net=['V1','V2','V3','V4','V5','V6'].map(l=>m[l].r+m[l].s);
const trans=net.findIndex(v=>v>0);
check('zona de transición en V3-V4', trans===2||trans===3, `(transición en V${trans+1})`);

console.log('\n[4] Infarto inferior — ST en II, III, aVF y recíproco en aVL');
const inf=synth12({rate:72,fs,infarct:'inferior',stAmp:0.35,qWave:0.25}).leads;
const mi=Object.fromEntries(['I','II','III','aVR','aVL','aVF','V2'].map(l=>[l,measure(inf,l)]));
console.log('     ST:', ['II','III','aVF','aVL','I','V2'].map(l=>`${l}=${mi[l].st.toFixed(2)}`).join('  '));
check('ST elevado en II', mi.II.st>0.1, `(${mi.II.st.toFixed(2)})`);
check('ST elevado en III', mi.III.st>0.1, `(${mi.III.st.toFixed(2)})`);
check('ST elevado en aVF', mi.aVF.st>0.1, `(${mi.aVF.st.toFixed(2)})`);
check('descenso RECÍPROCO en aVL', mi.aVL.st<-0.05, `(${mi.aVL.st.toFixed(2)})`);
check('precordiales sin elevación', Math.abs(mi.V2.st)<0.12, `(V2=${mi.V2.st.toFixed(2)})`);

console.log('\n[5] Infarto anterior — ST en las precordiales, no en las inferiores');
const ant=synth12({rate:72,fs,infarct:'anterior',stAmp:0.35,qWave:0.25}).leads;
const ma=Object.fromEntries(['II','III','aVF','V1','V2','V3','V4','V6'].map(l=>[l,measure(ant,l)]));
console.log('     ST:', ['V1','V2','V3','V4','II','III'].map(l=>`${l}=${ma[l].st.toFixed(2)}`).join('  '));
check('ST elevado en V2', ma.V2.st>0.1, `(${ma.V2.st.toFixed(2)})`);
check('ST elevado en V3', ma.V3.st>0.1, `(${ma.V3.st.toFixed(2)})`);
check('ST elevado en V4', ma.V4.st>0.05, `(${ma.V4.st.toFixed(2)})`);
check('inferiores sin elevación', ma.II.st<0.08 && ma.III.st<0.08, `II=${ma.II.st.toFixed(2)} III=${ma.III.st.toFixed(2)}`);

console.log('\n[6] Señal bien formada');
const sig=synth12({rate:72,fs,duration:10});
check('12 derivaciones presentes', sig.labels.length===12 && Object.keys(sig.leads).length===12);
check('largo correcto (10 s × 500 Hz)', sig.leads.II.length===5000, `(${sig.leads.II.length})`);
check('sin NaN ni infinitos', sig.labels.every(l=>sig.leads[l].every(Number.isFinite)));
check('amplitudes en rango fisiológico (mV)', sig.labels.every(l=>{const mx=Math.max(...sig.leads[l].map(Math.abs));return mx>0.05&&mx<3.0;}));

console.log('\n[7] Determinismo y frecuencia');
const a=synth12({rate:72,fs,irregular:1}).leads.II, b=synth12({rate:72,fs,irregular:1}).leads.II;
check('el mismo caso da siempre el mismo trazado', a.every((v,i)=>v===b[i]));
// Cuenta de picos R sobre 10 s a 150 lpm → 25 latidos ±2
const fast=synth12({rate:150,fs,duration:10}).leads.II;
let peaks=0; for(let i=1;i<fast.length-1;i++) if(fast[i]>0.6&&fast[i]>=fast[i-1]&&fast[i]>fast[i+1]) peaks++;
check('a 150 lpm hay ~25 latidos en 10 s', Math.abs(peaks-25)<=2, `(${peaks})`);

console.log('\n[8] Leyes de Einthoven y Goldberger (exactas, tolerancia 1e-5)');
const L=synth12({rate:72,fs,infarct:'inferior',stAmp:0.3}).leads;
const near=(a,b,tol=1e-5)=>Math.abs(a-b)<=tol;
// Estas identidades no son aproximaciones: se cumplen por definición de las
// derivaciones. Si el modelo vectorial está bien, salen exactas sin imponerlas.
let e1=true,e2=true,e3=true,e4=true,e5=true;
for(let i=0;i<L.II.length;i+=7){
  // El ruido se suma por derivación, así que se compara el trazado limpio:
  // se reconstruye restando la parte de ruido no es posible, pero la identidad
  // se verifica sobre la proyección, que es lo que probamos con tolerancia amplia.
  if(!near(L.II[i], L.I[i]+L.III[i], 1e-5)) e1=false;
  if(!near(L.aVR[i], -(L.I[i]+L.II[i])/2, 1e-5)) e2=false;
  if(!near(L.aVL[i], (L.I[i]-L.III[i])/2, 1e-5)) e3=false;
  if(!near(L.aVF[i], (L.II[i]+L.III[i])/2, 1e-5)) e4=false;
  if(!near(L.I[i]+L.II[i]+L.III[i]-2*(L.aVR[i]+L.aVL[i]+L.aVF[i]), L.I[i]+L.II[i]+L.III[i], 0.2)) e5=e5;
}
check('II = I + III  (ley de Einthoven)', e1);
check('aVR = -(I + II) / 2', e2);
check('aVL = (I - III) / 2', e3);
check('aVF = (II + III) / 2', e4);
const amp=(sig)=>Math.max(...sig.map(Math.abs));
check('aVR no es más profunda que la R de II', amp(L.aVR)<amp(L.II)*1.15, `aVR=${amp(L.aVR).toFixed(2)} II=${amp(L.II).toFixed(2)}`);

console.log(`\n${'─'.repeat(44)}\n${pass} pasaron, ${fail} fallaron\n`);
process.exit(fail?1:0);
