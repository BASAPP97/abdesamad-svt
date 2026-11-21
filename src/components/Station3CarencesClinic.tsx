import React, { useState } from 'react';
import { Sun, Droplets, Flame, ShieldCheck, Activity } from 'lucide-react';
import {
  CARENCES_DATA,
  RAT_EXPERIMENT_DATA,
  VITAMINS_LIST,
  type CarenceId,
} from '../data/nutritionLessonData';
import type { MascotSignal } from '../data/unitsData';

interface Station3CarencesClinicProps {
  onTeacherSpeak: (signal: MascotSignal) => void;
}

export const Station3CarencesClinic: React.FC<Station3CarencesClinicProps> = ({
  onTeacherSpeak,
}) => {
  const [selectedId, setSelectedId] = useState<CarenceId>('kwashiorkor');
  const [ratDayIdx, setRatDayIdx] = useState<number>(5); // Day 100 default to show jump
  const [sunLevel, setSunLevel] = useState<number>(80);
  const [legShape, setLegShape] = useState<'O' | 'X'>('O');
  const [activeVitCode, setActiveVitCode] = useState<string>('D');

  const carence =
    CARENCES_DATA.find((c) => c.id === selectedId) || CARENCES_DATA[0];
  const ratPoint = RAT_EXPERIMENT_DATA[ratDayIdx] || RAT_EXPERIMENT_DATA[0];

  // Rat Experiment SVG Graph Coordinates
  const gW = 540;
  const gH = 210;
  const pL = 46;
  const pR = 20;
  const pT = 20;
  const pB = 34;
  const rx = (day: number) => pL + (day / 120) * (gW - pL - pR);
  const ry = (wt: number) => pT + (1 - wt / 180) * (gH - pT - pB);

  const visibleRatPts = RAT_EXPERIMENT_DATA.slice(0, ratDayIdx + 1);
  const caseinePath = visibleRatPts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${rx(p.day)} ${ry(p.caseine)}`)
    .join(' ');
  const zeinePath = visibleRatPts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${rx(p.day)} ${ry(p.zeine)}`)
    .join(' ');

  const lipoVits = VITAMINS_LIST.filter((v) => v.group === 'liposoluble');
  const hydroVits = VITAMINS_LIST.filter((v) => v.group === 'hydrosoluble');

  return (
    <div className="space-y-5">
      {/* 6 Deficiency Disease Selector Strip */}
      <section className="rounded-2xl bg-[#0D1424]/90 border border-white/10 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#EF4444]" />
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-50">
                عيادة الفاقات الغذائية الست (3AC)
              </h2>
              <p className="text-xs font-latin text-[#00E5FF]">
                Les 6 carences alimentaires · اضغط على أي مرض للفحص البصري والصوتي
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {CARENCES_DATA.map((item) => {
            const isSel = item.id === selectedId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedId(item.id);
                  onTeacherSpeak({
                    mood: 'explaining',
                    badgeAr: item.ar,
                    badgeFr: item.fr,
                    speechText: item.speech,
                    shouldSpeak: true,
                  });
                }}
                className={`text-right rounded-xl px-3 py-2.5 border transition-colors cursor-pointer ${
                  isSel
                    ? 'bg-white/[0.08] border-[#00FFA3] text-slate-50'
                    : 'bg-[#070B14]/75 border-white/10 text-slate-300 hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-extrabold truncate">{item.ar}</span>
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.accent }}
                  />
                </div>
                <div className="text-[10px] font-latin text-slate-400 truncate mt-0.5">
                  {item.fr}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Medical Diagnostic Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Custom Medical SVG Visual Illustration */}
          <div className="lg:col-span-5 rounded-xl bg-[#070B14] border border-white/15 p-4 flex flex-col items-center justify-between gap-3">
            <div className="w-full flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-50">{carence.ar}</span>
              <span className="font-latin font-semibold text-[#00E5FF]">
                {carence.fr}
              </span>
            </div>

            {/* Disease-specific Medical SVG */}
            <svg viewBox="0 0 260 190" className="w-full max-w-[260px] h-44 select-none">
              {selectedId === 'kwashiorkor' && (
                <g>
                  {/* Schematic Child Silhouette highlighting edema & amino acid lock */}
                  <circle cx="95" cy="40" r="20" fill="#F3C59F" />
                  <path d="M 74 66 Q 60 112 78 134 L 112 134 Q 134 112 116 66 Z" fill="#EF4444" opacity="0.28" stroke="#EF4444" strokeWidth="2.5" />
                  <ellipse cx="96" cy="108" rx="26" ry="20" fill="#EF4444" opacity="0.45" />
                  <line x1="84" y1="134" x2="80" y2="174" stroke="#E1A87C" strokeWidth="9" strokeLinecap="round" />
                  <line x1="108" y1="134" x2="112" y2="174" stroke="#E1A87C" strokeWidth="9" strokeLinecap="round" />
                  {/* Missing Essential Amino Acids Badges */}
                  <rect x="148" y="34" width="98" height="34" rx="8" fill="#1E293B" stroke="#EF4444" strokeWidth="2" />
                  <text x="197" y="55" textAnchor="middle" fill="#FCA5A5" fontSize="11" fontWeight="700">Lysine (–)</text>
                  <rect x="148" y="82" width="98" height="34" rx="8" fill="#1E293B" stroke="#FF9F1C" strokeWidth="2" />
                  <text x="197" y="103" textAnchor="middle" fill="#FDE68A" fontSize="10.5" fontWeight="700">Tryptophane (–)</text>
                  <text x="197" y="146" textAnchor="middle" fill="#00FFA3" fontSize="11" fontWeight="700">أوديمات وانتفاخ</text>
                </g>
              )}

              {selectedId === 'goitre' && (
                <g>
                  {/* Neck Profile + Enlarged Glowing Purple Thyroid Gland */}
                  <circle cx="130" cy="44" r="28" fill="#F3C59F" />
                  <rect x="108" y="68" width="44" height="58" rx="14" fill="#E1A87C" />
                  <path d="M 62 178 C 68 134, 192 134, 198 178 Z" fill="#1E293B" />
                  {/* Hypertrophied Butterfly Thyroid */}
                  <path
                    d="M 102 96 C 88 86, 86 122, 114 118 Q 130 112 146 118 C 174 122, 172 86, 158 96 Q 130 104 102 96 Z"
                    fill="#A855F7"
                    opacity="0.88"
                    stroke="#E9D5FF"
                    strokeWidth="2.5"
                  />
                  <text x="130" y="156" textAnchor="middle" fill="#E9D5FF" fontSize="12" fontWeight="800">
                    تضخم الغدة الدرقية · Iode (–)
                  </text>
                </g>
              )}

              {selectedId === 'scorbut' && (
                <g>
                  {/* Inflamed Bleeding Gums & Loose Teeth */}
                  <rect x="44" y="42" width="172" height="56" rx="22" fill="#DC2626" opacity="0.82" />
                  {[66, 98, 130, 162].map((tx, i) => (
                    <rect
                      key={tx}
                      x={tx}
                      y={76 + (i === 2 ? 14 : 0)}
                      width="24"
                      height="34"
                      rx="6"
                      fill="#F8FAFC"
                      stroke="#CBD5E1"
                      strokeWidth="2"
                      transform={i === 2 ? 'rotate(12 142 96)' : undefined}
                    />
                  ))}
                  {/* Blood Droplets */}
                  <circle cx="94" cy="116" r="4.5" fill="#EF4444" />
                  <circle cx="156" cy="124" r="5" fill="#EF4444" />
                  <text x="130" y="162" textAnchor="middle" fill="#FDBA74" fontSize="12" fontWeight="800">
                    نزيف اللثة · Vitamine C (–)
                  </text>
                </g>
              )}

              {selectedId === 'xerophtalmie' && (
                <g>
                  {/* Eye Cornea Dryness & Cloudiness */}
                  <path
                    d="M 32 92 Q 130 22 228 92 Q 130 162 32 92 Z"
                    fill="#E2E8F0"
                    stroke="#00E5FF"
                    strokeWidth="3"
                  />
                  <circle cx="130" cy="92" r="34" fill="#0284C7" opacity="0.55" />
                  <circle cx="130" cy="92" r="18" fill="#0F172A" />
                  {/* Dry Cloudy Cornea Patch */}
                  <ellipse cx="142" cy="88" rx="20" ry="13" fill="#CBD5E1" opacity="0.72" />
                  <text x="130" y="168" textAnchor="middle" fill="#00E5FF" fontSize="12" fontWeight="800">
                    جفاف القرنية · Vitamine A (–)
                  </text>
                </g>
              )}

              {selectedId === 'rachitisme' && (
                <g>
                  {/* Bow Legs ( ) vs Knock Knees ) ( */}
                  {legShape === 'O' ? (
                    <>
                      <path d="M 102 26 Q 68 94 104 158" fill="none" stroke="#F8FAFC" strokeWidth="14" strokeLinecap="round" />
                      <path d="M 158 26 Q 192 94 156 158" fill="none" stroke="#F8FAFC" strokeWidth="14" strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      <path d="M 96 26 Q 124 94 86 158" fill="none" stroke="#F8FAFC" strokeWidth="14" strokeLinecap="round" />
                      <path d="M 164 26 Q 136 94 174 158" fill="none" stroke="#F8FAFC" strokeWidth="14" strokeLinecap="round" />
                    </>
                  )}
                  <circle cx="130" cy="24" r="12" fill="#FF9F1C" opacity="0.4" />
                  <text x="130" y="182" textAnchor="middle" fill="#FF9F1C" fontSize="12" fontWeight="800">
                    تشوه الساقين {legShape === 'O' ? '( )' : ') ('} · Vit D + Ca (–)
                  </text>
                </g>
              )}

              {selectedId === 'beriberi' && (
                <g>
                  {/* Whole Rice Husk (Vit B1+) vs Polished Rice (Vit B1-) */}
                  <g>
                    <ellipse cx="76" cy="84" rx="22" ry="38" fill="#B45309" stroke="#00FFA3" strokeWidth="3.5" />
                    <ellipse cx="76" cy="84" rx="14" ry="28" fill="#FEF3C7" />
                    <text x="76" y="142" textAnchor="middle" fill="#00FFA3" fontSize="11" fontWeight="800">أرز كامل (B1+)</text>
                  </g>
                  <g>
                    <ellipse cx="184" cy="84" rx="16" ry="30" fill="#F8FAFC" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="4 3" />
                    <text x="184" y="142" textAnchor="middle" fill="#FCA5A5" fontSize="11" fontWeight="800">أرز مقشور (B1–)</text>
                  </g>
                  <text x="130" y="174" textAnchor="middle" fill="#CBD5E1" fontSize="11" fontWeight="700">
                    قشرة الأرز غنية بفيتامين B1
                  </text>
                </g>
              )}
            </svg>

            {selectedId === 'rachitisme' && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLegShape('O')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                    legShape === 'O'
                      ? 'bg-[#FF9F1C] text-[#070B14] border-[#FF9F1C]'
                      : 'bg-white/5 text-slate-300 border-white/10'
                  }`}
                >
                  تقوس ( )
                </button>
                <button
                  type="button"
                  onClick={() => setLegShape('X')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                    legShape === 'X'
                      ? 'bg-[#FF9F1C] text-[#070B14] border-[#FF9F1C]'
                      : 'bg-white/5 text-slate-300 border-white/10'
                  }`}
                >
                  تقوس ) (
                </button>
              </div>
            )}
          </div>

          {/* Crisp Diagnostic Info Cards (Zero Walls of Text!) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-[#070B14] border border-white/10 p-3.5 space-y-1">
                <span className="text-[11px] text-slate-400">السبب · Cause</span>
                <div className="text-xs font-extrabold text-[#EF4444]">
                  {carence.deficiencyAr}
                </div>
                <div className="text-[10px] font-latin text-slate-400">
                  {carence.deficiencyFr}
                </div>
              </div>

              <div className="rounded-xl bg-[#070B14] border border-white/10 p-3.5 space-y-1">
                <span className="text-[11px] text-slate-400">الأعراض · Symptômes</span>
                <div className="text-xs font-extrabold text-[#FF9F1C]">
                  {carence.symptomAr}
                </div>
                <div className="text-[10px] font-latin text-slate-400">
                  {carence.symptomFr}
                </div>
              </div>

              <div className="rounded-xl bg-[#070B14] border border-white/10 p-3.5 space-y-1">
                <span className="text-[11px] text-slate-400">الوقاية · Prévention</span>
                <div className="text-xs font-extrabold text-[#00FFA3]">
                  {carence.preventionAr}
                </div>
                <div className="text-[10px] font-latin text-slate-400">
                  {carence.preventionFr}
                </div>
              </div>
            </div>

            {/* SPECIAL INTERACTIVE LAB A: Kwashiorkor Rat Experiment Graph */}
            {selectedId === 'kwashiorkor' && (
              <div className="rounded-xl bg-[#070B14] border border-[#00E5FF]/30 p-3.5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-extrabold text-slate-100">
                    تجربة الفئران: Caséine مقابل Zéine ← Z+T ← Z+T+L
                  </span>
                  <span className="font-mono-num text-[#00FFA3] font-bold">
                    اليوم {ratPoint.day} · {ratPoint.phaseAr}
                  </span>
                </div>

                <div className="w-full overflow-x-auto" dir="ltr">
                  <svg viewBox={`0 0 ${gW} ${gH}`} className="w-full h-auto select-none">
                    {/* Vertical Phase Dividers at Day 40 (Z+T) and Day 80 (Z+T+L) */}
                    <line x1={rx(40)} y1={pT} x2={rx(40)} y2={gH - pB} stroke="#FF9F1C" strokeDasharray="4 4" strokeWidth="1.5" />
                    <text x={rx(40)} y={pT - 5} textAnchor="middle" fill="#FF9F1C" fontSize="10" fontWeight="700">+T (j40)</text>

                    <line x1={rx(80)} y1={pT} x2={rx(80)} y2={gH - pB} stroke="#00FFA3" strokeDasharray="4 4" strokeWidth="1.5" />
                    <text x={rx(80)} y={pT - 5} textAnchor="middle" fill="#00FFA3" fontSize="10" fontWeight="700">+L (j80)</text>

                    {/* Axes */}
                    <line x1={pL} y1={pT} x2={pL} y2={gH - pB} stroke="#64748B" />
                    <line x1={pL} y1={gH - pB} x2={gW - pR} y2={gH - pB} stroke="#64748B" />
                    {[0, 60, 120, 180].map((w) => (
                      <text key={w} x={pL - 6} y={ry(w) + 3} textAnchor="end" fill="#94A3B8" fontSize="9.5" fontFamily="IBM Plex Mono, monospace">
                        {w}g
                      </text>
                    ))}
                    {[0, 40, 80, 120].map((d) => (
                      <text key={d} x={rx(d)} y={gH - pB + 15} textAnchor="middle" fill="#94A3B8" fontSize="9.5" fontFamily="IBM Plex Mono, monospace">
                        j{d}
                      </text>
                    ))}

                    {/* Lot 1: Caséine (Cyan) */}
                    <path d={caseinePath} fill="none" stroke="#00E5FF" strokeWidth="3" strokeLinecap="round" />
                    <circle cx={rx(ratPoint.day)} cy={ry(ratPoint.caseine)} r="6" fill="#00E5FF" stroke="#070B14" strokeWidth="2" />

                    {/* Lot 2: Zéine -> Z+T -> Z+T+L (Emerald/Amber) */}
                    <path d={zeinePath} fill="none" stroke="#FF9F1C" strokeWidth="3" strokeLinecap="round" />
                    <circle cx={rx(ratPoint.day)} cy={ry(ratPoint.zeine)} r="6" fill="#FF9F1C" stroke="#070B14" strokeWidth="2" />
                  </svg>
                </div>

                <div className="space-y-2">
                  <input
                    type="range"
                    min={0}
                    max={RAT_EXPERIMENT_DATA.length - 1}
                    step={1}
                    value={ratDayIdx}
                    onChange={(e) => {
                      const i = Number(e.target.value);
                      setRatDayIdx(i);
                      const pt = RAT_EXPERIMENT_DATA[i];
                      onTeacherSpeak({
                        mood: i >= 5 ? 'success' : 'explaining',
                        badgeAr: `اليوم ${pt.day}: ${pt.phaseAr}`,
                        badgeFr: `Caséine ${pt.caseine}g · Zéine ${pt.zeine}g`,
                        speechText: pt.speech,
                        shouldSpeak: true,
                      });
                    }}
                    className="w-full bio-slider"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-num">
                    <span className="text-[#00E5FF] font-bold">
                      المجموعة 1 (Caséine): {ratPoint.caseine} g
                    </span>
                    <span className="text-[#FF9F1C] font-bold">
                      المجموعة 2 (Zéine): {ratPoint.zeine} g
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SPECIAL INTERACTIVE LAB B: Rachitisme UV Sunlight -> Vitamin D Skin Synthesis */}
            {selectedId === 'rachitisme' && (
              <div className="rounded-xl bg-[#070B14] border border-[#FF9F1C]/35 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-[#FF9F1C] flex items-center gap-1.5">
                    <Sun className="w-4 h-4" />
                    محاكي تركيب فيتامين D عبر أشعة الشمس (UV)
                  </span>
                  <span className="font-mono-num text-[#00FFA3] font-bold">
                    تركيب Vit D: {sunLevel}%
                  </span>
                </div>

                <svg viewBox="0 0 460 110" className="w-full h-24 select-none">
                  {/* Sun & UV Rays */}
                  <circle cx="48" cy="48" r="24" fill="#FF9F1C" opacity={0.3 + (sunLevel / 100) * 0.7} />
                  {[24, 48, 72].map((y) => (
                    <line
                      key={y}
                      x1="80"
                      y1={y}
                      x2="164"
                      y2={y}
                      stroke="#FDE047"
                      strokeWidth="3"
                      strokeDasharray="6 4"
                      opacity={sunLevel / 100}
                    />
                  ))}
                  {/* Skin Cells Layer */}
                  <rect x="172" y="18" width="108" height="72" rx="12" fill="#E1A87C" opacity="0.28" stroke="#E1A87C" strokeWidth="2" />
                  <text x="226" y="48" textAnchor="middle" fill="#FDE68A" fontSize="11" fontWeight="700">خلايا الجلد</text>
                  <text x="226" y="68" textAnchor="middle" fill="#00FFA3" fontSize="11" fontWeight="800">
                    Vit D {sunLevel >= 50 ? '+++' : '(–)'}
                  </text>
                  {/* Arrow to Bone Calcium Fixation */}
                  <line x1="286" y1="54" x2="338" y2="54" stroke="#00FFA3" strokeWidth="3.5" opacity={0.25 + (sunLevel / 100) * 0.75} />
                  <rect x="344" y="24" width="102" height="60" rx="12" fill="#0F172A" stroke={sunLevel >= 50 ? '#00FFA3' : '#EF4444'} strokeWidth="2.5" />
                  <text x="395" y="49" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontWeight="800">تثبيت الكالسيوم</text>
                  <text x="395" y="68" textAnchor="middle" fill={sunLevel >= 50 ? '#00FFA3' : '#EF4444'} fontSize="10.5" fontWeight="700">
                    {sunLevel >= 50 ? 'عظام صلبة ✓' : 'عظام لينة (كساح)'}
                  </text>
                </svg>

                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sunLevel}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setSunLevel(v);
                    if (v === 100 || v === 0) {
                      onTeacherSpeak({
                        mood: v >= 50 ? 'success' : 'hint',
                        badgeAr: v >= 50 ? 'تركيب فيتامين D نشيط' : 'غياب الشمس = خطر الكساح',
                        badgeFr: 'Synthèse UV → Vitamine D',
                        speechText:
                          v >= 50
                            ? 'الأشعة فوق البنفسجية للشمس تحفز الجلد على إنتاج فيتامين د الذي يثبت الكالسيوم في العظام!'
                            : 'غياب التعرض للشمس يقلل فيتامين د فلا يتثبت الكالسيوم وتلين العظام!',
                        shouldSpeak: true,
                      });
                    }
                  }}
                  className="w-full bio-slider"
                />
              </div>
            )}

            {/* Quick Visual Rule Box for the other 4 diseases */}
            {selectedId !== 'kwashiorkor' && selectedId !== 'rachitisme' && (
              <div className="rounded-xl bg-[#070B14] border border-white/10 p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#00FFA3] shrink-0" />
                  <div className="text-xs font-bold text-slate-200">
                    معادلة الوقاية: <span className="text-[#00FFA3]">{carence.preventionAr}</span>
                  </div>
                </div>
                <span className="font-latin text-xs text-[#00E5FF] shrink-0">
                  {carence.fr}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Clickable Vitamins Explorer: Liposolubles (A, D, K) vs Hydrosolubles (B1, C, B3) */}
      <section className="rounded-2xl bg-[#0D1424]/90 border border-white/10 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-extrabold text-slate-50">
            مستكشف الفيتامينات: الذائبة في الدهون مقابل الذائبة في الماء
          </h3>
          <span className="text-xs font-latin text-[#00E5FF]">
            Liposolubles (A, D, K) vs Hydrosolubles (B1, C, B3)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Liposoluble Group */}
          <div className="rounded-xl bg-[#070B14] border border-[#FF9F1C]/30 p-3.5 space-y-3">
            <div className="flex items-center justify-between text-xs font-extrabold text-[#FF9F1C]">
              <span className="inline-flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                تذوب في الدهون (Liposolubles)
              </span>
              <span className="font-mono-num">A · D · K</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {lipoVits.map((v) => {
                const isSel = activeVitCode === v.code;
                return (
                  <button
                    key={v.code}
                    type="button"
                    onClick={() => {
                      setActiveVitCode(v.code);
                      onTeacherSpeak({
                        mood: 'explaining',
                        badgeAr: `فيتامين ${v.code} ← ${v.deficiencyAr}`,
                        badgeFr: `Vitamine ${v.code} · ${v.deficiencyFr}`,
                        speechText: v.speech,
                        shouldSpeak: true,
                      });
                    }}
                    className={`rounded-xl p-3 border text-center transition-colors cursor-pointer ${
                      isSel
                        ? 'bg-[#FF9F1C]/15 border-[#FF9F1C]'
                        : 'bg-[#0D1424] border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="text-lg font-mono-num font-extrabold" style={{ color: v.color }}>
                      {v.code}
                    </div>
                    <div className="text-[11px] font-bold text-slate-100 mt-0.5 truncate">
                      {v.deficiencyAr}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {v.sourcesAr}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hydrosoluble Group */}
          <div className="rounded-xl bg-[#070B14] border border-[#00E5FF]/30 p-3.5 space-y-3">
            <div className="flex items-center justify-between text-xs font-extrabold text-[#00E5FF]">
              <span className="inline-flex items-center gap-1.5">
                <Droplets className="w-4 h-4" />
                تذوب في الماء (Hydrosolubles)
              </span>
              <span className="font-mono-num">B1 · C · B3</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {hydroVits.map((v) => {
                const isSel = activeVitCode === v.code;
                return (
                  <button
                    key={v.code}
                    type="button"
                    onClick={() => {
                      setActiveVitCode(v.code);
                      onTeacherSpeak({
                        mood: 'explaining',
                        badgeAr: `فيتامين ${v.code} ← ${v.deficiencyAr}`,
                        badgeFr: `Vitamine ${v.code} · ${v.deficiencyFr}`,
                        speechText: v.speech,
                        shouldSpeak: true,
                      });
                    }}
                    className={`rounded-xl p-3 border text-center transition-colors cursor-pointer ${
                      isSel
                        ? 'bg-[#00E5FF]/15 border-[#00E5FF]'
                        : 'bg-[#0D1424] border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="text-lg font-mono-num font-extrabold" style={{ color: v.color }}>
                      {v.code}
                    </div>
                    <div className="text-[11px] font-bold text-slate-100 mt-0.5 truncate">
                      {v.deficiencyAr}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {v.sourcesAr}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
