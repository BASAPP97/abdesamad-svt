import React from 'react';
import type { UnitId } from '../data/unitsData';

interface UnitSchemaSvgProps {
  unitId: UnitId;
}

export const UnitSchemaSvg: React.FC<UnitSchemaSvgProps> = ({ unitId }) => {
  return (
    <svg
      viewBox="0 0 640 360"
      className="w-full h-full block select-none"
      role="img"
      aria-label={`رسم تخطيطي تشريحي للوحدة ${unitId}`}
    >
      <defs>
        <pattern id="bioGridSvg" width="32" height="32" patternUnits="userSpaceOnUse">
          <path
            d="M 32 0 L 0 0 0 32"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="640" height="360" fill="#070B14" />
      <rect width="640" height="360" fill="url(#bioGridSvg)" />

      {/* 1. INTESTINAL VILLUS SCHEMA */}
      {unitId === 'digestion' && (
        <g>
          {/* Lumen background glow */}
          <rect x="40" y="20" width="560" height="320" rx="18" fill="rgba(0,229,255,0.04)" />
          {/* Epithelial Outer Wall (Single-cell finger dome) */}
          <path
            d="M 215 325 L 215 145 C 215 48, 425 48, 425 145 L 425 325"
            fill="rgba(0,255,163,0.12)"
            stroke="#00FFA3"
            strokeWidth="10"
            strokeLinejoin="round"
          />
          <path
            d="M 232 325 L 232 150 C 232 72, 408 72, 408 150 L 408 325"
            fill="#0A1322"
            stroke="rgba(0,255,163,0.45)"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
          {/* Arterial Red Capillary (left ascending) */}
          <path
            d="M 248 325 L 248 160 C 248 96, 320 92, 320 112"
            fill="none"
            stroke="#EF4444"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Venous Blue/Cyan Capillary (right descending) */}
          <path
            d="M 320 112 C 392 92, 392 160, 392 325"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Capillary Mesh Rungs */}
          <path
            d="M 254 165 Q 320 148 386 165 M 254 215 Q 320 198 386 215 M 254 265 Q 320 248 386 265"
            fill="none"
            stroke="#F87171"
            strokeWidth="5"
            opacity="0.7"
          />
          {/* Central Lymphatic Vessel (Chylifère - Amber Gold) */}
          <path
            d="M 320 325 L 320 128"
            fill="none"
            stroke="#FF9F1C"
            strokeWidth="18"
            strokeLinecap="round"
          />
          {/* Nutrient Absorption Arrows crossing wall */}
          <path
            d="M 155 150 L 240 150 M 155 205 L 240 205 M 485 150 L 400 150"
            stroke="#00FFA3"
            strokeWidth="3"
            strokeDasharray="5 4"
          />
          <circle cx="150" cy="150" r="6" fill="#00FFA3" />
          <circle cx="150" cy="205" r="6" fill="#FF9F1C" />
          <circle cx="490" cy="150" r="6" fill="#00E5FF" />
        </g>
      )}

      {/* 2. PULMONARY ALVEOLUS GAS EXCHANGE SCHEMA */}
      {unitId === 'respiration' && (
        <g>
          {/* Bronchiole entry */}
          <rect
            x="286"
            y="14"
            width="68"
            height="68"
            rx="8"
            fill="rgba(0,229,255,0.16)"
            stroke="#00E5FF"
            strokeWidth="3"
          />
          {/* Alveolar Sac */}
          <circle
            cx="320"
            cy="145"
            r="96"
            fill="rgba(0,229,255,0.12)"
            stroke="#00FFA3"
            strokeWidth="4"
          />
          {/* Capillary Arch underneath */}
          <defs>
            <linearGradient id="capGradSvg" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="50%" stopColor="#9333EA" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          <path
            d="M 70 290 Q 320 220 570 290"
            fill="none"
            stroke="url(#capGradSvg)"
            strokeWidth="46"
            strokeLinecap="round"
          />
          {/* O2 Diffusion Arrow Down (Cyan) */}
          <path
            d="M 385 135 L 385 245"
            stroke="#00E5FF"
            strokeWidth="5"
            strokeDasharray="7 5"
          />
          <polygon points="385,256 376,240 394,240" fill="#00E5FF" />
          {/* CO2 Diffusion Arrow Up (Amber) */}
          <path
            d="M 260 250 L 260 140"
            stroke="#FF9F1C"
            strokeWidth="5"
            strokeDasharray="7 5"
          />
          <polygon points="260,129 251,145 269,145" fill="#FF9F1C" />
        </g>
      )}

      {/* 3. FOUR-CHAMBER HEART SCHEMA */}
      {unitId === 'circulation' && (
        <g>
          {/* Aorta Arch (Red) */}
          <path
            d="M 340 120 C 340 30, 445 30, 445 100"
            fill="none"
            stroke="#EF4444"
            strokeWidth="22"
            strokeLinecap="round"
          />
          {/* Pulmonary Artery (Blue) */}
          <path
            d="M 290 120 C 290 42, 195 42, 195 105"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="20"
            strokeLinecap="round"
          />
          {/* Heart Outline */}
          <path
            d="M 320 92 C 445 78, 475 215, 320 330 C 165 215, 195 78, 320 92 Z"
            fill="#11192B"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="4"
          />
          {/* Right Atrium & Ventricle (Blue, viewer's left) */}
          <rect x="218" y="108" width="90" height="72" rx="22" fill="rgba(59,130,246,0.58)" />
          <rect x="226" y="192" width="82" height="106" rx="26" fill="rgba(37,99,235,0.78)" />
          {/* Left Atrium & Thick-Walled Ventricle (Red, viewer's right) */}
          <rect x="332" y="108" width="90" height="72" rx="22" fill="rgba(239,68,68,0.62)" />
          <rect
            x="332"
            y="192"
            width="82"
            height="106"
            rx="26"
            fill="rgba(220,38,38,0.85)"
            stroke="#FCA5A5"
            strokeWidth="6"
          />
          {/* Septum & Green Valves */}
          <rect x="313" y="104" width="14" height="205" rx="6" fill="#1E293B" />
          <path
            d="M 235 186 L 265 196 L 295 186 M 345 186 L 375 196 L 405 186"
            fill="none"
            stroke="#00FFA3"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* 4. NEPHRON FILTRATION SCHEMA */}
      {unitId === 'excretion' && (
        <g>
          {/* Glomerulus Blood Knot */}
          <circle
            cx="155"
            cy="125"
            r="38"
            fill="rgba(239,68,68,0.28)"
            stroke="#EF4444"
            strokeWidth="9"
          />
          {/* Bowman's Capsule */}
          <path
            d="M 162 66 A 60 60 0 1 1 162 184"
            fill="none"
            stroke="#00E5FF"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Nephron Tubule Loop */}
          <path
            d="M 222 125 L 285 95 L 335 250 L 420 115 L 520 115 L 520 315"
            fill="none"
            stroke="rgba(0,229,255,0.28)"
            strokeWidth="26"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d="M 222 125 L 285 95 L 335 250 L 420 115 L 520 115 L 520 315"
            fill="none"
            stroke="#00E5FF"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Peritubular Blood Capillary for Reabsorption */}
          <path
            d="M 155 185 Q 335 325 460 285"
            fill="none"
            stroke="#EF4444"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.7"
          />
          {/* Glucose Reabsorption Arrow (Emerald) */}
          <path
            d="M 335 225 L 335 282"
            stroke="#00FFA3"
            strokeWidth="5"
            strokeDasharray="6 4"
          />
          <polygon points="335,294 326,278 344,278" fill="#00FFA3" />
          {/* Urine Droplets in Collecting Duct */}
          <circle cx="520" cy="210" r="8" fill="#FF9F1C" />
          <circle cx="520" cy="255" r="8" fill="#FF9F1C" />
          <circle cx="520" cy="298" r="8" fill="#FF9F1C" />
        </g>
      )}

      {/* 5. SPINAL CORD REFLEX ARC SCHEMA */}
      {unitId === 'nervous' && (
        <g>
          {/* Spinal Cord Cross-Section (Right) */}
          <ellipse
            cx="430"
            cy="180"
            rx="125"
            ry="96"
            fill="#162033"
            stroke="#A855F7"
            strokeWidth="4"
          />
          {/* Gray Matter Butterfly */}
          <path
            d="M 378 130 Q 418 164 430 164 Q 442 164 482 130 Q 460 180 484 230 Q 442 196 430 196 Q 418 196 376 230 Q 400 180 378 130 Z"
            fill="rgba(168,85,247,0.48)"
            stroke="#C084FC"
            strokeWidth="2"
          />
          {/* Skin Receptor (Top Left) */}
          <rect
            x="68"
            y="95"
            width="84"
            height="52"
            rx="12"
            fill="rgba(0,229,255,0.2)"
            stroke="#00E5FF"
            strokeWidth="3"
          />
          {/* Dorsal Sensory Fiber (Cyan) */}
          <path
            d="M 152 118 Q 255 64 388 148"
            fill="none"
            stroke="#00E5FF"
            strokeWidth="6"
          />
          {/* Dorsal Root Ganglion */}
          <circle cx="255" cy="95" r="14" fill="#00E5FF" />
          {/* Ventral Motor Fiber (Emerald) */}
          <path
            d="M 388 214 Q 255 292 152 268"
            fill="none"
            stroke="#00FFA3"
            strokeWidth="6"
          />
          {/* Effector Muscle (Bottom Left) */}
          <ellipse
            cx="112"
            cy="272"
            rx="52"
            ry="24"
            fill="rgba(255,159,28,0.28)"
            stroke="#FF9F1C"
            strokeWidth="3"
          />
        </g>
      )}

      {/* 6. ANTAGONISTIC ARM MUSCLES & PLAQUE MOTRICE SCHEMA */}
      {unitId === 'muscular' && (
        <g>
          {/* Humerus & Forearm Bones */}
          <line x1="200" y1="45" x2="225" y2="250" stroke="#E2E8F0" strokeWidth="18" strokeLinecap="round" />
          <line x1="225" y1="250" x2="405" y2="220" stroke="#E2E8F0" strokeWidth="16" strokeLinecap="round" />
          {/* Elbow Joint */}
          <circle cx="225" cy="250" r="16" fill="#FF9F1C" />
          {/* Biceps (Contracted Emerald) */}
          <path
            d="M 208 62 Q 290 145 268 238 Q 222 155 208 62 Z"
            fill="rgba(0,255,163,0.45)"
            stroke="#00FFA3"
            strokeWidth="4"
          />
          {/* Triceps (Relaxed Cyan) */}
          <path
            d="M 190 66 Q 134 155 206 254 Q 186 155 190 66 Z"
            fill="rgba(0,229,255,0.22)"
            stroke="#00E5FF"
            strokeWidth="3.5"
          />
          {/* Magnified Plaque Motrice Bubble */}
          <circle
            cx="500"
            cy="130"
            r="68"
            fill="rgba(168,85,247,0.14)"
            stroke="#A855F7"
            strokeWidth="3"
          />
          <line x1="500" y1="74" x2="500" y2="122" stroke="#00E5FF" strokeWidth="5" />
          <circle cx="500" cy="132" r="10" fill="#00FFA3" />
          <line x1="455" y1="158" x2="545" y2="158" stroke="#FF9F1C" strokeWidth="12" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};
