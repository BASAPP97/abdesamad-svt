export interface SpeakOptions {
  text: string;
  lang?: 'ar' | 'fr';
  onStart?: () => void;
  onEnd?: () => void;
}

class ClassroomSpeechEngine {
  private muted = false;
  private voices: SpeechSynthesisVoice[] = [];
  private fallbackTimer: number | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  private loadVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (muted) {
      this.stop();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public stop() {
    if (this.fallbackTimer !== null) {
      window.clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }
    if (this.isSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore browser cancel edge cases
      }
    }
  }

  private pickVoice(lang: 'ar' | 'fr'): SpeechSynthesisVoice | null {
    if (!this.voices.length) this.loadVoices();
    if (!this.voices.length) return null;

    if (lang === 'ar') {
      const exactMorocco = this.voices.find((v) =>
        v.lang.toLowerCase().startsWith('ar-ma'),
      );
      if (exactMorocco) return exactMorocco;
      const anyArabic = this.voices.find((v) =>
        v.lang.toLowerCase().startsWith('ar'),
      );
      if (anyArabic) return anyArabic;
    } else {
      const anyFrench = this.voices.find((v) =>
        v.lang.toLowerCase().startsWith('fr'),
      );
      if (anyFrench) return anyFrench;
    }
    return null;
  }

  public speak({ text, lang = 'ar', onStart, onEnd }: SpeakOptions) {
    this.stop();

    if (this.muted || !text.trim()) {
      onEnd?.();
      return;
    }

    const estimatedMs = Math.max(1600, Math.min(5200, text.length * 68));

    if (!this.isSupported()) {
      // Visual lip-sync animation even if browser lacks SpeechSynthesis
      onStart?.();
      this.fallbackTimer = window.setTimeout(() => {
        this.fallbackTimer = null;
        onEnd?.();
      }, estimatedMs);
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ar' ? 'ar-SA' : 'fr-FR';
      utterance.rate = 1.02;
      utterance.pitch = 1.04;

      const voice = this.pickVoice(lang);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      }

      let finished = false;
      const done = () => {
        if (finished) return;
        finished = true;
        if (this.fallbackTimer !== null) {
          window.clearTimeout(this.fallbackTimer);
          this.fallbackTimer = null;
        }
        onEnd?.();
      };

      utterance.onstart = () => {
        onStart?.();
      };
      utterance.onend = done;
      utterance.onerror = done;

      // Safety timer in case browser voice engine stalls without firing onend
      onStart?.();
      this.fallbackTimer = window.setTimeout(done, estimatedMs + 1800);

      window.speechSynthesis.speak(utterance);
    } catch {
      onStart?.();
      this.fallbackTimer = window.setTimeout(() => {
        this.fallbackTimer = null;
        onEnd?.();
      }, estimatedMs);
    }
  }
}

export const speechEngine = new ClassroomSpeechEngine();
