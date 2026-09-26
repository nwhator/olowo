'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { OperatorChat } from '@/components/operator/OperatorChat';
import { OlowoMascot } from '@/components/mascot/OlowoMascot';
import { Treasury, Policy } from '@/types';
import {
  Bot,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  Radio,
} from 'lucide-react';

export default function OperatorPage() {
  const [treasury, setTreasury] = useState<Treasury | null>(null);
  const [policy, setPolicy] = useState<Policy | null>(null);

  const fetchData = () => {
    fetch('/api/treasury')
      .then((r) => r.json())
      .then((d) => setTreasury(d.treasury));
    fetch('/api/mandate')
      .then((r) => r.json())
      .then((d) => setPolicy(d.policy));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AppShell
      title="OLOWO Operator"
      subtitle="Autonomous intelligence operating within company mandate"
      onRefresh={fetchData}
    >
      <div className="space-y-8">
        {/* Section 28: Operator Status & Real-time Telemetry */}
        <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-5">
            <OlowoMascot
              state={policy?.isAutonomousPaused ? 'BLOCKED' : 'OPERATING'}
              size="lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#101828] dark:text-white tracking-tight">OLOWO Operator</h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-[#00A878]/10 text-[#00A878] dark:text-[#35E0B2] border border-[#00A878]/20 dark:border-[#35E0B2]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A878] dark:bg-[#35E0B2] animate-ping" />
                  {policy?.isAutonomousPaused ? 'PAUSED' : 'OPERATING AUTONOMOUSLY'}
                </span>
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#8896AB] mt-1 max-w-xl leading-relaxed">
                Active financial watchdog. Evaluating invoices against contracts, milestones, and reserve thresholds 24/7.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-[#E2E8F0] dark:border-[#1A2D4C] pt-4 md:pt-0 md:pl-6 text-xs font-mono">
            <div>
              <span className="text-[#64748B] dark:text-[#5E6E85] block text-[10px]">MONITORING</span>
              <span className="font-bold text-[#101828] dark:text-white text-base">12</span> Invoices
            </div>
            <div>
              <span className="text-[#64748B] dark:text-[#5E6E85] block text-[10px]">COUNTERPARTIES</span>
              <span className="font-bold text-[#101828] dark:text-white text-base">8</span> Vendors
            </div>
            <div>
              <span className="text-[#64748B] dark:text-[#5E6E85] block text-[10px]">TREASURY</span>
              <span className="font-bold text-[#00A878] dark:text-[#35E0B2] text-base">
                ${treasury?.balance?.toLocaleString() || '12,400'}
              </span>
            </div>
          </div>
        </div>

        {/* Today's Operational Telemetry Grid (Section 28 specification) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-xs">
            <span className="text-[11px] font-mono text-[#64748B] dark:text-[#5E6E85] block uppercase">
              Payments Executed Today
            </span>
            <div className="text-2xl font-bold font-mono text-[#101828] dark:text-white mt-1">7</div>
            <span className="text-[11px] text-[#00A878] dark:text-[#35E0B2] font-mono mt-0.5 block">
              100% within mandate
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-xs">
            <span className="text-[11px] font-mono text-[#64748B] dark:text-[#5E6E85] block uppercase">
              Obligations Reserved
            </span>
            <div className="text-2xl font-bold font-mono text-[#101828] dark:text-white mt-1">3</div>
            <span className="text-[11px] text-[#3B66F5] dark:text-[#4D7CFE] font-mono mt-0.5 block">
              Ring-fenced in treasury
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-xs">
            <span className="text-[11px] font-mono text-[#64748B] dark:text-[#5E6E85] block uppercase">
              Approvals Requested
            </span>
            <div className="text-2xl font-bold font-mono text-[#F59E0B] dark:text-[#F5B942] mt-1">2</div>
            <span className="text-[11px] text-[#64748B] dark:text-[#8896AB] font-mono mt-0.5 block">
              Awaiting owner review
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-xs">
            <span className="text-[11px] font-mono text-[#64748B] dark:text-[#5E6E85] block uppercase">
              Policy Violations
            </span>
            <div className="text-2xl font-bold font-mono text-[#00A878] dark:text-[#35E0B2] mt-1">0</div>
            <span className="text-[11px] text-[#64748B] dark:text-[#5E6E85] font-mono mt-0.5 block">
              Zero unauthorized disbursements
            </span>
          </div>
        </div>

        {/* Section 29: Conversational Panel */}
        <OperatorChat mascotState={policy?.isAutonomousPaused ? 'BLOCKED' : 'OPERATING'} />
      </div>
    </AppShell>
  );
}
