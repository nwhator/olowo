'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { Approval } from '@/types';
import confetti from 'canvas-confetti';

interface ApprovalCardProps {
  approval: Approval;
  onResolved?: () => void;
}

export function ApprovalCard({ approval, onResolved }: ApprovalCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionDone, setActionDone] = useState<'APPROVED' | 'REJECTED' | null>(
    approval.status !== 'PENDING' ? approval.status : null
  );
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleAction(action: 'APPROVE' | 'REJECT') {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approvalId: approval.id,
          action,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Action failed');
      }

      setActionDone(action === 'APPROVE' ? 'APPROVED' : 'REJECTED');
      if (data.transactionHash) {
        setTxHash(data.transactionHash);
        // Confetti celebration on human approval settlement
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#35E0B2', '#4D7CFE', '#F5B942'],
          });
        } catch (_) {}
      }

      if (onResolved) onResolved();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error processing approval');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div
      className={`rounded-xl border transition-all ${
        actionDone === 'APPROVED'
          ? 'bg-[#0D192C] border-[#35E0B2]/40'
          : actionDone === 'REJECTED'
          ? 'bg-[#0D192C] border-[#EF5B5B]/30 opacity-70'
          : 'bg-[#0D192C] border-[#F5B942]/40 shadow-[0_0_25px_rgba(245,185,66,0.06)]'
      } overflow-hidden`}
    >
      {/* Top Warning Ribbon */}
      <div className="px-5 py-2.5 bg-[#08111F] border-b border-[#1A2D4C] flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <AlertTriangle className="w-3.5 h-3.5 text-[#F5B942]" />
          <span className="font-mono text-[#F5B942] font-semibold uppercase tracking-wider text-[11px]">
            EXCEEDS AUTONOMOUS MANDATE
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#8896AB]">
          {approval.invoiceNumber}
        </span>
      </div>

      <div className="p-6 space-y-5">
        {/* Main Entity & Amount */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">{approval.vendorName}</h3>
              <Link
                href={`/invoices/${approval.invoiceId}`}
                className="text-[11px] text-[#4D7CFE] hover:underline flex items-center gap-0.5"
              >
                <span>View Invoice</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <p className="text-xs text-[#8896AB] mt-1">{approval.reason}</p>
          </div>

          <div className="text-right sm:text-right">
            <div className="text-2xl font-bold font-mono-numbers text-white">
              ${approval.amount.toLocaleString()}
            </div>
            <div className="text-[11px] font-mono text-[#35E0B2]">
              {approval.currency} • Arc Network
            </div>
          </div>
        </div>

        {/* Verification Summary List */}
        <div className="p-4 rounded-xl bg-[#08111F] border border-[#1A2D4C] space-y-2">
          <div className="text-[11px] font-mono text-[#5E6E85] uppercase tracking-wider">
            VERIFICATION AUDIT SNAPSHOT
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {approval.checksSummary.map((chk, i) => (
              <div key={i} className="flex items-center gap-2 text-white/90">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#35E0B2] shrink-0" />
                <span>{chk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendation Box */}
        <div className="p-4 rounded-xl bg-[#12223B]/60 border border-[#4D7CFE]/30 flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-[#4D7CFE]/10 text-[#4D7CFE] shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white font-mono uppercase text-[11px]">
                OLOWO RECOMMENDATION:
              </span>
              <span className="font-bold text-[#35E0B2] font-mono">
                {approval.aiRecommendation}
              </span>
            </div>
            <p className="text-[#8896AB] mt-1 text-[11px] leading-relaxed">
              The invoice is fully verified, but exceeds OLOWO&apos;s autonomous authority. Solvency and contract deliverables confirmed.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-[#EF5B5B]/10 border border-[#EF5B5B]/30 text-xs text-[#EF5B5B]">
            {errorMsg}
          </div>
        )}

        {/* Transaction Result if executed */}
        {txHash && (
          <div className="p-3.5 rounded-xl bg-[#35E0B2]/10 border border-[#35E0B2]/30 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-[#35E0B2]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settlement Executed via Arc:</span>
              <span className="text-white">{txHash.substring(0, 10)}...{txHash.substring(txHash.length - 6)}</span>
            </div>
            <span className="text-[10px] text-[#35E0B2] uppercase font-bold">Confirmed</span>
          </div>
        )}

        {/* Action Buttons */}
        {actionDone === null ? (
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => handleAction('REJECT')}
              disabled={isProcessing}
              className="px-4 py-2 rounded-lg border border-[#1A2D4C] bg-[#08111F] hover:bg-[#12223B] text-xs font-medium text-[#EF5B5B] hover:border-[#EF5B5B]/40 transition-all disabled:opacity-50"
            >
              Reject Invoice
            </button>

            <button
              onClick={() => handleAction('APPROVE')}
              disabled={isProcessing}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#35E0B2] hover:bg-[#3ff0c0] text-[#08111F] text-xs font-semibold shadow-lg shadow-[#35E0B2]/20 transition-all transform hover:scale-[1.01] disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Settling via Arc...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve ${approval.amount.toLocaleString()} USDC</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="text-right text-xs font-mono text-[#8896AB] pt-2">
            Status: <span className="text-white font-semibold">{actionDone}</span> by Business Owner
          </div>
        )}
      </div>
    </div>
  );
}
