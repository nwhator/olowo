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
} from 'lucide-react';
import { OlowoMascot } from '@/components/mascot/OlowoMascot';
import { OperatorChatMessage, MascotState } from '@/types';

interface OperatorChatProps {
  mascotState?: MascotState;
}

export function OperatorChat({ mascotState = 'OPERATING' }: OperatorChatProps) {
  const [messages, setMessages] = useState<OperatorChatMessage[]>([
    {
      id: 'm_welcome',
      sender: 'olowo',
      text: 'Good afternoon. I am continuously operating your financial mandate for AfriCode Labs. Invoices are being verified, critical obligations are ring-fenced, and reserve policies are enforced. How can I assist you?',
      timestamp: 'Just now',
      toolsUsed: ['getTreasury()', 'getPolicies()'],
      verifiedFacts: [
        'Treasury: $12,400 USDC',
        'Operating Reserve Floor: $5,000 USDC',
        'Autonomous Limit: $1,000 USDC',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    'Why did you pay ABC Design?',
    'What payments are due this week?',
    'How much can I safely spend?',
    'Why was invoice #1043 blocked?',
    'What happens if I approve this payment?',
  ];

  async function handleSend(queryText: string) {
    const q = queryText.trim();
    if (!q || isLoading) return;

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
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();

      const olowoMsg: OperatorChatMessage = {
        id: `o_${Date.now()}`,
        sender: 'olowo',
        text: data.answer || 'I evaluated your request against current business policies and state.',
        timestamp: 'Just now',
        toolsUsed: data.toolsUsed,
        verifiedFacts: data.verifiedFacts,
        relatedActionUrl: data.actionLink?.url,
      };

      setMessages((prev) => [...prev, olowoMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'olowo',
          text: 'Encountered an issue querying system state. Please check local connectivity.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-[#0D192C] border border-[#1A2D4C] flex flex-col h-[650px] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#1A2D4C] flex items-center justify-between bg-[#08111F]">
        <div className="flex items-center gap-3">
          <OlowoMascot state={mascotState} size="sm" />
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              OLOWO Intelligent Operator
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#35E0B2]/10 text-[#35E0B2] border border-[#35E0B2]/30">
                POLICY GROUNDED
              </span>
            </h3>
            <p className="text-[11px] text-[#8896AB]">
              Answers synthesized directly from verified database records and mandate rules
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#5E6E85]">
          <Terminal className="w-3.5 h-3.5" />
          <span>TOOL-CALLING ACTIVE</span>
        </div>
      </div>

      {/* Suggested Questions Pills */}
      <div className="px-6 py-3 border-b border-[#1A2D4C]/60 bg-[#0A1424] flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-mono text-[#5E6E85] shrink-0">SUGGESTED:</span>
        {suggestedQuestions.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSend(sq)}
            className="text-[11px] px-3 py-1 rounded-full bg-[#12223B] hover:bg-[#1A2D4C] text-[#8896AB] hover:text-white border border-[#1A2D4C] transition-colors shrink-0"
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
              className={`max-w-xl rounded-2xl p-4 space-y-3 ${
                m.sender === 'user'
                  ? 'bg-[#12223B] text-white border border-[#1A2D4C]'
                  : 'bg-[#08111F] text-white border border-[#1A2D4C]/80'
              }`}
            >
              <div className="text-xs leading-relaxed whitespace-pre-line text-white/95">
                {m.text}
              </div>

              {/* Verified Facts snapshot */}
              {m.verifiedFacts && m.verifiedFacts.length > 0 && (
                <div className="pt-2 border-t border-[#1A2D4C] space-y-1">
                  <span className="text-[10px] font-mono font-medium text-[#5E6E85] uppercase tracking-wider block">
                    VERIFIED SYSTEM FACTS:
                  </span>
                  <div className="space-y-1">
                    {m.verifiedFacts.map((fact, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[#8896AB]">
                        <CheckCircle2 className="w-3 h-3 text-[#35E0B2] shrink-0 mt-0.5" />
                        <span>{fact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tools invoked badge */}
              {m.toolsUsed && m.toolsUsed.length > 0 && (
                <div className="pt-1 flex flex-wrap items-center gap-1.5">
                  <span className="text-[9px] font-mono text-[#5E6E85]">TOOLS:</span>
                  {m.toolsUsed.map((tool, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#12223B] text-[#4D7CFE] border border-[#1A2D4C]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              )}

              {m.relatedActionUrl && (
                <div className="pt-2">
                  <Link
                    href={m.relatedActionUrl}
                    className="inline-flex items-center gap-1 text-xs text-[#35E0B2] hover:underline font-medium"
                  >
                    <span>Inspect Record in UI</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>

            {m.sender === 'user' && (
              <div className="p-2 rounded-xl bg-[#12223B] border border-[#1A2D4C] text-[#8896AB] shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-xs text-[#8896AB] pl-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#35E0B2]" />
            <span className="font-mono text-[11px]">OLOWO is evaluating policies and database state...</span>
          </div>
        )}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-4 border-t border-[#1A2D4C] bg-[#08111F] flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask OLOWO about your business..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-[#0D192C] border border-[#1A2D4C] text-xs text-white placeholder-[#5E6E85] focus:outline-none focus:border-[#35E0B2] transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-[#35E0B2] hover:bg-[#3ff0c0] text-[#08111F] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
