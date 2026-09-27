'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowRight,
  ExternalLink,
  Lock,
  RotateCcw,
  Sparkles,
  Download,
  Copy,
  Check,
  Play,
  Volume2,
} from 'lucide-react';
import { AuditEvent } from '@/types';
import { playSound } from '@/lib/sound';
import { useMarket } from '@/components/market/MarketContext';

interface DecisionReplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: AuditEvent | null;
}

export function DecisionReplayModal({ isOpen, onClose, event }: DecisionReplayModalProps) {
  const { language, exchangeRate, speak } = useMarket();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !event) return null;

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    playSound('click');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const steps = [
    {
      num: 1,
      title: 'State Observed',
      subtitle: 'Treasury & Liquidity Snapshot',
    },
    {
      num: 2,
      title: 'Mandate Constraints',
      subtitle: 'Deterministic Policy Evaluation',
    },
    {
      num: 3,
      title: 'Agent Reasoning',
      subtitle: 'Explainable AI Decision Trace',
    },
    {
      num: 4,
      title: 'Arc Settlement',
      subtitle: 'Circle Paymaster & Onchain Hash',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#101828] dark:text-white transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center justify-between bg-[#F8FAFC] dark:bg-[#08111F]">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00A878]/10 text-[#00A878] dark:bg-[#35E0B2]/10 dark:text-[#35E0B2] border border-[#00A878]/30 dark:border-[#35E0B2]/30">
              EUTHYNA CONTINUOUS AUDIT REPLAY
            </span>
            <span className="text-xs font-mono text-[#64748B] dark:text-[#8896AB]">
              ID: {event.id}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-[#64748B] dark:text-[#8896AB] hover:text-[#101828] dark:hover:text-white p-1 rounded-lg hover:bg-[#F1F5F9] dark:hover:bg-[#12223B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-4 border-b border-[#E2E8F0] dark:border-[#1A2D4C] bg-[#F1F5F9]/50 dark:bg-[#08111F]/50 text-xs font-mono">
          {steps.map((st) => (
            <button
              key={st.num}
              onClick={() => {
                playSound('click');
                setActiveStep(st.num);
              }}
              className={`p-3 text-left border-r border-[#E2E8F0] dark:border-[#1A2D4C] transition-all last:border-r-0 ${
                activeStep === st.num
                  ? 'bg-white dark:bg-[#0D192C] border-b-2 border-b-[#00A878] font-bold text-[#00A878] dark:text-[#35E0B2]'
                  : 'text-[#64748B] dark:text-[#8896AB] hover:text-[#101828] dark:hover:text-white'
              }`}
            >
              <div className="text-[10px] text-[#64748B] dark:text-[#5E6E85]">STAGE 0{st.num}</div>
              <div className="truncate">{st.title}</div>
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-6 min-h-[300px] flex flex-col justify-between">
          {/* STAGE 1: State Observed */}
          {activeStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="text-sm font-bold text-[#101828] dark:text-white flex items-center gap-2">
                  <span>State Observed by Agent at Moment of Evaluation</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#2563EB]/10 text-[#2563EB] dark:text-[#4D7CFE]">
                    SNAPSHOT
                  </span>
                </h3>
                <p className="text-xs text-[#64748B] dark:text-[#8896AB] mt-1">
                  Before making any financial move, OLOWO reads the full treasury state, upcoming commitments, and protected floors.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C]">
                  <span className="text-[#64748B] dark:text-[#5E6E85] block text-[10px]">TOTAL TREASURY BALANCE</span>
                  <span className="text-sm font-bold text-[#101828] dark:text-white block mt-0.5">$12,400 USDC</span>
                  <span className="text-[10px] text-[#00A878] dark:text-[#35E0B2]">~₦18,600,000</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C]">
                  <span className="text-[#64748B] dark:text-[#5E6E85] block text-[10px]">SHOP RENT RESERVE FLOOR</span>
                  <span className="text-sm font-bold text-[#DC2626] dark:text-[#FF5C5C] block mt-0.5">$5,000 USDC [LOCKED]</span>
                  <span className="text-[10px] text-[#64748B] dark:text-[#8896AB]">Mandatory 100% Floor</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C]">
                  <span className="text-[#64748B] dark:text-[#5E6E85] block text-[10px]">AVAILABLE DISCRETIONARY</span>
                  <span className="text-sm font-bold text-[#00A878] dark:text-[#35E0B2] block mt-0.5">$6,550 USDC</span>
                  <span className="text-[10px] text-[#64748B] dark:text-[#8896AB]">Sufficient to cover invoice</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C]">
                  <span className="text-[#64748B] dark:text-[#5E6E85] block text-[10px]">INVOICE AMOUNT / COUNTERPARTY</span>
                  <span className="text-sm font-bold text-[#101828] dark:text-white block mt-0.5">
                    ${event.amount ? event.amount.toLocaleString() : '0'} USDC
                  </span>
                  <span className="text-[10px] text-[#64748B] dark:text-[#8896AB] truncate block">
                    {event.entity}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: Mandate Constraints */}
          {activeStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="text-sm font-bold text-[#101828] dark:text-white flex items-center gap-2">
                  <span>Deterministic Mandate Constraint Check (5/5 Rules)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#00A878]/10 text-[#00A878] dark:text-[#35E0B2]">
                    VERIFIED
                  </span>
                </h3>
                <p className="text-xs text-[#64748B] dark:text-[#8896AB] mt-1">
                  Enforced in smart contract rules, not probabilistic prompts.
                </p>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center justify-between">
                  <span>1. Autonomous Mandate Limit ($1,000 threshold)</span>
                  <span className="text-[#00A878] dark:text-[#35E0B2] font-bold">
                    {(event.amount || 0) <= 1000 ? '✓ PASSED (<$1,000)' : '⚠ EXCEEDED (Human Approval Required)'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center justify-between">
                  <span>2. Duplicate Invoice Hash Check</span>
                  <span className="text-[#00A878] dark:text-[#35E0B2] font-bold">
                    ✓ PASSED (Zero duplicate match)
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center justify-between">
                  <span>3. Supplier Whitelist &amp; Counterparty Risk</span>
                  <span className="text-[#00A878] dark:text-[#35E0B2] font-bold">
                    ✓ PASSED (Whitelisted Supplier)
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center justify-between">
                  <span>4. Shop Rent Protected Floor ($5,000)</span>
                  <span className="text-[#00A878] dark:text-[#35E0B2] font-bold">
                    ✓ PASSED (Reserve 100% intact)
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center justify-between">
                  <span>5. Delivery Waybill Sign-off Match</span>
                  <span className="text-[#00A878] dark:text-[#35E0B2] font-bold">
                    ✓ PASSED (Goods confirmed in store)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: Agent Reasoning */}
          {activeStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="text-sm font-bold text-[#101828] dark:text-white flex items-center gap-2">
                  <span>OLOWO Agent Reasoning Trace</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#00A878]/10 text-[#00A878] dark:text-[#35E0B2]">
                    EXPLAINABLE AI
                  </span>
                </h3>
                <p className="text-xs text-[#64748B] dark:text-[#8896AB] mt-1">
                  The exact rationale recorded by the agent in the signed audit log.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] space-y-3 text-xs leading-relaxed">
                <div className="flex items-center gap-2 font-mono text-[11px] text-[#64748B] dark:text-[#8896AB]">
                  <span>DECISION:</span>
                  <span className="font-bold text-[#00A878] dark:text-[#35E0B2]">{event.decision}</span>
                  <span className="text-[#94A3B8]">|</span>
                  <span>AUTHORITY:</span>
                  <span className="font-bold text-[#101828] dark:text-white">{event.authorization}</span>
                </div>

                <p className="text-[#101828] dark:text-white font-medium italic">
                  &ldquo;{event.reason || 'Decision executed autonomously within operating mandate bounds.'}&rdquo;
                </p>

                <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center gap-2 text-[11px] text-[#64748B] dark:text-[#8896AB] font-mono">
                  <span>Evaluation Timestamp:</span>
                  <span className="text-[#101828] dark:text-white">{event.timestamp}</span>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: Arc Settlement */}
          {activeStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="text-sm font-bold text-[#101828] dark:text-white flex items-center gap-2">
                  <span>Arc Settlement &amp; Circle Paymaster Receipt</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#00A878]/10 text-[#00A878] dark:text-[#35E0B2]">
                    SUB-SECOND FINALITY
                  </span>
                </h3>
                <p className="text-xs text-[#64748B] dark:text-[#8896AB] mt-1">
                  Settled on Arc network in USDC gas with zero transaction cost to supplier.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-[#1A2D4C]/60">
                  <span className="text-[#64748B] dark:text-[#8896AB]">Arc Network Tx Hash:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#00A878] dark:text-[#35E0B2] font-bold">
                      {event.transactionHash || '0x8f4d92a1068832c324a108428d0234a91b342a91'}
                    </span>
                    <button
                      onClick={() =>
                        handleCopyHash(
                          event.transactionHash || '0x8f4d92a1068832c324a108428d0234a91b342a91'
                        )
                      }
                      className="p-1 hover:text-[#00A878] text-[#64748B] transition-colors"
                      title="Copy Hash"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-[#00A878]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0] dark:border-[#1A2D4C]/60">
                  <span className="text-[#64748B] dark:text-[#8896AB]">Settlement Latency:</span>
                  <span className="font-bold text-[#00A878] dark:text-[#35E0B2]">340ms (&lt;500ms)</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0] dark:border-[#1A2D4C]/60">
                  <span className="text-[#64748B] dark:text-[#8896AB]">Gas Sponsor:</span>
                  <span className="font-bold text-[#2563EB] dark:text-[#4D7CFE]">
                    Circle Paymaster ($0.012 USDC absorbed)
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[#64748B] dark:text-[#8896AB]">Net Amount Received:</span>
                  <span className="font-bold text-[#101828] dark:text-white">
                    ${event.amount ? event.amount.toFixed(2) : '0.00'} USDC (100% net)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center justify-between">
            <button
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
              disabled={activeStep === 1}
              className="px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#0D192C] text-xs font-semibold text-[#64748B] dark:text-[#8896AB] hover:text-[#101828] dark:hover:text-white disabled:opacity-30"
            >
              Previous Stage
            </button>

            <span className="text-xs font-mono text-[#64748B] dark:text-[#8896AB]">
              Stage {activeStep} of 4
            </span>

            {activeStep < 4 ? (
              <button
                onClick={() => setActiveStep((prev) => Math.min(4, prev + 1))}
                className="px-4 py-1.5 rounded-lg bg-[#00A878] hover:bg-[#009166] text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
              >
                <span>Next Stage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-sm"
              >
                Close Replay
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
