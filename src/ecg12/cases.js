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
