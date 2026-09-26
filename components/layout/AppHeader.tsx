'use client';

import React from 'react';
import Link from 'next/link';
import { Play, RotateCcw, Shield, ExternalLink, Sparkles } from 'lucide-react';
import { OlowoMascot } from '@/components/mascot/OlowoMascot';
import { MascotState } from '@/types';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  mascotState?: MascotState;
  onRunDemo?: () => void;
  onResetData?: () => void;
  isResetting?: boolean;
}

export function AppHeader({
  title = 'Overview',
  subtitle = 'OLOWO is operating normally.',
  mascotState = 'OPERATING',
  onRunDemo,
  onResetData,
  isResetting = false,
}: AppHeaderProps) {
  return (
    <header className="h-16 border-b border-[#1A2D4C] bg-[#08111F]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Title & Status */}
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-semibold text-white tracking-tight">{title}</h1>
          <span className="hidden sm:inline-block h-3 w-px bg-[#1A2D4C]" />
          <span className="text-xs text-[#8896AB] hidden sm:inline">{subtitle}</span>
        </div>
      </div>

      {/* Actions & Live Metadata */}
      <div className="flex items-center gap-3">
        {/* Network & Infrastructure Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0D192C] border border-[#1A2D4C] text-[11px] font-mono text-[#8896AB]">
          <Shield className="w-3.5 h-3.5 text-[#35E0B2]" />
          <span>ARC NETWORK</span>
          <span className="text-[#5E6E85]">•</span>
          <span className="text-white">USDC</span>
        </div>

        {/* Reset State Button */}
        {onResetData && (
          <button
            onClick={onResetData}
            disabled={isResetting}
            title="Reset storage to initial clean seed state"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1A2D4C] bg-[#0D192C] hover:bg-[#12223B] text-xs font-medium text-[#8896AB] hover:text-white transition-all disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Reset State</span>
          </button>
        )}

        {/* Run Demo Button */}
        {onRunDemo && (
          <button
            onClick={onRunDemo}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#35E0B2] to-[#2bc59c] hover:from-[#3ff0c0] hover:to-[#35E0B2] text-[#08111F] text-xs font-semibold shadow-[0_0_15px_rgba(53,224,178,0.25)] transition-all transform hover:scale-[1.02]"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run OLOWO Demo</span>
          </button>
        )}

        {/* Mascot Status Micro-widget */}
        <Link href="/operator">
          <OlowoMascot state={mascotState} size="sm" />
        </Link>
      </div>
    </header>
  );
}
