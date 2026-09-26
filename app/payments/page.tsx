'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Payment } from '@/types';
import { formatArcTxHash, getArcExplorerUrl } from '@/lib/arc';
import {
  CreditCard,
  CheckCircle2,
  ExternalLink,
  Shield,
  Layers,
  ArrowUpRight,
  Filter,
  Loader2,
} from 'lucide-react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterAuth, setFilterAuth] = useState('ALL');

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
    <AppShell title="Payments" subtitle="Arc network USDC settlement ledger">
      <div className="space-y-8">
        {/* Top Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-[#0D192C] border border-[#1A2D4C]">
            <div className="text-[11px] font-mono text-[#8896AB] uppercase">
              Total Settled Volume
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              ${totalSettled.toLocaleString()} <span className="text-xs text-[#35E0B2]">USDC</span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#0D192C] border border-[#1A2D4C]">
            <div className="text-[11px] font-mono text-[#8896AB] uppercase">
              Settlement Network
            </div>
            <div className="text-2xl font-bold font-mono text-[#4D7CFE] mt-1 flex items-center gap-2">
              <span>Arc</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#4D7CFE]/10 border border-[#4D7CFE]/30 text-[#4D7CFE] font-medium">
                Testnet
              </span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#0D192C] border border-[#1A2D4C]">
            <div className="text-[11px] font-mono text-[#8896AB] uppercase">
              Transactions Completed
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {payments.length}
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white uppercase font-mono tracking-tight">
            Settlement Ledger
          </h2>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#5E6E85]" />
            <select
              value={filterAuth}
              onChange={(e) => setFilterAuth(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#0D192C] border border-[#1A2D4C] text-xs text-white font-mono focus:outline-none focus:border-[#35E0B2]"
            >
              <option value="ALL">All Authorizations</option>
              <option value="AUTONOMOUS">Autonomous Only</option>
              <option value="HUMAN_APPROVED">Human Approved Only</option>
            </select>
          </div>
        </div>

        {/* Payments Table */}
        <div className="rounded-2xl bg-[#0D192C] border border-[#1A2D4C] overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#1A2D4C] bg-[#0A1424] text-[#5E6E85] font-mono text-[11px]">
                  <th className="py-3.5 px-6 font-medium">TIMESTAMP</th>
                  <th className="py-3.5 px-6 font-medium">RECIPIENT</th>
                  <th className="py-3.5 px-6 font-medium">INVOICE</th>
                  <th className="py-3.5 px-6 font-medium">AMOUNT</th>
                  <th className="py-3.5 px-6 font-medium">AUTHORIZATION</th>
                  <th className="py-3.5 px-6 font-medium">TRANSACTION HASH</th>
                  <th className="py-3.5 px-6 font-medium text-right">PROOF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2D4C]/60 text-white">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#8896AB]">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#35E0B2] mb-2" />
                      Loading transactions...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#8896AB]">
                      No payments found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((pay) => (
                    <tr key={pay.id} className="hover:bg-[#12223B]/60 transition-colors">
                      <td className="py-4 px-6 font-mono text-[#8896AB]">
                        {new Date(pay.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        {new Date(pay.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-4 px-6 font-medium text-white">
                        {pay.vendorName}
                      </td>
                      <td className="py-4 px-6 font-mono text-[#8896AB]">
                        <Link
                          href={`/invoices/${pay.invoiceId}`}
                          className="hover:text-[#35E0B2] transition-colors"
                        >
                          {pay.invoiceNumber}
                        </Link>
                      </td>
                      <td className="py-4 px-6 font-mono font-semibold">
                        ${pay.amount.toLocaleString()} <span className="text-[10px] text-[#8896AB]">USDC</span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium ${
                            pay.authorizationType === 'AUTONOMOUS'
                              ? 'bg-[#35E0B2]/10 text-[#35E0B2] border border-[#35E0B2]/30'
                              : 'bg-[#4D7CFE]/10 text-[#4D7CFE] border border-[#4D7CFE]/30'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {pay.authorizationType === 'AUTONOMOUS' ? 'Autonomous' : 'Human Approved'}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-[11px]">
                        <a
                          href={getArcExplorerUrl(pay.transactionHash)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#8896AB] hover:text-[#35E0B2] hover:underline flex items-center gap-1"
                        >
                          <span>{formatArcTxHash(pay.transactionHash)}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/invoices/${pay.invoiceId}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#08111F] border border-[#1A2D4C] text-[11px] font-medium text-[#8896AB] hover:text-white transition-colors"
                        >
                          <span>Audit</span>
                          <ArrowUpRight className="w-3 h-3 text-[#35E0B2]" />
                        </Link>
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
