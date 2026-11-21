export type UnitId =
  | 'digestion'
  | 'respiration'
  | 'circulation'
  | 'excretion'
  | 'nervous'
  | 'muscular';

export type ClassroomTab = 'lab' | 'schema' | 'games' | 'exam';

export type MascotMood = 'explaining' | 'success' | 'hint';

export interface MascotSignal {
  mood: MascotMood;
  badgeAr: string;
  badgeFr: string;
  speechText: string;
  shouldSpeak?: boolean;
}

export interface SchemaPin {
  id: string;
  num: number;
  x: number; // percentage 0..100 inside SVG 640x360
  y: number;
  ar: string;
  fr: string;
  color: string;
  speech: string;
}

export interface MindMapBranch {
  id: string;
  titleAr: string;
  titleFr: string;
  color: string;
  speech: string;
  children: { ar: string; fr: string; speech: string }[];
}

export interface DragToken {
  id: string;
  labelAr: string;
  labelFr: string;
  zone: 'A' | 'B';
  accent: string;
}

export interface DragGameConfig {
  titleAr: string;
  titleFr: string;
  zoneA: { titleAr: string; titleFr: string; color: string };
  zoneB: { titleAr: string; titleFr: string; color: string };
  tokens: DragToken[];
}

export interface HotspotChallengeItem {
  id: string;
  promptAr: string;
  promptFr: string;
  targetPinId: string;
  hintSpeech: string;
  successSpeech: string;
}

export interface ExamCurvePoint {
  x: number;
  y1: number;
  y2?: number;
  noteSpeech: string;
}

export interface ExamScenario {
  id: string;
  labelAr: string;
  labelFr: string;
  points: ExamCurvePoint[];
  speech: string;
}

export interface ExamVisualStep {
  id: string;
  stepNum: number;
  verbAr: string;
  verbFr: string;
  pointsLabel: string;
  promptAr: string;
  choices: {
    id: string;
    shortAr: string;
    shortFr: string;
    isCorrect: boolean;
    speech: string;
  }[];
  keyFormulaAr: string;
}

export interface UnitExamConfig {
  titleAr: string;
  titleFr: string;
  xLabel: string;
  yLabel: string;
  yMax: number;
  yUnit: string;
  series1: { nameAr: string; nameFr: string; color: string };
  series2?: { nameAr: string; nameFr: string; color: string };
  scenarios: ExamScenario[];
  steps: ExamVisualStep[];
}

export interface UnitConfig {
  id: UnitId;
  num: string;
  titleAr: string;
  titleFr: string;
  accent: string;
  welcomeSpeech: string;
  schemaTitleAr: string;
  schemaTitleFr: string;
  schemaPins: SchemaPin[];
  mindMapCenterAr: string;
  mindMapCenterFr: string;
  mindMapBranches: MindMapBranch[];
  dragGame: DragGameConfig;
  hotspotChallenges: HotspotChallengeItem[];
  exam: UnitExamConfig;
}

export const UNITS_DATA: UnitConfig[] = [
  // =========================================================================
  // UNIT 1: DIGESTION & ABSORPTION
  // =========================================================================
  {
    id: 'digestion',
    num: '01',
    titleAr: 'الهضم والامتصاص',
    titleFr: 'Digestion & Absorption',
    accent: '#00FFA3',
    welcomeSpeech:
      'أهلاً بك في درس الهضم والامتصاص! حرك اللقمة الغذائية أو اضغط على الأعضاء ثلاثية الأبعاد لنكتشف تحول الأغذية إلى قيت.',
    schemaTitleAr: 'رسم تخطيطي: الخملة المعوية',
    schemaTitleFr: 'Schéma : Villosité intestinale',
    schemaPins: [
      {
        id: 'd1',
        num: 1,
        x: 22,
        y: 26,
        ar: 'تجويف المعي الدقيق',
        fr: 'Lumière intestinale',
        color: '#00E5FF',
        speech: 'تجويف المعي الدقيق يضم مواد القيت الجاهزة للامتصاص مثل الكليكوز والأحماض الأمينية.',
      },
      {
        id: 'd2',
        num: 2,
        x: 36,
        y: 44,
        ar: 'جدار رقيق (ظهارة)',
        fr: 'Épithélium fin',
        color: '#00FFA3',
        speech: 'جدار الخملة رقيق جداً يتكون من صف واحد من الخلايا لتسهيل مرور القيت بسرعة.',
      },
      {
        id: 'd3',
        num: 3,
        x: 50,
        y: 42,
        ar: 'وعاء لمفاوي مركزي',
        fr: 'Chylifère (Lymphe)',
        color: '#FF9F1C',
        speech: 'الوعاء اللمفاوي المركزي يمتص الأحماض الدهنية والغليسيرول.',
      },
      {
        id: 'd4',
        num: 4,
        x: 64,
        y: 34,
        ar: 'شبكة شعيرات دموية',
        fr: 'Capillaires sanguins',
        color: '#EF4444',
        speech: 'الشعيرات الدموية الكثيفة تنقل الكليكوز والأحماض الأمينية والماء والأملاح المعدنية نحو الدم.',
      },
      {
        id: 'd5',
        num: 5,
        x: 34,
        y: 82,
        ar: 'دم داخل (فقير من القيت)',
        fr: 'Sang entrant',
        color: '#F87171',
        speech: 'الدم الداخل للخملة يكون فقيراً من مواد القيت قبل عملية الامتصاص.',
      },
      {
        id: 'd6',
        num: 6,
        x: 67,
        y: 82,
        ar: 'دم خارج (غني بالقيت)',
        fr: 'Sang sortant riche',
        color: '#38BDF8',
        speech: 'الدم الخارج من الخملة المعوية يصبح غنياً جداً بالكليكوز والأحماض الأمينية!',
      },
    ],
    mindMapCenterAr: 'الهضم والامتصاص',
    mindMapCenterFr: 'Digestion & Absorption',
    mindMapBranches: [
      {
        id: 'dm1',
        titleAr: 'هضم ميكانيكي',
        titleFr: 'Digestion mécanique',
        color: '#00E5FF',
        speech: 'الهضم الميكانيكي هو تفتيت فيزيائي بالأسنان وتقلصات المعدة واستحلاب الصفراء.',
        children: [
          { ar: 'المضغ بالأسنان', fr: 'Mastication', speech: 'الأسنان تقطع وتسحق الغذاء لتسهيل عمل الإنزيمات.' },
          { ar: 'حركات المعدة', fr: 'Brassage', speech: 'تقلصات المعدة تخلط الغذاء بالعصارة المعدية.' },
          { ar: 'استحلاب بالصفراء', fr: 'Émulsion (Bile)', speech: 'الصفراء تستحلب الدهنيات وليست إنزيماً!' },
        ],
      },
      {
        id: 'dm2',
        titleAr: 'هضم كيميائي (37°C)',
        titleFr: 'Digestion chimique',
        color: '#FF9F1C',
        speech: 'الهضم الكيميائي هو تبسيط جزيئي بواسطة إنزيمات نوعية عند 37 درجة مئوية.',
        children: [
          { ar: 'نشا ← مالتوز ← كليكوز', fr: 'Amidon → Glucose', speech: 'الأميلاز ثم المالتاز يحولان النشا إلى كليكوز.' },
          { ar: 'بروتيدات ← أحماض أمينية', fr: 'Protides → Ac. aminés', speech: 'البيبسين ثم البيبتيداز يفككان البروتيدات إلى أحماض أمينية.' },
          { ar: 'دهنيات ← أحماض دهنية', fr: 'Lipides → Ac. gras', speech: 'الليباز يفكك الدهنيات المستحلبة إلى أحماض دهنية وغليسيرول.' },
        ],
      },
      {
        id: 'dm3',
        titleAr: 'الامتصاص المعوي',
        titleFr: 'Absorption intestinale',
        color: '#00FFA3',
        speech: 'الامتصاص هو عبور القيت عبر الخملات المعوية نحو الدم واللمف.',
        children: [
          { ar: 'مساحة شاسعة (300 m²)', fr: 'Grande surface', speech: 'كثرة الخملات ترفع مساحة التبادل بشكل هائل.' },
          { ar: 'طريق دموي', fr: 'Voie sanguine', speech: 'الطريق الدموي ينقل الكليكوز والأحماض الأمينية والماء والأملاح.' },
          { ar: 'طريق لمفاوي', fr: 'Voie lymphatique', speech: 'الطريق اللمفاوي ينقل الأحماض الدهنية والغليسيرول.' },
        ],
      },
    ],
    dragGame: {
      titleAr: 'فرز القيت: الطريق الدموي أم اللمفاوي؟',
      titleFr: 'Trier les nutriments : Sang ou Lymphe ?',
      zoneA: { titleAr: 'الطريق الدموي', titleFr: 'Capillaires sanguins', color: '#EF4444' },
      zoneB: { titleAr: 'الطريق اللمفاوي', titleFr: 'Vaisseau chylifère', color: '#FF9F1C' },
      tokens: [
        { id: 't1', labelAr: 'كليكوز', labelFr: 'Glucose', zone: 'A', accent: '#00FFA3' },
        { id: 't2', labelAr: 'أحماض أمينية', labelFr: 'Acides aminés', zone: 'A', accent: '#00E5FF' },
        { id: 't3', labelAr: 'أحماض دهنية', labelFr: 'Acides gras', zone: 'B', accent: '#FF9F1C' },
        { id: 't4', labelAr: 'غليسيرول', labelFr: 'Glycérol', zone: 'B', accent: '#F59E0B' },
        { id: 't5', labelAr: 'ماء وأملاح معدنية', labelFr: 'Eau & Sels', zone: 'A', accent: '#38BDF8' },
        { id: 't6', labelAr: 'فيتامينات دهنية', labelFr: 'Vitamines A, D, E', zone: 'B', accent: '#FBBF24' },
      ],
    },
    hotspotChallenges: [
      {
        id: 'dh1',
        promptAr: 'اضغط على المسلك الذي يمتص الأحماض الدهنية',
        promptFr: 'Clique sur la voie des acides gras',
        targetPinId: 'd3',
        hintSpeech: 'تذكر! الدهنيات تسلك المسلك المركزي الذهبي داخل الخملة.',
        successSpeech: 'برافو! الوعاء اللمفاوي المركزي يمتص الأحماض الدهنية والغليسيرول.',
      },
      {
        id: 'dh2',
        promptAr: 'اضغط على الطبقة الرقيقة التي تعبرها مواد القيت',
        promptFr: 'Clique sur la paroi fine de la villosité',
        targetPinId: 'd2',
        hintSpeech: 'ابحث عن الجدار الخارجي الرقيق للخملة المعوية.',
        successSpeech: 'ممتاز! الظهارة الرقيقة تسمح بعبور سريع لمواد القيت.',
      },
      {
        id: 'dh3',
        promptAr: 'اضغط على الشبكة التي تنقل الكليكوز والأحماض الأمينية',
        promptFr: 'Clique sur le réseau transportant le glucose',
        targetPinId: 'd4',
        hintSpeech: 'الكليكوز والأحماض الأمينية تمر عبر الشبكة الدموية الحمراء والزرقاء.',
        successSpeech: 'رائع! شبكة الشعيرات الدموية تنقل الكليكوز والأحماض الأمينية.',
      },
    ],
    exam: {
      titleAr: 'تطور تركيز النشا والمالتوز مع الأميلاز اللعابي',
      titleFr: 'Hydrolyse de l’amidon par l’amylase salivaire',
      xLabel: 'الزمن · Temps (min)',
      yLabel: 'التركيز · Conc. (g/L)',
      yMax: 1.0,
      yUnit: 'g/L',
      series1: { nameAr: 'النشا', nameFr: 'Amidon', color: '#00E5FF' },
      series2: { nameAr: 'المالتوز', nameFr: 'Maltose', color: '#00FFA3' },
      scenarios: [
        {
          id: '37',
          labelAr: '37°C · مثلى',
          labelFr: '37°C Optimale',
          speech: 'عند 37 درجة يختفي النشا تماماً ويظهر المالتوز بفعل الأميلاز اللعابي.',
          points: [
            { x: 0, y1: 1.0, y2: 0.0, noteSpeech: 'عند الدقيقة صفر: النشا في أقصاه والمالتوز منعدم.' },
            { x: 2, y1: 0.72, y2: 0.28, noteSpeech: 'عند الدقيقتين: بدأ النشا ينخفض وظهر المالتوز.' },
            { x: 4, y1: 0.44, y2: 0.56, noteSpeech: 'عند أربع دقائق: تجاوز تركيز المالتوز تركيز النشا.' },
            { x: 6, y1: 0.2, y2: 0.8, noteSpeech: 'عند ست دقائق: أغلب النشا تحول إلى مالتوز.' },
            { x: 8, y1: 0.06, y2: 0.94, noteSpeech: 'عند ثمان دقائق: أوشك الهضم الكيميائي على الاكتمال.' },
            { x: 10, y1: 0.0, y2: 1.0, noteSpeech: 'عند عشر دقائق: اختفاء تام للنشا وتشكل 1 غرام في اللتر من المالتوز.' },
          ],
        },
        {
          id: '100',
          labelAr: '100°C · غليان',
          labelFr: '100°C Détruite',
          speech: 'عند 100 درجة يتلف الإنزيم نهائياً فيبقى تركيز النشا ثابتاً!',
          points: [
            { x: 0, y1: 1.0, y2: 0.0, noteSpeech: 'عند البداية: النشا 1 غرام في اللتر.' },
            { x: 2, y1: 1.0, y2: 0.0, noteSpeech: 'النشا ثابت لأن الإنزيم أتلف بالغليان.' },
            { x: 4, y1: 1.0, y2: 0.0, noteSpeech: 'لا يوجد أي تحول كيميائي عند 100 درجة.' },
            { x: 6, y1: 1.0, y2: 0.0, noteSpeech: 'المالتوز يبقى منعدماً تماماً.' },
            { x: 8, y1: 1.0, y2: 0.0, noteSpeech: 'ثبات تام للنشا طيلة التجربة.' },
            { x: 10, y1: 1.0, y2: 0.0, noteSpeech: 'النتيجة: الحرارة المرتفعة تتلف الإنزيم نهائياً.' },
          ],
        },
      ],
      steps: [
        {
          id: 'ds1',
          stepNum: 1,
          verbAr: 'أصف',
          verbFr: 'Décrire',
          pointsLabel: '2 pts',
          promptAr: 'ماذا نلاحظ في المبيان عند 37°C؟',
          choices: [
            {
              id: 'a',
              shortAr: 'انخفاض النشا (1→0 g/L) وارتفاع المالتوز (0→1 g/L)',
              shortFr: 'Diminution amidon & augmentation maltose',
              isCorrect: true,
              speech: 'أحسنت! هذا وصف دقيق بالأرقام والوحدات بدون تفسير.',
            },
            {
              id: 'b',
              shortAr: 'تفكك النشا لأن الأميلاز نشيط عند 37°C',
              shortFr: 'Hydrolyse car l’amylase est active',
              isCorrect: false,
              speech: 'انتبه! هذا تفسير وليس وصفاً؛ في الوصف نذكر الأرقام والتطور فقط.',
            },
          ],
          keyFormulaAr: 'انخفض النشا من 1 إلى 0 g/L وارتفع المالتوز من 0 إلى 1 g/L خلال 10 min.',
        },
        {
          id: 'ds2',
          stepNum: 2,
          verbAr: 'أفسر',
          verbFr: 'Expliquer',
          pointsLabel: '2 pts',
          promptAr: 'لماذا اختفى النشا عند 37°C وبقي ثابتاً عند 100°C؟',
          choices: [
            {
              id: 'a',
              shortAr: 'بفعل الأميلاز النشيط في 37°C، وتلفه نهائياً في 100°C',
              shortFr: 'Enzyme active à 37°C, détruite à 100°C',
              isCorrect: true,
              speech: 'تفسير ممتاز! ربطت النتيجة بفعالية الإنزيم ودرجة الحرارة.',
            },
            {
              id: 'b',
              shortAr: 'تبخّر النشا بسبب حرارة الحمام المائي',
              shortFr: 'Évaporation de l’amidon',
              isCorrect: false,
              speech: 'لا يا بطل! النشا لا يتبخر بل يتفكك كيميائياً بفعل الإنزيم.',
            },
          ],
          keyFormulaAr: 'الأميلاز اللعابي حفّز حلمأة النشا إلى مالتوز في 37°C، بينما أتلف في 100°C.',
        },
        {
          id: 'ds3',
          stepNum: 3,
          verbAr: 'أستنتج',
          verbFr: 'Déduire',
          pointsLabel: '2 pts',
          promptAr: 'ما الشرط الأساسي لعمل الإنزيمات الهاضمة؟',
          choices: [
            {
              id: 'a',
              shortAr: 'تتطلب الإنزيمات درجة حرارة مثلى تقارب 37°C',
              shortFr: 'Température optimale ≈ 37°C',
              isCorrect: true,
              speech: 'استنتاج علمي مثالي يستحق النقطة الكاملة!',
            },
            {
              id: 'b',
              shortAr: 'تعمل الإنزيمات بشكل أفضل عند 100°C',
              shortFr: 'Meilleure activité à 100°C',
              isCorrect: false,
              speech: 'انظر لمنحنى 100 درجة! الإنزيم يتوقف نهائياً عند الغليان.',
            },
          ],
          keyFormulaAr: 'الهضم الكيميائي ظاهرة إنزيمية تتطلب حرارة مثلى تساوي 37°C.',
        },
      ],
    },
  },

  // =========================================================================
  // UNIT 2: RESPIRATION
  // =========================================================================
  {
    id: 'respiration',
    num: '02',
    titleAr: 'التنفس عند الإنسان',
    titleFr: 'La Respiration',
    accent: '#00E5FF',
    welcomeSpeech:
      'مرحباً بك في درس التنفس! راقب انتشار ثنائي الأوكسجين من السنخ الرئوي نحو الدم وخروج ثنائي أوكسيد الكربون.',
    schemaTitleAr: 'رسم تخطيطي: التبادلات الغازية في السنخ الرئوي',
    schemaTitleFr: 'Schéma : Échanges gazeux alvéolaires',
    schemaPins: [
      {
        id: 'r1',
        num: 1,
        x: 34,
        y: 22,
        ar: 'هواء سنخي (غني بـ O₂)',
        fr: 'Air alvéolaire (riche O₂)',
        color: '#00E5FF',
        speech: 'الهواء السنخي يتميز بضغط مرتفع لثنائي الأوكسجين يساوي 13.3 كيلو باسكال.',
      },
      {
        id: 'r2',
        num: 2,
        x: 50,
        y: 44,
        ar: 'جدار سنخي رقيق',
        fr: 'Paroi alvéolaire fine',
        color: '#00FFA3',
        speech: 'الجدار الفاصل بين السنخ والدم رقيق جداً يسمح بانتشار الغازات بسهولة.',
      },
      {
        id: 'r3',
        num: 3,
        x: 24,
        y: 72,
        ar: 'دم داخل (غني بـ CO₂)',
        fr: 'Sang entrant (riche CO₂)',
        color: '#3B82F6',
        speech: 'الدم الداخل للرئة داكن اللون، فقير من الأوكسجين وغني بثنائي أوكسيد الكربون.',
      },
      {
        id: 'r4',
        num: 4,
        x: 74,
        y: 72,
        ar: 'دم خارج (غني بـ O₂)',
        fr: 'Sang sortant (riche O₂)',
        color: '#EF4444',
        speech: 'الدم الخارج من السنخ يصبح أحمر قانياً وغنياً بثنائي الأوكسجين.',
      },
      {
        id: 'r5',
        num: 5,
        x: 61,
        y: 34,
        ar: 'انتشار O₂ ← الدم',
        fr: 'Diffusion O₂ → Sang',
        color: '#00E5FF',
        speech: 'ينتقل الأوكسجين من الحيز ذي الضغط المرتفع في السنخ نحو الضغط المنخفض في الدم.',
      },
      {
        id: 'r6',
        num: 6,
        x: 41,
        y: 59,
        ar: 'انتشار CO₂ ← السنخ',
        fr: 'Diffusion CO₂ → Alvéole',
        color: '#FF9F1C',
        speech: 'ينتقل ثنائي أوكسيد الكربون من الدم نحو الهواء السنخي ليُطرح أثناء الزفير.',
      },
    ],
    mindMapCenterAr: 'التنفس الخلوي والرئوي',
    mindMapCenterFr: 'Respiration',
    mindMapBranches: [
      {
        id: 'rm1',
        titleAr: 'التبادلات السنخية',
        titleFr: 'Échanges alvéolaires',
        color: '#00E5FF',
        speech: 'تتم التبادلات الغازية وفق مبدأ انتشار الغازات من الضغط المرتفع إلى المنخفض.',
        children: [
          { ar: 'PO₂ سنخ > PO₂ دم', fr: '13.3 > 5.3 kPa', speech: 'فرق الضغط يدفع الأوكسجين للدخول إلى الدم.' },
          { ar: 'PCO₂ دم > PCO₂ سنخ', fr: '6.1 > 5.3 kPa', speech: 'فرق الضغط يدفع ثنائي أوكسيد الكربون للخروج إلى السنخ.' },
        ],
      },
      {
        id: 'rm2',
        titleAr: 'خصائص السنخ',
        titleFr: 'Surface d’échange',
        color: '#00FFA3',
        speech: 'الرئتان مساحة تبادل فعالة بفضل 3 شروط أساسية.',
        children: [
          { ar: 'عدد هائل (700 مليون)', fr: 'Surface ≈ 200 m²', speech: 'العدد الهائل للأسناخ يوفر مساحة تبادل تقارب 200 متر مربع.' },
          { ar: 'جدار رقيق وشعيرات كثيفة', fr: 'Paroi fine + Capillaires', speech: 'رقة الجدار وكثافة الشعيرات تسرع انتشار الغازات.' },
        ],
      },
      {
        id: 'rm3',
        titleAr: 'التنفس الخلوي',
        titleFr: 'Respiration cellulaire',
        color: '#FF9F1C',
        speech: 'داخل الخلية يتفاعل الكليكوز مع الأوكسجين لإنتاج الطاقة اللازمة للنشاط.',
        children: [
          { ar: 'كليكوز + O₂', fr: 'Glucose + O₂', speech: 'تستهلك الخلية الكليكوز وثنائي الأوكسجين.' },
          { ar: 'طاقة + CO₂ + H₂O', fr: 'Énergie + CO₂ + H₂O', speech: 'تنتج الخلية الطاقة وتطرح ثنائي أوكسيد الكربون والماء.' },
        ],
      },
    ],
    dragGame: {
      titleAr: 'وجّه مسار الغازات والدم في السنخ الرئوي',
      titleFr: 'Orienter les échanges alvéolaires',
      zoneA: { titleAr: 'يدخل للدم (شهيق)', titleFr: 'Alvéole → Sang', color: '#00E5FF' },
      zoneB: { titleAr: 'يُطرح في الزفير', titleFr: 'Sang → Alvéole', color: '#FF9F1C' },
      tokens: [
        { id: 'rt1', labelAr: 'ثنائي الأوكسجين O₂', labelFr: 'Dioxygène O₂', zone: 'A', accent: '#00E5FF' },
        { id: 'rt2', labelAr: 'ثنائي أوكسيد الكربون CO₂', labelFr: 'Dioxyde de carbone', zone: 'B', accent: '#FF9F1C' },
        { id: 'rt3', labelAr: 'ضغط O₂ مرتفع (13.3 kPa)', labelFr: 'PO₂ élevée', zone: 'A', accent: '#00FFA3' },
        { id: 'rt4', labelAr: 'فضلات التنفس الخلوي', labelFr: 'Déchets gazeux', zone: 'B', accent: '#F59E0B' },
        { id: 'rt5', labelAr: 'يرتبط بالخضاب الدموي', labelFr: 'Fixé par HbO₂', zone: 'A', accent: '#EF4444' },
        { id: 'rt6', labelAr: 'يعكر ماء الجير', labelFr: 'Trouble eau de chaux', zone: 'B', accent: '#FBBF24' },
      ],
    },
    hotspotChallenges: [
      {
        id: 'rh1',
        promptAr: 'اضغط على الدم الخارج الغني بالأوكسجين',
        promptFr: 'Clique sur le sang sortant riche en O₂',
        targetPinId: 'r4',
        hintSpeech: 'الدم الخارج لونه أحمر فاتح ويوجد في الجهة اليسرى من الشعيرة.',
        successSpeech: 'ممتاز! الدم الخارج من السنخ يغتني بثنائي الأوكسجين.',
      },
      {
        id: 'rh2',
        promptAr: 'اضغط على سهم انتشار ثنائي أوكسيد الكربون',
        promptFr: 'Clique sur la diffusion du CO₂',
        targetPinId: 'r6',
        hintSpeech: 'ابحث عن السهم البرتقالي الخارج من الدم نحو السنخ.',
        successSpeech: 'برافو! يغادر ثنائي أوكسيد الكربون الدم نحو الهواء السنخي.',
      },
    ],
    exam: {
      titleAr: 'استهلاك O₂ بدلالة شدة المجهود العضلي',
      titleFr: 'Consommation d’O₂ selon l’effort',
      xLabel: 'الزمن · Temps (min)',
      yLabel: 'استهلاك O₂ (L/min)',
      yMax: 3.0,
      yUnit: 'L/min',
      series1: { nameAr: 'استهلاك O₂', nameFr: 'Conso O₂', color: '#00E5FF' },
      series2: { nameAr: 'طرح CO₂', nameFr: 'Rejet CO₂', color: '#FF9F1C' },
      scenarios: [
        {
          id: 'effort',
          labelAr: 'مجهود جري',
          labelFr: 'Effort physique',
          speech: 'أثناء الجري يرتفع استهلاك الأوكسجين وطرح ثنائي أوكسيد الكربون بسرعة لإنتاج طاقة أكبر.',
          points: [
            { x: 0, y1: 0.4, y2: 0.35, noteSpeech: 'في الراحة: استهلاك الأوكسجين ضعيف (0.4 لتر في الدقيقة).' },
            { x: 2, y1: 1.2, y2: 1.0, noteSpeech: 'بداية الجري: ارتفاع سريع في استهلاك الأوكسجين.' },
            { x: 4, y1: 2.3, y2: 2.0, noteSpeech: 'مجهود متوسط: العضلات تستهلك أوكسجيناً مضاعفاً.' },
            { x: 6, y1: 2.8, y2: 2.5, noteSpeech: 'ذروة المجهود: أقصى استهلاك للأوكسجين (2.8 لتر في الدقيقة).' },
            { x: 8, y1: 1.5, y2: 1.4, noteSpeech: 'فترة الاسترجاع: تراجع تدريجي نحو مستوى الراحة.' },
            { x: 10, y1: 0.5, y2: 0.45, noteSpeech: 'العودة للراحة الطبيعية.' },
          ],
        },
        {
          id: 'rest',
          labelAr: 'حالة راحة',
          labelFr: 'Repos',
          speech: 'في حالة الراحة يبقى استهلاك الأوكسجين ثابتاً ومنخفضاً.',
          points: [
            { x: 0, y1: 0.4, y2: 0.35, noteSpeech: 'ثبات عند 0.4 لتر في الدقيقة.' },
            { x: 2, y1: 0.42, y2: 0.36, noteSpeech: 'معدل تنفسي هادئ.' },
            { x: 4, y1: 0.4, y2: 0.35, noteSpeech: 'استهلاك ثابت للخلايا.' },
            { x: 6, y1: 0.41, y2: 0.35, noteSpeech: 'لا حاجة لطاقة إضافية.' },
            { x: 8, y1: 0.4, y2: 0.35, noteSpeech: 'توازن تنفسي مستقر.' },
            { x: 10, y1: 0.4, y2: 0.35, noteSpeech: 'ثبات تام طيلة الراحة.' },
          ],
        },
      ],
      steps: [
        {
          id: 'rs1',
          stepNum: 1,
          verbAr: 'أصف',
          verbFr: 'Décrire',
          pointsLabel: '2 pts',
          promptAr: 'صف تطور استهلاك O₂ خلال المجهود (0 → 6 min):',
          choices: [
            {
              id: 'a',
              shortAr: 'ارتفع استهلاك O₂ من 0.4 إلى 2.8 L/min',
              shortFr: 'Augmentation de 0.4 à 2.8 L/min',
              isCorrect: true,
              speech: 'وصف دقيق ومباشر بالأرقام!',
            },
            {
              id: 'b',
              shortAr: 'ارتفع لأن العضلة تحتاج إلى الطاقة',
              shortFr: 'Augmente car le muscle veut de l’énergie',
              isCorrect: false,
              speech: 'تجنب كلمة "لأن" في سؤال الوصف!',
            },
          ],
          keyFormulaAr: 'ارتفع استهلاك O₂ من 0.4 L/min في الراحة إلى 2.8 L/min عند ذروة المجهود.',
        },
        {
          id: 'rs2',
          stepNum: 2,
          verbAr: 'أفسر',
          verbFr: 'Expliquer',
          pointsLabel: '2 pts',
          promptAr: 'فسّر ارتفاع استهلاك O₂ وطرح CO₂ أثناء الجري:',
          choices: [
            {
              id: 'a',
              shortAr: 'بسبب ارتفاع نشاط التنفس الخلوي لإنتاج طاقة للعضلات',
              shortFr: 'Oxydation accrue du glucose pour l’énergie',
              isCorrect: true,
              speech: 'ممتاز! أكسدة الكليكوز بالأوكسجين تنتج الطاقة اللازمة للعضلات.',
            },
            {
              id: 'b',
              shortAr: 'بسبب انخفاض عدد الأسناخ الرئوية',
              shortFr: 'Diminution des alvéoles',
              isCorrect: false,
              speech: 'عدد الأسناخ لا ينخفض؛ فكّر في حاجة العضلة للطاقة!',
            },
          ],
          keyFormulaAr: 'تستهلك الخلايا العضلية مزيداً من O₂ لأكسدة الكليكوز وإنتاج الطاقة الضرورية للمجهود.',
        },
        {
          id: 'rs3',
          stepNum: 3,
          verbAr: 'أستنتج',
          verbFr: 'Déduire',
          pointsLabel: '2 pts',
          promptAr: 'ما العلاقة بين المجهود العضلي والتنفس الخلوي؟',
          choices: [
            {
              id: 'a',
              shortAr: 'كلما زاد المجهود زادت وتيرة التنفس الخلوي وإنتاج الطاقة',
              shortFr: 'Effort ↑ ⇒ Respiration cellulaire ↑',
              isCorrect: true,
              speech: 'برافو يا بطل! استنتاج سليم ومركز.',
            },
            {
              id: 'b',
              shortAr: 'لا علاقة بين التنفس والنشاط العضلي',
              shortFr: 'Aucune relation',
              isCorrect: false,
              speech: 'المنحنى يثبت العكس تماماً! التنفس يزود العضلة بالطاقة.',
            },
          ],
          keyFormulaAr: 'يتناسب استهلاك O₂ طردياً مع شدة المجهود لتلبية حاجيات الخلايا من الطاقة.',
        },
      ],
    },
  },

  // =========================================================================
  // UNIT 3: BLOOD & CIRCULATION
  // =========================================================================
  {
    id: 'circulation',
    num: '03',
    titleAr: 'الدم والدوران الدموي',
    titleFr: 'Sang & Circulation',
    accent: '#EF4444',
    welcomeSpeech:
      'مرحباً بك في مختبر القلب والدوران الدموي! تحكم في نبض القلب وشاهد كيف يضخ الدم المؤكسج والدم غير المؤكسج.',
    schemaTitleAr: 'رسم تخطيطي: مقطع طولي للقلب',
    schemaTitleFr: 'Schéma : Coupe longitudinale du cœur',
    schemaPins: [
      {
        id: 'c1',
        num: 1,
        x: 34,
        y: 38,
        ar: 'الأذين الأيمن',
        fr: 'Oreillette droite',
        color: '#3B82F6',
        speech: 'الأذين الأيمن يستقبل الدم الداكن الغني بثنائي أوكسيد الكربون القادم من الأعضاء.',
      },
      {
        id: 'c2',
        num: 2,
        x: 36,
        y: 66,
        ar: 'البطين الأيمن',
        fr: 'Ventricule droit',
        color: '#2563EB',
        speech: 'البطين الأيمن يضخ الدم غير المؤكسج عبر الشريان الرئوي نحو الرئتين.',
      },
      {
        id: 'c3',
        num: 3,
        x: 66,
        y: 38,
        ar: 'الأذين الأيسر',
        fr: 'Oreillette gauche',
        color: '#EF4444',
        speech: 'الأذين الأيسر يستقبل الدم المؤكسج الأحمر القاني القادم من الرئتين.',
      },
      {
        id: 'c4',
        num: 4,
        x: 64,
        y: 66,
        ar: 'البطين الأيسر (جدار سميك)',
        fr: 'Ventricule gauche',
        color: '#DC2626',
        speech: 'البطين الأيسر جداره العضلي سميك جداً ليضخ الدم المؤكسج إلى جميع أعضاء الجسم!',
      },
      {
        id: 'c5',
        num: 5,
        x: 56,
        y: 16,
        ar: 'الشريان الأبهر',
        fr: 'Artère aorte',
        color: '#F87171',
        speech: 'الشريان الأبهر يوزع الدم الغني بالأوكسجين والقيت نحو كافة الأعضاء.',
      },
      {
        id: 'c6',
        num: 6,
        x: 50,
        y: 52,
        ar: 'صمامات قلبية',
        fr: 'Valvules cardiaques',
        color: '#00FFA3',
        speech: 'الصمامات القلبية تضمن جريان الدم في منحى واحد فقط وتمنع رجوعه للخلف.',
      },
    ],
    mindMapCenterAr: 'الدم والدوران الدموي',
    mindMapCenterFr: 'Circulation sanguine',
    mindMapBranches: [
      {
        id: 'cm1',
        titleAr: 'مكونات الدم',
        titleFr: 'Composants du sang',
        color: '#EF4444',
        speech: 'الدم سائل حيوي يتكون من البلازما والكريات الحمراء والبيضاء والصفائح.',
        children: [
          { ar: 'كريات حمراء (Hb)', fr: 'Hématies (O₂/CO₂)', speech: 'الكريات الحمراء تحتوي على الخضاب الدموي لنقل الغازات.' },
          { ar: 'البلازما', fr: 'Plasma (Nutriments)', speech: 'البلازما تنقل مواد القيت والفضلات الذائبة.' },
          { ar: 'كريات بيضاء وصفائح', fr: 'Leucocytes & Plaquettes', speech: 'الكريات البيضاء تدافع عن الجسم والصفائح توقف النزيف.' },
        ],
      },
      {
        id: 'cm2',
        titleAr: 'الدورة القلبية',
        titleFr: 'Révolution cardiaque',
        color: '#00E5FF',
        speech: 'تمر كل نبضة قلبية بثلاث مراحل: انقباض أذيني، انقباض بطيني، ثم انبساط عام.',
        children: [
          { ar: 'انقباض أذيني', fr: 'Systole auriculaire', speech: 'تضخ الأذينتان الدم نحو البطينين.' },
          { ar: 'انقباض بطيني', fr: 'Systole ventriculaire', speech: 'يضخ البطينان الدم بقوة في الشرايين.' },
          { ar: 'انبساط عام', fr: 'Diastole générale', speech: 'يرتاح القلب ويمتلئ مجدداً بالدم من الأوردة.' },
        ],
      },
      {
        id: 'cm3',
        titleAr: 'الدورتان الدمويتان',
        titleFr: 'Double circulation',
        color: '#00FFA3',
        speech: 'الدورة الرئوية الصغرى تجدد الأوكسجين، والدورة العامة الكبرى تغذي الأعضاء.',
        children: [
          { ar: 'الدورة الرئوية (صغرى)', fr: 'Petite circulation', speech: 'بطين أيمن ← رئتان ← أذين أيسر.' },
          { ar: 'الدورة العامة (كبرى)', fr: 'Grande circulation', speech: 'بطين أيسر ← أعضاء ← أذين أيمن.' },
        ],
      },
    ],
    dragGame: {
      titleAr: 'صنّف عناصر القلب الأيمن والقلب الأيسر',
      titleFr: 'Cœur gauche (O₂) vs Cœur droit (CO₂)',
      zoneA: { titleAr: 'القلب الأيسر (دم غني بـ O₂)', titleFr: 'Cœur gauche', color: '#EF4444' },
      zoneB: { titleAr: 'القلب الأيمن (دم غني بـ CO₂)', titleFr: 'Cœur droit', color: '#3B82F6' },
      tokens: [
        { id: 'ct1', labelAr: 'الأذين الأيسر', labelFr: 'Oreillette gauche', zone: 'A', accent: '#EF4444' },
        { id: 'ct2', labelAr: 'البطين الأيسر السميك', labelFr: 'Ventricule gauche', zone: 'A', accent: '#DC2626' },
        { id: 'ct3', labelAr: 'الشريان الأبهر', labelFr: 'Artère aorte', zone: 'A', accent: '#F87171' },
        { id: 'ct4', labelAr: 'الأذين الأيمن', labelFr: 'Oreillette droite', zone: 'B', accent: '#3B82F6' },
        { id: 'ct5', labelAr: 'البطين الأيمن', labelFr: 'Ventricule droit', zone: 'B', accent: '#2563EB' },
        { id: 'ct6', labelAr: 'الشريان الرئوي', labelFr: 'Artère pulmonaire', zone: 'B', accent: '#60A5FA' },
      ],
    },
    hotspotChallenges: [
      {
        id: 'ch1',
        promptAr: 'اضغط على التجويف ذي الجدار العضلي الأسمك',
        promptFr: 'Clique sur la cavité à paroi la plus épaisse',
        targetPinId: 'c4',
        hintSpeech: 'إنه يضخ الدم لمسافة طويلة نحو جميع أعضاء الجسم!',
        successSpeech: 'أحسنت! البطين الأيسر جداره أسمك لضخ الدم إلى سائر الجسم.',
      },
      {
        id: 'ch2',
        promptAr: 'اضغط على البنيات التي تمنع رجوع الدم للخلف',
        promptFr: 'Clique sur les structures à sens unique',
        targetPinId: 'c6',
        hintSpeech: 'توجد بين الأذينين والبطينين وتعمل كبوابات ذات اتجاه واحد.',
        successSpeech: 'ممتاز! الصمامات القلبية تفرض جريان الدم في اتجاه واحد.',
      },
    ],
    exam: {
      titleAr: 'تطور التردد القلبي (BPM) قبل وأثناء وبعد التمرين',
      titleFr: 'Évolution de la fréquence cardiaque',
      xLabel: 'الزمن · Temps (min)',
      yLabel: 'النبض · BPM',
      yMax: 180,
      yUnit: 'bpm',
      series1: { nameAr: 'التردد القلبي', nameFr: 'Fréquence cardiaque', color: '#EF4444' },
      scenarios: [
        {
          id: 'run',
          labelAr: 'تمرين رياضي',
          labelFr: 'Exercice',
          speech: 'يرتفع التردد القلبي من 70 إلى 165 نبضة في الدقيقة لتسريع تزويد العضلات بالدم.',
          points: [
            { x: 0, y1: 70, noteSpeech: 'في الراحة: 70 نبضة في الدقيقة.' },
            { x: 2, y1: 115, noteSpeech: 'بداية التمرين: تسارع نبض القلب.' },
            { x: 4, y1: 155, noteSpeech: 'أثناء الجري: 155 نبضة في الدقيقة.' },
            { x: 6, y1: 165, noteSpeech: 'الذروة: 165 نبضة لتوفير الأوكسجين والكليكوز للعضلات.' },
            { x: 8, y1: 110, noteSpeech: 'بداية الاسترجاع بعد توقف التمرين.' },
            { x: 10, y1: 75, noteSpeech: 'عودة تدريجية للنبض العادي.' },
          ],
        },
        {
          id: 'athlete',
          labelAr: 'رياضي محترف',
          labelFr: 'Sportif entraîné',
          speech: 'قلب الرياضي أقوى؛ نبضه في الراحة أقل ويعود للهدوء بسرعة أكبر!',
          points: [
            { x: 0, y1: 52, noteSpeech: 'راحة الرياضي: 52 نبضة فقط لقوة ضخ القلب.' },
            { x: 2, y1: 95, noteSpeech: 'تكيّف سريع مع بداية المجهود.' },
            { x: 4, y1: 128, noteSpeech: 'نبض مستقر وأكثر كفاءة.' },
            { x: 6, y1: 135, noteSpeech: 'ذروة أقل إرهاقاً للقلب.' },
            { x: 8, y1: 78, noteSpeech: 'استرجاع سريع جداً للنبض.' },
            { x: 10, y1: 55, noteSpeech: 'عودة فورية لوضع الراحة.' },
          ],
        },
      ],
      steps: [
        {
          id: 'cs1',
          stepNum: 1,
          verbAr: 'أصف',
          verbFr: 'Décrire',
          pointsLabel: '2 pts',
          promptAr: 'صف تطور التردد القلبي خلال التمرين (0 → 6 min):',
          choices: [
            {
              id: 'a',
              shortAr: 'ارتفع من 70 bpm إلى 165 bpm ثم انخفض بعد الدقيقة 6',
              shortFr: 'Hausse de 70 à 165 bpm puis baisse',
              isCorrect: true,
              speech: 'وصف نموذجي ممتاز بالأرقام!',
            },
            {
              id: 'b',
              shortAr: 'تسارع القلب لضخ مزيد من الكليكوز',
              shortFr: 'Accélération pour pomper le glucose',
              isCorrect: false,
              speech: 'هذا تفسير! المطلوب في الخطوة الأولى وصف الأرقام فقط.',
            },
          ],
          keyFormulaAr: 'ارتفع التردد القلبي من 70 إلى 165 نبضة/دقيقة أثناء التمرين ثم تراجع تدريجياً.',
        },
        {
          id: 'cs2',
          stepNum: 2,
          verbAr: 'أفسر',
          verbFr: 'Expliquer',
          pointsLabel: '2 pts',
          promptAr: 'لماذا يتسارع ضخ القلب أثناء المجهود؟',
          choices: [
            {
              id: 'a',
              shortAr: 'للرفع من الصبيب الدموي وتزويد العضلات بـ O₂ والقيت',
              shortFr: 'Augmenter l’apport en O₂ et nutriments',
              isCorrect: true,
              speech: 'أحسنت! القلب يضخ دماً أكثر لتغذية العضلات وطرح الفضلات.',
            },
            {
              id: 'b',
              shortAr: 'لتقليل كمية الدم الواصلة للرئتين',
              shortFr: 'Réduire le sang vers les poumons',
              isCorrect: false,
              speech: 'العكس تماماً! القلب يزيد من كمية الدم الواصلة للرئتين والعضلات.',
            },
          ],
          keyFormulaAr: 'يرتفع التردد القلبي لتسريع نقل O₂ والكليكوز للعضلات والتخلص من CO₂.',
        },
        {
          id: 'cs3',
          stepNum: 3,
          verbAr: 'أستنتج',
          verbFr: 'Déduire',
          pointsLabel: '2 pts',
          promptAr: 'ما دور القلب في الجسم؟',
          choices: [
            {
              id: 'a',
              shortAr: 'مضخة عضلية مزدوجة تتكيف مع حاجيات الأعضاء',
              shortFr: 'Double pompe adaptée aux besoins',
              isCorrect: true,
              speech: 'رائع يا بطل! استنتاج دقيق ومختصر.',
            },
            {
              id: 'b',
              shortAr: 'عضو ينتج الأوكسجين داخل البطينين',
              shortFr: 'Produit de l’oxygène',
              isCorrect: false,
              speech: 'الرئتان تجددان الأوكسجين، أما القلب فدوره ضخ الدم فقط!',
            },
          ],
          keyFormulaAr: 'يعمل القلب كمضخة مزدوجة تتكيف وتيرتها حسب نشاط الجسم.',
        },
      ],
    },
  },

  // =========================================================================
  // UNIT 4: URINARY EXCRETION
  // =========================================================================
  {
    id: 'excretion',
    num: '04',
    titleAr: 'الإبراز البولي',
    titleFr: 'Excrétion Urinaire',
    accent: '#FF9F1C',
    welcomeSpeech:
      'أهلاً بك في مختبر الكلية والأنبوب البولي! راقب كيف يرشح النيفرون الفضلات السامة ويعيد امتصاص الكليكوز كاملاً.',
    schemaTitleAr: 'رسم تخطيطي: الأنبوب البولي (النفرون)',
    schemaTitleFr: 'Schéma : Le Néphron (Tube urinifère)',
    schemaPins: [
      {
        id: 'e1',
        num: 1,
        x: 24,
        y: 34,
        ar: 'الكبيبة (الترشيح الكبيبي)',
        fr: 'Glomérule (Filtration)',
        color: '#EF4444',
        speech: 'على مستوى الكبيبة يتم ترشيح البلازما لتشكيل البول الأولي دون مرور البروتيدات الضخمة.',
      },
      {
        id: 'e2',
        num: 2,
        x: 42,
        y: 28,
        ar: 'محفظة بومان',
        fr: 'Capsule de Bowman',
        color: '#00E5FF',
        speech: 'محفظة بومان تستقبل البول الأولي المصفّى من الشعيرات الدموية.',
      },
      {
        id: 'e3',
        num: 3,
        x: 52,
        y: 62,
        ar: 'إعادة امتصاص الكليكوز 100%',
        fr: 'Réabsorption du glucose',
        color: '#00FFA3',
        speech: 'في الأنبوب الملتوي يُعاد امتصاص 100% من الكليكوز وجزء كبير من الماء نحو الدم!',
      },
      {
        id: 'e4',
        num: 4,
        x: 68,
        y: 44,
        ar: 'إفراز أنبوبي (النشادر)',
        fr: 'Sécrétion tubulaire',
        color: '#FF9F1C',
        speech: 'تفرز خلايا الأنبوب البولي مواد سامة مثل النشادر وتطرحها في البول النهائي.',
      },
      {
        id: 'e5',
        num: 5,
        x: 82,
        y: 78,
        ar: 'القناة الجامعة (بول نهائي)',
        fr: 'Canal collecteur (Urine)',
        color: '#FBBF24',
        speech: 'القناة الجامعة تنقل البول النهائي الغني بالبولة وحمض البولي نحو المثانة.',
      },
    ],
    mindMapCenterAr: 'تشكل البول (النفرون)',
    mindMapCenterFr: 'Formation de l’urine',
    mindMapBranches: [
      {
        id: 'em1',
        titleAr: '1. الترشيح الكبيبي',
        titleFr: 'Filtration glomérulaire',
        color: '#00E5FF',
        speech: 'الترشيح الكبيبي يسمح بمرور الجزيئات الصغيرة ويمنع البروتيدات الضخمة.',
        children: [
          { ar: 'يمر: ماء + كليكوز + بولة', fr: 'Petites molécules', speech: 'تشكل هذه العناصر البول الأولي.' },
          { ar: 'لا تمر: البروتيدات والدهنيات', fr: 'Grosses molécules', speech: 'تبقى البروتيدات الضخمة داخل الدم.' },
        ],
      },
      {
        id: 'em2',
        titleAr: '2. إعادة الامتصاص',
        titleFr: 'Réabsorption tubulaire',
        color: '#00FFA3',
        speech: 'يسترجع الدم الكليكوز بالكامل ومعظم الماء والأملاح المعدنية.',
        children: [
          { ar: '100% من الكليكوز للدم', fr: '0 g/L dans l’urine', speech: 'البول السليم لا يحتوي أبداً على الكليكوز!' },
          { ar: '99% من الماء يُسترجع', fr: 'Régulation hydrique', speech: 'توازن الكلية كمية الماء في الجسم بدقة.' },
        ],
      },
      {
        id: 'em3',
        titleAr: '3. الإفراز الأنبوبي',
        titleFr: 'Sécrétion tubulaire',
        color: '#FF9F1C',
        speech: 'يُفرز النشادر وتتركز البولة السامة في البول النهائي.',
        children: [
          { ar: 'البولة وحمض البولي', fr: 'Urée & Acide urique', speech: 'فضلات أزوتية سامة ناتجة عن هدم البروتيدات.' },
          { ar: 'النشادر (NH₃)', fr: 'Ammoniaque', speech: 'يصنعها الأنبوب البولي وتطرح في البول النهائي.' },
        ],
      },
    ],
    dragGame: {
      titleAr: 'فلتر الكلية: يعود للدم أم يُطرح في البول؟',
      titleFr: 'Filtre rénal : Sang ou Urine définitive ?',
      zoneA: { titleAr: 'يبقى أو يعود للدم', titleFr: 'Reste dans le sang', color: '#00FFA3' },
      zoneB: { titleAr: 'يُطرح في البول النهائي', titleFr: 'Éliminé dans l’urine', color: '#FF9F1C' },
      tokens: [
        { id: 'et1', labelAr: 'كليكوز (100%)', labelFr: 'Glucose', zone: 'A', accent: '#00FFA3' },
        { id: 'et2', labelAr: 'بروتيدات ضخمة', labelFr: 'Protides', zone: 'A', accent: '#EF4444' },
        { id: 'et3', labelAr: 'البولة (سامة)', labelFr: 'Urée', zone: 'B', accent: '#FF9F1C' },
        { id: 'et4', labelAr: 'النشادر NH₃', labelFr: 'Ammoniaque', zone: 'B', accent: '#F59E0B' },
        { id: 'et5', labelAr: 'كريات دموية', labelFr: 'Globules rouges', zone: 'A', accent: '#F87171' },
        { id: 'et6', labelAr: 'حمض بولي وفائض ماء', labelFr: 'Acide urique', zone: 'B', accent: '#FBBF24' },
      ],
    },
    hotspotChallenges: [
      {
        id: 'eh1',
        promptAr: 'اضغط على مكان الترشيح الكبيبي للبلازما',
        promptFr: 'Clique sur le lieu de la filtration glomérulaire',
        targetPinId: 'e1',
        hintSpeech: 'إنه الكتلة الدموية الحمراء في بداية الأنبوب البولي.',
        successSpeech: 'برافو! في الكبيبة يتم ترشيح البلازما لتشكيل البول الأولي.',
      },
      {
        id: 'eh2',
        promptAr: 'اضغط على منطقة إعادة امتصاص الكليكوز بالكامل',
        promptFr: 'Clique où le glucose est réabsorbé à 100%',
        targetPinId: 'e3',
        hintSpeech: 'ابحث عن العلامة الخضراء في الأنبوب الملتوي.',
        successSpeech: 'ممتاز! يعود الكليكوز كاملاً للدم في الأنبوب البولي.',
      },
    ],
    exam: {
      titleAr: 'مقارنة تركيز البولة والكليكوز (البلازما ← البول النهائي)',
      titleFr: 'Concentration Urée vs Glucose (Plasma → Urine)',
      xLabel: 'المرحلة · Étape (0: بلازما · 5: بول أولي · 10: بول نهائي)',
      yLabel: 'التركيز النسبي (g/L)',
      yMax: 25,
      yUnit: 'g/L',
      series1: { nameAr: 'البولة Urée', nameFr: 'Urée', color: '#FF9F1C' },
      series2: { nameAr: 'الكليكوز (×10)', nameFr: 'Glucose ×10', color: '#00FFA3' },
      scenarios: [
        {
          id: 'healthy',
          labelAr: 'شخص سليم',
          labelFr: 'Sujet sain',
          speech: 'عند الشخص السليم ترتفع البولة حتى 20 غرام في اللتر بينما ينعدم الكليكوز في البول النهائي.',
          points: [
            { x: 0, y1: 0.3, y2: 10, noteSpeech: 'في البلازما: بولة 0.3 غرام في اللتر وكليكوز 1 غرام في اللتر.' },
            { x: 5, y1: 0.3, y2: 10, noteSpeech: 'في البول الأولي: نفس التركيز بعد الترشيح الكبيبي.' },
            { x: 10, y1: 20, y2: 0, noteSpeech: 'في البول النهائي: تركزت البولة 66 مرة وانعدم الكليكوز تماماً!' },
          ],
        },
        {
          id: 'diabetic',
          labelAr: 'مصاب بالسكري',
          labelFr: 'Diabétique',
          speech: 'انتبه لحالة السكري! عندما يتجاوز الكليكوز في الدم 1.8 غرام في اللتر، يعجز النفرون عن إعادة امتصاصه كاملاً فيظهر في البول.',
          points: [
            { x: 0, y1: 0.3, y2: 24, noteSpeech: 'بلازما مريض السكري: ارتفاع حاد في الكليكوز (2.4 g/L).' },
            { x: 5, y1: 0.3, y2: 24, noteSpeech: 'بول أولي مثقل بالكليكوز.' },
            { x: 10, y1: 20, y2: 8, noteSpeech: 'ظهور الكليكوز في البول النهائي (بيلة سكرية)!' },
          ],
        },
      ],
      steps: [
        {
          id: 'es1',
          stepNum: 1,
          verbAr: 'أصف',
          verbFr: 'Décrire',
          pointsLabel: '2 pts',
          promptAr: 'قارن تركيز البولة والكليكوز بين البلازما والبول النهائي عند السليم:',
          choices: [
            {
              id: 'a',
              shortAr: 'ارتفاع كبير للبولة (0.3→20 g/L) واختفاء الكليكوز (1→0 g/L)',
              shortFr: 'Urée ↑ fortement · Glucose = 0 g/L',
              isCorrect: true,
              speech: 'وصف ممتاز ودقيق بالأرقام!',
            },
            {
              id: 'b',
              shortAr: 'اختفى الكليكوز لأن الكلية أعادت امتصاصه',
              shortFr: 'Disparu par réabsorption',
              isCorrect: false,
              speech: 'لا تخلط الوصف بالتفسير! اذكر القيم فقط في الوصف.',
            },
          ],
          keyFormulaAr: 'ارتفعت البولة من 0.3 إلى 20 g/L بينما انعدم الكليكوز في البول النهائي.',
        },
        {
          id: 'es2',
          stepNum: 2,
          verbAr: 'أفسر',
          verbFr: 'Expliquer',
          pointsLabel: '2 pts',
          promptAr: 'فسّر غياب الكليكوز في البول النهائي رغم وجوده في البول الأولي:',
          choices: [
            {
              id: 'a',
              shortAr: 'بسبب إعادة امتصاصه كلياً (100%) على مستوى الأنبوب البولي',
              shortFr: 'Réabsorption tubulaire totale (100%)',
              isCorrect: true,
              speech: 'تفسير علمي رائع! النفرون يعيد الكليكوز كاملاً للدم.',
            },
            {
              id: 'b',
              shortAr: 'لأن الكليكوز جزيئة ضخمة لا تعبر الكبيبة',
              shortFr: 'Trop grosse molécule',
              isCorrect: false,
              speech: 'الكليكوز صغير ويعبر الكبيبة! البروتيدات هي التي لا تعبر.',
            },
          ],
          keyFormulaAr: 'يعاد امتصاص الكليكوز بالكامل نحو الدم على مستوى الأنبوب البولي.',
        },
        {
          id: 'es3',
          stepNum: 3,
          verbAr: 'أستنتج',
          verbFr: 'Déduire',
          pointsLabel: '2 pts',
          promptAr: 'ما الدور الأساسي للكلية في الجسم؟',
          choices: [
            {
              id: 'a',
              shortAr: 'تصفية الدم من الفضلات السامة والحفاظ على ثبات الوسط الداخلي',
              shortFr: 'Épuration du sang & homéostasie',
              isCorrect: true,
              speech: 'استنتاج كامل يستحق العلامة الكاملة!',
            },
            {
              id: 'b',
              shortAr: 'التخلص من الكليكوز والبروتيدات في البول',
              shortFr: 'Éliminer glucose et protides',
              isCorrect: false,
              speech: 'الكلية تحفظ القيت النافع وتتخلص فقط من الفضلات السامة.',
            },
          ],
          keyFormulaAr: 'تلعب الكلية دور مصفاة تحافظ على ثبات تركيب الدم بتخليصه من الفضلات.',
        },
      ],
    },
  },

  // =========================================================================
  // UNIT 5: NERVOUS SYSTEM
  // =========================================================================
  {
    id: 'nervous',
    num: '05',
    titleAr: 'الجهاز العصبي',
    titleFr: 'Système Nerveux',
    accent: '#A855F7',
    welcomeSpeech:
      'مرحباً بك في مختبر الجهاز العصبي! اضغط على زر الإهاجة وشاهد انطلاق السيالة العصبية عبر قوس الانعكاس الشوكي.',
    schemaTitleAr: 'رسم تخطيطي: قوس الانعكاس الشوكي',
    schemaTitleFr: 'Schéma : L’Arc Réflexe Médullaire',
    schemaPins: [
      {
        id: 'n1',
        num: 1,
        x: 16,
        y: 34,
        ar: 'مستقبل حسي (الجلد)',
        fr: 'Récepteur sensoriel',
        color: '#00E5FF',
        speech: 'المستقبل الحسي يستقبل الإهاجة وتنشأ على مستواه سيالة عصبية حسية.',
      },
      {
        id: 'n2',
        num: 2,
        x: 34,
        y: 26,
        ar: 'موصل حسي (جذر خلفي)',
        fr: 'Fibre sensitive (Racine dorsale)',
        color: '#38BDF8',
        speech: 'الألياف الحسية تنقل السيالة الحسية المركزية عبر الجذر الخلفي ذي العقدة الشوكية.',
      },
      {
        id: 'n3',
        num: 3,
        x: 54,
        y: 44,
        ar: 'النخاع الشوكي (مركز عصبي)',
        fr: 'Moelle épinière (Centre)',
        color: '#A855F7',
        speech: 'النخاع الشوكي هو المركز العصبي للانعكاسات؛ يحوّل السيالة الحسية إلى سيالة حركية!',
      },
      {
        id: 'n4',
        num: 4,
        x: 36,
        y: 70,
        ar: 'موصل حركي (جذر أمامي)',
        fr: 'Fibre motrice (Racine ventrale)',
        color: '#00FFA3',
        speech: 'الألياف الحركية تنقل السيالة النابذة عبر الجذر الأمامي نحو العضلة.',
      },
      {
        id: 'n5',
        num: 5,
        x: 18,
        y: 76,
        ar: 'مستجيب حركي (العضلة)',
        fr: 'Effecteur (Muscle)',
        color: '#FF9F1C',
        speech: 'العضلة هي المستجيب الحركي الذي يتقلص لتنفيذ الحركة اللاإرادية السريعة.',
      },
    ],
    mindMapCenterAr: 'الجهاز العصبي',
    mindMapCenterFr: 'Système Nerveux',
    mindMapBranches: [
      {
        id: 'nm1',
        titleAr: 'الحساسية الشعورية',
        titleFr: 'Sensibilité consciente',
        color: '#00E5FF',
        speech: 'مسارها: مستقبل حسي ← موصل حسي ← الباحة الحسية في المخ.',
        children: [
          { ar: 'مستقبل حسي (عين/جلد)', fr: 'Récepteur', speech: 'تنشأ فيه السيالة الحسية عند الإهاجة.' },
          { ar: 'باحة حسية (المخ)', fr: 'Aire sensitive', speech: 'تحلل السيالة وتحدد طبيعة الإحساس.' },
        ],
      },
      {
        id: 'nm2',
        titleAr: 'التحركية الإرادية',
        titleFr: 'Motricité volontaire',
        color: '#00FFA3',
        speech: 'تنشأ في الباحة الحركية للمخ وتمر عبر النخاع الشوكي إلى العضلات.',
        children: [
          { ar: 'الباحة الحركية (مخ)', fr: 'Aire motrice', speech: 'تتحكم في النصف المعاكس من الجسم!' },
          { ar: 'سيالة حركية نابذة', fr: 'Influx centrifuge', speech: 'تنزل عبر النخاع الشوكي والعصب الحركي للعضلة.' },
        ],
      },
      {
        id: 'nm3',
        titleAr: 'الانعكاس الشوكي',
        titleFr: 'Réflexe médullaire',
        color: '#A855F7',
        speech: 'حركة لاإرادية سريعة مركزها النخاع الشوكي لوقاية الجسم من الأخطار.',
        children: [
          { ar: 'العصب السيسائي (مختلط)', fr: 'Nerf rachidien mixte', speech: 'يضم أليافاً حسية وأليافاً حركية معاً.' },
          { ar: 'جذر خلفي حسي · أمامي حركي', fr: 'Dorsale / Ventrale', speech: 'العقدة الشوكية توجد دائماً على الجذر الخلفي الحسي.' },
        ],
      },
    ],
    dragGame: {
      titleAr: 'ميّز المسار الحسي عن المسار الحركي في الانعكاس',
      titleFr: 'Voie sensitive vs Voie motrice',
      zoneA: { titleAr: 'المسار الحسي (مركزي)', titleFr: 'Voie sensitive', color: '#00E5FF' },
      zoneB: { titleAr: 'المسار الحركي (نابذ)', titleFr: 'Voie motrice', color: '#00FFA3' },
      tokens: [
        { id: 'nt1', labelAr: 'الجلد (مستقبل)', labelFr: 'Peau (Récepteur)', zone: 'A', accent: '#00E5FF' },
        { id: 'nt2', labelAr: 'الجذر الخلفي', labelFr: 'Racine dorsale', zone: 'A', accent: '#38BDF8' },
        { id: 'nt3', labelAr: 'العقدة الشوكية', labelFr: 'Ganglion spinal', zone: 'A', accent: '#A855F7' },
        { id: 'nt4', labelAr: 'الجذر الأمامي', labelFr: 'Racine ventrale', zone: 'B', accent: '#00FFA3' },
        { id: 'nt5', labelAr: 'العضلة (مستجيب)', labelFr: 'Muscle effecteur', zone: 'B', accent: '#FF9F1C' },
        { id: 'nt6', labelAr: 'سيالة نابذة', labelFr: 'Influx centrifuge', zone: 'B', accent: '#34D399' },
      ],
    },
    hotspotChallenges: [
      {
        id: 'nh1',
        promptAr: 'اضغط على المركز العصبي الذي يحوّل السيالة الحسية إلى حركية',
        promptFr: 'Clique sur le centre nerveux réflexe',
        targetPinId: 'n3',
        hintSpeech: 'تذكر! الانعكاس الشوكي لا يحتاج للمخ، بل لمركز في العمود الفقري.',
        successSpeech: 'برافو! النخاع الشوكي هو المركز العصبي للانعكاسات.',
      },
      {
        id: 'nh2',
        promptAr: 'اضغط على الجذر الخلفي الذي تمر عبره السيالة الحسية',
        promptFr: 'Clique sur la racine dorsale sensitive',
        targetPinId: 'n2',
        hintSpeech: 'ابحث عن المسار العلوي الذي يحمل العقدة الشوكية.',
        successSpeech: 'أحسنت! الجذر الخلفي ينقل السيالة الحسية نحو النخاع الشوكي.',
      },
    ],
    exam: {
      titleAr: 'استجابة الليف العصبي بدلالة شدة الإهاجة (عتبة الإهاجة)',
      titleFr: 'Réponse nerveuse selon l’intensité du stimulus',
      xLabel: 'شدة الإهاجة · Intensité (mV)',
      yLabel: 'وسع الاستجابة (mV)',
      yMax: 100,
      yUnit: 'mV',
      series1: { nameAr: 'وسع السيالة العصبية', nameFr: 'Amplitude influx', color: '#A855F7' },
      scenarios: [
        {
          id: 'normal',
          labelAr: 'عصب سليم',
          labelFr: 'Nerf sain',
          speech: 'تبدأ الاستجابة فقط عند بلوغ عتبة الإهاجة (4 mV) ثم ترتفع تدريجياً بتزايد الشدة.',
          points: [
            { x: 0, y1: 0, noteSpeech: 'شدة 0: لا توجد إهاجة ولا سيالة.' },
            { x: 2, y1: 0, noteSpeech: 'شدة 2: إهاجة غير فعالة (أقل من العتبة).' },
            { x: 4, y1: 28, noteSpeech: 'شدة 4: بلوغ عتبة الإهاجة ونشأة السيالة العصبية!' },
            { x: 6, y1: 62, noteSpeech: 'شدة 6: تجنيد مزيد من الألياف العصبية.' },
            { x: 8, y1: 92, noteSpeech: 'شدة 8: استجابة قوية تقترب من الوسع الأقصى.' },
            { x: 10, y1: 95, noteSpeech: 'شدة 10: تجنيد جميع ألياف العصب (وسع أقصى).' },
          ],
        },
        {
          id: 'anesthetic',
          labelAr: 'تحت تأثير المخدّر (إيثر)',
          labelFr: 'Sous anesthésique',
          speech: 'المخدّر يعطل المستقبلات الحسية أو التوصيل العصبي فتنعدم السيالة!',
          points: [
            { x: 0, y1: 0, noteSpeech: 'لا توجد سيالة.' },
            { x: 2, y1: 0, noteSpeech: 'المستقبل مخدر.' },
            { x: 4, y1: 0, noteSpeech: 'انعدام الاستجابة رغم بلوغ العتبة.' },
            { x: 6, y1: 0, noteSpeech: 'انعدام توصيل السيالة العصبية.' },
            { x: 8, y1: 0, noteSpeech: 'لا توجد استجابة انعكاسية.' },
            { x: 10, y1: 0, noteSpeech: 'المخدّر يوقف الإحساس والحركة الانعكاسية.' },
          ],
        },
      ],
      steps: [
        {
          id: 'ns1',
          stepNum: 1,
          verbAr: 'أصف',
          verbFr: 'Décrire',
          pointsLabel: '2 pts',
          promptAr: 'كيف يتطور وسع السيالة العصبية عند العصب السليم؟',
          choices: [
            {
              id: 'a',
              shortAr: 'منعدم حتى 2 mV ثم يرتفع من 28 إلى 95 mV ابتداءً من 4 mV',
              shortFr: 'Nul jusqu’à 2 mV, puis hausse dès 4 mV',
              isCorrect: true,
              speech: 'وصف دقيق جداً يبرز قيمة العتبة!',
            },
            {
              id: 'b',
              shortAr: 'يرتفع لأن العصب يضم أليافاً عصبية كثيرة',
              shortFr: 'Augmente car le nerf a plusieurs fibres',
              isCorrect: false,
              speech: 'انتبه! هذا تفسير وليس وصفاً.',
            },
          ],
          keyFormulaAr: 'تظل الاستجابة منعدمة دون 4 mV ثم ترتفع من 28 إلى 95 mV.',
        },
        {
          id: 'ns2',
          stepNum: 2,
          verbAr: 'أفسر',
          verbFr: 'Expliquer',
          pointsLabel: '2 pts',
          promptAr: 'لماذا لم تحصل أي استجابة عند شدة 2 mV؟',
          choices: [
            {
              id: 'a',
              shortAr: 'لأن شدة الإهاجة غير فعالة (أصغر من عتبة الإهاجة 4 mV)',
              shortFr: 'Stimulus infraliminaire (< seuil)',
              isCorrect: true,
              speech: 'برافو! يجب بلوغ عتبة الإهاجة لنشأة السيالة العصبية.',
            },
            {
              id: 'b',
              shortAr: 'لأن النخاع الشوكي مخدّر',
              shortFr: 'Moelle anesthésiée',
              isCorrect: false,
              speech: 'العصب سليم في هذه الحالة، لكن الشدة ضعيفة جداً.',
            },
          ],
          keyFormulaAr: 'الشدة 2 mV دون عتبة الإهاجة لذا فهي غير فعالة.',
        },
        {
          id: 'ns3',
          stepNum: 3,
          verbAr: 'أستنتج',
          verbFr: 'Déduire',
          pointsLabel: '2 pts',
          promptAr: 'ما الشرط الأساسي لحدوث استجابة عصبية؟',
          choices: [
            {
              id: 'a',
              shortAr: 'توفر إهاجة فعالة (تساوي أو تفوق العتبة) وسلامة العناصر العصبية',
              shortFr: 'Stimulus efficace (≥ seuil) + intégrité',
              isCorrect: true,
              speech: 'استنتاج نموذجي متكامل!',
            },
            {
              id: 'b',
              shortAr: 'أي لمسة ضعيفة تسبب انعكاساً أقصى دائماً',
              shortFr: 'Tout stimulus donne le max',
              isCorrect: false,
              speech: 'لا! الإهاجة يجب أن تبلغ العتبة لتكون فعالة.',
            },
          ],
          keyFormulaAr: 'تتطلب الاستجابة العصبية إهاجة فعالة تفوق العتبة وسلامة المسار العصبي.',
        },
      ],
    },
  },

  // =========================================================================
  // UNIT 6: MUSCULAR SYSTEM
  // =========================================================================
  {
    id: 'muscular',
    num: '06',
    titleAr: 'الجهاز العضلي',
    titleFr: 'Système Musculaire',
    accent: '#00FFA3',
    welcomeSpeech:
      'أهلاً بك في مختبر الجهاز العضلي! حرّك زاوية الساعد لتشاهد عمل العضلات المتعارضة: ثنائية الرأس وثلاثية الرأس!',
    schemaTitleAr: 'رسم تخطيطي: العضلات المتعارضة والصفيحة المحركة',
    schemaTitleFr: 'Schéma : Muscles antagonistes (Flexion)',
    schemaPins: [
      {
        id: 'm1',
        num: 1,
        x: 34,
        y: 38,
        ar: 'العضلة ثنائية الرأس (متقلصة)',
        fr: 'Biceps (Contracté)',
        color: '#00FFA3',
        speech: 'أثناء ثني الساعد تتقلص العضلة ثنائية الرأس، فيقصر طولها ويزداد سمكها وتصبح صلبة.',
      },
      {
        id: 'm2',
        num: 2,
        x: 20,
        y: 52,
        ar: 'العضلة ثلاثية الرأس (مرتخية)',
        fr: 'Triceps (Relâché)',
        color: '#00E5FF',
        speech: 'في نفس اللحظة ترتخي العضلة ثلاثية الرأس المعارضة لها فيزداد طولها.',
      },
      {
        id: 'm3',
        num: 3,
        x: 42,
        y: 66,
        ar: 'الأوتار العضلية',
        fr: 'Tendons',
        color: '#F8FAFC',
        speech: 'الأوتار القوية تثبت العضلة على العظام وتنقل قوة التقلص لتحريك المفصل.',
      },
      {
        id: 'm4',
        num: 4,
        x: 56,
        y: 72,
        ar: 'مفصل المرفق',
        fr: 'Articulation du coude',
        color: '#FF9F1C',
        speech: 'المفصل يعمل كمحور دوران يسهل حركة الساعد بدون احتكاك بفضل الغضروف.',
      },
      {
        id: 'm5',
        num: 5,
        x: 78,
        y: 36,
        ar: 'الصفيحة المحركة (سينابس)',
        fr: 'Plaque motrice',
        color: '#A855F7',
        speech: 'الصفيحة المحركة هي نقطة التقاء الليف العصبي الحركي بالألياف العضلية لتمرير أمر التقلص.',
      },
    ],
    mindMapCenterAr: 'العضلة الهيكلية',
    mindMapCenterFr: 'Muscle squelettique',
    mindMapBranches: [
      {
        id: 'mm1',
        titleAr: 'خاصيات العضلة الثلاث',
        titleFr: '3 Propriétés',
        color: '#00FFA3',
        speech: 'تتميز العضلة الهيكلية بثلاث خاصيات: الاهتياجية، القلوصية، والمرونة المحدودة.',
        children: [
          { ar: 'الاهتياجية', fr: 'Excitabilité', speech: 'القدرة على الاستجابة للإهاجة العصبية أو الكهربائية.' },
          { ar: 'القلوصية', fr: 'Contractilité', speech: 'تقلص العضلة بقصر طولها وزيادة سمكها.' },
          { ar: 'المرونة (محدودة)', fr: 'Élasticité limitée', speech: 'تسترجع طولها الأصلي ما لم تتجاوز حد المرونة.' },
        ],
      },
      {
        id: 'mm2',
        titleAr: 'العضلات المتعارضة',
        titleFr: 'Muscles antagonistes',
        color: '#00E5FF',
        speech: 'العضلات المتعارضة تعمل بالتضاد: عندما تتقلص إحداهما ترتخي الأخرى.',
        children: [
          { ar: 'ثني: ثنائية متقلصة', fr: 'Flexion : Biceps +', speech: 'عند الثني تتقلص ثنائية الرأس وترتخي ثلاثية الرأس.' },
          { ar: 'بسط: ثلاثية متقلصة', fr: 'Extension : Triceps +', speech: 'عند البسط تتقلص ثلاثية الرأس وترتخي ثنائية الرأس.' },
        ],
      },
      {
        id: 'mm3',
        titleAr: 'متطلبات التقلص',
        titleFr: 'Besoins énergétiques',
        color: '#FF9F1C',
        speech: 'يحتاج التقلص العضلي إلى سيالة حركية عبر الصفيحة المحركة وإلى الطاقة.',
        children: [
          { ar: 'الصفيحة المحركة', fr: 'Plaque motrice', speech: 'تنقل السيالة الحركية عبر وسيط كيميائي.' },
          { ar: 'كليكوز + O₂ ← طاقة', fr: 'Énergie mécanique', speech: 'أكسدة الكليكوز توفر الطاقة اللازمة لتقلص الألياف.' },
        ],
      },
    ],
    dragGame: {
      titleAr: 'ميّز حالة العضلة المتقلصة عن العضلة المرتخية',
      titleFr: 'Muscle contracté vs Muscle relâché',
      zoneA: { titleAr: 'عضلة متقلصة (ثني: ثنائية الرأس)', titleFr: 'Muscle contracté', color: '#00FFA3' },
      zoneB: { titleAr: 'عضلة مرتخية (ثني: ثلاثية الرأس)', titleFr: 'Muscle relâché', color: '#00E5FF' },
      tokens: [
        { id: 'mt1', labelAr: 'قصر الطول', labelFr: 'Raccourcissement', zone: 'A', accent: '#00FFA3' },
        { id: 'mt2', labelAr: 'انتفاخ وزيادة السمك', labelFr: 'Gonflement', zone: 'A', accent: '#34D399' },
        { id: 'mt3', labelAr: 'صلابة البطن العضلي', labelFr: 'Durcissement', zone: 'A', accent: '#FF9F1C' },
        { id: 'mt4', labelAr: 'استطالة وتمدد', labelFr: 'Allongement', zone: 'B', accent: '#00E5FF' },
        { id: 'mt5', labelAr: 'نقصان السمك', labelFr: 'Amincissement', zone: 'B', accent: '#38BDF8' },
        { id: 'mt6', labelAr: 'ليونة الألياف', labelFr: 'Relâchement', zone: 'B', accent: '#94A3B8' },
      ],
    },
    hotspotChallenges: [
      {
        id: 'mh1',
        promptAr: 'اضغط على العضلة التي تتقلص عند ثني الساعد',
        promptFr: 'Clique sur le muscle contracté lors de la flexion',
        targetPinId: 'm1',
        hintSpeech: 'انظر للعضلة الأمامية المنتفخة في العضد.',
        successSpeech: 'برافو! العضلة ثنائية الرأس هي المسؤولة عن ثني الساعد.',
      },
      {
        id: 'mh2',
        promptAr: 'اضغط على منطقة التقاء العصب الحركي بالليف العضلي',
        promptFr: 'Clique sur la plaque motrice',
        targetPinId: 'm5',
        hintSpeech: 'توجد على اليسار المكبّر بلون بنفسجي متوهج!',
        successSpeech: 'ممتاز! الصفيحة المحركة تمرر السيالة العصبية لبدء التقلص.',
      },
    ],
    exam: {
      titleAr: 'المخطط العضلي: رعشة عضلية معزولة (سليمة مقابل متعبة)',
      titleFr: 'Myogramme : Secousse musculaire isolée',
      xLabel: 'الزمن · Temps (ms ×10)',
      yLabel: 'وسع التقلص (mm)',
      yMax: 40,
      yUnit: 'mm',
      series1: { nameAr: 'عضلة سليمة', nameFr: 'Muscle frais', color: '#00FFA3' },
      series2: { nameAr: 'عضلة متعبة', nameFr: 'Muscle fatigué', color: '#FF9F1C' },
      scenarios: [
        {
          id: 'twitch',
          labelAr: 'مقارنة الرعشتين',
          labelFr: 'Frais vs Fatigué',
          speech: 'لاحظ الفرق: العضلة المتعبة وسع تقلصها أضعف ومدة ارتخائها أطول!',
          points: [
            { x: 0, y1: 0, y2: 0, noteSpeech: 'لحظة الإهاجة (t = 0): بداية زمن الكمون.' },
            { x: 1, y1: 0, y2: 0, noteSpeech: 'زمن الكمون: وصول السيالة قبل بدء التقلص.' },
            { x: 3, y1: 36, y2: 18, noteSpeech: 'ذروة التقلص: 36 مم للسليمة مقابل 18 مم فقط للمتعبة!' },
            { x: 5, y1: 14, y2: 14, noteSpeech: 'مرحلة الارتخاء: العضلة السليمة ترتخي أسرع.' },
            { x: 7, y1: 0, y2: 8, noteSpeech: 'السليمة أنهت الرعشة، بينما المتعبة ما زالت في الارتخاء.' },
            { x: 10, y1: 0, y2: 0, noteSpeech: 'انتهاء ارتخاء العضلة المتعبة بعد زمن طويل.' },
          ],
        },
        {
          id: 'elastic',
          labelAr: 'تجاوز حد المرونة',
          labelFr: 'Limite dépassée',
          speech: 'عند تعليق كتلة ثقيلة جداً تتمدد العضلة ولا تعود لطولها الأصلي؛ مرونة العضلة محدودة!',
          points: [
            { x: 0, y1: 5, y2: 5, noteSpeech: 'كتلة خفيفة: تمدد بسيط.' },
            { x: 3, y1: 18, y2: 16, noteSpeech: 'تمدد متزايد مع الكتلة.' },
            { x: 6, y1: 35, y2: 34, noteSpeech: 'تجاوز حد المرونة! تمزق ألياف عضلية.' },
            { x: 10, y1: 14, y2: 14, noteSpeech: 'بعد إزالة الكتلة: لم تعد العضلة للصفر بسبب تلفها!' },
          ],
        },
      ],
      steps: [
        {
          id: 'ms1',
          stepNum: 1,
          verbAr: 'أصف',
          verbFr: 'Décrire',
          pointsLabel: '2 pts',
          promptAr: 'قارن وسع ومدة الرعشة العضلية بين العضلة السليمة والمتعبة:',
          choices: [
            {
              id: 'a',
              shortAr: 'وسع أقل (18 بدل 36 mm) ومدة ارتخاء أطول عند العضلة المتعبة',
              shortFr: 'Amplitude réduite & relâchement plus long',
              isCorrect: true,
              speech: 'وصف دقيق وشامل للمخطط العضلي!',
            },
            {
              id: 'b',
              shortAr: 'ضعف التقلص بسبب تراكم الفضلات ونقص الكليكوز',
              shortFr: 'À cause du manque de glucose',
              isCorrect: false,
              speech: 'هذا تفسير! المطلوب أولاً وصف المنحنى بالأرقام.',
            },
          ],
          keyFormulaAr: 'تتميز العضلة المتعبة بانخفاض الوسع (18 مقابل 36 mm) وطول مدة الارتخاء.',
        },
        {
          id: 'ms2',
          stepNum: 2,
          verbAr: 'أفسر',
          verbFr: 'Expliquer',
          pointsLabel: '2 pts',
          promptAr: 'ما سبب التعب العضلي الظاهر في المنحنى البرتقالي؟',
          choices: [
            {
              id: 'a',
              shortAr: 'نفاد الكليكوز والأوكسجين وتراكم الفضلات داخل الألياف العضلية',
              shortFr: 'Épuisement réserves & accumulation déchets',
              isCorrect: true,
              speech: 'ممتاز! نقص الطاقة وتراكم الفضلات يسبب التعب العضلي.',
            },
            {
              id: 'b',
              shortAr: 'زيادة طول الأوتار العظمية',
              shortFr: 'Allongement des tendons',
              isCorrect: false,
              speech: 'الأوتار لا تتعب؛ التعب يحدث داخل الألياف العضلية بسبب نقص الطاقة.',
            },
          ],
          keyFormulaAr: 'ينتج التعب العضلي عن استنزاف مخزون الكليكوز وتراكم الفضلات.',
        },
        {
          id: 'ms3',
          stepNum: 3,
          verbAr: 'أستنتج',
          verbFr: 'Déduire',
          pointsLabel: '2 pts',
          promptAr: 'كيف نقي الجهاز العضلي من التعب والتمزق؟',
          choices: [
            {
              id: 'a',
              shortAr: 'التسخين الجيد، تغذية متوازنة، وفترات راحة كافية',
              shortFr: 'Échauffement, nutrition & repos',
              isCorrect: true,
              speech: 'أحسنت يا بطل! استنتاج وقائي سليم 100%.',
            },
            {
              id: 'b',
              shortAr: 'حمل أثقال تفوق حد المرونة بدون تسخين',
              shortFr: 'Charges excessives sans échauffement',
              isCorrect: false,
              speech: 'هذا يسبب تمزقاً عضلياً خطيراً!',
            },
          ],
          keyFormulaAr: 'وقاية الجهاز العضلي تستوجب التسخين، الراحة، وتجنب المجهود المفرط.',
        },
      ],
    },
  },
];

export function getUnitById(id: UnitId): UnitConfig {
  return UNITS_DATA.find((u) => u.id === id) || UNITS_DATA[0];
}
