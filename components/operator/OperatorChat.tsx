'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  ExternalLink,
  Loader2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { OlowoMascot } from '@/components/mascot/OlowoMascot';
import { OperatorChatMessage, MascotState } from '@/types';
import { playClickSound, playPaymentSuccessSound } from '@/lib/sound';
import { useMarket } from '@/components/market/MarketContext';

interface OperatorChatProps {
  mascotState?: MascotState;
}

export function OperatorChat({ mascotState = 'OPERATING' }: OperatorChatProps) {
  const { language, t, isSpeaking, speak, stopVoice } = useMarket();

  const initialWelcomeText =
    language === 'pidgin'
      ? 'Good afternoon Madam/Oga! I be OLOWO, your autonomous financial operator. I dey monitor your money 24/7: invoices dey verified, suppliers dey checked, and your $5,000 shop rent reserve dey locked sharp-sharp. Wetyn you wan make I check for you?'
      : 'Good afternoon. I am OLOWO, your autonomous financial operator. I continuously monitor financial activity: invoices are verified, counterparties are screened, and your $5,000 reserve floor is protected. How can I assist you?';

  const [messages, setMessages] = useState<OperatorChatMessage[]>([
    {
      id: 'm_welcome',
      sender: 'olowo',
      text: initialWelcomeText,
      timestamp: 'Just now',
      toolsUsed: ['getTreasury()', 'getPolicies()'],
      verifiedFacts: [
        'Total Treasury: $12,400 USDC (~₦18,600,000)',
        'Shop Rent & Operating Reserve: $5,000 USDC (~₦7,500,000) [LOCKED]',
        'Autonomous Payment Limit: $1,000 USDC (~₦1,500,000)',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions =
    language === 'pidgin'
      ? [
          'Why you pay Alhaji for rice?',
          'How much money I fit spend today?',
          'Which bills dey due this week?',
          'Why you block that double receipt?',
          'Wetyn go happen if I approve Mama Chinedu lace?',
        ]
      : [
          'Why did you pay ABC Design?',
          'What payments are due this week?',
          'How much can I safely spend?',
          'Why was invoice #1043 blocked?',
          'What happens if I approve this payment?',
        ];

  async function handleSend(queryText: string) {
    const q = queryText.trim();
    if (!q || isLoading) return;

    playClickSound();

    const userMsg: OperatorChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/operator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, language }),
      });
      const data = await res.json();

      const olowoMsg: OperatorChatMessage = {
        id: `o_${Date.now()}`,
        sender: 'olowo',
        text: data.answer || (language === 'pidgin' ? 'I don evaluate your request against your company rules.' : 'I evaluated your request against current business policies and state.'),
        timestamp: 'Just now',
        toolsUsed: data.toolsUsed,
        verifiedFacts: data.verifiedFacts,
        relatedActionUrl: data.actionLink?.url,
      };

      setMessages((prev) => [...prev, olowoMsg]);
      playPaymentSuccessSound();
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'olowo',
          text: language === 'pidgin' ? 'Network get small delay, abeg try again.' : 'Encountered an issue querying system state. Please check connectivity.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] flex flex-col h-[650px] overflow-hidden shadow-xs transition-colors">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center justify-between bg-white dark:bg-[#08111F]">
        <div className="flex items-center gap-3">
          <OlowoMascot state={mascotState} size="sm" />
          <div>
            <h3 className="text-sm font-bold text-[#101828] dark:text-white tracking-tight flex items-center gap-2">
              OLOWO Intelligent Operator
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00A878]/10 text-[#00A878] dark:bg-[#35E0B2]/10 dark:text-[#35E0B2] border border-[#00A878]/30 dark:border-[#35E0B2]/30 font-semibold">
                {language === 'pidgin' ? 'PIDGIN VOICE ACTIVE' : 'SIMPLE ENGLISH'}
              </span>
            </h3>
            <p className="text-[11px] text-[#64748B] dark:text-[#8896AB]">
              {language === 'pidgin'
                ? 'Answers grounded directly for your real shop money, bills, and mandate'
                : 'Answers synthesized directly from verified database records and mandate rules'}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#94A3B8] dark:text-[#5E6E85]">
          <Terminal className="w-3.5 h-3.5" />
          <span>TOOL-CALLING ACTIVE</span>
        </div>
      </div>

      {/* Suggested Questions Pills */}
      <div className="px-6 py-3 border-b border-[#E2E8F0] dark:border-[#1A2D4C]/60 bg-[#F8FAFC] dark:bg-[#0A1424] flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-mono text-[#94A3B8] dark:text-[#5E6E85] shrink-0 font-semibold">
          {language === 'pidgin' ? 'ASK ME:' : 'SUGGESTED:'}
        </span>
        {suggestedQuestions.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSend(sq)}
            className="text-[11px] px-3 py-1 rounded-full bg-white dark:bg-[#12223B] hover:bg-[#F1F5F9] dark:hover:bg-[#1A2D4C] text-[#344054] dark:text-[#8896AB] hover:text-[#101828] dark:hover:text-white border border-[#E2E8F0] dark:border-[#1A2D4C] transition-colors shrink-0 shadow-2xs font-medium"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'olowo' && (
              <OlowoMascot state={mascotState} size="sm" className="shrink-0 mt-1" />
            )}

            <div
              className={`max-w-xl rounded-2xl p-4 space-y-3 shadow-2xs ${
                m.sender === 'user'
                  ? 'bg-[#F1F5F9] dark:bg-[#12223B] text-[#101828] dark:text-white border border-[#E2E8F0] dark:border-[#1A2D4C]'
                  : 'bg-[#F8FAFC] dark:bg-[#08111F] text-[#101828] dark:text-white border border-[#E2E8F0] dark:border-[#1A2D4C]/80'
              }`}
            >
              <div className="text-xs leading-relaxed whitespace-pre-line text-[#101828] dark:text-white/95">
                {m.text}
              </div>

              {/* Verified Facts snapshot */}
              {m.verifiedFacts && m.verifiedFacts.length > 0 && (
                <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#1A2D4C] space-y-1">
                  <span className="text-[10px] font-mono font-bold text-[#94A3B8] dark:text-[#5E6E85] uppercase tracking-wider block">
                    VERIFIED SYSTEM FACTS:
                  </span>
                  <div className="space-y-1">
                    {m.verifiedFacts.map((fact, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[#475467] dark:text-[#8896AB]">
                        <CheckCircle2 className="w-3 h-3 text-[#00A878] dark:text-[#35E0B2] shrink-0 mt-0.5" />
                        <span>{fact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tools & Audio controls for Olowo messages */}
              {m.sender === 'olowo' && (
                <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] dark:border-[#1A2D4C]/60 text-[10px] text-[#94A3B8] dark:text-[#5E6E85]">
                  <div className="flex items-center gap-1.5">
                    {m.toolsUsed?.map((tName, i) => (
                      <span key={i} className="font-mono bg-white dark:bg-[#12223B] px-1.5 py-0.5 rounded border border-[#E2E8F0] dark:border-[#1A2D4C]">
                        {tName}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Speaker Readout Button */}
                    <button
                      onClick={() => {
                        playClickSound();
                        if (isSpeaking) {
                          stopVoice();
                        } else {
                          speak(m.text);
                        }
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#12223B] border border-[#E2E8F0] dark:border-[#1A2D4C] text-[10px] font-semibold text-[#00A878] dark:text-[#35E0B2] hover:bg-[#F1F5F9] dark:hover:bg-[#1A2D4C] transition-colors"
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3 h-3" />
                          <span>Stop Voice</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3" />
                          <span>Listen (Man Voice)</span>
                        </>
                      )}
                    </button>

                    {m.relatedActionUrl && (
                      <Link
                        href={m.relatedActionUrl}
                        className="inline-flex items-center gap-1 text-[#2563EB] dark:text-[#4D7CFE] hover:underline font-semibold"
                      >
                        <span>Action</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-xs text-[#64748B] dark:text-[#8896AB] pl-2 font-mono">
            <Loader2 className="w-4 h-4 animate-spin text-[#00A878] dark:text-[#35E0B2]" />
            <span>{language === 'pidgin' ? 'OLOWO dey calculate your mandate & blockchain state...' : 'Evaluating mandate rules & querying state...'}</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-4 border-t border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#08111F] flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={language === 'pidgin' ? 'Ask OLOWO anything (e.g., "Why you pay Alhaji for rice?", "How much I fit spend?")...' : 'Ask OLOWO about payments, mandate rules, runway, or decisions...'}
          className="flex-1 px-4 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] text-xs text-[#101828] dark:text-white placeholder-[#94A3B8] dark:placeholder-[#5E6E85] focus:outline-none focus:border-[#00A878] dark:focus:border-[#35E0B2] transition-colors"
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-4 py-2.5 rounded-xl bg-[#00A878] hover:bg-[#008f66] text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-40 flex items-center gap-1.5"
        >
          <span>{language === 'pidgin' ? 'Send' : 'Ask'}</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
