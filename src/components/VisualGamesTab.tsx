import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, Crosshair, Hand, RotateCcw } from 'lucide-react';
import type { DragToken, MascotSignal, UnitConfig } from '../data/unitsData';
import { UnitSchemaSvg } from './UnitSchemaSvg';

interface VisualGamesTabProps {
  unit: UnitConfig;
  onTeacherSpeak: (signal: MascotSignal) => void;
  onEarnXp: (key: string, amount: number) => void;
  completedKeys: string[];
}

interface BurstState {
  id: number;
  x: number;
  y: number;
  color: string;
}

const BURST_ANGLES = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324];

export const VisualGamesTab: React.FC<VisualGamesTabProps> = ({
  unit,
  onTeacherSpeak,
  onEarnXp,
  completedKeys,
}) => {
  // Game 1: Drag & Drop / Tap-to-Sort State
  const [placedMap, setPlacedMap] = useState<Record<string, 'A' | 'B'>>({});
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [draggedTokenId, setDraggedTokenId] = useState<string | null>(null);
  const [shakeZone, setShakeZone] = useState<'A' | 'B' | null>(null);

  // Game 2: Diagram Click-the-Hotspot State
  const [challengeIdx, setChallengeIdx] = useState<number>(0);
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>([]);
  const [wrongPinId, setWrongPinId] = useState<string | null>(null);

  // Particle Explosion Feedback
  const [bursts, setBursts] = useState<BurstState[]>([]);

  useEffect(() => {
    setPlacedMap({});
    setSelectedTokenId(null);
    setDraggedTokenId(null);
    setChallengeIdx(0);
    setSolvedChallenges([]);
    setWrongPinId(null);
  }, [unit.id]);

  const spawnBurst = (x: number, y: number, color: string) => {
    const id = Date.now() + Math.random();
    setBursts((prev) => [...prev, { id, x, y, color }]);
    window.setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== id));
    }, 720);
  };

  const tryPlaceToken = (tokenId: string, zone: 'A' | 'B', clientX?: number, clientY?: number) => {
    const token = unit.dragGame.tokens.find((t) => t.id === tokenId);
    if (!token || placedMap[token.id]) return;

    if (token.zone === zone) {
      const next = { ...placedMap, [token.id]: zone };
      setPlacedMap(next);
      setSelectedTokenId(null);
      setDraggedTokenId(null);

      spawnBurst(clientX ?? 50, clientY ?? 50, '#00FFA3');

      const allDone = Object.keys(next).length === unit.dragGame.tokens.length;
      if (allDone) {
        onEarnXp(`drag_${unit.id}`, 50);
        onTeacherSpeak({
          mood: 'success',
          badgeAr: 'فوز رائع · +50 XP',
          badgeFr: 'Tri réussi : +50 XP',
          speechText: 'تبارك الله عليك يا بطل! فرزت جميع العناصر بدقة عالية وحصدت خمسين نقطة!',
          shouldSpeak: true,
        });
      } else {
        onTeacherSpeak({
          mood: 'success',
          badgeAr: `${token.labelAr} ✓`,
          badgeFr: token.labelFr,
          speechText: `أحسنت! ${token.labelAr} في مكانه الصحيح.`,
          shouldSpeak: true,
        });
      }
    } else {
      setShakeZone(zone);
      window.setTimeout(() => setShakeZone(null), 450);
      onTeacherSpeak({
        mood: 'hint',
        badgeAr: 'تحقق من المسار!',
        badgeFr: 'Vérifie la destination',
        speechText: `فكّر قليلاً يا بطل! أين يتجه ${token.labelAr} بالضبط؟ جرّب الوعاء الآخر.`,
        shouldSpeak: true,
      });
    }
  };

  const currentChallenge =
    unit.hotspotChallenges[challengeIdx] || unit.hotspotChallenges[0];

  const handleDiagramPinClick = (pinId: string) => {
    if (!currentChallenge) return;
    if (pinId === currentChallenge.targetPinId) {
      const nextSolved = solvedChallenges.includes(currentChallenge.id)
        ? solvedChallenges
        : [...solvedChallenges, currentChallenge.id];
      setSolvedChallenges(nextSolved);
      setWrongPinId(null);

      const pin = unit.schemaPins.find((p) => p.id === pinId);
      if (pin) spawnBurst(pin.x, pin.y, '#00FFA3');

      if (nextSolved.length === unit.hotspotChallenges.length) {
        onEarnXp(`hotspot_${unit.id}`, 50);
        onTeacherSpeak({
          mood: 'success',
          badgeAr: 'تحديد مثالي · +50 XP',
          badgeFr: 'Cible atteinte : +50 XP',
          speechText: `${currentChallenge.successSpeech} لقد ربحت خمسين نقطة!`,
          shouldSpeak: true,
        });
      } else {
        onTeacherSpeak({
          mood: 'success',
          badgeAr: pin?.ar || 'ممتاز!',
          badgeFr: pin?.fr || 'Bravo !',
          speechText: currentChallenge.successSpeech,
          shouldSpeak: true,
        });
        window.setTimeout(() => {
          setChallengeIdx((i) => (i + 1) % unit.hotspotChallenges.length);
        }, 900);
      }
    } else {
      setWrongPinId(pinId);
      window.setTimeout(() => setWrongPinId(null), 550);
      onTeacherSpeak({
        mood: 'hint',
        badgeAr: 'تلميح سريع',
        badgeFr: 'Indice visuel',
        speechText: currentChallenge.hintSpeech,
        shouldSpeak: true,
      });
    }
  };

  const remainingTokens = unit.dragGame.tokens.filter((t) => !placedMap[t.id]);
  const zoneATokens = unit.dragGame.tokens.filter((t) => placedMap[t.id] === 'A');
  const zoneBTokens = unit.dragGame.tokens.filter((t) => placedMap[t.id] === 'B');

  const dragDone = completedKeys.includes(`drag_${unit.id}`);
  const hotspotDone = completedKeys.includes(`hotspot_${unit.id}`);

  const renderTokenChip = (token: DragToken, placed: boolean) => {
    const isSelected = selectedTokenId === token.id;
    return (
      <div
        key={token.id}
        draggable={!placed}
        onDragStart={() => {
          setDraggedTokenId(token.id);
          setSelectedTokenId(token.id);
        }}
        onClick={() => {
          if (!placed) setSelectedTokenId(isSelected ? null : token.id);
        }}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-transform select-none ${
          placed
            ? 'bg-[#00FFA3]/12 border-[#00FFA3]/40 text-[#00FFA3]'
            : isSelected
              ? 'scale-105 bg-[#00E5FF]/15 border-[#00E5FF] text-white cursor-grab active:cursor-grabbing'
              : 'bg-[#070B14] border-white/15 text-slate-100 hover:border-white/35 cursor-grab active:cursor-grabbing'
        }`}
      >
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: token.accent }}
        />
        <span>{token.labelAr}</span>
        <span className="font-latin text-[11px] text-slate-400">{token.labelFr}</span>
        {placed && <CheckCircle2 className="w-3.5 h-3.5 text-[#00FFA3]" />}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* GAME 1: Visual Drag & Drop / Tap-to-Drop Vessel Sorter */}
      <section className="relative rounded-2xl bg-[#0D1424]/90 border border-white/10 p-4 sm:p-5 space-y-4 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Hand className="w-4 h-4 text-[#00FFA3]" />
            <div>
              <h2 className="text-base font-extrabold text-slate-50">
                01. {unit.dragGame.titleAr}
              </h2>
              <p className="text-xs font-latin text-[#00E5FF]">
                {unit.dragGame.titleFr} · اسحب أو اضغط للفرز
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono-num">
            {dragDone ? (
              <span className="inline-flex items-center gap-1 text-[#00FFA3] font-bold">
                <Award className="w-4 h-4" />
                +50 XP
              </span>
            ) : (
              <span className="text-[#FF9F1C] font-bold">+50 XP</span>
            )}
            <button
              type="button"
              onClick={() => {
                setPlacedMap({});
                setSelectedTokenId(null);
              }}
              className="text-slate-400 hover:text-white cursor-pointer"
              title="إعادة اللعبة"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Unplaced Draggable Token Pool */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 min-h-[56px] p-3 rounded-xl bg-[#070B14]/80 border border-dashed border-white/15">
          {remainingTokens.length > 0 ? (
            remainingTokens.map((t) => renderTokenChip(t, false))
          ) : (
            <span className="text-sm font-bold text-[#00FFA3] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              تم فرز جميع العناصر بنجاح!
            </span>
          )}
        </div>

        {/* Two Visual Drop Zones (Vessels / Pathways) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(['A', 'B'] as const).map((zoneKey) => {
            const cfg = zoneKey === 'A' ? unit.dragGame.zoneA : unit.dragGame.zoneB;
            const placedList = zoneKey === 'A' ? zoneATokens : zoneBTokens;
            const isTargetReady = Boolean(selectedTokenId || draggedTokenId);
            const isShaking = shakeZone === zoneKey;

            return (
              <div
                key={zoneKey}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = draggedTokenId || selectedTokenId;
                  if (id) tryPlaceToken(id, zoneKey, zoneKey === 'A' ? 28 : 72, 65);
                }}
                onClick={() => {
                  if (selectedTokenId) {
                    tryPlaceToken(selectedTokenId, zoneKey, zoneKey === 'A' ? 28 : 72, 65);
                  }
                }}
                className={`rounded-xl border-2 p-4 min-h-[150px] flex flex-col justify-between gap-3 transition-colors ${
                  isShaking
                    ? 'border-[#FF9F1C] bg-[#FF9F1C]/15'
                    : isTargetReady
                      ? 'border-dashed border-[#00FFA3]/70 bg-[#070B14]/90 cursor-pointer hover:bg-white/[0.04]'
                      : 'border-white/15 bg-[#070B14]/70'
                }`}
              >
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10">
                  <div>
                    <div className="text-sm font-extrabold" style={{ color: cfg.color }}>
                      {cfg.titleAr}
                    </div>
                    <div className="text-[11px] font-latin text-slate-400">
                      {cfg.titleFr}
                    </div>
                  </div>
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: cfg.color }}
                  />
                </div>

                <div className="flex flex-wrap gap-2 flex-1 items-start content-start">
                  {placedList.length > 0 ? (
                    placedList.map((t) => renderTokenChip(t, true))
                  ) : (
                    <span className="text-xs text-slate-500 my-auto mx-auto">
                      {isTargetReady ? 'أفلت أو اضغط هنا للفرز' : 'اسحب العناصر إلى هنا'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Celebratory Particle Explosions Layer */}
        {bursts.map((burst) => (
          <div
            key={burst.id}
            style={{ left: `${burst.x}%`, top: `${burst.y}%` }}
            className="pointer-events-none absolute z-30"
          >
            {BURST_ANGLES.map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const tx = `${Math.cos(rad) * 58}px`;
              const ty = `${Math.sin(rad) * 58}px`;
              return (
                <span
                  key={deg}
                  className="animate-burst-particle absolute w-2.5 h-2.5 rounded-full"
                  style={
                    {
                      backgroundColor: deg % 72 === 0 ? '#00FFA3' : deg % 108 === 0 ? '#FF9F1C' : '#00E5FF',
                      '--tx': tx,
                      '--ty': ty,
                    } as React.CSSProperties
                  }
                />
              );
            })}
          </div>
        ))}
      </section>

      {/* GAME 2: Click the Right Organ on the Live Visual Diagram */}
      <section className="rounded-2xl bg-[#0D1424]/90 border border-white/10 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-[#00E5FF]" />
            <div>
              <h2 className="text-base font-extrabold text-slate-50">
                02. تحدي التحديد المباشر على الرسم
              </h2>
              <p className="text-xs font-latin text-[#00E5FF]">
                Trouve l’organe sur le schéma
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono-num">
            {hotspotDone ? (
              <span className="inline-flex items-center gap-1 text-[#00FFA3] font-bold">
                <Award className="w-4 h-4" />
                +50 XP
              </span>
            ) : (
              <span className="text-[#FF9F1C] font-bold">
                {solvedChallenges.length}/{unit.hotspotChallenges.length} · +50 XP
              </span>
            )}
          </div>
        </div>

        {/* Active Target Callout Bar */}
        {currentChallenge && (
          <div className="rounded-xl bg-[#070B14] border border-[#00E5FF]/35 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-extrabold text-slate-50">
                {currentChallenge.promptAr}
              </div>
              <div className="text-xs font-latin text-[#00E5FF]">
                {currentChallenge.promptFr}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {unit.hotspotChallenges.map((c, idx) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setChallengeIdx(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono-num font-bold border transition-colors cursor-pointer ${
                    solvedChallenges.includes(c.id)
                      ? 'bg-[#00FFA3] text-[#070B14] border-[#00FFA3]'
                      : idx === challengeIdx
                        ? 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]'
                        : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Clickable Diagram Target Canvas */}
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/10 bg-[#070B14]">
          <UnitSchemaSvg unitId={unit.id} />

          {unit.schemaPins.map((pin) => {
            const isSolvedTarget =
              currentChallenge &&
              pin.id === currentChallenge.targetPinId &&
              solvedChallenges.includes(currentChallenge.id);
            const isWrong = wrongPinId === pin.id;

            return (
              <button
                key={pin.id}
                type="button"
                onClick={() => handleDiagramPinClick(pin.id)}
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full border-2 font-mono-num text-xs font-extrabold flex items-center justify-center transition-transform cursor-pointer shadow-xl ${
                  isSolvedTarget
                    ? 'scale-115 bg-[#00FFA3] border-white text-[#070B14]'
                    : isWrong
                      ? 'scale-95 bg-[#FF9F1C] border-white text-[#070B14]'
                      : 'bg-[#070B14]/90 border-[#00E5FF] text-white hover:scale-115 hover:bg-[#00E5FF] hover:text-[#070B14]'
                }`}
              >
                {isSolvedTarget ? '✓' : pin.num}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
