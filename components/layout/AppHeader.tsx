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
  Menu,
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
  onToggleMobileNav?: () => void;
}

export function AppHeader({
  title = 'Overview',
  subtitle,
  mascotState = 'OPERATING',
  onRunDemo,
  onResetData,
  isResetting = false,
  onStateRefreshed,
  onToggleMobileNav,
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
      speak(speechSummary, 'briefing');
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

      <header className="h-16 border-b border-[#E2E8F0] dark:border-[#1A2D4C] bg-white/95 dark:bg-[#08111F]/90 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
        {/* Left: Mobile hamburger + Title & Subtitle */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onToggleMobileNav && (
            <button
              onClick={onToggleMobileNav}
              className="md:hidden p-2 -ml-1 rounded-xl text-[#64748B] hover:text-[#101828] dark:text-[#8896AB] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#12223B] transition-colors"
              title="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <h1 className="text-sm sm:text-base font-bold text-[#101828] dark:text-white tracking-tight truncate">
                {title}
              </h1>
              <span className="hidden sm:inline-block h-3 w-px bg-[#E2E8F0] dark:bg-[#1A2D4C]" />
              <span className="text-xs text-[#64748B] dark:text-[#8896AB] hidden sm:inline truncate max-w-[200px] lg:max-w-none">
                {displaySubtitle}
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions & Live Market Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
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
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#1A2D4C] bg-[#F8FAFC] dark:bg-[#0D192C] hover:bg-[#F1F5F9] dark:hover:bg-[#12223B] text-xs font-semibold text-[#101828] dark:text-white transition-all shadow-2xs"
          >
            <Languages className="w-3.5 h-3.5 text-[#00A878] dark:text-[#35E0B2]" />
            <span className="hidden sm:inline">{language === 'pidgin' ? 'Pidgin 🇳🇬' : 'Simple English 🇬🇧'}</span>
            <span className="sm:hidden font-mono text-[11px]">{language === 'pidgin' ? '🇳🇬' : '🇬🇧'}</span>
          </button>

          {/* Man Voice Speaker Button */}
          <button
            onClick={handleVoiceReadout}
            title={isSpeaking ? 'Stop Man Voice' : 'Listen with Man Voice'}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-2xs ${
              isSpeaking
                ? 'bg-[#00A878]/15 border-[#00A878] text-[#00A878] dark:text-[#35E0B2] animate-pulse'
                : 'bg-white dark:bg-[#0D192C] border-[#E2E8F0] dark:border-[#1A2D4C] text-[#64748B] dark:text-[#8896AB] hover:text-[#101828] dark:hover:text-white'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#00A878] dark:text-[#35E0B2]" />
                <span className="hidden sm:inline">{t.stopVoice}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#00A878] dark:text-[#35E0B2]" />
                <span className="hidden sm:inline">Man Voice</span>
              </>
            )}
          </button>

          {/* Process / Check Waybill Button */}
          <button
            onClick={() => {
              playSound('click');
              setIsUploadOpen(true);
            }}
            title={t.processInvoiceBtn}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#00A878] text-white hover:bg-[#009166] dark:bg-[#35E0B2] dark:hover:bg-[#3ff0c0] dark:text-[#08111F] border border-transparent text-xs font-semibold transition-all shadow-xs"
          >
            <FileUp className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.processInvoiceBtn}</span>
            <span className="sm:hidden text-xs">Scan</span>
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={() => {
              playSound('click');
              toggleTheme();
            }}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
            className="p-1.5 sm:p-2 rounded-xl border border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#0D192C] hover:bg-[#F8FAFC] dark:hover:bg-[#12223B] text-[#64748B] hover:text-[#101828] dark:text-[#8896AB] dark:hover:text-white transition-all shadow-2xs"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-[#475467]" />
            ) : (
              <Sun className="w-4 h-4 text-[#F5B942]" />
            )}
          </button>

          {/* Scripted Hackathon Interactive Demo Button */}
          {onRunDemo && (
            <button
              onClick={() => {
                playSound('click');
                onRunDemo();
              }}
              title="Run 6-Step Scripted Hackathon Demo"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0D192C] hover:bg-[#F1F5F9] dark:hover:bg-[#12223B] border border-[#E2E8F0] dark:border-[#1A2D4C] text-xs font-semibold text-[#344054] dark:text-[#8896AB] dark:hover:text-white transition-all shadow-2xs"
            >
              <Play className="w-3.5 h-3.5 text-[#00A878] dark:text-[#35E0B2] fill-current" />
              <span>Interactive Demo</span>
            </button>
          )}

          {/* Reset Demo State Button */}
          {onResetData && (
            <button
              onClick={() => {
                playSound('click');
                onResetData();
              }}
              disabled={isResetting}
              title="Reset data back to seed state"
              className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#0D192C] hover:bg-[#F1F5F9] dark:hover:bg-[#12223B] border border-[#E2E8F0] dark:border-[#1A2D4C] text-xs font-medium text-[#64748B] dark:text-[#8896AB] hover:text-[#101828] dark:hover:text-white transition-all shadow-2xs disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              <span>Reset State</span>
            </button>
          )}
        </div>
      </header>
    </>
  );
}
