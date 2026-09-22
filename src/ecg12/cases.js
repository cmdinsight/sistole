// ═══════════════════════════════════════════════════════════════
// CASOS DE 12 DERIVACIONES
// ═══════════════════════════════════════════════════════════════
// Los trazados son sintéticos, generados por el modelo vectorial de synth.js.
// Cada caso declara SOLO hallazgos que el generador produce de verdad: si el
// texto dice "descenso recíproco en aVL", es porque el vector de lesión lo
// genera, no porque esté escrito a mano. Enseñar un hallazgo que el trazado no
// muestra sería peor que no enseñarlo.
//
// El eje de la sección es la LOCALIZACIÓN, que es exactamente lo que no se puede
// enseñar con una sola derivación: en DII un infarto anterior y uno lateral se
// ven casi igual.

export const CASES = [
  {
    id: 'inferior-stemi',
    age: 62, sex: 'M',
    signal: { rate: 52, infarct: 'inferior', stAmp: 0.38, qWave: 0.28 },
    vitals: { hr: 52, bp: '104/62', spo2: 95, rr: 18 },
    highlight: ['II', 'III', 'aVF'],
    answer: 'inferior',
    stem: {
      es: 'Hombre de 62 años, hipertenso y tabaquista. Dolor retroesternal opresivo de 50 minutos, con náuseas y sudoración fría. Se lo ve pálido y bradicárdico.',
      en: '62-year-old man, hypertensive and a smoker. Fifty minutes of crushing retrosternal pain with nausea and cold sweating. He looks pale and bradycardic.',
      pt: 'Homem de 62 anos, hipertenso e tabagista. Dor retroesternal opressiva há 50 minutos, com náuseas e sudorese fria. Apresenta-se pálido e bradicárdico.',
    },
    options: [
      { id: 'inferior', label: { es: 'IAM inferior', en: 'Inferior STEMI', pt: 'IAM inferior' } },
      { id: 'anterior', label: { es: 'IAM anterior', en: 'Anterior STEMI', pt: 'IAM anterior' } },
      { id: 'lateral', label: { es: 'IAM lateral', en: 'Lateral STEMI', pt: 'IAM lateral' } },
      { id: 'pericarditis', label: { es: 'Pericarditis aguda', en: 'Acute pericarditis', pt: 'Pericardite aguda' } },
    ],
    explain: {
      es: 'Elevación del ST en II, III y aVF: las tres derivaciones que miran la cara diafragmática. El hallazgo que confirma es el descenso del ST en aVL, que mira justo en sentido opuesto. Eso es un cambio recíproco, y su presencia separa un infarto de una pericarditis.',
      en: 'ST elevation in II, III and aVF — the three leads facing the diaphragmatic wall. The confirming finding is ST depression in aVL, which looks in exactly the opposite direction. That reciprocal change is what separates infarction from pericarditis.',
      pt: 'Elevação do ST em II, III e aVF: as três derivações que olham a face diafragmática. O achado confirmatório é o infradesnivelamento em aVL, que olha na direção oposta. Essa alteração recíproca separa o infarto da pericardite.',
    },
    pitfall: {
      es: 'La bradicardia y las náuseas hacen que estos pacientes lleguen catalogados como "gastroenteritis" o "vagal". El infarto inferior compromete con frecuencia el nodo sinusal y el AV: la bradicardia es parte del cuadro, no un dato tranquilizador.',
      en: 'Bradycardia and nausea get these patients labelled as "gastroenteritis" or "a vagal episode". Inferior infarction often involves the sinus and AV nodes: the bradycardia is part of the picture, not a reassuring sign.',
      pt: 'A bradicardia e as náuseas fazem estes pacientes chegarem rotulados como "gastroenterite" ou "vagal". O infarto inferior compromete com frequência o nó sinusal e o AV: a bradicardia faz parte do quadro, não é um dado tranquilizador.',
    },
    action: {
      es: 'Reperfusión urgente. Antes de dar nitratos, pedí derivaciones derechas (V3R-V4R): si hay compromiso del ventrículo derecho, el paciente depende de la precarga y un nitrato puede hundirle la presión.',
      en: 'Urgent reperfusion. Before giving nitrates, obtain right-sided leads (V3R-V4R): if the right ventricle is involved, the patient is preload-dependent and a nitrate can drop the blood pressure sharply.',
      pt: 'Reperfusão urgente. Antes de administrar nitratos, solicite derivações direitas (V3R-V4R): se houver comprometimento do ventrículo direito, o paciente depende da pré-carga e um nitrato pode derrubar a pressão.',
    },
  },

  {
    id: 'anterior-stemi',
    age: 55, sex: 'M',
    signal: { rate: 108, infarct: 'anterior', stAmp: 0.45, qWave: 0.25 },
    vitals: { hr: 108, bp: '138/88', spo2: 92, rr: 24 },
    highlight: ['V1', 'V2', 'V3', 'V4'],
    answer: 'anterior',
    stem: {
      es: 'Hombre de 55 años. Dolor precordial intenso de 30 minutos, disnea y sensación de muerte inminente. Taquicárdico, con crepitantes en ambas bases.',
      en: '55-year-old man. Thirty minutes of severe chest pain, breathlessness and a sense of impending doom. Tachycardic, with crackles at both lung bases.',
      pt: 'Homem de 55 anos. Dor precordial intensa há 30 minutos, dispneia e sensação de morte iminente. Taquicárdico, com crepitantes em ambas as bases.',
    },
    options: [
      { id: 'anterior', label: { es: 'IAM anterior extenso', en: 'Extensive anterior STEMI', pt: 'IAM anterior extenso' } },
      { id: 'inferior', label: { es: 'IAM inferior', en: 'Inferior STEMI', pt: 'IAM inferior' } },
      { id: 'posterior', label: { es: 'IAM posterior', en: 'Posterior STEMI', pt: 'IAM posterior' } },
      { id: 'repol', label: { es: 'Repolarización precoz', en: 'Early repolarization', pt: 'Repolarização precoce' } },
    ],
    explain: {
      es: 'Elevación del ST en V1 a V4, el territorio de la arteria descendente anterior. Las derivaciones inferiores están limpias: eso descarta el infarto inferior y localiza la oclusión en la cara anterior.',
      en: 'ST elevation across V1 to V4, the territory of the left anterior descending artery. The inferior leads are clean, which rules out inferior infarction and places the occlusion on the anterior wall.',
      pt: 'Elevação do ST de V1 a V4, o território da artéria descendente anterior. As derivações inferiores estão limpas: isso afasta o infarto inferior e localiza a oclusão na parede anterior.',
    },
    pitfall: {
      es: 'Taquicardia y crepitantes en un infarto anterior son señal de alarma, no de ansiedad: indican que ya hay compromiso de la función ventricular. La descendente anterior irriga la mayor masa de miocardio, y por eso este es el infarto con peor pronóstico según el territorio.',
      en: 'Tachycardia and crackles in an anterior infarct are a warning, not anxiety: they mean ventricular function is already compromised. The LAD supplies the largest mass of myocardium, which is why this is the worst territory to occlude.',
      pt: 'Taquicardia e crepitantes num infarto anterior são sinal de alarme, não de ansiedade: indicam comprometimento da função ventricular. A descendente anterior irriga a maior massa de miocárdio, por isso este é o infarto de pior prognóstico.',
    },
    action: {
      es: 'Angioplastia primaria sin demora. Este territorio es el que más miocardio pierde por minuto: cada retraso se traduce en función ventricular que no vuelve.',
      en: 'Primary angioplasty without delay. This territory loses the most myocardium per minute: every delay translates into ventricular function that does not come back.',
      pt: 'Angioplastia primária sem demora. Este território perde mais miocárdio por minuto: cada atraso se traduz em função ventricular que não volta.',
    },
  },

  {
    id: 'lateral-stemi',
    age: 68, sex: 'F',
    signal: { rate: 84, infarct: 'lateral', stAmp: 0.34, qWave: 0.22 },
    vitals: { hr: 84, bp: '146/90', spo2: 96, rr: 18 },
    highlight: ['I', 'aVL', 'V5', 'V6'],
    answer: 'lateral',
    stem: {
      es: 'Mujer de 68 años, diabética. Molestia en el hombro izquierdo y en la mandíbula desde hace una hora, sin dolor torácico franco. Refiere cansancio inusual desde ayer.',
      en: '68-year-old woman with diabetes. One hour of left shoulder and jaw discomfort, without frank chest pain. She reports unusual fatigue since yesterday.',
      pt: 'Mulher de 68 anos, diabética. Desconforto no ombro esquerdo e na mandíbula há uma hora, sem dor torácica franca. Refere cansaço incomum desde ontem.',
    },
    options: [
      { id: 'lateral', label: { es: 'IAM lateral', en: 'Lateral STEMI', pt: 'IAM lateral' } },
      { id: 'inferior', label: { es: 'IAM inferior', en: 'Inferior STEMI', pt: 'IAM inferior' } },
      { id: 'anteroseptal', label: { es: 'IAM anteroseptal', en: 'Anteroseptal STEMI', pt: 'IAM anterosseptal' } },
      { id: 'normal', label: { es: 'Trazado normal', en: 'Normal tracing', pt: 'Traçado normal' } },
    ],
    explain: {
      es: 'Elevación del ST en I, aVL, V5 y V6: la pared lateral, territorio de la arteria circunfleja. Fijate que son derivaciones de dos grupos distintos —dos del plano frontal y dos precordiales—, y por eso este patrón se pasa por alto si uno mira los grupos por separado en vez de mirar el electro entero.',
      en: 'ST elevation in I, aVL, V5 and V6: the lateral wall, territory of the circumflex artery. Note that these leads come from two different groups — two frontal and two precordial — which is why this pattern gets missed when the groups are read separately instead of reading the whole ECG.',
      pt: 'Elevação do ST em I, aVL, V5 e V6: a parede lateral, território da artéria circunflexa. Repare que são derivações de dois grupos distintos — duas do plano frontal e duas precordiais —, por isso este padrão passa despercebido quando se lê cada grupo isoladamente.',
    },
    pitfall: {
      es: 'Mujer, diabética, sin dolor torácico típico: las tres condiciones que más retrasan el diagnóstico. La neuropatía diabética atenúa el dolor, y el síntoma puede ser únicamente disnea o cansancio. El electro no se pide por el dolor; se pide por la sospecha.',
      en: 'Woman, diabetic, no typical chest pain: the three factors that most delay diagnosis. Diabetic neuropathy blunts the pain, and the only symptom may be breathlessness or fatigue. You do not order the ECG because of the pain; you order it because of the suspicion.',
      pt: 'Mulher, diabética, sem dor torácica típica: as três condições que mais atrasam o diagnóstico. A neuropatia diabética atenua a dor, e o sintoma pode ser apenas dispneia ou cansaço. O ECG não se pede pela dor; pede-se pela suspeita.',
    },
    action: {
      es: 'Reperfusión. El infarto de circunfleja es el que más frecuentemente llega tarde al laboratorio de hemodinamia, justamente porque sus cambios son menos llamativos.',
      en: 'Reperfusion. Circumflex infarcts are the ones that most often reach the cath lab late, precisely because their changes are less striking.',
      pt: 'Reperfusão. O infarto de circunflexa é o que mais frequentemente chega tarde à hemodinâmica, justamente porque suas alterações são menos chamativas.',
    },
  },

  {
    id: 'posterior-stemi',
    age: 59, sex: 'M',
    signal: { rate: 76, infarct: 'posterior', stAmp: 0.40 },
    vitals: { hr: 76, bp: '128/78', spo2: 96, rr: 16 },
    highlight: ['V1', 'V2', 'V3'],
    answer: 'posterior',
    stem: {
      es: 'Hombre de 59 años con dolor torácico de dos horas. Un colega mira el trazado y dice que no hay elevación del ST en ninguna derivación, así que propone observación y troponinas seriadas.',
      en: '59-year-old man with two hours of chest pain. A colleague reviews the tracing, notes there is no ST elevation in any lead, and suggests observation with serial troponins.',
      pt: 'Homem de 59 anos com dor torácica há duas horas. Um colega vê o traçado, diz que não há elevação do ST em nenhuma derivação e propõe observação com troponinas seriadas.',
    },
    options: [
      { id: 'posterior', label: { es: 'IAM posterior', en: 'Posterior STEMI', pt: 'IAM posterior' } },
      { id: 'nostemi', label: { es: 'Angina inestable, sin infarto', en: 'Unstable angina, no infarct', pt: 'Angina instável, sem infarto' } },
      { id: 'anterior', label: { es: 'IAM anterior', en: 'Anterior STEMI', pt: 'IAM anterior' } },
      { id: 'hvi', label: { es: 'Sobrecarga ventricular izquierda', en: 'LV strain pattern', pt: 'Sobrecarga ventricular esquerda' } },
    ],
    explain: {
      es: 'Hay descenso del ST en V1 a V3. Ninguna de las 12 derivaciones mira la cara posterior de frente, así que un infarto posterior no puede dar elevación: lo que se ve es su imagen en espejo. V1 a V3 miran de frente a la pared anterior, o sea de espaldas a la posterior, y por eso el supradesnivel se traduce en infradesnivel.',
      en: 'There is ST depression in V1 to V3. None of the 12 leads faces the posterior wall directly, so a posterior infarct cannot produce elevation: what you see is its mirror image. V1 to V3 face the anterior wall — that is, they face away from the posterior wall — so elevation there reads as depression.',
      pt: 'Há infradesnivelamento do ST de V1 a V3. Nenhuma das 12 derivações olha de frente a parede posterior, então um infarto posterior não pode dar elevação: o que se vê é a sua imagem em espelho. V1 a V3 olham a parede anterior, ou seja, de costas para a posterior, e por isso o supradesnivelamento aparece como infradesnivelamento.',
    },
    pitfall: {
      es: 'Este es el infarto que más se pasa por alto, porque el reflejo entrenado es buscar elevación. En el paciente real, buscá además ondas R altas en V1-V2 (la imagen en espejo de la onda Q) y pedí derivaciones posteriores V7-V9, donde sí vas a ver la elevación directa.',
      en: 'This is the most commonly missed infarct, because the trained reflex is to look for elevation. In the real patient, also look for tall R waves in V1-V2 (the mirror image of the Q wave) and obtain posterior leads V7-V9, where you will see the elevation directly.',
      pt: 'Este é o infarto que mais passa despercebido, porque o reflexo treinado é procurar elevação. No paciente real, procure também ondas R altas em V1-V2 (a imagem em espelho da onda Q) e solicite derivações posteriores V7-V9, onde a elevação aparece de forma direta.',
    },
    action: {
      es: 'Es un infarto con indicación de reperfusión, igual que cualquier otro supradesnivel. Tratarlo como "sin elevación" y mandarlo a observación es el error que cuesta miocardio.',
      en: 'This is an infarct with an indication for reperfusion, like any other ST elevation. Treating it as "non-elevation" and sending the patient to observation is the error that costs myocardium.',
      pt: 'É um infarto com indicação de reperfusão, como qualquer outro supradesnivelamento. Tratá-lo como "sem elevação" e mandar para observação é o erro que custa miocárdio.',
    },
  },

  {
    id: 'anteroseptal-stemi',
    age: 47, sex: 'M',
    signal: { rate: 96, infarct: 'anteroseptal', stAmp: 0.36, qWave: 0.30 },
    vitals: { hr: 96, bp: '132/84', spo2: 95, rr: 20 },
    highlight: ['V1', 'V2', 'V3'],
    answer: 'anteroseptal',
    stem: {
      es: 'Hombre de 47 años, sin antecedentes. Dolor opresivo que empezó hace 40 minutos mientras corría. Llega caminando por sus propios medios.',
      en: '47-year-old man, no prior history. Crushing pain that began 40 minutes ago while running. He walks in under his own power.',
      pt: 'Homem de 47 anos, sem antecedentes. Dor opressiva que começou há 40 minutos enquanto corria. Chega caminhando por conta própria.',
    },
    options: [
      { id: 'anteroseptal', label: { es: 'IAM anteroseptal', en: 'Anteroseptal STEMI', pt: 'IAM anterosseptal' } },
      { id: 'lateral', label: { es: 'IAM lateral', en: 'Lateral STEMI', pt: 'IAM lateral' } },
      { id: 'inferior', label: { es: 'IAM inferior', en: 'Inferior STEMI', pt: 'IAM inferior' } },
      { id: 'brugada', label: { es: 'Patrón de Brugada', en: 'Brugada pattern', pt: 'Padrão de Brugada' } },
    ],
    explain: {
      es: 'Elevación del ST concentrada en V1 a V3, sin extenderse a V5-V6. Ese reparto señala el septo y la porción proximal de la cara anterior: una oclusión de la descendente anterior más distal que la del caso anterior extenso.',
      en: 'ST elevation concentrated in V1 to V3 without extending to V5-V6. That distribution points to the septum and the proximal anterior wall: an LAD occlusion more distal than in the extensive anterior case.',
      pt: 'Elevação do ST concentrada de V1 a V3, sem se estender a V5-V6. Essa distribuição aponta para o septo e a porção proximal da parede anterior: uma oclusão da descendente anterior mais distal que no caso anterior extenso.',
    },
    pitfall: {
      es: 'Que el paciente llegue caminando y con buen estado general no cambia nada. La reserva funcional de un hombre de 47 años sin antecedentes enmascara el cuadro hasta que se descompensa de golpe.',
      en: 'That the patient walks in looking well changes nothing. The functional reserve of a 47-year-old with no history masks the picture until he decompensates all at once.',
      pt: 'Que o paciente chegue caminhando e em bom estado geral não muda nada. A reserva funcional de um homem de 47 anos sem antecedentes mascara o quadro até descompensar de repente.',
    },
    action: {
      es: 'Reperfusión. Vigilá el ritmo: el septo aloja el sistema de conducción, y este territorio puede dar bloqueos de rama y bloqueo AV de aparición brusca.',
      en: 'Reperfusion. Watch the rhythm: the septum houses the conduction system, and this territory can produce bundle branch and AV block of sudden onset.',
      pt: 'Reperfusão. Vigie o ritmo: o septo abriga o sistema de condução, e este território pode causar bloqueios de ramo e bloqueio AV de instalação súbita.',
    },
  },

  {
    id: 'afib-rvr',
    age: 74, sex: 'F',
    signal: { rate: 138, irregular: 1, atrial: 'fib' },
    vitals: { hr: '138 (irregular)', bp: '118/70', spo2: 94, rr: 20 },
    highlight: ['II', 'V1'],
    answer: 'afib',
    stem: {
      es: 'Mujer de 74 años con palpitaciones y disnea desde hace tres horas. El pulso radial es irregular y no coincide con el latido que se ausculta.',
      en: '74-year-old woman with three hours of palpitations and breathlessness. The radial pulse is irregular and does not match the auscultated beat.',
      pt: 'Mulher de 74 anos com palpitações e dispneia há três horas. O pulso radial é irregular e não coincide com o batimento auscultado.',
    },
    options: [
      { id: 'afib', label: { es: 'Fibrilación auricular con respuesta ventricular rápida', en: 'Atrial fibrillation with rapid ventricular response', pt: 'Fibrilação atrial com resposta ventricular rápida' } },
      { id: 'tsv', label: { es: 'Taquicardia supraventricular paroxística', en: 'Paroxysmal SVT', pt: 'Taquicardia supraventricular paroxística' } },
      { id: 'sinustach', label: { es: 'Taquicardia sinusal', en: 'Sinus tachycardia', pt: 'Taquicardia sinusal' } },
      { id: 'flutter', label: { es: 'Aleteo auricular', en: 'Atrial flutter', pt: 'Flutter atrial' } },
    ],
    explain: {
      es: 'Dos hallazgos, y hacen falta los dos. Primero: no hay ondas P en ninguna derivación; la línea de base ondula de forma irregular, sobre todo en V1, que es la que mira de frente a la aurícula derecha. Segundo: el intervalo entre QRS cambia latido a latido sin patrón. Irregularmente irregular y sin P: eso es fibrilación auricular.',
      en: 'Two findings, and you need both. First: there are no P waves in any lead; the baseline undulates irregularly, most visibly in V1, the lead that faces the right atrium. Second: the interval between QRS complexes changes beat to beat with no pattern. Irregularly irregular and no P waves: that is atrial fibrillation.',
      pt: 'Dois achados, e são necessários os dois. Primeiro: não há ondas P em nenhuma derivação; a linha de base ondula de forma irregular, sobretudo em V1, que olha de frente para o átrio direito. Segundo: o intervalo entre os QRS muda batimento a batimento sem padrão. Irregularmente irregular e sem P: isso é fibrilação atrial.',
    },
    pitfall: {
      es: 'A frecuencias altas el RR parece regular a ojo y se confunde con taquicardia supraventricular. El truco es medir: marcá los RR en un papel y compará. La diferencia entre los dos diagnósticos cambia por completo el tratamiento.',
      en: 'At high rates the RR looks regular to the eye and gets mistaken for SVT. The trick is to measure: mark the RR intervals on a strip of paper and compare them. The difference between the two diagnoses completely changes the treatment.',
      pt: 'Em frequências altas o RR parece regular a olho nu e se confunde com taquicardia supraventricular. O truque é medir: marque os RR num papel e compare. A diferença entre os dois diagnósticos muda completamente o tratamento.',
    },
    action: {
      es: 'Si está inestable, cardioversión eléctrica sincronizada. Si está estable, control de frecuencia y definir anticoagulación según el riesgo embólico. Ojo con el tiempo de evolución antes de cardiovertir a alguien estable.',
      en: 'If unstable, synchronized electrical cardioversion. If stable, rate control and decide on anticoagulation according to embolic risk. Mind the duration of the episode before cardioverting a stable patient.',
      pt: 'Se instável, cardioversão elétrica sincronizada. Se estável, controle de frequência e definir anticoagulação conforme o risco embólico. Atenção ao tempo de evolução antes de cardioverter um paciente estável.',
    },
  },

  {
    id: 'diffuse-t-inversion',
    age: 51, sex: 'F',
    signal: { rate: 88, tInvert: 1 },
    vitals: { hr: 88, bp: '150/92', spo2: 97, rr: 18 },
    highlight: ['V2', 'V3', 'V4', 'V5'],
    answer: 'tinvert',
    stem: {
      es: 'Mujer de 51 años traída por cefalea brusca e intensa, la peor de su vida, con vómitos. Está consciente, sin dolor torácico. Le hacen un electro de rutina al ingreso.',
      en: '51-year-old woman brought in with a sudden, severe headache — the worst of her life — and vomiting. She is conscious, with no chest pain. A routine ECG is done on admission.',
      pt: 'Mulher de 51 anos trazida por cefaleia súbita e intensa, a pior da vida, com vômitos. Está consciente, sem dor torácica. Faz-se um ECG de rotina na admissão.',
    },
    options: [
      { id: 'tinvert', label: { es: 'T invertidas difusas de causa no coronaria', en: 'Diffuse T-wave inversion, non-coronary', pt: 'T invertidas difusas de causa não coronariana' } },
      { id: 'nstemi', label: { es: 'Infarto sin elevación del ST', en: 'NSTEMI', pt: 'Infarto sem supradesnivelamento' } },
      { id: 'anterior', label: { es: 'IAM anterior en evolución', en: 'Evolving anterior STEMI', pt: 'IAM anterior em evolução' } },
      { id: 'normal', label: { es: 'Variante normal', en: 'Normal variant', pt: 'Variante normal' } },
    ],
    explain: {
      es: 'Las ondas T están invertidas de forma amplia, sin respetar un territorio coronario y sin elevación del ST acompañante. Un patrón isquémico sigue la anatomía de una arteria; este no la sigue. Sumado a la cefalea en trueno, orienta a una hemorragia subaracnoidea con repercusión electrocardiográfica.',
      en: 'The T waves are broadly inverted, respecting no coronary territory and without accompanying ST elevation. An ischemic pattern follows the anatomy of an artery; this one does not. Together with the thunderclap headache, it points to subarachnoid haemorrhage with ECG repercussion.',
      pt: 'As ondas T estão invertidas de forma ampla, sem respeitar um território coronariano e sem elevação do ST associada. Um padrão isquêmico segue a anatomia de uma artéria; este não segue. Somado à cefaleia em trovoada, orienta para hemorragia subaracnóidea com repercussão eletrocardiográfica.',
    },
    pitfall: {
      es: 'Acá el riesgo es tratar el electro en vez del paciente. Si se interpreta como síndrome coronario y se anticoagula, se agrava una hemorragia intracraneal. El electro anormal es real, pero el corazón no es el órgano enfermo.',
      en: 'The risk here is treating the ECG instead of the patient. If this is read as an acute coronary syndrome and the patient is anticoagulated, an intracranial haemorrhage is made worse. The abnormal ECG is real, but the heart is not the sick organ.',
      pt: 'Aqui o risco é tratar o ECG em vez do paciente. Se for interpretado como síndrome coronariana e o paciente for anticoagulado, agrava-se uma hemorragia intracraniana. O ECG alterado é real, mas o coração não é o órgão doente.',
    },
    action: {
      es: 'Tomografía de cráneo sin contraste, urgente. El electro es un hallazgo acompañante; la conducta la define el cuadro neurológico.',
      en: 'Urgent non-contrast head CT. The ECG is an accompanying finding; the neurological picture determines management.',
      pt: 'Tomografia de crânio sem contraste, com urgência. O ECG é um achado acompanhante; a conduta é definida pelo quadro neurológico.',
    },
  },

  {
    id: 'normal-control',
    age: 34, sex: 'M',
    signal: { rate: 68 },
    vitals: { hr: 68, bp: '118/74', spo2: 99, rr: 14 },
    highlight: [],
    answer: 'normal',
    stem: {
      es: 'Hombre de 34 años, deportista, sin síntomas. Electro solicitado como parte de una evaluación prelaboral.',
      en: '34-year-old man, athletic, asymptomatic. ECG requested as part of a pre-employment assessment.',
      pt: 'Homem de 34 anos, atleta, assintomático. ECG solicitado como parte de uma avaliação pré-admissional.',
    },
    options: [
      { id: 'normal', label: { es: 'Electrocardiograma normal', en: 'Normal electrocardiogram', pt: 'Eletrocardiograma normal' } },
      { id: 'inferior', label: { es: 'IAM inferior', en: 'Inferior STEMI', pt: 'IAM inferior' } },
      { id: 'posterior', label: { es: 'IAM posterior', en: 'Posterior STEMI', pt: 'IAM posterior' } },
      { id: 'tinvert', label: { es: 'Isquemia subendocárdica', en: 'Subendocardial ischemia', pt: 'Isquemia subendocárdica' } },
    ],
    explain: {
      es: 'Todo está donde tiene que estar. P positiva en II y negativa en aVR. Complejo rS en V1 que va creciendo hasta una R dominante en V6, con la transición entre V3 y V4. Onda q pequeña y angosta en I, aVL, V5 y V6, que es la despolarización del septo y no una necrosis. Segmento ST en la línea de base en las doce.',
      en: 'Everything is where it should be. P wave upright in II and negative in aVR. An rS complex in V1 that grows into a dominant R by V6, with the transition between V3 and V4. Small, narrow q waves in I, aVL, V5 and V6 — septal depolarization, not necrosis. ST segment at baseline in all twelve leads.',
      pt: 'Tudo está onde deve estar. P positiva em II e negativa em aVR. Complexo rS em V1 que cresce até uma R dominante em V6, com a transição entre V3 e V4. Onda q pequena e estreita em I, aVL, V5 e V6, que é a despolarização do septo e não uma necrose. Segmento ST na linha de base nas doze.',
    },
    pitfall: {
      es: 'Entrenarse solo con electros patológicos produce médicos que encuentran infartos donde no los hay. Saber cómo se ve lo normal, y en particular reconocer la q septal y la progresión de R, es lo que evita cateterismos innecesarios.',
      en: 'Training only on abnormal ECGs produces clinicians who find infarcts where there are none. Knowing what normal looks like — especially recognising the septal q and R-wave progression — is what prevents unnecessary catheterisations.',
      pt: 'Treinar apenas com ECGs patológicos produz médicos que encontram infartos onde não há. Saber como é o normal, e em especial reconhecer a q septal e a progressão de R, é o que evita cateterismos desnecessários.',
    },
    action: {
      es: 'Ninguna conducta cardiológica. Apto.',
      en: 'No cardiac action required. Cleared.',
      pt: 'Nenhuma conduta cardiológica. Apto.',
    },
  },
];

export const CASE_IDS = CASES.map((c) => c.id);
