'use client';

import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Camera,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Store,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  PhoneCall,
} from 'lucide-react';
import { useMarket } from '@/components/market/MarketContext';
import { UploadInvoiceModal } from '@/components/invoices/UploadInvoiceModal';
import { WhatsAppTraderSimulator } from '@/components/simulator/WhatsAppTraderSimulator';
import { UssdTraderModal } from '@/components/simulator/UssdTraderModal';
import { playSound } from '@/lib/sound';

interface MarketTraderHubProps {
  onRefresh?: () => void;
  onOpenDemo?: () => void;
}

export function MarketTraderHub({ onRefresh, onOpenDemo }: MarketTraderHubProps) {
  const { language, persona, setPersona, toggleLanguage, t, speak, stopVoice, isSpeaking } =
    useMarket();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeCardAudio, setActiveCardAudio] = useState<string | null>(null);
  const [showWhatsAppSimulator, setShowWhatsAppSimulator] = useState(false);
  const [showUssdModal, setShowUssdModal] = useState(false);

  const isPidgin = language === 'pidgin';

  const handlePlayCardVoice = (clipKey: string, pidginText: string, englishText: string) => {
    if (isSpeaking && activeCardAudio === clipKey) {
      stopVoice();
      setActiveCardAudio(null);
      return;
    }
    setActiveCardAudio(clipKey);
    const textToSpeak = isPidgin ? pidginText : englishText;
    speak(textToSpeak, clipKey);
  };

  return (
    <>
      <UploadInvoiceModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onInvoiceProcessed={() => {
          if (onRefresh) onRefresh();
        }}
      />

      <UssdTraderModal
        isOpen={showUssdModal}
        onClose={() => setShowUssdModal(false)}
      />

      <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#1A2D4C] bg-gradient-to-br from-white via-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B1728] dark:via-[#091322] dark:to-[#08111F] p-5 sm:p-6 shadow-sm overflow-hidden relative">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-[#00A878]/10 via-[#35E0B2]/5 to-transparent rounded-bl-full pointer-events-none" />

        {/* Top Header & Context Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00A878] to-[#35E0B2] text-white flex items-center justify-center shadow-md shadow-[#00A878]/20 shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#101828] dark:text-white tracking-tight">
                  {isPidgin ? 'Market Trader Action Center' : 'Merchant & Trader Action Center'}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00A878]/15 text-[#00A878] dark:bg-[#35E0B2]/15 dark:text-[#35E0B2] border border-[#00A878]/30 dark:border-[#35E0B2]/30">
                  BALOGUN & KANO
                </span>
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#8896AB] mt-0.5">
                {isPidgin
                  ? 'Audio voice update, quick waybill scanner, and shop rent safety floor.'
                  : 'Daily voice briefing, instant waybill scanner, and untouchable shop rent floor.'}
              </p>
            </div>
          </div>

          {/* Quick controls */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => {
                playSound('click');
                setShowUssdModal(true);
              }}
              className="px-3 py-1.5 rounded-lg border border-[#F5B942]/40 bg-[#F5B942]/10 text-[#D97706] dark:text-[#F5B942] text-xs font-semibold hover:bg-[#F5B942]/20 transition-all flex items-center gap-1.5 shadow-xs"
              title="Offline Feature Phone (USSD *384*56#)"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Feature Phone (*384#)</span>
            </button>

            <button
              onClick={() => setShowWhatsAppSimulator(!showWhatsAppSimulator)}
              className="px-3 py-1.5 rounded-lg border border-[#075E54]/30 bg-[#075E54]/10 text-[#075E54] dark:text-[#35E0B2] text-xs font-semibold hover:bg-[#075E54]/20 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{showWhatsAppSimulator ? 'Hide WhatsApp' : 'WhatsApp Simulator'}</span>
            </button>

            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#12223B] text-xs font-semibold text-[#101828] dark:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#1A2D4C] transition-all flex items-center gap-1.5 shadow-sm"
              title="Switch voice & interface language"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D97706] dark:text-[#F5B942]" />
              <span>{isPidgin ? '🇳🇬 Pidgin (Default)' : '🇬🇧 Simple English'}</span>
            </button>
          </div>
        </div>

        {/* 4 Core Interactive Trader Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {/* Card 1: Shop Audio Briefing */}
          <div className="p-4 rounded-xl border border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#0D192C] hover:border-[#00A878]/50 dark:hover:border-[#35E0B2]/50 transition-all flex flex-col justify-between group shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#00A878] dark:text-[#35E0B2] flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" />
                  {isPidgin ? 'Human Voice' : 'Studio Voice'}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#00A878] animate-pulse" />
              </div>
              <h3 className="text-sm font-bold text-[#101828] dark:text-white">
                {isPidgin ? 'Listen to Shop Money' : 'Shop Money Briefing'}
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#8896AB] mt-1 line-clamp-2">
                {isPidgin
                  ? 'OLOWO go read all your balance, safe rent, and pending invoices in natural male voice.'
                  : 'Hear your total treasury, ring-fenced rent reserve, and approval status.'}
              </p>
            </div>

            <button
              onClick={() =>
                handlePlayCardVoice(
                  'briefing',
                  'OLOWO dey watch the money! Everything dey waka normal within your rules. Your twelve thousand four hundred dollars treasury dey safe, and five thousand dollars shop rent money dey locked. Two invoices dey wait for your approval.',
                  'OLOWO is actively watching the money. All operations are normal within your rules. Your treasury balance of twelve thousand four hundred dollars is safe, with five thousand dollars reserved for shop rent and obligations. Two invoices await your approval.'
                )
              }
              className={`mt-4 w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                isSpeaking && activeCardAudio === 'briefing'
                  ? 'bg-[#00A878] text-white animate-pulse'
                  : 'bg-[#F1F5F9] dark:bg-[#12223B] text-[#101828] dark:text-white hover:bg-[#00A878]/10 hover:text-[#00A878] dark:hover:text-[#35E0B2]'
              }`}
            >
              {isSpeaking && activeCardAudio === 'briefing' ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop Voice</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPidgin ? 'Play Voice Briefing' : 'Listen Now'}</span>
                </>
              )}
            </button>
          </div>

          {/* Card 2: Snap Waybill / Delivery Note */}
          <div className="p-4 rounded-xl border border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#0D192C] hover:border-[#2563EB]/50 dark:hover:border-[#4D7CFE]/50 transition-all flex flex-col justify-between group shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#2563EB] dark:text-[#4D7CFE] flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5" />
                  {isPidgin ? 'WhatsApp / Paper' : 'OCR Scan'}
                </span>
                <span className="text-[10px] font-mono font-bold text-[#64748B] dark:text-[#8896AB]">
                  PO-088
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#101828] dark:text-white">
                {isPidgin ? 'Snap Paper Waybill' : 'Upload Delivery Waybill'}
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#8896AB] mt-1 line-clamp-2">
                {isPidgin
                  ? 'Snap Alhaji Sani Kano rice paper waybill or paste WhatsApp invoice to verify delivery.'
                  : 'Scan physical waybill or receipt. AI checks supplier order and duplicate hashes.'}
              </p>
            </div>

            <button
              onClick={() => setIsUploadOpen(true)}
              className="mt-4 w-full py-2 px-3 rounded-lg text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#4D7CFE] dark:hover:bg-[#3b6dfd] text-white flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{isPidgin ? 'Snap / Upload Waybill' : 'Scan Waybill'}</span>
            </button>
          </div>

          {/* Card 3: Landlord Shop Rent Safe */}
          <div className="p-4 rounded-xl border border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#0D192C] hover:border-[#10B981]/50 dark:hover:border-[#35E0B2]/50 transition-all flex flex-col justify-between group shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#059669] dark:text-[#35E0B2] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isPidgin ? 'Untouchable Floor' : 'Ring-fenced'}
                </span>
                <span className="text-[10px] font-mono font-bold text-[#059669] dark:text-[#35E0B2]">
                  $5,000 (~₦7.5M)
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#101828] dark:text-white">
                {isPidgin ? 'Shop Rent Locked Safe' : 'Landlord Rent Reserve'}
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#8896AB] mt-1 line-clamp-2">
                {isPidgin
                  ? 'No vendor fit touch your ₦7,500,000 rent money. Locked tight against any accidental payout.'
                  : '$5,000 strictly protected for lease survival. Autonomous engine cannot breach floor.'}
              </p>
            </div>

            <button
              onClick={() =>
                handlePlayCardVoice(
                  'rent_safe',
                  'Shop rent reserve of five thousand dollars, about seven point five million naira, is completely locked and safe. No runaway payment or vendor can ever touch your store rent.',
                  'Your shop rent reserve of five thousand dollars is strictly protected. Our policy engine guarantees that operating payouts never breach this floor, keeping your store lease safe.'
                )
              }
              className={`mt-4 w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                isSpeaking && activeCardAudio === 'rent_safe'
                  ? 'bg-[#059669] text-white animate-pulse'
                  : 'bg-[#F1F5F9] dark:bg-[#12223B] text-[#101828] dark:text-white hover:bg-[#059669]/10 hover:text-[#059669] dark:hover:text-[#35E0B2]'
              }`}
            >
              {isSpeaking && activeCardAudio === 'rent_safe' ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop Voice</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPidgin ? 'Listen Rent Proof' : 'Verify Reserve'}</span>
                </>
              )}
            </button>
          </div>

          {/* Card 4: Duplicate Fraud Blocker */}
          <div className="p-4 rounded-xl border border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#0D192C] hover:border-[#DC2626]/50 dark:hover:border-[#FF5C5C]/50 transition-all flex flex-col justify-between group shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#DC2626] dark:text-[#FF5C5C] flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  {isPidgin ? 'Double-Billing Block' : 'Fraud Guard'}
                </span>
                <span className="text-[10px] font-mono font-bold text-[#DC2626] dark:text-[#FF5C5C]">
                  INV-1043
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#101828] dark:text-white">
                {isPidgin ? 'Test Double-Bill Catch' : 'Duplicate Invoice Guard'}
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#8896AB] mt-1 line-clamp-2">
                {isPidgin
                  ? 'Hear how OLOWO immediately caught and blocked Alhaji Sani duplicate invoice to save ₦720,000.'
                  : 'Cryptographic hash check rejects repeat submissions instantly, protecting profit margins.'}
              </p>
            </div>

            <button
              onClick={() =>
                handlePlayCardVoice(
                  'double_bill_blocked',
                  'Alert! Duplicate invoice detected for supplier Alhaji Sani. Bill INV-1043 matches previous payment. Blocked immediately by deterministic rule engine. Seven hundred and twenty thousand naira saved!',
                  'Alert: Duplicate invoice detected for supplier Alhaji Sani. Invoice INV-1043 matches an already settled delivery. Payment automatically rejected by policy engine.'
                )
              }
              className={`mt-4 w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                isSpeaking && activeCardAudio === 'double_bill_blocked'
                  ? 'bg-[#DC2626] text-white animate-pulse'
                  : 'bg-[#F1F5F9] dark:bg-[#12223B] text-[#101828] dark:text-white hover:bg-[#DC2626]/10 hover:text-[#DC2626] dark:hover:text-[#FF5C5C]'
              }`}
            >
              {isSpeaking && activeCardAudio === 'double_bill_blocked' ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop Voice</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPidgin ? 'Listen Fraud Block' : 'Simulate Block'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible WhatsApp Trader Simulator */}
        {showWhatsAppSimulator && (
          <div className="mt-6 pt-5 border-t border-[#E2E8F0] dark:border-[#1A2D4C] animate-in fade-in">
            <WhatsAppTraderSimulator />
          </div>
        )}
      </div>
    </>
  );
}
