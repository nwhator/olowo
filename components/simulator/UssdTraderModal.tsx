'use client';

import React, { useState } from 'react';
import {
  X,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Sparkles,
  Radio,
} from 'lucide-react';
import { playPaymentSuccessSound, playClickSound, playSound } from '@/lib/sound';
import { useMarket } from '@/components/market/MarketContext';

interface UssdTraderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UssdTraderModal({ isOpen, onClose }: UssdTraderModalProps) {
  const { language } = useMarket();
  const isPidgin = language === 'pidgin';

  const [inputVal, setInputVal] = useState('');
  const [screenState, setScreenState] = useState<'PROMPT' | 'PROCESSING' | 'SUCCESS' | 'REJECTED'>('PROMPT');
  const [txHash, setTxHash] = useState('0x4f8a912b7c6e031a9856f4e190b2401');

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    playClickSound();
    if (screenState === 'PROMPT') {
      setInputVal(num);
    }
  };

  const handleSubmit = () => {
    playClickSound();
    if (inputVal === '1') {
      setScreenState('PROCESSING');
      setTimeout(() => {
        playPaymentSuccessSound();
        setScreenState('SUCCESS');
      }, 1200);
    } else if (inputVal === '3') {
      setScreenState('REJECTED');
    } else {
      // Default to process
      setScreenState('PROCESSING');
      setTimeout(() => {
        playPaymentSuccessSound();
        setScreenState('SUCCESS');
      }, 1200);
    }
  };

  const handleReset = () => {
    playClickSound();
    setInputVal('');
    setScreenState('PROMPT');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-[#1E293B] text-white rounded-3xl border border-slate-700 shadow-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#00A878]/20 text-[#35E0B2]">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider font-mono">
                Offline USSD / Feature Phone
              </h3>
              <p className="text-[10px] text-slate-400">
                Works without 4G/Data connection via *384*56#
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nokia / Feature Phone Screen Canvas */}
        <div className="p-4 rounded-2xl bg-[#98B490] text-[#142610] font-mono text-xs shadow-inner border-4 border-slate-800 space-y-3 min-h-[220px] flex flex-col justify-between select-none">
          {screenState === 'PROMPT' && (
            <>
              <div className="space-y-1.5 border-b border-[#142610]/30 pb-2">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span>*384*56# OLOWO</span>
                  <span>📶 MTN 2G</span>
                </div>
                <div className="font-bold text-[11px] leading-tight">
                  Alhaji Sani Grain Depot (Kano)
                </div>
                <div className="text-[10px]">
                  100 Bags Kano Rice • WB-1049
                </div>
                <div className="font-bold text-sm">
                  ₦1,125,000 ($750 USDC)
                </div>
              </div>

              <div className="space-y-1 text-[11px]">
                <div>1. Settle Arc USDC (Instant)</div>
                <div>2. Escalate to Madam Phone</div>
                <div>3. Block &amp; Reject Duplicate</div>
              </div>

              <div className="pt-2 border-t border-[#142610]/30 flex items-center justify-between">
                <span>Select [ {inputVal || '_'} ]</span>
                <span className="text-[10px] uppercase font-bold animate-pulse">
                  Waiting...
                </span>
              </div>
            </>
          )}

          {screenState === 'PROCESSING' && (
            <div className="my-auto text-center space-y-2 py-6">
              <div className="text-sm font-bold animate-bounce">
                Dialing Arc Rails...
              </div>
              <div className="text-[10px]">
                Checking $5,000 reserve floor &amp; Circle Paymaster sponsorship...
              </div>
            </div>
          )}

          {screenState === 'SUCCESS' && (
            <div className="my-auto space-y-2 py-3 text-center">
              <div className="font-bold text-sm flex items-center justify-center gap-1">
                <span>✅ SETTLED ON ARC</span>
              </div>
              <div className="text-[11px] font-bold">
                ₦1,125,000 sent to Alhaji Sani.
              </div>
              <div className="text-[10px]">
                Gas Fee: $0.00 (Circle Paymaster)
                <br />
                Tx: {txHash.slice(0, 16)}...
              </div>
              <div className="text-[9px] pt-1 border-t border-[#142610]/30 text-[#142610]/80">
                SMS receipt dispatched to +234-803-SANI.
              </div>
            </div>
          )}

          {screenState === 'REJECTED' && (
            <div className="my-auto space-y-2 py-4 text-center">
              <div className="font-bold text-sm text-red-950">
                🛑 REJECTED
              </div>
              <div className="text-[10px]">
                Payment flagged and stopped. No money moved from treasury.
              </div>
            </div>
          )}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
            <button
              key={k}
              onClick={() => handleKeyPress(k)}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-sm active:scale-95 transition-all border border-slate-700/60 shadow-xs"
            >
              {k}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          {screenState === 'PROMPT' ? (
            <>
              <button
                onClick={handleReset}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2 rounded-xl bg-[#00A878] hover:bg-[#009166] text-white text-xs font-bold transition-all shadow-xs"
              >
                Send (Reply 1)
              </button>
            </>
          ) : (
            <button
              onClick={handleReset}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset USSD Simulation</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
