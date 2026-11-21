import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Zap, RotateCcw } from 'lucide-react';
import type { MascotSignal, UnitId } from '../data/unitsData';

interface InteractiveBioLabProps {
  unitId: Exclude<UnitId, 'digestion'>;
  onTeacherSpeak: (signal: MascotSignal) => void;
}

interface HotspotDef {
  id: string;
  x: number; // 0..100%
  y: number; // 0..100%
  ar: string;
  fr: string;
  color: string;
  speech: string;
}

const LAB_HOTSPOTS: Record<Exclude<UnitId, 'digestion'>, HotspotDef[]> = {
  respiration: [
    {
      id: 'alveole',
      x: 50,
      y: 34,
      ar: 'السنخ الرئوي',
      fr: 'Alvéole pulmonaire',
      color: '#00E5FF',
      speech: 'السنخ الرئوي كيس هوائي رقيق جداً يدخل منه ثنائي الأوكسجين مباشرة نحو الدم.',
    },
    {
      id: 'o2',
      x: 61,
      y: 52,
      ar: 'انتشار O₂ نحو الدم',
      fr: 'Diffusion O₂ → Sang',
      color: '#00FFA3',
      speech: 'ينتشر ثنائي الأوكسجين من الضغط المرتفع في السنخ إلى الضغط المنخفض في الدم.',
    },
    {
      id: 'co2',
      x: 38,
      y: 52,
      ar: 'خروج CO₂ للزفير',
      fr: 'Rejet CO₂ → Alvéole',
      color: '#FF9F1C',
      speech: 'يتخلص الدم من ثنائي أوكسيد الكربون نحو السنخ ليُطرح أثناء الزفير.',
    },
    {
      id: 'cap',
      x: 75,
      y: 74,
      ar: 'دم غني بـ O₂',
      fr: 'Sang oxygéné (HbO₂)',
      color: '#EF4444',
      speech: 'يتحول الدم إلى اللون الأحمر القاني بعد ارتباط الأوكسجين بالخضاب الدموي.',
    },
  ],
  circulation: [
    {
      id: 'od',
      x: 37,
      y: 36,
      ar: 'الأذين الأيمن',
      fr: 'Oreillette droite',
      color: '#3B82F6',
      speech: 'الأذين الأيمن يستقبل الدم غير المؤكسج القادم من الأعضاء.',
    },
    {
      id: 'vd',
      x: 39,
      y: 62,
      ar: 'البطين الأيمن',
      fr: 'Ventricule droit',
      color: '#2563EB',
      speech: 'البطين الأيمن يضخ الدم نحو الرئتين ليتزود بالأوكسجين.',
    },
    {
      id: 'og',
      x: 63,
      y: 36,
      ar: 'الأذين الأيسر',
      fr: 'Oreillette gauche',
      color: '#EF4444',
      speech: 'الأذين الأيسر يستقبل الدم المؤكسج الأحمر القاني القادم من الرئتين.',
    },
    {
      id: 'vg',
      x: 61,
      y: 62,
      ar: 'البطين الأيسر',
      fr: 'Ventricule gauche',
      color: '#DC2626',
      speech: 'البطين الأيسر جداره سميك ليضخ الدم المؤكسج بقوة نحو جميع الأعضاء!',
    },
  ],
  excretion: [
    {
      id: 'glom',
      x: 26,
      y: 36,
      ar: 'الكبيبة (ترشيح)',
      fr: 'Glomérule (Filtration)',
      color: '#EF4444',
      speech: 'في الكبيبة يُرشّح الماء والكليكوز والبولة وتبقى البروتيدات الضخمة في الدم.',
    },
    {
      id: 'reabs',
      x: 52,
      y: 62,
      ar: 'إعادة امتصاص الكليكوز',
      fr: 'Réabsorption 100% Glucose',
      color: '#00FFA3',
      speech: 'يعاد امتصاص مئة بالمئة من الكليكوز نحو الشعيرات الدموية في الأنبوب البولي!',
    },
    {
      id: 'urine',
      x: 80,
      y: 74,
      ar: 'البول النهائي (بولة)',
      fr: 'Urine définitive (Urée)',
      color: '#FF9F1C',
      speech: 'القناة الجامعة تجمع البول النهائي الغني بالبولة والنشادر والماء الفائض.',
    },
  ],
  nervous: [
    {
      id: 'rec',
      x: 16,
      y: 32,
      ar: 'مستقبل حسي',
      fr: 'Récepteur sensoriel',
      color: '#00E5FF',
      speech: 'المستقبل الحسي يستقبل الإهاجة وتنشأ فيه السيالة العصبية الحسية.',
    },
    {
      id: 'dorsal',
      x: 38,
      y: 26,
      ar: 'موصل حسي (جذر خلفي)',
      fr: 'Fibre sensitive',
      color: '#38BDF8',
      speech: 'ينقل الجذر الخلفي ذو العقدة الشوكية السيالة الحسية نحو النخاع الشوكي.',
    },
    {
      id: 'spinal',
      x: 62,
      y: 48,
      ar: 'النخاع الشوكي',
      fr: 'Moelle épinière',
      color: '#A855F7',
      speech: 'النخاع الشوكي يحوّل السيالة الحسية فوراً إلى سيالة حركية لاإرادية!',
    },
    {
      id: 'motor',
      x: 38,
      y: 72,
      ar: 'موصل حركي (جذر أمامي)',
      fr: 'Fibre motrice',
      color: '#00FFA3',
      speech: 'الجذر الأمامي ينقل السيالة الحركية النابذة نحو العضلة المستجيبة.',
    },
    {
      id: 'eff',
      x: 18,
      y: 74,
      ar: 'عضلة مستجيبة',
      fr: 'Muscle effecteur',
      color: '#FF9F1C',
      speech: 'تتقلص العضلة فوراً لتنفذ حركة سحب لاإرادية تحمي الجسم!',
    },
  ],
  muscular: [
    {
      id: 'biceps',
      x: 42,
      y: 38,
      ar: 'ثنائية الرأس (Biceps)',
      fr: 'Muscle Biceps',
      color: '#00FFA3',
      speech: 'عند ثني الساعد تتقلص العضلة ثنائية الرأس فيقصر طولها ويزداد سمكها!',
    },
    {
      id: 'triceps',
      x: 24,
      y: 48,
      ar: 'ثلاثية الرأس (Triceps)',
      fr: 'Muscle Triceps',
      color: '#00E5FF',
      speech: 'العضلة ثلاثية الرأس تعمل بالتضاد: ترتخي عند الثني وتتقلص عند البسط.',
    },
    {
      id: 'joint',
      x: 40,
      y: 70,
      ar: 'مفصل المرفق والأوتار',
      fr: 'Articulation & Tendons',
      color: '#FF9F1C',
      speech: 'الأوتار تثبت العضلة على العظام، والمفصل يسهّل دوران الساعد بسلاسة.',
    },
    {
      id: 'plaque',
      x: 78,
      y: 34,
      ar: 'الصفيحة المحركة',
      fr: 'Plaque motrice',
      color: '#A855F7',
      speech: 'الصفيحة المحركة تنقل السيالة العصبية من الليف الحركي إلى الألياف العضلية.',
    },
  ],
};

export const InteractiveBioLab: React.FC<InteractiveBioLabProps> = ({
  unitId,
  onTeacherSpeak,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [sliderVal, setSliderVal] = useState<number>(50);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<string>('');
  const reflexPulseRef = useRef<number>(-1); // 0..1 active reflex wave
  const sliderRef = useRef<number>(sliderVal);
  const runningRef = useRef<boolean>(isRunning);

  useEffect(() => {
    sliderRef.current = sliderVal;
  }, [sliderVal]);

  useEffect(() => {
    runningRef.current = isRunning;
  }, [isRunning]);

  // Reset slider default when switching units
  useEffect(() => {
    setActiveHotspot('');
    setIsRunning(true);
    if (unitId === 'respiration') setSliderVal(40);
    else if (unitId === 'circulation') setSliderVal(75);
    else if (unitId === 'excretion') setSliderVal(65);
    else if (unitId === 'nervous') {
      setSliderVal(70);
      reflexPulseRef.current = 0.02;
    } else if (unitId === 'muscular') setSliderVal(45);
  }, [unitId]);

  const triggerReflex = () => {
    reflexPulseRef.current = 0.001;
    onTeacherSpeak({
      mood: 'explaining',
      badgeAr: 'انطلاق السيالة العصبية!',
      badgeFr: 'Influx nerveux réflexe',
      speechText:
        'إهاجة فعالة! تنطلق السيالة الحسية عبر الجذر الخلفي إلى النخاع الشوكي فتعود حركية للعضلة!',
      shouldSpeak: true,
    });
  };

  // 60fps HTML5 Canvas Bio-Simulation Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let time = 0;
    let lastTs = performance.now();

    const draw = (ts: number) => {
      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;
      if (runningRef.current) {
        time += dt;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const W = Math.max(320, Math.floor(rect.width));
      const H = Math.max(300, Math.floor(rect.height));
      if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
        canvas.width = W * dpr;
        canvas.height = H * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Deep Obsidian Bio-Grid Background
      ctx.fillStyle = '#070B14';
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = 'rgba(255,255,255,0.035)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < W; gx += 36) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, H);
        ctx.stroke();
      }
      for (let gy = 0; gy < H; gy += 36) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(W, gy);
        ctx.stroke();
      }

      const val = sliderRef.current;

      // =========================================================
      // UNIT 2: RESPIRATION — ALVEOLUS & GAS EXCHANGE
      // =========================================================
      if (unitId === 'respiration') {
        const rate = 0.8 + (val / 100) * 2.2;
        const breath = Math.sin(time * rate * 2.2);
        const cx = W * 0.5;
        const cy = H * 0.36;
        const baseR = Math.min(W, H) * 0.25 + breath * 10;

        // Bronchiole neck entering alveolus
        ctx.fillStyle = 'rgba(0, 229, 255, 0.14)';
        ctx.strokeStyle = '#00E5FF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(cx - 26, 12, 52, cy - baseR * 0.75, 10);
        ctx.fill();
        ctx.stroke();

        // Alveolar Air Sac (Glowing translucent cyan)
        const radGrad = ctx.createRadialGradient(cx, cy, 12, cx, cy, baseR);
        radGrad.addColorStop(0, 'rgba(0, 229, 255, 0.24)');
        radGrad.addColorStop(0.82, 'rgba(0, 255, 163, 0.08)');
        radGrad.addColorStop(1, 'rgba(0, 255, 163, 0.32)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#00FFA3';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Curved Blood Capillary embracing the Alveolus bottom
        const capY = H * 0.76;
        const capGrad = ctx.createLinearGradient(W * 0.1, capY, W * 0.9, capY);
        capGrad.addColorStop(0, '#1D4ED8'); // Deoxygenated CO2-rich
        capGrad.addColorStop(0.5, '#7C3AED');
        capGrad.addColorStop(1, '#EF4444'); // Oxygenated O2-rich

        ctx.strokeStyle = capGrad;
        ctx.lineWidth = 42;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(W * 0.08, capY);
        ctx.quadraticCurveTo(cx, cy + baseR + 18, W * 0.92, capY);
        ctx.stroke();

        // Inner capillary lumen sheen
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 34;
        ctx.stroke();

        // Flowing Red Blood Cells changing from Blue -> Bright Red as they pick up O2
        const rbcCount = 14;
        for (let i = 0; i < rbcCount; i++) {
          const t = ((time * 0.18 * rate + i / rbcCount) % 1);
          const x =
            (1 - t) * (1 - t) * (W * 0.08) +
            2 * (1 - t) * t * cx +
            t * t * (W * 0.92);
          const y =
            (1 - t) * (1 - t) * capY +
            2 * (1 - t) * t * (cy + baseR + 18) +
            t * t * capY;

          const r = Math.round(59 + t * (239 - 59));
          const g = Math.round(130 - t * 70);
          const b = Math.round(246 - t * 180);
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.beginPath();
          ctx.ellipse(x, y, 12, 7.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.45)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Diffusing O2 (Cyan) downward into blood
        for (let i = 0; i < 10; i++) {
          const p = (time * 0.55 * rate + i * 0.1) % 1;
          const px = cx + 28 + Math.sin(i * 2.1) * 32;
          const py = cy + p * (baseR + 58);
          ctx.fillStyle = '#00E5FF';
          ctx.beginPath();
          ctx.arc(px, py, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Diffusing CO2 (Amber) upward into alveolus
        for (let i = 0; i < 10; i++) {
          const p = (time * 0.55 * rate + i * 0.1) % 1;
          const px = cx - 34 + Math.cos(i * 1.9) * 28;
          const py = cy + baseR + 56 - p * (baseR + 56);
          ctx.fillStyle = '#FF9F1C';
          ctx.beginPath();
          ctx.arc(px, py, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // =========================================================
      // UNIT 3: CIRCULATION — 4-CHAMBER PUMPING HEART
      // =========================================================
      if (unitId === 'circulation') {
        const bpm = 60 + Math.round((val / 100) * 100);
        const freq = bpm / 60;
        const phase = (time * freq) % 1;
        const beatScale =
          phase < 0.2 ? 1 + Math.sin((phase / 0.2) * Math.PI) * 0.08 : 1;

        const cx = W * 0.5;
        const cy = H * 0.52;

        // Pulmonary & Systemic glowing outer circuit arcs
        ctx.lineWidth = 6;
        // Systemic Loop (Red right side)
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
        ctx.beginPath();
        ctx.ellipse(cx + 120, cy + 10, 95, 130, 0, -Math.PI * 0.5, Math.PI * 0.5);
        ctx.stroke();

        // Pulmonary Loop (Blue left side)
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.38)';
        ctx.beginPath();
        ctx.ellipse(cx - 120, cy - 10, 95, 115, 0, Math.PI * 0.5, Math.PI * 1.5);
        ctx.stroke();

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(beatScale, beatScale);

        // Heart Silhouette Outer Wall
        ctx.fillStyle = '#141B2D';
        ctx.strokeStyle = 'rgba(255,255,255,0.22)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -108);
        ctx.bezierCurveTo(105, -120, 128, -10, 0, 118);
        ctx.bezierCurveTo(-128, -10, -105, -120, 0, -108);
        ctx.fill();
        ctx.stroke();

        // Right Heart Chambers (Blue - Deoxygenated, viewer's left)
        ctx.fillStyle = 'rgba(37, 99, 235, 0.65)';
        ctx.beginPath();
        ctx.roundRect(-84, -84, 72, 68, 22);
        ctx.fill();
        ctx.fillStyle = 'rgba(29, 78, 216, 0.85)';
        ctx.beginPath();
        ctx.roundRect(-78, -6, 68, 94, 24);
        ctx.fill();

        // Left Heart Chambers (Red - Oxygenated, viewer's right, thicker wall!)
        ctx.fillStyle = 'rgba(239, 68, 68, 0.68)';
        ctx.beginPath();
        ctx.roundRect(12, -84, 72, 68, 22);
        ctx.fill();
        ctx.fillStyle = 'rgba(220, 38, 38, 0.9)';
        ctx.strokeStyle = '#FCA5A5';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.roundRect(10, -6, 68, 94, 24);
        ctx.fill();
        ctx.stroke();

        // Septum Divider
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(-7, -86, 14, 184);

        // Animated Heart Valves
        const valveOpen = phase > 0.35 ? 12 : 2;
        ctx.strokeStyle = '#00FFA3';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-64, -12);
        ctx.lineTo(-42, -12 + valveOpen);
        ctx.moveTo(-24, -12);
        ctx.lineTo(-42, -12 + valveOpen);
        ctx.moveTo(24, -12);
        ctx.lineTo(44, -12 + valveOpen);
        ctx.moveTo(64, -12);
        ctx.lineTo(44, -12 + valveOpen);
        ctx.stroke();

        ctx.restore();

        // Animated Blood Cells pumping around both loops
        for (let i = 0; i < 12; i++) {
          const ang = (time * freq * 1.4 + (i / 12) * Math.PI * 2) % (Math.PI * 2);
          // Red systemic blood cells
          const rx = cx + 120 + Math.cos(ang) * 95;
          const ry = cy + 10 + Math.sin(ang) * 130;
          if (rx > cx + 25) {
            ctx.fillStyle = '#EF4444';
            ctx.beginPath();
            ctx.arc(rx, ry, 5.5, 0, Math.PI * 2);
            ctx.fill();
          }
          // Blue pulmonary blood cells
          const bx = cx - 120 - Math.cos(ang) * 95;
          const by = cy - 10 + Math.sin(ang) * 115;
          if (bx < cx - 25) {
            ctx.fillStyle = '#38BDF8';
            ctx.beginPath();
            ctx.arc(bx, by, 5.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // =========================================================
      // UNIT 4: EXCRETION — NEPHRON FILTRATION & REABSORPTION
      // =========================================================
      if (unitId === 'excretion') {
        const flowSpeed = 0.5 + (val / 100) * 1.1;

        // Glomerulus capillary knot (Left)
        const gx = W * 0.25;
        const gy = H * 0.36;
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(gx, gy, 36, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(239, 68, 68, 0.28)';
        ctx.fill();

        // Bowman's Capsule C-cup
        ctx.strokeStyle = '#00E5FF';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(gx + 10, gy, 52, -Math.PI * 0.72, Math.PI * 0.72);
        ctx.stroke();

        // Nephron Tubule Path (S-Loop to Collecting Duct)
        const tubulePts: [number, number][] = [
          [gx + 60, gy],
          [W * 0.44, H * 0.26],
          [W * 0.52, H * 0.74],
          [W * 0.66, H * 0.32],
          [W * 0.8, H * 0.32],
          [W * 0.8, H * 0.85],
        ];
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)';
        ctx.lineWidth = 26;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        tubulePts.forEach(([x, y], idx) =>
          idx === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y),
        );
        ctx.stroke();

        ctx.strokeStyle = '#00E5FF';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Peritubular Blood Capillary running below for 100% Glucose Reabsorption
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.55)';
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.moveTo(gx, gy + 50);
        ctx.quadraticCurveTo(W * 0.52, H * 0.88, W * 0.72, H * 0.82);
        ctx.stroke();

        // Animated Particles:
        // 1. Urea (Amber) travelling all the way to Collecting Duct -> Urine
        for (let i = 0; i < 14; i++) {
          const seg = ((time * 0.35 * flowSpeed + i / 14) % 1) * (tubulePts.length - 1);
          const idx = Math.floor(seg);
          const frac = seg - idx;
          const p0 = tubulePts[idx];
          const p1 = tubulePts[Math.min(idx + 1, tubulePts.length - 1)];
          const px = p0[0] + (p1[0] - p0[0]) * frac;
          const py = p0[1] + (p1[1] - p0[1]) * frac;
          ctx.fillStyle = '#FF9F1C';
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        // 2. Glucose (Emerald) filtered into tubule, then 100% REABSORBED down into blood!
        for (let i = 0; i < 10; i++) {
          const p = (time * 0.45 * flowSpeed + i * 0.1) % 1;
          let px: number;
          let py: number;
          if (p < 0.5) {
            const f = p / 0.5;
            px = gx + 60 + f * (W * 0.52 - (gx + 60));
            py = gy + Math.sin(f * Math.PI) * 75;
          } else {
            const f = (p - 0.5) / 0.5;
            px = W * 0.52 + f * 35;
            py = H * 0.58 + f * (H * 0.25);
          }
          ctx.fillStyle = '#00FFA3';
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // =========================================================
      // UNIT 5: NERVOUS SYSTEM — REFLEX ARC & LIVE NERVE IMPULSE
      // =========================================================
      if (unitId === 'nervous') {
        const speed = 0.45 + (val / 100) * 0.85;
        if (reflexPulseRef.current >= 0 && runningRef.current) {
          reflexPulseRef.current += dt * speed;
          if (reflexPulseRef.current > 1.25) {
            reflexPulseRef.current = 0.001; // loop gently while running
          }
        }
        const p = reflexPulseRef.current;

        const spinalX = W * 0.65;
        const spinalY = H * 0.48;

        // Spinal Cord White Matter Oval
        ctx.fillStyle = '#1E293B';
        ctx.strokeStyle = '#A855F7';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(spinalX, spinalY, 96, 76, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Gray Matter Butterfly (H-shape)
        ctx.fillStyle = 'rgba(168, 85, 247, 0.45)';
        ctx.beginPath();
        ctx.moveTo(spinalX - 42, spinalY - 40);
        ctx.quadraticCurveTo(spinalX - 10, spinalY - 12, spinalX, spinalY - 10);
        ctx.quadraticCurveTo(spinalX + 10, spinalY - 12, spinalX + 42, spinalY - 40);
        ctx.quadraticCurveTo(spinalX + 26, spinalY, spinalX + 44, spinalY + 40);
        ctx.quadraticCurveTo(spinalX + 10, spinalY + 12, spinalX, spinalY + 10);
        ctx.quadraticCurveTo(spinalX - 10, spinalY + 12, spinalX - 44, spinalY + 40);
        ctx.quadraticCurveTo(spinalX - 26, spinalY, spinalX - 42, spinalY - 40);
        ctx.fill();

        // Sensory Fiber (Top Dorsal Path - Cyan)
        const skinX = W * 0.16;
        const skinY = H * 0.32;
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.5)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(skinX, skinY);
        ctx.quadraticCurveTo(W * 0.38, H * 0.16, spinalX - 32, spinalY - 28);
        ctx.stroke();

        // Dorsal Root Ganglion node
        ctx.fillStyle = '#00E5FF';
        ctx.beginPath();
        ctx.arc(W * 0.42, H * 0.24, 11, 0, Math.PI * 2);
        ctx.fill();

        // Motor Fiber (Bottom Ventral Path - Emerald)
        const muscleX = W * 0.18;
        const muscleY = H * 0.74;
        ctx.strokeStyle = 'rgba(0, 255, 163, 0.5)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(spinalX - 30, spinalY + 26);
        ctx.quadraticCurveTo(W * 0.38, H * 0.8, muscleX, muscleY);
        ctx.stroke();

        // Skin Receptor Box
        ctx.fillStyle = 'rgba(0, 229, 255, 0.22)';
        ctx.strokeStyle = '#00E5FF';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(skinX - 34, skinY - 22, 68, 44, 10);
        ctx.fill();
        ctx.stroke();

        // Effector Muscle (Contracts visibly when motor impulse arrives!)
        const isContracting = p > 0.85 && p < 1.15;
        const mScaleX = isContracting ? 0.8 : 1;
        const mScaleY = isContracting ? 1.32 : 1;
        ctx.fillStyle = isContracting
          ? 'rgba(0, 255, 163, 0.45)'
          : 'rgba(255, 159, 28, 0.28)';
        ctx.strokeStyle = isContracting ? '#00FFA3' : '#FF9F1C';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(muscleX, muscleY, 44 * mScaleX, 20 * mScaleY, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Live Glowing Nerve Impulse Comet!
        if (p >= 0 && p <= 1.0) {
          let ix = skinX;
          let iy = skinY;
          let color = '#00E5FF';

          if (p < 0.45) {
            const t = p / 0.45;
            ix =
              (1 - t) * (1 - t) * skinX +
              2 * (1 - t) * t * (W * 0.38) +
              t * t * (spinalX - 32);
            iy =
              (1 - t) * (1 - t) * skinY +
              2 * (1 - t) * t * (H * 0.16) +
              t * t * (spinalY - 28);
            color = '#00E5FF';
          } else if (p < 0.55) {
            const t = (p - 0.45) / 0.1;
            ix = spinalX - 32;
            iy = spinalY - 28 + t * 54;
            color = '#A855F7';
          } else {
            const t = (p - 0.55) / 0.45;
            ix =
              (1 - t) * (1 - t) * (spinalX - 30) +
              2 * (1 - t) * t * (W * 0.38) +
              t * t * muscleX;
            iy =
              (1 - t) * (1 - t) * (spinalY + 26) +
              2 * (1 - t) * t * (H * 0.8) +
              t * t * muscleY;
            color = '#00FFA3';
          }

          ctx.shadowBlur = 18;
          ctx.shadowColor = color;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(ix, iy, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(ix, iy, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // =========================================================
      // UNIT 6: MUSCULAR SYSTEM — ANTAGONISTIC BICEPS & TRICEPS
      // =========================================================
      if (unitId === 'muscular') {
        // Slider 0 = Full Flexion (35 deg), Slider 100 = Full Extension (155 deg)
        const flexFactor = 1 - val / 100; // 1 = flexed (biceps contracted), 0 = extended (triceps contracted)
        const angleDeg = 35 + (val / 100) * 120;
        const angleRad = ((angleDeg - 90) * Math.PI) / 180;

        const shoulderX = W * 0.32;
        const shoulderY = H * 0.18;
        const elbowX = W * 0.34;
        const elbowY = H * 0.68;
        const forearmLen = Math.min(W * 0.36, 170);
        const handX = elbowX + Math.cos(angleRad) * forearmLen;
        const handY = elbowY + Math.sin(angleRad) * forearmLen;

        // Humerus Bone
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 18;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(elbowX, elbowY);
        ctx.stroke();

        // Radius / Ulna Forearm Bone
        ctx.beginPath();
        ctx.moveTo(elbowX, elbowY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        // Elbow Joint Hinge
        ctx.fillStyle = '#FF9F1C';
        ctx.beginPath();
        ctx.arc(elbowX, elbowY, 14, 0, Math.PI * 2);
        ctx.fill();

        // BICEPS (Front muscle: bulges & glows Emerald when flexed!)
        const bicepsBulge = 14 + flexFactor * 20;
        const bicepsInsertX = elbowX + Math.cos(angleRad) * 34;
        const bicepsInsertY = elbowY + Math.sin(angleRad) * 34;

        ctx.fillStyle =
          flexFactor > 0.5 ? 'rgba(0, 255, 163, 0.55)' : 'rgba(0, 229, 255, 0.25)';
        ctx.strokeStyle = flexFactor > 0.5 ? '#00FFA3' : '#00E5FF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(shoulderX + 8, shoulderY + 12);
        ctx.quadraticCurveTo(
          elbowX + 26 + bicepsBulge,
          (shoulderY + elbowY) * 0.5,
          bicepsInsertX,
          bicepsInsertY,
        );
        ctx.quadraticCurveTo(
          elbowX + 4,
          (shoulderY + elbowY) * 0.52,
          shoulderX + 8,
          shoulderY + 12,
        );
        ctx.fill();
        ctx.stroke();

        // TRICEPS (Back muscle: bulges & glows Emerald when extended!)
        const tricepsBulge = 14 + (1 - flexFactor) * 18;
        ctx.fillStyle =
          flexFactor <= 0.5 ? 'rgba(0, 255, 163, 0.55)' : 'rgba(0, 229, 255, 0.25)';
        ctx.strokeStyle = flexFactor <= 0.5 ? '#00FFA3' : '#00E5FF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(shoulderX - 10, shoulderY + 14);
        ctx.quadraticCurveTo(
          elbowX - 24 - tricepsBulge,
          (shoulderY + elbowY) * 0.5,
          elbowX - 14,
          elbowY + 6,
        );
        ctx.quadraticCurveTo(
          elbowX - 6,
          (shoulderY + elbowY) * 0.5,
          shoulderX - 10,
          shoulderY + 14,
        );
        ctx.fill();
        ctx.stroke();

        // Magnified Plaque Motrice Synapse Box (Right side)
        const px = W * 0.78;
        const py = H * 0.34;
        ctx.fillStyle = 'rgba(168, 85, 247, 0.14)';
        ctx.strokeStyle = '#A855F7';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px, py, 54, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Motor Axon + Glowing Neuromuscular Spark
        ctx.strokeStyle = '#00E5FF';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(px, py - 42);
        ctx.lineTo(px, py - 6);
        ctx.stroke();

        const sparkAlpha = 0.4 + Math.abs(Math.sin(time * 5)) * 0.6;
        ctx.fillStyle = `rgba(0, 255, 163, ${sparkAlpha})`;
        ctx.beginPath();
        ctx.arc(px, py + 4, 9, 0, Math.PI * 2);
        ctx.fill();

        // Muscle Fiber Striations inside Plaque Motrice
        ctx.strokeStyle = '#FF9F1C';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(px - 36, py + 24);
        ctx.lineTo(px + 36, py + 24);
        ctx.stroke();
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [unitId]);

  const hotspots = LAB_HOTSPOTS[unitId];

  const sliderConfig = {
    respiration: {
      labelAr: 'وتيرة التنفس (راحة ← مجهود)',
      labelFr: 'Rythme respiratoire',
      display: `${12 + Math.round((sliderVal / 100) * 24)} /min`,
    },
    circulation: {
      labelAr: 'التردد القلبي (نبض القلب)',
      labelFr: 'Fréquence cardiaque',
      display: `${60 + Math.round((sliderVal / 100) * 100)} BPM`,
    },
    excretion: {
      labelAr: 'سرعة الترشيح الكبيبي',
      labelFr: 'Débit de filtration',
      display: `${sliderVal}%`,
    },
    nervous: {
      labelAr: 'سرعة السيالة العصبية',
      labelFr: 'Vitesse de l’influx',
      display: `${20 + Math.round((sliderVal / 100) * 80)} m/s`,
    },
    muscular: {
      labelAr: 'ثني الساعد ← بسط الساعد',
      labelFr: 'Flexion ↔ Extension',
      display: `${35 + Math.round((sliderVal / 100) * 120)}°`,
    },
  }[unitId];

  return (
    <div className="space-y-4">
      {/* Main Interactive 60fps Visual Simulation Stage */}
      <div className="relative w-full h-[500px] lg:h-[540px] rounded-2xl overflow-hidden border border-white/10 bg-[#070B14]">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Interactive Clickable Organ Hotspots Overlay */}
        {hotspots.map((spot, idx) => {
          const isSelected = activeHotspot === spot.id;
          return (
            <button
              key={spot.id}
              type="button"
              onClick={() => {
                setActiveHotspot(spot.id);
                onTeacherSpeak({
                  mood: 'explaining',
                  badgeAr: spot.ar,
                  badgeFr: spot.fr,
                  speechText: spot.speech,
                  shouldSpeak: true,
                });
              }}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold transition-transform cursor-pointer ${
                isSelected
                  ? 'scale-110 bg-[#070B14]/95 border-[#00FFA3] text-[#00FFA3] z-20'
                  : 'bg-[#070B14]/88 border-white/20 text-slate-100 hover:scale-105 hover:border-[#00E5FF] z-10'
              }`}
            >
              <span
                className="w-4 h-4 rounded-full text-[10px] font-mono-num font-bold flex items-center justify-center text-[#070B14] shrink-0"
                style={{ backgroundColor: spot.color }}
              >
                {idx + 1}
              </span>
              <span className="whitespace-nowrap">{spot.ar}</span>
            </button>
          );
        })}

        {/* Compact Bottom Control Dock */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[min(740px,94%)] rounded-xl bg-[#0D1424]/95 border border-white/15 p-3.5 space-y-3 shadow-2xl">
          <div className="flex items-center justify-between gap-2 text-xs">
            <label htmlFor="bio-lab-slider" className="font-bold text-slate-100 flex items-center gap-2">
              <span>{sliderConfig.labelAr}</span>
              <span className="font-latin text-[#00E5FF]">{sliderConfig.labelFr}</span>
            </label>
            <span className="font-mono-num text-[#00FFA3] font-bold">
              {sliderConfig.display}
            </span>
          </div>

          <input
            id="bio-lab-slider"
            type="range"
            min={0}
            max={100}
            value={sliderVal}
            onChange={(e) => setSliderVal(Number(e.target.value))}
            className="w-full bio-slider"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-white/10">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRunning((r) => !r)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#00FFA3] text-[#070B14] hover:bg-[#2dffb4] transition-colors cursor-pointer whitespace-nowrap"
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isRunning ? 'إيقاف' : 'تشغيل'}</span>
              </button>

              {unitId === 'nervous' && (
                <button
                  type="button"
                  onClick={triggerReflex}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#A855F7] text-white hover:bg-[#9333EA] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>إهاجة (Stimuler)</span>
                </button>
              )}

              {unitId === 'muscular' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setSliderVal(10);
                      onTeacherSpeak({
                        mood: 'explaining',
                        badgeAr: 'ثني الساعد · Flexion',
                        badgeFr: 'Biceps contracté · Triceps relâché',
                        speechText: 'حالة الثني: تتقلص العضلة ثنائية الرأس وترتخي ثلاثية الرأس!',
                        shouldSpeak: true,
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#00FFA3]/15 border border-[#00FFA3]/40 text-[#00FFA3] hover:bg-[#00FFA3]/25 cursor-pointer"
                  >
                    ثني (Flexion)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSliderVal(95);
                      onTeacherSpeak({
                        mood: 'explaining',
                        badgeAr: 'بسط الساعد · Extension',
                        badgeFr: 'Triceps contracté · Biceps relâché',
                        speechText: 'حالة البسط: تتقلص ثلاثية الرأس وترتخي ثنائية الرأس!',
                        shouldSpeak: true,
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF]/25 cursor-pointer"
                  >
                    بسط (Extension)
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => setSliderVal(50)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <span className="text-[11px] text-slate-400">
              اضغط على الأرقام للاستماع للشرح الصوتي
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
