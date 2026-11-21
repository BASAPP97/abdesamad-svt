import type { MascotSignal } from './unitsData';

export type StationId = 'reagents' | 'roles' | 'carences' | 'ration' | 'hygiene';

export type SampleId = 'pain' | 'filtrat_pain' | 'lait' | 'filtrat_lait';

export type ReagentId =
  | 'chauffage'
  | 'nitrate_argent'
  | 'oxalate_ammonium'
  | 'fehling'
  | 'eau_iodee'
  | 'acide_nitrique'
  | 'papier';

export interface FoodSample {
  id: SampleId;
  ar: string;
  fr: string;
  liquidColor: string;
  isFiltrate: boolean;
}

export interface ReagentDef {
  id: ReagentId;
  nameAr: string;
  nameFr: string;
  nutrientAr: string;
  nutrientFr: string;
  positiveResultAr: string;
  positiveResultFr: string;
  reagentDropColor: string;
  reactionColor: string;
  needsHeat: boolean;
  needsLight?: boolean;
  isPaperTest?: boolean;
  applicableSamples: SampleId[];
  positiveSamples: SampleId[];
  positiveSpeech: string;
  negativeSpeech: string;
  wrongSampleSpeech?: string;
}

export const FOOD_SAMPLES: FoodSample[] = [
  { id: 'pain', ar: 'الخبز', fr: 'Pain', liquidColor: '#D6B27C', isFiltrate: false },
  { id: 'filtrat_pain', ar: 'رشاحة الخبز', fr: 'Filtrat de pain', liquidColor: '#E2E8F0', isFiltrate: true },
  { id: 'lait', ar: 'الحليب', fr: 'Lait', liquidColor: '#F8FAFC', isFiltrate: false },
  { id: 'filtrat_lait', ar: 'رشاحة الحليب', fr: 'Filtrat de lait', liquidColor: '#E0F2FE', isFiltrate: true },
];

export const REAGENTS_DATA: ReagentDef[] = [
  {
    id: 'chauffage',
    nameAr: 'التسخين',
    nameFr: 'Chauffage',
    nutrientAr: 'الماء',
    nutrientFr: 'Eau (H₂O)',
    positiveResultAr: 'بخار وقطرات ماء',
    positiveResultFr: 'Vapeur & gouttelettes d’eau',
    reagentDropColor: '#FF9F1C',
    reactionColor: '#38BDF8',
    needsHeat: true,
    applicableSamples: ['pain', 'filtrat_pain', 'lait', 'filtrat_lait'],
    positiveSamples: ['pain', 'filtrat_pain', 'lait', 'filtrat_lait'],
    positiveSpeech: 'تتصاعد قطرات وبخار الماء على جدار الأنبوب، مما يثبت وجود الماء!',
    negativeSpeech: 'لا توجد قطرات ماء.',
  },
  {
    id: 'nitrate_argent',
    nameAr: 'نترات الفضة',
    nameFr: 'Nitrate d’argent',
    nutrientAr: 'أملاح الكلورورات',
    nutrientFr: 'Sels de chlorures',
    positiveResultAr: 'راسب أبيض يسودّ بالضوء',
    positiveResultFr: 'Précipité blanc noircissant à la lumière',
    reagentDropColor: '#CBD5E1',
    reactionColor: '#475569',
    needsHeat: false,
    needsLight: true,
    applicableSamples: ['filtrat_pain', 'filtrat_lait'],
    positiveSamples: ['filtrat_pain', 'filtrat_lait'],
    positiveSpeech: 'تشكّل راسب أبيض يسودّ تحت الضوء! هذا يكشف عن وجود أملاح الكلورورات.',
    negativeSpeech: 'لم يتكون راسب أبيض.',
    wrongSampleSpeech: 'اختر رشاحة الخبز أو رشاحة الحليب أولاً للكشف عن أملاح الكلورورات بنترات الفضة!',
  },
  {
    id: 'oxalate_ammonium',
    nameAr: 'أكسلات الأمونيوم',
    nameFr: 'Oxalate d’ammonium',
    nutrientAr: 'أملاح الكالسيوم',
    nutrientFr: 'Sels de calcium',
    positiveResultAr: 'راسب أبيض',
    positiveResultFr: 'Précipité blanc',
    reagentDropColor: '#E2E8F0',
    reactionColor: '#F8FAFC',
    needsHeat: false,
    applicableSamples: ['filtrat_pain', 'filtrat_lait'],
    positiveSamples: ['filtrat_pain', 'filtrat_lait'],
    positiveSpeech: 'ظهر راسب أبيض ناصع! إذن الرشاحة تحتوي على أملاح الكالسيوم.',
    negativeSpeech: 'لم يظهر راسب أبيض.',
    wrongSampleSpeech: 'للكشف عن أملاح الكالسيوم، اختر أولاً رشاحة الخبز أو رشاحة الحليب!',
  },
  {
    id: 'fehling',
    nameAr: 'محلول فهلينغ + تسخين',
    nameFr: 'Liqueur de Fehling + Chauffage',
    nutrientAr: 'الكليكوز (سكر بسيط)',
    nutrientFr: 'Glucose (Sucre réducteur)',
    positiveResultAr: 'راسب أحمر آجوري',
    positiveResultFr: 'Précipité rouge brique',
    reagentDropColor: '#2563EB',
    reactionColor: '#DC2626',
    needsHeat: true,
    applicableSamples: ['filtrat_pain', 'filtrat_lait'],
    positiveSamples: ['filtrat_pain', 'filtrat_lait'],
    positiveSpeech: 'بعد التسخين مع محلول فهلينغ ظهر راسب أحمر آجوري! هذا دليل وجود سكر مختزل كالكليكوز.',
    negativeSpeech: 'بقي المحلول أزرق دون راسب أحمر.',
    wrongSampleSpeech: 'استعمل رشاحة الخبز أو رشاحة الحليب مع محلول فهلينغ والتسخين!',
  },
  {
    id: 'eau_iodee',
    nameAr: 'الماء اليودي',
    nameFr: 'Eau iodée',
    nutrientAr: 'النشا',
    nutrientFr: 'Amidon',
    positiveResultAr: 'تلون أزرق بنفسجي',
    positiveResultFr: 'Coloration bleu-violet',
    reagentDropColor: '#B45309',
    reactionColor: '#4338CA',
    needsHeat: false,
    applicableSamples: ['pain', 'lait'],
    positiveSamples: ['pain'],
    positiveSpeech: 'تحوّل اللون إلى أزرق بنفسجي داكن! هذا يثبت أن الخبز غني بالنشا.',
    negativeSpeech: 'بقي اللون بنيّاً مصفرّاً! الحليب لا يحتوي على النشا (اختبار سلبي).',
    wrongSampleSpeech: 'جرّب الماء اليودي مباشرة على الخبز أو الحليب!',
  },
  {
    id: 'acide_nitrique',
    nameAr: 'حمض النتريك',
    nameFr: 'Acide nitrique',
    nutrientAr: 'البروتيدات',
    nutrientFr: 'Protides',
    positiveResultAr: 'تلون أصفر',
    positiveResultFr: 'Coloration jaune',
    reagentDropColor: '#FDE047',
    reactionColor: '#EAB308',
    needsHeat: false,
    applicableSamples: ['pain', 'lait'],
    positiveSamples: ['pain', 'lait'],
    positiveSpeech: 'ظهر تلون أصفر واضح! هذا يكشف عن وجود البروتيدات في هذا الغذاء.',
    negativeSpeech: 'لم يظهر تلون أصفر.',
    wrongSampleSpeech: 'اختبر حمض النتريك مباشرة على عينة الخبز أو الحليب!',
  },
  {
    id: 'papier',
    nameAr: 'حك على ورقة بيضاء',
    nameFr: 'Frottement sur papier',
    nutrientAr: 'الدهنيات',
    nutrientFr: 'Lipides',
    positiveResultAr: 'بقعة شفافة لا تزول بالتسخين',
    positiveResultFr: 'Tache translucide persistante',
    reagentDropColor: '#FBBF24',
    reactionColor: '#F59E0B',
    needsHeat: true,
    isPaperTest: true,
    applicableSamples: ['pain', 'lait'],
    positiveSamples: ['lait'],
    positiveSpeech: 'تشكّلت بقعة شفافة لا تزول حتى بالتسخين! هذا يثبت وجود الدهنيات في الحليب.',
    negativeSpeech: 'لا توجد بقعة دهنية واضحة على الورقة في الخبز، جرّب الحليب!',
    wrongSampleSpeech: 'استعمل الحليب أو الخبز مباشرة لاختبار الورقة البيضاء!',
  },
];

// =========================================================================
// STATION 2: FOOD CLASSIFICATION & ROLES
// =========================================================================
export type FoodBucketId = 'builders' | 'energetic' | 'protective';

export interface FoodRoleCard {
  id: string;
  ar: string;
  fr: string;
  nutrientsAr: string;
  bucket: FoodBucketId;
  iconType: 'bread' | 'oil' | 'meat' | 'eggs' | 'milk' | 'veggies' | 'fruits' | 'water' | 'honey';
  accent: string;
  speech: string;
}

export const FOOD_ROLE_CARDS: FoodRoleCard[] = [
  {
    id: 'f1',
    ar: 'اللحوم والأسماك',
    fr: 'Viandes & Poissons',
    nutrientsAr: 'بروتيدات حيوانية',
    bucket: 'builders',
    iconType: 'meat',
    accent: '#EF4444',
    speech: 'اللحوم والأسماك غنية بالبروتيدات، وهي أغذية بنائية ضرورية لنمو الجسم وبناء العضلات.',
  },
  {
    id: 'f2',
    ar: 'البيض والقطاني',
    fr: 'Œufs & Légumineuses',
    nutrientsAr: 'بروتيدات',
    bucket: 'builders',
    iconType: 'eggs',
    accent: '#F97316',
    speech: 'البيض والقطاني تزوّد الجسم بالبروتيدات لبناء الخلايا وتجديدها.',
  },
  {
    id: 'f3',
    ar: 'الحليب ومشتقاته',
    fr: 'Lait & Produits laitiers',
    nutrientsAr: 'كالسيوم + بروتيدات',
    bucket: 'builders',
    iconType: 'milk',
    accent: '#38BDF8',
    speech: 'الحليب ومشتقاته أغذية بنائية غنية بالكالسيوم والبروتيدات لتقوية العظام والنمو.',
  },
  {
    id: 'f4',
    ar: 'الخبز والنشويات',
    fr: 'Pain & Féculents',
    nutrientsAr: 'سكريات (نشا)',
    bucket: 'energetic',
    iconType: 'bread',
    accent: '#FBBF24',
    speech: 'النشويات غنية بالسكريات، وهي المصدر الطاقي الأول لنشاط العضلات والدماغ.',
  },
  {
    id: 'f5',
    ar: 'الزيوت والزبدة',
    fr: 'Huiles & Beurre',
    nutrientsAr: 'دهنيات (38 kJ/g)',
    bucket: 'energetic',
    iconType: 'oil',
    accent: '#FF9F1C',
    speech: 'الزيوت والزبدة غنية بالدهنيات وتوفر طاقة عالية جداً ومقاومة للبرد.',
  },
  {
    id: 'f6',
    ar: 'العسل والتمور',
    fr: 'Miel & Dattes',
    nutrientsAr: 'سكريات سريعة',
    bucket: 'energetic',
    iconType: 'honey',
    accent: '#F59E0B',
    speech: 'العسل والتمور أغذية طاقية تمد الجسم بسكريات سريعة الامتصاص.',
  },
  {
    id: 'f7',
    ar: 'الخضر الطرية',
    fr: 'Légumes frais',
    nutrientsAr: 'فيتامينات + ألياف',
    bucket: 'protective',
    iconType: 'veggies',
    accent: '#00FFA3',
    speech: 'الخضر الطرية أغذية واقية ووظيفية غنية بالفيتامينات والأملاح والألياف.',
  },
  {
    id: 'f8',
    ar: 'الفواكه والحوامض',
    fr: 'Fruits & Agrumes',
    nutrientsAr: 'فيتامين C و A',
    bucket: 'protective',
    iconType: 'fruits',
    accent: '#34D399',
    speech: 'الفواكه تحمي الجسم من الفاقات الغذائية بفضل غناها بالفيتامينات والأملاح المعدنية.',
  },
  {
    id: 'f9',
    ar: 'الماء والأملاح المعدنية',
    fr: 'Eau & Sels minéraux',
    nutrientsAr: 'تنظيم ووقاية',
    bucket: 'protective',
    iconType: 'water',
    accent: '#00E5FF',
    speech: 'الماء والأملاح المعدنية أغذية وظيفية أساسية لتوازن الوسط الداخلي ووقاية الجسم.',
  },
];

// =========================================================================
// STATION 3: LES CARENCES ALIMENTAIRES & VITAMINS
// =========================================================================
export type CarenceId =
  | 'kwashiorkor'
  | 'goitre'
  | 'scorbut'
  | 'xerophtalmie'
  | 'rachitisme'
  | 'beriberi';

export interface CarenceInfo {
  id: CarenceId;
  ar: string;
  fr: string;
  deficiencyAr: string;
  deficiencyFr: string;
  symptomAr: string;
  symptomFr: string;
  preventionAr: string;
  preventionFr: string;
  accent: string;
  speech: string;
}

export const CARENCES_DATA: CarenceInfo[] = [
  {
    id: 'kwashiorkor',
    ar: 'الكواشيوركور',
    fr: 'Le Kwashiorkor',
    deficiencyAr: 'نقص البروتيدات الحيوانية (Lysine & Tryptophane)',
    deficiencyFr: 'Carence en protides (Acides aminés essentiels)',
    symptomAr: 'انتفاخ البطن والأوديمات · توقف النمو',
    symptomFr: 'Œdèmes · Ventre ballonné · Retard de croissance',
    preventionAr: 'حليب · لحوم · أسماك · بيض · قطاني',
    preventionFr: 'Protéines animales & légumineuses',
    accent: '#EF4444',
    speech: 'الكواشيوركور ينتج عن نقص حاد في البروتيدات الحيوانية الغنية بالأحماض الأمينية الأساسية كالليزين والتريبتوفان.',
  },
  {
    id: 'goitre',
    ar: 'التدرق',
    fr: 'Le Goître',
    deficiencyAr: 'نقص أملاح اليود (Iode)',
    deficiencyFr: 'Carence en iode',
    symptomAr: 'تضخم الغدة الدرقية في العنق',
    symptomFr: 'Hypertrophie de la glande thyroïde',
    preventionAr: 'الملح الميود · الأسماك وفواكه البحر',
    preventionFr: 'Sel iodé · Poissons & fruits de mer',
    accent: '#A855F7',
    speech: 'التدرق هو تضخم الغدة الدرقية بسبب نقص ملح اليود، والوقاية منه بتناول الملح الميود وفواكه البحر.',
  },
  {
    id: 'scorbut',
    ar: 'داء الحفر',
    fr: 'Le Scorbut',
    deficiencyAr: 'نقص فيتامين C',
    deficiencyFr: 'Carence en vitamine C',
    symptomAr: 'نزيف اللثة · تخلخل وسقوط الأسنان',
    symptomFr: 'Saignement des gencives · Chute des dents',
    preventionAr: 'الحوامض (البرتقال، الليمون) · الخضر الطرية',
    preventionFr: 'Agrumes · Légumes frais',
    accent: '#F97316',
    speech: 'داء الحفر ينتج عن نقص فيتامين سي، ويؤدي لنزيف اللثة وسقوط الأسنان؛ الوقاية بتناول الحوامض والخضر الطرية.',
  },
  {
    id: 'xerophtalmie',
    ar: 'جفاف العين',
    fr: 'Xérophtalmie (Sclérose de l’œil)',
    deficiencyAr: 'نقص فيتامين A',
    deficiencyFr: 'Carence en vitamine A',
    symptomAr: 'جفاف وتعتّم القرنية · خطر العمى',
    symptomFr: 'Sécheresse de la cornée · Cécité',
    preventionAr: 'الجزر · الكبد · الزبدة · الخضر الملونة',
    preventionFr: 'Carottes · Foie · Beurre',
    accent: '#00E5FF',
    speech: 'جفاف العين ينتج عن نقص فيتامين أ، وقد يؤدي لتلف القرنية والعمى؛ الوقاية بالجزر والكبد والزبدة.',
  },
  {
    id: 'rachitisme',
    ar: 'الكساح',
    fr: 'Le Rachitisme',
    deficiencyAr: 'نقص فيتامين D والكالسيوم',
    deficiencyFr: 'Carence en vitamine D & Calcium',
    symptomAr: 'تقوس عظام الساقين ( ) أو ) ( · تشوه القفص الصدري',
    symptomFr: 'Déformation des jambes ( ) ou ) (',
    preventionAr: 'أشعة الشمس (UV) · الحليب · زيت السمك',
    preventionFr: 'Soleil (UV) · Lait · Huile de poisson',
    accent: '#FF9F1C',
    speech: 'الكساح يصيب عظام الأطفال بسبب نقص فيتامين د والكالسيوم؛ التعرض للشمس يمكّن الجلد من تركيب فيتامين د لتثبيت الكالسيوم!',
  },
  {
    id: 'beriberi',
    ar: 'البري بري',
    fr: 'Le Béribéri',
    deficiencyAr: 'نقص فيتامين B1',
    deficiencyFr: 'Carence en vitamine B1',
    symptomAr: 'اضطرابات عصبية · ضعف وشلل عضلي',
    symptomFr: 'Troubles nerveux · Paralysie musculaire',
    preventionAr: 'الأرز الكامل بقشرته · الحبوب الكاملة',
    preventionFr: 'Riz complet (enveloppe) · Céréales',
    accent: '#00FFA3',
    speech: 'داء البري بري ينتج عن نقص فيتامين ب1 لدى من يتغذون على الأرز المقشور فقط؛ قشرة الحبوب غنية بفيتامين ب1.',
  },
];

export interface RatExperimentPoint {
  day: number;
  caseine: number; // Lot 1 weight (g)
  zeine: number;   // Lot 2 weight (g)
  phaseAr: string;
  phaseFr: string;
  speech: string;
}

export const RAT_EXPERIMENT_DATA: RatExperimentPoint[] = [
  { day: 0, caseine: 40, zeine: 40, phaseAr: 'البداية: تساوي الوزن', phaseFr: 'Début (40g)', speech: 'في اليوم صفر، يبدأ الفأران بنفس الوزن 40 غراماً.' },
  { day: 20, caseine: 66, zeine: 34, phaseAr: 'الزيين وحده (Zéine)', phaseFr: 'Zéine seul', speech: 'فأر الكازيين ينمو بسرعة، بينما يتناقص وزن فأر الزيين لغياب أحماض أمينية أساسية.' },
  { day: 40, caseine: 92, zeine: 30, phaseAr: 'إضافة التريبتوفان (Z+T)', phaseFr: 'Ajout Tryptophane (Z+T)', speech: 'في اليوم الأربعين نضيف التريبتوفان للزيين؛ يتوقف الهزال لكن النمو لا يستأنف بعد!' },
  { day: 60, caseine: 118, zeine: 33, phaseAr: 'ثبات الوزن مع Z+T', phaseFr: 'Stagnation (Z+T)', speech: 'مع التريبتوفان وحده يبقى وزن الفأر شبه ثابت لأنه ما زال يفتقر لليزين.' },
  { day: 80, caseine: 140, zeine: 36, phaseAr: 'إضافة الليزين (Z+T+L)', phaseFr: 'Ajout Lysine (Z+T+L)', speech: 'في اليوم الثمانين نضيف الحمض الأميني الأساسي الليزين! راقب ماذا سيحدث للنمو الآن!' },
  { day: 100, caseine: 155, zeine: 86, phaseAr: 'استئناف سريع للنمو!', phaseFr: 'Reprise rapide', speech: 'مدهش! بمجرد توفر التريبتوفان والليزين معاً استأنف الفأر نموه السريع!' },
  { day: 120, caseine: 165, zeine: 132, phaseAr: 'نمو طبيعي سليم', phaseFr: 'Croissance normale', speech: 'الخلاصة: النمو السليم يتطلب بروتيدات تحتوي على جميع الأحماض الأمينية الأساسية.' },
];

export interface VitaminItem {
  code: string;
  group: 'liposoluble' | 'hydrosoluble';
  roleAr: string;
  deficiencyAr: string;
  deficiencyFr: string;
  sourcesAr: string;
  color: string;
  speech: string;
}

export const VITAMINS_LIST: VitaminItem[] = [
  {
    code: 'A',
    group: 'liposoluble',
    roleAr: 'حماية القرنية والإبصار',
    deficiencyAr: 'جفاف العين',
    deficiencyFr: 'Xérophtalmie',
    sourcesAr: 'الجزر · الكبد · الزبدة',
    color: '#00E5FF',
    speech: 'فيتامين أ يذوب في الدهون، يحمي العين، ونقصه يسبب جفاف العين.',
  },
  {
    code: 'D',
    group: 'liposoluble',
    roleAr: 'تثبيت الكالسيوم بالعظام',
    deficiencyAr: 'الكساح',
    deficiencyFr: 'Rachitisme',
    sourcesAr: 'أشعة الشمس · زيت السمك · الحليب',
    color: '#FF9F1C',
    speech: 'فيتامين د يذوب في الدهون، يثبت الكالسيوم في العظام، ونقصه يسبب الكساح.',
  },
  {
    code: 'K',
    group: 'liposoluble',
    roleAr: 'تخثر الدم ووقف النزيف',
    deficiencyAr: 'اضطراب تخثر الدم',
    deficiencyFr: 'Hémorragies',
    sourcesAr: 'الخضر الورقية الخضراء · الكبد',
    color: '#00FFA3',
    speech: 'فيتامين كا يذوب في الدهون ويلعب دوراً أساسياً في تخثر الدم.',
  },
  {
    code: 'B1',
    group: 'hydrosoluble',
    roleAr: 'سلامة الأعصاب والعضلات',
    deficiencyAr: 'البري بري',
    deficiencyFr: 'Béribéri',
    sourcesAr: 'قشرة الأرز · الحبوب الكاملة',
    color: '#A855F7',
    speech: 'فيتامين ب1 يذوب في الماء، ونقصه يسبب مرض البري بري واضطرابات عصبية.',
  },
  {
    code: 'C',
    group: 'hydrosoluble',
    roleAr: 'مناعة وسلامة اللثة',
    deficiencyAr: 'داء الحفر',
    deficiencyFr: 'Scorbut',
    sourcesAr: 'البرتقال · الليمون · الخضر الطرية',
    color: '#F97316',
    speech: 'فيتامين سي يذوب في الماء، ويقي الجسم من داء الحفر ونزيف اللثة.',
  },
  {
    code: 'B3',
    group: 'hydrosoluble',
    roleAr: 'سلامة الجلد والأعصاب',
    deficiencyAr: 'البلاغرا (Pellagre)',
    deficiencyFr: 'Pellagre',
    sourcesAr: 'اللحوم · الأسماك · الحبوب',
    color: '#38BDF8',
    speech: 'فيتامين ب3 أو PP يذوب في الماء ويقي من مرض البلاغرا الجلدي والعصبي.',
  },
];

// =========================================================================
// STATION 5: HYGIENE, FULL MIND MAP & REGIONAL EXAM
// =========================================================================
export interface HygienePair {
  id: string;
  riskAr: string;
  riskFr: string;
  habitAr: string;
  habitFr: string;
  accent: string;
  speech: string;
}

export const HYGIENE_PAIRS: HygienePair[] = [
  {
    id: 'h1',
    riskAr: 'تسوس الأسنان',
    riskFr: 'Carie dentaire',
    habitAr: 'تنظيف الأسنان بعد كل وجبة وتقليل السكريات',
    habitFr: 'Brossage après repas · Limiter le sucre',
    accent: '#00E5FF',
    speech: 'للوقاية من تسوس الأسنان، ننظف أسناننا بعد كل وجبة ونتجنب الإفراط في الحلويات.',
  },
  {
    id: 'h2',
    riskAr: 'قرحة المعدة',
    riskFr: 'Ulcère gastrique',
    habitAr: 'تجنب الأكل الحار والتدخين وتنظيم أوقات الوجبات',
    habitFr: 'Repas réguliers · Éviter tabac et épices',
    accent: '#EF4444',
    speech: 'الانتظام في الوجبات وتجنب التدخين والمنبهات يحمي غشاء المعدة من القرحة.',
  },
  {
    id: 'h3',
    riskAr: 'الإسهال',
    riskFr: 'Diarrhée',
    habitAr: 'غسل اليدين والخضر جيداً وشرب ماء صالح',
    habitFr: 'Laver mains & légumes · Eau potable',
    accent: '#38BDF8',
    speech: 'غسل اليدين والخضر وشرب الماء الصالح يقي من الجراثيم المسببة للإسهال.',
  },
  {
    id: 'h4',
    riskAr: 'الإمساك',
    riskFr: 'Constipation',
    habitAr: 'تناول الخضر الغنية بالألياف وشرب الماء بوفرة',
    habitFr: 'Fibres végétales · Hydratation',
    accent: '#00FFA3',
    speech: 'الألياف النباتية الموجودة في الخضر والفواكه مع شرب الماء تنشط الأمعاء وتمنع الإمساك.',
  },
  {
    id: 'h5',
    riskAr: 'التسمم الغذائي',
    riskFr: 'Intoxication alimentaire',
    habitAr: 'مراقبة تاريخ الصلاحية وحفظ الأغذية بالتبريد',
    habitFr: 'Date de péremption · Chaîne du froid',
    accent: '#FF9F1C',
    speech: 'مراقبة تاريخ الصلاحية وحفظ الأطعمة في الثلاجة يحمينا من التسممات الغذائية الخطيرة.',
  },
];

export interface FullMindMapBranch {
  id: string;
  ar: string;
  fr: string;
  color: string;
  speech: string;
  nodes: { ar: string; fr: string; speech: string }[];
}

export const LESSON1_MIND_MAP: FullMindMapBranch[] = [
  {
    id: 'mm_reagents',
    ar: '1. الكواشف الكيميائية',
    fr: 'Réactifs chimiques',
    color: '#00E5FF',
    speech: 'الأغذية المركبة كالخبز والحليب تحتوي على أغذية بسيطة نكشف عنها بكواشف نوعية.',
    nodes: [
      { ar: 'ماء يودي ← نشا (أزرق بنفسجي)', fr: 'Eau iodée → Amidon', speech: 'الماء اليودي يعطي تلوناً أزرق بنفسجياً مع النشا.' },
      { ar: 'فهلينغ + تسخين ← كليكوز (أحمر آجوري)', fr: 'Fehling → Glucose', speech: 'محلول فهلينغ مع التسخين يعطي راسباً أحمر آجورياً مع الكليكوز.' },
      { ar: 'حمض النتريك ← بروتيدات (أصفر)', fr: 'Ac. nitrique → Protides', speech: 'حمض النتريك يلون البروتيدات بالأصفر.' },
    ],
  },
  {
    id: 'mm_roles',
    ar: '2. أدوار الأغذية',
    fr: 'Rôles des aliments',
    color: '#00FFA3',
    speech: 'تصنف الأغذية حسب دورها إلى بنائية وطاقية ووظيفية واقية.',
    nodes: [
      { ar: 'بنائية: بروتيدات وكالسيوم', fr: 'Bâtisseurs (Protides/Ca)', speech: 'تضمن النمو وتجديد الخلايا وبناء العظام.' },
      { ar: 'طاقية: سكريات ودهنيات', fr: 'Énergétiques (Gluc/Lip)', speech: 'توفر الطاقة اللازمة للنشاط والحرارة.' },
      { ar: 'واقية: فيتامينات وأملاح وماء', fr: 'Protecteurs (Vit/Eau)', speech: 'تحمي الجسم من الأمراض وتنظم وظائفه.' },
    ],
  },
  {
    id: 'mm_carences',
    ar: '3. الفاقات الغذائية',
    fr: 'Carences alimentaires',
    color: '#EF4444',
    speech: 'الفاقة الغذائية مرض ينتج عن نقص أو غياب غذاء بسيط واحد أو أكثر.',
    nodes: [
      { ar: 'كواشيوركور (بروتيدات) · تدرق (يود)', fr: 'Kwashiorkor · Goître', speech: 'نقص البروتيدات يسبب الكواشيوركور ونقص اليود يسبب التدرق.' },
      { ar: 'كساح (Vit D/Ca) · حفر (Vit C)', fr: 'Rachitisme · Scorbut', speech: 'نقص فيتامين د يسبب الكساح ونقص فيتامين سي يسبب داء الحفر.' },
      { ar: 'جفاف العين (Vit A) · بري بري (Vit B1)', fr: 'Xérophtalmie · Béribéri', speech: 'نقص فيتامين أ يسبب جفاف العين وفيتامين ب1 يسبب البري بري.' },
    ],
  },
  {
    id: 'mm_ration',
    ar: '4. الكلتة الطاقية و IMC',
    fr: 'Ration & IMC',
    color: '#FF9F1C',
    speech: 'الكلتة الغذائية هي كمية الأغذية اللازمة يومياً، وتُقاس الطاقة بالكيلوجول.',
    nodes: [
      { ar: '1g سكر/بروتيد = 17 kJ · 1g دهن = 38 kJ', fr: '17 / 17 / 38 kJ', speech: 'كل غرام سكر أو بروتيد يحرر 17 كيلوجول، والدهن يحرر 38 كيلوجول.' },
      { ar: 'توازن: 3.5 < G/P < 5 و L/P = 1', fr: 'Rapports d’équilibre', speech: 'شروط التوازن المغربي: نسبة السكريات للبروتيدات بين 3.5 و5.' },
      { ar: 'IMC = الوزن / الطول²', fr: 'IMC = P / T²', speech: 'مؤشر كتلة الجسم يكشف الوزن العادي أو الفائض أو السمنة.' },
    ],
  },
  {
    id: 'mm_hygiene',
    ar: '5. وقاية الجهاز الهضمي',
    fr: 'Hygiène digestive',
    color: '#A855F7',
    speech: 'سلامة الجهاز الهضمي تتطلب نظافة الأغذية، تنظيف الأسنان، وتناول الألياف.',
    nodes: [
      { ar: 'تنظيف الأسنان ← ضد التسوس', fr: 'Contre la carie', speech: 'تنظيف الأسنان بعد كل وجبة يمنع التسوس.' },
      { ar: 'الألياف والماء ← ضد الإمساك', fr: 'Contre la constipation', speech: 'الألياف النباتية والماء تقي من الإمساك.' },
      { ar: 'التبريد والصلاحية ← ضد التسمم', fr: 'Contre l’intoxication', speech: 'مراقبة الصلاحية تقي من التسمم الغذائي.' },
    ],
  },
];

export const STATION_LIST: {
  id: StationId;
  num: string;
  ar: string;
  fr: string;
  welcome: MascotSignal;
}[] = [
  {
    id: 'reagents',
    num: '01',
    ar: 'مختبر الكواشف',
    fr: 'Réactifs chimiques',
    welcome: {
      mood: 'explaining',
      badgeAr: 'مختبر الكواشف الكيميائية',
      badgeFr: 'Labo des Réactifs',
      speechText: 'مرحباً بك في المختبر! اختر عينة غذائية ثم اضغط على أي كاشف كيميائي لنكشف عن مكوناتها.',
      shouldSpeak: true,
    },
  },
  {
    id: 'roles',
    num: '02',
    ar: 'تصنيف الأغذية',
    fr: 'Rôles des aliments',
    welcome: {
      mood: 'explaining',
      badgeAr: 'تصنيف الأغذية وأدوارها',
      badgeFr: 'Bâtisseurs · Énergétiques · Protecteurs',
      speechText: 'اسحب كل غذاء إلى سلة دوره الصحيح: أغذية بنائية، طاقية، أو واقية!',
      shouldSpeak: true,
    },
  },
  {
    id: 'carences',
    num: '03',
    ar: 'عيادة الفاقات',
    fr: 'Carences alimentaires',
    welcome: {
      mood: 'explaining',
      badgeAr: 'عيادة الفاقات الغذائية',
      badgeFr: 'Les 6 Carences (3AC)',
      speechText: 'أهلاً بك في العيادة! تفحّص الفاقات الغذائية الست، وتابع منحنى تجربة الفئران للكواشيوركور ومستكشف الفيتامينات.',
      shouldSpeak: true,
    },
  },
  {
    id: 'ration',
    num: '04',
    ar: 'الكلتة ومؤشر IMC',
    fr: 'Ration, Énergie & IMC',
    welcome: {
      mood: 'explaining',
      badgeAr: 'الكلتة الغذائية ومؤشر IMC',
      badgeFr: 'Équilibre, kJ & Courbe IMC',
      speechText: 'وازن الميزان الغذائي، احسب الطاقة بالكيلوجول، وارسم موقعك على منحنى مؤشر كتلة الجسم!',
      shouldSpeak: true,
    },
  },
  {
    id: 'hygiene',
    num: '05',
    ar: 'الوقاية والجهوي',
    fr: 'Hygiène, Carte & Examen',
    welcome: {
      mood: 'explaining',
      badgeAr: 'الوقاية، الخريطة والجهوي',
      badgeFr: 'Bilan & Examen Régional',
      speechText: 'المحطة الأخيرة! اربط أخطار الجهاز الهضمي بالوقاية، راجع الخريطة الشاملة، واجتز تحدي الامتحان الجهوي.',
      shouldSpeak: true,
    },
  },
];
