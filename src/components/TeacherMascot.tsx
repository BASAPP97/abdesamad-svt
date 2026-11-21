import React from 'react';
import { Volume2, VolumeX, RotateCw, CheckCircle2, HelpCircle, Sparkles } from 'lucide-react';
import type { MascotSignal } from '../data/unitsData';

interface TeacherMascotProps {
  signal: MascotSignal;
  isSpeaking: boolean;
  isMuted: boolean;
  onReplayVoice: () => void;
  onToggleMute: () => void;
}

export const TeacherMascot: React.FC<TeacherMascotProps> = ({
  signal,
  isSpeaking,
  isMuted,
  onReplayVoice,
  onToggleMute,
}) => {
  const { mood, badgeAr, badgeFr, speechText } = signal;
  const isSuccess = mood === 'success';
  const isHint = mood === 'hint';

  const pointerClass = isSuccess
    ? 'animate-pointer-success'
    : isHint
      ? 'animate-pointer-hint'
      : 'animate-pointer-explain';

  const laserColor = isSuccess ? '#00FFA3' : isHint ? '#FF9F1C' : '#00E5FF';
  const borderAccent = isSuccess
    ? 'border-[#00FFA3]/40'
    : isHint
      ? 'border-[#FF9F1C]/45'
      : isSpeaking
        ? 'border-[#00E5FF]/45'
        : 'border-white/10';

  return (
    <aside
      aria-label="الأستاذ عبد الصمد - الشرح الصوتي التفاعلي"
      className={`rounded-2xl bg-[#0D1424]/95 border ${borderAccent} transition-colors duration-200 p-4 flex flex-col gap-3`}
    >
      {/* Top Minimal Header */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/10">
        <div className="min-w-0">
          <h2 className="text-sm font-extrabold text-slate-50 truncate">
            أستاذ عبد الصمد
          </h2>
          <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="font-latin text-slate-300">Prof. Abdesamad</span>
            <span aria-hidden="true">·</span>
            <span
              className={
                isSuccess
                  ? 'text-[#00FFA3] font-bold'
                  : isHint
                    ? 'text-[#FF9F1C] font-bold'
                    : isSpeaking
                      ? 'text-[#00E5FF] font-bold'
                      : 'text-slate-400'
              }
            >
              {isSpeaking ? 'يتحدث الآن' : isSuccess ? 'ممتاز' : isHint ? 'تلميح' : 'جاهز'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onReplayVoice}
            title="إعادة الشرح الصوتي"
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-[#00E5FF] transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onToggleMute}
            title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
              isMuted
                ? 'bg-[#FF9F1C]/15 border-[#FF9F1C]/40 text-[#FF9F1C]'
                : 'bg-[#00FFA3]/15 border-[#00FFA3]/40 text-[#00FFA3]'
            }`}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Animated SVG Talking Cartoon Teacher */}
      <div className="relative flex items-center justify-center py-1 select-none">
        {/* Radial cyber-bio aura */}
        <div
          aria-hidden="true"
          className="absolute inset-x-4 top-2 bottom-2 rounded-full blur-2xl opacity-25 pointer-events-none transition-colors duration-300"
          style={{
            background: isSuccess
              ? 'radial-gradient(circle, #00FFA3 0%, transparent 70%)'
              : isHint
                ? 'radial-gradient(circle, #FF9F1C 0%, transparent 70%)'
                : 'radial-gradient(circle, #00E5FF 0%, transparent 70%)',
          }}
        />

        {/* Mirrored container so pointer stick aims directly rightward toward the visual stage in RTL */}
        <div className="-scale-x-100">
          <svg
            viewBox="0 0 220 225"
            className="relative z-10 w-44 h-44 animate-mascot-float"
            role="img"
            aria-label="الأستاذ عبد الصمد يشير بعصا الشرح"
          >
            <defs>
              <linearGradient id="labCoatGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F8FAFC" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>
              <linearGradient id="shirtGrad2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0F2942" />
                <stop offset="100%" stopColor="#081628" />
              </linearGradient>
              <linearGradient id="skinGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F3C59F" />
                <stop offset="100%" stopColor="#E1A87C" />
              </linearGradient>
              <linearGradient id="woodStick2" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8C522B" />
                <stop offset="65%" stopColor="#C98A52" />
                <stop offset="100%" stopColor="#E6B27A" />
              </linearGradient>
              <filter id="laserGlow2" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Animated Acoustic Soundwaves when Speaking */}
            {isSpeaking && !isMuted && (
              <g stroke={laserColor} strokeWidth="2.4" fill="none" strokeLinecap="round">
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

            {/* Ground Shadow */}
            <ellipse cx="118" cy="212" rx="52" ry="7" fill="#000000" opacity="0.35" />

            {/* Lab Coat & Shirt */}
            <g>
              <path
                d="M74 146 C74 128, 162 128, 162 146 L168 206 C168 211, 164 214, 158 214 L78 214 C72 214, 68 211, 68 206 Z"
                fill="url(#labCoatGrad2)"
              />
              <path
                d="M101 134 L135 134 L128 214 L108 214 Z"
                fill="url(#shirtGrad2)"
              />
              <path d="M114 144 L122 144 L124 182 L118 190 L112 182 Z" fill="#00FFA3" />
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
              <rect x="142" y="160" width="3.5" height="11" rx="1.5" fill="#00E5FF" />
              <rect x="148" y="162" width="3.5" height="9" rx="1.5" fill="#00FFA3" />
            </g>

            {/* Neck */}
            <rect x="108" y="116" width="20" height="22" rx="8" fill="#D99B70" />

            {/* Head */}
            <g
              style={{
                transformOrigin: '118px 92px',
                transform: isHint ? 'rotate(8deg)' : isSuccess ? 'translateY(-2px)' : 'none',
                transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <circle cx="80" cy="88" r="8" fill="#E1A87C" />
              <circle cx="156" cy="88" r="8" fill="#E1A87C" />
              <rect x="82" y="42" width="72" height="82" rx="34" fill="url(#skinGrad2)" />

              {/* Hair */}
              <path
                d="M78 74 C76 42, 95 28, 120 28 C145 28, 160 44, 158 74 C153 56, 144 48, 124 50 C108 52, 94 46, 84 62 Z"
                fill="#1E293B"
              />
              <path
                d="M92 38 C108 30, 134 31, 148 42"
                stroke="#334155"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />

              {/* Beard */}
              <path
                d="M88 100 C92 120, 105 126, 118 126 C131 126, 144 120, 148 100 C143 111, 134 117, 118 117 C102 117, 93 111, 88 100 Z"
                fill="#1E293B"
                opacity="0.88"
              />

              {/* Eyebrows */}
              <path
                d={isHint ? 'M94 68 Q103 63 111 67' : 'M94 67 Q103 63 111 66'}
                stroke="#1E293B"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d={isHint ? 'M125 65 Q134 58 143 65' : 'M125 66 Q134 63 143 67'}
                stroke="#1E293B"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />

              {/* Eyes */}
              {isSuccess ? (
                <>
                  <path
                    d="M97 82 Q103 76 109 82"
                    stroke="#0F172A"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M127 82 Q133 76 139 82"
                    stroke="#0F172A"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              ) : (
                <>
                  <circle cx="103" cy="82" r="3.6" fill="#0F172A" />
                  <circle cx="104.3" cy="80.7" r="1.1" fill="#FFFFFF" />
                  <circle cx="133" cy="82" r="3.6" fill="#0F172A" />
                  <circle cx="134.3" cy="80.7" r="1.1" fill="#FFFFFF" />
                </>
              )}

              {/* Glasses */}
              <rect
                x="89"
                y="72"
                width="26"
                height="19"
                rx="5"
                fill="rgba(0, 229, 255, 0.14)"
                stroke="#0F172A"
                strokeWidth="2.6"
              />
              <rect
                x="121"
                y="72"
                width="26"
                height="19"
                rx="5"
                fill="rgba(0, 229, 255, 0.14)"
                stroke="#0F172A"
                strokeWidth="2.6"
              />
              <path d="M115 80 L121 80" stroke="#0F172A" strokeWidth="2.4" />
              <path d="M93 76 L99 86" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
              <path d="M125 76 L131 86" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />

              {/* Nose */}
              <path
                d="M118 83 L116 94 L121 95"
                stroke="#C98A60"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* Mouth — Real-time Lip-Sync when speaking! */}
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
              ) : isSuccess ? (
                <path
                  d="M107 103 Q118 115 129 103 Z"
                  fill="#FFFFFF"
                  stroke="#0F172A"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              ) : isHint ? (
                <path
                  d="M111 106 Q118 103 125 106"
                  stroke="#0F172A"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : (
                <path
                  d="M109 103 Q118 111 127 103"
                  stroke="#0F172A"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  fill="none"
                />
              )}
            </g>

            {/* Arm + Glowing Interactive Laser Pointer Stick */}
            <g className={pointerClass}>
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
                stroke="url(#woodStick2)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <line
                x1="19"
                y1="104"
                x2="13"
                y2="95"
                stroke="#94A3B8"
                strokeWidth="5.4"
                strokeLinecap="round"
              />
              <circle
                cx="11"
                cy="92"
                r="5.5"
                fill={laserColor}
                filter="url(#laserGlow2)"
              />
              <circle cx="11" cy="92" r="2.2" fill="#FFFFFF" />

              {isSuccess && (
                <g filter="url(#laserGlow2)">
                  <path
                    className="animate-sparkle-1"
                    d="M18 68 L20 75 L27 77 L20 79 L18 86 L16 79 L9 77 L16 75 Z"
                    fill="#00FFA3"
                  />
                  <path
                    className="animate-sparkle-2"
                    d="M38 56 L39.5 61 L44.5 62.5 L39.5 64 L38 69 L36.5 64 L31.5 62.5 L36.5 61 Z"
                    fill="#FF9F1C"
                  />
                  <path
                    className="animate-sparkle-3"
                    d="M168 48 L170 54 L176 56 L170 58 L168 64 L166 58 L160 56 L166 54 Z"
                    fill="#00E5FF"
                  />
                </g>
              )}
            </g>

            {/* Resting Arm */}
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
      </div>

      {/* Compact Visual Hotspot Badge (Zero Wall of Text — Max 5 words + Biof Term) */}
      <div
        className={`rounded-xl p-3 border transition-colors ${
          isSuccess
            ? 'bg-[#00FFA3]/12 border-[#00FFA3]/40'
            : isHint
              ? 'bg-[#FF9F1C]/12 border-[#FF9F1C]/40'
              : 'bg-[#070B14]/90 border-white/10'
        }`}
      >
        <div className="flex items-center gap-2">
          {isSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-[#00FFA3] shrink-0" />
          ) : isHint ? (
            <HelpCircle className="w-4 h-4 text-[#FF9F1C] shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 text-[#00E5FF] shrink-0" />
          )}
          <span className="text-sm font-extrabold text-slate-50 truncate">
            {badgeAr}
          </span>
        </div>
        <p className="text-xs font-latin font-semibold text-[#00E5FF] mt-1 truncate">
          {badgeFr}
        </p>

        {/* Compact 1-Line Live Voice Caption (for muted accessibility) */}
        <p className="text-[11px] text-slate-400 leading-snug mt-2 pt-2 border-t border-white/10 line-clamp-2">
          {speechText}
        </p>
      </div>
    </aside>
  );
};
