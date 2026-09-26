'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ApprovalCard } from '@/components/approvals/ApprovalCard';
import { Approval } from '@/types';
import { ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApprovals = async () => {
    try {
      const res = await fetch('/api/approvals');
      const data = await res.json();
      if (data.approvals) setApprovals(data.approvals);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const pendingApprovals = approvals.filter((a) => a.status === 'PENDING');
  const resolvedApprovals = approvals.filter((a) => a.status !== 'PENDING');

  return (
    <AppShell
      title="Approval Center"
      subtitle="Decisions that exceed OLOWO's autonomous authority"
      onRefresh={fetchApprovals}
    >
      <div className="space-y-8">
        {/* Banner */}
        <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#FFFBEB] dark:bg-[#F5B942]/10 text-[#D97706] dark:text-[#F5B942] border border-[#FDE68A] dark:border-[#F5B942]/30 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#101828] dark:text-white tracking-tight">
                Human Mandate Verification Required
              </h2>
              <p className="text-xs text-[#64748B] dark:text-[#8896AB] mt-1 max-w-2xl leading-relaxed">
                OLOWO has verified these invoices against contracts, delivery milestones, and solvency rules.
                However, because they exceed your autonomous spending limit or involve new counterparties, your human authorization is required before money moves.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-3xl font-bold font-mono text-[#D97706] dark:text-[#F5B942]">
              {pendingApprovals.length}
            </span>
            <span className="text-xs font-mono text-[#64748B] dark:text-[#8896AB] block font-medium">
              Pending Authorization
            </span>
          </div>
        </div>

        {/* Pending Approvals List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#101828] dark:text-white tracking-tight uppercase font-mono">
              Pending Requests ({pendingApprovals.length})
            </h3>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-[#64748B] dark:text-[#8896AB] gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-[#00A878] dark:text-[#35E0B2]" />
              <span className="font-mono text-xs">Checking approval pipeline...</span>
            </div>
          ) : pendingApprovals.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] text-center space-y-2 shadow-xs">
              <CheckCircle2 className="w-8 h-8 text-[#00A878] dark:text-[#35E0B2] mx-auto" />
              <h4 className="text-sm font-bold text-[#101828] dark:text-white">All caught up</h4>
              <p className="text-xs text-[#64748B] dark:text-[#8896AB]">
                No pending payments exceed your autonomous authority right now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {pendingApprovals.map((appr) => (
                <ApprovalCard
                  key={appr.id}
                  approval={appr}
                  onResolved={fetchApprovals}
                />
              ))}
            </div>
          )}
        </div>

        {/* Previously Resolved Approvals */}
        {resolvedApprovals.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-[#E2E8F0] dark:border-[#1A2D4C]">
            <h3 className="text-xs font-bold text-[#94A3B8] dark:text-[#8896AB] tracking-wider uppercase font-mono">
              Resolved in this session
            </h3>
            <div className="grid grid-cols-1 gap-4 opacity-75">
              {resolvedApprovals.map((appr) => (
                <ApprovalCard
                  key={appr.id}
                  approval={appr}
                  onResolved={fetchApprovals}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
