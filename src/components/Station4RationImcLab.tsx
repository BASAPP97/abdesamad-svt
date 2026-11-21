import React, { useState } from 'react';
import { Scale, Calculator, BarChart3, CheckCircle2, XCircle, Activity } from 'lucide-react';
import type { MascotSignal } from '../data/unitsData';

interface Station4RationImcLabProps {
  onTeacherSpeak: (signal: MascotSignal) => void;
}

type EnergyChartTab = 'activity' | 'age' | 'physio';

const ENERGY_DATASETS: Record<
  EnergyChartTab,
  {
    unit: string;
    maxVal: number;
    items: { labelAr: string; labelFr: string; val: number; color: string; speech: string }[];
  }
> = {
  activity: {
    unit: 'kJ/h',
    maxVal: 2800,
    items: [
      { labelAr: 'المشي', labelFr: 'Marche', val: 600, color: '#00E5FF', speech: 'المشي الهادئ يستهلك حوالي 600 كيلوجول في الساعة.' },
      { labelAr: 'دراجي', labelFr: 'Cyclisme', val: 1400, color: '#00FFA3', speech: 'ركوب الدراجة يرفع المصروف الطاقي إلى 1400 كيلوجول في الساعة.' },
      { labelAr: 'كرة القدم', labelFr: 'Football', val: 1800, color: '#FF9F1C', speech: 'لعب كرة القدم يتطلب 1800 كيلوجول في الساعة.' },
      { labelAr: 'الجري السريع', labelFr: 'Course', val: 2600, color: '#EF4444', speech: 'الجري نشاط شاق يستهلك 2600 كيلوجول في الساعة!' },
    ],
  },
  age: {
    unit: 'kJ/jour',
    maxVal: 17500,
    items: [
      { labelAr: 'طفل', labelFr: 'Enfant', val: 7500, color: '#38BDF8', speech: 'الطفل في طور النمو يحتاج قرابة 7500 كيلوجول يومياً.' },
      { labelAr: 'مراهقة', labelFr: 'Adolescente', val: 10000, color: '#A855F7', speech: 'المراهقة تحتاج 10000 كيلوجول يومياً للنمو والنشاط.' },
      { labelAr: 'مراهق', labelFr: 'Adolescent', val: 12500, color: '#00FFA3', speech: 'المراهق في ذروة النمو يحتاج 12500 كيلوجول يومياً!' },
      { labelAr: 'بالغ', labelFr: 'Adulte', val: 11300, color: '#00E5FF', speech: 'الرجل البالغ ذو النشاط العادي يحتاج حوالي 11300 كيلوجول.' },
      { labelAr: 'رياضي', labelFr: 'Sportif', val: 16500, color: '#FF9F1C', speech: 'الرياضي يبذل مجهوداً عضلياً كبيراً فيحتاج 16500 كيلوجول يومياً!' },
    ],
  },
  physio: {
    unit: 'kJ/jour',
    maxVal: 12000,
    items: [
      { labelAr: 'امرأة عادية', labelFr: 'Femme normale', val: 8400, color: '#00E5FF', speech: 'المرأة البالغة العادية تحتاج 8400 كيلوجول يومياً.' },
      { labelAr: 'امرأة حامل', labelFr: 'Femme enceinte', val: 9500, color: '#FF9F1C', speech: 'الحامل تحتاج 9500 كيلوجول يومياً لتغذية الجنين ونموه.' },
      { labelAr: 'امرأة مرضعة', labelFr: 'Femme allaitante', val: 10500, color: '#00FFA3', speech: 'المرضعة تحتاج 10500 كيلوجول يومياً لإنتاج الحليب الغني للرضيع!' },
    ],
  },
};

export const Station4RationImcLab: React.FC<Station4RationImcLabProps> = ({
  onTeacherSpeak,
}) => {
  // 1. Balance Seesaw (-100 = Carences, 0 = Equilibre, +100 = Obesite)
  const [seesawVal, setSeesawVal] = useState<number>(0);

  // 2. Ration Energy & Equilibrium Calculator
  const [glucides, setGlucides] = useState<number>(380);
  const [protAnim, setProtAnim] = useState<number>(45);
  const [protVeg, setProtVeg] = useState<number>(45);
  const [lipides, setLipides] = useState<number>(90);

  // 3. Energy Needs Chart tab
  const [chartTab, setChartTab] = useState<EnergyChartTab>('activity');

  // 4. IMC Calculator & Curve Plotter
  const [gender, setGender] = useState<'boy' | 'girl'>('boy');
  const [age, setAge] = useState<number>(15);
  const [weight, setWeight] = useState<number>(56);
  const [heightCm, setHeightCm] = useState<number>(165);

  // Calculations
  const totalProt = Math.max(1, protAnim + protVeg);
  const kJGluc = glucides * 17;
  const kJProt = totalProt * 17;
  const kJLip = lipides * 38;
  const totalKj = kJGluc + kJProt + kJLip;

  const ratioGP = glucides / totalProt;
  const ratioLP = lipides / totalProt;
  const ratioAnimVeg = protVeg > 0 ? protAnim / protVeg : 2;

  const okGP = ratioGP >= 3.5 && ratioGP <= 5.0;
  const okLP = ratioLP >= 0.85 && ratioLP <= 1.15;
  const okAV = ratioAnimVeg >= 1 / 3;

  // Seesaw status
  const seesawState =
    seesawVal < -22 ? 'under' : seesawVal > 22 ? 'over' : 'balanced';

  // IMC calculation
  const heightM = heightCm / 100;
  const imc = Number((weight / (heightM * heightM)).toFixed(1));

  // Age-adapted Moroccan teenage IMC classification thresholds (10..18)
  const ageOffset = (age - 15) * 0.55 + (gender === 'girl' ? -0.3 : 0);
  const pnLow = 16.5 + ageOffset;
  const spStart = 23.0 + ageOffset;
  const odStart = 27.5 + ageOffset;
  const osStart = 31.5 + ageOffset;

  const imcStatus =
    imc < pnLow
      ? { code: 'نحافة', fr: 'Insuffisance', color: '#00E5FF' }
      : imc < spStart
        ? { code: 'PN · وزن عادي', fr: 'Poids normal', color: '#00FFA3' }
        : imc < odStart
          ? { code: 'SP · فائض وزني', fr: 'Surpoids', color: '#FF9F1C' }
          : imc < osStart
            ? { code: 'OD · سمنة متوسطة', fr: 'Obésité modérée', color: '#F97316' }
            : { code: 'OS · سمنة حادة', fr: 'Obésité sévère', color: '#EF4444' };

  // SVG IMC Chart Mapping (Age 10..18, IMC 12..36)
  const imcW = 540;
  const imcH = 220;
  const iL = 44;
  const iR = 20;
  const iT = 18;
  const iB = 34;
  const mapAgeX = (a: number) => iL + ((a - 10) / 8) * (imcW - iL - iR);
  const mapImcY = (v: number) =>
    iT + (1 - (Math.min(36, Math.max(12, v)) - 12) / 24) * (imcH - iT - iB);

  const buildBandPath = (offsetAt10: number, offsetAt18: number) => {
    const pts = [10, 12, 14, 16, 18].map((a) => {
      const f = (a - 10) / 8;
      const val = offsetAt10 + f * (offsetAt18 - offsetAt10) + (gender === 'girl' ? -0.3 : 0);
      return `${mapAgeX(a)},${mapImcY(val)}`;
    });
    return `M ${pts.join(' L ')}`;
  };

  const currentDataset = ENERGY_DATASETS[chartTab];

  return (
    <div className="space-y-5">
      {/* 1. Interactive Balance Seesaw + 2. Ration Energy & Equilibrium Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Balance Seesaw Simulation */}
        <section className="lg:col-span-5 rounded-2xl bg-[#0D1424]/90 border border-white/10 p-4 sm:p-5 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#00FFA3]" />
              <h2 className="text-sm font-extrabold text-slate-50">
                ميزان التوازن الغذائي
              </h2>
            </div>
            <span
              className="text-xs font-extrabold"
              style={{
                color:
                  seesawState === 'balanced'
                    ? '#00FFA3'
                    : seesawState === 'under'
                      ? '#00E5FF'
                      : '#EF4444',
              }}
            >
              {seesawState === 'balanced'
                ? 'توازن غذائي ✓'
                : seesawState === 'under'
                  ? 'تفريط (فاقات)'
                  : 'إفراط (سمنة)'}
            </span>
          </div>

          <svg viewBox="0 0 300 160" className="w-full h-36 select-none">
            {/* Fulcrum Triangle */}
            <polygon points="150,96 128,144 172,144" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
            <circle cx="150" cy="96" r="7" fill="#00FFA3" />

            {/* Tilting Seesaw Plank */}
            <g
              style={{
                transformOrigin: '150px 96px',
                transform: `rotate(${(seesawVal / 100) * -18}deg)`,
                transition: 'transform 220ms ease-out',
              }}
            >
              <rect
                x="32"
                y="90"
                width="236"
                height="12"
                rx="6"
                fill={
                  seesawState === 'balanced'
                    ? '#00FFA3'
                    : seesawState === 'under'
                      ? '#00E5FF'
                      : '#EF4444'
                }
              />
              {/* Left side: الإفراط (Obésité) */}
              <rect x="40" y="54" width="66" height="34" rx="8" fill="#EF4444" opacity={seesawVal > 22 ? 0.9 : 0.25} />
              <text x="73" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800">الإفراط</text>

              {/* Right side: التفريط (Carences) */}
              <rect x="194" y="54" width="66" height="34" rx="8" fill="#00E5FF" opacity={seesawVal < -22 ? 0.9 : 0.25} />
              <text x="227" y="75" textAnchor="middle" fill="#070B14" fontSize="11" fontWeight="800">التفريط</text>
            </g>
          </svg>

          <div className="space-y-2">
            <input
              type="range"
              min={-100}
              max={100}
              value={seesawVal}
              onChange={(e) => {
                const v = Number(e.target.value);
                setSeesawVal(v);
                if (v < -50) {
                  onTeacherSpeak({
                    mood: 'hint',
                    badgeAr: 'التفريط ← الفاقات الغذائية',
                    badgeFr: 'Sous-alimentation → Carences',
                    speechText: 'التفريط في التغذية يسبب الهزال والفاقات الغذائية الخطيرة!',
                    shouldSpeak: true,
                  });
                } else if (v > 50) {
                  onTeacherSpeak({
                    mood: 'hint',
                    badgeAr: 'الإفراط ← السمنة وأمراض القلب',
                    badgeFr: 'Surpoids & Maladies cardiovasculaires',
                    speechText: 'الإفراط في السكريات والدهنيات يؤدي للسمنة والسكري وأمراض القلب والشرايين!',
                    shouldSpeak: true,
                  });
                } else if (Math.abs(v) <= 10) {
                  onTeacherSpeak({
                    mood: 'success',
                    badgeAr: 'تغذية متوازنة ومعتدلة',
                    badgeFr: 'Équilibre alimentaire',
                    speechText: 'أحسنت! التغذية المتوازنة توفر للجسم حاجياته بالكمية والنوعية المناسبة.',
                    shouldSpeak: true,
                  });
                }
              }}
              className="w-full bio-slider"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>التفريط (Carences)</span>
              <span className="text-[#00FFA3] font-bold">التوازن (Équilibre)</span>
              <span>الإفراط (Obésité)</span>
            </div>
          </div>
        </section>

        {/* Interactive Energy & Ration Calculator */}
        <section className="lg:col-span-7 rounded-2xl bg-[#0D1424]/90 border border-white/10 p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#FF9F1C]" />
              <h2 className="text-sm font-extrabold text-slate-50">
                حاسبة الكلتة الطاقية ونِسَب التوازن (3AC)
              </h2>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setGlucides(380);
                  setProtAnim(45);
                  setProtVeg(45);
                  setLipides(90);
                  onTeacherSpeak({
                    mood: 'success',
                    badgeAr: 'كلتة متوازنة (11410 kJ)',
                    badgeFr: 'Ration équilibrée ✓',
                    speechText: 'كلتة غذائية متوازنة تحترم جميع نسب التوازن المغربية!',
                    shouldSpeak: true,
                  });
                }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#00FFA3]/15 text-[#00FFA3] border border-[#00FFA3]/35 cursor-pointer"
              >
                وجبة متوازنة
              </button>
              <button
                type="button"
                onClick={() => {
                  setGlucides(520);
                  setProtAnim(10);
                  setProtVeg(60);
                  setLipides(150);
                  onTeacherSpeak({
                    mood: 'hint',
                    badgeAr: 'كلتة غير متوازنة!',
                    badgeFr: 'Ration déséquilibrée',
                    speechText: 'انتبه! هذه الوجبة فيها إفراط في الدهون والسكريات ونقص في البروتيدات الحيوانية.',
                    shouldSpeak: true,
                  });
                }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#FF9F1C]/15 text-[#FF9F1C] border border-[#FF9F1C]/35 cursor-pointer"
              >
                وجبة سريعة
              </button>
            </div>
          </div>

          {/* Interactive Gram Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl bg-[#070B14] border border-white/10 p-3 space-y-1.5">
              <div className="flex justify-between">
                <span className="font-bold text-[#00E5FF]">السكريات (1g = 17 kJ)</span>
                <span className="font-mono-num font-bold text-slate-100">
                  {glucides}g · {kJGluc} kJ
                </span>
              </div>
              <input type="range" min={100} max={600} value={glucides} onChange={(e) => setGlucides(Number(e.target.value))} className="w-full bio-slider" />
            </div>

            <div className="rounded-xl bg-[#070B14] border border-white/10 p-3 space-y-1.5">
              <div className="flex justify-between">
                <span className="font-bold text-[#FF9F1C]">الدهنيات (1g = 38 kJ)</span>
                <span className="font-mono-num font-bold text-slate-100">
                  {lipides}g · {kJLip} kJ
                </span>
              </div>
              <input type="range" min={20} max={180} value={lipides} onChange={(e) => setLipides(Number(e.target.value))} className="w-full bio-slider" />
            </div>

            <div className="rounded-xl bg-[#070B14] border border-white/10 p-3 space-y-1.5">
              <div className="flex justify-between">
                <span className="font-bold text-[#EF4444]">بروتيدات حيوانية (17 kJ)</span>
                <span className="font-mono-num font-bold text-slate-100">{protAnim}g</span>
              </div>
              <input type="range" min={0} max={100} value={protAnim} onChange={(e) => setProtAnim(Number(e.target.value))} className="w-full bio-slider" />
            </div>

            <div className="rounded-xl bg-[#070B14] border border-white/10 p-3 space-y-1.5">
              <div className="flex justify-between">
                <span className="font-bold text-[#00FFA3]">بروتيدات نباتية (17 kJ)</span>
                <span className="font-mono-num font-bold text-slate-100">{protVeg}g</span>
              </div>
              <input type="range" min={10} max={100} value={protVeg} onChange={(e) => setProtVeg(Number(e.target.value))} className="w-full bio-slider" />
            </div>
          </div>

          {/* Total Energy + 3 Official Equilibrium Ratio Checks */}
          <div className="rounded-xl bg-[#070B14] border border-white/10 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                الإمداد الطاقي الإجمالي (Apport énergétique total):
              </span>
              <span className="text-lg font-mono-num font-extrabold text-[#00FFA3]">
                {totalKj.toLocaleString('en-US')} kJ
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono-num">
              <div className={`rounded-lg px-2.5 py-2 border flex items-center justify-between ${okGP ? 'bg-[#00FFA3]/10 border-[#00FFA3]/40 text-[#00FFA3]' : 'bg-[#FF9F1C]/10 border-[#FF9F1C]/40 text-[#FF9F1C]'}`}>
                <span>3.5 &lt; G/P &lt; 5</span>
                <span className="inline-flex items-center gap-1 font-bold">
                  {ratioGP.toFixed(1)}
                  {okGP ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                </span>
              </div>

              <div className={`rounded-lg px-2.5 py-2 border flex items-center justify-between ${okLP ? 'bg-[#00FFA3]/10 border-[#00FFA3]/40 text-[#00FFA3]' : 'bg-[#FF9F1C]/10 border-[#FF9F1C]/40 text-[#FF9F1C]'}`}>
                <span>L/P ≈ 1</span>
                <span className="inline-flex items-center gap-1 font-bold">
                  {ratioLP.toFixed(2)}
                  {okLP ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                </span>
              </div>

              <div className={`rounded-lg px-2.5 py-2 border flex items-center justify-between ${okAV ? 'bg-[#00FFA3]/10 border-[#00FFA3]/40 text-[#00FFA3]' : 'bg-[#FF9F1C]/10 border-[#FF9F1C]/40 text-[#FF9F1C]'}`}>
                <span>Pa/Pv ≥ 0.33</span>
                <span className="inline-flex items-center gap-1 font-bold">
                  {ratioAnimVeg.toFixed(2)}
                  {okAV ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 3. Interactive Energy Needs Bar Charts */}
      <section className="rounded-2xl bg-[#0D1424]/90 border border-white/10 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#00E5FF]" />
            <h3 className="text-sm sm:text-base font-extrabold text-slate-50">
              تغيّر الحاجيات الطاقية حسب النشاط، العمر، والحالة الفيزيولوجية
            </h3>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#070B14] border border-white/10 text-xs">
            {(
              [
                { id: 'activity', label: 'النشاط البدني' },
                { id: 'age', label: 'العمر والجنس' },
                { id: 'physio', label: 'الحالة الفيزيولوجية' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setChartTab(t.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  chartTab === t.id
                    ? 'bg-[#00E5FF] text-[#070B14]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {currentDataset.items.map((bar) => {
            const pct = Math.round((bar.val / currentDataset.maxVal) * 100);
            return (
              <button
                key={bar.labelFr}
                type="button"
                onClick={() =>
                  onTeacherSpeak({
                    mood: 'explaining',
                    badgeAr: `${bar.labelAr} · ${bar.val} ${currentDataset.unit}`,
                    badgeFr: bar.labelFr,
                    speechText: bar.speech,
                    shouldSpeak: true,
                  })
                }
                className="rounded-xl bg-[#070B14] border border-white/10 hover:border-white/30 p-3.5 text-right flex flex-col justify-between gap-3 transition-colors cursor-pointer"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-extrabold text-slate-100">{bar.labelAr}</span>
                  <span className="font-mono-num text-xs font-extrabold" style={{ color: bar.color }}>
                    {bar.val}
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%`, backgroundColor: bar.color }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-latin">{bar.labelFr}</span>
                  <span className="font-mono-num">{currentDataset.unit}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Live IMC Calculator & Interactive SVG Growth Curve Plotter */}
      <section className="rounded-2xl bg-[#0D1424]/90 border border-white/10 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#00FFA3]" />
            <div>
              <h3 className="text-base font-extrabold text-slate-50">
                حاسبة ومنحنى مؤشر كتلة الجسم (IMC = Poids / Taille²)
              </h3>
              <p className="text-xs font-latin text-[#00E5FF]">
                Courbe de corpulence : PN · SP · OD · OS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#070B14] border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setGender('boy')}
              className={`px-3 py-1 rounded-md font-bold cursor-pointer ${
                gender === 'boy' ? 'bg-[#00E5FF] text-[#070B14]' : 'text-slate-300'
              }`}
            >
              ذكور (Garçons)
            </button>
            <button
              type="button"
              onClick={() => setGender('girl')}
              className={`px-3 py-1 rounded-md font-bold cursor-pointer ${
                gender === 'girl' ? 'bg-[#A855F7] text-white' : 'text-slate-300'
              }`}
            >
              إناث (Filles)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Controls & Live IMC Result */}
          <div className="lg:col-span-5 space-y-3">
            <div className="rounded-xl bg-[#070B14] border border-white/10 p-3.5 space-y-2.5 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-300 font-bold">الوزن (Poids)</span>
                  <span className="font-mono-num text-[#00FFA3] font-bold">{weight} kg</span>
                </div>
                <input type="range" min={28} max={115} value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full bio-slider" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-300 font-bold">الطول (Taille)</span>
                  <span className="font-mono-num text-[#00E5FF] font-bold">{heightM.toFixed(2)} m</span>
                </div>
                <input type="range" min={130} max={195} value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} className="w-full bio-slider" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-300 font-bold">العمر (Âge)</span>
                  <span className="font-mono-num text-[#FF9F1C] font-bold">{age} سنة</span>
                </div>
                <input type="range" min={10} max={18} value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full bio-slider" />
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                onTeacherSpeak({
                  mood: imcStatus.code.startsWith('PN') ? 'success' : 'hint',
                  badgeAr: `IMC = ${imc} · ${imcStatus.code}`,
                  badgeFr: imcStatus.fr,
                  speechText: `مؤشر كتلة الجسم يساوي ${imc}، وهو يقع في منطقة ${imcStatus.code}.`,
                  shouldSpeak: true,
                })
              }
              className="w-full rounded-xl bg-[#070B14] border p-3.5 flex items-center justify-between cursor-pointer"
              style={{ borderColor: imcStatus.color }}
            >
              <div className="text-right">
                <div className="text-xs text-slate-400">النتيجة (اضغط للشرح الصوتي)</div>
                <div className="text-sm font-extrabold" style={{ color: imcStatus.color }}>
                  {imcStatus.code}
                </div>
              </div>
              <div className="text-2xl font-mono-num font-extrabold text-slate-50">
                {imc}
              </div>
            </button>
          </div>

          {/* Interactive SVG IMC Growth Curve with Glowing Plotted Dot */}
          <div className="lg:col-span-7 rounded-xl bg-[#070B14] border border-white/10 p-3" dir="ltr">
            <svg viewBox={`0 0 ${imcW} ${imcH}`} className="w-full h-auto select-none">
              {/* Grid lines */}
              {[14, 18, 22, 26, 30, 34].map((v) => (
                <g key={v}>
                  <line x1={iL} y1={mapImcY(v)} x2={imcW - iR} y2={mapImcY(v)} stroke="rgba(255,255,255,0.06)" />
                  <text x={iL - 6} y={mapImcY(v) + 3} textAnchor="end" fill="#94A3B8" fontSize="9.5" fontFamily="IBM Plex Mono, monospace">
                    {v}
                  </text>
                </g>
              ))}
              {[10, 12, 14, 16, 18].map((a) => (
                <text key={a} x={mapAgeX(a)} y={imcH - iB + 15} textAnchor="middle" fill="#94A3B8" fontSize="9.5" fontFamily="IBM Plex Mono, monospace">
                  {a} ans
                </text>
              ))}

              {/* Threshold Curves: OS, OD, SP, PN */}
              <path d={buildBandPath(26, 33.5)} fill="none" stroke="#EF4444" strokeWidth="2.5" />
              <text x={imcW - 32} y={mapImcY(34.5)} fill="#EF4444" fontSize="10" fontWeight="800">OS</text>

              <path d={buildBandPath(23, 29.5)} fill="none" stroke="#F97316" strokeWidth="2.5" />
              <text x={imcW - 32} y={mapImcY(30.6)} fill="#F97316" fontSize="10" fontWeight="800">OD</text>

              <path d={buildBandPath(19.5, 25)} fill="none" stroke="#FF9F1C" strokeWidth="2.5" />
              <text x={imcW - 32} y={mapImcY(26.2)} fill="#FF9F1C" fontSize="10" fontWeight="800">SP</text>

              <path d={buildBandPath(14.5, 18)} fill="none" stroke="#00FFA3" strokeWidth="2.5" />
              <text x={imcW - 32} y={mapImcY(20.5)} fill="#00FFA3" fontSize="10" fontWeight="800">PN</text>

              {/* Axes */}
              <line x1={iL} y1={iT} x2={iL} y2={imcH - iB} stroke="#64748B" />
              <line x1={iL} y1={imcH - iB} x2={imcW - iR} y2={imcH - iB} stroke="#64748B" />

              {/* Crosshair + Glowing Student IMC Dot */}
              <line x1={mapAgeX(age)} y1={iT} x2={mapAgeX(age)} y2={imcH - iB} stroke={imcStatus.color} strokeDasharray="3 3" opacity="0.6" />
              <line x1={iL} y1={mapImcY(imc)} x2={imcW - iR} y2={mapImcY(imc)} stroke={imcStatus.color} strokeDasharray="3 3" opacity="0.6" />
              <circle cx={mapAgeX(age)} cy={mapImcY(imc)} r="11" fill={imcStatus.color} opacity="0.25" />
              <circle cx={mapAgeX(age)} cy={mapImcY(imc)} r="6.5" fill={imcStatus.color} stroke="#FFFFFF" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
};
