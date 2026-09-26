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
      await fetchInvoice();

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#35E0B2', '#4D7CFE', '#F5B942'],
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
        <div className="flex items-center justify-center py-20 text-[#8896AB] gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-[#35E0B2]" />
          <span className="font-mono text-xs">Inspecting invoice and contract...</span>
        </div>
      </AppShell>
    );
  }

  const isPaid = invoice.status === 'AUTONOMOUS_PAID' || invoice.status === 'APPROVED';
  const isApprovalRequired = invoice.status === 'APPROVAL_REQUIRED';
  const isBlocked = invoice.status === 'BLOCKED';

  return (
    <AppShell title={invoice.number} subtitle={`Invoice record for ${invoice.vendorName}`}>
      <div className="space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/invoices"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#8896AB] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Invoices</span>
          </Link>
        </div>

        {/* Section 23: Header */}
        <div className="p-6 md:p-8 rounded-2xl bg-[#0D192C] border border-[#1A2D4C] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#8896AB] uppercase tracking-wider">
              {vendor?.category || 'Vendor'} • {invoice.number}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {invoice.vendorName}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#8896AB] pt-1">
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-[#5E6E85]" />
                Due {invoice.dueDate}
              </span>
              {invoice.contractRef && (
                <span className="flex items-center gap-1 font-mono">
                  <Layers className="w-3.5 h-3.5 text-[#5E6E85]" />
                  Contract: {invoice.contractRef}
                </span>
              )}
              {invoice.milestoneNumber && (
                <span className="flex items-center gap-1 font-mono text-[#35E0B2]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Milestone {invoice.milestoneNumber}
                </span>
              )}
            </div>
          </div>

          <div className="text-left md:text-right">
            <div className="text-3xl md:text-4xl font-bold font-mono-numbers text-white">
              ${invoice.amount.toLocaleString()}
            </div>
            <div className="text-xs font-mono text-[#35E0B2] font-semibold mt-1">
              {invoice.currency} • Arc Network
            </div>
          </div>
        </div>

        {/* AI Decision Banner (Section 23 specification) */}
        {isPaid ? (
          <div className="p-6 rounded-2xl bg-[#35E0B2]/10 border border-[#35E0B2]/40 space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#35E0B2]" />
              <span className="text-sm font-bold font-mono text-[#35E0B2] uppercase tracking-wider">
                AUTONOMOUS PAYMENT APPROVED & SETTLED
              </span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed font-mono">
              {invoice.aiExplanation}
            </p>
          </div>
        ) : isApprovalRequired ? (
          <div className="p-6 rounded-2xl bg-[#F5B942]/10 border border-[#F5B942]/40 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#F5B942]" />
              <span className="text-sm font-bold font-mono text-[#F5B942] uppercase tracking-wider">
                HUMAN APPROVAL REQUIRED
              </span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed font-mono">
              {invoice.aiExplanation}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => handleExecutePayment('HUMAN_APPROVED')}
                disabled={isProcessingPayment}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#35E0B2] hover:bg-[#3ff0c0] text-[#08111F] text-xs font-semibold shadow-md transition-all disabled:opacity-50"
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
                className="px-4 py-2.5 rounded-xl bg-[#08111F] hover:bg-[#12223B] border border-[#1A2D4C] text-xs font-medium text-white transition-all"
              >
                Go to Approvals Center
              </button>
            </div>
          </div>
        ) : isBlocked ? (
          <div className="p-6 rounded-2xl bg-[#EF5B5B]/10 border border-[#EF5B5B]/40 space-y-2">
            <div className="flex items-center gap-2">
              <Ban className="w-5 h-5 text-[#EF5B5B]" />
              <span className="text-sm font-bold font-mono text-[#EF5B5B] uppercase tracking-wider">
                PAYMENT BLOCKED BY MANDATE
              </span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed font-mono">
              {invoice.aiExplanation}
            </p>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[#0D192C] border border-[#1A2D4C] space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#4D7CFE]" />
              <span className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                VERIFIED SCHEDULED OBLIGATION
              </span>
            </div>
            <p className="text-xs text-[#8896AB] leading-relaxed font-mono">
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
            <div className="rounded-xl bg-[#0D192C] border border-[#1A2D4C] p-6 space-y-4">
              <h3 className="text-xs font-mono font-semibold text-[#5E6E85] uppercase tracking-wider">
                Invoice Line Items
              </h3>
              <div className="divide-y divide-[#1A2D4C]/60 text-xs">
                {invoice.lineItems.map((li, i) => (
                  <div key={i} className="py-3 flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium">{li.description}</div>
                      <div className="text-[11px] text-[#8896AB] font-mono">
                        Qty: {li.quantity} × ${li.unitPrice.toLocaleString()} USDC
                      </div>
                    </div>
                    <div className="font-mono font-bold text-white">
                      ${li.total.toLocaleString()} USDC
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 25: Payment Action Box (1 col) */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-[#0D192C] border border-[#1A2D4C] p-6 space-y-5">
              <div className="flex items-center gap-2 pb-4 border-b border-[#1A2D4C]">
                <CreditCard className="w-4 h-4 text-[#35E0B2]" />
                <h3 className="text-sm font-semibold text-white tracking-tight uppercase font-mono">
                  Settlement Details
                </h3>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8896AB]">Amount</span>
                  <span className="font-mono font-bold text-white">
                    ${invoice.amount.toLocaleString()} USDC
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#8896AB]">Recipient</span>
                  <span className="font-medium text-white">{invoice.vendorName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#8896AB]">Destination Wallet</span>
                  <span className="font-mono text-[11px] text-[#8896AB]">
                    {vendor ? formatArcAddress(vendor.walletAddress) : '0x...'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#8896AB]">Source</span>
                  <span className="font-medium text-white">OLOWO Treasury</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#8896AB]">Network</span>
                  <span className="font-mono font-semibold text-[#4D7CFE]">Arc</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#8896AB]">Authorization</span>
                  <span className="font-mono font-semibold text-[#35E0B2]">
                    {isPaid ? (invoice.status === 'AUTONOMOUS_PAID' ? 'Autonomous' : 'Human Approved') : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Payment completion status or execute button */}
              {isPaid ? (
                <div className="pt-4 border-t border-[#1A2D4C] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#35E0B2]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Payment completed</span>
                  </div>

                  {invoice.transactionHash && (
                    <div className="p-3 rounded-lg bg-[#08111F] border border-[#1A2D4C] text-[11px] font-mono space-y-1">
                      <div className="text-[#5E6E85]">Transaction Hash:</div>
                      <div className="text-white break-all">
                        {formatArcTxHash(invoice.transactionHash)}
                      </div>
                      <a
                        href={getArcExplorerUrl(invoice.transactionHash)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#35E0B2] hover:underline flex items-center gap-1 pt-1 text-xs"
                      >
                        <span>View transaction on Arc Explorer</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              ) : invoice.aiDecision === 'ALLOW' ? (
                <div className="pt-4 border-t border-[#1A2D4C]">
                  <button
                    onClick={() => handleExecutePayment('AUTONOMOUS')}
                    disabled={isProcessingPayment}
                    className="w-full py-2.5 rounded-xl bg-[#35E0B2] hover:bg-[#3ff0c0] text-[#08111F] text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
                <div className="p-3 rounded-lg bg-[#EF5B5B]/10 border border-[#EF5B5B]/30 text-xs text-[#EF5B5B]">
                  {paymentResult.error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
