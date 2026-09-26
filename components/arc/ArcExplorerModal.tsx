'use client';

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { formatArcAddress, formatArcTxHash } from '@/lib/arc';

export interface ArcTxDetails {
  hash: string;
  amount: number;
  currency: string;
  sender: string;
  recipient: string;
  recipientName?: string;
  timestamp: string;
  blockNumber?: number;
  authorizationType: string;
  checksCount?: number;
}

interface ArcExplorerModalProps {
  isOpen: boolean;
  tx: ArcTxDetails | null;
  onClose: () => void;
}

export function ArcExplorerModal({ isOpen, tx, onClose }: ArcExplorerModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !tx) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const blockNumber = tx.blockNumber || 18492014;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white dark:bg-[#0D192C] text-[#101828] dark:text-white border border-[#E2E8F0] dark:border-[#1A2D4C] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center justify-between bg-[#F8FAFC] dark:bg-[#08111F]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#35E0B2]/10 dark:bg-[#35E0B2]/20 text-[#00A878] dark:text-[#35E0B2]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight">Arc Settlement Explorer</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#4D7CFE]/10 text-[#2563EB] dark:text-[#4D7CFE] border border-[#4D7CFE]/20">
                  TESTNET
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] dark:text-[#8896AB]">
                USDC Deterministic Settlement Layer
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#64748B] hover:text-[#101828] dark:text-[#8896AB] dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs">
          {/* Status & Amount Hero */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-[#64748B] dark:text-[#8896AB] uppercase">
                SETTLED AMOUNT
              </span>
              <div className="text-2xl font-bold font-mono text-[#101828] dark:text-white">
                ${tx.amount.toLocaleString()} <span className="text-sm font-semibold text-[#00A878] dark:text-[#35E0B2]">{tx.currency}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#35E0B2]/10 dark:bg-[#35E0B2]/20 border border-[#35E0B2]/30 text-[#00A878] dark:text-[#35E0B2] font-mono font-semibold text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>FINALIZED (0.4s)</span>
            </div>
          </div>

          {/* Transaction Metadata Grid */}
          <div className="space-y-3 font-mono">
            {/* Hash */}
            <div className="flex items-center justify-between py-2 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
              <span className="text-[#64748B] dark:text-[#8896AB]">Transaction Hash:</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#101828] dark:text-white">
                  {formatArcTxHash(tx.hash)}
                </span>
                <button
                  onClick={() => copyToClipboard(tx.hash, 'hash')}
                  className="text-[#64748B] hover:text-[#00A878] dark:text-[#8896AB] dark:hover:text-[#35E0B2] p-0.5"
                  title="Copy full hash"
                >
                  {copiedField === 'hash' ? <Check className="w-3.5 h-3.5 text-[#00A878]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Block Number */}
            <div className="flex items-center justify-between py-2 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
              <span className="text-[#64748B] dark:text-[#8896AB]">Block Height:</span>
              <span className="text-[#101828] dark:text-white">#{blockNumber.toLocaleString()}</span>
            </div>

            {/* Network */}
            <div className="flex items-center justify-between py-2 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
              <span className="text-[#64748B] dark:text-[#8896AB]">Network & Chain:</span>
              <span className="text-[#2563EB] dark:text-[#4D7CFE] font-semibold">
                Arc Network (Chain 84532)
              </span>
            </div>

            {/* Sender / Treasury */}
            <div className="flex items-center justify-between py-2 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
              <span className="text-[#64748B] dark:text-[#8896AB]">From (Treasury):</span>
              <span className="text-[#101828] dark:text-white">
                {formatArcAddress(tx.sender || '0x4a92E31Fb2C7D167a58a74e5F31b99b5aC04b7c1')}
              </span>
            </div>

            {/* Recipient */}
            <div className="flex items-center justify-between py-2 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
              <span className="text-[#64748B] dark:text-[#8896AB]">To (Vendor):</span>
              <span className="text-[#101828] dark:text-white">
                {tx.recipientName ? `${tx.recipientName} ` : ''}
                ({formatArcAddress(tx.recipient || '0x8f4d92a15c8e31002ba5032a91f42d992a91e4f2')})
              </span>
            </div>

            {/* Authorization */}
            <div className="flex items-center justify-between py-2 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
              <span className="text-[#64748B] dark:text-[#8896AB]">Authorization Mandate:</span>
              <span className="text-[#00A878] dark:text-[#35E0B2] font-semibold">
                {tx.authorizationType}
              </span>
            </div>

            {/* Gas Fee */}
            <div className="flex items-center justify-between py-2">
              <span className="text-[#64748B] dark:text-[#8896AB]">Network Gas Fee:</span>
              <span className="text-[#00A878] dark:text-[#35E0B2] font-semibold">
                $0.00 USDC (Sponsored by Arc)
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] dark:border-[#1A2D4C] bg-[#F8FAFC] dark:bg-[#08111F] flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#64748B] dark:text-[#8896AB]">
            Timestamp: {tx.timestamp}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] dark:bg-[#35E0B2] dark:hover:bg-[#3ff0c0] text-white dark:text-[#08111F] font-semibold text-xs transition-colors"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
