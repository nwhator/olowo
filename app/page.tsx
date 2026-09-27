'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Play,
  Zap,
  Sparkles,
  ExternalLink,
  ChevronRight,
  FileCheck,
  Ban,
  Clock,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Languages,
  Store,
  Truck,
  FileText,
  BadgeAlert,
  Coins,
  History,
  Scale,
  Award,
  Layers,
} from 'lucide-react';
import { OlowoMascot } from '@/components/mascot/OlowoMascot';
import { DemoRunnerModal } from '@/components/demo/DemoRunnerModal';
import { WhatsAppTraderSimulator } from '@/components/simulator/WhatsAppTraderSimulator';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useMarket } from '@/components/market/MarketContext';
import { playSound } from '@/lib/sound';

export default function LandingPage() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t, speak, isSpeaking, stopVoice } = useMarket();

  const handleHeroSpeech = () => {
    playSound('click');
    if (isSpeaking) {
      stopVoice();
    } else {
      const text =
        language === 'pidgin'
          ? 'Welcome to OLOWO! Autonomous finance operator for African market women and modern businesses. I dey watch your money 24/7: I verify paper waybills, stop double-billing fraud, pay your suppliers sharp-sharp on Arc in USDC, lock your shop rent reserve, and call you before big money moves.'
          : 'Welcome to OLOWO. The autonomous AI finance operator built for African market traders and modern businesses. We verify paper waybills, prevent duplicate invoice fraud, settle approved supplier payments on Arc in USDC, safeguard your shop rent reserve, and escalate large decisions for human sign-off.';
      speak(text, 'welcome');
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F8FAFC] dark:bg-[#08111F] text-[#0F172A] dark:text-white selection:bg-[#00A878]/20 selection:text-[#00A878] transition-colors duration-150">
      {/* Scripted Demo Modal */}
      <DemoRunnerModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />

      {/* Navigation Header */}
      <nav className="h-16 sm:h-20 border-b border-[#E2E8F0] dark:border-[#1A2D4C]/60 px-3.5 sm:px-6 max-w-7xl mx-auto flex items-center justify-between sticky top-0 bg-[#F8FAFC]/95 dark:bg-[#08111F]/95 backdrop-blur-md z-30">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
          <OlowoMascot state="OPERATING" size="sm" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-bold tracking-tight text-[#0F172A] dark:text-white text-lg sm:text-xl">OLOWO</span>
            <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00A878]/10 text-[#00A878] dark:text-[#35E0B2] border border-[#00A878]/20 dark:border-[#35E0B2]/30 font-semibold">
              OPERATOR
            </span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-7 text-xs font-medium text-[#64748B] dark:text-[#8896AB]">
          <a href="#market-walkthrough" className="hover:text-[#0F172A] dark:hover:text-white transition-colors">
            {language === 'pidgin' ? 'Market Woman Life' : 'Market Trader Flow'}
          </a>
          <a href="#tameion-rfbs" className="hover:text-[#0F172A] dark:hover:text-white transition-colors flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A878] dark:text-[#35E0B2]" />
            <span>Tameion RFBs</span>
          </a>
          <a href="#mandate" className="hover:text-[#0F172A] dark:hover:text-white transition-colors">The Mandate</a>
          <a href="#decisions" className="hover:text-[#0F172A] dark:hover:text-white transition-colors">Decision Audit</a>
          <a href="#infrastructure" className="hover:text-[#0F172A] dark:hover:text-white transition-colors">Circle &amp; Arc</a>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={() => {
              playSound('toggle');
              toggleLanguage();
            }}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#0D192C] text-xs font-semibold text-[#101828] dark:text-white hover:border-[#00A878] transition-all shadow-xs"
            title="Switch Language (Nigerian Pidgin / Simple English)"
          >
            <Languages className="w-3.5 h-3.5 text-[#00A878] dark:text-[#35E0B2]" />
            <span className="hidden sm:inline">{language === 'pidgin' ? 'Pidgin 🇳🇬' : 'English 🇬🇧'}</span>
            <span className="sm:hidden font-mono text-[11px]">{language === 'pidgin' ? '🇳🇬' : '🇬🇧'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => {
              playSound('click');
              toggleTheme();
            }}
            className="p-1.5 sm:p-2 rounded-xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] text-[#64748B] dark:text-[#8896AB] hover:text-[#0F172A] dark:hover:text-white transition-all shadow-xs"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-[#475569]" />
            ) : (
              <Sun className="w-4 h-4 text-[#F5B942]" />
            )}
          </button>

          <button
            onClick={() => {
              playSound('click');
              setIsDemoOpen(true);
            }}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0D192C] hover:bg-[#F1F5F9] dark:hover:bg-[#12223B] border border-[#E2E8F0] dark:border-[#1A2D4C] text-xs font-semibold text-[#334155] dark:text-[#8896AB] dark:hover:text-white transition-all shadow-xs"
          >
            <Play className="w-3.5 h-3.5 text-[#00A878] dark:text-[#35E0B2] fill-current" />
            <span>Interactive Demo</span>
          </button>

          <Link
            href="/dashboard"
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#00A878] hover:bg-[#009166] dark:bg-[#35E0B2] dark:hover:bg-[#3ff0c0] text-white dark:text-[#08111F] text-xs font-semibold shadow-sm transition-all transform hover:scale-[1.02] shrink-0"
          >
            <span className="hidden sm:inline">Launch OLOWO</span>
            <span className="sm:hidden">Launch</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Tameion Hackathon Banner */}
      <div className="bg-[#0D192C] text-white border-b border-[#1A2D4C] py-2 px-3.5 sm:px-6 text-center text-[11px] sm:text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 font-mono">
          <span className="text-[#35E0B2] font-semibold flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            TAMEION AGENTS HACKATHON
          </span>
          <span className="text-[#5E6E85] hidden sm:inline">•</span>
          <span className="text-[#94A3B8]">Canteen × Circle × Arc</span>
          <span className="text-[#5E6E85] hidden md:inline">•</span>
          <span className="text-white/90 hidden md:inline">Autonomous Treasury, AP/AR, Waybills &amp; Vendor Rails</span>
          <a
            href="https://tameion.thecanteenapp.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#35E0B2] hover:underline inline-flex items-center gap-1 ml-1"
          >
            <span>Read RFBs</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="pt-10 sm:pt-16 pb-12 sm:pb-16 px-3.5 sm:px-6 max-w-7xl mx-auto text-center space-y-6 sm:space-y-8 overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#12223B] border border-[#E2E8F0] dark:border-[#1A2D4C] text-xs shadow-xs max-w-full truncate">
          <OlowoMascot state="OPERATING" size="sm" />
          <span className="text-[#334155] dark:text-white font-medium truncate">{t.tagline}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-[#0F172A] dark:text-white max-w-5xl mx-auto leading-[1.1] break-words">
          {language === 'pidgin' ? (
            <>
              Make OLOWO Watch Your Shop Money.{' '}
              <span className="text-[#00A878] dark:text-[#35E0B2]">Face Your Business.</span>
            </>
          ) : (
            <>
              Autonomous AI Money Operator for{' '}
              <span className="text-[#00A878] dark:text-[#35E0B2]">Market Traders &amp; Modern Business.</span>
            </>
          )}
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-[#475569] dark:text-[#8896AB] max-w-3xl mx-auto leading-relaxed">
          {language === 'pidgin'
            ? 'From Balogun Market Lagos to Kantin Kwari Kano: OLOWO dey scan paper waybills, block double-billing fraud, pay your suppliers sharp-sharp in digital USDC on Arc, lock your shop rent reserve, and speak to you in clear Nigerian Pidgin.'
            : 'From Balogun textile merchants to cross-border commodity traders: OLOWO reads handwritten paper waybills, stops duplicate billing fraud, executes permitted payments on Arc in USDC (<500ms), protects your shop rent reserve, and speaks audio briefings out loud.'}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2 w-full max-w-md sm:max-w-none mx-auto">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#00A878] hover:bg-[#009166] dark:bg-[#35E0B2] dark:hover:bg-[#3ff0c0] text-white dark:text-[#08111F] text-sm font-semibold shadow-md transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <span>{language === 'pidgin' ? 'Open OLOWO Dashboard' : 'Launch OLOWO'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={handleHeroSpeech}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white dark:bg-[#0D192C] hover:bg-[#F1F5F9] dark:hover:bg-[#12223B] border border-[#E2E8F0] dark:border-[#1A2D4C] text-sm font-medium text-[#1E293B] dark:text-white transition-all flex items-center justify-center gap-2 shadow-xs group"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2] animate-pulse" />
                <span className="text-[#00A878] dark:text-[#35E0B2] font-semibold">{t.stopVoice}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2] group-hover:scale-110 transition-transform" />
                <span>{language === 'pidgin' ? 'Listen (Natural Man Voice)' : 'Listen (Spoken Briefing)'}</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              playSound('click');
              setIsDemoOpen(true);
            }}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white dark:bg-[#0D192C] hover:bg-[#F1F5F9] dark:hover:bg-[#12223B] border border-[#E2E8F0] dark:border-[#1A2D4C] text-sm font-medium text-[#1E293B] dark:text-white transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <Play className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2] fill-current" />
            <span>Interactive Demo</span>
          </button>
        </div>

        {/* Hero Visual: Dual Currency Live Financial State */}
        <div className="pt-6 sm:pt-10 max-w-5xl mx-auto w-full">
          <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#0D192C]/90 shadow-xl overflow-hidden p-3.5 sm:p-6 text-left space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E2E8F0] dark:border-[#1A2D4C] pb-3 sm:pb-4 gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span className="text-[11px] sm:text-xs font-mono text-[#64748B] dark:text-[#5E6E85] truncate">
                  app.olowo.finance • Mama Ngozi Commodity Stores
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] sm:text-[11px] font-mono text-[#00A878] dark:text-[#35E0B2] bg-[#00A878]/10 dark:bg-[#35E0B2]/10 border border-[#00A878]/20 dark:border-[#35E0B2]/30 px-2 sm:px-2.5 py-0.5 rounded-full font-semibold">
                  ● {language === 'pidgin' ? 'OLOWO DEY WATCH (1 USDC = ₦1,500)' : 'ACTIVE (1 USDC = ₦1,500)'}
                </span>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
              <div className="p-3 sm:p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] min-w-0 overflow-hidden">
                <div className="text-[10px] sm:text-[11px] font-mono text-[#64748B] dark:text-[#8896AB] truncate">
                  {language === 'pidgin' ? 'TOTAL MONEY WE GET' : 'TOTAL TREASURY'}
                </div>
                <div className="text-lg sm:text-2xl font-bold font-mono text-[#0F172A] dark:text-white mt-0.5 sm:mt-1 truncate">
                  $12,400 <span className="text-[10px] sm:text-xs text-[#00A878] dark:text-[#35E0B2]">USDC</span>
                </div>
                <div className="text-[11px] sm:text-xs font-mono text-[#00A878] dark:text-[#35E0B2] font-semibold mt-0.5 truncate">
                  ~₦18.6M Naira
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] min-w-0 overflow-hidden">
                <div className="text-[10px] sm:text-[11px] font-mono text-[#64748B] dark:text-[#8896AB] truncate">
                  {language === 'pidgin' ? 'FREE TO SPEND TODAY' : 'AVAILABLE SPEND'}
                </div>
                <div className="text-lg sm:text-2xl font-bold font-mono text-[#0F172A] dark:text-white mt-0.5 sm:mt-1 truncate">
                  $6,550 <span className="text-[10px] sm:text-xs text-[#3B66F5] dark:text-[#4D7CFE]">USDC</span>
                </div>
                <div className="text-[11px] sm:text-xs font-mono text-[#3B66F5] dark:text-[#4D7CFE] font-semibold mt-0.5 truncate">
                  ~₦9.82M Naira
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] min-w-0 overflow-hidden">
                <div className="text-[10px] sm:text-[11px] font-mono text-[#64748B] dark:text-[#8896AB] flex items-center gap-1 truncate">
                  <Lock className="w-3 h-3 text-[#F59E0B] shrink-0" />
                  <span className="truncate">{language === 'pidgin' ? 'SHOP RENT' : 'RESERVE'}</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold font-mono text-[#0F172A] dark:text-white mt-0.5 sm:mt-1 truncate">
                  $5,000 <span className="text-[10px] sm:text-xs text-[#F59E0B] dark:text-[#F5B942]">USDC</span>
                </div>
                <div className="text-[11px] sm:text-xs font-mono text-[#F59E0B] dark:text-[#F5B942] font-semibold mt-0.5 truncate">
                  ~₦7.5M [SAFE]
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#FDE68A] dark:border-[#F5B942]/30 min-w-0 overflow-hidden">
                <div className="text-[10px] sm:text-[11px] font-mono text-[#B45309] dark:text-[#F5B942] truncate">
                  {language === 'pidgin' ? 'NEEDS SAY-SO' : 'APPROVALS'}
                </div>
                <div className="text-lg sm:text-2xl font-bold font-mono text-[#0F172A] dark:text-white mt-0.5 sm:mt-1 truncate">
                  2 <span className="text-[10px] sm:text-xs text-[#64748B] dark:text-[#8896AB]">Bills</span>
                </div>
                <div className="text-[11px] sm:text-xs font-mono text-[#B45309] dark:text-[#F5B942] font-semibold mt-0.5 truncate">
                  &gt; $1,000 Limit
                </div>
              </div>
            </div>

            {/* Live autonomous transaction ticker */}
            <div className="p-3 sm:p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F]/80 border border-[#E2E8F0] dark:border-[#1A2D4C] flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 min-w-0">
              <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2] shrink-0 mt-0.5 sm:mt-0" />
                <span className="text-[#0F172A] dark:text-white font-medium break-words">
                  {language === 'pidgin'
                    ? 'Autonomously paid Alhaji Sani $480 USDC (~₦720,000) for 10 Bags Mama Gold Rice'
                    : 'Autonomously paid Alhaji Sani $480 USDC (~₦720,000) for 10 Bags Rice'}
                </span>
                <span className="text-[#64748B] dark:text-[#5E6E85] font-mono hidden md:inline shrink-0">
                  • 5/5 Policy Checks Passed
                </span>
              </div>
              <span className="font-mono text-[#64748B] dark:text-[#8896AB] text-[11px] shrink-0">
                Arc Tx: 0x8f4d...2a91 (&lt;500ms)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: A DAY IN THE MARKET WITH OLOWO (REAL MARKET WOMAN WALKTHROUGH) */}
      <section id="market-walkthrough" className="py-16 sm:py-24 px-3.5 sm:px-6 border-t border-[#E2E8F0] dark:border-[#1A2D4C]/60 bg-white dark:bg-[#0A1424]">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
            <span className="text-xs font-mono text-[#00A878] dark:text-[#35E0B2] uppercase tracking-wider font-semibold">
              REAL-WORLD AFRICAN COMMERCE
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#0F172A] dark:text-white tracking-tight">
              {language === 'pidgin'
                ? 'How Mama Ngozi Dey Use OLOWO For Balogun Market'
                : 'A Day in the Market: How OLOWO Runs Real SME Finance'}
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] dark:text-[#8896AB] leading-relaxed">
              {language === 'pidgin'
                ? 'Market woman no get time to dey calculate spreadsheet or type long code. See how OLOWO dey handle her supplier waybills, driver transport, and rent reserve.'
                : 'Market merchants manage high-volume wholesale trade with handwritten waybills, driver logistics, and WhatsApp photos. See how OLOWO executes their financial operations autonomously.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Step 1: Waybill Snapshot */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] space-y-3 sm:space-y-4 relative shadow-xs hover:border-[#00A878] transition-all min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#00A878] dark:text-[#35E0B2]">08:30 AM</span>
                <span className="p-2 rounded-xl bg-[#00A878]/10 text-[#00A878] dark:text-[#35E0B2]">
                  <FileText className="w-4 h-4" />
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                {language === 'pidgin' ? 'Snap Paper Waybill' : 'Paper Waybill OCR'}
              </h3>
              <p className="text-xs text-[#475569] dark:text-[#8896AB] leading-relaxed">
                Alhaji Sani drops 10 bags of Mama Gold Rice from Kano. Driver snaps the crumpled handwritten paper waybill. OLOWO extracts items, validates $480 USDC (~₦720,000), checks Alhaji&apos;s whitelisted address, and settles in &lt;500ms on Arc.
              </p>
              <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#1A2D4C] text-[11px] font-mono text-[#00A878] dark:text-[#35E0B2] font-semibold">
                ✓ Auto-Paid &amp; Spoken Aloud
              </div>
            </div>

            {/* Step 2: Double Billing Fraud Block */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] space-y-3 sm:space-y-4 relative shadow-xs hover:border-[#EF4444] transition-all min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#EF4444]">11:15 AM</span>
                <span className="p-2 rounded-xl bg-[#EF4444]/10 text-[#EF4444]">
                  <Ban className="w-4 h-4" />
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                {language === 'pidgin' ? 'Block Double Billing' : 'Duplicate Fraud Block'}
              </h3>
              <p className="text-xs text-[#475569] dark:text-[#8896AB] leading-relaxed">
                A dishonest driver re-submits a photo of an old waybill for the same rice bags. OLOWO computes the cryptographic document hash, flags the duplicate, and blocks payment immediately.
              </p>
              <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#1A2D4C] text-[11px] font-mono text-[#EF4444] font-semibold">
                ✕ Blocked: &ldquo;Madam, na double bill!&rdquo;
              </div>
            </div>

            {/* Step 3: Human Escalation */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] space-y-3 sm:space-y-4 relative shadow-xs hover:border-[#F59E0B] transition-all min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#F59E0B]">02:00 PM</span>
                <span className="p-2 rounded-xl bg-[#F59E0B]/10 text-[#F5B942]">
                  <Truck className="w-4 h-4" />
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                {language === 'pidgin' ? 'Big Bill? E Go Ask You' : 'Exceeds Mandate Limit'}
              </h3>
              <p className="text-xs text-[#475569] dark:text-[#8896AB] leading-relaxed">
                Cotonou haulage driver delivers lace container with $1,400 USDC (~₦2.1M) fee. Because it exceeds the $1,000 autonomous mandate limit, OLOWO pauses and alerts Mama Ngozi with spoken audio for 1-click authorization.
              </p>
              <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#1A2D4C] text-[11px] font-mono text-[#F59E0B] font-semibold">
                ⚠ Escalated: Needs Madam Sign-off
              </div>
            </div>

            {/* Step 4: Shop Rent Reserve Protection */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] space-y-3 sm:space-y-4 relative shadow-xs hover:border-[#3B66F5] transition-all min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#3B66F5] dark:text-[#4D7CFE]">06:00 PM</span>
                <span className="p-2 rounded-xl bg-[#3B66F5]/10 text-[#3B66F5] dark:text-[#4D7CFE]">
                  <Store className="w-4 h-4" />
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                {language === 'pidgin' ? 'Shop Rent Dey Safe' : 'Locked Rent Reserve'}
              </h3>
              <p className="text-xs text-[#475569] dark:text-[#8896AB] leading-relaxed">
                The market closes. No matter how many bills arrived, OLOWO strictly preserved the $5,000 USDC (~₦7.5M) Shop Rent &amp; Ajo reserve. Speaks an evening spoken summary: &ldquo;Madam, your rent is locked, 100% safe.&rdquo;
              </p>
              <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#1A2D4C] text-[11px] font-mono text-[#3B66F5] dark:text-[#4D7CFE] font-semibold">
                🛡 $5,000 Rent Untouched
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: TAMEION AGENTS HACKATHON · ALL 5 RFBS DETAILED MAPPING */}
      <section id="tameion-rfbs" className="py-16 sm:py-24 px-3.5 sm:px-6 max-w-7xl mx-auto space-y-12 sm:space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00A878]/10 text-[#00A878] dark:text-[#35E0B2] text-xs font-mono font-semibold">
            CANTEEN × CIRCLE × ARC
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#0F172A] dark:text-white tracking-tight">
            Built Directly For The Tameion RFB Architecture
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#8896AB] leading-relaxed">
            In ancient Byzantium, the <em>Tameion</em> was the imperial treasury room that minted coins and paid the troops.
            In Greek markets, the <em>Agoranomoi</em> inspected merchants&apos; cups and weights against public standards.
            OLOWO brings this ancient stewardship to autonomous finance, implementing all 5 Requests for Builders (RFBs).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* RFB 01 */}
          <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-sm space-y-4 relative flex flex-col justify-between min-w-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#00A878] dark:text-[#35E0B2] bg-[#00A878]/10 px-2.5 py-1 rounded-md">
                  RFB 01
                </span>
                <span className="text-[11px] font-mono text-[#64748B]">Tameion Spec</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white">
                Intelligent Business Treasury
              </h3>
              <p className="text-xs text-[#475569] dark:text-[#8896AB] leading-relaxed">
                <strong>Problem:</strong> Cash spread across accounts earning zero yield, risking liquidity shortfall.<br />
                <strong>OLOWO Engine:</strong> Continuous cash forecasting, hard $5,000 shop rent reserve floor, and idle surplus deployment to Circle USYC yield.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#1A2D4C] text-[11px] font-mono text-[#00A878] dark:text-[#35E0B2]">
              → Working capital &amp; runway alerts
            </div>
          </div>

          {/* RFB 02 */}
          <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-sm space-y-4 relative flex flex-col justify-between min-w-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#3B66F5] dark:text-[#4D7CFE] bg-[#3B66F5]/10 px-2.5 py-1 rounded-md">
                  RFB 02
                </span>
                <span className="text-[11px] font-mono text-[#64748B]">Tameion Spec</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white">
                AP/AR Automation Agent
              </h3>
              <p className="text-xs text-[#475569] dark:text-[#8896AB] leading-relaxed">
                <strong>Problem:</strong> Invoices read by hand, duplicate billing, and manual reconciliation errors.<br />
                <strong>OLOWO Engine:</strong> Multi-format parser (paper waybills, PDF, WhatsApp camera OCR), duplicate invoice hash detection, and payment timing optimizer.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#1A2D4C] text-[11px] font-mono text-[#3B66F5] dark:text-[#4D7CFE]">
              → Eliminates 100% of double billing
            </div>
          </div>

          {/* RFB 03 */}
          <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-sm space-y-4 relative flex flex-col justify-between min-w-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#F59E0B] dark:text-[#F5B942] bg-[#F59E0B]/10 px-2.5 py-1 rounded-md">
                  RFB 03
                </span>
                <span className="text-[11px] font-mono text-[#64748B]">Tameion Spec</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white">
                Contractor &amp; Vendor Network
              </h3>
              <p className="text-xs text-[#475569] dark:text-[#8896AB] leading-relaxed">
                <strong>Problem:</strong> No memory of supplier reliability or verified goods delivery.<br />
                <strong>OLOWO Engine:</strong> Whitelisted suppliers (Alhaji Sani Kano, Balogun Textiles, Cotonou Haulage), milestone release verification, and on-time delivery scoring.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#1A2D4C] text-[11px] font-mono text-[#F59E0B] dark:text-[#F5B942]">
              → Verified delivery before payment
            </div>
          </div>

          {/* RFB 04 */}
          <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-sm space-y-4 relative flex flex-col justify-between min-w-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#00A878] dark:text-[#35E0B2] bg-[#00A878]/10 px-2.5 py-1 rounded-md">
                  RFB 04
                </span>
                <span className="text-[11px] font-mono text-[#64748B]">Tameion Spec</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white">
                Autonomous Business Operator
              </h3>
              <p className="text-xs text-[#475569] dark:text-[#8896AB] leading-relaxed">
                <strong>Problem:</strong> A person still sits between every dollar in and dollar out.<br />
                <strong>OLOWO Engine:</strong> Autonomous execution below $1,000 threshold, deterministic human escalation above threshold, and complete Arc USDC settlement (&lt;500ms).
              </p>
            </div>
            <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#1A2D4C] text-[11px] font-mono text-[#00A878] dark:text-[#35E0B2]">
              → Full end-to-end business cycle
            </div>
          </div>

          {/* RFB 05 */}
          <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-sm space-y-4 relative flex flex-col justify-between min-w-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#9333EA] bg-[#9333EA]/10 px-2.5 py-1 rounded-md">
                  RFB 05
                </span>
                <span className="text-[11px] font-mono text-[#64748B]">Tameion Spec</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white">
                Compliance &amp; Immutable Audit
              </h3>
              <p className="text-xs text-[#475569] dark:text-[#8896AB] leading-relaxed">
                <strong>Problem:</strong> Compliance screening is a one-off gate with zero audit trail.<br />
                <strong>OLOWO Engine:</strong> Continuous counterparty wallet screening, OFAC blacklists, and cryptographic decision logs (the ancient Greek <em>Euthyna</em>) proving every action.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#1A2D4C] text-[11px] font-mono text-[#9333EA]">
              → Zero hallucination, 100% audit proof
            </div>
          </div>

          {/* Prior Art: Agoranomoi & The Symbolon */}
          <div className="p-5 sm:p-7 rounded-3xl bg-[#F8FAFC] dark:bg-[#12223B]/60 border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-sm space-y-4 relative flex flex-col justify-between min-w-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0F172A] dark:text-white bg-black/5 dark:bg-white/10 px-2.5 py-1 rounded-md">
                  Prior Art
                </span>
                <span className="text-[11px] font-mono text-[#64748B]">Historical Roots</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white">
                The Symbolon &amp; Agoranomoi
              </h3>
              <p className="text-xs text-[#475569] dark:text-[#8896AB] leading-relaxed">
                A <em>symbolon</em> was a split tally matched before payment; the <em>agoranomoi</em> inspected marketplace measures. OLOWO performs the digital symbolon: matching PO + waybill + warehouse receipt before releasing Arc USDC.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#1A2D4C] text-[11px] font-mono text-[#64748B] dark:text-[#8896AB]">
              → Ancient market trust, modernized
            </div>
          </div>
        </div>
      </section>

      {/* THE MANDATE: DETERMINISTIC RULES */}
      <section id="mandate" className="py-16 sm:py-24 px-3.5 sm:px-6 bg-white dark:bg-[#0A1424] border-t border-[#E2E8F0] dark:border-[#1A2D4C]/60">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
            <span className="text-xs font-mono text-[#3B66F5] dark:text-[#4D7CFE] uppercase tracking-wider font-semibold">
              DETERMINISTIC GUARDRAILS
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#0F172A] dark:text-white tracking-tight">
              You Set The Mandate. The AI Cannot Talk Past It.
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] dark:text-[#8896AB] leading-relaxed">
              Rules are enforced in hard deterministic code, not probabilistic LLM prompts.
              If an invoice exceeds the mandate limit or touches the shop rent floor, OLOWO cannot execute it.
            </p>
          </div>

          {/* Large Mandate Card */}
          <div className="max-w-xl mx-auto p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#F8FAFC] dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-lg space-y-5 sm:space-y-6 min-w-0">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#E2E8F0] dark:border-[#1A2D4C] gap-2">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <Shield className="w-5 h-5 text-[#00A878] dark:text-[#35E0B2] shrink-0" />
                <span className="font-mono font-bold text-[#0F172A] dark:text-white tracking-wider text-xs sm:text-sm">OLOWO MANDATE</span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-mono text-[#00A878] dark:text-[#35E0B2] bg-[#00A878]/10 dark:bg-[#35E0B2]/10 px-2 py-0.5 rounded font-semibold shrink-0">
                DETERMINISTIC
              </span>
            </div>

            <div className="space-y-3 sm:space-y-4 divide-y divide-[#E2E8F0] dark:divide-[#1A2D4C]/60 text-xs">
              <div className="flex items-center justify-between pt-2.5 sm:pt-3 gap-2">
                <span className="text-[#64748B] dark:text-[#8896AB] truncate">Autonomous payment limit</span>
                <span className="font-mono font-bold text-[#0F172A] dark:text-white text-xs sm:text-sm shrink-0">
                  $1,000 USDC <span className="text-[10px] sm:text-xs text-[#00A878] dark:text-[#35E0B2]">(~₦1.5M)</span>
                </span>
              </div>

              <div className="flex items-center justify-between pt-2.5 sm:pt-3 gap-2">
                <span className="text-[#64748B] dark:text-[#8896AB] truncate">Daily autonomous budget</span>
                <span className="font-mono font-bold text-[#0F172A] dark:text-white text-xs sm:text-sm shrink-0">
                  $5,000 USDC <span className="text-[10px] sm:text-xs text-[#00A878] dark:text-[#35E0B2]">(~₦7.5M)</span>
                </span>
              </div>

              <div className="flex items-center justify-between pt-2.5 sm:pt-3 gap-2">
                <span className="text-[#64748B] dark:text-[#8896AB] truncate">Shop rent reserve floor</span>
                <span className="font-mono font-bold text-[#DC2626] dark:text-[#EF5B5B] text-xs sm:text-sm shrink-0">
                  $5,000 USDC <span className="text-[10px] sm:text-xs text-[#DC2626]">[LOCKED]</span>
                </span>
              </div>

              <div className="flex items-center justify-between pt-2.5 sm:pt-3 gap-2">
                <span className="text-[#64748B] dark:text-[#8896AB] truncate">New unverified suppliers</span>
                <span className="font-mono font-bold text-[#B45309] dark:text-[#F5B942] text-xs shrink-0">Owner sign-off</span>
              </div>

              <div className="flex items-center justify-between pt-2.5 sm:pt-3 gap-2">
                <span className="text-[#64748B] dark:text-[#8896AB] truncate">Contractor &amp; driver payouts</span>
                <span className="font-mono font-bold text-[#00A878] dark:text-[#35E0B2] text-xs shrink-0">Delivery required</span>
              </div>

              <div className="flex items-center justify-between pt-2.5 sm:pt-3 gap-2">
                <span className="text-[#64748B] dark:text-[#8896AB] truncate">Duplicate waybills &amp; flagged wallets</span>
                <span className="font-mono font-bold text-[#DC2626] dark:text-[#EF5B5B] text-xs shrink-0">Strictly blocked</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TWO SCENARIOS SHOWCASE */}
      <section className="py-16 sm:py-24 px-3.5 sm:px-6 max-w-7xl mx-auto space-y-12 sm:space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="space-y-4 sm:space-y-6">
            <span className="text-xs font-mono text-[#00A878] dark:text-[#35E0B2] uppercase tracking-wider font-semibold">
              SCENARIO 1 • WITHIN MANDATE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">
              When everything checks out, OLOWO acts.
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] dark:text-[#8896AB] leading-relaxed">
              Alhaji Sani delivers 10 bags of rice and submits waybill INV-1042 for $480 USDC (~₦720,000).
              OLOWO validates the price against benchmark, confirms no duplicate hash exists, ensures treasury retains the $5,000 shop rent floor, and releases payment on Arc in &lt;500ms.
            </p>
            <div className="p-3 sm:p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] text-xs font-mono space-y-1.5">
              <div className="text-[#00A878] dark:text-[#35E0B2] font-semibold">✓ 5/5 Policy Checks Passed</div>
              <div className="text-[#64748B] dark:text-[#8896AB]">Settled: $480 USDC autonomously via Arc</div>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#A7F3D0] dark:border-[#35E0B2]/40 shadow-lg space-y-4 min-w-0">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
              <span className="text-xs font-bold text-[#0F172A] dark:text-white truncate">Alhaji Sani Rice • INV-1042</span>
              <span className="text-xs font-mono text-[#00A878] dark:text-[#35E0B2] font-bold shrink-0">$480 USDC (~₦720k)</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#334155] dark:text-white/90">
                <CheckCircle2 className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2] shrink-0" />
                <span>Supplier whitelisted (Alhaji Sani Kano)</span>
              </div>
              <div className="flex items-center gap-2 text-[#334155] dark:text-white/90">
                <CheckCircle2 className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2] shrink-0" />
                <span>Paper waybill verified (10 Bags Mama Gold)</span>
              </div>
              <div className="flex items-center gap-2 text-[#334155] dark:text-white/90">
                <CheckCircle2 className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2] shrink-0" />
                <span>No duplicate waybill hash</span>
              </div>
              <div className="flex items-center gap-2 text-[#334155] dark:text-white/90">
                <CheckCircle2 className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2] shrink-0" />
                <span>Within $1,000 mandate limit ($480 &lt; $1,000)</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#00A878]/10 dark:bg-[#35E0B2]/10 border border-[#00A878]/20 dark:border-[#35E0B2]/30 text-xs font-mono text-[#00A878] dark:text-[#35E0B2] text-center font-bold">
              ✓ AUTONOMOUS PAYMENT APPROVED &amp; SETTLED ON ARC
            </div>
          </div>
        </div>

        {/* Section: $1,400 haulage fee exceeds mandate */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center pt-8 sm:pt-12 border-t border-[#E2E8F0] dark:border-[#1A2D4C]/60">
          <div className="order-2 lg:order-1 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#FDE68A] dark:border-[#F5B942]/40 shadow-lg space-y-4 min-w-0">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
              <span className="text-xs font-bold text-[#0F172A] dark:text-white truncate">Cotonou Haulage Driver • INV-1048</span>
              <span className="text-xs font-mono text-[#B45309] dark:text-[#F5B942] font-bold shrink-0">$1,400 USDC (~₦2.1M)</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#334155] dark:text-white/90">
                <CheckCircle2 className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2] shrink-0" />
                <span>Haulage logistics partner verified</span>
              </div>
              <div className="flex items-center gap-2 text-[#334155] dark:text-white/90">
                <CheckCircle2 className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2] shrink-0" />
                <span>Inter-state border clearance verified</span>
              </div>
              <div className="flex items-center gap-2 text-[#B45309] dark:text-[#F5B942]">
                <AlertTriangle className="w-4 h-4 text-[#B45309] dark:text-[#F5B942] shrink-0" />
                <span>Exceeds autonomous limit ($1,400 &gt; $1,000)</span>
              </div>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#FDE68A] dark:border-[#F5B942]/30 space-y-2">
              <span className="text-[11px] font-mono text-[#B45309] dark:text-[#F5B942] block font-semibold">
                RESULT: OWNER APPROVAL REQUIRED
              </span>
              <Link
                href="/approvals"
                className="block w-full py-2.5 text-center rounded-lg bg-[#00A878] hover:bg-[#009166] text-white font-bold text-xs shadow-xs"
              >
                Approve $1,400 USDC (~₦2,100,000)
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-4 sm:space-y-6">
            <span className="text-xs font-mono text-[#B45309] dark:text-[#F5B942] uppercase tracking-wider font-semibold">
              SCENARIO 2 • EXCEEDS MANDATE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">
              When a payment exceeds authority, OLOWO asks.
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] dark:text-[#8896AB] leading-relaxed">
              Everything is valid. But $1,400 exceeds OLOWO&apos;s $1,000 autonomous ceiling.
              OLOWO does not guess, hallucinate, or bypass the rules. It surfaces an approval card with full verification proof, plays a voice notification, and awaits Madam/Oga&apos;s sign-off.
            </p>
          </div>
        </div>
      </section>

      {/* INTERACTIVE WHATSAPP COMMERCE SIMULATOR */}
      <section className="py-14 sm:py-20 px-3.5 sm:px-6 max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-[#00A878] dark:text-[#35E0B2] uppercase tracking-wider font-semibold">
            AFRICAN TRADE REALITY
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">
            Interactive WhatsApp Commerce Simulator
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#8896AB] max-w-xl mx-auto leading-relaxed">
            Experience how real grain suppliers in Kano and cross-border hauliers in Cotonou transact with Mama Ngozi using WhatsApp waybills and sub-second Arc USDC payments.
          </p>
        </div>

        <WhatsAppTraderSimulator />
      </section>

      {/* DECISION LOG / EUTHYNA AUDIT TRAIL */}
      <section id="decisions" className="py-16 sm:py-24 px-3.5 sm:px-6 bg-white dark:bg-[#0A1424] border-t border-[#E2E8F0] dark:border-[#1A2D4C]/60">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
            <span className="text-xs font-mono text-[#00A878] dark:text-[#35E0B2] uppercase tracking-wider font-semibold">
              THE EUTHYNA PROOF TRAIL
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#0F172A] dark:text-white tracking-tight">
              Every Decision Is Cryptographically Explainable.
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] dark:text-[#8896AB] leading-relaxed">
              No black boxes. No hallucinated rationales. Every autonomous action records the verified facts and exact policy checks on the Arc blockchain.
            </p>
          </div>

          <div className="max-w-2xl mx-auto p-4 sm:p-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-lg space-y-4 font-mono text-xs min-w-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#1A2D4C] gap-1.5">
              <span className="text-[#64748B] dark:text-[#8896AB] text-[11px]">08:31 UTC • Arc Block #1,492,084</span>
              <span className="px-2 py-0.5 rounded bg-[#00A878]/10 text-[#00A878] dark:text-[#35E0B2] border border-[#00A878]/20 dark:border-[#35E0B2]/30 font-semibold text-[10px]">
                AUTONOMOUS SETTLEMENT
              </span>
            </div>

            <div className="flex justify-between items-baseline gap-2">
              <span className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white truncate">Alhaji Sani Rice (Kano)</span>
              <span className="text-xs sm:text-sm font-bold text-[#00A878] dark:text-[#35E0B2] shrink-0">$480 USDC (~₦720k)</span>
            </div>

            <div className="space-y-1 text-[#64748B] dark:text-[#8896AB] pt-2 border-t border-[#E2E8F0] dark:border-[#1A2D4C]/60 text-[11px] leading-relaxed break-words">
              <div className="text-[#0F172A] dark:text-white font-semibold mb-1">Audit Trail &amp; Proof:</div>
              <div>• Waybill scanned: 10 Bags Mama Gold Rice ($48/bag verified).</div>
              <div>• Supplier whitelisted &amp; verified.</div>
              <div>• Zero duplicate waybill hash found.</div>
              <div>• Shop rent reserve floor of $5,000 preserved.</div>
              <div>• Within $1,000 autonomous mandate threshold.</div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#1A2D4C] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 text-[11px] text-[#94A3B8] dark:text-[#5E6E85]">
              <span>5/5 deterministic policy checks passed</span>
              <span className="text-[#00A878] dark:text-[#35E0B2]">Tx: 0x8f4d92a1...2a91 (&lt;500ms)</span>
            </div>
          </div>
        </div>
      </section>

      {/* SETTLEMENT INFRASTRUCTURE */}
      <section id="infrastructure" className="py-16 sm:py-24 px-3.5 sm:px-6 border-t border-[#E2E8F0] dark:border-[#1A2D4C]/60 bg-[#F8FAFC] dark:bg-[#08111F]">
        <div className="max-w-7xl mx-auto text-center space-y-10 sm:space-y-12">
          <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
            <span className="text-xs font-mono text-[#3B66F5] dark:text-[#4D7CFE] uppercase tracking-wider font-semibold">
              CIRCLE × ARC FINANCIAL INFRASTRUCTURE
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#0F172A] dark:text-white tracking-tight">
              Stablecoin Rails For Continuous Autonomous Commerce
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] dark:text-[#8896AB] leading-relaxed">
              OLOWO is the intelligent AI operating brain. Circle and Arc provide the institutional stablecoin foundation underneath it.
            </p>
            <div className="pt-2">
              <Link
                href="/infrastructure"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#4D7CFE] dark:hover:bg-[#3b6dfd] text-white text-xs font-semibold shadow-sm transition-all"
              >
                <span>Open Circle &amp; Arc Infrastructure Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 text-left">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] space-y-2.5 shadow-xs min-w-0">
              <ShieldCheck className="w-5 h-5 text-[#00A878] dark:text-[#35E0B2]" />
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">Circle Wallets</h3>
              <p className="text-xs text-[#475569] dark:text-[#8896AB] leading-relaxed">
                Developer-controlled agent wallets for treasury, protected reserves, and contractor escrows.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] space-y-2.5 shadow-xs min-w-0">
              <Zap className="w-5 h-5 text-[#3B66F5] dark:text-[#4D7CFE]" />
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">Arc USDC Rails</h3>
              <p className="text-xs text-[#475569] dark:text-[#8896AB] leading-relaxed">
                Sub-second finality (&lt;380ms) and ~$0.012 USDC gas. Instant supplier settlements.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] space-y-2.5 shadow-xs min-w-0">
              <Lock className="w-5 h-5 text-[#F59E0B] dark:text-[#F5B942]" />
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">Circle Paymaster</h3>
              <p className="text-xs text-[#475569] dark:text-[#8896AB] leading-relaxed">
                100% sponsored gasless transactions. African market traders never hold volatile gas tokens.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] space-y-2.5 shadow-xs min-w-0">
              <Sparkles className="w-5 h-5 text-[#10B981] dark:text-[#35E0B2]" />
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">Circle USYC Yield</h3>
              <p className="text-xs text-[#475569] dark:text-[#8896AB] leading-relaxed">
                5.15% APY tokenized money market fund. Idle shop rent earns +$0.71 daily interest while locked.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] space-y-2.5 shadow-xs min-w-0">
              <Layers className="w-5 h-5 text-[#8B5CF6] dark:text-[#A78BFA]" />
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">Circle Gateway</h3>
              <p className="text-xs text-[#475569] dark:text-[#8896AB] leading-relaxed">
                Unified multichain USDC balance across Arc, Base, and Arbitrum with CCTP cross-chain bridge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-16 sm:py-24 px-3.5 sm:px-6 max-w-7xl mx-auto text-center space-y-6 sm:space-y-8">
        <OlowoMascot state="OPERATING" size="lg" className="mx-auto" />
        <h2 className="text-2xl sm:text-5xl font-bold text-[#0F172A] dark:text-white tracking-tight">
          {language === 'pidgin' ? 'Make OLOWO Face The Money.' : 'Let Your Business Operate Itself.'}
        </h2>
        <p className="text-sm sm:text-base text-[#475569] dark:text-[#8896AB] max-w-xl mx-auto leading-relaxed">
          {language === 'pidgin'
            ? 'Give OLOWO your rules today. E go watch your shop money 24/7 make you fit face your customers.'
            : 'Give OLOWO a mandate. Let it handle invoices, suppliers, and payments within your rules.'}
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto w-full">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#00A878] hover:bg-[#009166] dark:bg-[#35E0B2] dark:hover:bg-[#3ff0c0] text-white dark:text-[#08111F] text-sm font-semibold shadow-md transition-all transform hover:scale-[1.02]"
          >
            <span>Launch OLOWO</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => {
              playSound('click');
              setIsDemoOpen(true);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white dark:bg-[#0D192C] hover:bg-[#F1F5F9] dark:hover:bg-[#12223B] border border-[#E2E8F0] dark:border-[#1A2D4C] text-sm font-semibold text-[#101828] dark:text-white shadow-xs transition-all"
          >
            <Play className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2] fill-current" />
            <span>Interactive Demo</span>
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#E2E8F0] dark:border-[#1A2D4C]/60 py-8 sm:py-10 px-3.5 sm:px-6 text-center text-xs text-[#64748B] dark:text-[#5E6E85] font-mono space-y-2 sm:space-y-3">
        <div>
          OLOWO • Autonomous Finance. Within your rules. • Built for Tameion Agents Hackathon (Canteen × Circle × Arc)
        </div>
        <div className="text-[10px] sm:text-[11px] text-[#94A3B8] dark:text-[#475569]">
          Settled on Arc Network in USDC • RFB 01 to 05 Architecture • Designed for African Market Women &amp; Modern Global SMEs
        </div>
      </footer>
    </div>
  );
}
