'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Play,
  RotateCcw,
  Shield,
  ExternalLink,
  Sparkles,
  Sun,
  Moon,
  FileUp,
  Radio,
  ChevronDown,
  Volume2,
  VolumeX,
  Languages,
} from 'lucide-react';
import { OlowoMascot } from '@/components/mascot/OlowoMascot';
import { MascotState } from '@/types';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useMarket } from '@/components/market/MarketContext';
import { UploadInvoiceModal } from '@/components/invoices/UploadInvoiceModal';
import { playSound } from '@/lib/sound';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  mascotState?: MascotState;
  onRunDemo?: () => void;
  onResetData?: () => void;
  isResetting?: boolean;
  onStateRefreshed?: () => void;
}

export function AppHeader({
  title = 'Overview',
  subtitle,
  mascotState = 'OPERATING',
  onRunDemo,
  onResetData,
  isResetting = false,
  onStateRefreshed,
}: AppHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t, isSpeaking, speak, stopVoice } = useMarket();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const displaySubtitle = subtitle || t.statusOperating;

  const handleVoiceReadout = () => {
    playSound('click');
    if (isSpeaking) {
      stopVoice();
    } else {
      const speechSummary =
        language === 'pidgin'
          ? 'OLOWO dey watch the money! Everything dey waka normal within your rules. Your twelve thousand four hundred dollars treasury dey safe, and five thousand dollars shop rent money dey locked. Two invoices dey wait for your approval.'
          : 'OLOWO is actively watching the money. All operations are normal within your rules. Your treasury balance of twelve thousand four hundred dollars is safe, with five thousand dollars reserved for shop rent and obligations. Two invoices await your approval.';
      speak(speechSummary);
    }
  };

  return (
    <>
      <UploadInvoiceModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onInvoiceProcessed={() => {
          if (onStateRefreshed) onStateRefreshed();
        }}
      />

      <header className="h-16 border-b border-[#E2E8F0] dark:border-[#1A2D4C] bg-white/95 dark:bg-[#08111F]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
        {/* Title & Subtitle */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-[#101828] dark:text-white tracking-tight">
              {title}
            </h1>
            <span className="hidden sm:inline-block h-3 w-px bg-[#E2E8F0] dark:bg-[#1A2D4C]" />
            <span className="text-xs text-[#64748B] dark:text-[#8896AB] hidden sm:inline">
              {displaySubtitle}
            </span>
          </div>
        </div>

        {/* Actions & Live Market Controls */}
        <div className="flex items-center gap-2">
          {/* Dual Currency Rate Ticker */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F8FAFC] dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] text-[11px] font-mono text-[#64748B] dark:text-[#8896AB] shadow-2xs">
            <span className="text-[#00A878] dark:text-[#35E0B2] font-bold">1 USDC</span>
            <span>=</span>
            <span className="text-[#101828] dark:text-white font-semibold">₦1,500</span>
          </div>

          {/* Language Switcher (Pidgin Default vs Simple English) */}
          <button
            onClick={() => {
              playSound('toggle');
              toggleLanguage();
            }}
            title={language === 'pidgin' ? 'Switch to Simple English' : 'Switch to Nigerian Pidgin'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#1A2D4C] bg-[#F8FAFC] dark:bg-[#0D192C] hover:bg-[#F1F5F9] dark:hover:bg-[#12223B] text-xs font-semibold text-[#101828] dark:text-white transition-all shadow-2xs"
          >
            <Languages className="w-3.5 h-3.5 text-[#00A878] dark:text-[#35E0B2]" />
            <span>{language === 'pidgin' ? 'Pidgin 🇳🇬' : 'Simple English 🇬🇧'}</span>
          </button>

          {/* Man Voice Speaker Button */}
          <button
            onClick={handleVoiceReadout}
            title={isSpeaking ? 'Stop Man Voice' : 'Listen with Man Voice'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-2xs ${
              isSpeaking
                ? 'bg-[#00A878]/15 border-[#00A878] text-[#00A878] dark:text-[#35E0B2] animate-pulse'
                : 'bg-white dark:bg-[#0D192C] border-[#E2E8F0] dark:border-[#1A2D4C] text-[#64748B] dark:text-[#8896AB] hover:text-[#101828] dark:hover:text-white'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#00A878] dark:text-[#35E0B2]" />
                <span className="hidden md:inline">{t.stopVoice}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#00A878] dark:text-[#35E0B2]" />
                <span className="hidden md:inline">Man Voice</span>
              </>
            )}
          </button>

          {/* Process / Check Waybill Button */}
          <button
            onClick={() => {
              playSound('click');
              setIsUploadOpen(true);
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] dark:bg-[#0D192C] dark:hover:bg-[#12223B] border border-[#E2E8F0] dark:border-[#1A2D4C] text-xs font-semibold text-[#344054] dark:text-white transition-all shadow-xs"
          >
            <FileUp className="w-3.5 h-3.5 text-[#00A878] dark:text-[#35E0B2]" />
            <span>{t.processInvoiceBtn}</span>
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={() => {
              playSound('click');
              toggleTheme();
            }}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
            className="p-2 rounded-xl border border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#0D192C] hover:bg-[#F8FAFC] dark:hover:bg-[#12223B] text-[#64748B] hover:text-[#101828] dark:text-[#8896AB] dark:hover:text-white transition-all shadow-2xs"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-[#475467]" />
            ) : (
              <Sun className="w-4 h-4 text-[#F5B942]" />
            )}
          </button>

          {/* Reset State Button */}
          {onResetData && (
            <button
              onClick={() => {
                playSound('click');
                onResetData();
              }}
              disabled={isResetting}
              title="Reset storage to initial clean seed state"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#0D192C] hover:bg-[#F8FAFC] dark:hover:bg-[#12223B] text-xs font-medium text-[#64748B] hover:text-[#101828] dark:text-[#8896AB] dark:hover:text-white transition-all disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              <span>Reset</span>
            </button>
          )}

          {/* Run Demo Button */}
          {onRunDemo && (
            <button
              onClick={() => {
                playSound('click');
                onRunDemo();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00A878] hover:bg-[#008f66] text-white text-xs font-semibold shadow-xs transition-all transform hover:scale-[1.02]"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Run Demo</span>
            </button>
          )}

          {/* Mascot Micro-widget */}
          <Link href="/operator" className="ml-1">
            <OlowoMascot state={mascotState} size="sm" />
          </Link>
        </div>
      </header>
    </>
  );
}
