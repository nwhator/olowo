'use client';

import React from 'react';
import { AlertTriangle, Play, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Policy } from '@/types';

interface GlobalStatusBannerProps {
  policy?: Policy;
  onTogglePause?: () => void;
  isLoading?: boolean;
}

export function GlobalStatusBanner({
  policy,
  onTogglePause,
  isLoading = false,
}: GlobalStatusBannerProps) {
  if (!policy) return null;

  if (policy.isAutonomousPaused) {
    return (
      <div className="w-full bg-[#EF5B5B]/10 border-b border-[#EF5B5B]/30 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2.5 text-[#EF5B5B]">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span className="font-semibold tracking-wide uppercase text-xs">
              OLOWO Autonomous Operations Paused
            </span>
            <span className="hidden md:inline text-white/80 text-xs">
              — OLOWO can continue monitoring your business and generating recommendations, but cannot execute autonomous payments.
            </span>
          </div>

          <button
            onClick={onTogglePause}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#EF5B5B] hover:bg-[#d94848] text-white rounded text-xs font-medium transition-colors shadow-sm disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-current" />
            Resume Autonomous Operations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0D192C]/60 border-b border-[#1A2D4C]/40 px-4 py-1.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#8896AB]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#35E0B2] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#35E0B2]"></span>
          </span>
          <span className="font-mono text-[#35E0B2] tracking-wider text-[11px] font-medium uppercase">
            AUTONOMOUS OPERATIONS ACTIVE
          </span>
          <span className="text-[#5E6E85] hidden sm:inline">•</span>
          <span className="hidden sm:inline text-[#8896AB]">
            Mandate limit: ${policy.autonomousLimit?.toLocaleString()} USDC • Min reserve: ${policy.minimumReserve?.toLocaleString()} USDC
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-[#5E6E85] hidden md:inline">
            SETTLEMENT: ARC TESTNET
          </span>
          <button
            onClick={onTogglePause}
            disabled={isLoading}
            className="text-[11px] text-[#8896AB] hover:text-[#EF5B5B] transition-colors underline decoration-dotted"
          >
            Emergency Pause
          </button>
        </div>
      </div>
    </div>
  );
}
