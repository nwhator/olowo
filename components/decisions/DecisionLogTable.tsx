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
} from 'lucide-react';
import { AuditEvent } from '@/types';
import { formatArcTxHash, getArcExplorerUrl } from '@/lib/arc';

interface DecisionLogTableProps {
  events: AuditEvent[];
}

export function DecisionLogTable({ events }: DecisionLogTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterAction, setFilterAction] = useState<string>('ALL');

  const filteredEvents = events.filter((ev) => {
    if (filterAction === 'ALL') return true;
    return ev.action === filterAction;
  });

  const getActionBadge = (action: AuditEvent['action']) => {
    switch (action) {
      case 'PAYMENT_EXECUTED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#35E0B2]/10 text-[#35E0B2] border border-[#35E0B2]/30">
            PAYMENT EXECUTED
          </span>
        );
      case 'APPROVAL_REQUESTED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#F5B942]/10 text-[#F5B942] border border-[#F5B942]/30">
            APPROVAL REQUESTED
          </span>
        );
      case 'APPROVAL_GRANTED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#4D7CFE]/10 text-[#4D7CFE] border border-[#4D7CFE]/30">
            HUMAN APPROVED
          </span>
        );
      case 'APPROVAL_REJECTED':
      case 'PAYMENT_BLOCKED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#EF5B5B]/10 text-[#EF5B5B] border border-[#EF5B5B]/30">
            {action === 'PAYMENT_BLOCKED' ? 'PAYMENT BLOCKED' : 'APPROVAL REJECTED'}
          </span>
        );
      case 'OBLIGATION_RESERVED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#4D7CFE]/10 text-[#4D7CFE] border border-[#4D7CFE]/30">
            OBLIGATION RESERVED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#5E6E85]/10 text-[#8896AB] border border-[#1A2D4C]">
            {action}
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl bg-[#0D192C] border border-[#1A2D4C] overflow-hidden">
      {/* Header and Filter */}
      <div className="px-6 py-4 border-b border-[#1A2D4C] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#08111F]">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#35E0B2]" />
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">OLOWO Decision & Audit Trail</h2>
            <p className="text-xs text-[#8896AB]">
              Tamper-evident record of every financial decision, policy evaluation, and Arc settlement
            </p>
          </div>
        </div>

        {/* Action filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#5E6E85]" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-[#0D192C] border border-[#1A2D4C] text-xs text-white font-mono focus:outline-none focus:border-[#35E0B2]"
          >
            <option value="ALL">All Actions</option>
            <option value="PAYMENT_EXECUTED">Payments Executed</option>
            <option value="APPROVAL_REQUESTED">Approvals Requested</option>
            <option value="PAYMENT_BLOCKED">Payments Blocked</option>
            <option value="OBLIGATION_RESERVED">Obligations Reserved</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#1A2D4C] bg-[#0A1424] text-[#5E6E85] font-mono text-[11px]">
              <th className="py-3 px-6 font-medium">TIMESTAMP</th>
              <th className="py-3 px-6 font-medium">ACTION</th>
              <th className="py-3 px-6 font-medium">ENTITY</th>
              <th className="py-3 px-6 font-medium">AMOUNT</th>
              <th className="py-3 px-6 font-medium">AUTHORIZATION</th>
              <th className="py-3 px-6 font-medium">TRANSACTION</th>
              <th className="py-3 px-6 font-medium text-right">PROOF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A2D4C]/60 text-white">
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
                    className="hover:bg-[#12223B]/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6 font-mono text-[#8896AB]">
                      {dateStr}
                    </td>
                    <td className="py-4 px-6">
                      {getActionBadge(ev.action)}
                    </td>
                    <td className="py-4 px-6 font-medium text-white">
                      {ev.entity}
                    </td>
                    <td className="py-4 px-6 font-mono font-semibold">
                      {ev.amount ? `$${ev.amount.toLocaleString()} USDC` : '—'}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[11px] font-mono font-semibold ${
                          ev.authorization === 'AUTONOMOUS'
                            ? 'text-[#35E0B2]'
                            : ev.authorization === 'HUMAN_APPROVED'
                            ? 'text-[#4D7CFE]'
                            : 'text-[#8896AB]'
                        }`}
                      >
                        {ev.authorization}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-[11px] text-[#8896AB]">
                      {ev.transactionHash ? (
                        <a
                          href={getArcExplorerUrl(ev.transactionHash)}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-[#35E0B2] hover:underline flex items-center gap-1"
                        >
                          <span>{formatArcTxHash(ev.transactionHash)}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-[#8896AB] group-hover:text-white p-1 rounded hover:bg-[#12223B]">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#35E0B2]" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Detail Row */}
                  {isExpanded && (
                    <tr className="bg-[#08111F]/80 border-b border-[#1A2D4C]">
                      <td colSpan={7} className="p-6 space-y-4">
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-mono font-semibold text-[#5E6E85] uppercase tracking-wider">
                            WHY WAS THIS ACTION TAKEN?
                          </h4>
                          <p className="text-sm text-white/95 leading-relaxed bg-[#0D192C] p-3.5 rounded-xl border border-[#1A2D4C]">
                            {ev.reason}
                          </p>
                        </div>

                        {ev.policyChecks && ev.policyChecks.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-[11px] font-mono font-semibold text-[#5E6E85] uppercase tracking-wider">
                              EVALUATED POLICY CHECKS ({ev.policyChecks.filter((c) => c.passed).length}/{ev.policyChecks.length} Passed)
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {ev.policyChecks.map((chk, i) => (
                                <div
                                  key={i}
                                  className="p-2.5 rounded-lg bg-[#0D192C] border border-[#1A2D4C] flex items-start gap-2"
                                >
                                  {chk.passed ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#35E0B2] shrink-0 mt-0.5" />
                                  ) : (
                                    <XCircle className="w-3.5 h-3.5 text-[#EF5B5B] shrink-0 mt-0.5" />
                                  )}
                                  <div className="text-[11px]">
                                    <span className="font-semibold text-white block">
                                      {chk.label}
                                    </span>
                                    <span className="text-[#8896AB] block mt-0.5 text-[10px]">
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
  );
}
