/**
 * Web Speech API Voice Synthesizer for OLOWO.
 * Provides authentic spoken readouts in Nigerian Pidgin or Simple English with a male voice.
 */

let synth: SpeechSynthesis | null = null;
let maleVoice: SpeechSynthesisVoice | null = null;

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  synth = window.speechSynthesis;
}

export function getMaleVoice(): SpeechSynthesisVoice | null {
  if (!synth) return null;
  if (maleVoice) return maleVoice;

  const voices = synth.getVoices();
  if (!voices || voices.length === 0) return null;

  // Prioritize Nigerian English, then British/US deep male voices
  const preferredMale = voices.find(
    (v) =>
      v.lang === 'en-NG' ||
      v.name.toLowerCase().includes('nigeria') ||
      v.name.toLowerCase().includes('david') ||
      v.name.toLowerCase().includes('male') ||
      v.name.toLowerCase().includes('george') ||
      v.name.toLowerCase().includes('daniel') ||
      v.name.toLowerCase().includes('guy') ||
      v.name.toLowerCase().includes('mark')
  );

  maleVoice = preferredMale || voices.find((v) => v.lang.startsWith('en')) || voices[0] || null;
  return maleVoice;
}

export function speakText(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !synth) return;

  try {
    synth.cancel(); // Stop any previous speech

    const cleanText = text
      .replace(/USDC/g, 'dollars')
      .replace(/₦/g, 'naira ')
      .replace(/\$/g, '')
      .replace(/0x[a-fA-F0-9]{4,}/g, 'on the blockchain');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voice = getMaleVoice();
    if (voice) {
      utterance.voice = voice;
    }

    // Set natural pitch and speed for friendly merchant clarity
    utterance.rate = 0.95; // Slightly slower for clear market comprehension
    utterance.pitch = 0.9; // Deeper male voice tone

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    synth.speak(utterance);
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
