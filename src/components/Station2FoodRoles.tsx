import React, { useState } from 'react';
import { Award, CheckCircle2, RotateCcw, Shield, Zap, Hammer } from 'lucide-react';
import {
  FOOD_ROLE_CARDS,
  type FoodBucketId,
  type FoodRoleCard,
} from '../data/nutritionLessonData';
import type { MascotSignal } from '../data/unitsData';

interface Station2FoodRolesProps {
  onTeacherSpeak: (signal: MascotSignal) => void;
  onEarnXp: (key: string, amount: number) => void;
  completedKeys: string[];
}

const BUCKETS: {
  id: FoodBucketId;
  titleAr: string;
  titleFr: string;
  formulaAr: string;
  color: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'builders',
    titleAr: 'أغذية بنائية',
    titleFr: 'Aliments bâtisseurs',
    formulaAr: 'بروتيدات + كالسيوم',
    color: '#EF4444',
    Icon: Hammer,
  },
  {
    id: 'energetic',
    titleAr: 'أغذية طاقية',
    titleFr: 'Aliments énergétiques',
    formulaAr: 'سكريات + دهنيات',
    color: '#FF9F1C',
    Icon: Zap,
  },
  {
    id: 'protective',
    titleAr: 'أغذية وظيفية وواقية',
    titleFr: 'Aliments protecteurs',
    formulaAr: 'فيتامينات + أملاح + ماء',
    color: '#00FFA3',
    Icon: Shield,
  },
];

function FoodSvgIcon({ type }: { type: FoodRoleCard['iconType'] }) {
  return (
    <svg viewBox="0 0 44 44" className="w-9 h-9 shrink-0">
      <rect width="44" height="44" rx="10" fill="rgba(255,255,255,0.05)" />
      {type === 'meat' && (
        <g>
          <ellipse cx="22" cy="23" rx="13" ry="9" fill="#EF4444" />
          <circle cx="17" cy="23" r="3" fill="#FEF2F2" />
          <path d="M12 18 Q22 14 31 19" stroke="#FCA5A5" strokeWidth="2" fill="none" />
        </g>
      )}
      {type === 'eggs' && (
        <g>
          <ellipse cx="18" cy="24" rx="7" ry="9" fill="#F8FAFC" />
          <ellipse cx="28" cy="25" rx="6.5" ry="8.5" fill="#FDE68A" />
          <circle cx="18" cy="25" r="3" fill="#F59E0B" />
        </g>
      )}
      {type === 'milk' && (
        <g>
          <path d="M15 16 L29 16 L30 34 L14 34 Z" fill="#E0F2FE" />
          <polygon points="15,16 22,9 29,16" fill="#38BDF8" />
          <rect x="17" y="22" width="10" height="6" rx="2" fill="#0284C7" />
        </g>
      )}
      {type === 'bread' && (
        <g>
          <ellipse cx="22" cy="24" rx="14" ry="9" fill="#D97706" />
          <ellipse cx="22" cy="22" rx="12" ry="7" fill="#FBBF24" />
          <line x1="16" y1="18" x2="19" y2="25" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
          <line x1="23" y1="18" x2="26" y2="25" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
      {type === 'oil' && (
        <g>
          <path d="M22 10 C29 20, 31 28, 22 34 C13 28, 15 20, 22 10 Z" fill="#FF9F1C" />
          <circle cx="19" cy="24" r="2.2" fill="#FEF3C7" />
        </g>
      )}
      {type === 'honey' && (
        <g>
          <rect x="13" y="16" width="18" height="17" rx="5" fill="#F59E0B" />
          <rect x="15" y="11" width="14" height="5" rx="2" fill="#92400E" />
          <circle cx="22" cy="24" r="4" fill="#FEF08A" />
        </g>
      )}
      {type === 'veggies' && (
        <g>
          <circle cx="22" cy="18" r="7" fill="#10B981" />
          <circle cx="16" cy="21" r="5" fill="#059669" />
          <circle cx="28" cy="21" r="5" fill="#34D399" />
          <rect x="20" y="23" width="4" height="11" rx="2" fill="#047857" />
        </g>
      )}
      {type === 'fruits' && (
        <g>
          <circle cx="22" cy="24" r="10" fill="#FB923C" />
          <path d="M22 14 Q28 8 31 13 Q26 17 22 14 Z" fill="#00FFA3" />
        </g>
      )}
      {type === 'water' && (
        <g>
          <path d="M22 9 C30 20, 31 28, 22 35 C13 28, 14 20, 22 9 Z" fill="#00E5FF" />
          <path d="M18 24 Q19 29 23 30" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

export const Station2FoodRoles: React.FC<Station2FoodRolesProps> = ({
  onTeacherSpeak,
  onEarnXp,
  completedKeys,
}) => {
  const [placed, setPlaced] = useState<Record<string, FoodBucketId>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [wrongBucket, setWrongBucket] = useState<FoodBucketId | null>(null);

  const tryPlace = (cardId: string, bucketId: FoodBucketId) => {
    const card = FOOD_ROLE_CARDS.find((c) => c.id === cardId);
    if (!card || placed[card.id]) return;

    if (card.bucket === bucketId) {
      const next = { ...placed, [card.id]: bucketId };
      setPlaced(next);
      setSelectedId(null);
      setDraggedId(null);

      if (Object.keys(next).length === FOOD_ROLE_CARDS.length) {
        onEarnXp('st2_roles', 50);
        onTeacherSpeak({
          mood: 'success',
          badgeAr: 'تصنيف مثالي · +50 XP',
          badgeFr: '3 Groupes maîtrisés !',
          speechText: 'تبارك الله عليك! صنّفت جميع المجموعات الغذائية حسب أدوارها البنائية والطاقية والواقية!',
          shouldSpeak: true,
        });
      } else {
        onTeacherSpeak({
          mood: 'success',
          badgeAr: `${card.ar} · ${card.nutrientsAr}`,
          badgeFr: card.fr,
          speechText: card.speech,
          shouldSpeak: true,
        });
      }
    } else {
      setWrongBucket(bucketId);
      window.setTimeout(() => setWrongBucket(null), 500);
      onTeacherSpeak({
        mood: 'hint',
        badgeAr: 'تحقق من الدور الرئيسي!',
        badgeFr: `${card.ar} : ${card.nutrientsAr}`,
        speechText: `لاحظ مكونات ${card.ar} (${card.nutrientsAr})! هل دورها البناء أم الطاقة أم الوقاية؟`,
        shouldSpeak: true,
      });
    }
  };

  const remaining = FOOD_ROLE_CARDS.filter((c) => !placed[c.id]);
  const isComplete = completedKeys.includes('st2_roles');

  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-[#0D1424]/90 border border-white/10 p-4 sm:p-5 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-50">
              صنّف المجموعات الغذائية في السلال الثلاث
            </h2>
            <p className="text-xs font-latin text-[#00E5FF]">
              Classification fonctionnelle des aliments · اسحب أو اضغط للفرز
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono-num">
            {isComplete ? (
              <span className="inline-flex items-center gap-1 text-[#00FFA3] font-bold">
                <Award className="w-4 h-4" />
                +50 XP
              </span>
            ) : (
              <span className="text-[#FF9F1C] font-bold">
                {Object.keys(placed).length}/{FOOD_ROLE_CARDS.length} · +50 XP
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setPlaced({});
                setSelectedId(null);
              }}
              className="text-slate-400 hover:text-white cursor-pointer"
              title="إعادة اللعب"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Illustrated Food Cards Deck */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 min-h-[78px] p-3 rounded-xl bg-[#070B14]/80 border border-dashed border-white/15">
          {remaining.length > 0 ? (
            remaining.map((card) => {
              const isSel = selectedId === card.id;
              return (
                <div
                  key={card.id}
                  draggable
                  onDragStart={() => {
                    setDraggedId(card.id);
                    setSelectedId(card.id);
                  }}
                  onClick={() => setSelectedId(isSel ? null : card.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-transform select-none cursor-grab active:cursor-grabbing ${
                    isSel
                      ? 'scale-105 bg-[#00E5FF]/15 border-[#00E5FF] text-white'
                      : 'bg-[#0D1424] border-white/15 text-slate-100 hover:border-white/35'
                  }`}
                >
                  <FoodSvgIcon type={card.iconType} />
                  <div className="text-right">
                    <div className="text-xs font-extrabold">{card.ar}</div>
                    <div className="text-[10px] font-latin text-slate-400">{card.fr}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-sm font-extrabold text-[#00FFA3] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              أحسنت! تم تصنيف جميع المجموعات الغذائية بنجاح!
            </div>
          )}
        </div>

        {/* 3 Functional Role Buckets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BUCKETS.map(({ id, titleAr, titleFr, formulaAr, color, Icon }) => {
            const bucketItems = FOOD_ROLE_CARDS.filter((c) => placed[c.id] === id);
            const isReady = Boolean(selectedId || draggedId);
            const isWrong = wrongBucket === id;

            return (
              <div
                key={id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const cid = draggedId || selectedId;
                  if (cid) tryPlace(cid, id);
                }}
                onClick={() => {
                  if (selectedId) tryPlace(selectedId, id);
                }}
                className={`rounded-2xl border-2 p-4 min-h-[210px] flex flex-col justify-between gap-3 transition-colors ${
                  isWrong
                    ? 'border-[#FF9F1C] bg-[#FF9F1C]/15'
                    : isReady
                      ? 'border-dashed border-[#00FFA3]/70 bg-[#070B14]/90 cursor-pointer hover:bg-white/[0.04]'
                      : 'border-white/15 bg-[#070B14]/70'
                }`}
              >
                <div className="pb-2.5 border-b border-white/10 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-extrabold" style={{ color }}>
                      {titleAr}
                    </span>
                    <Icon className="w-4 h-4 shrink-0" />
                  </div>
                  <div className="text-[11px] font-latin text-slate-400">{titleFr}</div>
                  <div className="text-[11px] font-bold text-slate-200">{formulaAr}</div>
                </div>

                <div className="space-y-2 flex-1">
                  {bucketItems.length > 0 ? (
                    bucketItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-[#00FFA3]/10 border border-[#00FFA3]/35 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FoodSvgIcon type={item.iconType} />
                          <div className="truncate">
                            <div className="font-bold text-slate-100 truncate">{item.ar}</div>
                            <div className="text-[10px] text-[#00FFA3]">{item.nutrientsAr}</div>
                          </div>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-[#00FFA3] shrink-0" />
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-slate-500">
                      {isReady ? 'اضغط هنا لوضع الغذاء' : 'اسحب الأغذية المناسبة هنا'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
