// ═══════════════════════════════════════════════════════════════
// CASOS DE 12 DERIVACIONES
// ═══════════════════════════════════════════════════════════════
// Los trazados son electrocardiogramas REALES, de PTB-XL. La procedencia de
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
    id: 'lvh-strain',
    record: '1451',
    age: 69, sex: 'F',
    vitals: { bp: '168/94', spo2: 97, rr: 16 },
    highlight: ['I', 'V5', 'V6', 'V1', 'V2'],
    answer: 'hvi',
    metrics: { kind: 'st', leads: ['I', 'V5', 'V6', 'V1', 'V2'] },
    // Medido: Sokolow-Lyon 52,4 mm (S de V1 27,8 + R de V5 24,7). QRS 92 ms.
    // I −97, V5 −134, V6 −145 µV con T invertida; V1 +203, V2 +237 µV con T
    // positiva, que es la misma sobrecarga vista desde el lado opuesto.
    findings: {
      qrsMs: [70, 110],
      sokolowLyon: { min: 3.5 },
      rsPattern: ['V1', 'V2', 'V3'],
      dominantR: ['V5', 'V6'],
      stDepression: { leads: ['I', 'V5', 'V6'], min: 0.08 },
      tInversion: { leads: ['I', 'V5', 'V6'], min: 0.15 },
      stElevation: { leads: ['V1', 'V2'], min: 0.15 },
      rate: [75, 95],
      irregular: false,
    },
    stem: {
      es: 'Mujer de 69 años, hipertensa de largo tiempo y mal controlada. Consulta por disnea al esfuerzo que fue empeorando en los últimos meses. No tiene dolor torácico. Le piden un electro antes de derivarla a cardiología.',
      en: '69-year-old woman with long-standing, poorly controlled hypertension. She presents with exertional breathlessness that has worsened over recent months. She has no chest pain. An ECG is requested before referring her to cardiology.',
      pt: 'Mulher de 69 anos, hipertensa de longa data e mal controlada. Consulta por dispneia aos esforços que piorou nos últimos meses. Não tem dor torácica. Pedem um ECG antes de encaminhá-la à cardiologia.',
    },
    options: [
      { id: 'hvi', label: { es: 'Hipertrofia ventricular izquierda con sobrecarga', en: 'Left ventricular hypertrophy with strain', pt: 'Hipertrofia ventricular esquerda com sobrecarga' } },
      { id: 'isquemia', label: { es: 'Isquemia subendocárdica lateral', en: 'Lateral subendocardial ischemia', pt: 'Isquemia subendocárdica lateral' } },
      { id: 'brizq', label: { es: 'Bloqueo completo de rama izquierda', en: 'Complete left bundle branch block', pt: 'Bloqueio completo de ramo esquerdo' } },
      { id: 'anterior', label: { es: 'IAM anterior con supradesnivel', en: 'Anterior STEMI', pt: 'IAM anterior com supradesnivelamento' } },
    ],
    explain: {
      es: 'Empezá por el pie de la hoja: las precordiales están dibujadas a 5 mm/mV y no a 10, porque a escala normal no entraban. Eso ya es el primer dato. El voltaje se mide con el índice de Sokolow-Lyon, que suma la S de V1 y la R de V5: 27,8 más 24,7 son 52 mm, y el umbral son 35. Suma dos derivaciones opuestas a propósito, porque un ventrículo grande manda su vector hacia la izquierda y atrás, y eso agranda la R de las laterales y la S de V1 al mismo tiempo: son las dos caras de lo mismo. Sobre ese voltaje viene lo segundo: descenso del ST con la onda T invertida en I, V5 y V6, que es el patrón de sobrecarga. Y en V1 y V2 el ST está elevado con T positiva, que es esa misma sobrecarga vista desde el lado contrario.',
      en: 'Start at the foot of the sheet: the precordial leads are drawn at 5 mm/mV instead of 10, because at normal scale they did not fit. That is already the first finding. Voltage is measured with the Sokolow-Lyon index, which adds the S in V1 to the R in V5: 27.8 plus 24.7 is 52 mm, and the threshold is 35. It deliberately adds two opposite leads, because an enlarged ventricle sends its vector left and backwards, which enlarges the R in the lateral leads and the S in V1 at the same time: they are two faces of the same thing. On top of that voltage comes the second finding: ST depression with an inverted T in I, V5 and V6 — the strain pattern. And in V1 and V2 the ST is elevated with an upright T, which is that same strain seen from the opposite side.',
      pt: 'Comece pelo rodapé da folha: as precordiais estão desenhadas a 5 mm/mV e não a 10, porque em escala normal não cabiam. Isso já é o primeiro dado. A voltagem se mede com o índice de Sokolow-Lyon, que soma a S de V1 e a R de V5: 27,8 mais 24,7 são 52 mm, e o limiar é 35. Soma duas derivações opostas de propósito, porque um ventrículo grande manda seu vetor para a esquerda e para trás, e isso aumenta a R das laterais e a S de V1 ao mesmo tempo: são as duas faces da mesma coisa. Sobre essa voltagem vem o segundo achado: infradesnivelamento do ST com onda T invertida em I, V5 e V6, o padrão de sobrecarga. E em V1 e V2 o ST está elevado com T positiva, que é essa mesma sobrecarga vista do lado contrário.',
    },
    pitfall: {
      es: 'Este trazado es idéntico al de una isquemia lateral, y no hay forma de separarlos con un solo electro. Lo que inclina la balanza es que el ST-T está montado sobre un voltaje enorme, que la T es asimétrica —baja despacio y sube rápido, al revés que la T simétrica de la isquemia— y que un electro previo lo mostraría igual. Pero ojo con la trampa en el otro sentido, que es la peligrosa: la hipertrofia no protege de un infarto. En un paciente con sobrecarga de base, los cambios de una isquemia se suman a un ST-T que ya estaba alterado, y "es la hipertrofia de siempre" es exactamente la frase con la que se pasa por alto un infarto.',
      en: 'This tracing is identical to lateral ischemia, and there is no way to separate them from a single ECG. What tips the balance is that the ST-T sits on top of enormous voltage, that the T is asymmetric — descending slowly and rising fast, unlike the symmetric T of ischemia — and that a previous ECG would look the same. But beware the trap in the other direction, which is the dangerous one: hypertrophy does not protect against infarction. In a patient with baseline strain, ischemic changes add onto an ST-T that was already abnormal, and "it is just the usual hypertrophy" is exactly the sentence with which an infarct gets missed.',
      pt: 'Este traçado é idêntico ao de uma isquemia lateral, e não há como separá-los com um único ECG. O que inclina a balança é que o ST-T está montado sobre uma voltagem enorme, que a T é assimétrica — desce devagar e sobe rápido, ao contrário da T simétrica da isquemia — e que um ECG anterior o mostraria igual. Mas atenção à armadilha no outro sentido, que é a perigosa: a hipertrofia não protege de um infarto. Num paciente com sobrecarga de base, as alterações isquêmicas se somam a um ST-T já alterado, e "é a hipertrofia de sempre" é exatamente a frase com que se deixa passar um infarto.',
    },
    action: {
      es: 'Acá no hay indicación de hemodinamia: esta paciente no tiene dolor y el electro es compatible con su hipertensión de años. Lo que corresponde es un ecocardiograma, que confirma la hipertrofia y busca la causa —hipertensión, estenosis aórtica, miocardiopatía hipertrófica—, y ajustar el tratamiento antihipertensivo. Guardá este electro: el día que consulte por dolor torácico, este trazado es lo que va a permitir decir si algo cambió.',
      en: 'There is no indication for the cath lab here: this patient has no pain and the ECG fits her years of hypertension. What is needed is an echocardiogram, which confirms the hypertrophy and looks for the cause — hypertension, aortic stenosis, hypertrophic cardiomyopathy — and adjustment of her antihypertensive treatment. File this ECG: the day she comes in with chest pain, this tracing is what will let you say whether anything changed.',
      pt: 'Aqui não há indicação de hemodinâmica: esta paciente não tem dor e o ECG é compatível com sua hipertensão de anos. O que cabe é um ecocardiograma, que confirma a hipertrofia e busca a causa — hipertensão, estenose aórtica, miocardiopatia hipertrófica — e ajustar o tratamento anti-hipertensivo. Guarde este ECG: no dia em que ela consultar por dor torácica, este traçado é o que vai permitir dizer se algo mudou.',
    },
  },

  {
    id: 'long-qt',
    record: '8198',
    age: 49, sex: 'F',
    vitals: { bp: '112/70', spo2: 98, rr: 14 },
    highlight: ['II', 'V3', 'V4', 'V5'],
    answer: 'qtlargo',
    metrics: { kind: 'qt', threshold: 460 },
    // Medido: QT 458 ms a 65 lpm. QTc 475 por Bazett y 469 por Fridericia, que
    // a esta frecuencia casi coinciden. Once derivaciones medibles, todas dentro
    // de 46 ms. ST plano en las doce (máximo 42 µV en V2).
    findings: {
      qtcMs: [455, 500],
      qtSpreadMs: { max: 60 },
      qrsMs: [70, 110],
      tUpright: { leads: ['II', 'V3', 'V4', 'V5'], min: 0.25 },
      stFlat: { leads: ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'], max: 0.06 },
      rate: [58, 75],
      irregular: false,
    },
    stem: {
      es: 'Mujer de 49 años traída por un desmayo mientras hacía la cola en una farmacia. Se recuperó sola en menos de un minuto. Toma citalopram desde hace años; esta semana le agregaron azitromicina por una bronquitis y ondansetrón porque el antibiótico le daba náuseas.',
      en: '49-year-old woman brought in after fainting while queuing at a pharmacy. She recovered on her own in under a minute. She has taken citalopram for years; this week azithromycin was added for bronchitis, and ondansetron because the antibiotic was making her nauseated.',
      pt: 'Mulher de 49 anos trazida após um desmaio enquanto fazia fila numa farmácia. Recuperou-se sozinha em menos de um minuto. Toma citalopram há anos; esta semana acrescentaram azitromicina por uma bronquite e ondansetrona porque o antibiótico lhe dava náuseas.',
    },
    options: [
      { id: 'qtlargo', label: { es: 'QT prolongado', en: 'Prolonged QT', pt: 'QT prolongado' } },
      { id: 'normal', label: { es: 'Electrocardiograma normal', en: 'Normal electrocardiogram', pt: 'Eletrocardiograma normal' } },
      { id: 'isquemia', label: { es: 'Isquemia subendocárdica difusa', en: 'Diffuse subendocardial ischemia', pt: 'Isquemia subendocárdica difusa' } },
      { id: 'qtcorto', label: { es: 'QT corto por hipercalcemia', en: 'Short QT from hypercalcemia', pt: 'QT curto por hipercalcemia' } },
    ],
    explain: {
      es: 'A primera vista no hay nada: ritmo sinusal, QRS angosto, ST en la línea de base en las doce derivaciones. Lo anormal es un intervalo, y los intervalos no saltan a la vista, hay que medirlos. El QT va desde el comienzo del QRS hasta que termina la onda T, y acá mide 458 ms. Después hay que corregirlo por la frecuencia, porque el QT se acorta solo cuando el corazón se acelera: a 65 lpm la corrección de Bazett lo deja en 475 ms, y el umbral en una mujer son 460. La de Fridericia da 469, y que las dos coincidan no es casualidad — se separan en los extremos de frecuencia, y a 65 lpm ninguna está forzando nada.',
      en: 'At first glance there is nothing: sinus rhythm, narrow QRS, ST on the baseline in all twelve leads. What is abnormal is an interval, and intervals do not jump out at you — they have to be measured. The QT runs from the start of the QRS to the end of the T wave, and here it is 458 ms. Then it must be corrected for rate, because the QT shortens on its own as the heart speeds up: at 65 bpm Bazett\u2019s correction gives 475 ms, and the threshold in a woman is 460. Fridericia gives 469, and the two agreeing is not a coincidence — they diverge at the extremes of rate, and at 65 bpm neither is straining.',
      pt: 'À primeira vista não há nada: ritmo sinusal, QRS estreito, ST na linha de base nas doze derivações. O anormal é um intervalo, e intervalos não saltam à vista — é preciso medi-los. O QT vai do início do QRS até o fim da onda T, e aqui mede 458 ms. Depois há que corrigi-lo pela frequência, porque o QT encurta sozinho quando o coração acelera: a 65 bpm a correção de Bazett o deixa em 475 ms, e o limiar numa mulher é 460. A de Fridericia dá 469, e as duas coincidirem não é acaso — elas se separam nos extremos de frequência, e a 65 bpm nenhuma está forçando nada.',
    },
    pitfall: {
      es: 'El error está en dónde se decide que la T terminó. La onda T no termina en un punto nítido: se va acostando sobre la línea de base. Si uno espera a que la toque, el QT sale largo siempre. Y si detrás hay una onda U —frecuente cuando el potasio está bajo— y se la incluye, lo que se midió es un QU y el número sobra decenas de milisegundos. Lo que se hace es prolongar con una regla la parte más empinada de la bajada de la T y marcar dónde esa recta cruza la línea de base. Acá la T es alta y vuelve limpia, así que el final es poco discutible; en un trazado con la T chata, el QT deja de ser un número confiable y conviene decirlo en vez de informarlo igual.',
      en: 'The error is in deciding where the T ended. The T wave does not end at a sharp point: it lies down onto the baseline. If you wait for it to touch, the QT always comes out long. And if there is a U wave behind it — common when potassium is low — and you include it, what you measured is a QU and the number is tens of milliseconds too long. What you do is extend the steepest part of the T\u2019s downslope with a ruler and mark where that line crosses the baseline. Here the T is tall and returns cleanly, so the end is hard to argue with; on a tracing with a flat T, the QT stops being a reliable number and it is better to say so than to report it anyway.',
      pt: 'O erro está em decidir onde a T terminou. A onda T não termina num ponto nítido: vai se deitando sobre a linha de base. Se você esperar que a toque, o QT sai sempre longo. E se atrás houver uma onda U — frequente quando o potássio está baixo — e você a incluir, o que mediu foi um QU e o número sobra dezenas de milissegundos. O que se faz é prolongar com uma régua a parte mais íngreme da descida da T e marcar onde essa reta cruza a linha de base. Aqui a T é alta e volta limpa, então o final é pouco discutível; num traçado com a T achatada, o QT deixa de ser um número confiável e convém dizê-lo em vez de informá-lo assim mesmo.',
    },
    action: {
      es: 'Lo primero es la lista de medicamentos, y en este caso alcanza con leerla: citalopram, azitromicina y ondansetrón prolongan el QT los tres, y acá están los tres juntos. Suspender lo que se pueda —el ondansetrón y el antibiótico son los agregados recientes— y consultar por el citalopram antes de tocarlo. Pedir potasio, magnesio y calcio, porque un electrolito bajo multiplica el efecto de los fármacos. Y repetir el electro: lo que importa no es sólo el número de hoy sino si baja al sacar las drogas. Un desmayo con el QT prolongado no es un desmayo cualquiera; puede haber sido una torsades que cedió sola.',
      en: 'The first step is the medication list, and in this case reading it is enough: citalopram, azithromycin and ondansetron all prolong the QT, and here all three are together. Stop what can be stopped — the ondansetron and the antibiotic are the recent additions — and consult before touching the citalopram. Check potassium, magnesium and calcium, because a low electrolyte multiplies the drugs\u2019 effect. And repeat the ECG: what matters is not only today\u2019s number but whether it falls once the drugs are removed. A faint with a prolonged QT is not an ordinary faint; it may have been a torsades that stopped on its own.',
      pt: 'O primeiro passo é a lista de medicamentos, e neste caso basta lê-la: citalopram, azitromicina e ondansetrona prolongam o QT, e aqui estão os três juntos. Suspender o que for possível — a ondansetrona e o antibiótico são os acréscimos recentes — e consultar antes de mexer no citalopram. Pedir potássio, magnésio e cálcio, porque um eletrólito baixo multiplica o efeito dos fármacos. E repetir o ECG: o que importa não é só o número de hoje, mas se ele cai ao retirar as drogas. Um desmaio com QT prolongado não é um desmaio qualquer; pode ter sido uma torsades que cedeu sozinha.',
    },
  },

  {
    id: 'digitalis',
    record: '15985',
    age: 84, sex: 'F',
    vitals: { bp: '126/72', spo2: 96, rr: 16 },
    highlight: ['II', 'III', 'aVF', 'V4', 'V5', 'V6'],
    answer: 'digital',
    metrics: { kind: 'st', leads: ['II', 'aVF', 'V4', 'V5', 'V6'], sag: ['V5', 'V6', 'aVF'] },
    // Medido: ST II −171, aVF −150, V4 −175, V5 −198, V6 −164 µV, con la cubeta
    // hundiéndose 100 µV bajo el punto J en V5 y 87 en V6. Ritmo irregular
    // (variación del RR 0,199), QRS de 76 ms, R dominante en V5 y V6.
    findings: {
      irregular: true,
      qrsMs: [60, 110],
      stDepression: { leads: ['II', 'aVF', 'V4', 'V5', 'V6'], min: 0.12 },
      stSag: { leads: ['V5', 'V6', 'aVF'], min: 0.07 },
      tInversion: { leads: ['II', 'aVF', 'V4', 'V5', 'V6'], min: 0.18 },
      dominantR: ['V4', 'V5', 'V6'],
    },
    stem: {
      es: 'Mujer de 84 años con fibrilación auricular conocida, en control de rutina. No tiene dolor torácico ni disnea. El médico que la ve mira el electro, encuentra descenso del ST en seis derivaciones y se pregunta si hay que estudiarla por enfermedad coronaria.',
      en: '84-year-old woman with known atrial fibrillation, at a routine check-up. She has no chest pain or breathlessness. The doctor seeing her looks at the ECG, finds ST depression in six leads, and wonders whether she should be worked up for coronary disease.',
      pt: 'Mulher de 84 anos com fibrilação atrial conhecida, em consulta de rotina. Não tem dor torácica nem dispneia. O médico que a atende vê o ECG, encontra infradesnivelamento do ST em seis derivações e se pergunta se deve investigá-la por doença coronariana.',
    },
    options: [
      { id: 'digital', label: { es: 'Efecto digitálico sobre fibrilación auricular', en: 'Digitalis effect on atrial fibrillation', pt: 'Efeito digitálico sobre fibrilação atrial' } },
      { id: 'isquemia', label: { es: 'Isquemia subendocárdica extensa', en: 'Extensive subendocardial ischemia', pt: 'Isquemia subendocárdica extensa' } },
      { id: 'hvi', label: { es: 'Hipertrofia ventricular izquierda con sobrecarga', en: 'LV hypertrophy with strain', pt: 'Hipertrofia ventricular esquerda com sobrecarga' } },
      { id: 'intoxicacion', label: { es: 'Intoxicación digitálica', en: 'Digitalis toxicity', pt: 'Intoxicação digitálica' } },
    ],
    explain: {
      es: 'Dos cosas, y la segunda explica a la primera. El ritmo es irregularmente irregular y sin ondas P: fibrilación auricular. Y el ST está descendido en II, III, aVF y de V4 a V6, pero con una forma particular: no baja derecho ni se queda plano, se hunde por debajo del punto J —un milímetro en V5— y vuelve a subir hacia la T. Esa concavidad es lo que se llama cubeta, y es la marca del efecto digitálico. La pregunta que la ordena todo no es del electro sino de la historia: ¿por qué está en fibrilación auricular una mujer de 84 años? Porque la tiene hace años. ¿Y con qué se le controla la frecuencia? Con digoxina.',
      en: 'Two things, and the second explains the first. The rhythm is irregularly irregular with no P waves: atrial fibrillation. And the ST is depressed in II, III, aVF and V4 to V6, but with a particular shape: it does not slope straight down nor stay flat — it dips below the J point, a millimetre in V5, and rises again towards the T. That concavity is what is called the sag, or scoop, and it is the mark of digitalis effect. The question that orders everything is not on the ECG but in the history: why is an 84-year-old woman in atrial fibrillation? Because she has had it for years. And what controls her rate? Digoxin.',
      pt: 'Duas coisas, e a segunda explica a primeira. O ritmo é irregularmente irregular e sem ondas P: fibrilação atrial. E o ST está infradesnivelado em II, III, aVF e de V4 a V6, mas com uma forma peculiar: não desce reto nem fica plano, afunda abaixo do ponto J — um milímetro em V5 — e volta a subir rumo à T. Essa concavidade é a chamada cubeta, e é a marca do efeito digitálico. A pergunta que ordena tudo não está no ECG, mas na história: por que uma mulher de 84 anos está em fibrilação atrial? Porque a tem há anos. E com o que se controla a frequência? Com digoxina.',
    },
    pitfall: {
      es: 'Acá hay dos trampas, y conviene ser franco con la segunda. La primera: «efecto» no es «intoxicación». La cubeta aparece con dosis correctas, es esperable en quien toma digoxina y no indica suspenderla ni pedir una digoxinemia. La intoxicación se ve de otra manera —náuseas, alteraciones visuales, y sobre todo arritmias: taquicardia auricular con bloqueo, extrasístoles, taquicardia ventricular bidireccional—, y el grado de cubeta no dice nada del nivel en sangre. La segunda trampa es más incómoda: esta forma NO descarta isquemia. Se midió sobre la base entera, y los registros con digital se hunden 35 µV bajo el punto J contra 25 de los de isquemia lateral, con mucha superposición. La forma orienta; lo que decide es la lista de medicamentos y el cuadro clínico, no el trazado.',
      en: 'There are two traps here, and the second deserves candour. The first: "effect" is not "toxicity". The sag appears at correct doses, is expected in anyone taking digoxin, and does not call for stopping the drug or checking a level. Toxicity looks different — nausea, visual disturbance, and above all arrhythmias: atrial tachycardia with block, ectopy, bidirectional ventricular tachycardia — and the degree of sag says nothing about the blood level. The second trap is less comfortable: this shape does NOT rule out ischemia. Measured across the whole dataset, digitalis records dip 35 µV below the J point against 25 for lateral ischemia, with heavy overlap. The shape points; what decides is the medication list and the clinical picture, not the tracing.',
      pt: 'Aqui há duas armadilhas, e com a segunda convém ser franco. A primeira: «efeito» não é «intoxicação». A cubeta aparece com doses corretas, é esperável em quem toma digoxina e não indica suspendê-la nem pedir dosagem. A intoxicação se apresenta de outro modo — náuseas, alterações visuais e sobretudo arritmias: taquicardia atrial com bloqueio, extrassístoles, taquicardia ventricular bidirecional — e o grau de cubeta nada diz sobre o nível sanguíneo. A segunda armadilha é mais incômoda: esta forma NÃO afasta isquemia. Medido sobre toda a base, os registros com digital afundam 35 µV abaixo do ponto J contra 25 dos de isquemia lateral, com muita superposição. A forma orienta; quem decide é a lista de medicamentos e o quadro clínico, não o traçado.',
    },
    action: {
      es: 'Ninguna conducta por el electro. Una paciente sin dolor, en fibrilación conocida y con la frecuencia controlada, con un patrón compatible con la medicación que toma, no necesita un estudio coronario por este trazado. Lo que sí corresponde es revisar la digoxinemia si hay síntomas, la función renal —la digoxina se elimina por riñón y en una persona de 84 años ese margen se estrecha— y el potasio, porque la hipopotasemia favorece la intoxicación. Y guardar el electro: si algún día consulta por dolor, este trazado es lo que va a permitir decir qué es nuevo y qué estaba desde antes.',
      en: 'No action because of the ECG. A patient with no pain, in known fibrillation with a controlled rate, showing a pattern compatible with the medication she takes, does not need a coronary workup on the strength of this tracing. What is appropriate is to check a digoxin level if she has symptoms, renal function — digoxin is cleared by the kidney and at 84 that margin narrows — and potassium, because hypokalemia predisposes to toxicity. And to file the ECG: if she ever comes in with pain, this tracing is what will let you say what is new and what was already there.',
      pt: 'Nenhuma conduta pelo ECG. Uma paciente sem dor, em fibrilação conhecida e com frequência controlada, com um padrão compatível com a medicação que toma, não precisa de investigação coronariana por causa deste traçado. O que cabe é verificar a digoxinemia se houver sintomas, a função renal — a digoxina é eliminada pelo rim e aos 84 anos essa margem se estreita — e o potássio, porque a hipocalemia favorece a intoxicação. E guardar o ECG: se um dia ela consultar por dor, este traçado é o que permitirá dizer o que é novo e o que já estava.',
    },
  },

  {
    id: 'rbbb',
    record: '2017',
    age: 82, sex: 'F',
    vitals: { bp: '138/78', spo2: 97, rr: 15 },
    highlight: ['V1', 'V2', 'I', 'V6'],
    answer: 'brder',
    metrics: { kind: 'qrs', secondR: ['V1', 'V2'], sDepth: ['I', 'V6'] },
    // Medido: QRS 136 ms. En V1 el complejo es rsR' — r de 429 µV, S de 455,
    // y una segunda R de 882. La misma fuerza tardía cava una S de 260 µV en I
    // y 235 en V6. T invertida en V1 (−258 µV), que es el cambio secundario.
    findings: {
      qrsMs: [125, 165],
      secondR: { leads: ['V1', 'V2'], min: 0.40 },
      dominantR: ['V1'],
      sDepth: { leads: ['I', 'V6'], min: 0.15 },
      tInversion: { leads: ['V1'], min: 0.15 },
      rate: [60, 80],
      irregular: false,
    },
    stem: {
      es: 'Mujer de 82 años, sin síntomas, en evaluación previa a una cirugía de cadera. El electro lo mira alguien que ve el QRS ancho y frena el trámite: quiere saber si esto es un bloqueo de rama y si cambia algo antes de operar.',
      en: '82-year-old woman, asymptomatic, being assessed before hip surgery. The ECG is read by someone who sees the wide QRS and pauses the paperwork: they want to know whether this is a bundle branch block and whether it changes anything before operating.',
      pt: 'Mulher de 82 anos, sem sintomas, em avaliação pré-operatória de cirurgia de quadril. O ECG é visto por alguém que nota o QRS largo e interrompe o trâmite: quer saber se isto é um bloqueio de ramo e se muda algo antes de operar.',
    },
    options: [
      { id: 'brder', label: { es: 'Bloqueo completo de rama derecha', en: 'Complete right bundle branch block', pt: 'Bloqueio completo de ramo direito' } },
      { id: 'brizq', label: { es: 'Bloqueo completo de rama izquierda', en: 'Complete left bundle branch block', pt: 'Bloqueio completo de ramo esquerdo' } },
      { id: 'posterior', label: { es: 'IAM posterior', en: 'Posterior STEMI', pt: 'IAM posterior' } },
      { id: 'hvd', label: { es: 'Hipertrofia ventricular derecha', en: 'Right ventricular hypertrophy', pt: 'Hipertrofia ventricular direita' } },
    ],
    explain: {
      es: 'El QRS dura 136 ms: hay un ventrículo que se despolariza tarde. La pregunta es cuál, y la contesta V1, que es la derivación que mira de frente al ventrículo derecho. Ahí el complejo tiene tres partes: una r chica, una S, y después una SEGUNDA R más alta que la primera, de casi 9 mm. Eso es el rsR’, las orejas de conejo, y esa segunda onda es el ventrículo derecho despolarizándose solo, cuando el izquierdo ya terminó. La otra cara está en I y V6: miran desde la izquierda, esa misma fuerza tardía se aleja de ellas, y les cava una onda S ancha. Y la T invertida de V1 no es isquemia: es el cambio de repolarización que acompaña a cualquier despolarización anormal.',
      en: 'The QRS lasts 136 ms: one ventricle is depolarizing late. Which one is answered by V1, the lead that faces the right ventricle head-on. There the complex has three parts: a small r, an S, and then a SECOND R, taller than the first, at almost 9 mm. That is the rsR’ — the rabbit ears — and that second wave is the right ventricle depolarizing alone, after the left has finished. The other face of it is in I and V6: they look from the left, that same late force moves away from them, and it carves a broad S. And the inverted T in V1 is not ischemia: it is the repolarization change that accompanies any abnormal depolarization.',
      pt: 'O QRS dura 136 ms: há um ventrículo que se despolariza tarde. Qual deles é respondido por V1, a derivação que olha de frente o ventrículo direito. Ali o complexo tem três partes: uma r pequena, uma S, e depois uma SEGUNDA R mais alta que a primeira, de quase 9 mm. Isso é o rsR’, as orelhas de coelho, e essa segunda onda é o ventrículo direito se despolarizando sozinho, quando o esquerdo já terminou. A outra face está em I e V6: olham desde a esquerda, essa mesma força tardia se afasta delas e cava uma onda S larga. E a T invertida de V1 não é isquemia: é a alteração de repolarização que acompanha qualquer despolarização anormal.',
    },
    pitfall: {
      es: 'Con un QRS ancho, la pregunta que ordena todo es cuál de las dos ramas está bloqueada, y se contesta mirando V1 y nada más: si hay una segunda R alta, es la derecha; si hay una S profunda y ancha, es la izquierda. Vale la pena comparar este trazado con el del caso de rama izquierda, porque los dos son anchos y en V1 son opuestos. La otra confusión es con una R alta en V1 sin bloqueo —infarto posterior, hipertrofia derecha—: ahí la R es alta pero es UNA sola, y el QRS es angosto. Y un dato que separa a las dos ramas en la práctica: el bloqueo derecho deja el ST legible fuera de V1-V3, así que un infarto se puede diagnosticar igual; el izquierdo no.',
      en: 'With a wide QRS, the question that orders everything is which of the two branches is blocked, and it is answered by looking at V1 and nothing else: a tall second R means the right; a deep broad S means the left. It is worth comparing this tracing with the left bundle branch block case, because both are wide and in V1 they are opposites. The other confusion is a tall R in V1 without a block — posterior infarct, right ventricular hypertrophy: there the R is tall but there is only ONE, and the QRS is narrow. And one practical point that separates the two branches: right bundle branch block leaves the ST readable outside V1-V3, so an infarct can still be diagnosed; the left one does not.',
      pt: 'Com um QRS largo, a pergunta que ordena tudo é qual dos dois ramos está bloqueado, e se responde olhando V1 e nada mais: se há uma segunda R alta, é o direito; se há uma S profunda e larga, é o esquerdo. Vale comparar este traçado com o do caso de ramo esquerdo, porque os dois são largos e em V1 são opostos. A outra confusão é com uma R alta em V1 sem bloqueio — infarto posterior, hipertrofia direita: ali a R é alta mas é UMA só, e o QRS é estreito. E um dado que separa os dois ramos na prática: o bloqueio direito deixa o ST legível fora de V1-V3, então um infarto ainda pode ser diagnosticado; o esquerdo não.',
    },
    action: {
      es: 'Ninguna conducta, y la cirugía sigue. Un bloqueo de rama derecha aislado, en una persona sin síntomas, es un hallazgo frecuente que aumenta con la edad y no contraindica nada por sí solo. Lo que sí conviene es buscar un electro previo —si el bloqueo ya estaba, la tranquilidad es mayor— y mirar si viene acompañado: un hemibloqueo anterior izquierdo junto al bloqueo derecho es un bloqueo bifascicular, y eso, con síncope, ya es otra conversación. Acá no lo hay.',
      en: 'No action, and the surgery proceeds. An isolated right bundle branch block in someone without symptoms is a common finding that increases with age and does not contraindicate anything on its own. What is worth doing is finding a previous ECG — if the block was already there, the reassurance is greater — and checking whether it comes with company: a left anterior fascicular block alongside the right bundle block is bifascicular block, and that, with syncope, is a different conversation. There is none here.',
      pt: 'Nenhuma conduta, e a cirurgia segue. Um bloqueio de ramo direito isolado, numa pessoa sem sintomas, é um achado frequente que aumenta com a idade e não contraindica nada por si só. O que convém é procurar um ECG anterior — se o bloqueio já existia, a tranquilidade é maior — e ver se vem acompanhado: um hemibloqueio anterior esquerdo junto ao bloqueio direito é um bloqueio bifascicular, e isso, com síncope, é outra conversa. Aqui não há.',
    },
  },

  {
    id: 'lafb',
    record: '41',
    age: 42, sex: 'M',
    vitals: { bp: '124/78', spo2: 98, rr: 14 },
    highlight: ['I', 'aVL', 'II', 'III', 'aVF'],
    answer: 'hemibloqueo',
    metrics: { kind: 'axis', leads: ['I', 'aVL', 'II', 'III', 'aVF'] },
    // Medido: eje −70°, QRS de 96 ms. En I y aVL el complejo es neto positivo;
    // en II, III y aVF, neto negativo, con una r inicial de 581, 430 y 466 µV
    // —hay r, no una Q— y una S de 1299, 1526 y 1416.
    findings: {
      axisDeg: [-85, -55],
      qrsMs: [80, 115],
      dominantR: ['I', 'aVL'],
      rsPattern: ['II', 'III', 'aVF'],
      rHeight: { leads: ['II', 'III', 'aVF'], min: 0.30 },
      // El ST plano se afirma sólo de las derivaciones de los miembros, que es
      // donde vive el hallazgo. En V2 y V3 hay 2,2 y 1,8 mm de elevación, que en
      // un hombre de 42 años están dentro de lo normal — y el texto lo dice, en
      // vez de callarlo y dejar que el lector desconfíe.
      stFlat: { leads: ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V5', 'V6'], max: 0.06 },
      rate: [62, 85],
      irregular: false,
    },
    stem: {
      es: 'Hombre de 42 años, sin síntomas, electro de control laboral. El informe automático del equipo dice «ueberdrehter Linkstyp» —eje desviado a la izquierda— y el resto, normal. Le preguntan si eso significa algo.',
      en: '42-year-old man, asymptomatic, ECG for an occupational check-up. The machine\u2019s report reads "left axis deviation" and otherwise normal. He asks whether that means anything.',
      pt: 'Homem de 42 anos, sem sintomas, ECG de controle ocupacional. O laudo automático do aparelho diz «desvio do eixo para a esquerda» e o resto, normal. Ele pergunta se isso significa algo.',
    },
    options: [
      { id: 'hemibloqueo', label: { es: 'Hemibloqueo anterior izquierdo', en: 'Left anterior fascicular block', pt: 'Hemibloqueio anterior esquerdo' } },
      { id: 'inferior', label: { es: 'IAM inferior antiguo', en: 'Old inferior infarct', pt: 'IAM inferior antigo' } },
      { id: 'brizq', label: { es: 'Bloqueo completo de rama izquierda', en: 'Complete left bundle branch block', pt: 'Bloqueio completo de ramo esquerdo' } },
      { id: 'normal', label: { es: 'Variante normal sin significado', en: 'Normal variant of no significance', pt: 'Variante normal sem significado' } },
    ],
    explain: {
      es: 'El eje es hacia dónde apunta, en promedio, la despolarización del ventrículo, y acá vale −70°: bien por encima de la horizontal, arriba y a la izquierda. Se lee sin calcular nada, mirando qué complejos son netos positivos y cuáles negativos: I y aVL hacia arriba, II, III y aVF hacia abajo. El vector va hacia donde apuntan las positivas. La explicación está en la anatomía: la rama izquierda se divide en dos fascículos, y si el anterior no conduce, el ventrículo izquierdo se activa desde el posterior, o sea desde abajo y atrás, y el frente de despolarización sale hacia arriba y a la izquierda. Fijate también en el ancho: 96 ms, angosto. Falló un fascículo, no la rama entera, y por eso el complejo no se ensancha.',
      en: 'The axis is the average direction of ventricular depolarization, and here it is −70°: well above the horizontal, up and to the left. You read it without calculating anything, by looking at which complexes are net positive and which negative: I and aVL point up, II, III and aVF point down. The vector heads towards the positive ones. The explanation is anatomical: the left bundle splits into two fascicles, and if the anterior one does not conduct, the left ventricle is activated from the posterior one — from below and behind — and the depolarization front comes out up and to the left. Note the width too: 96 ms, narrow. One fascicle failed, not the whole branch, and that is why the complex does not widen.',
      pt: 'O eixo é a direção média da despolarização do ventrículo, e aqui vale −70°: bem acima da horizontal, para cima e para a esquerda. Lê-se sem calcular nada, vendo quais complexos são líquidos positivos e quais negativos: I e aVL para cima, II, III e aVF para baixo. O vetor vai na direção das positivas. A explicação é anatômica: o ramo esquerdo se divide em dois fascículos, e se o anterior não conduz, o ventrículo esquerdo é ativado pelo posterior — de baixo e de trás — e a frente de despolarização sai para cima e para a esquerda. Repare também na largura: 96 ms, estreito. Falhou um fascículo, não o ramo inteiro, e por isso o complexo não se alarga.',
    },
    pitfall: {
      es: 'Una desviación del eje a la izquierda no es por sí sola un hemibloqueo: también la dan un infarto inferior antiguo, una hipertrofia ventricular izquierda, un corazón horizontalizado. El que más se confunde es el infarto inferior, porque también deja complejos negativos en II, III y aVF. La diferencia está en cómo EMPIEZAN esos complejos: acá arrancan con una r pequeña —de 4 a 6 décimas de milivoltio en las tres— y después cae la S. En un infarto inferior antiguo no hay nada positivo delante: empiezan con una Q. Esa r chiquita es toda la diferencia entre «hallazgo sin importancia» y «tuvo un infarto y no lo sabe». Y un detalle que salta a la vista y no hay que sobreleer: en V2 y V3 hay 2,2 y 1,8 mm de elevación del ST. En un hombre de 42 años sin síntomas eso está dentro de lo normal —el límite superior en esas derivaciones es más alto en varones jóvenes— y no cambia nada de lo anterior.',
      en: 'Left axis deviation is not by itself a fascicular block: an old inferior infarct, left ventricular hypertrophy or a horizontal heart all produce it too. The one most often confused is the inferior infarct, because it also leaves negative complexes in II, III and aVF. The difference is in how those complexes BEGIN: here they start with a small r — four to six tenths of a millivolt in all three — and the S follows. In an old inferior infarct there is nothing positive in front: they start with a Q. That tiny r is the whole difference between "a finding of no importance" and "he had an infarct and does not know it". And one detail that catches the eye and should not be over-read: V2 and V3 show 2.2 and 1.8 mm of ST elevation. In a 42-year-old man without symptoms that is within normal limits — the upper limit in those leads is higher in young men — and it changes nothing above.',
      pt: 'Um desvio do eixo para a esquerda não é por si só um hemibloqueio: um infarto inferior antigo, uma hipertrofia ventricular esquerda ou um coração horizontalizado também o produzem. O que mais se confunde é o infarto inferior, porque também deixa complexos negativos em II, III e aVF. A diferença está em como esses complexos COMEÇAM: aqui começam com uma r pequena — de quatro a seis décimos de milivolt nas três — e depois cai a S. Num infarto inferior antigo não há nada positivo antes: começam com uma Q. Essa r pequenininha é toda a diferença entre «achado sem importância» e «teve um infarto e não sabe». E um detalhe que salta à vista e não deve ser sobrelido: em V2 e V3 há 2,2 e 1,8 mm de elevação do ST. Num homem de 42 anos sem sintomas isso está dentro do normal — o limite superior nessas derivações é maior em homens jovens — e não muda nada do anterior.',
    },
    action: {
      es: 'Ninguna, y el apto se firma. Un hemibloqueo anterior izquierdo aislado, en alguien de 42 años sin síntomas, es un hallazgo frecuente y sin consecuencias por sí solo. Lo que cambia la lectura es la compañía: junto a un bloqueo de rama derecha es un bloqueo bifascicular, y si además aparecen síncopes, ahí sí hay que estudiar la conducción. Guardá el electro, que es lo que va a permitir saber si el eje se desvió más adelante.',
      en: 'None, and the clearance is signed. An isolated left anterior fascicular block in a 42-year-old without symptoms is a common finding with no consequences on its own. What changes the reading is its company: alongside a right bundle branch block it is bifascicular block, and if syncope appears as well, then conduction does need investigating. File the ECG — it is what will let you know whether the axis shifted later on.',
      pt: 'Nenhuma, e o atestado se assina. Um hemibloqueio anterior esquerdo isolado, em alguém de 42 anos sem sintomas, é um achado frequente e sem consequências por si só. O que muda a leitura é a companhia: junto a um bloqueio de ramo direito é um bloqueio bifascicular, e se ainda surgirem síncopes, aí sim há que investigar a condução. Guarde o ECG — é o que permitirá saber se o eixo se desviou mais adiante.',
    },
  },

  {
    id: 'bifascicular',
    record: '16389',
    age: 75, sex: 'F',
    vitals: { bp: '142/80', spo2: 97, rr: 16 },
    highlight: ['V1', 'I', 'aVL', 'II', 'III', 'aVF'],
    answer: 'bifascicular',
    // El panel muestra el eje Y la segunda R porque el caso son dos bloqueos a
    // la vez: mostrar uno solo sería enseñar la mitad del trazado.
    metrics: { kind: 'axis', leads: ['I', 'aVL', 'II', 'III', 'aVF'], secondR: ['V1'] },
    // Medido: QRS 136 ms, eje −68°. En V1 el complejo es rsR' — r de 172 µV,
    // s de 257 y segunda R de 637— y en V2 la segunda R llega a 702. En II, III
    // y aVF hay rS, con r inicial de 115, 246 y 181 µV antes de una S de 744,
    // 1624 y 1189. La S de V6 mide 438 µV. T invertida en V1 (−222) y V2 (−176),
    // que es el cambio secundario del bloqueo de rama. FC 76, RR regular
    // (cv 0,003), QTc 433 ms.
    findings: {
      qrsMs: [125, 165],
      axisDeg: [-80, -55],
      secondR: { leads: ['V1', 'V2'], min: 0.40 },
      dominantR: ['V1'],
      rsPattern: ['II', 'III', 'aVF'],
      // La r inicial de II es chica —115 µV— pero existe, y es lo que separa el
      // hemibloqueo de un infarto inferior antiguo. El umbral se pone por debajo
      // de lo medido a propósito: la prueba vigila que la r NO desaparezca, no
      // que mida exactamente esto.
      rHeight: { leads: ['II', 'III', 'aVF'], min: 0.08 },
      sDepth: { leads: ['V6'], min: 0.30 },
      tInversion: { leads: ['V1', 'V2'], min: 0.15 },
      rate: [65, 90],
      irregular: false,
    },
    stem: {
      es: 'Mujer de 75 años en la guardia después de un síncope: estaba parada haciendo una cola, se desvaneció sin aviso ninguno y volvió en sí sola en menos de un minuto. No hubo convulsión ni confusión después. Ahora está lúcida, sin dolor y estable. Éste es el electro.',
      en: '75-year-old woman in the emergency department after a syncope: she was standing in a queue, blacked out with no warning at all and came round on her own in under a minute. No convulsion, no confusion afterwards. She is now alert, pain-free and stable. This is the ECG.',
      pt: 'Mulher de 75 anos no pronto-socorro após um síncope: estava de pé numa fila, desmaiou sem aviso nenhum e voltou a si sozinha em menos de um minuto. Não houve convulsão nem confusão depois. Agora está lúcida, sem dor e estável. Este é o ECG.',
    },
    options: [
      { id: 'bifascicular', label: { es: 'Bloqueo bifascicular: rama derecha + hemibloqueo anterior izquierdo', en: 'Bifascicular block: right bundle + left anterior fascicle', pt: 'Bloqueio bifascicular: ramo direito + hemibloqueio anterior esquerdo' } },
      { id: 'brder', label: { es: 'Bloqueo completo de rama derecha aislado', en: 'Isolated complete right bundle branch block', pt: 'Bloqueio completo de ramo direito isolado' } },
      { id: 'hemibloqueo', label: { es: 'Hemibloqueo anterior izquierdo aislado', en: 'Isolated left anterior fascicular block', pt: 'Hemibloqueio anterior esquerdo isolado' } },
      { id: 'brizq', label: { es: 'Bloqueo completo de rama izquierda', en: 'Complete left bundle branch block', pt: 'Bloqueio completo de ramo esquerdo' } },
    ],
    explain: {
      es: 'Hay dos bloqueos acá, y hay que leer los dos. El primero salta en V1: el complejo es rsR’ —una r chiquita, una s, y después una segunda R de 6,4 mm— y el QRS mide 136 ms. Ésa es la rama derecha: el ventrículo derecho no recibe el estímulo por su camino, le llega tarde desde el izquierdo, y esa despolarización final ya sola apunta hacia adelante y a la derecha, justo contra V1. La misma fuerza tardía, vista desde la izquierda, cava la S de V6 y arrastra la S de I, que es poco profunda pero ancha. El segundo bloqueo está en el eje: −68°, arriba y a la izquierda, con I y aVL netos positivos y II, III y aVF netos negativos. Eso es el fascículo anterior izquierdo. Y acá está lo que importa: el haz de His se reparte en tres caminos —la rama derecha y los dos fascículos de la izquierda, el anterior y el posterior—. Dos de esos tres no conducen. Todo el corazón se está despolarizando por el fascículo posterior izquierdo, solo. Eso es un bloqueo bifascicular, y no es la suma de dos rarezas del trazado: es un sistema de conducción al que le queda una sola vía.',
      en: 'There are two blocks here, and both have to be read. The first jumps out in V1: the complex is rsR’ — a small r, an s, then a second R of 6.4 mm — and the QRS measures 136 ms. That is the right bundle: the right ventricle does not get the impulse down its own path, it arrives late from the left, and that final depolarization, now travelling alone, points forward and to the right, straight at V1. The same late force, seen from the left, digs the S in V6 and drags out the S in I, which is shallow but wide. The second block is in the axis: −68°, up and to the left, with I and aVL net positive and II, III and aVF net negative. That is the left anterior fascicle. And here is what matters: the bundle of His splits into three paths — the right bundle and the two left fascicles, anterior and posterior. Two of those three are not conducting. The whole heart is depolarizing through the left posterior fascicle, alone. That is bifascicular block, and it is not the sum of two oddities on a tracing: it is a conduction system down to a single remaining route.',
      pt: 'Há dois bloqueios aqui, e os dois têm de ser lidos. O primeiro salta em V1: o complexo é rsR’ — uma r pequenininha, uma s, e depois uma segunda R de 6,4 mm — e o QRS mede 136 ms. Esse é o ramo direito: o ventrículo direito não recebe o estímulo pelo seu caminho, chega-lhe tarde a partir do esquerdo, e essa despolarização final, já sozinha, aponta para a frente e para a direita, bem contra V1. A mesma força tardia, vista da esquerda, cava a S de V6 e arrasta a S de I, que é pouco profunda mas larga. O segundo bloqueio está no eixo: −68°, para cima e para a esquerda, com I e aVL líquidos positivos e II, III e aVF líquidos negativos. Esse é o fascículo anterior esquerdo. E aqui está o que importa: o feixe de His reparte-se em três caminhos — o ramo direito e os dois fascículos do esquerdo, o anterior e o posterior. Dois desses três não conduzem. Todo o coração está a despolarizar-se pelo fascículo posterior esquerdo, sozinho. Isso é um bloqueio bifascicular, e não é a soma de duas esquisitices do traçado: é um sistema de condução com uma única via restante.',
    },
    pitfall: {
      es: 'La trampa es frenar en el primer bloqueo que se ve. El QRS ancho con rsR’ en V1 es tan llamativo que uno escribe «bloqueo de rama derecha» y pasa a otra cosa — y el eje, que es el hallazgo que cambia la conducta, queda sin mirar. Regla práctica: delante de un bloqueo de rama derecha, mirá siempre el eje antes de cerrar el informe. La segunda confusión es al revés: leer II, III y aVF negativos como un infarto inferior antiguo. No lo son, y se ve en cómo EMPIEZAN esos complejos: acá arrancan con una r —de 1 a 2,5 décimas de milivoltio en las tres— y recién después cae la S. En un infarto antiguo no hay nada positivo delante, empiezan con una Q. Y una tercera, que hace pedir estudios de más: las T invertidas de V1 y V2 no son isquemia. Son el cambio secundario obligado del bloqueo de rama: si el ventrículo se despolariza mal, se repolariza mal, y esas T negativas vienen con el paquete. También vas a escuchar llamar a esto «bloqueo trifascicular» cuando además el PR está largo. El nombre es malo —el PR largo puede estar en el nodo y no en el fascículo que queda— y no cambia lo que hay que hacer.',
      en: 'The trap is stopping at the first block you see. The wide QRS with rsR’ in V1 is so striking that one writes "right bundle branch block" and moves on — and the axis, which is the finding that changes management, never gets looked at. Practical rule: in front of a right bundle branch block, always check the axis before closing the report. The second confusion runs the other way: reading II, III and aVF as an old inferior infarct. They are not, and it shows in how those complexes BEGIN: here they start with an r — one to two and a half tenths of a millivolt in all three — and only then does the S fall. In an old infarct there is nothing positive in front, they start with a Q. And a third one, which leads to unnecessary workups: the inverted T waves in V1 and V2 are not ischaemia. They are the obligatory secondary change of the bundle branch block: if the ventricle depolarizes abnormally it repolarizes abnormally, and those negative T waves come with the package. You will also hear this called "trifascicular block" when the PR is long as well. The name is a poor one — a long PR may sit in the node rather than in the surviving fascicle — and it does not change what has to be done.',
      pt: 'A armadilha é parar no primeiro bloqueio que se vê. O QRS largo com rsR’ em V1 é tão chamativo que se escreve «bloqueio de ramo direito» e passa-se a outra coisa — e o eixo, que é o achado que muda a conduta, fica por olhar. Regra prática: diante de um bloqueio de ramo direito, veja sempre o eixo antes de fechar o laudo. A segunda confusão é ao contrário: ler II, III e aVF negativos como um infarto inferior antigo. Não são, e vê-se em como esses complexos COMEÇAM: aqui começam com uma r — de um a dois e meio décimos de milivolt nas três — e só depois cai a S. Num infarto antigo não há nada positivo antes, começam com uma Q. E uma terceira, que leva a pedir exames a mais: as T invertidas de V1 e V2 não são isquemia. São a alteração secundária obrigatória do bloqueio de ramo: se o ventrículo se despolariza mal, repolariza-se mal, e essas T negativas vêm no pacote. Também vai ouvir chamar a isto «bloqueio trifascicular» quando o PR está longo por cima. O nome é mau — um PR longo pode estar no nó e não no fascículo que resta — e não muda o que há para fazer.',
    },
    action: {
      es: 'No se va a la casa. Un bloqueo bifascicular encontrado por casualidad, en alguien sin síntomas, se sigue de lejos y no necesita nada: progresa a bloqueo completo en menos del 2 % por año. Lo que cambia todo es el síncope que la trajo. Un desvanecimiento sin aviso, sin pródromos, estando de pie, en alguien a quien le queda un solo fascículo, se asume bloqueo AV paroxístico hasta demostrar lo contrario — y ese ritmo no se va a ver en un electro de diez segundos, porque el paciente no está bloqueado ahora. Entonces: internación con monitoreo, y de ahí a estudio electrofisiológico o a un registrador de eventos según qué se vea. Si el bloqueo AV se documenta, o el estudio muestra un His-ventrículo largo, es marcapasos. Mientras tanto, revisá la medicación: betabloqueantes, verapamilo, diltiazem, antiarrítmicos, cualquier cosa que frene la conducción tiene que salir.',
      en: 'She does not go home. A bifascicular block found by chance in someone without symptoms is followed at a distance and needs nothing: it progresses to complete block in under 2 % per year. What changes everything is the syncope that brought her in. A blackout with no warning, no prodrome, while standing, in someone left with a single fascicle, is assumed to be paroxysmal AV block until proven otherwise — and that rhythm will not show up on a ten-second ECG, because the patient is not blocked right now. So: admission with monitoring, and from there an electrophysiological study or an event recorder depending on what turns up. If AV block is documented, or the study shows a long His-ventricle interval, it is a pacemaker. In the meantime, review the medication: beta blockers, verapamil, diltiazem, antiarrhythmics — anything that slows conduction has to go.',
      pt: 'Não vai para casa. Um bloqueio bifascicular encontrado por acaso, em alguém sem sintomas, segue-se de longe e não precisa de nada: progride para bloqueio completo em menos de 2 % ao ano. O que muda tudo é o síncope que a trouxe. Um desmaio sem aviso, sem pródromos, estando de pé, em alguém a quem resta um único fascículo, assume-se bloqueio AV paroxístico até prova em contrário — e esse ritmo não vai aparecer num ECG de dez segundos, porque o paciente não está bloqueado agora. Então: internação com monitorização, e daí a estudo eletrofisiológico ou a um registrador de eventos conforme o que se veja. Se o bloqueio AV for documentado, ou o estudo mostrar um His-ventrículo longo, é marca-passo. Entretanto, reveja a medicação: betabloqueadores, verapamil, diltiazem, antiarrítmicos — tudo o que trave a condução tem de sair.',
    },
  },

  {
    id: 'lpfb',
    record: '13052',
    age: 35, sex: 'M',
    vitals: { bp: '118/72', spo2: 99, rr: 14 },
    highlight: ['I', 'aVL', 'II', 'III', 'aVF', 'V1'],
    answer: 'lpfb',
    metrics: { kind: 'axis', leads: ['I', 'aVL', 'II', 'III', 'aVF'] },
    // Medido: eje +100°, QRS de 84 ms. R dominante en II, III y aVF (710, 754
    // y 724 µV de R contra 196, 88 y 29 de S); rS en I y aVL, con r inicial de
    // 245 y 155 µV; rS en V1 (R de 11 µV contra S de 489). ST de los miembros
    // dentro de 86 µV. FC 69, RR regular (cv 0,041).
    //
    // Las tres exclusiones del caso son las tres mediciones: V1 descarta la
    // hipertrofia derecha, la r inicial de I y aVL descarta el infarto lateral,
    // y los 84 ms descartan el bloqueo de rama. Lo que NO se puede excluir
    // midiendo —la contextura física— es de lo que habla el texto.
    findings: {
      axisDeg: [85, 120],
      qrsMs: [60, 115],
      dominantR: ['II', 'III', 'aVF'],
      rsPattern: ['I', 'aVL', 'V1'],
      rHeight: { leads: ['I', 'aVL'], min: 0.10 },
      // El ST plano se afirma sólo de los miembros y de V5-V6. En V2 y V3 hay
      // 2,4 y 2,1 mm de elevación, que en un hombre de 35 años son
      // repolarización precoz y están dentro de lo normal — y el texto lo dice.
      stFlat: { leads: ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V5', 'V6'], max: 0.12 },
      rate: [60, 80],
      irregular: false,
    },
    stem: {
      es: 'Hombre de 35 años, delgado, sin síntomas. Electro prelaboral. El informe automático del equipo dice «ueberdrehter Rechtstyp» —eje muy desviado a la derecha— y agrega «linksposteriorer Hemiblock». Le preguntan qué hay que hacer con eso.',
      en: '35-year-old man, thin build, no symptoms. Pre-employment ECG. The machine\u2019s report reads "marked right axis deviation" and adds "left posterior hemiblock". He asks what should be done about that.',
      pt: 'Homem de 35 anos, magro, sem sintomas. ECG ocupacional. O laudo automático do aparelho diz «desvio acentuado do eixo para a direita» e acrescenta «hemibloqueio posterior esquerdo». Ele pergunta o que fazer com isso.',
    },
    options: [
      { id: 'lpfb', label: { es: 'Patrón de hemibloqueo posterior izquierdo', en: 'Left posterior fascicular block pattern', pt: 'Padrão de hemibloqueio posterior esquerdo' } },
      { id: 'hvd', label: { es: 'Hipertrofia ventricular derecha', en: 'Right ventricular hypertrophy', pt: 'Hipertrofia ventricular direita' } },
      { id: 'lateral', label: { es: 'Infarto lateral antiguo', en: 'Old lateral infarct', pt: 'Infarto lateral antigo' } },
      { id: 'brder', label: { es: 'Bloqueo completo de rama derecha', en: 'Complete right bundle branch block', pt: 'Bloqueio completo de ramo direito' } },
    ],
    explain: {
      es: 'El eje mide +100°: desviado a la derecha. Se lee a ojo igual que siempre, mirando qué complejos son netos positivos y cuáles negativos, sólo que acá está todo dado vuelta respecto del hemibloqueo anterior: II, III y aVF hacia arriba, I y aVL hacia abajo. El vector va hacia abajo y a la derecha. La anatomía explica por qué: la rama izquierda se divide en dos fascículos, y si el que falla es el POSTERIOR, el ventrículo izquierdo se activa desde el anterior —desde arriba y adelante— y el frente de despolarización sale hacia abajo y a la derecha. Y como en el hemibloqueo anterior, el QRS sigue angosto: 84 ms. Falló un fascículo, no la rama. Ahora bien, el eje derecho solo no alcanza, porque lo dan varias cosas más. Lo que el trazado SÍ puede hacer es sacar las otras del medio, y acá las saca a las tres: V1 es rS —R de apenas 0,1 mm contra una S de 4,9—, o sea que no hay hipertrofia del ventrículo derecho, que daría una R alta ahí; I y aVL empiezan con una r —2,5 y 1,6 mm— y no con una Q, o sea que no hay un infarto lateral antiguo; y el QRS de 84 ms descarta un bloqueo de rama. Queda el patrón de hemibloqueo posterior izquierdo.',
      en: 'The axis measures +100°: deviated to the right. You read it by eye as always, looking at which complexes are net positive and which negative — only here everything is flipped relative to the anterior fascicular block: II, III and aVF point up, I and aVL point down. The vector heads down and to the right. The anatomy explains why: the left bundle splits into two fascicles, and if the one that fails is the POSTERIOR one, the left ventricle is activated from the anterior fascicle — from above and in front — and the depolarization front comes out downward and to the right. And as in the anterior fascicular block, the QRS stays narrow: 84 ms. One fascicle failed, not the branch. Now, a right axis on its own is not enough, because several other things produce it. What the tracing CAN do is rule the others out, and here it rules out all three: V1 is rS — an R of barely 0.1 mm against an S of 4.9 — so there is no right ventricular hypertrophy, which would give a tall R there; I and aVL begin with an r — 2.5 and 1.6 mm — and not with a Q, so there is no old lateral infarct; and the 84 ms QRS excludes a bundle branch block. What is left is the left posterior fascicular block pattern.',
      pt: 'O eixo mede +100°: desviado para a direita. Lê-se a olho como sempre, vendo quais complexos são líquidos positivos e quais negativos — só que aqui está tudo invertido em relação ao hemibloqueio anterior: II, III e aVF para cima, I e aVL para baixo. O vetor vai para baixo e para a direita. A anatomia explica porquê: o ramo esquerdo divide-se em dois fascículos, e se o que falha é o POSTERIOR, o ventrículo esquerdo é ativado pelo anterior — de cima e da frente — e a frente de despolarização sai para baixo e para a direita. E como no hemibloqueio anterior, o QRS continua estreito: 84 ms. Falhou um fascículo, não o ramo. Agora, um eixo direito sozinho não basta, porque várias outras coisas o produzem. O que o traçado PODE fazer é tirar as outras do meio, e aqui tira as três: V1 é rS — uma R de apenas 0,1 mm contra uma S de 4,9 —, ou seja, não há hipertrofia do ventrículo direito, que daria uma R alta ali; I e aVL começam com uma r — 2,5 e 1,6 mm — e não com uma Q, ou seja, não há infarto lateral antigo; e o QRS de 84 ms exclui um bloqueio de ramo. Resta o padrão de hemibloqueio posterior esquerdo.',
    },
    pitfall: {
      es: 'Fijate que la opción correcta dice PATRÓN, y no «tiene un hemibloqueo posterior izquierdo». La diferencia no es una sutileza de redacción: el hemibloqueo posterior es un diagnóstico por descarte, y hay un descarte que el electro no puede hacer. Este hombre tiene 35 años y es delgado. En una persona flaca el corazón cuelga vertical dentro del tórax, y un corazón vertical da eje derecho sin que haya nada roto: es la causa más común de este trazado, y no se ve en el papel, se ve mirando al paciente. Lo mismo con el EPOC y con cualquier cosa que sobrecargue el ventrículo derecho. Por eso el fascículo posterior casi nunca se bloquea solo: es corto, ancho y tiene doble irrigación, y hace falta bastante daño para sacarlo de circulación. La propia base lo muestra: PTB-XL trae este registro etiquetado a la vez como NORMAL —con probabilidad 100— y como hemibloqueo posterior izquierdo. No es un error de la base. Es el problema. Y un detalle chico que no hay que sobreleer: en V2 y V3 hay 2,4 y 2,1 mm de elevación del ST, y la T de III está levemente invertida. En un hombre de 35 años sin síntomas eso es repolarización precoz y una variante normal: no cambia nada.',
      en: 'Note that the correct option says PATTERN, not "he has a left posterior fascicular block". The difference is not a wording nicety: posterior fascicular block is a diagnosis of exclusion, and there is one exclusion the ECG cannot make. This man is 35 and thin. In a thin person the heart hangs vertically inside the chest, and a vertical heart gives a right axis with nothing broken at all: it is the commonest cause of this tracing, and it is not visible on the paper — it is visible by looking at the patient. The same goes for COPD and anything that loads the right ventricle. That is why the posterior fascicle almost never blocks on its own: it is short, wide and doubly supplied with blood, and it takes considerable damage to put it out of action. The database itself shows this: PTB-XL labels this record simultaneously as NORMAL — with likelihood 100 — and as left posterior fascicular block. That is not a mistake in the database. That is the problem. And one small detail not to over-read: V2 and V3 show 2.4 and 2.1 mm of ST elevation, and the T in III is slightly inverted. In a 35-year-old man without symptoms that is early repolarization and a normal variant: it changes nothing.',
      pt: 'Repare que a opção correta diz PADRÃO, e não «tem um hemibloqueio posterior esquerdo». A diferença não é uma sutileza de redação: o hemibloqueio posterior é um diagnóstico por exclusão, e há uma exclusão que o ECG não consegue fazer. Este homem tem 35 anos e é magro. Numa pessoa magra o coração fica vertical dentro do tórax, e um coração vertical dá eixo direito sem que haja nada quebrado: é a causa mais comum deste traçado, e não se vê no papel — vê-se olhando para o paciente. O mesmo vale para a DPOC e para qualquer coisa que sobrecarregue o ventrículo direito. Por isso o fascículo posterior quase nunca se bloqueia sozinho: é curto, largo e tem dupla irrigação, e é preciso bastante dano para o pôr fora de circulação. A própria base mostra isso: o PTB-XL traz este registro etiquetado ao mesmo tempo como NORMAL — com probabilidade 100 — e como hemibloqueio posterior esquerdo. Não é um erro da base. É o problema. E um detalhe pequeno que não se deve sobreler: em V2 e V3 há 2,4 e 2,1 mm de elevação do ST, e a T de III está levemente invertida. Num homem de 35 anos sem sintomas isso é repolarização precoce e uma variante normal: não muda nada.',
    },
    action: {
      es: 'El apto se firma. No hay nada que estudiar a partir de este electro en alguien de 35 años, sin síntomas y con un examen normal: el patrón aislado, sin síncope, sin disnea y sin cardiopatía conocida, no cambia ninguna conducta ni necesita seguimiento especial. Lo que sí vale es escribir bien el informe: «eje desviado a la derecha, patrón compatible con hemibloqueo posterior izquierdo; sin criterios de hipertrofia derecha ni de necrosis lateral; correlacionar con la contextura física». Eso es honesto y le sirve al que lo lea dentro de diez años. Y guardá el trazado: si algún día aparece con un bloqueo de rama derecha encima, ese eje pasa a ser la mitad de un bloqueo bifascicular, y entonces sí importa. La única situación que cambia todo es la misma de siempre: síncope. Con síncope, ningún trastorno de conducción es un hallazgo casual.',
      en: 'The clearance is signed. There is nothing to investigate off this ECG in someone aged 35, without symptoms and with a normal examination: the isolated pattern, with no syncope, no breathlessness and no known heart disease, changes no management and needs no special follow-up. What is worth doing is writing the report properly: "right axis deviation, pattern compatible with left posterior fascicular block; no criteria for right ventricular hypertrophy or lateral necrosis; correlate with body habitus." That is honest and it serves whoever reads it ten years from now. And file the tracing: if he ever turns up with a right bundle branch block on top, that axis becomes half of a bifascicular block, and then it does matter. The one situation that changes everything is the usual one: syncope. With syncope, no conduction abnormality is an incidental finding.',
      pt: 'O atestado assina-se. Não há nada a investigar a partir deste ECG em alguém de 35 anos, sem sintomas e com exame normal: o padrão isolado, sem síncope, sem dispneia e sem cardiopatia conhecida, não muda nenhuma conduta nem precisa de seguimento especial. O que vale a pena é escrever bem o laudo: «eixo desviado para a direita, padrão compatível com hemibloqueio posterior esquerdo; sem critérios de hipertrofia direita nem de necrose lateral; correlacionar com a compleição física». Isso é honesto e serve a quem o ler daqui a dez anos. E guarde o traçado: se um dia aparecer com um bloqueio de ramo direito por cima, esse eixo passa a ser metade de um bloqueio bifascicular, e aí sim importa. A única situação que muda tudo é a de sempre: síncope. Com síncope, nenhum distúrbio de condução é um achado casual.',
    },
  },

  {
    id: 'low-voltage',
    record: '4215',
    age: 62, sex: 'M',
    vitals: { bp: '128/78', spo2: 97, rr: 15 },
    highlight: ['I', 'II', 'III', 'aVR', 'aVL', 'aVF'],
    answer: 'periferico',
    metrics: {
      kind: 'voltage',
      limb: ['I', 'II', 'III', 'aVR', 'aVL', 'aVF'],
      chest: ['V1', 'V2', 'V3', 'V4', 'V5', 'V6'],
    },
    // Medido, de pico a pico: los miembros dan 3,1 · 4,3 · 2,6 · 3,6 · 1,8 y
    // 3,0 mm — las seis por debajo de 5, y la más alta, II, se queda en 4,3—.
    // Las precordiales dan 7,0 · 12,4 · 15,2 · 20,1 · 10,8 y 4,7. El corazón
    // genera 20 mm en V4 y no llega a 5 en ningún miembro: ahí está el caso.
    //
    // FC 70, RR regular (cv 0,007), QRS 96 ms, eje +66°, QTc 416, ruido 19 µV
    // —el trazado más limpio de la sección—. La amplitud no alterna latido a
    // latido: en V4 los pares miden 19,5 mm y los impares 19,7.
    findings: {
      qrsAmplitude: { leads: ['I', 'II', 'III', 'aVR', 'aVL', 'aVF'], max: 0.5 },
      // La otra mitad del hallazgo, y la que descarta el bajo voltaje
      // generalizado: las precordiales NO son bajas. Con que una sola pase los
      // 10 mm alcanza, y acá la R de V4 sola mide 13,5.
      rHeight: { leads: ['V4'], min: 1.00 },
      sDepth: { leads: ['V2'], min: 0.80 },
      qrsMs: [80, 110],
      axisDeg: [45, 90],
      rate: [60, 80],
      irregular: false,
    },
    stem: {
      es: 'Hombre de 62 años, con sobrepeso, sin síntomas. Electro de rutina antes de una cirugía programada. El informe automático dice «periphere Niederspannung» —bajo voltaje periférico— y el residente que lo recibe quiere pedir un ecocardiograma para descartar derrame pericárdico antes de dar el apto.',
      en: '62-year-old man, overweight, no symptoms. Routine ECG before scheduled surgery. The machine\u2019s report reads "peripheral low voltage", and the resident who receives it wants to order an echocardiogram to rule out a pericardial effusion before signing off.',
      pt: 'Homem de 62 anos, com sobrepeso, sem sintomas. ECG de rotina antes de uma cirurgia programada. O laudo automático diz «baixa voltagem periférica» e o residente que o recebe quer pedir um ecocardiograma para descartar derrame pericárdico antes de liberar.',
    },
    options: [
      { id: 'periferico', label: { es: 'Bajo voltaje en las derivaciones de los miembros', en: 'Low voltage in the limb leads', pt: 'Baixa voltagem nas derivações dos membros' } },
      { id: 'generalizado', label: { es: 'Bajo voltaje generalizado', en: 'Generalized low voltage', pt: 'Baixa voltagem generalizada' } },
      { id: 'derrame', label: { es: 'Derrame pericárdico con taponamiento', en: 'Pericardial effusion with tamponade', pt: 'Derrame pericárdico com tamponamento' } },
      { id: 'anterior', label: { es: 'Infarto anterior antiguo con pérdida de la onda R', en: 'Old anterior infarct with loss of the R wave', pt: 'Infarto anterior antigo com perda da onda R' } },
    ],
    explain: {
      es: 'El voltaje se mide de pico a pico: lo que sube la R más lo que baja la S, en la misma derivación. Y la palabra que decide el criterio es TODAS: hay bajo voltaje cuando NINGUNA de las seis derivaciones de los miembros llega a 5 mm. Acá miden 3,1 · 4,3 · 2,6 · 3,6 · 1,8 y 3,0 mm: la más alta es II y se queda en 4,3. Se cumple. Ahora mirá las precordiales, que es donde está el caso: 7,0 · 12,4 · 15,2 · 20,1 · 10,8 y 4,7 mm. V4 mide 20 milímetros. El mismo corazón que no consigue 5 mm en ningún miembro genera 20 en el pecho. Y eso resuelve la pregunta: el problema no es el músculo. Si el miocardio estuviera infiltrado, atrofiado o rodeado de líquido, las precordiales caerían con las demás — están más cerca del corazón, no más lejos. Lo que falla está en el CAMINO hacia los electrodos de los miembros. El voltaje que llega a la piel depende de cuánta señal genera el músculo y de cuánto se pierde en el trayecto, y acá se pierde en el trayecto: grasa, edema, un tórax en tonel, o simplemente electrodos apoyados donde no van.',
      en: 'Voltage is measured peak to peak: how far the R goes up plus how far the S goes down, in the same lead. And the word that decides the criterion is ALL: there is low voltage when NONE of the six limb leads reaches 5 mm. Here they measure 3.1 · 4.3 · 2.6 · 3.6 · 1.8 and 3.0 mm: the tallest is II and it stops at 4.3. The criterion is met. Now look at the chest leads, which is where the case lives: 7.0 · 12.4 · 15.2 · 20.1 · 10.8 and 4.7 mm. V4 measures 20 millimetres. The same heart that cannot manage 5 mm in any limb lead generates 20 on the chest. And that settles the question: the problem is not the muscle. If the myocardium were infiltrated, atrophied or surrounded by fluid, the chest leads would fall along with the rest — they are closer to the heart, not further away. What fails is in the PATH to the limb electrodes. The voltage reaching the skin depends on how much signal the muscle generates and how much is lost on the way, and here it is lost on the way: fat, oedema, a barrel chest, or simply electrodes placed where they do not belong.',
      pt: 'A voltagem mede-se de pico a pico: o que a R sobe mais o que a S desce, na mesma derivação. E a palavra que decide o critério é TODAS: há baixa voltagem quando NENHUMA das seis derivações dos membros chega a 5 mm. Aqui medem 3,1 · 4,3 · 2,6 · 3,6 · 1,8 e 3,0 mm: a mais alta é II e fica em 4,3. Cumpre-se. Agora olhe as precordiais, que é onde está o caso: 7,0 · 12,4 · 15,2 · 20,1 · 10,8 e 4,7 mm. V4 mede 20 milímetros. O mesmo coração que não consegue 5 mm em nenhum membro gera 20 no peito. E isso resolve a pergunta: o problema não é o músculo. Se o miocárdio estivesse infiltrado, atrofiado ou rodeado de líquido, as precordiais cairiam junto com as outras — estão mais perto do coração, não mais longe. O que falha está no CAMINHO até os elétrodos dos membros. A voltagem que chega à pele depende de quanto sinal o músculo gera e de quanto se perde no trajeto, e aqui perde-se no trajeto: gordura, edema, um tórax em tonel, ou simplesmente elétrodos apoiados onde não devem.',
    },
    pitfall: {
      es: 'El error es el que estaba por cometer el residente: leer «bajo voltaje» y pedir el eco buscando derrame. Bajo voltaje PERIFÉRICO y bajo voltaje GENERALIZADO no son el mismo hallazgo ni tienen la misma lista de causas, y lo que los separa está en el mismo papel: las precordiales. Acá V4 mide 20 mm, o sea que el criterio generalizado —ninguna precordial por encima de 10— no se cumple ni de lejos. El derrame pericárdico importante, además, no suele venir solo: trae taquicardia, y este hombre está a 70 por minuto; y cuando el corazón se balancea dentro del líquido aparece alternancia eléctrica, complejos que cambian de tamaño latido a latido. Acá no hay: en V4 los latidos pares miden 19,5 mm y los impares 19,7. Segundo error, el opuesto: dar por normal un electro porque «no se ve nada». Los complejos chiquitos no son ausencia de hallazgo, son el hallazgo, y hay que escribirlo. Y tercero, no confundir complejos chicos con ondas R perdidas: la R crece bien de V1 a V4 —de 0,8 a 13,5 mm— así que no hay infarto anterior antiguo por ningún lado.',
      en: 'The mistake is the one the resident was about to make: read "low voltage" and order the echo looking for an effusion. PERIPHERAL low voltage and GENERALIZED low voltage are not the same finding and do not have the same list of causes, and what separates them is on the same sheet of paper: the chest leads. Here V4 measures 20 mm, so the generalized criterion — no chest lead above 10 — is not remotely met. A significant pericardial effusion, moreover, rarely comes alone: it brings tachycardia, and this man is at 70 per minute; and when the heart swings inside the fluid, electrical alternans appears — complexes that change size from beat to beat. There is none here: in V4 the even beats measure 19.5 mm and the odd ones 19.7. The second mistake is the opposite one: calling an ECG normal because "there is nothing to see". Small complexes are not the absence of a finding, they are the finding, and it has to be written down. And third, do not confuse small complexes with lost R waves: the R grows properly from V1 to V4 — from 0.8 to 13.5 mm — so there is no old anterior infarct anywhere.',
      pt: 'O erro é o que o residente estava prestes a cometer: ler «baixa voltagem» e pedir o eco à procura de derrame. Baixa voltagem PERIFÉRICA e baixa voltagem GENERALIZADA não são o mesmo achado nem têm a mesma lista de causas, e o que as separa está no mesmo papel: as precordiais. Aqui V4 mede 20 mm, ou seja, o critério generalizado — nenhuma precordial acima de 10 — não se cumpre nem de longe. Um derrame pericárdico importante, além disso, raramente vem sozinho: traz taquicardia, e este homem está a 70 por minuto; e quando o coração balança dentro do líquido aparece alternância elétrica, complexos que mudam de tamanho batimento a batimento. Aqui não há: em V4 os batimentos pares medem 19,5 mm e os ímpares 19,7. Segundo erro, o oposto: dar como normal um ECG porque «não se vê nada». Os complexos pequenos não são ausência de achado, são o achado, e têm de ser escritos. E terceiro, não confundir complexos pequenos com ondas R perdidas: a R cresce bem de V1 a V4 — de 0,8 a 13,5 mm — portanto não há infarto anterior antigo em lado nenhum.',
    },
    action: {
      es: 'El apto se firma y el eco no se pide por esto. En alguien de 62 años, con sobrepeso, sin síntomas y con el resto del electro normal, un bajo voltaje limitado a los miembros se explica mirando al paciente, no pidiéndole estudios: contextura, edema en las piernas, un tórax enfisematoso. Vale la pena, eso sí, revisar dónde estaban los electrodos: apoyarlos en el tronco en vez de en los miembros baja el voltaje de las seis derivaciones y es la causa más barata de corregir. Y el informe se escribe completo —«bajo voltaje en las derivaciones de los miembros, precordiales de amplitud normal»—, porque la próxima vez que alguien vea este trazado va a querer saber si esto es nuevo. Lo que sí cambia todo es el contexto: bajo voltaje con disnea, hipotensión o ingurgitación yugular es un eco urgente, y bajo voltaje generalizado en alguien con insuficiencia cardíaca y paredes gruesas en el eco —voltaje chico con músculo grande— es amiloidosis hasta que se demuestre lo contrario.',
      en: 'The clearance is signed and the echo is not ordered for this. In someone aged 62, overweight, without symptoms and with an otherwise normal ECG, low voltage confined to the limb leads is explained by looking at the patient, not by ordering tests: build, leg oedema, an emphysematous chest. It is worth checking where the electrodes were, though: placing them on the torso instead of on the limbs lowers the voltage in all six leads and is the cheapest cause to correct. And the report is written in full — "low voltage in the limb leads, chest leads of normal amplitude" — because the next person to see this tracing will want to know whether it is new. What does change everything is the context: low voltage with breathlessness, hypotension or a raised JVP is an urgent echo, and generalized low voltage in someone with heart failure and thick walls on the echo — small voltage with big muscle — is amyloidosis until proven otherwise.',
      pt: 'O atestado assina-se e o eco não se pede por isto. Em alguém de 62 anos, com sobrepeso, sem sintomas e com o resto do ECG normal, uma baixa voltagem limitada aos membros explica-se olhando para o paciente, não pedindo exames: compleição, edema nas pernas, um tórax enfisematoso. Vale a pena, isso sim, verificar onde estavam os elétrodos: apoiá-los no tronco em vez de nos membros baixa a voltagem das seis derivações e é a causa mais barata de corrigir. E o laudo escreve-se completo — «baixa voltagem nas derivações dos membros, precordiais de amplitude normal» —, porque a próxima pessoa que vir este traçado vai querer saber se isto é novo. O que muda tudo é o contexto: baixa voltagem com dispneia, hipotensão ou ingurgitação jugular é um eco urgente, e baixa voltagem generalizada em alguém com insuficiência cardíaca e paredes espessas no eco — voltagem pequena com músculo grande — é amiloidose até prova em contrário.',
    },
  },

  {
    id: 'aneurysm',
    record: '7953',
    age: 76, sex: 'F',
    vitals: { bp: '124/76', spo2: 95, rr: 18 },
    highlight: ['V1', 'V2', 'V3', 'V4'],
    answer: 'aneurisma',
    // Mismo panel y mismas derivaciones que el caso 2, el infarto anteroseptal
    // agudo, a propósito: los dos casos se miran uno al lado del otro.
    metrics: { kind: 'st', leads: ['V1', 'V2', 'V3', 'V4', 'II', 'aVF'] },
    // Medido: ST de +218, +246 y +240 µV en V2, V3 y V4 (+82 en V1); las seis
    // derivaciones de los miembros, dentro de 37 µV. La R de V1, V2 y V3 mide
    // 0,7 · 1,6 y 2,1 mm —contra medianas de 4,8 y 8,3 mm en V2 y V3 sobre los
    // registros normales de la base— y debajo caen S de 18,9 y 20,5 mm: el
    // complejo es casi un QS. FC 89, QRS 92 ms, eje +37°, QTc 407, cv 0,006.
    findings: {
      stElevation: { leads: ['V2', 'V3', 'V4'], min: 0.18 },
      // La R perdida es la otra mitad: sin músculo no hay vector inicial.
      rLoss: { leads: ['V1', 'V2', 'V3'], max: 0.30 },
      sDepth: { leads: ['V2', 'V3'], min: 1.50 },
      // Confinada adelante. Una pericarditis la da difusa, y eso se mide.
      stFlat: { leads: ['I', 'II', 'III', 'aVR', 'aVL', 'aVF'], max: 0.06 },
      qrsMs: [70, 110],
      rate: [75, 100],
      irregular: false,
    },
    stem: {
      es: 'Mujer de 76 años que viene a la consulta por disnea de esfuerzo que fue empeorando en los últimos meses. NO tiene dolor de pecho, ni lo tuvo. Tuvo un infarto anterior extenso hace cuatro años. En la historia hay un electro del año pasado, y es igual a éste.',
      en: '76-year-old woman attending clinic for exertional breathlessness that has worsened over recent months. She has NO chest pain, and has had none. She had an extensive anterior infarct four years ago. There is an ECG from last year in her notes, and it is identical to this one.',
      pt: 'Mulher de 76 anos que vem à consulta por dispneia de esforço que piorou nos últimos meses. NÃO tem dor no peito, nem teve. Teve um infarto anterior extenso há quatro anos. No prontuário há um ECG do ano passado, e é igual a este.',
    },
    options: [
      { id: 'aneurisma', label: { es: 'Infarto anterior antiguo con elevación persistente del ST', en: 'Old anterior infarct with persistent ST elevation', pt: 'Infarto anterior antigo com elevação persistente do ST' } },
      { id: 'agudo', label: { es: 'IAM anterior agudo', en: 'Acute anterior STEMI', pt: 'IAM anterior agudo' } },
      { id: 'pericarditis', label: { es: 'Pericarditis aguda', en: 'Acute pericarditis', pt: 'Pericardite aguda' } },
      { id: 'precoz', label: { es: 'Repolarización precoz', en: 'Early repolarization', pt: 'Repolarização precoce' } },
    ],
    explain: {
      es: 'Hay dos cosas en las precordiales y las dos cuentan. La primera: la onda R no está. En V1, V2 y V3 mide 0,7 · 1,6 y 2,1 mm, cuando la mediana de los registros normales de la base es de 4,8 mm en V2 y 8,3 en V3; debajo caen unas S de 18,9 y 20,5 mm, así que el complejo es casi un QS, baja sin nada positivo delante. Eso es músculo que no está: la pared anterior se infartó y no quedó quién genere el vector inicial. La segunda: encima de esos complejos el ST está elevado 2,2 · 2,5 y 2,4 mm. Y ahí está el hallazgo, porque esas dos cosas juntas no deberían convivir. Después de un infarto el ST vuelve a la línea de base en dos semanas; si a los cuatro años sigue arriba, es porque la pared cicatrizal quedó fina y discinética —en sístole, en vez de empujar, se abomba hacia afuera— y esa pared mantiene una corriente de lesión permanente. Eso es un aneurisma ventricular, y el electro le pone nombre al patrón. Mirá también dónde NO está la elevación: las seis derivaciones de los miembros quedan dentro de 0,4 mm. Está confinada adelante, que es lo que la separa de una pericarditis, donde el ST sube en casi todas.',
      en: 'There are two things in the chest leads and both count. The first: the R wave is gone. In V1, V2 and V3 it measures 0.7 · 1.6 and 2.1 mm, where the median in the database\u2019s normal records is 4.8 mm in V2 and 8.3 in V3; below them fall S waves of 18.9 and 20.5 mm, so the complex is almost a QS — it goes down with nothing positive in front. That is muscle that is not there: the anterior wall infarcted and nothing is left to generate the initial vector. The second: on top of those complexes the ST is elevated by 2.2 · 2.5 and 2.4 mm. And that is the finding, because those two things should not coexist. After an infarct the ST returns to baseline within two weeks; if four years later it is still up, it is because the scarred wall became thin and dyskinetic — in systole, instead of pushing, it bulges outward — and that wall maintains a permanent injury current. That is a ventricular aneurysm, and the ECG names the pattern. Note also where the elevation is NOT: the six limb leads stay within 0.4 mm. It is confined to the front, which is what separates it from pericarditis, where the ST rises almost everywhere.',
      pt: 'Há duas coisas nas precordiais e as duas contam. A primeira: a onda R não está. Em V1, V2 e V3 mede 0,7 · 1,6 e 2,1 mm, quando a mediana dos registros normais da base é de 4,8 mm em V2 e 8,3 em V3; debaixo caem ondas S de 18,9 e 20,5 mm, portanto o complexo é quase um QS, desce sem nada positivo à frente. Isso é músculo que não está: a parede anterior infartou e não sobrou quem gere o vetor inicial. A segunda: por cima desses complexos o ST está elevado 2,2 · 2,5 e 2,4 mm. E aí está o achado, porque essas duas coisas juntas não deveriam conviver. Depois de um infarto o ST volta à linha de base em duas semanas; se quatro anos depois continua em cima, é porque a parede cicatricial ficou fina e discinética — na sístole, em vez de empurrar, abaúla-se para fora — e essa parede mantém uma corrente de lesão permanente. Isso é um aneurisma ventricular, e o ECG dá nome ao padrão. Repare também onde a elevação NÃO está: as seis derivações dos membros ficam dentro de 0,4 mm. Está confinada à frente, que é o que a separa de uma pericardite, onde o ST sobe em quase todas.',
    },
    pitfall: {
      es: 'Acá hay que ser honesto, y es lo más importante del caso: este trazado, solo, NO permite descartar un infarto agudo. Se probaron tres discriminadores sobre la base, midiendo los 57 registros etiquetados como aneurisma contra 46 infartos anteriores agudos, y ninguno separa. La razón T/QRS —la regla que dice que por debajo de 0,22 el ST elevado es viejo— da mediana 0,18 en los aneurismas y 0,20 en los agudos: 38 de 57 aneurismas quedan por debajo del umbral, pero también 25 de 46 agudos. Este trazado da 0,17, y el caso 2 de esta misma sección, que es un infarto anteroseptal agudo de verdad, da 0,07: más «aneurismático» que el aneurisma. Lo mismo con las otras dos: el complejo QS con ST elevado no lo cumple ninguno de los 57, y el descenso recíproco, que el libro adjudica al agudo, aparece más seguido en los aneurismas (16 de 53) que en los agudos (6 de 43). Ojo con cómo se lee esto: no dice que la regla de Smith esté mal, dice que medida sobre estos registros y con este método no discrimina. Lo que decide, entonces, no está en el papel: es que esta mujer no tiene dolor y que hay un electro del año pasado igual a éste. Sin esas dos cosas, esto se trata como un infarto agudo y se activa la sala de hemodinamia. El error que mata es el opuesto al que parece: mirar un ST elevado, acordarse del aneurisma y mandar a la paciente a la casa.',
      en: 'Here one has to be honest, and it is the most important part of the case: this tracing, on its own, does NOT rule out an acute infarct. Three discriminators were tested against the database, measuring the 57 records labelled as aneurysm against 46 acute anterior infarcts, and none of them separates. The T/QRS ratio — the rule that says ST elevation below 0.22 is old — gives a median of 0.18 in the aneurysms and 0.20 in the acute ones: 38 of 57 aneurysms fall below the threshold, but so do 25 of 46 acute infarcts. This tracing gives 0.17, and case 2 of this very section, which is a genuine acute anteroseptal infarct, gives 0.07: more "aneurysmal" than the aneurysm. The same with the other two: not one of the 57 meets the QS-with-ST-elevation combination, and reciprocal depression, which the textbook assigns to the acute case, turns up more often in the aneurysms (16 of 53) than in the acute ones (6 of 43). Mind how this is read: it does not say Smith\u2019s rule is wrong, it says that measured on these records with this method it does not discriminate. What decides, then, is not on the paper: it is that this woman has no pain and that there is an ECG from last year identical to this one. Without those two things, this is treated as an acute infarct and the cath lab is activated. The mistake that kills is the opposite of the one it looks like: seeing ST elevation, remembering the aneurysm and sending the patient home.',
      pt: 'Aqui é preciso ser honesto, e é o mais importante do caso: este traçado, sozinho, NÃO permite descartar um infarto agudo. Testaram-se três discriminadores sobre a base, medindo os 57 registros etiquetados como aneurisma contra 46 infartos anteriores agudos, e nenhum separa. A razão T/QRS — a regra que diz que abaixo de 0,22 o ST elevado é antigo — dá mediana 0,18 nos aneurismas e 0,20 nos agudos: 38 de 57 aneurismas ficam abaixo do limiar, mas também 25 de 46 agudos. Este traçado dá 0,17, e o caso 2 desta mesma seção, que é um infarto anterosseptal agudo de verdade, dá 0,07: mais «aneurismático» que o aneurisma. O mesmo com os outros dois: o complexo QS com ST elevado não é cumprido por nenhum dos 57, e o descenso recíproco, que o livro atribui ao agudo, aparece mais vezes nos aneurismas (16 de 53) do que nos agudos (6 de 43). Atenção a como se lê isto: não diz que a regra de Smith esteja errada, diz que medida sobre estes registros e com este método não discrimina. O que decide, então, não está no papel: é que esta mulher não tem dor e que há um ECG do ano passado igual a este. Sem essas duas coisas, isto trata-se como um infarto agudo e ativa-se a hemodinâmica. O erro que mata é o oposto do que parece: ver um ST elevado, lembrar-se do aneurisma e mandar a paciente para casa.',
    },
    action: {
      es: 'El electro no diagnostica un aneurisma: sugiere el patrón. El aneurisma es un diagnóstico de movimiento de pared, y eso se ve en el ecocardiograma — que además es lo que hay que pedir por la disnea, que es el síntoma que la trajo. Tres cosas se buscan ahí y las tres cambian la conducta. Primero, cuánto quedó de función ventricular: una fracción de eyección baja abre la puerta al tratamiento de la insuficiencia cardíaca y a discutir un desfibrilador. Segundo, trombo dentro del aneurisma: la sangre se estanca en esa bolsa que no se contrae, y si hay trombo hay que anticoagular. Tercero, el tamaño y si hay insuficiencia mitral. Y lo más barato y más útil de todo: conseguir los electros viejos y guardarlos con la historia. Este trazado, comparado con el del año pasado, resuelve en diez segundos una pregunta que sin él necesita una troponina seriada y una guardia entera.',
      en: 'The ECG does not diagnose an aneurysm: it suggests the pattern. An aneurysm is a wall-motion diagnosis, and that is seen on the echocardiogram — which is also what should be ordered for the breathlessness that brought her in. Three things are looked for there and all three change management. First, how much ventricular function is left: a low ejection fraction opens the door to heart-failure treatment and to discussing a defibrillator. Second, thrombus inside the aneurysm: blood stagnates in that pouch that does not contract, and if there is thrombus, anticoagulation is needed. Third, the size, and whether there is mitral regurgitation. And the cheapest and most useful thing of all: get hold of the old ECGs and keep them with the notes. This tracing, compared with last year\u2019s, settles in ten seconds a question that without it needs serial troponins and a whole shift.',
      pt: 'O ECG não diagnostica um aneurisma: sugere o padrão. O aneurisma é um diagnóstico de movimento de parede, e isso vê-se no ecocardiograma — que além disso é o que há que pedir pela dispneia, que é o sintoma que a trouxe. Três coisas se procuram ali e as três mudam a conduta. Primeiro, quanto sobrou de função ventricular: uma fração de ejeção baixa abre a porta ao tratamento da insuficiência cardíaca e a discutir um desfibrilador. Segundo, trombo dentro do aneurisma: o sangue estagna nessa bolsa que não se contrai, e se há trombo há que anticoagular. Terceiro, o tamanho e se há insuficiência mitral. E o mais barato e mais útil de tudo: conseguir os ECGs antigos e guardá-los com o prontuário. Este traçado, comparado com o do ano passado, resolve em dez segundos uma pergunta que sem ele precisa de troponinas seriadas e de um plantão inteiro.',
    },
  },

  {
    id: 'first-degree-av-block',
    record: '9619',
    age: 76, sex: 'M',
    vitals: { bp: '134/80', spo2: 97, rr: 15 },
    highlight: ['II', 'V1'],
    answer: 'primer-grado',
    metrics: { kind: 'pr' },
    // Medido: PR de 292 ms, FC 74, QRS 92 ms, eje +49°, QTc 393, variación del
    // RR 0,010, ruido 13 µV —el trazado más limpio de la sección—.
    //
    // El PR se comprobó a mano sobre el latido promedio, en dos derivaciones:
    // en V1 el segmento queda plano entre −192 y −36 ms y el QRS arranca a los
    // −32; en II la P empieza a −352 y el QRS a −44, o sea 308 ms. Las dos
    // dicen lo mismo: cerca de tres décimas de segundo.
    findings: {
      prMs: [250, 340],
      // Sin esto la medición del PR no se sostiene, y además es la mitad del
      // razonamiento del caso: si el RR es regular, no falta ningún QRS.
      irregular: false,
      qrsMs: [70, 110],
      rate: [65, 85],
      // El informe del equipo habla de isquemia inferolateral. Se midió: lo más
      // grande es V6 con −60 µV. Nada llega al milímetro, y el caso lo dice.
      stFlat: { leads: ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V5', 'V6'], max: 0.08 },
    },
    stem: {
      es: 'Hombre de 76 años, sin síntomas, electro previo a una operación de cataratas. El informe automático dice «A-V Block I». El anestesista lo lee, ve la palabra «bloqueo» y quiere suspender hasta que lo vea un cardiólogo.',
      en: '76-year-old man, no symptoms, ECG before cataract surgery. The machine\u2019s report reads "AV block I". The anaesthetist reads it, sees the word "block" and wants to postpone until a cardiologist has seen him.',
      pt: 'Homem de 76 anos, sem sintomas, ECG antes de uma cirurgia de catarata. O laudo automático diz «A-V Block I». O anestesista lê, vê a palavra «bloqueio» e quer suspender até que um cardiologista o veja.',
    },
    options: [
      { id: 'primer-grado', label: { es: 'Bloqueo AV de primer grado', en: 'First degree AV block', pt: 'Bloqueio AV de primeiro grau' } },
      { id: 'mobitz', label: { es: 'Bloqueo AV de segundo grado, Mobitz I', en: 'Second degree AV block, Mobitz I', pt: 'Bloqueio AV de segundo grau, Mobitz I' } },
      { id: 'completo', label: { es: 'Bloqueo AV completo', en: 'Complete AV block', pt: 'Bloqueio AV completo' } },
      { id: 'nodal', label: { es: 'Ritmo de la unión', en: 'Junctional rhythm', pt: 'Ritmo juncional' } },
    ],
    explain: {
      es: 'El PR mide 292 ms: casi tres décimas de segundo, siete cuadraditos y medio, cuando el techo normal son cinco. Eso es un bloqueo AV de primer grado, y todo el caso está en entender qué quiere decir ese nombre. El PR es lo que tarda el estímulo desde que sale del nodo sinusal, cruza la aurícula y atraviesa el nodo AV, hasta que empieza a despolarizar el ventrículo. Cuando se alarga, casi siempre el freno está en el nodo AV, que conduce despacio. Pero conduce. Y acá está lo que hay que ver: TODAS las P bajan. Ninguna se pierde. La prueba está en el RR, que es regular —la variación mide 0,010—: si algún QRS faltara, el ritmo tendría un hueco, y no lo tiene. Por eso el nombre es malo: no hay nada bloqueado, hay algo demorado. De paso, eso mismo descarta las otras tres opciones. No es un Mobitz I, porque en un Mobitz el PR se va alargando latido a latido hasta que una P no conduce, y ahí aparece el hueco en el RR que acá no existe. No es un bloqueo completo, porque en ése las aurículas y los ventrículos van cada uno por su lado, el PR no es constante y el ventrículo late a 35 o 45 por un ritmo de escape: éste late a 74 y cada QRS tiene su P a la misma distancia. Y no es un ritmo de la unión, porque hay P delante de cada QRS.',
      en: 'The PR measures 292 ms: almost three tenths of a second, seven and a half small squares, where the normal ceiling is five. That is first degree AV block, and the whole case is in understanding what that name means. The PR is the time the impulse takes from leaving the sinus node, crossing the atrium and passing through the AV node, until it starts to depolarize the ventricle. When it lengthens, the brake is almost always in the AV node, which conducts slowly. But it does conduct. And here is what to look at: EVERY P gets through. None is lost. The proof is in the RR, which is regular — the variation measures 0.010: if a QRS were missing, the rhythm would have a gap, and it has none. That is why the name is a poor one: nothing is blocked, something is delayed. That also rules out the other three options. It is not Mobitz I, because in a Mobitz the PR lengthens beat by beat until a P fails to conduct, and then the gap appears in the RR — which is not here. It is not complete block, because there the atria and ventricles each go their own way, the PR is not constant and the ventricle beats at 35 or 45 on an escape rhythm: this one beats at 74 and every QRS has its P at the same distance. And it is not a junctional rhythm, because there is a P in front of every QRS.',
      pt: 'O PR mede 292 ms: quase três décimos de segundo, sete quadradinhos e meio, quando o teto normal são cinco. Isso é um bloqueio AV de primeiro grau, e todo o caso está em entender o que esse nome quer dizer. O PR é o que o estímulo demora desde que sai do nó sinusal, atravessa o átrio e passa pelo nó AV, até começar a despolarizar o ventrículo. Quando se alarga, quase sempre o freio está no nó AV, que conduz devagar. Mas conduz. E aqui está o que há que ver: TODAS as P descem. Nenhuma se perde. A prova está no RR, que é regular — a variação mede 0,010: se algum QRS faltasse, o ritmo teria um buraco, e não tem. Por isso o nome é mau: não há nada bloqueado, há algo atrasado. De passagem, isso mesmo descarta as outras três opções. Não é um Mobitz I, porque num Mobitz o PR vai-se alargando batimento a batimento até que uma P não conduz, e aí aparece o buraco no RR que aqui não existe. Não é um bloqueio completo, porque nesse os átrios e os ventrículos vão cada um para seu lado, o PR não é constante e o ventrículo bate a 35 ou 45 por um ritmo de escape: este bate a 74 e cada QRS tem a sua P à mesma distância. E não é um ritmo juncional, porque há P à frente de cada QRS.',
    },
    pitfall: {
      es: 'El error del caso es el del anestesista, y es de vocabulario: la palabra «bloqueo» asusta más de lo que el hallazgo merece. Un bloqueo AV de primer grado aislado, en alguien sin síntomas, no suspende ninguna cirugía ni necesita cardiólogo. El error técnico es otro y aparece cuando el PR se alarga mucho: la P se va corriendo hacia atrás y termina montada sobre la onda T del latido anterior, donde no se la reconoce. Ahí uno cree que no hay P, y el mismo trazado pasa a leerse como un ritmo de la unión o como un bloqueo de segundo grado. La maniobra es simple: en vez de buscar la P antes del QRS, mirá la T del latido anterior y fijate si tiene una joroba que las demás no tienen. Y el tercero, que es el que cambia conductas: antes de decir «sólo primer grado», mirá el ANCHO del QRS. Un PR largo con un QRS angosto —92 ms acá— dice que el retraso está en el nodo AV, que es benigno. Un PR largo con un bloqueo de rama es otra cosa: la enfermedad está abajo, en el sistema His-Purkinje, y ese sí progresa. Por último, el informe del equipo menciona isquemia inferolateral. Se midió: el descenso más grande es el de V6, con 0,6 mm, y le siguen II y V5 con 0,5. Ninguno llega al milímetro que hace falta para llamarlo significativo.',
      en: 'The mistake in this case is the anaesthetist\u2019s, and it is one of vocabulary: the word "block" frightens more than the finding deserves. An isolated first degree AV block in someone without symptoms postpones no surgery and needs no cardiologist. The technical mistake is a different one, and it appears when the PR gets very long: the P drifts backwards and ends up sitting on top of the previous beat\u2019s T wave, where it goes unrecognised. Then one believes there is no P, and the same tracing gets read as a junctional rhythm or as second degree block. The manoeuvre is simple: instead of looking for the P before the QRS, look at the previous T wave and check whether it has a hump the others do not. And the third, which is the one that changes management: before saying "only first degree", look at the WIDTH of the QRS. A long PR with a narrow QRS — 92 ms here — says the delay is in the AV node, which is benign. A long PR with a bundle branch block is another matter: the disease is lower down, in the His-Purkinje system, and that one does progress. Finally, the machine\u2019s report mentions inferolateral ischaemia. It was measured: the largest depression is V6 at 0.6 mm, followed by II and V5 at 0.5. None reaches the millimetre needed to call it significant.',
      pt: 'O erro do caso é o do anestesista, e é de vocabulário: a palavra «bloqueio» assusta mais do que o achado merece. Um bloqueio AV de primeiro grau isolado, em alguém sem sintomas, não suspende nenhuma cirurgia nem precisa de cardiologista. O erro técnico é outro e aparece quando o PR se alarga muito: a P vai-se deslocando para trás e acaba montada sobre a onda T do batimento anterior, onde não se reconhece. Aí julga-se que não há P, e o mesmo traçado passa a ler-se como ritmo juncional ou como bloqueio de segundo grau. A manobra é simples: em vez de procurar a P antes do QRS, olhe a T do batimento anterior e veja se tem uma corcova que as outras não têm. E o terceiro, que é o que muda condutas: antes de dizer «só primeiro grau», olhe a LARGURA do QRS. Um PR longo com um QRS estreito — 92 ms aqui — diz que o atraso está no nó AV, que é benigno. Um PR longo com um bloqueio de ramo é outra coisa: a doença está mais abaixo, no sistema His-Purkinje, e essa progride. Por fim, o laudo do aparelho menciona isquemia inferolateral. Mediu-se: o maior desnível é o de V6, com 0,6 mm, seguido de II e V5 com 0,5. Nenhum chega ao milímetro necessário para o chamar significativo.',
    },
    action: {
      es: 'Se opera. Un bloqueo AV de primer grado aislado, con QRS angosto y sin síntomas, no contraindica una anestesia ni justifica una interconsulta ni monitoreo especial: es un hallazgo frecuente a los 76 años y no progresa por sí solo. Lo único que vale la pena hacer es revisar la medicación, porque acá está la causa reversible: betabloqueantes, verapamilo, diltiazem, digoxina y amiodarona alargan el PR, y si además hubiera bradicardia o síntomas, ahí sí habría algo que ajustar. Dos situaciones cambian la conducta y conviene tenerlas presentes. Una: primer grado JUNTO a un bloqueo bifascicular, que ya no es un nodo lento sino tres caminos en problemas. Otra, rara pero real: cuando el PR pasa de 300 ms, la aurícula puede terminar contrayéndose contra una válvula mitral ya cerrada, y eso da fatiga y disnea —el llamado síndrome de pseudomarcapasos—; si el paciente tiene síntomas y el PR es así de largo, hay que pensarlo en vez de mandarlo a la casa. Éste no tiene síntomas.',
      en: 'The operation goes ahead. An isolated first degree AV block, with a narrow QRS and no symptoms, contraindicates no anaesthetic and justifies neither a referral nor special monitoring: it is a common finding at 76 and does not progress on its own. The one thing worth doing is reviewing the medication, because that is where the reversible cause lies: beta blockers, verapamil, diltiazem, digoxin and amiodarone all lengthen the PR, and if there were bradycardia or symptoms as well, then there would be something to adjust. Two situations change management and are worth keeping in mind. One: first degree ALONGSIDE a bifascicular block, which is no longer a slow node but three pathways in trouble. The other, rare but real: when the PR exceeds 300 ms, the atrium can end up contracting against an already closed mitral valve, which causes fatigue and breathlessness — so-called pseudo-pacemaker syndrome; if the patient has symptoms and the PR is that long, it is worth considering rather than sending them home. This man has no symptoms.',
      pt: 'Opera-se. Um bloqueio AV de primeiro grau isolado, com QRS estreito e sem sintomas, não contraindica nenhuma anestesia nem justifica interconsulta ou monitorização especial: é um achado frequente aos 76 anos e não progride por si só. O único que vale a pena fazer é rever a medicação, porque aí está a causa reversível: betabloqueadores, verapamil, diltiazem, digoxina e amiodarona alargam o PR, e se houvesse ainda bradicardia ou sintomas, aí sim haveria algo a ajustar. Duas situações mudam a conduta e convém tê-las presentes. Uma: primeiro grau JUNTO a um bloqueio bifascicular, que já não é um nó lento mas três caminhos com problemas. A outra, rara mas real: quando o PR passa de 300 ms, o átrio pode acabar a contrair-se contra uma válvula mitral já fechada, e isso dá fadiga e dispneia — a chamada síndrome de pseudo-marca-passo; se o paciente tiver sintomas e o PR for assim tão longo, há que pensá-lo em vez de o mandar para casa. Este não tem sintomas.',
    },
  },

  {
    id: 'sinus-bradycardia',
    record: '11331',
    age: 66, sex: 'M',
    vitals: { bp: '128/76', spo2: 98, rr: 13 },
    highlight: ['II'],
    answer: 'bradicardia',
    metrics: { kind: 'rhythm' },
    // Medido: FC 44, RR regular (cv 0,004), PR 184 ms, QRS 84 ms, eje +47°,
    // QTc 330. Ruido de 5 µV: el trazado más limpio de toda la sección.
    // El ST de los miembros no pasa de 37 µV en ninguna derivación.
    findings: {
      rate: [38, 55],
      irregular: false,
      // Cada QRS tiene su P a distancia normal: es sinusal, no un ritmo de
      // escape. Sin esto, el caso no podría afirmar de dónde sale el impulso.
      prMs: [140, 210],
      qrsMs: [70, 105],
      stFlat: { leads: ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V5', 'V6'], max: 0.06 },
    },
    stem: {
      es: 'Hombre de 66 años, corredor de fondo desde los treinta, sin síntomas. Electro de control anual. La enfermera que lo toma ve 44 por minuto en el monitor, se preocupa y lo manda a la guardia antes de que el médico lo vea.',
      en: '66-year-old man, a long-distance runner since his thirties, no symptoms. Annual check-up ECG. The nurse recording it sees 44 per minute on the monitor, becomes worried and sends him to the emergency department before the doctor has seen him.',
      pt: 'Homem de 66 anos, corredor de fundo desde os trinta, sem sintomas. ECG de controle anual. A enfermeira que o realiza vê 44 por minuto no monitor, preocupa-se e o encaminha ao pronto-socorro antes que o médico o veja.',
    },
    options: [
      { id: 'bradicardia', label: { es: 'Bradicardia sinusal', en: 'Sinus bradycardia', pt: 'Bradicardia sinusal' } },
      { id: 'bloqueo', label: { es: 'Bloqueo AV completo', en: 'Complete AV block', pt: 'Bloqueio AV completo' } },
      { id: 'nodal', label: { es: 'Ritmo de la unión', en: 'Junctional rhythm', pt: 'Ritmo juncional' } },
      { id: 'paro', label: { es: 'Paro sinusal con escape', en: 'Sinus arrest with escape', pt: 'Parada sinusal com escape' } },
    ],
    explain: {
      es: 'La frecuencia es 44 y el ritmo es regular: la variación del RR mide 0,004, o sea que los latidos caen como un metrónomo. Eso ya descarta mucho. Y lo que lo define es lo que pasa ANTES de cada QRS: hay una P, siempre la misma, siempre a la misma distancia —184 ms—. Eso es bradicardia sinusal, y el nombre dice exactamente lo que hay: el nodo sinusal sigue mandando, sólo que despacio. Las otras tres opciones se caen por lo mismo que la define. No es un bloqueo completo, porque ahí las aurículas y los ventrículos van cada uno por su lado y el PR no sería constante. No es un ritmo de la unión, porque en ése no hay P delante del QRS, o aparece invertida y pegada. Y no es un paro sinusal, porque en ése habría una pausa —un hueco donde falta un latido— y acá no falta ninguno: el ritmo es lento pero parejo. El resto del electro es normal: QRS de 84 ms, eje +47°, y el ST de los miembros dentro de 0,4 mm.',
      en: 'The rate is 44 and the rhythm is regular: the RR variation measures 0.004, meaning the beats fall like a metronome. That already rules out a lot. And what defines it is what happens BEFORE each QRS: there is a P wave, always the same, always at the same distance — 184 ms. That is sinus bradycardia, and the name says exactly what is there: the sinus node is still in charge, just slowly. The other three options fall for the same reason. It is not complete block, because there the atria and ventricles each go their own way and the PR would not be constant. It is not a junctional rhythm, because that one has no P in front of the QRS, or it appears inverted and close up. And it is not sinus arrest, because that would show a pause — a gap where a beat is missing — and here none is missing: the rhythm is slow but even. The rest of the ECG is normal: QRS 84 ms, axis +47°, and limb-lead ST within 0.4 mm.',
      pt: 'A frequência é 44 e o ritmo é regular: a variação do RR mede 0,004, ou seja, os batimentos caem como um metrônomo. Isso já descarta muito. E o que a define é o que acontece ANTES de cada QRS: há uma P, sempre a mesma, sempre à mesma distância — 184 ms. Isso é bradicardia sinusal, e o nome diz exatamente o que há: o nó sinusal continua no comando, só que devagar. As outras três opções caem pelo mesmo motivo. Não é bloqueio completo, porque aí os átrios e os ventrículos vão cada um para seu lado e o PR não seria constante. Não é ritmo juncional, porque nesse não há P à frente do QRS, ou aparece invertida e colada. E não é parada sinusal, porque essa mostraria uma pausa — um buraco onde falta um batimento — e aqui não falta nenhum: o ritmo é lento mas parelho. O resto do ECG é normal: QRS de 84 ms, eixo +47° e o ST dos membros dentro de 0,4 mm.',
    },
    pitfall: {
      es: 'El error no es de lectura, es de decisión: confundir un NÚMERO con un problema. Cuarenta y cuatro por minuto en un corredor de fondo de 66 años, sin síntomas y con el resto del electro normal, es adaptación al entrenamiento, no enfermedad: el corazón entrenado bombea más por latido y necesita menos latidos. La misma frecuencia en alguien con mareos, con síncope, o que empezó betabloqueantes la semana pasada, es otra conversación entera. La frecuencia sola no decide nada; lo que decide es si hay síntomas Y si coinciden en el tiempo con la bradicardia. Segunda trampa, más técnica: a frecuencias bajas hay mucho espacio entre latidos, y ahí es fácil confundir una onda T alta con una P, o ver "pausas" donde sólo hay un ritmo lento. Se mide de R a R, no a ojo. Y una tercera que conviene tener presente: acá el QTc da 330 ms, que suena corto, pero a 44 por minuto la fórmula de Bazett sobrecorrige y achica el número. El QT sin corregir es normal; no hay QT corto.',
      en: 'The mistake is not one of reading, it is one of decision: confusing a NUMBER with a problem. Forty-four per minute in a 66-year-old long-distance runner, without symptoms and with an otherwise normal ECG, is training adaptation, not disease: the trained heart pumps more per beat and needs fewer beats. The same rate in someone with dizziness, with syncope, or who started beta blockers last week, is an entirely different conversation. The rate alone decides nothing; what decides is whether there are symptoms AND whether they coincide in time with the bradycardia. Second trap, more technical: at low rates there is a lot of space between beats, and it becomes easy to mistake a tall T wave for a P, or to see "pauses" where there is only a slow rhythm. Measure R to R, not by eye. And a third worth keeping in mind: here the QTc reads 330 ms, which sounds short, but at 44 per minute Bazett\u2019s formula over-corrects and shrinks the number. The uncorrected QT is normal; there is no short QT.',
      pt: 'O erro não é de leitura, é de decisão: confundir um NÚMERO com um problema. Quarenta e quatro por minuto num corredor de fundo de 66 anos, sem sintomas e com o resto do ECG normal, é adaptação ao treino, não doença: o coração treinado bombeia mais por batimento e precisa de menos batimentos. A mesma frequência em alguém com tonturas, com síncope, ou que começou betabloqueadores na semana passada, é outra conversa inteira. A frequência sozinha não decide nada; o que decide é se há sintomas E se coincidem no tempo com a bradicardia. Segunda armadilha, mais técnica: em frequências baixas há muito espaço entre batimentos, e aí é fácil confundir uma onda T alta com uma P, ou ver «pausas» onde só há um ritmo lento. Mede-se de R a R, não a olho. E uma terceira que convém ter presente: aqui o QTc dá 330 ms, que soa curto, mas a 44 por minuto a fórmula de Bazett sobrecorrige e encolhe o número. O QT sem corrigir é normal; não há QT curto.',
    },
    action: {
      es: 'Vuelve a su casa y sigue corriendo. Una bradicardia sinusal asintomática, con QRS angosto y electro por lo demás normal, no necesita estudios, ni monitoreo, ni marcapasos, ni suspender el ejercicio: necesita que alguien mire al paciente además del monitor. Lo único que vale preguntar es lo de siempre, y son tres cosas: si tiene síntomas —mareo, cansancio desproporcionado, síncope—, qué medicación toma (betabloqueantes, verapamilo, diltiazem, digoxina, amiodarona, y también colirios de timolol, que se olvidan porque son gotas), y si hay algo sistémico detrás, sobre todo hipotiroidismo. Si las tres respuestas son negativas, el electro está explicado. Y si alguna vez aparece síncope, lo que hay que documentar no es la frecuencia en reposo sino el ritmo DURANTE el síntoma: ahí sirve un Holter o un registrador de eventos, no otro electro de diez segundos.',
      en: 'He goes home and keeps running. An asymptomatic sinus bradycardia, with a narrow QRS and an otherwise normal ECG, needs no tests, no monitoring, no pacemaker and no stopping exercise: it needs someone to look at the patient as well as the monitor. The only things worth asking are the usual three: whether there are symptoms — dizziness, disproportionate fatigue, syncope — what medication he takes (beta blockers, verapamil, diltiazem, digoxin, amiodarone, and also timolol eye drops, which get forgotten because they are drops), and whether there is something systemic behind it, above all hypothyroidism. If all three answers are negative, the ECG is explained. And if syncope ever appears, what has to be documented is not the resting rate but the rhythm DURING the symptom: that calls for a Holter or an event recorder, not another ten-second ECG.',
      pt: 'Volta para casa e continua a correr. Uma bradicardia sinusal assintomática, com QRS estreito e ECG de resto normal, não precisa de exames, nem de monitorização, nem de marca-passo, nem de suspender o exercício: precisa que alguém olhe para o paciente além do monitor. O único que vale perguntar são as três de sempre: se tem sintomas — tontura, cansaço desproporcional, síncope —, que medicação toma (betabloqueadores, verapamil, diltiazem, digoxina, amiodarona, e também colírios de timolol, que se esquecem por serem gotas), e se há algo sistêmico por trás, sobretudo hipotiroidismo. Se as três respostas forem negativas, o ECG está explicado. E se aлguma vez surgir síncope, o que há que documentar não é a frequência em repouso mas o ritmo DURANTE o sintoma: aí serve um Holter ou um registrador de eventos, não outro ECG de dez segundos.',
    },
  },

  {
    id: 'subendocardial-ischemia',
    record: '3957',
    age: 77, sex: 'M',
    vitals: { bp: '96/58', spo2: 94, rr: 24 },
    highlight: ['aVR', 'I', 'II', 'V4', 'V5', 'V6'],
    answer: 'subendocardica',
    metrics: { kind: 'st', leads: ['aVR', 'I', 'II', 'V4', 'V5', 'V6'] },
    // Medido: ST descendido en I (−64), II (−57), aVL (−33), V4 (−65), V5 (−80)
    // y V6 (−80) µV, y ELEVADO en aVR (+63). FC 82, QRS 96 ms, eje +43°,
    // QTc 465, cv 0,052, ruido 44 µV.
    findings: {
      // Los umbrales son de medio milímetro, no de uno. El descenso
      // subendocárdico es difuso y modesto por definición: lo que llama la
      // atención es en CUÁNTAS derivaciones está, no cuánto mide en cada una.
      stDepression: { leads: ['I', 'II', 'V4', 'V5', 'V6'], min: 0.05 },
      // Y la otra mitad, que es la que cambia el diagnóstico.
      stElevation: { leads: ['aVR'], min: 0.05 },
      qrsMs: [80, 110],
      rate: [70, 95],
      irregular: false,
    },
    stem: {
      es: 'Hombre de 77 años que llega a la guardia por dolor de pecho de dos horas, opresivo, que le empezó caminando y no se le va en reposo. Está pálido, sudoroso y taquipneico. La presión es 96/58. El médico de guardia mira el electro, no encuentra ninguna derivación con el ST elevado, y lo deja en observación con troponinas.',
      en: '77-year-old man arriving at the emergency department with two hours of crushing chest pain that began while walking and does not settle at rest. He is pale, sweaty and tachypnoeic. Blood pressure is 96/58. The doctor on duty looks at the ECG, finds no lead with ST elevation, and leaves him under observation with troponins.',
      pt: 'Homem de 77 anos que chega ao pronto-socorro por dor no peito de duas horas, opressiva, que começou caminhando e não passa em repouso. Está pálido, suado e taquipneico. A pressão é 96/58. O médico de plantão olha o ECG, não encontra nenhuma derivação com o ST elevado, e o deixa em observação com troponinas.',
    },
    options: [
      { id: 'subendocardica', label: { es: 'Isquemia subendocárdica difusa — sospecha de tronco o tres vasos', en: 'Diffuse subendocardial ischaemia — left main or three-vessel disease', pt: 'Isquemia subendocárdica difusa — suspeita de tronco ou três vasos' } },
      { id: 'inespecifica', label: { es: 'Alteraciones inespecíficas de la repolarización', en: 'Non-specific repolarization changes', pt: 'Alterações inespecíficas da repolarização' } },
      { id: 'posterior', label: { es: 'IAM posterior', en: 'Posterior STEMI', pt: 'IAM posterior' } },
      { id: 'digital', label: { es: 'Efecto digitálico', en: 'Digitalis effect', pt: 'Efeito digitálico' } },
    ],
    explain: {
      es: 'Es cierto que no hay ninguna derivación con el ST elevado, si uno mira sólo las once de siempre. La que falta es aVR, que casi nadie mira, y acá está subida 0,6 mm. Y enfrente hay descenso del ST en I, II, aVL, V4, V5 y V6: entre 0,3 y 0,8 mm en cada una, seis derivaciones a la vez. Esa combinación tiene nombre y no es «inespecífico». El subendocardio —la capa más interna del músculo— es la peor irrigada del corazón: recibe la sangre al final del recorrido y contra la presión más alta. Cuando el aporte cae de golpe en TODO el territorio, no se lesiona una pared: se lesiona esa capa entera, en los dos ventrículos. El vector de esa lesión apunta hacia adentro y hacia arriba, y por eso se ALEJA de casi todas las derivaciones —que ven descenso— y apunta de frente a la única que mira el corazón desde el hombro derecho: aVR, que sube. No es una localización, es una hemodinámica: no alcanza sangre para el corazón entero. Y eso, con este cuadro clínico, apunta al tronco de la coronaria izquierda o a enfermedad de los tres vasos.',
      en: 'It is true that no lead shows ST elevation, if you only look at the usual eleven. The missing one is aVR, which almost nobody looks at, and here it is up by 0.6 mm. Facing it there is ST depression in I, II, aVL, V4, V5 and V6: between 0.3 and 0.8 mm in each, six leads at once. That combination has a name and it is not "non-specific". The subendocardium — the innermost layer of muscle — is the worst-perfused part of the heart: it receives blood at the end of the run and against the highest pressure. When supply falls sharply across the WHOLE territory, it is not one wall that is injured: it is that entire layer, in both ventricles. The vector of that injury points inward and upward, and therefore moves AWAY from almost every lead — which see depression — and points straight at the only one looking at the heart from the right shoulder: aVR, which rises. It is not a location, it is a haemodynamic state: there is not enough blood for the whole heart. And that, with this clinical picture, points to the left main coronary artery or to three-vessel disease.',
      pt: 'É verdade que nenhuma derivação mostra ST elevado, se olharmos só as onze de sempre. A que falta é aVR, que quase ninguém olha, e aqui está subida 0,6 mm. À frente há descenso do ST em I, II, aVL, V4, V5 e V6: entre 0,3 e 0,8 mm em cada uma, seis derivações ao mesmo tempo. Essa combinação tem nome e não é «inespecífica». O subendocárdio — a camada mais interna do músculo — é a pior irrigada do coração: recebe o sangue no fim do percurso e contra a pressão mais alta. Quando o aporte cai de golpe em TODO o território, não se lesiona uma parede: lesiona-se essa camada inteira, nos dois ventrículos. O vetor dessa lesão aponta para dentro e para cima, e por isso AFASTA-SE de quase todas as derivações — que veem descenso — e aponta de frente para a única que olha o coração desde o ombro direito: aVR, que sobe. Não é uma localização, é uma hemodinâmica: não chega sangue para o coração inteiro. E isso, com este quadro clínico, aponta para o tronco da coronária esquerda ou para doença de três vasos.',
    },
    pitfall: {
      es: 'El error es el del médico del caso, y es el más caro de esta sección: leer «no hay ST elevado» como «no es un infarto que corra prisa». El ST descendido difuso con aVR elevado NO es un síndrome coronario sin elevación cualquiera: es el patrón de mayor mortalidad a treinta días de todos los síndromes coronarios, y la conducta no es esperar troponinas. Hay tres cosas que ayudan a no pasarlo por alto. La primera: mirar aVR SIEMPRE. Es la derivación huérfana —no tiene vecinos, no forma grupo con nadie— y por eso se saltea; acá es la que hace el diagnóstico. La segunda: contar en cuántas derivaciones hay descenso. Una o dos es inespecífico; seis u ocho, repartidas por caras distintas, no puede ser una lesión local. La tercera: no confundirlo con el espejo de un infarto posterior, que da descenso en V1 a V3 —las de adelante— y no en las laterales e inferiores como acá; el posterior además no eleva aVR. Y tampoco es efecto digitálico: la cubeta de la digital baja el ST con una concavidad característica y no toca aVR, y este hombre está con dolor, pálido e hipotenso, que no es el cuadro de una intoxicación por digoxina. Ojo con una limitación honesta: este patrón también lo da cualquier cosa que dispare la demanda con coronarias enfermas —una anemia severa, una taquiarritmia, una sepsis— así que la pregunta siguiente siempre es qué más está pasando.',
      en: 'The mistake is the duty doctor\u2019s, and it is the most expensive one in this section: reading "no ST elevation" as "not an infarct in a hurry". Diffuse ST depression with aVR elevation is NOT just another non-ST-elevation coronary syndrome: it carries the highest thirty-day mortality of all coronary syndromes, and the management is not to wait for troponins. Three things help not to miss it. First: always look at aVR. It is the orphan lead — it has no neighbours, it belongs to no group — and that is why it gets skipped; here it is the one that makes the diagnosis. Second: count how many leads show depression. One or two is non-specific; six or eight, spread across different walls, cannot be a local lesion. Third: do not confuse it with the mirror of a posterior infarct, which gives depression in V1 to V3 — the anterior ones — and not in the lateral and inferior leads as here; and the posterior one does not elevate aVR. Nor is it digitalis effect: the digitalis sag lowers the ST with a characteristic concavity and does not touch aVR, and this man is in pain, pale and hypotensive, which is not the picture of digoxin toxicity. One honest limitation: this pattern is also produced by anything that drives demand in someone with diseased coronaries — severe anaemia, a tachyarrhythmia, sepsis — so the next question is always what else is going on.',
      pt: 'O erro é o do médico de plantão, e é o mais caro desta seção: ler «não há ST elevado» como «não é um infarto com pressa». O ST descendido difuso com aVR elevado NÃO é uma síndrome coronária sem elevação qualquer: é o padrão de maior mortalidade a trinta dias de todas as síndromes coronárias, e a conduta não é esperar troponinas. Três coisas ajudam a não o deixar passar. A primeira: olhar aVR SEMPRE. É a derivação órfã — não tem vizinhos, não forma grupo com ninguém — e por isso se salta; aqui é a que faz o diagnóstico. A segunda: contar em quantas derivações há descenso. Uma ou duas é inespecífico; seis ou oito, repartidas por paredes diferentes, não pode ser uma lesão local. A terceira: não o confundir com o espelho de um infarto posterior, que dá descenso em V1 a V3 — as da frente — e não nas laterais e inferiores como aqui; e o posterior não eleva aVR. Também não é efeito digitálico: a cubeta da digital baixa o ST com uma concavidade característica e não toca aVR, e este homem está com dor, pálido e hipotenso, que não é o quadro de uma intoxicação por digoxina. Uma limitação honesta: este padrão também é produzido por tudo o que dispare a demanda com coronárias doentes — uma anemia grave, uma taquiarritmia, uma sepse — por isso a pergunta seguinte é sempre o que mais está a acontecer.',
    },
    action: {
      es: 'Esto no espera troponinas. Con dolor en curso, hipotensión y este patrón, la conducta es la de un síndrome coronario de altísimo riesgo: avisar a hemodinamia ya, doble antiagregación y anticoagulación según el protocolo del centro, y coronariografía urgente —dentro de las dos horas—, no en las próximas veinticuatro. Con la presión en 96/58 hay que ser cuidadoso con los nitratos y con los betabloqueantes, que en un paciente al límite pueden terminar de tirarlo abajo. Mientras se organiza el traslado: oxígeno si la saturación lo pide, un acceso venoso bueno, monitorización continua —este es el paciente que hace fibrilación ventricular en el pasillo— y desfibrilador al lado. Y buscar en paralelo lo que pueda estar disparando la demanda, porque cambia el tratamiento: hemograma por si hay una anemia severa, y pensar en sepsis o en una taquiarritmia si el cuadro no cierra sólo con la coronaria.',
      en: 'This does not wait for troponins. With ongoing pain, hypotension and this pattern, management is that of a very high-risk coronary syndrome: call the cath lab now, dual antiplatelet therapy and anticoagulation per local protocol, and urgent coronary angiography — within two hours, not within the next twenty-four. With a blood pressure of 96/58 one must be careful with nitrates and beta blockers, which in a patient on the edge can finish the job. While transfer is arranged: oxygen if saturation calls for it, good venous access, continuous monitoring — this is the patient who goes into ventricular fibrillation in the corridor — and a defibrillator beside him. And look in parallel for whatever may be driving demand, because it changes treatment: a full blood count in case of severe anaemia, and think of sepsis or a tachyarrhythmia if the picture does not close on the coronary alone.',
      pt: 'Isto não espera troponinas. Com dor em curso, hipotensão e este padrão, a conduta é a de uma síndrome coronária de altíssimo risco: avisar a hemodinâmica já, dupla antiagregação e anticoagulação conforme o protocolo do centro, e coronariografia urgente — dentro de duas horas, não nas próximas vinte e quatro. Com a pressão em 96/58 há que ter cuidado com os nitratos e com os betabloqueadores, que num paciente no limite podem acabar de o derrubar. Enquanto se organiza o transporte: oxigénio se a saturação o pedir, um bom acesso venoso, monitorização contínua — este é o paciente que faz fibrilação ventricular no corredor — e desfibrilador ao lado. E procurar em paralelo o que possa estar a disparar a demanda, porque muda o tratamento: hemograma caso haja anemia grave, e pensar em sepse ou numa taquiarritmia se o quadro não fechar só com a coronária.',
    },
  },

  {
    id: 'generalized-low-voltage',
    record: '10094',
    age: 68, sex: 'F',
    vitals: { bp: '104/68', spo2: 95, rr: 20 },
    highlight: ['I', 'II', 'III', 'aVR', 'aVL', 'aVF'],
    answer: 'generalizado',
    metrics: {
      kind: 'voltage',
      limb: ['I', 'II', 'III', 'aVR', 'aVL', 'aVF'],
      chest: ['V1', 'V2', 'V3', 'V4', 'V5', 'V6'],
    },
    // Medido, de pico a pico: miembros 4,5 · 3,5 · 3,3 · 3,5 · 3,8 y 2,2 mm;
    // precordiales 6,0 · 7,8 · 7,8 · 8,7 · 7,1 y 5,3. Las DOCE por debajo de su
    // umbral: es el criterio generalizado completo, que de 160 registros
    // etiquetados LVOLT cumplen sólo dos.
    // FC 60, QRS 84 ms, eje +8°, QTc 425, ruido 67 µV. T plana o levemente
    // invertida en I, aVL, V4 y V6.
    findings: {
      // Los dos umbrales a la vez. Lo que lo separa del caso 16 es el segundo:
      // allá V4 medía 20 mm y acá NINGUNA precordial llega a 10.
      qrsAmplitude: [
        { leads: ['I', 'II', 'III', 'aVR', 'aVL', 'aVF'], max: 0.5 },
        { leads: ['V1', 'V2', 'V3', 'V4', 'V5', 'V6'], max: 1.0 },
      ],
      qrsMs: [70, 105],
      rate: [50, 72],
      irregular: false,
    },
    stem: {
      es: 'Mujer de 68 años, en consulta por cansancio y falta de aire de meses, que fue empeorando. Le cuesta subir un piso de escaleras y duerme con dos almohadas. Tiene los tobillos hinchados. Le hicieron un ecocardiograma hace un mes: «hipertrofia ventricular izquierda, paredes engrosadas, función conservada». Éste es el electro.',
      en: '68-year-old woman seen for months of fatigue and breathlessness that have been getting worse. She struggles with one flight of stairs and sleeps on two pillows. Her ankles are swollen. An echocardiogram a month ago reported "left ventricular hypertrophy, thickened walls, preserved function". This is the ECG.',
      pt: 'Mulher de 68 anos, em consulta por cansaço e falta de ar de meses, que foram piorando. Custa-lhe subir um lance de escadas e dorme com duas almofadas. Tem os tornozelos inchados. Fizeram-lhe um ecocardiograma há um mês: «hipertrofia ventricular esquerda, paredes espessadas, função conservada». Este é o ECG.',
    },
    options: [
      { id: 'generalizado', label: { es: 'Bajo voltaje generalizado', en: 'Generalized low voltage', pt: 'Baixa voltagem generalizada' } },
      { id: 'periferico', label: { es: 'Bajo voltaje sólo en los miembros', en: 'Low voltage in the limb leads only', pt: 'Baixa voltagem só nos membros' } },
      { id: 'hvi', label: { es: 'Hipertrofia ventricular izquierda', en: 'Left ventricular hypertrophy', pt: 'Hipertrofia ventricular esquerda' } },
      { id: 'normal', label: { es: 'Electrocardiograma normal', en: 'Normal electrocardiogram', pt: 'Eletrocardiograma normal' } },
    ],
    explain: {
      es: 'Las seis derivaciones de los miembros miden 4,5 · 3,5 · 3,3 · 3,5 · 3,8 y 2,2 mm de pico a pico: todas por debajo de 5. Hasta ahí es igual que el caso 16. La diferencia está en las precordiales, que allá llegaban a 20 mm y acá miden 6,0 · 7,8 · 7,8 · 8,7 · 7,1 y 5,3: NINGUNA alcanza los 10. Las doce derivaciones por debajo de su umbral, que es el criterio generalizado completo. Y eso cambia el razonamiento entero. En el caso 16 el corazón generaba 20 mm en el pecho y no llegaba a 5 en los miembros: lo que fallaba estaba en el camino, entre el corazón y el electrodo. Acá no hay ninguna derivación donde la señal llegue bien, ni siquiera las que están apoyadas sobre el tórax, a centímetros del músculo. Cuando el voltaje cae en todas partes, el problema deja de ser el camino y pasa a ser el generador: o hay líquido rodeando el corazón, o hay menos músculo capaz de despolarizarse del que debería. Y acá está la clave del caso, que no está en el electro sino al lado: el eco dice paredes ENGROSADAS. Un ventrículo con paredes gruesas debería dar voltajes altos, no bajos. Esa contradicción —mucho músculo en la imagen, poca electricidad en el papel— tiene nombre propio.',
      en: 'The six limb leads measure 4.5 · 3.5 · 3.3 · 3.5 · 3.8 and 2.2 mm peak to peak: all below 5. So far it is the same as case 16. The difference is in the chest leads, which there reached 20 mm and here measure 6.0 · 7.8 · 7.8 · 8.7 · 7.1 and 5.3: NONE reaches 10. All twelve leads below their threshold, which is the full generalized criterion. And that changes the whole reasoning. In case 16 the heart generated 20 mm on the chest and could not manage 5 in any limb lead: what failed was on the way, between the heart and the electrode. Here there is no lead where the signal arrives properly, not even the ones resting on the chest, centimetres from the muscle. When the voltage falls everywhere, the problem stops being the path and becomes the generator: either there is fluid surrounding the heart, or there is less muscle able to depolarize than there should be. And here is the key to the case, which is not on the ECG but beside it: the echo says THICKENED walls. A ventricle with thick walls should give high voltages, not low ones. That contradiction — a lot of muscle on the image, little electricity on the paper — has a name of its own.',
      pt: 'As seis derivações dos membros medem 4,5 · 3,5 · 3,3 · 3,5 · 3,8 e 2,2 mm de pico a pico: todas abaixo de 5. Até aí é igual ao caso 16. A diferença está nas precordiais, que lá chegavam a 20 mm e aqui medem 6,0 · 7,8 · 7,8 · 8,7 · 7,1 e 5,3: NENHUMA alcança os 10. As doze derivações abaixo do seu limiar, que é o critério generalizado completo. E isso muda o raciocínio inteiro. No caso 16 o coração gerava 20 mm no peito e não chegava a 5 em nenhum membro: o que falhava estava no caminho, entre o coração e o elétrodo. Aqui não há nenhuma derivação onde o sinal chegue bem, nem sequer as que estão apoiadas sobre o tórax, a centímetros do músculo. Quando a voltagem cai em todo o lado, o problema deixa de ser o caminho e passa a ser o gerador: ou há líquido a rodear o coração, ou há menos músculo capaz de se despolarizar do que deveria. E aqui está a chave do caso, que não está no ECG mas ao lado: o eco diz paredes ESPESSADAS. Um ventrículo com paredes grossas deveria dar voltagens altas, não baixas. Essa contradição — muito músculo na imagem, pouca eletricidade no papel — tem nome próprio.',
    },
    pitfall: {
      es: 'La disociación entre voltaje y masa es el hallazgo del caso, y es el que más se pasa por alto porque exige mirar dos estudios a la vez. Un eco con paredes engrosadas hace escribir «hipertrofia ventricular izquierda» casi en automático — y entonces uno espera un electro con voltajes ALTOS, criterios de Sokolow, ondas R grandes. Cuando el electro dice lo contrario, la contradicción no es un error de ninguno de los dos: es el diagnóstico. En la hipertrofia de verdad hay más miocito, y más miocito da más electricidad. En la amiloidosis cardíaca la pared es gruesa porque está INFILTRADA de proteína entre las fibras: el eco ve una pared ancha y el electro ve poco músculo eléctricamente activo. Voltaje bajo con paredes gruesas es amiloidosis hasta que se demuestre lo contrario. El otro error es el opuesto y más simple: llamar normal a este electro. No hay ST elevado, no hay Q, el ritmo es sinusal a 60 y el QRS mide 84 ms — todo parece en orden si uno busca lo de siempre. Pero el tamaño de los complejos ES el hallazgo, y hay que escribirlo. Y una precisión honesta: nada de esto se diagnostica con el electro. El trazado aporta una pieza —el voltaje bajo— que junto a la otra —la pared gruesa— obliga a seguir buscando; no cierra nada solo. También conviene no olvidar las causas más banales y frecuentes de voltaje bajo generalizado, que hay que descartar antes: derrame pericárdico, obesidad importante, enfisema y anasarca.',
      en: 'The mismatch between voltage and mass is the finding of this case, and it is the one most often missed because it requires looking at two studies at once. An echo with thickened walls gets written up as "left ventricular hypertrophy" almost automatically — and then one expects an ECG with HIGH voltages, Sokolow criteria, big R waves. When the ECG says the opposite, the contradiction is not an error in either of them: it is the diagnosis. In true hypertrophy there are more myocytes, and more myocytes give more electricity. In cardiac amyloidosis the wall is thick because it is INFILTRATED with protein between the fibres: the echo sees a wide wall and the ECG sees little electrically active muscle. Low voltage with thick walls is amyloidosis until proven otherwise. The other mistake is the opposite and simpler one: calling this ECG normal. There is no ST elevation, no Q waves, the rhythm is sinus at 60 and the QRS measures 84 ms — everything looks in order if you look for the usual things. But the size of the complexes IS the finding, and it has to be written down. And an honest qualification: none of this is diagnosed by the ECG. The tracing contributes one piece — the low voltage — which together with the other one — the thick wall — forces you to keep looking; on its own it closes nothing. It is also worth not forgetting the more banal and frequent causes of generalized low voltage, which must be excluded first: pericardial effusion, significant obesity, emphysema and anasarca.',
      pt: 'A dissociação entre voltagem e massa é o achado do caso, e é o que mais passa despercebido porque exige olhar dois exames ao mesmo tempo. Um eco com paredes espessadas faz escrever «hipertrofia ventricular esquerda» quase automaticamente — e então espera-se um ECG com voltagens ALTAS, critérios de Sokolow, ondas R grandes. Quando o ECG diz o contrário, a contradição não é um erro de nenhum dos dois: é o diagnóstico. Na hipertrofia verdadeira há mais miócitos, e mais miócitos dão mais eletricidade. Na amiloidose cardíaca a parede é grossa porque está INFILTRADA de proteína entre as fibras: o eco vê uma parede larga e o ECG vê pouco músculo eletricamente ativo. Voltagem baixa com paredes grossas é amiloidose até prova em contrário. O outro erro é o oposto e mais simples: chamar normal a este ECG. Não há ST elevado, não há Q, o ritmo é sinusal a 60 e o QRS mede 84 ms — tudo parece em ordem se se procurar o de sempre. Mas o tamanho dos complexos É o achado, e tem de ser escrito. E uma precisão honesta: nada disto se diagnostica com o ECG. O traçado aporta uma peça — a voltagem baixa — que junto à outra — a parede grossa — obriga a continuar a procurar; sozinho não fecha nada. Convém também não esquecer as causas mais banais e frequentes de voltagem baixa generalizada, que há que excluir primeiro: derrame pericárdico, obesidade importante, enfisema e anasarca.',
    },
    action: {
      es: 'El informe del electro se escribe completo —«bajo voltaje generalizado, en miembros y precordiales»— y con eso en la mano se vuelve sobre el ecocardiograma, que es donde está la otra mitad. Lo que hay que pedirle al ecocardiografista es que mire específicamente lo que sugiere infiltración: el aspecto granular brillante del miocardio, el engrosamiento del septo interauricular y de las válvulas, el derrame pericárdico pequeño, y sobre todo el strain longitudinal con el patrón de respeto apical, que es bastante característico. Si eso aparece, el camino sigue con resonancia cardíaca —que mide el realce tardío y el volumen extracelular—, con el centellograma con difosfonatos, que distingue la amiloidosis por transtiretina sin necesidad de biopsia, y con el estudio de cadenas livianas en sangre y orina para descartar la forma AL, que es la urgente porque se trata con hematología. Importa hacerlo: la transtiretina hoy tiene tratamiento específico, y el pronóstico cambia según cuándo se empiece. Y algo práctico mientras tanto: en la amiloidosis cardíaca la digoxina y los calcioantagonistas se toleran mal, y los betabloqueantes suelen sentar peor de lo esperado, así que conviene revisar la medicación antes de agregar nada.',
      en: 'The ECG report is written in full — "generalized low voltage, in limb and chest leads" — and with that in hand you go back to the echocardiogram, which is where the other half is. What to ask the echocardiographer to look for specifically is what suggests infiltration: the bright granular appearance of the myocardium, thickening of the interatrial septum and the valves, a small pericardial effusion, and above all longitudinal strain with the apical sparing pattern, which is fairly characteristic. If that appears, the path continues with cardiac MRI — which measures late enhancement and extracellular volume — with a bone-tracer scintigraphy, which identifies transthyretin amyloidosis without a biopsy, and with serum and urine light chains to exclude the AL form, which is the urgent one because it is treated by haematology. It matters to do this: transthyretin amyloidosis now has specific treatment, and prognosis depends on when it is started. And something practical meanwhile: in cardiac amyloidosis digoxin and calcium channel blockers are poorly tolerated, and beta blockers usually sit worse than expected, so the medication is worth reviewing before adding anything.',
      pt: 'O laudo do ECG escreve-se completo — «baixa voltagem generalizada, em membros e precordiais» — e com isso na mão volta-se ao ecocardiograma, que é onde está a outra metade. O que há que pedir ao ecocardiografista é que olhe especificamente o que sugere infiltração: o aspeto granular brilhante do miocárdio, o espessamento do septo interatrial e das válvulas, o derrame pericárdico pequeno, e sobretudo o strain longitudinal com o padrão de poupança apical, que é bastante característico. Se isso aparecer, o caminho segue com ressonância cardíaca — que mede o realce tardio e o volume extracelular —, com a cintilografia com difosfonatos, que distingue a amiloidose por transtirretina sem necessidade de biópsia, e com o estudo de cadeias leves em sangue e urina para excluir a forma AL, que é a urgente porque se trata com hematologia. Importa fazê-lo: a transtirretina tem hoje tratamento específico, e o prognóstico muda conforme quando se comece. E algo prático entretanto: na amiloidose cardíaca a digoxina e os antagonistas do cálcio toleram-se mal, e os betabloqueadores costumam sentar pior do que o esperado, por isso convém rever a medicação antes de acrescentar nada.',
    },
  },

  {
    id: 'svt',
    record: '7889',
    age: 74, sex: 'F',
    vitals: { bp: '104/64', spo2: 97, rr: 20 },
    highlight: ['II', 'V1'],
    answer: 'tsv',
    metrics: { kind: 'rhythm' },
    // Medido: FC 160, RR regular (cv 0,011), QRS 88 ms, eje −14°, QTc 395,
    // ruido 37 µV. El PR no se puede medir: no hay onda P que medir, y eso es
    // parte del hallazgo. ST descendido en I (−126) y aVL (−120) µV, elevado en
    // V1 (+232) y V2 (+224): cambios de frecuencia, no de territorio.
    findings: {
      rate: [150, 180],
      irregular: false,
      qrsMs: [70, 105],
    },
    stem: {
      es: 'Mujer de 74 años en la guardia por palpitaciones que empezaron de golpe hace una hora, mientras estaba sentada. Dice que fue «como si se encendiera un motor». Está incómoda pero lúcida, sin dolor de pecho ni disnea. La presión es 104/64 y se mantiene.',
      en: '74-year-old woman in the emergency department with palpitations that started abruptly an hour ago while she was sitting. She says it was "like an engine switching on". She is uncomfortable but alert, with no chest pain and no breathlessness. Blood pressure is 104/64 and holding.',
      pt: 'Mulher de 74 anos no pronto-socorro por palpitações que começaram de repente há uma hora, enquanto estava sentada. Diz que foi «como se ligasse um motor». Está incomodada mas lúcida, sem dor no peito nem dispneia. A pressão é 104/64 e mantém-se.',
    },
    options: [
      { id: 'tsv', label: { es: 'Taquicardia supraventricular', en: 'Supraventricular tachycardia', pt: 'Taquicardia supraventricular' } },
      { id: 'sinusal', label: { es: 'Taquicardia sinusal', en: 'Sinus tachycardia', pt: 'Taquicardia sinusal' } },
      { id: 'fa', label: { es: 'Fibrilación auricular con respuesta rápida', en: 'Atrial fibrillation with rapid response', pt: 'Fibrilação atrial com resposta rápida' } },
      { id: 'tv', label: { es: 'Taquicardia ventricular', en: 'Ventricular tachycardia', pt: 'Taquicardia ventricular' } },
    ],
    explain: {
      es: 'Tres adjetivos resuelven este trazado, y los tres están medidos. RÁPIDA: 160 por minuto. REGULAR: la variación del RR mide 0,011, o sea que los complejos caen como un reloj. Y ANGOSTA: el QRS mide 88 ms. Con eso solo ya se llega. Angosto quiere decir que el impulso bajó por el sistema de conducción normal, el His y las dos ramas, porque es el único camino que despolariza los dos ventrículos a la vez y rápido. Y si bajó por ahí, el origen está por ENCIMA de los ventrículos: supraventricular. Eso descarta de entrada la taquicardia ventricular, que necesita un QRS ancho. Regular descarta la fibrilación auricular, que es irregular por definición y acá daría una variación diez veces mayor. Y queda la taquicardia sinusal, que se descarta por dos cosas: por la frecuencia, porque 160 es demasiado para un nodo sinusal en una mujer de 74 años en reposo —la frecuencia sinusal máxima ronda 220 menos la edad, y a los 74 eso es 146—; y por el relato, porque la sinusal acelera y desacelera de a poco, mientras que ésta empezó «de golpe». Fijate además en lo que NO hay: delante de cada QRS no se ve onda P. En la sinusal siempre hay una. Acá la aurícula se está despolarizando hacia atrás, casi al mismo tiempo que el ventrículo, y la P queda escondida dentro del QRS.',
      en: 'Three adjectives settle this tracing, and all three are measured. FAST: 160 per minute. REGULAR: the RR variation measures 0.011, meaning the complexes fall like clockwork. And NARROW: the QRS measures 88 ms. That alone gets you there. Narrow means the impulse came down the normal conduction system, the His and the two bundles, because that is the only path that depolarizes both ventricles at once and quickly. And if it came down there, the origin is ABOVE the ventricles: supraventricular. That rules out ventricular tachycardia from the start, which needs a wide QRS. Regular rules out atrial fibrillation, irregular by definition, which here would give a variation ten times larger. That leaves sinus tachycardia, ruled out by two things: by the rate, because 160 is too much for a sinus node in a 74-year-old woman at rest — maximum sinus rate is around 220 minus age, and at 74 that is 146 — and by the history, because sinus tachycardia speeds up and slows down gradually, while this one started "abruptly". Note also what is NOT there: no P wave is visible in front of each QRS. In sinus tachycardia there is always one. Here the atrium is depolarizing backwards, almost at the same time as the ventricle, and the P hides inside the QRS.',
      pt: 'Três adjetivos resolvem este traçado, e os três estão medidos. RÁPIDA: 160 por minuto. REGULAR: a variação do RR mede 0,011, ou seja, os complexos caem como um relógio. E ESTREITA: o QRS mede 88 ms. Só com isso já se chega. Estreito quer dizer que o impulso desceu pelo sistema de condução normal, o His e os dois ramos, porque é o único caminho que despolariza os dois ventrículos ao mesmo tempo e depressa. E se desceu por aí, a origem está ACIMA dos ventrículos: supraventricular. Isso exclui logo a taquicardia ventricular, que precisa de um QRS largo. Regular exclui a fibrilação atrial, irregular por definição, que aqui daria uma variação dez vezes maior. Resta a taquicardia sinusal, excluída por duas coisas: pela frequência, porque 160 é demasiado para um nó sinusal numa mulher de 74 anos em repouso — a frequência sinusal máxima ronda 220 menos a idade, e aos 74 isso são 146 — e pela história, porque a sinusal acelera e desacelera aos poucos, enquanto esta começou «de repente». Repare também no que NÃO há: à frente de cada QRS não se vê onda P. Na sinusal há sempre uma. Aqui o átrio está a despolarizar-se para trás, quase ao mesmo tempo que o ventrículo, e a P esconde-se dentro do QRS.',
    },
    pitfall: {
      es: 'El error más caro de este trazado no está en el diagnóstico sino en lo que se hace después, y empieza mirando el ST. Acá hay descenso en I y aVL —1,3 y 1,2 mm— y elevación en V1 y V2 —2,3 y 2,2—. Eso no es un infarto: a 160 por minuto el subendocardio se queda corto de sangre simplemente porque la diástole, que es cuando se llena la coronaria, casi desaparece. Son cambios de FRECUENCIA, no de territorio, y lo que hay que hacer es bajarla y repetir el electro, no mandar a hemodinamia. El segundo error es el opuesto y peor: si el QRS fuera ANCHO, la regla cambia por completo. Una taquicardia regular de QRS ancho es taquicardia ventricular hasta que se demuestre lo contrario, sobre todo en alguien de 74 años con cardiopatía, y tratarla como supraventricular con verapamilo puede matar al paciente. Acá el QRS mide 88 ms y esa puerta está cerrada, pero conviene medirlo siempre antes de decidir. Y el tercero: no confundir «no veo P» con «no hay actividad auricular». La P está, escondida dentro del QRS o justo detrás, deformando el final del complejo. Por eso la maniobra vagal y la adenosina sirven para dos cosas a la vez: pueden cortar la taquicardia, y si no la cortan, frenan el nodo y dejan ver qué estaba pasando en la aurícula — que es como aparece el aleteo que nadie había visto.',
      en: 'The most expensive mistake on this tracing is not the diagnosis but what comes next, and it starts by looking at the ST. There is depression in I and aVL — 1.3 and 1.2 mm — and elevation in V1 and V2 — 2.3 and 2.2. That is not an infarct: at 160 per minute the subendocardium runs short of blood simply because diastole, which is when the coronary fills, almost disappears. These are RATE changes, not territorial ones, and what to do is slow the rate and repeat the ECG, not call the cath lab. The second mistake is the opposite and worse: if the QRS were WIDE, the rule changes completely. A regular wide-complex tachycardia is ventricular tachycardia until proven otherwise, especially in a 74-year-old with heart disease, and treating it as supraventricular with verapamil can kill the patient. Here the QRS measures 88 ms and that door is shut, but it is always worth measuring before deciding. And the third: do not confuse "I cannot see a P" with "there is no atrial activity". The P is there, hidden inside the QRS or just behind it, deforming the end of the complex. That is why vagal manoeuvres and adenosine serve two purposes at once: they may terminate the tachycardia, and if they do not, they slow the node and reveal what the atrium was doing — which is how the flutter nobody had seen shows up.',
      pt: 'O erro mais caro deste traçado não está no diagnóstico mas no que se faz depois, e começa a olhar o ST. Há descenso em I e aVL — 1,3 e 1,2 mm — e elevação em V1 e V2 — 2,3 e 2,2. Isso não é um infarto: a 160 por minuto o subendocárdio fica sem sangue simplesmente porque a diástole, que é quando a coronária se enche, quase desaparece. São alterações de FREQUÊNCIA, não de território, e o que há que fazer é baixá-la e repetir o ECG, não chamar a hemodinâmica. O segundo erro é o oposto e pior: se o QRS fosse LARGO, a regra muda por completo. Uma taquicardia regular de QRS largo é taquicardia ventricular até prova em contrário, sobretudo em alguém de 74 anos com cardiopatia, e tratá-la como supraventricular com verapamil pode matar o paciente. Aqui o QRS mede 88 ms e essa porta está fechada, mas convém medi-lo sempre antes de decidir. E o terceiro: não confundir «não vejo P» com «não há atividade atrial». A P está, escondida dentro do QRS ou logo atrás, a deformar o fim do complexo. Por isso a manobra vagal e a adenosina servem para duas coisas ao mesmo tempo: podem cortar a taquicardia, e se não a cortarem, travam o nó e deixam ver o que o átrio estava a fazer — que é como aparece o flutter que ninguém tinha visto.',
    },
    action: {
      es: 'Está estable —lúcida, sin dolor, con la presión sostenida— así que hay tiempo, y el orden es de menos a más. Primero maniobras vagales, y hechas bien: la de Valsalva modificada, soplando contra una jeringa quince segundos y acostando al paciente con las piernas elevadas enseguida después, convierte bastante más que la clásica. Si no cede, adenosina en bolo rápido por una vena gruesa y con suero empujando atrás, porque dura segundos en sangre; se avisa antes al paciente de que va a sentir una opresión desagradable y fugaz, que si no es una experiencia horrible. Si tampoco cede, un bloqueante del nodo de acción más larga —diltiazem o un betabloqueante— siempre que no haya insuficiencia cardíaca descompensada. Y la regla que no se negocia: si en algún momento se vuelve inestable —hipotensión que no responde, dolor isquémico, deterioro de conciencia, edema agudo de pulmón— se deja la farmacología y se hace cardioversión eléctrica sincronizada, con sedación si el estado lo permite. Después de convertir, un electro en ritmo sinusal, que es tanto o más importante que el de la taquicardia: es donde puede aparecer una onda delta de preexcitación que cambia todo el manejo a futuro, y donde se ve si aquellos cambios del ST se normalizaron.',
      en: 'She is stable — alert, pain-free, blood pressure holding — so there is time, and the order goes from least to most. First vagal manoeuvres, done properly: the modified Valsalva, blowing against a syringe for fifteen seconds and then immediately lying the patient flat with the legs raised, converts considerably more than the classic version. If it does not break, adenosine as a rapid bolus through a large vein with a saline flush behind it, because it lasts seconds in the blood; warn the patient beforehand that they will feel an unpleasant, fleeting tightness, otherwise it is a horrible experience. If that fails, a longer-acting nodal blocker — diltiazem or a beta blocker — as long as there is no decompensated heart failure. And the rule that is not negotiable: if at any point she becomes unstable — hypotension that does not respond, ischaemic pain, reduced consciousness, acute pulmonary oedema — drop the pharmacology and perform synchronized electrical cardioversion, with sedation if her state allows. After conversion, an ECG in sinus rhythm, which matters as much as or more than the one in tachycardia: it is where a delta wave of pre-excitation may appear, changing all future management, and where you see whether those ST changes normalized.',
      pt: 'Está estável — lúcida, sem dor, com a pressão mantida — por isso há tempo, e a ordem vai de menos a mais. Primeiro manobras vagais, e bem feitas: a de Valsalva modificada, soprando contra uma seringa quinze segundos e deitando o paciente com as pernas elevadas logo a seguir, converte bastante mais do que a clássica. Se não ceder, adenosina em bólus rápido por uma veia grossa e com soro a empurrar atrás, porque dura segundos no sangue; avisa-se antes o paciente de que vai sentir uma opressão desagradável e fugaz, senão é uma experiência horrível. Se também não ceder, um bloqueador do nó de ação mais longa — diltiazem ou um betabloqueador — desde que não haja insuficiência cardíaca descompensada. E a regra que não se negoceia: se a certa altura ficar instável — hipotensão que não responde, dor isquémica, deterioração da consciência, edema agudo do pulmão — deixa-se a farmacologia e faz-se cardioversão elétrica sincronizada, com sedação se o estado o permitir. Depois de converter, um ECG em ritmo sinusal, que importa tanto ou mais do que o da taquicardia: é onde pode aparecer uma onda delta de pré-excitação que muda todo o manejo futuro, e onde se vê se aquelas alterações do ST normalizaram.',
    },
  },

  {
    id: 'blocked-pac',
    record: '4110',
    age: 40, sex: 'F',
    vitals: { bp: '118/74', spo2: 99, rr: 14 },
    highlight: ['II'],
    answer: 'extrasistole',
    metrics: { kind: 'pause' },
    // Medido: los RR son 636 704 728 [1372] 664 660 664 708 684 688 732 [1404]
    // ms. El más corto mide 636 y el más largo 1404: la pausa entra 2,21 veces
    // en el ciclo. FC 86, QRS 72 ms, PR 156 ms, eje +50°, QTc 409.
    findings: {
      // El número del caso. Por debajo de 2 sería un Wenckebach; acá pasa de 2.
      pauseRatio: [2.0, 2.6],
      rate: [75, 95],
      qrsMs: [60, 100],
      // Los latidos conducidos tienen PR normal y constante: entre pausa y
      // pausa no hay nada anormal, que es justamente el argumento del caso.
      prMs: [130, 190],
    },
    stem: {
      es: 'Mujer de 40 años, sana, que consulta porque «el corazón se le para un segundo» varias veces al día, sobre todo de noche al acostarse. Lo describe como un vacío en el pecho seguido de un golpe fuerte. No tiene mareos ni se desmayó nunca. El examen es normal. Le hicieron este electro y el informe automático dice «latidos caídos».',
      en: '40-year-old woman, healthy, who comes because "her heart stops for a second" several times a day, mostly at night when lying down. She describes it as a void in the chest followed by a strong thump. No dizziness, never fainted. Examination is normal. This ECG was recorded and the machine report reads "dropped beats".',
      pt: 'Mulher de 40 anos, saudável, que consulta porque «o coração lhe para um segundo» várias vezes ao dia, sobretudo à noite ao deitar-se. Descreve-o como um vazio no peito seguido de uma pancada forte. Não tem tonturas nem desmaiou nunca. O exame é normal. Fizeram-lhe este ECG e o laudo automático diz «batimentos caídos».',
    },
    options: [
      { id: 'extrasistole', label: { es: 'Extrasístole auricular bloqueada', en: 'Blocked atrial premature beat', pt: 'Extrassístole atrial bloqueada' } },
      { id: 'wenckebach', label: { es: 'Bloqueo AV de segundo grado, Mobitz I', en: 'Second degree AV block, Mobitz I', pt: 'Bloqueio AV de segundo grau, Mobitz I' } },
      { id: 'mobitz2', label: { es: 'Bloqueo AV de segundo grado, Mobitz II', en: 'Second degree AV block, Mobitz II', pt: 'Bloqueio AV de segundo grau, Mobitz II' } },
      { id: 'paro', label: { es: 'Paro sinusal', en: 'Sinus arrest', pt: 'Parada sinusal' } },
    ],
    explain: {
      es: 'Un latido que falta tiene tres causas posibles y las tres se distinguen midiendo UNA sola cosa: cuánto dura la pausa comparada con el ciclo normal. Acá los RR miden 636, 704, 728, después una pausa de 1372, y más adelante otra de 1404. El RR más corto es 636. La pausa más larga entra 2,21 veces en él: algo más que el doble. Ese número dice lo siguiente. Si hubiera habido un Wenckebach, el PR se habría ido alargando latido a latido antes de fallar, y cada alargamiento acorta el RR siguiente: la pausa termina durando MENOS que dos ciclos. Si hubiera fallado el nodo sinusal, la pausa no tendría por qué guardar ninguna relación con el ciclo — duraría lo que se le antojara. Y si una P llegó demasiado pronto y encontró el nodo AV todavía refractario, esa P no conduce pero SÍ reinicia el nodo sinusal, y la pausa termina midiendo casi exactamente dos ciclos. Eso es lo que pasa acá. La otra mitad de la prueba está en los latidos que sí conducen: el PR mide 156 ms y es igual en todos, antes y después de la pausa. En un bloqueo AV de verdad el PR cuenta algo —se alarga, o es fijo pero con P que no conducen—; acá no pasa nada entre pausa y pausa, porque no hay nada malo con el nodo AV: hubo una P prematura que llegó a destiempo.',
      en: 'A missing beat has three possible causes, and all three are told apart by measuring ONE thing: how long the pause lasts compared with the normal cycle. Here the RR intervals measure 636, 704, 728, then a pause of 1372, and later another of 1404. The shortest RR is 636. The longest pause fits into it 2.21 times: a little more than double. That number says the following. If this had been a Wenckebach, the PR would have been lengthening beat by beat before failing, and each lengthening shortens the following RR: the pause ends up lasting LESS than two cycles. If the sinus node had failed, the pause would bear no particular relation to the cycle — it would last whatever it pleased. And if a P arrived too early and found the AV node still refractory, that P does not conduct but DOES reset the sinus node, and the pause ends up measuring almost exactly two cycles. That is what happens here. The other half of the proof is in the beats that do conduct: the PR measures 156 ms and is the same in all of them, before and after the pause. In a real AV block the PR tells a story — it lengthens, or it is fixed but with P waves that fail to conduct; here nothing happens between one pause and the next, because there is nothing wrong with the AV node: a premature P simply arrived at the wrong moment.',
      pt: 'Um batimento que falta tem três causas possíveis, e as três distinguem-se medindo UMA só coisa: quanto dura a pausa comparada com o ciclo normal. Aqui os RR medem 636, 704, 728, depois uma pausa de 1372, e mais adiante outra de 1404. O RR mais curto é 636. A pausa mais longa cabe nele 2,21 vezes: um pouco mais do que o dobro. Esse número diz o seguinte. Se tivesse havido um Wenckebach, o PR ter-se-ia alargado batimento a batimento antes de falhar, e cada alargamento encurta o RR seguinte: a pausa acaba por durar MENOS do que dois ciclos. Se tivesse falhado o nó sinusal, a pausa não teria de guardar nenhuma relação com o ciclo — duraria o que lhe apetecesse. E se uma P chegou cedo demais e encontrou o nó AV ainda refratário, essa P não conduz mas RE-INICIA o nó sinusal, e a pausa acaba por medir quase exatamente dois ciclos. É o que acontece aqui. A outra metade da prova está nos batimentos que conduzem: o PR mede 156 ms e é igual em todos, antes e depois da pausa. Num bloqueio AV verdadeiro o PR conta alguma coisa — alarga-se, ou é fixo mas com P que não conduzem; aqui não acontece nada entre uma pausa e outra, porque não há nada de errado com o nó AV: chegou uma P prematura fora de tempo.',
    },
    pitfall: {
      es: 'La trampa es que la extrasístole auricular bloqueada es, de lejos, la causa más frecuente de una pausa inesperada, y es la que más se confunde con un bloqueo AV de segundo grado — que es benigno en un caso y motivo de marcapasos en el otro. Lo que decide es dónde está escondida la P prematura: cuando llega tan temprano, cae encima de la onda T del latido anterior y la deforma. La maniobra es mirar las T que rodean la pausa y compararlas con las demás: la que precede a la pausa tiene una joroba, una muesca, una punta distinta. Si esa T es diferente, hay una P adentro y el caso está resuelto. Si todas las T son idénticas y el latido simplemente falta, ahí sí hay que pensar en bloqueo. Segundo punto, y es de conducta: esta paciente siente el latido POSTERIOR a la pausa, no la pausa. Después de un silencio el ventrículo se llenó más de lo habitual, y el latido siguiente sale con más fuerza — eso es el golpe que describe. Explicarlo suele tranquilizar más que cualquier estudio. Y una limitación honesta de la medición: la razón de 2,21 dice que la pausa no vino precedida de decremento, que es lo que descarta el Wenckebach. No prueba por sí sola que haya una P prematura — eso hay que verlo en la T. El número descarta; la vista confirma.',
      en: 'The trap is that a blocked atrial premature beat is by far the commonest cause of an unexpected pause, and the one most often confused with second degree AV block — benign in one case, a pacemaker question in the other. What decides it is where the premature P is hiding: arriving that early, it lands on the previous beat\u2019s T wave and deforms it. The manoeuvre is to look at the T waves around the pause and compare them with the rest: the one preceding the pause has a hump, a notch, a different peak. If that T is different, there is a P inside it and the case is solved. If all the T waves are identical and the beat is simply missing, then block does need considering. Second point, and it concerns management: this patient feels the beat AFTER the pause, not the pause. After a silence the ventricle has filled more than usual, and the next beat comes out stronger — that is the thump she describes. Explaining it usually reassures more than any test. And an honest limitation of the measurement: the ratio of 2.21 says the pause was not preceded by decrement, which is what rules out Wenckebach. It does not by itself prove there is a premature P — that has to be seen in the T wave. The number rules out; the eye confirms.',
      pt: 'A armadilha é que a extrassístole atrial bloqueada é, de longe, a causa mais frequente de uma pausa inesperada, e a que mais se confunde com um bloqueio AV de segundo grau — benigno num caso, motivo de marca-passo no outro. O que decide é onde está escondida a P prematura: ao chegar tão cedo, cai sobre a onda T do batimento anterior e deforma-a. A manobra é olhar as T que rodeiam a pausa e compará-las com as outras: a que precede a pausa tem uma corcova, um entalhe, uma ponta diferente. Se essa T for diferente, há uma P lá dentro e o caso está resolvido. Se todas as T forem idênticas e o batimento simplesmente faltar, aí sim há que pensar em bloqueio. Segundo ponto, e é de conduta: esta paciente sente o batimento POSTERIOR à pausa, não a pausa. Depois de um silêncio o ventrículo encheu-se mais do que o habitual, e o batimento seguinte sai com mais força — essa é a pancada que descreve. Explicá-lo costuma tranquilizar mais do que qualquer exame. E uma limitação honesta da medição: a razão de 2,21 diz que a pausa não veio precedida de decremento, que é o que exclui o Wenckebach. Não prova por si só que haja uma P prematura — isso tem de se ver na T. O número exclui; a vista confirma.',
    },
    action: {
      es: 'No hay nada que tratar. Las extrasístoles auriculares son un hallazgo normal, aparecen en prácticamente todo el mundo con un Holter de 24 horas, y bloqueadas o no, no tienen ninguna consecuencia en un corazón sano. Lo que sí hay que hacer es lo que más sirve y menos se hace: explicar el mecanismo. Cuando la paciente entiende que el golpe que siente es el latido de después —el ventrículo que se llenó de más durante el silencio— y no el corazón «arrancando de nuevo», los síntomas suelen molestar mucho menos sin ningún tratamiento. Vale preguntar por los disparadores habituales, que son los mismos de siempre y a veces alcanza con corregirlos: café, alcohol, mala noche, estrés, y en el cuadro nocturno también el reflujo y la posición. Si molestaran mucho pese a todo, un betabloqueante a dosis baja es razonable, pero es tratar un síntoma, no un riesgo. Y la salvedad de siempre, que es lo único que cambiaría la conducta: si alguna vez aparece síncope, o si las palpitaciones vienen con mareo, disnea o dolor, deja de ser un hallazgo benigno y se estudia el ritmo DURANTE el síntoma, con Holter o registrador de eventos.',
      en: 'There is nothing to treat. Atrial premature beats are a normal finding, appearing in practically everyone on a 24-hour Holter, and blocked or not, they have no consequences in a healthy heart. What does need doing is the thing that helps most and is done least: explaining the mechanism. When the patient understands that the thump she feels is the beat afterwards — the ventricle that overfilled during the silence — and not the heart "starting up again", the symptoms usually bother her far less without any treatment. It is worth asking about the usual triggers, which are the same as always and sometimes enough to correct: coffee, alcohol, a bad night, stress, and in the nocturnal pattern also reflux and posture. If they were still very troublesome, a low-dose beta blocker is reasonable, but that treats a symptom, not a risk. And the usual caveat, the only thing that would change management: if syncope ever appears, or if the palpitations come with dizziness, breathlessness or pain, it stops being a benign finding and the rhythm is studied DURING the symptom, with a Holter or an event recorder.',
      pt: 'Não há nada a tratar. As extrassístoles atriais são um achado normal, aparecem em praticamente toda a gente num Holter de 24 horas, e bloqueadas ou não, não têm consequências num coração saudável. O que é preciso fazer é o que mais serve e menos se faz: explicar o mecanismo. Quando a paciente entende que a pancada que sente é o batimento de depois — o ventrículo que se encheu a mais durante o silêncio — e não o coração «a arrancar de novo», os sintomas costumam incomodar muito menos sem nenhum tratamento. Vale a pena perguntar pelos gatilhos habituais, que são os mesmos de sempre e às vezes basta corrigi-los: café, álcool, má noite, stress, e no quadro noturno também o refluxo e a posição. Se incomodassem muito apesar de tudo, um betabloqueador em dose baixa é razoável, mas é tratar um sintoma, não um risco. E a ressalva de sempre, o único que mudaria a conduta: se alguma vez surgir síncope, ou se as palpitações vierem com tontura, dispneia ou dor, deixa de ser um achado benigno e estuda-se o ritmo DURANTE o sintoma, com Holter ou registrador de eventos.',
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
