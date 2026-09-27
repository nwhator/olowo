'use client';

import React, { useState } from 'react';
import {
  X,
  FileUp,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Ban,
  Clock,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Camera,
  ShoppingBag,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { OlowoMascot } from '@/components/mascot/OlowoMascot';
import { playPaymentSuccessSound, playApprovalAlertSound, playBlockedSound } from '@/lib/sound';
import confetti from 'canvas-confetti';
import { useMarket } from '@/components/market/MarketContext';
import { formatDualCurrency } from '@/lib/market/language';

interface UploadInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvoiceProcessed?: () => void;
}

export function UploadInvoiceModal({
  isOpen,
  onClose,
  onInvoiceProcessed,
}: UploadInvoiceModalProps) {
  const { language, t, speak, isSpeaking, stopVoice, exchangeRate } = useMarket();

  // Mode: Market Trader Waybill vs Corporate Invoice
  const [modalMode, setModalMode] = useState<'MARKET' | 'CORPORATE'>('MARKET');

  const [vendorName, setVendorName] = useState('Alhaji Sani Grain Depot (Kano)');
  const [amount, setAmount] = useState('650');
  const [invoiceNumber, setInvoiceNumber] = useState(`WB-${Math.floor(1000 + Math.random() * 9000)}`);
  const [description, setDescription] = useState('10 Bags Mama Gold Rice (Delivered to Shop #42)');
  const [contractMilestone, setContractMilestone] = useState('10 Bags Delivery (Waybill Confirmed)');

  const [step, setStep] = useState<'IDLE' | 'PROCESSING' | 'RESULT'>('IDLE');
  const [currentVerificationIndex, setCurrentVerificationIndex] = useState(0);
  const [resultData, setResultData] = useState<{
    decision: 'ALLOW' | 'APPROVAL_REQUIRED' | 'BLOCK';
    message: string;
    speechText: string;
    txHash?: string;
  } | null>(null);

  if (!isOpen) return null;

  const verificationStagesMarket = [
    'Scanning waybill paper snapshot & verifying Alhaji signature...',
    'Checking supplier whitelist & warehouse store delivery confirmation...',
    'Price-spike check: verifying $65/bag agreed rate (No cheat detected)...',
    'Checking $5,000 shop rent & Ajo reserve floor...',
    'Authorizing Arc USDC settlement...',
  ];

  const verificationStagesCorp = [
    'Parsing invoice metadata & cryptographic counterparty signature...',
    'Checking vendor whitelist directory & risk clearance...',
    'Matching contract CT-024 and milestone deliverables...',
    'Evaluating deterministic mandate policies & $5,000 reserve floor...',
    'Finalizing settlement authorization...',
  ];

  const stages = modalMode === 'MARKET' ? verificationStagesMarket : verificationStagesCorp;

  const handleSimulate = async () => {
    setStep('PROCESSING');
    setCurrentVerificationIndex(0);

    for (let i = 0; i < stages.length; i++) {
      setCurrentVerificationIndex(i);
      await new Promise((r) => setTimeout(r, 550));
    }

    const numAmount = parseFloat(amount) || 0;
    const isUnapproved = vendorName.includes('Unknown') || vendorName.includes('Unapproved');
    const isOverLimit = numAmount > 1000;

    let decision: 'ALLOW' | 'APPROVAL_REQUIRED' | 'BLOCK' = 'ALLOW';
    let message = '';
    let speechText = '';
    let txHash: string | undefined = undefined;

    if (numAmount > 12400 - 5000) {
      decision = 'BLOCK';
      message =
        language === 'pidgin'
          ? 'Payment blocked! This amount go touch your $5,000 shop rent reserve wey nobody fit touch.'
          : 'Payment blocked because it would breach your $5,000 protected operating reserve floor.';
      speechText =
        language === 'pidgin'
          ? 'Payment blocked! E go touch your five thousand dollars shop rent money. I stop am.'
          : 'Payment blocked because it breaches your five thousand dollars reserve floor.';
      playBlockedSound();
    } else if (isUnapproved) {
      decision = 'APPROVAL_REQUIRED';
      message =
        language === 'pidgin'
          ? 'Hold on! This driver or supplier never dey your approved whitelist. You must approve am first.'
          : 'Payment requires approval because this recipient is not an approved vendor in company records.';
      speechText =
        language === 'pidgin'
          ? 'Hold on! This supplier is not on your approved whitelist. Please review before money moves.'
          : 'Attention: Recipient requires owner approval before disbursement.';
      playApprovalAlertSound();
    } else if (isOverLimit) {
      decision = 'APPROVAL_REQUIRED';
      message =
        language === 'pidgin'
          ? `Waybill amount (${formatDualCurrency(numAmount, exchangeRate)}) pass your $1,000 daily autonomous limit. Press approve make I pay.`
          : `Invoice amount ($${numAmount.toLocaleString()} USDC) exceeds OLOWO's $1,000 autonomous mandate limit. Human approval required.`;
      speechText =
        language === 'pidgin'
          ? `Hold on! This bill reaches ${numAmount} dollars. It exceeds your one thousand dollar limit. I need your approval.`
          : `Attention: Invoice of ${numAmount} dollars exceeds autonomous spending limit. Owner sign-off required.`;
      playApprovalAlertSound();
    } else {
      decision = 'ALLOW';
      txHash = `0x8f${Array.from({ length: 38 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      message =
        language === 'pidgin'
          ? `All 5 checks pass! Goods don land for shop, price correct. OLOWO don pay ${formatDualCurrency(numAmount, exchangeRate)} on Arc network.`
          : `All 5/5 policy checks passed. OLOWO autonomously executed $${numAmount.toLocaleString()} USDC settlement via Arc network.`;
      speechText =
        language === 'pidgin'
          ? `All checks passed! Goods arrived at the shop, price is verified, and I have sent ${numAmount} dollars on the Arc network.`
          : `Policy verified. Autonomously settled ${numAmount} dollars on the Arc network.`;
      playPaymentSuccessSound();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#00A878', '#2563EB', '#F59E0B'],
        });
      } catch (_) {}
    }

    setResultData({ decision, message, speechText, txHash });
    setStep('RESULT');

    // Automatically speak result in male voice for market convenience!
    speak(speechText);

    if (onInvoiceProcessed) onInvoiceProcessed();
  };

  const handleMarketPreset = (type: 'RICE' | 'LACE' | 'DRIVER' | 'DUPLICATE') => {
    switch (type) {
      case 'RICE':
        setVendorName('Alhaji Sani Grain Depot (Kano)');
        setAmount('650');
        setInvoiceNumber(`WB-RICE-${Math.floor(1000 + Math.random() * 9000)}`);
        setDescription('10 Bags Mama Gold Rice @ $65/bag (Shop #42)');
        setContractMilestone('10 Bags Delivered (Verified)');
        break;
      case 'LACE':
        setVendorName('Mama Chinedu Lace & Textiles (Balogun)');
        setAmount('4800');
        setInvoiceNumber(`INV-LACE-${Math.floor(1000 + Math.random() * 9000)}`);
        setDescription('5 Bales Hollandais Gold Lace (Direct Import)');
        setContractMilestone('Import Clearance Verified');
        break;
      case 'DRIVER':
        setVendorName('New Unapproved Cotonou Driver');
        setAmount('180');
        setInvoiceNumber(`DRV-${Math.floor(1000 + Math.random() * 9000)}`);
        setDescription('Interstate Haulage & Loading Fee (Cotonou - Lagos)');
        setContractMilestone('Unregistered Driver');
        break;
      case 'DUPLICATE':
        setVendorName('Alhaji Sani Grain Depot (Kano)');
        setAmount('8500');
        setInvoiceNumber(`WB-DUP-1043`);
        setDescription('200 Bags Rice Fleet (Breaches Reserve Floor)');
        setContractMilestone('Bulk Procurement');
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white dark:bg-[#0D192C] text-[#101828] dark:text-white border border-[#E2E8F0] dark:border-[#1A2D4C] rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center justify-between bg-[#F8FAFC] dark:bg-[#08111F]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#00A878]/10 text-[#00A878] dark:text-[#35E0B2]">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                {language === 'pidgin' ? 'Check & Pay Supplier Waybill' : 'Verify & Process Invoice'}
              </h3>
              <p className="text-[11px] text-[#64748B] dark:text-[#8896AB]">
                {language === 'pidgin'
                  ? 'OLOWO dey check paper waybill, confirm price, protect shop rent, and pay'
                  : 'Deterministic policy evaluation, delivery proof, and Arc USDC settlement'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#64748B] hover:text-[#101828] dark:text-[#8896AB] dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {step === 'IDLE' && (
            <>
              {/* Market Trade Waybill Presets */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#64748B] dark:text-[#8896AB] uppercase tracking-wider font-semibold">
                    MARKET TRADER WAYBILL PRESETS:
                  </span>
                  <span className="text-[10px] font-mono text-[#00A878] dark:text-[#35E0B2] bg-[#00A878]/10 px-2 py-0.5 rounded">
                    ₦1,500 / $1 USDC
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <button
                    type="button"
                    onClick={() => handleMarketPreset('RICE')}
                    className="p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] hover:border-[#00A878] text-left transition-colors group shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#00A878] dark:text-[#35E0B2]">10 Bags Rice</span>
                      <span className="text-[10px] font-mono text-[#00A878]">Auto-Pay</span>
                    </div>
                    <div className="text-[11px] font-semibold text-[#101828] dark:text-white mt-0.5">
                      Alhaji Sani ($650 / ~₦975k)
                    </div>
                    <div className="text-[10px] text-[#64748B] dark:text-[#8896AB]">Price verified, within $1k limit</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMarketPreset('LACE')}
                    className="p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] hover:border-[#D97706] text-left transition-colors group shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#D97706] dark:text-[#F5B942]">5 Bales Lace</span>
                      <span className="text-[10px] font-mono text-[#D97706]">Needs Approval</span>
                    </div>
                    <div className="text-[11px] font-semibold text-[#101828] dark:text-white mt-0.5">
                      Mama Chinedu ($4,800 / ~₦7.2M)
                    </div>
                    <div className="text-[10px] text-[#64748B] dark:text-[#8896AB]">Exceeds $1,000 autonomous mandate</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMarketPreset('DRIVER')}
                    className="p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] hover:border-[#D97706] text-left transition-colors group shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#D97706] dark:text-[#F5B942]">Cotonou Haulage</span>
                      <span className="text-[10px] font-mono text-[#D97706]">New Driver</span>
                    </div>
                    <div className="text-[11px] font-semibold text-[#101828] dark:text-white mt-0.5">
                      Driver Waybill ($180 / ~₦270k)
                    </div>
                    <div className="text-[10px] text-[#64748B] dark:text-[#8896AB]">Driver not yet whitelisted</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMarketPreset('DUPLICATE')}
                    className="p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] hover:border-[#DC2626] text-left transition-colors group shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#DC2626] dark:text-[#EF5B5B]">Bulk Order</span>
                      <span className="text-[10px] font-mono text-[#DC2626]">Blocked</span>
                    </div>
                    <div className="text-[11px] font-semibold text-[#101828] dark:text-white mt-0.5">
                      Alhaji Fleet ($8,500 / ~₦12.7M)
                    </div>
                    <div className="text-[10px] text-[#64748B] dark:text-[#8896AB]">Breaches $5k shop rent reserve</div>
                  </button>
                </div>
              </div>

              {/* Waybill Handwritten Snapshot Mockup */}
              <div className="p-3.5 rounded-xl bg-[#FBFBFA] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] font-mono text-xs space-y-1 text-[#334155] dark:text-white/90">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B] dark:text-[#8896AB] pb-1 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
                  <span>PAPER WAYBILL / WHATSAPP PREVIEW</span>
                  <span className="text-[#00A878] dark:text-[#35E0B2]">● OCR CAMERA READY</span>
                </div>
                <div className="text-xs pt-1">
                  <span className="font-bold text-[#101828] dark:text-white">{vendorName}</span>
                </div>
                <div className="text-[11px] text-[#64748B] dark:text-[#8896AB]">
                  Ref: {invoiceNumber} • Item: {description}
                </div>
                <div className="text-xs font-bold text-[#00A878] dark:text-[#35E0B2]">
                  {formatDualCurrency(parseFloat(amount) || 0, exchangeRate)}
                </div>
              </div>

              {/* Form Customization */}
              <div className="space-y-3 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B] dark:text-[#8896AB] block mb-1">
                      SUPPLIER / COUNTERPARTY
                    </label>
                    <input
                      type="text"
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] text-xs text-[#101828] dark:text-white focus:outline-none focus:border-[#00A878]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B] dark:text-[#8896AB] block mb-1">
                      AMOUNT (USDC)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-[#94A3B8]">$</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-7 pr-3 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] text-xs text-[#101828] dark:text-white focus:outline-none focus:border-[#00A878] font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E2E8F0] dark:border-[#1A2D4C]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#08111F] text-xs font-semibold text-[#64748B] dark:text-[#8896AB] hover:text-[#101828] dark:hover:text-white transition-all"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSimulate}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A878] hover:bg-[#009166] text-white text-xs font-semibold shadow-xs transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{language === 'pidgin' ? 'Scan & Evaluate Waybill' : 'Verify & Execute Payout'}</span>
                </button>
              </div>
            </>
          )}

          {step === 'PROCESSING' && (
            <div className="py-8 space-y-6 text-center">
              <OlowoMascot state="PROCESSING" size="lg" className="mx-auto" />
              <div className="space-y-1">
                <h4 className="text-base font-bold text-[#101828] dark:text-white">
                  {language === 'pidgin' ? 'OLOWO dey scan & verify waybill...' : 'Evaluating Deterministic Policy Engine...'}
                </h4>
                <p className="text-xs text-[#64748B] dark:text-[#8896AB]">
                  {language === 'pidgin'
                    ? 'Checking price per bag, delivery driver, and shop rent floor'
                    : 'Authenticating counterparty, milestone delivery, and reserve boundaries'}
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-2 text-left font-mono text-xs">
                {stages.map((stageText, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 p-2 rounded-lg transition-all ${
                      idx < currentVerificationIndex
                        ? 'text-[#00A878] dark:text-[#35E0B2] bg-[#00A878]/10'
                        : idx === currentVerificationIndex
                        ? 'text-[#101828] dark:text-white bg-[#F1F5F9] dark:bg-[#12223B] font-bold'
                        : 'text-[#94A3B8] dark:text-[#5E6E85]'
                    }`}
                  >
                    {idx < currentVerificationIndex ? (
                      <CheckCircle2 className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2] shrink-0" />
                    ) : idx === currentVerificationIndex ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#00A878] dark:text-[#35E0B2] shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-current shrink-0" />
                    )}
                    <span className="text-[11px]">{stageText}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'RESULT' && resultData && (
            <div className="py-4 space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
              <OlowoMascot
                state={
                  resultData.decision === 'ALLOW'
                    ? 'OPERATING'
                    : resultData.decision === 'BLOCK'
                    ? 'BLOCKED'
                    : 'ATTENTION'
                }
                size="lg"
                className="mx-auto"
              />

              <div className="space-y-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                    resultData.decision === 'ALLOW'
                      ? 'bg-[#00A878]/10 text-[#00A878] dark:text-[#35E0B2] border border-[#00A878]/30'
                      : resultData.decision === 'BLOCK'
                      ? 'bg-[#DC2626]/10 text-[#DC2626] dark:text-[#EF5B5B] border border-[#DC2626]/30'
                      : 'bg-[#D97706]/10 text-[#D97706] dark:text-[#F5B942] border border-[#D97706]/30'
                  }`}
                >
                  {resultData.decision === 'ALLOW'
                    ? language === 'pidgin' ? '✓ PAYMENT DONE GO ON ARC' : '✓ AUTONOMOUS PAYMENT EXECUTED'
                    : resultData.decision === 'BLOCK'
                    ? language === 'pidgin' ? '✕ PAYMENT BLOCKED BY POLICY' : '✕ PAYMENT BLOCKED BY MANDATE'
                    : language === 'pidgin' ? '⚠ APPROVAL REQUIRED' : '⚠ HUMAN APPROVAL REQUIRED'}
                </span>

                <p className="text-sm font-semibold text-[#101828] dark:text-white max-w-md mx-auto leading-relaxed">
                  {resultData.message}
                </p>
              </div>

              {/* Voice playback control */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C]">
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeaking) {
                      stopVoice();
                    } else {
                      speak(resultData.speechText);
                    }
                  }}
                  className="flex items-center gap-1.5 text-xs text-[#00A878] dark:text-[#35E0B2] font-semibold"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>{t.stopVoice}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>{language === 'pidgin' ? 'Listen again (Man Voice)' : 'Replay Audio (Male Voice)'}</span>
                    </>
                  )}
                </button>
              </div>

              {resultData.txHash && (
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] text-xs font-mono space-y-1">
                  <div className="text-[11px] text-[#64748B] dark:text-[#8896AB]">
                    Arc Settlement Transaction:
                  </div>
                  <div className="text-[#00A878] dark:text-[#35E0B2] font-bold">
                    {resultData.txHash}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep('IDLE');
                    setResultData(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#08111F] text-xs font-semibold text-[#64748B] dark:text-[#8896AB] hover:text-[#101828] dark:hover:text-white"
                >
                  {language === 'pidgin' ? 'Check another waybill' : 'Process Another Invoice'}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-[#00A878] hover:bg-[#009166] text-white text-xs font-semibold shadow-xs"
                >
                  {language === 'pidgin' ? 'Done / Close' : 'Done'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
