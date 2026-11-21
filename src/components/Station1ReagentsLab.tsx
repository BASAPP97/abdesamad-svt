import React, { useState } from 'react';
import { Flame, Sun, CheckCircle2, XCircle, RotateCcw, Award, FlaskConical } from 'lucide-react';
import {
  FOOD_SAMPLES,
  REAGENTS_DATA,
  type ReagentDef,
  type ReagentId,
  type SampleId,
} from '../data/nutritionLessonData';
import type { MascotSignal } from '../data/unitsData';

interface Station1ReagentsLabProps {
  onTeacherSpeak: (signal: MascotSignal) => void;
  onEarnXp: (key: string, amount: number) => void;
  completedKeys: string[];
}

export const Station1ReagentsLab: React.FC<Station1ReagentsLabProps> = ({
  onTeacherSpeak,
  onEarnXp,
  completedKeys,
}) => {
  const [selectedSampleId, setSelectedSampleId] = useState<SampleId>('pain');
  const [activeReagentId, setActiveReagentId] = useState<ReagentId | null>(null);
  const [animating, setAnimating] = useState<boolean>(false);
  const [testedMatrix, setTestedMatrix] = useState<Record<string, 'pos' | 'neg'>>({});
  const [discoveredNutrients, setDiscoveredNutrients] = useState<ReagentId[]>([]);

  const activeSample =
    FOOD_SAMPLES.find((s) => s.id === selectedSampleId) || FOOD_SAMPLES[0];
  const activeReagent =
    REAGENTS_DATA.find((r) => r.id === activeReagentId) || null;

  const isPositiveNow =
    activeReagent !== null &&
    activeReagent.positiveSamples.includes(selectedSampleId);

  const runReagentTest = (reagent: ReagentDef) => {
    // If reagent requires filtrate and user is on solid (or vice versa), auto-guide smoothly!
    if (!reagent.applicableSamples.includes(selectedSampleId)) {
      const suggestedSample = reagent.applicableSamples[0];
      setSelectedSampleId(suggestedSample);
      onTeacherSpeak({
        mood: 'hint',
        badgeAr: `انتقل إلى ${FOOD_SAMPLES.find((s) => s.id === suggestedSample)?.ar}`,
        badgeFr: reagent.nameFr,
        speechText:
          reagent.wrongSampleSpeech ||
          'تم اختيار العينة المناسبة لهذا الكاشف، اضغط مجدداً لتنفيذ التجربة!',
        shouldSpeak: true,
      });
      return;
    }

    setActiveReagentId(reagent.id);
    setAnimating(true);
    window.setTimeout(() => setAnimating(false), 750);

    const positive = reagent.positiveSamples.includes(selectedSampleId);
    const cellKey = `${selectedSampleId}_${reagent.id}`;
    setTestedMatrix((prev) => ({ ...prev, [cellKey]: positive ? 'pos' : 'neg' }));

    if (positive) {
      setDiscoveredNutrients((prev) => {
        const next = prev.includes(reagent.id) ? prev : [...prev, reagent.id];
        if (next.length === REAGENTS_DATA.length) {
          onEarnXp('st1_reagents', 50);
        }
        return next;
      });
      onTeacherSpeak({
        mood: 'success',
        badgeAr: `${reagent.nutrientAr} (${reagent.positiveResultAr})`,
        badgeFr: `${reagent.nutrientFr} · +`,
        speechText: reagent.positiveSpeech,
        shouldSpeak: true,
      });
    } else {
      onTeacherSpeak({
        mood: 'hint',
        badgeAr: `اختبار سلبي · غياب ${reagent.nutrientAr}`,
        badgeFr: `Absence : ${reagent.nutrientFr}`,
        speechText: reagent.negativeSpeech,
        shouldSpeak: true,
      });
    }
  };

  const stationDone = completedKeys.includes('st1_reagents');

  return (
    <div className="space-y-5">
      {/* Main Interactive Lab Bench */}
      <section className="rounded-2xl bg-[#0D1424]/90 border border-white/10 p-4 sm:p-5 space-y-5">
        {/* Step 1: Select Food Sample */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-[#00E5FF]" />
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-50">
                1. اختر العينة ثم اسحب أو اضغط على الكاشف
              </h2>
              <p className="text-xs font-latin text-[#00E5FF]">
                Mise en évidence des constituants des aliments
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono-num">
            <span className={stationDone ? 'text-[#00FFA3] font-bold' : 'text-[#FF9F1C] font-bold'}>
              {stationDone
                ? '✓ 7/7 كواشف · +50 XP'
                : `${discoveredNutrients.length}/7 مكتشفة · +50 XP`}
            </span>
            <button
              type="button"
              onClick={() => {
                setActiveReagentId(null);
                setTestedMatrix({});
                setDiscoveredNutrients([]);
              }}
              className="text-slate-400 hover:text-white cursor-pointer"
              title="تنظيف الأنابيب"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Sample Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FOOD_SAMPLES.map((sample) => {
            const isSel = sample.id === selectedSampleId;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => {
                  setSelectedSampleId(sample.id);
                  setActiveReagentId(null);
                  onTeacherSpeak({
                    mood: 'explaining',
                    badgeAr: sample.ar,
                    badgeFr: sample.fr,
                    speechText: `أمامك الآن عينة ${sample.ar}. اختر كاشفاً من الأسفل لإجراء الاختبار!`,
                    shouldSpeak: true,
                  });
                }}
                className={`rounded-xl px-3 py-2.5 border text-right transition-colors cursor-pointer ${
                  isSel
                    ? 'bg-[#00FFA3]/15 border-[#00FFA3] text-slate-50'
                    : 'bg-[#070B14]/75 border-white/10 text-slate-300 hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-extrabold">{sample.ar}</span>
                  <span
                    className="w-3 h-3 rounded-full border border-white/30 shrink-0"
                    style={{ backgroundColor: sample.liquidColor }}
                  />
                </div>
                <div className="text-[11px] font-latin text-[#00E5FF]">
                  {sample.fr}
                </div>
              </button>
            );
          })}
        </div>

        {/* Visual Animated Test Tube / Paper Bench + Reagents Rack */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Interactive Animated Reaction Tube / Paper SVG Stage */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const rId = e.dataTransfer.getData('text/plain') as ReagentId;
              const found = REAGENTS_DATA.find((r) => r.id === rId);
              if (found) runReagentTest(found);
            }}
            className="lg:col-span-5 rounded-xl bg-[#070B14] border border-white/15 p-4 flex flex-col items-center justify-between min-h-[300px] relative overflow-hidden"
          >
            {/* Active Result Banner */}
            <div className="w-full flex items-center justify-between text-xs z-10">
              <span className="font-bold text-slate-200">
                {activeSample.ar}{' '}
                <span className="font-latin text-slate-400">({activeSample.fr})</span>
              </span>
              {activeReagent && (
                <span
                  className={`inline-flex items-center gap-1 font-bold ${
                    isPositiveNow ? 'text-[#00FFA3]' : 'text-[#FF9F1C]'
                  }`}
                >
                  {isPositiveNow ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {activeReagent.nutrientAr}
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      اختبار سلبي
                    </>
                  )}
                </span>
              )}
            </div>

            {/* SVG Test Tube OR White Paper Lipid Rub Test */}
            {activeReagent?.isPaperTest ? (
              <svg viewBox="0 0 260 210" className="w-60 h-48 select-none">
                {/* White Filter Paper Sheet */}
                <rect
                  x="42"
                  y="24"
                  width="176"
                  height="130"
                  rx="8"
                  fill="#F1F5F9"
                  stroke="#94A3B8"
                  strokeWidth="2"
                />
                <text
                  x="130"
                  y="46"
                  textAnchor="middle"
                  fill="#334155"
                  fontSize="11"
                  fontWeight="700"
                >
                  ورقة بيضاء · Papier blanc
                </text>

                {/* Translucent Persistent Grease Spot if Positive */}
                {isPositiveNow ? (
                  <g>
                    <ellipse
                      cx="130"
                      cy="98"
                      rx="42"
                      ry="28"
                      fill="#F59E0B"
                      opacity="0.45"
                    />
                    <ellipse
                      cx="130"
                      cy="98"
                      rx="26"
                      ry="17"
                      fill="#FEF08A"
                      opacity="0.72"
                    />
                    <text
                      x="130"
                      y="102"
                      textAnchor="middle"
                      fill="#78350F"
                      fontSize="11"
                      fontWeight="800"
                    >
                      بقعة شفافة (دهنيات)
                    </text>
                  </g>
                ) : (
                  <text
                    x="130"
                    y="102"
                    textAnchor="middle"
                    fill="#64748B"
                    fontSize="11"
                    fontWeight="700"
                  >
                    لا توجد بقعة دهنية
                  </text>
                )}

                {/* Flame Underneath proving spot does NOT disappear with heat */}
                <path
                  d="M 130 162 C 142 178, 140 198, 130 202 C 120 198, 118 178, 130 162 Z"
                  fill="#FF9F1C"
                />
                <path
                  d="M 130 174 C 136 184, 135 196, 130 198 C 125 196, 124 184, 130 174 Z"
                  fill="#38BDF8"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 260 225" className="w-60 h-52 select-none">
                {/* Optional UV Sunbeam for Silver Nitrate */}
                {activeReagent?.needsLight && isPositiveNow && (
                  <g opacity="0.85">
                    <circle cx="215" cy="42" r="16" fill="#FDE047" />
                    <line x1="194" y1="54" x2="155" y2="120" stroke="#FDE047" strokeWidth="2.5" strokeDasharray="5 4" />
                    <line x1="204" y1="64" x2="162" y2="140" stroke="#FDE047" strokeWidth="2.5" strokeDasharray="5 4" />
                  </g>
                )}

                {/* Animated Pipette Dropper pouring drops */}
                {activeReagent && !activeReagent.needsHeat && (
                  <g>
                    <rect x="124" y="6" width="12" height="26" rx="4" fill="#94A3B8" />
                    <polygon points="126,32 134,32 130,44" fill="#CBD5E1" />
                    <circle
                      cx="130"
                      cy={animating ? 74 : 56}
                      r="5"
                      fill={activeReagent.reagentDropColor}
                      style={{ transition: 'cy 450ms ease-in' }}
                    />
                  </g>
                )}

                {/* Rising Steam Vapor for Chauffage */}
                {activeReagent?.id === 'chauffage' && (
                  <g stroke="#38BDF8" strokeWidth="2.5" fill="none" opacity="0.85">
                    <path d="M 118 52 Q 112 36 120 22" />
                    <path d="M 130 48 Q 138 32 130 16" />
                    <path d="M 142 52 Q 148 36 140 22" />
                    <circle cx="114" cy="76" r="3" fill="#38BDF8" />
                    <circle cx="146" cy="84" r="3.5" fill="#38BDF8" />
                    <circle cx="116" cy="96" r="2.8" fill="#38BDF8" />
                  </g>
                )}

                {/* Glass Test Tube Body */}
                <path
                  d="M 104 54 L 104 150 A 26 26 0 0 0 156 150 L 156 54"
                  fill="rgba(255,255,255,0.05)"
                  stroke="#94A3B8"
                  strokeWidth="3"
                />
                <ellipse cx="130" cy="54" rx="28" ry="5" fill="none" stroke="#CBD5E1" strokeWidth="2.5" />

                {/* Liquid / Food Sample inside Test Tube */}
                <path
                  d="M 107 108 L 107 150 A 23 23 0 0 0 153 150 L 153 108 Z"
                  fill={
                    activeReagent
                      ? isPositiveNow
                        ? activeReagent.id === 'chauffage'
                          ? activeSample.liquidColor
                          : activeReagent.reactionColor
                        : activeSample.liquidColor
                      : activeSample.liquidColor
                  }
                  opacity="0.88"
                  style={{ transition: 'fill 450ms ease' }}
                />

                {/* Precipitate Deposit Layer at Bottom (Silver Nitrate, Oxalate, Fehling) */}
                {activeReagent &&
                  isPositiveNow &&
                  (activeReagent.id === 'nitrate_argent' ||
                    activeReagent.id === 'oxalate_ammonium' ||
                    activeReagent.id === 'fehling') && (
                    <path
                      d="M 109 152 A 21 21 0 0 0 151 152 Z"
                      fill={
                        activeReagent.id === 'fehling'
                          ? '#991B1B'
                          : activeReagent.id === 'nitrate_argent'
                            ? '#1E293B'
                            : '#FFFFFF'
                      }
                    />
                  )}

                {/* Bunsen Burner Flame underneath when needsHeat */}
                {activeReagent?.needsHeat && (
                  <g>
                    <path
                      d="M 130 182 C 142 198, 140 216, 130 220 C 120 216, 118 198, 130 182 Z"
                      fill="#FF9F1C"
                    />
                    <path
                      d="M 130 194 C 136 204, 135 214, 130 217 C 125 214, 124 204, 130 194 Z"
                      fill="#00E5FF"
                    />
                  </g>
                )}
              </svg>
            )}

            {/* Reaction Badge at Bottom */}
            <div className="w-full text-center pt-2 border-t border-white/10">
              {activeReagent ? (
                <div className="text-xs font-extrabold">
                  <span className={isPositiveNow ? 'text-[#00FFA3]' : 'text-[#FF9F1C]'}>
                    {isPositiveNow
                      ? `${activeReagent.positiveResultAr} ← ${activeReagent.nutrientAr}`
                      : `لا يوجد تفاعل إيجابي (${activeReagent.nutrientAr})`}
                  </span>
                  <div className="font-latin text-[11px] text-slate-400">
                    {isPositiveNow
                      ? `${activeReagent.positiveResultFr} → ${activeReagent.nutrientFr}`
                      : `Test négatif : ${activeReagent.nutrientFr}`}
                  </div>
                </div>
              ) : (
                <span className="text-xs text-slate-400">
                  اسحب كاشفاً هنا أو اضغط عليه من القائمة
                </span>
              )}
            </div>
          </div>

          {/* 7 Interactive Chemical Reagents Rack */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5 content-start">
            {REAGENTS_DATA.map((r, idx) => {
              const isSelected = activeReagentId === r.id;
              const isDiscovered = discoveredNutrients.includes(r.id);
              return (
                <button
                  key={r.id}
                  type="button"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', r.id)}
                  onClick={() => runReagentTest(r)}
                  className={`text-right rounded-xl border p-3 transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-slate-50'
                      : isDiscovered
                        ? 'bg-[#00FFA3]/[0.07] border-[#00FFA3]/35 text-slate-100 hover:border-[#00FFA3]'
                        : 'bg-[#070B14]/80 border-white/10 text-slate-200 hover:border-white/30'
                  }`}
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold">
                      <span className="font-mono-num text-[#00E5FF]">{idx + 1}.</span>
                      <span className="truncate">{r.nameAr}</span>
                      {r.needsHeat && <Flame className="w-3.5 h-3.5 text-[#FF9F1C] shrink-0" />}
                      {r.needsLight && <Sun className="w-3.5 h-3.5 text-[#FDE047] shrink-0" />}
                    </div>
                    <div className="text-[11px] font-latin text-slate-400 truncate">
                      {r.nameFr}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className="w-4 h-4 rounded-full border border-white/30"
                      style={{ backgroundColor: r.reactionColor }}
                    />
                    {isDiscovered && (
                      <CheckCircle2 className="w-4 h-4 text-[#00FFA3]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live Visual Summary Table (Auto-Updated as Student Tests) */}
      <section className="rounded-2xl bg-[#0D1424]/90 border border-white/10 p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-extrabold text-slate-50">
            جدول النتائج التفاعلي (الخبز والحليب: أغذية مركبة)
          </h3>
          {stationDone && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#00FFA3]">
              <Award className="w-4 h-4" />
              مكتمل
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="py-2 px-2">الغذاء البسيط (Nutriment)</th>
                <th className="py-2 px-2">الكاشف (Réactif)</th>
                <th className="py-2 px-2">النتيجة الإيجابية</th>
                <th className="py-2 px-2 text-center">الخبز / رشاحته</th>
                <th className="py-2 px-2 text-center">الحليب / رشاحته</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {REAGENTS_DATA.map((r) => {
                const painTested =
                  testedMatrix[`pain_${r.id}`] || testedMatrix[`filtrat_pain_${r.id}`];
                const laitTested =
                  testedMatrix[`lait_${r.id}`] || testedMatrix[`filtrat_lait_${r.id}`];
                return (
                  <tr key={r.id} className="hover:bg-white/[0.02]">
                    <td className="py-2 px-2 font-bold text-slate-100">
                      {r.nutrientAr}{' '}
                      <span className="font-latin text-slate-400 font-normal">
                        ({r.nutrientFr})
                      </span>
                    </td>
                    <td className="py-2 px-2 text-slate-300">{r.nameAr}</td>
                    <td className="py-2 px-2 text-[#00E5FF] font-semibold">
                      {r.positiveResultAr}
                    </td>
                    <td className="py-2 px-2 text-center font-mono-num font-bold">
                      {painTested === 'pos' ? (
                        <span className="text-[#00FFA3]">(+)</span>
                      ) : painTested === 'neg' ? (
                        <span className="text-[#FF9F1C]">(–)</span>
                      ) : (
                        <span className="text-slate-600">?</span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-center font-mono-num font-bold">
                      {laitTested === 'pos' ? (
                        <span className="text-[#00FFA3]">(+)</span>
                      ) : laitTested === 'neg' ? (
                        <span className="text-[#FF9F1C]">(–)</span>
                      ) : (
                        <span className="text-slate-600">?</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
