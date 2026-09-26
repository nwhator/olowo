'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Payment } from '@/types';
import { formatArcTxHash, getArcExplorerUrl } from '@/lib/arc';
import { ArcExplorerModal } from '@/components/arc/ArcExplorerModal';
import {
  CreditCard,
  CheckCircle2,
  ExternalLink,
  Shield,
  Layers,
  ArrowUpRight,
  Filter,
  Loader2,
  Radio,
} from 'lucide-react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterAuth, setFilterAuth] = useState('ALL');
  const [selectedTx, setSelectedTx] = useState<{ hash: string; payment?: Payment } | null>(null);

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/payments');
      const data = await res.json();
      if (data.payments) setPayments(data.payments);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filtered = payments.filter((p) => {
    if (filterAuth === 'ALL') return true;
    return p.authorizationType === filterAuth;
  });

  const totalSettled = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <AppShell
      title="Payments"
      subtitle="Arc network USDC settlement ledger"
      onRefresh={fetchPayments}
    >
      <div className="space-y-8">
        {/* Arc Explorer Modal */}
        <ArcExplorerModal
          isOpen={!!selectedTx}
          onClose={() => setSelectedTx(null)}
          tx={
            selectedTx
              ? {
                  hash: selectedTx.hash,
                  amount: selectedTx.payment?.amount || 0,
                  currency: 'USDC',
                  sender: '0x124089c1b3f9299028',
                  recipient: '0x8892f390021c384110',
                  recipientName: selectedTx.payment?.vendorName,
                  timestamp: selectedTx.payment?.createdAt || new Date().toISOString(),
                  authorizationType: selectedTx.payment?.authorizationType || 'AUTONOMOUS',
                  checksCount: 5,
                }
              : null
          }
        />

        {/* Top Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-xs">
            <div className="text-[11px] font-mono text-[#64748B] dark:text-[#8896AB] uppercase">
              Total Settled Volume
            </div>
            <div className="text-2xl font-bold font-mono text-[#101828] dark:text-white mt-1">
              ${totalSettled.toLocaleString()} <span className="text-xs text-[#00A878] dark:text-[#35E0B2]">USDC</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-xs">
            <div className="text-[11px] font-mono text-[#64748B] dark:text-[#8896AB] uppercase">
              Settlement Network
            </div>
            <div className="text-2xl font-bold font-mono text-[#3B66F5] dark:text-[#4D7CFE] mt-1 flex items-center gap-2">
              <span>Arc</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#3B66F5]/10 border border-[#3B66F5]/30 text-[#3B66F5] dark:text-[#4D7CFE] font-medium">
                Testnet (84532)
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-xs">
            <div className="text-[11px] font-mono text-[#64748B] dark:text-[#8896AB] uppercase">
              Transactions Completed
            </div>
            <div className="text-2xl font-bold font-mono text-[#101828] dark:text-white mt-1">
              {payments.length}
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#101828] dark:text-white uppercase font-mono tracking-tight">
            Settlement Ledger
          </h2>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#64748B] dark:text-[#5E6E85]" />
            <select
              value={filterAuth}
              onChange={(e) => setFilterAuth(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] text-xs text-[#101828] dark:text-white font-mono focus:outline-none focus:border-[#00A878]"
            >
              <option value="ALL">All Authorizations</option>
              <option value="AUTONOMOUS">Autonomous Only</option>
              <option value="HUMAN_APPROVED">Human Approved Only</option>
            </select>
          </div>
        </div>

        {/* Payments Table */}
        <div className="rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] dark:border-[#1A2D4C] bg-[#F8FAFC] dark:bg-[#0A1424] text-[#64748B] dark:text-[#5E6E85] font-mono text-[11px]">
                  <th className="py-3.5 px-6 font-medium">TIMESTAMP</th>
                  <th className="py-3.5 px-6 font-medium">RECIPIENT</th>
                  <th className="py-3.5 px-6 font-medium">INVOICE</th>
                  <th className="py-3.5 px-6 font-medium">AMOUNT</th>
                  <th className="py-3.5 px-6 font-medium">AUTHORIZATION</th>
                  <th className="py-3.5 px-6 font-medium">TRANSACTION HASH</th>
                  <th className="py-3.5 px-6 font-medium text-right">PROOF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1A2D4C]/60 text-[#101828] dark:text-white">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#64748B] dark:text-[#8896AB]">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#00A878] dark:text-[#35E0B2] mb-2" />
                      Loading transactions...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#64748B] dark:text-[#8896AB]">
                      No payments found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((pay) => (
                    <tr key={pay.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#12223B]/60 transition-colors">
                      <td className="py-4 px-6 font-mono text-[#64748B] dark:text-[#8896AB]">
                        {new Date(pay.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        {new Date(pay.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-4 px-6 font-semibold text-[#101828] dark:text-white">
                        {pay.vendorName}
                      </td>
                      <td className="py-4 px-6 font-mono text-[#64748B] dark:text-[#8896AB]">
                        <Link
                          href={`/invoices/${pay.invoiceId}`}
                          className="hover:text-[#00A878] dark:hover:text-[#35E0B2] transition-colors"
                        >
                          {pay.invoiceNumber}
                        </Link>
                      </td>
                      <td className="py-4 px-6 font-mono font-semibold">
                        ${pay.amount.toLocaleString()} <span className="text-[10px] text-[#64748B] dark:text-[#8896AB]">USDC</span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium ${
                            pay.authorizationType === 'AUTONOMOUS'
                              ? 'bg-[#00A878]/10 text-[#00A878] dark:text-[#35E0B2] border border-[#00A878]/20 dark:border-[#35E0B2]/30'
                              : 'bg-[#3B66F5]/10 text-[#3B66F5] dark:text-[#4D7CFE] border border-[#3B66F5]/20 dark:border-[#4D7CFE]/30'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {pay.authorizationType === 'AUTONOMOUS' ? 'Autonomous' : 'Human Approved'}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-[11px]">
                        <button
                          onClick={() => setSelectedTx({ hash: pay.transactionHash, payment: pay })}
                          className="text-[#3B66F5] dark:text-[#4D7CFE] hover:underline flex items-center gap-1.5"
                          title="Click to view verified Arc Testnet receipt"
                        >
                          <Radio className="w-3 h-3 text-[#00A878] dark:text-[#35E0B2]" />
                          <span>{formatArcTxHash(pay.transactionHash)}</span>
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedTx({ hash: pay.transactionHash, payment: pay })}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F1F5F9] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] text-[11px] font-medium text-[#475569] dark:text-[#8896AB] hover:text-[#0F172A] dark:hover:text-white transition-colors"
                        >
                          <span>Proof</span>
                          <ArrowUpRight className="w-3 h-3 text-[#00A878] dark:text-[#35E0B2]" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
