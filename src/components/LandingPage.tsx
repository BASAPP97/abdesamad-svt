import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  ArrowLeft,
  FlaskConical,
  Network,
  Award,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Play,
  Lock,
  Sparkles,
  Flame,
  Scale,
  HeartPulse,
  Wind,
  Droplets,
  Brain,
  Shield,
} from 'lucide-react';
import type { SubscriptionPlanId } from './SubscriptionModal';

interface LandingPageProps {
  isMuted: boolean;
  isSpeaking: boolean;
  onToggleMute: () => void;
  onSpeakIntro: (text: string) => void;
  onEnterClassroom: () => void;
  onOpenSubscribe: (plan: SubscriptionPlanId) => void;
}

type HoloPreviewId = 'reagents' | 'imc' | 'mindmap';

const HERO_INTRO_SPEECH =
  'مرحباً بك في منصة الأستاذ عبد الصمد باحوس لعلوم الحياة والأرض! وداعاً للحفظ الممل، جرب الدرس الأول مجاناً واكتشف متعة التعلم التفاعلي.';

const ROADMAP_MODULES = [
  {
    id: 'nutrition',
    num: '01',
    semester: 'الدورة الأولى',
    titleAr: 'التربية الغذائية والهضم والامتصاص',
    titleFr: 'Éducation Alimentaire & Digestion',
    icon: FlaskConical,
    accent: '#00FFA3',
    freeDemo: true,
    highlights: 'مختبر الكواشف · الفاقات · الكلتة الغذائية و IMC',
  },
  {
    id: 'respiration',
    num: '02',
    semester: 'الدورة الأولى',
    titleAr: 'التنفس عند الإنسان',
    titleFr: 'La Respiration chez l’Homme',
    icon: Wind,
    accent: '#00E5FF',
    freeDemo: false,
    highlights: 'التبادلات الغازية السنخية · التنفس الخلوي',
  },
  {
    id: 'circulation',
    num: '03',
    semester: 'الدورة الأولى',
    titleAr: 'الدم والدوران الدموي',
    titleFr: 'Le Sang et la Circulation Sanguine',
    icon: HeartPulse,
    accent: '#00E5FF',
    freeDemo: false,
    highlights: 'مكونات الدم · الدورة الدموية القلبية والرئوية',
  },
  {
    id: 'excretion',
    num: '04',
    semester: 'الدورة الأولى',
    titleAr: 'الإبراز البولي',
    titleFr: 'L’Excrétion Urinaire',
    icon: Droplets,
    accent: '#00E5FF',
    freeDemo: false,
    highlights: 'بنية الكلية والأنبوب البولي · تشكل البول',
  },
  {
    id: 'nervous_muscle',
    num: '05',
    semester: 'الدورة الثانية',
    titleAr: 'الجهاز العصبي والجهاز العضلي',
    titleFr: 'Système Nerveux & Musculaire',
    icon: Brain,
    accent: '#FF9F1C',
    freeDemo: false,
    highlights: 'قوس الانعكاس · السيالة العصبية · التقلص العضلي',
  },
  {
    id: 'immunity',
    num: '06',
    semester: 'الدورة الثانية',
    titleAr: 'الجراثيم وعلم المناعة',
    titleFr: 'Microbes & Immunologie',
    icon: Shield,
    accent: '#FF9F1C',
    freeDemo: false,
    highlights: 'المناعة الطبيعية والنوعية · التلقيح والاستمصال',
  },
];

const FAQ_ITEMS = [
  {
    q: 'هل المنصة مناسبة لتلاميذ المسار الدولي (Biof) والمسار العام؟',
    a: 'نعم بالكامل. جميع المختبرات، الخرائط الذهنية، وتمارين الامتحان الجهوي مصممة بنظام ثنائي اللغة (عربي + المصطلحات الفرنسية الرسمية Biof) مع إمكانية إخفاء المصطلحات للتدرب الذاتي.',
  },
  {
    q: 'هل الدفع شهري أم سنوي مرة واحدة؟',
    a: 'الاشتراك سنوي لمرة واحدة فقط (199 درهم للباقة الأساسية أو 349 درهم للباقة المميزة) ويغطي كامل الموسم الدراسي حتى اجتياز الامتحان الجهوي الموحد بدون أي رسوم خفية.',
  },
  {
    q: 'ما الفرق بين الباقة الأساسية (199 درهم) والباقة المميزة (349 درهم)؟',
    a: 'الباقة الأساسية تمنحك ولوجاً شاملاً لجميع الدروس التفاعلية والمختبرات والخرائط والتمارين المصححة ذاتياً. أما الباقة المميزة فتضيف حصة بث مباشر (Live) كل أسبوع مع الأستاذ عبد الصمد، متابعة شخصية للإجابة على التساؤلات، وتصحيح نماذج الامتحانات الجهوية داخل مجموعة VIP.',
  },
  {
    q: 'كيف يتم تفعيل حسابي بعد التسجيل؟',
    a: 'بمجرد اختيار الباقة وإدخال الاسم ورقم الواتساب، تُرسل رسالة جاهزة مباشرة للأستاذ عبد الصمد لتأكيد طريقة الأداء المناسبة (تحويل بنكي أو وكالة أداء) وتفعيل الولوج الكامل خلال دقائق.',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  isMuted,
  isSpeaking,
  onToggleMute,
  onSpeakIntro,
  onEnterClassroom,
  onOpenSubscribe,
}) => {
  const [holoPreview, setHoloPreview] = useState<HoloPreviewId>('reagents');
  const [bentoMindMapQuiz, setBentoMindMapQuiz] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number>(0);

  const handleTeacherHeroClick = () => {
    onSpeakIntro(HERO_INTRO_SPEECH);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col relative overflow-x-hidden">
      {/* Subtle Ambient Bioluminescent Field */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-60"
        style={{
          background:
            'radial-gradient(640px circle at 18% 12%, rgba(0,229,255,0.09), transparent 65%), radial-gradient(720px circle at 84% 18%, rgba(0,255,163,0.08), transparent 65%)',
        }}
      />

      {/* 1. Sticky Glass Navbar — Clean 3-Zone Contract */}
      <header className="sticky top-0 z-40 bg-[#070B14]/88 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-base sm:text-lg font-extrabold tracking-tight text-slate-50 font-latin whitespace-nowrap shrink-0 hover:text-[#00FFA3] transition-colors"
          >
            ABDESAMAD BAHOUS <span className="text-[#00FFA3]">SVT</span>
          </a>

          {/* Zone 2: 4 Clean Single-Line Quick Links */}
          <nav
            aria-label="التنقل الرئيسي"
            className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-300"
          >
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="hover:text-[#00FFA3] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              المميزات
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('methodology')}
              className="hover:text-[#00FFA3] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              منهجية التعلم
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('pricing')}
              className="hover:text-[#00FFA3] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              الباقات والأسعار
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('faq')}
              className="hover:text-[#00FFA3] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              الأسئلة الشائعة
            </button>
          </nav>

          {/* Zone 3: Voice Toggle + Primary Classroom CTA */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onToggleMute}
              aria-label={isMuted ? 'تشغيل صوت الأستاذ' : 'كتم صوت الأستاذ'}
              title={isMuted ? 'تشغيل صوت الأستاذ' : 'كتم صوت الأستاذ'}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                isMuted
                  ? 'bg-[#FF9F1C]/15 border-[#FF9F1C]/45 text-[#FF9F1C] hover:bg-[#FF9F1C]/25'
                  : 'bg-white/5 border-white/15 text-[#00FFA3] hover:border-[#00FFA3]/60'
              }`}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={onEnterClassroom}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#00FFA3] text-[#070B14] hover:bg-[#2dffb4] text-xs sm:text-sm font-extrabold transition-all shadow-[0_0_24px_rgba(0,255,163,0.28)] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>دخول فضاء الدروس</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        {/* 2. Hero Section — Above the Fold Impact */}
        <section
          id="hero"
          className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-10 pb-14 lg:pt-14 lg:pb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Right Column (RTL Primary Copy & CTAs) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Quiet Moroccan 3AC Regional Kicker */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold text-[#00E5FF]">
                <span>المغرب · 3AC</span>
                <span aria-hidden="true" className="text-slate-600">
                  /
                </span>
                <span className="text-slate-200">
                  المنصة التفاعلية الأولى للثالثة إعدادي (عام + Biof)
                </span>
              </div>

              <h1
                className="font-extrabold text-slate-50 leading-[1.22] tracking-tight"
                style={{
                  fontSize: 'clamp(2.1rem, 3.6vw, 3.35rem)',
                  textWrap: 'balance',
                }}
              >
                وداعاً للحفظ الممل.. افهم علوم الحياة والأرض{' '}
                <span className="text-[#00FFA3]">بالـ 3D والتفاعل الحي!</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                أول منصة مغربية تجمع بين المختبرات ثلاثية الأبعاد، الخرائط الذهنية
                ثنائية اللغة، ومواكبة الأستاذ عبد الصمد لضمان التفوق في الامتحان
                الجهوي.
              </p>

              {/* Dual CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <button
                  type="button"
                  onClick={onEnterClassroom}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#00FFA3] text-[#070B14] hover:bg-[#2dffb4] text-sm sm:text-base font-extrabold transition-all shadow-[0_0_28px_rgba(0,255,163,0.32)] whitespace-nowrap cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>جرب الدرس الأول مجاناً (التربية الغذائية)</span>
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('pricing')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#00E5FF]/60 text-slate-100 text-sm sm:text-base font-bold transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>اكتشف باقات الاشتراك السنوية</span>
                </button>
              </div>

              {/* Unboxed Quantitative Trust Row */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-400">
                <span>
                  <strong className="font-mono-num text-slate-100 font-extrabold">
                    6
                  </strong>{' '}
                  وحدات 3AC كاملة
                </span>
                <span aria-hidden="true" className="text-slate-600">
                  ·
                </span>
                <span>
                  <strong className="font-mono-num text-[#00FFA3] font-extrabold">
                    100%
                  </strong>{' '}
                  ثنائي اللغة (عربي / Biof)
                </span>
                <span aria-hidden="true" className="text-slate-600">
                  ·
                </span>
                <span>
                  ابتداءً من{' '}
                  <strong className="font-mono-num text-[#00E5FF] font-extrabold">
                    199 DH
                  </strong>{' '}
                  / السنة
                </span>
              </div>
            </div>

            {/* Left Column: Talking Cartoon Teacher + Floating 3D Holographic Lab Preview */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl bg-[#0D1424]/90 backdrop-blur-xl border border-white/12 p-5 sm:p-6 overflow-hidden">
                {/* Subtle holographic grid background */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(0,229,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.16) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                  }}
                />

                {/* Top Interactive Switcher Bar inside Stage */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <span className="font-latin text-[#00E5FF]">
                      3AC Interactive Lab Preview
                    </span>
                  </div>

                  <div className="flex items-center gap-1 p-1 rounded-lg bg-[#070B14]/90 border border-white/10">
                    {(
                      [
                        { id: 'reagents', label: 'الكواشف' },
                        { id: 'imc', label: 'مبيان IMC' },
                        { id: 'mindmap', label: 'الخريطة' },
                      ] as { id: HoloPreviewId; label: string }[]
                    ).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setHoloPreview(item.id)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors whitespace-nowrap cursor-pointer ${
                          holoPreview === item.id
                            ? 'bg-[#00FFA3] text-[#070B14]'
                            : 'text-slate-400 hover:text-slate-100'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Split inside Hero Visual: Holographic 3D Card + Cartoon Teacher Pointing */}
                <div className="relative z-10 mt-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Floating 3D Holographic Preview Card (7 cols) */}
                  <div className="sm:col-span-7">
                    <div className="rounded-xl bg-[#070B14]/92 border border-[#00E5FF]/35 p-4 shadow-[0_18px_45px_rgba(0,229,255,0.12)] animate-holo-float">
                      {holoPreview === 'reagents' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-slate-100">
                              مختبر الكواشف الكيميائية
                            </span>
                            <span className="text-[11px] font-latin text-[#00E5FF]">
                              Liqueur de Fehling
                            </span>
                          </div>
                          {/* Animated Test Tubes SVG */}
                          <svg
                            viewBox="0 0 260 120"
                            className="w-full h-28"
                            role="img"
                            aria-label="محاكاة الكشف عن الكليكوز والنشا في المختبر التفاعلي"
                          >
                            <defs>
                              <linearGradient
                                id="heroTubeFehling"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop offset="0%" stopColor="#FF9F1C" />
                                <stop offset="100%" stopColor="#DC2626" />
                              </linearGradient>
                              <linearGradient
                                id="heroTubeIode"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop offset="0%" stopColor="#3B82F6" />
                                <stop offset="100%" stopColor="#312E81" />
                              </linearGradient>
                              <linearGradient
                                id="heroTubeNitric"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop offset="0%" stopColor="#FDE047" />
                                <stop offset="100%" stopColor="#CA8A04" />
                              </linearGradient>
                            </defs>
                            {/* Rack */}
                            <rect
                              x="18"
                              y="96"
                              width="224"
                              height="8"
                              rx="4"
                              fill="#1E293B"
                            />
                            {/* Tube 1: Fehling brick red */}
                            <rect
                              x="44"
                              y="20"
                              width="26"
                              height="78"
                              rx="13"
                              fill="rgba(255,255,255,0.06)"
                              stroke="#94A3B8"
                              strokeWidth="1.5"
                            />
                            <rect
                              x="47"
                              y="54"
                              width="20"
                              height="41"
                              rx="10"
                              fill="url(#heroTubeFehling)"
                            />
                            <text
                              x="57"
                              y="115"
                              textAnchor="middle"
                              fill="#FF9F1C"
                              fontSize="9"
                              fontWeight="700"
                            >
                              Glucose
                            </text>
                            {/* Tube 2: Eau iodée dark blue */}
                            <rect
                              x="117"
                              y="20"
                              width="26"
                              height="78"
                              rx="13"
                              fill="rgba(255,255,255,0.06)"
                              stroke="#00E5FF"
                              strokeWidth="1.8"
                            />
                            <rect
                              x="120"
                              y="48"
                              width="20"
                              height="47"
                              rx="10"
                              fill="url(#heroTubeIode)"
                            />
                            <text
                              x="130"
                              y="115"
                              textAnchor="middle"
                              fill="#00E5FF"
                              fontSize="9"
                              fontWeight="700"
                            >
                              Amidon
                            </text>
                            {/* Tube 3: Acide nitrique yellow */}
                            <rect
                              x="190"
                              y="20"
                              width="26"
                              height="78"
                              rx="13"
                              fill="rgba(255,255,255,0.06)"
                              stroke="#00FFA3"
                              strokeWidth="1.5"
                            />
                            <rect
                              x="193"
                              y="58"
                              width="20"
                              height="37"
                              rx="10"
                              fill="url(#heroTubeNitric)"
                            />
                            <text
                              x="203"
                              y="115"
                              textAnchor="middle"
                              fill="#00FFA3"
                              fontSize="9"
                              fontWeight="700"
                            >
                              Protides
                            </text>
                          </svg>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/10">
                            <span>7 كواشف كيميائية حية</span>
                            <button
                              type="button"
                              onClick={onEnterClassroom}
                              className="text-[#00FFA3] font-extrabold hover:underline cursor-pointer"
                            >
                              جرّب المختبر الآن ←
                            </button>
                          </div>
                        </div>
                      )}

                      {holoPreview === 'imc' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-slate-100">
                              مؤشر الكتلة الجسدية IMC
                            </span>
                            <span className="text-[11px] font-mono-num text-[#00FFA3]">
                              20.4 kg/m² · PN
                            </span>
                          </div>
                          <svg
                            viewBox="0 0 260 120"
                            className="w-full h-28"
                            role="img"
                            aria-label="منحنى مؤشر الكتلة الجسدية للتلاميذ"
                          >
                            <path
                              d="M20 92 Q95 82, 165 62 T242 36"
                              fill="none"
                              stroke="#00FFA3"
                              strokeWidth="2.6"
                            />
                            <path
                              d="M20 75 Q95 62, 165 40 T242 18"
                              fill="none"
                              stroke="#FF9F1C"
                              strokeWidth="1.8"
                              strokeDasharray="4 4"
                            />
                            <path
                              d="M20 105 Q95 98, 165 82 T242 62"
                              fill="none"
                              stroke="#00E5FF"
                              strokeWidth="1.8"
                              strokeDasharray="4 4"
                            />
                            <circle
                              cx="152"
                              cy="66"
                              r="6"
                              fill="#00FFA3"
                              stroke="#070B14"
                              strokeWidth="2"
                            />
                            <text
                              x="164"
                              y="69"
                              fill="#E2E8F0"
                              fontSize="10"
                              fontWeight="700"
                            >
                              وزن عادي (PN)
                            </text>
                          </svg>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/10">
                            <span>حساب فوري للطاقة و IMC</span>
                            <button
                              type="button"
                              onClick={onEnterClassroom}
                              className="text-[#00FFA3] font-extrabold hover:underline cursor-pointer"
                            >
                              افتح الحاسبة ←
                            </button>
                          </div>
                        </div>
                      )}

                      {holoPreview === 'mindmap' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-slate-100">
                              خريطة ذهنية تفاعلية
                            </span>
                            <span className="text-[11px] font-latin text-[#00E5FF]">
                              Bilingue AR / Biof
                            </span>
                          </div>
                          <svg
                            viewBox="0 0 260 120"
                            className="w-full h-28"
                            role="img"
                            aria-label="خريطة ذهنية ثنائية اللغة"
                          >
                            <line
                              x1="130"
                              y1="60"
                              x2="52"
                              y2="28"
                              stroke="#00E5FF"
                              strokeWidth="1.6"
                            />
                            <line
                              x1="130"
                              y1="60"
                              x2="208"
                              y2="28"
                              stroke="#00FFA3"
                              strokeWidth="1.6"
                            />
                            <line
                              x1="130"
                              y1="60"
                              x2="52"
                              y2="92"
                              stroke="#FF9F1C"
                              strokeWidth="1.6"
                            />
                            <line
                              x1="130"
                              y1="60"
                              x2="208"
                              y2="92"
                              stroke="#00E5FF"
                              strokeWidth="1.6"
                            />
                            <rect
                              x="86"
                              y="44"
                              width="88"
                              height="32"
                              rx="8"
                              fill="#00FFA3"
                            />
                            <text
                              x="130"
                              y="64"
                              textAnchor="middle"
                              fill="#070B14"
                              fontSize="10"
                              fontWeight="800"
                            >
                              التربية الغذائية
                            </text>
                            <rect
                              x="10"
                              y="14"
                              width="78"
                              height="24"
                              rx="6"
                              fill="#101B33"
                              stroke="#00E5FF"
                              strokeWidth="1.2"
                            />
                            <text
                              x="49"
                              y="29"
                              textAnchor="middle"
                              fill="#E2E8F0"
                              fontSize="9"
                              fontWeight="700"
                            >
                              الكواشف
                            </text>
                            <rect
                              x="172"
                              y="14"
                              width="78"
                              height="24"
                              rx="6"
                              fill="#101B33"
                              stroke="#00FFA3"
                              strokeWidth="1.2"
                            />
                            <text
                              x="211"
                              y="29"
                              textAnchor="middle"
                              fill="#E2E8F0"
                              fontSize="9"
                              fontWeight="700"
                            >
                              Bâtisseurs
                            </text>
                            <rect
                              x="10"
                              y="80"
                              width="78"
                              height="24"
                              rx="6"
                              fill="#101B33"
                              stroke="#FF9F1C"
                              strokeWidth="1.2"
                            />
                            <text
                              x="49"
                              y="95"
                              textAnchor="middle"
                              fill="#E2E8F0"
                              fontSize="9"
                              fontWeight="700"
                            >
                              Carences
                            </text>
                            <rect
                              x="172"
                              y="80"
                              width="78"
                              height="24"
                              rx="6"
                              fill="#101B33"
                              stroke="#00E5FF"
                              strokeWidth="1.2"
                            />
                            <text
                              x="211"
                              y="95"
                              textAnchor="middle"
                              fill="#E2E8F0"
                              fontSize="9"
                              fontWeight="700"
                            >
                              Ration kJ
                            </text>
                          </svg>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/10">
                            <span>وضع الامتحان لإخفاء الأسماء</span>
                            <button
                              type="button"
                              onClick={onEnterClassroom}
                              className="text-[#00FFA3] font-extrabold hover:underline cursor-pointer"
                            >
                              استكشف الخريطة ←
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Interactive Talking Cartoon Teacher Mascot (5 cols) */}
                  <div className="sm:col-span-5 flex flex-col items-center">
                    <button
                      type="button"
                      onClick={handleTeacherHeroClick}
                      aria-label="اضغط للاستماع إلى ترحيب الأستاذ عبد الصمد"
                      className="group relative flex flex-col items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FFA3] rounded-2xl p-2 cursor-pointer"
                    >
                      {/* Radial Aura */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-2 rounded-full blur-2xl opacity-30 group-hover:opacity-45 transition-opacity pointer-events-none"
                        style={{
                          background:
                            'radial-gradient(circle, #00FFA3 0%, rgba(0,229,255,0.4) 55%, transparent 75%)',
                        }}
                      />

                      {/* Mirrored so pointer aims directly at the holographic card on his right in RTL */}
                      <div className="-scale-x-100">
                        <svg
                          viewBox="0 0 220 225"
                          className="relative z-10 w-44 h-44 sm:w-48 sm:h-48 animate-mascot-float"
                          role="img"
                          aria-label="الأستاذ عبد الصمد يشير بعصا الشرح المضيئة نحو المختبر"
                        >
                          <defs>
                            <linearGradient
                              id="heroCoat"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop offset="0%" stopColor="#F8FAFC" />
                              <stop offset="100%" stopColor="#CBD5E1" />
                            </linearGradient>
                            <linearGradient
                              id="heroShirt"
                              x1="0"
                              y1="0"
                              x2="1"
                              y2="1"
                            >
                              <stop offset="0%" stopColor="#0F2942" />
                              <stop offset="100%" stopColor="#081628" />
                            </linearGradient>
                            <linearGradient
                              id="heroSkin"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop offset="0%" stopColor="#F3C59F" />
                              <stop offset="100%" stopColor="#E1A87C" />
                            </linearGradient>
                            <linearGradient
                              id="heroWood"
                              x1="0"
                              y1="0"
                              x2="1"
                              y2="0"
                            >
                              <stop offset="0%" stopColor="#8C522B" />
                              <stop offset="65%" stopColor="#C98A52" />
                              <stop offset="100%" stopColor="#E6B27A" />
                            </linearGradient>
                            <filter
                              id="heroLaserGlow"
                              x="-60%"
                              y="-60%"
                              width="220%"
                              height="220%"
                            >
                              <feGaussianBlur
                                stdDeviation="3.5"
                                result="blur"
                              />
                              <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                          </defs>

                          {/* Acoustic Soundwaves when speaking */}
                          {isSpeaking && !isMuted && (
                            <g
                              stroke="#00FFA3"
                              strokeWidth="2.4"
                              fill="none"
                              strokeLinecap="round"
                            >
                              <path
                                className="animate-soundwave-1"
                                d="M168 78 Q178 92 168 106"
                              />
                              <path
                                className="animate-soundwave-2"
                                d="M177 70 Q192 92 177 114"
                              />
                              <path
                                className="animate-soundwave-3"
                                d="M187 62 Q206 92 187 122"
                              />
                            </g>
                          )}

                          <ellipse
                            cx="118"
                            cy="212"
                            rx="52"
                            ry="7"
                            fill="#000000"
                            opacity="0.38"
                          />

                          {/* Lab Coat */}
                          <path
                            d="M74 146 C74 128, 162 128, 162 146 L168 206 C168 211, 164 214, 158 214 L78 214 C72 214, 68 211, 68 206 Z"
                            fill="url(#heroCoat)"
                          />
                          <path
                            d="M101 134 L135 134 L128 214 L108 214 Z"
                            fill="url(#heroShirt)"
                          />
                          <path
                            d="M114 144 L122 144 L124 182 L118 190 L112 182 Z"
                            fill="#00FFA3"
                          />
                          <path
                            d="M101 134 L90 156 L104 166 L96 178 L110 214 L106 134 Z"
                            fill="#E2E8F0"
                            stroke="#94A3B8"
                            strokeWidth="1"
                          />
                          <path
                            d="M135 134 L146 156 L132 166 L140 178 L126 214 L130 134 Z"
                            fill="#E2E8F0"
                            stroke="#94A3B8"
                            strokeWidth="1"
                          />
                          <rect
                            x="136"
                            y="168"
                            width="20"
                            height="22"
                            rx="3"
                            fill="#E2E8F0"
                            stroke="#94A3B8"
                            strokeWidth="1.2"
                          />
                          <rect
                            x="142"
                            y="160"
                            width="3.5"
                            height="11"
                            rx="1.5"
                            fill="#00E5FF"
                          />
                          <rect
                            x="148"
                            y="162"
                            width="3.5"
                            height="9"
                            rx="1.5"
                            fill="#00FFA3"
                          />

                          <rect
                            x="108"
                            y="116"
                            width="20"
                            height="22"
                            rx="8"
                            fill="#D99B70"
                          />

                          {/* Head */}
                          <circle cx="80" cy="88" r="8" fill="#E1A87C" />
                          <circle cx="156" cy="88" r="8" fill="#E1A87C" />
                          <rect
                            x="82"
                            y="42"
                            width="72"
                            height="82"
                            rx="34"
                            fill="url(#heroSkin)"
                          />
                          <path
                            d="M78 74 C76 42, 95 28, 120 28 C145 28, 160 44, 158 74 C153 56, 144 48, 124 50 C108 52, 94 46, 84 62 Z"
                            fill="#1E293B"
                          />
                          <path
                            d="M88 100 C92 120, 105 126, 118 126 C131 126, 144 120, 148 100 C143 111, 134 117, 118 117 C102 117, 93 111, 88 100 Z"
                            fill="#1E293B"
                            opacity="0.88"
                          />
                          <path
                            d="M94 67 Q103 63 111 66"
                            stroke="#1E293B"
                            strokeWidth="2.8"
                            strokeLinecap="round"
                            fill="none"
                          />
                          <path
                            d="M125 66 Q134 63 143 67"
                            stroke="#1E293B"
                            strokeWidth="2.8"
                            strokeLinecap="round"
                            fill="none"
                          />
                          <circle cx="103" cy="82" r="3.6" fill="#0F172A" />
                          <circle cx="104.3" cy="80.7" r="1.1" fill="#FFFFFF" />
                          <circle cx="133" cy="82" r="3.6" fill="#0F172A" />
                          <circle cx="134.3" cy="80.7" r="1.1" fill="#FFFFFF" />
                          <rect
                            x="89"
                            y="72"
                            width="26"
                            height="19"
                            rx="5"
                            fill="rgba(0, 229, 255, 0.16)"
                            stroke="#0F172A"
                            strokeWidth="2.6"
                          />
                          <rect
                            x="121"
                            y="72"
                            width="26"
                            height="19"
                            rx="5"
                            fill="rgba(0, 229, 255, 0.16)"
                            stroke="#0F172A"
                            strokeWidth="2.6"
                          />
                          <path
                            d="M115 80 L121 80"
                            stroke="#0F172A"
                            strokeWidth="2.4"
                          />
                          <path
                            d="M118 83 L116 94 L121 95"
                            stroke="#C98A60"
                            strokeWidth="2"
                            strokeLinecap="round"
                            fill="none"
                          />

                          {/* Mouth Lip-Sync */}
                          {isSpeaking ? (
                            <ellipse
                              cx="118"
                              cy="106"
                              rx="8.5"
                              ry="5.5"
                              fill="#7F1D1D"
                              stroke="#0F172A"
                              strokeWidth="1.8"
                              className="animate-lip-sync"
                            />
                          ) : (
                            <path
                              d="M108 103 Q118 113 128 103"
                              stroke="#0F172A"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                              fill="none"
                            />
                          )}

                          {/* Glowing Pointer Arm */}
                          <g className="animate-pointer-explain">
                            <path
                              d="M84 146 C68 152, 58 158, 52 152"
                              stroke="#E2E8F0"
                              strokeWidth="16"
                              strokeLinecap="round"
                              fill="none"
                            />
                            <circle cx="50" cy="150" r="8.5" fill="#E1A87C" />
                            <line
                              x1="54"
                              y1="154"
                              x2="12"
                              y2="94"
                              stroke="url(#heroWood)"
                              strokeWidth="5"
                              strokeLinecap="round"
                            />
                            <circle
                              cx="11"
                              cy="92"
                              r="6"
                              fill="#00FFA3"
                              filter="url(#heroLaserGlow)"
                            />
                            <circle cx="11" cy="92" r="2.3" fill="#FFFFFF" />
                          </g>

                          <path
                            d="M158 148 C169 162, 170 182, 162 192"
                            stroke="#E2E8F0"
                            strokeWidth="14"
                            strokeLinecap="round"
                            fill="none"
                          />
                          <circle cx="160" cy="193" r="7.5" fill="#E1A87C" />
                        </svg>
                      </div>

                      <div className="mt-1 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#00FFA3] group-hover:text-white transition-colors">
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>
                          {isSpeaking
                            ? 'الأستاذ عبد الصمد يرحب بك...'
                            : 'اضغط للاستماع للأستاذ عبد الصمد'}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Why Choose Us — Asymmetric Bento Grid (Visual & Concise) */}
        <section
          id="features"
          className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12 lg:py-16 border-t border-white/10"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-bold text-[#00E5FF]">
              لماذا يختار تلاميذ الثالثة إعدادي منصتنا؟
            </p>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-slate-50 mt-2"
              style={{ textWrap: 'balance' }}
            >
              تعلم بصري وتجريبي يحوّل دروس SVT إلى متعة حقيقية
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Bento Card 1 (Marquee Wide — 7 cols) */}
            <article className="lg:col-span-7 rounded-2xl bg-[#0D1424]/85 backdrop-blur-xl border border-white/10 p-6 flex flex-col justify-between gap-5 hover:border-[#00FFA3]/40 transition-colors">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono-num font-bold text-[#00FFA3]">
                    01. المختبرات التفاعلية
                  </span>
                  <FlaskConical className="w-5 h-5 text-[#00FFA3]" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-50">
                  مختبرات 3D وتجارب حية
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
                  لمس، تفاعل، واكتشف الظواهر البيولوجية والجيولوجية بدل قراءة نصوص
                  طويلة. أضف الكواشف، راقب تغير الألوان، واستنتج القاعدة بنفسك.
                </p>
              </div>

              <div className="rounded-xl bg-[#070B14] border border-white/10 p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <div className="font-mono-num font-extrabold text-[#00FFA3] text-base">
                      7 كواشف
                    </div>
                    <div className="text-slate-400">تفاعلات فورية</div>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div>
                    <div className="font-mono-num font-extrabold text-[#00E5FF] text-base">
                      3D / SVG
                    </div>
                    <div className="text-slate-400">محاكاة دقيقة</div>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div>
                    <div className="font-mono-num font-extrabold text-[#FF9F1C] text-base">
                      شرح صوتي
                    </div>
                    <div className="text-slate-400">بصوت الأستاذ</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onEnterClassroom}
                  className="text-xs font-extrabold text-[#00FFA3] hover:underline whitespace-nowrap cursor-pointer"
                >
                  افتح المختبر الآن ←
                </button>
              </div>
            </article>

            {/* Bento Card 2 (Interactive Biof Toggle Preview — 5 cols) */}
            <article className="lg:col-span-5 rounded-2xl bg-[#0D1424]/85 backdrop-blur-xl border border-white/10 p-6 flex flex-col justify-between gap-5 hover:border-[#00E5FF]/40 transition-colors">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono-num font-bold text-[#00E5FF]">
                    02. عربي / Biof
                  </span>
                  <Network className="w-5 h-5 text-[#00E5FF]" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-50">
                  خرائط ذهنية ثنائية اللغة (عربي / Biof)
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  رسوم تخطيطية تفاعلية مع وضع إخفاء الأسماء للتدرب على أسئلة
                  الامتحان الجهوي بسرعة ورسوخ.
                </p>
              </div>

              {/* Mini live demo toggle */}
              <div className="rounded-xl bg-[#070B14] border border-white/10 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-400">
                    جرب وضع المراجعة:
                  </span>
                  <button
                    type="button"
                    onClick={() => setBentoMindMapQuiz((v) => !v)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                      bentoMindMapQuiz
                        ? 'bg-[#FF9F1C] text-[#070B14]'
                        : 'bg-white/10 text-slate-200 hover:bg-white/15'
                    }`}
                  >
                    {bentoMindMapQuiz ? 'إظهار المصطلحات' : 'إخفاء للامتحان'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <div className="rounded-lg bg-[#0D1424] border border-white/10 px-3 py-2 text-center">
                    {bentoMindMapQuiz ? (
                      <span className="text-[#FF9F1C]">؟ ؟ ؟</span>
                    ) : (
                      <span className="text-slate-100">
                        أغذية بنائية ·{' '}
                        <span className="font-latin text-[#00E5FF]">
                          Bâtisseurs
                        </span>
                      </span>
                    )}
                  </div>
                  <div className="rounded-lg bg-[#0D1424] border border-white/10 px-3 py-2 text-center">
                    {bentoMindMapQuiz ? (
                      <span className="text-[#FF9F1C]">؟ ؟ ؟</span>
                    ) : (
                      <span className="text-slate-100">
                        أغذية طاقية ·{' '}
                        <span className="font-latin text-[#00FFA3]">
                          Énergétiques
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>

            {/* Bento Card 3 (Full Width Proof & Exam Readiness — 12 cols) */}
            <article className="lg:col-span-12 rounded-2xl bg-[#0D1424]/85 backdrop-blur-xl border border-white/10 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center hover:border-[#FF9F1C]/40 transition-colors">
              <div className="lg:col-span-7 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono-num font-bold text-[#FF9F1C]">
                  <Award className="w-4 h-4" />
                  <span>03. التحضير للامتحان الجهوي الموحد</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-50">
                  تحضير منهجي للامتحان الجهوي
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                  تمارين استرداد المعارف والاستدلال العلمي وتحليل المبيانات (منحنى
                  الفئران، حساب الكلتة الطاقية بالكيلوجول، ومؤشر IMC) مع تصحيح
                  فوري وصوتي ونظام نقاط XP محفّز.
                </p>
              </div>

              <div className="lg:col-span-5 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-[#070B14] border border-white/10 p-3.5">
                  <div className="text-lg font-mono-num font-extrabold text-[#00FFA3]">
                    8 نقاط
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    استرداد المعارف
                  </div>
                </div>
                <div className="rounded-xl bg-[#070B14] border border-white/10 p-3.5">
                  <div className="text-lg font-mono-num font-extrabold text-[#00E5FF]">
                    12 نقطة
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    الاستدلال العلمي
                  </div>
                </div>
                <div className="rounded-xl bg-[#070B14] border border-white/10 p-3.5">
                  <div className="text-lg font-mono-num font-extrabold text-[#FF9F1C]">
                    20/20
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    الهدف الجهوي
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* 4. Curriculum Roadmap Preview (برنامج السنة - 3AC) */}
        <section
          id="methodology"
          className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12 lg:py-16 border-t border-white/10"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-bold text-[#00FFA3]">
                برنامج السنة الدراسية · الثالثة إعدادي (3AC)
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-50 mt-2">
                خريطة دروس علوم الحياة والأرض (الدورة الأولى والثانية)
              </h2>
            </div>
            <button
              type="button"
              onClick={onEnterClassroom}
              className="text-sm font-extrabold text-[#00FFA3] hover:underline whitespace-nowrap cursor-pointer"
            >
              ابدأ بالدرس الأول مجاناً الآن ←
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROADMAP_MODULES.map((mod) => {
              const Icon = mod.icon;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() =>
                    mod.freeDemo
                      ? onEnterClassroom()
                      : scrollToSection('pricing')
                  }
                  className={`text-right rounded-2xl p-5 border transition-all flex flex-col justify-between gap-4 cursor-pointer ${
                    mod.freeDemo
                      ? 'bg-[#00FFA3]/8 border-[#00FFA3]/55 hover:border-[#00FFA3] shadow-[0_0_28px_rgba(0,255,163,0.12)]'
                      : 'bg-[#0D1424]/85 border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-400">
                        <span
                          className="font-mono-num font-extrabold"
                          style={{ color: mod.accent }}
                        >
                          {mod.num}
                        </span>{' '}
                        · {mod.semester}
                      </span>
                      <Icon
                        className="w-5 h-5 shrink-0"
                        style={{ color: mod.accent }}
                      />
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-slate-50">
                        {mod.titleAr}
                      </h3>
                      <p className="text-xs font-latin text-[#00E5FF] mt-0.5">
                        {mod.titleFr}
                      </p>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {mod.highlights}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                    {mod.freeDemo ? (
                      <>
                        <span className="text-[#00FFA3] inline-flex items-center gap-1.5">
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>متاح مجاناً للتجربة</span>
                        </span>
                        <span className="text-slate-100">افتح الدرس ←</span>
                      </>
                    ) : (
                      <>
                        <span className="text-slate-400 inline-flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-slate-500" />
                          <span>ضمن باقات الاشتراك السنوية</span>
                        </span>
                        <span className="text-[#00E5FF]">اشترك</span>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 5. High-Converting Pricing Section (باقات الاشتراك السنوية) */}
        <section
          id="pricing"
          className="max-w-[1440px] mx-auto px-4 sm:px-6 py-14 lg:py-20 border-t border-white/10"
        >
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold text-[#00FFA3]">
              باقات الاشتراك السنوية · استثمار لمستقبلك
            </p>
            <h2
              className="text-2xl sm:text-4xl font-extrabold text-slate-50 mt-2"
              style={{ textWrap: 'balance' }}
            >
              اختر الباقة المناسبة لتفوقك في الامتحان الجهوي
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2">
              دفع مرة واحدة بالدرهم المغربي للموسم الدراسي بالكامل · بدون أي رسوم
              خفية
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto items-stretch">
            {/* Card 1: الباقة الأساسية (199 درهم) */}
            <div className="rounded-2xl bg-[#0D1424]/90 backdrop-blur-xl border border-white/12 p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#00E5FF]">
                    التعلم الذاتي التفاعلي
                  </span>
                  <Scale className="w-5 h-5 text-[#00E5FF]" />
                </div>

                <h3 className="text-2xl font-extrabold text-slate-50 mt-2">
                  الباقة الأساسية
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  وصول غير محدود لجميع الدروس التفاعلية طيلة الموسم الدراسي
                </p>

                <div className="mt-6 pb-6 border-b border-white/10 flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-mono-num font-extrabold text-slate-50">
                    199
                  </span>
                  <span className="text-lg font-extrabold text-[#00E5FF]">
                    درهم
                  </span>
                  <span className="text-xs text-slate-400">/ في السنة كاملة</span>
                </div>

                <ul className="mt-6 space-y-3.5 text-sm">
                  <li className="flex items-start gap-2.5 text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-[#00FFA3] shrink-0 mt-0.5" />
                    <span>الولوج الكامل لجميع دروس الدورة الأولى والثانية (3AC).</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-[#00FFA3] shrink-0 mt-0.5" />
                    <span>جميع مختبرات 3D والتجارب الكيميائية التفاعلية.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-[#00FFA3] shrink-0 mt-0.5" />
                    <span>الخرائط الذهنية والرسوم التخطيطية (عربي + Biof).</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-[#00FFA3] shrink-0 mt-0.5" />
                    <span>الأستاذ الكرتوني التفاعلي والتمارين المصححة تلقائياً.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-500">
                    <XCircle className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                    <span>بدون متابعة مباشرة أو حصص لايف أسبوعية.</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onOpenSubscribe('basic')}
                className="mt-8 w-full py-3.5 px-5 rounded-xl bg-white/8 hover:bg-white/15 border border-white/15 hover:border-[#00E5FF] text-slate-50 text-sm font-extrabold transition-colors cursor-pointer"
              >
                اختر الباقة الأساسية (199 درهم)
              </button>
            </div>

            {/* Card 2: الباقة المميزة (349 درهم) — Highlighted */}
            <div className="relative rounded-2xl bg-[#0D1424] backdrop-blur-xl border-2 border-[#00FFA3] p-7 flex flex-col justify-between shadow-[0_0_45px_rgba(0,255,163,0.18)]">
              {/* Top Highlight Strip */}
              <div className="mb-4 pb-3 border-b border-[#00FFA3]/25 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#FF9F1C]">
                  <Flame className="w-4 h-4" />
                  <span>الأكثر اختياراً من التلاميذ والأولياء</span>
                </span>
                <Sparkles className="w-4 h-4 text-[#00FFA3]" />
              </div>

              <div>
                <span className="text-xs font-bold text-[#00FFA3]">
                  المواكبة الشاملة + لايف أسبوعي
                </span>

                <h3 className="text-2xl font-extrabold text-slate-50 mt-1.5">
                  الباقة المميزة (VIP)
                </h3>
                <p className="text-sm text-slate-300 mt-1">
                  متابعة شخصية من الأستاذ عبد الصمد لضمان أعلى نقطة في الجهوي
                </p>

                <div className="mt-6 pb-6 border-b border-white/10 flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-mono-num font-extrabold text-[#00FFA3]">
                    349
                  </span>
                  <span className="text-lg font-extrabold text-[#00FFA3]">
                    درهم
                  </span>
                  <span className="text-xs text-slate-300">/ في السنة كاملة</span>
                </div>

                <ul className="mt-6 space-y-3.5 text-sm">
                  <li className="flex items-start gap-2.5 text-slate-100 font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-[#FF9F1C] shrink-0 mt-0.5" />
                    <span>كل مميزات الباقة الأساسية (199 درهم) بالكامل.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-100 font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-[#00E5FF] shrink-0 mt-0.5" />
                    <span>
                      حصة بث مباشر (Live) تفاعلية كل أسبوع مع الأستاذ عبد الصمد.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-100 font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-[#00FFA3] shrink-0 mt-0.5" />
                    <span>
                      متابعة شخصية مستمرة والإجابة على جميع تساؤلات التلميذ.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-[#00E5FF] shrink-0 mt-0.5" />
                    <span>
                      تصحيح ومناقشة نماذج الامتحانات الجهوية الموحدة خطوة بخطوة.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-[#FF9F1C] shrink-0 mt-0.5" />
                    <span>
                      الولوج لمجموعة التلاميذ المتفوقين (VIP) طيلة السنة.
                    </span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onOpenSubscribe('vip')}
                className="mt-8 w-full py-3.5 px-5 rounded-xl bg-[#00FFA3] text-[#070B14] hover:bg-[#2dffb4] text-sm sm:text-base font-extrabold transition-all shadow-[0_0_24px_rgba(0,255,163,0.3)] cursor-pointer"
              >
                اشترك في باقة المتابعة (349 درهم)
              </button>
            </div>
          </div>
        </section>

        {/* 6. FAQ Section (الأسئلة الشائعة) */}
        <section
          id="faq"
          className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12 lg:py-16 border-t border-white/10"
        >
          <div className="max-w-3xl mx-auto">
            <div className="text-center">
              <p className="text-xs font-bold text-[#00E5FF]">الأسئلة الشائعة</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-50 mt-2">
                كل ما تحتاج معرفته قبل الاشتراك
              </h2>
            </div>

            <div className="mt-8 space-y-3">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={item.q}
                    className="rounded-xl bg-[#0D1424]/85 border border-white/10 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                      aria-expanded={isOpen}
                      className="w-full px-5 py-4 flex items-center justify-between gap-4 text-right cursor-pointer hover:bg-white/3 transition-colors"
                    >
                      <span className="text-sm sm:text-base font-bold text-slate-100">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#00FFA3] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 pt-1 text-sm text-slate-300 leading-relaxed border-t border-white/8">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="relative z-10 border-t border-white/10 py-6 px-4 sm:px-6 bg-[#070B14]">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-latin font-extrabold text-slate-200">
              ABDESAMAD BAHOUS SVT
            </span>
            <span aria-hidden="true">·</span>
            <span>السنة الثالثة إعدادي (3AC عام + Biof) · المغرب</span>
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={onEnterClassroom}
              className="text-[#00FFA3] font-bold hover:underline cursor-pointer"
            >
              تجربة الدرس الأول مجاناً
            </button>
            <button
              type="button"
              onClick={() => onOpenSubscribe('vip')}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              الاشتراك السنوي
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
