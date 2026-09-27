/**
 * Ultra-Natural Human Voice Engine for OLOWO.
 * Supports:
 * 1. Authentic Studio Neural Human Voice Clips (en-NG-AbeoNeural studio recordings)
 * 2. Web Speech API with West African phonetic cadence tuning
 * 3. Two-tone acoustic announcer chime before spoken alerts
 */

let synth: SpeechSynthesis | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];
let currentAudioElement: HTMLAudioElement | null = null;

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  synth = window.speechSynthesis;
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = () => {
      cachedVoices = synth?.getVoices() || [];
    };
  }
}

/**
 * Pre-recorded studio neural human voice clips generated with en-NG-AbeoNeural.
 * Provides 100% authentic human West African male voice playback.
 */
export const STUDIO_AUDIO_MAP: Record<string, { pidgin: string; simple_english: string }> = {
  welcome: {
    pidgin: '/audio/welcome_pidgin.mp3',
    simple_english: '/audio/welcome_english.mp3',
  },
  briefing: {
    pidgin: '/audio/briefing_pidgin.mp3',
    simple_english: '/audio/briefing_english.mp3',
  },
  rice_paid: {
    pidgin: '/audio/rice_paid_pidgin.mp3',
    simple_english: '/audio/rice_paid_english.mp3',
  },
  double_bill_blocked: {
    pidgin: '/audio/double_bill_blocked_pidgin.mp3',
    simple_english: '/audio/double_bill_blocked_english.mp3',
  },
  haulage_exceeded: {
    pidgin: '/audio/haulage_exceeded_pidgin.mp3',
    simple_english: '/audio/haulage_exceeded_english.mp3',
  },
  rent_safe: {
    pidgin: '/audio/rent_safe_pidgin.mp3',
    simple_english: '/audio/rent_safe_english.mp3',
  },
};

/**
 * Play a gentle, professional operator chime before speaking.
 */
function playOperatorAnnounceChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Two-tone bell chime: E5 (659Hz) -> G#5 (830Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(830.61, now + 0.12);
    gain2.gain.setValueAtTime(0.08, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.38);
  } catch {
    // AudioContext might be blocked until user gesture, ignore silently
  }
}

/**
 * Phonetically tunes Nigerian Pidgin and financial numbers
 * so standard TTS engines speak with authentic cadence and pronunciation.
 */
export function phoneticPidginTune(text: string): string {
  let tuned = text;

  // Currency & numbers mapping for natural spoken flow
  tuned = tuned
    .replace(/~₦(\d+(\.\d+)?)M\b/gi, (_, num) => `about ${num} million naira`)
    .replace(/~₦(\d{1,3}(,\d{3})*(\.\d+)?)/g, (_, num) => `about ${num.replace(/,/g, '')} naira`)
    .replace(/₦(\d+(\.\d+)?)M\b/gi, (_, num) => `${num} million naira`)
    .replace(/₦(\d{1,3}(,\d{3})*(\.\d+)?)/g, (_, num) => `${num.replace(/,/g, '')} naira`)
    .replace(/\$(\d{1,3}(,\d{3})*(\.\d+)?)\s*USDC/gi, (_, num) => `${num.replace(/,/g, '')} digital dollars`)
    .replace(/\$(\d{1,3}(,\d{3})*(\.\d+)?)/g, (_, num) => `${num.replace(/,/g, '')} dollars`)
    .replace(/\bUSDC\b/g, 'U S D C dollars')
    .replace(/0x[a-fA-F0-9]{4,}/g, 'on the Arc blockchain')
    .replace(/(\d+)\/(\d+)\s+policy checks/gi, '$1 out of $2 policy checks');

  // Phonetic adjustments for authentic Nigerian market cadence
  tuned = tuned
    .replace(/\bMadam\/Oga\b/gi, 'Madam or Oh-gah')
    .replace(/\bOga\b/gi, 'Oh-gah')
    .replace(/\bwetyn\b|\bwetin\b/gi, 'way-tin')
    .replace(/\bdey\b/gi, 'day')
    .replace(/\bsharp-sharp\b|\bsharp sharp\b/gi, 'shahp shahp')
    .replace(/\bwahala\b/gi, 'wah-hah-lah')
    .replace(/\bkobo\b/gi, 'kaw-baw')
    .replace(/\bwaybills?\b/gi, 'way-bills')
    .replace(/\bno shaking\b/gi, 'no shay-king')
    .replace(/\balhaji\b/gi, 'Al-hah-jee')
    .replace(/\bbalogun\b/gi, 'Bah-loh-gun')
    .replace(/\bcotonou\b/gi, 'Koh-toh-noo')
    .replace(/\bdawanau\b/gi, 'Dah-wah-nah-oo')
    .replace(/\bhaulage\b/gi, 'transport haul-edge');

  return tuned;
}

/**
 * Returns available voices, prioritizing Nigerian/West African male natural voices,
 * then natural British / deep commonwealth voices.
 */
export function getMaleVoice(): SpeechSynthesisVoice | null {
  if (!synth) return null;
  const voices = cachedVoices.length > 0 ? cachedVoices : synth.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Microsoft Abeo (Neural Nigerian Male) or any Nigerian English voice
  const ngMale = voices.find(
    (v) =>
      (v.lang === 'en-NG' || v.name.toLowerCase().includes('nigeria')) &&
      (v.name.toLowerCase().includes('abeo') ||
        v.name.toLowerCase().includes('male') ||
        !v.name.toLowerCase().includes('ezinne'))
  );
  if (ngMale) return ngMale;

  // 2. Any Nigerian voice
  const anyNg = voices.find(
    (v) => v.lang === 'en-NG' || v.name.toLowerCase().includes('nigeria')
  );
  if (anyNg) return anyNg;

  // 3. British / Commonwealth Natural Male Voices
  const preferredMale = voices.find(
    (v) =>
      (v.lang === 'en-GB' || v.lang === 'en-IE' || v.lang === 'en-ZA' || v.lang === 'en-US') &&
      (v.name.toLowerCase().includes('natural') ||
        v.name.toLowerCase().includes('neural') ||
        v.name.toLowerCase().includes('online')) &&
      (v.name.toLowerCase().includes('ryan') ||
        v.name.toLowerCase().includes('guy') ||
        v.name.toLowerCase().includes('david') ||
        v.name.toLowerCase().includes('george') ||
        v.name.toLowerCase().includes('oliver') ||
        v.name.toLowerCase().includes('daniel') ||
        v.name.toLowerCase().includes('male'))
  );
  if (preferredMale) return preferredMale;

  // 4. Any English male voice
  const generalMale = voices.find(
    (v) =>
      v.lang.startsWith('en') &&
      (v.name.toLowerCase().includes('male') ||
        v.name.toLowerCase().includes('david') ||
        v.name.toLowerCase().includes('george') ||
        v.name.toLowerCase().includes('daniel') ||
        v.name.toLowerCase().includes('mark') ||
        v.name.toLowerCase().includes('alex'))
  );
  if (generalMale) return generalMale;

  // 5. Fallback: Any English voice
  return voices.find((v) => v.lang.startsWith('en')) || voices[0] || null;
}

/**
 * Attempts to detect a matched studio human audio clip from the given text or key.
 */
function detectStudioAudioClip(
  text: string,
  clipKey?: string,
  lang: 'pidgin' | 'simple_english' = 'pidgin'
): string | null {
  if (clipKey && STUDIO_AUDIO_MAP[clipKey]) {
    return STUDIO_AUDIO_MAP[clipKey][lang];
  }

  const lower = text.toLowerCase();

  if (lower.includes('welcome to olowo')) {
    return STUDIO_AUDIO_MAP.welcome[lang];
  }
  if (lower.includes('everything dey waka normal') || lower.includes('actively watching the money')) {
    return STUDIO_AUDIO_MAP.briefing[lang];
  }
  if (lower.includes('alhaji sani') && (lower.includes('480') || lower.includes('750') || lower.includes('rice'))) {
    return STUDIO_AUDIO_MAP.rice_paid[lang];
  }
  if (lower.includes('double') || lower.includes('duplicate') || lower.includes('inv-1043')) {
    return STUDIO_AUDIO_MAP.double_bill_blocked[lang];
  }
  if (lower.includes('cotonou') || lower.includes('1,400') || lower.includes('4,800') || lower.includes('pass your')) {
    return STUDIO_AUDIO_MAP.haulage_exceeded[lang];
  }
  if (lower.includes('shop rent reserve') || lower.includes('untouchable reserve') || lower.includes('rent is locked')) {
    return STUDIO_AUDIO_MAP.rent_safe[lang];
  }

  return null;
}

/**
 * Speaks text using authentic Studio Human Voice MP3 if available,
 * or falls back to Web Speech synthesis with phonetic West African tuning.
 */
export function speakText(
  text: string,
  onEnd?: () => void,
  clipKey?: string,
  language: 'pidgin' | 'simple_english' = 'pidgin'
) {
  if (typeof window === 'undefined') return;

  // Stop any active speech or audio
  stopSpeaking();
  playOperatorAnnounceChime();

  const studioClipUrl = detectStudioAudioClip(text, clipKey, language);

  if (studioClipUrl) {
    try {
      const audio = new Audio(studioClipUrl);
      currentAudioElement = audio;

      audio.onended = () => {
        currentAudioElement = null;
        if (onEnd) onEnd();
      };
      audio.onerror = () => {
        currentAudioElement = null;
        // Fallback to speech synthesis if audio file cannot be loaded
        fallbackSynthesize(text, onEnd);
      };

      setTimeout(() => {
        audio.play().catch(() => {
          fallbackSynthesize(text, onEnd);
        });
      }, 100);
      return;
    } catch {
      fallbackSynthesize(text, onEnd);
      return;
    }
  }

  fallbackSynthesize(text, onEnd);
}

function fallbackSynthesize(text: string, onEnd?: () => void) {
  if (!synth) {
    if (onEnd) onEnd();
    return;
  }

  try {
    const tuned = phoneticPidginTune(text);
    const utterance = new SpeechSynthesisUtterance(tuned);
    const voice = getMaleVoice();

    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = 0.94;
    utterance.pitch = 0.92;

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    setTimeout(() => {
      synth?.speak(utterance);
    }, 80);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    if (onEnd) onEnd();
  }
}

export function stopSpeaking() {
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement.currentTime = 0;
    currentAudioElement = null;
  }
  if (synth) {
    synth.cancel();
  }
}

export function isSpeaking(): boolean {
  if (currentAudioElement && !currentAudioElement.paused) {
    return true;
  }
  return !!(synth && synth.speaking);
}
