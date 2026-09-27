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
} from 'lucide-react';
import { OlowoMascot } from '@/components/mascot/OlowoMascot';
import { DemoRunnerModal } from '@/components/demo/DemoRunnerModal';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useMarket } from '@/components/market/MarketContext';
import { playSound } from '@/lib/sound';

export default function LandingPage() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t, speak, isSpeaking, stopVoice, exchangeRate } = useMarket();

  const handleHeroSpeech = () => {
    playSound('click');
    if (isSpeaking) {
      stopVoice();
    } else {
      const text =
        language === 'pidgin'
          ? 'Welcome to OLOWO! Autonomous finance operator for modern business and market trade. I dey watch your money 24/7, verify supplier waybills, pay permitted invoices on Arc, protect your shop rent, and ask for your approval before big money moves.'
          : 'Welcome to OLOWO. Your autonomous AI finance operator. I monitor business transactions, verify vendor invoices, execute permitted USDC payments, protect your reserve floor, and request approval above your mandate.';
      speak(text);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#08111F] text-[#0F172A] dark:text-white selection:bg-[#00A878]/20 selection:text-[#00A878] transition-colors duration-150">
      {/* Scripted Demo Modal */}
      <DemoRunnerModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />

      {/* Navigation Header */}
      <nav className="h-20 border-b border-[#E2E8F0] dark:border-[#1A2D4C]/60 px-6 max-w-7xl mx-auto flex items-center justify-between sticky top-0 bg-[#F8FAFC]/90 dark:bg-[#08111F]/90 backdrop-blur-md z-30">
        <Link href="/" className="flex items-center gap-3">
          <OlowoMascot state="OPERATING" size="sm" />
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-[#0F172A] dark:text-white text-xl">OLOWO</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00A878]/10 text-[#00A878] dark:text-[#35E0B2] border border-[#00A878]/20 dark:border-[#35E0B2]/30 font-semibold">
              OPERATOR
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-[#64748B] dark:text-[#8896AB]">
          <a href="#how-it-works" className="hover:text-[#0F172A] dark:hover:text-white transition-colors">How It Works</a>
          <a href="#mandate" className="hover:text-[#0F172A] dark:hover:text-white transition-colors">The Mandate</a>
          <a href="#decisions" className="hover:text-[#0F172A] dark:hover:text-white transition-colors">Decision Log</a>
          <a href="#infrastructure" className="hover:text-[#0F172A] dark:hover:text-white transition-colors">Circle & Arc</a>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Language Switcher */}
          <button
            onClick={() => {
              playSound('toggle');
              toggleLanguage();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#0D192C] text-xs font-semibold text-[#101828] dark:text-white hover:border-[#00A878] transition-all shadow-xs"
          >
            <Languages className="w-3.5 h-3.5 text-[#00A878] dark:text-[#35E0B2]" />
            <span>{language === 'pidgin' ? 'Pidgin 🇳🇬' : 'English 🇬🇧'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => {
              playSound('click');
              toggleTheme();
            }}
            className="p-2 rounded-xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] text-[#64748B] dark:text-[#8896AB] hover:text-[#0F172A] dark:hover:text-white transition-all shadow-xs"
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
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#0D192C] hover:bg-[#F1F5F9] dark:hover:bg-[#12223B] border border-[#E2E8F0] dark:border-[#1A2D4C] text-xs font-semibold text-[#334155] dark:text-[#8896AB] dark:hover:text-white transition-all shadow-xs"
          >
            <Play className="w-3.5 h-3.5 text-[#00A878] dark:text-[#35E0B2] fill-current" />
            <span>Interactive Demo</span>
          </button>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A878] hover:bg-[#009166] dark:bg-[#35E0B2] dark:hover:bg-[#3ff0c0] text-white dark:text-[#08111F] text-xs font-semibold shadow-sm transition-all transform hover:scale-[1.02]"
          >
            <span>Launch OLOWO</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* SECTION 10: HERO */}
      <section className="pt-20 pb-16 px-6 max-w-7xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white dark:bg-[#12223B] border border-[#E2E8F0] dark:border-[#1A2D4C] text-xs shadow-xs">
          <OlowoMascot state="OPERATING" size="sm" />
          <span className="text-[#334155] dark:text-white font-medium">{t.tagline}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#0F172A] dark:text-white max-w-4xl mx-auto leading-[1.08]">
          {language === 'pidgin' ? 'Your AI Money ' : 'Your AI Finance '}
          <span className="text-[#00A878] dark:text-[#35E0B2]">Operator.</span>
        </h1>

        <p className="text-base sm:text-lg text-[#475569] dark:text-[#8896AB] max-w-2xl mx-auto leading-relaxed">
          {t.subtagline}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#00A878] hover:bg-[#009166] text-white text-sm font-semibold shadow-md transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <span>Launch OLOWO</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={handleHeroSpeech}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-[#0D192C] hover:bg-[#F1F5F9] dark:hover:bg-[#12223B] border border-[#E2E8F0] dark:border-[#1A2D4C] text-sm font-medium text-[#1E293B] dark:text-white transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2]" />
                <span>Stop Man Voice</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2]" />
                <span>Listen with Man Voice</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              playSound('click');
              setIsDemoOpen(true);
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-[#0D192C] hover:bg-[#F1F5F9] dark:hover:bg-[#12223B] border border-[#E2E8F0] dark:border-[#1A2D4C] text-sm font-medium text-[#1E293B] dark:text-white transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <Play className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2] fill-current" />
            <span>Interactive Demo</span>
          </button>
        </div>

        {/* Hero Visual: Actual Dashboard UI Preview */}
        <div className="pt-10 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#0D192C]/90 shadow-xl overflow-hidden p-6 text-left space-y-6">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#1A2D4C] pb-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                <span className="text-xs font-mono text-[#64748B] dark:text-[#5E6E85] ml-2">app.olowo.finance/dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#00A878] dark:text-[#35E0B2] bg-[#00A878]/10 dark:bg-[#35E0B2]/10 border border-[#00A878]/20 dark:border-[#35E0B2]/30 px-2 py-0.5 rounded font-semibold">
                  ● {language === 'pidgin' ? 'OLOWO DEY WATCH THE MONEY' : 'AUTONOMOUS OPERATIONS ACTIVE'}
                </span>
              </div>
            </div>

            {/* Quick Metrics Teaser */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C]">
                <div className="text-[11px] font-mono text-[#64748B] dark:text-[#8896AB]">
                  {language === 'pidgin' ? 'TOTAL MONEY' : 'TREASURY'}
                </div>
                <div className="text-2xl font-bold font-mono text-[#0F172A] dark:text-white mt-1">$12,400 <span className="text-xs text-[#00A878] dark:text-[#35E0B2]">USDC</span></div>
                <div className="text-xs font-mono text-[#00A878] dark:text-[#35E0B2] font-semibold mt-0.5">~₦18.6M Naira</div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C]">
                <div className="text-[11px] font-mono text-[#64748B] dark:text-[#8896AB]">
                  {language === 'pidgin' ? 'FREE TO SPEND' : 'AVAILABLE'}
                </div>
                <div className="text-2xl font-bold font-mono text-[#0F172A] dark:text-white mt-1">$6,550 <span className="text-xs text-[#3B66F5] dark:text-[#4D7CFE]">USDC</span></div>
                <div className="text-xs font-mono text-[#3B66F5] dark:text-[#4D7CFE] font-semibold mt-0.5">~₦9.82M Naira</div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C]">
                <div className="text-[11px] font-mono text-[#64748B] dark:text-[#8896AB]">
                  {language === 'pidgin' ? 'SHOP RENT (LOCKED)' : 'RESERVED'}
                </div>
                <div className="text-2xl font-bold font-mono text-[#0F172A] dark:text-white mt-1">$5,850 <span className="text-xs text-[#F59E0B] dark:text-[#F5B942]">USDC</span></div>
                <div className="text-xs font-mono text-[#F59E0B] dark:text-[#F5B942] font-semibold mt-0.5">~₦8.77M Naira</div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#FDE68A] dark:border-[#F5B942]/30">
                <div className="text-[11px] font-mono text-[#B45309] dark:text-[#F5B942]">
                  {language === 'pidgin' ? 'NEEDS YOUR SAY' : 'AWAITING APPROVAL'}
                </div>
                <div className="text-2xl font-bold font-mono text-[#0F172A] dark:text-white mt-1">2 <span className="text-xs text-[#64748B] dark:text-[#8896AB]">Bills</span></div>
                <div className="text-xs font-mono text-[#B45309] dark:text-[#F5B942] font-semibold mt-0.5">Exceeds limit</div>
              </div>
            </div>

            {/* Mock feed row */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F]/80 border border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2]" />
                <span className="text-[#0F172A] dark:text-white font-medium">Autonomously paid ABC Design $750 USDC</span>
                <span className="text-[#64748B] dark:text-[#5E6E85] font-mono">• 5/5 Policy Checks Passed</span>
              </div>
              <span className="font-mono text-[#64748B] dark:text-[#8896AB]">Arc Tx: 0x8f4d...2a91</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: CORE LOOP */}
      <section id="how-it-works" className="py-24 px-6 border-t border-[#E2E8F0] dark:border-[#1A2D4C]/60 bg-white dark:bg-[#0A1424]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono text-[#00A878] dark:text-[#35E0B2] uppercase tracking-wider font-semibold">
              AUTONOMOUS EXECUTION LOOP
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] dark:text-white tracking-tight">
              Your business shouldn&apos;t need to approve every invoice.
            </h2>
            <p className="text-sm text-[#475569] dark:text-[#8896AB] leading-relaxed">
              OLOWO handles routine financial operations automatically, while keeping every action inside the rules you define.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] space-y-3 relative shadow-xs">
              <div className="text-xs font-mono font-bold text-[#00A878] dark:text-[#35E0B2]">01 / OBSERVE</div>
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">VERIFY</h3>
              <p className="text-xs text-[#475569] dark:text-[#8896AB] leading-relaxed">
                Inspects invoices, matches contracts, checks milestones, eliminates duplicate claims, and audits vendor reputation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] space-y-3 relative shadow-xs">
              <div className="text-xs font-mono font-bold text-[#3B66F5] dark:text-[#4D7CFE]">02 / COMPLIANCE</div>
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">CHECK POLICY</h3>
              <p className="text-xs text-[#475569] dark:text-[#8896AB] leading-relaxed">
                Backend deterministic engine verifies amount against autonomous limits, daily thresholds, and minimum reserve floor.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] space-y-3 relative shadow-xs">
              <div className="text-xs font-mono font-bold text-[#F59E0B] dark:text-[#F5B942]">03 / SETTLEMENT</div>
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">ACT OR ASK</h3>
              <p className="text-xs text-[#475569] dark:text-[#8896AB] leading-relaxed">
                If allowed, executes USDC payment over Arc network. If outside mandate, requests human owner authorization.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] space-y-3 relative shadow-xs">
              <div className="text-xs font-mono font-bold text-[#00A878] dark:text-[#35E0B2]">04 / ACCOUNTABILITY</div>
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">AUDIT</h3>
              <p className="text-xs text-[#475569] dark:text-[#8896AB] leading-relaxed">
                Every decision, transaction hash, and policy proof is sealed in the immutable OLOWO Decision Log.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 12: THE MANDATE */}
      <section id="mandate" className="py-24 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono text-[#3B66F5] dark:text-[#4D7CFE] uppercase tracking-wider font-semibold">
            AUTHORITY & BOUNDARIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] dark:text-white tracking-tight">
            You define the mandate. OLOWO operates inside it.
          </h2>
          <p className="text-sm text-[#475569] dark:text-[#8896AB] leading-relaxed">
            The AI has agency, but the business owns the authority. You set clear deterministic rules.
          </p>
        </div>

        {/* Large Mandate Card */}
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-lg space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-[#00A878] dark:text-[#35E0B2]" />
              <span className="font-mono font-bold text-[#0F172A] dark:text-white tracking-wider">OLOWO MANDATE</span>
            </div>
            <span className="text-[11px] font-mono text-[#00A878] dark:text-[#35E0B2] bg-[#00A878]/10 dark:bg-[#35E0B2]/10 px-2 py-0.5 rounded font-semibold">
              ENFORCED DETERMINISTICALLY
            </span>
          </div>

          <div className="space-y-4 divide-y divide-[#E2E8F0] dark:divide-[#1A2D4C]/60 text-xs">
            <div className="flex items-center justify-between pt-3">
              <span className="text-[#64748B] dark:text-[#8896AB]">Autonomous payment limit</span>
              <span className="font-mono font-bold text-[#0F172A] dark:text-white text-sm">$1,000 USDC</span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-[#64748B] dark:text-[#8896AB]">Daily autonomous spending</span>
              <span className="font-mono font-bold text-[#0F172A] dark:text-white text-sm">$5,000 USDC</span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-[#64748B] dark:text-[#8896AB]">Minimum treasury reserve floor</span>
              <span className="font-mono font-bold text-[#DC2626] dark:text-[#EF5B5B] text-sm">$5,000 USDC</span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-[#64748B] dark:text-[#8896AB]">New vendors</span>
              <span className="font-mono font-bold text-[#B45309] dark:text-[#F5B942]">Approval required</span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-[#64748B] dark:text-[#8896AB]">Contractor payments</span>
              <span className="font-mono font-bold text-[#00A878] dark:text-[#35E0B2]">Milestone required</span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-[#64748B] dark:text-[#8896AB]">Flagged counterparties</span>
              <span className="font-mono font-bold text-[#DC2626] dark:text-[#EF5B5B]">Blocked</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 13 & 14: TWO CONTRASTING SCENARIOS */}
      <section className="py-24 px-6 bg-white dark:bg-[#0A1424] border-t border-[#E2E8F0] dark:border-[#1A2D4C]/60">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Section 13: $750 payment within mandate */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-mono text-[#00A878] dark:text-[#35E0B2] uppercase tracking-wider font-semibold">
                SCENARIO 1 • WITHIN MANDATE
              </span>
              <h2 className="text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                When everything checks out, OLOWO acts.
              </h2>
              <p className="text-sm text-[#475569] dark:text-[#8896AB] leading-relaxed">
                Contractor ABC Design submits an invoice for $750 USDC for Milestone 4.
                OLOWO verifies the deliverables against contract CT-024, audits duplicate hashes,
                and verifies that post-payment treasury maintains the $5,000 reserve.
              </p>
              <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] text-xs font-mono space-y-1.5">
                <div className="text-[#00A878] dark:text-[#35E0B2] font-semibold">✓ 5/5 Policy Checks Passed</div>
                <div className="text-[#64748B] dark:text-[#8896AB]">Settled: $750 USDC autonomously via Arc</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#A7F3D0] dark:border-[#35E0B2]/40 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
                <span className="text-xs font-bold text-[#0F172A] dark:text-white">ABC Design • INV-1042</span>
                <span className="text-xs font-mono text-[#00A878] dark:text-[#35E0B2] font-bold">$750 USDC</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#334155] dark:text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2]" />
                  <span>Vendor verified</span>
                </div>
                <div className="flex items-center gap-2 text-[#334155] dark:text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2]" />
                  <span>Contract CT-024 verified</span>
                </div>
                <div className="flex items-center gap-2 text-[#334155] dark:text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2]" />
                  <span>Milestone 4 verified</span>
                </div>
                <div className="flex items-center gap-2 text-[#334155] dark:text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2]" />
                  <span>Policy passed ($750 &lt; $1,000 mandate)</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#00A878]/10 dark:bg-[#35E0B2]/10 border border-[#00A878]/20 dark:border-[#35E0B2]/30 text-xs font-mono text-[#00A878] dark:text-[#35E0B2] text-center font-bold">
                ✓ AUTONOMOUS PAYMENT APPROVED & SETTLED
              </div>
            </div>
          </div>

          {/* Section 14: $4,800 payment outside mandate */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-8 border-t border-[#E2E8F0] dark:border-[#1A2D4C]/60">
            <div className="order-2 lg:order-1 p-6 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#FDE68A] dark:border-[#F5B942]/40 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
                <span className="text-xs font-bold text-[#0F172A] dark:text-white">ABC Design • INV-1044</span>
                <span className="text-xs font-mono text-[#B45309] dark:text-[#F5B942] font-bold">$4,800 USDC</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#334155] dark:text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2]" />
                  <span>Vendor verified</span>
                </div>
                <div className="flex items-center gap-2 text-[#334155] dark:text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2]" />
                  <span>Milestone 5 complete</span>
                </div>
                <div className="flex items-center gap-2 text-[#B45309] dark:text-[#F5B942]">
                  <AlertTriangle className="w-4 h-4 text-[#B45309] dark:text-[#F5B942]" />
                  <span>Exceeds autonomous limit ($4,800 &gt; $1,000)</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#FDE68A] dark:border-[#F5B942]/30 space-y-2">
                <span className="text-[11px] font-mono text-[#B45309] dark:text-[#F5B942] block font-semibold">
                  RESULT: HUMAN APPROVAL REQUIRED
                </span>
                <Link
                  href="/approvals"
                  className="block w-full py-2.5 text-center rounded-lg bg-[#00A878] hover:bg-[#009166] text-white font-bold text-xs shadow-xs"
                >
                  Approve $4,800 USDC
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <span className="text-xs font-mono text-[#B45309] dark:text-[#F5B942] uppercase tracking-wider font-semibold">
                SCENARIO 2 • EXCEEDS MANDATE
              </span>
              <h2 className="text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                When something falls outside the mandate, OLOWO asks.
              </h2>
              <p className="text-sm text-[#475569] dark:text-[#8896AB] leading-relaxed">
                Everything is valid and verified. But $4,800 exceeds OLOWO&apos;s $1,000 autonomous authority.
                OLOWO does not guess or bypass the boundary—it surfaces an approval card with full verification proof and awaits owner sign-off.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 15: DECISION LOG SHOWCASE */}
      <section id="decisions" className="py-24 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono text-[#00A878] dark:text-[#35E0B2] uppercase tracking-wider font-semibold">
            EXPLAINABILITY & AUDITABILITY
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] dark:text-white tracking-tight">
            Every decision is explainable.
          </h2>
          <p className="text-sm text-[#475569] dark:text-[#8896AB] leading-relaxed">
            No black boxes. No hallucinated rationales. Every autonomous action records the verified facts and exact policy checks.
          </p>
        </div>

        <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-lg space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
            <span className="text-[#64748B] dark:text-[#8896AB]">09:42 UTC</span>
            <span className="px-2 py-0.5 rounded bg-[#00A878]/10 text-[#00A878] dark:text-[#35E0B2] border border-[#00A878]/20 dark:border-[#35E0B2]/30 font-semibold">
              PAYMENT EXECUTED
            </span>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-sm font-bold text-[#0F172A] dark:text-white">ABC Design</span>
            <span className="text-sm font-bold text-[#00A878] dark:text-[#35E0B2]">$750 USDC</span>
          </div>

          <div className="space-y-1 text-[#64748B] dark:text-[#8896AB] pt-2 border-t border-[#E2E8F0] dark:border-[#1A2D4C]/60">
            <div className="text-[#0F172A] dark:text-white font-semibold mb-1">Why?</div>
            <div>• Contract milestone 4 verified.</div>
            <div>• Vendor approved.</div>
            <div>• No duplicate invoice detected.</div>
            <div>• Treasury reserve maintained.</div>
            <div>• Payment within autonomous limit.</div>
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#1A2D4C] flex justify-between items-center text-[11px] text-[#94A3B8] dark:text-[#5E6E85]">
            <span>5/5 policy checks passed</span>
            <span>Tx: 0x8f4d92a1...2a91</span>
          </div>
        </div>
      </section>

      {/* SECTION 16: PROGRAMMABLE MONEY & INFRASTRUCTURE */}
      <section id="infrastructure" className="py-24 px-6 bg-white dark:bg-[#0A1424] border-t border-[#E2E8F0] dark:border-[#1A2D4C]/60">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono text-[#3B66F5] dark:text-[#4D7CFE] uppercase tracking-wider font-semibold">
              SETTLEMENT INFRASTRUCTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] dark:text-white tracking-tight">
              Programmable money for autonomous business.
            </h2>
            <p className="text-sm text-[#475569] dark:text-[#8896AB] leading-relaxed">
              OLOWO uses Circle USDC infrastructure and Arc for the financial settlement layer.
              OLOWO is the intelligent agent operating layer; Circle and Arc provide the institutional rails underneath it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] space-y-3 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#00A878] dark:text-[#35E0B2]" />
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Circle Wallets</h3>
              <p className="text-xs text-[#475569] dark:text-[#8896AB] leading-relaxed">
                Developer-controlled treasury wallets with programmatic API access. Private keys are never exposed to LLMs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] space-y-3 shadow-xs">
              <Zap className="w-5 h-5 text-[#3B66F5] dark:text-[#4D7CFE]" />
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">USDC Settlement</h3>
              <p className="text-xs text-[#475569] dark:text-[#8896AB] leading-relaxed">
                Global, real-time dollar settlement with zero currency volatility. Seamless international contractor payouts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] space-y-3 shadow-xs">
              <Lock className="w-5 h-5 text-[#F59E0B] dark:text-[#F5B942]" />
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Arc Network</h3>
              <p className="text-xs text-[#475569] dark:text-[#8896AB] leading-relaxed">
                Sub-second finality, deterministic state confirmation, and fee-sponsored institutional transaction execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 17: FINAL CTA */}
      <section className="py-24 px-6 max-w-7xl mx-auto text-center space-y-8">
        <OlowoMascot state="OPERATING" size="lg" className="mx-auto" />
        <h2 className="text-3xl sm:text-5xl font-bold text-[#0F172A] dark:text-white tracking-tight">
          Let your business operate itself.
        </h2>
        <p className="text-base text-[#475569] dark:text-[#8896AB] max-w-xl mx-auto">
          Give OLOWO a mandate. Let it handle the routine.
        </p>

        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#00A878] hover:bg-[#009166] dark:bg-[#35E0B2] dark:hover:bg-[#3ff0c0] text-white dark:text-[#08111F] text-sm font-semibold shadow-md transition-all transform hover:scale-[1.02]"
          >
            <span>Launch OLOWO</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] dark:border-[#1A2D4C]/60 py-8 px-6 text-center text-xs text-[#64748B] dark:text-[#5E6E85] font-mono">
        OLOWO • Autonomous Finance. Within your rules. • Built for Hackathon MVP
      </footer>
    </div>
  );
}
