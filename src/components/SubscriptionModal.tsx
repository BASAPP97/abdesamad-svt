import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  MessageCircle,
  GraduationCap,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export type SubscriptionPlanId = 'basic' | 'vip';

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  nameAr: string;
  taglineAr: string;
  priceDh: number;
  accent: string;
  highlights: string[];
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlanId, SubscriptionPlan> = {
  basic: {
    id: 'basic',
    nameAr: 'الباقة الأساسية (التعلم الذاتي التفاعلي)',
    taglineAr: 'وصول غير محدود لجميع الدروس التفاعلية طيلة الموسم الدراسي',
    priceDh: 199,
    accent: '#00E5FF',
    highlights: [
      'جميع دروس الدورة الأولى والثانية (3AC عام + Biof)',
      'مختبرات 3D والتجارب الكيميائية والخرائط الذهنية',
      'الأستاذ الكرتوني الناطق والتمارين المصححة تلقائياً',
    ],
  },
  vip: {
    id: 'vip',
    nameAr: 'الباقة المميزة (المواكبة الشاملة + لايف أسبوعي)',
    taglineAr: 'متابعة شخصية من الأستاذ عبد الصمد لضمان أعلى نقطة في الجهوي',
    priceDh: 349,
    accent: '#00FFA3',
    highlights: [
      'كل مميزات الباقة الأساسية (199 درهم) بالكامل',
      'حصة بث مباشر (Live) تفاعلية كل أسبوع مع الأستاذ',
      'تصحيح الامتحانات الجهوية + مجموعة التلاميذ المتفوقين VIP',
    ],
  },
};

interface SubscriptionModalProps {
  isOpen: boolean;
  initialPlan: SubscriptionPlanId;
  onClose: () => void;
  onEnterClassroom: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  initialPlan,
  onClose,
  onEnterClassroom,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanId>(initialPlan);
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [track, setTrack] = useState<'biof' | 'general'>('biof');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSelectedPlan(initialPlan);
    setErrorMsg(null);
    setSubmitted(false);
  }, [initialPlan, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const plan = SUBSCRIPTION_PLANS[selectedPlan];

  const normalizedPhone = phone.replace(/[\s\-()]/g, '');
  const isPhoneValid = /^(\+212|00212|0)[5-7]\d{8}$/.test(normalizedPhone);

  const whatsappMessage = [
    `السلام عليكم أستاذ عبد الصمد،`,
    `أرغب في تفعيل اشتراكي السنوي في منصة ABDESAMAD BAHOUS SVT (3AC):`,
    `- الباقة المختارة: ${plan.nameAr} (${plan.priceDh} درهم / السنة)`,
    `- الاسم الكامل للتلميذ: ${studentName.trim() || 'غير محدد'}`,
    `- رقم الهاتف / الواتساب: ${phone.trim() || 'غير محدد'}`,
    `- المسار الدراسي: ${track === 'biof' ? 'مسار دولي (Biof)' : 'مسار عام (عربي)'}`,
    `شكراً جزيلاً!`,
  ].join('\n');

  const whatsappUrl = `https://wa.me/212600000000?text=${encodeURIComponent(whatsappMessage)}`;

  const handleConfirmRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentName.trim().length < 3) {
      setErrorMsg('يرجى إدخال الاسم الكامل للتلميذ (3 أحرف على الأقل).');
      return;
    }
    if (!isPhoneValid) {
      setErrorMsg('يرجى إدخال رقم هاتف مغربي صحيح (مثال: 0612345678 أو +212612345678).');
      return;
    }
    setErrorMsg(null);
    setSubmitted(true);
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="subscription-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#04070E]/80 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0D1424] border border-white/15 p-6 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق النافذة"
          className="absolute top-4 left-4 w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="pl-10">
          <p className="text-xs text-[#00FFA3] font-bold">
            تفعيل الاشتراك السنوي · 3AC SVT
          </p>
          <h2
            id="subscription-modal-title"
            className="text-xl sm:text-2xl font-extrabold text-slate-50 mt-1"
          >
            أكمل تسجيلك في منصة الأستاذ عبد الصمد
          </h2>
        </div>

        {/* Plan Switcher Segmented Control */}
        <div className="mt-5 grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#070B14] border border-white/10">
          {(['basic', 'vip'] as SubscriptionPlanId[]).map((id) => {
            const p = SUBSCRIPTION_PLANS[id];
            const active = selectedPlan === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setSelectedPlan(id);
                  setSubmitted(false);
                }}
                className={`rounded-lg px-3 py-2.5 text-right transition-colors cursor-pointer ${
                  active
                    ? id === 'vip'
                      ? 'bg-[#00FFA3]/15 border border-[#00FFA3]/50 text-slate-50'
                      : 'bg-[#00E5FF]/15 border border-[#00E5FF]/50 text-slate-50'
                    : 'border border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-extrabold truncate">
                  {id === 'vip' ? 'الباقة المميزة + لايف' : 'الباقة الأساسية'}
                </div>
                <div
                  className={`text-sm font-mono-num font-extrabold mt-0.5 ${
                    id === 'vip' ? 'text-[#00FFA3]' : 'text-[#00E5FF]'
                  }`}
                >
                  {p.priceDh} درهم / السنة
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Plan Summary */}
        <div className="mt-4 rounded-xl bg-[#070B14]/80 border border-white/10 p-4">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-sm font-extrabold text-slate-100">
              {plan.nameAr}
            </span>
            <span
              className="text-lg font-mono-num font-extrabold whitespace-nowrap"
              style={{ color: plan.accent }}
            >
              {plan.priceDh} DH
            </span>
          </div>
          <ul className="mt-2.5 space-y-1.5">
            {plan.highlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-xs text-slate-300"
              >
                <CheckCircle2
                  className="w-3.5 h-3.5 shrink-0 mt-0.5"
                  style={{ color: plan.accent }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {!submitted ? (
          <form onSubmit={handleConfirmRegistration} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="student-name"
                className="block text-xs font-bold text-slate-200 mb-1.5"
              >
                الاسم الكامل للتلميذ
              </label>
              <input
                id="student-name"
                type="text"
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="مثال: أمين العلمي"
                className="w-full rounded-xl bg-[#070B14] border border-white/15 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#00FFA3] transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="student-phone"
                className="block text-xs font-bold text-slate-200 mb-1.5"
              >
                رقم الهاتف / الواتساب
              </label>
              <input
                id="student-phone"
                type="tel"
                dir="ltr"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="06 12 34 56 78"
                className="w-full rounded-xl bg-[#070B14] border border-white/15 px-4 py-3 text-sm font-mono-num text-slate-100 text-left placeholder:text-slate-500 focus:outline-none focus:border-[#00FFA3] transition-colors"
              />
            </div>

            <div>
              <span className="block text-xs font-bold text-slate-200 mb-1.5">
                المسار الدراسي (الثالثة إعدادي)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTrack('biof')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    track === 'biof'
                      ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-slate-50'
                      : 'bg-[#070B14] border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  مسار دولي (Biof)
                </button>
                <button
                  type="button"
                  onClick={() => setTrack('general')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    track === 'general'
                      ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-slate-50'
                      : 'bg-[#070B14] border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  مسار عام (عربي)
                </button>
              </div>
            </div>

            {errorMsg && (
              <p
                role="alert"
                className="text-xs font-bold text-[#FF9F1C] bg-[#FF9F1C]/10 border border-[#FF9F1C]/35 rounded-xl px-3.5 py-2.5"
              >
                {errorMsg}
              </p>
            )}

            <div className="pt-1 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#00FFA3] text-[#070B14] hover:bg-[#2dffb4] text-sm font-extrabold transition-colors whitespace-nowrap cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>تأكيد التسجيل عبر واتساب</span>
              </button>

              <button
                type="button"
                onClick={onEnterClassroom}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-100 text-sm font-bold transition-colors whitespace-nowrap cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-[#00E5FF]" />
                <span>دخول فضاء الدروس الآن</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="rounded-xl bg-[#00FFA3]/10 border border-[#00FFA3]/40 p-4">
              <div className="flex items-center gap-2 text-sm font-extrabold text-[#00FFA3]">
                <Sparkles className="w-4 h-4" />
                <span>تم تجهيز طلب الاشتراك بنجاح!</span>
              </div>
              <p className="text-xs text-slate-200 mt-1.5 leading-relaxed">
                اضغط على زر واتساب أدناه لإرسال معلوماتك مباشرة للأستاذ عبد الصمد وتفعيل حسابك، أو ادخل فوراً لتجربة الدرس الأول التفاعلي.
              </p>

              <pre className="mt-3 rounded-lg bg-[#070B14] border border-white/10 p-3 text-[11px] text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                {whatsappMessage}
              </pre>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#00FFA3] text-[#070B14] hover:bg-[#2dffb4] text-sm font-extrabold transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>إرسال الطلب عبر واتساب</span>
              </a>

              <button
                type="button"
                onClick={handleCopyMessage}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#00FFA3]" />
                    <span>تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#00E5FF]" />
                    <span>نسخ الرسالة</span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={onEnterClassroom}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#00E5FF]/15 hover:bg-[#00E5FF]/25 border border-[#00E5FF]/45 text-[#00E5FF] text-sm font-extrabold transition-colors cursor-pointer"
            >
              <GraduationCap className="w-4 h-4" />
              <span>دخول فضاء الدروس الآن (الدرس الأول مجاناً)</span>
            </button>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00FFA3]" />
            <span>دفع سنوي آمن لمرة واحدة · بدون تجديد تلقائي</span>
          </span>
          <span className="font-latin text-slate-500">3AC Morocco</span>
        </div>
      </div>
    </div>
  );
};
