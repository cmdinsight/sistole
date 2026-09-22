// ═══════════════════════════════════════════════════════════════
// CASOS DE 12 DERIVACIONES
// ═══════════════════════════════════════════════════════════════
// Los ocho trazados son electrocardiogramas REALES, de PTB-XL. La procedencia de
// cada uno está en records.js; acá está lo que enseña.
//
// La regla es la misma de siempre, pero ahora es más exigente: cada caso declara
// SÓLO hallazgos que su trazado muestra. Con trazados sintéticos alcanzaba con
// generar lo que el texto decía. Con trazados reales no hay esa comodidad: el
// electro es de un paciente que existió y muestra lo que muestra, así que cada
// afirmación se declara en `findings` y scripts/test-cases.mjs la comprueba
// midiendo la señal. Si un texto dice "descenso recíproco en aVL", hay un número
// que lo respalda, y si mañana deja de estar, la prueba falla.
//
// Por eso también cambió la lista de casos respecto de la versión sintética: un
// infarto lateral aislado, o unas T invertidas difusas por hemorragia
// subaracnoidea, son cuadros que PTB-XL no contiene con la limpieza necesaria
// para enseñarlos. Antes se podían dibujar; ahora no, y se reemplazaron por
// cuadros que la base sí tiene. Enseñar con un trazado inventado el hallazgo que
// se quería mostrar es más cómodo y peor.
//
// El eje sigue siendo la LOCALIZACIÓN, que es exactamente lo que no se puede
// enseñar con una sola derivación: en DII un infarto anterior y uno lateral se
// ven casi igual.
//
// La edad y el sexo son los del registro. El relato clínico —el motivo de
// consulta, la presión, la saturación— es un escenario armado alrededor del
// trazado, porque PTB-XL no publica la historia. La app lo dice explícitamente
// en cada caso; la frecuencia cardíaca no se escribe acá, se cuenta sobre el
// trazado, para que no pueda contradecirlo.

export const CASES = [
  {
    id: 'inferior-stemi',
    record: '12899',
    age: 67, sex: 'F',
    vitals: { bp: '104/62', spo2: 95, rr: 18 },
    highlight: ['II', 'III', 'aVF', 'I', 'aVL'],
    answer: 'inferior',
    metrics: { kind: 'st', leads: ['II', 'III', 'aVF', 'I', 'aVL'] },
    // Medido: II +246, III +380, aVF +311 µV; I −139, aVL −265 µV.
    findings: {
      stElevation: { leads: ['II', 'III', 'aVF'], min: 0.15 },
      stDepression: { leads: ['I', 'aVL'], min: 0.10 },
      rate: [60, 90],
      irregular: false,
    },
    stem: {
      es: 'Mujer de 67 años, hipertensa. Dolor retroesternal opresivo de 50 minutos, con náuseas y sudoración fría. Se la ve pálida y mal perfundida.',
      en: '67-year-old woman with hypertension. Fifty minutes of crushing retrosternal pain, with nausea and cold sweating. She looks pale and poorly perfused.',
      pt: 'Mulher de 67 anos, hipertensa. Dor retroesternal opressiva há 50 minutos, com náuseas e sudorese fria. Apresenta-se pálida e mal perfundida.',
    },
    options: [
      { id: 'inferior', label: { es: 'IAM inferior', en: 'Inferior STEMI', pt: 'IAM inferior' } },
      { id: 'anterior', label: { es: 'IAM anterior', en: 'Anterior STEMI', pt: 'IAM anterior' } },
      { id: 'pericarditis', label: { es: 'Pericarditis aguda', en: 'Acute pericarditis', pt: 'Pericardite aguda' } },
      { id: 'repol', label: { es: 'Repolarización precoz', en: 'Early repolarization', pt: 'Repolarização precoce' } },
    ],
    explain: {
      es: 'Elevación del ST en II, III y aVF: las tres derivaciones que miran la cara diafragmática. Y el hallazgo que confirma: descenso del ST en I y en aVL, que miran justo en sentido contrario. Eso es un cambio recíproco, y es lo que separa un infarto de una pericarditis, donde la elevación es difusa y no tiene espejo. Fijate además que III está más elevada que II: eso orienta a la coronaria derecha más que a la circunfleja.',
      en: 'ST elevation in II, III and aVF — the three leads facing the diaphragmatic wall. And the confirming finding: ST depression in I and aVL, which look in exactly the opposite direction. That is a reciprocal change, and it is what separates infarction from pericarditis, where the elevation is diffuse and has no mirror. Note too that III is more elevated than II: that points to the right coronary rather than the circumflex.',
      pt: 'Elevação do ST em II, III e aVF: as três derivações que olham a face diafragmática. E o achado que confirma: infradesnivelamento do ST em I e aVL, que olham na direção oposta. Isso é uma alteração recíproca, e é o que separa o infarto da pericardite, onde a elevação é difusa e não tem espelho. Repare ainda que III está mais elevada que II: isso orienta para a coronária direita, não para a circunflexa.',
    },
    pitfall: {
      es: 'Las náuseas y la palidez hacen que estos pacientes lleguen catalogados como "gastroenteritis" o "vagal". El infarto inferior compromete con frecuencia el nodo sinusal y el AV, así que la bradicardia, cuando aparece, es parte del cuadro y no un dato tranquilizador.',
      en: 'Nausea and pallor get these patients labelled as "gastroenteritis" or "a vagal episode". Inferior infarction often involves the sinus and AV nodes, so bradycardia, when it appears, is part of the picture and not a reassuring sign.',
      pt: 'As náuseas e a palidez fazem estes pacientes chegarem rotulados como "gastroenterite" ou "vagal". O infarto inferior compromete com frequência o nó sinusal e o AV, então a bradicardia, quando aparece, faz parte do quadro e não é um dado tranquilizador.',
    },
    action: {
      es: 'Reperfusión urgente. Antes de dar nitratos, pedí derivaciones derechas (V3R-V4R): si hay compromiso del ventrículo derecho, el paciente depende de la precarga y un nitrato puede hundirle la presión.',
      en: 'Urgent reperfusion. Before giving nitrates, obtain right-sided leads (V3R-V4R): if the right ventricle is involved, the patient is preload-dependent and a nitrate can drop the blood pressure sharply.',
      pt: 'Reperfusão urgente. Antes de administrar nitratos, solicite derivações direitas (V3R-V4R): se houver comprometimento do ventrículo direito, o paciente depende da pré-carga e um nitrato pode derrubar a pressão.',
    },
  },

  {
    id: 'anteroseptal-stemi',
    record: '20139',
    age: 82, sex: 'M',
    vitals: { bp: '132/84', spo2: 94, rr: 20 },
    highlight: ['V1', 'V2', 'V3', 'V4'],
    answer: 'anteroseptal',
    metrics: { kind: 'st', leads: ['V1', 'V2', 'V3', 'V4', 'II', 'aVF'] },
    // Medido: V1 +186, V2 +393, V3 +417, V4 +281 µV; miembros todos por debajo
    // de 35 µV. T ya negativa en V4 (−395) y V5 (−129). R que no progresa.
    findings: {
      stElevation: { leads: ['V1', 'V2', 'V3', 'V4'], min: 0.15 },
      stFlat: { leads: ['I', 'II', 'III', 'aVR', 'aVL', 'aVF'], max: 0.06 },
      tInversion: { leads: ['V4', 'V5'], min: 0.10 },
      rRegression: ['V2', 'V4'],
      rate: [70, 95],
      irregular: false,
    },
    stem: {
      es: 'Hombre de 82 años. Dolor precordial que empezó hace unas horas, ahora menos intenso, con disnea de esfuerzo. Llega caminando, acompañado por un familiar que insistió en traerlo.',
      en: '82-year-old man. Chest pain that started a few hours ago and is now less intense, with exertional breathlessness. He walks in, brought by a relative who insisted.',
      pt: 'Homem de 82 anos. Dor precordial que começou há algumas horas, agora menos intensa, com dispneia aos esforços. Chega caminhando, trazido por um familiar que insistiu.',
    },
    options: [
      { id: 'anteroseptal', label: { es: 'IAM anteroseptal', en: 'Anteroseptal STEMI', pt: 'IAM anterosseptal' } },
      { id: 'inferior', label: { es: 'IAM inferior', en: 'Inferior STEMI', pt: 'IAM inferior' } },
      { id: 'posterior', label: { es: 'IAM posterior', en: 'Posterior STEMI', pt: 'IAM posterior' } },
      { id: 'repol', label: { es: 'Repolarización precoz', en: 'Early repolarization', pt: 'Repolarização precoce' } },
    ],
    explain: {
      es: 'La elevación del ST está concentrada en V1 a V4 y las seis derivaciones de los miembros están planas. Ese reparto es el que localiza: territorio de la descendente anterior, septo y cara anterior. Hay un segundo dato que cambia el reloj del caso: en V4 y V5 la onda T ya está invertida, y la R no crece de V2 a V4 como debería. Eso no es el primer minuto de un infarto, es uno que lleva horas y ya empezó a dejar cicatriz.',
      en: 'The ST elevation is concentrated in V1 to V4 and all six limb leads are flat. That distribution is what localizes it: left anterior descending territory, septum and anterior wall. A second finding resets the clock on this case — in V4 and V5 the T wave is already inverted, and the R wave does not grow from V2 to V4 as it should. This is not the first minute of an infarct; it is one that has been running for hours and has begun to scar.',
      pt: 'A elevação do ST está concentrada de V1 a V4 e as seis derivações dos membros estão planas. Essa distribuição é o que localiza: território da descendente anterior, septo e parede anterior. Há um segundo dado que muda o relógio do caso: em V4 e V5 a onda T já está invertida, e a R não cresce de V2 a V4 como deveria. Não é o primeiro minuto de um infarto; é um que já dura horas e começou a deixar cicatriz.',
    },
    pitfall: {
      es: 'Que el dolor haya aflojado no significa que la arteria se haya abierto: significa que buena parte del músculo que dolía ya se murió. En un paciente de 82 años que llega caminando y "ya está mejor", ese alivio es el dato que más retrasa la reperfusión.',
      en: 'That the pain has eased does not mean the artery has opened: it means much of the muscle that was hurting is already dead. In an 82-year-old who walks in "already feeling better", that relief is the single finding that most delays reperfusion.',
      pt: 'A dor ter diminuído não significa que a artéria abriu: significa que boa parte do músculo que doía já morreu. Num paciente de 82 anos que chega caminhando e "já está melhor", esse alívio é o dado que mais atrasa a reperfusão.',
    },
    action: {
      es: 'Reperfusión igual, aunque hayan pasado horas y el dolor haya cedido. Vigilá el ritmo: el septo aloja el sistema de conducción, y este territorio puede dar bloqueos de rama y bloqueo AV de aparición brusca.',
      en: 'Reperfuse anyway, even though hours have passed and the pain has eased. Watch the rhythm: the septum houses the conduction system, and this territory can produce bundle branch and AV block of sudden onset.',
      pt: 'Reperfundir mesmo assim, ainda que tenham passado horas e a dor tenha cedido. Vigie o ritmo: o septo abriga o sistema de condução, e este território pode causar bloqueios de ramo e bloqueio AV de instalação súbita.',
    },
  },

  {
    id: 'anterolateral-stemi',
    record: '13913',
    age: 68, sex: 'M',
    vitals: { bp: '104/70', spo2: 91, rr: 26 },
    highlight: ['I', 'aVL', 'V2', 'V3', 'V4', 'V5', 'V6'],
    answer: 'anterolateral',
    metrics: { kind: 'st', leads: ['I', 'aVL', 'V2', 'V3', 'V4', 'V5', 'V6'] },
    // Medido: V3 +1124, V2 +856, V4 +709, V5 +373, V6 +225, I +249, aVL +138 µV.
    findings: {
      stElevation: { leads: ['I', 'aVL', 'V2', 'V3', 'V4', 'V5', 'V6'], min: 0.13 },
      rate: [110, 135],
      irregular: false,
    },
    stem: {
      es: 'Hombre de 68 años. Dolor precordial intenso, disnea y sensación de muerte inminente. Está taquicárdico, con crepitantes en ambas bases y la presión en el límite bajo.',
      en: '68-year-old man. Severe chest pain, breathlessness and a sense of impending doom. He is tachycardic, with crackles at both lung bases and borderline-low blood pressure.',
      pt: 'Homem de 68 anos. Dor precordial intensa, dispneia e sensação de morte iminente. Está taquicárdico, com crepitantes em ambas as bases e pressão no limite inferior.',
    },
    options: [
      { id: 'anterolateral', label: { es: 'IAM anterolateral extenso', en: 'Extensive anterolateral STEMI', pt: 'IAM anterolateral extenso' } },
      { id: 'anteroseptal', label: { es: 'IAM anteroseptal', en: 'Anteroseptal STEMI', pt: 'IAM anterosseptal' } },
      { id: 'inferior', label: { es: 'IAM inferior', en: 'Inferior STEMI', pt: 'IAM inferior' } },
      { id: 'pericarditis', label: { es: 'Pericarditis aguda', en: 'Acute pericarditis', pt: 'Pericardite aguda' } },
    ],
    explain: {
      es: 'La elevación cruza dos grupos de derivaciones que se miran por separado y hay que mirar juntos: las precordiales de V2 a V6 y, en el plano frontal, I y aVL. Ese cruce es lo que define "extenso": no es la cara anterior sola ni la lateral sola, es una oclusión proximal de la descendente anterior que se lleva las dos. En V3 la elevación pasa los 10 mm y el ST se funde con la T en una sola curva, que es la forma que en la guardia se llama "en lápida".',
      en: 'The elevation crosses two lead groups that tend to be read separately and must be read together: the precordial leads V2 to V6 and, in the frontal plane, I and aVL. That crossing is what makes it "extensive": not the anterior wall alone nor the lateral alone, but a proximal LAD occlusion taking both. In V3 the elevation exceeds 10 mm and the ST merges with the T into a single curve — the shape known as tombstoning.',
      pt: 'A elevação cruza dois grupos de derivações que costumam ser lidos em separado e precisam ser lidos juntos: as precordiais de V2 a V6 e, no plano frontal, I e aVL. Esse cruzamento é o que define "extenso": não é a parede anterior sozinha nem a lateral sozinha, é uma oclusão proximal da descendente anterior que leva as duas. Em V3 a elevação passa de 10 mm e o ST se funde com a T numa única curva, a forma chamada "em lápide".',
    },
    pitfall: {
      es: 'La taquicardia y los crepitantes no son ansiedad: son el ventrículo izquierdo fallando en tiempo real. Con la presión en el límite, este paciente está a un paso del shock cardiogénico, y la frecuencia alta es el único mecanismo que le queda para sostener el volumen minuto. Bajarla con un betabloqueante acá lo descompensa.',
      en: 'The tachycardia and crackles are not anxiety: they are the left ventricle failing in real time. With borderline blood pressure, this patient is one step from cardiogenic shock, and the high rate is the only mechanism left to sustain cardiac output. Slowing it with a beta-blocker here will decompensate him.',
      pt: 'A taquicardia e os crepitantes não são ansiedade: são o ventrículo esquerdo falhando em tempo real. Com a pressão no limite, este paciente está a um passo do choque cardiogênico, e a frequência alta é o único mecanismo que lhe resta para sustentar o débito. Baixá-la com um betabloqueador aqui o descompensa.',
    },
    action: {
      es: 'Angioplastia primaria sin demora. Este es el territorio que más miocardio pierde por minuto, y el paciente ya tiene signos de falla de bomba: cada minuto de retraso se traduce en función ventricular que no vuelve.',
      en: 'Primary angioplasty without delay. This is the territory that loses the most myocardium per minute, and the patient already shows pump failure: every minute of delay translates into ventricular function that does not come back.',
      pt: 'Angioplastia primária sem demora. Este é o território que mais perde miocárdio por minuto, e o paciente já tem sinais de falência de bomba: cada minuto de atraso se traduz em função ventricular que não volta.',
    },
  },

  {
    id: 'posterior-stemi',
    record: '2993',
    age: 85, sex: 'F',
    vitals: { bp: '118/70', spo2: 96, rr: 18 },
    highlight: ['V1', 'V2', 'V3', 'II', 'III', 'aVF'],
    answer: 'inferoposterior',
    metrics: { kind: 'st', leads: ['II', 'III', 'aVF', 'V1', 'V2', 'V3'] },
    // Medido: II +181, III +248, aVF +218 µV (inferior); V1 −120, V2 −356,
    // V3 −298 µV (espejo posterior); I −81, aVL −167 (recíproco); V5 +114,
    // V6 +163 (lateral). R dominante en V2 (800 contra 653 de S).
    findings: {
      stElevation: { leads: ['II', 'III', 'aVF'], min: 0.15 },
      stDepression: { leads: ['V1', 'V2', 'V3', 'aVL'], min: 0.10 },
      tInversion: { leads: ['V1', 'V2', 'V3'], min: 0.20 },
      dominantR: ['V2'],
      rate: [45, 62],
      irregular: false,
    },
    stem: {
      es: 'Mujer de 85 años con dolor torácico de dos horas. Un colega mira el trazado, ve el descenso del ST en las precordiales derechas y propone tratarla como un síndrome coronario sin elevación: anticoagular, observar y seriar troponinas.',
      en: '85-year-old woman with two hours of chest pain. A colleague looks at the tracing, sees the ST depression in the right precordial leads and proposes treating her as a non-ST-elevation syndrome: anticoagulate, observe, serial troponins.',
      pt: 'Mulher de 85 anos com dor torácica há duas horas. Um colega vê o traçado, nota o infradesnivelamento do ST nas precordiais direitas e propõe tratá-la como síndrome coronariana sem supradesnivelamento: anticoagular, observar e seriar troponinas.',
    },
    options: [
      { id: 'inferoposterior', label: { es: 'IAM inferior con extensión posterior', en: 'Inferior STEMI with posterior extension', pt: 'IAM inferior com extensão posterior' } },
      { id: 'nstemi', label: { es: 'Isquemia anterior sin elevación del ST', en: 'Anterior ischemia without ST elevation', pt: 'Isquemia anterior sem supradesnivelamento' } },
      { id: 'inferior', label: { es: 'IAM inferior aislado', en: 'Isolated inferior STEMI', pt: 'IAM inferior isolado' } },
      { id: 'hvi', label: { es: 'Sobrecarga ventricular izquierda', en: 'LV strain pattern', pt: 'Sobrecarga ventricular esquerda' } },
    ],
    explain: {
      es: 'Hay dos infartos en un solo electro y hay que ver los dos. El primero se lee directo: ST elevado en II, III y aVF, con el descenso recíproco en aVL. El segundo hay que leerlo al revés. Ninguna de las 12 derivaciones mira la cara posterior de frente, así que un infarto posterior no puede dar elevación: lo que se ve es su imagen en espejo. V1 a V3 miran la pared anterior, o sea de espaldas a la posterior, y por eso el supradesnivel llega invertido — descenso del ST y T negativa. La onda R alta de V2 es la misma imagen en espejo, pero del QRS: es la onda Q de necrosis vista desde atrás.',
      en: 'There are two infarcts in one ECG and you have to see both. The first reads directly: ST elevated in II, III and aVF, with reciprocal depression in aVL. The second has to be read backwards. None of the 12 leads faces the posterior wall head-on, so a posterior infarct cannot produce elevation: what you see is its mirror image. V1 to V3 face the anterior wall — that is, they face away from the posterior wall — so the elevation arrives inverted, as ST depression with a negative T. The tall R wave in V2 is the same mirror, applied to the QRS: it is the Q wave of necrosis seen from behind.',
      pt: 'Há dois infartos num só ECG e é preciso ver os dois. O primeiro se lê direto: ST elevado em II, III e aVF, com infradesnivelamento recíproco em aVL. O segundo tem de ser lido ao contrário. Nenhuma das 12 derivações olha de frente a parede posterior, então um infarto posterior não pode dar elevação: o que se vê é a sua imagem em espelho. V1 a V3 olham a parede anterior, ou seja, de costas para a posterior, e por isso o supradesnivelamento chega invertido — infradesnivelamento do ST e T negativa. A onda R alta de V2 é o mesmo espelho, aplicado ao QRS: é a onda Q de necrose vista por trás.',
    },
    pitfall: {
      es: 'El error del colega tiene lógica y por eso es tan frecuente: el reflejo entrenado es buscar elevación, y donde ve descenso concluye "sin elevación". Pero acá la elevación está, en las tres derivaciones inferiores, y el descenso de V1-V3 no es un segundo problema: es el mismo infarto visto desde el otro lado. Tratar esto como un síndrome sin elevación lo manda a observación en vez de a hemodinamia.',
      en: 'The colleague’s error is logical, which is why it is so common: the trained reflex is to look for elevation, and where it sees depression it concludes "no elevation". But the elevation is there, in the three inferior leads, and the V1-V3 depression is not a second problem: it is the same infarct seen from the other side. Treating this as a non-elevation syndrome sends her to observation instead of the cath lab.',
      pt: 'O erro do colega é lógico, e por isso tão frequente: o reflexo treinado é procurar elevação, e onde vê infradesnivelamento conclui "sem supradesnivelamento". Mas a elevação está lá, nas três derivações inferiores, e o infradesnivelamento de V1-V3 não é um segundo problema: é o mesmo infarto visto do outro lado. Tratar isto como síndrome sem supradesnivelamento a manda para observação em vez da hemodinâmica.',
    },
    action: {
      es: 'Reperfusión, con la misma urgencia que cualquier otro supradesnivel. Para dejarlo documentado, pedí derivaciones posteriores V7-V9: ahí la elevación se ve directa, sin tener que invertirla mentalmente.',
      en: 'Reperfusion, with the same urgency as any other ST elevation. To document it, obtain posterior leads V7-V9: there the elevation is seen directly, without having to invert it in your head.',
      pt: 'Reperfusão, com a mesma urgência de qualquer outro supradesnivelamento. Para documentar, solicite derivações posteriores V7-V9: ali a elevação aparece direta, sem precisar invertê-la mentalmente.',
    },
  },

  {
    id: 'anterior-t-inversion',
    record: '2960',
    age: 87, sex: 'M',
    vitals: { bp: '138/82', spo2: 96, rr: 18 },
    highlight: ['I', 'aVL', 'V2', 'V3', 'V4', 'V5'],
    answer: 'isquemia',
    metrics: { kind: 'st', leads: ['V2', 'V3', 'V4', 'V5'] },
    // Medido: T invertida V2 −429, V3 −390, V4 −318, V5 −260, I −168, aVL −123 µV.
    // ST en la línea de base en las doce (máximo 57 µV en V1).
    findings: {
      tInversion: { leads: ['I', 'aVL', 'V2', 'V3', 'V4', 'V5'], min: 0.10 },
      stFlat: { leads: ['I', 'II', 'aVL', 'V2', 'V3', 'V4', 'V5', 'V6'], max: 0.07 },
      rate: [65, 85],
      irregular: false,
    },
    stem: {
      es: 'Hombre de 87 años. Tuvo dos episodios de dolor torácico en las últimas 48 horas, ambos de veinte minutos, ambos cedieron solos. Ahora está sin dolor y se siente bien. Le hacen el electro antes de decidir si vuelve a la casa.',
      en: '87-year-old man. Two episodes of chest pain in the last 48 hours, each about twenty minutes, both resolving on their own. He is pain-free now and feels well. The ECG is done before deciding whether to send him home.',
      pt: 'Homem de 87 anos. Teve dois episódios de dor torácica nas últimas 48 horas, ambos de vinte minutos, ambos cederam sozinhos. Agora está sem dor e se sente bem. Fazem o ECG antes de decidir se volta para casa.',
    },
    options: [
      { id: 'isquemia', label: { es: 'Isquemia anterior y lateral, sin elevación del ST', en: 'Anterior and lateral ischemia without ST elevation', pt: 'Isquemia anterior e lateral, sem supradesnivelamento' } },
      { id: 'stemi', label: { es: 'IAM anterior agudo con elevación', en: 'Acute anterior STEMI', pt: 'IAM anterior agudo com supradesnivelamento' } },
      { id: 'normal', label: { es: 'Variante normal', en: 'Normal variant', pt: 'Variante normal' } },
      { id: 'posterior', label: { es: 'IAM posterior', en: 'Posterior STEMI', pt: 'IAM posterior' } },
    ],
    explain: {
      es: 'El segmento ST está en la línea de base en las doce derivaciones: no hay corriente de lesión, y por eso no hay supradesnivel. Lo que hay son ondas T profundamente invertidas y simétricas en V2, V3, V4 y V5, y también en I y aVL. Esa simetría importa: la T invertida de una sobrecarga ventricular es asimétrica, baja despacio y sube rápido; esta baja y sube igual. El reparto —precordiales anteriores más las laterales altas— vuelve a señalar el territorio de la descendente anterior.',
      en: 'The ST segment sits on the baseline in all twelve leads: there is no current of injury, and therefore no elevation. What there is are deeply inverted, symmetric T waves in V2, V3, V4 and V5, and also in I and aVL. That symmetry matters: the inverted T of ventricular strain is asymmetric, descending slowly and rising fast; this one descends and rises alike. The distribution — anterior precordial plus high lateral — again points to the left anterior descending territory.',
      pt: 'O segmento ST está na linha de base nas doze derivações: não há corrente de lesão e, portanto, não há supradesnivelamento. O que há são ondas T profundamente invertidas e simétricas em V2, V3, V4 e V5, e também em I e aVL. Essa simetria importa: a T invertida de uma sobrecarga ventricular é assimétrica, desce devagar e sobe rápido; esta desce e sobe igual. A distribuição — precordiais anteriores mais as laterais altas — aponta de novo para o território da descendente anterior.',
    },
    pitfall: {
      es: 'Un paciente sin dolor, con buen estado general y sin supradesnivel es el que más fácil se manda a la casa. Y este trazado, con dolor que va y viene y T invertidas en el territorio de la descendente anterior, describe una arteria críticamente estrechada que todavía no se ocluyó del todo. La ausencia de elevación no dice que no haya isquemia: dice que todavía no hay necrosis transmural.',
      en: 'A patient with no pain, looking well and with no ST elevation is the easiest one to send home. And this tracing — pain that comes and goes, inverted T waves in the LAD territory — describes a critically narrowed artery that has not fully occluded yet. The absence of elevation does not say there is no ischemia: it says there is not yet transmural necrosis.',
      pt: 'Um paciente sem dor, com bom estado geral e sem supradesnivelamento é o mais fácil de mandar para casa. E este traçado — dor que vai e vem, T invertidas no território da descendente anterior — descreve uma artéria criticamente estreitada que ainda não ocluiu de todo. A ausência de elevação não diz que não há isquemia: diz que ainda não há necrose transmural.',
    },
    action: {
      es: 'No se va a la casa. Troponinas seriadas, antiagregación y evaluación por cardiología con vistas a coronariografía. Y algo que se pasa por alto: conseguí un electro previo. Si estas T antes no estaban, el hallazgo es nuevo, y eso cambia por completo el nivel de urgencia.',
      en: 'He does not go home. Serial troponins, antiplatelet therapy and cardiology review with a view to coronary angiography. And one thing that gets overlooked: find a previous ECG. If these T waves were not there before, the finding is new, and that completely changes the level of urgency.',
      pt: 'Não vai para casa. Troponinas seriadas, antiagregação e avaliação da cardiologia com vistas a coronariografia. E algo que costuma passar despercebido: consiga um ECG anterior. Se estas T não estavam antes, o achado é novo, e isso muda completamente o nível de urgência.',
    },
  },

  {
    id: 'afib-rvr',
    record: '12632',
    age: 61, sex: 'F',
    vitals: { bp: '118/70', spo2: 94, rr: 20 },
    highlight: ['II', 'V1'],
    answer: 'afib',
    metrics: { kind: 'rhythm' },
    // Medido: variabilidad del RR 0,145 (en ritmo sinusal queda por debajo de
    // 0,05); ST plano en las doce, máximo 28 µV en V2.
    findings: {
      rate: [95, 120],
      irregular: true,
      stFlat: { leads: ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'], max: 0.07 },
    },
    stem: {
      es: 'Mujer de 61 años con palpitaciones y disnea desde hace tres horas. El pulso radial es irregular y se cuenta más lento que el latido que se ausculta.',
      en: '61-year-old woman with three hours of palpitations and breathlessness. The radial pulse is irregular and counts slower than the auscultated beat.',
      pt: 'Mulher de 61 anos com palpitações e dispneia há três horas. O pulso radial é irregular e conta mais lento que o batimento auscultado.',
    },
    options: [
      { id: 'afib', label: { es: 'Fibrilación auricular con respuesta ventricular rápida', en: 'Atrial fibrillation with rapid ventricular response', pt: 'Fibrilação atrial com resposta ventricular rápida' } },
      { id: 'tsv', label: { es: 'Taquicardia supraventricular paroxística', en: 'Paroxysmal SVT', pt: 'Taquicardia supraventricular paroxística' } },
      { id: 'sinustach', label: { es: 'Taquicardia sinusal', en: 'Sinus tachycardia', pt: 'Taquicardia sinusal' } },
      { id: 'flutter', label: { es: 'Aleteo auricular', en: 'Atrial flutter', pt: 'Flutter atrial' } },
    ],
    explain: {
      es: 'Dos hallazgos, y hacen falta los dos. Primero: no hay ondas P en ninguna derivación; la línea de base ondula sin forma, sobre todo en V1, que es la que mira de frente a la aurícula derecha. Segundo: la distancia entre QRS cambia latido a latido sin ningún patrón. Irregularmente irregular y sin P: eso es fibrilación auricular. El QRS sigue siendo angosto, así que la conducción por debajo del nodo está intacta y el problema es exclusivamente auricular.',
      en: 'Two findings, and you need both. First: there are no P waves in any lead; the baseline undulates without shape, most visibly in V1, the lead facing the right atrium head-on. Second: the distance between QRS complexes changes beat to beat with no pattern at all. Irregularly irregular and no P waves: that is atrial fibrillation. The QRS is still narrow, so conduction below the node is intact and the problem is purely atrial.',
      pt: 'Dois achados, e são necessários os dois. Primeiro: não há ondas P em nenhuma derivação; a linha de base ondula sem forma, sobretudo em V1, que olha de frente para o átrio direito. Segundo: a distância entre os QRS muda batimento a batimento sem nenhum padrão. Irregularmente irregular e sem P: isso é fibrilação atrial. O QRS continua estreito, então a condução abaixo do nó está intacta e o problema é exclusivamente atrial.',
    },
    pitfall: {
      es: 'El pulso radial más lento que el latido auscultado no es un error de medición: es el déficit de pulso, y es propio de la fibrilación. Algunos latidos llegan tan seguidos del anterior que el ventrículo no alcanzó a llenarse, eyecta poco y esa onda no se palpa en la muñeca. Contar la frecuencia en la muñeca, acá, la subestima.',
      en: 'A radial pulse slower than the auscultated beat is not a measurement error: it is the pulse deficit, and it belongs to fibrillation. Some beats come so soon after the last that the ventricle has not had time to fill, ejects little, and that wave never reaches the wrist. Counting the rate at the wrist, here, underestimates it.',
      pt: 'O pulso radial mais lento que o batimento auscultado não é erro de medição: é o déficit de pulso, próprio da fibrilação. Alguns batimentos chegam tão perto do anterior que o ventrículo não teve tempo de encher, ejeta pouco, e essa onda não chega ao punho. Contar a frequência no punho, aqui, a subestima.',
    },
    action: {
      es: 'Si está inestable, cardioversión eléctrica sincronizada. Si está estable, control de frecuencia y definir anticoagulación según el riesgo embólico. Ojo con el tiempo de evolución antes de cardiovertir a alguien estable: más de 48 horas sin anticoagular es riesgo de embolia al recuperar el ritmo sinusal.',
      en: 'If unstable, synchronized electrical cardioversion. If stable, rate control and decide on anticoagulation according to embolic risk. Mind how long the episode has lasted before cardioverting a stable patient: more than 48 hours without anticoagulation carries a risk of embolism when sinus rhythm returns.',
      pt: 'Se instável, cardioversão elétrica sincronizada. Se estável, controle de frequência e definir anticoagulação conforme o risco embólico. Atenção ao tempo de evolução antes de cardioverter um paciente estável: mais de 48 horas sem anticoagulação implica risco de embolia ao recuperar o ritmo sinusal.',
    },
  },

  {
    id: 'atrial-flutter',
    record: '5252',
    age: 84, sex: 'M',
    vitals: { bp: '124/76', spo2: 95, rr: 20 },
    highlight: ['II', 'III', 'aVF', 'V1'],
    answer: 'flutter',
    metrics: { kind: 'rhythm' },
    // Medido: 147 lpm con variabilidad del RR 0,005, o sea perfectamente
    // regular. No se declara nada del ST: ver la nota de abajo.
    findings: {
      rate: [138, 158],
      irregular: false,
    },
    stem: {
      es: 'Hombre de 84 años con palpitaciones y mareo desde la mañana. El informe automático del equipo dice: "ritmo regular, no se reconoce onda P", y agrega que habría isquemia anterior y lateral.',
      en: '84-year-old man with palpitations and dizziness since the morning. The machine’s automatic report reads: "regular rhythm, no P wave detected", and adds that there appears to be anterior and lateral ischemia.',
      pt: 'Homem de 84 anos com palpitações e tontura desde a manhã. O laudo automático do aparelho diz: "ritmo regular, não se reconhece onda P", e acrescenta que haveria isquemia anterior e lateral.',
    },
    options: [
      { id: 'flutter', label: { es: 'Aleteo auricular con conducción 2:1', en: 'Atrial flutter with 2:1 conduction', pt: 'Flutter atrial com condução 2:1' } },
      { id: 'sinustach', label: { es: 'Taquicardia sinusal', en: 'Sinus tachycardia', pt: 'Taquicardia sinusal' } },
      { id: 'tsv', label: { es: 'Taquicardia supraventricular por reentrada nodal', en: 'AV nodal reentrant tachycardia', pt: 'Taquicardia supraventricular por reentrada nodal' } },
      { id: 'afib', label: { es: 'Fibrilación auricular', en: 'Atrial fibrillation', pt: 'Fibrilação atrial' } },
    ],
    explain: {
      es: 'Taquicardia de QRS angosto, regular hasta el milímetro, cerca de 150 por minuto. Esa cifra es la pista: la aurícula en aleteo despolariza alrededor de 300 veces por minuto y el nodo AV, que no puede conducir tan rápido, deja pasar una de cada dos. 300 dividido 2 da 150. Mirá entre los QRS en II, III, aVF y V1: donde debería haber línea de base plana hay una segunda deflexión, la onda F que no conduce. Ese diente de sierra es el diagnóstico, y se ve en esas cuatro derivaciones porque el circuito del aleteo gira en la aurícula derecha, justo en el plano que ellas miran.',
      en: 'A narrow-QRS tachycardia, regular to the millimetre, close to 150 per minute. That number is the clue: the fluttering atrium depolarizes around 300 times a minute and the AV node, which cannot conduct that fast, lets one in two through. 300 divided by 2 is 150. Look between the QRS complexes in II, III, aVF and V1: where there should be flat baseline there is a second deflection, the F wave that did not conduct. That sawtooth is the diagnosis, and it shows in those four leads because the flutter circuit turns in the right atrium, in exactly the plane they face.',
      pt: 'Taquicardia de QRS estreito, regular até o milímetro, perto de 150 por minuto. Esse número é a pista: o átrio em flutter despolariza cerca de 300 vezes por minuto e o nó AV, que não consegue conduzir tão rápido, deixa passar uma a cada duas. 300 dividido por 2 dá 150. Olhe entre os QRS em II, III, aVF e V1: onde deveria haver linha de base plana há uma segunda deflexão, a onda F que não conduziu. Esse dente de serra é o diagnóstico, e aparece nessas quatro derivações porque o circuito do flutter gira no átrio direito, justamente no plano que elas olham.',
    },
    pitfall: {
      es: 'El informe automático de este mismo trazado dice que hay isquemia anterior y lateral. No la hay: las ondas F caen encima del segmento ST y lo deforman, y el algoritmo mide ese desnivel como si fuera real. Acá el ST no se puede medir, porque no queda línea de base entre latidos donde apoyarse. Es el caso en que el número del equipo hay que descartarlo, y la única forma de saberlo es reconocer primero el ritmo.',
      en: 'The automatic report for this very tracing says there is anterior and lateral ischemia. There is not: the F waves land on top of the ST segment and deform it, and the algorithm measures that deviation as if it were real. The ST simply cannot be measured here, because no baseline is left between beats to measure from. This is the case where the machine’s number has to be discarded, and the only way to know that is to recognise the rhythm first.',
      pt: 'O laudo automático deste mesmo traçado diz que há isquemia anterior e lateral. Não há: as ondas F caem sobre o segmento ST e o deformam, e o algoritmo mede esse desnivelamento como se fosse real. Aqui o ST não pode ser medido, porque não sobra linha de base entre os batimentos onde se apoiar. É o caso em que o número do aparelho deve ser descartado, e a única forma de saber isso é reconhecer primeiro o ritmo.',
    },
    action: {
      es: 'Si está inestable, cardioversión eléctrica sincronizada, que en el aleteo suele necesitar menos energía que en la fibrilación. Si está estable, control de frecuencia y anticoagulación con el mismo criterio que en la fibrilación auricular: el riesgo embólico es equivalente. Si la frecuencia no se define a ojo, maniobras vagales o adenosina frenan el nodo unos segundos y dejan las ondas F al descubierto — es diagnóstico, no tratamiento.',
      en: 'If unstable, synchronized electrical cardioversion, which in flutter usually needs less energy than in fibrillation. If stable, rate control and anticoagulation on the same criteria as atrial fibrillation: the embolic risk is equivalent. If the rhythm is not clear by eye, vagal manoeuvres or adenosine slow the node for a few seconds and lay the F waves bare — that is diagnostic, not therapeutic.',
      pt: 'Se instável, cardioversão elétrica sincronizada, que no flutter costuma exigir menos energia que na fibrilação. Se estável, controle de frequência e anticoagulação com o mesmo critério da fibrilação atrial: o risco embólico é equivalente. Se o ritmo não ficar claro a olho nu, manobras vagais ou adenosina freiam o nó por alguns segundos e deixam as ondas F à mostra — isso é diagnóstico, não tratamento.',
    },
  },

  {
    id: 'lbbb',
    record: '14219',
    age: 78, sex: 'F',
    vitals: { bp: '142/86', spo2: 96, rr: 18 },
    highlight: ['V1', 'V2', 'V3', 'I', 'aVL', 'V5', 'V6'],
    answer: 'brizq',
    metrics: { kind: 'st', leads: ['V1', 'V2', 'V3', 'I', 'aVL', 'V5', 'V6'] },
    // Medido: QRS 128 ms. V1 +343, V2 +498, V3 +348 µV con S de 1651, 2259 y
    // 1631 µV — el ST es el 21%, el 22% y el 21% de la S. I −231, aVL −182,
    // V5 −211, V6 −226 µV, con T invertida en las cuatro.
    findings: {
      qrsMs: [120, 160],
      rsPattern: ['V1', 'V2', 'V3'],
      stElevation: { leads: ['V1', 'V2', 'V3'], min: 0.20 },
      tUpright: { leads: ['V1', 'V2', 'V3'], min: 0.30 },
      stDepression: { leads: ['I', 'aVL', 'V5', 'V6'], min: 0.12 },
      tInversion: { leads: ['I', 'aVL', 'V5', 'V6'], min: 0.15 },
      dominantR: ['V5', 'V6'],
      stToSRatio: { leads: ['V1', 'V2', 'V3'], max: 0.25 },
      rate: [70, 92],
      irregular: false,
    },
    stem: {
      es: 'Mujer de 78 años con dolor torácico opresivo de una hora. En la guardia miran el electro, ven la elevación del ST en V1, V2 y V3, y activan la sala de hemodinamia por un infarto anterior.',
      en: '78-year-old woman with one hour of crushing chest pain. In the emergency department they look at the ECG, see the ST elevation in V1, V2 and V3, and activate the cath lab for an anterior infarction.',
      pt: 'Mulher de 78 anos com dor torácica opressiva há uma hora. No pronto-socorro veem o ECG, notam a elevação do ST em V1, V2 e V3 e acionam a hemodinâmica por um infarto anterior.',
    },
    options: [
      { id: 'brizq', label: { es: 'Bloqueo completo de rama izquierda', en: 'Complete left bundle branch block', pt: 'Bloqueio completo de ramo esquerdo' } },
      { id: 'anterior', label: { es: 'IAM anterior con supradesnivel', en: 'Anterior STEMI', pt: 'IAM anterior com supradesnivelamento' } },
      { id: 'hvi', label: { es: 'Hipertrofia ventricular izquierda con sobrecarga', en: 'LV hypertrophy with strain', pt: 'Hipertrofia ventricular esquerda com sobrecarga' } },
      { id: 'marcapasos', label: { es: 'Ritmo de marcapasos', en: 'Paced rhythm', pt: 'Ritmo de marca-passo' } },
    ],
    explain: {
      es: 'Mirá el ancho antes que la altura. El QRS dura 128 ms, y por encima de 120 el ventrículo izquierdo ya no se despolarizó por su rama sino de músculo en músculo, desde el derecho. Eso solo cambia las reglas de todo lo que viene después. Cuando la despolarización es anormal, la repolarización también lo es, y el ST y la T terminan apuntando al lado CONTRARIO del QRS. Se llama discordancia y está en las dos direcciones: en V1 a V3, donde el QRS es una S profunda, el ST sube y la T es positiva; en I, aVL, V5 y V6, donde el QRS es una R ancha, el ST baja y la T se invierte. Un infarto anterior no hace eso: eleva el ST donde mira la zona dañada y deja el resto sin la imagen opuesta sistemática.',
      en: 'Look at the width before the height. The QRS lasts 128 ms, and above 120 the left ventricle is no longer depolarized through its own branch but muscle to muscle, from the right. That alone changes the rules for everything that follows. When depolarization is abnormal, so is repolarization, and the ST and T end up pointing the OPPOSITE way to the QRS. It is called discordance, and it runs in both directions: in V1 to V3, where the QRS is a deep S, the ST rises and the T is upright; in I, aVL, V5 and V6, where the QRS is a broad R, the ST falls and the T inverts. An anterior infarct does not do that: it elevates the ST where the leads face the damaged wall and leaves the rest without that systematic mirror.',
      pt: 'Olhe a largura antes da altura. O QRS dura 128 ms, e acima de 120 o ventrículo esquerdo já não se despolarizou pelo seu ramo, mas de músculo em músculo, a partir do direito. Isso por si só muda as regras de tudo o que vem depois. Quando a despolarização é anormal, a repolarização também é, e o ST e a T acabam apontando para o lado CONTRÁRIO do QRS. Chama-se discordância e ocorre nas duas direções: em V1 a V3, onde o QRS é uma S profunda, o ST sobe e a T é positiva; em I, aVL, V5 e V6, onde o QRS é uma R larga, o ST desce e a T se inverte. Um infarto anterior não faz isso: eleva o ST onde as derivações olham a parede lesada e deixa o resto sem essa imagem oposta sistemática.',
    },
    pitfall: {
      es: 'El bloqueo de rama no impide diagnosticar un infarto: impide diagnosticarlo contando milímetros. Lo que se mide es la PROPORCIÓN, porque el bloqueo eleva el ST en proporción al tamaño del complejo. Acá la S de V2 baja unos 22 mm y el ST sube 5: el 22%. Por debajo del 25% la elevación la explica el bloqueo solo; por encima de ese umbral, no, y hay que pensar en oclusión. Lo mismo vale para el otro indicio: un descenso del ST en V1-V3, donde el QRS es negativo y el ST debería subir, es una discordancia rota y no la explica el bloqueo. Por eso 5 mm de elevación sobre una S enorme son esperables y 3 mm sobre una S chica no lo son.',
      en: 'A bundle branch block does not prevent diagnosing infarction: it prevents diagnosing it by counting millimetres. What you measure is the PROPORTION, because the block elevates the ST in proportion to the size of the complex. Here the S in V2 drops about 22 mm and the ST rises 5: 22%. Below 25% the elevation is explained by the block alone; above that threshold it is not, and you should think of occlusion. The same goes for the other clue: ST depression in V1-V3, where the QRS is negative and the ST should rise, is broken discordance and the block does not explain it. That is why 5 mm of elevation over a huge S is expected and 3 mm over a small S is not.',
      pt: 'O bloqueio de ramo não impede diagnosticar um infarto: impede diagnosticá-lo contando milímetros. O que se mede é a PROPORÇÃO, porque o bloqueio eleva o ST proporcionalmente ao tamanho do complexo. Aqui a S de V2 desce cerca de 22 mm e o ST sobe 5: 22%. Abaixo de 25% a elevação é explicada apenas pelo bloqueio; acima desse limiar, não, e deve-se pensar em oclusão. O mesmo vale para o outro indício: um infradesnivelamento em V1-V3, onde o QRS é negativo e o ST deveria subir, é uma discordância rompida que o bloqueio não explica. Por isso 5 mm de elevação sobre uma S enorme são esperáveis e 3 mm sobre uma S pequena não são.',
    },
    action: {
      es: 'El electro no descarta el infarto, y el dolor sigue siendo dolor: la paciente necesita troponinas seriadas, antiagregación y un electro repetido. Lo que cambia la decisión es un dato que no está en el trazado: si este bloqueo es nuevo. Buscá un electro previo antes que cualquier otra cosa. Si el bloqueo ya estaba y la proporción del ST es la esperable, no hay indicación de hemodinamia por el electro solo; si es nuevo y el cuadro clínico acompaña, se maneja como un síndrome coronario de alto riesgo.',
      en: 'The ECG does not rule out infarction, and the pain is still pain: she needs serial troponins, antiplatelet therapy and a repeat ECG. What changes the decision is a piece of information that is not in the tracing: whether this block is new. Find a previous ECG before anything else. If the block was already there and the ST proportion is as expected, the ECG alone does not indicate the cath lab; if it is new and the clinical picture fits, manage it as a high-risk acute coronary syndrome.',
      pt: 'O ECG não afasta o infarto, e a dor continua sendo dor: a paciente precisa de troponinas seriadas, antiagregação e ECG repetido. O que muda a decisão é um dado que não está no traçado: se este bloqueio é novo. Procure um ECG anterior antes de qualquer outra coisa. Se o bloqueio já existia e a proporção do ST é a esperada, o ECG sozinho não indica hemodinâmica; se é novo e o quadro clínico acompanha, trata-se como síndrome coronariana de alto risco.',
    },
  },

  {
    id: 'normal-control',
    record: '595',
    age: 47, sex: 'F',
    vitals: { bp: '118/74', spo2: 99, rr: 14 },
    highlight: [],
    answer: 'normal',
    metrics: { kind: 'st', leads: ['II', 'aVF', 'V2', 'V4', 'V6'] },
    // Medido: ningún desnivel del ST pasa de 60 µV; rS en V1 (R 235, S 1072),
    // R dominante en V6 (R 956, S 74), transición entre V3 y V4.
    findings: {
      stFlat: { leads: ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'], max: 0.07 },
      tUpright: { leads: ['I', 'II', 'V4', 'V5', 'V6'], min: 0.10 },
      tInversion: { leads: ['aVR'], min: 0.10 },
      rsPattern: ['V1'],
      dominantR: ['V5', 'V6'],
      rProgression: ['V1', 'V4'],
      rate: [65, 85],
      irregular: false,
    },
    stem: {
      es: 'Mujer de 47 años, sin síntomas. Electrocardiograma solicitado como parte de un control de salud de rutina.',
      en: '47-year-old woman, asymptomatic. Electrocardiogram requested as part of a routine health check.',
      pt: 'Mulher de 47 anos, sem sintomas. Eletrocardiograma solicitado como parte de um controle de saúde de rotina.',
    },
    options: [
      { id: 'normal', label: { es: 'Electrocardiograma normal', en: 'Normal electrocardiogram', pt: 'Eletrocardiograma normal' } },
      { id: 'inferior', label: { es: 'IAM inferior', en: 'Inferior STEMI', pt: 'IAM inferior' } },
      { id: 'posterior', label: { es: 'IAM posterior', en: 'Posterior STEMI', pt: 'IAM posterior' } },
      { id: 'isquemia', label: { es: 'Isquemia subendocárdica', en: 'Subendocardial ischemia', pt: 'Isquemia subendocárdica' } },
    ],
    explain: {
      es: 'Todo está donde tiene que estar. P positiva en II y negativa en aVR, porque el estímulo nace arriba y a la derecha y viaja hacia abajo y a la izquierda. Complejo rS en V1, con la S bien profunda, que va creciendo hasta una R dominante en V6, y la transición cae entre V3 y V4, que es donde corresponde. Segmento ST en la línea de base en las doce. Un detalle que conviene conocer: la onda T de III está invertida, y eso es una variante normal que no significa nada por sí sola.',
      en: 'Everything is where it should be. P wave upright in II and negative in aVR, because the impulse starts high and to the right and travels down and to the left. An rS complex in V1 with a good deep S, growing into a dominant R by V6, and the transition falls between V3 and V4, which is where it belongs. ST segment at baseline in all twelve leads. One detail worth knowing: the T wave in III is inverted, and that is a normal variant which on its own means nothing.',
      pt: 'Tudo está onde deve estar. P positiva em II e negativa em aVR, porque o estímulo nasce acima e à direita e viaja para baixo e para a esquerda. Complexo rS em V1, com a S bem profunda, que cresce até uma R dominante em V6, e a transição cai entre V3 e V4, que é onde corresponde. Segmento ST na linha de base nas doze. Um detalhe que convém conhecer: a onda T de III está invertida, e isso é uma variante normal que por si só não significa nada.',
    },
    pitfall: {
      es: 'Entrenarse sólo con electros patológicos produce médicos que encuentran infartos donde no los hay. Después de siete trazados anormales seguidos, la tentación es buscarle algo a este también — la T invertida de III, por ejemplo. Saber cómo se ve lo normal, y qué variantes son normales, es lo que evita estudios y cateterismos innecesarios.',
      en: 'Training only on abnormal ECGs produces clinicians who find infarcts where there are none. After seven abnormal tracings in a row, the temptation is to find something in this one too — the inverted T in III, for instance. Knowing what normal looks like, and which variants are normal, is what prevents unnecessary tests and catheterisations.',
      pt: 'Treinar apenas com ECGs patológicos produz médicos que encontram infartos onde não há. Depois de sete traçados anormais seguidos, a tentação é achar algo neste também — a T invertida de III, por exemplo. Saber como é o normal, e quais variantes são normais, é o que evita exames e cateterismos desnecessários.',
    },
    action: {
      es: 'Ninguna conducta cardiológica. Vale guardarlo: un electro normal archivado es el que después permite decir si un cambio es nuevo, y eso, en una consulta futura por dolor torácico, vale más que cualquier hallazgo aislado.',
      en: 'No cardiac action required. Worth filing: a normal ECG on record is what later allows you to say whether a change is new, and in a future visit for chest pain that is worth more than any isolated finding.',
      pt: 'Nenhuma conduta cardiológica. Vale guardá-lo: um ECG normal arquivado é o que depois permite dizer se uma alteração é nova, e isso, numa consulta futura por dor torácica, vale mais que qualquer achado isolado.',
    },
  },
];

export const CASE_IDS = CASES.map((c) => c.id);

/**
 * Devuelve las opciones de un caso en un orden que NO es el de la definición.
 *
 * En cases.js la respuesta correcta se escribe primera, porque así el archivo se
 * lee: al lado del caso está lo que enseña. Pero si se mostraran en ese orden, la
 * primera opción sería siempre la correcta y la sección se podría aprobar sin
 * mirar un solo electro, que es exactamente lo contrario de lo que se busca.
 *
 * La mezcla es determinista, derivada del id del caso: el mismo caso muestra
 * siempre el mismo orden. Eso importa porque el componente se vuelve a dibujar al
 * responder, y unas opciones que se reacomodan bajo el dedo serían un defecto.
 */
export function shuffledOptions(c) {
  // Hash del id: pequeño, estable y sin dependencias. No necesita ser bueno
  // criptográficamente, sólo repartir.
  let h = 2166136261;
  for (let i = 0; i < c.id.length; i++) { h ^= c.id.charCodeAt(i); h = Math.imul(h, 16777619); }
  const rnd = () => { h = (Math.imul(h, 1103515245) + 12345) & 0x7fffffff; return h / 0x7fffffff; };

  const out = c.options.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
