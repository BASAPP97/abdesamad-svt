import React, { useState, useEffect } from 'react';
import { Globe, EyeOff, CheckCircle2, XCircle, Network, RotateCcw } from 'lucide-react';
import type { MascotSignal, SchemaPin, UnitConfig } from '../data/unitsData';
import { UnitSchemaSvg } from './UnitSchemaSvg';

type LabelMode = 'bilingual' | 'biof' | 'exam';

interface SchemaMindMapTabProps {
  unit: UnitConfig;
  onTeacherSpeak: (signal: MascotSignal) => void;
  onEarnXp: (key: string, amount: number) => void;
}

export const SchemaMindMapTab: React.FC<SchemaMindMapTabProps> = ({
  unit,
  onTeacherSpeak,
  onEarnXp,
}) => {
  const [labelMode, setLabelMode] = useState<LabelMode>('bilingual');
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const [solvedPins, setSolvedPins] = useState<string[]>([]);
  const [testingPinId, setTestingPinId] = useState<string | null>(null);
  const [wrongChoiceId, setWrongChoiceId] = useState<string | null>(null);
  const [expandedBranchId, setExpandedBranchId] = useState<string>(
    unit.mindMapBranches[0]?.id || '',
  );

  // Reset state when switching units
  useEffect(() => {
    setActivePinId(null);
    setSolvedPins([]);
    setTestingPinId(null);
    setWrongChoiceId(null);
    setExpandedBranchId(unit.mindMapBranches[0]?.id || '');
  }, [unit.id, unit.mindMapBranches]);

  const handlePinClick = (pin: SchemaPin) => {
    setActivePinId(pin.id);
    if (labelMode === 'exam') {
      if (solvedPins.includes(pin.id)) {
        onTeacherSpeak({
          mood: 'success',
          badgeAr: pin.ar,
          badgeFr: pin.fr,
          speechText: pin.speech,
          shouldSpeak: true,
        });
      } else {
        setTestingPinId(pin.id);
        setWrongChoiceId(null);
        onTeacherSpeak({
          mood: 'explaining',
          badgeAr: `اختبار الرقم ${pin.num}`,
          badgeFr: `Identifier le n° ${pin.num}`,
          speechText: `ما هو اسم العنصر رقم ${pin.num} في هذا الرسم التخطيطي؟`,
          shouldSpeak: true,
        });
      }
      return;
    }

    onTeacherSpeak({
      mood: 'explaining',
      badgeAr: pin.ar,
      badgeFr: pin.fr,
      speechText: pin.speech,
      shouldSpeak: true,
    });
  };

  const handleExamGuess = (targetPin: SchemaPin, guessedPin: SchemaPin) => {
    if (guessedPin.id === targetPin.id) {
      const nextSolved = [...solvedPins, targetPin.id];
      setSolvedPins(nextSolved);
      setTestingPinId(null);
      setWrongChoiceId(null);

      if (nextSolved.length === unit.schemaPins.length) {
        onEarnXp(`schema_${unit.id}`, 50);
        onTeacherSpeak({
          mood: 'success',
          badgeAr: 'رسم تخطيطي كامل · +50 XP',
          badgeFr: 'Schéma 100% maîtrisé !',
          speechText: 'تبارك الله عليك! تعرّفت على جميع عناصر الرسم التخطيطي بنجاح وحصلت على خمسين نقطة!',
          shouldSpeak: true,
        });
      } else {
        onTeacherSpeak({
          mood: 'success',
          badgeAr: targetPin.ar,
          badgeFr: targetPin.fr,
          speechText: `ممتاز! الرقم ${targetPin.num} هو ${targetPin.ar}.`,
          shouldSpeak: true,
        });
      }
    } else {
      setWrongChoiceId(guessedPin.id);
      onTeacherSpeak({
        mood: 'hint',
        badgeAr: 'حاول مجدداً',
        badgeFr: 'Essaie encore',
        speechText: `ليس ${guessedPin.ar}، لاحظ موقع الرقم ${targetPin.num} جيداً وحاول مرة أخرى.`,
        shouldSpeak: true,
      });
    }
  };

  const testingPin = unit.schemaPins.find((p) => p.id === testingPinId) || null;

  return (
    <div className="space-y-6">
      {/* Section 1: Interactive Bilingual Anatomical Schema + 3-Mode Switcher */}
      <section className="rounded-2xl bg-[#0D1424]/90 border border-white/10 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-50">
              {unit.schemaTitleAr}
            </h2>
            <p className="text-xs font-latin text-[#00E5FF] font-semibold">
              {unit.schemaTitleFr}
            </p>
          </div>

          {/* 3-Mode Instant Switcher */}
          <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#070B14] border border-white/10">
            <button
              type="button"
              onClick={() => {
                setLabelMode('bilingual');
                setTestingPinId(null);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                labelMode === 'bilingual'
                  ? 'bg-[#00FFA3] text-[#070B14]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>ثنائي اللغة Ar/Fr</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLabelMode('biof');
                setTestingPinId(null);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                labelMode === 'biof'
                  ? 'bg-[#00E5FF] text-[#070B14]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="font-latin">FR</span>
              <span>فرنسي Biof</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLabelMode('exam');
                setSolvedPins([]);
                setTestingPinId(unit.schemaPins[0]?.id || null);
                onTeacherSpeak({
                  mood: 'explaining',
                  badgeAr: 'وضع الامتحان: أخفِ الأسماء',
                  badgeFr: 'Mode Examen : Légender',
                  speechText: 'وضع الامتحان مفعّل! اضغط على الأرقام المخفية واختر الاسم الصحيح لكل عنصر.',
                  shouldSpeak: true,
                });
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                labelMode === 'exam'
                  ? 'bg-[#FF9F1C] text-[#070B14]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>وضع الامتحان: إخفاء الأسماء</span>
            </button>
          </div>
        </div>

        {/* Interactive Diagram Stage */}
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/10 bg-[#070B14]">
          <UnitSchemaSvg unitId={unit.id} />

          {/* Numbered Interactive Pins */}
          {unit.schemaPins.map((pin) => {
            const isSolved = solvedPins.includes(pin.id);
            const isActive = activePinId === pin.id || testingPinId === pin.id;
            const showHidden = labelMode === 'exam' && !isSolved;

            return (
              <button
                key={pin.id}
                type="button"
                onClick={() => handlePinClick(pin)}
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-bold transition-transform cursor-pointer shadow-lg ${
                  isActive
                    ? 'scale-110 z-20 bg-[#070B14]/95 border-[#00FFA3] text-[#00FFA3]'
                    : isSolved && labelMode === 'exam'
                      ? 'z-10 bg-[#00FFA3]/15 border-[#00FFA3] text-[#00FFA3]'
                      : 'z-10 bg-[#070B14]/90 border-white/20 text-slate-100 hover:scale-105 hover:border-[#00E5FF]'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full text-[11px] font-mono-num font-extrabold flex items-center justify-center text-[#070B14] shrink-0"
                  style={{ backgroundColor: showHidden ? '#FF9F1C' : pin.color }}
                >
                  {pin.num}
                </span>

                {!showHidden && (
                  <span className="flex flex-col text-right leading-tight">
                    {labelMode !== 'biof' && (
                      <span className="whitespace-nowrap text-[11px]">{pin.ar}</span>
                    )}
                    <span
                      className={`whitespace-nowrap font-latin ${
                        labelMode === 'biof'
                          ? 'text-[11px] text-slate-50'
                          : 'text-[10px] text-[#00E5FF]'
                      }`}
                    >
                      {pin.fr}
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Exam Mode Self-Test Label Picker Bar */}
        {labelMode === 'exam' && (
          <div className="rounded-xl bg-[#070B14] border border-[#FF9F1C]/35 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-bold text-[#FF9F1C]">
                {testingPin
                  ? `اختر التسمية الصحيحة للرقم (${testingPin.num}):`
                  : solvedPins.length === unit.schemaPins.length
                    ? 'أحسنت! أتممت جميع عناصر الرسم التخطيطي (+50 XP)'
                    : 'اضغط على أي رقم برتقالي في الرسم لاختبار نفسك'}
              </span>
              <div className="flex items-center gap-3 font-mono-num">
                <span className="text-[#00FFA3] font-bold">
                  {solvedPins.length} / {unit.schemaPins.length}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSolvedPins([]);
                    setTestingPinId(unit.schemaPins[0]?.id || null);
                  }}
                  className="inline-flex items-center gap-1 text-slate-300 hover:text-white cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {testingPin && (
              <div className="flex flex-wrap gap-2">
                {unit.schemaPins.map((opt) => {
                  const alreadyUsed = solvedPins.includes(opt.id);
                  const isWrong = wrongChoiceId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={alreadyUsed}
                      onClick={() => handleExamGuess(testingPin, opt)}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
                        alreadyUsed
                          ? 'bg-[#00FFA3]/10 border-[#00FFA3]/30 text-[#00FFA3]/60 cursor-default'
                          : isWrong
                            ? 'bg-[#FF9F1C]/20 border-[#FF9F1C] text-[#FF9F1C] cursor-pointer'
                            : 'bg-[#0D1424] border-white/15 text-slate-100 hover:border-[#00E5FF] cursor-pointer'
                      }`}
                    >
                      {alreadyUsed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00FFA3]" />
                      ) : isWrong ? (
                        <XCircle className="w-3.5 h-3.5 text-[#FF9F1C]" />
                      ) : null}
                      <span>{opt.ar}</span>
                      <span className="font-latin text-[#00E5FF] text-[11px]">
                        {opt.fr}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Section 2: Expandable Visual Mind Map (Zero Paragraphs!) */}
      <section className="rounded-2xl bg-[#0D1424]/90 border border-white/10 p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-[#00FFA3]" />
            <h2 className="text-base sm:text-lg font-extrabold text-slate-50">
              الخريطة الذهنية البصرية
            </h2>
          </div>
          <span className="text-xs font-latin text-slate-400">
            Carte mentale interactive
          </span>
        </div>

        {/* Center Node + Connected Branches */}
        <div className="flex flex-col items-center gap-4">
          {/* Central Core Hub */}
          <div className="px-6 py-3 rounded-2xl bg-[#070B14] border-2 border-[#00FFA3]/60 text-center shadow-[0_0_24px_rgba(0,255,163,0.16)]">
            <div className="text-base font-extrabold text-[#00FFA3]">
              {labelMode === 'biof' ? unit.mindMapCenterFr : unit.mindMapCenterAr}
            </div>
            {labelMode === 'bilingual' && (
              <div className="text-xs font-latin text-[#00E5FF] font-semibold">
                {unit.mindMapCenterFr}
              </div>
            )}
          </div>

          {/* Connecting Bio-Circuit SVG Stem */}
          <svg viewBox="0 0 600 32" className="w-full max-w-2xl h-7 hidden sm:block">
            <path
              d="M 300 0 L 300 16 M 100 16 L 500 16 M 100 16 L 100 32 M 300 16 L 300 32 M 500 16 L 500 32"
              stroke="rgba(0,255,163,0.45)"
              strokeWidth="2.5"
              fill="none"
            />
          </svg>

          {/* Expandable Branch Nodes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 w-full">
            {unit.mindMapBranches.map((branch) => {
              const isOpen = expandedBranchId === branch.id;
              return (
                <div
                  key={branch.id}
                  className={`rounded-xl border transition-colors p-3.5 space-y-3 ${
                    isOpen
                      ? 'bg-[#070B14] border-white/25'
                      : 'bg-[#070B14]/65 border-white/10'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setExpandedBranchId(branch.id);
                      onTeacherSpeak({
                        mood: 'explaining',
                        badgeAr: branch.titleAr,
                        badgeFr: branch.titleFr,
                        speechText: branch.speech,
                        shouldSpeak: true,
                      });
                    }}
                    className="w-full text-right flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <div>
                      <div
                        className="text-sm font-extrabold"
                        style={{ color: branch.color }}
                      >
                        {labelMode === 'biof' ? branch.titleFr : branch.titleAr}
                      </div>
                      {labelMode === 'bilingual' && (
                        <div className="text-[11px] font-latin text-slate-400">
                          {branch.titleFr}
                        </div>
                      )}
                    </div>
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: branch.color }}
                    />
                  </button>

                  {/* Visual Leaf Chips */}
                  <div className="space-y-1.5 pt-2 border-t border-white/10">
                    {branch.children.map((leaf) => (
                      <button
                        key={leaf.fr}
                        type="button"
                        onClick={() =>
                          onTeacherSpeak({
                            mood: 'explaining',
                            badgeAr: leaf.ar,
                            badgeFr: leaf.fr,
                            speechText: leaf.speech,
                            shouldSpeak: true,
                          })
                        }
                        className="w-full text-right px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 transition-colors cursor-pointer"
                      >
                        <div className="text-xs font-bold text-slate-100">
                          {labelMode === 'biof' ? leaf.fr : leaf.ar}
                        </div>
                        {labelMode === 'bilingual' && (
                          <div className="text-[11px] font-latin text-[#00E5FF]">
                            {leaf.fr}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
