'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  CheckCheck,
  Send,
  Camera,
  Play,
  Volume2,
  VolumeX,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Sparkles,
  ArrowRight,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { useMarket } from '@/components/market/MarketContext';
import { playSound } from '@/lib/sound';

interface ChatMessage {
  id: string;
  sender: 'trader' | 'olowo';
  senderName: string;
  text: string;
  timestamp: string;
  attachment?: {
    type: 'waybill' | 'receipt';
    title: string;
    details: string;
    amount: string;
    status: 'VERIFIED' | 'FLAGGED' | 'BLOCKED';
  };
  audioClipKey?: string;
  arcTxHash?: string;
}

export function WhatsAppTraderSimulator() {
  const { language, speak, stopVoice, isSpeaking } = useMarket();
  const isPidgin = language === 'pidgin';

  const [activeScenario, setActiveScenario] = useState<'RICE_PAID' | 'DOUBLE_BILL' | 'HAULAGE_LIMIT'>('RICE_PAID');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState(false);

  // Scenarios data
  const scenarios: Record<'RICE_PAID' | 'DOUBLE_BILL' | 'HAULAGE_LIMIT', { name: string; messages: ChatMessage[] }> = {
    RICE_PAID: {
      name: isPidgin ? '🌾 Alhaji Sani 100 Bags Rice (Auto-Paid)' : '🌾 Alhaji Sani Kano Rice (Auto-Settled)',
      messages: [
        {
          id: 'm1',
          sender: 'trader' as const,
          senderName: 'Alhaji Sani Grain Depot (Kano)',
          text: isPidgin
            ? 'Salam Mama Ngozi! 100 bags of top-grade Kano parboiled rice don deliver to your shop for Balogun. Storekeeper don sign the delivery note. Kindly pay $480 USDC (~₦720,000).'
            : 'Salam Mama Ngozi. 100 bags of Kano parboiled rice have been delivered to store #42 in Balogun. Storekeeper confirmed receipt. Please settle $480 USDC.',
          timestamp: '10:14 AM',
          attachment: {
            type: 'waybill' as const,
            title: 'WAYBILL #WB-9042 · ALHAJI SANI',
            details: '100 Bags Parboiled Rice @ $4.80/bag · Storekeeper Signed',
            amount: '$480 USDC (~₦720,000)',
            status: 'VERIFIED' as const,
          },
        },
        {
          id: 'm2',
          sender: 'olowo' as const,
          senderName: 'OLOWO AI Finance Operator',
          text: isPidgin
            ? 'Alhaji Sani, OLOWO don verify your WhatsApp delivery note against Order PO-088. Price ($480) dey within $1,000 mandate. Settled sharp-sharp on Arc network! Paymaster sponsor the gas.'
            : 'Delivery note verified against Order PO-088. Billed amount ($480) is within the $1,000 autonomous mandate. Payment settled on Arc (<380ms) via Circle Paymaster with zero gas deduction.',
          timestamp: '10:14 AM',
          attachment: {
            type: 'receipt' as const,
            title: 'ARC SETTLEMENT RECEIPT #0x8f4d92...2a91',
            details: 'Circle Paymaster Sponsored ($0.00 gas) · Latency 340ms',
            amount: '$480.00 USDC PAID',
            status: 'VERIFIED' as const,
          },
          audioClipKey: 'rice_paid',
          arcTxHash: '0x8f4d92a1068832c324a108428d0234a91b342a91',
        },
      ],
    },
    DOUBLE_BILL: {
      name: isPidgin ? '🛑 Duplicate Invoice (Fraud Blocked)' : '🛑 Duplicate Invoice (Auto-Rejected)',
      messages: [
        {
          id: 'm1',
          sender: 'trader' as const,
          senderName: 'Supplier Dispatch Agent',
          text: isPidgin
            ? 'Hello Madam, abeg resend payment for Waybill #WB-9042 ($480 USDC) wey we deliver yesterday. Our accountant say e never see am.'
            : 'Hello Madam Ngozi, please resend the $480 USDC for Waybill #WB-9042 delivered yesterday. Our accounts department requested payment.',
          timestamp: '11:02 AM',
          attachment: {
            type: 'waybill' as const,
            title: 'WAYBILL #WB-9042 (RESUBMISSION)',
            details: 'Invoice identical to previously settled delivery #WB-9042',
            amount: '$480 USDC (~₦720,000)',
            status: 'FLAGGED' as const,
          },
        },
        {
          id: 'm2',
          sender: 'olowo' as const,
          senderName: 'OLOWO AI Finance Operator',
          text: isPidgin
            ? 'FRAUD ALERT BLOCKED! Waybill #WB-9042 was already paid yesterday via Arc Tx 0x8f4d92...2a91. Duplicate hash detected. Payment strictly rejected to save ₦720,000.'
            : 'DUPLICATE INVOICE BLOCKED: Cryptographic fingerprint matches invoice WB-9042 already settled yesterday. Payment automatically rejected under zero-tolerance double-billing policy.',
          timestamp: '11:02 AM',
          attachment: {
            type: 'receipt' as const,
            title: 'POLICY VIOLATION CAUGHT: DUPLICATE_CLAIM',
            details: 'Saved ₦720,000 ($480 USDC) · Logged in immutable audit trail',
            amount: 'PAYMENT REJECTED',
            status: 'BLOCKED' as const,
          },
          audioClipKey: 'double_bill_blocked',
        },
      ],
    },
    HAULAGE_LIMIT: {
      name: isPidgin ? '🚚 Cotonou Haulage (Limit Exceeded → Human Sign-off)' : '🚚 Cotonou Haulage (Authority Exceeded)',
      messages: [
        {
          id: 'm1',
          sender: 'trader' as const,
          senderName: 'Cotonou Heavy Haulage Logistics',
          text: isPidgin
            ? 'Madam Ngozi, 40-foot container from Cotonou port don reach Seme border. Border customs clearance & diesel haulage bill na $1,400 USDC (~₦2,100,000).'
            : 'Madam Ngozi, your 40ft container from Cotonou Port has arrived at the Seme Border post. Haulage & customs clearing fee is $1,400 USDC.',
          timestamp: '01:25 PM',
          attachment: {
            type: 'waybill' as const,
            title: 'BORDER CLEARING & HAULAGE #CT-8812',
            details: 'Cross-Border Transport Seme to Lagos · Genuine Waybill',
            amount: '$1,400 USDC (~₦2,100,000)',
            status: 'FLAGGED' as const,
          },
        },
        {
          id: 'm2',
          sender: 'olowo' as const,
          senderName: 'OLOWO AI Finance Operator',
          text: isPidgin
            ? 'Transport bill is verified & genuine, BUT $1,400 exceeds your $1,000 autonomous mandate limit. Payout halted! Push notification sent to Madam phone for signature approval.'
            : 'Bill verified against customs transit manifest, but $1,400 exceeds the $1,000 daily autonomous mandate limit. Automatic settlement paused. Escalated to human owner for authorization.',
          timestamp: '01:25 PM',
          attachment: {
            type: 'receipt' as const,
            title: 'ESCALATION REQUIRED: MANDATE_THRESHOLD_EXCEEDED',
            details: '$1,400 > $1,000 Autonomous Limit · Awaiting Owner Signature',
            amount: 'APPROVAL PENDING',
            status: 'FLAGGED' as const,
          },
          audioClipKey: 'haulage_exceeded',
        },
      ],
    },
  };

  const activeMessages = scenarios[activeScenario].messages;

  const handlePlayVoice = (clipKey?: string, text?: string) => {
    if (isSpeaking) {
      stopVoice();
      return;
    }
    if (text) {
      speak(text, clipKey);
    }
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#0D192C] shadow-xl overflow-hidden flex flex-col transition-colors">
      {/* Header */}
      <div className="px-5 py-4 bg-[#075E54] dark:bg-[#054C44] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base tracking-tight">
                WhatsApp Commerce &amp; Waybill Simulator
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/20 font-bold">
                AFRICA TRADE
              </span>
            </div>
            <p className="text-xs text-white/80">
              How African market women &amp; suppliers interact with OLOWO AI directly on WhatsApp.
            </p>
          </div>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['RICE_PAID', 'DOUBLE_BILL', 'HAULAGE_LIMIT'] as const).map((scKey) => (
            <button
              key={scKey}
              onClick={() => {
                playSound('toggle');
                stopVoice();
                setActiveScenario(scKey);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeScenario === scKey
                  ? 'bg-white text-[#075E54] shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {scKey === 'RICE_PAID'
                ? '🌾 Auto-Payment'
                : scKey === 'DOUBLE_BILL'
                ? '🛑 Duplicate Block'
                : '🚚 Limit Exceeded'}
            </button>
          ))}
        </div>
      </div>

      {/* WhatsApp Message Canvas */}
      <div className="p-4 sm:p-6 bg-[#E5DDD5]/50 dark:bg-[#08111F]/90 space-y-4 min-h-[380px] flex flex-col justify-between">
        <div className="space-y-4">
          {activeMessages.map((msg, idx) => (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[90%] sm:max-w-[78%] ${
                msg.sender === 'olowo' ? 'ml-auto items-end' : 'mr-auto items-start'
              }`}
            >
              <div
                className={`p-3.5 sm:p-4 rounded-2xl shadow-sm text-xs sm:text-sm space-y-2.5 ${
                  msg.sender === 'olowo'
                    ? 'bg-[#DCF8C6] dark:bg-[#005C4B] text-[#101828] dark:text-white rounded-tr-none'
                    : 'bg-white dark:bg-[#1E293B] text-[#101828] dark:text-white rounded-tl-none border border-[#E2E8F0] dark:border-[#334155]'
                }`}
              >
                {/* Sender Tag */}
                <div className="flex items-center justify-between gap-2 border-b pb-1.5 border-black/10 dark:border-white/10">
                  <span className="font-bold text-[11px] text-[#075E54] dark:text-[#35E0B2]">
                    {msg.senderName}
                  </span>
                  <span className="text-[10px] text-[#64748B] dark:text-white/60">
                    {msg.timestamp}
                  </span>
                </div>

                {/* Message Body */}
                <p className="leading-relaxed">{msg.text}</p>

                {/* Attached Waybill or Arc Settlement Receipt */}
                {msg.attachment && (
                  <div className="p-2.5 rounded-xl bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 space-y-1 font-mono text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#101828] dark:text-white">
                        {msg.attachment.title}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          msg.attachment.status === 'VERIFIED'
                            ? 'bg-[#00A878]/20 text-[#00A878] dark:text-[#35E0B2]'
                            : msg.attachment.status === 'BLOCKED'
                            ? 'bg-[#DC2626]/20 text-[#DC2626] dark:text-[#FF5C5C]'
                            : 'bg-[#D97706]/20 text-[#D97706] dark:text-[#F5B942]'
                        }`}
                      >
                        {msg.attachment.status}
                      </span>
                    </div>
                    <div className="text-[#64748B] dark:text-white/70">{msg.attachment.details}</div>
                    <div className="font-bold text-[#101828] dark:text-white pt-1">
                      {msg.attachment.amount}
                    </div>
                  </div>
                )}

                {/* Voice Audio & Arc Transaction Actions */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  {msg.audioClipKey && (
                    <button
                      onClick={() => handlePlayVoice(msg.audioClipKey, msg.text)}
                      className="px-2 py-1 rounded bg-[#075E54]/10 dark:bg-white/15 text-[#075E54] dark:text-[#35E0B2] text-[11px] font-semibold flex items-center gap-1 hover:bg-[#075E54]/20 transition-all"
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isSpeaking ? 'Mute' : 'Play Voice Note'}</span>
                    </button>
                  )}

                  {msg.arcTxHash && (
                    <a
                      href={`https://explorer.arc.network/tx/${msg.arcTxHash}`}
                      target="_blank"
                      rel="noopener"
                      className="text-[10px] font-mono text-[#075E54] dark:text-[#35E0B2] hover:underline flex items-center gap-0.5 ml-auto"
                    >
                      <span>Arc Tx Hash</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <span className="flex items-center gap-0.5 text-[#34B7F1] ml-auto">
                    <CheckCheck className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp Input Mock Bar */}
        <div className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2 text-[#64748B] dark:text-white/60 text-xs px-2 flex-1">
            <Camera className="w-4 h-4 text-[#075E54] dark:text-[#35E0B2]" />
            <span className="truncate italic">
              {isPidgin
                ? 'Type invoice, paste receipt photo, or send voice note...'
                : 'Send message, upload paper waybill photo, or record voice note...'}
            </span>
          </div>

          <button
            onClick={() => {
              playSound('click');
              const lastMsg = activeMessages[activeMessages.length - 1];
              if (lastMsg && lastMsg.audioClipKey) {
                handlePlayVoice(lastMsg.audioClipKey, lastMsg.text);
              }
            }}
            className="w-8 h-8 rounded-full bg-[#075E54] hover:bg-[#064e46] text-white flex items-center justify-center shrink-0 shadow-sm"
            title="Play Audio"
          >
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
