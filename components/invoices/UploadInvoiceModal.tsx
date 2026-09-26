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
} from 'lucide-react';
import { OlowoMascot } from '@/components/mascot/OlowoMascot';
import { playPaymentSuccessSound, playApprovalAlertSound, playBlockedSound } from '@/lib/sound';
import confetti from 'canvas-confetti';

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
  const [vendorName, setVendorName] = useState('ABC Design');
  const [amount, setAmount] = useState('650');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
  const [description, setDescription] = useState('SaaS Component Optimization Deliverable');
  const [contractMilestone, setContractMilestone] = useState('Milestone 4');

  const [step, setStep] = useState<'IDLE' | 'PROCESSING' | 'RESULT'>('IDLE');
  const [currentVerificationIndex, setCurrentVerificationIndex] = useState(0);
  const [resultData, setResultData] = useState<{
    decision: 'ALLOW' | 'APPROVAL_REQUIRED' | 'BLOCK';
    message: string;
    txHash?: string;
  } | null>(null);

  if (!isOpen) return null;

  const verificationStages = [
    'Parsing invoice metadata & cryptographic counterparty signature...',
    'Checking vendor whitelist directory & risk clearance...',
    'Matching contract CT-024 and milestone deliverables...',
    'Evaluating deterministic mandate policies & $5,000 reserve floor...',
    'Finalizing settlement authorization...',
  ];

  const handleSimulate = async () => {
    setStep('PROCESSING');
    setCurrentVerificationIndex(0);

    // Simulate multi-stage visual operator verification
    for (let i = 0; i < verificationStages.length; i++) {
      setCurrentVerificationIndex(i);
      await new Promise((r) => setTimeout(r, 600));
    }

    // Determine deterministic result
    const numAmount = parseFloat(amount) || 0;
    const isUnapproved = vendorName === 'New Unknown Vendor';
    const isOverLimit = numAmount > 1000;

    let decision: 'ALLOW' | 'APPROVAL_REQUIRED' | 'BLOCK' = 'ALLOW';
    let message = '';
    let txHash: string | undefined = undefined;

    if (numAmount > 12400 - 5000) {
      decision = 'BLOCK';
      message = 'Payment blocked because it would breach your $5,000 protected operating reserve floor.';
      playBlockedSound();
    } else if (isUnapproved) {
      decision = 'APPROVAL_REQUIRED';
      message = 'Payment requires approval because this recipient is not an approved vendor in company records.';
      playApprovalAlertSound();
    } else if (isOverLimit) {
      decision = 'APPROVAL_REQUIRED';
      message = `Invoice amount ($${numAmount.toLocaleString()} USDC) exceeds OLOWO's $1,000 autonomous mandate limit. Human approval required.`;
      playApprovalAlertSound();
    } else {
      decision = 'ALLOW';
      txHash = `0x8f${Array.from({ length: 38 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      message = `All 5/5 policy checks passed. OLOWO autonomously executed $${numAmount.toLocaleString()} USDC settlement via Arc network.`;
      playPaymentSuccessSound();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#35E0B2', '#4D7CFE', '#00C08B'],
        });
      } catch (_) {}
    }

    setResultData({ decision, message, txHash });
    setStep('RESULT');
    if (onInvoiceProcessed) onInvoiceProcessed();
  };

  const handlePreset = (preset: 'AUTO_PAY' | 'APPROVAL' | 'UNAPPROVED' | 'BLOCK') => {
    switch (preset) {
      case 'AUTO_PAY':
        setVendorName('ABC Design');
        setAmount('650');
        setDescription('Sprint 8 UI System Improvements');
        break;
      case 'APPROVAL':
        setVendorName('ABC Design');
        setAmount('3200');
        setDescription('Brand Design System & Production Assets');
        break;
      case 'UNAPPROVED':
        setVendorName('New Unknown Vendor');
        setAmount('480');
        setDescription('External Security Consulting');
        break;
      case 'BLOCK':
        setVendorName('ABC Design');
        setAmount('8500');
        setDescription('Full Platform Re-architecture');
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white dark:bg-[#0D192C] text-[#101828] dark:text-white border border-[#E2E8F0] dark:border-[#1A2D4C] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center justify-between bg-[#F8FAFC] dark:bg-[#08111F]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#35E0B2]/10 dark:bg-[#35E0B2]/20 text-[#00A878] dark:text-[#35E0B2]">
              <FileUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Process New Invoice</h3>
              <p className="text-[11px] text-[#64748B] dark:text-[#8896AB]">
                Watch OLOWO verify counterparty, evaluate policy, and settle
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
              {/* Presets */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-[#64748B] dark:text-[#8896AB] uppercase tracking-wider block">
                  FAST SCENARIO PRESETS:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    onClick={() => handlePreset('AUTO_PAY')}
                    className="p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] hover:border-[#00A878] text-left transition-colors"
                  >
                    <span className="font-semibold block text-[#00A878] dark:text-[#35E0B2]">$650 Auto-Pay</span>
                    <span className="text-[10px] text-[#64748B] dark:text-[#8896AB]">Within $1k limit</span>
                  </button>

                  <button
                    onClick={() => handlePreset('APPROVAL')}
                    className="p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] hover:border-[#D97706] text-left transition-colors"
                  >
                    <span className="font-semibold block text-[#D97706] dark:text-[#F5B942]">$3,200 Approval</span>
                    <span className="text-[10px] text-[#64748B] dark:text-[#8896AB]">Exceeds authority</span>
                  </button>

                  <button
                    onClick={() => handlePreset('UNAPPROVED')}
                    className="p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] hover:border-[#D97706] text-left transition-colors"
                  >
                    <span className="font-semibold block text-[#D97706] dark:text-[#F5B942]">New Vendor</span>
                    <span className="text-[10px] text-[#64748B] dark:text-[#8896AB]">Requires whitelist</span>
                  </button>

                  <button
                    onClick={() => handlePreset('BLOCK')}
                    className="p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] hover:border-[#DC2626] text-left transition-colors"
                  >
                    <span className="font-semibold block text-[#DC2626] dark:text-[#EF5B5B]">$8,500 Reserve</span>
                    <span className="text-[10px] text-[#64748B] dark:text-[#8896AB]">Breaches $5k floor</span>
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B] dark:text-[#8896AB] block mb-1">
                      VENDOR / RECIPIENT
                    </label>
                    <select
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] text-xs font-semibold focus:outline-none focus:border-[#00A878]"
                    >
                      <option value="ABC Design">ABC Design (Approved Contractor)</option>
                      <option value="AWS">AWS (Approved Cloud)</option>
                      <option value="Vercel">Vercel (Approved SaaS)</option>
                      <option value="New Unknown Vendor">New Unknown Vendor (Unapproved)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B] dark:text-[#8896AB] block mb-1">
                      AMOUNT (USDC)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] font-mono text-xs font-bold text-[#101828] dark:text-white focus:outline-none focus:border-[#00A878]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#64748B] dark:text-[#8896AB] block mb-1">
                    DELIVERABLE / DESCRIPTION
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] text-xs focus:outline-none focus:border-[#00A878]"
                  />
                </div>
              </div>
            </>
          )}

          {step === 'PROCESSING' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
              <OlowoMascot state="PROCESSING" size="lg" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#101828] dark:text-white">
                  OLOWO Autonomous Operator Ingesting Invoice
                </h4>
                <p className="text-xs text-[#00A878] dark:text-[#35E0B2] font-mono animate-pulse">
                  {verificationStages[currentVerificationIndex]}
                </p>
              </div>
            </div>
          )}

          {step === 'RESULT' && resultData && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl border flex items-start gap-3 bg-[#F8FAFC] dark:bg-[#08111F] border-[#E2E8F0] dark:border-[#1A2D4C]">
                <OlowoMascot
                  state={
                    resultData.decision === 'ALLOW'
                      ? 'OPERATING'
                      : resultData.decision === 'APPROVAL_REQUIRED'
                      ? 'ATTENTION'
                      : 'BLOCKED'
                  }
                  size="md"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">
                      {resultData.decision === 'ALLOW'
                        ? 'AUTONOMOUS PAYMENT SETTLED'
                        : resultData.decision === 'APPROVAL_REQUIRED'
                        ? 'HUMAN APPROVAL REQUIRED'
                        : 'PAYMENT BLOCKED BY POLICY'}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] dark:text-[#8896AB] leading-relaxed">
                    {resultData.message}
                  </p>
                  {resultData.txHash && (
                    <div className="text-[11px] font-mono text-[#00A878] dark:text-[#35E0B2] pt-1">
                      Arc Settlement Tx: {resultData.txHash.substring(0, 16)}...
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] dark:border-[#1A2D4C] bg-[#F8FAFC] dark:bg-[#08111F] flex items-center justify-between">
          {step === 'IDLE' ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-[#64748B] hover:text-[#101828] dark:text-[#8896AB] dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulate}
                className="px-5 py-2 rounded-xl bg-[#00A878] hover:bg-[#008f66] dark:bg-[#35E0B2] dark:hover:bg-[#3ff0c0] text-white dark:text-[#08111F] font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Submit to OLOWO</span>
              </button>
            </>
          ) : step === 'PROCESSING' ? (
            <div className="text-xs font-mono text-[#64748B] dark:text-[#8896AB] mx-auto flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00A878]" />
              <span>Evaluating live deterministic policies...</span>
            </div>
          ) : (
            <button
              onClick={() => {
                setStep('IDLE');
                onClose();
              }}
              className="w-full py-2 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] dark:bg-[#35E0B2] dark:hover:bg-[#3ff0c0] text-white dark:text-[#08111F] font-bold text-xs shadow-md transition-all"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
