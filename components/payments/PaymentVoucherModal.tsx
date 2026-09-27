'use client';

import React, { useState } from 'react';
import {
  X,
  Printer,
  Share2,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Zap,
  ExternalLink,
} from 'lucide-react';
import { formatArcTxHash, getArcExplorerUrl } from '@/lib/arc';
import { playSound } from '@/lib/sound';

export interface PaymentVoucherData {
  voucherNumber: string;
  recipientName: string;
  recipientAccount?: string;
  invoiceNumber: string;
  poNumber?: string;
  description: string;
  amountUsdc: number;
  exchangeRate?: number;
  authorizationType: 'AUTONOMOUS' | 'HUMAN_APPROVED';
  txHash: string;
  timestamp: string;
  checksPassed?: number;
}

interface PaymentVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucher: PaymentVoucherData | null;
}

export function PaymentVoucherModal({ isOpen, onClose, voucher }: PaymentVoucherModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !voucher) return null;

  const rate = voucher.exchangeRate || 1500;
  const amountNaira = voucher.amountUsdc * rate;
  const formattedNaira = `₦${amountNaira.toLocaleString()}`;
  const formattedUsdc = `$${voucher.amountUsdc.toLocaleString()}`;
  const explorerUrl = getArcExplorerUrl(voucher.txHash);

  const handleCopyWhatsApp = () => {
    playSound('click');
    const text = `*OLOWO PAYMENT VOUCHER / RECEIPT*
---------------------------------------
*Voucher No:* ${voucher.voucherNumber}
*Recipient:* ${voucher.recipientName}
*Purpose:* ${voucher.description}
*Waybill / Invoice:* ${voucher.invoiceNumber}
${voucher.poNumber ? `*PO Number:* ${voucher.poNumber}\n` : ''}---------------------------------------
*Amount Paid:* ${formattedUsdc} USDC (${formattedNaira})
*Network:* Arc Network (Sponsored by Circle Paymaster)
*Gas Paid:* $0.00 (100% Free)
*Status:* SETTLED & VERIFIED ✅
*Arc Hash:* ${voucher.txHash}
---------------------------------------
_Issued autonomously by OLOWO AI Operator_`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    playSound('click');
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0D192C] rounded-3xl border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Modal Controls */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center justify-between bg-[#F8FAFC] dark:bg-[#08111F]/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#00A878] dark:text-[#35E0B2]" />
            <h2 className="text-sm font-bold text-[#101828] dark:text-white font-mono tracking-tight">
              Official Payment Voucher
            </h2>
          </div>
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="p-1.5 rounded-xl text-[#64748B] hover:text-[#101828] dark:text-[#8896AB] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#12223B] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Voucher Printable Body */}
        <div className="p-6 overflow-y-auto space-y-6 print:p-0">
          {/* Perforated Thermal Voucher Canvas */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#FCFDFD] dark:bg-[#0A1424] border-2 border-dashed border-[#CBD5E1] dark:border-[#1E3A5F] space-y-5 relative shadow-xs">
            {/* Top Badge & Logo */}
            <div className="flex items-start justify-between border-b border-[#E2E8F0] dark:border-[#1A2D4C] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black tracking-tight text-[#101828] dark:text-white">
                    OLOWO FINANCE
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#00A878]/10 text-[#00A878] dark:text-[#35E0B2] border border-[#00A878]/30 font-bold">
                    VERIFIED
                  </span>
                </div>
                <div className="text-[11px] text-[#64748B] dark:text-[#8896AB]">
                  Autonomous Commercial Settlement Slip
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-mono text-[#64748B] dark:text-[#8896AB] uppercase">
                  Voucher No.
                </div>
                <div className="text-xs font-mono font-bold text-[#101828] dark:text-white">
                  {voucher.voucherNumber}
                </div>
              </div>
            </div>

            {/* Amount Callout in Dual Currency */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] text-center space-y-1">
              <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#8896AB]">
                Settlement Amount
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-[#00A878] dark:text-[#35E0B2]">
                {formattedUsdc} <span className="text-xs font-sans text-[#64748B] dark:text-[#8896AB]">USDC</span>
              </div>
              <div className="text-xs font-mono font-bold text-[#64748B] dark:text-[#94A3B8]">
                ≈ {formattedNaira} (Parallel Rate: ₦{rate}/$)
              </div>
            </div>

            {/* Line Item Details */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-[#F1F5F9] dark:border-[#1A2D4C]/60">
                <span className="text-[#64748B] dark:text-[#8896AB]">Paid To (Supplier):</span>
                <span className="font-bold text-[#101828] dark:text-white text-right">
                  {voucher.recipientName}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#F1F5F9] dark:border-[#1A2D4C]/60">
                <span className="text-[#64748B] dark:text-[#8896AB]">Deliverables:</span>
                <span className="font-medium text-[#101828] dark:text-white text-right max-w-[240px] truncate">
                  {voucher.description}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#F1F5F9] dark:border-[#1A2D4C]/60">
                <span className="text-[#64748B] dark:text-[#8896AB]">Waybill / Invoice:</span>
                <span className="font-mono font-semibold text-[#101828] dark:text-white">
                  {voucher.invoiceNumber}
                </span>
              </div>

              {voucher.poNumber && (
                <div className="flex justify-between py-1 border-b border-[#F1F5F9] dark:border-[#1A2D4C]/60">
                  <span className="text-[#64748B] dark:text-[#8896AB]">Purchase Order:</span>
                  <span className="font-mono font-semibold text-[#101828] dark:text-white">
                    {voucher.poNumber}
                  </span>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-[#F1F5F9] dark:border-[#1A2D4C]/60">
                <span className="text-[#64748B] dark:text-[#8896AB]">Authorization:</span>
                <span className="inline-flex items-center gap-1 font-mono font-bold text-[#00A878] dark:text-[#35E0B2]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {voucher.authorizationType === 'AUTONOMOUS'
                    ? 'Autonomous Mandate (5/5 Checks)'
                    : 'Human Signature Approved'}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#F1F5F9] dark:border-[#1A2D4C]/60">
                <span className="text-[#64748B] dark:text-[#8896AB]">Gas Sponsorship:</span>
                <span className="inline-flex items-center gap-1 font-mono font-semibold text-[#3B66F5] dark:text-[#4D7CFE]">
                  <Zap className="w-3.5 h-3.5" />
                  $0.00 (Circle Paymaster)
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-[#64748B] dark:text-[#8896AB]">Date & Time:</span>
                <span className="font-mono text-[#101828] dark:text-white">
                  {voucher.timestamp}
                </span>
              </div>
            </div>

            {/* Arc Network Proof Hash */}
            <div className="p-3 rounded-xl bg-[#F1F5F9] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <div className="text-[10px] font-mono text-[#64748B] dark:text-[#8896AB] uppercase">
                  Arc Network Transaction
                </div>
                <div className="font-mono text-xs text-[#3B66F5] dark:text-[#4D7CFE] truncate font-semibold">
                  {voucher.txHash}
                </div>
              </div>

              <a
                href={explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 p-1.5 rounded-lg bg-white dark:bg-[#0D192C] text-[#3B66F5] dark:text-[#4D7CFE] border border-[#E2E8F0] dark:border-[#1A2D4C] hover:bg-[#F8FAFC] transition-colors"
                title="View on Arc Explorer"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Bottom Watermark / Security Seal */}
            <div className="text-center pt-2 border-t border-[#E2E8F0] dark:border-[#1A2D4C]">
              <div className="text-[10px] font-mono text-[#94A3B8] dark:text-[#5E6E85]">
                GUARANTEED BY OLOWO AGENTIC POLICY • ARC CHAIN ID: 84532
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 sm:p-5 border-t border-[#E2E8F0] dark:border-[#1A2D4C] bg-[#F8FAFC] dark:bg-[#08111F]/60 flex flex-wrap items-center justify-between gap-2.5">
          <button
            onClick={handleCopyWhatsApp}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] text-white hover:bg-[#20ba5a] text-xs font-bold transition-all shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied for WhatsApp!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share WhatsApp Receipt</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#0D192C] hover:bg-[#F1F5F9] dark:hover:bg-[#12223B] border border-[#E2E8F0] dark:border-[#1A2D4C] text-xs font-semibold text-[#101828] dark:text-white transition-all shadow-2xs"
            >
              <Printer className="w-4 h-4 text-[#64748B] dark:text-[#8896AB]" />
              <span>Print Voucher</span>
            </button>

            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
