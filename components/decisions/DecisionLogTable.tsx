'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Lock,
  Filter,
  Download,
} from 'lucide-react';
import { AuditEvent } from '@/types';
import { formatArcTxHash, getArcExplorerUrl } from '@/lib/arc';
import { ArcExplorerModal, ArcTxDetails } from '@/components/arc/ArcExplorerModal';
import { playSound } from '@/lib/sound';

interface DecisionLogTableProps {
  events: AuditEvent[];
}

export function DecisionLogTable({ events }: DecisionLogTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [selectedTx, setSelectedTx] = useState<ArcTxDetails | null>(null);

  const filteredEvents = events.filter((ev) => {
    if (filterAction === 'ALL') return true;
    return ev.action === filterAction;
  });

  const handleExportCSV = () => {
    playSound('click');
    const headers = ['Timestamp', 'Action', 'Entity', 'Type', 'Amount (USDC)', 'Decision', 'Authorization', 'Reason', 'Transaction Hash'];
    const rows = filteredEvents.map((e) => [
      e.timestamp,
      e.action,
      `"${e.entity.replace(/"/g, '""')}"`,
      e.entityType,
      e.amount || 0,
      e.decision,
      e.authorization,
      `"${(e.reason || '').replace(/"/g, '""')}"`,
      e.transactionHash || 'N/A',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `olowo_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadge = (action: AuditEvent['action']) => {
    switch (action) {
      case 'PAYMENT_EXECUTED':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00A878]/10 text-[#00A878] dark:bg-[#35E0B2]/10 dark:text-[#35E0B2] border border-[#00A878]/30 dark:border-[#35E0B2]/30">
            PAYMENT EXECUTED
          </span>
        );
      case 'APPROVAL_REQUESTED':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D97706]/10 text-[#D97706] dark:bg-[#F5B942]/10 dark:text-[#F5B942] border border-[#D97706]/30 dark:border-[#F5B942]/30">
            APPROVAL REQUESTED
          </span>
        );
      case 'APPROVAL_GRANTED':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2563EB]/10 text-[#2563EB] dark:bg-[#4D7CFE]/10 dark:text-[#4D7CFE] border border-[#2563EB]/30 dark:border-[#4D7CFE]/30">
            HUMAN APPROVED
          </span>
        );
      case 'APPROVAL_REJECTED':
      case 'PAYMENT_BLOCKED':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#DC2626]/10 text-[#DC2626] dark:bg-[#EF5B5B]/10 dark:text-[#EF5B5B] border border-[#DC2626]/30 dark:border-[#EF5B5B]/30">
            {action === 'PAYMENT_BLOCKED' ? 'PAYMENT BLOCKED' : 'APPROVAL REJECTED'}
          </span>
        );
      case 'OBLIGATION_RESERVED':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2563EB]/10 text-[#2563EB] dark:bg-[#4D7CFE]/10 dark:text-[#4D7CFE] border border-[#2563EB]/30 dark:border-[#4D7CFE]/30">
            OBLIGATION RESERVED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 dark:bg-[#5E6E85]/10 dark:text-[#8896AB] border border-slate-200 dark:border-[#1A2D4C]">
            {action}
          </span>
        );
    }
  };

  return (
    <>
      <ArcExplorerModal
        isOpen={!!selectedTx}
        tx={selectedTx}
        onClose={() => setSelectedTx(null)}
      />

      <div className="rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] overflow-hidden shadow-xs transition-colors">
        {/* Header and Filter */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#1A2D4C] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#08111F]">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#00A878] dark:text-[#35E0B2]" />
            <div>
              <h2 className="text-base font-bold text-[#101828] dark:text-white tracking-tight">OLOWO Decision & Audit Trail</h2>
              <p className="text-xs text-[#64748B] dark:text-[#8896AB]">
                Tamper-evident record of every financial decision, policy evaluation, and Arc settlement
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#94A3B8] dark:text-[#5E6E85]" />
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] text-xs text-[#101828] dark:text-white font-mono font-semibold focus:outline-none focus:border-[#00A878]"
              >
                <option value="ALL">All Actions</option>
                <option value="PAYMENT_EXECUTED">Payments Executed</option>
                <option value="APPROVAL_REQUESTED">Approvals Requested</option>
                <option value="PAYMENT_BLOCKED">Payments Blocked</option>
                <option value="OBLIGATION_RESERVED">Obligations Reserved</option>
              </select>
            </div>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F1F5F9] dark:bg-[#08111F] hover:bg-[#E2E8F0] dark:hover:bg-[#12223B] border border-[#E2E8F0] dark:border-[#1A2D4C] text-xs font-semibold text-[#101828] dark:text-white transition-all shadow-2xs whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-[#00A878] dark:text-[#35E0B2]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] dark:border-[#1A2D4C] bg-[#F8FAFC] dark:bg-[#0A1424] text-[#64748B] dark:text-[#5E6E85] font-mono text-[11px]">
                <th className="py-3.5 px-6 font-semibold">TIMESTAMP</th>
                <th className="py-3.5 px-6 font-semibold">ACTION</th>
                <th className="py-3.5 px-6 font-semibold">ENTITY</th>
                <th className="py-3.5 px-6 font-semibold">AMOUNT</th>
                <th className="py-3.5 px-6 font-semibold">AUTHORIZATION</th>
                <th className="py-3.5 px-6 font-semibold">TRANSACTION</th>
                <th className="py-3.5 px-6 font-semibold text-right">PROOF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] dark:divide-[#1A2D4C]/60 text-[#101828] dark:text-white">
              {filteredEvents.map((ev) => {
                const isExpanded = expandedId === ev.id;
                const dateStr = new Date(ev.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <React.Fragment key={ev.id}>
                    <tr
                      onClick={() => setExpandedId(isExpanded ? null : ev.id)}
                      className="hover:bg-[#F8FAFC] dark:hover:bg-[#12223B]/60 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-6 font-mono text-[#64748B] dark:text-[#8896AB]">
                        {dateStr}
                      </td>
                      <td className="py-4 px-6">
                        {getActionBadge(ev.action)}
                      </td>
                      <td className="py-4 px-6 font-semibold text-[#101828] dark:text-white">
                        {ev.entity}
                      </td>
                      <td className="py-4 px-6 font-mono font-bold">
                        {ev.amount ? `$${ev.amount.toLocaleString()} USDC` : '—'}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`text-[11px] font-mono font-bold ${
                            ev.authorization === 'AUTONOMOUS'
                              ? 'text-[#00A878] dark:text-[#35E0B2]'
                              : ev.authorization === 'HUMAN_APPROVED'
                              ? 'text-[#2563EB] dark:text-[#4D7CFE]'
                              : 'text-[#64748B] dark:text-[#8896AB]'
                          }`}
                        >
                          {ev.authorization}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-[11px] text-[#64748B] dark:text-[#8896AB]">
                        {ev.transactionHash ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTx({
                                hash: ev.transactionHash!,
                                amount: ev.amount || 750,
                                currency: 'USDC',
                                sender: '0x4a92E31Fb2C7D167a58a74e5F31b99b5aC04b7c1',
                                recipient: '0x8f4d92a15c8e31002ba5032a91f42d992a91e4f2',
                                recipientName: ev.entity,
                                timestamp: ev.timestamp,
                                authorizationType: ev.authorization,
                              });
                            }}
                            className="hover:text-[#00A878] dark:hover:text-[#35E0B2] hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>{formatArcTxHash(ev.transactionHash)}</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-[#64748B] group-hover:text-[#101828] dark:text-[#8896AB] dark:group-hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#12223B]">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2]" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Detail Row */}
                    {isExpanded && (
                      <tr className="bg-[#F8FAFC] dark:bg-[#08111F]/80 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
                        <td colSpan={7} className="p-6 space-y-4">
                          <div className="space-y-2">
                            <h4 className="text-[11px] font-mono font-bold text-[#94A3B8] dark:text-[#5E6E85] uppercase tracking-wider">
                              WHY WAS THIS ACTION TAKEN?
                            </h4>
                            <p className="text-xs text-[#101828] dark:text-white/95 leading-relaxed bg-white dark:bg-[#0D192C] p-4 rounded-xl border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-2xs font-mono">
                              {ev.reason}
                            </p>
                          </div>

                          {ev.policyChecks && ev.policyChecks.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-[11px] font-mono font-bold text-[#94A3B8] dark:text-[#5E6E85] uppercase tracking-wider">
                                EVALUATED POLICY CHECKS ({ev.policyChecks.filter((c) => c.passed).length}/{ev.policyChecks.length} Passed)
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {ev.policyChecks.map((chk, i) => (
                                  <div
                                    key={i}
                                    className="p-3 rounded-xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] flex items-start gap-2 shadow-2xs"
                                  >
                                    {chk.passed ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00A878] dark:text-[#35E0B2] shrink-0 mt-0.5" />
                                    ) : (
                                      <XCircle className="w-3.5 h-3.5 text-[#DC2626] dark:text-[#EF5B5B] shrink-0 mt-0.5" />
                                    )}
                                    <div className="text-[11px]">
                                      <span className="font-bold text-[#101828] dark:text-white block">
                                        {chk.label}
                                      </span>
                                      <span className="text-[#64748B] dark:text-[#8896AB] block mt-0.5 text-[10px]">
                                        {chk.details}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
