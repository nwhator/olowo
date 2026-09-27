'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TRANSLATIONS, Translations } from '@/lib/market/language';
import { speakText, stopSpeaking, isSpeaking as checkSpeaking } from '@/lib/market/speech';

export type Persona = 'market' | 'enterprise';

interface MarketContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  persona: Persona;
  setPersona: (p: Persona) => void;
  togglePersona: () => void;
  exchangeRate: number;
  isSpeaking: boolean;
  speak: (text: string) => void;
  stopVoice: () => void;
}

const MarketContext = createContext<MarketContextType>({
  language: 'pidgin',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: TRANSLATIONS.pidgin,
  persona: 'market',
  setPersona: () => {},
  togglePersona: () => {},
  exchangeRate: 1500,
  isSpeaking: false,
  speak: () => {},
  stopVoice: () => {},
});

export function MarketProvider({ children }: { children: React.ReactNode }) {
  // Default to Nigerian Pidgin and Market Persona as requested!
  const [language, setLanguageState] = useState<Language>('pidgin');
  const [persona, setPersonaState] = useState<Persona>('market');
  const [exchangeRate] = useState<number>(1500);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('olowo-lang') as Language | null;
      if (savedLang === 'pidgin' || savedLang === 'simple_english') {
        setLanguageState(savedLang);
      } else {
        setLanguageState('pidgin');
      }

      const savedPersona = localStorage.getItem('olowo-persona') as Persona | null;
      if (savedPersona === 'market' || savedPersona === 'enterprise') {
        setPersonaState(savedPersona);
      } else {
        setPersonaState('market');
      }
    } catch {}
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('olowo-lang', lang);
    } catch {}
  };

  const toggleLanguage = () => {
    const next = language === 'pidgin' ? 'simple_english' : 'pidgin';
    setLanguage(next);
  };

  const setPersona = (p: Persona) => {
    setPersonaState(p);
    try {
      localStorage.setItem('olowo-persona', p);
    } catch {}
  };

  const togglePersona = () => {
    const next = persona === 'market' ? 'enterprise' : 'market';
    setPersona(next);
  };

  const speak = (text: string) => {
    setSpeaking(true);
    speakText(text, () => {
      setSpeaking(false);
    });
  };

  const stopVoice = () => {
    stopSpeaking();
    setSpeaking(false);
  };

  const currentTranslations = TRANSLATIONS[language] || TRANSLATIONS.pidgin;

  return (
    <MarketContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: currentTranslations,
        persona,
        setPersona,
        togglePersona,
        exchangeRate,
        isSpeaking: speaking,
        speak,
        stopVoice,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  return useContext(MarketContext);
}
