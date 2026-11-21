import React, { useState, useCallback, useEffect } from 'react';
import {
  FlaskConical,
  Apple,
  Stethoscope,
  Scale,
  ShieldCheck,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Home,
} from 'lucide-react';
import {
  STATION_LIST,
  type StationId,
} from './data/nutritionLessonData';
import type { MascotSignal } from './data/unitsData';
import { speechEngine } from './utils/speech';
import { TeacherMascot } from './components/TeacherMascot';
import { Station1ReagentsLab } from './components/Station1ReagentsLab';
import { Station2FoodRoles } from './components/Station2FoodRoles';
import { Station3CarencesClinic } from './components/Station3CarencesClinic';
import { Station4RationImcLab } from './components/Station4RationImcLab';
import { Station5HygieneMindMapExam } from './components/Station5HygieneMindMapExam';
import { LandingPage } from './components/LandingPage';
import {
  SubscriptionModal,
  type SubscriptionPlanId,
} from './components/SubscriptionModal';

const STATION_ICONS: Record<StationId, React.ComponentType<{ className?: string }>> = {
  reagents: FlaskConical,
  roles: Apple,
  carences: Stethoscope,
  ration: Scale,
  hygiene: ShieldCheck,
};

export default function App() {
  const [view, setView] = useState<'landing' | 'classroom'>('landing');
  const [activeStation, setActiveStation] = useState<StationId>('reagents');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [xp, setXp] = useState<number>(0);
  const [completedKeys, setCompletedKeys] = useState<string[]>([]);
  const [subModalOpen, setSubModalOpen] = useState<boolean>(false);
  const [subPlan, setSubPlan] = useState<SubscriptionPlanId>('vip');

  const currentIndex = STATION_LIST.findIndex((s) => s.id === activeStation);
  const currentStationMeta = STATION_LIST[currentIndex] || STATION_LIST[0];

  const [mascotSignal, setMascotSignal] = useState<MascotSignal>(
    STATION_LIST[0].welcome,
  );

  useEffect(() => {
    return () => {
      speechEngine.stop();
    };
  }, []);

  const speakSignal = useCallback((signal: MascotSignal) => {
    setMascotSignal(signal);
    if (signal.shouldSpeak !== false) {
      speechEngine.speak({
        text: signal.speechText,
        lang: 'ar',
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
      });
    }
  }, []);

  const handleSpeakLandingIntro = useCallback(
    (text: string) => {
      if (isMuted) {
        setIsMuted(false);
        speechEngine.setMuted(false);
      }
      speechEngine.speak({
        text,
        lang: 'ar',
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
      });
    },
    [isMuted],
  );

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      speechEngine.setMuted(next);
      if (next) setIsSpeaking(false);
      return next;
    });
  }, []);

  const handleReplayVoice = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      speechEngine.setMuted(false);
    }
    speechEngine.speak({
      text: mascotSignal.speechText,
      lang: 'ar',
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  }, [isMuted, mascotSignal.speechText]);

  const handleSelectStation = (id: StationId) => {
    setActiveStation(id);
    const meta = STATION_LIST.find((s) => s.id === id);
    if (meta) speakSignal(meta.welcome);
  };

  const handleEnterClassroom = useCallback(() => {
    setSubModalOpen(false);
    setView('classroom');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const meta = STATION_LIST.find((s) => s.id === activeStation) || STATION_LIST[0];
    speakSignal(meta.welcome);
  }, [activeStation, speakSignal]);

  const handleGoHome = useCallback(() => {
    speechEngine.stop();
    setIsSpeaking(false);
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenSubscribe = useCallback((plan: SubscriptionPlanId) => {
    setSubPlan(plan);
    setSubModalOpen(true);
  }, []);

  const handleEarnXp = useCallback((key: string, amount: number) => {
    setCompletedKeys((prev) => {
      if (prev.includes(key)) return prev;
      setXp((curr) => curr + amount);
      return [...prev, key];
    });
  }, []);

  const isStationDone = (id: StationId) => {
    if (id === 'reagents') return completedKeys.includes('st1_reagents');
    if (id === 'roles') return completedKeys.includes('st2_roles');
    if (id === 'hygiene')
      return (
        completedKeys.includes('st5_hygiene') &&
        completedKeys.includes('st5_exam')
      );
    return false;
  };

  if (view === 'landing') {
    return (
      <>
        <LandingPage
          isMuted={isMuted}
          isSpeaking={isSpeaking}
          onToggleMute={handleToggleMute}
          onSpeakIntro={handleSpeakLandingIntro}
          onEnterClassroom={handleEnterClassroom}
          onOpenSubscribe={handleOpenSubscribe}
        />
        <SubscriptionModal
          isOpen={subModalOpen}
          initialPlan={subPlan}
          onClose={() => setSubModalOpen(false)}
          onEnterClassroom={handleEnterClassroom}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col">
      {/* Clean 3-Zone Top Bar */}
      <header className="sticky top-0 z-40 bg-[#070B14]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
          {/* Zone 1: Brand Wordmark (Returns to Landing Page) */}
          <button
            type="button"
            onClick={handleGoHome}
            className="text-base sm:text-lg font-extrabold tracking-tight text-slate-50 font-latin whitespace-nowrap shrink-0 cursor-pointer hover:text-[#00FFA3] transition-colors"
          >
            ABDESAMAD BAHOUS <span className="text-[#00FFA3]">SVT</span>
          </button>

          {/* Zone 2: Single-Line Navigation (Home + 5 Station Links) */}
          <nav
            aria-label="التنقل داخل فضاء الدروس"
            className="hidden xl:flex items-center gap-5 text-xs font-bold"
          >
            <button
              type="button"
              onClick={handleGoHome}
              className="inline-flex items-center gap-1.5 py-5 text-slate-300 hover:text-[#00E5FF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>الرئيسية</span>
            </button>
            <span aria-hidden="true" className="text-white/15">
              |
            </span>
            {STATION_LIST.map((st) => {
              const isActive = st.id === activeStation;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleSelectStation(st.id)}
                  className={`relative py-5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'text-[#00FFA3]'
                      : 'text-slate-300 hover:text-slate-50'
                  }`}
                >
                  {st.num}. {st.ar}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#00FFA3] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Home Mobile Button + Speaker Mute/Unmute + XP Counter */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleGoHome}
              className="xl:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>الرئيسية</span>
            </button>

            <button
              type="button"
              onClick={handleToggleMute}
              aria-pressed={!isMuted}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isMuted
                  ? 'bg-[#FF9F1C]/15 border-[#FF9F1C]/45 text-[#FF9F1C] hover:bg-[#FF9F1C]/25'
                  : 'bg-[#00FFA3] border-[#00FFA3] text-[#070B14] hover:bg-[#2dffb4]'
              }`}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="hidden sm:inline">الصوت مكتوم</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span className="hidden sm:inline">صوت الأستاذ مفعل</span>
                </>
              )}
            </button>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono-num font-bold text-[#00FFA3] whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{xp} XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Lesson 1 Classroom */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-5 space-y-5">
        {/* Lesson 1 Title Header + Sleek 5-Station Step-by-Step Sub-Navigation Bar */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <p className="text-xs text-slate-400">
                الثالثة إعدادي (3AC) · الدورة الأولى ·{' '}
                <span className="font-latin text-[#00E5FF] font-semibold">
                  Leçon 1 : L’Éducation Alimentaire
                </span>
              </p>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-50 mt-0.5">
                الدرس 01: التربية الغذائية — محطة {currentStationMeta.num}:{' '}
                <span className="text-[#00FFA3]">{currentStationMeta.ar}</span>
              </h1>
            </div>

            <span className="text-xs font-mono-num text-slate-400">
              المحطة {currentIndex + 1} من 5
            </span>
          </div>

          {/* 5 Interactive Stations Sub-Nav */}
          <div
            role="tablist"
            aria-label="المحطات التفاعلية الخمس لدرس التربية الغذائية"
            className="rounded-2xl bg-[#0D1424]/90 border border-white/10 p-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2"
          >
            {STATION_LIST.map((st) => {
              const Icon = STATION_ICONS[st.id];
              const isActive = st.id === activeStation;
              const done = isStationDone(st.id);

              return (
                <button
                  key={st.id}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => handleSelectStation(st.id)}
                  className={`text-right rounded-xl px-3 py-2.5 border transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#00FFA3]/14 border-[#00FFA3] text-slate-50'
                      : 'bg-[#070B14]/70 border-white/10 text-slate-300 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-mono-num font-extrabold ${
                        isActive ? 'text-[#00FFA3]' : 'text-[#00E5FF]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{st.num}</span>
                    </span>
                    {done && <CheckCircle2 className="w-3.5 h-3.5 text-[#00FFA3]" />}
                  </div>
                  <div className="text-xs font-extrabold truncate mt-1">
                    {st.ar}
                  </div>
                  <div className="text-[10px] font-latin text-slate-400 truncate">
                    {st.fr}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Classroom Split: Large Interactive Station Stage (9 cols) + Talking Prof. Abdesamad (3 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-9 space-y-5 min-w-0">
            {activeStation === 'reagents' && (
              <Station1ReagentsLab
                onTeacherSpeak={speakSignal}
                onEarnXp={handleEarnXp}
                completedKeys={completedKeys}
              />
            )}

            {activeStation === 'roles' && (
              <Station2FoodRoles
                onTeacherSpeak={speakSignal}
                onEarnXp={handleEarnXp}
                completedKeys={completedKeys}
              />
            )}

            {activeStation === 'carences' && (
              <Station3CarencesClinic onTeacherSpeak={speakSignal} />
            )}

            {activeStation === 'ration' && (
              <Station4RationImcLab onTeacherSpeak={speakSignal} />
            )}

            {activeStation === 'hygiene' && (
              <Station5HygieneMindMapExam
                onTeacherSpeak={speakSignal}
                onEarnXp={handleEarnXp}
                completedKeys={completedKeys}
              />
            )}

            {/* Step-by-Step Previous / Next Station Footer Bar */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => {
                  if (currentIndex > 0) {
                    handleSelectStation(STATION_LIST[currentIndex - 1].id);
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  currentIndex === 0
                    ? 'opacity-40 cursor-not-allowed bg-white/5 border-white/10 text-slate-500'
                    : 'bg-[#0D1424] border-white/15 text-slate-200 hover:border-[#00E5FF] cursor-pointer'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
                <span>المحطة السابقة</span>
              </button>

              <button
                type="button"
                disabled={currentIndex === STATION_LIST.length - 1}
                onClick={() => {
                  if (currentIndex < STATION_LIST.length - 1) {
                    handleSelectStation(STATION_LIST[currentIndex + 1].id);
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-extrabold transition-colors ${
                  currentIndex === STATION_LIST.length - 1
                    ? 'opacity-40 cursor-not-allowed bg-white/5 border border-white/10 text-slate-500'
                    : 'bg-[#00FFA3] text-[#070B14] hover:bg-[#2dffb4] cursor-pointer'
                }`}
              >
                <span>المحطة التالية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sticky Talking Cartoon Teacher Mascot */}
          <div className="lg:col-span-3 lg:sticky lg:top-20">
            <TeacherMascot
              signal={mascotSignal}
              isSpeaking={isSpeaking}
              isMuted={isMuted}
              onReplayVoice={handleReplayVoice}
              onToggleMute={handleToggleMute}
            />
          </div>
        </div>
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-white/10 mt-8 py-4 px-4 sm:px-6">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span className="font-latin font-semibold text-slate-400">
            ABDESAMAD BAHOUS SVT · Leçon 1 : L’Éducation Alimentaire (3AC Biof)
          </span>
          <span>5 محطات تفاعلية بالصوت والرسوم العلمية · السنة الثالثة إعدادي</span>
        </div>
      </footer>
    </div>
  );
}
