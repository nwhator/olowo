'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Play,
  RotateCcw,
  Shield,
  ExternalLink,
  Sparkles,
  Sun,
  Moon,
  FileUp,
  Radio,
  ChevronDown,
} from 'lucide-react';
import { OlowoMascot } from '@/components/mascot/OlowoMascot';
import { MascotState } from '@/types';
import { useTheme } from '@/components/theme/ThemeProvider';
import { UploadInvoiceModal } from '@/components/invoices/UploadInvoiceModal';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  mascotState?: MascotState;
  onRunDemo?: () => void;
  onResetData?: () => void;
  isResetting?: boolean;
  onStateRefreshed?: () => void;
}

export function AppHeader({
  title = 'Overview',
  subtitle = 'OLOWO is operating normally.',
  mascotState = 'OPERATING',
  onRunDemo,
  onResetData,
  isResetting = false,
  onStateRefreshed,
}: AppHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <>
      <UploadInvoiceModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onInvoiceProcessed={() => {
          if (onStateRefreshed) onStateRefreshed();
        }}
      />

      <header className="h-16 border-b border-[#E2E8F0] dark:border-[#1A2D4C] bg-white/95 dark:bg-[#08111F]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
        {/* Title & Subtitle */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-[#101828] dark:text-white tracking-tight">
              {title}
            </h1>
            <span className="hidden sm:inline-block h-3 w-px bg-[#E2E8F0] dark:bg-[#1A2D4C]" />
            <span className="text-xs text-[#64748B] dark:text-[#8896AB] hidden sm:inline">
              {subtitle}
            </span>
          </div>
        </div>

        {/* Actions & Live Metadata */}
        <div className="flex items-center gap-2.5">
          {/* Process Invoice Button */}
          <button
            onClick={() => setIsUploadOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] dark:bg-[#0D192C] dark:hover:bg-[#12223B] border border-[#E2E8F0] dark:border-[#1A2D4C] text-xs font-medium text-[#344054] dark:text-white transition-all shadow-xs"
          >
            <FileUp className="w-3.5 h-3.5 text-[#00A878] dark:text-[#35E0B2]" />
            <span>Process Invoice</span>
          </button>

          {/* Network & Infrastructure Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F8FAFC] dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] text-[11px] font-mono text-[#64748B] dark:text-[#8896AB]">
            <Shield className="w-3.5 h-3.5 text-[#00A878] dark:text-[#35E0B2]" />
            <span>ARC NETWORK</span>
            <span className="text-[#94A3B8] dark:text-[#5E6E85]">•</span>
            <span className="text-[#101828] dark:text-white font-semibold">USDC</span>
          </div>

          {/* Reset State Button */}
          {onResetData && (
            <button
              onClick={onResetData}
              disabled={isResetting}
              title="Reset storage to initial clean seed state"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#0D192C] hover:bg-[#F8FAFC] dark:hover:bg-[#12223B] text-xs font-medium text-[#64748B] hover:text-[#101828] dark:text-[#8896AB] dark:hover:text-white transition-all disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
            className="p-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#0D192C] hover:bg-[#F8FAFC] dark:hover:bg-[#12223B] text-[#64748B] hover:text-[#101828] dark:text-[#8896AB] dark:hover:text-white transition-all"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-[#475467]" />
            ) : (
              <Sun className="w-4 h-4 text-[#F5B942]" />
            )}
          </button>

          {/* Run Demo Button */}
          {onRunDemo && (
            <button
              onClick={onRunDemo}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00A878] hover:bg-[#008f66] dark:bg-[#35E0B2] dark:hover:bg-[#3ff0c0] text-white dark:text-[#08111F] text-xs font-semibold shadow-sm dark:shadow-[0_0_15px_rgba(53,224,178,0.25)] transition-all transform hover:scale-[1.02]"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Run Demo</span>
            </button>
          )}

          {/* Mascot Status Micro-widget */}
          <Link href="/operator" className="ml-1">
            <OlowoMascot state={mascotState} size="sm" />
          </Link>
        </div>
      </header>
    </>
  );
}
