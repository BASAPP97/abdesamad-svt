import React, { useState } from 'react';
import {
  ShieldCheck,
  Network,
  Globe,
  EyeOff,
  Trophy,
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
} from 'lucide-react';
import { HYGIENE_PAIRS, LESSON1_MIND_MAP } from '../data/nutritionLessonData';
import type { MascotSignal } from '../data/unitsData';

interface Station5HygieneMindMapExamProps {
  onTeacherSpeak: (signal: MascotSignal) => void;
  onEarnXp: (key: string, amount: number) => void;
  completedKeys: string[];
}

type MindMapMode = 'bilingual' | 'biof' | 'exam';

const EXAM_QUESTIONS = [
  {
    id: 'eq1',
    tagAr: 'استدلال · منحنى الفئران (Kwashiorkor)',
    tagFr: 'Raisonnement : Caséine vs Zéine',
    promptAr: 'لماذا استأنف الفأر 2 نموه السريع بعد اليوم 80 (Z+T+L)؟',
    choices: [
      {
        id: 'a',
        ar: 'لأن إضافة التريبتوفان والليزين معاً أكملت الأحماض الأمينية الأساسية للنمو',
        fr: 'Apport des acides aminés essentiels (T + L)',
        ok: true,
        speech: 'تفسير نموذجي 100%! النمو السليم يتطلب توفر جميع الأحماض الأمينية الأساسية.',
      },
      {
        id: 'b',
        ar: 'لأن الفأر بدأ يتناول السكريات والدهنيات فقط بعد اليوم 80',
        fr: 'Uniquement glucides et lipides',
        ok: false,
        speech: 'انتبه للمنحنى! ما أضفناه في اليوم 80 هو الحمض الأميني الأساسي الليزين.',
      },
    ],
  },
  {
    id: 'eq2',
    tagAr: 'حساب · الكلتة الطاقية (17 / 17 / 38 kJ)',
    tagFr: 'Calcul énergétique (Ration 3AC)',
    promptAr: 'تناول تلميذ 300g سكريات، 80g بروتيدات، و 100g دهنيات. ما الإمداد الطاقي الإجمالي؟',
    choices: [
      {
        id: 'a',
        ar: '10 260 kJ  ←  (300×17) + (80×17) + (100×38)',
        fr: '5100 + 1360 + 3800 = 10 260 kJ',
        ok: true,
        speech: 'حساب دقيق يا بطل! 5100 زائد 1360 زائد 3800 يساوي 10260 كيلوجول!',
      },
      {
        id: 'b',
        ar: '8 160 kJ  ←  (300+80+100) × 17',
        fr: '480 × 17 = 8160 kJ',
        ok: false,
        speech: 'لا تنسَ أن 1 غرام من الدهنيات يحرر 38 كيلوجول وليس 17 كيلوجول!',
      },
    ],
  },
  {
    id: 'eq3',
    tagAr: 'تشخيص · مؤشر IMC',
    tagFr: 'Analyse IMC = P / T²',
    promptAr: 'تلميذ عمره 15 سنة، وزنه 78 kg وطوله 1.60 m (IMC ≈ 30.5). ما التشخيص والنصيحة؟',
    choices: [
      {
        id: 'a',
        ar: 'سمنة (OD) ← تقليل السكريات والدهنيات وممارسة الرياضة بانتظام',
        fr: 'Obésité → Équilibre alimentaire + Sport',
        ok: true,
        speech: 'تشخيص طبي دقيق ونصيحة وقائية مثالية للامتحان الجهوي!',
      },
      {
        id: 'b',
        ar: 'وزن عادي (PN) ← الإكثار من الوجبات السريعة والدهون',
        fr: 'Poids normal',
        ok: false,
        speech: 'انتبه! مؤشر 30.5 يتجاوز 27.5 عند مراهق في سن 15 سنة، إذن هي حالة سمنة!',
      },
    ],
  },
];

export const Station5HygieneMindMapExam: React.FC<Station5HygieneMindMapExamProps> = ({
  onTeacherSpeak,
  onEarnXp,
  completedKeys,
}) => {
  // 1. Digestive Hygiene Matcher
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const [matchedRisks, setMatchedRisks] = useState<string[]>([]);
  const [wrongHabitId, setWrongHabitId] = useState<string | null>(null);

  const habitDisplayOrder = [
    HYGIENE_PAIRS[2],
    HYGIENE_PAIRS[4],
    HYGIENE_PAIRS[0],
    HYGIENE_PAIRS[3],
    HYGIENE_PAIRS[1],
  ];

  // 2. Full Mind Map Mode
  const [mapMode, setMapMode] = useState<MindMapMode>('bilingual');
  const [revealedHidden, setRevealedHidden] = useState<string[]>([]);

  // 3. Regional Exam Answers
  const [examPicked, setExamPicked] = useState<Record<string, string>>({});

  const handleMatchHabit = (habitPairId: string) => {
    if (!selectedRiskId || matchedRisks.includes(habitPairId)) return;
    const riskObj = HYGIENE_PAIRS.find((p) => p.id === selectedRiskId);
    if (!riskObj) return;

    if (selectedRiskId === habitPairId) {
      const next = [...matchedRisks, habitPairId];
      setMatchedRisks(next);
      setSelectedRiskId(null);
      setWrongHabitId(null);

      if (next.length === HYGIENE_PAIRS.length) {
        onEarnXp('st5_hygiene', 50);
        onTeacherSpeak({
          mood: 'success',
          badgeAr: 'وقاية الجهاز الهضمي · +50 XP',
          badgeFr: 'Hygiène digestive 100%',
          speechText: 'تبارك الله عليك! ربطت جميع أخطار الجهاز الهضمي بسبل الوقاية السليمة وحصلت على خمسين نقطة!',
          shouldSpeak: true,
        });
      } else {
        onTeacherSpeak({
          mood: 'success',
          badgeAr: `${riskObj.riskAr} ✓`,
          badgeFr: riskObj.riskFr,
          speechText: riskObj.speech,
          shouldSpeak: true,
        });
      }
    } else {
      setWrongHabitId(habitPairId);
      window.setTimeout(() => setWrongHabitId(null), 550);
      onTeacherSpeak({
        mood: 'hint',
        badgeAr: 'جرب عادة وقائية أخرى',
        badgeFr: riskObj.riskFr,
        speechText: `فكّر في الطريقة الأنسب للوقاية من ${riskObj.riskAr}!`,
        shouldSpeak: true,
      });
    }
  };

  const handleExamPick = (qId: string, choiceId: string) => {
    const q = EXAM_QUESTIONS.find((item) => item.id === qId);
    const ch = q?.choices.find((c) => c.id === choiceId);
    if (!q || !ch) return;

    const next = { ...examPicked, [qId]: choiceId };
    setExamPicked(next);

    if (ch.ok) {
      const allDone = EXAM_QUESTIONS.every((item) => {
        const p = next[item.id];
        return item.choices.some((c) => c.id === p && c.ok);
      });
      if (allDone) {
        onEarnXp('st5_exam', 100);
        onTeacherSpeak({
          mood: 'success',
          badgeAr: 'بطل التربية الغذائية · +100 XP',
          badgeFr: 'Examen Régional 100% !',
          speechText: 'ممتاز يا بطل! أتممت جميع تمارين الامتحان الجهوي لدرس التربية الغذائية وحصدت مئة نقطة!',
          shouldSpeak: true,
        });
      } else {
        onTeacherSpeak({
          mood: 'success',
          badgeAr: 'إجابة صحيحة ✓',
          badgeFr: q.tagFr,
          speechText: ch.speech,
          shouldSpeak: true,
        });
      }
    } else {
      onTeacherSpeak({
        mood: 'hint',
        badgeAr: 'تلميح الأستاذ',
        badgeFr: q.tagFr,
        speechText: ch.speech,
        shouldSpeak: true,
      });
    }
  };

  const hygieneDone = completedKeys.includes('st5_hygiene');
  const examDone = completedKeys.includes('st5_exam');

  return (
    <div className="space-y-6">
      {/* 1. Digestive Hygiene Matcher */}
      <section className="rounded-2xl bg-[#0D1424]/90 border border-white/10 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#00FFA3]" />
            <div>
              <h2 className="text-base font-extrabold text-slate-50">
                01. وقاية الجهاز الهضمي (اربط الخطر بالوقاية)
              </h2>
              <p className="text-xs font-latin text-[#00E5FF]">
                Hygiène de l’appareil digestif · اضغط على المرض ثم العادة الوقائية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono-num">
            {hygieneDone ? (
              <span className="inline-flex items-center gap-1 text-[#00FFA3] font-bold">
                <Award className="w-4 h-4" />
                +50 XP
              </span>
            ) : (
              <span className="text-[#FF9F1C] font-bold">
                {matchedRisks.length}/{HYGIENE_PAIRS.length} · +50 XP
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setMatchedRisks([]);
                setSelectedRiskId(null);
              }}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {HYGIENE_PAIRS.map((p) => {
              const isMatched = matchedRisks.includes(p.id);
              const isSel = selectedRiskId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={isMatched}
                  onClick={() => setSelectedRiskId(p.id)}
                  className={`w-full text-right rounded-xl border px-3.5 py-2.5 flex items-center justify-between gap-2 transition-colors ${
                    isMatched
                      ? 'bg-[#00FFA3]/10 border-[#00FFA3]/40 text-[#00FFA3]'
                      : isSel
                        ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-slate-50 cursor-pointer'
                        : 'bg-[#070B14] border-white/10 text-slate-200 hover:border-white/30 cursor-pointer'
                  }`}
                >
                  <div>
                    <div className="text-xs font-extrabold">{p.riskAr}</div>
                    <div className="text-[10px] font-latin text-slate-400">{p.riskFr}</div>
                  </div>
                  {isMatched && <CheckCircle2 className="w-4 h-4 text-[#00FFA3]" />}
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            {habitDisplayOrder.map((p) => {
              const isMatched = matchedRisks.includes(p.id);
              const isWrong = wrongHabitId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={isMatched}
                  onClick={() => handleMatchHabit(p.id)}
                  className={`w-full text-right rounded-xl border px-3.5 py-2.5 flex items-center justify-between gap-2 transition-colors ${
                    isMatched
                      ? 'bg-[#00FFA3]/10 border-[#00FFA3]/40 text-[#00FFA3]'
                      : isWrong
                        ? 'bg-[#FF9F1C]/20 border-[#FF9F1C] text-[#FF9F1C] cursor-pointer'
                        : selectedRiskId
                          ? 'bg-[#070B14] border-[#00E5FF]/40 text-slate-100 hover:bg-[#00E5FF]/10 cursor-pointer'
                          : 'bg-[#070B14]/65 border-white/10 text-slate-300 cursor-pointer'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">{p.habitAr}</div>
                    <div className="text-[10px] font-latin text-slate-400">{p.habitFr}</div>
                  </div>
                  {isMatched && <CheckCircle2 className="w-4 h-4 text-[#00FFA3]" />}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Full Lesson 1 Interactive Mind Map (with 3-Mode Toggle) */}
      <section className="rounded-2xl bg-[#0D1424]/90 border border-white/10 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-[#00E5FF]" />
            <div>
              <h2 className="text-base font-extrabold text-slate-50">
                02. الخريطة الذهنية الشاملة (التربية الغذائية)
              </h2>
              <p className="text-xs font-latin text-[#00E5FF]">
                Carte mentale complète · 5 محاور مركزة
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#070B14] border border-white/10">
            <button
              type="button"
              onClick={() => setMapMode('bilingual')}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                mapMode === 'bilingual' ? 'bg-[#00FFA3] text-[#070B14]' : 'text-slate-300'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>ثنائي اللغة</span>
            </button>
            <button
              type="button"
              onClick={() => setMapMode('biof')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold font-latin cursor-pointer ${
                mapMode === 'biof' ? 'bg-[#00E5FF] text-[#070B14]' : 'text-slate-300'
              }`}
            >
              Biof FR
            </button>
            <button
              type="button"
              onClick={() => {
                setMapMode('exam');
                setRevealedHidden([]);
                onTeacherSpeak({
                  mood: 'explaining',
                  badgeAr: 'اختبر حفظك للمصطلحات',
                  badgeFr: 'Mode Examen : Révéler',
                  speechText: 'وضع الامتحان مفعّل! حاول تذكر المصطلح المخفي ثم اضغط عليه للتحقق والاستماع.',
                  shouldSpeak: true,
                });
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                mapMode === 'exam' ? 'bg-[#FF9F1C] text-[#070B14]' : 'text-slate-300'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>إخفاء المصطلحات</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {LESSON1_MIND_MAP.map((branch) => (
            <div
              key={branch.id}
              className="rounded-xl bg-[#070B14] border border-white/10 p-3.5 space-y-2.5"
            >
              <button
                type="button"
                onClick={() =>
                  onTeacherSpeak({
                    mood: 'explaining',
                    badgeAr: branch.ar,
                    badgeFr: branch.fr,
                    speechText: branch.speech,
                    shouldSpeak: true,
                  })
                }
                className="w-full text-right flex items-center justify-between gap-2 pb-2 border-b border-white/10 cursor-pointer"
              >
                <span className="text-xs font-extrabold" style={{ color: branch.color }}>
                  {mapMode === 'biof' ? branch.fr : branch.ar}
                </span>
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: branch.color }} />
              </button>

              <div className="space-y-1.5">
                {branch.nodes.map((node, idx) => {
                  const key = `${branch.id}_${idx}`;
                  const hidden = mapMode === 'exam' && !revealedHidden.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        if (hidden) setRevealedHidden((prev) => [...prev, key]);
                        onTeacherSpeak({
                          mood: 'explaining',
                          badgeAr: node.ar,
                          badgeFr: node.fr,
                          speechText: node.speech,
                          shouldSpeak: true,
                        });
                      }}
                      className={`w-full text-right px-2.5 py-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                        hidden
                          ? 'bg-[#FF9F1C]/10 border-dashed border-[#FF9F1C]/45 text-[#FF9F1C] font-bold text-center'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-100'
                      }`}
                    >
                      {hidden ? (
                        <span>اضغط لكشف المصطلح #{idx + 1}</span>
                      ) : (
                        <>
                          <div className="font-bold">
                            {mapMode === 'biof' ? node.fr : node.ar}
                          </div>
                          {mapMode === 'bilingual' && (
                            <div className="text-[10px] font-latin text-[#00E5FF]">
                              {node.fr}
                            </div>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Regional Exam Practice (Rat Curve, Ration kJ, IMC Curve) */}
      <section className="rounded-2xl bg-[#0D1424]/90 border border-white/10 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#FF9F1C]" />
            <div>
              <h2 className="text-base font-extrabold text-slate-50">
                03. تمارين الامتحان الجهوي (الاستدلال العلمي)
              </h2>
              <p className="text-xs font-latin text-[#00E5FF]">
                Courbe Kwashiorkor · Calcul kJ · Analyse IMC
              </p>
            </div>
          </div>
          <span className={`text-xs font-mono-num font-bold ${examDone ? 'text-[#00FFA3]' : 'text-[#FF9F1C]'}`}>
            {examDone ? '✓ مكتمل +100 XP' : '+100 XP'}
          </span>
        </div>

        <div className="space-y-3.5">
          {EXAM_QUESTIONS.map((q, idx) => {
            const picked = examPicked[q.id];
            return (
              <div
                key={q.id}
                className="rounded-xl bg-[#070B14] border border-white/10 p-4 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-extrabold text-[#00E5FF]">
                    0{idx + 1}. {q.tagAr}
                  </span>
                  <span className="font-latin text-slate-400">{q.tagFr}</span>
                </div>
                <p className="text-sm font-bold text-slate-100">{q.promptAr}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.choices.map((ch) => {
                    const isSel = picked === ch.id;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => handleExamPick(q.id, ch.id)}
                        className={`text-right rounded-xl border p-3 transition-colors cursor-pointer ${
                          isSel
                            ? ch.ok
                              ? 'bg-[#00FFA3]/15 border-[#00FFA3] text-slate-50'
                              : 'bg-[#FF9F1C]/15 border-[#FF9F1C] text-slate-100'
                            : 'bg-[#0D1424] border-white/10 text-slate-200 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {isSel &&
                            (ch.ok ? (
                              <CheckCircle2 className="w-4 h-4 text-[#00FFA3] shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="w-4 h-4 text-[#FF9F1C] shrink-0 mt-0.5" />
                            ))}
                          <div>
                            <div className="text-xs font-bold leading-snug">{ch.ar}</div>
                            <div className="text-[10px] font-latin text-slate-400 mt-0.5">
                              {ch.fr}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
