'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { VerificationChecklist } from '@/components/invoices/VerificationChecklist';
import { Invoice, Vendor, Contract, VerificationCheckItem } from '@/types';
import { formatArcAddress, formatArcTxHash, getArcExplorerUrl } from '@/lib/arc';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Ban,
  Clock,
  ExternalLink,
  Shield,
  CreditCard,
  Building,
  Calendar,
  Layers,
  Sparkles,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playPaymentSuccessSound, playApprovalAlertSound } from '@/lib/sound';
import { ArcExplorerModal, ArcTxDetails } from '@/components/arc/ArcExplorerModal';

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{ success: boolean; txHash?: string; error?: string } | null>(null);
  const [selectedTx, setSelectedTx] = useState<ArcTxDetails | null>(null);

  const fetchInvoice = async () => {
    try {
      const res = await fetch(`/api/invoices/${id}`);
      const data = await res.json();
      if (data.invoice) setInvoice(data.invoice);
      if (data.vendor) setVendor(data.vendor);
      if (data.contract) setContract(data.contract);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchInvoice();
  }, [id]);

  const handleExecutePayment = async (authorizationType: 'AUTONOMOUS' | 'HUMAN_APPROVED') => {
    setIsProcessingPayment(true);
    setPaymentResult(null);

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoice?.id,
          authorizationType,
          approverNotes: 'Executed via Invoice Detail Screen',
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Payment execution rejected');
      }

      setPaymentResult({ success: true, txHash: data.transactionHash });
      playPaymentSuccessSound();
      await fetchInvoice();

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#00A878', '#2563EB', '#F59E0B'],
        });
      } catch (_) {}
    } catch (err: any) {
      setPaymentResult({ success: false, error: err.message });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (isLoading || !invoice) {
    return (
      <AppShell title="Invoice Details" subtitle="Loading invoice verification...">
        <div className="flex items-center justify-center py-20 text-[#64748B] dark:text-[#8896AB] gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-[#00A878] dark:text-[#35E0B2]" />
          <span className="font-mono text-xs">Inspecting invoice and contract...</span>
        </div>
      </AppShell>
    );
  }

  const isPaid = invoice.status === 'AUTONOMOUS_PAID' || invoice.status === 'APPROVED';
  const isApprovalRequired = invoice.status === 'APPROVAL_REQUIRED';
  const isBlocked = invoice.status === 'BLOCKED';

  return (
    <>
      <ArcExplorerModal
        isOpen={!!selectedTx}
        tx={selectedTx}
        onClose={() => setSelectedTx(null)}
      />

      <AppShell title={invoice.number} subtitle={`Invoice record for ${invoice.vendorName}`}>
        <div className="space-y-8">
          {/* Back Link */}
          <div>
            <Link
              href="/invoices"
              className="inline-flex items-center gap-2 text-xs font-mono text-[#64748B] hover:text-[#101828] dark:text-[#8896AB] dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Invoices</span>
            </Link>
          </div>

          {/* Section 23: Header */}
          <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs transition-colors">
            <div className="space-y-1">
              <span className="text-xs font-mono text-[#64748B] dark:text-[#8896AB] uppercase tracking-wider font-semibold">
                {vendor?.category || 'Vendor'} • {invoice.number}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-[#101828] dark:text-white tracking-tight">
                {invoice.vendorName}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B] dark:text-[#8896AB] pt-1">
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-[#94A3B8] dark:text-[#5E6E85]" />
                  Due {invoice.dueDate}
                </span>
                {invoice.contractRef && (
                  <span className="flex items-center gap-1 font-mono">
                    <Layers className="w-3.5 h-3.5 text-[#94A3B8] dark:text-[#5E6E85]" />
                    Contract: {invoice.contractRef}
                  </span>
                )}
                {invoice.milestoneNumber && (
                  <span className="flex items-center gap-1 font-mono text-[#00A878] dark:text-[#35E0B2] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Milestone {invoice.milestoneNumber}
                  </span>
                )}
              </div>
            </div>

            <div className="text-left md:text-right">
              <div className="text-3xl md:text-4xl font-bold font-mono-numbers text-[#101828] dark:text-white">
                ${invoice.amount.toLocaleString()}
              </div>
              <div className="text-xs font-mono text-[#00A878] dark:text-[#35E0B2] font-bold mt-1">
                {invoice.currency} • Arc Network
              </div>
            </div>
          </div>

          {/* AI Decision Banner (Section 23 specification) */}
          {isPaid ? (
            <div className="p-6 rounded-2xl bg-[#ECFDF5] dark:bg-[#35E0B2]/10 border border-[#A7F3D0] dark:border-[#35E0B2]/40 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#00A878] dark:text-[#35E0B2]" />
                <span className="text-sm font-bold font-mono text-[#00A878] dark:text-[#35E0B2] uppercase tracking-wider">
                  AUTONOMOUS PAYMENT APPROVED & SETTLED
                </span>
              </div>
              <p className="text-xs text-[#065F46] dark:text-white/90 leading-relaxed font-mono font-medium">
                {invoice.aiExplanation}
              </p>
            </div>
          ) : isApprovalRequired ? (
            <div className="p-6 rounded-2xl bg-[#FFFBEB] dark:bg-[#F5B942]/10 border border-[#FDE68A] dark:border-[#F5B942]/40 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#D97706] dark:text-[#F5B942]" />
                <span className="text-sm font-bold font-mono text-[#D97706] dark:text-[#F5B942] uppercase tracking-wider">
                  HUMAN APPROVAL REQUIRED
                </span>
              </div>
              <p className="text-xs text-[#92400E] dark:text-white/90 leading-relaxed font-mono font-medium">
                {invoice.aiExplanation}
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => handleExecutePayment('HUMAN_APPROVED')}
                  disabled={isProcessingPayment}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A878] hover:bg-[#008f66] dark:bg-[#35E0B2] dark:hover:bg-[#3ff0c0] text-white dark:text-[#08111F] text-xs font-bold shadow-sm transition-all disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>Approve & Pay ${invoice.amount.toLocaleString()} USDC</span>
                </button>

                <button
                  onClick={() => router.push('/approvals')}
                  className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#08111F] hover:bg-[#F8FAFC] dark:hover:bg-[#12223B] border border-[#E2E8F0] dark:border-[#1A2D4C] text-xs font-semibold text-[#101828] dark:text-white transition-all"
                >
                  Go to Approvals Center
                </button>
              </div>
            </div>
          ) : isBlocked ? (
            <div className="p-6 rounded-2xl bg-[#FEF2F2] dark:bg-[#EF5B5B]/10 border border-[#FCA5A5] dark:border-[#EF5B5B]/40 space-y-2">
              <div className="flex items-center gap-2">
                <Ban className="w-5 h-5 text-[#DC2626] dark:text-[#EF5B5B]" />
                <span className="text-sm font-bold font-mono text-[#DC2626] dark:text-[#EF5B5B] uppercase tracking-wider">
                  PAYMENT BLOCKED BY MANDATE
                </span>
              </div>
              <p className="text-xs text-[#991B1B] dark:text-white/90 leading-relaxed font-mono font-medium">
                {invoice.aiExplanation}
              </p>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#2563EB] dark:text-[#4D7CFE]" />
                <span className="text-sm font-bold font-mono text-[#101828] dark:text-white uppercase tracking-wider">
                  VERIFIED SCHEDULED OBLIGATION
                </span>
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#8896AB] leading-relaxed font-mono">
                {invoice.aiExplanation}
              </p>
            </div>
          )}

          {/* Section 24 & 25: Verification Checklist & Payment Action Box */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 24: Verification Checklist (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              <VerificationChecklist checks={invoice.checksSnapshot} />

              {/* Line items card */}
              <div className="rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] p-6 space-y-4 shadow-xs">
                <h3 className="text-xs font-mono font-bold text-[#94A3B8] dark:text-[#5E6E85] uppercase tracking-wider">
                  Invoice Line Items
                </h3>
                <div className="divide-y divide-[#F1F5F9] dark:divide-[#1A2D4C]/60 text-xs">
                  {invoice.lineItems.map((li, i) => (
                    <div key={i} className="py-3 flex justify-between items-center">
                      <div>
                        <div className="text-[#101828] dark:text-white font-semibold">{li.description}</div>
                        <div className="text-[11px] text-[#64748B] dark:text-[#8896AB] font-mono">
                          Qty: {li.quantity} × ${li.unitPrice.toLocaleString()} USDC
                        </div>
                      </div>
                      <div className="font-mono font-bold text-[#101828] dark:text-white">
                        ${li.total.toLocaleString()} USDC
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 25: Payment Action Box (1 col) */}
            <div className="space-y-6">
              <div className="rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] p-6 space-y-5 shadow-xs">
                <div className="flex items-center gap-2 pb-4 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
                  <CreditCard className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2]" />
                  <h3 className="text-sm font-bold text-[#101828] dark:text-white tracking-tight uppercase font-mono">
                    Settlement Details
                  </h3>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#64748B] dark:text-[#8896AB]">Amount</span>
                    <span className="font-mono font-bold text-[#101828] dark:text-white">
                      ${invoice.amount.toLocaleString()} USDC
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#64748B] dark:text-[#8896AB]">Recipient</span>
                    <span className="font-semibold text-[#101828] dark:text-white">{invoice.vendorName}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#64748B] dark:text-[#8896AB]">Destination Wallet</span>
                    <span className="font-mono text-[11px] text-[#64748B] dark:text-[#8896AB]">
                      {vendor ? formatArcAddress(vendor.walletAddress) : '0x...'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#64748B] dark:text-[#8896AB]">Source</span>
                    <span className="font-semibold text-[#101828] dark:text-white">OLOWO Treasury</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#64748B] dark:text-[#8896AB]">Network</span>
                    <span className="font-mono font-bold text-[#2563EB] dark:text-[#4D7CFE]">Arc</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#64748B] dark:text-[#8896AB]">Authorization</span>
                    <span className="font-mono font-bold text-[#00A878] dark:text-[#35E0B2]">
                      {isPaid ? (invoice.status === 'AUTONOMOUS_PAID' ? 'Autonomous' : 'Human Approved') : 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Payment completion status or execute button */}
                {isPaid ? (
                  <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#1A2D4C] space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#00A878] dark:text-[#35E0B2]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Payment completed</span>
                    </div>

                    {invoice.transactionHash && (
                      <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] text-[11px] font-mono space-y-1">
                        <div className="text-[#94A3B8] dark:text-[#5E6E85]">Transaction Hash:</div>
                        <div className="text-[#101828] dark:text-white font-bold break-all">
                          {formatArcTxHash(invoice.transactionHash)}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTx({
                              hash: invoice.transactionHash!,
                              amount: invoice.amount,
                              currency: invoice.currency,
                              sender: '0x4a92E31Fb2C7D167a58a74e5F31b99b5aC04b7c1',
                              recipient: vendor?.walletAddress || '0x8f4d92a15c8e31002ba5032a91f42d992a91e4f2',
                              recipientName: invoice.vendorName,
                              timestamp: invoice.issueDate,
                              authorizationType: invoice.status === 'AUTONOMOUS_PAID' ? 'AUTONOMOUS' : 'HUMAN_APPROVED',
                            });
                          }}
                          className="text-[#00A878] dark:text-[#35E0B2] hover:underline flex items-center gap-1 pt-1 text-xs font-semibold"
                        >
                          <span>Inspect on Arc Settlement Explorer</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : invoice.aiDecision === 'ALLOW' ? (
                  <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#1A2D4C]">
                    <button
                      onClick={() => handleExecutePayment('AUTONOMOUS')}
                      disabled={isProcessingPayment}
                      className="w-full py-2.5 rounded-xl bg-[#00A878] hover:bg-[#008f66] dark:bg-[#35E0B2] dark:hover:bg-[#3ff0c0] text-white dark:text-[#08111F] text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isProcessingPayment ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      <span>Execute Autonomous Payment</span>
                    </button>
                  </div>
                ) : null}

                {paymentResult && !paymentResult.success && (
                  <div className="p-3 rounded-lg bg-[#FEF2F2] dark:bg-[#EF5B5B]/10 border border-[#FCA5A5] dark:border-[#EF5B5B]/30 text-xs text-[#DC2626] dark:text-[#EF5B5B]">
                    {paymentResult.error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    </>
  );
}
