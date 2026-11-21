export type LessonId =
  | 'digestion'
  | 'respiration'
  | 'circulation'
  | 'nervous'
  | 'muscular'
  | 'immunity';

export type LessonTab = 'lab3d' | 'summary' | 'exercises' | 'exam';

export type MascotMood = 'explaining' | 'success' | 'hint';

export interface MascotMessage {
  mood: MascotMood;
  text: string;
  biofTerm?: string;
  subNote?: string;
}

export interface CurriculumChapter {
  id: LessonId;
  number: string;
  semester: 1 | 2;
  semesterLabel: string;
  semesterDomain: string;
  titleAr: string;
  titleFr: string;
  isAvailable: boolean;
  objectives: string[];
  keyBiofTerms: { ar: string; fr: string }[];
  teacherIntro: string;
}

export const CURRICULUM_CHAPTERS: CurriculumChapter[] = [
  {
    id: 'digestion',
    number: '01',
    semester: 1,
    semesterLabel: 'الدورة الأولى',
    semesterDomain: 'وظائف الاقتيات · Fonctions de nutrition',
    titleAr: 'التربية الغذائية والهضم والامتصاص',
    titleFr: 'Éducation nutritionnelle, digestion et absorption',
    isAvailable: true,
    objectives: [
      'التمييز بين الهضم الميكانيكي والهضم الكيميائي على طول الأنبوب الهضمي.',
      'تحديد دور الإنزيمات النوعية (الأميلاز، البيبسين، الليباز) في تبسيط الأغذية عند 37°C.',
      'فهم بنية الخملة المعوية ودورها في الامتصاص المعوي نحو الدم واللمف.',
    ],
    keyBiofTerms: [
      { ar: 'الهضم الكيميائي', fr: 'Digestion chimique' },
      { ar: 'إنزيم نوعي', fr: 'Enzyme spécifique' },
      { ar: 'القيت', fr: 'Nutriments' },
      { ar: 'الخملة المعوية', fr: 'Villosité intestinale' },
    ],
    teacherIntro:
      'مرحباً بك في الدرس الأول! حرك مؤشر اللقمة الغذائية أو اضغط على أي عضو ثلاثي الأبعاد لنكتشف معاً رحلة الهضم والامتصاص.',
  },
  {
    id: 'respiration',
    number: '02',
    semester: 1,
    semesterLabel: 'الدورة الأولى',
    semesterDomain: 'وظائف الاقتيات · Fonctions de nutrition',
    titleAr: 'التنفس عند الإنسان',
    titleFr: 'La respiration chez l’Homme',
    isAvailable: false,
    objectives: [
      'الكشف عن التبادلات الغازية التنفسية على مستوى الأسناخ الرئوية.',
      'تفسير آلية انتشار الغازات (O₂ و CO₂) وفق مبدأ فرق الضغط الجزئي.',
      'فهم التنفس الخلوي وإنتاج الطاقة انطلاقاً من الكليكوز وثنائي الأوكسجين.',
    ],
    keyBiofTerms: [
      { ar: 'السنخ الرئوي', fr: 'Alvéole pulmonaire' },
      { ar: 'الضغط الجزئي', fr: 'Pression partielle' },
      { ar: 'التنفس الخلوي', fr: 'Respiration cellulaire' },
    ],
    teacherIntro:
      'درس التنفس عند الإنسان قيد التحضير بمختبر 3D للأسناخ الرئوية! راجع مصطلحات Biof الأساسية واستعد له بعد إتقان درس الهضم.',
  },
  {
    id: 'circulation',
    number: '03',
    semester: 1,
    semesterLabel: 'الدورة الأولى',
    semesterDomain: 'وظائف الاقتيات · Fonctions de nutrition',
    titleAr: 'الدوران الدموي والإبراز البولي',
    titleFr: 'Circulation sanguine et excrétion urinaire',
    isAvailable: false,
    objectives: [
      'تحديد مكونات الدم ودور الخضاب الدموي في نقل الغازات التنفسية.',
      'وصف الدورة الدموية الصغرى والكبرى وآلية عمل القلب كمضخة مزدوجة.',
      'تفسير دور الأنبوب البولي في ترشيح البلازما وتكوين البول.',
    ],
    keyBiofTerms: [
      { ar: 'الخضاب الدموي', fr: 'Hémoglobine' },
      { ar: 'الأنبوب البولي', fr: 'Néphron / Tube urinifère' },
      { ar: 'الدورة القلبية', fr: 'Révolution cardiaque' },
    ],
    teacherIntro:
      'في هذا الدرس سنتتبع مسار القيت الذي امتصته الخملة المعوية عبر القلب والشرايين نحو الخلايا، مع نموذج 3D للقلب والكلية قريباً.',
  },
  {
    id: 'nervous',
    number: '04',
    semester: 2,
    semesterLabel: 'الدورة الثانية',
    semesterDomain: 'وظائف الربط والمناعة · Relation et immunologie',
    titleAr: 'الجهاز العصبي',
    titleFr: 'Le système nerveux',
    isAvailable: false,
    objectives: [
      'تحديد الباحات الحسية والحركية في المخ ومسار السيالة العصبية.',
      'التمييز بين الحساسية الشعورية، التحركية الإرادية، والانعكاس الشوكي.',
      'التعرف على بنية العصبون والسينابس وطرق وقاية الجهاز العصبي.',
    ],
    keyBiofTerms: [
      { ar: 'السيالة العصبية', fr: 'Influx nerveux' },
      { ar: 'قوس الانعكاس', fr: 'Arc réflexe' },
      { ar: 'العصبون', fr: 'Neurone' },
    ],
    teacherIntro:
      'الدورة الثانية تبدأ بالجهاز العصبي! سنبني فيه محاكاة تفاعلية لقوس الانعكاس الشوكي ومسار السيالة العصبية.',
  },
  {
    id: 'muscular',
    number: '05',
    semester: 2,
    semesterLabel: 'الدورة الثانية',
    semesterDomain: 'وظائف الربط والمناعة · Relation et immunologie',
    titleAr: 'الجهاز العضلي',
    titleFr: 'Le système musculaire',
    isAvailable: false,
    objectives: [
      'الكشف عن خاصيات العضلة الهيكلية: الاهتياجية، القلوصية، والمرونة.',
      'دراسة البنية المجهرية للعضلة والصفيحة المحركة.',
      'تحديد شروط التقلص العضلي وسبل الوقاية من الحوادث العضلية.',
    ],
    keyBiofTerms: [
      { ar: 'الاهتياجية', fr: 'Excitabilité' },
      { ar: 'القلوصية', fr: 'Contractilité' },
      { ar: 'الصفيحة المحركة', fr: 'Plaque motrice' },
    ],
    teacherIntro:
      'درس الجهاز العضلي يكمّل الجهاز العصبي؛ سنستعرض فيه قريباً محاكاة 3D للصفيحة المحركة والألياف العضلية.',
  },
  {
    id: 'immunity',
    number: '06',
    semester: 2,
    semesterLabel: 'الدورة الثانية',
    semesterDomain: 'وظائف الربط والمناعة · Relation et immunologie',
    titleAr: 'الجراثيم وعلم المناعة',
    titleFr: 'Les microbes et l’immunologie',
    isAvailable: false,
    objectives: [
      'تصنيف المتعضيات المجهرية وتفسير خطورة الجراثيم الممرضة.',
      'التمييز بين المناعة الطبيعية (البلعمة) والمناعة النوعية (الخلطية والخلوية).',
      'فهم مبدأ التلقيح والاستمصال وطرق تدعيم الاستجابة المناعية.',
    ],
    keyBiofTerms: [
      { ar: 'البلعمة', fr: 'Phagocytose' },
      { ar: 'مضادات الأجسام', fr: 'Anticorps' },
      { ar: 'الذاكرة المناعية', fr: 'Mémoire immunitaire' },
    ],
    teacherIntro:
      'علم المناعة من أهم دروس الامتحان الجهوي! سيضم قريباً مختبر 3D لعملية البلعمة وتصدي اللمفاويات للسمين.',
  },
];

export type OrganId = 'mouth' | 'esophagus' | 'stomach' | 'pancreas_liver' | 'intestine' | 'villus';

export interface OrganInfo {
  id: OrganId;
  nameAr: string;
  nameFr: string;
  progressRange: [number, number];
  ph: string;
  mechanicalAr: string;
  chemicalAr: string;
  enzymes: string[];
  substrate: string;
  product: string;
  teacherExplanation: string;
  accentColor: string;
}

export const DIGESTIVE_ORGANS: Record<OrganId, OrganInfo> = {
  mouth: {
    id: 'mouth',
    nameAr: 'الفم والغدد اللعابية',
    nameFr: 'Bouche & Glandes salivaires',
    progressRange: [0, 22],
    ph: 'pH ≈ 7.0 (محايد)',
    mechanicalAr: 'تقطيع وسحق الأغذية بالأسنان وخلطها باللعاب لتشكيل اللقمة الغذائية.',
    chemicalAr: 'تفكيك النشا (جزيئة ضخمة) جزئياً إلى مالتوز بفعل الأميلاز اللعابي.',
    enzymes: ['الأميلاز اللعابي (Amylase salivaire)'],
    substrate: 'النشا (Amidon)',
    product: 'مالتوز (Maltose)',
    teacherExplanation:
      'في الفم يبدأ الهضم! الأسنان تسحق الطعام ميكانيكياً، والأميلاز اللعابي يحوّل النشا إلى مالتوز عند 37°C.',
    accentColor: '#00E5FF',
  },
  esophagus: {
    id: 'esophagus',
    nameAr: 'المرئ',
    nameFr: 'Œsophage',
    progressRange: [23, 34],
    ph: 'pH ≈ 7.0',
    mechanicalAr: 'تقلصات عضلية متموجة (الحركة الدودية) تدفع اللقمة الغذائية نحو المعدة.',
    chemicalAr: 'لا يفرز عصارات هاضمة؛ يستمر نشاط الأميلاز مؤقتاً أثناء العبور.',
    enzymes: ['عبور فقط (Péristaltisme)'],
    substrate: 'اللقمة الغذائية (Bol alimentaire)',
    product: 'وصول اللقمة للمعدة',
    teacherExplanation:
      'المرئ أنبوب عضلي ذكي! يدفع اللقمة الغذائية نحو المعدة بفضل تقلصات دودية منتظمة بدون إفراز إنزيمات.',
    accentColor: '#38BDF8',
  },
  stomach: {
    id: 'stomach',
    nameAr: 'المعدة',
    nameFr: 'Estomac',
    progressRange: [35, 58],
    ph: 'pH ≈ 2.0 (حمضي HCl)',
    mechanicalAr: 'تقلصات جدار المعدة العضلي تمزج الطعام بالعصارة المعدية لتكوين الكيموس.',
    chemicalAr: 'تحويل البروتيدات إلى عديدات البيبتيد بواسطة إنزيم البيبسين في وسط حمضي.',
    enzymes: ['البيبسين (Pepsine) + HCl'],
    substrate: 'البروتيدات (Protides)',
    product: 'عديد البيبتيد (Polypeptides)',
    teacherExplanation:
      'انتبه للامتحان! وسط المعدة حمضي جداً (HCl)، وهو شرط ضروري لكي يفكك البيبسين البروتيدات إلى عديد البيبتيد.',
    accentColor: '#FF9F1C',
  },
  pancreas_liver: {
    id: 'pancreas_liver',
    nameAr: 'الكبد والبنكرياس (غدد ملحقة)',
    nameFr: 'Foie & Pancréas (Glandes annexes)',
    progressRange: [59, 68],
    ph: 'pH ≈ 8.0 (قاعدي)',
    mechanicalAr: 'الصفراء (من الكبد) تستحلب الدهنيات إلى قطيرات دقيقة دون أن تكون إنزيماً.',
    chemicalAr: 'البنكرياس يفرز عصارة غنية بالليباز والبروتياز والأميلاز داخل الاثني عشر.',
    enzymes: ['الصفراء (Bile - مستحلب)', 'ليباز بنكرياسي (Lipase)', 'تريبسين (Trypsine)'],
    substrate: 'الدهنيات وعديدات البيبتيد',
    product: 'قطيرات دهنية قابلة للهضم',
    teacherExplanation:
      'فخ شائع في الجهوي: الصفراء التي يفرزها الكبد لا تحتوي على إنزيمات! دورها فقط استحلاب الدهنيات لتسهيل عمل الليباز.',
    accentColor: '#F59E0B',
  },
  intestine: {
    id: 'intestine',
    nameAr: 'المعي الدقيق',
    nameFr: 'Intestin grêle',
    progressRange: [69, 84],
    ph: 'pH ≈ 7.8 (قاعدي خفيف)',
    mechanicalAr: 'حركات تموجية تخلط الكيموس بالعصارة المعوية والبنكرياسية والصفراء.',
    chemicalAr: 'اكتمال الهضم الكيميائي والحصول على القيت (جزيئات صغيرة قابلة للامتصاص).',
    enzymes: ['المالتاز (Maltase)', 'البيبتيداز (Peptidase)', 'الليباز (Lipase)'],
    substrate: 'مالتوز · عديد البيبتيد · دهنيات',
    product: 'كليكوز · أحماض أمينية · أحماض دهنية وغليسيرول',
    teacherExplanation:
      'هنا المحطة النهائية للهضم! تتحول كل الجزيئات المعقدة إلى مواد قيت بسيطة: كليكوز، أحماض أمينية، وأحماض دهنية.',
    accentColor: '#00FFA3',
  },
  villus: {
    id: 'villus',
    nameAr: 'الخملة المعوية (الامتصاص)',
    nameFr: 'Villosité intestinale (Absorption)',
    progressRange: [85, 100],
    ph: 'مساحة تبادل ≈ 300 m²',
    mechanicalAr: 'ثنيات كثيفة وجدار رقيق جداً (طبقة واحدة من الخلايا) لتسريع العبور.',
    chemicalAr: 'مرور الكليكوز والأحماض الأمينية والماء والأملاح إلى الدم، والدهون إلى اللمف.',
    enzymes: ['امتصاص معوي (Absorption intestinale)'],
    substrate: 'مواد القيت في المعي الدقيق',
    product: 'عبور إلى الشعيرات الدموية واللمفاوية',
    teacherExplanation:
      'انظر للخملة المعوية بـ 3D! جدارها الرقيق وشبكتها الدموية الكثيفة يسمحان بمرور الكليكوز والأحماض الأمينية للدم، والأحماض الدهنية للمف.',
    accentColor: '#00FFA3',
  },
};

export interface GlossaryItem {
  id: string;
  ar: string;
  fr: string;
  category: 'هضم' | 'إنزيمات' | 'امتصاص';
  definition: string;
  examTip: string;
}

export const BIOF_GLOSSARY: GlossaryItem[] = [
  {
    id: 'g1',
    ar: 'الهضم الميكانيكي',
    fr: 'Digestion mécanique',
    category: 'هضم',
    definition: 'تجزئة وتفتيت الأغذية فيزيائياً (المضغ، تقلصات المعدة والأمعاء) دون تغيير طبيعتها الكيميائية.',
    examTip: 'يسهّل عمل الإنزيمات برفع مساحة التماس مع الغذاء.',
  },
  {
    id: 'g2',
    ar: 'الهضم الكيميائي',
    fr: 'Digestion chimique',
    category: 'هضم',
    definition: 'تبسيط جزيئي للأغذية المركبة إلى مواد قيت صغيرة بفضل الإنزيمات الهاضمة والماء عند 37°C.',
    examTip: 'يُسمى أيضاً التبسيط الجزيئي (Simplification moléculaire).',
  },
  {
    id: 'g3',
    ar: 'الإنزيم الهضمي',
    fr: 'Enzyme digestive',
    category: 'إنزيمات',
    definition: 'مادة بروتينية تحفز تفكيك غذاء معين بسرعة عند 37°C، وتتميز بالنوعية (لكل غذاء إنزيمه).',
    examTip: 'الإنزيم يتلف بالحرارة المرتفعة (100°C) ويتوقف نشاطه مؤقتاً في البرودة (0°C).',
  },
  {
    id: 'g4',
    ar: 'مواد القيت',
    fr: 'Nutriments',
    category: 'امتصاص',
    definition: 'جزيئات صغيرة ناتجة عن الهضم (كليكوز، أحماض أمينية، أحماض دهنية، غليسيرول) بالإضافة للماء والأملاح والفيتامينات.',
    examTip: 'الماء والأملاح المعدنية والفيتامينات لا تخضع للهضم لأنها أصلاً جزيئات صغيرة.',
  },
  {
    id: 'g5',
    ar: 'الامتصاص المعوي',
    fr: 'Absorption intestinale',
    category: 'امتصاص',
    definition: 'مرور مواد القيت من تجويف المعي الدقيق إلى الوسط الداخلي (الدم واللمف) عبر الخملات المعوية.',
    examTip: 'علّل فعالية الامتصاص دائماً بـ 3 شروط: مساحة شاسعة، جدار رقيق، وعروق دموية كثيفة.',
  },
  {
    id: 'g6',
    ar: 'الخملة المعوية',
    fr: 'Villosité intestinale',
    category: 'امتصاص',
    definition: 'بنية مجهرية تشبه الإصبع تكسو الجدار الداخلي للمعي الدقيق وتُعد الوحدة الوظيفية للامتصاص.',
    examTip: 'تضم شبكة شعيرات دموية (للكليكوز والأحماض الأمينية) ووعاءً لمفاوياً مركزياً (للأحماض الدهنية).',
  },
  {
    id: 'g7',
    ar: 'النشا ← مالتوز ← كليكوز',
    fr: 'Amidon → Maltose → Glucose',
    category: 'إنزيمات',
    definition: 'مسار هضم السكريات المعقدة: الأميلاز يحول النشا إلى مالتوز، ثم المالتاز يحوله إلى كليكوز.',
    examTip: 'يُكشف عن النشا بماء اليود (أزرق بنفسجي) وعن السكريات المختزلة بمحلول فهلينغ + تسخين (راسب أحمر آجوري).',
  },
  {
    id: 'g8',
    ar: 'استحلاب الدهنيات',
    fr: 'Émulsion des lipides',
    category: 'هضم',
    definition: 'تجزئة الدهنيات إلى قطيرات مجهرية بفعل الصفراء المفرزة من الكبد لتمكين الليباز من هضمها.',
    examTip: 'تذكر: الصفراء ليست إنزيماً، بل مادة مساعدة فيزيائية.',
  },
];

export interface DigestionReaction {
  id: string;
  organAr: string;
  organFr: string;
  substrateAr: string;
  substrateFr: string;
  enzymeAr: string;
  enzymeFr: string;
  condition: string;
  productAr: string;
  productFr: string;
  accent: 'cyan' | 'amber' | 'emerald';
  teacherNote: string;
}

export const CHEMICAL_REACTIONS: DigestionReaction[] = [
  {
    id: 'r1',
    organAr: 'الفم',
    organFr: 'Bouche',
    substrateAr: 'النشا + ماء',
    substrateFr: 'Amidon + H₂O',
    enzymeAr: 'الأميلاز اللعابي',
    enzymeFr: 'Amylase salivaire',
    condition: '37°C · pH 7',
    productAr: 'مالتوز (سكر الشعير)',
    productFr: 'Maltose',
    accent: 'cyan',
    teacherNote: 'الأميلاز اللعابي يبدأ تفكيك النشا في الفم فقط إلى مالتوز، وليس مباشرة إلى كليكوز!',
  },
  {
    id: 'r2',
    organAr: 'المعدة',
    organFr: 'Estomac',
    substrateAr: 'البروتيدات + ماء',
    substrateFr: 'Protides + H₂O',
    enzymeAr: 'البيبسين (بروتياز 1)',
    enzymeFr: 'Pepsine',
    condition: '37°C · HCl (حمضي)',
    productAr: 'عديدات البيبتيد',
    productFr: 'Polypeptides',
    accent: 'amber',
    teacherNote: 'البيبسين لا يعمل إلا في الوسط الحمضي للمعدة (HCl) ويحوّل البروتيدات الضخمة إلى عديد البيبتيد.',
  },
  {
    id: 'r3',
    organAr: 'المعي الدقيق',
    organFr: 'Intestin grêle',
    substrateAr: 'المالتوز + ماء',
    substrateFr: 'Maltose + H₂O',
    enzymeAr: 'المالتاز',
    enzymeFr: 'Maltase',
    condition: '37°C · pH 7.8',
    productAr: 'كليكوز (قيت)',
    productFr: 'Glucose',
    accent: 'emerald',
    teacherNote: 'الكليكوز جزيئة صغيرة جداً تعبر جدار الخملة المعوية مباشرة نحو الشعيرات الدموية.',
  },
  {
    id: 'r4',
    organAr: 'المعي الدقيق',
    organFr: 'Intestin grêle',
    substrateAr: 'عديد البيبتيد + ماء',
    substrateFr: 'Polypeptides + H₂O',
    enzymeAr: 'البيبتيداز',
    enzymeFr: 'Peptidase',
    condition: '37°C · pH 7.8',
    productAr: 'أحماض أمينية (قيت)',
    productFr: 'Acides aminés',
    accent: 'emerald',
    teacherNote: 'الأحماض الأمينية هي الناتج النهائي لهضم البروتيدات، وتمر عبر الطريق الدموي في الخملة.',
  },
  {
    id: 'r5',
    organAr: 'المعي الدقيق',
    organFr: 'Intestin grêle',
    substrateAr: 'الدهنيات (مستحلبة) + ماء',
    substrateFr: 'Lipides émulsionnés + H₂O',
    enzymeAr: 'الليباز (مع الصفراء)',
    enzymeFr: 'Lipase + Bile',
    condition: '37°C · pH 8',
    productAr: 'أحماض دهنية + غليسيرول',
    productFr: 'Acides gras + Glycérol',
    accent: 'amber',
    teacherNote: 'لا تنسَ: الأحماض الدهنية والغليسيرول تسلك الطريق اللمفاوي (Chylifère) وليس الدموي مباشرة!',
  },
];

// Exercises Data
export interface TrueFalseQuestion {
  id: string;
  statement: string;
  statementFr: string;
  isTrue: boolean;
  explanation: string;
  hint: string;
}

export const TRUE_FALSE_QUESTIONS: TrueFalseQuestion[] = [
  {
    id: 'tf1',
    statement: 'تفرز الصفراء من طرف الكبد وتحتوي على إنزيم الليباز لهضم الدهنيات.',
    statementFr: 'La bile sécrétée par le foie contient l’enzyme lipase.',
    isTrue: false,
    explanation: 'خطأ! الصفراء لا تحتوي على أي إنزيمات؛ دورها فقط استحلاب الدهنيات بينما يُفرز الليباز من البنكرياس والمعي الدقيق.',
    hint: 'تذكّر فخ الامتحان الشهير حول دور الكبد والصفراء: هل هي إنزيم أم مستحلب فيزيائي؟',
  },
  {
    id: 'tf2',
    statement: 'يمر الكليكوز والأحماض الأمينية عبر الشعيرات الدموية للخملة المعوية.',
    statementFr: 'Le glucose et les acides aminés passent dans les capillaires sanguins.',
    isTrue: true,
    explanation: 'صحيح! الطريق الدموي ينقل الكليكوز والأحماض الأمينية والماء والأملاح المعدنية والفيتامينات الذائبة في الماء.',
    hint: 'فكّر في الطريقين الموجودين داخل الخملة المعوية: الطريق الدموي والطريق اللمفاوي.',
  },
  {
    id: 'tf3',
    statement: 'يتحول النشا مباشرة إلى كليكوز داخل الفم تحت تأثير الأميلاز اللعابي.',
    statementFr: 'L’amidon se transforme directement en glucose dans la bouche.',
    isTrue: false,
    explanation: 'خطأ! في الفم يحول الأميلاز اللعابي النشا إلى مالتوز فقط، ثم يُكمل المالتاز تحويله إلى كليكوز في المعي الدقيق.',
    hint: 'ما هو السكر الوسيط (سكر الشعير) الذي يظهر في الفم قبل الوصول إلى المعي الدقيق؟',
  },
  {
    id: 'tf4',
    statement: 'يتوقف نشاط الإنزيم الهضمي نهائياً (يتلف) عند درجة حرارة 100°C.',
    statementFr: 'L’enzyme digestive est détruite de façon irréversible à 100°C.',
    isTrue: true,
    explanation: 'صحيح! الإنزيم مادة بروتينية تتلف نهائياً بالحرارة المرتفعة، بخلاف البرودة (0°C) التي توقف نشاطه مؤقتاً فقط.',
    hint: 'قارن بين أثر التبريد (0°C) وأثر الغليان (100°C) على البروتينات والإنزيمات.',
  },
];

export interface MatchPair {
  id: string;
  enzymeAr: string;
  enzymeFr: string;
  targetAr: string;
  targetFr: string;
}

export const ENZYME_MATCH_PAIRS: MatchPair[] = [
  {
    id: 'm1',
    enzymeAr: 'الأميلاز اللعابي',
    enzymeFr: 'Amylase salivaire',
    targetAr: 'النشا ← مالتوز',
    targetFr: 'Amidon → Maltose',
  },
  {
    id: 'm2',
    enzymeAr: 'البيبسين (المعدة)',
    enzymeFr: 'Pepsine',
    targetAr: 'البروتيدات ← عديد البيبتيد',
    targetFr: 'Protides → Polypeptides',
  },
  {
    id: 'm3',
    enzymeAr: 'الليباز البنكرياسي',
    enzymeFr: 'Lipase',
    targetAr: 'الدهنيات ← أحماض دهنية + غليسيرول',
    targetFr: 'Lipides → Acides gras + Glycérol',
  },
  {
    id: 'm4',
    enzymeAr: 'المالتاز المعوي',
    enzymeFr: 'Maltase',
    targetAr: 'المالتوز ← كليكوز',
    targetFr: 'Maltose → Glucose',
  },
];

export interface FillBlankItem {
  id: string;
  before: string;
  after: string;
  correct: string;
  options: string[];
  hint: string;
  equationFr: string;
}

export const FILL_BLANK_QUESTIONS: FillBlankItem[] = [
  {
    id: 'fb1',
    before: 'النشا + ماء  ← (عند 37°C بوجود ',
    after: ') ←  مالتوز',
    correct: 'الأميلاز اللعابي',
    options: ['الأميلاز اللعابي', 'البيبسين', 'الليباز'],
    hint: 'أي إنزيم يوجد في اللعاب ويؤثر نوعياً على النشا؟',
    equationFr: 'Amidon + H₂O → Maltose (37°C)',
  },
  {
    id: 'fb2',
    before: 'البروتيدات + ماء  ← (في وسط حمضي HCl بوجود البيبسين) ←  ',
    after: '',
    correct: 'عديد البيبتيد',
    options: ['أحماض دهنية', 'عديد البيبتيد', 'مالتوز'],
    hint: 'هضم البروتيدات في المعدة جزئي فقط، فماذا ينتج عنه قبل الأحماض الأمينية؟',
    equationFr: 'Protides + H₂O (Pepsine + HCl) → Polypeptides',
  },
  {
    id: 'fb3',
    before: 'تُمتص الأحماض الدهنية والغليسيرول على مستوى الخملة المعوية عبر ',
    after: '',
    correct: 'الوعاء اللمفاوي',
    options: ['الشعيرات الدموية', 'الوعاء اللمفاوي', 'المرئ'],
    hint: 'الدهون المهضومة تسلك الطريق المركزي داخل الخملة المعوية (Chylifère).',
    equationFr: 'Acides gras + Glycérol → Voie lymphatique',
  },
];

// Regional Exam Simulation Data
export type ExamTempMode = '37' | '0' | '100';

export interface ExamDataPoint {
  timeMin: number;
  starch: number;
  maltose: number;
}

export const EXAM_CURVES: Record<ExamTempMode, ExamDataPoint[]> = {
  '37': [
    { timeMin: 0, starch: 1.0, maltose: 0.0 },
    { timeMin: 2, starch: 0.72, maltose: 0.28 },
    { timeMin: 4, starch: 0.44, maltose: 0.56 },
    { timeMin: 6, starch: 0.2, maltose: 0.8 },
    { timeMin: 8, starch: 0.06, maltose: 0.94 },
    { timeMin: 10, starch: 0.0, maltose: 1.0 },
  ],
  '0': [
    { timeMin: 0, starch: 1.0, maltose: 0.0 },
    { timeMin: 2, starch: 1.0, maltose: 0.0 },
    { timeMin: 4, starch: 1.0, maltose: 0.0 },
    { timeMin: 6, starch: 0.99, maltose: 0.01 },
    { timeMin: 8, starch: 0.99, maltose: 0.01 },
    { timeMin: 10, starch: 0.98, maltose: 0.02 },
  ],
  '100': [
    { timeMin: 0, starch: 1.0, maltose: 0.0 },
    { timeMin: 2, starch: 1.0, maltose: 0.0 },
    { timeMin: 4, starch: 1.0, maltose: 0.0 },
    { timeMin: 6, starch: 1.0, maltose: 0.0 },
    { timeMin: 8, starch: 1.0, maltose: 0.0 },
    { timeMin: 10, starch: 1.0, maltose: 0.0 },
  ],
};

export interface ExamStep {
  id: string;
  stepNum: number;
  verbAr: string;
  verbFr: string;
  points: string;
  prompt: string;
  choices: {
    id: string;
    label: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  modelAnswer: string;
  teacherExamTip: string;
}

export const REGIONAL_EXAM_STEPS: ExamStep[] = [
  {
    id: 'step1',
    stepNum: 1,
    verbAr: 'أصف المبيان',
    verbFr: 'Décrire l’évolution des courbes',
    points: '2 نقط',
    prompt:
      'اعتماداً على المبيان عند 37°C، صف تطور كل من تركيز النشا (Amidon) وتركيز المالتوز (Maltose) بدلالة الزمن من t = 0 إلى t = 10 min.',
    choices: [
      {
        id: 'c1a',
        label: 'انخفض تركيز النشا تدريجياً من 1 g/L عند t=0 min ليختفي تماماً (0 g/L) عند t=10 min، وفي المقابل ارتفع تركيز المالتوز من 0 g/L إلى 1 g/L.',
        isCorrect: true,
        feedback: 'ممتاز! وصفك علمي دقيق: استعملت أفعال التطور (انخفض / ارتفع) مع ذكر القيم العددية والوحدات والزمن.',
      },
      {
        id: 'c1b',
        label: 'تحوّل النشا إلى مالتوز لأن إنزيم الأميلاز اللعابي قام بتفكيكه في درجة حرارة 37°C.',
        isCorrect: false,
        feedback: 'انتبه لفخ المنهجية! لقد قدّمت تفسيراً (لأن...) بينما السؤال طلب الوصف فقط (ماذا نلاحظ في المنحنى بالأرقام).',
      },
      {
        id: 'c1c',
        label: 'بقي تركيز النشا والمالتوز ثابتين طيلة مدة التجربة عند 37°C.',
        isCorrect: false,
        feedback: 'لاحظ المبيان جيداً عند 37°C: المنحنى السماوي للنشا يهبط نحو الصفر، بينما المنحنى الأخضر للمالتوز يصعد!',
      },
    ],
    modelAnswer:
      'عند درجة حرارة 37°C، نلاحظ انخفاضاً تدريجياً في تركيز النشا من 1 g/L عند الدقيقة 0 إلى أن ينعدم (0 g/L) عند الدقيقة 10، وبالموازاة مع ذلك يرتفع تركيز المالتوز من 0 g/L ليبلغ 1 g/L عند الدقيقة 10.',
    teacherExamTip:
      'سر النقطة الكاملة في سؤال "صف": لا تكتب أبداً كلمة "لأن"! فقط اقرأ المنحنى بالأرقام، الوحدات (g/L و min)، وأفعال التطور (يرتفع / ينخفض / يستقر).',
  },
  {
    id: 'step2',
    stepNum: 2,
    verbAr: 'أفسر النتيجة',
    verbFr: 'Expliquer les résultats',
    points: '2 نقط',
    prompt: 'فسّر اختفاء النشا وظهور المالتوز عند 37°C، وبقاء النشا ثابتاً عند 100°C.',
    choices: [
      {
        id: 'c2a',
        label: 'اختفى النشا وظهر المالتوز عند 37°C لأن إنزيم الأميلاز اللعابي حفّز تفكيك (حلمأة) النشا إلى مالتوز في حرارته المثلى، بينما عند 100°C أتلف الإنزيم بالحرارة المرتفعة فتوقف التفاعل.',
        isCorrect: true,
        feedback: 'تفسير مثالي يستحق العلامة الكاملة! ربطت النتيجة بالسبب العلمي (الأميلاز اللعابي + 37°C + إتلاف البروتين عند 100°C).',
      },
      {
        id: 'c2b',
        label: 'عند 37°C ينخفض النشا من 1 إلى 0 g/L وعند 100°C يبقى في 1 g/L.',
        isCorrect: false,
        feedback: 'هذا مجرد وصف مكرر! في سؤال "فسّر" يجب أن تجيب على سؤال "لماذا حدث ذلك؟" بذكر دور الإنزيم ودرجة الحرارة.',
      },
      {
        id: 'c2c',
        label: 'تبخّر النشا بسبب الحرارة 37°C وتحوّل الماء إلى مالتوز.',
        isCorrect: false,
        feedback: 'النشا لا يتبخر! فكّر في المادة البيولوجية الموجودة في اللعاب والتي تفكك النشا كيميائياً.',
      },
    ],
    modelAnswer:
      'يُفسَّر اختفاء النشا وظهور المالتوز عند 37°C بحدوث هضم كيميائي (تبسيط جزيئي) للنشا إلى مالتوز بفعل إنزيم الأميلاز اللعابي في درجة حرارة الجسم المثلى (37°C). أما عند 100°C فقد تم إتلاف الإنزيم نهائياً بالحرارة المرتفعة فلم يتم هضم النشا.',
    teacherExamTip:
      'في سؤال "فسّر" استعمل دائماً رابط السببية ("بفعل..." أو "لأن...") واذكر اسم الإنزيم والظروف التجريبية (37°C).',
  },
  {
    id: 'step3',
    stepNum: 3,
    verbAr: 'أستنتج',
    verbFr: 'Déduire la conclusion',
    points: '2 نقط',
    prompt: 'ماذا تستنتج من هذه التجربة بخصوص شروط عمل الإنزيمات الهاضمة؟',
    choices: [
      {
        id: 'c3a',
        label: 'نستنتج أن الهضم الكيميائي للنشا بواسطة الأميلاز اللعابي ظاهرة إنزيمية تتطلب درجة حرارة مثلى تقارب 37°C (حرارة الجسم).',
        isCorrect: true,
        feedback: 'أحسنت يا بطل! استنتاج مركّز، شامل، ويطابق تماماً سلم التنقيط في الامتحان الجهوي المغربي.',
      },
      {
        id: 'c3b',
        label: 'نستنتج أن المعدة هي التي تهضم النشا في جسم الإنسان.',
        isCorrect: false,
        feedback: 'تأكد من معطيات التجربة! التجربة استعملت الأميلاز اللعابي وليس العصارة المعدية.',
      },
      {
        id: 'c3c',
        label: 'نستنتج أن الإنزيمات تعمل بشكل أسرع كلما ارتفعت الحرارة حتى 100°C.',
        isCorrect: false,
        feedback: 'جرّب الضغط على زر 100°C في المبيان أعلاه لترى ماذا يحدث للإنزيم عند الغليان!',
      },
    ],
    modelAnswer:
      'نستنتج أن الإنزيمات الهاضمة (كالأميلاز اللعابي) مواد بيولوجية تحفز التبسيط الجزيئي للأغذية، ويشترط لفعاليتها توفر درجة حرارة مثلى هي 37°C.',
    teacherExamTip:
      'الاستنتاج يجب أن يكون قاعدة علمية عامة في سطرين فقط، خالياً من الأرقام التجريبية ومباشراً في الفكرة.',
  },
];
