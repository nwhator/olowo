'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  Settings,
  Building,
  Shield,
  CreditCard,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { ARC_CONFIG } from '@/lib/arc';
import { playSound } from '@/lib/sound';

export default function SettingsPage() {
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetData = async () => {
    setIsResetting(true);
    setResetSuccess(false);
    playSound('click');
    try {
      await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      playSound('success');
      setResetSuccess(true);
      setTimeout(() => {
        setResetSuccess(false);
        window.location.reload();
      }, 1200);
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <AppShell title="System Settings" subtitle="Business entity, wallet infrastructure, and network configuration">
      <div className="space-y-8 max-w-4xl">
        {/* Organization Card */}
        <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] space-y-6 shadow-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
            <div className="p-2 rounded-xl bg-[#00A878]/10 text-[#00A878] dark:text-[#35E0B2]">
              <Building className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[#101828] dark:text-white tracking-tight">Organization Profile</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-[#64748B] dark:text-[#5E6E85] block">LEGAL ENTITY</span>
              <span className="text-[#101828] dark:text-white font-semibold text-sm">AfriCode Labs Inc.</span>
            </div>
            <div>
              <span className="text-[#64748B] dark:text-[#5E6E85] block">OPERATING JURISDICTION</span>
              <span className="text-[#101828] dark:text-white font-semibold text-sm">Nigeria / International Remote</span>
            </div>
            <div>
              <span className="text-[#64748B] dark:text-[#5E6E85] block">ORGANIZATION ID</span>
              <span className="text-[#101828] dark:text-white">biz_africode_99210</span>
            </div>
            <div>
              <span className="text-[#64748B] dark:text-[#5E6E85] block">ACCOUNT CREATED</span>
              <span className="text-[#101828] dark:text-white">January 15, 2026</span>
            </div>
          </div>
        </div>

        {/* Settlement Infrastructure Card */}
        <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] space-y-6 shadow-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
            <div className="p-2 rounded-xl bg-[#3B66F5]/10 text-[#3B66F5] dark:text-[#4D7CFE]">
              <CreditCard className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[#101828] dark:text-white tracking-tight">
              Settlement & Circle Wallet Configuration
            </h2>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="flex justify-between py-2 border-b border-[#E2E8F0] dark:border-[#1A2D4C]/60">
              <span className="text-[#64748B] dark:text-[#8896AB]">Circle Treasury Wallet ID:</span>
              <span className="text-[#101828] dark:text-white">w_circ_africode_treasury_01</span>
            </div>

            <div className="flex justify-between py-2 border-b border-[#E2E8F0] dark:border-[#1A2D4C]/60">
              <span className="text-[#64748B] dark:text-[#8896AB]">Settlement Network:</span>
              <span className="text-[#3B66F5] dark:text-[#4D7CFE] font-semibold">{ARC_CONFIG.name}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-[#E2E8F0] dark:border-[#1A2D4C]/60">
              <span className="text-[#64748B] dark:text-[#8896AB]">Chain ID:</span>
              <span className="text-[#101828] dark:text-white">{ARC_CONFIG.chainId}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-[#E2E8F0] dark:border-[#1A2D4C]/60">
              <span className="text-[#64748B] dark:text-[#8896AB]">Block Explorer:</span>
              <a
                href={ARC_CONFIG.blockExplorerUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#00A878] dark:text-[#35E0B2] hover:underline flex items-center gap-1"
              >
                <span>{ARC_CONFIG.blockExplorerUrl}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-[#64748B] dark:text-[#8896AB]">Gas Sponsorship:</span>
              <span className="text-[#00A878] dark:text-[#35E0B2] font-semibold">Enabled (Gasless payouts on Arc)</span>
            </div>
          </div>
        </div>

        {/* Demo Mode & Sandbox Controls */}
        <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] space-y-6 shadow-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
            <div className="p-2 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] dark:text-[#F5B942]">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[#101828] dark:text-white tracking-tight">
              Demo Sandbox Controls
            </h2>
          </div>

          <p className="text-xs text-[#64748B] dark:text-[#8896AB] leading-relaxed">
            Reset all state, invoices, payments, and audit logs back to the pristine hackathon seed data specified in Section 45.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={handleResetData}
              disabled={isResetting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] dark:bg-[#08111F] dark:hover:bg-[#12223B] border border-[#E2E8F0] dark:border-[#1A2D4C] text-xs font-semibold text-[#101828] dark:text-white transition-all disabled:opacity-50"
            >
              {isResetting ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#00A878] dark:text-[#35E0B2]" />
              ) : (
                <RotateCcw className="w-4 h-4 text-[#F59E0B] dark:text-[#F5B942]" />
              )}
              <span>Reset to Seed Data</span>
            </button>

            {resetSuccess && (
              <span className="flex items-center gap-1.5 text-xs text-[#00A878] dark:text-[#35E0B2] font-mono">
                <CheckCircle2 className="w-4 h-4" />
                Reset complete! Reloading...
              </span>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
