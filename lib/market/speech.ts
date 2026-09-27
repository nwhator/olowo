/**
 * Ultra-Natural Voice Synthesizer for OLOWO.
 * Provides authentic, high-clarity spoken readouts in Nigerian Pidgin or Simple English
 * using phonetic tuning, West African cadence mapping, and preferred male neural voices.
 */

let synth: SpeechSynthesis | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  synth = window.speechSynthesis;
  // Pre-load voices and handle async population
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = () => {
      cachedVoices = synth?.getVoices() || [];
    };
  }
}

/**
 * Play a gentle, professional operator chime before speaking.
 */
function playOperatorAnnounceChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

  // 1. First priority: Microsoft Abeo (Neural Nigerian Male) or any Nigerian English voice
  const ngMale = voices.find(
    (v) =>
      (v.lang === 'en-NG' || v.name.toLowerCase().includes('nigeria')) &&
      (v.name.toLowerCase().includes('abeo') ||
        v.name.toLowerCase().includes('male') ||
        !v.name.toLowerCase().includes('ezinne'))
  );
  if (ngMale) return ngMale;

  // 2. Second priority: Any Nigerian voice
  const anyNg = voices.find(
    (v) => v.lang === 'en-NG' || v.name.toLowerCase().includes('nigeria')
  );
  if (anyNg) return anyNg;

  // 3. Third priority: British / Commonwealth Natural Male Voices
  const preferredMale = voices.find(
    (v) =>
      (v.lang === 'en-GB' || v.lang === 'en-IE' || v.lang === 'en-ZA' || v.lang === 'en-US') &&
      (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('neural') || v.name.toLowerCase().includes('online')) &&
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
 * Returns all detected voices so the user can inspect or select their preference.
 */
export function getAllAvailableVoices(): SpeechSynthesisVoice[] {
  if (!synth) return [];
  return cachedVoices.length > 0 ? cachedVoices : synth.getVoices();
}

/**
 * Speaks text using the tuned male voice and phonetic Pidgin normalizer.
 */
export function speakText(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !synth) return;

  try {
    synth.cancel(); // Stop any previous speech
    playOperatorAnnounceChime();

    const tuned = phoneticPidginTune(text);
    const utterance = new SpeechSynthesisUtterance(tuned);
    const voice = getMaleVoice();

    if (voice) {
      utterance.voice = voice;
    }

    // Friendly, clear market pace
    utterance.rate = 0.94; // slightly slower cadence for high comprehensibility
    utterance.pitch = 0.92; // warm, resonant male operator tone

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    // Small 80ms delay to allow announce chime to begin smoothly
    setTimeout(() => {
      synth?.speak(utterance);
    }, 80);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    if (onEnd) onEnd();
  }
}

export function stopSpeaking() {
  if (synth) {
    synth.cancel();
  }
}

export function isSpeaking(): boolean {
  return !!(synth && synth.speaking);
}
