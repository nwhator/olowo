'use client';

import React from 'react';
import { AlertTriangle, Play, ShieldAlert, CheckCircle2, Pause } from 'lucide-react';
import { Policy } from '@/types';
import { useMarket } from '@/components/market/MarketContext';
import { formatDualCurrency } from '@/lib/market/language';
import { playSound } from '@/lib/sound';

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
  const { language, t, exchangeRate } = useMarket();

  if (!policy) return null;

  if (policy.isAutonomousPaused) {
    return (
      <div className="w-full bg-[#FEF2F2] dark:bg-[#EF5B5B]/10 border-b border-[#FCA5A5] dark:border-[#EF5B5B]/30 px-4 py-2.5 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2.5 text-[#DC2626] dark:text-[#EF5B5B]">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span className="font-semibold tracking-wide uppercase text-xs">
              {language === 'pidgin'
                ? 'EMERGENCY PAUSE: ALL PAYMENTS PAUSED'
                : 'OLOWO AUTONOMOUS OPERATIONS PAUSED'}
            </span>
            <span className="hidden md:inline text-[#64748B] dark:text-white/80 text-xs">
              {language === 'pidgin'
                ? '— OLOWO dey monitor your shop, but e no fit pay out any money until you resume.'
                : '— OLOWO continues monitoring business health and verification, but cannot execute autonomous disbursements.'}
            </span>
          </div>

          <button
            onClick={() => {
              playSound('click');
              if (onTogglePause) onTogglePause();
            }}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#DC2626] hover:bg-[#B91C1C] dark:bg-[#EF5B5B] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{language === 'pidgin' ? 'Resume Money Movement' : 'Resume Autonomous Operations'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-[#0D192C]/60 border-b border-[#E2E8F0] dark:border-[#1A2D4C]/40 px-4 py-1.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#64748B] dark:text-[#8896AB]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A878] dark:bg-[#35E0B2] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A878] dark:bg-[#35E0B2]"></span>
          </span>
          <span className="font-mono text-[#00A878] dark:text-[#35E0B2] tracking-wider text-[11px] font-semibold uppercase">
            {language === 'pidgin' ? 'OLOWO ACTIVE • NO SHAKING' : 'AUTONOMOUS OPERATIONS ACTIVE'}
          </span>
          <span className="text-[#CBD5E1] dark:text-[#5E6E85] hidden sm:inline">•</span>
          <span className="hidden sm:inline">
            {language === 'pidgin'
              ? `Daily limit: $${policy.autonomousLimit?.toLocaleString()} USDC (~₦${(policy.autonomousLimit * exchangeRate).toLocaleString()}) • Shop rent reserve: $${policy.minimumReserve?.toLocaleString()} USDC (~₦${(policy.minimumReserve * exchangeRate).toLocaleString()})`
              : `Mandate limit: $${policy.autonomousLimit?.toLocaleString()} USDC • Min reserve: $${policy.minimumReserve?.toLocaleString()} USDC`}
          </span>
        </div>

        <button
          onClick={() => {
            playSound('click');
            if (onTogglePause) onTogglePause();
          }}
          disabled={isLoading}
          className="text-[11px] text-[#DC2626] dark:text-[#EF5B5B] hover:underline font-mono font-medium flex items-center gap-1"
        >
          <Pause className="w-3 h-3" />
          <span>{language === 'pidgin' ? 'Emergency Pause' : 'Pause Operations'}</span>
        </button>
      </div>
    </div>
  );
}
