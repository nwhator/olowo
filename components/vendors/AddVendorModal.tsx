'use client';

import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';
import { playSound } from '@/lib/sound';

interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVendorAdded: () => void;
}

export function AddVendorModal({ isOpen, onClose, onVendorAdded }: AddVendorModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Contractor');
  const [walletAddress, setWalletAddress] = useState('');
  const [approved, setApproved] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a counterparty name.');
      return;
    }
    if (!walletAddress.trim().startsWith('0x') || walletAddress.trim().length < 10) {
      setError('Please enter a valid Arc / EVM settlement wallet address starting with 0x.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    playSound('click');

    try {
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          name: name.trim(),
          category,
          walletAddress: walletAddress.trim(),
          approved,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to onboard vendor');
      }

      playSound('success');
      onVendorAdded();
      onClose();
      // Reset form
      setName('');
      setWalletAddress('');
    } catch (err: any) {
      setError(err.message || 'Error creating counterparty');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillSample = () => {
    setName('Superteam Labs');
    setCategory('Contractor');
    setWalletAddress('0x71C...a492'.replace('...', '00109927b5e4088421c970'));
    setApproved(true);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-[#0D192C] text-[#101828] dark:text-white border border-[#E2E8F0] dark:border-[#1A2D4C] rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center justify-between bg-[#F8FAFC] dark:bg-[#08111F]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#00A878]/10 text-[#00A878] dark:text-[#35E0B2]">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Onboard New Counterparty</h3>
              <p className="text-[11px] text-[#64748B] dark:text-[#8896AB]">
                Add to your company whitelist for permitted autonomous USDC payouts
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-[#FEF2F2] dark:bg-[#EF5B5B]/10 border border-[#FCA5A5] dark:border-[#EF5B5B]/30 text-xs text-[#DC2626] dark:text-[#EF5B5B] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-[11px] font-semibold text-[#64748B] dark:text-[#8896AB] block mb-1">
                COUNTERPARTY / VENDOR NAME
              </label>
              <input
                type="text"
                placeholder="e.g. Superteam Labs or Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] text-[#101828] dark:text-white focus:outline-none focus:border-[#00A878] text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-[#64748B] dark:text-[#8896AB] block mb-1">
                  CATEGORY
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] text-[#101828] dark:text-white focus:outline-none focus:border-[#00A878] text-xs font-mono"
                >
                  <option value="Contractor">Contractor / Agency</option>
                  <option value="Cloud">Cloud Infrastructure</option>
                  <option value="SaaS">SaaS Subscription</option>
                  <option value="Legal">Legal & Compliance</option>
                  <option value="Logistics">Logistics & Office</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#64748B] dark:text-[#8896AB] block mb-1">
                  WHITELIST STATUS
                </label>
                <select
                  value={approved ? 'true' : 'false'}
                  onChange={(e) => setApproved(e.target.value === 'true')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] text-[#101828] dark:text-white focus:outline-none focus:border-[#00A878] text-xs font-mono"
                >
                  <option value="true">Whitelisted (Autonomous Allowed)</option>
                  <option value="false">Pending Review (Approval Required)</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-[#64748B] dark:text-[#8896AB]">
                  ARC SETTLEMENT WALLET ADDRESS
                </label>
                <button
                  type="button"
                  onClick={handleFillSample}
                  className="text-[10px] text-[#00A878] dark:text-[#35E0B2] hover:underline"
                >
                  Fill Sample
                </button>
              </div>
              <input
                type="text"
                placeholder="0x71C...a492"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] text-[#101828] dark:text-white focus:outline-none focus:border-[#00A878] text-xs font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E2E8F0] dark:border-[#1A2D4C]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#08111F] text-xs font-semibold text-[#64748B] dark:text-[#8896AB] hover:text-[#101828] dark:hover:text-white transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#00A878] hover:bg-[#009166] text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              <span>Add to Whitelist</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
