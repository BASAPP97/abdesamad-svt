import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';
import type { MascotSignal, UnitConfig } from '../data/unitsData';

interface RegionalExamTabProps {
  unit: UnitConfig;
  onTeacherSpeak: (signal: MascotSignal) => void;
  onEarnXp: (key: string, amount: number) => void;
  completedKeys: string[];
}

export const RegionalExamTab: React.FC<RegionalExamTabProps> = ({
  unit,
  onTeacherSpeak,
  onEarnXp,
  completedKeys,
}) => {
  const { exam } = unit;
  const [scenarioId, setScenarioId] = useState<string>(exam.scenarios[0].id);
  const [selectedPointIdx, setSelectedPointIdx] = useState<number>(2);
  const [pickedChoices, setPickedChoices] = useState<Record<string, string>>({});
  const [showKeyStepId, setShowKeyStepId] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setScenarioId(exam.scenarios[0].id);
    setSelectedPointIdx(Math.min(2, exam.scenarios[0].points.length - 1));
    setPickedChoices({});
    setShowKeyStepId({});
  }, [unit.id, exam.scenarios]);

  const scenario =
    exam.scenarios.find((s) => s.id === scenarioId) || exam.scenarios[0];
  const points = scenario.points;
  const activePt = points[Math.min(selectedPointIdx, points.length - 1)] || points[0];

  // SVG Graph geometry
  const W = 580;
  const H = 250;
  const padL = 52;
  const padR = 24;
  const padT = 22;
  const padB = 40;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const maxX = Math.max(...points.map((p) => p.x), 10);
  const toX = (x: number) => padL + (x / maxX) * plotW;
  const toY = (y: number) => padT + (1 - Math.min(y, exam.yMax) / exam.yMax) * plotH;

  const path1 = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.x)} ${toY(p.y1)}`)
    .join(' ');
  const path2 =
    exam.series2 && points.every((p) => p.y2 !== undefined)
      ? points
          .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.x)} ${toY(p.y2 ?? 0)}`)
          .join(' ')
      : null;

  const handleChoice = (stepId: string, choiceId: string) => {
    const step = exam.steps.find((s) => s.id === stepId);
    const choice = step?.choices.find((c) => c.id === choiceId);
    if (!step || !choice) return;

    const next = { ...pickedChoices, [stepId]: choiceId };
    setPickedChoices(next);

    if (choice.isCorrect) {
      const allRight = exam.steps.every((s) => {
        const picked = next[s.id];
        return s.choices.some((c) => c.id === picked && c.isCorrect);
      });
      if (allRight) {
        onEarnXp(`exam_${unit.id}`, 50);
        onTeacherSpeak({
          mood: 'success',
          badgeAr: 'استدلال 6/6 · +50 XP',
          badgeFr: 'Raisonnement parfait !',
          speechText: 'تبارك الله عليك! أتقنت منهجية الامتحان الجهوي أصف وأفسر وأستنتج وحصدت خمسين نقطة!',
          shouldSpeak: true,
        });
      } else {
        onTeacherSpeak({
          mood: 'success',
          badgeAr: `${step.verbAr} ✓`,
          badgeFr: step.verbFr,
          speechText: choice.speech,
          shouldSpeak: true,
        });
      }
    } else {
      onTeacherSpeak({
        mood: 'hint',
        badgeAr: 'انتبه لمنهجية الجهوي',
        badgeFr: step.verbFr,
        speechText: choice.speech,
        shouldSpeak: true,
      });
    }
  };

  const examDone = completedKeys.includes(`exam_${unit.id}`);

  return (
    <div className="space-y-5">
      {/* Interactive Experimental Graph Card */}
      <section className="rounded-2xl bg-[#0D1424]/90 border border-white/10 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-50">
              {exam.titleAr}
            </h2>
            <p className="text-xs font-latin text-[#00E5FF] font-semibold">
              {exam.titleFr} · اضغط على النقط المضيئة في المبيان
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#070B14] border border-white/10">
            {exam.scenarios.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  setScenarioId(sc.id);
                  setSelectedPointIdx(Math.min(2, sc.points.length - 1));
                  onTeacherSpeak({
                    mood: 'explaining',
                    badgeAr: sc.labelAr,
                    badgeFr: sc.labelFr,
                    speechText: sc.speech,
                    shouldSpeak: true,
                  });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  sc.id === scenarioId
                    ? 'bg-[#00FFA3] text-[#070B14]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {sc.labelAr}
              </button>
            ))}
          </div>
        </div>

        {/* Clickable Data-Points SVG Chart */}
        <div className="rounded-xl bg-[#070B14] border border-white/10 p-3 space-y-3">
          <div className="w-full overflow-x-auto" dir="ltr">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[660px] mx-auto h-auto select-none">
              {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
                const val = exam.yMax * frac;
                const y = toY(val);
                return (
                  <g key={frac}>
                    <line
                      x1={padL}
                      y1={y}
                      x2={W - padR}
                      y2={y}
                      stroke="rgba(255,255,255,0.07)"
                      strokeDasharray={frac === 0 ? undefined : '4 4'}
                    />
                    <text
                      x={padL - 8}
                      y={y + 4}
                      textAnchor="end"
                      fill="#94A3B8"
                      fontSize="10"
                      fontFamily="IBM Plex Mono, monospace"
                    >
                      {exam.yMax <= 3 ? val.toFixed(1) : Math.round(val)}
                    </text>
                  </g>
                );
              })}

              {/* Axes */}
              <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#64748B" strokeWidth="1.5" />
              <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#64748B" strokeWidth="1.5" />

              <text x={W / 2 + 16} y={H - 8} textAnchor="middle" fill="#CBD5E1" fontSize="11">
                {exam.xLabel}
              </text>

              {/* Curve 1 */}
              <path
                d={path1}
                fill="none"
                stroke={exam.series1.color}
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Curve 2 */}
              {path2 && exam.series2 && (
                <path
                  d={path2}
                  fill="none"
                  stroke={exam.series2.color}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Active Vertical Guide */}
              <line
                x1={toX(activePt.x)}
                y1={padT}
                x2={toX(activePt.x)}
                y2={H - padB}
                stroke="#FF9F1C"
                strokeWidth="1.4"
                strokeDasharray="4 3"
              />

              {/* Clickable Glowing Data Points */}
              {points.map((pt, idx) => {
                const isSel = idx === selectedPointIdx;
                return (
                  <g
                    key={pt.x}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedPointIdx(idx);
                      onTeacherSpeak({
                        mood: 'explaining',
                        badgeAr: `النقطة x = ${pt.x}`,
                        badgeFr: `${exam.series1.nameFr}: ${pt.y1} ${exam.yUnit}`,
                        speechText: pt.noteSpeech,
                        shouldSpeak: true,
                      });
                    }}
                  >
                    <text
                      x={toX(pt.x)}
                      y={H - padB + 16}
                      textAnchor="middle"
                      fill={isSel ? '#00FFA3' : '#94A3B8'}
                      fontSize="10"
                      fontFamily="IBM Plex Mono, monospace"
                    >
                      {pt.x}
                    </text>

                    <circle
                      cx={toX(pt.x)}
                      cy={toY(pt.y1)}
                      r={isSel ? 8 : 5.5}
                      fill={exam.series1.color}
                      stroke="#070B14"
                      strokeWidth="2.2"
                    />

                    {exam.series2 && pt.y2 !== undefined && (
                      <circle
                        cx={toX(pt.x)}
                        cy={toY(pt.y2)}
                        r={isSel ? 8 : 5.5}
                        fill={exam.series2.color}
                        stroke="#070B14"
                        strokeWidth="2.2"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Live Numeric Coordinate Readout */}
          <div className="flex flex-wrap items-center justify-around gap-3 pt-2.5 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: exam.series1.color }}
              />
              <span className="text-slate-300">{exam.series1.nameAr}:</span>
              <span className="font-mono-num font-bold text-slate-50">
                {activePt.y1} {exam.yUnit}
              </span>
            </div>

            {exam.series2 && activePt.y2 !== undefined && (
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: exam.series2.color }}
                />
                <span className="text-slate-300">{exam.series2.nameAr}:</span>
                <span className="font-mono-num font-bold text-slate-50">
                  {activePt.y2} {exam.yUnit}
                </span>
              </div>
            )}

            <div className="font-mono-num text-[#FF9F1C] font-bold">
              {examDone ? '✓ 6/6 pts · +50 XP' : 'الجهوي: 6 pts · +50 XP'}
            </div>
          </div>
        </div>
      </section>

      {/* Guided Visual 3-Step Reasoning: أصف · أفسر · أستنتج */}
      <div className="grid grid-cols-1 gap-3.5">
        {exam.steps.map((step) => {
          const picked = pickedChoices[step.id];
          const isOpen = Boolean(showKeyStepId[step.id]);

          return (
            <div
              key={step.id}
              className="rounded-2xl bg-[#0D1424]/90 border border-white/10 p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono-num text-xs font-extrabold text-[#00FFA3]">
                    0{step.stepNum}.
                  </span>
                  <span className="text-sm font-extrabold text-slate-50">
                    {step.verbAr}
                  </span>
                  <span className="text-xs font-latin text-[#00E5FF]">
                    ({step.verbFr})
                  </span>
                  <span className="text-xs text-slate-300 hidden sm:inline">
                    — {step.promptAr}
                  </span>
                </div>
                <span className="text-xs font-mono-num text-slate-400">
                  {step.pointsLabel}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {step.choices.map((ch) => {
                  const isSel = picked === ch.id;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => handleChoice(step.id, ch.id)}
                      className={`text-right rounded-xl border p-3 transition-colors cursor-pointer ${
                        isSel
                          ? ch.isCorrect
                            ? 'bg-[#00FFA3]/14 border-[#00FFA3] text-slate-50'
                            : 'bg-[#FF9F1C]/14 border-[#FF9F1C] text-slate-100'
                          : 'bg-[#070B14]/85 border-white/10 text-slate-200 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {isSel &&
                          (ch.isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-[#00FFA3] shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-[#FF9F1C] shrink-0 mt-0.5" />
                          ))}
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold leading-snug">
                            {ch.shortAr}
                          </div>
                          <div className="text-[11px] font-latin text-slate-400">
                            {ch.shortFr}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() =>
                    setShowKeyStepId((prev) => ({ ...prev, [step.id]: !isOpen }))
                  }
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#00E5FF] hover:text-white cursor-pointer"
                >
                  {isOpen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{isOpen ? 'إخفاء الجواب النموذجي' : 'إظهار مفتاح الإجابة'}</span>
                </button>
                {examDone && step.stepNum === 3 && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#00FFA3]">
                    <Award className="w-3.5 h-3.5" />
                    تحدي مكتمل
                  </span>
                )}
              </div>

              {isOpen && (
                <div className="rounded-lg bg-[#070B14] border border-[#00FFA3]/35 px-3 py-2 text-xs font-semibold text-[#00FFA3]">
                  {step.keyFormulaAr}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
