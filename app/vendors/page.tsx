'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Vendor } from '@/types';
import { formatArcAddress } from '@/lib/arc';
import { playSound } from '@/lib/sound';
import { AddVendorModal } from '@/components/vendors/AddVendorModal';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Wallet,
  Building,
  Loader2,
} from 'lucide-react';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);

  const fetchVendors = async () => {
    try {
      const res = await fetch('/api/vendors');
      const data = await res.json();
      if (data.vendors) setVendors(data.vendors);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleToggleApproval = async (vendor: Vendor) => {
    setUpdatingId(vendor.id);
    playSound('toggle');
    try {
      await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: vendor.id,
          approved: !vendor.approved,
        }),
      });
      await fetchVendors();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AppShell
      title="Vendors Directory"
      subtitle="Approved counterparties, wallet addresses, and risk status"
      onRefresh={fetchVendors}
    >
      <AddVendorModal
        isOpen={isAddVendorOpen}
        onClose={() => setIsAddVendorOpen(false)}
        onVendorAdded={fetchVendors}
      />

      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#101828] dark:text-white tracking-tight">Company Whitelist & Counterparties</h2>
            <p className="text-xs text-[#64748B] dark:text-[#8896AB]">
              OLOWO strictly validates that recipients are whitelisted before autonomous payouts
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] text-[#00A878] dark:text-[#35E0B2] shadow-xs">
              {vendors.filter((v) => v.approved).length} Approved Vendors
            </span>
            <button
              onClick={() => {
                playSound('click');
                setIsAddVendorOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00A878] hover:bg-[#009166] text-white text-xs font-semibold shadow-xs transition-all"
            >
              <span>+ Add Counterparty</span>
            </button>
          </div>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full py-16 flex items-center justify-center text-[#64748B] dark:text-[#8896AB] gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-[#00A878] dark:text-[#35E0B2]" />
              <span className="font-mono text-xs">Loading vendor directory...</span>
            </div>
          ) : (
            vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] p-6 space-y-5 hover:border-[#CBD5E1] dark:hover:border-[#253E68] transition-all flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-[#101828] dark:text-white tracking-tight">
                        {vendor.name}
                      </h3>
                      <span className="text-[11px] font-mono text-[#64748B] dark:text-[#5E6E85]">
                        Category: {vendor.category}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium ${
                        vendor.approved
                          ? 'bg-[#00A878]/10 text-[#00A878] dark:text-[#35E0B2] border border-[#00A878]/20 dark:border-[#35E0B2]/30'
                          : 'bg-[#F59E0B]/10 text-[#B45309] dark:text-[#F5B942] border border-[#F59E0B]/20 dark:border-[#F5B942]/30'
                      }`}
                    >
                      {vendor.approved ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Approved
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3" />
                          Pending Approval
                        </>
                      )}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-[#E2E8F0] dark:border-[#1A2D4C]/60">
                      <span className="text-[#64748B] dark:text-[#8896AB]">Settlement Wallet:</span>
                      <span className="font-mono text-[#101828] dark:text-white/90">
                        {formatArcAddress(vendor.walletAddress)}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-[#E2E8F0] dark:border-[#1A2D4C]/60">
                      <span className="text-[#64748B] dark:text-[#8896AB]">Risk Clearance:</span>
                      <span
                        className={`font-mono font-semibold ${
                          vendor.riskStatus === 'NORMAL'
                            ? 'text-[#00A878] dark:text-[#35E0B2]'
                            : vendor.riskStatus === 'FLAGGED'
                            ? 'text-[#DC2626] dark:text-[#EF5B5B]'
                            : 'text-[#B45309] dark:text-[#F5B942]'
                        }`}
                      >
                        {vendor.riskStatus}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5">
                      <span className="text-[#64748B] dark:text-[#8896AB]">Historical Settlement:</span>
                      <span className="font-mono font-bold text-[#101828] dark:text-white">
                        ${vendor.totalPaid?.toLocaleString() || 0} USDC
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#1A2D4C]">
                  <button
                    onClick={() => handleToggleApproval(vendor)}
                    disabled={updatingId === vendor.id}
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold font-mono transition-all flex items-center justify-center gap-2 ${
                      vendor.approved
                        ? 'bg-[#F8FAFC] dark:bg-[#08111F] hover:bg-[#F1F5F9] dark:hover:bg-[#12223B] border border-[#E2E8F0] dark:border-[#1A2D4C] text-[#DC2626] dark:text-[#EF5B5B]'
                        : 'bg-[#00A878] hover:bg-[#009166] text-white shadow-xs'
                    }`}
                  >
                    {updatingId === vendor.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : vendor.approved ? (
                      'Revoke Whitelist'
                    ) : (
                      'Approve Vendor'
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
